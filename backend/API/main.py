from fastapi import FastAPI, Body, Request, Query, HTTPException
from fastapi.responses import JSONResponse
from pydantic import ValidationError, EmailStr
from backend.models.machine import MachineCreate, MachineRead, MachineUpdate

app = FastAPI()


@app.get("/")
def root():
    print("Home accessed")
    return {"message": "home"}


@app.post('/machine/create')
# def create_machine(data: dict = Body(..., description="Request body is required")):
def create_machine(machine: MachineCreate):
    # try:
    #     MachineCreate.model_validate(data)
    # except ValidationError as e:
    #     return JSONResponse(content={"Error message": e.errors()}, status_code=400)

    return {"message": "Machine created successfully"}


@app.get("/machine/get")
def get_machine(id: int = Query(None, description="The id of the machine to retrieve"),
                email: EmailStr = Query(None, description="The email of the machine to retrieve")):
    try:
        if id != 0 or email != "user@example.com":
            print("Raising")
            raise RuntimeError
    except RuntimeError as e:
        raise HTTPException(detail="Machine with specified id and email not found", status_code=400)

    # content received from database
    machines = [
        {
            "name": "string",
            "location": "string",
            "email": "user@example.com",
            "number": 0,
            "float_number": 0,
            "enum": "active",
            "id": 0,
            "created_at": "2023-07-19T12:17:08.063Z",
            "edited_at": "2023-07-19T12:17:08.063Z"
        }
    ]
    try:
        for machine in machines:
            MachineRead.model_validate(machine)
    except ValidationError as e:
        raise HTTPException(detail=f'Received invalid data from database. {e.errors()}', status_code=500)

    return machines


@app.put('/machine/update')
def update_machine(machine_id: int = Query(..., description="The id of the machine to update"),
                   machine: MachineUpdate = Body(...)):
    return {"message": "Machine updated successfully"}


@app.get('/machine/schema/{method}')
def get_machine_schema(method: str):
    if method == "create":
        schema = MachineCreate.schema()
    elif method == "update":
        schema = MachineUpdate.schema()
    else:
        return {"message": "Invalid method"}

    return schema


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
