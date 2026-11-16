import { useState } from "react";
import { Link } from "react-router-dom";
import { predictThyroid } from "../utils/mlApi";
import { apiFetch } from "../utils/api";

const initialModelInputs = {
  Age: "",
  Gender: "",
  Country: "",
  Ethnicity: "",
  Family_History: "",
  Radiation_Exposure: "",
  Iodine_Deficiency: "",
  Smoking: "",
  Obesity: "",
  Diabetes: "",
  TSH_Level: "",
  T3_Level: "",
  T4_Level: "",
  Nodule_Size: "",
};

const selectFields = [
  {
    name: "Gender",
    label: "Gender",
    options: ["Female", "Male"],
  },
  {
    name: "Country",
    label: "Country",
    options: [
      "Brazil",
      "China",
      "Germany",
      "India",
      "Japan",
      "Nigeria",
      "Russia",
      "South Korea",
      "UK",
      "USA",
    ],
  },
  {
    name: "Ethnicity",
    label: "Ethnicity",
    options: ["African", "Asian", "Caucasian", "Hispanic", "Middle Eastern"],
  },
  {
    name: "Family_History",
    label: "Family history of thyroid conditions?",
    options: ["No", "Yes"],
  },
  {
    name: "Radiation_Exposure",
    label: "History of radiation exposure?",
    options: ["No", "Yes"],
  },
  {
    name: "Iodine_Deficiency",
    label: "Iodine deficiency?",
    options: ["No", "Yes"],
  },
  {
    name: "Smoking",
    label: "Smoking?",
    options: ["No", "Yes"],
  },
  {
    name: "Obesity",
    label: "Obesity?",
    options: ["No", "Yes"],
  },
  {
    name: "Diabetes",
    label: "Diabetes?",
    options: ["No", "Yes"],
  },
];

const numberFields = [
  {
    name: "Age",
    label: "Age",
    min: 15,
    max: 89,
    step: 1,
    placeholder: "Enter age",
    description: "Observed dataset range: 15–89 years.",
  },
  {
    name: "TSH_Level",
    label: "TSH level",
    min: 0.1,
    max: 10,
    step: "any",
    placeholder: "Enter TSH value",
    description: "Observed dataset range: 0.1–10.",
  },
  {
    name: "T3_Level",
    label: "T3 level",
    min: 0.5,
    max: 3.5,
    step: "any",
    placeholder: "Enter T3 value",
    description: "Observed dataset range: 0.5–3.5.",
  },
  {
    name: "T4_Level",
    label: "T4 level",
    min: 4.5,
    max: 12,
    step: "any",
    placeholder: "Enter T4 value",
    description: "Observed dataset range: 4.5–12.",
  },
  {
    name: "Nodule_Size",
    label: "Nodule size",
    min: 0,
    max: 5,
    step: "any",
    placeholder: "Enter nodule size",
    description: "Observed dataset range: 0–5.",
  },
];

