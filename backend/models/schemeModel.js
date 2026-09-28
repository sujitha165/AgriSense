const { getPool, isDbConnected, fallbackStore } = require('../config/db');

class SchemeModel {
  static async getAll({ category, search } = {}) {
    if (isDbConnected()) {
      let query = 'SELECT * FROM government_schemes WHERE is_active = TRUE';
      const params = [];

      if (category && category !== 'All') {
        query += ' AND category = ?';
        params.push(category);
      }
      if (search) {
        query += ' AND (name LIKE ? OR description LIKE ? OR benefits LIKE ?)';
        const term = `%${search}%`;
        params.push(term, term, term);
      }
      query += ' ORDER BY id ASC';

      const [rows] = await getPool().query(query, params);
      return rows;
    }

    let results = [...fallbackStore.schemes];
    if (category && category !== 'All') {
      results = results.filter(s => s.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.benefits.toLowerCase().includes(q)
      );
    }
    return results;
  }

  static async findById(id) {
    const numId = parseInt(id, 10);
    if (isDbConnected()) {
      const [rows] = await getPool().query('SELECT * FROM government_schemes WHERE id = ? LIMIT 1', [numId]);
      return rows[0] || null;
    }
    return fallbackStore.schemes.find(s => s.id === numId) || null;
  }
}

module.exports = SchemeModel;
