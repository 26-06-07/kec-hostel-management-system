const API = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${API}${endpoint}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message || `HTTP ${res.status}`);
    error.data = data;
    error.status = res.status;
    throw error;
  }
  return data;
}

async function runTests() {
  console.log('====================================================');
  console.log('RUNNING COMPREHENSIVE ROLE & DATA ISOLATION TESTS');
  console.log('====================================================\n');

  const timestamp = Date.now().toString().slice(-4);
  const password = 'Password@123';

  // ─────────────────────────────────────────────────────────────
  // TEST 1: Register Student (Bhavani Hostel) & Login
  // ─────────────────────────────────────────────────────────────
  console.log('--- TEST 1: Register & Login Student (Bhavani Hostel) ---');
  const studentRoll = `25TEST${timestamp}`;
  const studentEmail = `student${timestamp}@kongu.edu`;
  const studentRoom = `B-${timestamp.slice(-2)}`;

  const regStudentRes = await request('/auth/register', {
    method: 'POST',
    body: {
      role: 'student',
      name: 'Swetha B',
      roll_number: studentRoll,
      date_of_birth: '2005-04-12',
      email: studentEmail,
      department: 'Computer Science and Engineering',
      hostel: 'Bhavani Hostel',
      room_number: studentRoom,
      password: password,
      re_enter_password: password
    }
  });
  console.log('Student Registration:', regStudentRes.message);

  const loginStudentRes = await request('/auth/login', {
    method: 'POST',
    body: {
      role: 'student',
      roll_number: studentRoll,
      room_number: studentRoom,
      password: password
    }
  });

  const studentToken = loginStudentRes.token;
  const studentUser = loginStudentRes.user;
  console.log(`Student Login Successful: Role = "${studentUser.role}", Hostel = "${studentUser.hostel}"`);
  if (studentUser.role !== 'student') throw new Error('Expected student role!');

  // Verify /auth/me returns student role
  const meStudent = await request('/auth/me', {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  console.log(`Student /auth/me Verified: Role = "${meStudent.user.role}", Hostel = "${meStudent.user.hostel}"`);
  if (meStudent.user.role !== 'student') throw new Error('Expected student from /auth/me');
  console.log('✓ TEST 1 PASSED: Student successfully routed to Student Dashboard (role: student).\n');

  // Also create Kaveri and Amaravathi students for isolation testing
  const kaveriStudentRoll = `25KAV${timestamp}`;
  await request('/auth/register', {
    method: 'POST',
    body: {
      role: 'student',
      name: 'Kaveri Student',
      roll_number: kaveriStudentRoll,
      date_of_birth: '2005-02-10',
      email: `kaveri${timestamp}@kongu.edu`,
      department: 'Information Technology',
      hostel: 'Kaveri Hostel',
      room_number: 'K-101',
      password: password,
      re_enter_password: password
    }
  });
  const kaveriLogin = await request('/auth/login', {
    method: 'POST',
    body: {
      role: 'student',
      roll_number: kaveriStudentRoll,
      room_number: 'K-101',
      password: password
    }
  });
  const kaveriStudentToken = kaveriLogin.token;

  const amaravathiStudentRoll = `25AMA${timestamp}`;
  await request('/auth/register', {
    method: 'POST',
    body: {
      role: 'student',
      name: 'Amaravathi Student',
      roll_number: amaravathiStudentRoll,
      date_of_birth: '2005-03-15',
      email: `amaravathi${timestamp}@kongu.edu`,
      department: 'Civil Engineering',
      hostel: 'Amaravathi Hostel',
      room_number: 'A-102',
      password: password,
      re_enter_password: password
    }
  });
  const amaravathiLogin = await request('/auth/login', {
    method: 'POST',
    body: {
      role: 'student',
      roll_number: amaravathiStudentRoll,
      room_number: 'A-102',
      password: password
    }
  });
  const amaravathiStudentToken = amaravathiLogin.token;

  // ─────────────────────────────────────────────────────────────
  // TEST 2: Register Care Taker (Bhavani Hostel) & Login
  // ─────────────────────────────────────────────────────────────
  console.log('--- TEST 2: Register & Login Care Taker (Bhavani Hostel) ---');
  const ctPhone = `9842${timestamp}01`;
  const ctEmail = `caretaker${timestamp}@kongu.edu`;

  const regCtRes = await request('/auth/register', {
    method: 'POST',
    body: {
      role: 'caretaker',
      name: 'Ravi (Bhavani CT)',
      email: ctEmail,
      phone_number: ctPhone,
      hostel: 'Bhavani Hostel',
      password: password,
      re_enter_password: password
    }
  });
  console.log('Care Taker Registration:', regCtRes.message);

  const loginCtRes = await request('/auth/login', {
    method: 'POST',
    body: {
      role: 'caretaker',
      phone_number: ctPhone,
      password: password
    }
  });

  const ctToken = loginCtRes.token;
  const ctUser = loginCtRes.user;
  console.log(`Care Taker Login: Role = "${ctUser.role}", Hostel = "${ctUser.hostel}"`);
  if (ctUser.role !== 'caretaker') throw new Error('Expected caretaker role!');

  // Verify /auth/me returns caretaker role, not student
  const meCt = await request('/auth/me', {
    headers: { Authorization: `Bearer ${ctToken}` }
  });
  console.log(`Care Taker /auth/me: Role = "${meCt.user.role}", Hostel = "${meCt.user.hostel}"`);
  if (meCt.user.role !== 'caretaker') throw new Error('Care Taker must NOT receive student role!');
  console.log('✓ TEST 2 PASSED: Care Taker routed to Care Taker Dashboard (role: caretaker, NOT student).\n');

  // Register Kaveri and Amaravathi Caretakers
  const kaveriCtPhone = `9842${timestamp}02`;
  await request('/auth/register', {
    method: 'POST',
    body: {
      role: 'caretaker',
      name: 'Kaveri Caretaker',
      email: `kaverict${timestamp}@kongu.edu`,
      phone_number: kaveriCtPhone,
      hostel: 'Kaveri Hostel',
      password: password,
      re_enter_password: password
    }
  });
  const kaveriCtLogin = await request('/auth/login', {
    method: 'POST',
    body: {
      role: 'caretaker',
      phone_number: kaveriCtPhone,
      password: password
    }
  });
  const kaveriCtToken = kaveriCtLogin.token;

  const amaravathiCtPhone = `9842${timestamp}03`;
  await request('/auth/register', {
    method: 'POST',
    body: {
      role: 'caretaker',
      name: 'Amaravathi Caretaker',
      email: `amaravathict${timestamp}@kongu.edu`,
      phone_number: amaravathiCtPhone,
      hostel: 'Amaravathi Hostel',
      password: password,
      re_enter_password: password
    }
  });
  const amaravathiCtLogin = await request('/auth/login', {
    method: 'POST',
    body: {
      role: 'caretaker',
      phone_number: amaravathiCtPhone,
      password: password
    }
  });
  const amaravathiCtToken = amaravathiCtLogin.token;

  // ─────────────────────────────────────────────────────────────
  // TEST 3: Register Warden (Bhavani Hostel) & Login
  // ─────────────────────────────────────────────────────────────
  console.log('--- TEST 3: Register & Login Warden (Bhavani Hostel) ---');
  const wardenPhone = `9842${timestamp}04`;
  const wardenEmail = `warden${timestamp}@kongu.edu`;

  const regWardenRes = await request('/auth/register', {
    method: 'POST',
    body: {
      role: 'warden',
      name: 'Dr. Kumar (Bhavani Warden)',
      phone_number: wardenPhone,
      email: wardenEmail,
      department: 'Chief Warden Office',
      hostel: 'Bhavani Hostel',
      password: password,
      re_enter_password: password
    }
  });
  console.log('Warden Registration:', regWardenRes.message);

  const loginWardenRes = await request('/auth/login', {
    method: 'POST',
    body: {
      role: 'warden',
      phone_number: wardenPhone,
      password: password
    }
  });

  const wardenToken = loginWardenRes.token;
  const wardenUser = loginWardenRes.user;
  console.log(`Warden Login: Role = "${wardenUser.role}", Hostel = "${wardenUser.hostel}"`);
  if (wardenUser.role !== 'warden') throw new Error('Expected warden role!');

  // Verify /auth/me returns warden role, not student
  const meWarden = await request('/auth/me', {
    headers: { Authorization: `Bearer ${wardenToken}` }
  });
  console.log(`Warden /auth/me: Role = "${meWarden.user.role}", Hostel = "${meWarden.user.hostel}"`);
  if (meWarden.user.role !== 'warden') throw new Error('Warden must NOT receive student role!');
  console.log('✓ TEST 3 PASSED: Warden routed to Warden Dashboard (role: warden, NOT student).\n');

  // ─────────────────────────────────────────────────────────────
  // TEST 4: Bhavani Care Taker creates announcement
  // ─────────────────────────────────────────────────────────────
  console.log('--- TEST 4: Bhavani Care Taker Announcement Isolation ---');
  const ctAnnouncementTitle = `Mess Timing Notice ${timestamp}`;
  const ctAnnouncementMsg = `Dinner will be served at 7:30 PM today in Bhavani Dining Hall.`;

  const postCtAnnRes = await request('/announcements', {
    method: 'POST',
    headers: { Authorization: `Bearer ${ctToken}` },
    body: {
      title: ctAnnouncementTitle,
      message: ctAnnouncementMsg,
      // Attempt to send another hostel (should be IGNORED by backend)
      hostel: 'Kaveri Hostel'
    }
  });
  console.log('Care Taker Post Response:', postCtAnnRes.message);
  console.log('Saved announcement hostel in DB:', postCtAnnRes.data.hostel);
  if (postCtAnnRes.data.hostel !== 'Bhavani Hostel') {
    throw new Error('Hostel must be forced to Bhavani Hostel by backend security!');
  }

  // Check Bhavani Student sees it
  const bhavaniStudentAnn = await request('/announcements', {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  const foundInBhavani = bhavaniStudentAnn.data.find(a => a.title === ctAnnouncementTitle);
  console.log('Bhavani Student sees announcement:', !!foundInBhavani ? '✅ YES' : '❌ NO');
  if (!foundInBhavani) throw new Error('Bhavani student must see Bhavani Care Taker announcement!');

  // Check Kaveri Student does NOT see it
  const kaveriStudentAnn = await request('/announcements', {
    headers: { Authorization: `Bearer ${kaveriStudentToken}` }
  });
  const foundInKaveri = kaveriStudentAnn.data.find(a => a.title === ctAnnouncementTitle);
  console.log('Kaveri Student sees announcement:', !!foundInKaveri ? '❌ FAILED' : '✅ NO (Isolated)');
  if (foundInKaveri) throw new Error('Kaveri student must NOT see Bhavani announcement!');

  // Check Amaravathi Student does NOT see it
  const amaravathiStudentAnn = await request('/announcements', {
    headers: { Authorization: `Bearer ${amaravathiStudentToken}` }
  });
  const foundInAmaravathi = amaravathiStudentAnn.data.find(a => a.title === ctAnnouncementTitle);
  console.log('Amaravathi Student sees announcement:', !!foundInAmaravathi ? '❌ FAILED' : '✅ NO (Isolated)');
  if (foundInAmaravathi) throw new Error('Amaravathi student must NOT see Bhavani announcement!');
  console.log('✓ TEST 4 PASSED: Caretaker announcement is strictly isolated to Bhavani Hostel.\n');

  // ─────────────────────────────────────────────────────────────
  // TEST 5: Bhavani Warden creates announcement
  // ─────────────────────────────────────────────────────────────
  console.log('--- TEST 5: Bhavani Warden Announcement Isolation ---');
  const wardenAnnouncementTitle = `Water Supply Notice ${timestamp}`;
  const wardenAnnouncementMsg = `Water supply will be unavailable from 10 AM to 12 PM in Bhavani Hostel.`;

  const postWardenAnnRes = await request('/announcements', {
    method: 'POST',
    headers: { Authorization: `Bearer ${wardenToken}` },
    body: {
      title: wardenAnnouncementTitle,
      message: wardenAnnouncementMsg
    }
  });
  console.log('Warden Post Response:', postWardenAnnRes.message);
  console.log('Saved announcement hostel in DB:', postWardenAnnRes.data.hostel);

  // Check Bhavani Student sees Warden announcement
  const bhavaniStudentAnn2 = await request('/announcements', {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  const wardenAnnInBhavani = bhavaniStudentAnn2.data.find(a => a.title === wardenAnnouncementTitle);
  console.log('Bhavani Student sees Warden announcement:', !!wardenAnnInBhavani ? '✅ YES' : '❌ NO');
  if (!wardenAnnInBhavani) throw new Error('Bhavani student must see Bhavani Warden announcement!');

  // Check Kaveri Student does NOT see it
  const kaveriStudentAnn2 = await request('/announcements', {
    headers: { Authorization: `Bearer ${kaveriStudentToken}` }
  });
  const wardenAnnInKaveri = kaveriStudentAnn2.data.find(a => a.title === wardenAnnouncementTitle);
  console.log('Kaveri Student sees Warden announcement:', !!wardenAnnInKaveri ? '❌ FAILED' : '✅ NO (Isolated)');
  if (wardenAnnInKaveri) throw new Error('Kaveri student must NOT see Bhavani Warden announcement!');

  // Check Amaravathi Student does NOT see it
  const amaravathiStudentAnn2 = await request('/announcements', {
    headers: { Authorization: `Bearer ${amaravathiStudentToken}` }
  });
  const wardenAnnInAmaravathi = amaravathiStudentAnn2.data.find(a => a.title === wardenAnnouncementTitle);
  console.log('Amaravathi Student sees Warden announcement:', !!wardenAnnInAmaravathi ? '❌ FAILED' : '✅ NO (Isolated)');
  if (wardenAnnInAmaravathi) throw new Error('Amaravathi student must NOT see Bhavani Warden announcement!');
  console.log('✓ TEST 5 PASSED: Warden announcement is strictly isolated to Bhavani Hostel.\n');

  // ─────────────────────────────────────────────────────────────
  // TEST 6: Bhavani Student creates complaint -> Isolation
  // ─────────────────────────────────────────────────────────────
  console.log('--- TEST 6: Bhavani Student Complaint & Care Taker Isolation ---');
  const complaintTitle = `Water leakage in bathroom ${timestamp}`;
  const complaintDesc = `Severe water leakage from the overhead tap in room ${studentRoom}.`;

  const createComplaintRes = await request('/complaints', {
    method: 'POST',
    headers: { Authorization: `Bearer ${studentToken}` },
    body: {
      category: 'Plumbing',
      title: complaintTitle,
      description: complaintDesc
    }
  });

  const createdComplaint = createComplaintRes.data;
  console.log('Complaint created successfully:', createdComplaint.id, 'for hostel:', createdComplaint.hostel);

  // Check Bhavani Care Taker sees the complaint
  const bhavaniCtComplaints = await request('/complaints', {
    headers: { Authorization: `Bearer ${ctToken}` }
  });
  const foundByBhavaniCt = bhavaniCtComplaints.data.find(c => c.id === createdComplaint.id);
  console.log('Bhavani Care Taker sees complaint:', !!foundByBhavaniCt ? '✅ YES' : '❌ NO');
  if (!foundByBhavaniCt) throw new Error('Bhavani Care Taker must see Bhavani student complaint!');

  // Check Kaveri Care Taker does NOT see the complaint
  const kaveriCtComplaints = await request('/complaints', {
    headers: { Authorization: `Bearer ${kaveriCtToken}` }
  });
  const foundByKaveriCt = kaveriCtComplaints.data.find(c => c.id === createdComplaint.id);
  console.log('Kaveri Care Taker sees complaint:', !!foundByKaveriCt ? '❌ FAILED' : '✅ NO (Isolated)');
  if (foundByKaveriCt) throw new Error('Kaveri Care Taker must NOT see Bhavani complaint!');

  // Check Amaravathi Care Taker does NOT see the complaint
  const amaravathiCtComplaints = await request('/complaints', {
    headers: { Authorization: `Bearer ${amaravathiCtToken}` }
  });
  const foundByAmaravathiCt = amaravathiCtComplaints.data.find(c => c.id === createdComplaint.id);
  console.log('Amaravathi Care Taker sees complaint:', !!foundByAmaravathiCt ? '❌ FAILED' : '✅ NO (Isolated)');
  if (foundByAmaravathiCt) throw new Error('Amaravathi Care Taker must NOT see Bhavani complaint!');
  console.log('✓ TEST 6 PASSED: Student complaint is strictly visible ONLY to assigned hostel Care Taker.\n');

  // ─────────────────────────────────────────────────────────────
  // TEST 7: Care Taker updates complaint status
  // Pending -> In Progress -> Resolved
  // ─────────────────────────────────────────────────────────────
  console.log('--- TEST 7: Complaint Progress Updates (Pending -> In Progress -> Resolved) ---');

  // 7A: Update to "In Progress"
  const update1 = await request(`/complaints/${createdComplaint.id}/status`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${ctToken}` },
    body: { status: 'In Progress' }
  });
  console.log('Care Taker updated status to:', update1.data.status);

  // Student checks complaint status
  const studentView1 = await request('/complaints', {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  const studentComplaint1 = studentView1.data.find(c => c.id === createdComplaint.id);
  console.log('Student sees updated status:', studentComplaint1.status);
  if (studentComplaint1.status !== 'In Progress') throw new Error('Expected "In Progress" status for student!');

  // 7B: Update to "Resolved"
  const update2 = await request(`/complaints/${createdComplaint.id}/status`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${ctToken}` },
    body: { status: 'Resolved' }
  });
  console.log('Care Taker updated status to:', update2.data.status);

  // Student checks complaint status again
  const studentView2 = await request('/complaints', {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  const studentComplaint2 = studentView2.data.find(c => c.id === createdComplaint.id);
  console.log('Student sees updated status:', studentComplaint2.status);
  if (studentComplaint2.status !== 'Resolved') throw new Error('Expected "Resolved" status for student!');

  console.log('✓ TEST 7 PASSED: Care Taker updated Pending -> In Progress -> Resolved, and Student saw updates in SQLite database.\n');

  console.log('====================================================');
  console.log('🎉 ALL 7 TEST CASES PASSED SUCCESSFULLY!');
  console.log('====================================================');
}

runTests().catch(err => {
  console.error('\n❌ TEST FAILED:', err.data || err.message);
  process.exit(1);
});
