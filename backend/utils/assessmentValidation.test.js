import test from "node:test";
import assert from "node:assert/strict";

import { validateAnswers, validatePrediction } from "./assessmentValidation.js";

const validAnswers = {
  thyroid: {
    Age: 25,
    Gender: "Male",
    Country: "India",
    Ethnicity: "Asian",
    Family_History: "No",
    Radiation_Exposure: "No",
    Iodine_Deficiency: "No",
    Smoking: "No",
    Obesity: "No",
    Diabetes: "No",
    TSH_Level: 2.5,
    T3_Level: 1.2,
    T4_Level: 8.5,
    Nodule_Size: 1.5,
  },

  skin: {
    smoke: false,
    drink: false,
    background_father: "Type 1",
    background_mother: "Type 2",
    age: 25,
    pesticide: false,
    gender: "Male",
    skin_cancer_history: false,
    cancer_history: false,
    has_piped_water: true,
    has_sewage_system: true,
    fitspatrick: 3,
    region: "Back",
    diameter_1: 2.5,
    diameter_2: 3.5,
    itch: "No",
    grew: "No",
    hurt: "No",
    changed: "No",
    bleed: "No",
    elevation: "No",
  },

  lung: {
    Age: 25,
    Gender: 1,
    Air_Pollution: 2,
    Alcohol_use: 1,
    Dust_Allergy: 2,
    OccuPational_Hazards: 1,
    Genetic_Risk: 1,
    chronic_Lung_Disease: 1,
    Balanced_Diet: 2,
    Obesity: 1,
    Smoking: 1,
    Passive_Smoker: 1,
    Chest_Pain: 1,
    Coughing_of_Blood: 1,
    Fatigue: 1,
    Weight_Loss: 1,
    Shortness_of_Breath: 1,
    Wheezing: 1,
    Swallowing_Difficulty: 1,
    Clubbing_of_Finger_Nails: 1,
    Frequent_Cold: 1,
    Dry_Cough: 1,
    Snoring: 1,
  },

  breast: {
    Age: 25,
    Gender: "Female",
    BMI: 22.5,
    Family_History: "No",
    Smoking: "No",
    Alcohol_Consumption: "No",
    Physical_Activity: "Regular",
    Hormone_Therapy: "No",
    Menopause_Status: "Pre",
    Genetic_Mutation: "No",
    Tumor_Size_cm: 1.5,
    Mammogram_Result: "Normal",
    Blood_Pressure: 120,
    Cholesterol: 180,
    Diabetes: "No",
    Exercise_Days_Per_Week: 3,
    Breastfeeding_History: "Yes",
    Annual_Income_USD: 50000,
  },
};

const cancerTypes = {
  thyroid: "Thyroid Cancer",
  skin: "Skin Cancer",
  lung: "Lung Cancer",
  breast: "Breast Cancer",
};

for (const [type, answers] of Object.entries(validAnswers)) {
  test(`${type}: accepts valid assessment answers`, () => {
    assert.equal(validateAnswers(type, answers), null);
  });

  test(`${type}: rejects a missing required field`, () => {
    const incomplete = { ...answers };
    delete incomplete[Object.keys(answers)[0]];

    assert.match(
      validateAnswers(type, incomplete),
      /^Missing required assessment input:/,
    );
  });

  test(`${type}: rejects an unexpected field`, () => {
    assert.equal(
      validateAnswers(type, { ...answers, unexpected: "value" }),
      "The assessment contains an unsupported input field.",
    );
  });
}

test("rejects unsupported assessment types", () => {
  assert.equal(
    validateAnswers("unknown", validAnswers.thyroid),
    "This assessment type is not supported.",
  );
});

test("rejects non-object assessment answers", () => {
  assert.equal(
    validateAnswers("thyroid", null),
    "Please provide valid assessment inputs.",
  );
});

test("rejects invalid integer values", () => {
  assert.equal(
    validateAnswers("thyroid", {
      ...validAnswers.thyroid,
      Age: 25.5,
    }),
    "Invalid integer value for Age.",
  );
});

test("rejects non-finite numeric values", () => {
  assert.equal(
    validateAnswers("thyroid", {
      ...validAnswers.thyroid,
      TSH_Level: Infinity,
    }),
    "Invalid numeric value for TSH_Level.",
  );
});

test("rejects strings longer than 500 characters", () => {
  assert.equal(
    validateAnswers("thyroid", {
      ...validAnswers.thyroid,
      Country: "A".repeat(501),
    }),
    "Invalid value for Country.",
  );
});

for (const [type, cancerType] of Object.entries(cancerTypes)) {
  test(`${type}: accepts a valid prediction`, () => {
    assert.equal(
      validatePrediction(type, {
        cancer_type: cancerType,
        prediction: "Benign",
        message: "Preliminary classification.",
      }),
      null,
    );
  });
}

test("rejects a prediction with an incorrect cancer category", () => {
  assert.equal(
    validatePrediction("thyroid", {
      cancer_type: "Skin Cancer",
      prediction: "Benign",
      message: "Preliminary classification.",
    }),
    "The prediction category does not match the assessment type.",
  );
});

test("rejects a prediction with an invalid structure", () => {
  assert.equal(
    validatePrediction("thyroid", {
      cancer_type: "Thyroid Cancer",
      prediction: "Benign",
    }),
    "The prediction response has an invalid structure.",
  );
});

test("rejects a non-finite numeric prediction", () => {
  assert.equal(
    validatePrediction("thyroid", {
      cancer_type: "Thyroid Cancer",
      prediction: Infinity,
      message: "Preliminary classification.",
    }),
    "The prediction value is invalid.",
  );
});

test("rejects a prediction message longer than 500 characters", () => {
  assert.equal(
    validatePrediction("thyroid", {
      cancer_type: "Thyroid Cancer",
      prediction: "Benign",
      message: "A".repeat(501),
    }),
    "The prediction message is invalid.",
  );
});
