from pathlib import Path

import pandas as pd


# ==========================================
# 1. Set Dataset Paths
# ==========================================

BASE_DIR = Path(__file__).resolve().parent.parent
DATASETS_DIR = BASE_DIR / "datasets"
CLEANED_DIR = DATASETS_DIR / "cleaned"

# Create cleaned folder if it doesn't exist
CLEANED_DIR.mkdir(exist_ok=True)


# ==========================================
# 2. Load Datasets
# ==========================================

thyroid = pd.read_csv(DATASETS_DIR / "thyroid_cancer_risk_data.csv")
skin = pd.read_csv(DATASETS_DIR / "metadata.csv")
lung = pd.read_csv(DATASETS_DIR / "cancer patient data sets.csv")
breast = pd.read_csv(DATASETS_DIR / "breast_cancer_prediction.csv")


# ==========================================
# 3. Remove Unnecessary Identifier Columns
# ==========================================

# Thyroid
thyroid = thyroid.drop(
    columns=["Patient_ID"],
    errors="ignore"
)

# Skin
skin = skin.drop(
    columns=["patient_id", "lesion_id", "img_id"],
    errors="ignore"
)

# Lung
lung = lung.drop(
    columns=["index", "Patient Id"],
    errors="ignore"
)

# Breast
breast = breast.drop(
    columns=["Patient_ID"],
    errors="ignore"
)


# ==========================================
# 4. Handle Missing Values
# ==========================================

def fill_missing_values(df):
    
    # Numeric columns
    numeric_columns = df.select_dtypes(
        include=["int64", "float64"]
    ).columns

    for column in numeric_columns:
        df[column] = df[column].fillna(
            df[column].median()
        )

    # Categorical columns
    categorical_columns = df.select_dtypes(
        include=["object", "str"]
    ).columns

    for column in categorical_columns:
        if df[column].isnull().sum() > 0:
            df[column] = df[column].fillna(
                df[column].mode()[0]
            )

    return df


thyroid = fill_missing_values(thyroid)
skin = fill_missing_values(skin)
lung = fill_missing_values(lung)
breast = fill_missing_values(breast)


# ==========================================
# 5. Display Cleaning Results
# ==========================================

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

    print("\nRemaining Missing Values:")
    print(df.isnull().sum().sum())

#    print("Duplicate Rows:", df.duplicated().sum())

# ==========================================
# 6. Investigate Duplicate Rows
# ==========================================

print("\n" + "=" * 60)
print("DUPLICATE ANALYSIS")
print("=" * 60)

for name, df in datasets.items():

    duplicate_count = df.duplicated().sum()

    print(f"\n{name}")
    print(f"Duplicate rows: {duplicate_count}")

    if duplicate_count > 0:
        print("Percentage of duplicate rows:",
              round((duplicate_count / len(df)) * 100, 2), "%")


# ==========================================
# 7. Show Duplicate Examples
# ==========================================

print("\n" + "=" * 60)
print("DUPLICATE EXAMPLES")
print("=" * 60)


for name, df in datasets.items():

    duplicate_rows = df[df.duplicated(keep=False)]

    if not duplicate_rows.empty:

        print(f"\n{name}")
        print(duplicate_rows.head(10))

# ==========================================
# 8. Save Cleaned Datasets
# ==========================================

thyroid.to_csv(
    CLEANED_DIR / "thyroid_cleaned.csv",
    index=False
)

skin.to_csv(
    CLEANED_DIR / "skin_cleaned.csv",
    index=False
)

lung.to_csv(
    CLEANED_DIR / "lung_cleaned.csv",
    index=False
)

breast.to_csv(
    CLEANED_DIR / "breast_cleaned.csv",
    index=False
)


print("\n" + "=" * 60)
print("DATA CLEANING COMPLETED")
print("=" * 60)

print(f"\nCleaned datasets saved in:")
print(CLEANED_DIR)