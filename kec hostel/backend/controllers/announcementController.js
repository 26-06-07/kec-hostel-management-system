const { executeQuery } = require('../config/db');
const User = require('../models/User');

/**
 * GET /api/announcements
 * Retrieve hostel-isolated announcements based on authenticated user's role and hostel.
 * Data Isolation Rule: A student ONLY ever receives announcements for their assigned hostel in the SQL query itself!
 */
exports.getAnnouncements = async (req, res, next) => {
  try {
    const userRole = (req.user?.role || '').toLowerCase();
    let targetHostel = req.user?.hostel;

    // Refresh user's authoritative hostel from database to guarantee absolute accuracy
    if (userRole === 'student' && req.user?.roll_no) {
      const freshStudent = await User.findStudent(req.user.roll_no);
      if (freshStudent && freshStudent.hostel) {
        targetHostel = freshStudent.hostel;
      }
    } else if (req.user?.id) {
      const freshUser = await User.findById(req.user.id, userRole);
      if (freshUser && freshUser.hostel) {
        targetHostel = freshUser.hostel;
      }
    }

    if (userRole === 'student') {
      if (!targetHostel) {
        return res.status(200).json({
          success: true,
          count: 0,
          hostel: 'Unassigned',
          data: []
        });
      }

      // STRICT BACKEND SQL ISOLATION - Never return other hostels' announcements
      const announcements = await executeQuery(
        `SELECT id, title, message, hostel, posted_by, posted_by_role, created_at 
         FROM announcements 
         WHERE LOWER(TRIM(hostel)) = LOWER(TRIM(?))
         ORDER BY id DESC`,
        [targetHostel.trim()]
      );

      return res.status(200).json({
        success: true,
        count: announcements.length,
        hostel: targetHostel,
        data: announcements
      });
    }

    // Caretaker or Warden: view announcements for their assigned hostel
    if (userRole === 'warden' || userRole === 'caretaker') {
      const hostelToQuery = targetHostel || (userRole === 'warden' ? 'Bhavani Hostel' : 'Amaravathi Hostel');
      const announcements = await executeQuery(
        `SELECT id, title, message, hostel, posted_by, posted_by_role, created_at 
         FROM announcements 
         WHERE LOWER(TRIM(hostel)) = LOWER(TRIM(?))
         ORDER BY id DESC`,
        [hostelToQuery.trim()]
      );

      return res.status(200).json({
        success: true,
        count: announcements.length,
        hostel: hostelToQuery,
        data: announcements
      });
    }

    // Admin: can view all or filtered by hostel query param
    const filterHostel = req.query.hostel;
    let sql = 'SELECT * FROM announcements';
    let params = [];
    if (filterHostel) {
      sql += ' WHERE LOWER(TRIM(hostel)) = LOWER(TRIM(?))';
      params.push(filterHostel.trim());
    }
    sql += ' ORDER BY id DESC';

    const announcements = await executeQuery(sql, params);
    return res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/announcements
 * Warden / Care Taker creates an announcement.
 * SECURITY: Frontend cannot decide the hostel!
 * The backend strictly extracts the authenticated user's hostel from the database.
 */
exports.createAnnouncement = async (req, res, next) => {
  try {
    const userRole = (req.user?.role || '').toLowerCase();

    // Students are forbidden from creating announcements
    if (userRole !== 'warden' && userRole !== 'caretaker' && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden: Only Wardens and Care Takers can post announcements.'
      });
    }

    const { title, message, content } = req.body;
    const announcementTitle = (title || '').trim();
    const announcementMessage = (message || content || '').trim();

    if (!announcementTitle || !announcementMessage) {
      return res.status(400).json({
        success: false,
        message: 'Announcement title and message are required.'
      });
    }

    // Fetch authoritative hostel from database record (NEVER TRUST FRONTEND VALUE)
    let authoritativeHostel = req.user?.hostel;
    if (req.user?.phone || req.user?.phone_number) {
      const phone = req.user.phone || req.user.phone_number;
      if (userRole === 'warden') {
        const freshWarden = await User.findWardenByPhone(phone);
        if (freshWarden && freshWarden.hostel) authoritativeHostel = freshWarden.hostel;
      } else if (userRole === 'caretaker') {
        const freshCt = await User.findCaretakerByPhone(phone);
        if (freshCt && freshCt.hostel) authoritativeHostel = freshCt.hostel;
      }
    } else if (req.user?.id) {
      const freshUser = await User.findById(req.user.id, userRole);
      if (freshUser && freshUser.hostel) {
        authoritativeHostel = freshUser.hostel;
      }
    }

    if (!authoritativeHostel || authoritativeHostel === 'All Hostels') {
      authoritativeHostel = userRole === 'warden' ? 'Bhavani Hostel' : 'Amaravathi Hostel';
    }

    const posterName = req.user?.name || (userRole === 'warden' ? 'Chief Warden' : 'Care Taker');
    const posterRole = userRole === 'warden' ? 'Warden' : 'Care Taker';

    const result = await executeQuery(
      `INSERT INTO announcements (title, message, hostel, posted_by, posted_by_role, created_at)
       VALUES (?, ?, ?, ?, ?, datetime('now', 'localtime'))`,
      [announcementTitle, announcementMessage, authoritativeHostel, posterName, posterRole]
    );

    const insertedRows = await executeQuery('SELECT * FROM announcements WHERE id = ?', [result.insertId]);
    const createdRecord = insertedRows[0] || {
      id: result.insertId,
      title: announcementTitle,
      message: announcementMessage,
      hostel: authoritativeHostel,
      posted_by: posterName,
      posted_by_role: posterRole,
      created_at: new Date().toISOString()
    };

    return res.status(201).json({
      success: true,
      message: `Announcement posted successfully for ${authoritativeHostel}!`,
      data: createdRecord
    });
  } catch (error) {
    next(error);
  }
};
