const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection, startAutoReconnect, isDbActive } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const hostelRoutes = require('./routes/hostelRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const roomRoutes = require('./routes/roomRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const announcementRoutes = require('./routes/announcementRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Core Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'KEC Hostels Management System Backend',
    college: 'Kongu Engineering College',
    mysql_connected: isDbActive(),
    database_connected: isDbActive(),
    database_engine: 'SQLite (kec_hostel.db)',
    timestamp: new Date().toISOString()
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/hostels', hostelRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/announcements', announcementRoutes);

// 404 Handler for undefined routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route "${req.originalUrl}" does not exist.`
  });
});

// Centralized Error Handling
app.use(errorHandler);

// Start Server and verify DB connection pool
app.listen(PORT, async () => {
  console.log(`====================================================`);
  console.log(` KEC HOSTELS - BACKEND REST API SERVER`);
  console.log(` Status: Running on http://localhost:${PORT}`);
  console.log(` Mode:   ${process.env.NODE_ENV || 'development'}`);
  console.log(`====================================================`);

  // Attempt MySQL connection using .env credentials
  await testConnection();

  // Keep probing every 15 s — auto-switches to MySQL the moment it becomes
  // available. No restart needed after teammate completes DB setup.
  startAutoReconnect();
});
