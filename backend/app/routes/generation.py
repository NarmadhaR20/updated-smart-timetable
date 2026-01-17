from fastapi import APIRouter, Body, HTTPException
from typing import List, Optional
from app.database import database, common_helper
from app.models import GenerateRequest, TimetableResponse, TimetableSlot
import random

router = APIRouter()

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
PERIODS = 8  # Increased to 8 to accommodate Labs and more subjects

@router.post("/generate", response_model=TimetableResponse)
async def generate_timetable(request: GenerateRequest = Body(...)):
    # 1. Fetch related data
    try:
        # Fetch subjects that match Year/Dept OR are explicitly requested in allocations
        requested_codes = [a['subject_code'] for a in request.subject_allocations if a.get('subject_code')]
        query = {
            "$or": [
                {"department_code": request.department_code, "year": request.year},
                {"code": {"$in": requested_codes}}
            ]
        }
        subjects_cursor = database.subjects.find(query)
        subjects = await subjects_cursor.to_list(length=100)
        
        rooms_cursor = database.rooms.find({})
        rooms = await rooms_cursor.to_list(length=100)
        random.shuffle(rooms) # Shuffle rooms to distribute load better
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Data Fetch Error: {str(e)}")
        
    if not subjects:
        raise HTTPException(status_code=404, detail="No subjects found for this class. Please add subjects first.")
    
    # 2. GLOBAL Conflict Tracking
    # Populate busy status from ALL other classes
    faculty_busy = {day: {p: set() for p in range(1, PERIODS + 1)} for day in DAYS}
    room_busy = {day: {p: set() for p in range(1, PERIODS + 1)} for day in DAYS}

    # Fetch existing timetables to prevent conflicts
    existing_tts_cursor = database.timetables.find({})
    async for tt in existing_tts_cursor:
        # Skip the current class we are generating for (flexible type comparison)
        if (str(tt.get('department_code')) == str(request.department_code) and 
            str(tt.get('year')) == str(request.year) and 
            str(tt.get('class_name')) == str(request.class_name)):
            continue
            
        for slot in tt.get('schedule', []):
            d, p = slot.get('day'), slot.get('period')
            fid, rno = slot.get('faculty_id'), slot.get('room')
            if d in faculty_busy and p in faculty_busy[d]:
                if fid: faculty_busy[d][p].add(fid)
                if rno: room_busy[d][p].add(rno)

    schedule: List[TimetableSlot] = []
    allocation_map = {item['subject_code']: item['faculty_id'] for item in request.subject_allocations}

    async def get_faculty_name(fid):
        from bson import ObjectId
        if not fid: return "TBA"
        try:
            fac = await database.faculty.find_one({"_id": ObjectId(fid)})
            return fac['name'] if fac else "Unknown"
        except: return "TBA"

    # 3. Helper function to check if continuous periods are available
    def can_schedule_block(day, start_period, block_size, fac_id, room_no):
        """Check if a continuous block can be scheduled"""
        # Check if block fits within the day
        if start_period + block_size - 1 > PERIODS:
            return False
        
        # Check for interval/lunch breaks in the middle of the block
        periods_in_block = list(range(start_period, start_period + block_size))
        # Period 3 is interval (after period 2), period 6 is lunch (after period 5)
        # Don't start a block that would span across these
        if 3 in periods_in_block and start_period < 3:
            return False
        if 6 in periods_in_block and start_period < 6:
            return False
        
        # Check faculty and room availability for all periods in block
        for p in periods_in_block:
            if fac_id and fac_id in faculty_busy[day][p]:
                return False
            if room_no in room_busy[day][p]:
                return False
        
        return True
    
    def schedule_block(day, start_period, block_size, sub, fac_id, fac_name, room_no):
        """Schedule a continuous block and update busy tracking"""
        for i in range(block_size):
            p = start_period + i
            slot_entry = TimetableSlot(
                day=day, period=p, subject=sub['name'], subject_code=sub['code'],
                faculty=fac_name, faculty_id=fac_id,
                room=room_no, type=sub['type']
            )
            schedule.append(slot_entry)
            if fac_id:
                faculty_busy[day][p].add(fac_id)
            room_busy[day][p].add(room_no)
    
    # 4. Separate subjects by type
    lab_subjects = [s for s in subjects if s['type'] == 'Lab']
    theory_subjects = [s for s in subjects if s['type'] != 'Lab']
    
    # 5. Schedule LAB subjects first with continuous blocks
    for lab in lab_subjects:
        weekly_hours = lab.get('weekly_hours', 3)
        sub_code = lab['code']
        fac_id = allocation_map.get(sub_code)
        fac_name = await get_faculty_name(fac_id)
        
        # Determine block patterns based on weekly hours
        if weekly_hours == 3:
            block_patterns = [[3], [2]]  # Prefer 3-hour block, fallback to 2
        elif weekly_hours == 4:
            block_patterns = [[4], [2, 2], [3]]  # Prefer 4-hour, then 2+2, then 3
        elif weekly_hours == 5:
            block_patterns = [[3, 2], [2, 3], [4]]  # Prefer 3+2, then 2+3, then 4
        else:
            block_patterns = [[2]]  # Fallback for other hours
        
        hours_scheduled = 0
        days_used = []
        attempts = 0
        max_attempts = 200
        
        # Try each block pattern
        for pattern in block_patterns:
            if hours_scheduled >= weekly_hours:
                break
            
            # Try to schedule each block in the pattern
            for block_size in pattern:
                if hours_scheduled >= weekly_hours:
                    break
                
                block_scheduled = False
                attempts = 0
                
                while not block_scheduled and attempts < max_attempts:
                    attempts += 1
                    
                    # Pick a random day (prefer days not yet used)
                    available_days = [d for d in DAYS if d not in days_used]
                    if not available_days:
                        available_days = DAYS  # Reuse days if necessary
                    day = random.choice(available_days)
                    
                    # Try random starting periods
                    # Avoid starting at period 2, 5, or 8 (before breaks)
                    valid_starts = [p for p in range(1, PERIODS - block_size + 2) 
                                   if p not in [2, 5, 8]]
                    if not valid_starts:
                        continue
                    
                    start_period = random.choice(valid_starts)
                    
                    # Find an available lab room
                    for room in rooms:
                        if can_schedule_block(day, start_period, block_size, fac_id, room['room_no']):
                            schedule_block(day, start_period, block_size, lab, fac_id, fac_name, room['room_no'])
                            hours_scheduled += block_size
                            if day not in days_used:
                                days_used.append(day)
                            block_scheduled = True
                            break
                    
                    if block_scheduled:
                        break
    
    # 6. Schedule THEORY subjects (existing logic)
    for sub in theory_subjects:
        needed_hours = sub.get('weekly_hours', 3)
        sub_code = sub['code']
        fac_id = allocation_map.get(sub_code)
        fac_name = await get_faculty_name(fac_id)
        
        assigned_count = 0
        attempts = 0
        
        while assigned_count < needed_hours and attempts < 500:
            attempts += 1
            day = random.choice(DAYS)
            period = random.randint(1, PERIODS)
            
            # Avoid scheduling during interval/lunch
            if period in [3, 6]:
                continue
            
            # Check faculty and room availability
            is_free = True
            selected_room = None
            
            # Find available room
            for r in rooms:
                if r['room_no'] not in room_busy[day][period]:
                    selected_room = r
                    break
            
            if not selected_room:
                continue
            
            # Check faculty availability
            if fac_id and fac_id in faculty_busy[day][period]:
                is_free = False
            
            if is_free:
                # Schedule single period
                slot_entry = TimetableSlot(
                    day=day, period=period, subject=sub['name'], subject_code=sub_code,
                    faculty=fac_name, faculty_id=fac_id,
                    room=selected_room['room_no'], type=sub['type']
                )
                schedule.append(slot_entry)
                if fac_id:
                    faculty_busy[day][period].add(fac_id)
                room_busy[day][period].add(selected_room['room_no'])
                assigned_count += 1

    # 4. Save to DB
    timetable_doc = {
        "department_code": request.department_code,
        "year": request.year,
        "semester": request.semester,
        "class_name": request.class_name,
        "schedule": [s.dict() for s in schedule],
        "created_at": "now"
    }
    
    await database.timetables.update_one(
        {"department_code": request.department_code, "year": request.year, "class_name": request.class_name},
        {"$set": timetable_doc},
        upsert=True
    )

    return TimetableResponse(department=request.department_code, semester=request.semester, schedule=schedule)

