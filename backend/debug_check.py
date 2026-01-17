import asyncio
from app.database import database

async def check():
    subjects = await database.subjects.find({"department_code": "IT", "year": 1}).to_list(100)
    for s in subjects:
        print(f"Code: {s.get('code')}, Name: {s.get('name')}, Type: {s.get('type')}, Hours: {s.get('weekly_hours')}")

if __name__ == "__main__":
    asyncio.run(check())
