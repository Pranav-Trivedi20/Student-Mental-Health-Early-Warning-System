from datetime import datetime,timezone
from sqlalchemy import Column, Integer , String , DateTime
from db.database import DatabaseModelBase

class User(DatabaseModelBase):
    __tablename__ ="users"
    id=Column(Integer,primary_key=True,index=True)
    name=Column(String(100),nullable=False)
    email=Column(String(255),unique=True,nullable=False,index=True)
    password_hash = Column(String(255),nullable=False)

    created_at=Column(
        DateTime(timezone=True),
        default=lambda:datetime.now(timezone.utc),
        nullable=False
    )