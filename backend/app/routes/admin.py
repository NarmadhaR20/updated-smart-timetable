from fastapi import APIRouter, Body, HTTPException
from typing import List
from app.database import database, common_helper
from app.models import Department, Subject, Faculty, Room
from bson import ObjectId

router = APIRouter()

# --- Departments ---
@router.post("/departments", response_description="Add new department")
async def add_department(department: Department = Body(...)):
    dept_data = department.dict()
    new_dept = await database.departments.insert_one(dept_data)
    created_dept = await database.departments.find_one({"_id": new_dept.inserted_id})
    return common_helper(created_dept)

@router.get("/departments", response_model=List[dict])
async def get_departments():
    departments = []
    async for dept in database.departments.find():
        departments.append(common_helper(dept))
    return departments

@router.put("/departments/{id}", response_description="Update a department")
async def update_department(id: str, department: Department = Body(...)):
    dept_data = department.dict()
    if len(dept_data) < 1:
        raise HTTPException(status_code=400, detail="No data provided")
    
    update_result = await database.departments.update_one({"_id": ObjectId(id)}, {"$set": dept_data})
    
    if update_result.modified_count == 1:
        return {"message": "Department updated successfully"}
    
    existing = await database.departments.find_one({"_id": ObjectId(id)})
    if existing:
        return {"message": "No changes made"}
        
    raise HTTPException(status_code=404, detail=f"Department {id} not found")

@router.delete("/departments/{id}", response_description="Delete a department")
async def delete_department(id: str):
    delete_result = await database.departments.delete_one({"_id": ObjectId(id)})
    if delete_result.deleted_count == 1:
        return {"message": "Department deleted"}
    raise HTTPException(status_code=404, detail="Department not found")

# --- Subjects ---
@router.post("/subjects", response_description="Add new subject")
async def add_subject(subject: Subject = Body(...)):
    subject_data = subject.dict()
    new_subject = await database.subjects.insert_one(subject_data)
    created_subject = await database.subjects.find_one({"_id": new_subject.inserted_id})
    return common_helper(created_subject)

@router.get("/subjects", response_model=List[dict])
async def get_subjects(department_code: str = None):
    subjects = []
    query = {}
    if department_code:
        query["department_code"] = department_code
    
    async for sub in database.subjects.find(query):
        subjects.append(common_helper(sub))
    return subjects

@router.put("/subjects/{id}", response_description="Update a subject")
async def update_subject(id: str, subject: Subject = Body(...)):
    sub_data = subject.dict()
    if len(sub_data) < 1:
        raise HTTPException(status_code=400, detail="No data provided")
    
    update_result = await database.subjects.update_one({"_id": ObjectId(id)}, {"$set": sub_data})
    
    if update_result.modified_count == 1:
        return {"message": "Subject updated successfully"}
        
    existing = await database.subjects.find_one({"_id": ObjectId(id)})
    if existing:
        return {"message": "No changes made"}
        
    raise HTTPException(status_code=404, detail=f"Subject {id} not found")

@router.delete("/subjects/{id}", response_description="Delete a subject")
async def delete_subject(id: str):
    delete_result = await database.subjects.delete_one({"_id": ObjectId(id)})
    if delete_result.deleted_count == 1:
        return {"message": "Subject deleted"}
    raise HTTPException(status_code=404, detail="Subject not found")

# --- Faculty ---
@router.post("/faculty", response_description="Add new faculty")
async def add_faculty(faculty: Faculty = Body(...)):
    faculty_data = faculty.dict()
    new_faculty = await database.faculty.insert_one(faculty_data)
    created_faculty = await database.faculty.find_one({"_id": new_faculty.inserted_id})
    return common_helper(created_faculty)

@router.get("/faculty", response_model=List[dict])
async def get_faculty(department_code: str = None):
    faculty_list = []
    query = {}
    if department_code:
        query["department_code"] = department_code

    async for fac in database.faculty.find(query):
        faculty_list.append(common_helper(fac))
    return faculty_list

@router.put("/faculty/{id}", response_description="Update faculty")
async def update_faculty(id: str, faculty: Faculty = Body(...)):
    fac_data = faculty.dict()
    if len(fac_data) < 1:
        raise HTTPException(status_code=400, detail="No data provided")
    
    update_result = await database.faculty.update_one({"_id": ObjectId(id)}, {"$set": fac_data})
    
    if update_result.modified_count == 1:
        return {"message": "Faculty updated successfully"}
        
    existing = await database.faculty.find_one({"_id": ObjectId(id)})
    if existing:
        return {"message": "No changes made"}
        
    raise HTTPException(status_code=404, detail=f"Faculty {id} not found")

@router.delete("/faculty/{id}", response_description="Delete faculty")
async def delete_faculty(id: str):
    delete_result = await database.faculty.delete_one({"_id": ObjectId(id)})
    if delete_result.deleted_count == 1:
        return {"message": "Faculty deleted"}
    raise HTTPException(status_code=404, detail="Faculty not found")

# --- Rooms ---
@router.post("/rooms", response_description="Add new room")
async def add_room(room: Room = Body(...)):
    room_data = room.dict()
    new_room = await database.rooms.insert_one(room_data)
    created_room = await database.rooms.find_one({"_id": new_room.inserted_id})
    return common_helper(created_room)

@router.get("/rooms", response_model=List[dict])
async def get_rooms():
    rooms = []
    async for room in database.rooms.find():
        rooms.append(common_helper(room))
    return rooms

@router.delete("/rooms/{id}", response_description="Delete room")
async def delete_room(id: str):
    delete_result = await database.rooms.delete_one({"_id": ObjectId(id)})
    if delete_result.deleted_count == 1:
        return {"message": "Room deleted"}
    raise HTTPException(status_code=404, detail="Room not found")
