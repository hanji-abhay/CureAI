import { useState } from "react";
import { Link } from "react-router-dom";
import { predictLung } from "../utils/mlApi";
import { apiFetch } from "../utils/api";

const initialLungModelInput = {
  Age: "",
  Gender: "",
  Air_Pollution: "",
  Alcohol_use: "",
  Dust_Allergy: "",
  OccuPational_Hazards: "",
  Genetic_Risk: "",
  chronic_Lung_Disease: "",
  Balanced_Diet: "",
  Obesity: "",
  Smoking: "",
  Passive_Smoker: "",
  Chest_Pain: "",
  Coughing_of_Blood: "",
  Fatigue: "",
  Weight_Loss: "",
  Shortness_of_Breath: "",
  Wheezing: "",
  Swallowing_Difficulty: "",
  Clubbing_of_Finger_Nails: "",
  Frequent_Cold: "",
  Dry_Cough: "",
  Snoring: "",
};

const lungModelFields = [
  {
    key: "Gender",
    label: "Gender",
    options: [
      { label: "Male", value: 1 },
      { label: "Female", value: 2 },
    ],
  },
  { key: "Air_Pollution", label: "Air Pollution", min: 1, max: 8 },
  { key: "Alcohol_use", label: "Alcohol use", min: 1, max: 8 },
  { key: "Dust_Allergy", label: "Dust Allergy", min: 1, max: 8 },
  {
    key: "OccuPational_Hazards",
    label: "Occupational Hazards",
    min: 1,
    max: 8,
  },
  { key: "Genetic_Risk", label: "Genetic Risk", min: 1, max: 7 },
  {
    key: "chronic_Lung_Disease",
    label: "Chronic Lung Disease",
    min: 1,
    max: 7,
  },
  { key: "Balanced_Diet", label: "Balanced Diet", min: 1, max: 7 },
  { key: "Obesity", label: "Obesity", min: 1, max: 7 },
  { key: "Smoking", label: "Smoking", min: 1, max: 8 },
  { key: "Passive_Smoker", label: "Passive Smoker", min: 1, max: 8 },
  { key: "Chest_Pain", label: "Chest Pain", min: 1, max: 9 },
  { key: "Coughing_of_Blood", label: "Coughing of Blood", min: 1, max: 9 },
  { key: "Fatigue", label: "Fatigue", options: [1, 2, 3, 4, 5, 6, 8, 9] },
  { key: "Weight_Loss", label: "Weight Loss", min: 1, max: 8 },
  {
    key: "Shortness_of_Breath",
    label: "Shortness of Breath",
    options: [1, 2, 3, 4, 5, 6, 7, 9],
  },
  { key: "Wheezing", label: "Wheezing", min: 1, max: 8 },
  {
    key: "Swallowing_Difficulty",
    label: "Swallowing Difficulty",
    min: 1,
    max: 8,
  },
  {
    key: "Clubbing_of_Finger_Nails",
    label: "Clubbing of Finger Nails",
    min: 1,
    max: 9,
  },
  { key: "Frequent_Cold", label: "Frequent Cold", min: 1, max: 7 },
  { key: "Dry_Cough", label: "Dry Cough", min: 1, max: 7 },
  { key: "Snoring", label: "Snoring", min: 1, max: 7 },
];

