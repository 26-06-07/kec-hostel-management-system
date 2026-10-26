import React from 'react';

export default function Footer({ onOpenInfoModal }) {
  return (
    <footer className="site-footer" id="contact">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>KEC HOSTELS</h3>
            <p>
              Kongu Engineering College (Autonomous), Perundurai, Erode, Tamil Nadu, PIN: 638060.
            </p>
            <p className="text-sm">
              A premier residential campus dedicated to scholarly focus, integrity, hygiene, and student well-being.
            </p>
          </div>

          <div className="footer-col">
            <h4>Hostel Units</h4>
            <ul>
              <li><a href="#our-hostels">Amaravathi Hostel</a></li>
              <li><a href="#our-hostels">Bhavani Hostel</a></li>
              <li><a href="#our-hostels">Kaveri Hostel</a></li>
              <li><a href="#our-hostels">Dining & Catering Complex</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Resident Services</h4>
            <ul>
              <li>
                <a href="#rules" onClick={(e) => { e.preventDefault(); onOpenInfoModal('rules'); }}>
                  Hostel Discipline & Code
                </a>
              </li>
              <li>
                <a href="#mess" onClick={(e) => { e.preventDefault(); onOpenInfoModal('mess'); }}>
                  Mess Timings & Special Diets
                </a>
              </li>
              <li>
                <a href="#medical" onClick={(e) => { e.preventDefault(); onOpenInfoModal('medical'); }}>
                  Health Post & Ambulance
                </a>
              </li>
              <li>
                <a href="#antiragging" onClick={(e) => { e.preventDefault(); onOpenInfoModal('antiragging'); }}>
                  Anti-Ragging Squad
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Helpline & Contacts</h4>
            <ul>
              <li>📞 Chief Warden Office: +91 98421 22222</li>
              <li>📞 Amaravathi Caretaker: +91 98421 33445</li>
              <li>📞 Bhavani Caretaker: +91 98421 44556</li>
              <li>📞 Kaveri Caretaker: +91 98421 55667</li>
              <li>✉️ Email: hostel@kongu.ac.in</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Kongu Engineering College Hostels. All Rights Reserved. Built for student excellence.</p>
        </div>
      </div>
    </footer>
  );
}
