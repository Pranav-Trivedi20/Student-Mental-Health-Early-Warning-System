
import os
from pathlib import Path
from typing import Literal

import numpy as np
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import text

from pytorch_tabnet.tab_model import TabNetRegressor

from core.dependencies import get_current_user
from db.database import database_engine, get_database_session
from routers.authentication import authentication_router
from models.assessment_result import AssessmentResult

# Classfications of the models using if else , based on the predciotns 

def classify_overall_score(score: float):
    """
    Classifies the overall mental health score.

    Higher score = greater mental health concern.
    Lower score = better mental health.
    """

    score = float(score)

    if not 0 <= score <= 10:
        raise ValueError(
            f"Overall mental health score must be between 0 and 10. Received: {score}"
        )

    if score >= 8:
        return (
            "High concern",
            "Strong early warning; professional support is advised"
        )

    elif score >= 6:
        return (
            "Moderate concern",
            "Early warning; repeat the assessment soon and consider talking to someone"
        )

    elif score >= 4:
        return (
            "Fair",
            "Mild difficulties; monitor and consider lifestyle changes"
        )

    else:
        return (
            "Good",
            "No immediate concern; continue healthy habits and periodic self-check"
        )


# APPLICATION CONFIGURATION


app = FastAPI(
    title="Student Mental Health Early Warning System",
    description="Student Mental Health Assessment API",
    version="0.2.0"
)

app.include_router(authentication_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)



# TABNET MODEL CONFIGURATION


MODEL_VERSION = "overall-tabnet-v1.0"

# Default location:
# backend/model_files/tabnet_mental_health.zip
#
# You can override this using OVERALL_MODEL_PATH
# in your backend .env file.

MODEL_PATH = Path(
    os.getenv(
        "OVERALL_MODEL_PATH",
        str(
            Path(__file__).resolve().parent
            / "model_files"
            / "tabnet_mental_health.zip"
        )
    )
)

overall_model = None


def get_overall_model():
    """
    Load the existing TabNet regression model once.
    The model is not retrained or modified.
    """

    global overall_model

    if overall_model is not None:
        return overall_model

    if not MODEL_PATH.exists():
        raise HTTPException(
            status_code=503,
            detail=(
                "Overall mental health model file not found. "
                "Please place tabnet_mental_health.zip "
                "inside backend/model_files/."
            )
        )

    try:
        model = TabNetRegressor()
        model.load_model(str(MODEL_PATH))

        overall_model = model

        return overall_model

    except Exception as error:
        print(f"TabNet model loading error: {error}")

        raise HTTPException(
            status_code=500,
            detail="Could not load the Overall Mental Health model."
        )



# OVERALL ASSESSMENT INPUT SCHEMA


class OverallAssessmentResponses(BaseModel):

    age: int = Field(ge=15, le=100)

    year: int = Field(ge=1)

    sleep: Literal[
        "<4 hrs",
        "4–5 hrs",
        "5–6 hrs",
        "6–7 hrs",
        "7–8 hrs"
    ]

    screen: Literal[
        "2–4 hrs",
        "4–6 hrs",
        "6–8 hrs",
        "8+ hrs"
    ]

    nervous: Literal[
        "Not at all",
        "Several days",
        "More than half the days",
        "Nearly every day"
    ]

    relax: Literal[
        "Not at all",
        "Several days",
        "More than half the days",
        "Nearly every day"
    ]

    interest: Literal[
        "Not at all",
        "Several days",
        "More than half the days",
        "Nearly every day"
    ]

    down: Literal[
        "Not at all",
        "Several days",
        "More than half the days",
        "Nearly every day"
    ]

    concentration: Literal[
        "Not at all",
        "Several days",
        "More than half the days",
        "Nearly every day"
    ]

    control: Literal[
        "Never",
        "Almost never",
        "Sometimes",
        "Fairly often",
        "Very often"
    ]

    confidence: Literal[
        "Never",
        "Almost never",
        "Sometimes",
        "Fairly often",
        "Very often"
    ]

    attendance: Literal[
        "90%+",
        "75–90%",
        "60–75%",
        "<60%"
    ]


class OverallAssessmentRequest(BaseModel):
    responses: OverallAssessmentResponses



# MODEL INPUT ENCODING


FREQUENCY_MAPPING = {
    "Not at all": 0,
    "Several days": 1,
    "More than half the days": 2,
    "Nearly every day": 3
}

PSS_MAPPING = {
    "Never": 0,
    "Almost never": 1,
    "Sometimes": 2,
    "Fairly often": 3,
    "Very often": 4
}

