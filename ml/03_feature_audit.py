from pathlib import Path
import pandas as pd


# --------------------------------------------------
# PATHS
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent
CLEANED_DIR = BASE_DIR / "datasets" / "cleaned"


# --------------------------------------------------
# LOAD DATASETS
# --------------------------------------------------

thyroid = pd.read_csv(CLEANED_DIR / "thyroid_cleaned.csv")
skin = pd.read_csv(CLEANED_DIR / "skin_cleaned.csv")
lung = pd.read_csv(CLEANED_DIR / "lung_cleaned.csv")
breast = pd.read_csv(CLEANED_DIR / "breast_cleaned.csv")


datasets = {
    "Thyroid Cancer": thyroid,
    "Skin Cancer": skin,
    "Lung Cancer": lung,
    "Breast Cancer": breast
}


# --------------------------------------------------
# FEATURE AUDIT
# --------------------------------------------------

for name, df in datasets.items():

    print("\n" + "=" * 80)
    print(name)
    print("=" * 80)

    print("\nColumn Information:")

    for column in df.columns:

        print("\n" + "-" * 60)
        print("Column:", column)
        print("Data Type:", df[column].dtype)
        print("Unique Values:", df[column].nunique())

        if df[column].nunique() <= 15:
            print("Values:")
            print(df[column].value_counts().head(15))

        else:
            print("Sample Values:")
            print(df[column].unique()[:10])


print("\n" + "=" * 80)
print("FEATURE AUDIT COMPLETED")
print("=" * 80)