from datetime import datetime , timezone
from sqlalchemy import DateTime,Column,String,Integer,ForeignKey,Float
from db.database import DatabaseModelBase


class AssessmentResult(DatabaseModelBase):
    __tablename__ = "assessment_results"
    id=Column(Integer,primary_key=True,index=True)
    user_id=Column(
        Integer,ForeignKey("users.id",ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    assessment_type=Column(String(30),nullable=False)
    score=Column(Float,nullable=False)
    risk_level=Column(String(30),nullable=False)
    model_version=Column(String(100),nullable=True)
    created_at=Column(
        DateTime(timezone=True),
        default=lambda:datetime.now(timezone.utc),
        nullable=False
    )