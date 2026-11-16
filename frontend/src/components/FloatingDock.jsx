import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const groups = [
  {
    title: "OVERVIEW",
    items: [
      { label: "Home", path: "/", icon: "home" },
      { label: "Dashboard", path: "/dashboard", icon: "dashboard" },
    ],
  },
  {
    title: "ASSESSMENTS",
    items: [
      { label: "Thyroid", path: "/assessments/thyroid", icon: "thyroid" },
      { label: "Skin", path: "/assessments/skin", icon: "skin" },
      { label: "Lung", path: "/assessments/lung", icon: "lung" },
      { label: "Breast", path: "/assessments/breast", icon: "breast" },
    ],
  },
  {
    title: "YOUR SPACE",
    items: [
      { label: "History", path: "/history", icon: "history" },
      { label: "Reports", path: "/reports", icon: "reports" },
      { label: "Profile", path: "/profile", icon: "profile" },
    ],
  },
];

function DockIcon({ name, size = 19 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

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
    close: <path d="m6 6 12 12M18 6 6 18" />,
    expand: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M9 4v16M14 9h3M14 13h3" />
      </>
    ),
    collapse: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M15 4v16M7 9h3M7 13h3" />
      </>
    ),
  };

  return <svg {...common}>{paths[name] || paths.home}</svg>;
}

