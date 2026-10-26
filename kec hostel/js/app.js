/**
 * KEC HOSTELS - Main Application Controller
 * Handles routing, modals, authentication interactions, and dashboard state.
 */

const App = {
  currentRoute: "home", // "home" | "hostel-details" | "dashboard"
  currentHostelId: "amaravathi",
  
  // Dashboard Sub-tabs
  studentActiveTab: "overview",
  caretakerActiveTab: "complaints",
  wardenActiveTab: "overview",
  adminActiveTab: "reports",

  // Filters
  activeMessDay: null,
  activeRoomFilter: "All",
  activeAnnFilter: "All",
  wardenLeaveFilter: "All",

  // Pending service target (for after login redirect)
  pendingServiceRedirect: null,

  init() {
    this.bindEvents();
    this.renderApp();

    // Listen to store updates
    window.addEventListener("kec_store_change", () => {
      this.renderApp();
    });
  },

  bindEvents() {
    // Hash change or back button navigation
    window.addEventListener("hashchange", () => {
      this.handleHashChange();
    });

    // Close modal when clicking on backdrop
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-backdrop")) {
        this.closeAllModals();
      }
    });

    // Escape key closes modals
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeAllModals();
      }
    });
  },

  handleHashChange() {
    const hash = window.location.hash.replace("#", "");
    if (!hash || hash === "home" || hash === "our-hostels" || hash === "services" || hash === "information" || hash === "contact") {
      this.currentRoute = "home";
      this.renderApp();
    }
  },

  navigateTo(route, param = null) {
    this.currentRoute = route;
    if (route === "hostel-details" && param) {
      this.currentHostelId = param;
    }
    this.renderApp();
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  viewHostelDetails(hostelId) {
    this.currentHostelId = hostelId;
    this.currentRoute = "hostel-details";
    this.renderApp();
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  // Service click protection: If logged in, go to dashboard tab; else show Login Required modal
  handleServiceClick(serviceName, defaultFilter = null) {
    const user = Storage.getCurrentUser();
    if (!user) {
      // User is not logged in: Show "Login Required" popup with Sign In and Register buttons!
      this.pendingServiceRedirect = { service: serviceName, filter: defaultFilter };
      this.openLoginRequiredModal(serviceName);
      return;
    }

    // User is logged in! Route according to role:
    if (user.role === "student") {
      this.currentRoute = "dashboard";
      if (serviceName === "mess") this.studentActiveTab = "mess";
      else if (serviceName === "leave") this.studentActiveTab = "leave";
      else if (serviceName === "rooms") {
        this.studentActiveTab = "rooms";
        if (defaultFilter) this.activeRoomFilter = defaultFilter;
      }
      else if (serviceName === "announcements") this.studentActiveTab = "announcements";
      else this.studentActiveTab = "overview";
    } else if (user.role === "caretaker") {
      this.currentRoute = "dashboard";
      this.caretakerActiveTab = serviceName === "rooms" ? "rooms" : "complaints";
    } else if (user.role === "warden") {
      this.currentRoute = "dashboard";
      if (serviceName === "leave") this.wardenActiveTab = "leaves";
      else if (serviceName === "rooms") this.wardenActiveTab = "occupancy";
      else if (serviceName === "mess") this.wardenActiveTab = "mess";
      else this.wardenActiveTab = "overview";
    } else if (user.role === "admin") {
      this.currentRoute = "dashboard";
      if (serviceName === "rooms") this.adminActiveTab = "rooms";
      else if (serviceName === "announcements") this.adminActiveTab = "announcements";
      else this.adminActiveTab = "reports";
    }

    this.renderApp();
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  // Renders the main content container and updates header/navbar
  renderApp() {
    const mainEl = document.getElementById("main-content");
    const currentUser = Storage.getCurrentUser();

    this.updateNavbar(currentUser);

    if (this.currentRoute === "home") {
      mainEl.innerHTML = Views.renderHome();
      // Initialize compact slideshow
      setTimeout(() => {
        new HostelSlideshow("hero-slideshow", { interval: 5000 });
      }, 50);
    } else if (this.currentRoute === "hostel-details") {
      mainEl.innerHTML = Views.renderHostelDetails(this.currentHostelId);
    } else if (this.currentRoute === "dashboard") {
      if (!currentUser) {
        this.currentRoute = "home";
        this.renderApp();
        return;
      }
      if (currentUser.role === "student") {
        mainEl.innerHTML = Views.renderStudentDashboard(this.studentActiveTab);
      } else if (currentUser.role === "caretaker") {
        mainEl.innerHTML = Views.renderCaretakerDashboard(this.caretakerActiveTab);
      } else if (currentUser.role === "warden") {
        mainEl.innerHTML = Views.renderWardenDashboard(this.wardenActiveTab);
      } else if (currentUser.role === "admin") {
        mainEl.innerHTML = Views.renderAdminDashboard(this.adminActiveTab);
      }
    }
  },

  updateNavbar(currentUser) {
    const authActions = document.getElementById("nav-auth-actions");
    if (!authActions) return;

    if (currentUser) {
      authActions.innerHTML = `
        <div class="user-profile-menu">
          <button class="user-pill-btn" onclick="App.navigateTo('dashboard')">
            <span class="user-avatar-dot"></span>
            <span class="user-nav-name">${currentUser.name} (${currentUser.role.toUpperCase()})</span>
            <span class="portal-tag">Portal &rarr;</span>
          </button>
          <button class="btn btn-outline-danger btn-sm nav-logout-btn" onclick="Auth.logout(); App.renderApp();">Logout</button>
        </div>
      `;
    } else {
      authActions.innerHTML = `
        <button class="btn btn-primary btn-sm" onclick="App.openAuthModal('signin')">Sign In</button>
        <button class="btn btn-outline-primary btn-sm" onclick="App.openAuthModal('register')">Register</button>
      `;
    }
  },

  // Tab Changers
  setStudentTab(tab) {
    this.studentActiveTab = tab;
    this.renderApp();
  },
  setCaretakerTab(tab) {
    this.caretakerActiveTab = tab;
    this.renderApp();
  },
  setWardenTab(tab) {
    this.wardenActiveTab = tab;
    this.renderApp();
  },
  setAdminTab(tab) {
    this.adminActiveTab = tab;
    this.renderApp();
  },

  // Mess Menu Day Switcher
  setMessDay(day) {
    this.activeMessDay = day;
    this.renderApp();
  },

  // Room Filter
  setRoomFilter(hostel) {
    this.activeRoomFilter = hostel;
    this.renderApp();
  },

  // Announcement Category Filter
  setAnnFilter(cat) {
    this.activeAnnFilter = cat;
    this.renderApp();
  },

  // Warden Leave Status Filter
  setWardenLeaveFilter(filter) {
    this.wardenLeaveFilter = filter;
    this.renderApp();
  },

  /* ---------------- MODAL CONTROLLERS ---------------- */

  closeAllModals() {
    const modals = document.querySelectorAll(".modal-backdrop");
    modals.forEach(m => m.classList.remove("active"));
  },

  // 1. LOGIN REQUIRED MODAL
  openLoginRequiredModal(serviceName = "this service") {
    const modal = document.getElementById("login-required-modal");
    if (!modal) return;

    const serviceTitles = {
      mess: "Mess Portal & Dining Schedule",
      leave: "Leave & Outing Gate Pass System",
      rooms: "Room Availability & Bed Allocations",
      announcements: "Official Hostel Announcements"
    };

    const targetDesc = serviceTitles[serviceName] || "Student Services";
    document.getElementById("login-req-service-name").textContent = targetDesc;

    modal.classList.add("active");
  },

  // 2. AUTH MODAL (Sign In & Register)
  openAuthModal(mode = "signin") {
    this.closeAllModals();
    const modal = document.getElementById("auth-modal");
    if (!modal) return;

    this.switchAuthMode(mode);
    this.clearAuthErrors();
    modal.classList.add("active");
  },

  switchAuthMode(mode) {
    const signinTab = document.getElementById("auth-tab-signin");
    const registerTab = document.getElementById("auth-tab-register");
    const signinForm = document.getElementById("auth-form-signin");
    const registerForm = document.getElementById("auth-form-register");

    if (mode === "signin") {
      signinTab.classList.add("active");
      registerTab.classList.remove("active");
      signinForm.classList.remove("hidden");
      registerForm.classList.add("hidden");
    } else {
      registerTab.classList.add("active");
      signinTab.classList.remove("active");
      registerForm.classList.remove("hidden");
      signinForm.classList.add("hidden");
    }
  },

  switchRoleTab(type, role) {
    const container = document.getElementById(`role-buttons-${type}`);
    if (!container) return;

    const buttons = container.querySelectorAll(".role-btn");
    buttons.forEach(b => {
      b.classList.toggle("active", b.dataset.role === role);
    });

    const isStudent = role === "student";
    const studentFields = document.getElementById(`fields-student-${type}`);
    const staffFields = document.getElementById(`fields-staff-${type}`);

    if (studentFields) studentFields.classList.toggle("hidden", !isStudent);
    if (staffFields) staffFields.classList.toggle("hidden", isStudent);

    // Update form field placeholder
    if (type === "signin") {
      const idLabel = document.getElementById("signin-id-label");
      const idInput = document.getElementById("signin-identifier");
      if (idLabel && idInput) {
        if (isStudent) {
          idLabel.textContent = "Name or Roll Number";
          idInput.placeholder = "e.g. 22ITR088 or Swaathi";
        } else {
          idLabel.textContent = "Email or Phone Number";
          idInput.placeholder = "e.g. warden@kongu.edu or 98421 22222";
        }
      }
    }
  },

  getActiveRole(type) {
    const container = document.getElementById(`role-buttons-${type}`);
    const activeBtn = container ? container.querySelector(".role-btn.active") : null;
    return activeBtn ? activeBtn.dataset.role : "student";
  },

  clearAuthErrors() {
    const errBox = document.getElementById("auth-error-box");
    if (errBox) {
      errBox.classList.add("hidden");
      errBox.textContent = "";
    }
  },

  showAuthError(message) {
    const errBox = document.getElementById("auth-error-box");
    if (errBox) {
      errBox.textContent = message;
      errBox.classList.remove("hidden");
    } else {
      alert(message);
    }
  },

  handleSignInSubmit(event) {
    event.preventDefault();
    this.clearAuthErrors();

    const role = this.getActiveRole("signin");
    const identifier = document.getElementById("signin-identifier").value;
    const password = document.getElementById("signin-password").value;

    let res;
    if (role === "student") {
      res = Auth.loginStudent(identifier, password);
    } else {
      res = Auth.loginStaff(role, identifier, password);
    }

    if (!res.success) {
      this.showAuthError(res.message);
      return;
    }

    // Success!
    this.closeAllModals();
    if (this.pendingServiceRedirect) {
      const redir = this.pendingServiceRedirect;
      this.pendingServiceRedirect = null;
      this.handleServiceClick(redir.service, redir.filter);
    } else {
      this.currentRoute = "dashboard";
      this.renderApp();
    }
  },

  handleRegisterSubmit(event) {
    event.preventDefault();
    this.clearAuthErrors();

    const role = this.getActiveRole("register");

    if (role === "student") {
      const formData = {
        name: document.getElementById("reg-std-name").value,
        rollNo: document.getElementById("reg-std-roll").value,
        department: document.getElementById("reg-std-dept").value,
        hostel: document.getElementById("reg-std-hostel").value,
        roomNumber: document.getElementById("reg-std-room").value,
        email: document.getElementById("reg-std-email").value,
        phone: document.getElementById("reg-std-phone").value,
        password: document.getElementById("reg-std-password").value,
        confirmPassword: document.getElementById("reg-std-confirm-password").value
      };

      const res = Auth.registerStudent(formData);
      if (!res.success) {
        this.showAuthError(res.message);
        return;
      }
    } else {
      const formData = {
        name: document.getElementById("reg-staff-name").value,
        phone: document.getElementById("reg-staff-phone").value,
        email: document.getElementById("reg-staff-email").value,
        role: role,
        password: document.getElementById("reg-staff-password").value,
        confirmPassword: document.getElementById("reg-staff-confirm-password").value
      };

      const res = Auth.registerStaff(formData);
      if (!res.success) {
        this.showAuthError(res.message);
        return;
      }
    }

    // Success!
    this.closeAllModals();
    this.currentRoute = "dashboard";
    this.renderApp();
  },

  // 1-Click Demo Login
  demoLogin(role) {
    const user = Auth.quickLogin(role);
    if (user) {
      this.closeAllModals();
      this.currentRoute = "dashboard";
      this.renderApp();
    }
  },

  // 3. APPLY LEAVE MODAL
  openApplyLeaveModal() {
    const user = Storage.getCurrentUser();
    if (!user || user.role !== "student") {
      this.openAuthModal("signin");
      return;
    }
    const modal = document.getElementById("apply-leave-modal");
    if (modal) modal.classList.add("active");
  },

  submitLeaveRequest(event) {
    event.preventDefault();
    const user = Storage.getCurrentUser();
    if (!user) return;

    const form = event.target;
    const leaveData = {
      studentId: user.id,
      studentName: user.name,
      rollNo: user.rollNo,
      hostel: user.hostel,
      roomNumber: user.roomNumber,
      type: form.leaveType.value,
      startDate: form.startDate.value,
      endDate: form.endDate.value,
      destination: form.destination.value,
      reason: form.reason.value,
      parentPhone: form.parentPhone.value
    };

    Storage.addLeave(leaveData);
    this.closeAllModals();
    form.reset();
    alert("Leave request submitted successfully! Awaiting Warden approval.");
    this.studentActiveTab = "leave";
    this.renderApp();
  },

  // 4. LODGE COMPLAINT MODAL
  openComplaintModal() {
    const user = Storage.getCurrentUser();
    if (!user || user.role !== "student") {
      this.openAuthModal("signin");
      return;
    }
    const modal = document.getElementById("lodge-complaint-modal");
    if (modal) modal.classList.add("active");
  },

  submitComplaintRequest(event) {
    event.preventDefault();
    const user = Storage.getCurrentUser();
    if (!user) return;

    const form = event.target;
    const complaintData = {
      studentName: user.name,
      rollNo: user.rollNo,
      hostel: user.hostel,
      roomNumber: user.roomNumber,
      category: form.category.value,
      title: form.title.value,
      description: form.description.value,
      priority: form.priority.value
    };

    Storage.addComplaint(complaintData);
    this.closeAllModals();
    form.reset();
    alert("Maintenance complaint registered successfully! Caretaker will inspect shortly.");
    this.studentActiveTab = "complaints";
    this.renderApp();
  },

  // 5. CARETAKER STATUS UPDATE MODAL
  openCaretakerUpdateModal(complaintId) {
    const modal = document.getElementById("caretaker-update-modal");
    if (!modal) return;

    const complaints = Storage.getComplaints();
    const c = complaints.find(item => item.id === complaintId);
    if (!c) return;

    document.getElementById("caretaker-comp-id").value = c.id;
    document.getElementById("caretaker-comp-title").textContent = `${c.id} - ${c.title} (${c.hostel} ${c.roomNumber})`;
    document.getElementById("caretaker-comp-status").value = c.status;
    document.getElementById("caretaker-comp-tech").value = c.technician || "";
    document.getElementById("caretaker-comp-notes").value = c.notes || "";

    modal.classList.add("active");
  },

  submitCaretakerUpdate(event) {
    event.preventDefault();
    const id = document.getElementById("caretaker-comp-id").value;
    const status = document.getElementById("caretaker-comp-status").value;
    const tech = document.getElementById("caretaker-comp-tech").value;
    const notes = document.getElementById("caretaker-comp-notes").value;

    Storage.updateComplaintStatus(id, status, tech, notes);
    this.closeAllModals();
    alert("Maintenance status updated successfully.");
    this.renderApp();
  },

  // 6. WARDEN LEAVE ACTIONS & MODAL CONTROLLERS
  quickApproveLeave(leaveId, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const user = Storage.getCurrentUser();
    const reviewerName = user ? user.name : "Dr. K. Senthil (Chief Warden)";
    Storage.updateLeaveStatus(leaveId, "Approved", "Approved. Return to hostel before curfew (07:00 PM).", reviewerName);
    this.renderApp();
  },

  quickRejectLeave(leaveId, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const user = Storage.getCurrentUser();
    const reviewerName = user ? user.name : "Dr. K. Senthil (Chief Warden)";
    Storage.updateLeaveStatus(leaveId, "Rejected", "Leave request rejected due to campus guidelines.", reviewerName);
    this.renderApp();
  },

  openWardenLeaveModal(leaveId) {
    const modal = document.getElementById("warden-leave-modal");
    if (!modal) return;

    const leaves = Storage.getLeaves();
    const l = leaves.find(item => item.id === leaveId);
    if (!l) return;

    document.getElementById("warden-leave-id").value = l.id;
    document.getElementById("warden-leave-student-name").textContent = l.studentName;
    document.getElementById("warden-leave-type").textContent = l.type;
    document.getElementById("warden-leave-roll").textContent = `Roll: ${l.rollNo}`;
    document.getElementById("warden-leave-room").textContent = `${l.hostel} (${l.roomNumber})`;
    document.getElementById("warden-leave-dates").textContent = `${l.startDate}  ➜  ${l.endDate}`;
    document.getElementById("warden-leave-dest").textContent = l.destination || "N/A";
    document.getElementById("warden-leave-reason").textContent = l.reason;
    document.getElementById("warden-leave-parent").textContent = l.parentPhone || "N/A";

    // Set initial decision state to Approved or current status
    const initialDecision = l.status === "Rejected" ? "Rejected" : "Approved";
    this.setWardenDecisionChoice(initialDecision);

    if (l.wardenRemarks) {
      document.getElementById("warden-leave-remarks").value = l.wardenRemarks;
    }

    modal.classList.add("active");
  },

  setWardenDecisionChoice(choice) {
    const btnApprove = document.getElementById("btn-choice-approve");
    const btnReject = document.getElementById("btn-choice-reject");
    const valInput = document.getElementById("warden-decision-value");
    const remarksInput = document.getElementById("warden-leave-remarks");

    if (!valInput) return;
    valInput.value = choice;

    if (choice === "Approved") {
      btnApprove.className = "btn btn-green flex-1";
      btnReject.className = "btn btn-outline-danger flex-1";
      if (!remarksInput.value || remarksInput.value.includes("rejected")) {
        remarksInput.value = "Approved. Return before curfew (07:00 PM).";
      }
    } else {
      btnApprove.className = "btn btn-outline-green flex-1";
      btnReject.className = "btn btn-danger flex-1";
      if (!remarksInput.value || remarksInput.value.includes("Approved")) {
        remarksInput.value = "Leave request rejected due to college guidelines.";
      }
    }
  },

  submitWardenLeaveDecision(event) {
    event.preventDefault();
    const leaveId = document.getElementById("warden-leave-id").value;
    const decision = document.getElementById("warden-decision-value").value;
    const remarks = document.getElementById("warden-leave-remarks").value;
    const user = Storage.getCurrentUser();

    const reviewerName = user ? user.name : "Chief Warden";
    Storage.updateLeaveStatus(leaveId, decision, remarks, reviewerName);
    this.closeAllModals();
    this.renderApp();
  },

  // Alias for backward compatibility
  reviewLeaveAction(leaveId, decision) {
    if (decision === "Approved") {
      this.quickApproveLeave(leaveId);
    } else {
      this.quickRejectLeave(leaveId);
    }
  },

  // 7. MESS FEEDBACK SUBMIT
  submitMessFeedback(event) {
    event.preventDefault();
    const form = event.target;
    const user = Storage.getCurrentUser();

    const feedback = {
      studentName: user ? user.name : "KEC Hosteller",
      rollNo: user ? user.rollNo : "22ITR088",
      hostel: user ? user.hostel : "Amaravathi Hostel",
      meal: form.meal.value,
      category: form.category.value,
      rating: parseInt(form.rating.value) || 5,
      comment: form.comment.value
    };

    Storage.addMessFeedback(feedback);
    form.reset();
    alert("Thank you! Your mess feedback has been recorded for review by the Warden and Mess Committee.");
  },

  // 8. NEW ANNOUNCEMENT MODAL
  openNewAnnModal() {
    const modal = document.getElementById("new-ann-modal");
    if (modal) modal.classList.add("active");
  },

  submitNewAnnouncement(event) {
    event.preventDefault();
    const form = event.target;
    const user = Storage.getCurrentUser();

    const item = {
      title: form.title.value,
      category: form.category.value,
      hostel: form.hostel.value,
      priority: form.priority.value,
      content: form.content.value,
      author: user ? `${user.name} (${user.role.toUpperCase()})` : "Hostel Office"
    };

    Storage.addAnnouncement(item);
    this.closeAllModals();
    form.reset();
    alert("Announcement published successfully!");
    this.renderApp();
  },

  // 9. ADD STUDENT MODAL (ADMIN)
  openNewStudentModal() {
    const modal = document.getElementById("admin-add-student-modal");
    if (modal) modal.classList.add("active");
  },

  submitAdminAddStudent(event) {
    event.preventDefault();
    const form = event.target;
    const newStudent = {
      role: "student",
      name: form.name.value,
      rollNo: form.rollNo.value.toUpperCase(),
      department: form.department.value,
      hostel: form.hostel.value,
      roomNumber: form.roomNumber.value,
      email: form.email.value,
      phone: form.phone.value,
      password: "student123",
      year: "Enrolled"
    };

    Storage.addUser(newStudent);
    this.closeAllModals();
    form.reset();
    alert("New student enrolled successfully! Default password is 'student123'.");
    this.renderApp();
  },

  // 10. ADD STAFF MODAL (ADMIN)
  openNewStaffModal() {
    const modal = document.getElementById("admin-add-staff-modal");
    if (modal) modal.classList.add("active");
  },

  submitAdminAddStaff(event) {
    event.preventDefault();
    const form = event.target;
    const newStaff = {
      role: form.role.value,
      name: form.name.value,
      phone: form.phone.value,
      email: form.email.value,
      hostel: form.hostel.value,
      department: form.department.value,
      password: form.role.value === "warden" ? "warden123" : "caretaker123"
    };

    Storage.addUser(newStaff);
    this.closeAllModals();
    form.reset();
    alert(`New ${form.role.value.toUpperCase()} registered successfully!`);
    this.renderApp();
  },

  // 11. ADD ROOM MODAL (ADMIN)
  openNewRoomModal() {
    const modal = document.getElementById("admin-add-room-modal");
    if (modal) modal.classList.add("active");
  },

  submitAdminAddRoom(event) {
    event.preventDefault();
    const form = event.target;
    const capacity = parseInt(form.capacity.value) || 4;
    const newRoom = {
      hostel: form.hostel.value,
      block: form.block.value,
      roomNumber: form.roomNumber.value,
      floor: parseInt(form.floor.value) || 1,
      capacity: capacity,
      occupied: 0,
      available: capacity,
      status: "Available",
      residents: []
    };

    Storage.addRoom(newRoom);
    this.closeAllModals();
    form.reset();
    alert("New room added to hostel inventory!");
    this.renderApp();
  },

  // Remove User (Admin)
  removeUser(userId) {
    if (confirm("Are you sure you want to remove this user from the records?")) {
      const users = Storage.getUsers().filter(u => u.id !== userId);
      Storage.saveUsers(users);
      this.renderApp();
    }
  },

  // 12. INFO & CONTACT MODALS
  showInfoModal(topic = "general") {
    const modal = document.getElementById("info-modal");
    if (!modal) return;

    const titleEl = document.getElementById("info-modal-title");
    const bodyEl = document.getElementById("info-modal-body");

    if (topic === "rules") {
      titleEl.textContent = "KEC Hostel Rules & Code of Conduct";
      bodyEl.innerHTML = `
        <ol class="rules-list">
          <li><strong>Discipline & Curfew:</strong> All students must return to their respective hostels before <strong>07:00 PM</strong>. Entry after gate hours requires specific Warden permission.</li>
          <li><strong>Study Hours:</strong> Quiet study hours are observed from <strong>08:30 PM to 10:30 PM</strong> daily. High-volume music or disturbances are prohibited.</li>
          <li><strong>Attendance:</strong> Daily night attendance is taken between 08:00 PM and 08:30 PM in individual rooms.</li>
          <li><strong>Ragging Policy:</strong> Ragging in any form is strictly banned under government statutes and college anti-ragging policies. Strict zero tolerance with immediate expulsion.</li>
          <li><strong>Electrical Appliances:</strong> Heavy electrical equipment (immersion rods, electric heaters, induction stoves) are strictly prohibited in student rooms for safety.</li>
          <li><strong>Leave Procedure:</strong> Prior permission must be obtained via the digital Leave & Outing portal before departing the campus.</li>
        </ol>
      `;
    } else if (topic === "mess") {
      titleEl.textContent = "Mess Timings & Dietary Guidelines";
      bodyEl.innerHTML = `
        <div class="mess-info-box">
          <h4>Meal Service Timings</h4>
          <ul>
            <li><strong>Breakfast:</strong> 07:00 AM - 08:30 AM</li>
            <li><strong>Lunch:</strong> 12:15 PM - 01:45 PM</li>
            <li><strong>Evening Snacks & Tea:</strong> 04:30 PM - 05:30 PM</li>
            <li><strong>Dinner:</strong> 07:30 PM - 09:00 PM (Extended till 09:30 PM during semester exams)</li>
          </ul>
          <h4>Catering Standards</h4>
          <p>KEC Hostels maintain ISO-standard steam kitchen facilities, with zero food wastage monitoring and periodic student mess committee reviews.</p>
        </div>
      `;
    } else {
      titleEl.textContent = "General Hostel Facilities & Guidelines";
      bodyEl.innerHTML = `
        <p>Kongu Engineering College provides residential accommodations across Amaravathi, Bhavani, and Kaveri hostels with:</p>
        <ul>
          <li>High-speed optic fiber Wi-Fi throughout all rooms and reading corridors.</li>
          <li>24/7 solar water heating systems with backup electric heat coils.</li>
          <li>Continuous RO purified drinking water stations on each floor.</li>
          <li>Dedicated indoor sports, gymnasiums, and common television halls.</li>
          <li>Immediate access to on-campus 24/7 Health Care Centre and ambulance.</li>
        </ul>
      `;
    }

    modal.classList.add("active");
  },

  showContactModal() {
    const modal = document.getElementById("contact-modal");
    if (modal) modal.classList.add("active");
  },

  // Reset Demo Data
  resetDemoData() {
    if (confirm("Reset all data back to original defaults?")) {
      Storage.resetToDefault();
      Auth.logout();
      this.currentRoute = "home";
      this.renderApp();
      alert("Hostel Management System has been reset to default state.");
    }
  }
};

// Expose App globally
window.App = App;

// Bootstrap App when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
