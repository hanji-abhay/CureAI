from pydantic import BaseModel


# ==================================================
# THYROID CANCER
# ==================================================

class ThyroidInput(BaseModel):
    Age: int
    Gender: str
    Country: str
    Ethnicity: str
    Family_History: str
    Radiation_Exposure: str
    Iodine_Deficiency: str
    Smoking: str
    Obesity: str
    Diabetes: str
    TSH_Level: float
    T3_Level: float
    T4_Level: float
    Nodule_Size: float


# ==================================================
# SKIN CANCER
# ==================================================

class SkinInput(BaseModel):
    smoke: bool
    drink: bool
    background_father: str
    background_mother: str
    age: int
    pesticide: bool
    gender: str
    skin_cancer_history: bool
    cancer_history: bool
    has_piped_water: bool
    has_sewage_system: bool
    fitspatrick: float
    region: str
    diameter_1: float
    diameter_2: float
    itch: str
    grew: str
    hurt: str
    changed: str
    bleed: str
    elevation: str

# ==================================================
# LUNG CANCER
# ==================================================

class LungInput(BaseModel):
    Age: int
    Gender: int
    Air_Pollution: int
    Alcohol_use: int
    Dust_Allergy: int
    OccuPational_Hazards: int
    Genetic_Risk: int
    chronic_Lung_Disease: int
    Balanced_Diet: int
    Obesity: int
    Smoking: int
    Passive_Smoker: int
    Chest_Pain: int
    Coughing_of_Blood: int
    Fatigue: int
    Weight_Loss: int
    Shortness_of_Breath: int
    Wheezing: int
    Swallowing_Difficulty: int
    Clubbing_of_Finger_Nails: int
    Frequent_Cold: int
    Dry_Cough: int
    Snoring: int


# ==================================================
# BREAST CANCER
# ==================================================

class BreastInput(BaseModel):
    Age: int
    Gender: str
    BMI: float
    Family_History: str
    Smoking: str
    Alcohol_Consumption: str
    Physical_Activity: str
    Hormone_Therapy: str
    Menopause_Status: str
    Genetic_Mutation: str
    Tumor_Size_cm: float
    Mammogram_Result: str
    Blood_Pressure: float
    Cholesterol: float
    Diabetes: str
    Exercise_Days_Per_Week: int
    Breastfeeding_History: str
    Annual_Income_USD: float
