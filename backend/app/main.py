from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from app.database import database

load_dotenv()

app = FastAPI(title="Smart Timetable Generator API", version="1.0.0")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    try:
        # Send a ping to confirm a successful connection
        await database.command('ping')
        print("✅ MongoDB Connected Successfully!")
    except Exception as e:
        print(f"❌ MongoDB Connection Failed: {e}")

@app.get("/")
async def root():
    return {"message": "Smart Timetable Generator API is Running"}

from app.routes import admin, auth, generation

# Auth Routes
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])

# Admin Routes (New Structure)
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])

# Faculty/Generation Routes
app.include_router(generation.router, prefix="/api/generation", tags=["Generation"])
