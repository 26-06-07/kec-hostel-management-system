/**
 * KEC HOSTELS - Storage Manager
 * Persistent state management using localStorage with seamless event listeners
 */

const STORAGE_KEYS = {
  VERSION: "kec_storage_version_v3",
  HOSTELS: "kec_hostels_data",
  ROOMS: "kec_rooms_data",
  USERS: "kec_users_data",
  LEAVES: "kec_leaves_data",
  COMPLAINTS: "kec_complaints_data",
  ANNOUNCEMENTS: "kec_announcements_data",
  MESS: "kec_mess_data",
  CURRENT_USER: "kec_current_user"
};

const Storage = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.VERSION) || !localStorage.getItem(STORAGE_KEYS.HOSTELS)) {
      this.resetToDefault();
      localStorage.setItem(STORAGE_KEYS.VERSION, "3.0");
    }
  },

  resetToDefault() {
    localStorage.setItem(STORAGE_KEYS.HOSTELS, JSON.stringify(DEFAULT_DATA.hostels));
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(DEFAULT_DATA.rooms));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_DATA.users));
    localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(DEFAULT_DATA.leaves));
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(DEFAULT_DATA.complaints));
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(DEFAULT_DATA.announcements));
    localStorage.setItem(STORAGE_KEYS.MESS, JSON.stringify(DEFAULT_DATA.mess));
  },

  getHostels() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.HOSTELS)) || DEFAULT_DATA.hostels;
  },

  getHostelById(id) {
    const list = this.getHostels();
    return list.find(h => h.id === id || h.name.toLowerCase().includes(id.toLowerCase())) || list[0];
  },

  getRooms() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ROOMS)) || DEFAULT_DATA.rooms;
  },

  saveRooms(rooms) {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
    this.notifyUpdate("rooms");
  },

  addRoom(room) {
    const rooms = this.getRooms();
    room.id = "rm_" + Date.now();
    rooms.unshift(room);
    this.saveRooms(rooms);
    return room;
  },

  getUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || DEFAULT_DATA.users;
  },

  saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.notifyUpdate("users");
  },

  addUser(userData) {
    const users = this.getUsers();
    userData.id = "u_" + Date.now();
    userData.registeredAt = new Date().toISOString().split("T")[0];
    users.push(userData);
    this.saveUsers(users);
    return userData;
  },

  getCurrentUser() {
    const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return userStr ? JSON.parse(userStr) : null;
  },

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
    this.notifyUpdate("auth");
  },

  getLeaves() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LEAVES)) || DEFAULT_DATA.leaves;
  },

  saveLeaves(leaves) {
    localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaves));
    this.notifyUpdate("leaves");
  },

  addLeave(leaveData) {
    const leaves = this.getLeaves();
    leaveData.id = "LV-" + new Date().getFullYear() + "-" + Math.floor(100 + Math.random() * 900);
    leaveData.status = "Pending";
    leaveData.appliedOn = new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    leaves.unshift(leaveData);
    this.saveLeaves(leaves);
    return leaveData;
  },

  updateLeaveStatus(leaveId, status, wardenRemarks = "", reviewedBy = "Warden Office") {
    const leaves = this.getLeaves();
    const cleanId = String(leaveId || "").trim().toLowerCase();
    const target = leaves.find(l => String(l.id || "").trim().toLowerCase() === cleanId);
    if (target) {
      target.status = status;
      target.wardenRemarks = wardenRemarks || (status === "Approved" ? "Permission granted. Return before curfew." : "Request not approved.");
      target.reviewedBy = reviewedBy;
      this.saveLeaves(leaves);
      return true;
    }
    return false;
  },

  getComplaints() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPLAINTS)) || DEFAULT_DATA.complaints;
  },

  saveComplaints(complaints) {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
    this.notifyUpdate("complaints");
  },

  addComplaint(complaintData) {
    const complaints = this.getComplaints();
    complaintData.id = "CMP-" + Math.floor(400 + Math.random() * 600);
    complaintData.status = "Pending";
    complaintData.assignedTo = "Caretaker Office";
    complaintData.technician = null;
    complaintData.notes = "Complaint logged. Pending initial inspection.";
    complaintData.filedOn = new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    complaints.unshift(complaintData);
    this.saveComplaints(complaints);
    return complaintData;
  },

  updateComplaintStatus(complaintId, status, technician = "", notes = "") {
    const complaints = this.getComplaints();
    const target = complaints.find(c => c.id === complaintId);
    if (target) {
      target.status = status;
      if (technician) target.technician = technician;
      if (notes) target.notes = notes;
      this.saveComplaints(complaints);
      return true;
    }
    return false;
  },

  getMessData() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MESS)) || DEFAULT_DATA.mess;
  },

  saveMessData(messData) {
    localStorage.setItem(STORAGE_KEYS.MESS, JSON.stringify(messData));
    this.notifyUpdate("mess");
  },

  addMessFeedback(feedback) {
    const mess = this.getMessData();
    feedback.id = "fb_" + Date.now();
    feedback.date = new Date().toISOString().split("T")[0];
    feedback.status = "Pending Review";
    if (!mess.feedbackList) mess.feedbackList = [];
    mess.feedbackList.unshift(feedback);
    this.saveMessData(mess);
    return feedback;
  },

  getAnnouncements() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) || DEFAULT_DATA.announcements;
  },

  saveAnnouncements(list) {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(list));
    this.notifyUpdate("announcements");
  },

  addAnnouncement(item) {
    const list = this.getAnnouncements();
    item.id = "ANN-" + Math.floor(100 + Math.random() * 900);
    item.date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    list.unshift(item);
    this.saveAnnouncements(list);
    return item;
  },

  notifyUpdate(type) {
    window.dispatchEvent(new CustomEvent("kec_store_change", { detail: { type } }));
  }
};

// Initialize storage immediately
Storage.init();
window.Storage = Storage;
