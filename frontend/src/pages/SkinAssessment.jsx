
import { useState } from 'react'
import { Link } from 'react-router-dom'

const questions = [
  { title: 'About your skin', subtitle: 'A little background' },
  { title: 'Skin changes', subtitle: 'What have you noticed?' },
  { title: 'Skin history', subtitle: 'Previous care and observations' },
]

const skinChanges = [
  'A new or changing spot or mole',
  'A persistent rash',
  'Itching or irritation',
  'Dryness or scaling',
  'A sore that does not seem to heal',
  'Changes in skin colour',
  'Bleeding or crusting in a spot',
  'A change in the size or shape of a mole',
  'None of these',
]

const initialAnswers = {
  ageGroup: '',
  skinType: '',
  changes: [],
  duration: '',
  sunExposure: '',
  familyHistory: '',
  notes: '',
}

function SkinAssessment() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(initialAnswers)
  const [showReview, setShowReview] = useState(false)

  const updateAnswer = (field, value) => {
    setAnswers((current) => ({ ...current, [field]: value }))
  }

  const toggleChange = (change) => {
    setAnswers((current) => {
      if (change === 'None of these') {
        return {
          ...current,
          changes: current.changes.includes(change) ? [] : [change],
        }
      }

      const selected = current.changes.filter(
        (item) => item !== 'None of these'
      )

      return {
        ...current,
        changes: selected.includes(change)
          ? selected.filter((item) => item !== change)
          : [...selected, change],
      }
    })
  }

  const restart = () => {
    setAnswers(initialAnswers)
    setStep(0)
    setShowReview(false)
  }

  const optionButton = (field, options) => (
    <div className="skin-option-grid">
      {options.map((option) => {
        const selected = answers[field] === option

        return (
          <button
            type="button"
            key={option}
            className={`skin-option ${selected ? 'selected' : ''}`}
            aria-pressed={selected}
            onClick={() => updateAnswer(field, option)}
          >
            <span className="skin-indicator">{selected ? '✓' : ''}</span>
            {option}
          </button>
        )
      })}
    </div>
  )

  const progress = showReview ? 100 : ((step + 1) / questions.length) * 100

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
        .skin-page button, .skin-page input, .skin-page textarea, .skin-page select { font: inherit; }
        .skin-page button:focus-visible, .skin-page a:focus-visible,
        .skin-page select:focus-visible, .skin-page textarea:focus-visible {
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

        .skin-brand-name { font-size: 21px; font-weight: 750; letter-spacing: -1px; }
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

        .skin-intro h1 span { color: var(--skin-teal); font-style: italic; }

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
          margin: 0 0 30px;
          color: var(--skin-muted);
          font-size: 13px;
          line-height: 1.8;
        }

        .skin-field { margin-top: 26px; }

        .skin-field-label {
          display: block;
          margin-bottom: 12px;
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
          gap: 10px;
        }

        .skin-option {
          min-height: 51px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 13px;
          border: 1px solid var(--skin-border);
          border-radius: 12px;
          background: #fffefa;
          color: #40544b;
          cursor: pointer;
          text-align: left;
          font-size: 12px;
          line-height: 1.5;
          transition: border-color .18s ease, background .18s ease, transform .18s ease;
        }

        .skin-option:hover { border-color: #d8b09b; transform: translateY(-1px); }

        .skin-option.selected {
          border-color: #b97c5d;
          background: #fff2e9;
          color: var(--skin-deep);
          box-shadow: inset 0 0 0 1px #b97c5d;
        }

        .skin-indicator {
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

        .skin-option.selected .skin-indicator {
          border-color: #a96e51;
          background: #a96e51;
        }

        .skin-select, .skin-textarea {
          width: 100%;
          border: 1px solid var(--skin-border);
          border-radius: 12px;
          background: #fffefa;
          color: var(--skin-ink);
          font-size: 13px;
        }

        .skin-select { min-height: 49px; padding: 0 13px; }
        .skin-textarea { min-height: 105px; padding: 13px; resize: vertical; line-height: 1.7; }

        .skin-form-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
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
        .skin-btn-secondary { border-color: var(--skin-border); background: white; color: var(--skin-ink); }
        .skin-btn-secondary:hover { background: #f2f5ee; }
        .skin-btn:disabled { opacity: .45; cursor: not-allowed; transform: none; }

        .skin-optional {
          margin-top: 17px;
          color: #89948c;
          font-size: 11px;
          line-height: 1.7;
        }

        .skin-review-list { display: grid; }

        .skin-review-row {
          display: grid;
          grid-template-columns: minmax(100px, .75fr) minmax(0, 1.25fr);
          gap: 15px;
          padding: 15px 0;
          border-bottom: 1px solid #edf0e9;
          font-size: 12px;
          line-height: 1.7;
        }

        .skin-review-key { color: var(--skin-muted); }
        .skin-review-value { color: var(--skin-ink); font-weight: 650; overflow-wrap: anywhere; }

        .skin-review-notice {
          margin-top: 23px;
          padding: 16px;
          border-radius: 13px;
          background: #f8eee7;
          color: #725f55;
          font-size: 12px;
          line-height: 1.8;
        }

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
          .skin-intro h1 { max-width: 570px; font-size: clamp(38px, 8vw, 54px); }
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
          .skin-option { min-height: 47px; }
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
          <span className="skin-brand-mark" aria-hidden="true">C</span>
          <span>
            <span className="skin-brand-name">CureAI</span>
            <span className="skin-brand-tagline">INTELLIGENCE FOR WELLNESS</span>
          </span>
        </Link>
        <Link className="skin-back" to="/">← Back to home</Link>
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
            Skin can change for many reasons. This guided questionnaire helps
            you organize observations about your skin and prepare information
            you may wish to discuss with a healthcare professional.
          </p>

          <div className="skin-note">
            <div className="skin-note-title">
              <span aria-hidden="true">✳</span>
              Your skin deserves attention
            </div>
            <p>
              This questionnaire cannot identify skin cancer or diagnose a
              skin condition. A new, changing, bleeding, or non-healing spot
              should be assessed by a qualified healthcare professional.
            </p>
          </div>

          <div className="skin-progress-card">
            <div className="skin-progress-label">
              <span>Your progress</span>
              <strong>{showReview ? 'Ready to review' : `Step ${step + 1} of ${questions.length}`}</strong>
            </div>
            <div
              className="skin-progress-track"
              role="progressbar"
              aria-label="Assessment progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <div className="skin-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </aside>

        <section className="skin-form-card" aria-live="polite">
          {!showReview ? (
            <>
              <div className="skin-step-label">
                Step {String(step + 1).padStart(2, '0')} / 03
              </div>
              <h2>{questions[step].title}</h2>
              <p className="skin-description">
                {questions[step].subtitle}. Share only what you're comfortable sharing.
              </p>

              {step === 0 && (
                <>
                  <div className="skin-field">
                    <label className="skin-field-label" htmlFor="skin-age">
                      Which age group are you in?
                    </label>
                    <select
                      id="skin-age"
                      className="skin-select"
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

                  <div className="skin-field">
                    <span className="skin-field-label">
                      Which description best matches your skin?
                      <span className="skin-hint">Optional. Choose the closest description.</span>
                    </span>
                    {optionButton('skinType', [
                      'Usually dry',
                      'Usually oily',
                      'Combination',
                      'Sensitive',
                      'Varies by season',
                      'Not sure',
                    ])}
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div className="skin-field">
                    <span className="skin-field-label">
                      Have you noticed any of these changes?
                      <span className="skin-hint">Select all that apply, or skip if none apply.</span>
                    </span>
                    <div className="skin-option-grid">
                      {skinChanges.map((change) => {
                        const selected = answers.changes.includes(change)
                        return (
                          <button
                            type="button"
                            key={change}
                            className={`skin-option ${selected ? 'selected' : ''}`}
                            aria-pressed={selected}
                            onClick={() => toggleChange(change)}
                          >
                            <span className="skin-indicator">{selected ? '✓' : ''}</span>
                            {change}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="skin-field">
                    <label className="skin-field-label" htmlFor="skin-duration">
                      How long have you noticed the change?
                    </label>
                    <select
                      id="skin-duration"
                      className="skin-select"
                      value={answers.duration}
                      onChange={(event) => updateAnswer('duration', event.target.value)}
                    >
                      <option value="">Choose a duration (optional)</option>
                      <option>Less than two weeks</option>
                      <option>Two weeks to three months</option>
                      <option>More than three months</option>
                      <option>It varies</option>
                      <option>Not applicable</option>
                    </select>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="skin-field">
                    <span className="skin-field-label">
                      Do you spend a lot of time outdoors or in direct sunlight?
                    </span>
                    {optionButton('sunExposure', [
                      'Often',
                      'Sometimes',
                      'Rarely',
                      'Not sure',
                      'Prefer not to say',
                    ])}
                  </div>

                  <div className="skin-field">
                    <span className="skin-field-label">
                      Is there a family history of significant skin conditions?
                    </span>
                    {optionButton('familyHistory', [
                      'Yes',
                      'No',
                      'Not sure',
                      'Prefer not to say',
                    ])}
                  </div>

                  <div className="skin-field">
                    <label className="skin-field-label" htmlFor="skin-notes">
                      Anything else you'd like to note?
                      <span className="skin-hint">Optional. Please avoid entering identifying or highly sensitive information.</span>
                    </label>
                    <textarea
                      id="skin-notes"
                      className="skin-textarea"
                      maxLength={500}
                      placeholder="Add a brief note..."
                      value={answers.notes}
                      onChange={(event) => updateAnswer('notes', event.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="skin-form-footer">
                <button
                  type="button"
                  className="skin-btn skin-btn-secondary"
                  onClick={() => setStep((current) => current - 1)}
                  disabled={step === 0}
                >
                  ← Back
                </button>

                <button
                  type="button"
                  className="skin-btn skin-btn-primary"
                  onClick={() => {
                    if (step < questions.length - 1) {
                      setStep((current) => current + 1)
                    } else {
                      setShowReview(true)
                    }
                  }}
                >
                  {step === questions.length - 1 ? 'Review responses' : 'Continue'} →
                </button>
              </div>

              <p className="skin-optional">
                This prototype keeps responses in the current page session and does not submit them to a server.
              </p>
            </>
          ) : (
            <>
              <div className="skin-step-label">Questionnaire complete</div>
              <h2>Your observations, gathered in one place.</h2>
              <p className="skin-description">
                Review your selections below. You can return to edit them or start again.
              </p>

              <div className="skin-review-list">
                {[
                  ['Age group', answers.ageGroup],
                  ['Skin description', answers.skinType],
                  ['Skin changes', answers.changes.join(', ')],
                  ['Duration', answers.duration],
                  ['Sun exposure', answers.sunExposure],
                  ['Family history', answers.familyHistory],
                  ['Additional notes', answers.notes],
                ].map(([label, value]) => (
                  <div className="skin-review-row" key={label}>
                    <div className="skin-review-key">{label}</div>
                    <div className="skin-review-value">{value || 'Not provided'}</div>
                  </div>
                ))}
              </div>

              <div className="skin-review-notice">
                <strong>Important:</strong> This page has organized your responses only.
                It has not analyzed an image, diagnosed a condition, or estimated cancer risk.
                If you are concerned about a new or changing skin lesion, seek assessment from
                a qualified healthcare professional.
              </div>

              <div className="skin-form-footer">
                <button
                  type="button"
                  className="skin-btn skin-btn-secondary"
                  onClick={() => {
                    setShowReview(false)
                    setStep(2)
                  }}
                >
                  ← Edit responses
                </button>
                <button
                  type="button"
                  className="skin-btn skin-btn-primary"
                  onClick={restart}
                >
                  Start again ↻
                </button>
              </div>
            </>
          )}
        </section>
      </div>

      <footer className="skin-footer">
        <span>© {new Date().getFullYear()} CureAI · Intelligence for Wellness</span>
        <span>Informational support, not a substitute for professional medical care.</span>
      </footer>
    </main>
  )
}

export default SkinAssessment
