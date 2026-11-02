from datatime import datetime , timeezone
from sqlalchemy import DateTime,Column,String,Interger,ForeignKey,Float
from db.database import DatabaseModelBase


class AssessmentResult(DatabaseModelBase):
    __tablename__:"assessment_results"
    id=Column(Interger,primary_key=True,index=True)
    user_id=Column(
        Interger,ForeignKey("users.id",ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    assessment_type=Column(String(30),nullable=False)
    score=Column(Float,nullable=False)
    risk_level=Column(String(30),nullable=False)
    model_version=Column(String(100),nullable=True)
    created_at=Column(
        DateTime(timeezone=True),
        default=lambda:datetime.now(timeezone.utc),
        nullable=False
    )