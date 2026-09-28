const { getPool, isDbConnected, fallbackStore } = require('../config/db');

class NotificationModel {
  static async getAllByUserId(userId) {
    const numUserId = parseInt(userId, 10);
    if (isDbConnected()) {
      const [rows] = await getPool().query('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 30', [numUserId]);
      return rows;
    }
    return fallbackStore.notifications
      .filter(n => n.user_id === numUserId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  static async markAsRead(id, userId) {
    const numId = parseInt(id, 10);
    const numUserId = parseInt(userId, 10);
    if (isDbConnected()) {
      await getPool().query('UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?', [numId, numUserId]);
      return true;
    }
    const notif = fallbackStore.notifications.find(n => n.id === numId && n.user_id === numUserId);
    if (notif) {
      notif.is_read = true;
      return true;
    }
    return false;
  }

  static async markAllAsRead(userId) {
    const numUserId = parseInt(userId, 10);
    if (isDbConnected()) {
      await getPool().query('UPDATE notifications SET is_read = TRUE WHERE user_id = ?', [numUserId]);
      return true;
    }
    fallbackStore.notifications.forEach(n => {
      if (n.user_id === numUserId) n.is_read = true;
    });
    return true;
  }

  static async create({ user_id, title, message, type = 'system', link = null }) {
    const numUserId = parseInt(user_id, 10);
    if (isDbConnected()) {
      const [res] = await getPool().query(
        'INSERT INTO notifications (user_id, title, message, type, link) VALUES (?, ?, ?, ?, ?)',
        [numUserId, title, message, type, link]
      );
      return { id: res.insertId, user_id: numUserId, title, message, type, link, is_read: false, created_at: new Date().toISOString() };
    }
    const newNotif = {
      id: fallbackStore.notifications.length + 1,
      user_id: numUserId,
      title,
      message,
      type,
      link,
      is_read: false,
      created_at: new Date().toISOString()
    };
    fallbackStore.notifications.unshift(newNotif);
    return newNotif;
  }
}

module.exports = NotificationModel;
