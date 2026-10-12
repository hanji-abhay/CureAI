
import { useState } from 'react'
import { Link } from 'react-router-dom'

function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    pronouns: '',
    country: 'India',
  })

  const [preferences, setPreferences] = useState({
    reminders: false,
    updates: true,
  })

  const [message, setMessage] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setProfile((current) => ({
      ...current,
      [name]: value,
    }))

    setMessage('')
  }

  function handlePreferenceChange(event) {
    const { name, checked } = event.target

    setPreferences((current) => ({
      ...current,
      [name]: checked,
    }))

    setMessage('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    setMessage(
      'Your changes are ready for preview. Connect the backend to save your profile securely.'
    )
  }

  return (
    <div className="cure-profile">
      <style>{`
        .cure-profile {
          --cp-ink: #173b37;
          --cp-muted: #78877f;
          --cp-green: #245e52;
          --cp-cream: #f7f5ee;
          --cp-line: #e6e8df;
          min-height: 100vh;
          background: var(--cp-cream);
          color: var(--cp-ink);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .cure-profile * { box-sizing: border-box; }
        .cp-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 20px 6%;
          border-bottom: 1px solid var(--cp-line);
          background: #fffefa;
        }
        .cp-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--cp-ink);
          text-decoration: none;
        }
        .cp-brand-mark {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: var(--cp-green);
          color: white;
          font-size: 24px;
        }
        .cp-brand-name { font-size: 20px; font-weight: 750; letter-spacing: -1px; }
        .cp-brand-tag { display: block; margin-top: 3px; color: var(--cp-muted); font-size: 8px; letter-spacing: 1px; }
        .cp-header-links { display: flex; align-items: center; gap: 20px; }
        .cp-header-links a { color: var(--cp-muted); font-size: 12px; text-decoration: none; }
        .cp-header-links a:hover { color: var(--cp-green); }
        .cp-header-links .cp-dashboard-link { padding: 10px 14px; border-radius: 9px; background: var(--cp-green); color: white; font-weight: 700; }
        .cp-main { width: 100%; max-width: 1050px; margin: 0 auto; padding: 38px 24px 55px; }
        .cp-breadcrumb { margin-bottom: 27px; color: var(--cp-muted); font-size: 12px; }
        .cp-breadcrumb a { color: var(--cp-green); text-decoration: none; }
        .cp-heading { margin-bottom: 26px; }
        .cp-eyebrow { color: #658675; font-size: 10px; font-weight: 800; letter-spacing: 2px; }
        .cp-heading h1 { margin: 9px 0; font-size: clamp(30px, 4vw, 39px); letter-spacing: -1.5px; }
        .cp-heading p { max-width: 600px; margin: 0; color: var(--cp-muted); font-size: 13px; line-height: 1.8; }
        .cp-layout { display: grid; grid-template-columns: 255px minmax(0, 1fr); gap: 21px; align-items: start; }
        .cp-card { border: 1px solid var(--cp-line); border-radius: 17px; background: #fffefa; }
        .cp-identity { padding: 25px 20px; text-align: center; }
        .cp-avatar {
          width: 84px;
          height: 84px;
          display: grid;
          place-items: center;
          margin: 0 auto 15px;
          border: 5px solid #edf1e7;
          border-radius: 50%;
          background: #dfe9db;
          color: #315d4b;
          font-size: 34px;
        }
        .cp-identity h2 { margin: 0; font-size: 18px; overflow-wrap: anywhere; }
        .cp-identity > p { margin: 7px 0 16px; color: var(--cp-muted); font-size: 11px; overflow-wrap: anywhere; }
        .cp-status { display: inline-flex; align-items: center; gap: 6px; padding: 7px 10px; border-radius: 30px; background: #f0f3e9; color: #55735d; font-size: 10px; font-weight: 700; }
        .cp-status-dot { width: 6px; height: 6px; border-radius: 50%; background: #86a77c; }
        .cp-side-links { display: grid; gap: 5px; padding: 12px; border-top: 1px solid var(--cp-line); }
        .cp-side-links a { display: flex; align-items: center; gap: 11px; padding: 12px; border-radius: 10px; color: var(--cp-muted); font-size: 12px; text-decoration: none; }
        .cp-side-links a:hover, .cp-side-links a.cp-selected { background: #edf2e9; color: var(--cp-green); }
        .cp-side-icon { width: 20px; text-align: center; font-size: 17px; }
        .cp-side-note { margin: 15px 0 0; padding: 15px; border-radius: 12px; background: #f4f2e9; color: #738076; font-size: 11px; line-height: 1.7; text-align: left; }
        .cp-form-card { padding: 27px; }
        .cp-form-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 15px; padding-bottom: 21px; border-bottom: 1px solid var(--cp-line); }
        .cp-form-heading h2 { margin: 0; font-size: 18px; }
        .cp-form-heading p { margin: 7px 0 0; color: var(--cp-muted); font-size: 11px; line-height: 1.7; }
        .cp-section-label { margin: 23px 0 16px; color: #698474; font-size: 10px; font-weight: 800; letter-spacing: 1.5px; }
        .cp-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 17px; }
        .cp-field { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .cp-field label { color: #52675b; font-size: 11px; font-weight: 700; }
        .cp-field input, .cp-field select {
          width: 100%;
          min-width: 0;
          padding: 12px;
          border: 1px solid #e0e5db;
          border-radius: 9px;
          outline: none;
          background: #fffefa;
          color: var(--cp-ink);
          font: inherit;
          font-size: 12px;
          transition: border-color .2s, box-shadow .2s;
        }
        .cp-field input:focus, .cp-field select:focus { border-color: #79a18a; box-shadow: 0 0 0 3px rgba(70,120,89,.1); }
        .cp-field input::placeholder { color: #a0aaa1; }
        .cp-field small { color: #8b968c; font-size: 10px; line-height: 1.5; }
        .cp-preferences { display: grid; gap: 0; }
        .cp-preference {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 16px 0;
          border-bottom: 1px solid #edf0e9;
        }
        .cp-preference:last-child { border-bottom: 0; }
        .cp-preference-copy strong { display: block; font-size: 12px; }
        .cp-preference-copy span { display: block; margin-top: 5px; color: var(--cp-muted); font-size: 10px; line-height: 1.6; }
        .cp-toggle { position: relative; width: 40px; height: 23px; flex-shrink: 0; }
        .cp-toggle input { position: absolute; width: 1px; height: 1px; opacity: 0; }
        .cp-toggle-track { position: absolute; inset: 0; border-radius: 30px; background: #dce1d7; cursor: pointer; transition: background .2s; }
        .cp-toggle-track::after { content: ""; position: absolute; top: 3px; left: 3px; width: 17px; height: 17px; border-radius: 50%; background: white; box-shadow: 0 1px 3px #0002; transition: transform .2s; }
        .cp-toggle input:checked + .cp-toggle-track { background: var(--cp-green); }
        .cp-toggle input:checked + .cp-toggle-track::after { transform: translateX(17px); }
        .cp-toggle input:focus-visible + .cp-toggle-track { outline: 2px solid #79a18a; outline-offset: 3px; }
        .cp-privacy { display: flex; align-items: flex-start; gap: 11px; margin-top: 22px; padding: 15px; border-radius: 11px; background: #f0f3e9; color: #65776a; font-size: 10px; line-height: 1.8; }
        .cp-privacy strong { color: #315a45; }
        .cp-message { margin-top: 18px; padding: 12px 14px; border: 1px solid #dce8d8; border-radius: 9px; background: #f1f6ed; color: #42674c; font-size: 11px; line-height: 1.7; }
        .cp-form-actions { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
        .cp-reset { padding: 11px 0; border: 0; background: transparent; color: #728278; cursor: pointer; font: inherit; font-size: 11px; }
        .cp-save { padding: 12px 18px; border: 0; border-radius: 9px; background: var(--cp-green); color: white; cursor: pointer; font: inherit; font-size: 12px; font-weight: 750; transition: background .2s, transform .2s; }
        .cp-save:hover { background: #194a40; transform: translateY(-1px); }
        .cp-footer { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-top: 30px; color: #8b978e; font-size: 10px; }
        .cp-footer a { color: #5d7c69; text-decoration: none; }
        @media (max-width: 760px) {
          .cp-layout { grid-template-columns: 1fr; }
          .cp-identity { padding: 20px; }
          .cp-side-links { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .cp-side-note { display: none; }
          .cp-header { padding: 16px 20px; }
          .cp-header-links { gap: 12px; }
          .cp-main { padding: 28px 16px 40px; }
        }
        @media (max-width: 460px) {
          .cp-brand-tag { font-size: 7px; }
          .cp-header-links a:not(.cp-dashboard-link) { display: none; }
          .cp-form-card { padding: 19px; }
          .cp-fields { grid-template-columns: 1fr; }
          .cp-form-heading { flex-direction: column; }
        }
      `}</style>

      <header className="cp-header">
        <Link to="/" className="cp-brand">
          <span className="cp-brand-mark">C</span>
          <span>
            <span className="cp-brand-name">CureAI</span>
            <span className="cp-brand-tag">INTELLIGENCE FOR WELLNESS</span>
          </span>
        </Link>

        <nav className="cp-header-links" aria-label="Page navigation">
          <Link to="/">Home</Link>
          <Link to="/history">History</Link>
          <Link to="/dashboard" className="cp-dashboard-link">
            Dashboard ↗
          </Link>
        </nav>
      </header>

      <main className="cp-main">
        <div className="cp-breadcrumb">
          <Link to="/dashboard">Dashboard</Link> &nbsp;/&nbsp; My profile
        </div>

        <div className="cp-heading">
          <div className="cp-eyebrow">YOUR ACCOUNT</div>
          <h1>Your profile</h1>
          <p>
            Make your wellness space your own. Manage your personal details
            and preferences in one place.
          </p>
        </div>

        <div className="cp-layout">
          <aside>
            <section className="cp-card cp-identity">
              <div className="cp-avatar" aria-hidden="true">♡</div>
              <h2>{profile.name.trim() || 'Your name'}</h2>
              <p>{profile.email || 'Your email address'}</p>
              <span className="cp-status">
                <span className="cp-status-dot" />
                Preview account
              </span>
            </section>

            <nav className="cp-card cp-side-links" aria-label="Profile sections">
              <a href="#personal-details" className="cp-selected">
                <span className="cp-side-icon">◎</span>
                Personal details
              </a>
              <a href="#preferences">
                <span className="cp-side-icon">⚙</span>
                Preferences
              </a>
              <Link to="/history">
                <span className="cp-side-icon">◷</span>
                Assessment history
              </Link>
              <Link to="/reports">
                <span className="cp-side-icon">▤</span>
                My reports
              </Link>
            </nav>

            <p className="cp-side-note">
              ✳ &nbsp; Your wellbeing comes first. Only enter real health
              information once secure storage and authentication are implemented.
            </p>
          </aside>

          <form className="cp-card cp-form-card" onSubmit={handleSubmit}>
            <div className="cp-form-heading">
              <div>
                <h2>Personal information</h2>
                <p>These fields are stored only in this page's current state.</p>
              </div>
              <span className="cp-status">Preview mode</span>
            </div>

            <section id="personal-details">
              <div className="cp-section-label">BASIC DETAILS</div>

              <div className="cp-fields">
                <div className="cp-field">
                  <label htmlFor="profile-name">Full name</label>
                  <input
                    id="profile-name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    autoComplete="name"
                    value={profile.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="cp-field">
                  <label htmlFor="profile-email">Email address</label>
                  <input
                    id="profile-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={profile.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="cp-field">
                  <label htmlFor="profile-dob">Date of birth</label>
                  <input
                    id="profile-dob"
                    name="dateOfBirth"
                    type="date"
                    autoComplete="bday"
                    value={profile.dateOfBirth}
                    onChange={handleChange}
                  />
                  <small>Optional. Used here for profile display only.</small>
                </div>

                <div className="cp-field">
                  <label htmlFor="profile-pronouns">Pronouns</label>
                  <select
                    id="profile-pronouns"
                    name="pronouns"
                    value={profile.pronouns}
                    onChange={handleChange}
                  >
                    <option value="">Prefer not to say</option>
                    <option value="she/her">She / her</option>
                    <option value="he/him">He / him</option>
                    <option value="they/them">They / them</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="cp-field">
                  <label htmlFor="profile-country">Country or region</label>
                  <select
                    id="profile-country"
                    name="country"
                    value={profile.country}
                    onChange={handleChange}
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </section>

            <section id="preferences">
              <div className="cp-section-label">YOUR PREFERENCES</div>

              <div className="cp-preferences">
                <div className="cp-preference">
                  <div className="cp-preference-copy">
                    <strong>Wellness reminders</strong>
                    <span>
                      A preference for future reminders. Notifications are not
                      sent in this prototype.
                    </span>
                  </div>
                  <label className="cp-toggle">
                    <input
                      type="checkbox"
                      name="reminders"
                      checked={preferences.reminders}
                      onChange={handlePreferenceChange}
                      aria-label="Enable wellness reminders preference"
                    />
                    <span className="cp-toggle-track" />
                  </label>
                </div>

                <div className="cp-preference">
                  <div className="cp-preference-copy">
                    <strong>Product updates</strong>
                    <span>
                      Choose whether you would like to receive future product
                      update information.
                    </span>
                  </div>
                  <label className="cp-toggle">
                    <input
                      type="checkbox"
                      name="updates"
                      checked={preferences.updates}
                      onChange={handlePreferenceChange}
                      aria-label="Enable product updates preference"
                    />
                    <span className="cp-toggle-track" />
                  </label>
                </div>
              </div>
            </section>

            <div className="cp-privacy">
              <span aria-hidden="true">♧</span>
              <span>
                <strong>Privacy by design.</strong> This profile is a frontend
                demonstration. It does not currently authenticate your identity,
                persist changes, or securely store personal or medical data.
              </span>
            </div>

            {message && (
              <div className="cp-message" role="status">
                {message}
              </div>
            )}

            <div className="cp-form-actions">
              <button
                className="cp-reset"
                type="button"
                onClick={() => {
                  setProfile({
                    name: '',
                    email: '',
                    dateOfBirth: '',
                    pronouns: '',
                    country: 'India',
                  })
                  setPreferences({
                    reminders: false,
                    updates: true,
                  })
                  setMessage('')
                }}
              >
                Reset fields
              </button>

              <button className="cp-save" type="submit">
                Preview changes&nbsp; ↗
              </button>
            </div>
          </form>
        </div>

        <footer className="cp-footer">
          <span>© {new Date().getFullYear()} CureAI · Intelligence for Wellness</span>
          <span>
            <Link to="/">Home</Link> &nbsp;·&nbsp;
            <Link to="/dashboard">Dashboard</Link>
          </span>
        </footer>
      </main>
    </div>
  )
}

export default Profile
