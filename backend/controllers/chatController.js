const { getChatResponse } = require('../services/chatBotService');
const ScanModel = require('../models/scanModel');
const { successResponse, errorResponse } = require('../utils/response');

class ChatController {
  static async handleChat(req, res) {
    try {
      const { message, history, language, locationContext } = req.body;

      if (!message || message.trim() === '') {
        return errorResponse(res, 'Please provide a message or question.', 400);
      }

      const scans = await ScanModel.getAllByUserId(req.user.id, { limit: 1 });
      const currentScan = scans[0] || null;
      const result = await getChatResponse({
        message,
        history: history || [],
        language: language || req.user.language || 'en',
        farmer: req.user,
        currentScan,
        locationContext: typeof locationContext === 'string' ? locationContext : ''
      });

      return successResponse(res, {
        reply: result.reply,
        source: result.source,
        current_scan: currentScan ? {
          id: currentScan.id,
          crop: currentScan.crop,
          disease: currentScan.disease,
          confidence: currentScan.confidence,
          severity: currentScan.severity,
          created_at: currentScan.created_at
        } : null,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      return errorResponse(res, 'The AI assistant is temporarily unavailable. Please try again.', 500, err);
    }
  }
}

module.exports = ChatController;
