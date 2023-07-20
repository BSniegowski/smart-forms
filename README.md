Already implemented
- [x] SQLModel and Pydantic models
- [x] API satisfying [OpenAPI.yaml](OpenAPI.yaml) specification
- [x] Connection with database

To initialize database run
```
cd backend/database
touch database.db
python initialize.py
```
To solve `ModuleNotFoundError: No module named 'backend'` run in the root directory
```
export PYTHONPATH=$(pwd)
```


At the time of creating FastAPI does not support Pydantic v2, hence the use of v1.10.11

Things to improve:
- [ ] More specific error handling
- [ ] Make error response user-friendly
- [ ] Update returned schema json when [SQLModel gets compatible with Pydantic v2](https://github.com/tiangolo/fastapi/discussions/9709#discussioncomment-6387149)
