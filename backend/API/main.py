from fastapi import FastAPI, Body, Request
from fastapi.responses import JSONResponse


app = FastAPI()


@app.get("/")
def root():
    return {"message": "Hello, FastAPI!"}


@app.post('/machine/create')
def create(data: dict = Body(...)):
    return JSONResponse(content={"received": data}, status_code=201)


@app.get('/machine/get')
def get(request: Request):
    id = request.query_params.get('id')
    email = request.query_params.get('email')
    return JSONResponse(content={"received": {"id": id, "email": email}}, status_code=200)


@app.put('/machine/update')
def update(request: Request):
    machine_id = request.query_params.get('machine_id')
    request_body = request.body()
    return JSONResponse(content={"request_body": request_body, "machine_id": machine_id}, status_code=201)


@app.get('/machine/schema/{method}')
def return_schema(method: str):
    assert method in ['update, create']  # maybe abstract this list out to a config file
    return JSONResponse(content={"field1": "value1", "field2": "value2"})


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
