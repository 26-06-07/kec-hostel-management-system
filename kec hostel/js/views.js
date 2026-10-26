/**
 * KEC HOSTELS - Views & UI Renderer
 * Generates all page templates, dashboards, forms, and interactive views.
 */

const Views = {
  // Render Homepage
  renderHome() {
    const hostels = Storage.getHostels();
    const currentUser = Storage.getCurrentUser();

    return `
      <!-- Hero Compact Slideshow Section -->
      <section class="slideshow-section" id="hero-slideshow">
        <div class="slideshow-container">
          <div class="slide active">
            <img src="assets/slide-campus-life.png" alt="KEC Hostel Campus Life" class="slide-img">
            <div class="slide-overlay">
              <div class="slide-content">
                <span class="slide-badge">Kongu Engineering College</span>
                <h1 class="slide-title">KEC Hostels – A Peaceful & Secure Haven</h1>
                <p class="slide-subtitle">Modern residential facilities promoting academic discipline, wholesome nutrition, and a vibrant community.</p>
                <div class="slide-actions">
                  <a href="#our-hostels" class="btn btn-primary">Explore Hostels</a>
                  <button class="btn btn-outline-white" onclick="App.openAuthModal('signin')">Access Student Portal</button>
                </div>
              </div>
            </div>
          </div>

          <div class="slide">
            <img src="assets/slide-dining-mess.png" alt="Hygienic Dining Mess Hall" class="slide-img">
            <div class="slide-overlay">
              <div class="slide-content">
                <span class="slide-badge">Nutritious Food Services</span>
                <h2 class="slide-title">Hygienic & Balanced Dining Halls</h2>
                <p class="slide-subtitle">Steam-cooked South Indian delicacies, periodic menu revisions, and pure RO drinking water.</p>
                <div class="slide-actions">
                  <button class="btn btn-primary" onclick="App.handleServiceClick('mess')">View Mess Portal</button>
                  <a href="#our-hostels" class="btn btn-outline-white">Hostel Accommodations</a>
                </div>
              </div>
            </div>
          </div>

          <div class="slide">
            <img src="assets/hostel-amaravathi.png" alt="Amaravathi Hostel Building" class="slide-img">
            <div class="slide-overlay">
              <div class="slide-content">
                <span class="slide-badge">Campus Infrastructure</span>
                <h2 class="slide-title">Smart, Comfortable & Connected Living</h2>
                <p class="slide-subtitle">High-speed Wi-Fi, 24/7 security surveillance, continuous solar hot water, and dedicated study rooms.</p>
                <div class="slide-actions">
                  <button class="btn btn-primary" onclick="App.handleServiceClick('rooms')">Check Room Availability</button>
                  <button class="btn btn-outline-white" onclick="App.showInfoModal()">Hostel Rules & Guide</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Slideshow Controls -->
          <button class="slide-nav slide-prev" aria-label="Previous slide">&#10094;</button>
          <button class="slide-nav slide-next" aria-label="Next slide">&#10095;</button>
          <div class="slideshow-dots"></div>
        </div>
      </section>

      <!-- Quick Flash Ticker -->
      <div class="notice-ticker">
        <div class="container ticker-container">
          <div class="ticker-label"><span class="ticker-dot"></span> Notice</div>
          <div class="ticker-content">
            <span>Weekend Outing requests must be submitted before Friday 5:00 PM • Special Onam/Diwali mess feast announced • 24/7 Medical Emergency Ext: 2200</span>
          </div>
          <button class="ticker-action" onclick="App.handleServiceClick('announcements')">View All &rarr;</button>
        </div>
      </div>

      <!-- Student Services Quick Access (Protected by Login Required for guests) -->
      <section class="section services-section" id="services">
        <div class="container">
          <div class="section-header text-center">
            <span class="section-tag">Essential Facilities</span>
            <h2 class="section-title">Hostel Student Services</h2>
            <p class="section-desc">Quick digital access for dining, leave applications, room occupancies, and campus notices.</p>
          </div>

          <div class="services-grid">
            <div class="service-card" onclick="App.handleServiceClick('mess')">
              <div class="service-icon icon-mess">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
              </div>
              <h3 class="service-title">Mess Portal</h3>
              <p class="service-text">View daily Breakfast, Lunch, Snacks, Dinner menu, mess timings, and submit food feedback.</p>
              <span class="service-link">Access Portal &rarr;</span>
            </div>

            <div class="service-card" onclick="App.handleServiceClick('leave')">
              <div class="service-icon icon-leave">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/></svg>
              </div>
              <h3 class="service-title">Leave & Outing</h3>
              <p class="service-text">Apply for Home Leave or City Outing digitally with real-time Warden approval status tracking.</p>
              <span class="service-link">Apply / Status &rarr;</span>
            </div>

            <div class="service-card" onclick="App.handleServiceClick('rooms')">
              <div class="service-icon icon-rooms">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <h3 class="service-title">Room Availability</h3>
              <p class="service-text">Explore hostel block details, room capacities, occupied beds, and available bed slots.</p>
              <span class="service-link">Check Availability &rarr;</span>
            </div>

            <div class="service-card" onclick="App.handleServiceClick('announcements')">
              <div class="service-icon icon-announcements">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              </div>
              <h3 class="service-title">Announcements</h3>
              <p class="service-text">Stay updated with official hostel guidelines, maintenance notices, mess updates, and emergency alerts.</p>
              <span class="service-link">Read Notices &rarr;</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Our Hostels Section (Exactly 3 Hostels, Same Image Size, No Boys/Girls Labels) -->
      <section class="section hostels-section" id="our-hostels">
        <div class="container">
          <div class="section-header text-center">
            <span class="section-tag">Residential Campus</span>
            <h2 class="section-title">Our Hostels</h2>
            <p class="section-desc">Kongu Engineering College provides state-of-the-art residential hostels ensuring academic focus and comfort.</p>
          </div>

          <div class="hostels-grid">
            ${hostels.map(hostel => `
              <div class="hostel-card">
                <div class="hostel-card-image-wrap">
                  <img src="${hostel.image}" alt="${hostel.name}" class="hostel-card-img" loading="lazy">
                  <span class="hostel-capacity-pill">${hostel.totalRooms} Rooms • ${hostel.totalCapacity} Beds</span>
                </div>
                <div class="hostel-card-content">
                  <h3 class="hostel-card-title">${hostel.name}</h3>
                  <p class="hostel-card-tagline">${hostel.tagline}</p>
                  <p class="hostel-card-desc">${hostel.description}</p>
                  
                  <div class="hostel-facilities-list">
                    <span class="facility-chip"><span class="chip-icon">📶</span> Wi-Fi</span>
                    <span class="facility-chip"><span class="chip-icon">☀️</span> Solar Water</span>
                    <span class="facility-chip"><span class="chip-icon">💧</span> RO Drinking</span>
                    <span class="facility-chip"><span class="chip-icon">📖</span> Study Hall</span>
                    <span class="facility-chip"><span class="chip-icon">🛡️</span> 24/7 Security</span>
                  </div>

                  <div class="hostel-card-footer">
                    <div class="hostel-status-indicator">
                      <span class="status-dot green"></span>
                      <span>${hostel.availableBeds} Beds Vacant</span>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="App.viewHostelDetails('${hostel.id}')">View Details</button>
                  </div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </section>

      <!-- Campus Life & Key Features Section -->
      <section class="section features-section" id="information">
        <div class="container">
          <div class="section-header text-center">
            <span class="section-tag">Campus Amenities</span>
            <h2 class="section-title">Why Life at KEC Hostels Stands Apart</h2>
            <p class="section-desc">Comprehensive support and wholesome facilities created for collegiate excellence.</p>
          </div>

          <div class="features-grid">
            <div class="feature-box">
              <div class="feature-icon">🛡️</div>
              <h4>Safe & Disciplined Campus</h4>
              <p>Strict round-the-clock security, gated biometrics, resident faculty wardens, and zero ragging tolerance.</p>
            </div>
            <div class="feature-box">
              <div class="feature-icon">🥗</div>
              <h4>Hygienic Steam Kitchen</h4>
              <p>Modern automated kitchen serving nutritious balanced South Indian vegetarian diet with seasonal specials.</p>
            </div>
            <div class="feature-box">
              <div class="feature-icon">⚡</div>
              <h4>Continuous Power & Solar Heat</h4>
              <p>250kVA generator backup for uninterrupted lighting and continuous solar-heated water on all floors.</p>
            </div>
            <div class="feature-box">
              <div class="feature-icon">💻</div>
              <h4>1 Gbps High-Speed Internet</h4>
              <p>Dedicated fiber optic Wi-Fi coverage across all rooms, study corridors, and hostel reading halls.</p>
            </div>
            <div class="feature-box">
              <div class="feature-icon">🏋️</div>
              <h4>Gymnasium & Sports</h4>
              <p>Equipped gymnasiums, badminton quadrangles, table tennis, chess, and carrom for fitness and relaxation.</p>
            </div>
            <div class="feature-box">
              <div class="feature-icon">🏥</div>
              <h4>24/7 Health Care Centre</h4>
              <p>On-campus dispensary with medical officers, basic pharmacy, and 24/7 ambulance support.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact & Help Section -->
      <section class="section contact-section" id="contact">
        <div class="container">
          <div class="contact-card">
            <div class="contact-info">
              <span class="section-tag">Hostel Administration</span>
              <h2 class="contact-title">Have Questions or Need Assistance?</h2>
              <p>Contact the Chief Warden's Office or individual hostel caretakers for room allocation, medical help, or maintenance issues.</p>
              
              <div class="contact-details">
                <div class="contact-item">
                  <div class="item-icon">📍</div>
                  <div>
                    <strong>Campus Address</strong>
                    <p>Kongu Engineering College, Perundurai, Erode - 638060, Tamil Nadu, India.</p>
                  </div>
                </div>
                <div class="contact-item">
                  <div class="item-icon">📞</div>
                  <div>
                    <strong>Chief Warden Office</strong>
                    <p>+91 98421 22222 | Ext: 2201</p>
                  </div>
                </div>
                <div class="contact-item">
                  <div class="item-icon">✉️</div>
                  <div>
                    <strong>Official Email</strong>
                    <p>warden@kongu.edu | hostels@kongu.edu</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="contact-quick-box">
              <h3>Quick Support Desk</h3>
              <p>Need immediate clarification on hostel admissions or leave procedures?</p>
              <div class="quick-links-group">
                <button class="btn btn-outline-primary btn-block" onclick="App.showInfoModal('rules')">View Hostel Rules & Conduct</button>
                <button class="btn btn-outline-primary btn-block" onclick="App.showInfoModal('mess')">Mess Timings & Diet Plan</button>
                <button class="btn btn-primary btn-block" onclick="App.openAuthModal('signin')">Sign In to Student Portal</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  // Render Hostel Details Page
  renderHostelDetails(hostelId) {
    const hostel = Storage.getHostelById(hostelId);
    if (!hostel) return `<div class="container text-center py-5"><h3>Hostel not found.</h3></div>`;

    return `
      <div class="hostel-details-view">
        <!-- Breadcrumb Bar -->
        <div class="details-breadcrumb-bar">
          <div class="container breadcrumb-container">
            <div class="breadcrumbs">
              <a href="#" onclick="App.navigateTo('home'); return false;">Home</a>
              <span>&rsaquo;</span>
              <a href="#our-hostels" onclick="App.navigateTo('home'); return false;">Our Hostels</a>
              <span>&rsaquo;</span>
              <span class="active-crumb">${hostel.name}</span>
            </div>
            <button class="btn btn-outline-secondary btn-sm" onclick="App.navigateTo('home')">&larr; Back to Hostels</button>
          </div>
        </div>

        <!-- Hostel Hero Header -->
        <div class="hostel-hero-header">
          <div class="container">
            <div class="hostel-hero-grid">
              <div class="hostel-hero-image-wrap">
                <img src="${hostel.image}" alt="${hostel.name}" class="hostel-hero-img">
              </div>
              <div class="hostel-hero-info">
                <span class="hostel-badge-top">Residential Facility</span>
                <h1 class="hostel-title-big">${hostel.name}</h1>
                <p class="hostel-tagline-text">${hostel.tagline}</p>
                <p class="hostel-description-full">${hostel.description}</p>
                
                <div class="hostel-key-metrics">
                  <div class="metric-item">
                    <span class="metric-number">${hostel.totalRooms}</span>
                    <span class="metric-label">Total Rooms</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-number">${hostel.totalCapacity}</span>
                    <span class="metric-label">Bed Capacity</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-number text-green">${hostel.availableBeds}</span>
                    <span class="metric-label">Available Beds</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-number">${hostel.floors}</span>
                    <span class="metric-label">Floors</span>
                  </div>
                </div>

                <div class="hostel-cta-bar">
                  <button class="btn btn-primary" onclick="App.handleServiceClick('rooms', '${hostel.name}')">View Room Availability</button>
                  <button class="btn btn-outline-primary" onclick="App.handleServiceClick('leave')">Apply Leave / Outing</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Student Services Bar (Protected with Login Required for Guests) -->
        <div class="details-services-bar">
          <div class="container">
            <div class="details-services-row">
              <div class="service-pill" onclick="App.handleServiceClick('mess')">
                <span class="pill-icon">🍽️</span>
                <div>
                  <strong>Mess Portal</strong>
                  <p>Daily meal schedule & feedback</p>
                </div>
              </div>
              <div class="service-pill" onclick="App.handleServiceClick('leave')">
                <span class="pill-icon">📅</span>
                <div>
                  <strong>Leave & Outing</strong>
                  <p>Apply digital gate pass</p>
                </div>
              </div>
              <div class="service-pill" onclick="App.handleServiceClick('rooms', '${hostel.name}')">
                <span class="pill-icon">🛏️</span>
                <div>
                  <strong>Room Availability</strong>
                  <p>Block & bed vacancy status</p>
                </div>
              </div>
              <div class="service-pill" onclick="App.handleServiceClick('announcements')">
                <span class="pill-icon">📢</span>
                <div>
                  <strong>Announcements</strong>
                  <p>Notices & updates</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Hostel Deep Dive Content -->
        <div class="container section">
          <div class="details-two-col">
            <!-- Left: Facilities and Accommodation Options -->
            <div class="details-main-content">
              <!-- Facilities -->
              <div class="card mb-4">
                <div class="card-header">
                  <h3 class="card-title">Hostel Facilities & Amenities</h3>
                </div>
                <div class="card-body">
                  <div class="facilities-detailed-grid">
                    ${hostel.facilities.map(fac => `
                      <div class="fac-item">
                        <span class="fac-check">✔</span>
                        <span>${fac}</span>
                      </div>
                    `).join("")}
                  </div>
                </div>
              </div>

              <!-- Room Types and Fees -->
              <div class="card mb-4">
                <div class="card-header">
                  <h3 class="card-title">Room Options & Amenities</h3>
                </div>
                <div class="card-body">
                  <div class="room-types-table-wrap">
                    <table class="data-table">
                      <thead>
                        <tr>
                          <th>Room Type</th>
                          <th>Allotted Units</th>
                          <th>Annual Hostel Fee</th>
                          <th>In-Room Amenities</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${hostel.roomTypes.map(rt => `
                          <tr>
                            <td><strong>${rt.type}</strong></td>
                            <td>${rt.count} Rooms</td>
                            <td><span class="badge badge-green">${rt.fee}</span></td>
                            <td>${rt.features}</td>
                          </tr>
                        `).join("")}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <!-- Blocks & Floor Layout -->
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Blocks & Infrastructure</h3>
                </div>
                <div class="card-body">
                  <div class="blocks-tag-wrap">
                    ${hostel.blocks.map(b => `
                      <div class="block-card">
                        <h4>${b}</h4>
                        <p>${hostel.floors} Floors • Lift & Staircase Access • RO Water Coolers on each floor</p>
                      </div>
                    `).join("")}
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Staff In-Charge and Direct Contacts -->
            <div class="details-sidebar">
              <div class="card mb-4">
                <div class="card-header">
                  <h3 class="card-title">Administration In-Charge</h3>
                </div>
                <div class="card-body">
                  <div class="staff-contact-card">
                    <div class="staff-avatar">👨‍🏫</div>
                    <div class="staff-meta">
                      <strong>${hostel.warden}</strong>
                      <span class="staff-role">Hostel Warden</span>
                      <p>📞 ${hostel.wardenPhone}</p>
                      <p>✉️ ${hostel.email}</p>
                    </div>
                  </div>

                  <hr class="my-3">

                  <div class="staff-contact-card">
                    <div class="staff-avatar">👨‍💼</div>
                    <div class="staff-meta">
                      <strong>${hostel.caretaker}</strong>
                      <span class="staff-role">Resident Caretaker</span>
                      <p>📞 ${hostel.caretakerPhone}</p>
                      <p>Office: Ground Floor, Block A</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Hostel Hours & Gate Curfew</h3>
                </div>
                <div class="card-body">
                  <ul class="rules-mini-list">
                    <li><strong>Gate Closure:</strong> 07:00 PM (Daily)</li>
                    <li><strong>Study Hours:</strong> 08:30 PM - 10:30 PM</li>
                    <li><strong>Mess Timings:</strong> 7:00 AM - 9:00 PM</li>
                    <li><strong>Visitors Timing:</strong> 04:30 PM - 06:30 PM</li>
                  </ul>
                  <button class="btn btn-outline-primary btn-block btn-sm mt-3" onclick="App.showInfoModal('rules')">View Full Code of Conduct</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // Render Student Dashboard
  renderStudentDashboard(activeTab = "overview") {
    const user = Storage.getCurrentUser();
    if (!user || user.role !== "student") return `<div class="container py-5 text-center"><h3>Please log in as a student.</h3></div>`;

    const mess = Storage.getMessData();
    const leaves = Storage.getLeaves().filter(l => l.rollNo === user.rollNo || l.studentName === user.name);
    const rooms = Storage.getRooms();
    const announcements = Storage.getAnnouncements();
    const complaints = Storage.getComplaints().filter(c => c.rollNo === user.rollNo || c.studentName === user.name);

    return `
      <div class="dashboard-wrapper">
        <!-- Top Student Header Banner -->
        <div class="dashboard-top-banner">
          <div class="container">
            <div class="dash-user-row">
              <div class="dash-user-avatar">
                <span>${user.name.charAt(0)}</span>
              </div>
              <div class="dash-user-info">
                <div class="dash-user-badge">Student Portal</div>
                <h1 class="dash-user-name">${user.name}</h1>
                <p class="dash-user-meta">
                  <span><strong>Roll No:</strong> ${user.rollNo}</span>
                  <span>•</span>
                  <span><strong>Dept:</strong> ${user.department}</span>
                  <span>•</span>
                  <span><strong>Hostel:</strong> ${user.hostel}</span>
                  <span>•</span>
                  <span><strong>Room:</strong> ${user.roomNumber}</span>
                </p>
              </div>
              <div class="dash-user-actions">
                <button class="btn btn-outline-white btn-sm" onclick="App.openApplyLeaveModal()">+ Apply Leave / Outing</button>
                <button class="btn btn-outline-white btn-sm" onclick="App.openComplaintModal()">+ Lodge Complaint</button>
                <button class="btn btn-light btn-sm text-navy" onclick="Auth.logout(); App.renderApp();">Logout</button>
              </div>
            </div>

            <!-- Navigation Tabs -->
            <div class="dashboard-tabs">
              <button class="dash-tab ${activeTab === 'overview' ? 'active' : ''}" onclick="App.setStudentTab('overview')">
                <span class="tab-icon">👤</span> Profile & Overview
              </button>
              <button class="dash-tab ${activeTab === 'mess' ? 'active' : ''}" onclick="App.setStudentTab('mess')">
                <span class="tab-icon">🍽️</span> Mess Portal
              </button>
              <button class="dash-tab ${activeTab === 'leave' ? 'active' : ''}" onclick="App.setStudentTab('leave')">
                <span class="tab-icon">📅</span> Leave & Outing
                ${leaves.filter(l => l.status === 'Pending').length ? `<span class="badge-count">${leaves.filter(l => l.status === 'Pending').length}</span>` : ''}
              </button>
              <button class="dash-tab ${activeTab === 'rooms' ? 'active' : ''}" onclick="App.setStudentTab('rooms')">
                <span class="tab-icon">🛏️</span> Room Availability
              </button>
              <button class="dash-tab ${activeTab === 'announcements' ? 'active' : ''}" onclick="App.setStudentTab('announcements')">
                <span class="tab-icon">📢</span> Announcements
              </button>
              <button class="dash-tab ${activeTab === 'complaints' ? 'active' : ''}" onclick="App.setStudentTab('complaints')">
                <span class="tab-icon">🔧</span> Maintenance & Complaints
              </button>
            </div>
          </div>
        </div>

        <!-- Dashboard Content Body -->
        <div class="dashboard-body container">
          ${activeTab === 'overview' ? Views.renderStudentOverview(user, leaves, complaints, mess) : ''}
          ${activeTab === 'mess' ? Views.renderMessPortal(mess, user) : ''}
          ${activeTab === 'leave' ? Views.renderStudentLeave(leaves) : ''}
          ${activeTab === 'rooms' ? Views.renderRoomAvailability(rooms, user.hostel) : ''}
          ${activeTab === 'announcements' ? Views.renderAnnouncementsView(announcements) : ''}
          ${activeTab === 'complaints' ? Views.renderStudentComplaints(complaints) : ''}
        </div>
      </div>
    `;
  },

  // Student Tab 1: Profile & Overview
  renderStudentOverview(user, leaves, complaints, mess) {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todayMenu = mess.weeklyMenu[today] || mess.weeklyMenu.monday;

    return `
      <div class="overview-grid">
        <!-- Profile Card -->
        <div class="card profile-card">
          <div class="card-header">
            <h3 class="card-title">Student Profile</h3>
          </div>
          <div class="card-body">
            <div class="profile-info-grid">
              <div class="info-group">
                <label>Full Name</label>
                <div class="info-val">${user.name}</div>
              </div>
              <div class="info-group">
                <label>Roll Number</label>
                <div class="info-val">${user.rollNo}</div>
              </div>
              <div class="info-group">
                <label>Department</label>
                <div class="info-val">${user.department}</div>
              </div>
              <div class="info-group">
                <label>Allocated Hostel</label>
                <div class="info-val text-green font-weight-bold">${user.hostel}</div>
              </div>
              <div class="info-group">
                <label>Room Number</label>
                <div class="info-val text-navy font-weight-bold">${user.roomNumber}</div>
              </div>
              <div class="info-group">
                <label>Official Email</label>
                <div class="info-val">${user.email}</div>
              </div>
              <div class="info-group">
                <label>Phone Number</label>
                <div class="info-val">${user.phone}</div>
              </div>
              <div class="info-group">
                <label>Academic Status</label>
                <div class="info-val"><span class="badge badge-green">Enrolled Hosteller</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Summary Stats -->
        <div class="overview-side-col">
          <div class="stats-cards-row">
            <div class="stat-card">
              <span class="stat-title">Leave / Outings</span>
              <span class="stat-value">${leaves.length}</span>
              <span class="stat-sub">${leaves.filter(l => l.status === 'Approved').length} Approved</span>
            </div>
            <div class="stat-card">
              <span class="stat-title">Complaints</span>
              <span class="stat-value">${complaints.length}</span>
              <span class="stat-sub">${complaints.filter(c => c.status === 'Completed').length} Resolved</span>
            </div>
          </div>

          <!-- Today's Mess Highlight -->
          <div class="card mt-3">
            <div class="card-header d-flex justify-between align-center">
              <h3 class="card-title">Today's Mess Menu</h3>
              <span class="badge badge-primary">${today.charAt(0).toUpperCase() + today.slice(1)}</span>
            </div>
            <div class="card-body">
              <div class="mini-menu-item">
                <strong>Breakfast (07:00 AM - 08:30 AM):</strong>
                <p>${todayMenu.breakfast}</p>
              </div>
              <div class="mini-menu-item">
                <strong>Lunch (12:15 PM - 01:45 PM):</strong>
                <p>${todayMenu.lunch}</p>
              </div>
              <div class="mini-menu-item">
                <strong>Dinner (07:30 PM - 09:00 PM):</strong>
                <p>${todayMenu.dinner}</p>
              </div>
              <button class="btn btn-outline-primary btn-sm btn-block mt-2" onclick="App.setStudentTab('mess')">View Full Weekly Menu & Feedback</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // Student Tab 2 / Global View: Mess Portal
  renderMessPortal(mess, user = null) {
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const selectedDay = App.activeMessDay || (days.includes(today) ? today : "monday");
    const dayMenu = mess.weeklyMenu[selectedDay];

    return `
      <div class="mess-portal-view">
        <!-- Mess Header & Timings -->
        <div class="card mb-4">
          <div class="card-header">
            <div class="d-flex justify-between align-center flex-wrap gap-2">
              <div>
                <h3 class="card-title">Hygienic Mess Dining Timings & Guidelines</h3>
                <p class="text-muted text-sm">Balanced dietary nutrition prepared under rigorous hygiene supervision.</p>
              </div>
              <span class="badge badge-green">Pure Veg & Scheduled Special Feasts</span>
            </div>
          </div>
          <div class="card-body">
            <div class="timings-grid">
              <div class="timing-box">
                <span class="timing-meal">☕ Breakfast</span>
                <span class="timing-clock">${mess.timings.breakfast}</span>
              </div>
              <div class="timing-box">
                <span class="timing-meal">🍛 Lunch</span>
                <span class="timing-clock">${mess.timings.lunch}</span>
              </div>
              <div class="timing-box">
                <span class="timing-meal">🫖 Snacks & Tea</span>
                <span class="timing-clock">${mess.timings.snacks}</span>
              </div>
              <div class="timing-box">
                <span class="timing-meal">🍲 Dinner</span>
                <span class="timing-clock">${mess.timings.dinner}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Weekly Menu Selector -->
        <div class="card mb-4">
          <div class="card-header">
            <div class="d-flex justify-between align-center flex-wrap gap-2">
              <h3 class="card-title">Weekly Mess Menu</h3>
              <!-- Day Pill Tabs -->
              <div class="day-tabs">
                ${days.map(d => `
                  <button class="day-tab-btn ${d === selectedDay ? 'active' : ''}" onclick="App.setMessDay('${d}')">
                    ${d.charAt(0).toUpperCase() + d.slice(1, 3)}
                  </button>
                `).join("")}
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="meal-schedule-grid">
              <div class="meal-card">
                <div class="meal-badge breakfast-badge">Morning Breakfast</div>
                <div class="meal-desc">${dayMenu.breakfast}</div>
              </div>
              <div class="meal-card">
                <div class="meal-badge lunch-badge">Afternoon Lunch</div>
                <div class="meal-desc">${dayMenu.lunch}</div>
              </div>
              <div class="meal-card">
                <div class="meal-badge snacks-badge">Evening Snacks & Beverage</div>
                <div class="meal-desc">${dayMenu.snacks}</div>
              </div>
              <div class="meal-card">
                <div class="meal-badge dinner-badge">Night Dinner</div>
                <div class="meal-desc">${dayMenu.dinner}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mess Announcements & Student Feedback Row -->
        <div class="two-col-grid">
          <!-- Mess Announcements -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Mess Announcements</h3>
            </div>
            <div class="card-body">
              <div class="mess-ann-list">
                ${mess.announcements.map(ann => `
                  <div class="mess-ann-item">
                    <div class="d-flex justify-between">
                      <strong>${ann.title}</strong>
                      <span class="text-sm text-muted">${ann.date}</span>
                    </div>
                    <p class="text-sm text-muted mt-1">${ann.details}</p>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>

          <!-- Student Feedback Form -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Student Mess Feedback Form</h3>
            </div>
            <div class="card-body">
              <form id="mess-feedback-form" onsubmit="App.submitMessFeedback(event)">
                <div class="form-group">
                  <label>Select Meal</label>
                  <select class="form-control" name="meal" required>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch" selected>Lunch</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Dinner">Dinner</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Feedback Category</label>
                  <select class="form-control" name="category" required>
                    <option value="Food Quality">Food Quality & Taste</option>
                    <option value="Hygiene & Cleanliness">Hygiene & Cleanliness</option>
                    <option value="Quantity / Portion">Quantity & Portion</option>
                    <option value="Serving Timeliness">Serving Timeliness</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Overall Rating</label>
                  <div class="rating-stars-input">
                    <label><input type="radio" name="rating" value="5" checked> ⭐⭐⭐⭐⭐ (5/5)</label>
                    <label><input type="radio" name="rating" value="4"> ⭐⭐⭐⭐ (4/5)</label>
                    <label><input type="radio" name="rating" value="3"> ⭐⭐⭐ (3/5)</label>
                    <label><input type="radio" name="rating" value="2"> ⭐⭐ (2/5)</label>
                    <label><input type="radio" name="rating" value="1"> ⭐ (1/5)</label>
                  </div>
                </div>

                <div class="form-group">
                  <label>Suggestions / Observations</label>
                  <textarea class="form-control" name="comment" rows="3" placeholder="Share specific thoughts regarding the food or service..." required></textarea>
                </div>

                <button type="submit" class="btn btn-primary btn-block">Submit Feedback</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // Student Tab 3: Leave & Outing
  renderStudentLeave(leaves) {
    return `
      <div class="leave-outing-view">
        <div class="d-flex justify-between align-center mb-4 flex-wrap gap-2">
          <div>
            <h2 class="section-title mb-1">Leave & Outing Portal</h2>
            <p class="text-muted text-sm">Apply for official gate pass for home visits or town outings.</p>
          </div>
          <button class="btn btn-primary" onclick="App.openApplyLeaveModal()">+ Apply New Leave / Outing</button>
        </div>

        <!-- Request History Table -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Leave & Outing History</h3>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Type</th>
                    <th>Dates / Duration</th>
                    <th>Destination & Reason</th>
                    <th>Parent Contact</th>
                    <th>Applied On</th>
                    <th>Status</th>
                    <th>Warden Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  ${leaves.length === 0 ? `
                    <tr><td colspan="8" class="text-center py-4 text-muted">No leave or outing requests found. Click "+ Apply" to submit one.</td></tr>
                  ` : leaves.map(l => `
                    <tr>
                      <td><strong>${l.id}</strong></td>
                      <td><span class="badge ${l.type.includes('Home') ? 'badge-primary' : 'badge-secondary'}">${l.type}</span></td>
                      <td>
                        <div><strong>From:</strong> ${l.startDate}</div>
                        <div><strong>To:</strong> ${l.endDate}</div>
                      </td>
                      <td>
                        <div><strong>${l.destination || 'N/A'}</strong></div>
                        <div class="text-sm text-muted">${l.reason}</div>
                      </td>
                      <td>${l.parentPhone || 'N/A'}</td>
                      <td>${l.appliedOn}</td>
                      <td>
                        <span class="status-pill status-${l.status.toLowerCase()}">${l.status}</span>
                      </td>
                      <td class="text-sm">${l.wardenRemarks || '<span class="text-muted">Awaiting Review</span>'}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // Student Tab 4 / Global View: Room Availability
  renderRoomAvailability(rooms, filterHostel = "All") {
    const selectedHostel = App.activeRoomFilter || filterHostel;
    const filteredRooms = selectedHostel === "All" ? rooms : rooms.filter(r => r.hostel === selectedHostel);

    const hostels = Storage.getHostels();

    return `
      <div class="room-availability-view">
        <!-- Room Filter Header -->
        <div class="card mb-4">
          <div class="card-header">
            <div class="d-flex justify-between align-center flex-wrap gap-2">
              <div>
                <h3 class="card-title">Room Availability & Bed Allocation</h3>
                <p class="text-muted text-sm">Real-time room occupancy status across blocks.</p>
              </div>
              <div class="filter-controls d-flex align-center gap-2">
                <label class="text-sm font-weight-bold">Hostel:</label>
                <select class="form-control form-control-sm" onchange="App.setRoomFilter(this.value)">
                  <option value="All" ${selectedHostel === 'All' ? 'selected' : ''}>All Hostels</option>
                  ${hostels.map(h => `
                    <option value="${h.name}" ${selectedHostel === h.name ? 'selected' : ''}>${h.name}</option>
                  `).join("")}
                </select>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="room-stats-summary">
              <div class="room-stat-box">
                <span class="val">${filteredRooms.length}</span>
                <span class="lbl">Listed Rooms</span>
              </div>
              <div class="room-stat-box text-green">
                <span class="val">${filteredRooms.reduce((acc, r) => acc + r.available, 0)}</span>
                <span class="lbl">Vacant Beds</span>
              </div>
              <div class="room-stat-box text-navy">
                <span class="val">${filteredRooms.reduce((acc, r) => acc + r.occupied, 0)}</span>
                <span class="lbl">Occupied Beds</span>
              </div>
              <div class="room-stat-box">
                <span class="val">${filteredRooms.filter(r => r.status === 'Full').length}</span>
                <span class="lbl">Full Rooms</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Room Inventory Grid -->
        <div class="room-cards-grid">
          ${filteredRooms.map(r => `
            <div class="room-box status-${r.status.toLowerCase().replace(/\s+/g, '-')}">
              <div class="room-box-header">
                <div>
                  <h4 class="room-num">${r.roomNumber}</h4>
                  <span class="room-hostel-lbl">${r.hostel} • ${r.block}</span>
                </div>
                <span class="room-status-badge ${r.status === 'Available' ? 'badge-green' : (r.status === 'Full' ? 'badge-danger' : 'badge-warning')}">
                  ${r.status}
                </span>
              </div>
              <div class="room-box-body">
                <div class="bed-visual-row">
                  ${Array.from({ length: r.capacity }).map((_, i) => `
                    <div class="bed-indicator ${i < r.occupied ? 'occupied' : 'vacant'}" title="${i < r.occupied ? 'Occupied Bed' : 'Available Bed'}">
                      🛏️
                    </div>
                  `).join("")}
                </div>
                <div class="room-counts-row">
                  <span><strong>Capacity:</strong> ${r.capacity} Beds</span>
                  <span><strong>Occupied:</strong> ${r.occupied}</span>
                  <span class="text-green"><strong>Available:</strong> ${r.available}</span>
                </div>
                ${r.residents && r.residents.length > 0 ? `
                  <div class="residents-mini-list">
                    <strong>Residents:</strong>
                    <p>${r.residents.join(", ")}</p>
                  </div>
                ` : '<div class="residents-mini-list text-muted"><em>No occupants allocated currently.</em></div>'}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  },

  // Student Tab 5 / Global View: Announcements
  renderAnnouncementsView(announcements) {
    const selectedCategory = App.activeAnnFilter || "All";
    const filteredAnn = selectedCategory === "All" ? announcements : announcements.filter(a => a.category === selectedCategory);

    const categories = ["All", "General", "Mess Update", "Maintenance", "Leave Notice", "Emergency"];

    return `
      <div class="announcements-view">
        <div class="d-flex justify-between align-center mb-4 flex-wrap gap-2">
          <div>
            <h2 class="section-title mb-1">Hostel Notices & Announcements</h2>
            <p class="text-muted text-sm">Official circulars, mess updates, and maintenance advisories.</p>
          </div>
          <div class="d-flex gap-2 flex-wrap">
            ${categories.map(c => `
              <button class="btn btn-sm ${selectedCategory === c ? 'btn-primary' : 'btn-outline-secondary'}" onclick="App.setAnnFilter('${c}')">
                ${c}
              </button>
            `).join("")}
          </div>
        </div>

        <div class="announcements-cards-list">
          ${filteredAnn.map(ann => `
            <div class="announcement-item-card ${ann.priority === 'Urgent' ? 'urgent-border' : ''}">
              <div class="ann-item-header">
                <div class="d-flex align-center gap-2">
                  <span class="badge ${ann.priority === 'Urgent' ? 'badge-danger' : 'badge-primary'}">${ann.category}</span>
                  <span class="ann-hostel-tag">${ann.hostel}</span>
                </div>
                <span class="ann-date">${ann.date}</span>
              </div>
              <h3 class="ann-item-title">${ann.title}</h3>
              <p class="ann-item-content">${ann.content}</p>
              <div class="ann-item-footer">
                <span class="ann-author">Issued by: <strong>${ann.author}</strong></span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  },

  // Student Tab 6: Maintenance & Complaints
  renderStudentComplaints(complaints) {
    return `
      <div class="complaints-view">
        <div class="d-flex justify-between align-center mb-4 flex-wrap gap-2">
          <div>
            <h2 class="section-title mb-1">Maintenance Requests & Complaints</h2>
            <p class="text-muted text-sm">Report plumbing, electrical, carpentry, or network issues in your room.</p>
          </div>
          <button class="btn btn-primary" onclick="App.openComplaintModal()">+ Lodge New Complaint</button>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Complaint Status Tracker</h3>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Complaint ID</th>
                    <th>Category</th>
                    <th>Issue Title & Details</th>
                    <th>Priority</th>
                    <th>Filed On</th>
                    <th>Status</th>
                    <th>Assigned Caretaker / Notes</th>
                  </tr>
                </thead>
                <tbody>
                  ${complaints.length === 0 ? `
                    <tr><td colspan="7" class="text-center py-4 text-muted">No maintenance complaints registered.</td></tr>
                  ` : complaints.map(c => `
                    <tr>
                      <td><strong>${c.id}</strong></td>
                      <td><span class="badge badge-secondary">${c.category}</span></td>
                      <td>
                        <strong>${c.title}</strong>
                        <p class="text-sm text-muted">${c.description}</p>
                      </td>
                      <td><span class="badge ${c.priority === 'High' ? 'badge-danger' : (c.priority === 'Medium' ? 'badge-warning' : 'badge-light')}">${c.priority}</span></td>
                      <td>${c.filedOn}</td>
                      <td>
                        <span class="status-pill status-${c.status.toLowerCase().replace(/\s+/g, '-')}">${c.status}</span>
                      </td>
                      <td class="text-sm">
                        <div><strong>${c.assignedTo}</strong></div>
                        ${c.technician ? `<div class="text-muted">Technician: ${c.technician}</div>` : ''}
                        <div class="text-xs text-muted">${c.notes}</div>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // Render Caretaker Dashboard
  renderCaretakerDashboard(activeTab = "complaints") {
    const user = Storage.getCurrentUser();
    if (!user || user.role !== "caretaker") return `<div class="container py-5 text-center"><h3>Please log in as a Caretaker.</h3></div>`;

    const complaints = Storage.getComplaints();
    const rooms = Storage.getRooms().filter(r => user.hostel === "All Hostels" || r.hostel === user.hostel);

    const pendingCount = complaints.filter(c => c.status === "Pending").length;
    const inProgressCount = complaints.filter(c => c.status === "In Progress").length;
    const completedCount = complaints.filter(c => c.status === "Completed").length;

    return `
      <div class="dashboard-wrapper">
        <div class="dashboard-top-banner staff-banner">
          <div class="container">
            <div class="dash-user-row">
              <div class="dash-user-avatar caretaker-avatar">
                <span>🛠️</span>
              </div>
              <div class="dash-user-info">
                <div class="dash-user-badge">Caretaker Portal</div>
                <h1 class="dash-user-name">${user.name}</h1>
                <p class="dash-user-meta">
                  <span><strong>Hostel:</strong> ${user.hostel}</span>
                  <span>•</span>
                  <span><strong>Dept:</strong> ${user.department}</span>
                  <span>•</span>
                  <span><strong>Phone:</strong> ${user.phone}</span>
                </p>
              </div>
              <div class="dash-user-actions">
                <button class="btn btn-light btn-sm text-navy" onclick="Auth.logout(); App.renderApp();">Logout</button>
              </div>
            </div>

            <!-- Tabs -->
            <div class="dashboard-tabs">
              <button class="dash-tab ${activeTab === 'complaints' ? 'active' : ''}" onclick="App.setCaretakerTab('complaints')">
                <span class="tab-icon">🔧</span> Maintenance Requests (${complaints.length})
              </button>
              <button class="dash-tab ${activeTab === 'rooms' ? 'active' : ''}" onclick="App.setCaretakerTab('rooms')">
                <span class="tab-icon">🏢</span> Room Maintenance Checklist
              </button>
              <button class="dash-tab ${activeTab === 'profile' ? 'active' : ''}" onclick="App.setCaretakerTab('profile')">
                <span class="tab-icon">👤</span> Caretaker Profile
              </button>
            </div>
          </div>
        </div>

        <div class="dashboard-body container">
          <!-- Metrics Cards -->
          <div class="stats-row mb-4">
            <div class="stat-card">
              <span class="stat-title">Pending Tasks</span>
              <span class="stat-value text-danger">${pendingCount}</span>
              <span class="stat-sub">Needs assignment</span>
            </div>
            <div class="stat-card">
              <span class="stat-title">In Progress</span>
              <span class="stat-value text-warning">${inProgressCount}</span>
              <span class="stat-sub">Technician working</span>
            </div>
            <div class="stat-card">
              <span class="stat-title">Completed Tasks</span>
              <span class="stat-value text-green">${completedCount}</span>
              <span class="stat-sub">Resolved issues</span>
            </div>
            <div class="stat-card">
              <span class="stat-title">Total Rooms</span>
              <span class="stat-value text-navy">${rooms.length}</span>
              <span class="stat-sub">Under supervision</span>
            </div>
          </div>

          ${activeTab === 'complaints' ? Views.renderCaretakerComplaints(complaints) : ''}
          ${activeTab === 'rooms' ? Views.renderCaretakerRooms(rooms) : ''}
          ${activeTab === 'profile' ? Views.renderStaffProfile(user) : ''}
        </div>
      </div>
    `;
  },

  renderCaretakerComplaints(complaints) {
    return `
      <div class="card">
        <div class="card-header d-flex justify-between align-center flex-wrap gap-2">
          <div>
            <h3 class="card-title">Student Maintenance Grievances</h3>
            <p class="text-muted text-sm">Update repair progress and assign technicians.</p>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student & Room</th>
                  <th>Hostel</th>
                  <th>Category</th>
                  <th>Issue Details</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${complaints.map(c => `
                  <tr>
                    <td><strong>${c.id}</strong></td>
                    <td>
                      <strong>${c.studentName}</strong>
                      <div class="text-xs text-muted">${c.rollNo} • Room ${c.roomNumber}</div>
                    </td>
                    <td>${c.hostel}</td>
                    <td><span class="badge badge-secondary">${c.category}</span></td>
                    <td>
                      <strong>${c.title}</strong>
                      <p class="text-sm text-muted">${c.description}</p>
                      <div class="text-xs text-muted">Filed: ${c.filedOn}</div>
                    </td>
                    <td>
                      <span class="badge ${c.priority === 'High' ? 'badge-danger' : (c.priority === 'Medium' ? 'badge-warning' : 'badge-light')}">
                        ${c.priority}
                      </span>
                    </td>
                    <td>
                      <span class="status-pill status-${c.status.toLowerCase().replace(/\s+/g, '-')}">${c.status}</span>
                    </td>
                    <td>
                      <button class="btn btn-outline-primary btn-xs" onclick="App.openCaretakerUpdateModal('${c.id}')">
                        Update Status
                      </button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  renderCaretakerRooms(rooms) {
    return `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Hostel Block & Room Inspection Checklist</h3>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Room No</th>
                  <th>Block</th>
                  <th>Capacity</th>
                  <th>Occupied</th>
                  <th>Electrical Check</th>
                  <th>Plumbing Check</th>
                  <th>Cleanliness</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${rooms.map(r => `
                  <tr>
                    <td><strong>${r.roomNumber}</strong></td>
                    <td>${r.block}</td>
                    <td>${r.capacity} Beds</td>
                    <td>${r.occupied} Beds</td>
                    <td><span class="badge badge-green">✔ Normal</span></td>
                    <td><span class="badge badge-green">✔ Normal</span></td>
                    <td><span class="badge badge-green">Clean</span></td>
                    <td>
                      <button class="btn btn-outline-secondary btn-xs" onclick="alert('Inspection log saved for Room ${r.roomNumber}')">Log Inspection</button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  // Render Warden Dashboard
  renderWardenDashboard(activeTab = "overview") {
    const user = Storage.getCurrentUser();
    if (!user || user.role !== "warden") return `<div class="container py-5 text-center"><h3>Please log in as Warden.</h3></div>`;

    const hostels = Storage.getHostels();
    const leaves = Storage.getLeaves();
    const complaints = Storage.getComplaints();
    const rooms = Storage.getRooms();
    const mess = Storage.getMessData();

    const pendingLeaves = leaves.filter(l => l.status === "Pending");
    const totalStudents = hostels.reduce((acc, h) => acc + h.occupied, 0);
    const totalCapacity = hostels.reduce((acc, h) => acc + h.totalCapacity, 0);
    const totalAvailable = hostels.reduce((acc, h) => acc + h.availableBeds, 0);
    const occupancyRate = ((totalStudents / totalCapacity) * 100).toFixed(1);

    return `
      <div class="dashboard-wrapper">
        <div class="dashboard-top-banner warden-banner">
          <div class="container">
            <div class="dash-user-row">
              <div class="dash-user-avatar warden-avatar">
                <span>🎓</span>
              </div>
              <div class="dash-user-info">
                <div class="dash-user-badge">Warden Portal</div>
                <h1 class="dash-user-name">${user.name}</h1>
                <p class="dash-user-meta">
                  <span><strong>Designation:</strong> Chief Warden</span>
                  <span>•</span>
                  <span><strong>Department:</strong> ${user.department}</span>
                  <span>•</span>
                  <span><strong>Phone:</strong> ${user.phone}</span>
                </p>
              </div>
              <div class="dash-user-actions">
                <button class="btn btn-outline-white btn-sm" onclick="App.openNewAnnModal()">+ Post Announcement</button>
                <button class="btn btn-light btn-sm text-navy" onclick="Auth.logout(); App.renderApp();">Logout</button>
              </div>
            </div>

            <!-- Tabs -->
            <div class="dashboard-tabs">
              <button class="dash-tab ${activeTab === 'overview' ? 'active' : ''}" onclick="App.setWardenTab('overview')">
                <span class="tab-icon">📊</span> Overview & Stats
              </button>
              <button class="dash-tab ${activeTab === 'leaves' ? 'active' : ''}" onclick="App.setWardenTab('leaves')">
                <span class="tab-icon">📅</span> Leave & Outing Approvals
                ${pendingLeaves.length ? `<span class="badge-count">${pendingLeaves.length}</span>` : ''}
              </button>
              <button class="dash-tab ${activeTab === 'complaints' ? 'active' : ''}" onclick="App.setWardenTab('complaints')">
                <span class="tab-icon">⚖️</span> Student Complaints
              </button>
              <button class="dash-tab ${activeTab === 'occupancy' ? 'active' : ''}" onclick="App.setWardenTab('occupancy')">
                <span class="tab-icon">🛏️</span> Room Occupancy
              </button>
              <button class="dash-tab ${activeTab === 'mess' ? 'active' : ''}" onclick="App.setWardenTab('mess')">
                <span class="tab-icon">🍽️</span> Mess Feedback Review
              </button>
              <button class="dash-tab ${activeTab === 'profile' ? 'active' : ''}" onclick="App.setWardenTab('profile')">
                <span class="tab-icon">👤</span> Profile
              </button>
            </div>
          </div>
        </div>

        <div class="dashboard-body container">
          <!-- Overview Key Metrics required by User -->
          <div class="stats-row mb-4">
            <div class="stat-card">
              <span class="stat-title">Total Students</span>
              <span class="stat-value text-navy">${totalStudents}</span>
              <span class="stat-sub">Resident Hostellers</span>
            </div>
            <div class="stat-card">
              <span class="stat-title">Room Occupancy</span>
              <span class="stat-value text-green">${occupancyRate}%</span>
              <span class="stat-sub">${totalStudents} / ${totalCapacity} Beds</span>
            </div>
            <div class="stat-card">
              <span class="stat-title">Available Rooms/Beds</span>
              <span class="stat-value text-primary">${totalAvailable}</span>
              <span class="stat-sub">Vacant Slots</span>
            </div>
            <div class="stat-card" style="cursor: pointer; border-left: 4px solid var(--color-status-danger);" onclick="App.setWardenTab('leaves')" title="Click to view and manage leave requests">
              <span class="stat-title">Pending Leave Requests</span>
              <span class="stat-value text-danger">${pendingLeaves.length}</span>
              <span class="stat-sub">Awaiting Decision &rarr; (Click to open)</span>
            </div>
            <div class="stat-card">
              <span class="stat-title">Pending Complaints</span>
              <span class="stat-value text-warning">${complaints.filter(c => c.status !== 'Completed').length}</span>
              <span class="stat-sub">Active grievances</span>
            </div>
          </div>

          ${activeTab === 'overview' ? Views.renderWardenOverview(hostels, pendingLeaves, complaints) : ''}
          ${activeTab === 'leaves' ? Views.renderWardenLeaves(leaves) : ''}
          ${activeTab === 'complaints' ? Views.renderWardenComplaints(complaints) : ''}
          ${activeTab === 'occupancy' ? Views.renderWardenOccupancy(hostels, rooms) : ''}
          ${activeTab === 'mess' ? Views.renderWardenMessFeedback(mess) : ''}
          ${activeTab === 'profile' ? Views.renderStaffProfile(user) : ''}
        </div>
      </div>
    `;
  },

  renderWardenOverview(hostels, pendingLeaves, complaints) {
    return `
      <div class="two-col-grid">
        <!-- Hostel Occupancy Overview -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Hostel Occupancy Distribution</h3>
          </div>
          <div class="card-body">
            <div class="hostel-stats-bars">
              ${hostels.map(h => {
                const pct = ((h.occupied / h.totalCapacity) * 100).toFixed(1);
                return `
                  <div class="bar-stat-item">
                    <div class="d-flex justify-between text-sm mb-1">
                      <strong>${h.name}</strong>
                      <span>${h.occupied} / ${h.totalCapacity} beds (${pct}%)</span>
                    </div>
                    <div class="progress-bar-bg">
                      <div class="progress-bar-fill" style="width: ${pct}%;"></div>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        </div>

        <!-- Pending Leave Quick Actions -->
        <div class="card">
          <div class="card-header d-flex justify-between align-center">
            <div>
              <h3 class="card-title">Pending Outing / Leave Requests</h3>
              <p class="text-xs text-muted">Review student applications before departure</p>
            </div>
            <button class="btn btn-outline-primary btn-xs" onclick="App.setWardenTab('leaves')">View All (${pendingLeaves.length})</button>
          </div>
          <div class="card-body p-0">
            ${pendingLeaves.length === 0 ? `
              <div class="p-4 text-center text-muted">
                <span style="font-size: 1.5rem; display: block; margin-bottom: 0.5rem;">🎉</span>
                No pending leave requests right now. All submissions reviewed!
              </div>
            ` : `
              <div class="table-responsive">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Dates</th>
                      <th>Reason</th>
                      <th>Quick Decision</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${pendingLeaves.slice(0, 5).map(l => `
                      <tr>
                        <td>
                          <strong>${l.studentName}</strong>
                          <div class="text-xs text-muted">${l.rollNo} • ${l.hostel}</div>
                        </td>
                        <td class="text-sm">
                          <div><strong>From:</strong> ${l.startDate}</div>
                          <div><strong>To:</strong> ${l.endDate}</div>
                        </td>
                        <td class="text-sm">
                          <strong>${l.destination || 'City'}</strong>
                          <div class="text-xs text-muted">${l.reason}</div>
                        </td>
                        <td>
                          <div class="d-flex gap-1">
                            <button class="btn btn-green btn-xs" onclick="App.quickApproveLeave('${l.id}')" title="1-Click Approve">✔ Approve</button>
                            <button class="btn btn-danger btn-xs" onclick="App.quickRejectLeave('${l.id}')" title="1-Click Reject">✖ Reject</button>
                            <button class="btn btn-outline-secondary btn-xs" onclick="App.openWardenLeaveModal('${l.id}')" title="Custom Remarks">Review</button>
                          </div>
                        </td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  },

  renderWardenLeaves(leaves) {
    const filter = App.wardenLeaveFilter || "All";
    const filteredLeaves = filter === "All" ? leaves : leaves.filter(l => l.status === filter);
    const pendingCount = leaves.filter(l => l.status === "Pending").length;
    const approvedCount = leaves.filter(l => l.status === "Approved").length;
    const rejectedCount = leaves.filter(l => l.status === "Rejected").length;

    return `
      <div class="card">
        <div class="card-header">
          <div class="d-flex justify-between align-center flex-wrap gap-2">
            <div>
              <h3 class="card-title">All Student Leave & Outing Applications</h3>
              <p class="text-muted text-sm">Review, approve, or reject hosteller gate passes.</p>
            </div>
            <!-- Filter Pills -->
            <div class="d-flex gap-1 flex-wrap">
              <button class="btn btn-xs ${filter === 'All' ? 'btn-navy' : 'btn-outline-secondary'}" onclick="App.setWardenLeaveFilter('All')">
                All Requests (${leaves.length})
              </button>
              <button class="btn btn-xs ${filter === 'Pending' ? 'btn-danger' : 'btn-outline-secondary'}" onclick="App.setWardenLeaveFilter('Pending')">
                Pending (${pendingCount})
              </button>
              <button class="btn btn-xs ${filter === 'Approved' ? 'btn-green' : 'btn-outline-secondary'}" onclick="App.setWardenLeaveFilter('Approved')">
                Approved (${approvedCount})
              </button>
              <button class="btn btn-xs ${filter === 'Rejected' ? 'btn-danger' : 'btn-outline-secondary'}" onclick="App.setWardenLeaveFilter('Rejected')">
                Rejected (${rejectedCount})
              </button>
            </div>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Student Name & Roll No</th>
                  <th>Hostel & Room</th>
                  <th>Type</th>
                  <th>Dates / Duration</th>
                  <th>Destination & Reason</th>
                  <th>Parent Contact</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${filteredLeaves.length === 0 ? `
                  <tr><td colspan="9" class="text-center py-4 text-muted">No ${filter === 'All' ? '' : filter} leave requests found.</td></tr>
                ` : filteredLeaves.map(l => `
                  <tr>
                    <td><strong>${l.id}</strong></td>
                    <td>
                      <strong>${l.studentName}</strong>
                      <div class="text-xs text-muted">${l.rollNo}</div>
                    </td>
                    <td>${l.hostel} • ${l.roomNumber}</td>
                    <td><span class="badge ${l.type.includes('Home') ? 'badge-primary' : 'badge-secondary'}">${l.type}</span></td>
                    <td class="text-sm">
                      <div>${l.startDate}</div>
                      <div>to ${l.endDate}</div>
                    </td>
                    <td class="text-sm">
                      <strong>${l.destination || 'N/A'}</strong>
                      <div class="text-muted">${l.reason}</div>
                    </td>
                    <td>${l.parentPhone || 'N/A'}</td>
                    <td>
                      <span class="status-pill status-${l.status.toLowerCase()}">${l.status}</span>
                    </td>
                    <td>
                      ${l.status === 'Pending' ? `
                        <div class="d-flex gap-1">
                          <button class="btn btn-green btn-xs" onclick="App.quickApproveLeave('${l.id}')" title="1-Click Approve">✔ Approve</button>
                          <button class="btn btn-danger btn-xs" onclick="App.quickRejectLeave('${l.id}')" title="1-Click Reject">✖ Reject</button>
                          <button class="btn btn-outline-secondary btn-xs" onclick="App.openWardenLeaveModal('${l.id}')" title="Custom Remarks">Review</button>
                        </div>
                      ` : `
                        <div class="d-flex align-center gap-1">
                          <button class="btn btn-outline-secondary btn-xs" onclick="App.openWardenLeaveModal('${l.id}')" title="Change Decision">Edit</button>
                        </div>
                      `}
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  renderWardenComplaints(complaints) {
    return `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Hostel Grievances & Maintenance Status</h3>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student</th>
                  <th>Hostel & Room</th>
                  <th>Category</th>
                  <th>Details</th>
                  <th>Status</th>
                  <th>Assigned Caretaker / Technician</th>
                </tr>
              </thead>
              <tbody>
                ${complaints.map(c => `
                  <tr>
                    <td><strong>${c.id}</strong></td>
                    <td>
                      <strong>${c.studentName}</strong>
                      <div class="text-xs text-muted">${c.rollNo}</div>
                    </td>
                    <td>${c.hostel} • ${c.roomNumber}</td>
                    <td><span class="badge badge-secondary">${c.category}</span></td>
                    <td>
                      <strong>${c.title}</strong>
                      <p class="text-sm text-muted">${c.description}</p>
                    </td>
                    <td>
                      <span class="status-pill status-${c.status.toLowerCase().replace(/\s+/g, '-')}">${c.status}</span>
                    </td>
                    <td class="text-sm">${c.assignedTo} ${c.technician ? `(${c.technician})` : ''}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  renderWardenOccupancy(hostels, rooms) {
    return `
      <div class="occupancy-view">
        <div class="card mb-4">
          <div class="card-header">
            <h3 class="card-title">Hostel Capacity Breakdown</h3>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Hostel</th>
                    <th>Total Rooms</th>
                    <th>Total Beds</th>
                    <th>Occupied Beds</th>
                    <th>Vacant Beds</th>
                    <th>Occupancy %</th>
                  </tr>
                </thead>
                <tbody>
                  ${hostels.map(h => {
                    const pct = ((h.occupied / h.totalCapacity) * 100).toFixed(1);
                    return `
                      <tr>
                        <td><strong>${h.name}</strong></td>
                        <td>${h.totalRooms}</td>
                        <td>${h.totalCapacity}</td>
                        <td class="text-navy font-weight-bold">${h.occupied}</td>
                        <td class="text-green font-weight-bold">${h.availableBeds}</td>
                        <td><span class="badge badge-green">${pct}%</span></td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        ${Views.renderRoomAvailability(rooms, "All")}
      </div>
    `;
  },

  renderWardenMessFeedback(mess) {
    return `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Student Mess Feedback Submissions</h3>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Student & Roll</th>
                  <th>Hostel</th>
                  <th>Meal</th>
                  <th>Category</th>
                  <th>Rating</th>
                  <th>Comments</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${(!mess.feedbackList || mess.feedbackList.length === 0) ? `
                  <tr><td colspan="8" class="text-center py-4 text-muted">No student feedback registered yet.</td></tr>
                ` : mess.feedbackList.map(f => `
                  <tr>
                    <td>
                      <strong>${f.studentName}</strong>
                      <div class="text-xs text-muted">${f.rollNo}</div>
                    </td>
                    <td>${f.hostel || 'Hosteller'}</td>
                    <td><strong>${f.meal}</strong></td>
                    <td><span class="badge badge-secondary">${f.category}</span></td>
                    <td>${"⭐".repeat(f.rating)} (${f.rating}/5)</td>
                    <td class="text-sm">${f.comment}</td>
                    <td>${f.date}</td>
                    <td><span class="badge badge-green">${f.status || 'Reviewed'}</span></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  // Render Admin Dashboard
  renderAdminDashboard(activeTab = "reports") {
    const user = Storage.getCurrentUser();
    if (!user || user.role !== "admin") return `<div class="container py-5 text-center"><h3>Please log in as Administrator.</h3></div>`;

    const hostels = Storage.getHostels();
    const users = Storage.getUsers();
    const rooms = Storage.getRooms();
    const complaints = Storage.getComplaints();
    const leaves = Storage.getLeaves();
    const announcements = Storage.getAnnouncements();

    const students = users.filter(u => u.role === "student");
    const staff = users.filter(u => u.role !== "student");

    return `
      <div class="dashboard-wrapper">
        <div class="dashboard-top-banner admin-banner">
          <div class="container">
            <div class="dash-user-row">
              <div class="dash-user-avatar admin-avatar">
                <span>🏛️</span>
              </div>
              <div class="dash-user-info">
                <div class="dash-user-badge">Master Administration</div>
                <h1 class="dash-user-name">${user.name}</h1>
                <p class="dash-user-meta">
                  <span><strong>Designation:</strong> System Administrator</span>
                  <span>•</span>
                  <span><strong>Division:</strong> ${user.department}</span>
                  <span>•</span>
                  <span><strong>Email:</strong> ${user.email}</span>
                </p>
              </div>
              <div class="dash-user-actions">
                <button class="btn btn-outline-white btn-sm" onclick="App.openNewStudentModal()">+ Add Student</button>
                <button class="btn btn-outline-white btn-sm" onclick="App.openNewStaffModal()">+ Add Staff</button>
                <button class="btn btn-outline-white btn-sm" onclick="App.openNewRoomModal()">+ Add Room</button>
                <button class="btn btn-light btn-sm text-navy" onclick="Auth.logout(); App.renderApp();">Logout</button>
              </div>
            </div>

            <!-- Tabs -->
            <div class="dashboard-tabs">
              <button class="dash-tab ${activeTab === 'reports' ? 'active' : ''}" onclick="App.setAdminTab('reports')">
                <span class="tab-icon">📈</span> Reports & Analytics
              </button>
              <button class="dash-tab ${activeTab === 'hostels' ? 'active' : ''}" onclick="App.setAdminTab('hostels')">
                <span class="tab-icon">🏢</span> Hostel Management
              </button>
              <button class="dash-tab ${activeTab === 'students' ? 'active' : ''}" onclick="App.setAdminTab('students')">
                <span class="tab-icon">👨‍🎓</span> Student Management (${students.length})
              </button>
              <button class="dash-tab ${activeTab === 'staff' ? 'active' : ''}" onclick="App.setAdminTab('staff')">
                <span class="tab-icon">👔</span> Staff Management (${staff.length})
              </button>
              <button class="dash-tab ${activeTab === 'rooms' ? 'active' : ''}" onclick="App.setAdminTab('rooms')">
                <span class="tab-icon">🛏️</span> Room Management (${rooms.length})
              </button>
              <button class="dash-tab ${activeTab === 'complaints' ? 'active' : ''}" onclick="App.setAdminTab('complaints')">
                <span class="tab-icon">🔧</span> Complaint Management
              </button>
              <button class="dash-tab ${activeTab === 'announcements' ? 'active' : ''}" onclick="App.setAdminTab('announcements')">
                <span class="tab-icon">📢</span> Announcements
              </button>
              <button class="dash-tab ${activeTab === 'profile' ? 'active' : ''}" onclick="App.setAdminTab('profile')">
                <span class="tab-icon">👤</span> Profile
              </button>
            </div>
          </div>
        </div>

        <div class="dashboard-body container">
          ${activeTab === 'reports' ? Views.renderAdminReports(hostels, students, rooms, complaints, leaves) : ''}
          ${activeTab === 'hostels' ? Views.renderAdminHostels(hostels) : ''}
          ${activeTab === 'students' ? Views.renderAdminStudents(students) : ''}
          ${activeTab === 'staff' ? Views.renderAdminStaff(staff) : ''}
          ${activeTab === 'rooms' ? Views.renderAdminRooms(rooms) : ''}
          ${activeTab === 'complaints' ? Views.renderAdminComplaints(complaints) : ''}
          ${activeTab === 'announcements' ? Views.renderAdminAnnouncements(announcements) : ''}
          ${activeTab === 'profile' ? Views.renderStaffProfile(user) : ''}
        </div>
      </div>
    `;
  },

  // Admin Section 12: Reports & Analytics
  renderAdminReports(hostels, students, rooms, complaints, leaves) {
    const totalCapacity = hostels.reduce((acc, h) => acc + h.totalCapacity, 0);
    const totalOccupied = hostels.reduce((acc, h) => acc + h.occupied, 0);
    const totalAvailable = hostels.reduce((acc, h) => acc + h.availableBeds, 0);

    const compPending = complaints.filter(c => c.status === "Pending").length;
    const compInProgress = complaints.filter(c => c.status === "In Progress").length;
    const compCompleted = complaints.filter(c => c.status === "Completed").length;

    const leaveApproved = leaves.filter(l => l.status === "Approved").length;
    const leavePending = leaves.filter(l => l.status === "Pending").length;
    const leaveRejected = leaves.filter(l => l.status === "Rejected").length;

    return `
      <div class="admin-reports-view">
        <div class="d-flex justify-between align-center mb-4 flex-wrap gap-2">
          <div>
            <h2 class="section-title mb-1">Hostel Analytics & Operational Reports</h2>
            <p class="text-muted text-sm">Comprehensive statistical overview of campus accommodations and operations.</p>
          </div>
          <button class="btn btn-outline-primary btn-sm" onclick="window.print()">🖨️ Print / Export Summary</button>
        </div>

        <!-- Top Overview Metric Tiles -->
        <div class="stats-row mb-4">
          <div class="stat-card">
            <span class="stat-title">Hostel Occupancy</span>
            <span class="stat-value text-green">${((totalOccupied / totalCapacity) * 100).toFixed(1)}%</span>
            <span class="stat-sub">${totalOccupied} / ${totalCapacity} Beds</span>
          </div>
          <div class="stat-card">
            <span class="stat-title">Enrolled Students</span>
            <span class="stat-value text-navy">${students.length}</span>
            <span class="stat-sub">Across 3 Hostels</span>
          </div>
          <div class="stat-card">
            <span class="stat-title">Available Vacancies</span>
            <span class="stat-value text-primary">${totalAvailable}</span>
            <span class="stat-sub">Vacant bed slots</span>
          </div>
          <div class="stat-card">
            <span class="stat-title">Maintenance Rate</span>
            <span class="stat-value text-green">${((compCompleted / (complaints.length || 1)) * 100).toFixed(0)}%</span>
            <span class="stat-sub">${compCompleted} / ${complaints.length} Fixed</span>
          </div>
        </div>

        <!-- 2x2 Grid for Statistical Charts -->
        <div class="two-col-grid mb-4">
          <!-- 1. Hostel Occupancy -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">1. Hostel Occupancy Statistics</h3>
            </div>
            <div class="card-body">
              ${hostels.map(h => {
                const pct = ((h.occupied / h.totalCapacity) * 100).toFixed(1);
                return `
                  <div class="report-bar-row mb-3">
                    <div class="d-flex justify-between text-sm mb-1">
                      <strong>${h.name}</strong>
                      <span>${h.occupied} beds (${pct}%)</span>
                    </div>
                    <div class="progress-bar-bg">
                      <div class="progress-bar-fill" style="width: ${pct}%;"></div>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <!-- 2. Student Distribution by Department -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">2. Student Department Distribution</h3>
            </div>
            <div class="card-body">
              <div class="dept-distribution-list">
                <div class="d-flex justify-between text-sm py-1 border-bottom">
                  <span>Information Technology (IT)</span>
                  <strong>38%</strong>
                </div>
                <div class="d-flex justify-between text-sm py-1 border-bottom">
                  <span>Computer Science & Engg (CSE)</span>
                  <strong>32%</strong>
                </div>
                <div class="d-flex justify-between text-sm py-1 border-bottom">
                  <span>Electronics & Communication (ECE)</span>
                  <strong>18%</strong>
                </div>
                <div class="d-flex justify-between text-sm py-1">
                  <span>Mechanical, Mechatronics, AIDS</span>
                  <strong>12%</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. Complaint & Maintenance Statistics -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">3. Maintenance Grievance Breakdown</h3>
            </div>
            <div class="card-body">
              <div class="stat-pill-row d-flex gap-2 mb-3">
                <span class="badge badge-green p-2 flex-1 text-center">Completed: ${compCompleted}</span>
                <span class="badge badge-warning p-2 flex-1 text-center">In Progress: ${compInProgress}</span>
                <span class="badge badge-danger p-2 flex-1 text-center">Pending: ${compPending}</span>
              </div>
              <ul class="text-sm list-styled pl-3">
                <li>Electrical Works: 40% (Fans, Lights, Plugs)</li>
                <li>Plumbing Works: 30% (Taps, Showers, Drains)</li>
                <li>Network & Wi-Fi: 20% (Router resets, AP stability)</li>
                <li>Carpentry & General: 10% (Almirah doors, Windows)</li>
              </ul>
            </div>
          </div>

          <!-- 4. Leave & Outing Statistics -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">4. Student Leave & Outing Trends</h3>
            </div>
            <div class="card-body">
              <div class="stat-pill-row d-flex gap-2 mb-3">
                <span class="badge badge-green p-2 flex-1 text-center">Approved: ${leaveApproved}</span>
                <span class="badge badge-warning p-2 flex-1 text-center">Pending: ${leavePending}</span>
                <span class="badge badge-danger p-2 flex-1 text-center">Rejected: ${leaveRejected}</span>
              </div>
              <p class="text-sm text-muted">Approval rate stands at <strong>85%</strong>. Primary reasons include Home Visits (70%), Academic Paper Presentations/Events (18%), and City Outings (12%).</p>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderAdminHostels(hostels) {
    return `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Hostel Units & Administration Roster</h3>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Hostel Name</th>
                  <th>Blocks</th>
                  <th>Rooms</th>
                  <th>Beds Capacity</th>
                  <th>Occupied</th>
                  <th>Available</th>
                  <th>Appointed Warden</th>
                  <th>Appointed Caretaker</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                ${hostels.map(h => `
                  <tr>
                    <td><strong>${h.name}</strong></td>
                    <td>${h.blocks.join(", ")}</td>
                    <td>${h.totalRooms}</td>
                    <td>${h.totalCapacity}</td>
                    <td class="text-navy font-weight-bold">${h.occupied}</td>
                    <td class="text-green font-weight-bold">${h.availableBeds}</td>
                    <td>${h.warden}</td>
                    <td>${h.caretaker}</td>
                    <td class="text-sm">${h.email}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  renderAdminStudents(students) {
    return `
      <div class="card">
        <div class="card-header d-flex justify-between align-center flex-wrap gap-2">
          <h3 class="card-title">Enrolled Hostel Students Directory</h3>
          <button class="btn btn-primary btn-sm" onclick="App.openNewStudentModal()">+ Add New Student</button>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Roll Number</th>
                  <th>Student Name</th>
                  <th>Department</th>
                  <th>Hostel</th>
                  <th>Room No</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Enrolled Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${students.map(s => `
                  <tr>
                    <td><strong>${s.rollNo}</strong></td>
                    <td><strong>${s.name}</strong></td>
                    <td>${s.department}</td>
                    <td><span class="badge badge-secondary">${s.hostel}</span></td>
                    <td><span class="badge badge-primary">${s.roomNumber}</span></td>
                    <td class="text-sm">${s.email}</td>
                    <td class="text-sm">${s.phone}</td>
                    <td class="text-sm">${s.registeredAt || '2024-08-10'}</td>
                    <td>
                      <button class="btn btn-outline-danger btn-xs" onclick="App.removeUser('${s.id}')">Remove</button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  renderAdminStaff(staff) {
    return `
      <div class="card">
        <div class="card-header d-flex justify-between align-center flex-wrap gap-2">
          <h3 class="card-title">Hostel Wardens, Caretakers & Administrative Staff</h3>
          <button class="btn btn-primary btn-sm" onclick="App.openNewStaffModal()">+ Add New Staff</button>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Assigned Hostel / Dept</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${staff.map(st => `
                  <tr>
                    <td><strong>${st.name}</strong></td>
                    <td><span class="badge ${st.role === 'warden' ? 'badge-primary' : (st.role === 'admin' ? 'badge-danger' : 'badge-green')}">${st.role.toUpperCase()}</span></td>
                    <td>${st.hostel} • ${st.department}</td>
                    <td class="text-sm">${st.email}</td>
                    <td class="text-sm">${st.phone}</td>
                    <td>
                      <button class="btn btn-outline-secondary btn-xs" onclick="alert('Viewing staff profile for ${st.name}')">Details</button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  renderAdminRooms(rooms) {
    return `
      <div class="card">
        <div class="card-header d-flex justify-between align-center flex-wrap gap-2">
          <h3 class="card-title">Room Inventory Across Hostels</h3>
          <button class="btn btn-primary btn-sm" onclick="App.openNewRoomModal()">+ Add Room</button>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Room No</th>
                  <th>Hostel</th>
                  <th>Block</th>
                  <th>Floor</th>
                  <th>Capacity</th>
                  <th>Occupied</th>
                  <th>Available</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${rooms.map(r => `
                  <tr>
                    <td><strong>${r.roomNumber}</strong></td>
                    <td>${r.hostel}</td>
                    <td>${r.block}</td>
                    <td>Floor ${r.floor}</td>
                    <td>${r.capacity}</td>
                    <td>${r.occupied}</td>
                    <td class="text-green font-weight-bold">${r.available}</td>
                    <td><span class="status-pill status-${r.status.toLowerCase().replace(/\s+/g, '-')}">${r.status}</span></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  renderAdminComplaints(complaints) {
    return Views.renderWardenComplaints(complaints);
  },

  renderAdminAnnouncements(announcements) {
    return `
      <div class="card">
        <div class="card-header d-flex justify-between align-center flex-wrap gap-2">
          <h3 class="card-title">Published Hostel Notices</h3>
          <button class="btn btn-primary btn-sm" onclick="App.openNewAnnModal()">+ Create Announcement</button>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Category</th>
                  <th>Hostel Scope</th>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Author</th>
                </tr>
              </thead>
              <tbody>
                ${announcements.map(a => `
                  <tr>
                    <td><strong>${a.id}</strong></td>
                    <td><span class="badge badge-primary">${a.category}</span></td>
                    <td>${a.hostel}</td>
                    <td><strong>${a.title}</strong></td>
                    <td>${a.date}</td>
                    <td>${a.author}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  renderStaffProfile(user) {
    return `
      <div class="card profile-card" style="max-width: 650px; margin: 0 auto;">
        <div class="card-header">
          <h3 class="card-title">Staff Profile & Office Credentials</h3>
        </div>
        <div class="card-body">
          <div class="profile-info-grid">
            <div class="info-group">
              <label>Full Name</label>
              <div class="info-val">${user.name}</div>
            </div>
            <div class="info-group">
              <label>Role</label>
              <div class="info-val text-green font-weight-bold">${user.role.toUpperCase()}</div>
            </div>
            <div class="info-group">
              <label>Department / Office</label>
              <div class="info-val">${user.department || 'Hostel Administration'}</div>
            </div>
            <div class="info-group">
              <label>Assigned Hostel</label>
              <div class="info-val">${user.hostel || 'All Hostels'}</div>
            </div>
            <div class="info-group">
              <label>Official Email</label>
              <div class="info-val">${user.email}</div>
            </div>
            <div class="info-group">
              <label>Phone Number</label>
              <div class="info-val">${user.phone}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
