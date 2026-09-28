const { getPool, isDbConnected, fallbackStore } = require('../config/db');

class TreatmentModel {
  static async create({ scan_id, user_id, immediate_action, treatment_plan, prevention, monitoring, expert_warning }) {
    const numScanId = parseInt(scan_id, 10);
    const numUserId = parseInt(user_id, 10);

    if (isDbConnected()) {
      const [result] = await getPool().query(
        `INSERT INTO treatments (scan_id, user_id, immediate_action, treatment_plan, prevention, monitoring, expert_warning)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          numScanId,
          numUserId,
          immediate_action,
          JSON.stringify(treatment_plan || []),
          JSON.stringify(prevention || []),
          monitoring,
          expert_warning || 'For severe crop damage, consult a qualified agricultural expert.'
        ]
      );
      return this.findById(result.insertId);
    }

    const newTreatment = {
      id: fallbackStore.treatments.length + 1,
      scan_id: numScanId,
      user_id: numUserId,
      immediate_action,
      treatment_plan: treatment_plan || [],
      prevention: prevention || [],
      monitoring,
      expert_warning: expert_warning || 'For severe crop damage, consult a qualified agricultural expert.',
      saved_at: new Date().toISOString()
    };
    fallbackStore.treatments.push(newTreatment);
    return newTreatment;
  }

  static async findById(id) {
    const numId = parseInt(id, 10);
    if (isDbConnected()) {
      const [rows] = await getPool().query('SELECT * FROM treatments WHERE id = ? LIMIT 1', [numId]);
      if (!rows[0]) return null;
      const t = rows[0];
      if (typeof t.treatment_plan === 'string') t.treatment_plan = JSON.parse(t.treatment_plan);
      if (typeof t.prevention === 'string') t.prevention = JSON.parse(t.prevention);
      return t;
    }
    return fallbackStore.treatments.find(t => t.id === numId) || null;
  }

  static async getByScanId(scanId) {
    const numScanId = parseInt(scanId, 10);
    if (isDbConnected()) {
      const [rows] = await getPool().query('SELECT * FROM treatments WHERE scan_id = ? ORDER BY saved_at DESC LIMIT 1', [numScanId]);
      if (!rows[0]) return null;
      const t = rows[0];
      if (typeof t.treatment_plan === 'string') t.treatment_plan = JSON.parse(t.treatment_plan);
      if (typeof t.prevention === 'string') t.prevention = JSON.parse(t.prevention);
      return t;
    }
    return fallbackStore.treatments.find(t => t.scan_id === numScanId) || null;
  }

  static async getAllByUserId(userId) {
    const numUserId = parseInt(userId, 10);
    if (isDbConnected()) {
      const [rows] = await getPool().query('SELECT * FROM treatments WHERE user_id = ? ORDER BY saved_at DESC', [numUserId]);
      return rows.map(t => ({
        ...t,
        treatment_plan: typeof t.treatment_plan === 'string' ? JSON.parse(t.treatment_plan) : t.treatment_plan,
        prevention: typeof t.prevention === 'string' ? JSON.parse(t.prevention) : t.prevention
      }));
    }
    return fallbackStore.treatments.filter(t => t.user_id === numUserId);
  }
}

module.exports = TreatmentModel;
