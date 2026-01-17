import os
import motor.motor_asyncio
from dotenv import load_dotenv

load_dotenv()

# MongoDB Connection
# Default is local, but User will paste Cloud URI here in .env
MONGO_DETAILS = os.getenv("MONGO_URI", "mongodb://localhost:27017")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)

database = client.smart_timetable

# Helpers
def common_helper(entity) -> dict:
    return {
        "id": str(entity["_id"]),
        **{k: v for k, v in entity.items() if k != "_id"}
    }
