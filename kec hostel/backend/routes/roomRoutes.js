const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// GET /api/rooms - List room allocations and capacities
router.get('/', roomController.getRooms);

module.exports = router;
