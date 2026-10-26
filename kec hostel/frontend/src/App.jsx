import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import TopInfoBar from './components/common/TopInfoBar';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/AuthPage';
import InfoModal from './components/modals/InfoModal';

export default function App() {
  const navigate = useNavigate();

  // Info Modal state (for campus helpline & guidance info)
  const [infoModal, setInfoModal] = useState({ isOpen: false, type: 'general', title: '' });

  // Direct full-page navigation handler (Replaces modal popup completely)
  const handleOpenAuthModal = (mode = 'login') => {
    if (mode === 'register') {
      navigate('/register');
    } else {
      navigate('/login');
    }
  };

  const handleOpenInfoModal = (type = 'general', title = '') => {
    setInfoModal({ isOpen: true, type, title });
  };

  const handleRequireLogin = (serviceName) => {
    // Direct redirect to full-page Login screen
    navigate('/login');
  };

  return (
    <div className="app-layout">
      {/* Top Helpline & NAAC Accreditation Bar */}
      <TopInfoBar />

      {/* Main Header with Logo, Navigation, and Auth Menu */}
      <Navbar
        onOpenAuthModal={handleOpenAuthModal}
        onOpenInfoModal={handleOpenInfoModal}
      />

      {/* Application Main Content Routing */}
      <main id="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onOpenAuthModal={handleOpenAuthModal}
                onOpenInfoModal={handleOpenInfoModal}
                onRequireLogin={handleRequireLogin}
              />
            }
          />
          {/* Full-Page Authentication Screens (Requirement 1) */}
          <Route path="/login" element={<AuthPage initialTab="login" />} />
          <Route path="/register" element={<AuthPage initialTab="register" />} />
          <Route path="/auth" element={<AuthPage initialTab="login" />} />

          {/* Authenticated Dashboard Routes */}
          <Route
            path="/dashboard"
            element={<DashboardPage onOpenAuthModal={handleOpenAuthModal} />}
          />
          <Route
            path="/student/dashboard"
            element={<DashboardPage requiredRole="student" onOpenAuthModal={handleOpenAuthModal} />}
          />
          <Route
            path="/caretaker/dashboard"
            element={<DashboardPage requiredRole="caretaker" onOpenAuthModal={handleOpenAuthModal} />}
          />
          <Route
            path="/warden/dashboard"
            element={<DashboardPage requiredRole="warden" onOpenAuthModal={handleOpenAuthModal} />}
          />

          {/* Fallback */}
          <Route
            path="*"
            element={
              <HomePage
                onOpenAuthModal={handleOpenAuthModal}
                onOpenInfoModal={handleOpenInfoModal}
                onRequireLogin={handleRequireLogin}
              />
            }
          />
        </Routes>
      </main>

      {/* Institutional Campus Footer */}
      <Footer onOpenInfoModal={handleOpenInfoModal} />

      {/* Info Modal (Helpline, Rules, Contacts) */}
      <InfoModal
        isOpen={infoModal.isOpen}
        type={infoModal.type}
        customTitle={infoModal.title}
        onClose={() => setInfoModal({ isOpen: false, type: 'general', title: '' })}
        onOpenAuthModal={handleOpenAuthModal}
      />
    </div>
  );
}
