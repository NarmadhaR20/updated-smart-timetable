import motor.motor_asyncio
import os
import asyncio
from dotenv import load_dotenv
from bson import ObjectId

async def main():
    load_dotenv()
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    client = motor.motor_asyncio.AsyncIOMotorClient(mongo_uri)
    db_names = await client.list_database_names()
    print(f"Databases: {db_names}")
    db_name = "smart_timetable"
    db = client[db_name]
    coll_names = await db.list_collection_names()
    print(f"Collections in {db_name}: {coll_names}")
    
    # 1. Target Slots
    slots = [('Friday', 6), ('Saturday', 6), ('Thursday', 5)]
    # Filter for DM primary faculty busy status
    
    room_busy = {day: {p: set() for p in range(1, 8)} for day in ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]}
    
    tts = await db.timetables.find({}).to_list(1000)
    for tt in tts:
        if str(tt.get('year')) == '2' and tt.get('class_name') == 'B': continue
        for s in tt.get('schedule', []):
            d, p = s.get('day'), s.get('period')
            rno = s.get('room')
            if d in room_busy and p in room_busy[d] and rno:
                room_busy[d][p].add(rno)
            fid = s.get('faculty_id')
            if d in faculty_busy and p in faculty_busy[d] and fid:
                faculty_busy[d][p].add(fid)

    target_fid = '60cf5c27a66691c1c7db8ddb' # Ms.S.Annapoorani ID found from previous run
    for d, p in slots:
        print(f"Slot: {d} Period {p}")
        if target_fid in faculty_busy[d][p]:
            print(f" - Ms.S.Annapoorani is BUSY.")
        else:
            print(f" - Ms.S.Annapoorani is FREE.")
        print()

if __name__ == "__main__":
    asyncio.run(main())
