import datetime
import sys
import sqlalchemy.exc
from fastapi import FastAPI, Body, Query, HTTPException
from pydantic import ValidationError, EmailStr

sys.path.append('..')
from backend.models.machine import MachineCreate, MachineRead, MachineUpdate, Method
from sqlmodel import Session, create_engine, select, SQLModel
from backend.models.machineTable import Machine
from fastapi.middleware.cors import CORSMiddleware
import jsonref
import os

app = FastAPI()

FRONTEND_BASE_URL = os.environ.get("FRONTEND_BASE_URL")

origins = [
    "http://localhost",
    "http://localhost:5173",
    FRONTEND_BASE_URL,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db_url = os.environ.get("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432")
engine = create_engine(db_url)


@app.on_event("startup")
def startup_event():
    # Create the tables
    SQLModel.metadata.create_all(engine)


@app.on_event("shutdown")
def shutdown_event():
    # Close the database connection when the app shuts down
    engine.dispose()


@app.get("/")
def root():
    return {"message": "home", "FRONTEND_BASE_URL": FRONTEND_BASE_URL}


@app.post('/machine/create')
def create_machine(machine_create: MachineCreate):
    try:
        with Session(engine) as session:
            machine = Machine.from_orm(machine_create)
            session.add(machine)
            session.commit()
    except sqlalchemy.exc.SQLAlchemyError as e:
        # May be thrown both because of internal error or invalid user input (e.g. not satisfying db constraints)
        raise HTTPException(detail=e.args, status_code=400)

    return {"message": "Machine created successfully"}


@app.get("/machine/get")
def get_machine(id: int = None,
                email: EmailStr = None):
    # assuming conjunction of constraints is desired
    # returning all machines in case both id and email are not provided
    try:
        with Session(engine) as session:
            query = select(Machine)
            if id is not None:
                query = query.where(Machine.id == id)
            if email is not None:
                query = query.where(Machine.email == email)
            results = session.exec(query).all()
    except sqlalchemy.exc.SQLAlchemyError as e:
        raise HTTPException(detail=e.args, status_code=500)
    try:
        results = [MachineRead.from_orm(result) for result in results]
    except ValidationError as e:
        raise HTTPException(detail=e.errors(), status_code=500)

    return results


@app.put('/machine/update')
def update_machine(machine_id: int = Query(..., description="The id of the machine to update"),
                   machine_update: MachineUpdate = Body(...)):
    with Session(engine) as session:
        machine = session.get(Machine, machine_id)
        if machine is None:
            # Handle the case when the row does not exist
            return {"message": "Machine not found"}

        original_dict = dict(machine.__dict__)

        update_data = machine_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(machine, key, value)

        if original_dict != machine.__dict__:
            setattr(machine, 'edited_at', datetime.datetime.now())

        session.commit()

    return {"message": "Machine updated successfully"}


@app.get('/machine/schema/{method}')
def get_machine_schema(method: Method):
    # to be updated when using Pydantic v2 (currently incompatible with SQLModel)
    # jsonref.replace_refs() can be used to resolve MachineStatus
    if method == Method.CREATE:
        schema = MachineCreate.schema()
    elif method == Method.UPDATE:
        schema = MachineUpdate.schema()
    else:
        raise HTTPException(status_code=422, detail="Invalid method")

    return jsonref.JsonRef.replace_refs(schema)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
