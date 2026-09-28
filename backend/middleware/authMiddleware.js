const jwt = require('jsonwebtoken');
const env = require('../config/env');
const UserModel = require('../models/userModel');
const { errorResponse } = require('../utils/response');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Authentication token missing or invalid', 401);
    }

    const token = authHeader.split(' ')[1];

    // Special token for quick demo mode
    if (token === 'demo-farmer-token') {
      req.user = {
        id: 1,
        name: 'Arun Kumar',
        email: 'arun.farmer@agrisense.in',
        phone: '+91 98765 43210',
        location: 'Coimbatore, Tamil Nadu',
        language: 'en',
        main_crop: 'Tomato'
      };
      return next();
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return errorResponse(res, 'User not found or account deactivated', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 'Session expired. Please log in again.', 401);
    }
    return errorResponse(res, 'Invalid authentication credentials', 401, err);
  }
};

module.exports = {
  authenticate
};
