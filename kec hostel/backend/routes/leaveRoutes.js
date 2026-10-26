const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const authenticateJWT = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// All leave endpoints require authentication
router.use(authenticateJWT);

// GET /api/leaves - Get leaves (filtered for students; full list for wardens/caretakers)
router.get('/', leaveController.getLeaves);

// POST /api/leaves - Student submits leave request
router.post('/', authorizeRoles('student'), leaveController.createLeave);

// PUT /api/leaves/:id/status - Caretaker / Warden / Admin approves or rejects leave with remarks
router.put('/:id/status', authorizeRoles('caretaker', 'warden', 'admin'), leaveController.updateLeaveStatus);

module.exports = router;
