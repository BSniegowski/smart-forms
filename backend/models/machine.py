from pydantic import BaseModel, EmailStr, constr
from datetime import datetime
from enum import Enum


class Method(Enum):
    CREATE = "create"
    UPDATED = "update"


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

    class Config:
        orm_mode = True


class MachineCreate(MachineBase):
    password: str


class MachineUpdate(MachineBase):
    password: str


class MachineRead(MachineBase):
    id: int
    created_at: datetime
    edited_at: datetime
