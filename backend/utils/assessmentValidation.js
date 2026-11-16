const assessmentSchemas = {
  thyroid: {
    Age: "integer",
    Gender: "string",
    Country: "string",
    Ethnicity: "string",
    Family_History: "string",
    Radiation_Exposure: "string",
    Iodine_Deficiency: "string",
    Smoking: "string",
    Obesity: "string",
    Diabetes: "string",
    TSH_Level: "number",
    T3_Level: "number",
    T4_Level: "number",
    Nodule_Size: "number",
  },

  skin: {
    smoke: "boolean",
    drink: "boolean",
    background_father: "string",
    background_mother: "string",
    age: "integer",
    pesticide: "boolean",
    gender: "string",
    skin_cancer_history: "boolean",
    cancer_history: "boolean",
    has_piped_water: "boolean",
    has_sewage_system: "boolean",
    fitspatrick: "number",
    region: "string",
    diameter_1: "number",
    diameter_2: "number",
    itch: "string",
    grew: "string",
    hurt: "string",
    changed: "string",
    bleed: "string",
    elevation: "string",
  },

  lung: {
    Age: "integer",
    Gender: "integer",
    Air_Pollution: "integer",
    Alcohol_use: "integer",
    Dust_Allergy: "integer",
    OccuPational_Hazards: "integer",
    Genetic_Risk: "integer",
    chronic_Lung_Disease: "integer",
    Balanced_Diet: "integer",
    Obesity: "integer",
    Smoking: "integer",
    Passive_Smoker: "integer",
    Chest_Pain: "integer",
    Coughing_of_Blood: "integer",
    Fatigue: "integer",
    Weight_Loss: "integer",
    Shortness_of_Breath: "integer",
    Wheezing: "integer",
    Swallowing_Difficulty: "integer",
    Clubbing_of_Finger_Nails: "integer",
    Frequent_Cold: "integer",
    Dry_Cough: "integer",
    Snoring: "integer",
  },

  breast: {
    Age: "integer",
    Gender: "string",
    BMI: "number",
    Family_History: "string",
    Smoking: "string",
    Alcohol_Consumption: "string",
    Physical_Activity: "string",
    Hormone_Therapy: "string",
    Menopause_Status: "string",
    Genetic_Mutation: "string",
    Tumor_Size_cm: "number",
    Mammogram_Result: "string",
    Blood_Pressure: "number",
    Cholesterol: "number",
    Diabetes: "string",
    Exercise_Days_Per_Week: "integer",
    Breastfeeding_History: "string",
    Annual_Income_USD: "number",
  },
};

const expectedCancerTypes = {
  thyroid: "Thyroid Cancer",
  skin: "Skin Cancer",
  lung: "Lung Cancer",
  breast: "Breast Cancer",
};

export function validateAnswers(assessmentType, answers) {
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return "Please provide valid assessment inputs.";
  }

  const schema = assessmentSchemas[assessmentType];

  if (!schema) {
    return "This assessment type is not supported.";
  }

  const expectedFields = Object.keys(schema);
  const receivedFields = Object.keys(answers);

  const missingField = expectedFields.find(
    (field) => !Object.prototype.hasOwnProperty.call(answers, field),
  );

  if (missingField) {
    return `Missing required assessment input: ${missingField}.`;
  }

  const unexpectedField = receivedFields.find(
    (field) => !Object.prototype.hasOwnProperty.call(schema, field),
  );

  if (unexpectedField) {
    return "The assessment contains an unsupported input field.";
  }

  for (const [field, expectedType] of Object.entries(schema)) {
    const value = answers[field];

    if (expectedType === "string") {
      if (typeof value !== "string" || value.length > 500) {
        return `Invalid value for ${field}.`;
      }
    }

    if (expectedType === "boolean" && typeof value !== "boolean") {
      return `Invalid value for ${field}.`;
    }

    if (
      expectedType === "number" &&
      (typeof value !== "number" || !Number.isFinite(value))
    ) {
      return `Invalid numeric value for ${field}.`;
    }

    if (
      expectedType === "integer" &&
      (typeof value !== "number" || !Number.isSafeInteger(value))
    ) {
      return `Invalid integer value for ${field}.`;
    }
  }

  return null;
}

export function validatePrediction(assessmentType, prediction) {
  if (
    !prediction ||
    typeof prediction !== "object" ||
    Array.isArray(prediction)
  ) {
    return "Please provide a valid prediction response.";
  }

  const expectedFields = ["cancer_type", "prediction", "message"];
  const receivedFields = Object.keys(prediction);

  if (
    receivedFields.length !== expectedFields.length ||
    expectedFields.some((field) => !receivedFields.includes(field))
  ) {
    return "The prediction response has an invalid structure.";
  }

  if (prediction.cancer_type !== expectedCancerTypes[assessmentType]) {
    return "The prediction category does not match the assessment type.";
  }

  const predictionValue = prediction.prediction;

  if (
    typeof predictionValue !== "string" &&
    !(typeof predictionValue === "number" && Number.isFinite(predictionValue))
  ) {
    return "The prediction value is invalid.";
  }

  if (
    typeof prediction.message !== "string" ||
    prediction.message.length > 500
  ) {
    return "The prediction message is invalid.";
  }

  return null;
}
