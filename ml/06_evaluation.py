from pathlib import Path

import pandas as pd
import joblib

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix
)


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

PROCESSED_DIR = BASE_DIR / "datasets" / "processed"
MODEL_DIR = BASE_DIR / "ml" / "models"


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

model_names = [
    "logistic_regression",
    "decision_tree",
    "random_forest"
]


# ============================================================
# EVALUATION
# ============================================================

results = []

for cancer_name, file_name in datasets.items():

    print("\n" + "=" * 70)
    print(f"EVALUATING {cancer_name.upper()} CANCER")
    print("=" * 70)

    test_path = PROCESSED_DIR / f"{file_name}_test.csv"

    test_data = pd.read_csv(test_path)

    X_test = test_data.drop(columns=["Target"])
    y_test = test_data["Target"]

    for model_name in model_names:

        model_path = (
            MODEL_DIR /
            f"{cancer_name}_{model_name}.joblib"
        )

        print("\n" + "-" * 60)
        print(f"MODEL: {model_name.replace('_', ' ').title()}")
        print("-" * 60)

        model = joblib.load(model_path)

        y_pred = model.predict(X_test)

        # Metrics
        accuracy = accuracy_score(y_test, y_pred)

        precision = precision_score(
            y_test,
            y_pred,
            average="weighted",
            zero_division=0
        )

        recall = recall_score(
            y_test,
            y_pred,
            average="weighted",
            zero_division=0
        )

        f1 = f1_score(
            y_test,
            y_pred,
            average="weighted",
            zero_division=0
        )

        print(f"Accuracy : {accuracy:.4f}")
        print(f"Precision: {precision:.4f}")
        print(f"Recall   : {recall:.4f}")
        print(f"F1 Score : {f1:.4f}")

        # Classification report
        print("\nClassification Report:")
        print(
            classification_report(
                y_test,
                y_pred,
                zero_division=0
            )
        )

        # Confusion matrix
        print("Confusion Matrix:")
        print(confusion_matrix(y_test, y_pred))

        results.append({
            "Cancer": cancer_name,
            "Model": model_name.replace("_", " ").title(),
            "Accuracy": round(accuracy, 4),
            "Precision": round(precision, 4),
            "Recall": round(recall, 4),
            "F1_Score": round(f1, 4)
        })


# ============================================================
# FINAL COMPARISON
# ============================================================

results_df = pd.DataFrame(results)

results_path = MODEL_DIR / "model_comparison.csv"

results_df.to_csv(
    results_path,
    index=False
)

print("\n" + "=" * 70)
print("FINAL MODEL COMPARISON")
print("=" * 70)

print(results_df.to_string(index=False))

print("\nComparison saved to:")
print(results_path)