from pathlib import Path

import pandas as pd


# ==========================================
# 1. Paths
# ==========================================

BASE_DIR = Path(__file__).resolve().parent.parent
CLEANED_DIR = BASE_DIR / "datasets" / "cleaned"


# ==========================================
# 2. Load Cleaned Datasets
# ==========================================

skin = pd.read_csv(CLEANED_DIR / "skin_cleaned.csv")
lung = pd.read_csv(CLEANED_DIR / "lung_cleaned.csv")


# ==========================================
# 3. Skin Dataset Analysis
# ==========================================

print("\n" + "=" * 60)
print("SKIN CANCER DUPLICATE CHECK")
print("=" * 60)

print("Total rows:", len(skin))
print("Unique rows:", len(skin.drop_duplicates()))
print("Duplicate rows:", skin.duplicated().sum())

print("\nDiagnostic distribution:")
print(skin["diagnostic"].value_counts())


# ==========================================
# 4. Lung Dataset Analysis
# ==========================================

print("\n" + "=" * 60)
print("LUNG CANCER DUPLICATE CHECK")
print("=" * 60)

print("Total rows:", len(lung))
print("Unique rows:", len(lung.drop_duplicates()))
print("Duplicate rows:", lung.duplicated().sum())

print("\nLevel distribution:")
print(lung["Level"].value_counts())


# ==========================================
# 5. Check repeated rows and their targets
# ==========================================

print("\n" + "=" * 60)
print("LUNG REPEATED FEATURE COMBINATIONS")
print("=" * 60)

feature_columns = [
    column for column in lung.columns
    if column != "Level"
]

grouped = (
    lung
    .groupby(feature_columns, dropna=False)["Level"]
    .agg(["count", "nunique"])
    .sort_values("count", ascending=False)
)

print("\nTop repeated combinations:")
print(grouped.head(20))


# ==========================================
# 6. Check conflicting labels
# ==========================================

conflicting = grouped[grouped["nunique"] > 1]

print("\n" + "=" * 60)
print("CONFLICTING DUPLICATE LABELS")
print("=" * 60)

print("Number of feature combinations with different Level labels:",
      len(conflicting))

print(conflicting.head(20))