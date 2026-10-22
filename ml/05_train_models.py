from pathlib import Path
import time
import pandas as pd

from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

import joblib


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

PROCESSED_DIR = BASE_DIR / "datasets" / "processed"
MODEL_DIR = BASE_DIR / "ml" / "models"

MODEL_DIR.mkdir(exist_ok=True)


# ============================================================
# DATASETS
# ============================================================

datasets = {
    "thyroid": "thyroid",
    "skin": "skin",
    "lung": "lung",
    "breast": "breast"
}


# ============================================================
# MODELS
# ============================================================

models = {
    "Logistic Regression": LogisticRegression(
        max_iter=1000,
        class_weight="balanced"
    ),

    "Decision Tree": DecisionTreeClassifier(
        random_state=42,
        class_weight="balanced"
    ),

    "Random Forest": RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        class_weight="balanced",
        n_jobs=-1
    )
}


# ============================================================
# TRAINING
# ============================================================

results = []

for cancer_name, file_name in datasets.items():

    print("\n" + "=" * 70)
    print(f"TRAINING MODELS — {cancer_name.upper()} CANCER")
    print("=" * 70)

    train_path = PROCESSED_DIR / f"{file_name}_train.csv"

    train_data = pd.read_csv(train_path)

    X_train = train_data.drop(columns=["Target"])
    y_train = train_data["Target"]

    print("Training rows:", len(X_train))
    print("Features:", X_train.shape[1])
    print("Target classes:", y_train.unique())

    for model_name, model in models.items():

        print("\n" + "-" * 60)
        print(f"Training: {model_name}")
        print("-" * 60)

        start_time = time.time()

        model.fit(X_train, y_train)

        training_time = time.time() - start_time

        # Safe filename
        model_filename = (
            f"{cancer_name}_"
            f"{model_name.lower().replace(' ', '_')}.joblib"
        )

        model_path = MODEL_DIR / model_filename

        joblib.dump(model, model_path)

        print("Training completed.")
        print(f"Training time: {training_time:.2f} seconds")
        print(f"Model saved: {model_path}")

        results.append({
            "Cancer": cancer_name,
            "Model": model_name,
            "Training_Time_Seconds": round(training_time, 2)
        })


# ============================================================
# TRAINING SUMMARY
# ============================================================

results_df = pd.DataFrame(results)

print("\n" + "=" * 70)
print("MODEL TRAINING COMPLETED")
print("=" * 70)

print(results_df.to_string(index=False))

print("\nModels saved in:")
print(MODEL_DIR)