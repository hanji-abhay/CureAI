import { useState } from "react";
import { Link } from "react-router-dom";
import { predictSkin } from "../utils/mlApi";
import { apiFetch } from "../utils/api";

const initialModelInputs = {
  smoke: "",
  drink: "",
  background_father: "",
  background_mother: "",
  age: "",
  pesticide: "",
  gender: "",
  skin_cancer_history: "",
  cancer_history: "",
  has_piped_water: "",
  has_sewage_system: "",
  fitspatrick: "",
  region: "",
  diameter_1: "",
  diameter_2: "",
  itch: "",
  grew: "",
  hurt: "",
  changed: "",
  bleed: "",
  elevation: "",
};

const booleanOptions = ["True", "False"];
const symptomOptions = ["FALSE", "TRUE", "UNK"];

const skinModelSelectFields = [
  { key: "smoke", label: "Do you smoke?", options: booleanOptions },
  { key: "drink", label: "Do you consume alcohol?", options: booleanOptions },
  {
    key: "background_father",
    label: "Father's background",
    options: [
      "AUSTRIA",
      "BRASIL",
      "BRAZIL",
      "CZECH",
      "GERMANY",
      "ISRAEL",
      "ITALY",
      "NETHERLANDS",
      "POLAND",
      "POMERANIA",
      "PORTUGAL",
      "SPAIN",
      "UNK",
    ],
  },
  {
    key: "background_mother",
    label: "Mother's background",
    options: [
      "BRAZIL",
      "FRANCE",
      "GERMANY",
      "ITALY",
      "NETHERLANDS",
      "NORWAY",
      "POLAND",
      "POMERANIA",
      "PORTUGAL",
      "SPAIN",
      "UNK",
    ],
  },
  {
    key: "pesticide",
    label: "History of pesticide exposure?",
    options: booleanOptions,
  },
  { key: "gender", label: "Gender", options: ["FEMALE", "MALE"] },
  {
    key: "skin_cancer_history",
    label: "Personal history of skin cancer?",
    options: booleanOptions,
  },
  {
    key: "cancer_history",
    label: "Family history of cancer?",
    options: booleanOptions,
  },
  {
    key: "has_piped_water",
    label: "Access to piped water?",
    options: booleanOptions,
  },
  {
    key: "has_sewage_system",
    label: "Access to a sewage system?",
    options: booleanOptions,
  },
  {
    key: "region",
    label: "Lesion location",
    options: [
      "ABDOMEN",
      "ARM",
      "BACK",
      "CHEST",
      "EAR",
      "FACE",
      "FOOT",
      "FOREARM",
      "HAND",
      "LIP",
      "NECK",
      "NOSE",
      "SCALP",
      "THIGH",
    ],
  },
  { key: "itch", label: "Does the lesion itch?", options: symptomOptions },
  { key: "grew", label: "Has the lesion grown?", options: symptomOptions },
  { key: "hurt", label: "Does the lesion hurt?", options: symptomOptions },
  { key: "changed", label: "Has the lesion changed?", options: symptomOptions },
  { key: "bleed", label: "Does the lesion bleed?", options: symptomOptions },
  {
    key: "elevation",
    label: "Is the lesion elevated?",
    options: symptomOptions,
  },
];

const skinModelNumberFields = [
  { key: "age", label: "Age (years)", step: 1, min: 1 },
  {
    key: "fitspatrick",
    label: "Fitzpatrick skin type (1–6)",
    step: 1,
    min: 1,
    max: 6,
  },
  { key: "diameter_1", label: "Lesion diameter 1 (mm)", step: "any", min: 0 },
  { key: "diameter_2", label: "Lesion diameter 2 (mm)", step: "any", min: 0 },
];

