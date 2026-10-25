"""FastAPI entry point for MindEase attention assessments."""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, Field

from .predictor import AssessmentPredictor, InvalidAssessmentError

logger = logging.getLogger(__name__)


class AssessmentRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    responses: dict[str, Any] = Field(
        ...,
        description=(
            "Assessment answers keyed by CSV feature name. You may provide "
            "all features or only the answers collected; omitted values are "
            "imputed using the saved training preprocessor."
        ),
        examples=[
            {
                "sleep_quality": "Poor",
                "stress_level": "High",
                "phone_checking_without_notification": "Many times/hour",
                "reaction_time_ms": 453.6,
                "attention_accuracy_percentage": 67.6,
            }
        ],
    )


class ContributingFactor(BaseModel):
    feature: str
    label: str
    answer: Any
    confidence_change_percentage_points: float
    explanation: str


class AssessmentResponse(BaseModel):
    attention_interference_level: str
    confidence_percentage: float
    explanation: str
    contributing_factors: list[ContributingFactor]
    personalized_suggestions: list[str]
    global_model_factors: list[dict[str, Any]]
    disclaimer: str


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.predictor = AssessmentPredictor()
    yield


app = FastAPI(
    title="MindEase Attention Assessment API",
    description=(
        "Research and digital-wellness predictions using the saved MindEase "
        "neural network. This is not a medical diagnosis or clinical tool."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

import os

allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
allowed_origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins != ["*"] else ["*"],
    allow_origin_regex=os.getenv("ALLOWED_ORIGIN_REGEX", r"^https:\/\/.*\.vercel\.app$"),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(InvalidAssessmentError)
async def invalid_assessment_handler(
    request: Request, error: InvalidAssessmentError
) -> JSONResponse:
    return JSONResponse(status_code=422, content={"detail": str(error)})


@app.get("/health", tags=["system"])
def health(request: Request) -> dict[str, str]:
    predictor = getattr(request.app.state, "predictor", None)
    if predictor is None:
        return {"status": "not_ready"}
    return {"status": "ready"}


@app.post(
    "/api/v1/assessments/predict",
    response_model=AssessmentResponse,
    tags=["assessments"],
    summary="Predict attention interference and explain the result",
)
def predict_assessment(
    payload: AssessmentRequest, request: Request
) -> AssessmentResponse:
    predictor: AssessmentPredictor = request.app.state.predictor
    try:
        return AssessmentResponse(**predictor.predict(payload.responses))
    except InvalidAssessmentError:
        raise
    except Exception as error:
        logger.exception("Unexpected assessment prediction failure")
        raise HTTPException(
            status_code=500,
            detail="Assessment prediction failed. Check the server logs.",
        ) from error
