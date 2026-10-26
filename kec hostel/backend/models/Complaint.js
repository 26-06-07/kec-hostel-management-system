const { isDbActive, executeQuery } = require('../config/db');
const fallbackData = require('../data/mockFallback');

class Complaint {
  static async findAll(filter = {}) {
    if (isDbActive()) {
      try {
        let sql = 'SELECT * FROM complaints';
        const params = [];
        const conditions = [];

        if (filter.student_id) {
          conditions.push('student_id = ?');
          params.push(filter.student_id);
        }
        if (filter.roll_no) {
          conditions.push('UPPER(TRIM(roll_no)) = UPPER(TRIM(?))');
          params.push(filter.roll_no.trim());
        }
        if (filter.hostel) {
          conditions.push('LOWER(TRIM(hostel)) = LOWER(TRIM(?))');
          params.push(filter.hostel.trim());
        }

        if (conditions.length > 0) {
          sql += ' WHERE ' + conditions.join(' AND ');
        }
        sql += ' ORDER BY id DESC';
        return await executeQuery(sql, params);
      } catch (err) {
        console.warn('[Complaint Model] query failed, using fallback:', err.message);
      }
    }

    let results = fallbackData.complaints;
    if (filter.student_id) {
      results = results.filter(c => c.student_id === parseInt(filter.student_id, 10));
    }
    if (filter.hostel) {
      results = results.filter(c => (c.hostel || '').toLowerCase() === filter.hostel.toLowerCase());
    }
    return results;
  }

  static async findById(id) {
    if (isDbActive()) {
      try {
        const rows = await executeQuery('SELECT * FROM complaints WHERE id = ? LIMIT 1', [id]);
        return rows[0] || null;
      } catch (err) {
        console.warn('[Complaint Model] MySQL query failed, using fallback:', err.message);
      }
    }
    return fallbackData.complaints.find(c => c.id === id) || null;
  }

  static async create(data) {
    const newId = `CMP-2026-${Math.floor(200 + Math.random() * 800)}`;
    const now = new Date();
    const createdAt = now.toISOString().replace('T', ' ').slice(0, 16);

    const record = {
      id: newId,
      student_id: data.student_id,
      student_name: data.student_name,
      roll_no: data.roll_no,
      hostel: data.hostel,
      room_no: data.room_no,
      category: data.category || 'General',
      title: data.title,
      description: data.description,
      status: 'Pending',
      assigned_to: data.category === 'Electrical' ? 'R. Kannan (Electrician)' : 'Hostel Maintenance Cell',
      created_at: createdAt
    };

    if (isDbActive()) {
      try {
        await executeQuery(
          `INSERT INTO complaints (id, student_id, student_name, roll_no, hostel, room_no, category, title, description, status, assigned_to, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            record.id,
            record.student_id,
            record.student_name,
            record.roll_no,
            record.hostel,
            record.room_no,
            record.category,
            record.title,
            record.description,
            record.status,
            record.assigned_to,
            record.created_at
          ]
        );
        return record;
      } catch (err) {
        console.warn('[Complaint Model] MySQL insert failed, using fallback:', err.message);
      }
    }

    fallbackData.complaints.unshift(record);
    return record;
  }

  static async updateStatus(id, status, assignedTo) {
    if (isDbActive()) {
      try {
        await executeQuery(
          'UPDATE complaints SET status = ?, assigned_to = COALESCE(?, assigned_to) WHERE id = ?',
          [status, assignedTo || null, id]
        );
        return await this.findById(id);
      } catch (err) {
        console.warn('[Complaint Model] MySQL update failed, using fallback:', err.message);
      }
    }

    const complaint = fallbackData.complaints.find(c => c.id === id);
    if (complaint) {
      complaint.status = status;
      if (assignedTo) complaint.assigned_to = assignedTo;
      return complaint;
    }
    return null;
  }
}

module.exports = Complaint;