function SkinAssessment() {
  const [modelInputs, setModelInputs] = useState(initialModelInputs);
  const [prediction, setPrediction] = useState(null);
  const [predictionError, setPredictionError] = useState("");
  const [isPredicting, setIsPredicting] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [saveError, setSaveError] = useState("");

  const updateModelInput = (field, value) => {
    setModelInputs((current) => ({
      ...current,
      [field]: value,
    }));

    setPrediction(null);
    setPredictionError("");
  };

  const handlePrediction = async () => {
    setPrediction(null);
    setPredictionError("");
    setSaveStatus("");
    setSaveError("");

    const missingFields = Object.entries(modelInputs)
      .filter(([, value]) => value === "")
      .map(([field]) => field);

    if (missingFields.length > 0) {
      setPredictionError(
        `Please complete all fields before continuing. Missing: ${missingFields.join(", ")}`,
      );
      return;
    }

    const payload = {
      ...modelInputs,
      age: Number(modelInputs.age),
      fitspatrick: Number(modelInputs.fitspatrick),
      diameter_1: Number(modelInputs.diameter_1),
      diameter_2: Number(modelInputs.diameter_2),
      smoke: modelInputs.smoke === "True",
      drink: modelInputs.drink === "True",
      pesticide: modelInputs.pesticide === "True",
      skin_cancer_history: modelInputs.skin_cancer_history === "True",
      cancer_history: modelInputs.cancer_history === "True",
      has_piped_water: modelInputs.has_piped_water === "True",
      has_sewage_system: modelInputs.has_sewage_system === "True",
    };

    setIsPredicting(true);

    try {
      const result = await predictSkin(payload);
      setPrediction(result);

      try {
        const response = await apiFetch("/api/assessments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assessmentType: "skin",
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

  const restart = () => {
    setModelInputs(initialModelInputs);
    setPrediction(null);
    setPredictionError("");
    setIsPredicting(false);
    setSaveStatus("");
    setSaveError("");
  };

  const progress = Object.values(modelInputs).filter(
    (value) => value !== "",
  ).length;

  return (
    <main className="skin-page">
      <style>{`
        .skin-page {
          --skin-ink: #173b35;
          --skin-deep: #0b2926;
          --skin-teal: #16796b;
          --skin-muted: #718078;
          --skin-border: #e2e6dc;
          --skin-peach: #f4d7c6;
          --skin-peach-ink: #925d45;
          min-height: 100vh;
          padding: 0 6%;
          color: var(--skin-ink);
          background:
            radial-gradient(ellipse at 95% 0%, rgba(244, 215, 198, .55), transparent 30rem),
            #f7f5ed;
          font-family: "DM Sans", sans-serif;
        }

        .skin-page * { box-sizing: border-box; }
        .skin-page button, .skin-page input, .skin-page select { font: inherit; }

        .skin-page button:focus-visible,
        .skin-page a:focus-visible,
        .skin-page select:focus-visible,
        .skin-page input:focus-visible {
          outline: 3px solid #bd9279;
          outline-offset: 3px;
        }

        .skin-nav {
          min-height: 88px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          border-bottom: 1px solid rgba(23, 59, 53, .12);
        }

        .skin-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          color: var(--skin-ink);
          text-decoration: none;
        }

        .skin-brand-mark {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border-radius: 14px 14px 14px 5px;
          background: var(--skin-deep);
          color: #9aefd4;
          font-size: 22px;
          font-weight: 750;
        }

        .skin-brand-name {
          font-size: 21px;
          font-weight: 750;
          letter-spacing: -1px;
        }

        .skin-brand-tagline {
          display: block;
          margin-top: 2px;
          color: var(--skin-muted);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1.35px;
        }

        .skin-back {
          color: var(--skin-ink);
          text-decoration: none;
          font-size: 13px;
          font-weight: 650;
        }

        .skin-back:hover { color: var(--skin-teal); }

        .skin-layout {
          width: 100%;
          max-width: 1120px;
          margin: 0 auto;
          padding: 62px 0 80px;
          display: grid;
          grid-template-columns: minmax(230px, .72fr) minmax(0, 1.55fr);
          gap: clamp(34px, 6vw, 84px);
          align-items: start;
        }

        .skin-intro { position: sticky; top: 28px; }

        .skin-kicker {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: var(--skin-peach-ink);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.8px;
          text-transform: uppercase;
        }

        .skin-kicker-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #c78c6e;
          box-shadow: 0 0 0 4px rgba(199, 140, 110, .17);
        }

        .skin-intro h1 {
          max-width: 440px;
          margin: 23px 0 17px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(39px, 4.2vw, 59px);
          line-height: 1.04;
          letter-spacing: -2px;
          font-weight: 500;
        }

        .skin-intro h1 span {
          color: var(--skin-teal);
          font-style: italic;
        }

        .skin-intro-copy {
          max-width: 370px;
          color: #697970;
          font-size: 14px;
          line-height: 1.9;
        }

        .skin-note {
          margin-top: 32px;
          padding: 18px;
          border: 1px solid rgba(199, 140, 110, .25);
          border-radius: 17px;
          background: rgba(244, 215, 198, .42);
        }

        .skin-note-title {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 8px;
          color: #80523e;
          font-size: 12px;
          font-weight: 750;
        }

        .skin-note p {
          margin: 0;
          color: #725f55;
          font-size: 12px;
          line-height: 1.8;
        }

        .skin-progress-card {
          margin-top: 24px;
          padding: 19px;
          border-radius: 17px;
          background: var(--skin-deep);
          color: #f5f6ee;
        }

        .skin-progress-label {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          color: #c5d8ce;
          font-size: 11px;
        }

        .skin-progress-label strong { color: #9aefd4; }

        .skin-progress-track {
          height: 5px;
          margin-top: 14px;
          overflow: hidden;
          border-radius: 20px;
          background: rgba(255, 255, 255, .13);
        }

        .skin-progress-fill {
          height: 100%;
          border-radius: inherit;
          background: #eeb99b;
          transition: width .25s ease;
        }

        .skin-form-card {
          min-width: 0;
          padding: clamp(24px, 4vw, 43px);
          border: 1px solid rgba(23, 59, 53, .09);
          border-radius: 25px;
          background: #fffefa;
          box-shadow: 0 22px 65px rgba(24, 54, 44, .07);
        }

        .skin-step-label {
          color: var(--skin-peach-ink);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.65px;
          text-transform: uppercase;
        }

        .skin-form-card h2 {
          margin: 13px 0 9px;
          color: var(--skin-ink);
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(27px, 3vw, 36px);
          font-weight: 500;
          letter-spacing: -.8px;
          line-height: 1.2;
        }

        .skin-description {
          margin: 0 0 25px;
          color: var(--skin-muted);
          font-size: 13px;
          line-height: 1.8;
        }

        .skin-field { min-width: 0; margin-top: 23px; }

        .skin-field-label {
          display: block;
          margin-bottom: 10px;
          color: var(--skin-ink);
          font-size: 13px;
          font-weight: 750;
          line-height: 1.6;
        }

        .skin-hint {
          display: block;
          margin-top: 4px;
          color: var(--skin-muted);
          font-size: 11px;
          font-weight: 400;
        }

        .skin-option-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px 14px;
        }

        .skin-select {
          width: 100%;
          min-height: 49px;
          padding: 0 13px;
          border: 1px solid var(--skin-border);
          border-radius: 12px;
          background: #fffefa;
          color: var(--skin-ink);
          font-size: 13px;
        }

        .skin-select:focus {
          border-color: #b97c5d;
        }

        .skin-form-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 34px;
          padding-top: 23px;
          border-top: 1px solid #edf0e9;
        }

        .skin-btn {
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

        .skin-btn:hover { transform: translateY(-1px); }
        .skin-btn-primary { background: var(--skin-deep); color: white; }
        .skin-btn-primary:hover { background: var(--skin-teal); }
        .skin-btn-secondary {
          border-color: var(--skin-border);
          background: white;
          color: var(--skin-ink);
        }
        .skin-btn-secondary:hover { background: #f2f5ee; }
        .skin-btn:disabled {
          opacity: .55;
          cursor: not-allowed;
          transform: none;
        }

        .skin-review-notice {
          margin-top: 23px;
          padding: 17px;
          border-radius: 13px;
          background: #f8eee7;
          color: #725f55;
          font-size: 12px;
          line-height: 1.8;
          overflow-wrap: anywhere;
        }

        .skin-review-notice h3 {
          margin: 0 0 12px;
          color: var(--skin-ink);
          font-family: Georgia, "Times New Roman", serif;
          font-size: 23px;
          font-weight: 500;
        }

        .skin-review-notice p { margin: 7px 0; }

        .skin-footer {
          max-width: 1120px;
          margin: 0 auto;
          padding: 23px 0 29px;
          border-top: 1px solid rgba(23, 59, 53, .12);
          display: flex;
          justify-content: space-between;
          gap: 20px;
          color: var(--skin-muted);
          font-size: 10px;
          line-height: 1.7;
        }

        @media (max-width: 820px) {
          .skin-page { padding: 0 5%; }
          .skin-layout {
            grid-template-columns: 1fr;
            gap: 30px;
            padding-top: 43px;
          }
          .skin-intro { position: static; }
          .skin-intro h1 {
            max-width: 570px;
            font-size: clamp(38px, 8vw, 54px);
          }
          .skin-intro-copy { max-width: 570px; }
          .skin-note { margin-top: 20px; }
          .skin-progress-card { margin-top: 15px; }
        }

        @media (max-width: 520px) {
          .skin-nav { min-height: 74px; }
          .skin-brand-mark { width: 35px; height: 35px; }
          .skin-brand-name { font-size: 19px; }
          .skin-brand-tagline { font-size: 8px; letter-spacing: .9px; }
          .skin-back { font-size: 11px; }
          .skin-layout { padding-top: 32px; padding-bottom: 45px; }
          .skin-form-card { padding: 22px 18px; border-radius: 19px; }
          .skin-option-grid { grid-template-columns: 1fr; }
          .skin-form-footer { align-items: stretch; }
          .skin-btn { padding: 0 13px; }
          .skin-footer { flex-direction: column; gap: 5px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .skin-page *, .skin-page *::before, .skin-page *::after {
            scroll-behavior: auto !important;
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      <nav className="skin-nav" aria-label="Main navigation">
        <Link className="skin-brand" to="/" aria-label="CureAI home">
          <span className="skin-brand-mark" aria-hidden="true">
            C
          </span>
          <span>
            <span className="skin-brand-name">CureAI</span>
            <span className="skin-brand-tagline">
              INTELLIGENCE FOR WELLNESS
            </span>
          </span>
        </Link>

        <Link className="skin-back" to="/">
          ← Back to home
        </Link>
      </nav>

      <div className="skin-layout">
        <aside className="skin-intro">
          <div className="skin-kicker">
            <span className="skin-kicker-dot" />
            Dermatological health
          </div>

          <h1>
            Get to know your skin, <span>with care.</span>
          </h1>

          <p className="skin-intro-copy">
            Provide the information requested by the skin assessment model. Your
            responses will be processed to generate an AI-assisted
            classification.
          </p>

          <div className="skin-note">
            <div className="skin-note-title">
              <span aria-hidden="true">✳</span>
              Your skin deserves attention
            </div>
            <p>
              This tool cannot diagnose skin cancer or identify a skin
              condition. A new, changing, bleeding, or non-healing spot should
              be assessed by a qualified healthcare professional.
            </p>
          </div>

          <div className="skin-progress-card">
            <div className="skin-progress-label">
              <span>Model inputs completed</span>
              <strong>{progress} / 21</strong>
            </div>

            <div
              className="skin-progress-track"
              role="progressbar"
              aria-label="Model inputs completed"
              aria-valuemin={0}
              aria-valuemax={21}
              aria-valuenow={progress}
            >
              <div
                className="skin-progress-fill"
                style={{ width: `${(progress / 21) * 100}%` }}
              />
            </div>
          </div>
        </aside>

        <section className="skin-form-card" aria-live="polite">
          <div className="skin-step-label">AI MODEL ASSESSMENT</div>

          <h2>Skin assessment details</h2>

          <p className="skin-description">
            Complete the fields below using accurate information. All 21 inputs
            are required by the current trained model. Select UNK where that
            option is available and the information is unknown.
          </p>

          <div className="skin-review-notice">
            <strong>Before continuing:</strong> This model produces an
            educational classification based on its trained data. It does not
            diagnose skin cancer or replace a professional examination. Do not
            guess information you do not know.
          </div>

          <div className="skin-option-grid">
            {skinModelSelectFields.map(({ key, label, options }) => (
              <div className="skin-field" key={key}>
                <label
                  className="skin-field-label"
                  htmlFor={`skin-model-${key}`}
                >
                  {label}
                </label>

                <select
                  id={`skin-model-${key}`}
                  className="skin-select"
                  value={modelInputs[key]}
                  onChange={(event) =>
                    updateModelInput(key, event.target.value)
                  }
                  required
                >
                  <option value="">Select an option</option>

                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option === "True"
                        ? "Yes"
                        : option === "False"
                          ? "No"
                          : option}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {skinModelNumberFields.map(({ key, label, step, min, max }) => (
              <div className="skin-field" key={key}>
                <label
                  className="skin-field-label"
                  htmlFor={`skin-model-${key}`}
                >
                  {label}
                </label>

                <input
                  id={`skin-model-${key}`}
                  className="skin-select"
                  type="number"
                  min={min}
                  max={max}
                  step={step}
                  value={modelInputs[key]}
                  onChange={(event) =>
                    updateModelInput(key, event.target.value)
                  }
                  placeholder="Enter value"
                  required
                />
              </div>
            ))}
          </div>

          {predictionError && (
            <div className="skin-review-notice" role="alert">
              {predictionError}
            </div>
          )}

          {prediction && (
            <div className="skin-review-notice" aria-live="polite">
              <h3>Model response</h3>
              {prediction.cancer_type && (
                <p>
                  <strong>Assessment:</strong> {prediction.cancer_type}
                </p>
              )}
              <p>
                <strong>Predicted class:</strong> {prediction.prediction}
              </p>
              {prediction.message && <p>{prediction.message}</p>}
              <p>
                This is an AI-generated classification, not a confirmed medical
                finding or diagnosis. Please consult a qualified healthcare
                professional for evaluation.
              </p>
            </div>
          )}

          {predictionError && (
            <div className="skin-error-notice" role="alert">
              {predictionError}
            </div>
          )}

          {saveStatus && (
            <div className="skin-review-notice" role="status">
              <strong>✓ Saved to your records</strong>
              <p>{saveStatus}</p>
            </div>
          )}

          {saveError && (
            <div className="skin-review-notice" role="alert">
              <strong>
                Your prediction was generated, but it could not be saved.
              </strong>
              <p>{saveError}</p>
            </div>
          )}

          <div className="skin-form-footer">
            <button
              type="button"
              className="skin-btn skin-btn-secondary"
              onClick={restart}
              disabled={isPredicting}
            >
              Reset form ↻
            </button>

            <button
              type="button"
              className="skin-btn skin-btn-primary"
              onClick={handlePrediction}
              disabled={isPredicting}
            >
              {isPredicting ? "Analysing..." : "Run AI assessment →"}
            </button>
          </div>

          <p
            className="skin-description"
            style={{ marginTop: 18, marginBottom: 0 }}
          >
            Your responses are used to request a prediction from the connected
            assessment API. This result is for educational purposes only.
          </p>
        </section>
      </div>

      <footer className="skin-footer">
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

export default SkinAssessment;
