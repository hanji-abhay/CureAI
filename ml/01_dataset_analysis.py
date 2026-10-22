from pathlib import Path

import pandas as pd

DATASETS_DIR = Path(__file__).resolve().parent.parent / "datasets"

# 1. Load Datasets

thyroid = pd.read_csv(DATASETS_DIR / "thyroid_cancer_risk_data.csv")
skin = pd.read_csv(DATASETS_DIR / "metadata.csv")
lung = pd.read_csv(DATASETS_DIR / "cancer patient data sets.csv")
breast = pd.read_csv(DATASETS_DIR / "breast_cancer_prediction.csv")

# 2. Display Dataset Information

datasets = {
    "Thyroid Cancer": thyroid,
    "Skin Cancer": skin,
    "Lung Cancer": lung,
    "Breast Cancer": breast
}


for name, df in datasets.items():

    print("\n" + "=" * 60)
    print(name)
    print("=" * 60)

    print("Rows:", df.shape[0])
    print("Columns:", df.shape[1])

    print("\nColumn Names:")
    print(df.columns.tolist())

    print("\nData Types:")
    print(df.dtypes)

    print("\nMissing Values:")
    print(df.isnull().sum())

    print("\nDuplicate Rows:")
    print(df.duplicated().sum())

    print("\nFirst 5 Rows:")
    print(df.head())