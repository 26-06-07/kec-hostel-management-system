const { isDbActive, executeQuery } = require('../config/db');
const fallbackData = require('../data/mockFallback');

class Hostel {
  static async findAll() {
    if (isDbActive()) {
      try {
        const rows = await executeQuery('SELECT * FROM hostels');
        if (rows && rows.length > 0) {
          return rows.map(h => ({
            ...h,
            facilities: typeof h.facilities === 'string' ? JSON.parse(h.facilities) : h.facilities
          }));
        }
      } catch (err) {
        console.warn('[Hostel Model] MySQL query failed, using fallback:', err.message);
      }
    }
    return fallbackData.hostels;
  }

  static async findById(id) {
    if (isDbActive()) {
      try {
        const rows = await executeQuery('SELECT * FROM hostels WHERE id = ?', [id]);
        if (rows && rows.length > 0) {
          const h = rows[0];
          return {
            ...h,
            facilities: typeof h.facilities === 'string' ? JSON.parse(h.facilities) : h.facilities
          };
        }
      } catch (err) {
        console.warn('[Hostel Model] MySQL query failed, using fallback:', err.message);
      }
    }
    return fallbackData.hostels.find(h => h.id.toLowerCase() === id.toLowerCase()) || null;
  }
}

module.exports = Hostel;
