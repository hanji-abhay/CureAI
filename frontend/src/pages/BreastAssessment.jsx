import { useState } from "react";
import { Link } from "react-router-dom";
import { predictBreast } from "../utils/mlApi";
import { apiFetch } from "../utils/api";

const initialModelInput = {
  Age: "",
  Gender: "",
  BMI: "",
  Family_History: "",
  Smoking: "",
  Alcohol_Consumption: "",
  Physical_Activity: "",
  Hormone_Therapy: "",
  Menopause_Status: "",
  Genetic_Mutation: "",
  Tumor_Size_cm: "",
  Mammogram_Result: "",
  Blood_Pressure: "",
  Cholesterol: "",
  Diabetes: "",
  Exercise_Days_Per_Week: "",
  Breastfeeding_History: "",
  Annual_Income_USD: "",
};

const breastModelFields = [
  {
    key: "Age",
    label: "Age",
    type: "number",
    step: "1",
    min: "1",
    hint: "Enter your age in years.",
  },
  {
    key: "Gender",
    label: "Gender",
    options: ["Female", "Male"],
  },
  {
    key: "BMI",
    label: "BMI",
    type: "number",
    step: "any",
    min: "0",
    hint: "Use a value from a reliable measurement.",
  },
  {
    key: "Family_History",
    label: "Family History",
    options: ["No", "Yes"],
  },
  {
    key: "Smoking",
    label: "Smoking",
    options: ["No", "Yes"],
  },
  {
    key: "Alcohol_Consumption",
    label: "Alcohol Consumption",
    options: ["No", "Yes"],
  },
  {
    key: "Physical_Activity",
    label: "Physical Activity",
    options: ["Low", "Moderate", "High"],
  },
  {
    key: "Hormone_Therapy",
    label: "Hormone Therapy",
    options: ["No", "Yes"],
  },
  {
    key: "Menopause_Status",
    label: "Menopause Status",
    options: ["Pre", "Post"],
  },
  {
    key: "Genetic_Mutation",
    label: "Genetic Mutation",
    options: ["Negative", "Positive"],
    hint: "Use a confirmed genetic test result. Do not guess.",
  },
  {
    key: "Tumor_Size_cm",
    label: "Tumor Size (cm)",
    type: "number",
    step: "any",
    min: "0",
    hint: "Requires a confirmed medical measurement.",
  },
  {
    key: "Mammogram_Result",
    label: "Mammogram Result",
    options: ["Normal", "Abnormal", "Suspicious"],
    hint: "Use the result stated in your mammogram report.",
  },
  {
    key: "Blood_Pressure",
    label: "Blood Pressure",
    type: "number",
    step: "any",
    min: "0",
    hint: "Enter a measured value. The dataset unit and format should be verified.",
  },
  {
    key: "Cholesterol",
    label: "Cholesterol",
    type: "number",
    step: "any",
    min: "0",
    hint: "Use a measured value. Confirm the expected unit.",
  },
  {
    key: "Diabetes",
    label: "Diabetes",
    options: ["No", "Yes"],
  },
  {
    key: "Exercise_Days_Per_Week",
    label: "Exercise Days Per Week",
    type: "number",
    step: "1",
    min: "0",
    max: "7",
  },
  {
    key: "Breastfeeding_History",
    label: "Breastfeeding History",
    options: ["No", "Yes", "Not Applicable"],
  },
  {
    key: "Annual_Income_USD",
    label: "Annual Income (USD)",
    type: "number",
    step: "any",
    min: "0",
    hint: "Required by the model dataset, although it is not a medical measurement.",
  },
];

function BreastModelField({
  label,
  name,
  value,
  onChange,
  options,
  type = "text",
  step,
  min,
  max,
  hint,
}) {
  return (
    <label className="breast-model-field">
      <span className="breast-model-label">{label}</span>

      {options ? (
        <select
          name={name}
          value={value}
          onChange={(event) => onChange(name, event.target.value)}
          required
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={(event) => onChange(name, event.target.value)}
          step={step}
          min={min}
          max={max}
          required
        />
      )}

      {hint && <small className="breast-field-hint">{hint}</small>}
    </label>
  );
}

