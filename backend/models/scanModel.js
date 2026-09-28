const { getPool, isDbConnected, fallbackStore } = require('../config/db');

class ScanModel {
  static async create({ user_id, image_url, crop, disease, confidence, severity, symptoms, causes, notes }) {
    const numUserId = parseInt(user_id, 10);
    const numConfidence = parseFloat(confidence);

    if (isDbConnected()) {
      const [result] = await getPool().query(
        'INSERT INTO crop_scans (user_id, image_url, crop, disease, confidence, severity, symptoms, causes, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          numUserId,
          image_url,
          crop,
          disease,
          numConfidence,
          severity,
          JSON.stringify(symptoms || []),
          JSON.stringify(causes || []),
          notes || ''
        ]
      );
      return this.findById(result.insertId);
    }

    const newScan = {
      id: fallbackStore.scans.length + 1,
      user_id: numUserId,
      image_url,
      crop,
      disease,
      confidence: numConfidence,
      severity,
      symptoms: symptoms || [],
      causes: causes || [],
      notes: notes || '',
      created_at: new Date().toISOString()
    };
    fallbackStore.scans.unshift(newScan);
    return newScan;
  }

  static async findById(id) {
    const numId = parseInt(id, 10);
    if (isDbConnected()) {
      const [rows] = await getPool().query('SELECT * FROM crop_scans WHERE id = ? LIMIT 1', [numId]);
      if (!rows[0]) return null;
      const scan = rows[0];
      if (typeof scan.symptoms === 'string') scan.symptoms = JSON.parse(scan.symptoms);
      if (typeof scan.causes === 'string') scan.causes = JSON.parse(scan.causes);
      return scan;
    }
    return fallbackStore.scans.find(s => s.id === numId) || null;
  }

  static async getAllByUserId(userId, { crop, severity, search, limit = 50 } = {}) {
    const numUserId = parseInt(userId, 10);
    if (isDbConnected()) {
      let query = 'SELECT * FROM crop_scans WHERE user_id = ?';
      const params = [numUserId];

      if (crop && crop !== 'All') {
        query += ' AND crop = ?';
        params.push(crop);
      }
      if (severity && severity !== 'All') {
        query += ' AND severity = ?';
        params.push(severity);
      }
      if (search) {
        query += ' AND (disease LIKE ? OR crop LIKE ? OR notes LIKE ?)';
        const term = `%${search}%`;
        params.push(term, term, term);
      }
      query += ' ORDER BY created_at DESC LIMIT ?';
      params.push(parseInt(limit, 10));

      const [rows] = await getPool().query(query, params);
      return rows.map(scan => ({
        ...scan,
        symptoms: typeof scan.symptoms === 'string' ? JSON.parse(scan.symptoms) : scan.symptoms,
        causes: typeof scan.causes === 'string' ? JSON.parse(scan.causes) : scan.causes
      }));
    }

    let results = fallbackStore.scans.filter(s => s.user_id === numUserId);
    if (crop && crop !== 'All') {
      results = results.filter(s => s.crop.toLowerCase() === crop.toLowerCase());
    }
    if (severity && severity !== 'All') {
      results = results.filter(s => s.severity.toLowerCase() === severity.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(s =>
        s.disease.toLowerCase().includes(q) ||
        s.crop.toLowerCase().includes(q) ||
        (s.notes && s.notes.toLowerCase().includes(q))
      );
    }
    return results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  static async deleteById(id, userId) {
    const numId = parseInt(id, 10);
    const numUserId = parseInt(userId, 10);
    if (isDbConnected()) {
      const [result] = await getPool().query('DELETE FROM crop_scans WHERE id = ? AND user_id = ?', [numId, numUserId]);
      return result.affectedRows > 0;
    }
    const index = fallbackStore.scans.findIndex(s => s.id === numId && s.user_id === numUserId);
    if (index !== -1) {
      fallbackStore.scans.splice(index, 1);
      return true;
    }
    return false;
  }
}

module.exports = ScanModel;
