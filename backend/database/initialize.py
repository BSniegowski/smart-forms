from sqlmodel import SQLModel, create_engine
from backend.models.machineTable import Machine


def initialize_database():
    # Create the database engine
    engine = create_engine("sqlite:///./database.db")

    # Create the tables
    SQLModel.metadata.create_all(engine)

    # Close the database connection
    engine.dispose()


if __name__ == "__main__":
    initialize_database()
