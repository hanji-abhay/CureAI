import { useState } from 'react'
import { Link } from 'react-router-dom'

const initialAnswers = {
  ageGroup: '',
  changes: [],
  duration: '',
  familyHistory: '',
  previousEvaluation: '',
  notes: '',
}

const questions = [
  {
    key: 'ageGroup',
    title: 'Which age group do you belong to?',
    description: 'Choose the age range that includes you.',
    options: [
      'Under 18',
      '18–29 years',
      '30–39 years',
      '40–49 years',
      '50–59 years',
      '60 years or above',
    ],
  },
]

const changeOptions = [
  {
    value: 'Lump or thickening',
    label: 'A new lump or area of thickening',
    detail: 'A new or distinct area that feels different.',
  },
  {
    value: 'Shape or size change',
    label: 'A change in breast size or shape',
    detail: 'A change that is new or unusual for you.',
  },
  {
    value: 'Skin changes',
    label: 'Skin dimpling, puckering, or redness',
    detail: 'A visible change in the skin of the breast.',
  },
  {
    value: 'Nipple changes',
    label: 'A new nipple change',
    detail: 'For example, a newly inverted nipple.',
  },
  {
    value: 'Nipple discharge',
    label: 'Nipple discharge',
    detail: 'Especially discharge that is bloody or occurs without squeezing.',
  },
  {
    value: 'Persistent pain',
    label: 'Persistent or unusual breast pain',
    detail: 'Pain that is new, ongoing, or different from usual.',
  },
  {
    value: 'Underarm change',
    label: 'A lump or swelling near the underarm',
    detail: 'A new change around the armpit or collarbone.',
  },
  {
    value: 'No changes',
    label: 'None of these changes',
    detail: 'I am exploring breast health without a specific change.',
  },
]

const steps = [
  { label: 'About you', number: '01' },
  { label: 'Changes', number: '02' },
  { label: 'Health history', number: '03' },
]

