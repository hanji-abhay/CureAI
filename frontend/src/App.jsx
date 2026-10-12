
import { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

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

  if (showIntro) {
    return <Landing onComplete={finishIntro} />
  }

  return (
    <>
      <Routes>
        {/* Main page */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* User workspace */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/history" element={<History />} />
        <Route path="/reports" element={<Reports />} />

        {/* Health assessments */}
        <Route
          path="/assessments/thyroid"
          element={<ThyroidAssessment />}
        />
        <Route
          path="/assessments/skin"
          element={<SkinAssessment />}
        />
        <Route
          path="/assessments/lung"
          element={<LungAssessment />}
        />
        <Route
          path="/assessments/breast"
          element={<BreastAssessment />}
        />

        {/* Unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {showDock && <FloatingDock />}
    </>
  )
}

function App() {
  return <AppContent />
}

export default App
