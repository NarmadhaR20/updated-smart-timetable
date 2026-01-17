from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_faculty_dashboard():
    return {"message": "Faculty Dashboard"}
