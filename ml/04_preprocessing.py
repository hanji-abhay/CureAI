from pathlib import Path

import pandas as pd

from sklearn.model_selection import train_test_split, GroupShuffleSplit
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

CLEANED_DIR = BASE_DIR / "datasets" / "cleaned"
PROCESSED_DIR = BASE_DIR / "datasets" / "processed"

PROCESSED_DIR.mkdir(exist_ok=True)


# ============================================================
# HELPER FUNCTION
# ============================================================

def preprocess_dataset(X_train, X_test, y_train, y_test, name):
    """
    Fit preprocessing only on training data,
    then transform both training and testing data.
    """

    # Identify numerical and categorical columns
    numerical_columns = X_train.select_dtypes(
        include=["number"]
    ).columns.tolist()

    categorical_columns = X_train.select_dtypes(
        include=["object", "string", "category", "boolean", "bool"]
    ).columns.tolist()

    print("\nNumerical columns:", numerical_columns)
    print("Categorical columns:", categorical_columns)

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

    # Preprocessing
    preprocessor = ColumnTransformer(
        transformers=transformers
    )

    # IMPORTANT:
    # Fit ONLY on training data
    X_train_processed = preprocessor.fit_transform(X_train)

    # Only transform test data
    X_test_processed = preprocessor.transform(X_test)

    # Get generated column names
    feature_names = preprocessor.get_feature_names_out()

    # Convert to DataFrame
    X_train_processed = pd.DataFrame(
        X_train_processed,
        columns=feature_names
    )

    X_test_processed = pd.DataFrame(
        X_test_processed,
        columns=feature_names
    )

    # Add target
    X_train_processed["Target"] = y_train.reset_index(drop=True)
    X_test_processed["Target"] = y_test.reset_index(drop=True)

    # Save
    train_path = PROCESSED_DIR / f"{name}_train.csv"
    test_path = PROCESSED_DIR / f"{name}_test.csv"

    X_train_processed.to_csv(train_path, index=False)
    X_test_processed.to_csv(test_path, index=False)

    print("\n" + "-" * 60)
    print(f"{name.upper()} PREPROCESSING COMPLETED")
    print("-" * 60)

    print("Training rows:", len(X_train_processed))
    print("Testing rows:", len(X_test_processed))
    print("Processed features:", len(feature_names))

    print("Saved:")
    print(train_path)
    print(test_path)


# ============================================================
# 1. THYROID CANCER
# ============================================================

print("\n" + "=" * 70)
print("THYROID CANCER PREPROCESSING")
print("=" * 70)

thyroid = pd.read_csv(
    CLEANED_DIR / "thyroid_cleaned.csv"
)

# Remove possible leakage feature
thyroid = thyroid.drop(
    columns=["Thyroid_Cancer_Risk"],
    errors="ignore"
)

X = thyroid.drop(columns=["Diagnosis"])
y = thyroid["Diagnosis"]

# Split FIRST
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

preprocess_dataset(
    X_train,
    X_test,
    y_train,
    y_test,
    "thyroid"
)


# ============================================================
# 2. SKIN CANCER
# ============================================================

print("\n" + "=" * 70)
print("SKIN CANCER PREPROCESSING")
print("=" * 70)

skin = pd.read_csv(
    CLEANED_DIR / "skin_cleaned.csv"
)

# Remove biopsy information because it can leak
# diagnostic information.
skin = skin.drop(
    columns=["biopsed"],
    errors="ignore"
)

X = skin.drop(columns=["diagnostic"])
y = skin["diagnostic"]

# Stratified train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

preprocess_dataset(
    X_train,
    X_test,
    y_train,
    y_test,
    "skin"
)


# ============================================================
# 3. LUNG CANCER
# ============================================================

print("\n" + "=" * 70)
print("LUNG CANCER PREPROCESSING")
print("=" * 70)

lung = pd.read_csv(
    CLEANED_DIR / "lung_cleaned.csv"
)

X = lung.drop(columns=["Level"])
y = lung["Level"]


# ------------------------------------------------------------
# Create groups using identical feature combinations.
# This prevents identical records from being placed in
# both training and testing sets.
# ------------------------------------------------------------

#group_columns = X.columns.tolist()

groups = (
    X.astype(str)
    .agg("|".join, axis=1)
)

# Group-aware split
group_splitter = GroupShuffleSplit(
    n_splits=1,
    test_size=0.20,
    random_state=42
)

train_indices, test_indices = next(
    group_splitter.split(
        X,
        y,
        groups=groups
    )
)

X_train = X.iloc[train_indices]
X_test = X.iloc[test_indices]

y_train = y.iloc[train_indices]
y_test = y.iloc[test_indices]

print("\nLung training target distribution:")
print(y_train.value_counts())

print("\nLung testing target distribution:")
print(y_test.value_counts())

preprocess_dataset(
    X_train,
    X_test,
    y_train,
    y_test,
    "lung"
)


# ============================================================
# 4. BREAST CANCER
# ============================================================

print("\n" + "=" * 70)
print("BREAST CANCER PREPROCESSING")
print("=" * 70)

breast = pd.read_csv(
    CLEANED_DIR / "breast_cleaned.csv"
)

# Remove features that can leak information about
# an already-established cancer diagnosis.
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

# Split FIRST
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

preprocess_dataset(
    X_train,
    X_test,
    y_train,
    y_test,
    "breast"
)


# ============================================================
# FINAL MESSAGE
# ============================================================

print("\n" + "=" * 70)
print("ALL DATASETS PREPROCESSED SUCCESSFULLY")
print("=" * 70)

print("\nProcessed files saved in:")
print(PROCESSED_DIR)