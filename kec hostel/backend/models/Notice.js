const { isDbActive, executeQuery } = require('../config/db');
const fallbackData = require('../data/mockFallback');

class Notice {
  static async findAll() {
    if (isDbActive()) {
      try {
        const rows = await executeQuery('SELECT * FROM notices ORDER BY id DESC');
        if (rows.length > 0) return rows;
      } catch (err) {
        console.warn('[Notice Model] MySQL query failed, using fallback:', err.message);
      }
    }
    return fallbackData.notices;
  }

  static async create(data) {
    const record = {
      id: fallbackData.notices.length + 1,
      title: data.title,
      category: data.category || 'General',
      published_by: data.published_by,
      date: new Date().toISOString().slice(0, 10),
      content: data.content
    };

    if (isDbActive()) {
      try {
        const result = await executeQuery(
          'INSERT INTO notices (title, category, published_by, date, content) VALUES (?, ?, ?, ?, ?)',
          [record.title, record.category, record.published_by, record.date, record.content]
        );
        record.id = result.insertId;
        return record;
      } catch (err) {
        console.warn('[Notice Model] MySQL insert failed, using fallback:', err.message);
      }
    }

    fallbackData.notices.unshift(record);
    return record;
  }

  static getMessMenu() {
    return fallbackData.messMenu;
  }
}

module.exports = Notice;
