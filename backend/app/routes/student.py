from fastapi import APIRouter

router = APIRouter()

@router.get("/timetable")
async def get_timetable():
    return {"message": "Public Timetable View"}
