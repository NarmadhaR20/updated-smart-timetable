from fastapi import APIRouter, Body
from app.database import database
from app.models import TutorSchema

router = APIRouter()

@router.post("/", response_description="Add new tutor")
async def add_tutor(tutor: TutorSchema = Body(...)):
    tutor_data = tutor.dict()
    new_tutor = await database.tutors.insert_one(tutor_data)
    return {"message": "Tutor added successfully", "id": str(new_tutor.inserted_id)}

@router.get("/", response_description="List all tutors")
async def list_tutors():
    tutors = await database.tutors.find().to_list(1000)
    # Convert ObjectId to string for JSON serialization
    for t in tutors:
        t["id"] = str(t["_id"])
        del t["_id"]
    return tutors
