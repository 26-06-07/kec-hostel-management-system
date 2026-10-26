const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const authenticateJWT = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// GET /api/announcements - Fetch hostel-isolated announcements
router.get('/', authenticateJWT, announcementController.getAnnouncements);

// POST /api/announcements - Warden / Care Taker creates announcement (backend sets authoritative hostel)
router.post(
  '/',
  authenticateJWT,
  authorizeRoles('warden', 'caretaker', 'admin'),
  announcementController.createAnnouncement
);

module.exports = router;