function LungAssessment() {
  const [modelInput, setModelInput] = useState(initialLungModelInput);
  const [prediction, setPrediction] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [predictionError, setPredictionError] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [saveError, setSaveError] = useState("");

  const completedCount = Object.values(modelInput).filter(
    (value) => value !== "",
  ).length;

  const updateModelInput = (field, value) => {
    setModelInput((previous) => ({
      ...previous,
      [field]: value,
    }));
    setPrediction(null);
    setPredictionError("");
    setSaveStatus("");
    setSaveError("");
  };

  const resetAssessment = () => {
    setModelInput({ ...initialLungModelInput });
    setPrediction(null);
    setPredictionError("");
    setPredicting(false);
    setSaveStatus("");
    setSaveError("");
  };

  const handlePrediction = async (event) => {
    event.preventDefault();

    setPrediction(null);
    setPredictionError("");
    setSaveStatus("");
    setSaveError("");

    if (Object.values(modelInput).some((value) => value === "")) {
      setPredictionError("Please complete all 23 model input fields.");
      return;
    }

    const payload = Object.fromEntries(
      Object.entries(modelInput).map(([key, value]) => [key, Number(value)]),
    );

    if (
      !Number.isInteger(payload.Age) ||
      payload.Age < 14 ||
      payload.Age > 73
    ) {
      setPredictionError("Age must be a whole number between 14 and 73.");
      return;
    }

    for (const field of lungModelFields) {
      const value = payload[field.key];

      const validOptions = field.options
        ? field.options.map((option) =>
            typeof option === "object" ? option.value : option,
          )
        : Array.from(
            { length: field.max - field.min + 1 },
            (_, index) => field.min + index,
          );

      if (!Number.isInteger(value) || !validOptions.includes(value)) {
        setPredictionError(
          `Please enter a valid dataset code for ${field.label}.`,
        );
        return;
      }
    }

    setPredicting(true);

    try {
      const result = await predictLung(payload);
      setPrediction(result);

      // Save the completed assessment in MongoDB.
      try {
        const response = await apiFetch("/api/assessments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assessmentType: "lung",
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
        error.message || "Unable to connect to the lung prediction service.",
      );
    } finally {
      setPredicting(false);
    }
  };

  return (
    <main className="lung-page">
      <style>{`
        .lung-page {
          --lung-ink: #173b35;
          --lung-deep: #0b2926;
          --lung-teal: #16796b;
          --lung-muted: #718078;
          --lung-border: #e2e6dc;
          --lung-blue: #dceafa;
          --lung-blue-ink: #426b9a;
          min-height: 100vh;
          padding: 0 6%;
          color: var(--lung-ink);
          background:
            radial-gradient(ellipse at 95% 0%, rgba(205, 224, 249, .65), transparent 30rem),
            #f7f5ed;
          font-family: "DM Sans", sans-serif;
        }

        .lung-page * { box-sizing: border-box; }
        .lung-page button, .lung-page input, .lung-page select { font: inherit; }

        .lung-page button:focus-visible,
        .lung-page a:focus-visible,
        .lung-page select:focus-visible,
        .lung-page input:focus-visible {
          outline: 3px solid #6d94c5;
          outline-offset: 3px;
        }

        .lung-nav {
          min-height: 88px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          border-bottom: 1px solid rgba(23, 59, 53, .12);
        }

        .lung-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          color: var(--lung-ink);
          text-decoration: none;
        }

        .lung-brand-mark {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border-radius: 14px 14px 14px 5px;
          background: var(--lung-deep);
          color: #9aefd4;
          font-size: 22px;
          font-weight: 750;
        }

        .lung-brand-name {
          font-size: 21px;
          font-weight: 750;
          letter-spacing: -1px;
        }

        .lung-brand-tagline {
          display: block;
          margin-top: 2px;
          color: var(--lung-muted);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1.35px;
        }

        .lung-back {
          color: var(--lung-ink);
          text-decoration: none;
          font-size: 13px;
          font-weight: 650;
        }

        .lung-back:hover { color: var(--lung-teal); }

        .lung-layout {
          width: 100%;
          max-width: 1120px;
          margin: 0 auto;
          padding: 62px 0 80px;
          display: grid;
          grid-template-columns: minmax(230px, .72fr) minmax(0, 1.55fr);
          gap: clamp(34px, 6vw, 84px);
          align-items: start;
        }

        .lung-intro { position: sticky; top: 28px; }

        .lung-kicker {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: var(--lung-blue-ink);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.8px;
          text-transform: uppercase;
        }

        .lung-kicker-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #7199c9;
          box-shadow: 0 0 0 4px rgba(113, 153, 201, .17);
        }

        .lung-intro h1 {
          max-width: 440px;
          margin: 23px 0 17px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(39px, 4.2vw, 59px);
          line-height: 1.04;
          letter-spacing: -2px;
          font-weight: 500;
        }

        .lung-intro h1 span {
          color: var(--lung-teal);
          font-style: italic;
        }

        .lung-intro-copy {
          max-width: 370px;
          color: #697970;
          font-size: 14px;
          line-height: 1.9;
        }

        .lung-note {
          margin-top: 32px;
          padding: 18px;
          border: 1px solid rgba(113, 153, 201, .27);
          border-radius: 17px;
          background: rgba(220, 234, 250, .63);
        }

        .lung-note-title {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 8px;
          color: #3c5d85;
          font-size: 12px;
          font-weight: 750;
        }

        .lung-note p {
          margin: 0;
          color: #566b82;
          font-size: 12px;
          line-height: 1.8;
        }

        .lung-progress-card {
          margin-top: 24px;
          padding: 19px;
          border-radius: 17px;
          background: var(--lung-deep);
          color: #f5f6ee;
        }

        .lung-progress-label {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          color: #c5d8ce;
          font-size: 11px;
        }

        .lung-progress-label strong { color: #9aefd4; }

        .lung-progress-track {
          height: 5px;
          margin-top: 14px;
          overflow: hidden;
          border-radius: 20px;
          background: rgba(255, 255, 255, .13);
        }

        .lung-progress-fill {
          height: 100%;
          border-radius: inherit;
          background: #8eb9ee;
          transition: width .25s ease;
        }

        .lung-form-card {
          min-width: 0;
          padding: clamp(24px, 4vw, 43px);
          border: 1px solid rgba(23, 59, 53, .09);
          border-radius: 25px;
          background: #fffefa;
          box-shadow: 0 22px 65px rgba(24, 54, 44, .07);
        }

        .lung-step-label {
          color: var(--lung-blue-ink);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.65px;
          text-transform: uppercase;
        }

        .lung-form-card h2 {
          margin: 13px 0 9px;
          color: var(--lung-ink);
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(27px, 3vw, 36px);
          font-weight: 500;
          letter-spacing: -.8px;
          line-height: 1.2;
        }

        .lung-description {
          margin: 0 0 27px;
          color: var(--lung-muted);
          font-size: 13px;
          line-height: 1.8;
        }

        .lung-input-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 19px 16px;
        }

        .lung-field {
          display: block;
          min-width: 0;
        }

        .lung-field-label {
          display: block;
          margin-bottom: 8px;
          color: var(--lung-ink);
          font-size: 12px;
          font-weight: 750;
          line-height: 1.6;
        }

        .lung-field-hint {
          display: block;
          margin-top: 4px;
          color: var(--lung-muted);
          font-size: 10px;
          font-weight: 400;
        }

        .lung-select, .lung-number {
          width: 100%;
          min-height: 47px;
          padding: 0 12px;
          border: 1px solid var(--lung-border);
          border-radius: 11px;
          background: #fffefa;
          color: var(--lung-ink);
          font-size: 13px;
        }


.lung-range {
  width: 100%;
  height: 25px;
  margin: 10px 0 2px;
  cursor: pointer;
  accent-color: var(--lung-teal);
}

.lung-range-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
  color: var(--lung-muted);
  font-size: 9px;
}

.lung-range-meta strong {
  color: var(--lung-teal);
  font-size: 10px;
}


        .lung-info {
          margin-top: 24px;
          padding: 16px;
          border: 1px solid rgba(113, 153, 201, .27);
          border-radius: 13px;
          background: #edf4fc;
          color: #536980;
          font-size: 11px;
          line-height: 1.8;
        }

        .lung-error {
          margin-top: 18px;
          padding: 12px 14px;
          border: 1px solid #f0c5c2;
          border-radius: 10px;
          background: #fff3f2;
          color: #b42318;
          font-size: 12px;
          line-height: 1.6;
        }

        .lung-result {
          margin-top: 23px;
          padding: 20px;
          border: 1px solid #d8e7dc;
          border-radius: 15px;
          background: #f2f7f1;
        }

        .lung-result h3 {
          margin: 0 0 13px;
          color: var(--lung-ink);
          font-family: Georgia, "Times New Roman", serif;
          font-size: 23px;
          font-weight: 500;
        }

        .lung-result-label {
          color: var(--lung-muted);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .lung-result-value {
          margin: 7px 0 12px;
          color: var(--lung-teal);
          font-size: 25px;
          font-weight: 750;
          overflow-wrap: anywhere;
        }

        .lung-result p {
          margin: 8px 0 0;
          color: #53665c;
          font-size: 12px;
          line-height: 1.8;
        }

        .lung-form-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
          padding-top: 23px;
          border-top: 1px solid #edf0e9;
        }

        .lung-btn {
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

        .lung-btn:hover { transform: translateY(-1px); }
        .lung-btn-primary { background: var(--lung-deep); color: white; }
        .lung-btn-primary:hover { background: var(--lung-teal); }
        .lung-btn-secondary {
          border-color: var(--lung-border);
          background: white;
          color: var(--lung-ink);
        }
        .lung-btn-secondary:hover { background: #f2f5ee; }
        .lung-btn:disabled {
          opacity: .55;
          cursor: not-allowed;
          transform: none;
        }

        .lung-footer {
          max-width: 1120px;
          margin: 0 auto;
          padding: 23px 0 29px;
          border-top: 1px solid rgba(23, 59, 53, .12);
          display: flex;
          justify-content: space-between;
          gap: 20px;
          color: var(--lung-muted);
          font-size: 10px;
          line-height: 1.7;
        }

        @media (max-width: 820px) {
          .lung-page { padding: 0 5%; }
          .lung-layout {
            grid-template-columns: 1fr;
            gap: 30px;
            padding-top: 43px;
          }
          .lung-intro { position: static; }
          .lung-intro h1 {
            max-width: 570px;
            font-size: clamp(38px, 8vw, 54px);
          }
          .lung-intro-copy { max-width: 570px; }
          .lung-note { margin-top: 20px; }
          .lung-progress-card { margin-top: 15px; }
        }

        @media (max-width: 520px) {
          .lung-nav { min-height: 74px; }
          .lung-brand-mark { width: 35px; height: 35px; }
          .lung-brand-name { font-size: 19px; }
          .lung-brand-tagline { font-size: 8px; letter-spacing: .9px; }
          .lung-back { font-size: 11px; }
          .lung-layout { padding-top: 32px; padding-bottom: 45px; }
          .lung-form-card { padding: 22px 18px; border-radius: 19px; }
          .lung-input-grid { grid-template-columns: 1fr; }
          .lung-footer { flex-direction: column; gap: 5px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .lung-page *, .lung-page *::before, .lung-page *::after {
            scroll-behavior: auto !important;
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      <nav className="lung-nav" aria-label="Main navigation">
        <Link className="lung-brand" to="/" aria-label="CureAI home">
          <span className="lung-brand-mark" aria-hidden="true">
            C
          </span>
          <span>
            <span className="lung-brand-name">CureAI</span>
            <span className="lung-brand-tagline">
              INTELLIGENCE FOR WELLNESS
            </span>
          </span>
        </Link>
        <Link className="lung-back" to="/">
          ← Back to home
        </Link>
      </nav>

      <div className="lung-layout">
        <aside className="lung-intro">
          <div className="lung-kicker">
            <span className="lung-kicker-dot" />
            Respiratory health
          </div>

          <h1>
            Every breath matters. <span>Understand your health.</span>
          </h1>

          <p className="lung-intro-copy">
            Provide the information requested by the lung assessment model. Your
            responses will be processed to generate an AI-assisted educational
            classification.
          </p>

          <div className="lung-note">
            <div className="lung-note-title">
              <span aria-hidden="true">✳</span>A note on your wellbeing
            </div>
            <p>
              This tool cannot diagnose lung disease or determine your medical
              condition. Severe difficulty breathing or severe chest pain
              requires emergency medical attention. Coughing up blood also
              warrants urgent medical assessment.
            </p>
          </div>

          <div className="lung-progress-card">
            <div className="lung-progress-label">
              <span>Model inputs completed</span>
              <strong>{completedCount} / 23</strong>
            </div>
            <div
              className="lung-progress-track"
              role="progressbar"
              aria-label="Model inputs completed"
              aria-valuemin={0}
              aria-valuemax={23}
              aria-valuenow={completedCount}
            >
              <div
                className="lung-progress-fill"
                style={{ width: `${(completedCount / 23) * 100}%` }}
              />
            </div>
          </div>
        </aside>

        <section className="lung-form-card" aria-live="polite">
          <div className="lung-step-label">AI MODEL ASSESSMENT</div>
          <h2>Understand your respiratory health.</h2>
          <p className="lung-description">
            Complete the 23 fields required by the experimental lung model. All
            fields are required to request a model output.
          </p>

          <form onSubmit={handlePrediction}>
            <div className="lung-input-grid">
              <label className="lung-field">
                <span className="lung-field-label">
                  Age
                  <span className="lung-field-hint">Dataset range: 14–73</span>
                </span>
                <input
                  className="lung-number"
                  type="number"
                  min="14"
                  max="73"
                  step="1"
                  required
                  value={modelInput.Age}
                  onChange={(event) =>
                    updateModelInput("Age", event.target.value)
                  }
                />
              </label>

              {lungModelFields.map((field) => {
                const isGender = field.key === "Gender";

                const scoreValues = isGender
                  ? []
                  : field.options ||
                    Array.from(
                      { length: field.max - field.min + 1 },
                      (_, index) => field.min + index,
                    );

                const selectedValue = modelInput[field.key];

                const selectedIndex =
                  selectedValue === ""
                    ? 0
                    : Math.max(0, scoreValues.indexOf(Number(selectedValue)));

                return (
                  <label className="lung-field" key={field.key}>
                    <span className="lung-field-label">
                      {field.label}
                      <span className="lung-field-hint">
                        {isGender
                          ? "Choose your gender"
                          : "Experimental dataset scale"}
                      </span>
                    </span>

                    {isGender ? (
                      <select
                        className="lung-select"
                        required
                        value={selectedValue}
                        onChange={(event) =>
                          updateModelInput(field.key, event.target.value)
                        }
                      >
                        <option value="">Select gender</option>
                        {field.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <>
                        <input
                          className="lung-range"
                          type="range"
                          min="0"
                          max={scoreValues.length - 1}
                          step="1"
                          value={selectedIndex}
                          aria-label={`${field.label} dataset level`}
                          aria-valuetext={
                            selectedValue === ""
                              ? "Not selected"
                              : `Dataset score ${selectedValue}`
                          }
                          onChange={(event) =>
                            updateModelInput(
                              field.key,
                              String(scoreValues[Number(event.target.value)]),
                            )
                          }
                        />

                        <div className="lung-range-meta">
                          <span>Lower dataset level</span>
                          <strong>
                            {selectedValue === ""
                              ? "Not selected"
                              : `Score: ${selectedValue}`}
                          </strong>
                          <span>Higher dataset level</span>
                        </div>
                      </>
                    )}
                  </label>
                );
              })}
            </div>

            <div className="lung-info">
              <strong>About these model inputs</strong>
              <br />
              Use the sliders to select a position on the dataset's encoded
              scale. The scores are experimental model inputs, not validated
              medical measurements or clinical severity levels. Their exact
              clinical interpretation is not established. The model output is
              for educational demonstration only and must not guide medical
              decisions.
            </div>

            {predictionError && (
              <div className="lung-error" role="alert">
                {predictionError}
              </div>
            )}

            <div className="lung-form-footer">
              <button
                type="button"
                className="lung-btn lung-btn-secondary"
                onClick={resetAssessment}
                disabled={predicting}
              >
                Reset ↻
              </button>

              <button
                type="submit"
                className="lung-btn lung-btn-primary"
                disabled={predicting || completedCount !== 23}
              >
                {predicting ? "Analyzing..." : "Run AI Assessment →"}
              </button>
            </div>
          </form>

          {prediction && (
            <div className="lung-result" aria-live="polite">
              <div className="lung-step-label">YOUR MODEL RESULT</div>
              <h3>Model output</h3>
              <div className="lung-result-label">Predicted class</div>
              <div className="lung-result-value">
                {prediction.prediction ?? "No prediction returned"}
              </div>
              <p>
                {prediction.message ||
                  "This is an AI-assisted preliminary classification, not a medical diagnosis."}
              </p>
              <p>
                This is an experimental AI-generated classification, not a
                confirmed medical finding, diagnosis, or validated estimate of
                personal disease risk. It must not be used to determine whether
                a person has lung disease. Consult a qualified healthcare
                professional for medical evaluation.
              </p>
            </div>
          )}

          {saveStatus && (
            <div className="lung-result" role="status">
              <strong>✓ Saved to your records</strong>
              <p>{saveStatus}</p>
            </div>
          )}

          {saveError && (
            <div className="lung-error" role="alert">
              <strong>
                Your prediction was generated, but it could not be saved.
              </strong>
              <p>{saveError}</p>
            </div>
          )}
        </section>
      </div>

      <footer className="lung-footer">
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

export default LungAssessment;
