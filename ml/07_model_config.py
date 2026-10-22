from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent

MODEL_DIR = BASE_DIR / "models"


MODEL_CONFIG = {
    "thyroid": {
        "model": MODEL_DIR / "thyroid_random_forest.joblib",
        "target": "Diagnosis",
        "name": "Thyroid Cancer"
    },

    "skin": {
        "model": MODEL_DIR / "skin_random_forest.joblib",
        "target": "diagnostic",
        "name": "Skin Cancer"
    },

    "lung": {
        "model": MODEL_DIR / "lung_decision_tree.joblib",
        "target": "Level",
        "name": "Lung Cancer"
    },

    "breast": {
        "model": MODEL_DIR / "breast_random_forest.joblib",
        "target": "Cancer",
        "name": "Breast Cancer"
    }
}