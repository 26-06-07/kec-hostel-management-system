import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

export default function WardenDashboard({ user }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [announcementForm, setAnnouncementForm] = useState({ title: '', message: '' });
  const [announcementMsg, setAnnouncementMsg] = useState('');

  useEffect(() => {
    fetchWardenAnnouncements();
  }, [user]);

  const fetchWardenAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/announcements');
      if (res.success) {
        setAnnouncements(res.data || []);
      }
    } catch (err) {
      console.warn('Warden announcements fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishAnnouncement = async (e) => {
    e.preventDefault();
    setAnnouncementMsg('');
    try {
      const res = await axiosClient.post('/announcements', {
        title: announcementForm.title.trim(),
        message: announcementForm.message.trim()
      });
      if (res.success) {
        setAnnouncementMsg(`✓ Announcement posted successfully for ${user?.hostel || 'your hostel'}!`);
        setAnnouncements([res.data, ...announcements]);
        setAnnouncementForm({ title: '', message: '' });
      }
    } catch (err) {
      setAnnouncementMsg(`⚠️ ${err.message || 'Error publishing announcement.'}`);
    }
  };

  const assignedHostel = user?.hostel || 'Bhavani Hostel';

  return (
    <div className="warden-dashboard-wrapper">
      {/* ─────────────────────────────────────────────────────────────
          WARDEN PROFILE HEADER BANNER
          ───────────────────────────────────────────────────────────── */}
      <div className="student-header-banner mb-4" style={{ borderLeft: '4px solid #059669' }}>
        <div className="student-header-content">
          <div className="student-avatar-badge" style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'W'}
          </div>
          <div className="student-welcome-block">
            <h1 className="student-welcome-name">
              Welcome, {user?.name || 'Warden'}!
            </h1>
            <div className="student-meta-details">
              <span className="student-meta-item">
                <span className="student-meta-label">Role:</span>
                <span className="student-meta-value">Hostel Warden</span>
              </span>
              <span className="student-meta-separator">•</span>
              <span className="student-meta-item">
                <span className="student-meta-label">Phone:</span>
                <span className="student-meta-value">{user?.phone || user?.phone_number || '—'}</span>
              </span>
              <span className="student-meta-separator">•</span>
              <span className="student-meta-item">
                <span className="student-meta-label">Department:</span>
                <span className="student-meta-value">{user?.department || 'Warden Administration'}</span>
              </span>
              <span className="student-meta-separator">•</span>
              <span className="student-meta-item">
                <span className="student-meta-label">Assigned Hostel:</span>
                <span className="hostel-badge-highlight">{assignedHostel}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          WARDEN MAIN SECTION: ANNOUNCEMENTS ONLY
          Requirements:
          - The Warden should have ONLY Announcements.
          - The Warden's job in this application is to post announcements.
          - Do NOT show Student Dashboard, Leave, Mess Menu, or Complaints.
          ───────────────────────────────────────────────────────────── */}
      <div className="grid-2-col student-card-fade">
        {/* Post Announcement Form */}
        <div className="dash-widget-card">
          <h2 className="module-pane-heading">Broadcast Hostel Announcement</h2>
          <p className="text-muted text-sm mb-3">
            Post an announcement strictly for students of <strong>{assignedHostel}</strong>.
          </p>

          <div className="alert-box alert-info mb-3" style={{ fontSize: '0.85rem' }}>
            🔒 <strong>Hostel Association:</strong> Announcements will automatically be published to <strong>{assignedHostel}</strong> using your authenticated Warden database record.
          </div>

          {announcementMsg && (
            <div className={`alert-box ${announcementMsg.startsWith('✓') ? 'alert-success' : 'alert-danger'} mb-3`}>
              {announcementMsg}
            </div>
          )}

          <form onSubmit={handlePublishAnnouncement} className="student-form-stack">
            <div className="form-group">
              <label className="student-form-label">Announcement Title *</label>
              <input
                type="text"
                className="form-control"
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                required
                placeholder="Enter Announcement Title"
              />
            </div>

            <div className="form-group">
              <label className="student-form-label">Announcement Message *</label>
              <textarea
                className="form-control"
                rows="5"
                value={announcementForm.message}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                required
                placeholder="Enter notice content for students (e.g. Hostel maintenance schedule, dining timings, gate curfew advisory)..."
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              📢 Broadcast Announcement &rarr;
            </button>
          </form>
        </div>

        {/* Active Announcements List */}
        <div className="dash-widget-card">
          <div className="student-card-title-bar mb-3">
            <h3 className="module-pane-heading">Active Announcements — {assignedHostel}</h3>
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={fetchWardenAnnouncements}
            >
              🔄 Refresh
            </button>
          </div>

          {loading ? (
            <div className="empty-module-state">
              <p className="empty-title">Loading announcements for {assignedHostel}...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="empty-module-state">
              <span className="empty-icon">📢</span>
              <p className="empty-title">No announcements published yet for {assignedHostel}.</p>
              <p className="empty-desc">Broadcast your first notice to hostel residents using the form.</p>
            </div>
          ) : (
            <div className="announcements-cards-list" style={{ marginTop: 0 }}>
              {announcements.map((a) => (
                <div key={a.id} className="announcement-card-item">
                  <div className="announcement-card-header">
                    <div className="announcement-card-title-row">
                      <span className="announcement-badge-icon">📢</span>
                      <h4 className="announcement-card-title">{a.title}</h4>
                    </div>
                    <span className="announcement-hostel-pill">{a.hostel || assignedHostel}</span>
                  </div>

                  <div className="announcement-card-body">
                    <p className="announcement-card-message">{a.message || a.content}</p>
                  </div>

                  <div className="announcement-card-footer">
                    <div className="announcement-poster-meta">
                      <span className="poster-label">Posted by:</span>
                      <span className="poster-name">
                        {a.posted_by_role === 'warden' ? 'Warden' : 'Care Taker'} ({a.posted_by || user?.name || 'Warden'})
                      </span>
                    </div>
                    <div className="announcement-date-meta">
                      <span className="date-icon">🗓️</span>
                      <span className="date-text">
                        {a.created_at ? new Date(a.created_at).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
