import motor.motor_asyncio
import os
import asyncio
from dotenv import load_dotenv

async def main():
    load_dotenv()
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    client = motor.motor_asyncio.AsyncIOMotorClient(mongo_uri)
    db = client.smart_timetable
    
    rooms = await db.rooms.find({}).to_list(200)
    print(f"Total Rooms: {len(rooms)}")
    for r in rooms:
        print(f" - {r.get('room_no')} ({r.get('type')})")

if __name__ == "__main__":
    asyncio.run(main())
