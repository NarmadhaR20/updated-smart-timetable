from fastapi import APIRouter, Body, HTTPException
from app.database import database
from app.models import RoomSchema
from bson import ObjectId

router = APIRouter()

@router.post("/", response_description="Add new room")
async def add_room(room: RoomSchema = Body(...)):
    room_data = room.dict()
    new_room = await database.rooms.insert_one(room_data)
    return {"message": "Room added successfully", "id": str(new_room.inserted_id)}

@router.get("/", response_description="List all rooms")
async def list_rooms():
    rooms = await database.rooms.find().to_list(1000)
    for r in rooms:
        r["id"] = str(r["_id"])
        del r["_id"]
    return rooms

@router.put("/{id}", response_description="Update a room")
async def update_room(id: str, room: RoomSchema = Body(...)):
    room_data = room.dict()
    if len(room_data) < 1:
        raise HTTPException(status_code=400, detail="No data provided")
    
    update_result = await database.rooms.update_one({"_id": ObjectId(id)}, {"$set": room_data})
    
    if update_result.modified_count == 1:
        return {"message": "Room updated successfully"}
    
    # Check if it existed but nothing changed
    existing = await database.rooms.find_one({"_id": ObjectId(id)})
    if existing:
        return {"message": "No changes made"}
        
    raise HTTPException(status_code=404, detail=f"Room {id} not found")

@router.delete("/{id}", response_description="Delete a room")
async def delete_room(id: str):
    delete_result = await database.rooms.delete_one({"_id": ObjectId(id)})
    
    if delete_result.deleted_count == 1:
        return {"message": "Room deleted successfully"}
        
    raise HTTPException(status_code=404, detail=f"Room {id} not found")
