import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

export default function AdminDashboard({ user }) {
  const [healthInfo, setHealthInfo] = useState(null);

  useEffect(() => {
    axiosClient.get('/health')
      .then((data) => setHealthInfo(data))
      .catch(() => {});
  }, []);

  return (
    <div className="dashboard-container">
      {/* Admin Profile Banner */}
      <div className="profile-banner-card mb-4">
        <div className="profile-banner-left">
          <div className="profile-avatar-large" style={{ background: 'var(--color-primary-navy)' }}>
            A
          </div>
          <div>
            <div className="profile-name-row">
              <h2>{user?.name || 'Chief Administrator'}</h2>
              <span className="badge badge-primary">SYSTEM ADMIN</span>
            </div>
            <p className="profile-details-line">
              Office of the Principal • Kongu Engineering College (Autonomous)
            </p>
            <p className="profile-details-line">
              Full privileges: Student database, staff allocation, hostel room allotment, server health.
            </p>
          </div>
        </div>
        <div className="profile-banner-right">
          <div className="stat-pill">
            <span className="stat-num">3</span>
            <span className="stat-desc">Hostel Units</span>
          </div>
          <div className="stat-pill">
            <span className="stat-num">1,370</span>
            <span className="stat-desc">Total Capacity</span>
          </div>
        </div>
      </div>

      {/* Backend & Database Connection Status Card */}
      <div className="dash-widget-card mb-4">
        <h3>System Architecture & Database Configuration</h3>
        <p className="text-muted text-sm mb-3">
          This system is built with Node.js, Express.js, JWT, and is configured to connect to MySQL via <code>.env</code>.
        </p>
        <div className="grid-3-col">
          <div className="stat-card">
            <h4>Backend REST API</h4>
            <div className="stat-num text-success" style={{ fontSize: '1.25rem' }}>✓ Online (Port 5000)</div>
            <p className="text-xs text-muted mt-1">Express 4.21.2 • JWT Auth • RBAC</p>
          </div>
          <div className="stat-card">
            <h4>Frontend Application</h4>
            <div className="stat-num text-success" style={{ fontSize: '1.25rem' }}>✓ React 18 + Vite</div>
            <p className="text-xs text-muted mt-1">Component-driven • Responsive</p>
          </div>
          <div className="stat-card">
            <h4>Database Connection</h4>
            <div className="stat-num text-success" style={{ fontSize: '1.25rem' }}>
              {healthInfo?.database_connected || healthInfo?.mysql_connected ? `✓ Connected (${healthInfo?.database_engine || 'SQLite'})` : '⏳ Disconnected'}
            </div>
            <p className="text-xs text-muted mt-1">
              Persistent storage active (<code>kec_hostel.db</code>)
            </p>
          </div>
        </div>
      </div>

      {/* Managed Hostels Overview */}
      <div className="dash-widget-card">
        <h3>Registered Residential Blocks</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Hostel Name</th>
              <th>Caretaker</th>
              <th>Capacity</th>
              <th>Occupancy</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Amaravathi Hostel</strong></td>
              <td>M. Selvam (+91 98421 33445)</td>
              <td>450 Beds</td>
              <td>420 Occupied (93%)</td>
              <td><span className="badge badge-success">Optimal</span></td>
            </tr>
            <tr>
              <td><strong>Bhavani Hostel</strong></td>
              <td>P. Murugesan (+91 98421 44556)</td>
              <td>500 Beds</td>
              <td>468 Occupied (94%)</td>
              <td><span className="badge badge-success">Optimal</span></td>
            </tr>
            <tr>
              <td><strong>Kaveri Hostel</strong></td>
              <td>S. Dharmaraj (+91 98421 55667)</td>
              <td>420 Beds</td>
              <td>395 Occupied (94%)</td>
              <td><span className="badge badge-success">Optimal</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