CATEGORY_MAPPING = {
    "sleep": {
        "<4 hrs": 0,
        "4–5 hrs": 1,
        "5–6 hrs": 2,
        "6–7 hrs": 3,
        "7–8 hrs": 4
    },

    "screen": {
        "2–4 hrs": 0,
        "4–6 hrs": 1,
        "6–8 hrs": 2,
        "8+ hrs": 3
    },

    "attendance": {
        "90%+": 0,
        "75–90%": 1,
        "60–75%": 2,
        "<60%": 3
    }
}


def prepare_model_input(responses: OverallAssessmentResponses):
    """
    Convert questionnaire responses into the exact
    feature order used by the existing TabNet notebook.

    Feature order:
    age, year, sleep, screen, nervous, relax,
    interest, down, concentration, control,
    confidence, attendance
    """

    data = responses.model_dump()

    encoded_values = [
        data["age"],
        data["year"],

        CATEGORY_MAPPING["sleep"][data["sleep"]],
        CATEGORY_MAPPING["screen"][data["screen"]],

        FREQUENCY_MAPPING[data["nervous"]],
        FREQUENCY_MAPPING[data["relax"]],
        FREQUENCY_MAPPING[data["interest"]],
        FREQUENCY_MAPPING[data["down"]],
        FREQUENCY_MAPPING[data["concentration"]],

        PSS_MAPPING[data["control"]],
        PSS_MAPPING[data["confidence"]],

        CATEGORY_MAPPING["attendance"][data["attendance"]]
    ]

    return np.array(
        [encoded_values],
        dtype=np.float32
    )



# BASIC API ENDPOINTS


@app.get("/")
def home():
    return {
        "message": "Student Mental Health API is running"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "Healthy"
    }


@app.get("/api/health/database")
def database_health_check():

    try:
        with database_engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "Healthy",
            "database": "Connected"
        }

    except SQLAlchemyError:
        raise HTTPException(
            status_code=503,
            detail="Database connection failed"
        )



# AUTHENTICATED STUDENT ENDPOINT


@app.get("/api/auth/me")
def get_logged_in_student(
    current_student=Depends(get_current_user)
):
    return {
        "id": current_student.id,
        "name": current_student.name,
        "email": current_student.email
    }



# ASSESSMENT INFORMATION


ASSESSMENTS = {

    101: {
        "assessment_id": 101,
        "assessment_name": "Depression Assessment",
        "assessment_type": "depression",
        "assessment_description": (
            "This assessment is designed to evaluate "
            "depressive symptoms in students."
        ),
        "questions": [
            {
                "question_id": 1,
                "question_text": (
                    "How often have you felt that your daily "
                    "activities and studies were difficult to manage?"
                )
            },
            {
                "question_id": 2,
                "question_text": (
                    "How often have you experienced difficulty "
                    "concentrating during lectures or study sessions?"
                )
            },
            {
                "question_id": 3,
                "question_text": (
                    "How often have you felt physically tired "
                    "or lacking energy to complete daily tasks?"
                )
            },
            {
                "question_id": 4,
                "question_text": (
                    "How often have you felt worried, overwhelmed, "
                    "or under academic pressure?"
                )
            },
            {
                "question_id": 5,
                "question_text": (
                    "How often have you felt unable to maintain "
                    "balance between personal life and academic responsibilities?"
                )
            }
        ]
    },

    201: {
        "assessment_id": 201,
        "assessment_name": "Anxiety Assessment",
        "assessment_type": "anxiety",
        "assessment_description": (
            "This assessment is designed to evaluate anxiety "
            "symptoms in students."
        ),
        "questions": [
            {
                "question_id": 1,
                "question_text": (
                    "Over the past two weeks, how often have you "
                    "had little interest or pleasure in doing things?"
                )
            },
            {
                "question_id": 2,
                "question_text": (
                    "How often have you felt down, depressed, "
                    "or hopeless about your academic or personal life?"
                )
            },
            {
                "question_id": 3,
                "question_text": (
                    "How often have you had trouble falling asleep, "
                    "staying asleep, or sleeping too much?"
                )
            },
            {
                "question_id": 4,
                "question_text": (
                    "How often have you felt tired, exhausted, "
                    "or lacking energy throughout the day?"
                )
            },
            {
                "question_id": 5,
                "question_text": (
                    "How often have you had trouble concentrating "
                    "on schoolwork, reading, or daily tasks?"
                )
            }
        ]
    },

    301: {
        "assessment_id": 301,
        "assessment_name": "Stress Assessment",
        "assessment_type": "stress",
        "assessment_description": (
            "This assessment is designed to evaluate stress "
            "symptoms in students."
        ),
        "questions": [
            {
                "question_id": 1,
                "question_text": (
                    "Over the past two weeks, how often have you "
                    "felt nervous, anxious, or on edge?"
                )
            },
            {
                "question_id": 2,
                "question_text": (
                    "How often have you felt unable to stop or "
                    "control worrying about exams, grades, or personal matters?"
                )
            },
            {
                "question_id": 3,
                "question_text": (
                    "How often have you worried too much about "
                    "different potential problems?"
                )
            },
            {
                "question_id": 4,
                "question_text": (
                    "How often have you had trouble relaxing "
                    "during your free time?"
                )
            },
            {
                "question_id": 5,
                "question_text": (
                    "How often have you felt so restless that "
                    "it was hard to sit still?"
                )
            }
        ]
    },

    401: {
        "assessment_id": 401,
        "assessment_name": "Overall Mental Health Assessment",
        "assessment_type": "overall",
        "assessment_description": (
            "This assessment collects the twelve input features "
            "required by the existing Overall TabNet model."
        ),

        "input_fields": [
            "age",
            "year",
            "sleep",
            "screen",
            "nervous",
            "relax",
            "interest",
            "down",
            "concentration",
            "control",
            "confidence",
            "attendance"
        ]
    }
}


