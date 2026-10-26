import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Clean Professional SVG Icons (No emojis)
const StudentIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const CaretakerIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const WardenIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const EyeIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export default function AuthPage({ initialTab = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, register } = useAuth();

  // If already logged in, redirect to the correct role dashboard
  useEffect(() => {
    if (user) {
      const role = (user.role || '').toLowerCase();
      if (role === 'caretaker') {
        navigate('/caretaker/dashboard', { replace: true });
      } else if (role === 'warden') {
        navigate('/warden/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  // Tab State: 'login' | 'register'
  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname === '/register' || initialTab === 'register') return 'register';
    return 'login';
  });

  // Selected Role: 'student' | 'caretaker' | 'warden'
  const [selectedRole, setSelectedRole] = useState('student');

  // Password Visibility Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password Input Active/Focus State (Only show requirements checklist while user is entering password)
  const [isEnteringPassword, setIsEnteringPassword] = useState(false);
  const blurTimerRef = React.useRef(null);

  const handlePasswordFocus = () => {
    if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    setIsEnteringPassword(true);
  };

  const handlePasswordBlur = () => {
    if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    blurTimerRef.current = setTimeout(() => {
      setIsEnteringPassword(false);
    }, 200);
  };

  // Status & Feedback Messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // ─────────────────────────────────────────────────────────────
  // 1. LOGIN FORM STATES (3 Distinct Roles)
  // ─────────────────────────────────────────────────────────────
  // Student Login: Roll Number + Room Number + Password
  const [studentLogin, setStudentLogin] = useState({
    roll_number: '',
    room_number: '',
    password: ''
  });

  // Care Taker Login: Phone Number + Password ONLY
  const [caretakerLogin, setCaretakerLogin] = useState({
    phone_number: '',
    password: ''
  });

  // Warden Login: Phone Number + Password ONLY
  const [wardenLogin, setWardenLogin] = useState({
    phone_number: '',
    password: ''
  });

  // ─────────────────────────────────────────────────────────────
  // 2. REGISTRATION FORM STATES (3 Distinct Roles)
  // ─────────────────────────────────────────────────────────────
  // Student Registration: 9 Required Fields
  const [studentReg, setStudentReg] = useState({
    name: '',
    roll_number: '',
    date_of_birth: '',
    email: '',
    department: 'Information Technology',
    hostel: 'Amaravathi Hostel',
    room_number: '',
    password: '',
    re_enter_password: ''
  });

  // Care Taker Registration: Name, Email ID, Phone Number, Hostel, Password, Re-enter
  const [caretakerReg, setCaretakerReg] = useState({
    name: '',
    email: '',
    phone_number: '',
    hostel: 'Amaravathi Hostel',
    password: '',
    re_enter_password: ''
  });

  // Warden Registration: Name, Phone Number, Email ID, Department, Hostel, Password, Re-enter
  const [wardenReg, setWardenReg] = useState({
    name: '',
    phone_number: '',
    email: '',
    department: 'Chief Warden Administration',
    hostel: 'Bhavani Hostel',
    password: '',
    re_enter_password: ''
  });

  // Sync tab with URL if pathname changes
  useEffect(() => {
    if (location.pathname === '/register') {
      setActiveTab('register');
    } else if (location.pathname === '/login' || location.pathname === '/auth') {
      setActiveTab('login');
    }
    setErrorMsg('');
  }, [location.pathname]);

  // Tab switch handler
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setErrorMsg('');
    setSuccessMsg('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsEnteringPassword(false);
    if (tab === 'register') {
      window.history.replaceState(null, '', '/register');
    } else {
      window.history.replaceState(null, '', '/login');
    }
  };

  // Role switch handler
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setErrorMsg('');
    setSuccessMsg('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsEnteringPassword(false);
  };

  // ─────────────────────────────────────────────────────────────
  // ACTIVE PASSWORD CRITERIA EVALUATION
  // ─────────────────────────────────────────────────────────────
  const currentPassword =
    selectedRole === 'student'
      ? studentReg.password
      : selectedRole === 'caretaker'
      ? caretakerReg.password
      : wardenReg.password;

  const currentConfirmPassword =
    selectedRole === 'student'
      ? studentReg.re_enter_password
      : selectedRole === 'caretaker'
      ? caretakerReg.re_enter_password
      : wardenReg.re_enter_password;

  const passwordCriteria = {
    length: currentPassword.length >= 8,
    uppercase: /[A-Z]/.test(currentPassword),
    lowercase: /[a-z]/.test(currentPassword),
    number: /[0-9]/.test(currentPassword),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(currentPassword)
  };

  const isPasswordValid =
    passwordCriteria.length &&
    passwordCriteria.uppercase &&
    passwordCriteria.lowercase &&
    passwordCriteria.number &&
    passwordCriteria.special;

  const passwordsMatch =
    currentPassword &&
    currentConfirmPassword &&
    currentPassword === currentConfirmPassword;

  // ─────────────────────────────────────────────────────────────
  // LOGIN SUBMISSION HANDLERS
  // ─────────────────────────────────────────────────────────────

  // 1. Student Login
  const handleStudentLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!studentLogin.roll_number.trim()) {
      setErrorMsg('Roll Number is required.');
      return;
    }
    if (!studentLogin.room_number.trim()) {
      setErrorMsg('Room Number is required.');
      return;
    }
    if (!studentLogin.password) {
      setErrorMsg('Password is required.');
      return;
    }

    setLoading(true);
    const result = await login({
      role: 'student',
      roll_number: studentLogin.roll_number.trim(),
      room_number: studentLogin.room_number.trim(),
      password: studentLogin.password
    });
    setLoading(false);

    if (result.success) {
      const role = (result.user?.role || 'student').toLowerCase();
      if (role === 'caretaker') navigate('/caretaker/dashboard');
      else if (role === 'warden') navigate('/warden/dashboard');
      else navigate('/student/dashboard');
    } else {
      setErrorMsg(result.message || 'Invalid roll number, room number or password.');
    }
  };

  // 2. Care Taker Login (Phone Number + Password ONLY)
  const handleCaretakerLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!caretakerLogin.phone_number.trim()) {
      setErrorMsg('Phone Number is required.');
      return;
    }
    if (!caretakerLogin.password) {
      setErrorMsg('Password is required.');
      return;
    }

    setLoading(true);
    const result = await login({
      role: 'caretaker',
      phone_number: caretakerLogin.phone_number.trim(),
      password: caretakerLogin.password
    });
    setLoading(false);

    if (result.success) {
      const role = (result.user?.role || 'caretaker').toLowerCase();
      if (role === 'caretaker') navigate('/caretaker/dashboard');
      else if (role === 'warden') navigate('/warden/dashboard');
      else navigate('/student/dashboard');
    } else {
      setErrorMsg(result.message || 'Invalid phone number or password.');
    }
  };

  // 3. Warden Login (Phone Number + Password ONLY)
  const handleWardenLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!wardenLogin.phone_number.trim()) {
      setErrorMsg('Phone Number is required.');
      return;
    }
    if (!wardenLogin.password) {
      setErrorMsg('Password is required.');
      return;
    }

    setLoading(true);
    const result = await login({
      role: 'warden',
      phone_number: wardenLogin.phone_number.trim(),
      password: wardenLogin.password
    });
    setLoading(false);

    if (result.success) {
      const role = (result.user?.role || 'warden').toLowerCase();
      if (role === 'warden') navigate('/warden/dashboard');
      else if (role === 'caretaker') navigate('/caretaker/dashboard');
      else navigate('/student/dashboard');
    } else {
      setErrorMsg(result.message || 'Invalid phone number or password.');
    }
  };

  // ─────────────────────────────────────────────────────────────
  // REGISTRATION SUBMISSION HANDLERS
  // ─────────────────────────────────────────────────────────────

  // 1. Student Registration
  const handleStudentRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (
      !studentReg.name.trim() ||
      !studentReg.roll_number.trim() ||
      !studentReg.date_of_birth ||
      !studentReg.email.trim() ||
      !studentReg.department.trim() ||
      !studentReg.hostel ||
      !studentReg.room_number.trim() ||
      !studentReg.password ||
      !studentReg.re_enter_password
    ) {
      setErrorMsg('All fields are required. Please fill in all student registration fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentReg.email.trim())) {
      setErrorMsg('Please enter a valid Email ID (e.g. student@kongu.edu).');
      return;
    }

    if (!isPasswordValid) {
      setErrorMsg('Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character.');
      return;
    }

    if (!passwordsMatch) {
      setErrorMsg('Password and Re-enter Password must match.');
      return;
    }

    setLoading(true);
    const result = await register({
      role: 'student',
      name: studentReg.name.trim(),
      roll_number: studentReg.roll_number.trim().toUpperCase(),
      date_of_birth: studentReg.date_of_birth,
      email: studentReg.email.trim().toLowerCase(),
      department: studentReg.department.trim(),
      hostel: studentReg.hostel,
      room_number: studentReg.room_number.trim(),
      password: studentReg.password,
      re_enter_password: studentReg.re_enter_password
    });
    setLoading(false);

    if (result.success) {
      setSuccessMsg('Registration successful! Please login with your Roll Number, Room Number and Password.');
      setStudentLogin({
        roll_number: studentReg.roll_number.trim().toUpperCase(),
        room_number: studentReg.room_number.trim(),
        password: ''
      });
      setStudentReg({
        name: '',
        roll_number: '',
        date_of_birth: '',
        email: '',
        department: 'Information Technology',
        hostel: 'Amaravathi Hostel',
        room_number: '',
        password: '',
        re_enter_password: ''
      });
      setSelectedRole('student');
      setActiveTab('login');
      window.history.replaceState(null, '', '/login');
    } else {
      setErrorMsg(result.message || 'Registration failed. Please check your details.');
    }
  };

  // 2. Care Taker Registration (Name, Email, Phone, Password, Re-enter ONLY)
  const handleCaretakerRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (
      !caretakerReg.name.trim() ||
      !caretakerReg.email.trim() ||
      !caretakerReg.phone_number.trim() ||
      !caretakerReg.hostel.trim() ||
      !caretakerReg.password ||
      !caretakerReg.re_enter_password
    ) {
      setErrorMsg('Name, Email ID, Phone Number, Hostel, Password, and Re-enter Password are required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(caretakerReg.email.trim())) {
      setErrorMsg('Please enter a valid Email ID (e.g. caretaker@kongu.edu).');
      return;
    }

    if (!isPasswordValid) {
      setErrorMsg('Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character.');
      return;
    }

    if (!passwordsMatch) {
      setErrorMsg('Password and Re-enter Password must match.');
      return;
    }

    setLoading(true);
    const result = await register({
      role: 'caretaker',
      name: caretakerReg.name.trim(),
      email: caretakerReg.email.trim().toLowerCase(),
      phone_number: caretakerReg.phone_number.trim(),
      hostel: caretakerReg.hostel.trim(),
      password: caretakerReg.password,
      re_enter_password: caretakerReg.re_enter_password
    });
    setLoading(false);

    if (result.success) {
      setSuccessMsg('Care Taker registered successfully! Please login with your Phone Number and Password.');
      setCaretakerLogin({
        phone_number: caretakerReg.phone_number.trim(),
        password: ''
      });
      setCaretakerReg({
        name: '',
        email: '',
        phone_number: '',
        hostel: 'Amaravathi Hostel',
        password: '',
        re_enter_password: ''
      });
      setSelectedRole('caretaker');
      setActiveTab('login');
      window.history.replaceState(null, '', '/login');
    } else {
      setErrorMsg(result.message || 'Registration failed. Please check your details.');
    }
  };

  // 3. Warden Registration (Name, Phone, Email, Department, Hostel, Password, Re-enter)
  const handleWardenRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (
      !wardenReg.name.trim() ||
      !wardenReg.phone_number.trim() ||
      !wardenReg.email.trim() ||
      !wardenReg.department.trim() ||
      !wardenReg.hostel.trim() ||
      !wardenReg.password ||
      !wardenReg.re_enter_password
    ) {
      setErrorMsg('Name, Phone Number, Email ID, Department, Hostel, Password, and Re-enter Password are required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(wardenReg.email.trim())) {
      setErrorMsg('Please enter a valid Email ID (e.g. warden@kongu.edu).');
      return;
    }

    if (!isPasswordValid) {
      setErrorMsg('Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character.');
      return;
    }

    if (!passwordsMatch) {
      setErrorMsg('Password and Re-enter Password must match.');
      return;
    }

    setLoading(true);
    const result = await register({
      role: 'warden',
      name: wardenReg.name.trim(),
      phone_number: wardenReg.phone_number.trim(),
      email: wardenReg.email.trim().toLowerCase(),
      department: wardenReg.department.trim(),
      hostel: wardenReg.hostel.trim(),
      password: wardenReg.password,
      re_enter_password: wardenReg.re_enter_password
    });
    setLoading(false);

    if (result.success) {
      setSuccessMsg('Warden registered successfully! Please login with your Phone Number and Password.');
      setWardenLogin({
        phone_number: wardenReg.phone_number.trim(),
        password: ''
      });
      setWardenReg({
        name: '',
        phone_number: '',
        email: '',
        department: 'Chief Warden Administration',
        hostel: 'Bhavani Hostel',
        password: '',
        re_enter_password: ''
      });
      setSelectedRole('warden');
      setActiveTab('login');
      window.history.replaceState(null, '', '/login');
    } else {
      setErrorMsg(result.message || 'Registration failed. Please check your details.');
    }
  };

  return (
    <div className="auth-fullpage-wrapper">
      <div className="auth-fullpage-container">
        {/* Institutional Campus Header (Clean, professional, without circular badge) */}
        <div className="auth-campus-header">
          <span className="auth-college-title">KONGU ENGINEERING COLLEGE</span>
          <h1 className="auth-system-title">Hostel Management Portal</h1>
          <p className="auth-tagline">
            Residential Accommodation & Digital Gate Pass System
          </p>
        </div>

        {/* Standalone Full-Page Authentication Card */}
        <div className="auth-card-main">
          {/* Main Tabs: LOGIN | REGISTER */}
          <div className="auth-card-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'login'}
              className={`auth-card-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('login')}
            >
              LOGIN
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'register'}
              className={`auth-card-tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('register')}
            >
              REGISTER
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="auth-alert auth-alert-danger" role="alert">
              <span className="auth-alert-text">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="auth-alert auth-alert-success" role="alert">
              <span className="auth-alert-text">{successMsg}</span>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              ROLE SELECTION CARDS (Requirements 1 & 5)
              LOGIN AS / REGISTER AS: [ STUDENT ] [ CARE TAKER ] [ WARDEN ]
             ───────────────────────────────────────────────────────────── */}
          <div className="auth-role-selection-section">
            <div className="auth-role-selection-header">
              <span className="auth-role-selection-label">
                {activeTab === 'login' ? 'LOGIN AS' : 'REGISTER AS'}
              </span>
              <span className="auth-role-instruction-text">
                Select your designated role to continue
              </span>
            </div>

            <div className="auth-role-cards-grid">
              {/* Box 1: STUDENT */}
              <button
                type="button"
                className={`auth-role-card ${selectedRole === 'student' ? 'active' : ''}`}
                onClick={() => handleRoleSelect('student')}
                aria-pressed={selectedRole === 'student'}
              >
                <div className="auth-role-icon-box">
                  <StudentIcon />
                </div>
                <div className="auth-role-info">
                  <div className="auth-role-title">STUDENT</div>
                  <div className="auth-role-desc">Residential Student</div>
                </div>
              </button>

              {/* Box 2: CARE TAKER */}
              <button
                type="button"
                className={`auth-role-card ${selectedRole === 'caretaker' ? 'active' : ''}`}
                onClick={() => handleRoleSelect('caretaker')}
                aria-pressed={selectedRole === 'caretaker'}
              >
                <div className="auth-role-icon-box">
                  <CaretakerIcon />
                </div>
                <div className="auth-role-info">
                  <div className="auth-role-title">CARE TAKER</div>
                  <div className="auth-role-desc">Hostel Block Care Taker</div>
                </div>
              </button>

              {/* Box 3: WARDEN */}
              <button
                type="button"
                className={`auth-role-card ${selectedRole === 'warden' ? 'active' : ''}`}
                onClick={() => handleRoleSelect('warden')}
                aria-pressed={selectedRole === 'warden'}
              >
                <div className="auth-role-icon-box">
                  <WardenIcon />
                </div>
                <div className="auth-role-info">
                  <div className="auth-role-title">WARDEN</div>
                  <div className="auth-role-desc">Chief / Deputy Warden</div>
                </div>
              </button>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              VIEW 1: LOGIN FORMS (Requirement 6, 7, 8)
             ───────────────────────────────────────────────────────────── */}
          {activeTab === 'login' && (
            <div className="auth-card-content">
              {/* 1A. STUDENT LOGIN */}
              {selectedRole === 'student' && (
                <>
                  <div className="auth-form-heading">
                    <h2>Student Portal Login</h2>
                    <p>Enter your assigned residential credentials to access your portal</p>
                  </div>

                  <form onSubmit={handleStudentLoginSubmit} className="auth-form-layout" noValidate>
                    {/* 1. Roll Number */}
                    <div className="auth-input-group">
                      <label htmlFor="login-student-roll">
                        Roll Number <span className="auth-req-star">*</span>
                      </label>
                      <input
                        id="login-student-roll"
                        type="text"
                        className="auth-input-field"
                        placeholder="Enter Roll Number"
                        value={studentLogin.roll_number}
                        onChange={(e) =>
                          setStudentLogin({ ...studentLogin, roll_number: e.target.value.toUpperCase() })
                        }
                        autoComplete="username"
                        required
                      />
                    </div>

                    {/* 2. Room Number */}
                    <div className="auth-input-group">
                      <label htmlFor="login-student-room">
                        Room Number <span className="auth-req-star">*</span>
                      </label>
                      <input
                        id="login-student-room"
                        type="text"
                        className="auth-input-field"
                        placeholder="Enter Room Number"
                        value={studentLogin.room_number}
                        onChange={(e) =>
                          setStudentLogin({ ...studentLogin, room_number: e.target.value })
                        }
                        required
                      />
                    </div>

                    {/* 3. Password */}
                    <div className="auth-input-group">
                      <label htmlFor="login-student-password">
                        Password <span className="auth-req-star">*</span>
                      </label>
                      <div className="auth-input-wrapper">
                        <input
                          id="login-student-password"
                          type={showPassword ? 'text' : 'password'}
                          className="auth-input-field"
                          placeholder="Enter your student password"
                          value={studentLogin.password}
                          onChange={(e) =>
                            setStudentLogin({ ...studentLogin, password: e.target.value })
                          }
                          autoComplete="current-password"
                          required
                        />
                        <button
                          type="button"
                          className="auth-pw-toggle-btn"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="auth-submit-btn auth-btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Authenticating...' : 'LOGIN'}
                    </button>
                  </form>

                  <div className="auth-card-footer">
                    <p className="auth-footer-text">
                      New student?{' '}
                      <button
                        type="button"
                        className="auth-link-btn"
                        onClick={() => {
                          setSelectedRole('student');
                          handleTabSwitch('register');
                        }}
                      >
                        Register as Student
                      </button>
                    </p>
                  </div>
                </>
              )}

              {/* 1B. CARE TAKER LOGIN (Requirement 7: Phone Number + Password ONLY) */}
              {selectedRole === 'caretaker' && (
                <>
                  <div className="auth-form-heading">
                    <h2>Care Taker Portal Login</h2>
                    <p>Enter your registered mobile phone number and password to access the Care Taker portal</p>
                  </div>

                  <form onSubmit={handleCaretakerLoginSubmit} className="auth-form-layout" noValidate>
                    {/* 1. Phone Number */}
                    <div className="auth-input-group">
                      <label htmlFor="login-caretaker-phone">
                        Phone Number <span className="auth-req-star">*</span>
                      </label>
                      <input
                        id="login-caretaker-phone"
                        type="tel"
                        className="auth-input-field"
                        placeholder="Enter Phone Number"
                        value={caretakerLogin.phone_number}
                        onChange={(e) =>
                          setCaretakerLogin({ ...caretakerLogin, phone_number: e.target.value })
                        }
                        autoComplete="tel"
                        required
                      />
                    </div>

                    {/* 2. Password */}
                    <div className="auth-input-group">
                      <label htmlFor="login-caretaker-password">
                        Password <span className="auth-req-star">*</span>
                      </label>
                      <div className="auth-input-wrapper">
                        <input
                          id="login-caretaker-password"
                          type={showPassword ? 'text' : 'password'}
                          className="auth-input-field"
                          placeholder="Enter your care taker password"
                          value={caretakerLogin.password}
                          onChange={(e) =>
                            setCaretakerLogin({ ...caretakerLogin, password: e.target.value })
                          }
                          autoComplete="current-password"
                          required
                        />
                        <button
                          type="button"
                          className="auth-pw-toggle-btn"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="auth-submit-btn auth-btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Authenticating Care Taker...' : 'LOGIN'}
                    </button>
                  </form>

                  <div className="auth-card-footer">
                    <p className="auth-footer-text">
                      New care taker?{' '}
                      <button
                        type="button"
                        className="auth-link-btn"
                        onClick={() => {
                          setSelectedRole('caretaker');
                          handleTabSwitch('register');
                        }}
                      >
                        Register as Care Taker
                      </button>
                    </p>
                  </div>
                </>
              )}

              {/* 1C. WARDEN LOGIN (Requirement 8: Phone Number + Password ONLY) */}
              {selectedRole === 'warden' && (
                <>
                  <div className="auth-form-heading">
                    <h2>Warden Administration Login</h2>
                    <p>Enter your registered mobile phone number and password to access the Warden portal</p>
                  </div>

                  <form onSubmit={handleWardenLoginSubmit} className="auth-form-layout" noValidate>
                    {/* 1. Phone Number */}
                    <div className="auth-input-group">
                      <label htmlFor="login-warden-phone">
                        Phone Number <span className="auth-req-star">*</span>
                      </label>
                      <input
                        id="login-warden-phone"
                        type="tel"
                        className="auth-input-field"
                        placeholder="Enter Phone Number"
                        value={wardenLogin.phone_number}
                        onChange={(e) =>
                          setWardenLogin({ ...wardenLogin, phone_number: e.target.value })
                        }
                        autoComplete="tel"
                        required
                      />
                    </div>

                    {/* 2. Password */}
                    <div className="auth-input-group">
                      <label htmlFor="login-warden-password">
                        Password <span className="auth-req-star">*</span>
                      </label>
                      <div className="auth-input-wrapper">
                        <input
                          id="login-warden-password"
                          type={showPassword ? 'text' : 'password'}
                          className="auth-input-field"
                          placeholder="Enter your warden password"
                          value={wardenLogin.password}
                          onChange={(e) =>
                            setWardenLogin({ ...wardenLogin, password: e.target.value })
                          }
                          autoComplete="current-password"
                          required
                        />
                        <button
                          type="button"
                          className="auth-pw-toggle-btn"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="auth-submit-btn auth-btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Authenticating Warden...' : 'LOGIN'}
                    </button>
                  </form>

                  <div className="auth-card-footer">
                    <p className="auth-footer-text">
                      New warden?{' '}
                      <button
                        type="button"
                        className="auth-link-btn"
                        onClick={() => {
                          setSelectedRole('warden');
                          handleTabSwitch('register');
                        }}
                      >
                        Register as Warden
                      </button>
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              VIEW 2: REGISTRATION FORMS (Requirement 2, 3, 4)
             ───────────────────────────────────────────────────────────── */}
          {activeTab === 'register' && (
            <div className="auth-card-content">
              {/* 2A. STUDENT REGISTRATION (Requirement 2: 9 Required Fields) */}
              {selectedRole === 'student' && (
                <>
                  <div className="auth-form-heading">
                    <h2>Student Registration</h2>
                    <p>Enter your student and residential details to create your hostel account</p>
                  </div>

                  <form onSubmit={handleStudentRegisterSubmit} className="auth-form-layout" noValidate>
                    {/* Row 1: Full Name & Roll Number */}
                    <div className="auth-grid-2">
                      <div className="auth-input-group">
                        <label htmlFor="reg-student-name">
                          1. Full Name <span className="auth-req-star">*</span>
                        </label>
                        <input
                          id="reg-student-name"
                          type="text"
                          className="auth-input-field"
                          placeholder="Enter Full Name"
                          value={studentReg.name}
                          onChange={(e) => setStudentReg({ ...studentReg, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="auth-input-group">
                        <label htmlFor="reg-student-roll">
                          2. Roll Number <span className="auth-req-star">*</span>
                        </label>
                        <input
                          id="reg-student-roll"
                          type="text"
                          className="auth-input-field"
                          placeholder="Enter Roll Number"
                          value={studentReg.roll_number}
                          onChange={(e) =>
                            setStudentReg({ ...studentReg, roll_number: e.target.value.toUpperCase() })
                          }
                          required
                        />
                      </div>
                    </div>

                    {/* Row 2: Date of Birth & Email ID */}
                    <div className="auth-grid-2">
                      <div className="auth-input-group">
                        <label htmlFor="reg-student-dob">
                          3. Date of Birth <span className="auth-req-star">*</span>
                        </label>
                        <input
                          id="reg-student-dob"
                          type="date"
                          className="auth-input-field"
                          value={studentReg.date_of_birth}
                          onChange={(e) =>
                            setStudentReg({ ...studentReg, date_of_birth: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="auth-input-group">
                        <label htmlFor="reg-student-email">
                          4. Email ID <span className="auth-req-star">*</span>
                        </label>
                        <input
                          id="reg-student-email"
                          type="email"
                          className="auth-input-field"
                          placeholder="Enter Email ID"
                          value={studentReg.email}
                          onChange={(e) => setStudentReg({ ...studentReg, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {/* Row 3: Department */}
                    <div className="auth-input-group">
                      <label htmlFor="reg-student-dept">
                        5. Department <span className="auth-req-star">*</span>
                      </label>
                      <select
                        id="reg-student-dept"
                        className="auth-input-field"
                        value={studentReg.department}
                        onChange={(e) => setStudentReg({ ...studentReg, department: e.target.value })}
                        required
                      >
                        <option value="Information Technology">Information Technology</option>
                        <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                        <option value="Artificial Intelligence and Data Science">Artificial Intelligence & Data Science</option>
                        <option value="Electronics and Communication Engineering">Electronics & Communication Engineering</option>
                        <option value="Electrical and Electronics Engineering">Electrical & Electronics Engineering</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Civil Engineering">Civil Engineering</option>
                        <option value="Chemical Engineering">Chemical Engineering</option>
                        <option value="Mechatronics Engineering">Mechatronics Engineering</option>
                        <option value="Food Technology">Food Technology</option>
                      </select>
                    </div>

                    {/* Row 4: Hostel Dropdown & Room Number */}
                    <div className="auth-grid-2">
                      <div className="auth-input-group">
                        <label htmlFor="reg-student-hostel">
                          6. Hostel <span className="auth-req-star">*</span>
                        </label>
                        <select
                          id="reg-student-hostel"
                          className="auth-input-field"
                          value={studentReg.hostel}
                          onChange={(e) => setStudentReg({ ...studentReg, hostel: e.target.value })}
                          required
                        >
                          <option value="Amaravathi Hostel">Amaravathi Hostel</option>
                          <option value="Bhavani Hostel">Bhavani Hostel</option>
                          <option value="Kaveri Hostel">Kaveri Hostel</option>
                        </select>
                      </div>

                      <div className="auth-input-group">
                        <label htmlFor="reg-student-room">
                          7. Room Number <span className="auth-req-star">*</span>
                        </label>
                        <input
                          id="reg-student-room"
                          type="text"
                          className="auth-input-field"
                          placeholder="Enter Room Number"
                          value={studentReg.room_number}
                          onChange={(e) => setStudentReg({ ...studentReg, room_number: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {/* Row 5: Password & Re-enter Password */}
                    <div className="auth-grid-2">
                      <div className="auth-input-group">
                        <label htmlFor="reg-student-pw">
                          8. Password <span className="auth-req-star">*</span>
                        </label>
                        <div className="auth-input-wrapper">
                          <input
                            id="reg-student-pw"
                            type={showPassword ? 'text' : 'password'}
                            className="auth-input-field"
                            placeholder="Create password"
                            value={studentReg.password}
                            onFocus={handlePasswordFocus}
                            onBlur={handlePasswordBlur}
                            onChange={(e) => {
                              setStudentReg({ ...studentReg, password: e.target.value });
                              setIsEnteringPassword(true);
                            }}
                            autoComplete="new-password"
                            required
                          />
                          <button
                            type="button"
                            className="auth-pw-toggle-btn"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                          </button>
                        </div>
                      </div>

                      <div className="auth-input-group">
                        <label htmlFor="reg-student-pw-confirm">
                          9. Re-enter Password <span className="auth-req-star">*</span>
                        </label>
                        <div className="auth-input-wrapper">
                          <input
                            id="reg-student-pw-confirm"
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="auth-input-field"
                            placeholder="Re-enter password"
                            value={studentReg.re_enter_password}
                            onFocus={handlePasswordFocus}
                            onBlur={handlePasswordBlur}
                            onChange={(e) => {
                              setStudentReg({ ...studentReg, re_enter_password: e.target.value });
                              setIsEnteringPassword(true);
                            }}
                            autoComplete="new-password"
                            required
                          />
                          <button
                            type="button"
                            className="auth-pw-toggle-btn"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                          >
                            {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Password Criteria Checklist (Only displayed while user is entering password) */}
                    {isEnteringPassword && (
                      <div className="auth-pw-requirements-card">
                        <div className="auth-pw-req-header">
                          <strong>Password Requirements</strong>
                          <span className="auth-pw-example-tag">Secure Format</span>
                        </div>
                        <ul className="auth-pw-checklist">
                          <li className={passwordCriteria.length ? 'valid' : 'invalid'}>
                            <span className="check-bullet">{passwordCriteria.length ? '✓' : '—'}</span>
                            Minimum 8 characters
                          </li>
                          <li className={passwordCriteria.uppercase ? 'valid' : 'invalid'}>
                            <span className="check-bullet">{passwordCriteria.uppercase ? '✓' : '—'}</span>
                            At least 1 uppercase letter
                          </li>
                          <li className={passwordCriteria.lowercase ? 'valid' : 'invalid'}>
                            <span className="check-bullet">{passwordCriteria.lowercase ? '✓' : '—'}</span>
                            At least 1 lowercase letter
                          </li>
                          <li className={passwordCriteria.number ? 'valid' : 'invalid'}>
                            <span className="check-bullet">{passwordCriteria.number ? '✓' : '—'}</span>
                            At least 1 number
                          </li>
                          <li className={passwordCriteria.special ? 'valid' : 'invalid'}>
                            <span className="check-bullet">{passwordCriteria.special ? '✓' : '—'}</span>
                            At least 1 special character
                          </li>
                          {studentReg.re_enter_password && (
                            <li className={passwordsMatch ? 'valid' : 'invalid'}>
                              <span className="check-bullet">{passwordsMatch ? '✓' : '✕'}</span>
                              Passwords match
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="auth-submit-btn auth-btn-success"
                      disabled={loading}
                    >
                      {loading ? 'Registering Student...' : 'REGISTER'}
                    </button>
                  </form>

                  <div className="auth-card-footer">
                    <p className="auth-footer-text">
                      Already registered?{' '}
                      <button
                        type="button"
                        className="auth-link-btn"
                        onClick={() => {
                          setSelectedRole('student');
                          handleTabSwitch('login');
                        }}
                      >
                        Login here
                      </button>
                    </p>
                  </div>
                </>
              )}

              {/* 2B. CARE TAKER REGISTRATION (Requirement 3: ONLY 5 Fields) */}
              {selectedRole === 'caretaker' && (
                <>
                  <div className="auth-form-heading">
                    <h2>Care Taker Registration</h2>
                    <p>Register as a hostel block care taker to manage maintenance and student affairs</p>
                  </div>

                  <form onSubmit={handleCaretakerRegisterSubmit} className="auth-form-layout" noValidate>
                    {/* 1. Name */}
                    <div className="auth-input-group">
                      <label htmlFor="reg-caretaker-name">
                        1. Name <span className="auth-req-star">*</span>
                      </label>
                      <input
                        id="reg-caretaker-name"
                        type="text"
                        className="auth-input-field"
                        placeholder="Enter Name"
                        value={caretakerReg.name}
                        onChange={(e) => setCaretakerReg({ ...caretakerReg, name: e.target.value })}
                        required
                      />
                    </div>

                    {/* Row 2: Email ID & Phone Number */}
                    <div className="auth-grid-2">
                      <div className="auth-input-group">
                        <label htmlFor="reg-caretaker-email">
                          2. Email ID <span className="auth-req-star">*</span>
                        </label>
                        <input
                          id="reg-caretaker-email"
                          type="email"
                          className="auth-input-field"
                          placeholder="Enter Email ID"
                          value={caretakerReg.email}
                          onChange={(e) => setCaretakerReg({ ...caretakerReg, email: e.target.value })}
                          required
                        />
                      </div>

                      <div className="auth-input-group">
                        <label htmlFor="reg-caretaker-phone">
                          3. Phone Number <span className="auth-req-star">*</span>
                        </label>
                        <input
                          id="reg-caretaker-phone"
                          type="tel"
                          className="auth-input-field"
                          placeholder="Enter Phone Number"
                          value={caretakerReg.phone_number}
                          onChange={(e) =>
                            setCaretakerReg({ ...caretakerReg, phone_number: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    {/* Row 3: Hostel Selection */}
                    <div className="auth-input-group">
                      <label htmlFor="reg-caretaker-hostel">
                        4. Assigned Hostel <span className="auth-req-star">*</span>
                      </label>
                      <select
                        id="reg-caretaker-hostel"
                        className="auth-input-field"
                        value={caretakerReg.hostel}
                        onChange={(e) => setCaretakerReg({ ...caretakerReg, hostel: e.target.value })}
                        required
                      >
                        <option value="Amaravathi Hostel">Amaravathi Hostel</option>
                        <option value="Bhavani Hostel">Bhavani Hostel</option>
                        <option value="Kaveri Hostel">Kaveri Hostel</option>
                      </select>
                    </div>

                    {/* Row 4: Password & Re-enter Password */}
                    <div className="auth-grid-2">
                      <div className="auth-input-group">
                        <label htmlFor="reg-caretaker-pw">
                          5. Password <span className="auth-req-star">*</span>
                        </label>
                        <div className="auth-input-wrapper">
                          <input
                            id="reg-caretaker-pw"
                            type={showPassword ? 'text' : 'password'}
                            className="auth-input-field"
                            placeholder="Create password"
                            value={caretakerReg.password}
                            onFocus={handlePasswordFocus}
                            onBlur={handlePasswordBlur}
                            onChange={(e) => {
                              setCaretakerReg({ ...caretakerReg, password: e.target.value });
                              setIsEnteringPassword(true);
                            }}
                            autoComplete="new-password"
                            required
                          />
                          <button
                            type="button"
                            className="auth-pw-toggle-btn"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                          </button>
                        </div>
                      </div>

                      <div className="auth-input-group">
                        <label htmlFor="reg-caretaker-pw-confirm">
                          6. Re-enter Password <span className="auth-req-star">*</span>
                        </label>
                        <div className="auth-input-wrapper">
                          <input
                            id="reg-caretaker-pw-confirm"
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="auth-input-field"
                            placeholder="Re-enter password"
                            value={caretakerReg.re_enter_password}
                            onFocus={handlePasswordFocus}
                            onBlur={handlePasswordBlur}
                            onChange={(e) => {
                              setCaretakerReg({ ...caretakerReg, re_enter_password: e.target.value });
                              setIsEnteringPassword(true);
                            }}
                            autoComplete="new-password"
                            required
                          />
                          <button
                            type="button"
                            className="auth-pw-toggle-btn"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                          >
                            {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Password Criteria Checklist (Only displayed while user is entering password) */}
                    {isEnteringPassword && (
                      <div className="auth-pw-requirements-card">
                        <div className="auth-pw-req-header">
                          <strong>Password Requirements</strong>
                          <span className="auth-pw-example-tag">Secure Format</span>
                        </div>
                        <ul className="auth-pw-checklist">
                          <li className={passwordCriteria.length ? 'valid' : 'invalid'}>
                            <span className="check-bullet">{passwordCriteria.length ? '✓' : '—'}</span>
                            Minimum 8 characters
                          </li>
                          <li className={passwordCriteria.uppercase ? 'valid' : 'invalid'}>
                            <span className="check-bullet">{passwordCriteria.uppercase ? '✓' : '—'}</span>
                            At least 1 uppercase letter
                          </li>
                          <li className={passwordCriteria.lowercase ? 'valid' : 'invalid'}>
                            <span className="check-bullet">{passwordCriteria.lowercase ? '✓' : '—'}</span>
                            At least 1 lowercase letter
                          </li>
                          <li className={passwordCriteria.number ? 'valid' : 'invalid'}>
                            <span className="check-bullet">{passwordCriteria.number ? '✓' : '—'}</span>
                            At least 1 number
                          </li>
                          <li className={passwordCriteria.special ? 'valid' : 'invalid'}>
                            <span className="check-bullet">{passwordCriteria.special ? '✓' : '—'}</span>
                            At least 1 special character
                          </li>
                          {caretakerReg.re_enter_password && (
                            <li className={passwordsMatch ? 'valid' : 'invalid'}>
                              <span className="check-bullet">{passwordsMatch ? '✓' : '✕'}</span>
                              Passwords match
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="auth-submit-btn auth-btn-success"
                      disabled={loading}
                    >
                      {loading ? 'Registering Care Taker...' : 'REGISTER'}
                    </button>
                  </form>

                  <div className="auth-card-footer">
                    <p className="auth-footer-text">
                      Already registered?{' '}
                      <button
                        type="button"
                        className="auth-link-btn"
                        onClick={() => {
                          setSelectedRole('caretaker');
                          handleTabSwitch('login');
                        }}
                      >
                        Login here
                      </button>
                    </p>
                  </div>
                </>
              )}

              {/* 2C. WARDEN REGISTRATION (Requirement 4: ONLY 6 Fields) */}
              {selectedRole === 'warden' && (
                <>
                  <div className="auth-form-heading">
                    <h2>Warden Registration</h2>
                    <p>Register as a hostel warden to manage digital gate passes, leaves, and discipline</p>
                  </div>

                  <form onSubmit={handleWardenRegisterSubmit} className="auth-form-layout" noValidate>
                    {/* Row 1: Name & Phone Number */}
                    <div className="auth-grid-2">
                      <div className="auth-input-group">
                        <label htmlFor="reg-warden-name">
                          1. Name <span className="auth-req-star">*</span>
                        </label>
                        <input
                          id="reg-warden-name"
                          type="text"
                          className="auth-input-field"
                          placeholder="Enter Name"
                          value={wardenReg.name}
                          onChange={(e) => setWardenReg({ ...wardenReg, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="auth-input-group">
                        <label htmlFor="reg-warden-phone">
                          2. Phone Number <span className="auth-req-star">*</span>
                        </label>
                        <input
                          id="reg-warden-phone"
                          type="tel"
                          className="auth-input-field"
                          placeholder="Enter Phone Number"
                          value={wardenReg.phone_number}
                          onChange={(e) => setWardenReg({ ...wardenReg, phone_number: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {/* Row 2: Email ID & Department */}
                    <div className="auth-grid-2">
                      <div className="auth-input-group">
                        <label htmlFor="reg-warden-email">
                          3. Email ID <span className="auth-req-star">*</span>
                        </label>
                        <input
                          id="reg-warden-email"
                          type="email"
                          className="auth-input-field"
                          placeholder="Enter Email ID"
                          value={wardenReg.email}
                          onChange={(e) => setWardenReg({ ...wardenReg, email: e.target.value })}
                          required
                        />
                      </div>

                      <div className="auth-input-group">
                        <label htmlFor="reg-warden-dept">
                          4. Department <span className="auth-req-star">*</span>
                        </label>
                        <input
                          id="reg-warden-dept"
                          type="text"
                          className="auth-input-field"
                          placeholder="Enter Department"
                          value={wardenReg.department}
                          onChange={(e) => setWardenReg({ ...wardenReg, department: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {/* Row 3: Assigned Hostel */}
                    <div className="auth-input-group">
                      <label htmlFor="reg-warden-hostel">
                        5. Assigned Hostel <span className="auth-req-star">*</span>
                      </label>
                      <select
                        id="reg-warden-hostel"
                        className="auth-input-field"
                        value={wardenReg.hostel}
                        onChange={(e) => setWardenReg({ ...wardenReg, hostel: e.target.value })}
                        required
                      >
                        <option value="Amaravathi Hostel">Amaravathi Hostel</option>
                        <option value="Bhavani Hostel">Bhavani Hostel</option>
                        <option value="Kaveri Hostel">Kaveri Hostel</option>
                      </select>
                    </div>

                    {/* Row 4: Password & Re-enter Password */}
                    <div className="auth-grid-2">
                      <div className="auth-input-group">
                        <label htmlFor="reg-warden-pw">
                          6. Password <span className="auth-req-star">*</span>
                        </label>
                        <div className="auth-input-wrapper">
                          <input
                            id="reg-warden-pw"
                            type={showPassword ? 'text' : 'password'}
                            className="auth-input-field"
                            placeholder="Create password"
                            value={wardenReg.password}
                            onFocus={handlePasswordFocus}
                            onBlur={handlePasswordBlur}
                            onChange={(e) => {
                              setWardenReg({ ...wardenReg, password: e.target.value });
                              setIsEnteringPassword(true);
                            }}
                            autoComplete="new-password"
                            required
                          />
                          <button
                            type="button"
                            className="auth-pw-toggle-btn"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                          </button>
                        </div>
                      </div>

                      <div className="auth-input-group">
                        <label htmlFor="reg-warden-pw-confirm">
                          7. Re-enter Password <span className="auth-req-star">*</span>
                        </label>
                        <div className="auth-input-wrapper">
                          <input
                            id="reg-warden-pw-confirm"
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="auth-input-field"
                            placeholder="Re-enter password"
                            value={wardenReg.re_enter_password}
                            onFocus={handlePasswordFocus}
                            onBlur={handlePasswordBlur}
                            onChange={(e) => {
                              setWardenReg({ ...wardenReg, re_enter_password: e.target.value });
                              setIsEnteringPassword(true);
                            }}
                            autoComplete="new-password"
                            required
                          />
                          <button
                            type="button"
                            className="auth-pw-toggle-btn"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                          >
                            {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Password Criteria Checklist (Only displayed while user is entering password) */}
                    {isEnteringPassword && (
                      <div className="auth-pw-requirements-card">
                        <div className="auth-pw-req-header">
                          <strong>Password Requirements</strong>
                          <span className="auth-pw-example-tag">Secure Format</span>
                        </div>
                        <ul className="auth-pw-checklist">
                          <li className={passwordCriteria.length ? 'valid' : 'invalid'}>
                            <span className="check-bullet">{passwordCriteria.length ? '✓' : '—'}</span>
                            Minimum 8 characters
                          </li>
                          <li className={passwordCriteria.uppercase ? 'valid' : 'invalid'}>
                            <span className="check-bullet">{passwordCriteria.uppercase ? '✓' : '—'}</span>
                            At least 1 uppercase letter
                          </li>
                          <li className={passwordCriteria.lowercase ? 'valid' : 'invalid'}>
                            <span className="check-bullet">{passwordCriteria.lowercase ? '✓' : '—'}</span>
                            At least 1 lowercase letter
                          </li>
                          <li className={passwordCriteria.number ? 'valid' : 'invalid'}>
                            <span className="check-bullet">{passwordCriteria.number ? '✓' : '—'}</span>
                            At least 1 number
                          </li>
                          <li className={passwordCriteria.special ? 'valid' : 'invalid'}>
                            <span className="check-bullet">{passwordCriteria.special ? '✓' : '—'}</span>
                            At least 1 special character
                          </li>
                          {wardenReg.re_enter_password && (
                            <li className={passwordsMatch ? 'valid' : 'invalid'}>
                              <span className="check-bullet">{passwordsMatch ? '✓' : '✕'}</span>
                              Passwords match
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="auth-submit-btn auth-btn-success"
                      disabled={loading}
                    >
                      {loading ? 'Registering Warden...' : 'REGISTER'}
                    </button>
                  </form>

                  <div className="auth-card-footer">
                    <p className="auth-footer-text">
                      Already registered?{' '}
                      <button
                        type="button"
                        className="auth-link-btn"
                        onClick={() => {
                          setSelectedRole('warden');
                          handleTabSwitch('login');
                        }}
                      >
                        Login here
                      </button>
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Clean Bottom Campus Security Note (No emojis) */}
        <div className="auth-page-footer-note">
          <span>Kongu Engineering College Secure Portal Gateway</span>
          <span>•</span>
          <span>Perundurai, Erode - 638060</span>
        </div>
      </div>
    </div>
  );
}
