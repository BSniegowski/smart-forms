from sqlmodel import SQLModel, create_engine
import os


def initialize_database():
    db_url = os.environ.get("DATABASE_URL", "No database url found in env")
    # Create the database engine
    engine = create_engine(db_url)

    # Create the tables
    SQLModel.metadata.create_all(engine)

    # Close the database connection
    engine.dispose()


if __name__ == "__main__":
    initialize_database()
