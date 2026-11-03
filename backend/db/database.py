from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from core.config import DATABASE_CONNECTION_URL


# Check whether the database connection URL exists.
if not DATABASE_CONNECTION_URL:
    raise RuntimeError(
        "Database connection URL is missing. "
        "Please check the backend/.env file."
    )


# Create the database engine.
database_engine = create_engine(
    DATABASE_CONNECTION_URL,
    pool_pre_ping=True,
)


# Create a factory for generating database sessions.
DatabaseSessionFactory = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=database_engine,
)


# Create the base class for all database models.
DatabaseModelBase = declarative_base()


# Provide a database session when an API endpoint needs one.
def get_database_session():

    database_session = DatabaseSessionFactory()

    try:
        yield database_session

    finally:
        database_session.close()