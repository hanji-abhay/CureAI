from pathlib import Path
import pandas as pd
import matplotlib.pyplot as plt


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


# --------------------------------------------------
# 1. TARGET DISTRIBUTION
# --------------------------------------------------

datasets = {
    "Thyroid Cancer": (thyroid, "Diagnosis"),
    "Skin Cancer": (skin, "diagnostic"),
    "Lung Cancer": (lung, "Level"),
    "Breast Cancer": (breast, "Cancer")
}


for name, (df, target) in datasets.items():

    print("\n" + "=" * 70)
    print(name)
    print("=" * 70)

    print("\nTarget Distribution:")
    print(df[target].value_counts())

    print("\nTarget Percentage:")
    print(
        (df[target].value_counts(normalize=True) * 100)
        .round(2)
    )


# --------------------------------------------------
# 2. THYROID TARGET GRAPH
# --------------------------------------------------

plt.figure(figsize=(7, 5))

thyroid["Diagnosis"].value_counts().plot(
    kind="bar"
)

plt.title("Thyroid Cancer Diagnosis Distribution")
plt.xlabel("Diagnosis")
plt.ylabel("Number of Patients")
plt.xticks(rotation=0)
plt.tight_layout()
plt.show()


# --------------------------------------------------
# 3. SKIN CANCER TARGET GRAPH
# --------------------------------------------------

plt.figure(figsize=(8, 5))

skin["diagnostic"].value_counts().plot(
    kind="bar"
)

plt.title("Skin Cancer Diagnostic Distribution")
plt.xlabel("Diagnostic Class")
plt.ylabel("Number of Records")
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()


# --------------------------------------------------
# 4. LUNG CANCER TARGET GRAPH
# --------------------------------------------------

plt.figure(figsize=(7, 5))

lung["Level"].value_counts().plot(
    kind="bar"
)

plt.title("Lung Cancer Level Distribution")
plt.xlabel("Cancer Level")
plt.ylabel("Number of Records")
plt.xticks(rotation=0)
plt.tight_layout()
plt.show()


# --------------------------------------------------
# 5. BREAST CANCER TARGET GRAPH
# --------------------------------------------------

plt.figure(figsize=(7, 5))

breast["Cancer"].value_counts().plot(
    kind="bar"
)

plt.title("Breast Cancer Distribution")
plt.xlabel("Cancer")
plt.ylabel("Number of Records")
plt.xticks(rotation=0)
plt.tight_layout()
plt.show()


print("\n" + "=" * 70)
print("EDA BASIC ANALYSIS COMPLETED")
print("=" * 70)