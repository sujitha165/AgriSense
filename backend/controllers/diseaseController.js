const ScanModel = require('../models/scanModel');
const NotificationModel = require('../models/notificationModel');
const { analyzeCropImage, getTreatmentForDiagnosis } = require('../services/aiDetectionService');
const { successResponse, errorResponse } = require('../utils/response');

class DiseaseController {
  static async analyze(req, res) {
    try {
      const { crop, symptoms, notes, imageUrl } = req.body;
      const file = req.file;

      // Determine image URL
      let finalImageUrl = imageUrl;
      if (file) {
        // Construct accessible static URL or local path
        finalImageUrl = `/uploads/${file.filename}`;
      } else if (!imageUrl) {
        return errorResponse(res, 'Please upload a leaf image. Real AI mode does not use simulated sample diagnoses.', 400);
      }

      // Execute AI Analysis
      const analysisResult = await analyzeCropImage({
        imageBuffer: null,
        filePath: file ? file.path : null,
        imageUrl: finalImageUrl,
        imageFilename: file ? file.originalname : null,
        imageMimeType: file ? file.mimetype : null,
        cropType: crop || 'Auto Detect',
        cropHint: req.user?.main_crop || ''
      });

      // Save to database/store linked to authenticated user
      const savedScan = await ScanModel.create({
        user_id: req.user ? req.user.id : 1,
        image_url: finalImageUrl,
        crop: analysisResult.crop,
        disease: analysisResult.disease,
        confidence: analysisResult.confidence,
        severity: analysisResult.severity,
        symptoms: analysisResult.symptoms,
        causes: analysisResult.causes,
        notes: notes || ''
      });

      // Trigger user notification
      if (req.user) {
        await NotificationModel.create({
          user_id: req.user.id,
          title: `Analysis: ${analysisResult.crop} - ${analysisResult.disease}`,
          message: `AI image classification completed with ${analysisResult.confidence}% model confidence. View the action plan and verify the diagnosis if needed.`,
          type: 'scan',
          link: `/results/${savedScan.id}`
        });
      }

      return successResponse(
        res,
        {
          ...savedScan,
          pathogen: analysisResult.pathogen,
          treatment: analysisResult.treatment,
          prevention: analysisResult.prevention,
          monitoring: analysisResult.monitoring,
          expert_warning: analysisResult.expert_warning,
          top_predictions: analysisResult.top_predictions,
          model: analysisResult.model,
          confidence_note: analysisResult.confidence_note,
          crop_mismatch: analysisResult.crop_mismatch
        },
        'Crop image analyzed successfully.',
        201
      );
    } catch (err) {
      return errorResponse(res, 'We couldn\'t analyze this image. Please upload a clearer crop image.', 500, err);
    }
  }

  static async getHistory(req, res) {
    try {
      const userId = req.user.id;
      const { crop, severity, search, limit } = req.query;

      const scans = await ScanModel.getAllByUserId(userId, { crop, severity, search, limit });
      return successResponse(res, scans);
    } catch (err) {
      return errorResponse(res, 'Failed to fetch scan history.', 500, err);
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const scan = await ScanModel.findById(id);

      if (!scan) {
        return errorResponse(res, 'Crop scan record not found.', 404);
      }

      // Reconstruct knowledge base treatment advice for this scan
      const analysis = getTreatmentForDiagnosis(scan.crop, scan.disease);

      return successResponse(res, {
        ...scan,
        pathogen: analysis.pathogen,
        treatment: analysis.treatment,
        prevention: analysis.prevention,
        monitoring: analysis.monitoring,
        expert_warning: analysis.expert_warning
      });
    } catch (err) {
      return errorResponse(res, 'Failed to retrieve scan report.', 500, err);
    }
  }

  static async deleteScan(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ScanModel.deleteById(id, req.user.id);
      if (!deleted) {
        return errorResponse(res, 'Scan record not found or unauthorized to delete.', 404);
      }
      return successResponse(res, { id }, 'Scan record deleted successfully.');
    } catch (err) {
      return errorResponse(res, 'Failed to delete scan record.', 500, err);
    }
  }
}

module.exports = DiseaseController;
