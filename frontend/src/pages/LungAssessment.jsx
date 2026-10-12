
import { useState } from 'react'
import { Link } from 'react-router-dom'

const steps = [
  { title: 'About you', subtitle: 'A little background' },
  { title: 'Breathing and symptoms', subtitle: 'What have you noticed?' },
  { title: 'Health history', subtitle: 'Your respiratory health' },
]

const symptomOptions = [
  'A persistent or recurring cough',
  'Shortness of breath',
  'Wheezing',
  'Chest discomfort',
  'Coughing up blood',
  'Recurring chest infections',
  'Unusual fatigue during activity',
  'A change in my usual breathing',
  'None of these',
]

const initialAnswers = {
  ageGroup: '',
  smoking: '',
  symptoms: [],
  duration: '',
  respiratoryHistory: '',
  exposure: '',
  notes: '',
}

function LungAssessment() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(initialAnswers)
  const [showReview, setShowReview] = useState(false)

  const updateAnswer = (field, value) => {
    setAnswers((current) => ({ ...current, [field]: value }))
  }

  const toggleSymptom = (symptom) => {
    setAnswers((current) => {
      if (symptom === 'None of these') {
        return {
          ...current,
          symptoms: current.symptoms.includes(symptom) ? [] : [symptom],
        }
      }

      const selected = current.symptoms.filter(
        (item) => item !== 'None of these'
      )

      return {
        ...current,
        symptoms: selected.includes(symptom)
          ? selected.filter((item) => item !== symptom)
          : [...selected, symptom],
      }
    })
  }

  const restart = () => {
    setAnswers(initialAnswers)
    setStep(0)
    setShowReview(false)
  }

  const progress = showReview ? 100 : ((step + 1) / steps.length) * 100

  const renderOptions = (field, options) => (
    <div className="lung-option-grid">
      {options.map((option) => {
        const selected = answers[field] === option

        return (
          <button
            type="button"
            key={option}
            className={`lung-option ${selected ? 'is-selected' : ''}`}
            aria-pressed={selected}
            onClick={() => updateAnswer(field, option)}
          >
            <span className="lung-indicator">{selected ? '✓' : ''}</span>
            {option}
          </button>
        )
      })}
    </div>
  )

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
        .lung-page button, .lung-page input, .lung-page textarea, .lung-page select { font: inherit; }
        .lung-page button:focus-visible, .lung-page a:focus-visible,
        .lung-page select:focus-visible, .lung-page textarea:focus-visible {
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

        .lung-brand-name { font-size: 21px; font-weight: 750; letter-spacing: -1px; }
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

        .lung-intro h1 span { color: var(--lung-teal); font-style: italic; }

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
          margin: 0 0 30px;
          color: var(--lung-muted);
          font-size: 13px;
          line-height: 1.8;
        }

        .lung-field { margin-top: 26px; }

        .lung-field-label {
          display: block;
          margin-bottom: 12px;
          color: var(--lung-ink);
          font-size: 13px;
          font-weight: 750;
          line-height: 1.6;
        }

        .lung-hint {
          display: block;
          margin-top: 4px;
          color: var(--lung-muted);
          font-size: 11px;
          font-weight: 400;
        }

        .lung-option-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .lung-option {
          min-height: 51px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 13px;
          border: 1px solid var(--lung-border);
          border-radius: 12px;
          background: #fffefa;
          color: #40544b;
          cursor: pointer;
          text-align: left;
          font-size: 12px;
          line-height: 1.5;
          transition: border-color .18s ease, background .18s ease, transform .18s ease;
        }

        .lung-option:hover { border-color: #9bb8dc; transform: translateY(-1px); }

        .lung-option.is-selected {
          border-color: #638bbd;
          background: #eef5fd;
          color: var(--lung-deep);
          box-shadow: inset 0 0 0 1px #638bbd;
        }

        .lung-indicator {
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

        .lung-option.is-selected .lung-indicator {
          border-color: #527cad;
          background: #527cad;
        }

        .lung-select, .lung-textarea {
          width: 100%;
          border: 1px solid var(--lung-border);
          border-radius: 12px;
          background: #fffefa;
          color: var(--lung-ink);
          font-size: 13px;
        }

        .lung-select { min-height: 49px; padding: 0 13px; }
        .lung-textarea { min-height: 105px; padding: 13px; resize: vertical; line-height: 1.7; }

        .lung-form-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 34px;
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
        .lung-btn-secondary { border-color: var(--lung-border); background: white; color: var(--lung-ink); }
        .lung-btn-secondary:hover { background: #f2f5ee; }
        .lung-btn:disabled { opacity: .45; cursor: not-allowed; transform: none; }

        .lung-optional {
          margin-top: 17px;
          color: #89948c;
          font-size: 11px;
          line-height: 1.7;
        }

        .lung-review-list { display: grid; }

        .lung-review-row {
          display: grid;
          grid-template-columns: minmax(100px, .75fr) minmax(0, 1.25fr);
          gap: 15px;
          padding: 15px 0;
          border-bottom: 1px solid #edf0e9;
          font-size: 12px;
          line-height: 1.7;
        }

        .lung-review-key { color: var(--lung-muted); }
        .lung-review-value { color: var(--lung-ink); font-weight: 650; overflow-wrap: anywhere; }

        .lung-review-notice {
          margin-top: 23px;
          padding: 16px;
          border-radius: 13px;
          background: #edf4fc;
          color: #536980;
          font-size: 12px;
          line-height: 1.8;
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
          .lung-intro h1 { max-width: 570px; font-size: clamp(38px, 8vw, 54px); }
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
          .lung-option-grid { grid-template-columns: 1fr; }
          .lung-option { min-height: 47px; }
          .lung-form-footer { align-items: stretch; }
          .lung-btn { padding: 0 13px; }
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
          <span className="lung-brand-mark" aria-hidden="true">C</span>
          <span>
            <span className="lung-brand-name">CureAI</span>
            <span className="lung-brand-tagline">INTELLIGENCE FOR WELLNESS</span>
          </span>
        </Link>
        <Link className="lung-back" to="/">← Back to home</Link>
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
            Use this guided questionnaire to organize information about your
            breathing, symptoms, and respiratory health history. Your answers
            can help you prepare for a conversation with a healthcare professional.
          </p>

          <div className="lung-note">
            <div className="lung-note-title">
              <span aria-hidden="true">✳</span>
              Please put breathing first
            </div>
            <p>
              This questionnaire cannot diagnose lung disease. Severe difficulty
              breathing, blue or grey lips, confusion, or severe chest pain
              needs emergency medical attention. Coughing up blood also warrants
              urgent medical assessment.
            </p>
          </div>

          <div className="lung-progress-card">
            <div className="lung-progress-label">
              <span>Your progress</span>
              <strong>{showReview ? 'Ready to review' : `Step ${step + 1} of ${steps.length}`}</strong>
            </div>
            <div
              className="lung-progress-track"
              role="progressbar"
              aria-label="Assessment progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <div className="lung-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </aside>

        <section className="lung-form-card" aria-live="polite">
          {!showReview ? (
            <>
              <div className="lung-step-label">
                Step {String(step + 1).padStart(2, '0')} / 03
              </div>
              <h2>{steps[step].title}</h2>
              <p className="lung-description">
                {steps[step].subtitle}. Share only what you're comfortable sharing.
              </p>

              {step === 0 && (
                <>
                  <div className="lung-field">
                    <label className="lung-field-label" htmlFor="lung-age">
                      Which age group are you in?
                    </label>
                    <select
                      id="lung-age"
                      className="lung-select"
                      value={answers.ageGroup}
                      onChange={(event) => updateAnswer('ageGroup', event.target.value)}
                    >
                      <option value="">Select an age range</option>
                      <option>Under 18</option>
                      <option>18–29</option>
                      <option>30–44</option>
                      <option>45–59</option>
                      <option>60 or above</option>
                      <option>Prefer not to say</option>
                    </select>
                  </div>

                  <div className="lung-field">
                    <span className="lung-field-label">
                      Which best describes your smoking or vaping history?
                      <span className="lung-hint">Optional. This information is not a diagnosis.</span>
                    </span>
                    {renderOptions('smoking', [
                      'Never',
                      'Formerly',
                      'Currently',
                      'Prefer not to say',
                    ])}
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div className="lung-field">
                    <span className="lung-field-label">
                      Have you noticed any of these symptoms?
                      <span className="lung-hint">Select all that apply, or skip if none apply.</span>
                    </span>
                    <div className="lung-option-grid">
                      {symptomOptions.map((symptom) => {
                        const selected = answers.symptoms.includes(symptom)

                        return (
                          <button
                            type="button"
                            key={symptom}
                            className={`lung-option ${selected ? 'is-selected' : ''}`}
                            aria-pressed={selected}
                            onClick={() => toggleSymptom(symptom)}
                          >
                            <span className="lung-indicator">{selected ? '✓' : ''}</span>
                            {symptom}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="lung-field">
                    <label className="lung-field-label" htmlFor="lung-duration">
                      How long have you noticed these changes?
                    </label>
                    <select
                      id="lung-duration"
                      className="lung-select"
                      value={answers.duration}
                      onChange={(event) => updateAnswer('duration', event.target.value)}
                    >
                      <option value="">Choose a duration (optional)</option>
                      <option>Less than one week</option>
                      <option>One to three weeks</option>
                      <option>More than three weeks</option>
                      <option>Several months or longer</option>
                      <option>It varies</option>
                      <option>Not applicable</option>
                    </select>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="lung-field">
                    <span className="lung-field-label">
                      Have you previously been diagnosed with a respiratory condition?
                    </span>
                    {renderOptions('respiratoryHistory', [
                      'Yes',
                      'No',
                      'Not sure',
                      'Prefer not to say',
                    ])}
                  </div>

                  <div className="lung-field">
                    <span className="lung-field-label">
                      Have you regularly been exposed to dust, fumes, or air pollution?
                    </span>
                    {renderOptions('exposure', [
                      'Often',
                      'Sometimes',
                      'Rarely',
                      'Not sure',
                      'Prefer not to say',
                    ])}
                  </div>

                  <div className="lung-field">
                    <label className="lung-field-label" htmlFor="lung-notes">
                      Anything else you'd like to note?
                      <span className="lung-hint">Optional. Avoid entering identifying or highly sensitive information.</span>
                    </label>
                    <textarea
                      id="lung-notes"
                      className="lung-textarea"
                      maxLength={500}
                      placeholder="Add a brief note..."
                      value={answers.notes}
                      onChange={(event) => updateAnswer('notes', event.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="lung-form-footer">
                <button
                  type="button"
                  className="lung-btn lung-btn-secondary"
                  onClick={() => setStep((current) => current - 1)}
                  disabled={step === 0}
                >
                  ← Back
                </button>

                <button
                  type="button"
                  className="lung-btn lung-btn-primary"
                  onClick={() => {
                    if (step < steps.length - 1) {
                      setStep((current) => current + 1)
                    } else {
                      setShowReview(true)
                    }
                  }}
                >
                  {step === steps.length - 1 ? 'Review responses' : 'Continue'} →
                </button>
              </div>

              <p className="lung-optional">
                This prototype keeps responses in the current page session and does not submit them to a server.
              </p>
            </>
          ) : (
            <>
              <div className="lung-step-label">Questionnaire complete</div>
              <h2>Your responses, gathered in one place.</h2>
              <p className="lung-description">
                Review your selections below. You can return to edit them or start again.
              </p>

              <div className="lung-review-list">
                {[
                  ['Age group', answers.ageGroup],
                  ['Smoking or vaping history', answers.smoking],
                  ['Selected symptoms', answers.symptoms.join(', ')],
                  ['Duration', answers.duration],
                  ['Respiratory history', answers.respiratoryHistory],
                  ['Environmental exposure', answers.exposure],
                  ['Additional notes', answers.notes],
                ].map(([label, value]) => (
                  <div className="lung-review-row" key={label}>
                    <div className="lung-review-key">{label}</div>
                    <div className="lung-review-value">{value || 'Not provided'}</div>
                  </div>
                ))}
              </div>

              <div className="lung-review-notice">
                <strong>What happens next?</strong>
                <br />
                This questionnaire has organized your responses only. It has not
                analyzed a scan, calculated a risk score, or diagnosed a condition.
                Discuss persistent or concerning symptoms with a healthcare professional.
                Seek emergency care for severe breathing difficulty or severe chest pain.
              </div>

              <div className="lung-form-footer">
                <button
                  type="button"
                  className="lung-btn lung-btn-secondary"
                  onClick={() => {
                    setShowReview(false)
                    setStep(2)
                  }}
                >
                  ← Edit responses
                </button>
                <button
                  type="button"
                  className="lung-btn lung-btn-primary"
                  onClick={restart}
                >
                  Start again ↻
                </button>
              </div>
            </>
          )}
        </section>
      </div>

      <footer className="lung-footer">
        <span>© {new Date().getFullYear()} CureAI · Intelligence for Wellness</span>
        <span>Informational support, not a substitute for professional medical care.</span>
      </footer>
    </main>
  )
}

export default LungAssessment
