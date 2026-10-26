const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const authenticateJWT = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// GET /api/notices - List public campus notices
router.get('/', noticeController.getNotices);

// GET /api/notices/mess-menu - Get weekly dining schedule
router.get('/mess-menu', noticeController.getMessMenu);

// POST /api/notices - Warden / Admin publishes new notice
router.post('/', authenticateJWT, authorizeRoles('warden', 'admin'), noticeController.createNotice);

module.exports = router;
