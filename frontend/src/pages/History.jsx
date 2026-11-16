import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

const assessmentTypes = [
  {
    id: "thyroid",
    name: "Thyroid",
    category: "Endocrine health",
    icon: "◈",
    color: "lavender",
  },
  {
    id: "skin",
    name: "Skin",
    category: "Skin health",
    icon: "✳",
    color: "peach",
  },
  {
    id: "lung",
    name: "Lung",
    category: "Respiratory health",
    icon: "〰",
    color: "blue",
  },
  {
    id: "breast",
    name: "Breast",
    category: "Breast health",
    icon: "♡",
    color: "pink",
  },
];

function History() {
  const [assessments, setAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setIsLoading(true);
        setFetchError("");

        const response = await apiFetch("/api/assessments");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load assessment history.");
        }

        setAssessments(data.assessments || []);
      } catch (error) {
        console.error("History fetch error:", error);
        setFetchError(
          error.message || "Something went wrong while loading history.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessments();
  }, []);

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
        .ch-history-list {
  padding: 5px 22px;
}

.ch-history-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 19px 0;
  border-bottom: 1px solid var(--ch-line);
}

.ch-history-item:last-child {
  border-bottom: none;
}

.ch-history-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: #edf2e9;
  color: var(--ch-green);
  font-size: 20px;
}

.ch-history-details {
  flex: 1;
  min-width: 0;
}

.ch-history-details h3 {
  margin: 0 0 5px;
  font-size: 14px;
}

.ch-history-details p {
  margin: 4px 0;
  color: var(--ch-muted);
  font-size: 11px;
  line-height: 1.7;
}

.ch-history-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 8px;
}

.ch-history-status {
  padding: 5px 9px;
  border-radius: 20px;
  background: #edf4e9;
  color: #54705e;
  font-size: 10px;
  font-weight: 700;
  text-transform: capitalize;
}

.ch-history-classification {
  color: var(--ch-green);
  font-size: 11px;
  font-weight: 750;
}

.ch-history-message {
  padding: 35px 20px;
  color: var(--ch-muted);
  text-align: center;
  font-size: 12px;
  line-height: 1.8;
}
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
        .ch-history-classification {
  margin-right: 5px;
}
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
          <Link to="/dashboard" className="ch-nav-button">
            Dashboard ↗
          </Link>
        </nav>
      </header>

      <main className="ch-main">
        <div className="ch-breadcrumb">
          <Link to="/dashboard">Dashboard</Link> &nbsp;/&nbsp; Assessment
          history
        </div>

        <section className="ch-heading">
          <div>
            <div className="ch-eyebrow">YOUR WELLNESS JOURNEY</div>
            <h1>Assessment history</h1>
            <p>
              Your personal wellness activity timeline. Review completed
              assessments and revisit the AI-assisted classifications saved
              securely to your CureAI account.
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
            <div className="ch-stat-value">
              {isLoading ? "..." : assessments.length}
            </div>
            <div className="ch-stat-note">
              Saved records linked to your account
            </div>
          </article>

          <article className="ch-stat">
            <div className="ch-stat-top">
              <span className="ch-stat-label">Reports available</span>
              <span className="ch-stat-icon">▧</span>
            </div>
            <div className="ch-stat-value">0</div>
            <div className="ch-stat-note">
              Report downloads are not connected yet
            </div>
          </article>

          <article className="ch-stat">
            <div className="ch-stat-top">
              <span className="ch-stat-label">Health areas</span>
              <span className="ch-stat-icon">✳</span>
            </div>
            <div className="ch-stat-value">04</div>
            <div className="ch-stat-note">
              Questionnaire areas currently available
            </div>
          </article>
        </section>

        <section aria-labelledby="ch-history-title">
          <div className="ch-section-heading">
            <div>
              <h2 id="ch-history-title">Your activity timeline</h2>
              <p>
                Review your completed assessments and previously saved
                classifications.
              </p>
            </div>
            <span className="ch-mode-label">{assessments.length} saved</span>
          </div>

          <div className="ch-panel">
            <div className="ch-panel-top">
              <strong>All assessments</strong>
              <span>{assessments.length} records found</span>
            </div>

            {isLoading ? (
              <div className="ch-history-message">
                Loading your assessment history...
              </div>
            ) : fetchError ? (
              <div className="ch-history-message" role="alert">
                <strong>Unable to load your history.</strong>
                <p>{fetchError}</p>
              </div>
            ) : assessments.length === 0 ? (
              <div className="ch-empty">
                <div className="ch-empty-illustration" aria-hidden="true">
                  ◷
                </div>
                <div className="ch-eyebrow">A FRESH START</div>
                <h3>Your timeline starts here</h3>
                <p>
                  You don't have any saved assessment records yet. Explore a
                  questionnaire to begin your wellness journey.
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
            ) : (
              <div className="ch-history-list">
                {assessments.map((assessment) => {
                  const type = assessment.assessmentType;
                  const category = assessmentTypes.find(
                    (item) => item.id === type,
                  );

                  const classification =
                    assessment.prediction?.prediction ?? "Not available";

                  const completedDate = assessment.createdAt
                    ? new Date(assessment.createdAt).toLocaleString()
                    : "Date unavailable";

                  return (
                    <article
                      className="ch-history-item"
                      key={assessment._id || assessment.id}
                    >
                      <div className="ch-history-icon">
                        {category?.icon || "◈"}
                      </div>

                      <div className="ch-history-details">
                        <h3>{category?.name || type} Assessment</h3>

                        <p>
                          {assessment.prediction?.cancer_type || "Assessment"} ·
                          Completed: {completedDate}
                        </p>

                        <div className="ch-history-meta">
                          <span className="ch-history-classification">
                            Classification: {String(classification)}
                          </span>

                          <span className="ch-history-status">
                            {assessment.status || "completed"}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
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
                <span className="ch-assessment-cta">
                  Open questionnaire&nbsp; ↗
                </span>
              </Link>
            ))}
          </div>
        </section>

        <aside className="ch-notice">
          <span aria-hidden="true">ⓘ</span>
          <span>
            <strong>About your information:</strong> Your completed assessments
            are retrieved from your authenticated CureAI account. The
            classifications are AI-assisted preliminary outputs, not medical
            diagnoses. Consult a qualified healthcare professional for medical
            evaluation.
          </span>
        </aside>

        <footer className="ch-footer">
          <span>
            © {new Date().getFullYear()} CureAI · Intelligence for Wellness
          </span>
          <span>
            <Link to="/profile">Profile</Link>
            &nbsp; · &nbsp;
            <Link to="/dashboard">Dashboard</Link>
          </span>
        </footer>
      </main>
    </div>
  );
}

export default History;
