from sqlmodel import SQLModel, Field
from datetime import datetime
from backend.models.machine import MachineStatus
from typing import Optional


class Machine(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str = Field(max_length=10, index=True)
    location: str
    email: str
    number: int
    float_number: float
    enum: MachineStatus
    created_at: datetime = Field(default_factory=datetime.now)
    edited_at: datetime = Field(default_factory=datetime.now)
    password: str