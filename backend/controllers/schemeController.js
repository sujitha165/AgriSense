const SchemeModel = require('../models/schemeModel');
const { successResponse, errorResponse } = require('../utils/response');

class SchemeController {
  static async getAllSchemes(req, res) {
    try {
      const { category, search } = req.query;
      const schemes = await SchemeModel.getAll({ category, search });
      return successResponse(res, schemes);
    } catch (err) {
      return errorResponse(res, 'Failed to fetch government schemes.', 500, err);
    }
  }

  static async getSchemeById(req, res) {
    try {
      const { id } = req.params;
      const scheme = await SchemeModel.findById(id);

      if (!scheme) {
        return errorResponse(res, 'Agricultural scheme not found.', 404);
      }

      return successResponse(res, scheme);
    } catch (err) {
      return errorResponse(res, 'Failed to fetch scheme details.', 500, err);
    }
  }
}

module.exports = SchemeController;
