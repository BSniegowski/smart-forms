import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import jsonref
from backend.models.machine import MachineRead, MachineUpdate, MachineCreate
from main import app
from datetime import datetime

# Test data
machineBase = {
    "name": "name", "location": "location", "email": "user@example.com",
    "number": 1, "float_number": 3.14, "enum": "active"
}
machineCreateUpdate = machineBase.copy()
machineCreateUpdate["password"] = "123"

machineRead = machineBase.copy()
machineRead["id"] = 1
machineRead["created_at"] = str(datetime.now())
machineRead["edited_at"] = str(datetime.now())


@pytest.fixture
def test_client():
    return TestClient(app)


@patch("main.Session")
@patch("main.engine")
def test_create_machine(mock_engine, mock_session, test_client):
    # Create a mock Session and a mock engine
    mock_session_instance = MagicMock()
    mock_session.return_value.__enter__.return_value = mock_session_instance
    mock_engine_instance = MagicMock()
    mock_engine.return_value = mock_engine_instance

    # Send a POST request to the endpoint
    response = test_client.post("/machine/create", json=machineCreateUpdate)

    # Assert that the response is as expected
    assert response.status_code == 200
    assert response.json() == {"message": "Machine created successfully"}

    # Verify that the session was used correctly
    mock_session_instance.add.assert_called_once()
    mock_session_instance.commit.assert_called_once()


@patch("main.Session")
@patch("main.engine")
def test_get_machine(mock_engine, mock_session, test_client):
    # Create a mock Session and a mock engine
    mock_session_instance = MagicMock()
    mock_session.return_value.__enter__.return_value = mock_session_instance
    mock_engine_instance = MagicMock()
    mock_engine.return_value = mock_engine_instance

    # Define test data
    machine_id = 1
    email = "user@example.com"

    # Mock the database query
    mock_engine_instance.exec.return_value.all.return_value = [
        MachineRead(**machineRead),
    ]

    # Send a GET request to the endpoint
    response = test_client.get("/machine/get", params={"id": machine_id, "email": email})

    # Assert that the response is as expected
    assert response.status_code == 200


@patch("main.Session")
@patch("main.engine")
def test_update_machine(mock_engine, mock_session, test_client):
    # Create a mock Session and a mock engine
    mock_session_instance = MagicMock()
    mock_session.return_value.__enter__.return_value = mock_session_instance
    mock_engine_instance = MagicMock()
    mock_engine.return_value = mock_engine_instance

    # Define test data
    machine_id = 1
    machineCreateUpdate["name"] = "New name"

    # Send a PUT request to the endpoint
    response = test_client.put(f"/machine/update?machine_id={machine_id}", json=machineCreateUpdate)

    # Assert that the response is as expected
    assert response.status_code == 200
    assert response.json() == {"message": "Machine updated successfully"}

    # Verify that the session was used correctly
    mock_session_instance.commit.assert_called_once()


@patch("main.Session")
@patch("main.engine")
def test_get_machine_schema(mock_engine, mock_session, test_client):
    # Create a mock Session and a mock engine
    mock_session_instance = MagicMock()
    mock_session.return_value.__enter__.return_value = mock_session_instance
    mock_engine_instance = MagicMock()
    mock_engine.return_value = mock_engine_instance

    method = "create"
    response = test_client.get(f"/machine/schema/{method}")
    assert response.status_code == 200
    assert response.json() == jsonref.JsonRef.replace_refs(MachineCreate.schema())

    method = "update"
    response = test_client.get(f"/machine/schema/{method}")
    assert response.status_code == 200
    assert response.json() == jsonref.JsonRef.replace_refs(MachineUpdate.schema())

    method = "invalid_method"
    response = test_client.get(f"/machine/schema/{method}")
    assert response.status_code == 422

    # Verify that the session was not used in this test (since it's not related to schema retrieval)
    mock_session_instance.commit.assert_not_called()

