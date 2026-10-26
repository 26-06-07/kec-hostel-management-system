const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateJWT = require('../middleware/authMiddleware');

// POST /api/auth/login - Authenticate student, caretaker, warden, or admin
router.post('/login', authController.login);

// POST /api/auth/register - Register new student account
router.post('/register', authController.register);

// GET /api/auth/me - Retrieve current logged-in user profile
router.get('/me', authenticateJWT, authController.getMe);

// POST /api/auth/logout - Logout user
router.post('/logout', authController.logout);

module.exports = router;
