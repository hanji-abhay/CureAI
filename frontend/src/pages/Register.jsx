import { useState } from 'react'
import { Link } from 'react-router-dom'

function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('error')

  function handleSubmit(event) {
    event.preventDefault()
    setMessage('')

    if (fullName.trim().length < 2) {
      setMessage('Please enter your full name.')
      setMessageType('error')
      return
    }

    if (password.length < 8) {
      setMessage('Your password must contain at least 8 characters.')
      setMessageType('error')
      return
    }

    if (password !== confirmPassword) {
      setMessage('Your passwords do not match. Please check them.')
      setMessageType('error')
      return
    }

    if (!acceptedTerms) {
      setMessage('Please acknowledge the terms before continuing.')
      setMessageType('error')
      return
    }

    setMessage(
      'Your details passed the basic checks. Account creation will be enabled when secure backend authentication is connected.'
    )
    setMessageType('success')
  }

  return (
    <main className="register-page">
      <style>{`
        .register-page {
          --register-forest: #153f38;
          --register-cream: #f7f5ef;
          --register-ink: #193a36;
          --register-muted: #7b8981;
          --register-pink: #cf7895;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          background: var(--register-cream);
          color: var(--register-ink);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .register-page * {
          box-sizing: border-box;
        }

        .register-showcase {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 100vh;
          padding: clamp(30px, 5vw, 62px);
          overflow: hidden;
          color: #faf7ef;
          background:
            radial-gradient(ellipse at 80% 20%, rgba(207,120,149,.15), transparent 40%),
            radial-gradient(ellipse at 15% 85%, rgba(111,165,139,.22), transparent 45%),
            #153f38;
        }

        .register-showcase::before {
          position: absolute;
          content: "";
          width: 430px;
          height: 430px;
          right: -250px;
          bottom: 5%;
          border: 1px solid rgba(255,255,255,.13);
          border-radius: 50%;
          box-shadow:
            0 0 0 38px rgba(255,255,255,.025),
            0 0 0 76px rgba(255,255,255,.02);
        }

        .register-showcase::after {
          position: absolute;
          content: "";
          width: 220px;
          height: 220px;
          top: 30%;
          left: -150px;
          border: 1px solid rgba(255,255,255,.11);
          border-radius: 50%;
          box-shadow: 0 0 0 28px rgba(255,255,255,.025);
        }

        .register-brand {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 11px;
          width: fit-content;
          color: #fffaf0;
          text-decoration: none;
          font-size: 23px;
          font-weight: 750;
          letter-spacing: -1px;
        }

        .register-brand-symbol {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,.28);
          border-radius: 13px;
          color: #f0b8cb;
          background: rgba(255,255,255,.07);
          font-size: 21px;
        }

        .register-brand-ai {
          color: #e6a6bc;
        }

        .register-showcase-content {
          position: relative;
          z-index: 1;
          max-width: 470px;
          padding: 50px 0;
        }

        .register-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: #e8b2c4;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .register-eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #e6a6bc;
          box-shadow: 0 0 14px rgba(230,166,188,.55);
        }

        .register-showcase h1 {
          margin: 24px 0 20px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(40px, 5vw, 64px);
          font-weight: 400;
          line-height: 1.1;
          letter-spacing: -2px;
        }

        .register-showcase h1 em {
          color: #e8a7bd;
          font-weight: 400;
        }

        .register-showcase-copy {
          max-width: 380px;
          color: rgba(247,246,235,.73);
          font-size: 14px;
          line-height: 1.9;
        }

        .register-benefits {
          display: flex;
          flex-direction: column;
          gap: 17px;
          margin-top: 32px;
        }

        .register-benefit {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: rgba(247,246,235,.88);
          font-size: 12px;
          line-height: 1.65;
        }

        .register-benefit-icon {
          width: 27px;
          height: 27px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border: 1px solid rgba(232,178,196,.36);
          border-radius: 9px;
          color: #e8b2c4;
          background: rgba(255,255,255,.06);
        }

        .register-showcase-footer {
          position: relative;
          z-index: 1;
          color: rgba(247,246,235,.57);
          font-size: 10px;
          letter-spacing: .5px;
        }

        .register-form-side {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 0;
          padding: 40px 28px;
        }

        .register-form-wrap {
          width: 100%;
          max-width: 430px;
        }

        .register-mobile-brand {
          display: none;
        }

        .register-form-eyebrow {
          margin: 0 0 12px;
          color: #a14d6c;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.8px;
          text-transform: uppercase;
        }

        .register-form-wrap h2 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(34px, 4vw, 45px);
          font-weight: 500;
          line-height: 1.15;
          letter-spacing: -1.3px;
        }

        .register-form-subtitle {
          margin: 12px 0 25px;
          color: var(--register-muted);
          font-size: 13px;
          line-height: 1.8;
        }

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .register-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .register-field label {
          color: var(--register-ink);
          font-size: 12px;
          font-weight: 750;
        }

        .register-input-wrap {
          position: relative;
        }

        .register-input {
          width: 100%;
          min-height: 48px;
          padding: 12px 14px;
          border: 1px solid #e1e4dc;
          border-radius: 11px;
          outline: none;
          color: var(--register-ink);
          background: #fffefa;
          font: inherit;
          font-size: 13px;
          transition: border-color 160ms ease, box-shadow 160ms ease;
        }

        .register-input:focus {
          border-color: #a56d80;
          box-shadow: 0 0 0 3px rgba(207,120,149,.12);
        }

        .register-input::placeholder {
          color: #a3aca4;
        }

        .register-password-input {
          padding-right: 76px;
        }

        .register-password-toggle {
          position: absolute;
          top: 50%;
          right: 13px;
          padding: 5px 0;
          transform: translateY(-50%);
          border: 0;
          color: #8c6171;
          background: transparent;
          font: inherit;
          font-size: 11px;
          font-weight: 750;
          cursor: pointer;
        }

        .register-password-hint {
          margin: -1px 0 0;
          color: #929d94;
          font-size: 10px;
          line-height: 1.6;
        }

        .register-terms {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin-top: 2px;
          color: #748279;
          font-size: 11px;
          line-height: 1.75;
          cursor: pointer;
        }

        .register-terms input {
          width: 15px;
          height: 15px;
          flex-shrink: 0;
          margin: 2px 0 0;
          accent-color: var(--register-forest);
        }

        .register-terms a {
          color: #a14d6c;
          font-weight: 750;
          text-decoration: none;
        }

        .register-terms a:hover {
          text-decoration: underline;
        }

        .register-submit {
          min-height: 49px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 4px;
          border: 0;
          border-radius: 11px;
          color: white;
          background: var(--register-forest);
          font: inherit;
          font-size: 13px;
          font-weight: 750;
          cursor: pointer;
          transition: background 160ms ease, transform 160ms ease;
        }

        .register-submit:hover {
          transform: translateY(-1px);
          background: #20564a;
        }

        .register-feedback {
          margin: 0;
          padding: 12px 14px;
          border: 1px solid #ead0da;
          border-radius: 10px;
          color: #82445c;
          background: #fff3f7;
          font-size: 11px;
          line-height: 1.7;
        }

        .register-feedback.success {
          border-color: #c8ded1;
          color: #315d49;
          background: #eff8f0;
        }

        .register-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 22px 0;
          color: #9aa39b;
          font-size: 10px;
        }

        .register-divider::before,
        .register-divider::after {
          flex: 1;
          height: 1px;
          content: "";
          background: #e5e7df;
        }

        .register-login-prompt {
          color: #78877e;
          font-size: 12px;
          text-align: center;
        }

        .register-login-prompt a {
          color: #a14d6c;
          font-weight: 800;
          text-decoration: none;
        }

        .register-login-prompt a:hover {
          text-decoration: underline;
        }

        .register-bottom-note {
          margin-top: 25px;
          color: #9aa39b;
          font-size: 10px;
          line-height: 1.8;
          text-align: center;
        }

        @media (max-width: 850px) {
          .register-page {
            grid-template-columns: .85fr 1.15fr;
          }

          .register-showcase {
            padding: 30px;
          }

          .register-showcase h1 {
            font-size: 46px;
          }
        }

        @media (max-width: 650px) {
          .register-page {
            grid-template-columns: 1fr;
          }

          .register-showcase {
            display: none;
          }

          .register-form-side {
            min-height: 100vh;
            padding: 28px 23px;
          }

          .register-mobile-brand {
            display: inline-flex;
            align-items: center;
            gap: 9px;
            margin-bottom: 35px;
            color: var(--register-ink);
            text-decoration: none;
            font-size: 22px;
            font-weight: 800;
            letter-spacing: -1px;
          }

          .register-mobile-brand .register-brand-symbol {
            color: #f1b7cb;
            background: var(--register-forest);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .register-page *,
          .register-page *::before,
          .register-page *::after {
            transition: none !important;
          }
        }
      `}</style>

      <section className="register-showcase">
        <Link to="/" className="register-brand">
          <span className="register-brand-symbol" aria-hidden="true">✳</span>
          <span>
            Cure<span className="register-brand-ai">AI</span>
          </span>
        </Link>

        <div className="register-showcase-content">
          <span className="register-eyebrow">
            <span className="register-eyebrow-dot" />
            Intelligence for Wellness
          </span>

          <h1>
            Begin with
            <br />
            <em>your wellbeing.</em>
          </h1>

          <p className="register-showcase-copy">
            Create your space to explore health information, keep track
            of your observations, and prepare for more informed
            conversations about your health.
          </p>

          <div className="register-benefits">
            <div className="register-benefit">
              <span className="register-benefit-icon" aria-hidden="true">✧</span>
              <span>
                <strong>Explore health topics</strong>
                <br />
                Guided educational assessments across four health areas.
              </span>
            </div>

            <div className="register-benefit">
              <span className="register-benefit-icon" aria-hidden="true">⌁</span>
              <span>
                <strong>Keep your journey organised</strong>
                <br />
                A dedicated space for your profile and assessment history
                as those features become available.
              </span>
            </div>

            <div className="register-benefit">
              <span className="register-benefit-icon" aria-hidden="true">♡</span>
              <span>
                <strong>Health information, with care</strong>
                <br />
                Clear boundaries between educational guidance and medical care.
              </span>
            </div>
          </div>
        </div>

        <footer className="register-showcase-footer">
          A MORE THOUGHTFUL APPROACH TO HEALTH INFORMATION
        </footer>
      </section>

      <section className="register-form-side">
        <div className="register-form-wrap">
          <Link to="/" className="register-mobile-brand">
            <span className="register-brand-symbol" aria-hidden="true">✳</span>
            <span>
              Cure<span className="register-brand-ai">AI</span>
            </span>
          </Link>

          <p className="register-form-eyebrow">YOUR JOURNEY STARTS HERE</p>

          <h2>Create your account.</h2>

          <p className="register-form-subtitle">
            A few details, and you're ready to get started.
          </p>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="register-field">
              <label htmlFor="register-name">Full name</label>
              <input
                id="register-name"
                className="register-input"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(event) => {
                  setFullName(event.target.value)
                  setMessage('')
                }}
                minLength={2}
                maxLength={100}
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="register-email">Email address</label>
              <input
                id="register-email"
                className="register-input"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setMessage('')
                }}
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="register-password">Create password</label>

              <div className="register-input-wrap">
                <input
                  id="register-password"
                  className="register-input register-password-input"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    setMessage('')
                  }}
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <p className="register-password-hint">
                Use at least 8 characters. Choose a password you don't use elsewhere.
              </p>
            </div>

            <div className="register-field">
              <label htmlFor="register-confirm-password">
                Confirm password
              </label>

              <div className="register-input-wrap">
                <input
                  id="register-confirm-password"
                  className="register-input register-password-input"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Enter your password again"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value)
                    setMessage('')
                  }}
                  required
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword((value) => !value)
                  }
                  aria-label={
                    showConfirmPassword
                      ? 'Hide confirmation password'
                      : 'Show confirmation password'
                  }
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <label className="register-terms">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => {
                  setAcceptedTerms(event.target.checked)
                  setMessage('')
                }}
              />
              <span>
                I understand CureAI provides educational health information
                and is not a substitute for professional medical advice.
                <span> I acknowledge this before continuing.</span>
              </span>
            </label>

            <button type="submit" className="register-submit">
              Create account <span aria-hidden="true">→</span>
            </button>

            {message && (
              <p
                className={`register-feedback ${
                  messageType === 'success' ? 'success' : ''
                }`}
                role="status"
              >
                {message}
              </p>
            )}
          </form>

          <div className="register-divider">ALREADY WITH CUREAI?</div>

          <p className="register-login-prompt">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>

          <p className="register-bottom-note">
            © {new Date().getFullYear()} CureAI · Intelligence for Wellness
          </p>
        </div>
      </section>
    </main>
  )
}

export default Register
