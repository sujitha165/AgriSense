const { errorResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error('[API Error]', err.stack || err.message || err);

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return errorResponse(res, 'File too large. Maximum size allowed is 15MB.', 400);
    }
    return errorResponse(res, `Upload error: ${err.message}`, 400);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred. Please try again.';

  return errorResponse(res, message, statusCode, err);
};

const notFoundHandler = (req, res) => {
  return errorResponse(res, `Endpoint not found: ${req.method} ${req.originalUrl}`, 404);
};

module.exports = {
  errorHandler,
  notFoundHandler
};