@app.get("/api/assessment/{assessment_id}")
def get_assessment(assessment_id: int):

    assessment = ASSESSMENTS.get(assessment_id)

    if assessment is None:
        raise HTTPException(
            status_code=404,
            detail="Assessment not found"
        )

    return assessment



# OVERALL MENTAL HEALTH PREDICTION


@app.post("/api/predict/overall")
def predict_overall_mental_health(
    request: OverallAssessmentRequest,
    current_student=Depends(get_current_user),
    database: Session = Depends(get_database_session)
):
    """
    Authenticated Overall Mental Health prediction.

    Uses the existing trained TabNet model,
    classifies the predicted score using Table 3.4,
    and saves the result for the logged-in student.
    """

    model = get_overall_model()
    model_input = prepare_model_input(request.responses)

    try:
        # Generate prediction using the existing trained TabNet model
        prediction = model.predict(model_input)

        score = float(np.asarray(prediction).reshape(-1)[0])

        # Assign category using Table 3.4
        risk_level, interpretation = classify_overall_score(score)

        # Create assessment result
        result = AssessmentResult(
            user_id=current_student.id,
            assessment_type="overall",
            score=score,
            risk_level=risk_level,
            model_version=MODEL_VERSION
        )

        # Save result in the database
        database.add(result)
        database.commit()
        database.refresh(result)

        # Return actual assessment result
        return {
            "id": result.id,
            "assessment_type": "overall",
            "title": "Overall Mental Health Assessment",
            "score": round(score, 2),
            "risk_level": risk_level,
            "interpretation": interpretation,
            "model_version": result.model_version,
            "timestamp": result.created_at
        }

    except HTTPException:
        database.rollback()
        raise

    except Exception as error:
        database.rollback()

        print(f"Overall prediction error: {error}")

        raise HTTPException(
            status_code=500,
            detail="Could not generate the assessment result."
        )

    
# AUTHENTICATED ASSESSMENT HISTORY


@app.get("/api/history")
def get_overall_history(
    current_student=Depends(get_current_user),
    database: Session = Depends(get_database_session)
):

    results = (
        database.query(AssessmentResult)
        .filter(
            AssessmentResult.user_id == current_student.id
        )
        .order_by(
            AssessmentResult.created_at.desc()
        )
        .all()
    )

    return [
        {
            "id": result.id,
            "assessment_type": result.assessment_type,
            "score": result.score,
            "risk_level": result.risk_level,
            "model_version": result.model_version,
            "timestamp": result.created_at
        }
        for result in results
    ]



# AUTHENTICATED SINGLE RESULT


@app.get("/api/results")
def get_user_results(
    current_student=Depends(get_current_user),
    database: Session = Depends(get_database_session)
):

    results = (
        database.query(AssessmentResult)
        .filter(
            AssessmentResult.user_id == current_student.id
        )
        .order_by(
            AssessmentResult.created_at.desc()
        )
        .all()
    )

    return [
        {
            "id": result.id,
            "assessment_type": result.assessment_type,
            "score": result.score,
            "risk_level": result.risk_level,
            "model_version": result.model_version,
            "timestamp": result.created_at
        }
        for result in results
    ]
