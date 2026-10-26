const express = require('express');
const router = express.Router();
const hostelController = require('../controllers/hostelController');

// GET /api/hostels - List all hostels (Amaravathi, Bhavani, Kaveri)
router.get('/', hostelController.getAllHostels);

// GET /api/hostels/:id - Get specific hostel details
router.get('/:id', hostelController.getHostelById);

module.exports = router;
