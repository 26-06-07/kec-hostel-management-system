const Complaint = require('../models/Complaint');
const User = require('../models/User');

exports.getComplaints = async (req, res, next) => {
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
      // STRICT HOSTEL ISOLATION: Caretaker only receives complaints for their assigned hostel
      let caretakerHostel = req.user?.hostel;
      if (req.user?.phone || req.user?.phone_number) {
        const freshCt = await User.findCaretakerByPhone(req.user.phone || req.user.phone_number);
        if (freshCt && freshCt.hostel) caretakerHostel = freshCt.hostel;
      }
      filter.hostel = caretakerHostel || 'Amaravathi Hostel';
    } else if (userRole === 'warden') {
      // Warden only manages announcements, complaints are not for Warden
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }

    const complaints = await Complaint.findAll(filter);
    res.status(200).json({
      success: true,
      count: complaints.length,
      hostel: filter.hostel,
      data: complaints
    });
  } catch (error) {
    next(error);
  }
};

exports.createComplaint = async (req, res, next) => {
  try {
    const { category, title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Complaint title and description are required.'
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

    const complaint = await Complaint.create({
      student_id: studentId,
      student_name: studentName,
      roll_no: rollNo,
      hostel: hostel || 'Amaravathi Hostel',
      room_no: roomNo || '—',
      category: category || 'General',
      title,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Complaint registered successfully. Assigned to Care Taker.',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

exports.updateComplaintStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, assigned_to } = req.body;

    if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be "Pending", "In Progress", or "Resolved".'
      });
    }

    const updated = await Complaint.updateStatus(id, status, assigned_to);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Complaint ticket "${id}" not found.`
      });
    }

    res.status(200).json({
      success: true,
      message: `Complaint #${id} updated to ${status}.`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};
