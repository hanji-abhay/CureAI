
import { Link } from 'react-router-dom'

const assessmentTypes = [
  {
    id: 'thyroid',
    name: 'Thyroid',
    category: 'Endocrine health',
    icon: '◈',
    color: 'lavender',
  },
  {
    id: 'skin',
    name: 'Skin',
    category: 'Skin health',
    icon: '✳',
    color: 'peach',
  },
  {
    id: 'lung',
    name: 'Lung',
    category: 'Respiratory health',
    icon: '〰',
    color: 'blue',
  },
  {
    id: 'breast',
    name: 'Breast',
    category: 'Breast health',
    icon: '♡',
    color: 'pink',
  },
]

function History() {
  return (
    <div className="cure-history">
      <style>{`
        .cure-history {
          --ch-ink: #173b37;
          --ch-muted: #78877f;
          --ch-green: #245e52;
          --ch-cream: #f7f5ee;
          --ch-line: #e6e8df;
          min-height: 100vh;
          background: var(--ch-cream);
          color: var(--ch-ink);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .cure-history * { box-sizing: border-box; }
        .ch-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 20px 6%;
          border-bottom: 1px solid var(--ch-line);
          background: #fffefa;
        }
        .ch-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--ch-ink);
          text-decoration: none;
        }
        .ch-brand-mark {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: var(--ch-green);
          color: white;
          font-size: 24px;
        }
        .ch-brand-name { font-size: 20px; font-weight: 750; letter-spacing: -1px; }
        .ch-brand-tag { display: block; margin-top: 3px; color: var(--ch-muted); font-size: 8px; letter-spacing: 1px; }
        .ch-header-nav { display: flex; align-items: center; gap: 20px; }
        .ch-header-nav a { color: var(--ch-muted); font-size: 12px; text-decoration: none; }
        .ch-header-nav a:hover { color: var(--ch-green); }
        .ch-header-nav .ch-nav-button { padding: 10px 14px; border-radius: 9px; background: var(--ch-green); color: white; font-weight: 700; }
        .ch-main { width: 100%; max-width: 1120px; margin: 0 auto; padding: 38px 24px 55px; }
        .ch-breadcrumb { margin-bottom: 27px; color: var(--ch-muted); font-size: 12px; }
        .ch-breadcrumb a { color: var(--ch-green); text-decoration: none; }
        .ch-eyebrow { color: #658675; font-size: 10px; font-weight: 800; letter-spacing: 2px; }
        .ch-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 29px; }
        .ch-heading h1 { margin: 9px 0; font-size: clamp(30px, 4vw, 39px); letter-spacing: -1.5px; }
        .ch-heading p { max-width: 590px; margin: 0; color: var(--ch-muted); font-size: 13px; line-height: 1.8; }
        .ch-heading-action { display: inline-flex; align-items: center; justify-content: center; padding: 12px 15px; border-radius: 10px; background: var(--ch-green); color: white; font-size: 12px; font-weight: 750; text-decoration: none; white-space: nowrap; transition: background .2s, transform .2s; }
        .ch-heading-action:hover { background: #194a40; transform: translateY(-1px); }
        .ch-overview { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 15px; margin-bottom: 31px; }
        .ch-stat { padding: 21px; border: 1px solid var(--ch-line); border-radius: 15px; background: #fffefa; }
        .ch-stat-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .ch-stat-label { color: var(--ch-muted); font-size: 11px; }
        .ch-stat-icon { width: 33px; height: 33px; display: grid; place-items: center; border-radius: 10px; background: #edf2e9; color: var(--ch-green); font-size: 17px; }
        .ch-stat-value { margin-top: 15px; font-size: 29px; font-weight: 700; letter-spacing: -1px; }
        .ch-stat-note { margin-top: 5px; color: #8a968d; font-size: 10px; line-height: 1.6; }
        .ch-section-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 15px; margin: 0 0 17px; }
        .ch-section-heading h2 { margin: 0; font-size: 21px; letter-spacing: -.5px; }
        .ch-section-heading p { margin: 6px 0 0; color: var(--ch-muted); font-size: 11px; line-height: 1.7; }
        .ch-mode-label { padding: 7px 10px; border: 1px solid #dfe6db; border-radius: 25px; background: #f6f8f1; color: #54705e; font-size: 10px; font-weight: 700; white-space: nowrap; }
        .ch-panel { overflow: hidden; border: 1px solid var(--ch-line); border-radius: 16px; background: #fffefa; }
        .ch-panel-top { display: flex; align-items: center; justify-content: space-between; gap: 15px; padding: 19px 22px; border-bottom: 1px solid var(--ch-line); }
        .ch-panel-top strong { font-size: 13px; }
        .ch-panel-top span { color: var(--ch-muted); font-size: 10px; }
        .ch-empty { display: flex; flex-direction: column; align-items: center; padding: 43px 25px 48px; text-align: center; }
        .ch-empty-illustration { position: relative; width: 86px; height: 86px; display: grid; place-items: center; margin-bottom: 19px; border-radius: 28px; background: #edf2e9; color: var(--ch-green); font-size: 37px; }
        .ch-empty-illustration::before, .ch-empty-illustration::after { content: ""; position: absolute; border: 1px solid #dce6d8; border-radius: 50%; }
        .ch-empty-illustration::before { inset: -9px; }
        .ch-empty-illustration::after { inset: -17px; opacity: .6; }
        .ch-empty h3 { margin: 8px 0; font-size: 20px; letter-spacing: -.5px; }
        .ch-empty p { max-width: 410px; margin: 0; color: var(--ch-muted); font-size: 12px; line-height: 1.8; }
        .ch-empty-actions { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; margin-top: 22px; }
        .ch-button-primary, .ch-button-secondary { display: inline-flex; align-items: center; justify-content: center; padding: 11px 15px; border-radius: 9px; font-size: 11px; font-weight: 750; text-decoration: none; }
        .ch-button-primary { background: var(--ch-green); color: white; }
        .ch-button-secondary { border: 1px solid #dfe5db; background: #fffefa; color: var(--ch-green); }
        .ch-available-heading { margin: 35px 0 17px; }
        .ch-available-heading h2 { margin: 0; font-size: 21px; letter-spacing: -.5px; }
        .ch-available-heading p { margin: 7px 0 0; color: var(--ch-muted); font-size: 11px; line-height: 1.7; }
        .ch-assessment-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 13px; }
        .ch-assessment { display: flex; flex-direction: column; min-width: 0; padding: 18px; border: 1px solid var(--ch-line); border-radius: 14px; background: #fffefa; color: var(--ch-ink); text-decoration: none; transition: transform .2s, box-shadow .2s; }
        .ch-assessment:hover { transform: translateY(-3px); box-shadow: 0 9px 25px rgba(32,70,55,.07); }
        .ch-assessment-icon { width: 39px; height: 39px; display: grid; place-items: center; border-radius: 12px; font-size: 22px; }
        .ch-assessment-icon.lavender { background: #eeebfa; color: #7c6bb2; }
        .ch-assessment-icon.peach { background: #fbe8dc; color: #bd7858; }
        .ch-assessment-icon.blue { background: #e2eff7; color: #4d829e; }
        .ch-assessment-icon.pink { background: #f9e6ec; color: #bd6987; }
        .ch-assessment h3 { margin: 14px 0 5px; font-size: 15px; }
        .ch-assessment p { margin: 0; color: var(--ch-muted); font-size: 10px; line-height: 1.7; }
        .ch-assessment-cta { margin-top: 17px; padding-top: 12px; border-top: 1px solid #edf0e9; color: var(--ch-green); font-size: 10px; font-weight: 750; }
        .ch-notice { display: flex; align-items: flex-start; gap: 11px; margin-top: 24px; padding: 16px 18px; border: 1px solid #e5e9de; border-radius: 12px; background: #f0f3e9; color: #64776b; font-size: 10px; line-height: 1.8; }
        .ch-notice strong { color: #315a45; }
        .ch-footer { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-top: 30px; color: #8b978e; font-size: 10px; }
        .ch-footer a { color: #5d7c69; text-decoration: none; }
        @media (max-width: 900px) {
          .ch-assessment-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 620px) {
          .ch-header { padding: 16px 18px; }
          .ch-header-nav { gap: 12px; }
          .ch-header-nav a:not(.ch-nav-button) { display: none; }
          .ch-main { padding: 27px 16px 40px; }
          .ch-heading { align-items: flex-start; flex-direction: column; }
          .ch-overview { gap: 9px; }
          .ch-stat { padding: 13px; }
          .ch-stat-value { font-size: 24px; }
          .ch-stat-label { font-size: 10px; }
          .ch-stat-note { font-size: 9px; }
          .ch-panel-top { padding: 16px; }
          .ch-empty { padding: 35px 19px 39px; }
        }
        @media (max-width: 400px) {
          .ch-assessment-grid { grid-template-columns: 1fr; }
          .ch-overview { grid-template-columns: 1fr; }
          .ch-stat { padding: 17px; }
          .ch-stat-value { margin-top: 9px; }
        }
      `}</style>

      <header className="ch-header">
        <Link to="/" className="ch-brand">
          <span className="ch-brand-mark">C</span>
          <span>
            <span className="ch-brand-name">CureAI</span>
            <span className="ch-brand-tag">INTELLIGENCE FOR WELLNESS</span>
          </span>
        </Link>

        <nav className="ch-header-nav" aria-label="Page navigation">
          <Link to="/">Home</Link>
          <Link to="/profile">My profile</Link>
          <Link to="/dashboard" className="ch-nav-button">Dashboard ↗</Link>
        </nav>
      </header>

      <main className="ch-main">
        <div className="ch-breadcrumb">
          <Link to="/dashboard">Dashboard</Link> &nbsp;/&nbsp; Assessment history
        </div>

        <section className="ch-heading">
          <div>
            <div className="ch-eyebrow">YOUR WELLNESS JOURNEY</div>
            <h1>Assessment history</h1>
            <p>
              A place for your wellness journey to take shape. Review previous
              assessments here once secure saving and history storage are connected.
            </p>
          </div>

          <Link to="/dashboard" className="ch-heading-action">
            Explore assessments&nbsp; ↗
          </Link>
        </section>

        <section className="ch-overview" aria-label="History overview">
          <article className="ch-stat">
            <div className="ch-stat-top">
              <span className="ch-stat-label">Saved assessments</span>
              <span className="ch-stat-icon">▤</span>
            </div>
            <div className="ch-stat-value">0</div>
            <div className="ch-stat-note">No saved records in this preview</div>
          </article>

          <article className="ch-stat">
            <div className="ch-stat-top">
              <span className="ch-stat-label">Reports available</span>
              <span className="ch-stat-icon">▧</span>
            </div>
            <div className="ch-stat-value">0</div>
            <div className="ch-stat-note">Report generation is not connected</div>
          </article>

          <article className="ch-stat">
            <div className="ch-stat-top">
              <span className="ch-stat-label">Health areas</span>
              <span className="ch-stat-icon">✳</span>
            </div>
            <div className="ch-stat-value">04</div>
            <div className="ch-stat-note">Questionnaire areas currently available</div>
          </article>
        </section>

        <section aria-labelledby="ch-history-title">
          <div className="ch-section-heading">
            <div>
              <h2 id="ch-history-title">Your activity timeline</h2>
              <p>Assessment entries will appear here when persistence is implemented.</p>
            </div>
            <span className="ch-mode-label">Preview mode</span>
          </div>

          <div className="ch-panel">
            <div className="ch-panel-top">
              <strong>All assessments</strong>
              <span>Showing saved records</span>
            </div>

            <div className="ch-empty">
              <div className="ch-empty-illustration" aria-hidden="true">◷</div>
              <div className="ch-eyebrow">A FRESH START</div>
              <h3>Your timeline starts here</h3>
              <p>
                You don't have any saved assessment records in this prototype.
                Explore a questionnaire to see how the experience works.
                Completed answers are not saved to a database yet.
              </p>

              <div className="ch-empty-actions">
                <Link to="/dashboard" className="ch-button-primary">
                  Go to dashboard&nbsp; ↗
                </Link>
                <Link to="/reports" className="ch-button-secondary">
                  View reports
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="ch-explore-title">
          <div className="ch-available-heading">
            <h2 id="ch-explore-title">Explore health areas</h2>
            <p>Choose a questionnaire whenever you're ready.</p>
          </div>

          <div className="ch-assessment-grid">
            {assessmentTypes.map((assessment) => (
              <Link
                to={`/assessments/${assessment.id}`}
                className="ch-assessment"
                key={assessment.id}
              >
                <span className={`ch-assessment-icon ${assessment.color}`}>
                  {assessment.icon}
                </span>
                <h3>{assessment.name}</h3>
                <p>{assessment.category}</p>
                <span className="ch-assessment-cta">Open questionnaire&nbsp; ↗</span>
              </Link>
            ))}
          </div>
        </section>

        <aside className="ch-notice">
          <span aria-hidden="true">ⓘ</span>
          <span>
            <strong>About your information:</strong> This page is a frontend
            prototype. It does not retrieve, save, or display real medical
            records. CureAI questionnaires are informational and do not provide
            a diagnosis. Consult a qualified healthcare professional about
            health concerns.
          </span>
        </aside>

        <footer className="ch-footer">
          <span>© {new Date().getFullYear()} CureAI · Intelligence for Wellness</span>
          <span>
            <Link to="/profile">Profile</Link>
            &nbsp; · &nbsp;
            <Link to="/dashboard">Dashboard</Link>
          </span>
        </footer>
      </main>
    </div>
  )
}

export default History
