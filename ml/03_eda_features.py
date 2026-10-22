from pathlib import Path
import pandas as pd
import matplotlib.pyplot as plt

plt.close("all")

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


# ==================================================
# THYROID CANCER
# ==================================================

print("\n" + "=" * 70)
print("THYROID CANCER FEATURE ANALYSIS")
print("=" * 70)

print("\nNumerical Features:")
print(
    thyroid.select_dtypes(include="number")
    .describe()
)


# Age distribution
plt.figure(figsize=(8, 5))

thyroid["Age"].plot(
    kind="hist",
    bins=30
)

plt.title("Thyroid Cancer - Age Distribution")
plt.xlabel("Age")
plt.ylabel("Number of Patients")
plt.tight_layout()
plt.show()
plt.close()

# Diagnosis vs Age
plt.figure(figsize=(8, 5))

thyroid.boxplot(
    column="Age",
    by="Diagnosis"
)

plt.title("Thyroid Cancer - Age by Diagnosis")
plt.suptitle("")
plt.xlabel("Diagnosis")
plt.ylabel("Age")
plt.tight_layout()
plt.show()
plt.close()

# TSH distribution
plt.figure(figsize=(8, 5))

thyroid["TSH_Level"].plot(
    kind="hist",
    bins=30
)

plt.title("Thyroid Cancer - TSH Level Distribution")
plt.xlabel("TSH Level")
plt.ylabel("Number of Patients")
plt.tight_layout()
plt.show()
plt.close()

# ==================================================
# SKIN CANCER
# ==================================================

print("\n" + "=" * 70)
print("SKIN CANCER FEATURE ANALYSIS")
print("=" * 70)

print("\nNumerical Features:")
print(
    skin.select_dtypes(include="number")
    .describe()
)


# Age distribution
plt.figure(figsize=(8, 5))

skin["age"].plot(
    kind="hist",
    bins=30
)

plt.title("Skin Cancer - Age Distribution")
plt.xlabel("Age")
plt.ylabel("Number of Records")
plt.tight_layout()
plt.show()
plt.close()


# Diagnostic vs Age
plt.figure(figsize=(9, 5))

skin.boxplot(
    column="age",
    by="diagnostic"
)

plt.title("Skin Cancer - Age by Diagnostic Class")
plt.suptitle("")
plt.xlabel("Diagnostic Class")
plt.ylabel("Age")
plt.tight_layout()
plt.show()
plt.close()

# Lesion diameter
plt.figure(figsize=(8, 5))

skin["diameter_1"].plot(
    kind="hist",
    bins=30
)

plt.title("Skin Cancer - Lesion Diameter 1 Distribution")
plt.xlabel("Diameter 1")
plt.ylabel("Number of Records")
plt.tight_layout()
plt.show()
plt.close()

# ==================================================
# LUNG CANCER
# ==================================================

print("\n" + "=" * 70)
print("LUNG CANCER FEATURE ANALYSIS")
print("=" * 70)

print("\nNumerical Features:")
print(
    lung.select_dtypes(include="number")
    .describe()
)


# Age distribution
plt.figure(figsize=(8, 5))

lung["Age"].plot(
    kind="hist",
    bins=25
)

plt.title("Lung Cancer - Age Distribution")
plt.xlabel("Age")
plt.ylabel("Number of Records")
plt.tight_layout()
plt.show()
plt.close()

# Level vs Age
plt.figure(figsize=(8, 5))

lung.boxplot(
    column="Age",
    by="Level"
)

plt.title("Lung Cancer - Age by Cancer Level")
plt.suptitle("")
plt.xlabel("Cancer Level")
plt.ylabel("Age")
plt.tight_layout()
plt.show()
plt.close()

# Smoking distribution
plt.figure(figsize=(8, 5))

lung["Smoking"].value_counts().sort_index().plot(
    kind="bar"
)

plt.title("Lung Cancer - Smoking Distribution")
plt.xlabel("Smoking Level")
plt.ylabel("Number of Records")
plt.tight_layout()
plt.show()
plt.close()

# ==================================================
# BREAST CANCER
# ==================================================

print("\n" + "=" * 70)
print("BREAST CANCER FEATURE ANALYSIS")
print("=" * 70)

print("\nNumerical Features:")
print(
    breast.select_dtypes(include="number")
    .describe()
)


# Age distribution
plt.figure(figsize=(8, 5))

breast["Age"].plot(
    kind="hist",
    bins=30
)

plt.title("Breast Cancer - Age Distribution")
plt.xlabel("Age")
plt.ylabel("Number of Records")
plt.tight_layout()
plt.show()
plt.close()

# Cancer vs Age
plt.figure(figsize=(8, 5))

breast.boxplot(
    column="Age",
    by="Cancer"
)

plt.title("Breast Cancer - Age by Cancer Status")
plt.suptitle("")
plt.xlabel("Cancer")
plt.ylabel("Age")
plt.tight_layout()
plt.show()
plt.close()

# Tumor size
plt.figure(figsize=(8, 5))

breast["Tumor_Size_cm"].plot(
    kind="hist",
    bins=30
)

plt.title("Breast Cancer - Tumor Size Distribution")
plt.xlabel("Tumor Size (cm)")
plt.ylabel("Number of Records")
plt.tight_layout()
plt.show()
plt.close()

# --------------------------------------------------
# COMPLETED
# --------------------------------------------------

print("\n" + "=" * 70)
print("EDA FEATURE ANALYSIS COMPLETED")
print("=" * 70)