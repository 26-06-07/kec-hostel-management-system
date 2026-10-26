const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');

exports.getLeaves = async (req, res, next) => {
  try {
    const userRole = (req.user?.role || '').toLowerCase();
    const filter = {};

    if (userRole === 'student') {
      if (req.user?.roll_no || req.user?.roll_number) {
        filter.roll_no = req.user.roll_no || req.user.roll_number;
      } else {
        filter.student_id = req.user.id;
      }
    } else if (userRole === 'caretaker') {
      // STRICT HOSTEL ISOLATION: Caretaker only receives leaves for their assigned hostel
      let caretakerHostel = req.user?.hostel;
      if (req.user?.phone || req.user?.phone_number) {
        const freshCt = await User.findCaretakerByPhone(req.user.phone || req.user.phone_number);
        if (freshCt && freshCt.hostel) caretakerHostel = freshCt.hostel;
      }
      if (caretakerHostel) {
        filter.hostel = caretakerHostel;
      }
    } else if (userRole === 'admin' && req.query.hostel) {
      filter.hostel = req.query.hostel;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const leaves = await LeaveRequest.findAll(filter);
    res.status(200).json({
      success: true,
      count: leaves.length,
      hostel: filter.hostel,
      data: leaves
    });
  } catch (error) {
    next(error);
  }
};

exports.createLeave = async (req, res, next) => {
  try {
    const { type, from_date, to_date, purpose, parent_contact } = req.body;

    if (!from_date || !to_date || !purpose) {
      return res.status(400).json({
        success: false,
        message: 'From Date, To Date, and Purpose are required.'
      });
    }

    // Refresh student authoritative details from database
    let studentName = req.user.name;
    let rollNo = req.user.roll_no || req.user.roll_number;
    let hostel = req.user.hostel;
    let roomNo = req.user.room_no || req.user.room_number;
    let studentId = req.user.id;

    if (rollNo) {
      const freshStudent = await User.findStudent(rollNo);
      if (freshStudent) {
        studentName = freshStudent.name;
        hostel = freshStudent.hostel;
        roomNo = freshStudent.room_no || freshStudent.room_number;
        studentId = freshStudent.id;
      }
    }

    const leave = await LeaveRequest.create({
      student_id: studentId,
      student_name: studentName,
      roll_no: rollNo || '22ITR088',
      hostel: hostel || 'Amaravathi Hostel',
      room_no: roomNo || '204',
      type: type || 'Weekend Outing',
      from_date,
      to_date,
      purpose,
      parent_contact: parent_contact || req.user.parent_phone || '+91 94433 99887'
    });

    res.status(201).json({
      success: true,
      message: 'Outing/Leave request submitted successfully. Awaiting Caretaker review.',
      data: leave
    });
  } catch (error) {
    next(error);
  }
};

exports.updateLeaveStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "Approved" or "Rejected".'
      });
    }

    const userRole = (req.user?.role || '').toLowerCase();
    const roleLabel = userRole === 'caretaker' ? 'Care Taker' : (userRole === 'admin' ? 'Admin' : 'Warden');
    const reviewerName = req.user?.name ? `${req.user.name} (${roleLabel})` : roleLabel;
    const defaultRemarks = status === 'Approved'
      ? `Approved by ${reviewerName}. Out-pass valid for specified dates.`
      : `Rejected by ${reviewerName}.`;
    const finalRemarks = remarks && remarks.trim() ? remarks.trim() : defaultRemarks;

    const updated = await LeaveRequest.updateStatus(id, status, reviewerName, finalRemarks);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Leave request with ID "${id}" was not found.`
      });
    }

    res.status(200).json({
      success: true,
      message: `Leave request #${id} has been marked as ${status}.`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};
