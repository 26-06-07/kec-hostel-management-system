import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StudentDashboard from '../components/dashboards/StudentDashboard';
import CaretakerDashboard from '../components/dashboards/CaretakerDashboard';
import WardenDashboard from '../components/dashboards/WardenDashboard';
import AdminDashboard from '../components/dashboards/AdminDashboard';

export default function DashboardPage({ requiredRole, onOpenAuthModal }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user) {
      const userRole = (user.role || '').toLowerCase();
      const currentPath = location.pathname;

      let expectedPath = '/student/dashboard';
      if (userRole === 'caretaker') expectedPath = '/caretaker/dashboard';
      else if (userRole === 'warden') expectedPath = '/warden/dashboard';
      else if (userRole === 'admin') expectedPath = '/dashboard';

      // If user accesses /dashboard or a route designated for another role, redirect to their proper dashboard
      if (currentPath === '/dashboard' || (requiredRole && requiredRole !== userRole)) {
        navigate(expectedPath, { replace: true });
      }
    }
  }, [user, loading, location.pathname, requiredRole, navigate]);

  if (loading) {
    return (
      <div className="section-padding container text-center">
        <p className="text-muted">Loading authenticated portal...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="section-padding container text-center">
        <div
          className="auth-gate-card"
          style={{
            maxWidth: '540px',
            margin: '3rem auto',
            padding: '2.5rem',
            background: '#fff',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid #e2e8f0'
          }}
        >
          <h2 style={{ color: 'var(--color-primary-navy)' }}>Authentication Required</h2>
          <p className="text-muted mb-4">
            Please log in with your assigned college residential credentials to access your personalized portal.
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
            Login to Access Portal &rarr;
          </button>
        </div>
      </div>
    );
  }

  const userRole = (user.role || '').toLowerCase();

  return (
    <div className="dashboard-page-wrapper section-padding bg-page">
      <div className="container">
        {/* Render Appropriate Portal Based on Database User Role */}
        {userRole === 'student' && <StudentDashboard user={user} />}
        {userRole === 'caretaker' && <CaretakerDashboard user={user} />}
        {userRole === 'warden' && <WardenDashboard user={user} />}
        {userRole === 'admin' && <AdminDashboard user={user} />}
      </div>
    </div>
  );
}

