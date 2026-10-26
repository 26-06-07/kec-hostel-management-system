import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

const fallbackHostels = [
  {
    id: 'amaravathi',
    name: 'Amaravathi Hostel',
    tagline: 'Eco-friendly, modern amenities with disciplined study halls and hygienic dining.',
    capacity: 450,
    occupied: 420,
    floors: 4,
    facilities: [
      '24x7 Purified RO Drinking Water',
      'Wi-Fi Enabled Study Halls',
      'Steam-Powered Hygienic Dining Hall',
      'Solar Water Heaters',
      'Indoor Badminton & Table Tennis'
    ],
    image: '/assets/hostel-amaravathi.jpg'
  },
  {
    id: 'bhavani',
    name: 'Bhavani Hostel',
    tagline: 'Spacious multi-sharing rooms surrounded by green flora and round-the-clock security.',
    capacity: 500,
    occupied: 468,
    floors: 4,
    facilities: [
      'High-Speed Campus LAN & Wi-Fi',
      'Modern Gymnasium & Fitness Corner',
      'Continuous CCTV Surveillance',
      'Round-the-Clock Ambulance Support',
      'Spacious Reading Room'
    ],
    image: '/assets/hostel-bhavani.jpg'
  },
  {
    id: 'kaveri',
    name: 'Kaveri Hostel',
    tagline: 'Peaceful environment optimized for academic excellence and collaborative learning.',
    capacity: 420,
    occupied: 395,
    floors: 3,
    facilities: [
      'Quiet Library Annex with e-Journals',
      'Automated Laundry Stations',
      'Doctor-on-Call & Health Post',
      'Uninterrupted Power Backup (100 kVA DG)',
      'Spacious Dining Complex'
    ],
    image: '/assets/hostel-kaveri.jpg'
  }
];

export default function HostelsSection({ onSelectHostel }) {
  const [hostels, setHostels] = useState(fallbackHostels);

  useEffect(() => {
    axiosClient.get('/hostels')
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setHostels(res.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="section-padding bg-page" id="our-hostels">
      <div className="container">
        <div className="section-header">
          <span className="badge badge-primary mb-2">CAMPUS RESIDENCES</span>
          <h2>Our Hostels</h2>
          <p>
            Well-maintained residential blocks fostering camaraderie, academic discipline, and personal growth.
          </p>
        </div>

        <div className="hostels-grid">
          {hostels.map((hostel) => (
            <div key={hostel.id} className="hostel-card">
              <div className="hostel-card-image-wrap">
                <img
                  src={hostel.image || `/assets/hostel-${hostel.id}.jpg`}
                  alt={hostel.name}
                  className="hostel-card-img"
                  loading="lazy"
                />
                <span className="hostel-capacity-pill">
                  🏢 {hostel.floors || 4} Floors • 👥 {hostel.capacity || 450} Beds
                </span>
              </div>

              <div className="hostel-card-content">
                <h3 className="hostel-card-title">{hostel.name}</h3>
                <p className="hostel-card-desc">{hostel.tagline}</p>

                <div className="hostel-facilities-list">
                  {(Array.isArray(hostel.facilities) ? hostel.facilities : []).slice(0, 3).map((f, i) => (
                    <span key={i} className="facility-chip">
                      <span className="chip-icon">✓</span> {f}
                    </span>
                  ))}
                </div>

                <div className="hostel-card-footer">
                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => onSelectHostel(hostel)}
                  >
                    View Details &rarr;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
