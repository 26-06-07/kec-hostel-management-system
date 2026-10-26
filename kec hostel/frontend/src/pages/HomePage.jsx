import React, { useState } from 'react';
import Slideshow from '../components/home/Slideshow';
import NoticeTicker from '../components/home/NoticeTicker';
import QuickServices from '../components/home/QuickServices';
import HostelsSection from '../components/home/HostelsSection';

function HostelDetailModal({ hostel, onClose, onOpenAuthModal }) {
  if (!hostel) return null;

  return (
    <div className="modal-backdrop active" onClick={onClose}>
      <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <h3 className="modal-title">{hostel.name}</h3>
            <p className="modal-subtitle">Kongu Engineering College Residential Campus</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="hostel-detail-img-wrap mb-3">
            <img
              src={hostel.image || `/assets/hostel-${hostel.id}.jpg`}
              alt={hostel.name}
              style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '10px' }}
            />
          </div>

          <div className="hostel-specs-grid mb-3">
            <div className="spec-card">
              <span className="spec-label">Total Capacity</span>
              <span className="spec-val">{hostel.capacity || 450} Residents</span>
            </div>
            <div className="spec-card">
              <span className="spec-label">Currently Occupied</span>
              <span className="spec-val">{hostel.occupied || 420} Students</span>
            </div>
            <div className="spec-card">
              <span className="spec-label">Total Floors</span>
              <span className="spec-val">{hostel.floors || 4} Floors</span>
            </div>
            <div className="spec-card">
              <span className="spec-label">Caretaker In-Charge</span>
              <span className="spec-val">{hostel.caretaker_name || 'Hostel Staff'}</span>
            </div>
          </div>

          <p className="mb-3">{hostel.tagline}</p>
          <h4 className="facilities-title mb-2">Amenities & Infrastructure:</h4>
          <ul className="facilities-pill-list mb-3">
            {(Array.isArray(hostel.facilities) ? hostel.facilities : []).map((u, d) => (
              <li key={d} className="facility-pill">
                ✓ {u}
              </li>
            ))}
          </ul>

          <div className="alert-box alert-info">
            <span>ℹ️</span>
            <div>
              <strong>Admission & Room Allotment:</strong> Room allocations are managed strictly through the online portal based on academic year and branch quotas.
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline-secondary" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onOpenAuthModal('login');
            }}
          >
            Login to Apply for Room &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HomePage({ onOpenAuthModal, onOpenInfoModal, onRequireLogin }) {
  const [selectedHostel, setSelectedHostel] = useState(null);

  return (
    <div>
      <Slideshow onOpenAuthModal={onOpenAuthModal} onOpenInfoModal={onOpenInfoModal} />
      <NoticeTicker onOpenInfoModal={onOpenInfoModal} />
      <QuickServices onRequireLogin={onRequireLogin} />
      <HostelsSection onSelectHostel={(hostel) => setSelectedHostel(hostel)} />

      <section className="section-padding bg-surface">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-accent mb-2">CAMPUS STANDARDS</span>
            <h2>Why Kongu Residential Campus?</h2>
            <p>Creating an enriching, safe, and disciplined environment for aspiring engineers.</p>
          </div>

          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🛡️</div>
              <h3>Uncompromised Safety & Security</h3>
              <p>Round-the-clock security personnel, automated biometric gates, and continuous CCTV coverage.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🥗</div>
              <h3>Nutritious & Hygienic Mess</h3>
              <p>Modern steam-powered cooking, periodic quality audits, and menu choices monitored by student representatives.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📶</div>
              <h3>High-Speed Campus Wi-Fi</h3>
              <p>Uninterrupted gigabit Wi-Fi network across all residential blocks supporting e-learning and research.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🚑</div>
              <h3>24x7 Medical Assistance</h3>
              <p>On-campus health center with residential doctors, emergency medications, and ready ambulance service.</p>
            </div>
          </div>
        </div>
      </section>

      <HostelDetailModal
        hostel={selectedHostel}
        onClose={() => setSelectedHostel(null)}
        onOpenAuthModal={onOpenAuthModal}
      />
    </div>
  );
}