@router.post("/save", response_model=TimetableResponse)
async def save_timetable(request: dict = Body(...)):
    # Simple endpoint to directly save a manually edited timetable
    # Validation could be added here similar to generate_timetable
    doc = {
        "department_code": request.get("department_code"),
        "year": request.get("year"),
        "semester": request.get("semester"),
        "class_name": request.get("class_name"),
        "schedule": request.get("schedule"),
        "updated_at": "now"
    }
    await database.timetables.update_one(
        {"department_code": doc["department_code"], "year": doc["year"], "class_name": doc["class_name"]},
        {"$set": doc},
        upsert=True
    )
    return TimetableResponse(
        department=doc["department_code"], semester=doc["semester"],
        schedule=[TimetableSlot(**s) for s in doc["schedule"]]
    )

@router.get("/timetable", response_model=TimetableResponse)
async def get_timetable(department_code: str, semester: int, year: Optional[int] = None, class_name: Optional[str] = None):
    query = {"department_code": department_code}
    if semester: query["semester"] = semester
    if year: query["year"] = year
    if class_name: query["class_name"] = class_name

    doc = await database.timetables.find_one(query)
    if not doc:
        return TimetableResponse(department=department_code, semester=semester or 0, schedule=[])
        
    return TimetableResponse(
        department=doc["department_code"],
        semester=doc.get("semester", 0),
        schedule=[TimetableSlot(**s) for s in doc["schedule"]]
    )
