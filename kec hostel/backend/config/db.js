const path = require('path');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

// Path to the persistent SQLite database file
const DB_PATH = path.join(__dirname, '..', 'data', 'kec_hostel.db');

let db = null;
let isConnected = false;

/**
 * Initialize SQLite database connection
 */
function getDatabase() {
  if (!db) {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('[SQLite] ✗ Connection error:', err.message);
        isConnected = false;
      } else {
        isConnected = true;
        console.log(`[SQLite] ✓ Connected to database: ${path.basename(DB_PATH)}`);
      }
    });
  }
  return db;
}

/**
 * Execute an arbitrary SQL query with promise support.
 * Returns array of rows for SELECT, and { insertId, affectedRows } for writes.
 */
function executeQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    const activeDb = getDatabase();
    const trimmed = sql.trim().toUpperCase();

    if (trimmed.startsWith('SELECT') || trimmed.startsWith('PRAGMA')) {
      activeDb.all(sql, params, (err, rows) => {
        if (err) {
          console.error(`[SQLite] Query error (${sql}):`, err.message);
          return reject(err);
        }
        resolve(rows || []);
      });
    } else {
      activeDb.run(sql, params, function (err) {
        if (err) {
          console.error(`[SQLite] Exec error (${sql}):`, err.message);
          return reject(err);
        }
        resolve({
          insertId: this.lastID,
          affectedRows: this.changes,
          changes: this.changes
        });
      });
    }
  });
}

/**
 * Initialize all database tables for the 3 distinct roles:
 * 1. students
 * 2. caretakers
 * 3. wardens
 * plus hostels, rooms, complaints, leave_requests, notices and master users.
 */
