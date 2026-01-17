from fastapi import APIRouter, Body
from app.database import database
from app.models import LectureSchema

router = APIRouter()

@router.post("/", response_description="Add new lecture")
async def add_lecture(lecture: LectureSchema = Body(...)):
    lecture_data = lecture.dict()
    new_lecture = await database.lectures.insert_one(lecture_data)
    return {"message": "Lecture added successfully", "id": str(new_lecture.inserted_id)}

@router.get("/", response_description="List all lectures")
async def list_lectures():
    lectures = await database.lectures.find().to_list(1000)
    for l in lectures:
        l["id"] = str(l["_id"])
        del l["_id"]
    return lectures
