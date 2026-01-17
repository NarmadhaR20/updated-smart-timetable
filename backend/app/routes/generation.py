from fastapi import APIRouter, Body, HTTPException
from typing import List
from app.database import database, common_helper
from app.models import GenerateRequest, TimetableResponse, TimetableSlot
import random

router = APIRouter()

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
PERIODS = 9  # 9 Periods per day

@router.post("/generate", response_model=TimetableResponse)
async def generate_timetable(request: GenerateRequest = Body(...)):
    # 1. Fetch related data
    try:
        query = {"department_code": request.department_code}
        if request.semester:
            query["semester"] = request.semester
            
        subjects_cursor = database.subjects.find(query)
        subjects = await subjects_cursor.to_list(length=100)
        
        rooms_cursor = database.rooms.find({})
        rooms = await rooms_cursor.to_list(length=100)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Data Fetch Error: {str(e)}")

    if not subjects:
        raise HTTPException(status_code=404, detail="No subjects found for this Department/Semester. Please ask Admin to add subjects.")
    
    # 2. Prepare Generation Data
    schedule: List[TimetableSlot] = []
    
    # Map allocations
    allocation_map = {item['subject_code']: item['faculty_id'] for item in request.subject_allocations}

    # Helper to get Faculty Name
    async def get_faculty_name(fid):
        from bson import ObjectId
        if not fid: return "TBA"
        fac = await database.faculty.find_one({"_id": ObjectId(fid)})
        return fac['name'] if fac else "Unknown"

    # 3. Simple Greedy/Randomized Scheduling Algorithm (Constraint Based)
    # Constraints to check:
    # - Faculty not double booked
    # - Room not double booked
    # - Subject not > 1 per day (if possible)
    
    faculty_busy = {day: {p: set() for p in range(1, PERIODS + 1)} for day in DAYS}
    room_busy = {day: {p: set() for p in range(1, PERIODS + 1)} for day in DAYS}
    
    # Sort subjects: Labs first (they usually need 2-3 slots), then Theory
    sorted_subjects = sorted(subjects, key=lambda x: (x['type'] != 'Lab', -x['weekly_hours']))

    for sub in sorted_subjects:
        needed_hours = sub['weekly_hours']
        sub_code = sub['code']
        fac_id = allocation_map.get(sub_code)
        fac_name = await get_faculty_name(fac_id)
        
        assigned_count = 0
        attempts = 0
        
        while assigned_count < needed_hours and attempts < 1000:
            attempts += 1
            day = random.choice(DAYS)
            period = random.randint(1, PERIODS)
            
            # Constraint: Labs need consecutive slots (e.g., 3 hours)
            slots_needed = 3 if sub['type'] == 'Lab' else 1
            if period + slots_needed - 1 > PERIODS: continue

            # Check availability for all needed slots
            is_free = True
            selected_room = None
            
            # Find a room
            # For simplicity, assign first available room that fits type
            # In real CSP, we'd backtrack. Here we do randomized greedy.
            possible_rooms = [r for r in rooms] # Filter by type if data allowed
            if not possible_rooms:
                selected_room = {"name": "Room 101"} # Fallback
            else:
                for r in possible_rooms:
                    room_free = True
                    for i in range(slots_needed):
                        p = period + i
                        if r['name'] in room_busy[day][p]: 
                            room_free = False; break
                    if room_free:
                        selected_room = r; break
            
            if not selected_room: continue

            # Check Faculty & Room availability
            for i in range(slots_needed):
                p = period + i
                if fac_id and fac_id in faculty_busy[day][p]: is_free = False
                
            if is_free:
                # Assign
                for i in range(slots_needed):
                    p = period + i
                    slot_entry = TimetableSlot(
                        day=day,
                        period=p,
                        subject=sub['name'],
                        faculty=fac_name,
                        room=selected_room['name'],
                        type=sub['type']
                    )
                    schedule.append(slot_entry)
                    if fac_id: faculty_busy[day][p].add(fac_id)
                    room_busy[day][p].add(selected_room['name'])
                
                assigned_count += slots_needed

    # 4. Save to DB
    timetable_doc = {
        "department_code": request.department_code,
        "semester": request.semester,
        "schedule": [s.dict() for s in schedule],
        "created_at": "now" # In real app use datetime
    }
    
    # Upsert (Replace existing for this dept/sem)
    await database.timetables.update_one(
        {"department_code": request.department_code, "semester": request.semester},
        {"$set": timetable_doc},
        upsert=True
    )

    return TimetableResponse(
        department=request.department_code,
        semester=request.semester,
        schedule=schedule
    )

@router.get("/timetable", response_model=TimetableResponse)
async def get_timetable(department_code: str, semester: int):
    # Retrieve saved timetable
    doc = await database.timetables.find_one({"department_code": department_code, "semester": semester})
    
    if not doc:
        return TimetableResponse(department=department_code, semester=semester, schedule=[])
        
    return TimetableResponse(
        department=doc["department_code"],
        semester=doc["semester"],
        schedule=doc["schedule"]
    )
