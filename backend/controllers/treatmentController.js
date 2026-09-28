const TreatmentModel = require('../models/treatmentModel');
const NotificationModel = require('../models/notificationModel');
const { successResponse, errorResponse } = require('../utils/response');

class TreatmentController {
  static async getByScanId(req, res) {
    try {
      const { scanId } = req.params;
      const treatment = await TreatmentModel.getByScanId(scanId);

      if (!treatment) {
        return errorResponse(res, 'No saved treatment plan found for this scan.', 404);
      }

      return successResponse(res, treatment);
    } catch (err) {
      return errorResponse(res, 'Failed to fetch treatment plan.', 500, err);
    }
  }

  static async saveTreatment(req, res) {
    try {
      const { scan_id, immediate_action, treatment_plan, prevention, monitoring, expert_warning } = req.body;

      if (!scan_id || !immediate_action) {
        return errorResponse(res, 'scan_id and immediate_action are required.', 400);
      }

      const treatment = await TreatmentModel.create({
        scan_id,
        user_id: req.user.id,
        immediate_action,
        treatment_plan: treatment_plan || [],
        prevention: prevention || [],
        monitoring: monitoring || 'Inspect field every 3 days. Re-scan leaves after 5 days.',
        expert_warning: expert_warning || 'For severe crop damage, consult a qualified agricultural expert.'
      });

      // Notification
      await NotificationModel.create({
        user_id: req.user.id,
        title: 'Treatment Plan Saved',
        message: 'Personalized action plan has been recorded in your agricultural management log.',
        type: 'treatment',
        link: '/history'
      });

      return successResponse(res, treatment, 'Treatment plan saved successfully.', 201);
    } catch (err) {
      return errorResponse(res, 'Failed to save treatment plan.', 500, err);
    }
  }

  static async getAllSaved(req, res) {
    try {
      const treatments = await TreatmentModel.getAllByUserId(req.user.id);
      return successResponse(res, treatments);
    } catch (err) {
      return errorResponse(res, 'Failed to fetch saved treatments.', 500, err);
    }
  }
}

module.exports = TreatmentController;
