from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional

# --- Authentication ---
class UserSchema(BaseModel):
    username: str = Field(...)
    password: str = Field(...)
    role: str = Field(default="admin") # "admin" or "faculty"
    email: Optional[EmailStr] = None

    class Config:
        json_schema_extra = {
            "example": {
                "username": "admin",
                "password": "password123",
                "role": "admin",
                "email": "admin@example.com"
            }
        }


# --- Orodha System Models (Restructured) ---

class Department(BaseModel):
    name: str = Field(..., description="e.g. Computer Science")
    code: str = Field(..., description="e.g. CS")
    semesters: List[int] = Field(..., description="e.g. [1, 2, 3, 4, 5, 6, 7, 8]")

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Computer Science",
                "code": "CS",
                "semesters": [1, 2, 3, 4, 5, 6, 7, 8]
            }
        }

class Subject(BaseModel):
    name: str = Field(..., description="e.g. Data Structures")
    code: str = Field(..., description="e.g. CS201")
    type: str = Field(..., description="Theory or Lab")
    weekly_hours: int = Field(..., gt=0)
    department_code: str = Field(..., description="Link to Department")
    semester: int = Field(...)

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Data Structures",
                "code": "CS201",
                "type": "Theory",
                "weekly_hours": 3,
                "department_code": "CS",
                "semester": 3
            }
        }

class Faculty(BaseModel):
    name: str = Field(...)
    email: EmailStr = Field(...)
    designation: str = Field(...)
    department_code: str = Field(...)
    qualified_subjects: List[str] = Field(..., description="List of Subject Codes they can teach")
    max_load_per_week: int = Field(default=12)

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Dr. Smith",
                "email": "smith@uni.edu",
                "designation": "Professor",
                "department_code": "CS",
                "qualified_subjects": ["CS201", "CS205"],
                "max_load_per_week": 10
            }
        }

# Simplified Room Model
class Room(BaseModel):
    room_no: str
    capacity: int
    type: str = Field(default="Lecture Hall") # Lecture Hall or Lab

# Timetable Generation Request (From Faculty Dashboard)
class GenerateRequest(BaseModel):
    department_code: str
    semester: int
    subject_allocations: List[dict] # [{"subject_code": "CS101", "faculty_id": "..."}]

# Timetable Result Structure
class TimetableSlot(BaseModel):
    day: str
    period: int # 1 to 9
    subject: str
    faculty: str
    room: str
    type: str

class TimetableResponse(BaseModel):
    department: str
    semester: int
    schedule: List[TimetableSlot]

