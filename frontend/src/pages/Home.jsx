
import { Link } from 'react-router-dom'
import '../App.css'

const assessments = [
  {
    id: 'thyroid',
    number: '01',
    title: 'Thyroid',
    description:
      'Explore thyroid-related health indicators and potential risk factors.',
    icon: '◈',
    color: 'lavender',
    status: 'ENDOCRINE HEALTH',
  },
  {
    id: 'skin',
    number: '02',
    title: 'Skin',
    description:
      'Explore skin-lesion characteristics and relevant personal risk factors.',
    icon: '✳',
    color: 'peach',
    status: 'DERMATOLOGICAL HEALTH',
  },
  {
    id: 'lung',
    number: '03',
    title: 'Lung',
    description:
      'Review respiratory indicators, lifestyle factors, and reported symptoms.',
    icon: '⌁',
    color: 'blue',
    status: 'RESPIRATORY HEALTH',
  },
  {
    id: 'breast',
    number: '04',
    title: 'Breast',
    description:
      'Explore relevant breast-health indicators and personal health information.',
    icon: '♡',
    color: 'pink',
    status: 'BREAST HEALTH',
  },
]

const steps = [
  {
    number: '01',
    title: 'Share your information',
    description:
      'Complete a structured questionnaire with relevant health details.',
    icon: '↗',
  },
  {
    number: '02',
    title: 'AI-assisted analysis',
    description:
      'Your information is processed by the assessment model configured for the selected experience.',
    icon: '✳',
  },
  {
    number: '03',
    title: 'Explore your results',
    description:
      'Review the available output, understand its limitations, and consider appropriate next steps.',
    icon: '↗',
  },
]

function CureAILogo({ footer = false }) {
  return (
    <Link
      to="/"
      className={`cure-brand ${footer ? 'cure-brand-footer' : ''}`}
      aria-label="CureAI home"
    >
      <svg
        className="cure-brand-symbol"
        viewBox="0 0 72 76"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M36 68C29 59 7 43 7 25C7 13 15 6 25 6C30 6 34 9 36 14C40 8 44 6 50 6C60 6 66 14 66 25C66 43 44 59 36 68Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M13 29H22L27 22L33 36L39 28H47"
          stroke="#59D7B5"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M48 28V39C48 45 43 49 37 49C31 49 28 45 28 40"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="28" cy="39" r="3.2" fill="#59D7B5" />
        <circle cx="48" cy="25" r="3.2" fill="#59D7B5" />
        <text
          x="36"
          y="24"
          textAnchor="middle"
          fill="currentColor"
          fontSize="10"
          fontFamily="Georgia, serif"
          fontWeight="bold"
        >
          C
        </text>
        <text
          x="36"
          y="43"
          textAnchor="middle"
          fill="currentColor"
          fontSize="10"
          fontFamily="Georgia, serif"
          fontWeight="bold"
        >
          U R
        </text>
        <text
          x="36"
          y="57"
          textAnchor="middle"
          fill="currentColor"
          fontSize="10"
          fontFamily="Georgia, serif"
          fontWeight="bold"
        >
          E A I
        </text>
      </svg>

      <span className="cure-brand-copy">
        <span className="cure-brand-name">
          Cure<span>AI</span>
        </span>
        <span className="cure-brand-tagline">
          INTELLIGENCE FOR WELLNESS
        </span>
      </span>
    </Link>
  )
}

function Navbar() {
  return (
    <header className="cure-header">
      <nav className="cure-navbar" aria-label="Main navigation">
        <CureAILogo />

        <div className="cure-nav-links">
          <a href="#assessments">Assessments</a>
          <a href="#how-it-works">How it works</a>
          <a href="#about">Our approach</a>
        </div>
        <Link
          className="cure-button cure-button-primary cure-nav-cta"
          to="/register"
        >
          Get started <span aria-hidden="true">↗</span>
        </Link>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="cure-hero" id="home">
      <div className="cure-hero-copy">
        <span className="cure-eyebrow">
          <span className="cure-eyebrow-dot" />
          INTELLIGENCE MEETS HEALTH
        </span>

        <h1>
          Your health.
          <br />
          <span>More understood.</span>
        </h1>

        <p className="cure-hero-description">
          Explore AI-assisted health assessments designed to help you
          understand health indicators, explore potential risks, and make
          more informed decisions about your wellbeing.
        </p>

        <div className="cure-hero-actions">
          <a className="cure-button cure-button-primary" href="#assessments">
            Explore assessments <span aria-hidden="true">↗</span>
          </a>

          <a className="cure-button cure-button-outline" href="#how-it-works">
            Discover how <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div className="cure-trust-note">
          <span aria-hidden="true">✳</span>
          <p>Built for awareness. Grounded in responsible use.</p>
        </div>
      </div>

      <div className="cure-hero-art" aria-label="CureAI health and technology illustration">
        <div className="cure-art-glow" />
        <div className="cure-art-ring cure-art-ring-one" />
        <div className="cure-art-ring cure-art-ring-two" />

        <div className="cure-art-orbit-label">
          <span>HUMAN</span>
          <span>×</span>
          <span>INTELLIGENCE</span>
        </div>

        <div className="cure-art-heart">
          <svg viewBox="0 0 240 220" fill="none" aria-hidden="true">
            <path
              d="M120 194C105 180 32 128 32 75C32 42 54 24 80 24C99 24 112 36 120 49C130 34 144 24 163 24C189 24 208 43 208 72C208 125 139 180 120 194Z"
              stroke="currentColor"
              strokeWidth="2.5"
            />
            <path
              d="M49 106H82L96 78L116 132L139 91L154 106H191"
              stroke="#72E1C1"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M120 132V150C120 163 131 173 144 173C158 173 168 162 168 149V130"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="168" cy="125" r="8" stroke="#72E1C1" strokeWidth="3" />
          </svg>
        </div>

        <div className="cure-art-chip cure-art-chip-top">
          <span className="cure-chip-icon">✳</span>
          <span>
            <strong>AI meets awareness</strong>
            <small>A more informed perspective</small>
          </span>
        </div>

        <div className="cure-art-chip cure-art-chip-bottom">
          <span className="cure-chip-icon cure-chip-icon-peach">♡</span>
          <span>
            <strong>Health comes first</strong>
            <small>People before predictions</small>
          </span>
        </div>

        <div className="cure-art-caption">
          <span />
          A thoughtful approach to health technology
        </div>
      </div>
    </section>
  )
}

