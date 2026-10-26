const { isDbActive, executeQuery } = require('../config/db');
const fallbackData = require('../data/mockFallback');

class Room {
  static async findAll(filter = {}) {
    if (isDbActive()) {
      try {
        let sql = 'SELECT * FROM rooms';
        const params = [];
        if (filter.hostel) {
          sql += ' WHERE hostel = ?';
          params.push(filter.hostel);
        }
        return await executeQuery(sql, params);
      } catch (err) {
        console.warn('[Room Model] MySQL query failed, using fallback:', err.message);
      }
    }

    if (filter.hostel) {
      return fallbackData.rooms.filter(r => r.hostel.toLowerCase().includes(filter.hostel.toLowerCase()));
    }
    return fallbackData.rooms;
  }
}

module.exports = Room;
