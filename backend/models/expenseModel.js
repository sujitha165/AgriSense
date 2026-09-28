const { getPool, isDbConnected, fallbackStore } = require('../config/db');

class ExpenseModel {
  static calculateTotals({ seed_cost = 0, fertilizer_cost = 0, labor_cost = 0, pesticide_cost = 0, other_cost = 0, revenue = 0 }) {
    const seed = parseFloat(seed_cost) || 0;
    const fert = parseFloat(fertilizer_cost) || 0;
    const labor = parseFloat(labor_cost) || 0;
    const pest = parseFloat(pesticide_cost) || 0;
    const other = parseFloat(other_cost) || 0;
    const rev = parseFloat(revenue) || 0;

    const total_cost = seed + fert + labor + pest + other;
    const profit = rev - total_cost;
    const margin = rev > 0 ? ((profit / rev) * 100).toFixed(1) : 0;

    return { seed, fert, labor, pest, other, total_cost, rev, profit, margin };
  }

  static async create(data) {
    const { user_id, crop, land_area, season, notes } = data;
    const numUserId = parseInt(user_id, 10);
    const { seed, fert, labor, pest, other, total_cost, rev, profit } = this.calculateTotals(data);

    if (isDbConnected()) {
      const [result] = await getPool().query(
        `INSERT INTO expenses (user_id, crop, land_area, seed_cost, fertilizer_cost, labor_cost, pesticide_cost, other_cost, revenue, season, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [numUserId, crop, parseFloat(land_area) || 1, seed, fert, labor, pest, other, rev, season || 'Kharif', notes || '']
      );
      return this.findById(result.insertId);
    }

    const newExpense = {
      id: fallbackStore.expenses.length + 1,
      user_id: numUserId,
      crop,
      land_area: parseFloat(land_area) || 1,
      seed_cost: seed,
      fertilizer_cost: fert,
      labor_cost: labor,
      pesticide_cost: pest,
      other_cost: other,
      total_cost,
      revenue: rev,
      profit,
      season: season || 'Kharif',
      notes: notes || '',
      created_at: new Date().toISOString()
    };
    fallbackStore.expenses.unshift(newExpense);
    return newExpense;
  }

  static async findById(id) {
    const numId = parseInt(id, 10);
    if (isDbConnected()) {
      const [rows] = await getPool().query('SELECT * FROM expenses WHERE id = ? LIMIT 1', [numId]);
      return rows[0] || null;
    }
    return fallbackStore.expenses.find(e => e.id === numId) || null;
  }

  static async getAllByUserId(userId) {
    const numUserId = parseInt(userId, 10);
    if (isDbConnected()) {
      const [rows] = await getPool().query('SELECT * FROM expenses WHERE user_id = ? ORDER BY created_at DESC', [numUserId]);
      return rows;
    }
    return fallbackStore.expenses
      .filter(e => e.user_id === numUserId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  static async update(id, userId, data) {
    const numId = parseInt(id, 10);
    const numUserId = parseInt(userId, 10);
    const { seed, fert, labor, pest, other, total_cost, rev, profit } = this.calculateTotals(data);

    if (isDbConnected()) {
      await getPool().query(
        `UPDATE expenses 
         SET crop = ?, land_area = ?, seed_cost = ?, fertilizer_cost = ?, labor_cost = ?, pesticide_cost = ?, other_cost = ?, revenue = ?, season = ?, notes = ?
         WHERE id = ? AND user_id = ?`,
        [data.crop, parseFloat(data.land_area) || 1, seed, fert, labor, pest, other, rev, data.season || 'Kharif', data.notes || '', numId, numUserId]
      );
      return this.findById(numId);
    }

    const index = fallbackStore.expenses.findIndex(e => e.id === numId && e.user_id === numUserId);
    if (index !== -1) {
      fallbackStore.expenses[index] = {
        ...fallbackStore.expenses[index],
        crop: data.crop || fallbackStore.expenses[index].crop,
        land_area: parseFloat(data.land_area) || fallbackStore.expenses[index].land_area,
        seed_cost: seed,
        fertilizer_cost: fert,
        labor_cost: labor,
        pesticide_cost: pest,
        other_cost: other,
        total_cost,
        revenue: rev,
        profit,
        season: data.season || fallbackStore.expenses[index].season,
        notes: data.notes !== undefined ? data.notes : fallbackStore.expenses[index].notes
      };
      return fallbackStore.expenses[index];
    }
    return null;
  }

  static async delete(id, userId) {
    const numId = parseInt(id, 10);
    const numUserId = parseInt(userId, 10);
    if (isDbConnected()) {
      const [result] = await getPool().query('DELETE FROM expenses WHERE id = ? AND user_id = ?', [numId, numUserId]);
      return result.affectedRows > 0;
    }
    const index = fallbackStore.expenses.findIndex(e => e.id === numId && e.user_id === numUserId);
    if (index !== -1) {
      fallbackStore.expenses.splice(index, 1);
      return true;
    }
    return false;
  }
}

module.exports = ExpenseModel;