function AssessmentCard({ assessment }) {
  return (
    <Link
      className={`cure-assessment-card cure-card-${assessment.color}`}
      to={`/assessments/${assessment.id}`}
      data-assessment={assessment.id}
    >
      <div className="cure-assessment-top">
        <span className="cure-assessment-icon">{assessment.icon}</span>
        <span className="cure-assessment-number">{assessment.number}</span>
      </div>

      <span className="cure-assessment-status">{assessment.status}</span>
      <h3>{assessment.title} Assessment</h3>
      <p>{assessment.description}</p>

      <span className="cure-assessment-link">
        Explore assessment <span aria-hidden="true">↗</span>
      </span>

      <span className="cure-card-watermark" aria-hidden="true">
        {assessment.icon}
      </span>
    </Link>
  )
}

function Assessments() {
  return (
    <section className="cure-assessments" id="assessments">
      <div className="cure-section-intro">
        <span className="cure-eyebrow">
          <span className="cure-eyebrow-dot" />
          FIND YOUR FOCUS
        </span>

        <h2>
          Four areas.
          <br />
          <span>One thoughtful platform.</span>
        </h2>

        <p>
          Start with the area that matters to you. Explore health indicators
          through a structured, AI-assisted experience.
        </p>
      </div>

      <div className="cure-assessment-grid">
        {assessments.map((assessment) => (
          <AssessmentCard key={assessment.id} assessment={assessment} />
        ))}
      </div>

      <p className="cure-disclaimer">
        Educational and informational use only. These assessments do not
        provide a medical diagnosis or replace professional medical advice.
      </p>
    </section>
  )
}

function HowItWorks() {
  return (
    <section className="cure-how" id="how-it-works">
      <div className="cure-how-heading">
        <span className="cure-eyebrow">
          <span className="cure-eyebrow-dot" />
          SIMPLE BY DESIGN
        </span>

        <h2>
          Clarity starts
          <br />
          <span>with understanding.</span>
        </h2>

        <p>
          A straightforward journey from sharing information to exploring
          what your results may mean.
        </p>
      </div>

      <div className="cure-steps">
        {steps.map((step) => (
          <article className="cure-step" key={step.number}>
            <div className="cure-step-top">
              <span className="cure-step-number">{step.number}</span>
              <span className="cure-step-icon">{step.icon}</span>
            </div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function SafetyNotice() {
  return (
    <section className="cure-safety" id="about">
      <div className="cure-safety-decoration" aria-hidden="true">
        <svg viewBox="0 0 180 180" fill="none">
          <path
            d="M90 150C73 133 29 101 29 66C29 43 44 29 63 29C75 29 85 36 90 46C97 35 107 29 120 29C140 29 151 44 151 64C151 100 107 133 90 150Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M45 88H68L80 70L94 106L108 82H133"
            stroke="#72E1C1"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="cure-safety-icon" aria-hidden="true">
        ♡
      </div>

      <div className="cure-safety-copy">
        <span className="cure-safety-label">OUR APPROACH</span>
        <h2>Technology with people at heart.</h2>
        <p>
          CureAI is an educational project exploring AI-assisted health
          assessments. Results should not be used as a substitute for
          professional medical advice, diagnosis, or treatment. Always
          consult a qualified healthcare professional about health concerns.
        </p>
      </div>

      <span className="cure-safety-signoff">
        Awareness is a beginning.
      </span>
    </section>
  )
}

function Footer() {
  return (
    <footer className="cure-footer">
      <CureAILogo footer />

      <p>Smarter insights. More informed choices.</p>

      <div className="cure-footer-links">
        <a href="#assessments">Assessments</a>
        <a href="#how-it-works">How it works</a>
        <a href="#about">Our approach</a>
        <a href="#home">Back to top ↑</a>
      </div>
    </footer>
  )
}

export default function Home() {
  return (
    <div className="cure-home">
      <Navbar />

      <main>
        <Hero />
        <Assessments />
        <HowItWorks />
        <SafetyNotice />
      </main>

      <Footer />
    </div>
  )
}
