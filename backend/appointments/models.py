
import uuid

from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from database import Base


# ==========================================
# USER
# ==========================================

class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(150),
        unique=True,
        nullable=False,
        index=True
    )

    password_hash = Column(
        String(255),
        nullable=False
    )

    role = Column(
        String(20),
        default="user"
    )

    appointments = relationship(
        "Appointment",
        back_populates="user",
        cascade="all, delete"
    )


# ==========================================
# APPOINTMENT
# ==========================================

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(150),
        nullable=False
    )

    phone = Column(
        String(20),
        nullable=False
    )

    service = Column(
        String(150),
        nullable=False
    )

    date = Column(
        Date,
        nullable=False
    )

    time = Column(
        Time,
        nullable=False
    )

    status = Column(
        String(30),
        default="Pending",
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="appointments"
    )

