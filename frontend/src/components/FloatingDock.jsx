
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const navigation = [
  { label: 'Home', path: '/', icon: 'home' },
  { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  { label: 'Thyroid', path: '/assessments/thyroid', icon: 'thyroid' },
  { label: 'Skin', path: '/assessments/skin', icon: 'skin' },
  { label: 'Lung', path: '/assessments/lung', icon: 'lung' },
  { label: 'Breast', path: '/assessments/breast', icon: 'breast' },
  { label: 'History', path: '/history', icon: 'history' },
  { label: 'Reports', path: '/reports', icon: 'reports' },
  { label: 'Profile', path: '/profile', icon: 'profile' },
]

function DockIcon({ name, size = 19 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }

  const paths = {
    home: (
      <>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v11h14V9" />
        <path d="M9 20v-6h6v6" />
      </>
    ),
    dashboard: (
      <>
        <rect x="3" y="3" width="8" height="8" rx="2" />
        <rect x="13" y="3" width="8" height="5" rx="2" />
        <rect x="13" y="10" width="8" height="11" rx="2" />
        <rect x="3" y="13" width="8" height="8" rx="2" />
      </>
    ),
    thyroid: (
      <>
        <path d="M12 5c-2-3-6-2-7 2-1 4 1 9 5 9 2 0 2-3 2-5" />
        <path d="M12 5c2-3 6-2 7 2 1 4-1 9-5 9-2 0-2-3-2-5" />
        <path d="M12 5v14" />
      </>
    ),
    skin: (
      <>
        <path d="M12 3c-4 0-8 4-8 9a8 8 0 0 0 16 0c0-5-4-9-8-9Z" />
        <path d="m9 9 .01 0M15 12l.01 0M10 16l.01 0" strokeWidth="3" />
      </>
    ),
    lung: (
      <>
        <path d="M12 3v8" />
        <path d="M11 11c-2-4-4-5-5-3-2 3-3 7-2 10 1 3 5 3 7 0Z" />
        <path d="M13 11c2-4 4-5 5-3 2 3 3 7 2 10-1 3-5 3-7 0Z" />
      </>
    ),
    breast: (
      <>
        <path d="M12 4v4" />
        <path d="M12 8c-2-3-5-2-7 1-2 3-1 7 2 9 2 1 4 0 5-2" />
        <path d="M12 8c2-3 5-2 7 1 2 3 1 7-2 9-2 1-4 0-5-2" />
        <circle cx="12" cy="13" r="1" />
      </>
    ),
    history: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    reports: (
      <>
        <path d="M7 3h7l5 5v13H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z" />
        <path d="M14 3v6h5M8 14h6M8 17h8" />
      </>
    ),
    profile: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    menu: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 9h.01M16 9h.01M8 15c2 2 6 2 8 0" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
  }

  return <svg {...common}>{paths[name] || paths.home}</svg>
}

function FloatingDock() {
  const [hovered, setHovered] = useState(false)
  const [pinned, setPinned] = useState(false)
  const location = useLocation()

  const expanded = hovered || pinned

  // Avoid covering authentication and account recovery screens.
  const authPaths = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ]

  if (authPaths.includes(location.pathname)) {
    return null
  }

  return (
    <div
      className={`cure-dock ${expanded ? 'is-expanded' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <style>{`
        .cure-dock {
          --dock-green: #245e52;
          --dock-ink: #173b37;
          --dock-cream: #fbf9f2;
          position: fixed;
          z-index: 1000;
          left: 25px;
          bottom: 26px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        }

        .cure-dock * {
          box-sizing: border-box;
        }

        .cure-dock-menu {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 58px;
          padding: 8px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.75);
          border-radius: 30px;
          background: rgba(251,249,242,.91);
          box-shadow:
            0 16px 42px rgba(23,59,55,.14),
            inset 0 1px 0 rgba(255,255,255,.9);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          opacity: 0;
          transform: translateY(18px) scale(.92);
          transform-origin: bottom left;
          pointer-events: none;
          transition:
            opacity .24s ease,
            transform .3s cubic-bezier(.2,.8,.2,1);
        }

        .cure-dock.is-expanded .cure-dock-menu {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }

        .cure-dock-link {
          position: relative;
          display: flex;
          flex: 0 0 42px;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          color: #698077;
          text-decoration: none;
          transition:
            color .2s ease,
            background .2s ease,
            transform .2s ease;
        }

        .cure-dock-link:hover {
          color: var(--dock-green);
          background: #eaf0e7;
          transform: scale(1.07);
        }

        .cure-dock-link.active {
          color: white;
          background: var(--dock-green);
          box-shadow: 0 5px 13px rgba(36,94,82,.2);
        }

        .cure-dock-tooltip {
          position: absolute;
          left: 51px;
          top: 50%;
          z-index: 2;
          padding: 8px 12px;
          border: 1px solid #e7e9df;
          border-radius: 9px;
          background: #fffefa;
          color: var(--dock-ink);
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
          box-shadow: 0 6px 20px rgba(23,59,55,.09);
          opacity: 0;
          transform: translate(-5px,-50%);
          pointer-events: none;
          transition: opacity .16s ease, transform .16s ease;
        }

        .cure-dock-link:hover .cure-dock-tooltip,
        .cure-dock-link:focus-visible .cure-dock-tooltip {
          opacity: 1;
          transform: translate(0,-50%);
        }

        .cure-dock-trigger {
          display: grid;
          place-items: center;
          width: 58px;
          height: 58px;
          border: 1px solid rgba(255,255,255,.6);
          border-radius: 50%;
          background: var(--dock-green);
          color: white;
          cursor: pointer;
          box-shadow:
            0 8px 24px rgba(23,59,55,.22),
            inset 0 1px 0 rgba(255,255,255,.18);
          transition:
            background .25s ease,
            box-shadow .25s ease,
            transform .3s cubic-bezier(.2,.8,.2,1);
        }

        .cure-dock-trigger:hover {
          background: #194a40;
          box-shadow: 0 11px 30px rgba(23,59,55,.28);
        }

        .cure-dock-trigger:active {
          transform: scale(.94);
        }

        .cure-dock.is-expanded .cure-dock-trigger {
          transform: rotate(45deg);
        }

        .cure-dock.is-expanded .cure-dock-trigger:hover {
          transform: rotate(45deg) scale(1.04);
        }

        .cure-dock-trigger:focus-visible,
        .cure-dock-link:focus-visible {
          outline: 3px solid #91b8a0;
          outline-offset: 3px;
        }

        .cure-dock-pin {
          position: absolute;
          top: 1px;
          right: 1px;
          width: 11px;
          height: 11px;
          border: 2px solid var(--dock-green);
          border-radius: 50%;
          background: #d8e8b7;
        }

        @media (max-height: 620px) {
          .cure-dock {
            bottom: 14px;
            left: 14px;
          }

          .cure-dock-menu {
            gap: 2px;
            padding: 5px;
          }

          .cure-dock-link {
            flex-basis: 34px;
            width: 34px;
            height: 34px;
          }

          .cure-dock-trigger {
            width: 48px;
            height: 48px;
          }

          .cure-dock-menu {
            width: 48px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cure-dock-menu,
          .cure-dock-link,
          .cure-dock-trigger,
          .cure-dock-tooltip {
            transition: none;
          }
        }
      `}</style>

      <nav
        className="cure-dock-menu"
        aria-label="CureAI navigation"
        aria-hidden={!expanded}
      >
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            tabIndex={expanded ? 0 : -1}
            className={({ isActive }) =>
              `cure-dock-link ${isActive ? 'active' : ''}`
            }
            aria-label={item.label}
            onClick={() => {
              setPinned(false)
              setHovered(false)
            }}
          >
            <DockIcon name={item.icon} />
            <span className="cure-dock-tooltip">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        className="cure-dock-trigger"
        onClick={() => setPinned((current) => !current)}
        aria-label={pinned ? 'Unlock and collapse navigation' : 'Keep navigation expanded'}
        aria-expanded={expanded}
        title={pinned ? 'Unlock navigation' : 'Pin navigation open'}
      >
        <DockIcon name={expanded ? 'close' : 'menu'} size={25} />
        {pinned && <span className="cure-dock-pin" />}
      </button>
    </div>
  )
}

export default FloatingDock