function FloatingDock() {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [wide, setWide] = useState(false);
  const location = useLocation();

  const expanded = pinned || (hovered && !dismissed);

  const authPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];

  if (authPaths.includes(location.pathname)) return null;

  function handleTriggerClick() {
    if (pinned || (hovered && !dismissed)) {
      setPinned(false);
      setDismissed(true);
      setHovered(false);
    } else {
      setPinned(true);
      setDismissed(false);
    }
  }

  return (
    <div
      className={`cure-dock ${expanded ? "is-expanded" : ""} ${
        wide ? "is-wide" : ""
      }`}
      onMouseLeave={() => {
        setHovered(false);
        setDismissed(false);
      }}
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
          width: 58px;
          max-height: calc(100dvh - 115px);
          padding: 8px;
          overflow-x: hidden;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #c6d4c8 transparent;
          border: 1px solid rgba(255,255,255,.78);
          border-radius: 29px;
          background: rgba(251,249,242,.95);
          box-shadow: 0 16px 42px rgba(23,59,55,.14),
            inset 0 1px 0 rgba(255,255,255,.9);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          opacity: 0;
          transform: translateY(12px) scale(.96);
          transform-origin: bottom left;
          pointer-events: none;
          transition: width .28s cubic-bezier(.2,.8,.2,1),
            opacity .2s ease,
            transform .28s cubic-bezier(.2,.8,.2,1);
        }

        .cure-dock.is-expanded .cure-dock-menu {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }

        .cure-dock.is-wide .cure-dock-menu {
          width: 232px;
          padding: 12px;
          border-radius: 22px;
        }

        .cure-dock-group + .cure-dock-group {
          margin-top: 8px;
          padding-top: 9px;
          border-top: 1px solid #e7e9df;
        }

        .cure-dock-heading {
          display: none;
          margin: 0 0 7px;
          padding: 0 9px;
          color: #84948a;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.5px;
          line-height: 1.5;
          white-space: nowrap;
        }

        .cure-dock.is-wide .cure-dock-heading {
          display: block;
        }

        .cure-dock-link {
          position: relative;
          display: flex;
          align-items: center;
          flex: 0 0 42px;
          gap: 12px;
          width: 42px;
          height: 42px;
          margin-bottom: 4px;
          padding: 0;
          overflow: visible;
          border-radius: 14px;
          color: #698077;
          text-decoration: none;
          white-space: nowrap;
          transition: width .28s ease, color .2s ease,
            background .2s ease, transform .2s ease;
        }

        .cure-dock.is-wide .cure-dock-link {
          width: 100%;
          padding: 0 11px;
          margin-bottom: 3px;
        }

        .cure-dock-link:hover {
          color: var(--dock-green);
          background: #eaf0e7;
        }

        .cure-dock-link.active {
          color: white;
          background: var(--dock-green);
          box-shadow: 0 5px 13px rgba(36,94,82,.17);
        }

        .cure-dock-link svg {
          flex: 0 0 19px;
          margin-left: 11px;
        }

        .cure-dock.is-wide .cure-dock-link svg {
          margin-left: 0;
        }

        .cure-dock-label {
          display: none;
          overflow: hidden;
          font-size: 12px;
          font-weight: 650;
          text-overflow: ellipsis;
        }

        .cure-dock.is-wide .cure-dock-label {
          display: block;
        }

        .cure-dock-tooltip {
          position: absolute;
          left: 51px;
          top: 50%;
          z-index: 3;
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

        .cure-dock:not(.is-wide) .cure-dock-link:hover .cure-dock-tooltip,
        .cure-dock:not(.is-wide) .cure-dock-link:focus-visible .cure-dock-tooltip {
          opacity: 1;
          transform: translate(0,-50%);
        }

        .cure-dock-tools {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 8px;
          padding: 0 2px 10px;
          border-bottom: 1px solid #e7e9df;
        }

        .cure-dock-brand {
          display: none;
          color: var(--dock-ink);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: -.3px;
        }

        .cure-dock-brand span {
          color: #6b8c77;
          font-weight: 500;
        }

        .cure-dock.is-wide .cure-dock-tools {
          justify-content: space-between;
        }

        .cure-dock.is-wide .cure-dock-brand {
          display: block;
        }

        .cure-dock-brand {
          color: var(--dock-ink);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: -.3px;
        }

        .cure-dock-brand span {
          color: #6b8c77;
          font-weight: 500;
        }

        .cure-dock-expand {
          display: grid;
          flex: 0 0 30px;
          place-items: center;
          width: 30px;
          height: 30px;
          border: 1px solid #e3e8df;
          border-radius: 9px;
          background: #fffefa;
          color: var(--dock-green);
          cursor: pointer;
          transition: background .2s ease, transform .2s ease;
        }

        .cure-dock-expand:hover {
          background: #eaf0e7;
          transform: scale(1.04);
        }

        .cure-dock-expand:focus-visible,
        .cure-dock-trigger:focus-visible,
        .cure-dock-link:focus-visible {
          outline: 3px solid #91b8a0;
          outline-offset: 3px;
        }

        .cure-dock-trigger {
          position: relative;
          display: grid;
          place-items: center;
          flex: 0 0 58px;
          width: 58px;
          height: 58px;
          border: 1px solid rgba(255,255,255,.6);
          border-radius: 50%;
          background: var(--dock-green);
          color: white;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(23,59,55,.22),
            inset 0 1px 0 rgba(255,255,255,.18);
          transition: background .25s ease, box-shadow .25s ease,
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

        @media (max-width: 480px) {
          .cure-dock {
            left: 14px;
            bottom: 16px;
          }

          .cure-dock.is-wide .cure-dock-menu {
            width: min(232px, calc(100vw - 82px));
          }
        }

        @media (max-height: 620px) {
          .cure-dock {
            bottom: 14px;
            left: 14px;
          }

          .cure-dock-menu {
            max-height: calc(100dvh - 90px);
          }

          .cure-dock-link {
            flex-basis: 36px;
            height: 36px;
          }

          .cure-dock-trigger {
            flex-basis: 48px;
            width: 48px;
            height: 48px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cure-dock-menu,
          .cure-dock-link,
          .cure-dock-trigger,
          .cure-dock-expand,
          .cure-dock-tooltip {
            transition: none;
          }
        }
      `}</style>

      <nav
        className="cure-dock-menu"
        aria-label="CureAI navigation"
        aria-hidden={!expanded}
        inert={!expanded}
      >
        <div className="cure-dock-tools">
          <div className="cure-dock-brand">
            Cure<span>AI</span>
          </div>

          <button
            type="button"
            className="cure-dock-expand"
            onClick={() => setWide((current) => !current)}
            aria-label={
              wide ? "Collapse sidebar labels" : "Expand sidebar labels"
            }
            aria-pressed={wide}
            title={wide ? "Collapse sidebar" : "Expand sidebar"}
          >
            <DockIcon name={wide ? "collapse" : "expand"} size={17} />
          </button>
        </div>

        {groups.map((group) => (
          <section className="cure-dock-group" key={group.title}>
            <h2 className="cure-dock-heading">{group.title}</h2>

            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                tabIndex={expanded ? 0 : -1}
                className={({ isActive }) =>
                  `cure-dock-link ${isActive ? "active" : ""}`
                }
                aria-label={item.label}
                title={wide ? undefined : item.label}
                onClick={() => {
                  setPinned(false);
                  setHovered(false);
                  setDismissed(false);
                }}
              >
                <DockIcon name={item.icon} />
                <span className="cure-dock-label">{item.label}</span>
                <span className="cure-dock-tooltip">{item.label}</span>
              </NavLink>
            ))}
          </section>
        ))}
      </nav>

      <button
        type="button"
        className="cure-dock-trigger"
        onMouseEnter={() => {
          if (!pinned && !dismissed) setHovered(true);
        }}
        onClick={handleTriggerClick}
        aria-label={expanded ? "Collapse navigation" : "Expand navigation"}
        aria-expanded={expanded}
        title={expanded ? "Collapse navigation" : "Open navigation"}
      >
        <DockIcon name={expanded ? "close" : "menu"} size={25} />
        {pinned && <span className="cure-dock-pin" />}
      </button>
    </div>
  );
}

export default FloatingDock;
