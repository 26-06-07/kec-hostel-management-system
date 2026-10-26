import React from 'react';

export default function InfoModal({ isOpen, type = 'general', onClose, onOpenAuthModal, customTitle }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop active" onClick={onClose}>
      <div className="modal-dialog modal-md" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <h3 className="modal-title">
              {type === 'login_required'
                ? 'Portal Authentication Required'
                : type === 'mess'
                ? 'Dining Hall Regulations & Timings'
                : type === 'medical'
                ? '24x7 Health Post & Medical Help'
                : type === 'rules'
                ? 'Hostel Code of Conduct'
                : 'Campus Residential Information'}
            </h3>
            <p className="modal-subtitle">Kongu Engineering College (Autonomous)</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        <div className="modal-body">
          {type === 'login_required' ? (
            <div className="text-center py-2">
              <h4 style={{ color: 'var(--color-primary-navy)', marginBottom: '0.5rem' }}>
                {customTitle ? `${customTitle} Access` : 'Student Services Portal'}
              </h4>
              <p className="text-muted mb-3">
                To access dining menus, submit weekend outing requests, view room allocations, or register grievances, please log in with your college credentials.
              </p>
              <div className="alert-box alert-info mb-3 text-left">
                <div>
                  <strong>Official Access Note:</strong><br />
                  Students must log in using their registered Roll Number, Room Number and Password. Staff and wardens may access using their verified phone number.
                </div>
              </div>
            </div>
          ) : type === 'mess' ? (
            <div>
              <p className="mb-2"><strong>Daily Dining Complex Timings:</strong></p>
              <ul className="mb-3" style={{ paddingLeft: '1.2rem' }}>
                <li><strong>Breakfast:</strong> 07:15 AM – 08:45 AM</li>
                <li><strong>Lunch:</strong> 12:15 PM – 01:45 PM</li>
                <li><strong>Evening Tea & Snacks:</strong> 04:45 PM – 05:45 PM</li>
                <li><strong>Dinner:</strong> 07:15 PM – 08:45 PM</li>
              </ul>
              <div className="alert-box alert-success">
                Steam-cooked, RO purified water, weekly menu revisions overseen by the student mess committee.
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-2">
                Kongu Engineering College provides disciplined, modern residential accommodations designed to support rigorous academic studies.
              </p>
              <ul className="mb-3" style={{ paddingLeft: '1.2rem' }}>
                <li>Gates close strictly at 07:00 PM on weekdays and 06:30 PM on Sundays.</li>
                <li>Weekend outing requests must be pre-approved by the Warden.</li>
                <li>Zero tolerance policy against ragging or disruptive behavior.</li>
                <li>Continuous CCTV surveillance in public corridors and gate entrances.</li>
              </ul>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {type === 'login_required' ? (
            <>
              <button className="btn btn-outline-secondary" onClick={onClose}>
                Explore as Guest
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  onClose();
                  onOpenAuthModal('login');
                }}
              >
                Login Now &rarr;
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={onClose}>
              Understood
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