function ChoiceCard({ selected, onClick, children, description }) {
  return (
    <button
      type="button"
      className={`breast-choice ${selected ? 'selected' : ''}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span className="breast-choice-indicator">
        {selected ? '✓' : ''}
      </span>
      <span className="breast-choice-copy">
        <span className="breast-choice-title">{children}</span>
        {description && (
          <span className="breast-choice-description">
            {description}
          </span>
        )}
      </span>
    </button>
  )
}

function BreastAssessment() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(initialAnswers)
  const [reviewing, setReviewing] = useState(false)

  const updateAnswer = (key, value) => {
    setAnswers((previous) => ({
      ...previous,
      [key]: value,
    }))
  }

  const toggleChange = (value) => {
    setAnswers((previous) => {
      const selected = previous.changes

      if (value === 'No changes') {
        return {
          ...previous,
          changes: selected.includes(value) ? [] : [value],
        }
      }

      const withoutNone = selected.filter(
        (item) => item !== 'No changes'
      )

      return {
        ...previous,
        changes: withoutNone.includes(value)
          ? withoutNone.filter((item) => item !== value)
          : [...withoutNone, value],
      }
    })
  }

  const canContinue = () => {
    if (step === 0) return Boolean(answers.ageGroup)
    if (step === 1) return answers.changes.length > 0
    if (step === 2) {
      return Boolean(
        answers.duration &&
          answers.familyHistory &&
          answers.previousEvaluation
      )
    }
    return true
  }

  const resetAssessment = () => {
    setAnswers(initialAnswers)
    setStep(0)
    setReviewing(false)
  }

  const startReview = () => {
    if (canContinue()) setReviewing(true)
  }

  const sections = [
    {
      title: 'About you',
      subtitle: 'A little context before we begin.',
    },
    {
      title: 'Changes you have noticed',
      subtitle:
        'Select any changes that apply. Everyone’s experience is different.',
    },
    {
      title: 'Your health history',
      subtitle:
        'These details can help you prepare for a conversation with a healthcare professional.',
    },
  ]

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
          background: #f7f5ef;
          color: var(--breast-ink);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
          padding-bottom: 56px;
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
          color: var(--breast-ink);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 10px;
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
          color: white;
          background: #214e46;
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
          max-width: 940px;
          margin: 0 auto;
          padding: 40px 24px 0;
        }

        .breast-heading {
          text-align: center;
          max-width: 660px;
          margin: 0 auto 30px;
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
          margin: 0 auto;
          max-width: 540px;
          color: var(--breast-muted);
          font-size: 14px;
          line-height: 1.8;
        }

        .breast-progress-card {
          padding: 21px 25px;
          margin-bottom: 20px;
          background: #fffefa;
          border: 1px solid var(--breast-line);
          border-radius: 18px;
        }

        .breast-progress-top {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
          font-size: 12px;
          font-weight: 700;
        }

        .breast-progress-count {
          color: var(--breast-pink-dark);
        }

        .breast-progress-track {
          width: 100%;
          height: 5px;
          overflow: hidden;
          border-radius: 20px;
          background: #eeeae3;
        }

        .breast-progress-fill {
          height: 100%;
          border-radius: inherit;
          background: var(--breast-pink);
          transition: width 220ms ease;
        }

        .breast-step-labels {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
          margin-top: 18px;
        }

        .breast-step-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #98a19b;
          font-size: 11px;
          font-weight: 650;
        }

        .breast-step-number {
          width: 25px;
          height: 25px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border: 1px solid #e4e5dd;
          border-radius: 50%;
          font-size: 10px;
        }

        .breast-step-label.active {
          color: var(--breast-ink);
        }

        .breast-step-label.active .breast-step-number {
          color: white;
          border-color: var(--breast-pink);
          background: var(--breast-pink);
        }

        .breast-step-label.completed .breast-step-number {
          color: var(--breast-pink-dark);
          border-color: #ecc4d2;
          background: var(--breast-pink-light);
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

        .breast-field {
          margin-top: 27px;
        }

        .breast-field:first-of-type {
          margin-top: 0;
        }

        .breast-field-label {
          display: block;
          margin-bottom: 12px;
          font-size: 13px;
          font-weight: 750;
          line-height: 1.6;
        }

        .breast-field-hint {
          display: block;
          margin-top: 4px;
          color: var(--breast-muted);
          font-size: 11px;
          font-weight: 400;
          line-height: 1.6;
        }

        .breast-choice-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .breast-choice {
          width: 100%;
          min-width: 0;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 15px;
          text-align: left;
          color: var(--breast-ink);
          border: 1px solid #e6e7df;
          border-radius: 13px;
          background: #fffefa;
          cursor: pointer;
          transition: border-color 160ms ease,
            background 160ms ease, transform 160ms ease;
        }

        .breast-choice:hover {
          border-color: #d9a0b4;
          transform: translateY(-1px);
        }

        .breast-choice.selected {
          border-color: var(--breast-pink);
          background: #fff5f8;
        }

        .breast-choice-indicator {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          margin-top: 1px;
          border: 1px solid #d7dbd3;
          border-radius: 5px;
          color: white;
          font-size: 11px;
        }

        .breast-choice.selected .breast-choice-indicator {
          border-color: var(--breast-pink);
          background: var(--breast-pink);
        }

        .breast-choice-copy {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .breast-choice-title {
          font-size: 12px;
          font-weight: 750;
          line-height: 1.55;
        }

        .breast-choice-description {
          color: var(--breast-muted);
          font-size: 11px;
          line-height: 1.6;
        }

        .breast-textarea {
          display: block;
          width: 100%;
          min-height: 110px;
          resize: vertical;
          padding: 14px 15px;
          border: 1px solid #e0e3da;
          border-radius: 12px;
          outline: none;
          background: #fffefa;
          color: var(--breast-ink);
          font: inherit;
          font-size: 13px;
          line-height: 1.7;
          transition: border-color 160ms ease,
            box-shadow 160ms ease;
        }

        .breast-textarea:focus {
          border-color: var(--breast-pink);
          box-shadow: 0 0 0 3px rgba(200, 92, 130, 0.1);
        }

        .breast-textarea::placeholder {
          color: #a1aaa2;
        }

        .breast-note {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-top: 25px;
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

        .breast-form-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 30px;
          padding-top: 22px;
          border-top: 1px solid #eeeee7;
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
          opacity: 0.42;
          cursor: not-allowed;
        }

        .breast-button-primary {
          color: white;
          background: var(--breast-pink-dark);
        }

        .breast-button-primary:hover:not(:disabled) {
          background: #81334f;
        }

        .breast-button-secondary {
          color: var(--breast-ink);
          border-color: #e1e4dc;
          background: #fffefa;
        }

        .breast-review-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
          padding: 17px 0;
          border-bottom: 1px solid #eeeee7;
        }

        .breast-review-row:last-child {
          border-bottom: 0;
        }

        .breast-review-label {
          color: var(--breast-muted);
          font-size: 12px;
          line-height: 1.6;
        }

        .breast-review-value {
          max-width: 65%;
          color: var(--breast-ink);
          font-size: 12px;
          font-weight: 700;
          line-height: 1.7;
          text-align: right;
          overflow-wrap: anywhere;
        }

        .breast-review-edit {
          padding: 5px 0;
          border: 0;
          color: var(--breast-pink-dark);
          background: transparent;
          font: inherit;
          font-size: 11px;
          font-weight: 750;
          cursor: pointer;
        }

        .breast-review-edit:hover {
          text-decoration: underline;
        }

        .breast-success-mark {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          margin-bottom: 20px;
          border-radius: 18px;
          color: var(--breast-pink-dark);
          background: var(--breast-pink-light);
          font-size: 25px;
        }

        .breast-footer {
          margin: 25px auto 0;
          max-width: 580px;
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

          .breast-progress-card {
            padding: 17px;
          }

          .breast-step-label {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
            font-size: 10px;
          }

          .breast-choice-grid {
            grid-template-columns: 1fr;
          }

          .breast-form-footer {
            align-items: stretch;
          }

          .breast-button {
            padding: 11px 14px;
          }

          .breast-review-row {
            gap: 10px;
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
          <span className="breast-brand-mark" aria-hidden="true">✳</span>
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
            Breast health awareness
          </span>

          <h1>
            Your health, your <span>story.</span>
          </h1>

          <p>
            Take a moment to reflect on your breast health. This guided
            questionnaire helps you organise what you have noticed and
            prepare for a conversation with a qualified healthcare
            professional.
          </p>
        </header>

        {!reviewing ? (
          <>
            <section className="breast-progress-card" aria-label="Assessment progress">
              <div className="breast-progress-top">
                <span>{sections[step].title}</span>
                <span className="breast-progress-count">
                  STEP {step + 1} OF {steps.length}
                </span>
              </div>

              <div
                className="breast-progress-track"
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={steps.length}
                aria-valuenow={step + 1}
              >
                <div
                  className="breast-progress-fill"
                  style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                />
              </div>

              <div className="breast-step-labels">
                {steps.map((item, index) => (
                  <div
                    key={item.number}
                    className={`breast-step-label ${
                      index === step
                        ? 'active'
                        : index < step
                          ? 'completed'
                          : ''
                    }`}
                  >
                    <span className="breast-step-number">
                      {index < step ? '✓' : item.number}
                    </span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="breast-form-card">
              <p className="breast-section-kicker">
                CUREAI · BREAST HEALTH
              </p>

              <h2 className="breast-section-title">
                {sections[step].title}
              </h2>

              <p className="breast-section-subtitle">
                {sections[step].subtitle}
              </p>

              {step === 0 && (
                <div className="breast-field">
                  <label className="breast-field-label">
                    Which age group do you belong to?
                    <span className="breast-field-hint">
                      This helps provide context for a healthcare discussion.
                    </span>
                  </label>

                  <div className="breast-choice-grid">
                    {questions[0].options.map((option) => (
                      <ChoiceCard
                        key={option}
                        selected={answers.ageGroup === option}
                        onClick={() => updateAnswer('ageGroup', option)}
                      >
                        {option}
                      </ChoiceCard>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="breast-field">
                  <label className="breast-field-label">
                    Have you noticed any of these changes?
                    <span className="breast-field-hint">
                      Select all that apply. Choose “None” only if none
                      of the listed changes apply to you.
                    </span>
                  </label>

                  <div className="breast-choice-grid">
                    {changeOptions.map((option) => (
                      <ChoiceCard
                        key={option.value}
                        selected={answers.changes.includes(option.value)}
                        onClick={() => toggleChange(option.value)}
                        description={option.detail}
                      >
                        {option.label}
                      </ChoiceCard>
                    ))}
                  </div>

                  <div className="breast-field">
                    <label className="breast-field-label">
                      How long have you noticed these changes?
                    </label>

                    <div className="breast-choice-grid">
                      {[
                        'Less than 2 weeks',
                        '2–6 weeks',
                        'More than 6 weeks',
                        'No specific change / not sure',
                      ].map((option) => (
                        <ChoiceCard
                          key={option}
                          selected={answers.duration === option}
                          onClick={() => updateAnswer('duration', option)}
                        >
                          {option}
                        </ChoiceCard>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <>
                  <div className="breast-field">
                    <label className="breast-field-label">
                      Is there a family history of breast or ovarian cancer?
                    </label>

                    <div className="breast-choice-grid">
                      {[
                        'Yes',
                        'No',
                        'Not sure',
                        'Prefer not to say',
                      ].map((option) => (
                        <ChoiceCard
                          key={option}
                          selected={answers.familyHistory === option}
                          onClick={() =>
                            updateAnswer('familyHistory', option)
                          }
                        >
                          {option}
                        </ChoiceCard>
                      ))}
                    </div>
                  </div>

                  <div className="breast-field">
                    <label className="breast-field-label">
                      Have you discussed these concerns with a healthcare
                      professional before?
                    </label>

                    <div className="breast-choice-grid">
                      {[
                        'Yes, previously evaluated',
                        'No, not yet',
                        'No concerns to discuss',
                        'Prefer not to say',
                      ].map((option) => (
                        <ChoiceCard
                          key={option}
                          selected={answers.previousEvaluation === option}
                          onClick={() =>
                            updateAnswer('previousEvaluation', option)
                          }
                        >
                          {option}
                        </ChoiceCard>
                      ))}
                    </div>
                  </div>

                  <div className="breast-field">
                    <label className="breast-field-label" htmlFor="breast-notes">
                      Anything else you would like to record?
                      <span className="breast-field-hint">
                        Optional. Avoid entering names or other identifying
                        information.
                      </span>
                    </label>

                    <textarea
                      id="breast-notes"
                      className="breast-textarea"
                      value={answers.notes}
                      onChange={(event) =>
                        updateAnswer('notes', event.target.value)
                      }
                      placeholder="Record questions, observations, or details you would like to discuss..."
                      maxLength={1000}
                    />
                  </div>

                  <div className="breast-note">
                    <span className="breast-note-icon" aria-hidden="true">
                      ♡
                    </span>
                    <span>
                      <strong>Gentle but important reminder:</strong>{' '}
                      a new lump, bloody nipple discharge, new nipple
                      inversion, skin dimpling, or another persistent
                      breast change deserves prompt clinical evaluation.
                      Do not wait to complete this questionnaire before
                      seeking care.
                    </span>
                  </div>
                </>
              )}

              <div className="breast-form-footer">
                <button
                  type="button"
                  className="breast-button breast-button-secondary"
                  onClick={() => {
                    if (step === 0) {
                      window.location.href = '/'
                    } else {
                      setStep((current) => current - 1)
                    }
                  }}
                >
                  {step === 0 ? '← Exit assessment' : '← Previous'}
                </button>

                {step < 2 ? (
                  <button
                    type="button"
                    className="breast-button breast-button-primary"
                    disabled={!canContinue()}
                    onClick={() => setStep((current) => current + 1)}
                  >
                    Continue <span aria-hidden="true">→</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="breast-button breast-button-primary"
                    disabled={!canContinue()}
                    onClick={startReview}
                  >
                    Review answers <span aria-hidden="true">→</span>
                  </button>
                )}
              </div>
            </section>
          </>
        ) : (
          <section className="breast-form-card">
            <div className="breast-success-mark" aria-hidden="true">♡</div>

            <p className="breast-section-kicker">
              YOUR RESPONSES
            </p>

            <h2 className="breast-section-title">
              Take a look before you finish.
            </h2>

            <p className="breast-section-subtitle">
              Review the information you entered. This is a summary of
              your responses, not a medical result or cancer assessment.
            </p>

            <div>
              <div className="breast-review-row">
                <span className="breast-review-label">Age group</span>
                <span className="breast-review-value">{answers.ageGroup}</span>
                <button
                  type="button"
                  className="breast-review-edit"
                  onClick={() => {
                    setStep(0)
                    setReviewing(false)
                  }}
                >
                  Edit
                </button>
              </div>

              <div className="breast-review-row">
                <span className="breast-review-label">Changes noticed</span>
                <span className="breast-review-value">
                  {answers.changes.join(', ')}
                </span>
                <button
                  type="button"
                  className="breast-review-edit"
                  onClick={() => {
                    setStep(1)
                    setReviewing(false)
                  }}
                >
                  Edit
                </button>
              </div>

              <div className="breast-review-row">
                <span className="breast-review-label">Duration</span>
                <span className="breast-review-value">
                  {answers.duration}
                </span>
                <button
                  type="button"
                  className="breast-review-edit"
                  onClick={() => {
                    setStep(1)
                    setReviewing(false)
                  }}
                >
                  Edit
                </button>
              </div>

              <div className="breast-review-row">
                <span className="breast-review-label">Family history</span>
                <span className="breast-review-value">
                  {answers.familyHistory}
                </span>
                <button
                  type="button"
                  className="breast-review-edit"
                  onClick={() => {
                    setStep(2)
                    setReviewing(false)
                  }}
                >
                  Edit
                </button>
              </div>

              <div className="breast-review-row">
                <span className="breast-review-label">
                  Previous evaluation
                </span>
                <span className="breast-review-value">
                  {answers.previousEvaluation}
                </span>
                <button
                  type="button"
                  className="breast-review-edit"
                  onClick={() => {
                    setStep(2)
                    setReviewing(false)
                  }}
                >
                  Edit
                </button>
              </div>

              {answers.notes.trim() && (
                <div className="breast-review-row">
                  <span className="breast-review-label">Your notes</span>
                  <span className="breast-review-value">
                    {answers.notes}
                  </span>
                  <button
                    type="button"
                    className="breast-review-edit"
                    onClick={() => {
                      setStep(2)
                      setReviewing(false)
                    }}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            <div className="breast-note">
              <span className="breast-note-icon" aria-hidden="true">♡</span>
              <span>
                CureAI does not diagnose breast conditions or estimate
                your cancer risk from these answers. Consider sharing
                your observations with a qualified healthcare professional.
                This summary remains in the current page state and is
                not saved to an account or sent to a server.
              </span>
            </div>

            <div className="breast-form-footer">
              <button
                type="button"
                className="breast-button breast-button-secondary"
                onClick={() => setReviewing(false)}
              >
                ← Back
              </button>

              <button
                type="button"
                className="breast-button breast-button-primary"
                onClick={resetAssessment}
              >
                Start again ↻
              </button>
            </div>
          </section>
        )}

        <p className="breast-footer">
          CureAI · Intelligence for Wellness
          <br />
          Educational support only. This questionnaire is not a substitute
          for professional medical advice, examination, screening, or diagnosis.
        </p>
      </div>
    </main>
  )
}

export default BreastAssessment
