from itertools import count
from pydantic import BaseModel, Field, EmailStr, constr
from datetime import datetime
from enum import Enum


class MachineStatus(str, Enum):
    active = "active"
    not_active = "not_active"


class MachineBase(BaseModel):
    name: constr(max_length=10)
    location: str
    email: EmailStr
    number: int
    float_number: float
    enum: MachineStatus


class MachineCreate(MachineBase):
    password: str


class MachineUpdate(MachineBase):
    password: str


class MachineRead(MachineBase):
    id: int
    created_at: datetime
    edited_at: datetime
