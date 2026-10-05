
from datetime import date, time
from uuid import UUID

from pydantic import BaseModel, EmailStr


# ==========================================
# USER REGISTER
# ==========================================

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


# ==========================================
# LOGIN
# ==========================================

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ==========================================
# CREATE APPOINTMENT
# ==========================================

class AppointmentCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    service: str
    date: date
    time: time


# ==========================================
# APPOINTMENT RESPONSE
# ==========================================

class AppointmentResponse(BaseModel):
    id: UUID
    user_id: int
    name: str
    email: str
    phone: str
    service: str
    date: date
    time: time
    status: str

    class Config:
        from_attributes = True

