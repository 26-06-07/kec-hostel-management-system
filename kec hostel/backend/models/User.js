const { isDbActive, executeQuery } = require('../config/db');

class User {
  /**
   * Find Student by Roll Number
   */
  static async findStudent(rollNo) {
    if (!rollNo) return null;
    const clean = rollNo.toString().trim().toUpperCase();
    if (isDbActive()) {
      try {
        // Query students table directly
        const rows = await executeQuery(
          'SELECT * FROM students WHERE UPPER(TRIM(roll_number)) = ? LIMIT 1',
          [clean]
        );
        if (rows && rows.length > 0) {
          const s = rows[0];
          return {
            id: s.id,
            name: s.name,
            roll_no: s.roll_number,
            roll_number: s.roll_number,
            date_of_birth: s.date_of_birth,
            email: s.email,
            department: s.department,
            hostel: s.hostel,
            room_no: s.room_number,
            room_number: s.room_number,
            role: 'student',
            password_hash: s.password_hash
          };
        }

        // Fallback check in users table
        const userRows = await executeQuery(
          "SELECT * FROM users WHERE role = 'student' AND UPPER(TRIM(roll_no)) = ? LIMIT 1",
          [clean]
        );
        return userRows[0] || null;
      } catch (err) {
        console.warn('[User Model] findStudent error:', err.message);
      }
    }
    return null;
  }

  /**
   * Find Care Taker by Phone Number
   */
  static async findCaretakerByPhone(phone) {
    if (!phone) return null;
    const clean = phone.toString().trim().replace(/[\s\-\(\)]/g, '');
    if (isDbActive()) {
      try {
        // Query caretakers table
        const rows = await executeQuery(
          "SELECT * FROM caretakers WHERE REPLACE(REPLACE(REPLACE(phone_number, ' ', ''), '-', ''), '(', '') = ? OR phone_number = ? LIMIT 1",
          [clean, phone.toString().trim()]
        );
        if (rows && rows.length > 0) {
          const c = rows[0];
          return {
            id: c.id,
            name: c.name,
            email: c.email,
            phone: c.phone_number,
            phone_number: c.phone_number,
            hostel: c.hostel || 'Amaravathi Hostel',
            role: 'caretaker',
            password_hash: c.password_hash
          };
        }

        // Fallback check in users table
        const userRows = await executeQuery(
          "SELECT * FROM users WHERE role = 'caretaker' AND (REPLACE(REPLACE(REPLACE(phone, ' ', ''), '-', ''), '(', '') = ? OR phone = ?) LIMIT 1",
          [clean, phone.toString().trim()]
        );
        return userRows[0] || null;
      } catch (err) {
        console.warn('[User Model] findCaretakerByPhone error:', err.message);
      }
    }
    return null;
  }

  /**
   * Find Warden by Phone Number
   */
  static async findWardenByPhone(phone) {
    if (!phone) return null;
    const clean = phone.toString().trim().replace(/[\s\-\(\)]/g, '');
    if (isDbActive()) {
      try {
        // Query wardens table
        const rows = await executeQuery(
          "SELECT * FROM wardens WHERE REPLACE(REPLACE(REPLACE(phone_number, ' ', ''), '-', ''), '(', '') = ? OR phone_number = ? LIMIT 1",
          [clean, phone.toString().trim()]
        );
        if (rows && rows.length > 0) {
          const w = rows[0];
          return {
            id: w.id,
            name: w.name,
            email: w.email,
            phone: w.phone_number,
            phone_number: w.phone_number,
            department: w.department,
            hostel: w.hostel || 'Bhavani Hostel',
            role: 'warden',
            password_hash: w.password_hash
          };
        }

        // Fallback check in users table
        const userRows = await executeQuery(
          "SELECT * FROM users WHERE role = 'warden' AND (REPLACE(REPLACE(REPLACE(phone, ' ', ''), '-', ''), '(', '') = ? OR phone = ?) LIMIT 1",
          [clean, phone.toString().trim()]
        );
        return userRows[0] || null;
      } catch (err) {
        console.warn('[User Model] findWardenByPhone error:', err.message);
      }
    }
    return null;
  }

