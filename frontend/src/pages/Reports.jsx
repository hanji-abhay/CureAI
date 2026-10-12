
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const reportCategories = [
  'All reports',
  'Thyroid',
  'Skin',
  'Lung',
  'Breast',
]

const reportTypes = [
  {
    id: 'thyroid',
    title: 'Thyroid assessment',
    description:
      'A guided questionnaire covering thyroid-related symptoms and health history.',
    category: 'Thyroid',
    icon: '◈',
    color: 'lavender',
    route: '/assessments/thyroid',
  },
  {
    id: 'skin',
    title: 'Skin assessment',
    description:
      'A structured record of skin changes, their duration, and relevant history.',
    category: 'Skin',
    icon: '✳',
    color: 'peach',
    route: '/assessments/skin',
  },
  {
    id: 'lung',
    title: 'Lung assessment',
    description:
      'A questionnaire for respiratory symptoms, exposure, and health history.',
    category: 'Lung',
    icon: '〰',
    color: 'blue',
    route: '/assessments/lung',
  },
  {
    id: 'breast',
    title: 'Breast assessment',
    description:
      'A guided record of breast changes and relevant personal or family history.',
    category: 'Breast',
    icon: '♡',
    color: 'pink',
    route: '/assessments/breast',
  },
]

function Reports() {
  const [activeCategory, setActiveCategory] = useState('All reports')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTypes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return reportTypes.filter((report) => {
      const matchesCategory =
        activeCategory === 'All reports' ||
        report.category === activeCategory

      const matchesSearch =
        !query ||
        report.title.toLowerCase().includes(query) ||
        report.description.toLowerCase().includes(query) ||
        report.category.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  return (
    <div className="cure-reports">
      <style>{`
        .cure-reports {
          --cr-ink: #173b37;
          --cr-muted: #78877f;
          --cr-green: #245e52;
          --cr-cream: #f7f5ee;
          --cr-line: #e6e8df;
          min-height: 100vh;
          background: var(--cr-cream);
          color: var(--cr-ink);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .cure-reports * { box-sizing: border-box; }
        .cr-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 20px 6%;
          border-bottom: 1px solid var(--cr-line);
          background: #fffefa;
        }
        .cr-brand { display: flex; align-items: center; gap: 10px; color: var(--cr-ink); text-decoration: none; }
        .cr-brand-mark { width: 39px; height: 39px; display: grid; place-items: center; border-radius: 13px; background: var(--cr-green); color: white; font-size: 24px; }
        .cr-brand-name { font-size: 20px; font-weight: 750; letter-spacing: -1px; }
        .cr-brand-tag { display: block; margin-top: 3px; color: var(--cr-muted); font-size: 8px; letter-spacing: 1px; }
        .cr-header-nav { display: flex; align-items: center; gap: 20px; }
        .cr-header-nav a { color: var(--cr-muted); font-size: 12px; text-decoration: none; }
        .cr-header-nav a:hover { color: var(--cr-green); }
        .cr-header-nav .cr-nav-button { padding: 10px 14px; border-radius: 9px; background: var(--cr-green); color: white; font-weight: 700; }
        .cr-main { width: 100%; max-width: 1120px; margin: 0 auto; padding: 38px 24px 55px; }
        .cr-breadcrumb { margin-bottom: 27px; color: var(--cr-muted); font-size: 12px; }
        .cr-breadcrumb a { color: var(--cr-green); text-decoration: none; }
        .cr-eyebrow { color: #658675; font-size: 10px; font-weight: 800; letter-spacing: 2px; }
        .cr-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 28px; }
        .cr-heading h1 { margin: 9px 0; font-size: clamp(30px, 4vw, 39px); letter-spacing: -1.5px; }
        .cr-heading p { max-width: 600px; margin: 0; color: var(--cr-muted); font-size: 13px; line-height: 1.8; }
        .cr-mode { display: inline-flex; align-items: center; gap: 7px; padding: 9px 11px; border: 1px solid #dfe6db; border-radius: 25px; background: #f6f8f1; color: #54705e; font-size: 10px; font-weight: 700; white-space: nowrap; }
        .cr-mode-dot { width: 6px; height: 6px; border-radius: 50%; background: #83a67e; }
        .cr-banner { position: relative; overflow: hidden; display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 25px 27px; border-radius: 17px; background: #194a43; color: #fffdf6; }
        .cr-banner-copy { position: relative; z-index: 1; }
        .cr-banner .cr-eyebrow { color: #bdd9c5; }
        .cr-banner h2 { margin: 9px 0; font-size: 22px; letter-spacing: -.6px; }
        .cr-banner p { max-width: 530px; margin: 0; color: #d1e0d7; font-size: 11px; line-height: 1.8; }
        .cr-banner-symbol { position: absolute; right: 24%; top: -50px; width: 180px; height: 180px; border: 1px solid #ffffff20; border-radius: 50%; box-shadow: 0 0 0 24px #ffffff08, 0 0 0 48px #ffffff08; }
        .cr-banner-link { position: relative; z-index: 1; flex-shrink: 0; padding: 12px 15px; border-radius: 9px; background: #f5e8d7; color: #204e43; font-size: 11px; font-weight: 750; text-decoration: none; }
        .cr-summary { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin: 23px 0 35px; }
        .cr-summary-card { padding: 18px 20px; border: 1px solid var(--cr-line); border-radius: 14px; background: #fffefa; }
        .cr-summary-label { color: var(--cr-muted); font-size: 11px; }
        .cr-summary-value { margin-top: 12px; font-size: 27px; font-weight: 750; letter-spacing: -1px; }
        .cr-summary-note { margin-top: 5px; color: #89968c; font-size: 10px; line-height: 1.6; }
        .cr-library-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 15px; margin-bottom: 18px; }
        .cr-library-heading h2 { margin: 0; font-size: 21px; letter-spacing: -.5px; }
        .cr-library-heading p { margin: 6px 0 0; color: var(--cr-muted); font-size: 11px; line-height: 1.7; }
        .cr-search-wrap { position: relative; width: min(100%, 290px); flex-shrink: 0; }
        .cr-search-icon { position: absolute; top: 50%; left: 12px; transform: translateY(-50%); color: #89968c; font-size: 17px; pointer-events: none; }
        .cr-search { width: 100%; padding: 12px 12px 12px 37px; border: 1px solid #e0e5db; border-radius: 10px; outline: none; background: #fffefa; color: var(--cr-ink); font: inherit; font-size: 11px; }
        .cr-search:focus { border-color: #79a18a; box-shadow: 0 0 0 3px #4678591a; }
        .cr-filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
        .cr-filter { padding: 9px 13px; border: 1px solid #e0e5db; border-radius: 30px; background: #fffefa; color: #74857a; cursor: pointer; font: inherit; font-size: 10px; font-weight: 700; transition: background .2s, border-color .2s, color .2s; }
        .cr-filter:hover { border-color: #b8cdb8; color: var(--cr-green); }
        .cr-filter.active { border-color: var(--cr-green); background: var(--cr-green); color: white; }
        .cr-results-line { display: flex; justify-content: space-between; gap: 12px; margin: 0 0 13px; color: var(--cr-muted); font-size: 10px; }
        .cr-results-line strong { color: var(--cr-ink); }
        .cr-report-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
        .cr-report-card { display: flex; align-items: flex-start; gap: 15px; padding: 20px; border: 1px solid var(--cr-line); border-radius: 15px; background: #fffefa; }
        .cr-report-icon { width: 45px; height: 45px; flex-shrink: 0; display: grid; place-items: center; border-radius: 13px; font-size: 23px; }
        .cr-report-icon.lavender { background: #eeebfa; color: #7c6bb2; }
        .cr-report-icon.peach { background: #fbe8dc; color: #bd7858; }
        .cr-report-icon.blue { background: #e2eff7; color: #4d829e; }
        .cr-report-icon.pink { background: #f9e6ec; color: #bd6987; }
        .cr-report-copy { min-width: 0; flex: 1; }
        .cr-report-category { color: #89968c; font-size: 9px; font-weight: 800; letter-spacing: 1px; }
        .cr-report-copy h3 { margin: 8px 0 6px; font-size: 15px; letter-spacing: -.3px; }
        .cr-report-copy p { margin: 0; color: var(--cr-muted); font-size: 10px; line-height: 1.8; }
        .cr-report-action { display: inline-flex; margin-top: 14px; color: var(--cr-green); font-size: 10px; font-weight: 750; text-decoration: none; }
        .cr-report-action:hover { text-decoration: underline; }
        .cr-empty { display: flex; flex-direction: column; align-items: center; padding: 34px 20px; border: 1px dashed #d8dfd3; border-radius: 14px; background: #fafaf4; text-align: center; }
        .cr-empty-icon { width: 60px; height: 60px; display: grid; place-items: center; margin-bottom: 13px; border-radius: 19px; background: #eaf0e6; color: var(--cr-green); font-size: 27px; }
        .cr-empty h3 { margin: 0 0 7px; font-size: 17px; }
        .cr-empty p { max-width: 390px; margin: 0; color: var(--cr-muted); font-size: 11px; line-height: 1.8; }
        .cr-empty a { margin-top: 16px; padding: 11px 14px; border-radius: 9px; background: var(--cr-green); color: white; font-size: 11px; font-weight: 750; text-decoration: none; }
        .cr-notice { display: flex; align-items: flex-start; gap: 11px; margin-top: 25px; padding: 16px 18px; border: 1px solid #e5e9de; border-radius: 12px; background: #f0f3e9; color: #64776b; font-size: 10px; line-height: 1.8; }
        .cr-notice strong { color: #315a45; }
        .cr-footer { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-top: 30px; color: #8b978e; font-size: 10px; }
        .cr-footer a { color: #5d7c69; text-decoration: none; }
        @media (max-width: 760px) {
          .cr-header { padding: 16px 18px; }
          .cr-header-nav { gap: 12px; }
          .cr-header-nav a:not(.cr-nav-button) { display: none; }
          .cr-main { padding: 27px 16px 40px; }
          .cr-heading { align-items: flex-start; flex-direction: column; }
          .cr-banner { align-items: flex-start; flex-direction: column; }
          .cr-summary { gap: 9px; }
          .cr-summary-card { padding: 13px; }
          .cr-summary-value { font-size: 23px; }
          .cr-summary-label { font-size: 10px; }
          .cr-library-heading { align-items: stretch; flex-direction: column; }
          .cr-search-wrap { width: 100%; }
          .cr-report-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 410px) {
          .cr-summary { grid-template-columns: 1fr; }
          .cr-summary-card { padding: 17px; }
          .cr-summary-value { margin-top: 8px; }
          .cr-report-card { padding: 15px; }
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

        <nav className="cr-header-nav" aria-label="Page navigation">
          <Link to="/">Home</Link>
          <Link to="/history">History</Link>
          <Link to="/dashboard" className="cr-nav-button">Dashboard ↗</Link>
        </nav>
      </header>

      <main className="cr-main">
        <div className="cr-breadcrumb">
          <Link to="/dashboard">Dashboard</Link> &nbsp;/&nbsp; My reports
        </div>

        <section className="cr-heading">
          <div>
            <div className="cr-eyebrow">YOUR DOCUMENT LIBRARY</div>
            <h1>Reports & records</h1>
            <p>
              A dedicated space for your assessment summaries and wellness
              records. Reports will become available once assessment storage
              and report generation are implemented.
            </p>
          </div>
          <span className="cr-mode">
            <span className="cr-mode-dot" />
            Preview mode
          </span>
        </section>

        <section className="cr-banner">
          <div className="cr-banner-symbol" />
          <div className="cr-banner-copy">
            <div className="cr-eyebrow">YOUR INFORMATION, ORGANISED</div>
            <h2>Clarity starts with a record.</h2>
            <p>
              Complete a guided questionnaire to explore the CureAI experience.
              Saving, report creation, and downloads are not connected yet.
            </p>
          </div>
          <Link to="/dashboard" className="cr-banner-link">
            Explore assessments&nbsp; ↗
          </Link>
        </section>

        <section className="cr-summary" aria-label="Report summary">
          <article className="cr-summary-card">
            <div className="cr-summary-label">Available reports</div>
            <div className="cr-summary-value">0</div>
            <div className="cr-summary-note">No generated reports in preview</div>
          </article>
          <article className="cr-summary-card">
            <div className="cr-summary-label">Report downloads</div>
            <div className="cr-summary-value">0</div>
            <div className="cr-summary-note">Download functionality not connected</div>
          </article>
          <article className="cr-summary-card">
            <div className="cr-summary-label">Assessment categories</div>
            <div className="cr-summary-value">04</div>
            <div className="cr-summary-note">Questionnaire templates available</div>
          </article>
        </section>

        <section aria-labelledby="cr-library-title">
          <div className="cr-library-heading">
            <div>
              <h2 id="cr-library-title" style={{ margin: 0, fontSize: 21, letterSpacing: '-.5px' }}>
                Report library
              </h2>
              <p>Search and explore the four available assessment categories.</p>
            </div>

            <div className="cr-search-wrap">
              <span className="cr-search-icon" aria-hidden="true">⌕</span>
              <input
                className="cr-search"
                type="search"
                placeholder="Search assessment types..."
                aria-label="Search assessment types"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
          </div>

          <div className="cr-filters" aria-label="Filter assessment categories">
            {reportCategories.map((category) => (
              <button
                key={category}
                type="button"
                className={`cr-filter ${activeCategory === category ? 'active' : ''}`}
                aria-pressed={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="cr-results-line">
            <span>
              <strong>{filteredTypes.length}</strong>{' '}
              {filteredTypes.length === 1 ? 'category' : 'categories'} found
            </span>
            <span>Assessment templates, not saved reports</span>
          </div>

          {filteredTypes.length > 0 ? (
            <div className="cr-report-grid">
              {filteredTypes.map((report) => (
                <article className="cr-report-card" key={report.id}>
                  <span className={`cr-report-icon ${report.color}`}>
                    {report.icon}
                  </span>
                  <div className="cr-report-copy">
                    <div className="cr-report-category">
                      {report.category.toUpperCase()} · TEMPLATE
                    </div>
                    <h3>{report.title}</h3>
                    <p>{report.description}</p>
                    <Link className="cr-report-action" to={report.route}>
                      Open questionnaire&nbsp; ↗
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="cr-empty">
              <span className="cr-empty-icon">⌕</span>
              <h3>No matching categories</h3>
              <p>
                Try a different search term or choose another category to
                explore the available questionnaires.
              </p>
              <button
                type="button"
                className="cr-filter active"
                style={{ marginTop: 15 }}
                onClick={() => {
                  setSearchQuery('')
                  setActiveCategory('All reports')
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        <aside className="cr-notice">
          <span aria-hidden="true">ⓘ</span>
          <span>
            <strong>Important:</strong> These cards link to questionnaire
            templates, not medical reports. CureAI does not currently generate
            diagnoses, clinical interpretations, or downloadable medical
            documents. Consult a qualified healthcare professional for medical
            evaluation.
          </span>
        </aside>

        <footer className="cr-footer">
          <span>© {new Date().getFullYear()} CureAI · Intelligence for Wellness</span>
          <span>
            <Link to="/history">History</Link>
            &nbsp; · &nbsp;
            <Link to="/profile">Profile</Link>
            &nbsp; · &nbsp;
            <Link to="/dashboard">Dashboard</Link>
          </span>
        </footer>
      </main>
    </div>
  )
}

export default Reports
