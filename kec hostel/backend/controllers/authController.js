const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'kec_hostel_super_secure_jwt_secret_key_2026';

/**
 * Validate password requirements according to Specification:
 * - Minimum 8 characters
 * - At least 1 uppercase letter (A-Z)
 * - At least 1 lowercase letter (a-z)
 * - At least 1 number (0-9)
 * - At least 1 special character (e.g., @, #, $, %, !)
 */
function validatePassword(password) {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least 1 uppercase letter (A-Z).';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least 1 lowercase letter (a-z).';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least 1 number (0-9).';
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return 'Password must contain at least 1 special character (e.g., @, #, $, %, !).';
  }
  return null;
}

/**
 * User Login Controller for the 3 distinct roles:
 * 1. Student (Roll Number + Room Number + Password)
 * 2. Care Taker (Phone Number + Password)
 * 3. Warden (Phone Number + Password)
 */
exports.login = async (req, res, next) => {
  try {
    const role = (req.body.role || 'student').toLowerCase();
    const password = req.body.password;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required.'
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 1. STUDENT LOGIN (Requirement 6)
    // ─────────────────────────────────────────────────────────────
    if (role === 'student') {
      const rollNo = (req.body.roll_number || req.body.roll_no || req.body.identifier || '').trim();
      const roomNo = (req.body.room_number || req.body.room_no || '').trim();

      if (!rollNo || !roomNo) {
        return res.status(400).json({
          success: false,
          message: 'Roll Number and Room Number are required.'
        });
      }

      const student = await User.findStudent(rollNo);
      if (!student) {
        return res.status(401).json({
          success: false,
          message: 'Invalid roll number, room number or password.'
        });
      }

      // Verify Room Number
      const studentRoom = (student.room_no || student.room_number || '').trim().toLowerCase();
      if (studentRoom !== roomNo.toLowerCase()) {
        return res.status(401).json({
          success: false,
          message: 'Invalid roll number, room number or password.'
        });
      }

      // Verify Password Hash
      const isMatch = await bcrypt.compare(password, student.password_hash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid roll number, room number or password.'
        });
      }

      const payload = {
        id: student.id,
        name: student.name,
        role: 'student',
        roll_no: student.roll_no || student.roll_number,
        roll_number: student.roll_no || student.roll_number,
        room_no: student.room_no || student.room_number,
        room_number: student.room_no || student.room_number,
        date_of_birth: student.date_of_birth,
        email: student.email,
        department: student.department,
        hostel: student.hostel
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

      return res.status(200).json({
        success: true,
        message: `Welcome, ${student.name}!`,
        token,
        user: payload
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 2. CARE TAKER LOGIN (Requirement 7)
    // Phone Number + Password (NO roll number or room number)
    // ─────────────────────────────────────────────────────────────
    if (role === 'caretaker' || role === 'care taker') {
      const phone = (req.body.phone_number || req.body.phone || req.body.identifier || '').trim();

      if (!phone) {
        return res.status(400).json({
          success: false,
          message: 'Phone Number is required.'
        });
      }

      const caretaker = await User.findCaretakerByPhone(phone);
      if (!caretaker) {
        return res.status(401).json({
          success: false,
          message: 'Invalid phone number or password.'
        });
      }

      const isMatch = await bcrypt.compare(password, caretaker.password_hash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid phone number or password.'
        });
      }

      const payload = {
        id: caretaker.id,
        name: caretaker.name,
        role: 'caretaker',
        phone: caretaker.phone || caretaker.phone_number,
        phone_number: caretaker.phone || caretaker.phone_number,
        email: caretaker.email,
        hostel: caretaker.hostel || 'Amaravathi Hostel'
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

      return res.status(200).json({
        success: true,
        message: `Welcome, ${caretaker.name}!`,
        token,
        user: payload
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 3. WARDEN LOGIN (Requirement 8)
    // Phone Number + Password (NO roll number or room number)
    // ─────────────────────────────────────────────────────────────
    if (role === 'warden') {
      const phone = (req.body.phone_number || req.body.phone || req.body.identifier || '').trim();

      if (!phone) {
        return res.status(400).json({
          success: false,
          message: 'Phone Number is required.'
        });
      }

      const warden = await User.findWardenByPhone(phone);
      if (!warden) {
        return res.status(401).json({
          success: false,
          message: 'Invalid phone number or password.'
        });
      }

      const isMatch = await bcrypt.compare(password, warden.password_hash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid phone number or password.'
        });
      }

      const payload = {
        id: warden.id,
        name: warden.name,
        role: 'warden',
        phone: warden.phone || warden.phone_number,
        phone_number: warden.phone || warden.phone_number,
        email: warden.email,
        department: warden.department || 'Chief Warden Office',
        hostel: warden.hostel || 'Bhavani Hostel'
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

      return res.status(200).json({
        success: true,
        message: `Welcome, ${warden.name}!`,
        token,
        user: payload
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Invalid role specified.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Registration Controller for the 3 distinct roles:
 * 1. Student (Full Name, Roll No, DOB, Email, Dept, Hostel, Room No, Password, Re-enter)
 * 2. Care Taker (Name, Email, Phone Number, Password, Re-enter)
 * 3. Warden (Name, Phone Number, Email, Dept, Password, Re-enter)
 */
exports.register = async (req, res, next) => {
  try {
    const role = (req.body.role || 'student').toLowerCase();
    const password = req.body.password || '';
    const confirmPassword = req.body.re_enter_password || req.body.confirm_password || req.body.confirmPassword || '';

    // Validate Password matching
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password and Re-enter Password do not match.'
      });
    }

    // Validate Password security requirements (Requirements 2, 3, 4)
    const pwErr = validatePassword(password);
    if (pwErr) {
      return res.status(400).json({
        success: false,
        message: pwErr
      });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // ─────────────────────────────────────────────────────────────
    // 1. STUDENT REGISTRATION (Requirement 2)
    // ─────────────────────────────────────────────────────────────
    if (role === 'student') {
      const {
        name,
        roll_number,
        roll_no,
        date_of_birth,
        email,
        department,
        hostel,
        room_number,
        room_no
      } = req.body;

      const sName = (name || '').trim();
      const sRoll = (roll_number || roll_no || '').trim().toUpperCase();
      const sDob = (date_of_birth || '').trim();
      const sEmail = (email || '').trim().toLowerCase();
      const sDept = (department || '').trim();
      const sHostel = (hostel || '').trim();
      const sRoom = (room_number || room_no || '').trim();

      if (!sName || !sRoll || !sDob || !sEmail || !sDept || !sHostel || !sRoom) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required. Please fill in all student registration fields.'
        });
      }

      if (!emailRegex.test(sEmail)) {
        return res.status(400).json({
          success: false,
          message: 'Please enter a valid Email ID.'
        });
      }

      const validHostels = ['Amaravathi Hostel', 'Bhavani Hostel', 'Kaveri Hostel'];
      if (!validHostels.includes(sHostel)) {
        return res.status(400).json({
          success: false,
          message: 'Hostel must be Amaravathi Hostel, Bhavani Hostel, or Kaveri Hostel.'
        });
      }

      // Check unique roll number
      const existingStudent = await User.findStudent(sRoll);
      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: `A student with Roll Number ${sRoll} is already registered.`
        });
      }

      const newStudent = await User.createStudent({
        name: sName,
        roll_number: sRoll,
        date_of_birth: sDob,
        email: sEmail,
        department: sDept,
        hostel: sHostel,
        room_number: sRoom,
        password_hash
      });

      return res.status(201).json({
        success: true,
        message: 'Student registered successfully! Please login with your Roll Number, Room Number and Password.',
        user: {
          id: newStudent.id,
          name: newStudent.name,
          role: 'student',
          roll_number: newStudent.roll_number,
          room_number: newStudent.room_number,
          hostel: newStudent.hostel
        }
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 2. CARE TAKER REGISTRATION (Requirement 10)
    // Name, Email ID, Phone Number, Hostel, Password, Re-enter
    // ─────────────────────────────────────────────────────────────
    if (role === 'caretaker' || role === 'care taker') {
      const name = (req.body.name || '').trim();
      const email = (req.body.email || '').trim().toLowerCase();
      const phone = (req.body.phone_number || req.body.phone || '').trim();
      const hostel = (req.body.hostel || '').trim();

      if (!name || !email || !phone || !hostel) {
        return res.status(400).json({
          success: false,
          message: 'Name, Email ID, Phone Number, and Hostel are required for Care Taker registration.'
        });
      }

      const validHostels = ['Amaravathi Hostel', 'Bhavani Hostel', 'Kaveri Hostel'];
      if (!validHostels.includes(hostel)) {
        return res.status(400).json({
          success: false,
          message: 'Hostel must be Amaravathi Hostel, Bhavani Hostel, or Kaveri Hostel.'
        });
      }

      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please enter a valid Email ID.'
        });
      }

      // Check unique phone number
      const existingCaretaker = await User.findCaretakerByPhone(phone);
      if (existingCaretaker) {
        return res.status(400).json({
          success: false,
          message: `A Care Taker with Phone Number ${phone} is already registered.`
        });
      }

      // Check unique email
      const existingCaretakerEmail = await User.findByUsernameOrEmail(email);
      if (existingCaretakerEmail && existingCaretakerEmail.role === 'caretaker') {
        return res.status(400).json({
          success: false,
          message: `A Care Taker with Email ${email} is already registered.`
        });
      }

      const newCaretaker = await User.createCaretaker({
        name,
        email,
        phone_number: phone,
        hostel,
        password_hash
      });

      return res.status(201).json({
        success: true,
        message: 'Care Taker registered successfully! Please login with your Phone Number and Password.',
        user: {
          id: newCaretaker.id,
          name: newCaretaker.name,
          role: 'caretaker',
          phone: newCaretaker.phone_number,
          hostel: newCaretaker.hostel
        }
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 3. WARDEN REGISTRATION (Requirement 10)
    // Name, Phone Number, Email ID, Department, Hostel, Password, Re-enter
    // ─────────────────────────────────────────────────────────────
    if (role === 'warden') {
      const name = (req.body.name || '').trim();
      const phone = (req.body.phone_number || req.body.phone || '').trim();
      const email = (req.body.email || '').trim().toLowerCase();
      const department = (req.body.department || '').trim();
      const hostel = (req.body.hostel || '').trim();

      if (!name || !phone || !email || !department || !hostel) {
        return res.status(400).json({
          success: false,
          message: 'Name, Phone Number, Email ID, Department, and Hostel are required for Warden registration.'
        });
      }

      const validHostels = ['Amaravathi Hostel', 'Bhavani Hostel', 'Kaveri Hostel'];
      if (!validHostels.includes(hostel)) {
        return res.status(400).json({
          success: false,
          message: 'Hostel must be Amaravathi Hostel, Bhavani Hostel, or Kaveri Hostel.'
        });
      }

      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please enter a valid Email ID.'
        });
      }

      // Check unique phone number
      const existingWarden = await User.findWardenByPhone(phone);
      if (existingWarden) {
        return res.status(400).json({
          success: false,
          message: `A Warden with Phone Number ${phone} is already registered.`
        });
      }

      // Check unique email
      const existingWardenEmail = await User.findByUsernameOrEmail(email);
      if (existingWardenEmail && existingWardenEmail.role === 'warden') {
        return res.status(400).json({
          success: false,
          message: `A Warden with Email ${email} is already registered.`
        });
      }

      const newWarden = await User.createWarden({
        name,
        phone_number: phone,
        email,
        department,
        hostel,
        password_hash
      });

      return res.status(201).json({
        success: true,
        message: 'Warden registered successfully! Please login with your Phone Number and Password.',
        user: {
          id: newWarden.id,
          name: newWarden.name,
          role: 'warden',
          phone: newWarden.phone_number,
          department: newWarden.department,
          hostel: newWarden.hostel
        }
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Invalid role specified for registration.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout Controller
 */
exports.logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
};

/**
 * Get Current Logged-in User Profile
 */
exports.getMe = async (req, res, next) => {
  try {
    const userRole = (req.user?.role || '').toLowerCase();
    let user = null;

    if (userRole === 'student' && (req.user?.roll_no || req.user?.roll_number)) {
      user = await User.findStudent(req.user.roll_no || req.user.roll_number);
    } else if (userRole === 'caretaker' && (req.user?.phone || req.user?.phone_number)) {
      user = await User.findCaretakerByPhone(req.user.phone || req.user.phone_number);
    } else if (userRole === 'warden' && (req.user?.phone || req.user?.phone_number)) {
      user = await User.findWardenByPhone(req.user.phone || req.user.phone_number);
    }

    if (!user && req.user?.id) {
      user = await User.findById(req.user.id, userRole);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.'
      });
    }

    const sanitized = {
      id: user.id,
      name: user.name,
      role: user.role || userRole,
      email: user.email,
      phone: user.phone || user.phone_number,
      phone_number: user.phone || user.phone_number,
      roll_no: user.roll_no || user.roll_number,
      roll_number: user.roll_no || user.roll_number,
      date_of_birth: user.date_of_birth,
      room_no: user.room_no || user.room_number,
      room_number: user.room_no || user.room_number,
      department: user.department,
      hostel: user.hostel
    };

    res.status(200).json({
      success: true,
      user: sanitized
    });
  } catch (error) {
    next(error);
  }
};