  /**
   * Find by ID (supports students, caretakers, wardens, and users)
   */
  static async findById(id, role = null) {
    if (!id) return null;
    if (isDbActive()) {
      try {
        if (role === 'student') {
          const sRows = await executeQuery('SELECT * FROM students WHERE id = ? LIMIT 1', [id]);
          if (sRows && sRows.length > 0) {
            const s = sRows[0];
            return { ...s, role: 'student', roll_no: s.roll_number, room_no: s.room_number, hostel: s.hostel };
          }
        } else if (role === 'caretaker') {
          const cRows = await executeQuery('SELECT * FROM caretakers WHERE id = ? LIMIT 1', [id]);
          if (cRows && cRows.length > 0) {
            const c = cRows[0];
            return { ...c, role: 'caretaker', phone: c.phone_number, hostel: c.hostel || 'Amaravathi Hostel' };
          }
        } else if (role === 'warden') {
          const wRows = await executeQuery('SELECT * FROM wardens WHERE id = ? LIMIT 1', [id]);
          if (wRows && wRows.length > 0) {
            const w = wRows[0];
            return { ...w, role: 'warden', phone: w.phone_number, hostel: w.hostel || 'Bhavani Hostel' };
          }
        }

        // Fallbacks
        const sRows = await executeQuery('SELECT * FROM students WHERE id = ? LIMIT 1', [id]);
        if (sRows && sRows.length > 0) {
          const s = sRows[0];
          return { ...s, role: 'student', roll_no: s.roll_number, room_no: s.room_number, hostel: s.hostel };
        }

        const cRows = await executeQuery('SELECT * FROM caretakers WHERE id = ? LIMIT 1', [id]);
        if (cRows && cRows.length > 0) {
          const c = cRows[0];
          return { ...c, role: 'caretaker', phone: c.phone_number, hostel: c.hostel || 'Amaravathi Hostel' };
        }

        const wRows = await executeQuery('SELECT * FROM wardens WHERE id = ? LIMIT 1', [id]);
        if (wRows && wRows.length > 0) {
          const w = wRows[0];
          return { ...w, role: 'warden', phone: w.phone_number, hostel: w.hostel || 'Bhavani Hostel' };
        }

        const rows = await executeQuery('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
        if (rows && rows.length > 0) return rows[0];
      } catch (err) {
        console.warn('[User Model] findById error:', err.message);
      }
    }
    return null;
  }

  /**
   * Find by username or email across roles
   */
  static async findByUsernameOrEmail(identifier) {
    if (!identifier) return null;
    const clean = identifier.toString().trim().toLowerCase();

    if (isDbActive()) {
      try {
        const rows = await executeQuery(
          `SELECT * FROM users 
           WHERE LOWER(TRIM(username)) = ? 
              OR LOWER(TRIM(email)) = ? 
              OR LOWER(TRIM(roll_no)) = ? 
           LIMIT 1`,
          [clean, clean, clean]
        );
        return rows[0] || null;
      } catch (err) {
        console.warn('[User Model] findByUsernameOrEmail error:', err.message);
      }
    }
    return null;
  }

  /**
   * Register Student in SQLite (students + users)
   */
  static async createStudent(data) {
    if (isDbActive()) {
      // 1. Insert into students table
      const res = await executeQuery(
        `INSERT INTO students (name, roll_number, date_of_birth, email, department, hostel, room_number, password_hash)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.name,
          data.roll_number,
          data.date_of_birth,
          data.email,
          data.department,
          data.hostel,
          data.room_number,
          data.password_hash
        ]
      );

      // 2. Insert into users master table for system compatibility
      await executeQuery(
        `INSERT OR REPLACE INTO users (name, username, roll_no, date_of_birth, email, role, hostel, room_no, department, password_hash)
         VALUES (?, ?, ?, ?, ?, 'student', ?, ?, ?, ?)`,
        [
          data.name,
          data.roll_number.toLowerCase(),
          data.roll_number,
          data.date_of_birth,
          data.email,
          data.hostel,
          data.room_number,
          data.department,
          data.password_hash
        ]
      );

      return { id: res.insertId, ...data, role: 'student' };
    }
    throw new Error('Database is not active');
  }

  /**
   * Register Care Taker in SQLite (caretakers + users)
   */
  static async createCaretaker(data) {
    if (isDbActive()) {
      const hostel = data.hostel || 'Amaravathi Hostel';
      // 1. Insert into caretakers table
      const res = await executeQuery(
        `INSERT INTO caretakers (name, email, phone_number, hostel, password_hash)
         VALUES (?, ?, ?, ?, ?)`,
        [data.name, data.email, data.phone_number, hostel, data.password_hash]
      );

      // 2. Insert into users master table
      await executeQuery(
        `INSERT OR REPLACE INTO users (name, username, email, phone, role, hostel, department, password_hash)
         VALUES (?, ?, ?, ?, 'caretaker', ?, 'Hostel Administration', ?)`,
        [
          data.name,
          data.email.toLowerCase(),
          data.email,
          data.phone_number,
          hostel,
          data.password_hash
        ]
      );

      return { id: res.insertId, ...data, hostel, role: 'caretaker' };
    }
    throw new Error('Database is not active');
  }

  /**
   * Register Warden in SQLite (wardens + users)
   */
  static async createWarden(data) {
    if (isDbActive()) {
      const hostel = data.hostel || 'Bhavani Hostel';
      // 1. Insert into wardens table
      const res = await executeQuery(
        `INSERT INTO wardens (name, phone_number, email, department, hostel, password_hash)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [data.name, data.phone_number, data.email, data.department, hostel, data.password_hash]
      );

      // 2. Insert into users master table
      await executeQuery(
        `INSERT OR REPLACE INTO users (name, username, email, phone, department, role, hostel, password_hash)
         VALUES (?, ?, ?, ?, ?, 'warden', ?, ?)`,
        [
          data.name,
          data.email.toLowerCase(),
          data.email,
          data.phone_number,
          data.department,
          hostel,
          data.password_hash
        ]
      );

      return { id: res.insertId, ...data, hostel, role: 'warden' };
    }
    throw new Error('Database is not active');
  }
}

module.exports = User;
