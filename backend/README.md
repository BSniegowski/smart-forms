Already implemented
- [x] SQLModel and Pydantic models
- [x] API satisfying [OpenAPI.yaml](../OpenAPI.yaml) specification
- [x] Connection with database

To initialize database run in root `docker-compose up database`

To run the server
```
cd backend/API
uvicorn main:app --reload
```


At the time of creating SQLModel does not support Pydantic v2, hence the use of v1.10.11

Things to improve:
- [ ] More specific error handling
- [ ] Make error response user-friendly
- [ ] Update returned schema json when [SQLModel gets compatible with Pydantic v2](https://github.com/tiangolo/fastapi/discussions/9709#discussioncomment-6387149)
