/**
 * KEC HOSTELS - Authentication Manager
 * Handles Student, Caretaker, Warden, Admin login, registration, validation, and sessions.
 */

const Auth = {
  loginStudent(identifier, password) {
    if (!identifier || !password) {
      return { success: false, message: "Please enter both Roll Number/Name and Password." };
    }

    const cleanId = identifier.trim().toLowerCase();
    const users = Storage.getUsers();
    
    // Find student by Name or Roll Number
    const student = users.find(u => 
      u.role === "student" && (
        (u.rollNo && u.rollNo.toLowerCase() === cleanId) ||
        (u.name && u.name.toLowerCase() === cleanId)
      )
    );

    if (!student) {
      return { 
        success: false, 
        message: "Student account not found with this Name or Roll Number. Please register first." 
      };
    }

    if (student.password !== password) {
      // User required exact error message:
      return { 
        success: false, 
        message: "Incorrect password. Please re-enter your password." 
      };
    }

    // Success
    Storage.setCurrentUser(student);
    return { success: true, user: student };
  },

  registerStudent(formData) {
    const { name, rollNo, department, hostel, roomNumber, email, phone, password, confirmPassword } = formData;

    if (!name || !rollNo || !department || !hostel || !roomNumber || !email || !phone || !password) {
      return { success: false, message: "Please fill in all required registration fields." };
    }

    if (password !== confirmPassword) {
      return { success: false, message: "Passwords do not match. Please re-enter." };
    }

    if (password.length < 4) {
      return { success: false, message: "Password must be at least 4 characters." };
    }

    const users = Storage.getUsers();
    const existing = users.find(u => 
      u.role === "student" && (
        (u.rollNo && u.rollNo.toUpperCase() === rollNo.trim().toUpperCase()) ||
        (u.email && u.email.toLowerCase() === email.trim().toLowerCase())
      )
    );

    if (existing) {
      return { success: false, message: "A student with this Roll Number or Email already exists. Please Sign In." };
    }

    const newStudent = {
      role: "student",
      name: name.trim(),
      rollNo: rollNo.trim().toUpperCase(),
      department: department.trim(),
      hostel: hostel.trim(),
      roomNumber: roomNumber.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password: password,
      year: "Enrolled",
      registeredAt: new Date().toISOString().split("T")[0]
    };

    Storage.addUser(newStudent);
    Storage.setCurrentUser(newStudent);
    return { success: true, user: newStudent };
  },

  loginStaff(role, identifier, password) {
    if (!identifier || !password) {
      return { success: false, message: "Please enter your Email/Phone and Password." };
    }

    const cleanId = identifier.trim().toLowerCase();
    const users = Storage.getUsers();

    const staff = users.find(u => 
      u.role === role && (
        (u.email && u.email.toLowerCase() === cleanId) ||
        (u.phone && u.phone.replace(/\s+/g, '') === cleanId.replace(/\s+/g, '')) ||
        (u.name && u.name.toLowerCase() === cleanId)
      )
    );

    if (!staff) {
      return { 
        success: false, 
        message: `No ${role.toUpperCase()} account found with these credentials. Please check or register.` 
      };
    }

    if (staff.password !== password) {
      return { 
        success: false, 
        message: "Incorrect password. Please re-enter your password." 
      };
    }

    Storage.setCurrentUser(staff);
    return { success: true, user: staff };
  },

  registerStaff(formData) {
    const { name, phone, email, role, password, confirmPassword } = formData;

    if (!name || !phone || !email || !role || !password) {
      return { success: false, message: "Please fill in all staff registration fields." };
    }

    if (password !== confirmPassword) {
      return { success: false, message: "Passwords do not match. Please re-enter." };
    }

    const users = Storage.getUsers();
    const existing = users.find(u => u.email && u.email.toLowerCase() === email.trim().toLowerCase());

    if (existing) {
      return { success: false, message: "An account with this Email already exists." };
    }

    const newStaff = {
      role: role.toLowerCase(),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      password: password,
      hostel: "All Hostels",
      department: role === "caretaker" ? "Facilities & Maintenance" : (role === "warden" ? "Student Welfare & Hostel" : "Administration"),
      registeredAt: new Date().toISOString().split("T")[0]
    };

    Storage.addUser(newStaff);
    Storage.setCurrentUser(newStaff);
    return { success: true, user: newStaff };
  },

  logout() {
    Storage.setCurrentUser(null);
  },

  // Helper for 1-click test login
  quickLogin(role) {
    const users = Storage.getUsers();
    let user;
    if (role === "student") {
      user = users.find(u => u.role === "student");
    } else if (role === "caretaker") {
      user = users.find(u => u.role === "caretaker");
    } else if (role === "warden") {
      user = users.find(u => u.role === "warden");
    } else if (role === "admin") {
      user = users.find(u => u.role === "admin");
    }
    if (user) {
      Storage.setCurrentUser(user);
      return user;
    }
    return null;
  }
};