async function initializeSchemaAndSeed() {
  const activeDb = getDatabase();

  return new Promise((resolve, reject) => {
    activeDb.serialize(async () => {
      try {
        // 1. Dedicated STUDENTS Table (Requirement 10)
        await executeQuery(`
          CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            roll_number TEXT UNIQUE NOT NULL,
            date_of_birth TEXT NOT NULL,
            email TEXT NOT NULL,
            department TEXT NOT NULL,
            hostel TEXT NOT NULL,
            room_number TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // 2. Dedicated CARETAKERS Table (Requirement 10)
        await executeQuery(`
          CREATE TABLE IF NOT EXISTS caretakers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone_number TEXT UNIQUE NOT NULL,
            hostel TEXT NOT NULL DEFAULT 'Amaravathi Hostel',
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Check if hostel column exists in caretakers
        const ctCols = await executeQuery('PRAGMA table_info(caretakers)');
        if (!ctCols.some((c) => c.name === 'hostel')) {
          await executeQuery("ALTER TABLE caretakers ADD COLUMN hostel TEXT DEFAULT 'Amaravathi Hostel'");
        }

        // 3. Dedicated WARDENS Table (Requirement 10)
        await executeQuery(`
          CREATE TABLE IF NOT EXISTS wardens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone_number TEXT UNIQUE NOT NULL,
            email TEXT NOT NULL,
            department TEXT NOT NULL,
            hostel TEXT NOT NULL DEFAULT 'Bhavani Hostel',
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Check if hostel column exists in wardens
        const wCols = await executeQuery('PRAGMA table_info(wardens)');
        if (!wCols.some((c) => c.name === 'hostel')) {
          await executeQuery("ALTER TABLE wardens ADD COLUMN hostel TEXT DEFAULT 'Bhavani Hostel'");
        }

        // 4. Master USERS Table (maintains full compatibility with foreign queries)
        await executeQuery(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            username TEXT NOT NULL UNIQUE,
            roll_no TEXT UNIQUE,
            date_of_birth TEXT,
            email TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'student',
            hostel TEXT,
            room_no TEXT,
            department TEXT,
            year_of_study TEXT,
            phone TEXT,
            parent_phone TEXT,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Check if date_of_birth column exists in users
        const cols = await executeQuery('PRAGMA table_info(users)');
        const hasDob = cols.some((c) => c.name === 'date_of_birth');
        if (!hasDob) {
          await executeQuery('ALTER TABLE users ADD COLUMN date_of_birth TEXT');
        }

        // 4B. Dedicated ANNOUNCEMENTS Table (Hostel-Specific Isolation)
        await executeQuery(`
          CREATE TABLE IF NOT EXISTS announcements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            hostel TEXT NOT NULL,
            posted_by TEXT NOT NULL,
            posted_by_role TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // 5. Hostels table
        await executeQuery(`
          CREATE TABLE IF NOT EXISTS hostels (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            tagline TEXT,
            capacity INTEGER NOT NULL DEFAULT 0,
            occupied INTEGER NOT NULL DEFAULT 0,
            floors INTEGER NOT NULL DEFAULT 1,
            caretaker_name TEXT,
            caretaker_contact TEXT,
            facilities TEXT,
            image TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // 6. Rooms table
        await executeQuery(`
          CREATE TABLE IF NOT EXISTS rooms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            room_no TEXT NOT NULL,
            hostel TEXT NOT NULL,
            floor INTEGER NOT NULL DEFAULT 1,
            capacity INTEGER NOT NULL DEFAULT 4,
            occupied INTEGER NOT NULL DEFAULT 0,
            status TEXT NOT NULL DEFAULT 'Available',
            UNIQUE(room_no, hostel)
          )
        `);

        // 7. Leave Requests table
        await executeQuery(`
          CREATE TABLE IF NOT EXISTS leave_requests (
            id TEXT PRIMARY KEY,
            student_id INTEGER NOT NULL,
            student_name TEXT NOT NULL,
            roll_no TEXT,
            hostel TEXT,
            room_no TEXT,
            type TEXT NOT NULL DEFAULT 'Weekend Outing',
            from_date TEXT NOT NULL,
            to_date TEXT NOT NULL,
            purpose TEXT NOT NULL,
            parent_contact TEXT,
            status TEXT NOT NULL DEFAULT 'Pending',
            applied_at TEXT,
            approved_by TEXT,
            remarks TEXT
          )
        `);

        // 8. Complaints table
        await executeQuery(`
          CREATE TABLE IF NOT EXISTS complaints (
            id TEXT PRIMARY KEY,
            student_id INTEGER NOT NULL,
            student_name TEXT NOT NULL,
            roll_no TEXT,
            hostel TEXT,
            room_no TEXT,
            category TEXT NOT NULL DEFAULT 'General',
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Pending',
            assigned_to TEXT,
            created_at TEXT
          )
        `);

        // 9. Notices table
        await executeQuery(`
          CREATE TABLE IF NOT EXISTS notices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL DEFAULT 'General',
            published_by TEXT NOT NULL,
            date TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Ensure no default student account exists (Requirement 11)
        await executeQuery("DELETE FROM users WHERE username = 'swaathi' OR roll_no = '22ITR088'");

        // Seed Hostels if empty
        const hostelCount = await executeQuery('SELECT COUNT(*) as count FROM hostels');
        if (hostelCount[0].count === 0) {
          const hostels = [
            ['amaravathi', 'Amaravathi Hostel', 'Eco-friendly, modern amenities with disciplined study halls and hygienic dining.', 450, 420, 4, 'M. Selvam', '+91 98421 33445', JSON.stringify(["24x7 Purified RO Drinking Water","Wi-Fi Enabled Study Halls","Steam-Powered Hygienic Dining Hall","Solar Water Heaters","Indoor Badminton & Table Tennis"]), 'assets/hostel-amaravathi.png'],
            ['bhavani', 'Bhavani Hostel', 'Spacious multi-sharing rooms surrounded by green flora and round-the-clock security.', 500, 468, 4, 'P. Murugesan', '+91 98421 44556', JSON.stringify(["High-Speed Campus LAN & Wi-Fi","Modern Gymnasium & Fitness Corner","Continuous CCTV Surveillance","Round-the-Clock Ambulance Support","Spacious Reading Room"]), 'assets/hostel-bhavani.png'],
            ['kaveri', 'Kaveri Hostel', 'Peaceful environment optimized for academic excellence and collaborative learning.', 420, 395, 3, 'S. Dharmaraj', '+91 98421 55667', JSON.stringify(["Quiet Library Annex with e-Journals","Automated Laundry Stations","Doctor-on-Call & Health Post","Uninterrupted Power Backup (100 kVA DG)","Spacious Dining Complex"]), 'assets/hostel-kaveri.png']
          ];
          for (const h of hostels) {
            await executeQuery(
              'INSERT INTO hostels (id, name, tagline, capacity, occupied, floors, caretaker_name, caretaker_contact, facilities, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
              h
            );
          }
        }

        // Seed Rooms if empty
        const roomCount = await executeQuery('SELECT COUNT(*) as count FROM rooms');
        if (roomCount[0].count === 0) {
          const rooms = [
            ['201', 'Amaravathi Hostel', 2, 4, 4, 'Full'],
            ['202', 'Amaravathi Hostel', 2, 4, 3, 'Available (1 Bed)'],
            ['203', 'Amaravathi Hostel', 2, 4, 4, 'Full'],
            ['204', 'Amaravathi Hostel', 2, 4, 4, 'Full'],
            ['205', 'Amaravathi Hostel', 2, 4, 2, 'Available (2 Beds)']
          ];
          for (const r of rooms) {
            await executeQuery('INSERT INTO rooms (room_no, hostel, floor, capacity, occupied, status) VALUES (?, ?, ?, ?, ?, ?)', r);
          }
        }

        // Seed Notices if empty
        const noticeCount = await executeQuery('SELECT COUNT(*) as count FROM notices');
        if (noticeCount[0].count === 0) {
          const notices = [
            ['Weekend Outing Cutoff Time Notification', 'General', 'Chief Warden Office', '2026-10-10', 'All resident students are hereby informed that Weekend Outing requests must be formally submitted through the portal before Friday 5:00 PM for warden approval. Entry gate closes at 7:00 PM strictly.'],
            ['Special Festive Dinner at Mess Dining Halls', 'Mess Dining', 'Mess Committee', '2026-10-08', 'A special traditional feast will be served on Saturday evening across all three hostels (Amaravathi, Bhavani, Kaveri). Dinner service hours extended until 9:30 PM.'],
            ['Annual Preventative Electrical & RO Plant Maintenance', 'Maintenance', 'Campus Maintenance Cell', '2026-10-05', 'Routine RO water filter overhaul will be conducted between 10:00 AM and 1:00 PM on Tuesday. Adequate clean water storage has been pre-arranged in each wing.']
          ];
          for (const n of notices) {
            await executeQuery(
              'INSERT INTO notices (title, category, published_by, date, content) VALUES (?, ?, ?, ?, ?)',
              n
            );
          }
        }

        // Seed Announcements if empty (Hostel-Specific)
        const announcementCount = await executeQuery('SELECT COUNT(*) as count FROM announcements');
        if (announcementCount[0].count === 0) {
          const initialAnnouncements = [
            ['Important Notice', "Tomorrow's mess timing will be changed to 7:30 AM.", 'Bhavani Hostel', 'P. Murugesan', 'caretaker'],
            ['Solar Water Heater Maintenance', 'Solar water heating system inspection scheduled tomorrow from 8:00 AM to 10:00 AM in Amaravathi Hostel blocks.', 'Amaravathi Hostel', 'M. Selvam', 'caretaker'],
            ['Library Annex Wi-Fi Upgrade', 'High-speed 100Mbps Wi-Fi access points upgraded in Kaveri study library.', 'Kaveri Hostel', 'S. Dharmaraj', 'caretaker']
          ];
          for (const a of initialAnnouncements) {
            await executeQuery(
              'INSERT INTO announcements (title, message, hostel, posted_by, posted_by_role) VALUES (?, ?, ?, ?, ?)',
              a
            );
          }
        }

        console.log('[SQLite] ✓ Role tables & announcements initialized successfully.');
        resolve(true);
      } catch (err) {
        console.error('[SQLite] ✗ Initialization error:', err);
        reject(err);
      }
    });
  });
}

/**
 * Startup test connection
 */
async function testConnection() {
  try {
    getDatabase();
    await initializeSchemaAndSeed();
    isConnected = true;
    return true;
  } catch (error) {
    console.error('[SQLite] ✗ testConnection failed:', error.message);
    isConnected = false;
    return false;
  }
}

function startAutoReconnect() {}

function isDbActive() {
  return isConnected;
}

function getDbInfo() {
  return {
    engine: 'SQLite',
    connected: isConnected,
    databaseFile: path.basename(DB_PATH)
  };
}

module.exports = {
  db: getDatabase(),
  testConnection,
  startAutoReconnect,
  isDbActive,
  executeQuery,
  getDbInfo
};
