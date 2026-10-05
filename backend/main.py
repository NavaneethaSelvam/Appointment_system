from uuid import UUID

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from appointments.models import User, Appointment

from schemas import (
    RegisterRequest,
    LoginRequest,
    AppointmentCreate,
    AppointmentResponse
)

from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_admin
)


# ==================================================
# CREATE DATABASE TABLES
# ==================================================

Base.metadata.create_all(bind=engine)


# ==================================================
# FASTAPI APP
# ==================================================

app = FastAPI(
    title="AppointEase API",
    description="Simple Appointment Record System API",
    version="1.0.0"
)


# ==================================================
# CORS
# ==================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================================================
# ROOT
# ==================================================

@app.get("/")
def root():
    return {
        "message": "AppointEase FastAPI Backend is running"
    }


# ==================================================
# REGISTER
# ==================================================

@app.post("/api/register")
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db)
):

    existing_user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    user = User(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
        role="user"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "Registration successful",
        "user_id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    }


# ==================================================
# USER LOGIN
# ==================================================

@app.post("/api/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token(
        {
            "user_id": user.id,
            "role": user.role
        }
    )

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    }


# ==================================================
# ADMIN LOGIN
# ==================================================

@app.post("/api/admin/login")
def admin_login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    if not verify_password(
        data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token(
        {
            "user_id": user.id,
            "role": user.role
        }
    )

    return {
        "message": "Admin login successful",
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    }


# ==================================================
# CREATE APPOINTMENT
# USER LOGIN NOT REQUIRED
# ==================================================

@app.post(
    "/api/appointments",
    response_model=AppointmentResponse
)
def create_appointment(
    data: AppointmentCreate,
    db: Session = Depends(get_db)
):

    # ----------------------------------------------
    # FIND DEFAULT GUEST USER
    # ----------------------------------------------

    guest_user = (
        db.query(User)
        .filter(User.email == "guest@appointEase.local")
        .first()
    )

    # ----------------------------------------------
    # CREATE GUEST USER IF NOT EXISTS
    # ----------------------------------------------

    if not guest_user:

        guest_user = User(
            name="Guest User",
            email="guest@appointEase.local",
            password_hash=hash_password("guest@123"),
            role="user"
        )

        db.add(guest_user)
        db.commit()
        db.refresh(guest_user)

    # ----------------------------------------------
    # CREATE APPOINTMENT
    # ----------------------------------------------

    appointment = Appointment(
        user_id=guest_user.id,
        name=data.name,
        email=data.email,
        phone=data.phone,
        service=data.service,
        date=data.date,
        time=data.time,
        status="Pending"
    )

    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    return appointment


# ==================================================
# GET USER APPOINTMENTS
# ==================================================

@app.get(
    "/api/appointments/{user_id}",
    response_model=list[AppointmentResponse]
)
def get_user_appointments(
    user_id: int,
    db: Session = Depends(get_db)
):

    appointments = (
        db.query(Appointment)
        .filter(
            Appointment.user_id == user_id
        )
        .order_by(
            Appointment.date,
            Appointment.time
        )
        .all()
    )

    return appointments


# ==================================================
# DELETE APPOINTMENT
# ==================================================

@app.delete(
    "/api/appointments/{appointment_id}"
)
def delete_appointment(
    appointment_id: UUID,
    db: Session = Depends(get_db)
):

    appointment = (
        db.query(Appointment)
        .filter(
            Appointment.id == appointment_id
        )
        .first()
    )

    if not appointment:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found"
        )

    db.delete(appointment)
    db.commit()

    return {
        "message": "Appointment deleted successfully"
    }


# ==================================================
# ADMIN - GET ALL USERS
# ==================================================

@app.get("/api/admin/users")
def get_all_users(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):

    users = (
        db.query(User)
        .order_by(User.id)
        .all()
    )

    return users


# ==================================================
# ADMIN - GET ALL APPOINTMENTS
# ==================================================

@app.get("/api/admin/appointments")
def get_all_appointments(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):

    appointments = (
        db.query(Appointment)
        .order_by(
            Appointment.date,
            Appointment.time
        )
        .all()
    )

    return appointments


# ==================================================
# ADMIN - UPDATE APPOINTMENT STATUS
# ==================================================

@app.put(
    "/api/admin/appointments/{appointment_id}/status"
)
def update_appointment_status(
    appointment_id: UUID,
    status: str,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):

    # ----------------------------------------------
    # ALLOWED STATUSES
    # ----------------------------------------------

    allowed_statuses = [
        "Pending",
        "Accepted",
        "Completed",
        "Cancelled"
    ]

    # ----------------------------------------------
    # VALIDATE STATUS
    # ----------------------------------------------

    if status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid status. "
                "Use Pending, Accepted, "
                "Completed or Cancelled."
            )
        )

    # ----------------------------------------------
    # FIND APPOINTMENT
    # ----------------------------------------------

    appointment = (
        db.query(Appointment)
        .filter(
            Appointment.id == appointment_id
        )
        .first()
    )

    if not appointment:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found"
        )

    # ----------------------------------------------
    # UPDATE STATUS
    # ----------------------------------------------

    appointment.status = status

    db.commit()
    db.refresh(appointment)

    return {
        "message": "Appointment status updated successfully",
        "appointment_id": str(appointment.id),
        "status": appointment.status
    }