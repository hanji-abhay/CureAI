import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

const assessments = [
  {
    id: "thyroid",
    number: "01",
    title: "Thyroid",
    description:
      "Explore thyroid-related symptoms, health history, and relevant indicators.",
    icon: "◈",
    color: "lavender",
    category: "ENDOCRINE HEALTH",
    time: "3–5 MIN",
  },
  {
    id: "skin",
    number: "02",
    title: "Skin",
    description:
      "Record skin changes, their duration, and relevant health information.",
    icon: "✳",
    color: "peach",
    category: "SKIN HEALTH",
    time: "3–5 MIN",
  },
  {
    id: "lung",
    number: "03",
    title: "Lung",
    description:
      "Document breathing symptoms, exposure history, and respiratory concerns.",
    icon: "〰",
    color: "blue",
    category: "RESPIRATORY HEALTH",
    time: "4–6 MIN",
  },
  {
    id: "breast",
    number: "04",
    title: "Breast",
    description:
      "Record breast changes, relevant family history, and previous evaluations.",
    icon: "♡",
    color: "pink",
    category: "BREAST HEALTH",
    time: "3–5 MIN",
  },
];

const quickLinks = [
  {
    icon: "◎",
    title: "Your profile",
    description: "Manage your personal details",
    to: "/profile",
  },
  {
    icon: "◷",
    title: "Assessment history",
    description: "View saved assessment records",
    to: "/history",
  },
  {
    icon: "▤",
    title: "Reports",
    description: "Explore your assessment reports",
    to: "/reports",
  },
];

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const firstName = user?.fullName?.trim().split(/\s+/)[0];

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      navigate("/login", { replace: true });
    }
  }

  return (
    <div className="cure-dashboard">
      <style>{`
        .cure-dashboard {
          --cd-ink: #173b37;
          --cd-muted: #74857d;
          --cd-green: #245e52;
          --cd-cream: #f7f5ee;
          --cd-line: #e6e8df;
          min-height: 100vh;
          background: var(--cd-cream);
          color: var(--cd-ink);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .cure-dashboard * { box-sizing: border-box; }
        .cd-shell { display: flex; min-height: 100vh; }
        .cd-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 0 8px;
          text-decoration: none;
          color: var(--cd-ink);
        }
        .cd-brand-mark {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: var(--cd-green);
          color: white;
          font-size: 25px;
          font-weight: 400;
        }
        .cd-brand-name { font-size: 21px; font-weight: 750; letter-spacing: -1px; }
        .cd-brand-tag { display: block; margin-top: 3px; color: var(--cd-muted); font-size: 8px; letter-spacing: 1.2px; }
        .cd-nav { display: grid; gap: 7px; }
        .cd-nav a {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 13px;
          border-radius: 11px;
          color: #75847c;
          font-size: 13px;
          text-decoration: none;
          transition: background .2s, color .2s;
        }
        .cd-nav a:hover { background: #f1f4ed; color: var(--cd-green); }
        .cd-nav a.cd-active { background: #eaf1e9; color: var(--cd-green); font-weight: 700; }
        .cd-nav-icon { width: 21px; text-align: center; font-size: 18px; }
        .cd-sidebar-bottom { margin-top: auto; }
        .cd-help {
          padding: 17px;
          border: 1px solid #e6e9df;
          border-radius: 15px;
          background: #f8f8f1;
        }
        .cd-help-icon { font-size: 21px; color: var(--cd-green); }
        .cd-help h3 { margin: 10px 0 6px; font-size: 13px; }
        .cd-help p { margin: 0; color: var(--cd-muted); font-size: 11px; line-height: 1.7; }
        .cd-help a { display: inline-block; margin-top: 12px; color: var(--cd-green); font-size: 11px; font-weight: 750; text-decoration: none; }
        .cd-main { min-width: 0; flex: 1; }
        .cd-topbar {
          height: 78px;
          padding: 0 5%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-bottom: 1px solid var(--cd-line);
          background: rgba(255,254,250,.8);
        }
        .cd-breadcrumb { color: var(--cd-muted); font-size: 12px; }
        .cd-breadcrumb strong { color: var(--cd-ink); font-weight: 700; }
        .cd-top-actions { display: flex; align-items: center; gap: 12px; }
        .cd-logout-button {
          padding: 9px 12px;
          border: 1px solid var(--cd-line);
          border-radius: 9px;
          background: #fffefa;
          color: var(--cd-green);
          font: inherit;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: background .2s, border-color .2s;
        }
        .cd-logout-button:hover {
          background: #edf2e9;
          border-color: #c6d6c8;
        }

        .cd-preview-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 11px;
          border: 1px solid #dfe6db;
          border-radius: 30px;
          color: #54705e;
          background: #f6f8f1;
          font-size: 10px;
          font-weight: 700;
        }
        .cd-preview-dot { width: 6px; height: 6px; border-radius: 50%; background: #7eaa81; }
        .cd-avatar {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #eaded6;
          color: #785e50;
          font-size: 15px;
        }
        .cd-content { width: 100%; max-width: 1250px; margin: auto; padding: 40px 5% 50px; }
        .cd-eyebrow { color: #638574; font-size: 10px; font-weight: 800; letter-spacing: 2px; }
        .cd-welcome {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          padding: 34px 37px;
          border-radius: 22px;
          background: #194a43;
          color: #fffdf6;
        }
        .cd-welcome::after {
          content: "";
          position: absolute;
          width: 300px;
          height: 300px;
          right: 8%;
          top: -190px;
          border: 1px solid rgba(224,239,218,.18);
          border-radius: 50%;
          box-shadow: 0 0 0 32px rgba(224,239,218,.035), 0 0 0 65px rgba(224,239,218,.035);
          pointer-events: none;
        }
        .cd-welcome .cd-eyebrow { color: #bdd9c5; }
        .cd-welcome h1 { margin: 12px 0 10px; font-size: clamp(27px, 3vw, 39px); line-height: 1.15; letter-spacing: -1.5px; font-weight: 650; }
        .cd-welcome p { max-width: 470px; margin: 0; color: #d1e0d7; font-size: 13px; line-height: 1.8; }
        .cd-welcome-actions { position: relative; z-index: 1; display: flex; flex-wrap: wrap; gap: 10px; }
        .cd-primary, .cd-secondary {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 750;
          text-decoration: none;
          transition: transform .2s, background .2s;
        }
        .cd-primary { background: #f5e8d7; color: #204e43; }
        .cd-secondary { border: 1px solid rgba(255,255,255,.28); color: white; }
        .cd-primary:hover, .cd-secondary:hover { transform: translateY(-2px); }
        .cd-section-head { display: flex; align-items: end; justify-content: space-between; gap: 20px; margin: 39px 0 18px; }
        .cd-section-head h2 { margin: 7px 0 0; font-size: 23px; letter-spacing: -.7px; }
        .cd-section-head p { margin: 7px 0 0; color: var(--cd-muted); font-size: 12px; line-height: 1.6; }
        .cd-text-link { color: var(--cd-green); font-size: 12px; font-weight: 750; text-decoration: none; white-space: nowrap; }
        .cd-assessment-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 15px; }
        .cd-assessment {
          min-width: 0;
          display: flex;
          flex-direction: column;
          padding: 20px;
          border: 1px solid var(--cd-line);
          border-radius: 17px;
          background: #fffefa;
          color: var(--cd-ink);
          text-decoration: none;
          transition: transform .2s, box-shadow .2s, border-color .2s;
        }
        .cd-assessment:hover { transform: translateY(-4px); border-color: #c6d6c8; box-shadow: 0 12px 30px rgba(32,70,55,.07); }
        .cd-card-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .cd-card-icon { width: 43px; height: 43px; display: grid; place-items: center; border-radius: 14px; font-size: 25px; }
        .cd-card-icon.lavender { background: #eeebfa; color: #7c6bb2; }
        .cd-card-icon.peach { background: #fbe8dc; color: #bd7858; }
        .cd-card-icon.blue { background: #e2eff7; color: #4d829e; }
        .cd-card-icon.pink { background: #f9e6ec; color: #bd6987; }
        .cd-number { color: #a1aaa1; font-size: 10px; letter-spacing: 1px; }
        .cd-category { margin-top: 22px; color: #8a988e; font-size: 8px; font-weight: 800; letter-spacing: 1.1px; }
        .cd-assessment h3 { margin: 8px 0; font-size: 19px; letter-spacing: -.5px; }
        .cd-assessment p { min-height: 61px; margin: 0; color: var(--cd-muted); font-size: 11px; line-height: 1.75; }
        .cd-card-footer { display: flex; align-items: center; justify-content: space-between; gap: 7px; margin-top: 20px; padding-top: 14px; border-top: 1px solid #edf0e9; color: #859389; font-size: 9px; letter-spacing: .5px; }
        .cd-card-arrow { color: var(--cd-green); font-size: 17px; }
        .cd-lower-grid { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(250px, .85fr); gap: 17px; margin-top: 34px; }
        .cd-panel { padding: 24px; border: 1px solid var(--cd-line); border-radius: 17px; background: #fffefa; }
        .cd-panel h2 { margin: 0; font-size: 17px; letter-spacing: -.4px; }
        .cd-panel-subtitle { margin: 7px 0 18px; color: var(--cd-muted); font-size: 11px; line-height: 1.6; }
        .cd-empty {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          padding: 18px;
          border-radius: 13px;
          background: #f7f7f0;
        }
        .cd-empty-icon { width: 35px; height: 35px; flex-shrink: 0; display: grid; place-items: center; border-radius: 11px; background: #e8eee4; color: var(--cd-green); font-size: 19px; }
        .cd-empty strong { display: block; margin: 2px 0 5px; font-size: 12px; }
        .cd-empty p { margin: 0; color: var(--cd-muted); font-size: 11px; line-height: 1.7; }
        .cd-quick-links { display: grid; gap: 5px; margin-top: 13px; }
        .cd-quick-link { display: flex; align-items: center; gap: 12px; padding: 12px 9px; border-radius: 10px; color: var(--cd-ink); text-decoration: none; transition: background .2s; }
        .cd-quick-link:hover { background: #f5f6ef; }
        .cd-quick-icon { width: 35px; height: 35px; display: grid; place-items: center; flex-shrink: 0; border-radius: 11px; background: #edf2e9; color: var(--cd-green); font-size: 19px; }
        .cd-quick-copy { min-width: 0; flex: 1; }
        .cd-quick-copy strong { display: block; font-size: 12px; }
        .cd-quick-copy span { display: block; margin-top: 4px; color: var(--cd-muted); font-size: 10px; }
        .cd-quick-arrow { color: #8b9a8e; font-size: 16px; }
        .cd-safety {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          margin-top: 22px;
          padding: 17px 20px;
          border: 1px solid #e5e9de;
          border-radius: 13px;
          background: #f0f3e9;
        }
        .cd-safety-icon { color: #54785f; font-size: 19px; }
        .cd-safety p { margin: 0; color: #64776b; font-size: 11px; line-height: 1.8; }
        .cd-safety strong { color: #315a45; }
        .cd-footer { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-top: 28px; color: #8b978e; font-size: 10px; }
        .cd-footer a { color: #5d7c69; text-decoration: none; }
        @media (max-width: 1120px) {
          .cd-sidebar { width: 215px; }
          .cd-assessment-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .cd-assessment p { min-height: auto; }
        }
        @media (max-width: 760px) {
          .cd-sidebar { width: 66px; padding: 22px 9px; align-items: center; }
          .cd-brand { padding: 0; }
          .cd-brand-copy, .cd-nav-label, .cd-nav-text, .cd-help, .cd-sidebar-bottom { display: none; }
          .cd-nav { margin-top: 42px; }
          .cd-nav a { justify-content: center; padding: 12px 0; }
          .cd-nav-icon { font-size: 20px; }
          .cd-content { padding: 26px 18px 35px; }
          .cd-topbar { height: 65px; padding: 0 18px; }
          .cd-welcome { align-items: flex-start; flex-direction: column; padding: 27px 23px; }
          .cd-welcome h1 { font-size: 30px; }
          .cd-section-head { align-items: flex-start; }
          .cd-assessment-grid { gap: 10px; }
          .cd-assessment { padding: 15px; }
          .cd-lower-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 430px) {
          .cd-preview-pill { font-size: 9px; padding: 7px 8px; }
          .cd-assessment-grid { grid-template-columns: 1fr; }
          .cd-assessment { padding: 18px; }
          .cd-section-head h2 { font-size: 20px; }
          .cd-panel { padding: 18px; }
        }
      `}</style>

      <div className="cd-shell">
        <main className="cd-main">
          <header className="cd-topbar">
            <div className="cd-breadcrumb">
              Workspace&nbsp; / &nbsp;<strong>Dashboard</strong>
            </div>
            <div className="cd-top-actions">
              <span className="cd-preview-pill">
                <span className="cd-preview-dot" />
                Preview mode
              </span>
              <Link
                to="/profile"
                className="cd-avatar"
                aria-label="Open profile"
                title={user?.fullName || "Open profile"}
                style={{ textDecoration: "none" }}
              >
                {firstName ? firstName.charAt(0).toUpperCase() : "♡"}
              </Link>

              <button
                type="button"
                className="cd-logout-button"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          </header>

          <div className="cd-content">
            <section className="cd-welcome">
              <div>
                <div className="cd-eyebrow">
                  {firstName
                    ? `WELCOME BACK, ${firstName.toUpperCase()}`
                    : "YOUR PERSONAL WELLNESS SPACE"}
                </div>
                <h1>
                  A little more informed.
                  <br />A little more empowered.
                </h1>
                <p>
                  Welcome to CureAI. Explore guided health questionnaires,
                  organise your information, and take a more informed next step
                  in your wellness journey.
                </p>
              </div>
              <div className="cd-welcome-actions">
                <Link to="/assessments/thyroid" className="cd-primary">
                  Explore assessments&nbsp; ↗
                </Link>
                <Link to="/profile" className="cd-secondary">
                  My profile
                </Link>
              </div>
            </section>

            <section aria-labelledby="cd-assessments-title">
              <div className="cd-section-head">
                <div>
                  <div className="cd-eyebrow">START HERE</div>
                  <h2 id="cd-assessments-title">Explore assessments</h2>
                  <p>Choose a health area to begin a guided questionnaire.</p>
                </div>
                <Link to="/" className="cd-text-link">
                  Explore home ↗
                </Link>
              </div>

              <div className="cd-assessment-grid">
                {assessments.map((assessment) => (
                  <Link
                    to={`/assessments/${assessment.id}`}
                    className="cd-assessment"
                    key={assessment.id}
                  >
                    <div className="cd-card-top">
                      <span className={`cd-card-icon ${assessment.color}`}>
                        {assessment.icon}
                      </span>
                      <span className="cd-number">{assessment.number}</span>
                    </div>
                    <div className="cd-category">{assessment.category}</div>
                    <h3>{assessment.title}</h3>
                    <p>{assessment.description}</p>
                    <div className="cd-card-footer">
                      <span>{assessment.time}</span>
                      <span className="cd-card-arrow">↗</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <div className="cd-lower-grid">
              <section className="cd-panel" aria-labelledby="cd-activity-title">
                <h2 id="cd-activity-title">Recent activity</h2>
                <p className="cd-panel-subtitle">
                  Your assessment activity will appear here when history storage
                  is connected.
                </p>
                <div className="cd-empty">
                  <span className="cd-empty-icon">◷</span>
                  <div>
                    <strong>Your timeline starts here</strong>
                    <p>
                      No saved assessments are available in this preview yet.
                      Start a questionnaire to explore the experience.
                    </p>
                  </div>
                </div>
                <div style={{ marginTop: 17 }}>
                  <Link to="/history" className="cd-text-link">
                    View assessment history ↗
                  </Link>
                </div>
              </section>

              <section className="cd-panel" aria-labelledby="cd-quick-title">
                <h2 id="cd-quick-title">Quick access</h2>
                <p className="cd-panel-subtitle">
                  Your personal tools, all in one place.
                </p>
                <div className="cd-quick-links">
                  {quickLinks.map((item) => (
                    <Link to={item.to} className="cd-quick-link" key={item.to}>
                      <span className="cd-quick-icon">{item.icon}</span>
                      <span className="cd-quick-copy">
                        <strong>{item.title}</strong>
                        <span>{item.description}</span>
                      </span>
                      <span className="cd-quick-arrow">↗</span>
                    </Link>
                  ))}
                </div>
              </section>
            </div>

            <aside className="cd-safety">
              <span className="cd-safety-icon">ⓘ</span>
              <p>
                <strong>A gentle but important reminder:</strong> CureAI is an
                informational prototype, not a diagnostic service. These
                questionnaires do not confirm or rule out a condition. For
                symptoms or health concerns, consult a qualified healthcare
                professional. Seek urgent medical care for an emergency.
              </p>
            </aside>

            <footer className="cd-footer">
              <span>
                © {new Date().getFullYear()} CureAI · Intelligence for Wellness
              </span>
              <span>
                <Link to="/">Home</Link>
                &nbsp; · &nbsp;
                <Link to="/profile">Profile</Link>
              </span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
