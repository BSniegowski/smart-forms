FROM python:3.11

WORKDIR /app/backend

ENV POETRY_VIRTUALENVS_CREATE=false \
    POETRY_CACHE_DIR='/var/cache/pypoetry' \
    POETRY_HOME='/usr/local'


RUN curl -sSL https://install.python-poetry.org | python3 -

COPY poetry.lock pyproject.toml /app/backend/

RUN poetry install

COPY . /app/backend/

#CMD ["uvicorn", "API.main:app", "--host", "0.0.0.0", "--port", "8000"]
