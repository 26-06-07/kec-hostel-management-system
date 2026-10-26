import React, { useState } from 'react';

export default function WardenLeaveModal({ leave, isOpen, onClose, onActionSubmit }) {
  const [remarks, setRemarks] = useState(
    leave ? (leave.type === 'Weekend Outing' ? 'Permission granted. Return before 6:30 PM.' : 'Approved for home visit.') : ''
  );
  const [loading, setLoading] = useState(false);

  if (!isOpen || !leave) return null;

  const handleAction = async (status) => {
    setLoading(true);
    await onActionSubmit(leave.id, status, remarks);
    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-backdrop active" onClick={onClose}>
      <div className="modal-dialog modal-md" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <h3 className="modal-title">Warden Leave Authorization</h3>
            <p className="modal-subtitle">Request #{leave.id}</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="review-meta-box mb-3" style={{ background: 'var(--bg-alt)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong>Student:</strong>
              <span>{leave.student_name} ({leave.roll_no})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong>Hostel & Room:</strong>
              <span>{leave.hostel} • Room {leave.room_no}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong>Leave Type:</strong>
              <span className="badge badge-primary">{leave.type}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong>Duration:</strong>
              <span>{leave.from_date} to {leave.to_date}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Parent Contact:</strong>
              <span>📞 {leave.parent_contact}</span>
            </div>
          </div>

          <div className="mb-3">
            <label><strong>Reason / Purpose Stated:</strong></label>
            <p style={{ background: '#ffffff', border: '1px solid var(--border-light)', padding: '0.75rem', borderRadius: '6px', marginTop: '0.25rem' }}>
              "{leave.purpose}"
            </p>
          </div>

          <div className="form-group">
            <label><strong>Warden Approval Remarks:</strong></label>
            <input
              type="text"
              className="form-control"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Approved. Must report to biometric station upon return."
            />
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button
            className="btn btn-outline-danger"
            disabled={loading}
            onClick={() => handleAction('Rejected')}
          >
            ✕ Reject Request
          </button>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-outline-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-success"
              disabled={loading}
              onClick={() => handleAction('Approved')}
            >
              ✓ Approve Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
