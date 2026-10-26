import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

export default function StudentDashboard({ user, initialModule = 'announcements' }) {
  const [activeModule, setActiveModule] = useState(initialModule);
  const [announcements, setAnnouncements] = useState([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [messMenu, setMessMenu] = useState({});
  const [selectedDay, setSelectedDay] = useState('monday');

  // Leave / Out Pass Form state
  const [leaveForm, setLeaveForm] = useState({
    type: 'Weekend Outing',
    from_date: new Date().toISOString().slice(0, 10),
    to_date: new Date().toISOString().slice(0, 10),
    purpose: '',
    parent_contact: user?.parent_phone || ''
  });
  const [leaveMsg, setLeaveMsg] = useState('');

  // Complaint Form state (Strictly using "Complaint", no "Grievance")
  const [complaintForm, setComplaintForm] = useState({
    category: 'Electrical',
    title: '',
    description: ''
  });
  const [complaintMsg, setComplaintMsg] = useState('');

  useEffect(() => {
    fetchAllData();
  }, [user]);

  const fetchAllData = async () => {
    try {
      setAnnouncementsLoading(true);
      const [annRes, leavesRes, complaintsRes, menuRes] = await Promise.all([
        axiosClient.get('/announcements'),
        axiosClient.get('/leaves'),
        axiosClient.get('/complaints'),
        axiosClient.get('/notices/mess-menu')
      ]);

      if (annRes.success) setAnnouncements(annRes.data || []);
      if (leavesRes.success) setLeaves(leavesRes.data || []);
      if (complaintsRes.success) setComplaints(complaintsRes.data || []);
      if (menuRes.success) setMessMenu(menuRes.data || {});
    } catch (err) {
      console.warn('Dashboard data fetch error:', err);
    } finally {
      setAnnouncementsLoading(false);
    }
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    setLeaveMsg('');
    try {
      const res = await axiosClient.post('/leaves', leaveForm);
      if (res.success) {
        setLeaveMsg('✓ Leave / Out Pass request submitted successfully! Awaiting Caretaker review.');
        setLeaves([res.data, ...leaves]);
        setLeaveForm({
          type: 'Weekend Outing',
          from_date: new Date().toISOString().slice(0, 10),
          to_date: new Date().toISOString().slice(0, 10),
          purpose: '',
          parent_contact: user?.parent_phone || ''
        });
      }
    } catch (err) {
      setLeaveMsg(`⚠️ ${err.message || 'Error submitting leave request.'}`);
    }
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    setComplaintMsg('');
    try {
      const res = await axiosClient.post('/complaints', complaintForm);
      if (res.success) {
        setComplaintMsg('✓ Complaint registered successfully! Assigned to Care Taker for resolution.');
        setComplaints([res.data, ...complaints]);
        setComplaintForm({ category: 'Electrical', title: '', description: '' });
      }
    } catch (err) {
      setComplaintMsg(`⚠️ ${err.message || 'Error submitting complaint.'}`);
    }
  };

  // Format date helper (e.g., 22 October 2026)
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const studentHostel = user?.hostel || 'Hostel';
  const studentRoll = user?.roll_no || user?.roll_number || '—';
  const studentRoom = user?.room_no || user?.room_number || '—';

  return (
    <div className="student-dashboard-wrapper">
      {/* ─────────────────────────────────────────────────────────────
          1. STUDENT DASHBOARD HEADER
          - Welcome, [STUDENT NAME] (Large and bold)
          - Roll No: [student roll number]
          - Room No: [student room number]
          - Hostel: [student hostel]
          Dynamic from SQLite database record
          ───────────────────────────────────────────────────────────── */}
      <div className="student-header-banner mb-4">
        <div className="student-header-content">
          <div className="student-avatar-badge">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div className="student-welcome-block">
            <h1 className="student-welcome-name">
              Welcome, {user?.name || 'Student'}!
            </h1>
            <div className="student-meta-details">
              <span className="student-meta-item">
                <span className="student-meta-label">Roll No:</span>
                <span className="student-meta-value">{studentRoll}</span>
              </span>
              <span className="student-meta-separator">•</span>
              <span className="student-meta-item">
                <span className="student-meta-label">Room No:</span>
                <span className="student-meta-value">{studentRoom}</span>
              </span>
              <span className="student-meta-separator">•</span>
              <span className="student-meta-item">
                <span className="student-meta-label">Hostel:</span>
                <span className="student-meta-value hostel-badge-highlight">{studentHostel}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. STUDENT MODULE OPTIONS (Card-based Layout)
          - 1. Mess Menu 🍽️
          - 2. Leave / Out Pass Requests 🚪
          - 3. Complaints 🛠️
          - 4. Announcements 📢
          ───────────────────────────────────────────────────────────── */}
      <div className="student-modules-section mb-4">
        <div className="student-modules-header">
          <h2 className="student-section-title">Student Portal Modules</h2>
          <p className="student-section-subtitle">
            Select a module to view updates and submit residential requests
          </p>
        </div>

        <div className="student-modules-grid">
          {/* Module 1: Mess Menu */}
          <button
            type="button"
            className={`student-module-card ${activeModule === 'mess' ? 'active' : ''}`}
            onClick={() => setActiveModule('mess')}
          >
            <div className="student-module-icon">🍽️</div>
            <div className="student-module-info">
              <h3 className="student-module-title">Mess Menu</h3>
              <p className="student-module-desc">View today's menu & dining schedule</p>
            </div>
            <div className="student-module-status">
              <span className="module-status-dot"></span>
              Daily Menu
            </div>
          </button>

          {/* Module 2: Leave / Out Pass Requests */}
          <button
            type="button"
            className={`student-module-card ${activeModule === 'leaves' ? 'active' : ''}`}
            onClick={() => setActiveModule('leaves')}
          >
            <div className="student-module-icon">🚪</div>
            <div className="student-module-info">
              <h3 className="student-module-title">Leave / Out Pass Requests</h3>
              <p className="student-module-desc">Request leave, out pass & track review</p>
            </div>
            <div className="student-module-status">
              <span className="module-badge-count">{leaves.length}</span>
            </div>
          </button>

          {/* Module 3: Complaints */}
          <button
            type="button"
            className={`student-module-card ${activeModule === 'complaints' ? 'active' : ''}`}
            onClick={() => setActiveModule('complaints')}
          >
            <div className="student-module-icon">🛠️</div>
            <div className="student-module-info">
              <h3 className="student-module-title">Complaints</h3>
              <p className="student-module-desc">Register complaints & track caretaker updates</p>
            </div>
            <div className="student-module-status">
              <span className="module-badge-count">{complaints.length}</span>
            </div>
          </button>

          {/* Module 4: Announcements */}
          <button
            type="button"
            className={`student-module-card ${activeModule === 'announcements' ? 'active' : ''}`}
            onClick={() => setActiveModule('announcements')}
          >
            <div className="student-module-icon">📢</div>
            <div className="student-module-info">
              <h3 className="student-module-title">Announcements</h3>
              <p className="student-module-desc">{studentHostel} official notices</p>
            </div>
            <div className="student-module-status">
              <span className="module-badge-count new-ann">{announcements.length}</span>
            </div>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ACTIVE MODULE CONTENT AREA
          ───────────────────────────────────────────────────────────── */}
      <div className="student-module-content-pane">
        {/* ───────────────────────────────────────────────────────────
            MODULE 1: MESS MENU 🍽️
            ─────────────────────────────────────────────────────────── */}
        {activeModule === 'mess' && (
          <div className="dash-widget-card student-card-fade">
            <div className="student-card-title-bar">
              <div>
                <h3 className="module-pane-heading">Mess Menu — Dining Schedule</h3>
                <p className="text-muted text-sm">
                  Freshly prepared meals served at {studentHostel} dining hall
                </p>
              </div>
              <div className="day-selector-pills">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                  <button
                    key={day}
                    className={`day-pill-btn ${selectedDay === day ? 'active' : ''}`}
                    onClick={() => setSelectedDay(day)}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {messMenu[selectedDay] ? (
              <div className="mess-menu-grid mt-4">
                <div className="meal-card">
                  <div className="meal-card-header">
                    <h4>🍳 Breakfast (07:15 AM - 08:45 AM)</h4>
                  </div>
                  <p className="meal-card-body">{messMenu[selectedDay].breakfast}</p>
                </div>
                <div className="meal-card">
                  <div className="meal-card-header">
                    <h4>🍛 Lunch (12:15 PM - 01:45 PM)</h4>
                  </div>
                  <p className="meal-card-body">{messMenu[selectedDay].lunch}</p>
                </div>
                <div className="meal-card">
                  <div className="meal-card-header">
                    <h4>☕ Snacks & Tea (04:45 PM - 05:45 PM)</h4>
                  </div>
                  <p className="meal-card-body">{messMenu[selectedDay].snacks}</p>
                </div>
                <div className="meal-card">
                  <div className="meal-card-header">
                    <h4>🍲 Dinner (07:15 PM - 08:45 PM)</h4>
                  </div>
                  <p className="meal-card-body">{messMenu[selectedDay].dinner}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted text-center py-4">Loading mess menu schedule...</p>
            )}
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────
            MODULE 2: LEAVE / OUT PASS REQUESTS 🚪
            ─────────────────────────────────────────────────────────── */}
        {activeModule === 'leaves' && (
          <div className="grid-2-col student-card-fade">
            {/* 2A. Apply for Leave / Out Pass */}
            <div className="dash-widget-card">
              <h3 className="module-pane-heading">Apply for Leave / Out Pass</h3>
              <p className="text-muted text-sm mb-3">
                Submit outing or home leave request for Warden approval.
              </p>

              {leaveMsg && (
                <div className={`alert-box ${leaveMsg.startsWith('✓') ? 'alert-success' : 'alert-danger'} mb-3`}>
                  {leaveMsg}
                </div>
              )}

              <form onSubmit={handleLeaveSubmit} className="student-form-stack">
                <div className="form-group">
                  <label className="student-form-label">Permission Type *</label>
                  <select
                    className="form-control"
                    value={leaveForm.type}
                    onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                  >
                    <option value="Weekend Outing">Weekend Outing (Town / Local)</option>
                    <option value="Home Leave">Home Leave (Family Visit)</option>
                    <option value="Emergency Leave">Emergency Leave</option>
                    <option value="Out Pass">Out Pass (Day Outing / Medical)</option>
                    <option value="Academic OD">Academic OD / Symposium</option>
                  </select>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="student-form-label">From Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={leaveForm.from_date}
                      onChange={(e) => setLeaveForm({ ...leaveForm, from_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="student-form-label">To Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={leaveForm.to_date}
                      onChange={(e) => setLeaveForm({ ...leaveForm, to_date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="student-form-label">Purpose / Destination *</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={leaveForm.purpose}
                    onChange={(e) => setLeaveForm({ ...leaveForm, purpose: e.target.value })}
                    required
                    placeholder="Provide details about the destination and purpose of leave..."
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="student-form-label">Parent Contact Phone *</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={leaveForm.parent_contact}
                    onChange={(e) => setLeaveForm({ ...leaveForm, parent_contact: e.target.value })}
                    placeholder="Enter Parent Contact Phone"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Submit Leave / Out Pass Request &rarr;
                </button>
              </form>
            </div>

            {/* 2B. Submitted Requests & Status */}
            <div className="dash-widget-card">
              <h3 className="module-pane-heading">Submitted Requests & Status</h3>
              <p className="text-muted text-sm mb-3">
                Real-time review updates from Caretaker Office
              </p>
              {leaves.length === 0 ? (
                <div className="empty-module-state">
                  <span className="empty-icon">🚪</span>
                  <p className="empty-title">No leave requests submitted yet.</p>
                  <p className="empty-desc">Your submitted out pass and leave requests will appear here.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Reviewer & Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaves.map((l) => (
                        <tr key={l.id}>
                          <td><strong>{l.id}</strong></td>
                          <td>{l.type}</td>
                          <td className="text-sm">{l.from_date} to {l.to_date}</td>
                          <td>
                            <span className={`status-badge status-${l.status.toLowerCase()}`}>
                              {l.status}
                            </span>
                          </td>
                          <td className="text-sm">
                            {l.remarks ? (
                              <div>
                                <div>{l.remarks}</div>
                                {l.approved_by && (
                                  <div className="text-xs text-muted" style={{ marginTop: '2px' }}>
                                    Reviewed by: <strong>{l.approved_by}</strong>
                                  </div>
                                )}
                              </div>
                            ) : (
                              l.status === 'Pending' ? (
                                <span className="text-warning" style={{ fontWeight: 600 }}>⏳ Awaiting Review</span>
                              ) : '—'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────
            MODULE 3: COMPLAINTS 🛠️ (Strictly "Complaint", No "Grievance")
            ─────────────────────────────────────────────────────────── */}
        {activeModule === 'complaints' && (
          <div className="grid-2-col student-card-fade">
            {/* 3A. Register a Complaint */}
            <div className="dash-widget-card">
              <h3 className="module-pane-heading">Register a Complaint</h3>
              <p className="text-muted text-sm mb-3">
                Report electrical, plumbing, carpentry, Wi-Fi, or room maintenance issues.
              </p>

              {complaintMsg && (
                <div className={`alert-box ${complaintMsg.startsWith('✓') ? 'alert-success' : 'alert-danger'} mb-3`}>
                  {complaintMsg}
                </div>
              )}

              <form onSubmit={handleComplaintSubmit} className="student-form-stack">
                <div className="form-group">
                  <label className="student-form-label">Complaint Category *</label>
                  <select
                    className="form-control"
                    value={complaintForm.category}
                    onChange={(e) => setComplaintForm({ ...complaintForm, category: e.target.value })}
                  >
                    <option value="Electrical">Electrical (Fan / Light / Plug Socket)</option>
                    <option value="Plumbing">Plumbing & RO Purifier Water</option>
                    <option value="Wi-Fi / Internet">Wi-Fi & LAN Network</option>
                    <option value="Carpentry">Carpentry (Bed / Study Table / Wardrobe / Door)</option>
                    <option value="Mess / Dining">Mess Dining & Food Quality</option>
                    <option value="Housekeeping">Housekeeping & Hygiene</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="student-form-label">Complaint Subject / Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={complaintForm.title}
                    onChange={(e) => setComplaintForm({ ...complaintForm, title: e.target.value })}
                    required
                    placeholder="Enter complaint subject"
                  />
                </div>

                <div className="form-group">
                  <label className="student-form-label">Detailed Description *</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={complaintForm.description}
                    onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                    required
                    placeholder="Provide specific details to help the maintenance team inspect and resolve the issue..."
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Register Complaint &rarr;
                </button>
              </form>
            </div>

            {/* 3B. Submitted Complaints & Status */}
            <div className="dash-widget-card">
              <h3 className="module-pane-heading">Submitted Complaints & Status</h3>
              <p className="text-muted text-sm mb-3">
                Assigned Care Takers update resolution progress here
              </p>
              {complaints.length === 0 ? (
                <div className="empty-module-state">
                  <span className="empty-icon">🛠️</span>
                  <p className="empty-title">No complaints registered yet.</p>
                  <p className="empty-desc">Any room maintenance or facility issues you register will be listed here.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Ticket ID</th>
                        <th>Category</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Assigned To</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.map((c) => (
                        <tr key={c.id}>
                          <td><strong>{c.id}</strong></td>
                          <td>{c.category}</td>
                          <td>{c.title}</td>
                          <td>
                            <span className={`status-badge status-${c.status.toLowerCase().replace(' ', '-')}`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="text-sm">{c.assigned_to || `${studentHostel} Care Taker`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────
            MODULE 4: ANNOUNCEMENTS 📢 (Hostel-Specific Data Isolation)
            - Heading: Announcements — [student hostel]
            - Only announcements belonging to student's hostel
            - Card layout: Title, Message, Posted by, Date
            - "No announcements for your hostel yet." if empty
            ─────────────────────────────────────────────────────────── */}
        {activeModule === 'announcements' && (
          <div className="student-announcements-pane student-card-fade">
            <div className="announcements-pane-header mb-4">
              <div className="announcements-title-group">
                <h3 className="announcements-main-title">
                  Announcements — {studentHostel}
                </h3>
                <p className="announcements-subtext">
                  Official notices, dining advisories, and block updates strictly for residents of {studentHostel}.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={fetchAllData}
                title="Refresh Announcements"
              >
                🔄 Refresh
              </button>
            </div>

            {announcementsLoading ? (
              <div className="empty-module-state">
                <p className="empty-title">Loading announcements for {studentHostel}...</p>
              </div>
            ) : announcements.length === 0 ? (
              <div className="empty-module-state">
                <span className="empty-icon">📢</span>
                <p className="empty-title">No announcements for your hostel yet.</p>
                <p className="empty-desc">
                  When the {studentHostel} Warden or Care Taker broadcasts a notice, it will immediately appear here.
                </p>
              </div>
            ) : (
              <div className="announcements-cards-list">
                {announcements.map((a) => (
                  <div key={a.id} className="announcement-card-item">
                    <div className="announcement-card-header">
                      <div className="announcement-card-title-row">
                        <span className="announcement-badge-icon">📢</span>
                        <h4 className="announcement-card-title">{a.title}</h4>
                      </div>
                      <span className="announcement-hostel-pill">
                        {a.hostel || studentHostel}
                      </span>
                    </div>

                    <div className="announcement-card-body">
                      <p className="announcement-card-message">{a.message || a.content}</p>
                    </div>

                    <div className="announcement-card-footer">
                      <div className="announcement-poster-meta">
                        <span className="poster-label">Posted by:</span>
                        <span className="poster-name">
                          {a.posted_by_role ? `${a.posted_by_role === 'warden' ? 'Warden' : 'Care Taker'}` : 'Care Taker'}
                          {a.posted_by ? ` (${a.posted_by})` : ''}
                        </span>
                      </div>
                      <div className="announcement-date-meta">
                        <span className="date-icon">🗓️</span>
                        <span className="date-text">{formatDisplayDate(a.created_at)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
