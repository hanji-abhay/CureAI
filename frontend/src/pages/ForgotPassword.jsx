
import { useState } from 'react'
import { Link } from 'react-router-dom'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="cure-forgot">
      <style>{`
        .cure-forgot {
          --cf-ink: #173b37;
          --cf-muted: #78877f;
          --cf-green: #245e52;
          --cf-cream: #f7f5ee;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--cf-cream);
          color: var(--cf-ink);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .cure-forgot * { box-sizing: border-box; }
        .cf-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 20px 6%;
          border-bottom: 1px solid #e6e8df;
          background: #fffefa;
        }
        .cf-brand { display: flex; align-items: center; gap: 10px; color: var(--cf-ink); text-decoration: none; }
        .cf-brand-mark { width: 40px; height: 40px; display: grid; place-items: center; border-radius: 13px; background: var(--cf-green); color: white; font-size: 24px; }
        .cf-brand-name { font-size: 20px; font-weight: 750; letter-spacing: -1px; }
        .cf-brand-tag { display: block; margin-top: 3px; color: var(--cf-muted); font-size: 8px; letter-spacing: 1px; }
        .cf-header-link { color: var(--cf-green); font-size: 12px; font-weight: 750; text-decoration: none; }
        .cf-main { display: grid; flex: 1; place-items: center; padding: 50px 20px; }
        .cf-card { width: 100%; max-width: 465px; padding: 39px; border: 1px solid #e6e8df; border-radius: 22px; background: #fffefa; box-shadow: 0 18px 55px rgba(33,65,48,.055); }
        .cf-icon { width: 58px; height: 58px; display: grid; place-items: center; margin-bottom: 25px; border-radius: 18px; background: #eaf1e7; color: var(--cf-green); font-size: 27px; }
        .cf-eyebrow { color: #658675; font-size: 10px; font-weight: 800; letter-spacing: 2px; }
        .cf-card h1 { margin: 10px 0 12px; font-size: clamp(27px, 5vw, 34px); letter-spacing: -1.2px; line-height: 1.2; }
        .cf-description { margin: 0 0 27px; color: var(--cf-muted); font-size: 12px; line-height: 1.9; }
        .cf-field { display: flex; flex-direction: column; gap: 9px; }
        .cf-field label { color: #52675b; font-size: 11px; font-weight: 750; }
        .cf-field input { width: 100%; padding: 14px; border: 1px solid #e0e5db; border-radius: 10px; outline: none; background: #fffefa; color: var(--cf-ink); font: inherit; font-size: 12px; transition: border-color .2s, box-shadow .2s; }
        .cf-field input:focus { border-color: #79a18a; box-shadow: 0 0 0 3px #4678591a; }
        .cf-field input::placeholder { color: #a0aaa1; }
        .cf-submit { width: 100%; margin-top: 19px; padding: 14px; border: 0; border-radius: 10px; background: var(--cf-green); color: white; cursor: pointer; font: inherit; font-size: 12px; font-weight: 750; transition: background .2s, transform .2s; }
        .cf-submit:hover { background: #194a40; transform: translateY(-1px); }
        .cf-message { margin-top: 18px; padding: 14px; border: 1px solid #dce8d8; border-radius: 10px; background: #f1f6ed; color: #42674c; font-size: 11px; line-height: 1.8; }
        .cf-message strong { display: block; margin-bottom: 4px; }
        .cf-back { display: block; margin-top: 22px; color: var(--cf-green); font-size: 11px; font-weight: 750; text-align: center; text-decoration: none; }
        .cf-back:hover { text-decoration: underline; }
        .cf-divider { height: 1px; margin: 24px 0 18px; background: #edf0e9; }
        .cf-help { margin: 0; color: #89958c; font-size: 10px; line-height: 1.8; text-align: center; }
        .cf-help a { color: var(--cf-green); text-decoration: none; font-weight: 750; }
        .cf-footer { display: flex; justify-content: center; padding: 20px; color: #8b978e; font-size: 10px; text-align: center; }
        @media (max-width: 480px) {
          .cf-header { padding: 16px 18px; }
          .cf-main { padding: 30px 15px; }
          .cf-card { padding: 27px 21px; border-radius: 17px; }
        }
      `}</style>

      <header className="cf-header">
        <Link to="/" className="cf-brand">
          <span className="cf-brand-mark">C</span>
          <span>
            <span className="cf-brand-name">CureAI</span>
            <span className="cf-brand-tag">INTELLIGENCE FOR WELLNESS</span>
          </span>
        </Link>

        <Link to="/login" className="cf-header-link">
          Back to login ↗
        </Link>
      </header>

      <main className="cf-main">
        <section className="cf-card">
          <div className="cf-icon" aria-hidden="true">⌑</div>

          <div className="cf-eyebrow">ACCOUNT RECOVERY</div>
          <h1>Forgot your password?</h1>
          <p className="cf-description">
            It happens. Enter the email address associated with your account
            and we'll guide you through the next step.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="cf-field">
              <label htmlFor="recovery-email">Email address</label>
              <input
                id="recovery-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setSubmitted(false)
                }}
                required
              />
            </div>

            <button className="cf-submit" type="submit">
              Continue&nbsp; ↗
            </button>
          </form>

          {submitted && (
            <div className="cf-message" role="status">
              <strong>Form submitted for preview</strong>
              Your email passed browser validation. Password recovery is not
              connected yet, so no email has been sent and no account has been
              changed.
            </div>
          )}

          <Link to="/login" className="cf-back">
            ← Return to login
          </Link>

          <div className="cf-divider" />

          <p className="cf-help">
            Need an account instead? <Link to="/register">Create one</Link>
            <br />
            <br />
            CureAI preview · Account recovery requires a connected backend.
          </p>
        </section>
      </main>

      <footer className="cf-footer">
        © {new Date().getFullYear()} CureAI · Intelligence for Wellness
      </footer>
    </div>
  )
}

export default ForgotPassword
