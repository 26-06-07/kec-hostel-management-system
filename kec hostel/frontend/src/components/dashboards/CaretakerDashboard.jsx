import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

export default function CaretakerDashboard({ user }) {
  // Tabs: 'leaves' (default now) | 'complaints' | 'announcements'
  const [activeTab, setActiveTab] = useState('leaves');

  // Leaves State
  const [leaves, setLeaves] = useState([]);
  const [leavesLoading, setLeavesLoading] = useState(true);
  const [leaveStatusFilter, setLeaveStatusFilter] = useState('All'); // 'All' | 'Pending' | 'Approved' | 'Rejected'
  const [leaveSearch, setLeaveSearch] = useState('');
  const [leaveActionModal, setLeaveActionModal] = useState({
    isOpen: false,
    leave: null,
    action: 'Approved', // 'Approved' | 'Rejected'
    remarks: ''
  });
  const [processingLeaveId, setProcessingLeaveId] = useState(null);
  const [leaveSuccessMsg, setLeaveSuccessMsg] = useState('');

  // Complaints State
  const [complaints, setComplaints] = useState([]);
  const [complaintsLoading, setComplaintsLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Announcements State
  const [announcements, setAnnouncements] = useState([]);
  const [announcementForm, setAnnouncementForm] = useState({ title: '', message: '' });
  const [announcementMsg, setAnnouncementMsg] = useState('');

  useEffect(() => {
    fetchCaretakerData();
  }, [user]);

  const fetchCaretakerData = async () => {
    try {
      setLeavesLoading(true);
      setComplaintsLoading(true);
      const [leavesRes, compRes, annRes] = await Promise.all([
        axiosClient.get('/leaves'),
        axiosClient.get('/complaints'),
        axiosClient.get('/announcements')
      ]);
      if (leavesRes.success) setLeaves(leavesRes.data || []);
      if (compRes.success) setComplaints(compRes.data || []);
      if (annRes.success) setAnnouncements(annRes.data || []);
    } catch (err) {
      console.warn('Caretaker fetch error:', err);
    } finally {
      setLeavesLoading(false);
      setComplaintsLoading(false);
    }
  };

  // Open modal to Approve or Reject a Leave request
  const openLeaveActionModal = (leave, action) => {
    const defaultRemark =
      action === 'Approved'
        ? 'Parent contacted and permission verified. Out-pass granted.'
        : 'Permission denied as per hostel regulation / unverified parent contact.';
    setLeaveActionModal({
      isOpen: true,
      leave,
      action,
      remarks: defaultRemark
    });
  };

  // Submit Leave Status Update (Approved | Rejected)
  const handleLeaveStatusSubmit = async (e) => {
    e.preventDefault();
    if (!leaveActionModal.leave) return;

    const { leave, action, remarks } = leaveActionModal;
    setProcessingLeaveId(leave.id);
    setLeaveSuccessMsg('');

    try {
      const res = await axiosClient.put(`/leaves/${leave.id}/status`, {
        status: action,
        remarks: remarks.trim()
      });

      if (res.success) {
        setLeaveSuccessMsg(
          `✓ Leave Request #${leave.id} for ${leave.student_name} (${leave.roll_no}) has been marked as "${action}".`
        );
        // Update local state
        setLeaves((prev) =>
          prev.map((l) => (l.id === leave.id ? { ...res.data } : l))
        );
        setLeaveActionModal({ isOpen: false, leave: null, action: 'Approved', remarks: '' });
      }
    } catch (err) {
      setLeaveSuccessMsg(`⚠️ Error updating leave request: ${err.message || 'Operation failed'}`);
    } finally {
      setProcessingLeaveId(null);
    }
  };

  // Quick Inline Status Update
  const handleQuickStatusUpdate = async (leave, newStatus) => {
    setProcessingLeaveId(leave.id);
    setLeaveSuccessMsg('');
    const defaultRemark =
      newStatus === 'Approved'
        ? 'Quick approved by Caretaker office.'
        : 'Quick rejected by Caretaker office.';
    try {
      const res = await axiosClient.put(`/leaves/${leave.id}/status`, {
        status: newStatus,
        remarks: defaultRemark
      });
      if (res.success) {
        setLeaveSuccessMsg(`✓ Leave Request #${leave.id} marked as "${newStatus}".`);
        setLeaves((prev) =>
          prev.map((l) => (l.id === leave.id ? { ...res.data } : l))
        );
      }
    } catch (err) {
      setLeaveSuccessMsg(`⚠️ Error: ${err.message || 'Update failed'}`);
    } finally {
      setProcessingLeaveId(null);
    }
  };

  // Update complaint progress (Pending | In Progress | Resolved)
  const handleProgressChange = async (complaintId, newStatus) => {
    setUpdatingId(complaintId);
    setFeedbackMsg('');
    try {
      const res = await axiosClient.put(`/complaints/${complaintId}/status`, {
        status: newStatus,
        assigned_to: user?.name ? `${user.name} (Care Taker)` : 'Care Taker'
      });
      if (res.success) {
        setFeedbackMsg(`✓ Complaint #${complaintId} status updated to "${newStatus}".`);
        setComplaints((prev) =>
          prev.map((c) =>
            c.id === complaintId
              ? { ...c, status: newStatus, assigned_to: user?.name || 'Care Taker' }
              : c
          )
        );
      }
    } catch (err) {
      setFeedbackMsg(`⚠️ Error updating complaint: ${err.message || 'Update failed'}`);
    } finally {
      setUpdatingId(null);
    }
  };

  // Post announcement strictly for Caretaker's assigned hostel
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

  const assignedHostel = user?.hostel || 'Amaravathi Hostel';

  // Compute Leave Counts
  const pendingLeaves = leaves.filter((l) => (l.status || '').toLowerCase() === 'pending');
  const approvedLeaves = leaves.filter((l) => (l.status || '').toLowerCase() === 'approved');
  const rejectedLeaves = leaves.filter((l) => (l.status || '').toLowerCase() === 'rejected');

  // Filtered Leaves List
  const filteredLeaves = leaves.filter((l) => {
    // Status Filter
    if (leaveStatusFilter !== 'All') {
      if ((l.status || '').toLowerCase() !== leaveStatusFilter.toLowerCase()) return false;
    }
    // Search Query Filter
    if (leaveSearch.trim()) {
      const q = leaveSearch.toLowerCase();
      const matchName = (l.student_name || '').toLowerCase().includes(q);
      const matchRoll = (l.roll_no || '').toLowerCase().includes(q);
      const matchRoom = (l.room_no || '').toLowerCase().includes(q);
      const matchId = (l.id || '').toLowerCase().includes(q);
      const matchPurpose = (l.purpose || '').toLowerCase().includes(q);
      const matchType = (l.type || '').toLowerCase().includes(q);
      return matchName || matchRoll || matchRoom || matchId || matchPurpose || matchType;
    }
    return true;
  });

  return (
    <div className="caretaker-dashboard-wrapper">
      {/* ─────────────────────────────────────────────────────────────
          CARE TAKER HEADER BANNER
          ───────────────────────────────────────────────────────────── */}
      <div className="student-header-banner mb-4" style={{ borderLeft: '4px solid #0b2545' }}>
        <div className="student-header-content">
          <div
            className="student-avatar-badge"
            style={{ background: 'linear-gradient(135deg, #0b2545 0%, #1e3a8a 100%)' }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
          </div>
          <div className="student-welcome-block">
            <h1 className="student-welcome-name">
              Welcome, {user?.name || 'Care Taker'}!
            </h1>
            <div className="student-meta-details">
              <span className="student-meta-item">
                <span className="student-meta-label">Role:</span>
                <span className="student-meta-value">Care Taker</span>
              </span>
              <span className="student-meta-separator">•</span>
              <span className="student-meta-item">
                <span className="student-meta-label">Phone:</span>
                <span className="student-meta-value">{user?.phone || user?.phone_number || '—'}</span>
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
          CARE TAKER 3 MAIN MODULE TABS
          1. Leave / Out-Pass Requests (Approval & Review)
          2. Complaints Dashboard
          3. Announcements
          ───────────────────────────────────────────────────────────── */}
      <div className="student-modules-section mb-4">
        <div className="student-modules-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {/* Module 1: Leave / Out Pass Requests */}
          <button
            type="button"
            className={`student-module-card ${activeTab === 'leaves' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('leaves');
              setLeaveSuccessMsg('');
            }}
          >
            <div className="student-module-icon">🚪</div>
            <div className="student-module-info">
              <h3 className="student-module-title">Leave / Out-Pass Portal</h3>
              <p className="student-module-desc">
                Review, approve or reject out-pass requests for {assignedHostel} students
              </p>
            </div>
            <div className="student-module-status">
              <span
                className="module-badge-count"
                style={{
                  background: pendingLeaves.length > 0 ? '#f59e0b' : '#10b981',
                  color: '#ffffff'
                }}
              >
                {pendingLeaves.length > 0
                  ? `⚡ ${pendingLeaves.length} Pending`
                  : `✓ ${leaves.length} Total`}
              </span>
            </div>
          </button>

          {/* Module 2: Complaints Dashboard */}
          <button
            type="button"
            className={`student-module-card ${activeTab === 'complaints' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('complaints');
              setFeedbackMsg('');
            }}
          >
            <div className="student-module-icon">🛠️</div>
            <div className="student-module-info">
              <h3 className="student-module-title">Complaints Dashboard</h3>
              <p className="student-module-desc">
                Review and update progress on {assignedHostel} student complaints
              </p>
            </div>
            <div className="student-module-status">
              <span className="module-badge-count">{complaints.length} Active</span>
            </div>
          </button>

          {/* Module 3: Announcements */}
          <button
            type="button"
            className={`student-module-card ${activeTab === 'announcements' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('announcements');
              setAnnouncementMsg('');
            }}
          >
            <div className="student-module-icon">📢</div>
            <div className="student-module-info">
              <h3 className="student-module-title">Announcements</h3>
              <p className="student-module-desc">
                Broadcast official notices strictly to {assignedHostel} students
              </p>
            </div>
            <div className="student-module-status">
              <span className="module-badge-count new-ann">{announcements.length} Posted</span>
            </div>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MODULE 1: LEAVE & OUT-PASS REQUESTS DASHBOARD
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'leaves' && (
        <div className="student-card-fade">
          {leaveSuccessMsg && (
            <div
              className={`alert-box mb-3 ${
                leaveSuccessMsg.startsWith('✓') ? 'alert-success' : 'alert-danger'
              }`}
            >
              {leaveSuccessMsg}
            </div>
          )}

          {/* Quick Metrics Bar */}
          <div
            className="stats-row mb-4"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem'
            }}
          >
            <div className="stat-card" style={{ borderLeft: '4px solid #0b2545' }}>
              <span className="stat-title">Total Requests</span>
              <span className="stat-value">{leaves.length}</span>
              <span className="stat-sub">{assignedHostel} residential records</span>
            </div>

            <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b', background: '#fffbeb' }}>
              <span className="stat-title" style={{ color: '#b45309' }}>Pending Review</span>
              <span className="stat-value" style={{ color: '#b45309' }}>{pendingLeaves.length}</span>
              <span className="stat-sub">Requires Caretaker approval</span>
            </div>

            <div className="stat-card" style={{ borderLeft: '4px solid #10b981', background: '#f0fdf4' }}>
              <span className="stat-title" style={{ color: '#047857' }}>Approved</span>
              <span className="stat-value" style={{ color: '#047857' }}>{approvedLeaves.length}</span>
              <span className="stat-sub">Valid out-passes issued</span>
            </div>

            <div className="stat-card" style={{ borderLeft: '4px solid #ef4444', background: '#fef2f2' }}>
              <span className="stat-title" style={{ color: '#b91c1c' }}>Rejected</span>
              <span className="stat-value" style={{ color: '#b91c1c' }}>{rejectedLeaves.length}</span>
              <span className="stat-sub">Denied permission</span>
            </div>
          </div>

          {/* Main Leave Management Table Card */}
          <div className="dash-widget-card">
            <div className="student-card-title-bar mb-3" style={{ flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 className="module-pane-heading">
                  Leave & Out-Pass Requests — {assignedHostel}
                </h2>
                <p className="text-muted text-sm">
                  Verify parent permission and grant official gate out-pass approval or rejection.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={fetchCaretakerData}
                  disabled={leavesLoading}
                >
                  🔄 Refresh Requests
                </button>
              </div>
            </div>

            {/* Filter Pills & Search */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.85rem',
                marginBottom: '1.25rem',
                padding: '0.75rem',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}
            >
              {/* Status Filter Buttons */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {[
                  { key: 'All', label: 'All Requests', count: leaves.length },
                  { key: 'Pending', label: 'Pending Review', count: pendingLeaves.length },
                  { key: 'Approved', label: 'Approved', count: approvedLeaves.length },
                  { key: 'Rejected', label: 'Rejected', count: rejectedLeaves.length }
                ].map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    className="day-tab-btn"
                    style={{
                      background: leaveStatusFilter === f.key ? '#0b2545' : '#ffffff',
                      color: leaveStatusFilter === f.key ? '#ffffff' : '#334155',
                      borderColor: leaveStatusFilter === f.key ? '#0b2545' : '#cbd5e1',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                    onClick={() => setLeaveStatusFilter(f.key)}
                  >
                    {f.label} ({f.count})
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div style={{ minWidth: '260px' }}>
                <input
                  type="text"
                  className="form-control"
                  style={{
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.85rem'
                  }}
                  placeholder="🔍 Search student, roll no, room..."
                  value={leaveSearch}
                  onChange={(e) => setLeaveSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Table or Empty State */}
            {leavesLoading ? (
              <div className="empty-module-state">
                <p className="empty-title">Loading leave requests for {assignedHostel}...</p>
              </div>
            ) : filteredLeaves.length === 0 ? (
              <div className="empty-module-state">
                <span className="empty-icon">🚪</span>
                <p className="empty-title">
                  {leaveStatusFilter === 'All'
                    ? `No leave requests registered for ${assignedHostel}.`
                    : `No ${leaveStatusFilter} leave requests found.`}
                </p>
                <p className="empty-desc">
                  When students of {assignedHostel} submit leave or outing applications in their portal, they will appear here.
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '100px' }}>Request ID</th>
                      <th>Student Details</th>
                      <th>Room</th>
                      <th>Type & Duration</th>
                      <th>Purpose & Destination</th>
                      <th>Parent Contact</th>
                      <th>Status & Review</th>
                      <th style={{ minWidth: '170px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeaves.map((l) => {
                      const isPending = (l.status || '').toLowerCase() === 'pending';
                      const isApproved = (l.status || '').toLowerCase() === 'approved';
                      const isRejected = (l.status || '').toLowerCase() === 'rejected';

                      return (
                        <tr
                          key={l.id}
                          style={{
                            background: isPending ? '#fffdf7' : 'inherit'
                          }}
                        >
                          {/* Request ID & Applied Date */}
                          <td>
                            <strong>{l.id}</strong>
                            <div className="text-muted text-xs" style={{ marginTop: '2px' }}>
                              {l.applied_at ? l.applied_at.slice(0, 10) : 'Recent'}
                            </div>
                          </td>

                          {/* Student Details */}
                          <td>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>
                              {l.student_name}
                            </div>
                            <div className="text-xs">
                              <code style={{ background: '#e2e8f0', padding: '1px 5px', borderRadius: '4px' }}>
                                {l.roll_no}
                              </code>
                            </div>
                          </td>

                          {/* Room */}
                          <td>
                            <strong>{l.room_no || '—'}</strong>
                          </td>

                          {/* Type & Duration */}
                          <td>
                            <span
                              className="badge"
                              style={{
                                background:
                                  l.type === 'Emergency Leave'
                                    ? '#fee2e2'
                                    : l.type === 'Medical Leave'
                                    ? '#fef3c7'
                                    : '#e0f2fe',
                                color:
                                  l.type === 'Emergency Leave'
                                    ? '#b91c1c'
                                    : l.type === 'Medical Leave'
                                    ? '#b45309'
                                    : '#0369a1',
                                marginBottom: '4px'
                              }}
                            >
                              {l.type || 'Weekend Outing'}
                            </span>
                            <div className="text-xs" style={{ fontWeight: 500, color: '#334155' }}>
                              {l.from_date} <span className="text-muted">&rarr;</span> {l.to_date}
                            </div>
                          </td>

                          {/* Purpose */}
                          <td>
                            <div
                              style={{
                                maxWidth: '240px',
                                fontSize: '0.86rem',
                                color: '#1e293b'
                              }}
                              title={l.purpose}
                            >
                              {l.purpose}
                            </div>
                          </td>

                          {/* Parent Contact */}
                          <td>
                            {l.parent_contact ? (
                              <div>
                                <a
                                  href={`tel:${l.parent_contact}`}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    fontWeight: 600,
                                    color: '#0369a1',
                                    fontSize: '0.86rem',
                                    textDecoration: 'none'
                                  }}
                                  title="Click to call parent"
                                >
                                  📞 {l.parent_contact}
                                </a>
                                <div className="text-xs text-muted" style={{ marginTop: '2px' }}>
                                  Verified Contact
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted text-xs">—</span>
                            )}
                          </td>

                          {/* Status & Review Remarks */}
                          <td>
                            <span
                              className={`status-pill ${
                                isApproved
                                  ? 'status-approved'
                                  : isRejected
                                  ? 'status-rejected'
                                  : 'status-pending'
                              }`}
                            >
                              {isApproved ? '✓ Approved' : isRejected ? '✕ Rejected' : '⏳ Pending'}
                            </span>

                            {l.remarks && (
                              <div
                                className="text-xs text-muted"
                                style={{
                                  marginTop: '4px',
                                  maxWidth: '220px',
                                  lineHeight: 1.3
                                }}
                                title={l.remarks}
                              >
                                {l.remarks}
                              </div>
                            )}

                            {l.approved_by && (
                              <div
                                className="text-xs"
                                style={{
                                  color: '#64748b',
                                  marginTop: '2px',
                                  fontStyle: 'italic'
                                }}
                              >
                                By: {l.approved_by}
                              </div>
                            )}
                          </td>

                          {/* Action Buttons */}
                          <td>
                            {isPending ? (
                              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                <button
                                  type="button"
                                  className="btn btn-green btn-xs"
                                  disabled={processingLeaveId === l.id}
                                  onClick={() => openLeaveActionModal(l, 'Approved')}
                                  title="Approve Leave and Issue Out-Pass"
                                >
                                  ✓ Approve
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-xs"
                                  disabled={processingLeaveId === l.id}
                                  onClick={() => openLeaveActionModal(l, 'Rejected')}
                                  title="Reject Leave Request"
                                >
                                  ✕ Reject
                                </button>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                <button
                                  type="button"
                                  className="btn btn-outline-secondary btn-xs"
                                  disabled={processingLeaveId === l.id}
                                  onClick={() =>
                                    openLeaveActionModal(
                                      l,
                                      isApproved ? 'Rejected' : 'Approved'
                                    )
                                  }
                                >
                                  ✏️ Change to {isApproved ? 'Reject' : 'Approve'}
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          LEAVE ACTION CONFIRMATION MODAL
          ───────────────────────────────────────────────────────────── */}
      {leaveActionModal.isOpen && leaveActionModal.leave && (
        <div className="modal-backdrop active" style={{ zIndex: 3000 }}>
          <div className="modal-dialog" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                {leaveActionModal.action === 'Approved' ? '✓ Approve Leave / Out-Pass' : '✕ Reject Leave Request'}
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() =>
                  setLeaveActionModal({
                    isOpen: false,
                    leave: null,
                    action: 'Approved',
                    remarks: ''
                  })
                }
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleLeaveStatusSubmit}>
              <div className="modal-body">
                {/* Student Info Card */}
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '0.85rem 1rem',
                    marginBottom: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 700, color: '#0b2545', fontSize: '0.95rem' }}>
                      {leaveActionModal.leave.student_name}
                    </span>
                    <code>{leaveActionModal.leave.roll_no}</code>
                  </div>
                  <div className="text-xs text-muted" style={{ display: 'flex', gap: '1rem' }}>
                    <span>Hostel: <strong>{leaveActionModal.leave.hostel}</strong></span>
                    <span>Room: <strong>{leaveActionModal.leave.room_no || '—'}</strong></span>
                  </div>
                  <div className="text-xs text-muted" style={{ marginTop: '0.4rem' }}>
                    Period: <strong>{leaveActionModal.leave.from_date}</strong> to <strong>{leaveActionModal.leave.to_date}</strong> ({leaveActionModal.leave.type})
                  </div>
                  <div className="text-xs" style={{ marginTop: '0.4rem', color: '#1e293b' }}>
                    Purpose: <em>"{leaveActionModal.leave.purpose}"</em>
                  </div>
                  {leaveActionModal.leave.parent_contact && (
                    <div className="text-xs" style={{ marginTop: '0.4rem', color: '#0369a1' }}>
                      Parent Phone: <strong>{leaveActionModal.leave.parent_contact}</strong>
                    </div>
                  )}
                </div>

                {/* Quick Remarks Selector */}
                <div className="form-group mb-2">
                  <label className="student-form-label" style={{ fontSize: '0.82rem' }}>
                    Quick Select Remarks:
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {leaveActionModal.action === 'Approved' ? (
                      <>
                        <button
                          type="button"
                          className="day-tab-btn"
                          style={{ fontSize: '0.74rem', padding: '0.2rem 0.5rem' }}
                          onClick={() =>
                            setLeaveActionModal({
                              ...leaveActionModal,
                              remarks: 'Parent contacted and permission verified. Out-pass granted.'
                            })
                          }
                        >
                          Parent Verified
                        </button>
                        <button
                          type="button"
                          className="day-tab-btn"
                          style={{ fontSize: '0.74rem', padding: '0.2rem 0.5rem' }}
                          onClick={() =>
                            setLeaveActionModal({
                              ...leaveActionModal,
                              remarks: 'Approved for weekend outing. Return before hostel curfew (6:30 PM).'
                            })
                          }
                        >
                          Weekend Curfew (6:30 PM)
                        </button>
                        <button
                          type="button"
                          className="day-tab-btn"
                          style={{ fontSize: '0.74rem', padding: '0.2rem 0.5rem' }}
                          onClick={() =>
                            setLeaveActionModal({
                              ...leaveActionModal,
                              remarks: 'Medical leave approved. Provide doctor certificate upon return.'
                            })
                          }
                        >
                          Medical Certificate
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="day-tab-btn"
                          style={{ fontSize: '0.74rem', padding: '0.2rem 0.5rem' }}
                          onClick={() =>
                            setLeaveActionModal({
                              ...leaveActionModal,
                              remarks: 'Parent could not be reached / permission unconfirmed.'
                            })
                          }
                        >
                          Unreached Parent
                        </button>
                        <button
                          type="button"
                          className="day-tab-btn"
                          style={{ fontSize: '0.74rem', padding: '0.2rem 0.5rem' }}
                          onClick={() =>
                            setLeaveActionModal({
                              ...leaveActionModal,
                              remarks: 'Academic working day; out-pass denied.'
                            })
                          }
                        >
                          Working Day
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Remarks Textarea */}
                <div className="form-group">
                  <label className="student-form-label">
                    Care Taker Remarks / Notes *
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={leaveActionModal.remarks}
                    onChange={(e) =>
                      setLeaveActionModal({ ...leaveActionModal, remarks: e.target.value })
                    }
                    placeholder="Enter decision remarks for student..."
                    required
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() =>
                    setLeaveActionModal({
                      isOpen: false,
                      leave: null,
                      action: 'Approved',
                      remarks: ''
                    })
                  }
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn btn-sm ${
                    leaveActionModal.action === 'Approved' ? 'btn-green' : 'btn-danger'
                  }`}
                  disabled={processingLeaveId === leaveActionModal.leave?.id}
                >
                  {processingLeaveId === leaveActionModal.leave?.id
                    ? 'Updating...'
                    : leaveActionModal.action === 'Approved'
                    ? '✓ Confirm Approval'
                    : '✕ Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODULE 2: COMPLAINTS DASHBOARD
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'complaints' && (
        <div className="dash-widget-card student-card-fade">
          {feedbackMsg && (
            <div className="alert-box alert-success mb-3">
              {feedbackMsg}
            </div>
          )}

          <div className="student-card-title-bar mb-3">
            <div>
              <h2 className="module-pane-heading">Complaints Dashboard — {assignedHostel}</h2>
              <p className="text-muted text-sm">
                Maintenance and facility complaints submitted strictly by students of {assignedHostel}.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={fetchCaretakerData}
            >
              🔄 Refresh Complaints
            </button>
          </div>

          {complaintsLoading ? (
            <div className="empty-module-state">
              <p className="empty-title">Loading {assignedHostel} complaints...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="empty-module-state">
              <span className="empty-icon">🛠️</span>
              <p className="empty-title">No active complaints for {assignedHostel}.</p>
              <p className="empty-desc">
                Complaints submitted by students residing in {assignedHostel} will appear here.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>S.No</th>
                    <th>Student Name</th>
                    <th>Roll No</th>
                    <th>Room No</th>
                    <th>Complaint</th>
                    <th style={{ minWidth: '160px' }}>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c, index) => (
                    <tr key={c.id}>
                      <td><strong>{index + 1}</strong></td>
                      <td style={{ fontWeight: 600, color: '#0f172a' }}>{c.student_name || 'Student'}</td>
                      <td><code>{c.roll_no || '—'}</code></td>
                      <td><strong>{c.room_no || '—'}</strong></td>
                      <td>
                        <div style={{ maxWidth: '320px' }}>
                          <span className="badge badge-accent" style={{ fontSize: '0.72rem', marginBottom: '3px' }}>
                            {c.category || 'General'}
                          </span>
                          <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>
                            {c.title}
                          </div>
                          <div className="text-muted text-xs text-truncate" title={c.description}>
                            {c.description}
                          </div>
                        </div>
                      </td>
                      <td>
                        {/* Progress Selector Dropdown */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <select
                            className="form-control"
                            style={{
                              padding: '0.4rem 0.6rem',
                              fontSize: '0.86rem',
                              fontWeight: 600,
                              borderColor:
                                c.status === 'Resolved'
                                  ? '#10b981'
                                  : c.status === 'In Progress'
                                  ? '#0ea5e9'
                                  : '#f59e0b',
                              background:
                                c.status === 'Resolved'
                                  ? '#ecfdf5'
                                  : c.status === 'In Progress'
                                  ? '#f0f9ff'
                                  : '#fffbeb'
                            }}
                            value={c.status || 'Pending'}
                            disabled={updatingId === c.id}
                            onChange={(e) => handleProgressChange(c.id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                          {updatingId === c.id && (
                            <span className="text-xs text-muted">Saving...</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODULE 3: ANNOUNCEMENTS
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'announcements' && (
        <div className="grid-2-col student-card-fade">
          {/* Create Announcement Form */}
          <div className="dash-widget-card">
            <h3 className="module-pane-heading">Create Announcement</h3>
            <p className="text-muted text-sm mb-3">
              Broadcast an announcement to students residing in <strong>{assignedHostel}</strong>.
            </p>

            <div className="alert-box alert-info mb-3" style={{ fontSize: '0.85rem' }}>
              🔒 <strong>Hostel Association:</strong> Announcements will automatically be published to <strong>{assignedHostel}</strong>.
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
                  rows="4"
                  value={announcementForm.message}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                  required
                  placeholder="Enter full details for hostel students (e.g. Mess timing change, water supply notice)..."
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
              <span className="badge badge-accent">{announcements.length} Notices</span>
            </div>

            {announcements.length === 0 ? (
              <div className="empty-module-state">
                <span className="empty-icon">📢</span>
                <p className="empty-title">No announcements posted yet for {assignedHostel}.</p>
                <p className="empty-desc">Use the form to broadcast your first announcement.</p>
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
                          {a.posted_by_role === 'warden' ? 'Warden' : 'Care Taker'} ({a.posted_by || user?.name || 'Care Taker'})
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
      )}
    </div>
  );
}
