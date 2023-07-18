from itertools import count
from pydantic import BaseModel, Field, EmailStr, constr
from datetime import datetime
from enum import Enum


class MachineStatus(str, Enum):
    active = "active"
    not_active = "not_active"


class Machine(BaseModel):
    id: int = Field(default_factory=lambda: next(count(start=1)), alias="_id")
    name: constr(max_length=10)
    location: str
    email: EmailStr
    number: int
    float_number: float
    enum: MachineStatus
    created_at: datetime = datetime.now()
    edited_at: datetime
    password: str


class MachineCreate(BaseModel):
    name: constr(max_length=10)
    location: str
    email: EmailStr
    number: int
    float_number: float
    enum: MachineStatus
    password: str


class MachineUpdate(BaseModel):
    name: constr(max_length=10)
    location: str
    email: EmailStr
    number: int
    float_number: float
    enum: MachineStatus
    password: str


class MachineRead(BaseModel):
    id: int = Field(default_factory=lambda: next(count(start=1)), alias="_id")
    name: constr(max_length=10)
    location: str
    email: EmailStr
    number: int
    float_number: float
    enum: MachineStatus
    created_at: datetime = datetime.now()
    edited_at: datetime
