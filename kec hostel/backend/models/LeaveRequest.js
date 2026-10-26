const { isDbActive, executeQuery } = require('../config/db');
const fallbackData = require('../data/mockFallback');

class LeaveRequest {
  static async findAll(filter = {}) {
    if (isDbActive()) {
      try {
        let sql = 'SELECT * FROM leave_requests';
        const conditions = [];
        const params = [];
        if (filter.student_id) {
          conditions.push('student_id = ?');
          params.push(filter.student_id);
        }
        if (filter.roll_no) {
          conditions.push('UPPER(TRIM(roll_no)) = ?');
          params.push(filter.roll_no.toString().trim().toUpperCase());
        }
        if (filter.hostel) {
          conditions.push('hostel = ?');
          params.push(filter.hostel);
        }
        if (filter.status) {
          conditions.push('status = ?');
          params.push(filter.status);
        }
        if (conditions.length > 0) {
          sql += ' WHERE ' + conditions.join(' AND ');
        }
        sql += ' ORDER BY rowid DESC';
        return await executeQuery(sql, params);
      } catch (err) {
        console.warn('[LeaveRequest Model] Database query failed, using fallback:', err.message);
      }
    }

    let results = fallbackData.leaves || [];
    if (filter.student_id) {
      results = results.filter(l => l.student_id === parseInt(filter.student_id, 10));
    }
    if (filter.roll_no) {
      const cleanRoll = filter.roll_no.toString().trim().toUpperCase();
      results = results.filter(l => (l.roll_no || '').toString().trim().toUpperCase() === cleanRoll);
    }
    if (filter.hostel) {
      results = results.filter(l => l.hostel === filter.hostel);
    }
    if (filter.status) {
      results = results.filter(l => l.status === filter.status);
    }
    return results;
  }

  static async findById(id) {
    if (isDbActive()) {
      try {
        const rows = await executeQuery('SELECT * FROM leave_requests WHERE id = ? LIMIT 1', [id]);
        return rows[0] || null;
      } catch (err) {
        console.warn('[LeaveRequest Model] Database query failed, using fallback:', err.message);
      }
    }
    return (fallbackData.leaves || []).find(l => l.id === id) || null;
  }

  static async create(data) {
    const newId = `LV-2026-0${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date();
    const appliedAt = now.toISOString().replace('T', ' ').slice(0, 16);

    const record = {
      id: newId,
      student_id: data.student_id,
      student_name: data.student_name,
      roll_no: data.roll_no,
      hostel: data.hostel,
      room_no: data.room_no,
      type: data.type || 'Weekend Outing',
      from_date: data.from_date,
      to_date: data.to_date,
      purpose: data.purpose,
      parent_contact: data.parent_contact,
      status: 'Pending',
      applied_at: appliedAt,
      approved_by: null,
      remarks: null
    };

    if (isDbActive()) {
      try {
        await executeQuery(
          `INSERT INTO leave_requests (id, student_id, student_name, roll_no, hostel, room_no, type, from_date, to_date, purpose, parent_contact, status, applied_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            record.id,
            record.student_id,
            record.student_name,
            record.roll_no,
            record.hostel,
            record.room_no,
            record.type,
            record.from_date,
            record.to_date,
            record.purpose,
            record.parent_contact,
            record.status,
            record.applied_at
          ]
        );
        return record;
      } catch (err) {
        console.warn('[LeaveRequest Model] MySQL insert failed, using fallback:', err.message);
      }
    }

    fallbackData.leaves.unshift(record);
    return record;
  }

  static async updateStatus(id, status, approvedBy, remarks = '') {
    if (isDbActive()) {
      try {
        await executeQuery(
          'UPDATE leave_requests SET status = ?, approved_by = ?, remarks = ? WHERE id = ?',
          [status, approvedBy, remarks, id]
        );
        return await this.findById(id);
      } catch (err) {
        console.warn('[LeaveRequest Model] MySQL update failed, using fallback:', err.message);
      }
    }

    const leave = fallbackData.leaves.find(l => l.id === id);
    if (leave) {
      leave.status = status;
      leave.approved_by = approvedBy;
      leave.remarks = remarks || (status === 'Approved' ? 'Approved by Warden office.' : 'Request rejected.');
      return leave;
    }
    return null;
  }
}

module.exports = LeaveRequest;
