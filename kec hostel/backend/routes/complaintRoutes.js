const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const authenticateJWT = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

router.use(authenticateJWT);

// GET /api/complaints - Get grievances
router.get('/', complaintController.getComplaints);

// POST /api/complaints - Student files a complaint
router.post('/', authorizeRoles('student'), complaintController.createComplaint);

// PUT /api/complaints/:id/status - Caretaker / Admin updates complaint status
router.put('/:id/status', authorizeRoles('caretaker', 'warden', 'admin'), complaintController.updateComplaintStatus);

module.exports = router;
