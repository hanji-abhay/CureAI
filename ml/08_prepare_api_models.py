from pathlib import Path

import pandas as pd
import joblib

from sklearn.model_selection import train_test_split, GroupShuffleSplit
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier


# --------------------------------------------------
# PATHS
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent
CLEANED_DIR = BASE_DIR / "datasets" / "cleaned"
MODEL_DIR = BASE_DIR / "ml" / "models"

MODEL_DIR.mkdir(exist_ok=True)


# --------------------------------------------------
# PREPROCESSOR
# --------------------------------------------------

def create_preprocessor(X):

    numerical_columns = X.select_dtypes(
        include=["number"]
    ).columns.tolist()

    categorical_columns = X.select_dtypes(
        include=["object", "string", "category", "boolean", "bool"]
    ).columns.tolist()

    transformers = []

    if numerical_columns:
        transformers.append(
            (
                "numeric",
                StandardScaler(),
                numerical_columns
            )
        )

    if categorical_columns:
        transformers.append(
            (
                "categorical",
                OneHotEncoder(
                    handle_unknown="ignore",
                    sparse_output=False
                ),
                categorical_columns
            )
        )

    return ColumnTransformer(transformers=transformers)


# ==================================================
# THYROID CANCER
# ==================================================

print("\nPreparing Thyroid Cancer model...")

thyroid = pd.read_csv(
    CLEANED_DIR / "thyroid_cleaned.csv"
)

thyroid = thyroid.drop(
    columns=["Thyroid_Cancer_Risk"],
    errors="ignore"
)

X = thyroid.drop(columns=["Diagnosis"])
y = thyroid["Diagnosis"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

thyroid_pipeline = Pipeline([
    (
        "preprocessor",
        create_preprocessor(X_train)
    ),
    (
        "model",
        RandomForestClassifier(
            n_estimators=100,
            random_state=42,
            class_weight="balanced",
            n_jobs=-1
        )
    )
])

thyroid_pipeline.fit(X_train, y_train)

joblib.dump(
    thyroid_pipeline,
    MODEL_DIR / "thyroid_api_model.joblib"
)

print("Thyroid API model saved.")


# ==================================================
# SKIN CANCER
# ==================================================

print("\nPreparing Skin Cancer model...")

skin = pd.read_csv(
    CLEANED_DIR / "skin_cleaned.csv"
)

skin_boolean_columns = [
    "smoke",
    "drink",
    "pesticide",
    "gender",
    "skin_cancer_history",
    "cancer_history",
    "has_piped_water",
    "has_sewage_system"
]

for column in skin_boolean_columns:
    skin[column] = skin[column].astype(str)

skin = skin.drop(
    columns=["biopsed"],
    errors="ignore"
)

X = skin.drop(columns=["diagnostic"])
y = skin["diagnostic"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

skin_pipeline = Pipeline([
    (
        "preprocessor",
        create_preprocessor(X_train)
    ),
    (
        "model",
        RandomForestClassifier(
            n_estimators=100,
            random_state=42,
            class_weight="balanced",
            n_jobs=-1
        )
    )
])

skin_pipeline.fit(X_train, y_train)

joblib.dump(
    skin_pipeline,
    MODEL_DIR / "skin_api_model.joblib"
)

print("Skin API model saved.")


# ==================================================
# LUNG CANCER
# ==================================================

print("\nPreparing Lung Cancer model...")

lung = pd.read_csv(
    CLEANED_DIR / "lung_cleaned.csv"
)

X = lung.drop(columns=["Level"])
y = lung["Level"]

groups = X.astype(str).agg("|".join, axis=1)

group_splitter = GroupShuffleSplit(
    n_splits=1,
    test_size=0.20,
    random_state=42
)

train_indices, test_indices = next(
    group_splitter.split(X, y, groups=groups)
)

X_train = X.iloc[train_indices]
y_train = y.iloc[train_indices]

# Final deployment model uses the selected Decision Tree
lung_pipeline = Pipeline([
    (
        "preprocessor",
        create_preprocessor(X_train)
    ),
    (
        "model",
        DecisionTreeClassifier(
            random_state=42,
            class_weight="balanced"
        )
    )
])

lung_pipeline.fit(X_train, y_train)

joblib.dump(
    lung_pipeline,
    MODEL_DIR / "lung_api_model.joblib"
)

print("Lung API model saved.")


# ==================================================
# BREAST CANCER
# ==================================================

print("\nPreparing Breast Cancer model...")

breast = pd.read_csv(
    CLEANED_DIR / "breast_cleaned.csv"
)

breast = breast.drop(
    columns=[
        "Biopsy_Result",
        "Cancer_Stage",
        "Lymph_Node_Involvement"
    ],
    errors="ignore"
)

X = breast.drop(columns=["Cancer"])
y = breast["Cancer"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

breast_pipeline = Pipeline([
    (
        "preprocessor",
        create_preprocessor(X_train)
    ),
    (
        "model",
        RandomForestClassifier(
            n_estimators=100,
            random_state=42,
            class_weight="balanced",
            n_jobs=-1
        )
    )
])

breast_pipeline.fit(X_train, y_train)

joblib.dump(
    breast_pipeline,
    MODEL_DIR / "breast_api_model.joblib"
)

print("Breast API model saved.")


# ==================================================
# COMPLETED
# ==================================================

print("\n" + "=" * 70)
print("API MODEL PREPARATION COMPLETED")
print("=" * 70)

print("\nModels saved in:")
print(MODEL_DIR)

print("\nCreated models:")
print("- thyroid_api_model.joblib")
print("- skin_api_model.joblib")
print("- lung_api_model.joblib")
print("- breast_api_model.joblib")