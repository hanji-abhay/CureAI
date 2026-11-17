import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) return;

    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
         "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: email.trim(),
            password,
            rememberMe,
          }),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success || !data.token || !data.user) {
        setMessage(data.message || "Unable to sign in. Please try again.");
        return;
      }

      // Update the shared authentication state and save the user.
      login(data.token, data.user);

      setMessage("Login successful! Redirecting...");

      navigate("/dashboard", { replace: true });
    } catch {
      setMessage(
        "Could not connect to CureAI. Please check that the backend is running.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <main className="login-page">
      <style>{`
        .login-page {
          --login-forest: #153f38;
          --login-deep: #10342e;
          --login-cream: #f7f5ef;
          --login-ink: #193a36;
          --login-muted: #7b8981;
          --login-pink: #cf7895;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          background: var(--login-cream);
          color: var(--login-ink);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .login-page * {
          box-sizing: border-box;
        }

        .login-showcase {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 100vh;
          overflow: hidden;
          padding: clamp(30px, 5vw, 65px);
          color: #f9f6ee;
          background:
            radial-gradient(ellipse at 20% 80%, rgba(104, 159, 136, .2), transparent 45%),
            radial-gradient(ellipse at 90% 10%, rgba(207, 120, 149, .13), transparent 40%),
            var(--login-forest);
        }

        .login-showcase::before,
        .login-showcase::after {
          position: absolute;
          content: "";
          width: 340px;
          height: 340px;
          border: 1px solid rgba(235, 245, 232, .11);
          border-radius: 50%;
          pointer-events: none;
        }

        .login-showcase::before {
          right: -170px;
          top: 18%;
          box-shadow:
            0 0 0 35px rgba(235,245,232,.025),
            0 0 0 70px rgba(235,245,232,.02);
        }

        .login-showcase::after {
          left: -230px;
          bottom: -130px;
          width: 430px;
          height: 430px;
          box-shadow: 0 0 0 35px rgba(235,245,232,.025);
        }

        .login-brand {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 11px;
          width: fit-content;
          color: #fffaf0;
          text-decoration: none;
          font-size: 23px;
          font-weight: 750;
          letter-spacing: -1px;
        }

        .login-brand-symbol {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,.3);
          border-radius: 13px;
          color: #f5cad7;
          background: rgba(255,255,255,.07);
          font-size: 21px;
        }

        .login-brand-ai {
          color: #e6a6bc;
        }

        .login-showcase-content {
          position: relative;
          z-index: 1;
          max-width: 480px;
          padding: 55px 0;
        }

        .login-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: #e8b2c4;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2.2px;
          text-transform: uppercase;
        }

        .login-eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #e6a6bc;
          box-shadow: 0 0 14px rgba(230,166,188,.55);
        }

        .login-showcase h1 {
          margin: 24px 0 20px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(40px, 5vw, 65px);
          font-weight: 400;
          line-height: 1.08;
          letter-spacing: -2px;
        }

        .login-showcase h1 em {
          color: #e8a7bd;
          font-weight: 400;
        }

        .login-showcase-copy {
          max-width: 390px;
          color: rgba(247,246,235,.72);
          font-size: 14px;
          line-height: 1.9;
        }

        .login-orbit {
          position: relative;
          width: min(100%, 370px);
          aspect-ratio: 1.5;
          display: grid;
          place-items: center;
          margin: 38px auto 0;
        }

        .login-orbit-ring {
          position: absolute;
          width: 220px;
          height: 220px;
          border: 1px solid rgba(229,239,224,.24);
          border-radius: 50%;
        }

        .login-orbit-ring.ring-two {
          width: 166px;
          height: 166px;
          border-style: dashed;
          border-color: rgba(229,239,224,.25);
        }

        .login-orbit-ring.ring-three {
          width: 108px;
          height: 108px;
          border-color: rgba(231,171,192,.45);
        }

        .login-orbit-center {
          position: relative;
          z-index: 1;
          width: 67px;
          height: 67px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,.26);
          border-radius: 23px;
          color: #f1b7cb;
          background: rgba(255,255,255,.09);
          font-size: 32px;
          box-shadow: 0 0 50px rgba(226,161,186,.13);
        }

        .login-orbit-node {
          position: absolute;
          z-index: 1;
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,.2);
          border-radius: 13px;
          color: #f3e9db;
          background: #245349;
          font-size: 15px;
        }

        .login-orbit-node.node-one {
          top: 12px;
          left: calc(50% - 18px);
        }

        .login-orbit-node.node-two {
          right: 46px;
          top: 50%;
        }

        .login-orbit-node.node-three {
          bottom: 8px;
          left: calc(50% - 18px);
          color: #f1b7cb;
        }

        .login-orbit-node.node-four {
          left: 46px;
          top: 50%;
        }

        .login-showcase-footer {
          position: relative;
          z-index: 1;
          color: rgba(247,246,235,.57);
          font-size: 10px;
          letter-spacing: .5px;
        }

        .login-form-side {
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 45px 28px;
        }

        .login-form-wrap {
          width: 100%;
          max-width: 410px;
        }

        .login-mobile-brand {
          display: none;
        }

        .login-form-eyebrow {
          margin: 0 0 13px;
          color: #a14d6c;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.8px;
          text-transform: uppercase;
        }

        .login-form-wrap h2 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(35px, 4vw, 46px);
          font-weight: 500;
          line-height: 1.15;
          letter-spacing: -1.4px;
        }

        .login-form-subtitle {
          margin: 13px 0 30px;
          color: var(--login-muted);
          font-size: 13px;
          line-height: 1.8;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 19px;
        }

        .login-field {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .login-field label {
          color: var(--login-ink);
          font-size: 12px;
          font-weight: 750;
        }

        .login-input-wrap {
          position: relative;
        }

        .login-input {
          width: 100%;
          min-height: 51px;
          padding: 13px 15px;
          border: 1px solid #e1e4dc;
          border-radius: 11px;
          outline: none;
          color: var(--login-ink);
          background: #fffefa;
          font: inherit;
          font-size: 13px;
          transition: border-color 160ms ease, box-shadow 160ms ease;
        }

        .login-input:focus {
          border-color: #a56d80;
          box-shadow: 0 0 0 3px rgba(207,120,149,.12);
        }

        .login-input::placeholder {
          color: #a3aca4;
        }

        .login-password-input {
          padding-right: 78px;
        }

        .login-password-toggle {
          position: absolute;
          top: 50%;
          right: 13px;
          padding: 5px 0;
          transform: translateY(-50%);
          border: 0;
          color: #8c6171;
          background: transparent;
          font: inherit;
          font-size: 11px;
          font-weight: 750;
          cursor: pointer;
        }

        .login-form-options {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: -1px;
        }

        .login-remember {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #64766d;
          font-size: 11px;
          cursor: pointer;
        }

        .login-remember input {
          width: 15px;
          height: 15px;
          margin: 0;
          accent-color: var(--login-forest);
        }

        .login-text-link {
          color: #a14d6c;
          font-size: 11px;
          font-weight: 750;
          text-decoration: none;
        }

        .login-text-link:hover {
          text-decoration: underline;
        }

        .login-submit {
          min-height: 51px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 4px;
          border: 0;
          border-radius: 11px;
          color: white;
          background: var(--login-forest);
          font: inherit;
          font-size: 13px;
          font-weight: 750;
          cursor: pointer;
          transition: background 160ms ease, transform 160ms ease;
        }

        .login-submit:hover {
          transform: translateY(-1px);
          background: #20564a;
        }

        .login-submit-arrow {
          font-size: 17px;
          transition: transform 160ms ease;
        }

        .login-submit:hover .login-submit-arrow {
          transform: translateX(3px);
        }

        .login-feedback {
          margin: 0;
          padding: 12px 14px;
          border: 1px solid #ead0da;
          border-radius: 10px;
          color: #82445c;
          background: #fff3f7;
          font-size: 11px;
          line-height: 1.7;
        }

        .login-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 25px 0;
          color: #9aa39b;
          font-size: 10px;
        }

        .login-divider::before,
        .login-divider::after {
          flex: 1;
          height: 1px;
          content: "";
          background: #e5e7df;
        }

        .login-register-prompt {
          color: #78877e;
          font-size: 12px;
          text-align: center;
        }

        .login-register-prompt a {
          color: #a14d6c;
          font-weight: 800;
          text-decoration: none;
        }

        .login-register-prompt a:hover {
          text-decoration: underline;
        }

        .login-privacy-note {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin-top: 30px;
          color: #89948c;
          font-size: 10px;
          line-height: 1.8;
        }

        .login-privacy-icon {
          color: #668477;
          font-size: 15px;
        }

        .login-bottom-note {
          margin-top: 32px;
          color: #9aa39b;
          font-size: 10px;
          text-align: center;
        }

        @media (max-width: 850px) {
          .login-page {
            grid-template-columns: 0.8fr 1.2fr;
          }

          .login-showcase {
            padding: 32px;
          }

          .login-showcase h1 {
            font-size: 46px;
          }

          .login-orbit {
            transform: scale(.85);
            margin-left: -15px;
          }
        }

        @media (max-width: 650px) {
          .login-page {
            grid-template-columns: 1fr;
          }

          .login-showcase {
            display: none;
          }

          .login-form-side {
            min-height: 100vh;
            padding: 35px 24px;
          }

          .login-mobile-brand {
            display: inline-flex;
            align-items: center;
            gap: 9px;
            margin-bottom: 45px;
            color: var(--login-ink);
            text-decoration: none;
            font-size: 22px;
            font-weight: 800;
            letter-spacing: -1px;
          }

          .login-mobile-brand .login-brand-symbol {
            color: #f1b7cb;
            background: var(--login-forest);
          }

          .login-form-wrap {
            max-width: 430px;
          }

          .login-bottom-note {
            margin-top: 28px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .login-page *,
          .login-page *::before,
          .login-page *::after {
            transition: none !important;
          }
        }
      `}</style>

      <section className="login-showcase">
        <Link to="/" className="login-brand">
          <span className="login-brand-symbol" aria-hidden="true">
            ✳
          </span>
          <span>
            Cure<span className="login-brand-ai">AI</span>
          </span>
        </Link>

        <div className="login-showcase-content">
          <span className="login-eyebrow">
            <span className="login-eyebrow-dot" />
            Intelligence for Wellness
          </span>

          <h1>
            Your wellness journey,
            <br />
            <em>with clarity.</em>
          </h1>

          <p className="login-showcase-copy">
            A thoughtful space to explore health information, organise your
            observations, and take more informed steps toward wellbeing.
          </p>

          <div className="login-orbit" aria-hidden="true">
            <span className="login-orbit-ring" />
            <span className="login-orbit-ring ring-two" />
            <span className="login-orbit-ring ring-three" />
            <span className="login-orbit-node node-one">✧</span>
            <span className="login-orbit-node node-two">♡</span>
            <span className="login-orbit-node node-three">✳</span>
            <span className="login-orbit-node node-four">⌁</span>
            <span className="login-orbit-center">✳</span>
          </div>
        </div>

        <footer className="login-showcase-footer">
          A MORE THOUGHTFUL APPROACH TO HEALTH INFORMATION
        </footer>
      </section>

      <section className="login-form-side">
        <div className="login-form-wrap">
          <Link to="/" className="login-mobile-brand">
            <span className="login-brand-symbol" aria-hidden="true">
              ✳
            </span>
            <span>
              Cure<span className="login-brand-ai">AI</span>
            </span>
          </Link>

          <p className="login-form-eyebrow">WELCOME BACK</p>

          <h2>Good to see you.</h2>

          <p className="login-form-subtitle">
            Sign in to continue your journey toward more informed wellness.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                className="login-input"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setMessage("");
                }}
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="login-password">Password</label>

              <div className="login-input-wrap">
                <input
                  id="login-password"
                  className="login-input login-password-input"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setMessage("");
                  }}
                  required
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="login-form-options">
              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                Remember me
              </label>

              <Link to="/forgot-password" className="login-text-link">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
              {!isSubmitting && <span className="login-submit-arrow">→</span>}
            </button>

            {message && (
              <p className="login-feedback" role="status">
                {message}
              </p>
            )}
          </form>

          <div className="login-divider">NEW TO CUREAI?</div>

          <p className="login-register-prompt">
            Don't have an account? <Link to="/register">Create an account</Link>
          </p>

          <div className="login-privacy-note">
            <span className="login-privacy-icon" aria-hidden="true">
              ♧
            </span>
            <span>
              Your health journey deserves care and respect. This interface is a
              frontend prototype; secure account authentication and data storage
              must be implemented before handling real user data.
            </span>
          </div>

          <p className="login-bottom-note">
            © {new Date().getFullYear()} CureAI · Intelligence for Wellness
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