function ThyroidAssessment() {
  const [modelInputs, setModelInputs] = useState(initialModelInputs);
  const [prediction, setPrediction] = useState(null);
  const [predictionError, setPredictionError] = useState("");
  const [isPredicting, setIsPredicting] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [saveError, setSaveError] = useState("");

  const completedCount = Object.values(modelInputs).filter(
    (value) => value !== "",
  ).length;

  const updateModelInput = (field, value) => {
    setModelInputs((current) => ({
      ...current,
      [field]: value,
    }));

    setPrediction(null);
    setPredictionError("");
  };

  const resetAssessment = () => {
    setModelInputs(initialModelInputs);
    setPrediction(null);
    setPredictionError("");
    setIsPredicting(false);
    setSaveStatus("");
    setSaveError("");
  };

  const handlePrediction = async (event) => {
    event.preventDefault();

    setPrediction(null);
    setPredictionError("");
    setSaveStatus("");
    setSaveError("");

    const missingFields = Object.entries(modelInputs)
      .filter(([, value]) => value === "")
      .map(([field]) => field);

    if (missingFields.length > 0) {
      setPredictionError(
        `Please complete all 14 fields. Missing: ${missingFields.join(", ")}`,
      );
      return;
    }

    const numericValues = {};

    for (const field of numberFields) {
      const value = Number(modelInputs[field.name]);

      if (!Number.isFinite(value)) {
        setPredictionError(`Please enter a valid number for ${field.label}.`);
        return;
      }

      if (value < field.min || value > field.max) {
        setPredictionError(
          `${field.label} must be between ${field.min} and ${field.max}, based on the observed training dataset range.`,
        );
        return;
      }

      if (field.name === "Age" && !Number.isInteger(value)) {
        setPredictionError("Age must be a whole number.");
        return;
      }

      numericValues[field.name] = value;
    }

    const payload = {
      ...modelInputs,
      ...numericValues,
    };

    setIsPredicting(true);

    try {
      // First, obtain the prediction from the ML API.
      const result = await predictThyroid(payload);

      // Display the prediction even if saving the record fails.
      setPrediction(result);

      // Then save the inputs and prediction to the authenticated backend.
      try {
        const response = await apiFetch("/api/assessments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assessmentType: "thyroid",
            answers: payload,
            prediction: result,
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to save your assessment.");
        }

        setSaveStatus("Your assessment has been saved successfully.");
      } catch (error) {
        setSaveError(
          error.message ||
            "Your prediction was generated, but the assessment could not be saved.",
        );
      }
    } catch (error) {
      setPredictionError(
        error.message || "Prediction failed. Please try again.",
      );
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <main className="thyroid-page">
      <style>{`
        .thyroid-page {
          --th-ink: #173b35;
          --th-deep: #0b2926;
          --th-teal: #16796b;
          --th-ivory: #f7f5ed;
          --th-white: #fffefa;
          --th-muted: #718078;
          --th-border: #e2e6dc;
          --th-lavender: #e8e0f8;
          --th-lavender-ink: #65518c;
          min-height: 100vh;
          padding: 0 6%;
          color: var(--th-ink);
          background:
            radial-gradient(ellipse at 95% 0%, rgba(220, 211, 246, .48), transparent 30rem),
            var(--th-ivory);
          font-family: "DM Sans", sans-serif;
        }

        .thyroid-page * { box-sizing: border-box; }

        .thyroid-page button,
        .thyroid-page input,
        .thyroid-page select {
          font: inherit;
        }

        .thyroid-page button:focus-visible,
        .thyroid-page a:focus-visible,
        .thyroid-page input:focus-visible,
        .thyroid-page select:focus-visible {
          outline: 3px solid #8d77bd;
          outline-offset: 3px;
        }

        .th-nav {
          min-height: 88px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-bottom: 1px solid rgba(23, 59, 53, .12);
        }

        .th-brand {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          color: var(--th-ink);
          text-decoration: none;
        }

        .th-brand-mark {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border-radius: 14px 14px 14px 5px;
          background: var(--th-deep);
          color: #9aefd4;
          font-size: 22px;
          font-weight: 700;
        }

        .th-brand-name {
          font-size: 21px;
          font-weight: 750;
          letter-spacing: -1px;
        }

        .th-brand-tagline {
          display: block;
          margin-top: 2px;
          color: var(--th-muted);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1.35px;
        }

        .th-back {
          color: var(--th-ink);
          text-decoration: none;
          font-size: 13px;
          font-weight: 650;
        }

        .th-back:hover { color: var(--th-teal); }

        .th-layout {
          width: 100%;
          max-width: 1120px;
          margin: 0 auto;
          padding: 62px 0 80px;
          display: grid;
          grid-template-columns: minmax(230px, .72fr) minmax(0, 1.55fr);
          gap: clamp(34px, 6vw, 84px);
          align-items: start;
        }

        .th-intro { position: sticky; top: 28px; }

        .th-kicker {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: var(--th-lavender-ink);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.8px;
          text-transform: uppercase;
        }

        .th-kicker-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #8e78bd;
          box-shadow: 0 0 0 4px rgba(142, 120, 189, .15);
        }

        .th-intro h1 {
          max-width: 430px;
          margin: 23px 0 17px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(39px, 4.2vw, 59px);
          line-height: 1.04;
          letter-spacing: -2px;
          font-weight: 500;
        }

        .th-intro h1 span {
          color: var(--th-teal);
          font-style: italic;
        }

        .th-intro-copy {
          max-width: 370px;
          color: #697970;
          font-size: 14px;
          line-height: 1.9;
        }

        .th-note {
          margin-top: 32px;
          padding: 18px;
          border: 1px solid rgba(101, 81, 140, .17);
          border-radius: 17px;
          background: rgba(232, 224, 248, .52);
        }

        .th-note-title {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 8px;
          color: #51436f;
          font-size: 12px;
          font-weight: 750;
        }

        .th-note p {
          margin: 0;
          color: #625d70;
          font-size: 12px;
          line-height: 1.8;
        }

        .th-progress-card {
          margin-top: 24px;
          padding: 19px;
          border-radius: 17px;
          background: var(--th-deep);
          color: #f5f6ee;
        }

        .th-progress-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          font-size: 11px;
          color: #c5d8ce;
        }

        .th-progress-label strong { color: #9aefd4; }

        .th-progress-track {
          height: 5px;
          margin-top: 14px;
          overflow: hidden;
          border-radius: 20px;
          background: rgba(255, 255, 255, .13);
        }

        .th-progress-fill {
          height: 100%;
          border-radius: inherit;
          background: #8ce6c6;
          transition: width .25s ease;
        }

        .th-form-card {
          min-width: 0;
          padding: clamp(24px, 4vw, 43px);
          border: 1px solid rgba(23, 59, 53, .09);
          border-radius: 25px;
          background: var(--th-white);
          box-shadow: 0 22px 65px rgba(24, 54, 44, .07);
        }

        .th-step-label {
          color: var(--th-lavender-ink);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.65px;
          text-transform: uppercase;
        }

        .th-form-card h2 {
          margin: 13px 0 9px;
          color: var(--th-ink);
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(27px, 3vw, 36px);
          font-weight: 500;
          letter-spacing: -.8px;
          line-height: 1.2;
        }

        .th-form-description {
          margin: 0 0 25px;
          color: var(--th-muted);
          font-size: 13px;
          line-height: 1.8;
        }

        .th-section-heading {
          margin: 30px 0 4px;
          padding-bottom: 12px;
          border-bottom: 1px solid #edf0e9;
          color: var(--th-teal);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.3px;
          text-transform: uppercase;
        }

        .th-field { margin-top: 23px; }

        .th-field-label {
          display: block;
          margin-bottom: 10px;
          color: var(--th-ink);
          font-size: 13px;
          font-weight: 750;
          line-height: 1.6;
        }

        .th-field-hint {
          display: block;
          margin-top: 5px;
          color: var(--th-muted);
          font-size: 11px;
          font-weight: 400;
          line-height: 1.7;
        }

        .th-select {
          width: 100%;
          min-height: 49px;
          padding: 0 13px;
          border: 1px solid var(--th-border);
          border-radius: 12px;
          background: #fffefa;
          color: var(--th-ink);
          font-size: 13px;
        }

        .th-select:focus {
          border-color: var(--th-teal);
          outline: none;
        }

        .th-numeric-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0 18px;
        }

        .th-option-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .th-option {
          min-height: 49px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 13px;
          border: 1px solid var(--th-border);
          border-radius: 12px;
          background: #fffefa;
          color: #40544b;
          cursor: pointer;
          text-align: left;
          font-size: 12px;
          transition: border-color .18s ease, background .18s ease;
        }

        .th-option:hover {
          border-color: #a8cabe;
        }

        .th-option.is-selected {
          border-color: var(--th-teal);
          background: #edf7f1;
          color: var(--th-deep);
          box-shadow: inset 0 0 0 1px var(--th-teal);
        }

        .th-option-indicator {
          flex: 0 0 17px;
          width: 17px;
          height: 17px;
          display: grid;
          place-items: center;
          border: 1px solid #cbd5cc;
          border-radius: 50%;
          color: white;
          font-size: 10px;
        }

        .th-option.is-selected .th-option-indicator {
          border-color: var(--th-teal);
          background: var(--th-teal);
        }

        .th-info-box {
          margin-top: 25px;
          padding: 16px;
          border: 1px solid rgba(101, 81, 140, .17);
          border-radius: 13px;
          background: #f5f1fb;
          color: #625d70;
          font-size: 12px;
          line-height: 1.8;
        }

        .th-info-box strong { color: #51436f; }

        .th-error {
          margin-top: 20px;
          padding: 14px 16px;
          border: 1px solid #e8b9b9;
          border-radius: 12px;
          background: #fff1f1;
          color: #9a3434;
          font-size: 12px;
          line-height: 1.7;
        }

        .th-result {
          margin-top: 24px;
          padding: 22px;
          border: 1px solid rgba(22, 121, 107, .18);
          border-radius: 16px;
          background: #edf7f1;
        }

        .th-result-label {
          color: var(--th-teal);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .th-result-value {
          margin: 10px 0;
          color: var(--th-deep);
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(27px, 4vw, 37px);
          overflow-wrap: anywhere;
        }

        .th-result p {
          margin: 7px 0 0;
          color: #51675b;
          font-size: 12px;
          line-height: 1.8;
        }

        .th-form-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 34px;
          padding-top: 23px;
          border-top: 1px solid #edf0e9;
        }

        .th-btn {
          min-height: 47px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 0 19px;
          border: 1px solid transparent;
          border-radius: 11px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 750;
          transition: background .18s ease, transform .18s ease;
        }

        .th-btn:hover { transform: translateY(-1px); }

        .th-btn-primary {
          background: var(--th-deep);
          color: white;
        }

        .th-btn-primary:hover { background: var(--th-teal); }

        .th-btn-secondary {
          border-color: var(--th-border);
          background: white;
          color: var(--th-ink);
        }

        .th-btn-secondary:hover { background: #f2f5ee; }

        .th-btn:disabled {
          opacity: .55;
          cursor: not-allowed;
          transform: none;
        }

        .th-footer {
          max-width: 1120px;
          margin: 0 auto;
          padding: 23px 0 29px;
          border-top: 1px solid rgba(23, 59, 53, .12);
          display: flex;
          justify-content: space-between;
          gap: 20px;
          color: var(--th-muted);
          font-size: 10px;
          line-height: 1.7;
        }

        @media (max-width: 820px) {
          .thyroid-page { padding: 0 5%; }

          .th-layout {
            grid-template-columns: 1fr;
            gap: 30px;
            padding-top: 43px;
          }

          .th-intro { position: static; }

          .th-intro h1 {
            max-width: 570px;
            font-size: clamp(38px, 8vw, 54px);
          }

          .th-intro-copy { max-width: 570px; }
          .th-note { margin-top: 20px; }
          .th-progress-card { margin-top: 15px; }
        }

        @media (max-width: 520px) {
          .th-nav { min-height: 74px; }
          .th-brand-mark { width: 35px; height: 35px; }
          .th-brand-name { font-size: 19px; }
          .th-brand-tagline { font-size: 8px; letter-spacing: .9px; }
          .th-back { font-size: 11px; }

          .th-layout {
            padding-top: 32px;
            padding-bottom: 45px;
          }

          .th-form-card {
            padding: 22px 18px;
            border-radius: 19px;
          }

          .th-option-grid,
          .th-numeric-grid {
            grid-template-columns: 1fr;
          }

          .th-option { min-height: 47px; }

          .th-footer {
            flex-direction: column;
            gap: 5px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .thyroid-page *,
          .thyroid-page *::before,
          .thyroid-page *::after {
            scroll-behavior: auto !important;
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      <nav className="th-nav" aria-label="Main navigation">
        <Link className="th-brand" to="/" aria-label="CureAI home">
          <span className="th-brand-mark" aria-hidden="true">
            C
          </span>
          <span>
            <span className="th-brand-name">CureAI</span>
            <span className="th-brand-tagline">INTELLIGENCE FOR WELLNESS</span>
          </span>
        </Link>

        <Link className="th-back" to="/">
          ← Back to home
        </Link>
      </nav>

      <div className="th-layout">
        <aside className="th-intro">
          <div className="th-kicker">
            <span className="th-kicker-dot" />
            Endocrine health
          </div>

          <h1>
            Understand your health, <span>one step at a time.</span>
          </h1>

          <p className="th-intro-copy">
            Provide the information requested by the thyroid assessment model.
            Your responses will be processed to generate an AI-assisted
            educational classification.
          </p>

          <div className="th-note">
            <div className="th-note-title">
              <span aria-hidden="true">✳</span>A note on your wellbeing
            </div>
            <p>
              This tool cannot diagnose thyroid cancer or determine your medical
              condition. Please consult a qualified healthcare professional for
              proper evaluation and interpretation of clinical tests.
            </p>
          </div>

          <div className="th-progress-card">
            <div className="th-progress-label">
              <span>Model inputs completed</span>
              <strong>{completedCount} / 14</strong>
            </div>

            <div
              className="th-progress-track"
              role="progressbar"
              aria-label="Model inputs completed"
              aria-valuemin={0}
              aria-valuemax={14}
              aria-valuenow={completedCount}
            >
              <div
                className="th-progress-fill"
                style={{ width: `${(completedCount / 14) * 100}%` }}
              />
            </div>
          </div>
        </aside>

        <section className="th-form-card" aria-live="polite">
          <div className="th-step-label">AI MODEL ASSESSMENT</div>

          <h2>
            {prediction ? "Your model result" : "Thyroid assessment details"}
          </h2>

          {!prediction && (
            <>
              <p className="th-form-description">
                Complete all 14 fields using accurate information. These are the
                inputs required by the current trained model.
              </p>

              <form onSubmit={handlePrediction}>
                <div className="th-section-heading">Personal information</div>

                <div className="th-numeric-grid">
                  {numberFields
                    .filter((field) => field.name === "Age")
                    .map((field) => (
                      <div className="th-field" key={field.name}>
                        <label
                          className="th-field-label"
                          htmlFor={`th-${field.name}`}
                        >
                          {field.label}
                        </label>

                        <input
                          id={`th-${field.name}`}
                          className="th-select"
                          type="number"
                          min={field.min}
                          max={field.max}
                          step={field.step}
                          required
                          value={modelInputs[field.name]}
                          onChange={(event) =>
                            updateModelInput(field.name, event.target.value)
                          }
                          placeholder={field.placeholder}
                        />

                        <span className="th-field-hint">
                          {field.description}
                        </span>
                      </div>
                    ))}
                </div>

                {selectFields.slice(0, 3).map((field) => (
                  <div className="th-field" key={field.name}>
                    <label
                      className="th-field-label"
                      htmlFor={`th-${field.name}`}
                    >
                      {field.label}
                    </label>

                    <select
                      id={`th-${field.name}`}
                      className="th-select"
                      required
                      value={modelInputs[field.name]}
                      onChange={(event) =>
                        updateModelInput(field.name, event.target.value)
                      }
                    >
                      <option value="">Select an option</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

                <div className="th-section-heading">
                  Health and lifestyle information
                </div>

                {selectFields.slice(3).map((field) => (
                  <div className="th-field" key={field.name}>
                    <span className="th-field-label">{field.label}</span>

                    <div className="th-option-grid">
                      {field.options.map((option) => {
                        const selected = modelInputs[field.name] === option;

                        return (
                          <button
                            type="button"
                            key={option}
                            className={`th-option ${selected ? "is-selected" : ""}`}
                            aria-pressed={selected}
                            onClick={() => updateModelInput(field.name, option)}
                          >
                            <span className="th-option-indicator">
                              {selected ? "✓" : ""}
                            </span>
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="th-section-heading">
                  Laboratory and nodule measurements
                </div>

                <div className="th-numeric-grid">
                  {numberFields
                    .filter((field) => field.name !== "Age")
                    .map((field) => (
                      <div className="th-field" key={field.name}>
                        <label
                          className="th-field-label"
                          htmlFor={`th-${field.name}`}
                        >
                          {field.label}
                        </label>

                        <input
                          id={`th-${field.name}`}
                          className="th-select"
                          type="number"
                          min={field.min}
                          max={field.max}
                          step={field.step}
                          required
                          value={modelInputs[field.name]}
                          onChange={(event) =>
                            updateModelInput(field.name, event.target.value)
                          }
                          placeholder={field.placeholder}
                        />

                        <span className="th-field-hint">
                          {field.description}
                        </span>
                      </div>
                    ))}
                </div>

                <div className="th-info-box">
                  <strong>Important measurement information</strong>
                  <br />
                  The displayed numeric limits represent the minimum and maximum
                  values observed in the training dataset. They are not clinical
                  reference ranges. The dataset does not document measurement
                  units for TSH, T3, T4 or nodule size. Do not use this
                  prototype to interpret actual clinical test results. Do not
                  guess measurements you do not know.
                </div>

                {predictionError && (
                  <div className="th-error" role="alert">
                    {predictionError}
                  </div>
                )}

                <div className="th-form-footer">
                  <button
                    type="button"
                    className="th-btn th-btn-secondary"
                    onClick={resetAssessment}
                    disabled={isPredicting}
                  >
                    Reset form ↻
                  </button>

                  <button
                    type="submit"
                    className="th-btn th-btn-primary"
                    disabled={isPredicting || completedCount !== 14}
                  >
                    {isPredicting ? "Generating..." : "Run AI assessment"}
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </form>
            </>
          )}

          {prediction && (
            <>
              <p className="th-form-description">
                The connected assessment API returned the following
                classification.
              </p>

              <div className="th-result">
                <div className="th-result-label">Model classification</div>

                <div className="th-result-value">
                  {String(prediction.prediction ?? "No class returned")}
                </div>

                {prediction.message && <p>{prediction.message}</p>}
              </div>

              {saveStatus && (
                <div className="th-info-box" role="status">
                  <strong>✓ Saved to your records</strong>
                  <br />
                  {saveStatus}
                </div>
              )}

              {saveError && (
                <div className="th-error" role="alert">
                  Your prediction was generated, but it could not be saved.
                  <br />
                  {saveError}
                </div>
              )}

              <div className="th-info-box">
                This is an experimental AI-generated classification, not a
                confirmed medical finding, diagnosis, or validated cancer
                probability. It must not be used to determine whether a person
                has benign or malignant disease. Consult a qualified healthcare
                professional for medical evaluation.
              </div>

              <div className="th-form-footer">
                <button
                  type="button"
                  className="th-btn th-btn-secondary"
                  onClick={() => {
                    setPrediction(null);
                    setPredictionError("");
                    setSaveStatus("");
                    setSaveError("");
                  }}
                >
                  ← Back to assessment
                </button>

                <button
                  type="button"
                  className="th-btn th-btn-primary"
                  onClick={resetAssessment}
                >
                  Start again ↻
                </button>
              </div>
            </>
          )}
        </section>
      </div>

      <footer className="th-footer">
        <span>
          © {new Date().getFullYear()} CureAI · Intelligence for Wellness
        </span>
        <span>
          Informational support, not a substitute for professional medical care.
        </span>
      </footer>
    </main>
  );
}

export default ThyroidAssessment;
