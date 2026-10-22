
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_BASE_URL

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const passwordsMatch =
    confirmPassword.length === 0 || password === confirmPassword

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setError('')

    if (!token) {
      setError('This reset link is missing its token. Please request a new link.')
      return
    }

    if (password.length < 8) {
      setError('Your password must contain at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Your passwords do not match.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to reset your password.')
      }

      setIsSuccess(true)
      setMessage(
        data.message || 'Your password has been reset. You can now sign in.'
      )
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Unable to connect to CureAI. Please check that the backend is running and try again.'
          : err.message || 'Something went wrong. Please request a new reset link.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="cure-reset">
      <style>{`
        .cure-reset {
          --cr-ink: #173b37;
          --cr-muted: #78877f;
          --cr-green: #245e52;
          --cr-cream: #f7f5ee;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--cr-cream);
          color: var(--cr-ink);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .cure-reset * { box-sizing: border-box; }
        .cr-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 20px 6%;
          border-bottom: 1px solid #e6e8df;
          background: #fffefa;
        }
        .cr-brand { display: flex; align-items: center; gap: 10px; color: var(--cr-ink); text-decoration: none; }
        .cr-brand-mark { width: 40px; height: 40px; display: grid; place-items: center; border-radius: 13px; background: var(--cr-green); color: white; font-size: 24px; }
        .cr-brand-name { font-size: 20px; font-weight: 750; letter-spacing: -1px; }
        .cr-brand-tag { display: block; margin-top: 3px; color: var(--cr-muted); font-size: 8px; letter-spacing: 1px; }
        .cr-header-link { color: var(--cr-green); font-size: 12px; font-weight: 750; text-decoration: none; }
        .cr-main { display: grid; flex: 1; place-items: center; padding: 45px 20px; }
        .cr-card { width: 100%; max-width: 465px; padding: 39px; border: 1px solid #e6e8df; border-radius: 22px; background: #fffefa; box-shadow: 0 18px 55px rgba(33,65,48,.055); }
        .cr-icon { width: 58px; height: 58px; display: grid; place-items: center; margin-bottom: 25px; border-radius: 18px; background: #eaf1e7; color: var(--cr-green); font-size: 27px; }
        .cr-eyebrow { color: #658675; font-size: 10px; font-weight: 800; letter-spacing: 2px; }
        .cr-card h1 { margin: 10px 0 12px; font-size: clamp(27px, 5vw, 34px); letter-spacing: -1.2px; line-height: 1.2; }
        .cr-description { margin: 0 0 27px; color: var(--cr-muted); font-size: 12px; line-height: 1.9; }
        .cr-field { display: flex; flex-direction: column; gap: 9px; margin-bottom: 19px; }
        .cr-field label { color: #52675b; font-size: 11px; font-weight: 750; }
        .cr-input-wrap { position: relative; }
        .cr-field input { width: 100%; padding: 14px; padding-right: 70px; border: 1px solid #e0e5db; border-radius: 10px; outline: none; background: #fffefa; color: var(--cr-ink); font: inherit; font-size: 12px; transition: border-color .2s, box-shadow .2s; }
        .cr-field input:focus { border-color: #79a18a; box-shadow: 0 0 0 3px #4678591a; }
        .cr-field input::placeholder { color: #a0aaa1; }
        .cr-field input:disabled { opacity: .65; cursor: not-allowed; }
        .cr-toggle { position: absolute; top: 50%; right: 12px; transform: translateY(-50%); border: 0; background: transparent; color: var(--cr-green); cursor: pointer; font-size: 10px; font-weight: 750; }
        .cr-hint { margin: -10px 0 18px; color: #8a968d; font-size: 10px; line-height: 1.7; }
        .cr-error { margin: 0 0 18px; color: #b44747; font-size: 11px; line-height: 1.7; }
        .cr-submit { width: 100%; margin-top: 2px; padding: 14px; border: 0; border-radius: 10px; background: var(--cr-green); color: white; cursor: pointer; font: inherit; font-size: 12px; font-weight: 750; transition: background .2s, transform .2s; }
        .cr-submit:hover:not(:disabled) { background: #194a40; transform: translateY(-1px); }
        .cr-submit:disabled { opacity: .65; cursor: not-allowed; }
        .cr-message { margin-top: 18px; padding: 14px; border: 1px solid #dce8d8; border-radius: 10px; background: #f1f6ed; color: #42674c; font-size: 11px; line-height: 1.8; overflow-wrap: anywhere; }
        .cr-message strong { display: block; margin-bottom: 4px; }
        .cr-message-error { border-color: #f0d8d5; background: #fff2f0; color: #9b3939; }
        .cr-back { display: block; margin-top: 22px; color: var(--cr-green); font-size: 11px; font-weight: 750; text-align: center; text-decoration: none; }
        .cr-back:hover { text-decoration: underline; }
        .cr-divider { height: 1px; margin: 24px 0 18px; background: #edf0e9; }
        .cr-help { margin: 0; color: #89958c; font-size: 10px; line-height: 1.8; text-align: center; }
        .cr-help a { color: var(--cr-green); font-weight: 700; }
        .cr-footer { display: flex; justify-content: center; padding: 20px; color: #8b978e; font-size: 10px; text-align: center; }
        @media (max-width: 480px) {
          .cr-header { padding: 16px 18px; }
          .cr-main { padding: 30px 15px; }
          .cr-card { padding: 27px 21px; border-radius: 17px; }
        }
      `}</style>

      <header className="cr-header">
        <Link to="/" className="cr-brand">
          <span className="cr-brand-mark">C</span>
          <span>
            <span className="cr-brand-name">CureAI</span>
            <span className="cr-brand-tag">INTELLIGENCE FOR WELLNESS</span>
          </span>
        </Link>

        <Link to="/login" className="cr-header-link">
          Back to login ↗
        </Link>
      </header>

      <main className="cr-main">
        <section className="cr-card">
          <div className="cr-icon" aria-hidden="true">⌑</div>

          <div className="cr-eyebrow">ACCOUNT SECURITY</div>
          <h1>{isSuccess ? 'Password updated' : 'Create a new password'}</h1>
          <p className="cr-description">
            {isSuccess
              ? 'Your new password is ready to use. Sign in with it to continue to CureAI.'
              : "Choose a strong password you haven't used before. Confirm it below to make sure everything matches."}
          </p>

          {!token && !isSuccess && (
            <div className="cr-message cr-message-error" role="alert">
              <strong>Reset link missing</strong>
              This page needs a valid reset link. Request a new one to continue.
            </div>
          )}

          {!isSuccess && (
            <form onSubmit={handleSubmit}>
              <div className="cr-field">
                <label htmlFor="new-password">New password</label>
                <div className="cr-input-wrap">
                  <input
                    id="new-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    minLength={8}
                    maxLength={128}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value)
                      setError('')
                    }}
                    required
                    disabled={!token || isSubmitting}
                  />
                  <button
                    className="cr-toggle"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    disabled={isSubmitting}
                  >
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>

              <p className="cr-hint">
                Use at least 8 characters. A longer, unique password is better.
              </p>

              <div className="cr-field">
                <label htmlFor="confirm-password">Confirm new password</label>
                <div className="cr-input-wrap">
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Enter your new password again"
                    minLength={8}
                    maxLength={128}
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value)
                      setError('')
                    }}
                    required
                    disabled={!token || isSubmitting}
                  />
                  <button
                    className="cr-toggle"
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword ? 'Hide confirmation' : 'Show confirmation'
                    }
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>

              {!passwordsMatch && (
                <p className="cr-error" role="alert">
                  Your passwords do not match yet.
                </p>
              )}

              {error && (
                <p className="cr-error" role="alert">
                  {error}
                </p>
              )}

              <button
                className="cr-submit"
                type="submit"
                disabled={!token || isSubmitting || !passwordsMatch}
              >
                {isSubmitting ? 'Updating password...' : 'Reset password ↗'}
              </button>
            </form>
          )}

          {message && (
            <div className="cr-message" role="status">
              <strong>{isSuccess ? 'Success!' : 'Notice'}</strong>
              {message}
            </div>
          )}

          <Link to={isSuccess ? '/login' : '/forgot-password'} className="cr-back">
            {isSuccess ? '← Sign in to CureAI' : '← Request a new reset link'}
          </Link>

          <div className="cr-divider" />

          <p className="cr-help">
            Need to return to your account? <Link to="/login">Sign in</Link>
            <br />
            <br />
            CureAI · Intelligence for Wellness
          </p>
        </section>
      </main>

      <footer className="cr-footer">
        © {new Date().getFullYear()} CureAI · Intelligence for Wellness
      </footer>
    </div>
  )
}

export default ResetPassword
