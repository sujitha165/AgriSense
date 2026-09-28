const NotificationModel = require('../models/notificationModel');
const { successResponse, errorResponse } = require('../utils/response');

class NotificationController {
  static async getAll(req, res) {
    try {
      const notifications = await NotificationModel.getAllByUserId(req.user.id);
      const unreadCount = notifications.filter(n => !n.is_read).length;
      return successResponse(res, { notifications, unreadCount });
    } catch (err) {
      return errorResponse(res, 'Failed to fetch notifications.', 500, err);
    }
  }

  static async markAsRead(req, res) {
    try {
      const { id } = req.params;
      await NotificationModel.markAsRead(id, req.user.id);
      return successResponse(res, { id }, 'Notification marked as read.');
    } catch (err) {
      return errorResponse(res, 'Failed to update notification.', 500, err);
    }
  }

  static async markAllAsRead(req, res) {
    try {
      await NotificationModel.markAllAsRead(req.user.id);
      return successResponse(res, null, 'All notifications marked as read.');
    } catch (err) {
      return errorResponse(res, 'Failed to update notifications.', 500, err);
    }
  }
}

module.exports = NotificationController;
