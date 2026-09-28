const { getPool, isDbConnected, fallbackStore } = require('../config/db');

class UserModel {
  static async findByEmail(email) {
    if (isDbConnected()) {
      const [rows] = await getPool().query('SELECT * FROM users WHERE email = ? LIMIT 1', [email.toLowerCase().trim()]);
      return rows[0] || null;
    }
    return fallbackStore.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
  }

  static async findById(id) {
    const numId = parseInt(id, 10);
    if (isDbConnected()) {
      const [rows] = await getPool().query('SELECT id, name, email, phone, location, language, main_crop, avatar_url, created_at FROM users WHERE id = ?', [numId]);
      return rows[0] || null;
    }
    const user = fallbackStore.users.find(u => u.id === numId);
    if (!user) return null;
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }

  static async create({ name, email, phone, password_hash, location, language, main_crop }) {
    if (isDbConnected()) {
      const [result] = await getPool().query(
        'INSERT INTO users (name, email, phone, password_hash, location, language, main_crop) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, email.toLowerCase().trim(), phone, password_hash, location || 'Tamil Nadu', language || 'en', main_crop || 'Tomato']
      );
      return this.findById(result.insertId);
    }
    const newUser = {
      id: fallbackStore.users.length + 1,
      name,
      email: email.toLowerCase().trim(),
      phone,
      password_hash,
      location: location || 'Tamil Nadu',
      language: language || 'en',
      main_crop: main_crop || 'Tomato',
      avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80`,
      created_at: new Date().toISOString()
    };
    fallbackStore.users.push(newUser);
    const { password_hash: _, ...safeUser } = newUser;
    return safeUser;
  }

  static async update(id, updates) {
    const numId = parseInt(id, 10);
    if (isDbConnected()) {
      const fields = [];
      const values = [];
      for (const [key, val] of Object.entries(updates)) {
        if (['name', 'phone', 'location', 'language', 'main_crop', 'avatar_url'].includes(key)) {
          fields.push(`${key} = ?`);
          values.push(val);
        }
      }
      if (fields.length > 0) {
        values.push(numId);
        await getPool().query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
      }
      return this.findById(numId);
    }

    const userIndex = fallbackStore.users.findIndex(u => u.id === numId);
    if (userIndex !== -1) {
      fallbackStore.users[userIndex] = {
        ...fallbackStore.users[userIndex],
        ...updates
      };
      const { password_hash, ...safeUser } = fallbackStore.users[userIndex];
      return safeUser;
    }
    return null;
  }
}

module.exports = UserModel;
