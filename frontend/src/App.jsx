import { useState } from 'react'
import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom'

import { AuthProvider, useAuth } from './context/AuthContext.jsx'

import Landing from './pages/Landing.jsx'
import Home from './pages/Home.jsx'

import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'

import Dashboard from './pages/Dashboard.jsx'
import Profile from './pages/Profile.jsx'
import History from './pages/History.jsx'
import Reports from './pages/Reports.jsx'

import ThyroidAssessment from './pages/ThyroidAssessment.jsx'
import SkinAssessment from './pages/SkinAssessment.jsx'
import LungAssessment from './pages/LungAssessment.jsx'
import BreastAssessment from './pages/BreastAssessment.jsx'

import FloatingDock from './components/FloatingDock.jsx'


function AuthUnavailable() {
  const { authError, retryAuth, isCheckingAuth } = useAuth();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeContent: 'center',
        justifyItems: 'center',
        gap: '16px',
        padding: '24px',
        background: '#eee5d2',
        color: '#244c3b',
        fontFamily: 'inherit',
        textAlign: 'center',
      }}
    >
      <h2>We can't verify your session right now.</h2>
      <p>{authError || 'Please check your connection and try again.'}</p>
      <button
        type="button"
        onClick={retryAuth}
        disabled={isCheckingAuth}
        style={{
          padding: '12px 20px',
          border: 'none',
          borderRadius: '8px',
          background: '#244c3b',
          color: '#fff',
          cursor: isCheckingAuth ? 'wait' : 'pointer',
        }}
      >
        {isCheckingAuth ? 'Checking...' : 'Try again'}
      </button>
    </div>
  );
}


// Wait until authentication restoration finishes before deciding
// whether the user may enter a protected page.

function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isCheckingAuth, isAuthenticated, isAuthUnavailable } = useAuth();

  if (isCheckingAuth) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#eee5d2',
          color: '#244c3b',
          fontFamily: 'inherit',
        }}
      >
        Restoring your CureAI session...
      </div>
    );
  }

  if (isAuthUnavailable) {
    return <AuthUnavailable />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}

// Signed-in users should not need to visit login or registration.

function GuestRoute({ children }) {
  const { isCheckingAuth, isAuthenticated, isAuthUnavailable } = useAuth();

  if (isCheckingAuth) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#eee5d2',
          color: '#244c3b',
          fontFamily: 'inherit',
        }}
      >
        Restoring your CureAI session...
      </div>
    );
  }

  if (isAuthUnavailable) {
    return <AuthUnavailable />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppContent() {
  const [showIntro, setShowIntro] = useState(
    () => !sessionStorage.getItem('cureai-intro-seen')
  )

  const location = useLocation()

  function finishIntro() {
    sessionStorage.setItem('cureai-intro-seen', 'true')
    setShowIntro(false)
  }

  const authPaths = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ]

  const showDock =
    !showIntro &&
    !authPaths.includes(location.pathname)

    if (showIntro && location.pathname === '/') {
    return <Landing onComplete={finishIntro} />
  }

  return (
    <>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected user workspace */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />

        <Route
          path="/profile"
          element={<ProtectedRoute><Profile /></ProtectedRoute>}
        />

        <Route
          path="/history"
          element={<ProtectedRoute><History /></ProtectedRoute>}
        />

        <Route
          path="/reports"
          element={<ProtectedRoute><Reports /></ProtectedRoute>}
        />

        {/* Protected health assessments */}
        <Route
          path="/assessments/thyroid"
          element={<ProtectedRoute><ThyroidAssessment /></ProtectedRoute>}
        />

        <Route
          path="/assessments/skin"
          element={<ProtectedRoute><SkinAssessment /></ProtectedRoute>}
        />

        <Route
          path="/assessments/lung"
          element={<ProtectedRoute><LungAssessment /></ProtectedRoute>}
        />

        <Route
          path="/assessments/breast"
          element={<ProtectedRoute><BreastAssessment /></ProtectedRoute>}
        />

        {/* Unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {showDock && <FloatingDock />}
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
