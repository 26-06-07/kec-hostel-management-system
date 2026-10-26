import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const services = [
  {
    id: 'mess',
    title: 'Mess Menu & Dining',
    desc: 'Weekly South Indian balanced menus, special festival meals, and dining rules.',
    icon: '☕',
    iconClass: 'icon-mess',
    tab: 'mess'
  },
  {
    id: 'leave',
    title: 'Outing & Gate Pass',
    desc: 'Digital leave submission, warden authorization, and automated SMS alerts.',
    icon: '📅',
    iconClass: 'icon-leave',
    tab: 'leaves'
  },
  {
    id: 'rooms',
    title: 'Room Occupancy',
    desc: 'Clean residential wings, ventilated study spaces, and amenities overview.',
    icon: '🏠',
    iconClass: 'icon-rooms',
    tab: 'rooms'
  },
  {
    id: 'rules',
    title: 'Campus Guidelines',
    desc: 'Anti-ragging regulations, study timings, silence hours, and campus code.',
    icon: '🔔',
    iconClass: 'icon-announcements',
    tab: 'overview'
  }
];

export default function QuickServices({ onRequireLogin }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCardClick = (service) => {
    if (user) {
      navigate('/dashboard', { state: { initialTab: service.tab } });
    } else {
      onRequireLogin(service.title);
    }
  };

  return (
    <section className="services-section section-padding" id="services">
      <div className="container">
        <div className="section-header">
          <span className="badge badge-accent mb-2">ESSENTIAL FACILITIES</span>
          <h2>Hostel Student Services</h2>
          <p>Quick digital access for dining, leave applications, room occupancies, and campus notices.</p>
        </div>

        <div className="services-grid">
          {services.map((item) => (
            <div
              key={item.id}
              className="service-card"
              onClick={() => handleCardClick(item)}
            >
              <div className={`service-icon ${item.iconClass}`}>
                <span style={{ fontSize: '1.6rem' }}>{item.icon}</span>
              </div>
              <h3 className="service-title">{item.title}</h3>
              <p className="service-text">{item.desc}</p>
              <span className="service-link">
                {user ? 'Open in Dashboard →' : 'Access Portal →'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