function BreastAssessment() {
  const [modelInput, setModelInput] = useState(initialModelInput);
  const [prediction, setPrediction] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [predictionError, setPredictionError] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [saveError, setSaveError] = useState("");

  const updateModelInput = (key, value) => {
    setModelInput((previous) => ({
      ...previous,
      [key]: value,
    }));

    setPrediction(null);
    setPredictionError("");
    setSaveStatus("");
    setSaveError("");
  };

  const resetAssessment = () => {
    setModelInput({ ...initialModelInput });
    setPrediction(null);
    setPredictionError("");
    setPredicting(false);
    setSaveStatus("");
    setSaveError("");
  };

  const handleBreastPrediction = async (event) => {
    event.preventDefault();

    setPrediction(null);
    setPredictionError("");
    setSaveStatus("");
    setSaveError("");

    // Check that every required model field has been supplied.
    const missingFields = breastModelFields.filter(
      (field) => String(modelInput[field.key]).trim() === "",
    );

    if (missingFields.length > 0) {
      setPredictionError(
        `Please complete all required fields: ${missingFields
          .map((field) => field.label)
          .join(", ")}.`,
      );
      return;
    }

    // Validate numeric fields before sending the request.
    const numericFields = [
      "Age",
      "BMI",
      "Tumor_Size_cm",
      "Blood_Pressure",
      "Cholesterol",
      "Exercise_Days_Per_Week",
      "Annual_Income_USD",
    ];

    for (const key of numericFields) {
      const value = Number(modelInput[key]);

      if (!Number.isFinite(value) || value < 0) {
        setPredictionError(
          `Please enter a valid non-negative number for ${key.replaceAll("_", " ")}.`,
        );
        return;
      }
    }

    if (
      !Number.isInteger(Number(modelInput.Age)) ||
      Number(modelInput.Age) < 1
    ) {
      setPredictionError("Please enter a valid whole-number age.");
      return;
    }

    const exerciseDays = Number(modelInput.Exercise_Days_Per_Week);

    if (
      !Number.isInteger(exerciseDays) ||
      exerciseDays < 0 ||
      exerciseDays > 7
    ) {
      setPredictionError(
        "Exercise days per week must be a whole number between 0 and 7.",
      );
      return;
    }

    const payload = {
      ...modelInput,
      Age: Number(modelInput.Age),
      BMI: Number(modelInput.BMI),
      Tumor_Size_cm: Number(modelInput.Tumor_Size_cm),
      Blood_Pressure: Number(modelInput.Blood_Pressure),
      Cholesterol: Number(modelInput.Cholesterol),
      Exercise_Days_Per_Week: exerciseDays,
      Annual_Income_USD: Number(modelInput.Annual_Income_USD),
    };

    setPredicting(true);

    try {
      const result = await predictBreast(payload);
      setPrediction(result);

      // Save the completed assessment in MongoDB.
      try {
        const response = await apiFetch("/api/assessments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assessmentType: "breast",
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
        error.response?.data?.detail ||
          error.message ||
          "Unable to get a prediction. Please try again.",
      );
    } finally {
      setPredicting(false);
    }
  };

  const completedFields = breastModelFields.filter(
    (field) => String(modelInput[field.key]).trim() !== "",
  ).length;

  return (
    <main className="breast-page">
      <style>{`
        .breast-page {
          --breast-pink: #c85c82;
          --breast-pink-dark: #98405f;
          --breast-pink-light: #f8e7ed;
          --breast-ink: #193a36;
          --breast-muted: #71817b;
          --breast-line: #e7e8e1;
          min-height: 100vh;
          padding-bottom: 56px;
          background: #f7f5ef;
          color: var(--breast-ink);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .breast-page * {
          box-sizing: border-box;
        }

        .breast-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 22px max(6%, calc((100% - 1180px) / 2));
          border-bottom: 1px solid rgba(25, 58, 54, 0.09);
          background: rgba(250, 249, 245, 0.92);
        }

        .breast-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--breast-ink);
          text-decoration: none;
          font-size: 21px;
          font-weight: 750;
          letter-spacing: -0.8px;
        }

        .breast-brand-mark {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: #214e46;
          color: white;
          font-size: 17px;
        }

        .breast-brand-ai {
          color: var(--breast-pink);
        }

        .breast-back {
          color: #526b63;
          text-decoration: none;
          font-size: 13px;
          font-weight: 650;
        }

        .breast-back:hover {
          color: var(--breast-pink-dark);
        }

        .breast-shell {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 24px 0;
        }

        .breast-heading {
          max-width: 660px;
          margin: 0 auto 30px;
          text-align: center;
        }

        .breast-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: var(--breast-pink-light);
          color: var(--breast-pink-dark);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.7px;
          text-transform: uppercase;
        }

        .breast-heading h1 {
          margin: 18px 0 12px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(35px, 5vw, 51px);
          font-weight: 500;
          line-height: 1.12;
          letter-spacing: -1.5px;
        }

        .breast-heading h1 span {
          color: var(--breast-pink-dark);
          font-style: italic;
        }

        .breast-heading p {
          max-width: 560px;
          margin: 0 auto;
          color: var(--breast-muted);
          font-size: 14px;
          line-height: 1.8;
        }

        .breast-progress-card {
          margin-bottom: 20px;
          padding: 19px 23px;
          border: 1px solid var(--breast-line);
          border-radius: 16px;
          background: #fffefa;
        }

        .breast-progress-top {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
          font-size: 12px;
          font-weight: 700;
        }

        .breast-progress-count {
          color: var(--breast-pink-dark);
        }

        .breast-progress-track {
          width: 100%;
          height: 6px;
          overflow: hidden;
          border-radius: 20px;
          background: #eeeae3;
        }

        .breast-progress-fill {
          height: 100%;
          border-radius: inherit;
          background: var(--breast-pink);
          transition: width 180ms ease;
        }

        .breast-form-card {
          padding: clamp(22px, 4vw, 38px);
          border: 1px solid var(--breast-line);
          border-radius: 22px;
          background: #fffefa;
          box-shadow: 0 15px 50px rgba(31, 56, 46, 0.045);
        }

        .breast-section-kicker {
          margin: 0 0 10px;
          color: var(--breast-pink-dark);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.7px;
          text-transform: uppercase;
        }

        .breast-section-title {
          margin: 0 0 9px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(25px, 3.5vw, 33px);
          font-weight: 500;
          letter-spacing: -0.7px;
        }

        .breast-section-subtitle {
          margin: 0 0 27px;
          color: var(--breast-muted);
          font-size: 13px;
          line-height: 1.75;
        }

        .breast-model-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 21px 18px;
          margin: 24px 0;
        }

        .breast-model-field {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .breast-model-label {
          font-size: 12px;
          font-weight: 750;
        }

        .breast-model-field input,
        .breast-model-field select {
          width: 100%;
          min-height: 44px;
          padding: 11px 13px;
          border: 1px solid #dfe3da;
          border-radius: 10px;
          outline: none;
          background: white;
          color: var(--breast-ink);
          font: inherit;
          font-size: 13px;
          transition: border-color 160ms ease,
            box-shadow 160ms ease;
        }

        .breast-model-field input:focus,
        .breast-model-field select:focus {
          border-color: var(--breast-pink);
          box-shadow: 0 0 0 3px rgba(200, 92, 130, 0.1);
        }

        .breast-field-hint {
          color: var(--breast-muted);
          font-size: 10px;
          line-height: 1.6;
        }

        .breast-note {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-top: 22px;
          padding: 15px 16px;
          border: 1px solid #eed4de;
          border-radius: 13px;
          background: #fff6f8;
          color: #71465a;
          font-size: 11px;
          line-height: 1.75;
        }

        .breast-note-icon {
          flex-shrink: 0;
          font-size: 16px;
        }

        .breast-error {
          margin-top: 18px;
          padding: 12px 14px;
          border: 1px solid #f0c8c5;
          border-radius: 10px;
          background: #fff4f2;
          color: #b42318;
          font-size: 12px;
          line-height: 1.6;
        }

        .breast-result {
          margin-top: 20px;
          padding: 20px;
          border: 1px solid #d8e8df;
          border-radius: 14px;
          background: #f4faf6;
        }

        .breast-result h3 {
          margin: 0 0 12px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 22px;
          font-weight: 500;
        }

        .breast-result p {
          margin: 8px 0;
          font-size: 12px;
          line-height: 1.7;
          overflow-wrap: anywhere;
        }

        .breast-form-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
          padding-top: 22px;
          border-top: 1px solid #eeeee7;
        }

        .breast-footer-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .breast-button {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 12px 20px;
          border: 1px solid transparent;
          border-radius: 11px;
          font: inherit;
          font-size: 12px;
          font-weight: 750;
          cursor: pointer;
          transition: background 160ms ease,
            transform 160ms ease, opacity 160ms ease;
        }

        .breast-button:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .breast-button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .breast-button-primary {
          background: var(--breast-pink-dark);
          color: white;
        }

        .breast-button-primary:hover:not(:disabled) {
          background: #81334f;
        }

        .breast-button-secondary {
          border-color: #e1e4dc;
          background: #fffefa;
          color: var(--breast-ink);
        }

        .breast-footer {
          max-width: 580px;
          margin: 25px auto 0;
          color: #859088;
          font-size: 10px;
          line-height: 1.8;
          text-align: center;
        }

        @media (max-width: 620px) {
          .breast-nav {
            padding: 17px 20px;
          }

          .breast-brand {
            font-size: 19px;
          }

          .breast-shell {
            padding: 29px 15px 0;
          }

          .breast-heading {
            margin-bottom: 23px;
          }

          .breast-model-grid {
            grid-template-columns: 1fr;
            gap: 17px;
          }

          .breast-form-footer {
            align-items: stretch;
          }

          .breast-footer-actions {
            width: 100%;
          }

          .breast-footer-actions .breast-button {
            flex: 1;
          }

          .breast-form-footer > .breast-button {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .breast-page *,
          .breast-page *::before,
          .breast-page *::after {
            transition: none !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      <nav className="breast-nav">
        <Link to="/" className="breast-brand" aria-label="CureAI home">
          <span className="breast-brand-mark" aria-hidden="true">
            ✳
          </span>
          <span>
            Cure<span className="breast-brand-ai">AI</span>
          </span>
        </Link>

        <Link to="/" className="breast-back">
          ← Back to home
        </Link>
      </nav>

      <div className="breast-shell">
        <header className="breast-heading">
          <span className="breast-eyebrow">
            <span aria-hidden="true">♡</span>
            Breast health assessment
          </span>

          <h1>
            Your health, your <span>story.</span>
          </h1>

          <p>
            Provide the information requested by the experimental
            machine-learning model. Use reliable measurements and confirmed
            medical reports wherever applicable.
          </p>
        </header>

        <section className="breast-progress-card">
          <div className="breast-progress-top">
            <span>Assessment information</span>
            <span className="breast-progress-count">
              {completedFields} / {breastModelFields.length} fields completed
            </span>
          </div>

          <div
            className="breast-progress-track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={breastModelFields.length}
            aria-valuenow={completedFields}
          >
            <div
              className="breast-progress-fill"
              style={{
                width: `${(completedFields / breastModelFields.length) * 100}%`,
              }}
            />
          </div>
        </section>

        <section className="breast-form-card">
          <p className="breast-section-kicker">CUREAI · BREAST HEALTH</p>

          <h2 className="breast-section-title">
            AI-assisted Breast Assessment
          </h2>

          <p className="breast-section-subtitle">
            Complete all 18 fields to submit the model input. Fields requiring
            medical reports or measurements should only be completed using
            confirmed information.
          </p>

          <form onSubmit={handleBreastPrediction}>
            <div className="breast-model-grid">
              {breastModelFields.map((field) => (
                <BreastModelField
                  key={field.key}
                  label={field.label}
                  name={field.key}
                  value={modelInput[field.key]}
                  onChange={updateModelInput}
                  options={field.options}
                  type={field.type}
                  step={field.step}
                  min={field.min}
                  max={field.max}
                  hint={field.hint}
                />
              ))}
            </div>

            <div className="breast-note">
              <span className="breast-note-icon" aria-hidden="true">
                ♡
              </span>
              <span>
                <strong>Important:</strong> Do not guess tumor size, mammogram
                results, genetic test results, blood pressure, or cholesterol.
                Annual income is included because the existing model requires
                it, not because it is a medical measurement. If you do not have
                reliable information, do not submit an invented value.
              </span>
            </div>

            {predictionError && (
              <p role="alert" className="breast-error">
                {predictionError}
              </p>
            )}

            {prediction && (
              <div className="breast-result" role="status">
                <h3>Model Output</h3>
                <p>
                  <strong>Predicted class:</strong>{" "}
                  {String(prediction.prediction)}
                </p>
                {prediction.message && <p>{prediction.message}</p>}
                <p>
                  This is an experimental machine-learning output. Its classes
                  have not been clinically validated or interpreted here. It is
                  not a cancer diagnosis, screening result, or confirmation that
                  cancer is present or absent.
                </p>
              </div>
            )}

            {saveStatus && (
              <div className="breast-result" role="status">
                <strong>✓ Saved to your records</strong>
                <p>{saveStatus}</p>
              </div>
            )}

            {saveError && (
              <div className="breast-error" role="alert">
                <strong>
                  Your prediction was generated, but it could not be saved.
                </strong>
                <p>{saveError}</p>
              </div>
            )}

            <div className="breast-form-footer">
              <button
                type="button"
                className="breast-button breast-button-secondary"
                onClick={resetAssessment}
                disabled={predicting}
              >
                Reset Form ↻
              </button>

              <button
                type="submit"
                className="breast-button breast-button-primary"
                disabled={predicting}
              >
                {predicting ? "Processing..." : "Run AI Assessment →"}
              </button>
            </div>
          </form>
        </section>

        <p className="breast-footer">
          CureAI · Intelligence for Wellness
          <br />
          Educational support only. This tool does not replace professional
          medical advice, examination, screening, or diagnosis.
        </p>
      </div>
    </main>
  );
}

export default BreastAssessment;
