
import { useState } from 'react'
import { Link } from 'react-router-dom'

const steps = [
  { title: 'About you', subtitle: 'A little background' },
  { title: 'Symptoms', subtitle: 'How have you been feeling?' },
  { title: 'Health history', subtitle: 'Your previous care' },
]

const symptomOptions = [
  'Unusual tiredness',
  'Unexpected weight changes',
  'Feeling unusually cold or hot',
  'Changes in heart rate',
  'Hair thinning or hair loss',
  'Changes in mood or concentration',
  'Neck swelling or discomfort',
  'Changes in sleep',
  'None of these',
]

const initialAnswers = {
  ageGroup: '',
  diagnosis: '',
  symptoms: [],
  duration: '',
  bloodTest: '',
  medication: '',
  notes: '',
}

function ThyroidAssessment() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(initialAnswers)
  const [showReview, setShowReview] = useState(false)

  const updateAnswer = (field, value) => {
    setAnswers((current) => ({ ...current, [field]: value }))
  }

  const toggleSymptom = (symptom) => {
    setAnswers((current) => {
      const selected = current.symptoms

      if (symptom === 'None of these') {
        return {
          ...current,
          symptoms: selected.includes(symptom) ? [] : [symptom],
        }
      }

      const withoutNone = selected.filter(
        (item) => item !== 'None of these'
      )

      return {
        ...current,
        symptoms: withoutNone.includes(symptom)
          ? withoutNone.filter((item) => item !== symptom)
          : [...withoutNone, symptom],
      }
    })
  }

  const restartAssessment = () => {
    setAnswers(initialAnswers)
    setStep(0)
    setShowReview(false)
  }

  const selectedCount = [
    answers.ageGroup,
    answers.diagnosis,
    answers.symptoms.length > 0,
    answers.duration,
    answers.bloodTest,
    answers.medication,
  ].filter(Boolean).length

  return (
    <main className="thyroid-page">
      <style>{`
        .thyroid-page {
          --th-ink: #173b35;
          --th-deep: #0b2926;
          --th-teal: #16796b;
          --th-mint: #dff2e9;
          --th-ivory: #f7f5ed;
          --th-white: #fffefa;
          --th-muted: #718078;
          --th-border: #e2e6dc;
          --th-lavender: #e8e0f8;
          --th-lavender-ink: #65518c;
          min-height: 100vh;
          color: var(--th-ink);
          background:
            radial-gradient(ellipse at 95% 0%, rgba(220, 211, 246, .48), transparent 30rem),
            var(--th-ivory);
          font-family: "DM Sans", sans-serif;
          padding: 0 6%;
        }

        .thyroid-page * { box-sizing: border-box; }
        .thyroid-page button,
        .thyroid-page input,
        .thyroid-page textarea { font: inherit; }
        .thyroid-page button:focus-visible,
        .thyroid-page a:focus-visible,
        .thyroid-page input:focus-visible,
        .thyroid-page textarea:focus-visible {
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
          margin: 23px 0 17px;
          max-width: 430px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(39px, 4.2vw, 59px);
          line-height: 1.04;
          letter-spacing: -2px;
          font-weight: 500;
        }

        .th-intro h1 span { color: var(--th-teal); font-style: italic; }

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
          margin: 0 0 30px;
          color: var(--th-muted);
          font-size: 13px;
          line-height: 1.8;
        }

        .th-field { margin-top: 26px; }

        .th-field-label {
          display: block;
          margin-bottom: 12px;
          color: var(--th-ink);
          font-size: 13px;
          font-weight: 750;
          line-height: 1.6;
        }

        .th-field-hint {
          display: block;
          margin-top: 4px;
          color: var(--th-muted);
          font-size: 11px;
          font-weight: 400;
        }

        .th-option-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .th-option {
          min-height: 51px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 13px;
          border: 1px solid var(--th-border);
          border-radius: 12px;
          background: #fffefa;
          color: #40544b;
          cursor: pointer;
          text-align: left;
          font-size: 12px;
          line-height: 1.5;
          transition: border-color .18s ease, background .18s ease, transform .18s ease;
        }

        .th-option:hover {
          border-color: #a8cabe;
          transform: translateY(-1px);
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

        .th-select, .th-textarea {
          width: 100%;
          border: 1px solid var(--th-border);
          border-radius: 12px;
          background: #fffefa;
          color: var(--th-ink);
          font-size: 13px;
        }

        .th-select { min-height: 49px; padding: 0 13px; }
        .th-textarea { min-height: 105px; padding: 13px; resize: vertical; line-height: 1.7; }
        .th-select:focus, .th-textarea:focus { border-color: var(--th-teal); outline: none; }

        .th-form-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
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

        .th-btn-primary { background: var(--th-deep); color: white; }
        .th-btn-primary:hover { background: var(--th-teal); }
        .th-btn-secondary { border-color: var(--th-border); background: white; color: var(--th-ink); }
        .th-btn-secondary:hover { background: #f2f5ee; }
        .th-btn:disabled { opacity: .45; cursor: not-allowed; transform: none; }

        .th-optional {
          margin-top: 17px;
          color: #89948c;
          font-size: 11px;
          line-height: 1.7;
        }

        .th-review-list { display: grid; gap: 0; }

        .th-review-row {
          display: grid;
          grid-template-columns: minmax(100px, .75fr) minmax(0, 1.25fr);
          gap: 15px;
          padding: 15px 0;
          border-bottom: 1px solid #edf0e9;
          font-size: 12px;
          line-height: 1.7;
        }

        .th-review-key { color: var(--th-muted); }
        .th-review-value { color: var(--th-ink); font-weight: 650; overflow-wrap: anywhere; }

        .th-review-notice {
          margin-top: 23px;
          padding: 16px;
          border-radius: 13px;
          background: #f0f6ef;
          color: #51675b;
          font-size: 12px;
          line-height: 1.8;
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
          .th-intro h1 { max-width: 570px; font-size: clamp(38px, 8vw, 54px); }
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
          .th-layout { padding-top: 32px; padding-bottom: 45px; }
          .th-form-card { padding: 22px 18px; border-radius: 19px; }
          .th-option-grid { grid-template-columns: 1fr; }
          .th-option { min-height: 47px; }
          .th-form-footer { align-items: stretch; }
          .th-btn { padding: 0 13px; }
          .th-footer { flex-direction: column; gap: 5px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .thyroid-page *, .thyroid-page *::before, .thyroid-page *::after {
            scroll-behavior: auto !important;
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      <nav className="th-nav" aria-label="Main navigation">
        <Link className="th-brand" to="/" aria-label="CureAI home">
          <span className="th-brand-mark" aria-hidden="true">C</span>
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
            Share a little about your thyroid-related health and experiences.
            This guided questionnaire helps you organize the information you
            may want to discuss with a qualified healthcare professional.
          </p>

          <div className="th-note">
            <div className="th-note-title">
              <span aria-hidden="true">✳</span>
              A note on your wellbeing
            </div>
            <p>
              Symptoms can have many causes. This questionnaire does not
              diagnose thyroid conditions or replace medical advice, testing,
              or care from a healthcare professional.
            </p>
          </div>

          <div className="th-progress-card">
            <div className="th-progress-label">
              <span>Your progress</span>
              <strong>
                {showReview ? 'Ready to review' : `Step ${step + 1} of ${steps.length}`}
              </strong>
            </div>
            <div
              className="th-progress-track"
              role="progressbar"
              aria-label="Assessment progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={showReview ? 100 : Math.round(((step + 1) / steps.length) * 100)}
            >
              <div
                className="th-progress-fill"
                style={{
                  width: `${showReview ? 100 : ((step + 1) / steps.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </aside>

        <section className="th-form-card" aria-live="polite">
          {!showReview ? (
            <>
              <div className="th-step-label">
                Step {String(step + 1).padStart(2, '0')} / 03
              </div>

              <h2>{steps[step].title}</h2>
              <p className="th-form-description">{steps[step].subtitle}. Answer what you feel comfortable sharing.</p>

              {step === 0 && (
                <>
                  <div className="th-field">
                    <label className="th-field-label" htmlFor="th-age">
                      Which age group are you in?
                      <span className="th-field-hint">Choose the closest range.</span>
                    </label>
                    <select
                      id="th-age"
                      className="th-select"
                      value={answers.ageGroup}
                      onChange={(event) => updateAnswer('ageGroup', event.target.value)}
                    >
                      <option value="">Select an age range</option>
                      <option value="Under 18">Under 18</option>
                      <option value="18–29">18–29</option>
                      <option value="30–44">30–44</option>
                      <option value="45–59">45–59</option>
                      <option value="60 or above">60 or above</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div className="th-field">
                    <span className="th-field-label">
                      Have you previously been diagnosed with a thyroid condition?
                    </span>
                    <div className="th-option-grid">
                      {['Yes', 'No', 'Not sure', 'Prefer not to say'].map((option) => (
                        <button
                          type="button"
                          key={option}
                          className={`th-option ${answers.diagnosis === option ? 'is-selected' : ''}`}
                          aria-pressed={answers.diagnosis === option}
                          onClick={() => updateAnswer('diagnosis', option)}
                        >
                          <span className="th-option-indicator">
                            {answers.diagnosis === option ? '✓' : ''}
                          </span>
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div className="th-field">
                    <span className="th-field-label">
                      Have you noticed any of the following?
                      <span className="th-field-hint">Select all that apply. You can also skip this question.</span>
                    </span>
                    <div className="th-option-grid">
                      {symptomOptions.map((symptom) => {
                        const selected = answers.symptoms.includes(symptom)

                        return (
                          <button
                            type="button"
                            key={symptom}
                            className={`th-option ${selected ? 'is-selected' : ''}`}
                            aria-pressed={selected}
                            onClick={() => toggleSymptom(symptom)}
                          >
                            <span className="th-option-indicator">
                              {selected ? '✓' : ''}
                            </span>
                            {symptom}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="th-field">
                    <label className="th-field-label" htmlFor="th-duration">
                      If you have noticed changes, how long have they been present?
                    </label>
                    <select
                      id="th-duration"
                      className="th-select"
                      value={answers.duration}
                      onChange={(event) => updateAnswer('duration', event.target.value)}
                    >
                      <option value="">Choose a duration (optional)</option>
                      <option value="Less than two weeks">Less than two weeks</option>
                      <option value="Two weeks to three months">Two weeks to three months</option>
                      <option value="More than three months">More than three months</option>
                      <option value="It varies">It varies</option>
                      <option value="Not applicable">Not applicable</option>
                    </select>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="th-field">
                    <span className="th-field-label">
                      Have you had thyroid-related blood tests?
                    </span>
                    <div className="th-option-grid">
                      {['Recently', 'In the past', 'Never', 'Not sure'].map((option) => (
                        <button
                          type="button"
                          key={option}
                          className={`th-option ${answers.bloodTest === option ? 'is-selected' : ''}`}
                          aria-pressed={answers.bloodTest === option}
                          onClick={() => updateAnswer('bloodTest', option)}
                        >
                          <span className="th-option-indicator">
                            {answers.bloodTest === option ? '✓' : ''}
                          </span>
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="th-field">
                    <span className="th-field-label">
                      Are you currently taking medication for a thyroid condition?
                    </span>
                    <div className="th-option-grid">
                      {['Yes', 'No', 'Not sure', 'Not applicable'].map((option) => (
                        <button
                          type="button"
                          key={option}
                          className={`th-option ${answers.medication === option ? 'is-selected' : ''}`}
                          aria-pressed={answers.medication === option}
                          onClick={() => updateAnswer('medication', option)}
                        >
                          <span className="th-option-indicator">
                            {answers.medication === option ? '✓' : ''}
                          </span>
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="th-field">
                    <label className="th-field-label" htmlFor="th-notes">
                      Anything else you'd like to note?
                      <span className="th-field-hint">Optional. Avoid entering identifying or highly sensitive information.</span>
                    </label>
                    <textarea
                      id="th-notes"
                      className="th-textarea"
                      maxLength={500}
                      placeholder="Add a brief note..."
                      value={answers.notes}
                      onChange={(event) => updateAnswer('notes', event.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="th-form-footer">
                <button
                  type="button"
                  className="th-btn th-btn-secondary"
                  onClick={() => setStep((current) => current - 1)}
                  disabled={step === 0}
                >
                  ← Back
                </button>

                <button
                  type="button"
                  className="th-btn th-btn-primary"
                  onClick={() => {
                    if (step < steps.length - 1) {
                      setStep((current) => current + 1)
                    } else {
                      setShowReview(true)
                    }
                  }}
                >
                  {step === steps.length - 1 ? 'Review responses' : 'Continue'}
                  <span aria-hidden="true">→</span>
                </button>
              </div>

              <p className="th-optional">
                Your responses stay in this page's current session. This prototype does not submit them to a server.
              </p>
            </>
          ) : (
            <>
              <div className="th-step-label">Questionnaire complete</div>
              <h2>Your responses, thoughtfully gathered.</h2>
              <p className="th-form-description">
                Review the information you selected. You can return to make changes or start again.
              </p>

              <div className="th-review-list">
                {[
                  ['Age group', answers.ageGroup],
                  ['Previous diagnosis', answers.diagnosis],
                  ['Selected symptoms', answers.symptoms.join(', ')],
                  ['Duration', answers.duration],
                  ['Blood tests', answers.bloodTest],
                  ['Current medication', answers.medication],
                  ['Additional notes', answers.notes],
                ].map(([label, value]) => (
                  <div className="th-review-row" key={label}>
                    <div className="th-review-key">{label}</div>
                    <div className="th-review-value">
                      {value || 'Not provided'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="th-review-notice">
                <strong>What happens next?</strong>
                <br />
                This prototype has collected your responses for review only.
                It has not calculated a risk score or made a medical assessment.
                Share relevant concerns with a qualified healthcare professional,
                who can advise whether examination or testing is appropriate.
              </div>

              <div className="th-form-footer">
                <button
                  type="button"
                  className="th-btn th-btn-secondary"
                  onClick={() => {
                    setShowReview(false)
                    setStep(2)
                  }}
                >
                  ← Edit responses
                </button>

                <button
                  type="button"
                  className="th-btn th-btn-primary"
                  onClick={restartAssessment}
                >
                  Start again ↻
                </button>
              </div>
            </>
          )}
        </section>
      </div>

      <footer className="th-footer">
        <span>© {new Date().getFullYear()} CureAI · Intelligence for Wellness</span>
        <span>Informational support, not a substitute for professional medical care.</span>
      </footer>
    </main>
  )
}

export default ThyroidAssessment
