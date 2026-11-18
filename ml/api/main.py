from pathlib import Path

import joblib
import pandas as pd

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .schemas import (
    ThyroidInput,
    SkinInput,
    LungInput,
    BreastInput
)


# ==================================================
# APP
# ==================================================

app = FastAPI(
    title="CureAI API",
    description="CureAI cancer risk prediction API",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# ==================================================
# MODEL PATH
# ==================================================

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"


# ==================================================
# LOAD MODELS
# ==================================================

thyroid_model = joblib.load(
    MODEL_DIR / "thyroid_api_model_compact_candidate.joblib"
)

skin_model = joblib.load(
    MODEL_DIR / "skin_api_model.joblib"
)

lung_model = joblib.load(
    MODEL_DIR / "lung_api_model.joblib"
)

breast_model = joblib.load(
    MODEL_DIR / "breast_api_model.joblib"
)


# ==================================================
# HOME
# ==================================================

@app.get("/")
def home():
    return {
        "message": "Welcome to CureAI API",
        "status": "running"
    }


# ==================================================
# THYROID PREDICTION
# ==================================================

@app.post("/predict/thyroid")
def predict_thyroid(data: ThyroidInput):

    input_data = pd.DataFrame([data.model_dump()])

    prediction = thyroid_model.predict(input_data)[0]

    return {
        "cancer_type": "Thyroid Cancer",
        "prediction": prediction,
        "message": "This is an AI-assisted preliminary classification, not a medical diagnosis."
    }


# ==================================================
# SKIN PREDICTION
# ==================================================

@app.post("/predict/skin")
def predict_skin(data: SkinInput):
    input_data = pd.DataFrame([data.model_dump()])

    boolean_fields = [
        "smoke",
        "drink",
        "pesticide",
        "skin_cancer_history",
        "cancer_history",
        "has_piped_water",
        "has_sewage_system"
    ]

    for field in boolean_fields:
        input_data[field] = input_data[field].astype(str)

    prediction = skin_model.predict(input_data)[0]

    return {
        "cancer_type": "Skin Cancer",
        "prediction": prediction,
        "message": (
            "This is an AI-assisted preliminary classification, "
            "not a medical diagnosis."
        )
    }

# ==================================================
# LUNG PREDICTION
# ==================================================
@app.post("/predict/lung")
def predict_lung(data: LungInput):
    input_data = pd.DataFrame([data.model_dump()])

    input_data = input_data.rename(columns={
        "Air_Pollution": "Air Pollution",
        "Alcohol_use": "Alcohol use",
        "Dust_Allergy": "Dust Allergy",
        "OccuPational_Hazards": "OccuPational Hazards",
        "Genetic_Risk": "Genetic Risk",
        "chronic_Lung_Disease": "chronic Lung Disease",
        "Balanced_Diet": "Balanced Diet",
        "Passive_Smoker": "Passive Smoker",
        "Chest_Pain": "Chest Pain",
        "Coughing_of_Blood": "Coughing of Blood",
        "Weight_Loss": "Weight Loss",
        "Shortness_of_Breath": "Shortness of Breath",
        "Swallowing_Difficulty": "Swallowing Difficulty",
        "Clubbing_of_Finger_Nails": "Clubbing of Finger Nails",
        "Frequent_Cold": "Frequent Cold",
        "Dry_Cough": "Dry Cough"
    })

    prediction = lung_model.predict(input_data)[0]

    return {
        "cancer_type": "Lung Cancer",
        "prediction": prediction,
        "message": "This is an AI-assisted preliminary classification, not a medical diagnosis."
    }


# ==================================================
# BREAST PREDICTION
# ==================================================

@app.post("/predict/breast")
def predict_breast(data: BreastInput):
    input_data = pd.DataFrame([data.model_dump()])
    prediction = breast_model.predict(input_data)[0]

    return {
        "cancer_type": "Breast Cancer",
        "prediction": int(prediction),
        "message": "This is an AI-assisted preliminary classification, not a medical diagnosis."
    }

