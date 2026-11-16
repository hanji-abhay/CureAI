ï»¿from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = BASE_DIR / "datasets" / "cleaned" / "thyroid_cleaned.csv"
MODEL_DIR = BASE_DIR / "ml" / "models"
MODEL_PATH = MODEL_DIR / "thyroid_api_model.joblib"

print("Loading thyroid dataset...")
df = pd.read_csv(DATA_PATH)
df = df.drop(columns=["Thyroid_Cancer_Risk"], errors="ignore")

X = df.drop(columns=["Diagnosis"])
y = df["Diagnosis"]

print("Dataset:", X.shape)
print("Preparing train/test split...")

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y,
)

numeric = X_train.select_dtypes(include=["number"]).columns.tolist()
categorical = X_train.select_dtypes(
    include=["object", "string", "category", "boolean", "bool"]
).columns.tolist()

preprocessor = ColumnTransformer([
    ("numeric", StandardScaler(), numeric),
    ("categorical", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical),
])

pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("model", RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        class_weight="balanced",
        n_jobs=-1,
    )),
])

print("Training thyroid Random Forest. This may take a while...")
pipeline.fit(X_train, y_train)

MODEL_DIR.mkdir(parents=True, exist_ok=True)
joblib.dump(pipeline, MODEL_PATH, compress=3)

print("\nThyroid API model saved successfully.")
print("Path:", MODEL_PATH)
print("Test rows:", len(X_test))
print("Model file size (MB):", round(MODEL_PATH.stat().st_size / (1024 * 1024), 2))
