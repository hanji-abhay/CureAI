from pathlib import Path
import pandas as pd

BASE_DIR= Path(__file__).resolve().parent.parent
CLEANED_DIR = BASE_DIR/"datasets"/"cleaned"

#load cleaned datatset
thyroid = pd.read_csv(CLEANED_DIR/"thyroid_cleaned.csv")
skin = pd.read_csv(CLEANED_DIR/"skin_cleaned.csv")
lung = pd.read_csv(CLEANED_DIR/"lung_cleaned.csv")
breast = pd.read_csv(CLEANED_DIR/"breast_cleaned.csv")

datasets = {
    "Thyroid Cancer":(thyroid,"Diagnosis"),
    "Skin Cancer":(skin,"diagnostic"),
    "Lung Cancer":(lung,"Level"),
    "Breast Cancer":(breast,"Cancer")
}

for name, (df, target) in datasets.items():

    print("\n" + "=" * 70)
    print(name)
    print("=" * 70)

    print("\nTarget Column:")
    print(target)

    print("\nTarget Data Type:")
    print(df[target].dtype)

    print("\nTarget Values:")
    print(df[target].value_counts())

    print("\nTarget Percentages:")
    print(
        (df[target].value_counts(normalize=True) * 100)
        .round(2)
    )

    print("\nAll Features:")
    for column in df.columns:
        if column != target:
            print("-", column)
