const ExpenseModel = require('../models/expenseModel');
const { successResponse, errorResponse } = require('../utils/response');

class ProfitController {
  static async getAll(req, res) {
    try {
      const expenses = await ExpenseModel.getAllByUserId(req.user.id);

      // Aggregate high-level farm financial metrics
      let totalFarmExpenses = 0;
      let totalFarmRevenue = 0;
      let totalFarmProfit = 0;

      expenses.forEach(item => {
        totalFarmExpenses += parseFloat(item.total_cost) || 0;
        totalFarmRevenue += parseFloat(item.revenue) || 0;
        totalFarmProfit += parseFloat(item.profit) || 0;
      });

      const overallMargin = totalFarmRevenue > 0
        ? parseFloat(((totalFarmProfit / totalFarmRevenue) * 100).toFixed(1))
        : 0;

      return successResponse(res, {
        records: expenses,
        summary: {
          totalExpenses: totalFarmExpenses,
          totalRevenue: totalFarmRevenue,
          totalProfit: totalFarmProfit,
          overallMargin,
          activeCropsCount: expenses.length
        }
      });
    } catch (err) {
      return errorResponse(res, 'Failed to fetch profit and expense records.', 500, err);
    }
  }

  static async create(req, res) {
    try {
      const { crop, land_area, seed_cost, fertilizer_cost, labor_cost, pesticide_cost, other_cost, revenue, season, notes } = req.body;

      if (!crop) {
        return errorResponse(res, 'Crop name is required.', 400);
      }

      const expense = await ExpenseModel.create({
        user_id: req.user.id,
        crop,
        land_area: parseFloat(land_area) || 1,
        seed_cost: parseFloat(seed_cost) || 0,
        fertilizer_cost: parseFloat(fertilizer_cost) || 0,
        labor_cost: parseFloat(labor_cost) || 0,
        pesticide_cost: parseFloat(pesticide_cost) || 0,
        other_cost: parseFloat(other_cost) || 0,
        revenue: parseFloat(revenue) || 0,
        season: season || 'Kharif',
        notes: notes || ''
      });

      return successResponse(res, expense, 'Crop profit record added successfully.', 201);
    } catch (err) {
      return errorResponse(res, 'Failed to save profit record.', 500, err);
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const updated = await ExpenseModel.update(id, req.user.id, req.body);

      if (!updated) {
        return errorResponse(res, 'Expense record not found or unauthorized.', 404);
      }

      return successResponse(res, updated, 'Crop record updated successfully.');
    } catch (err) {
      return errorResponse(res, 'Failed to update record.', 500, err);
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const success = await ExpenseModel.delete(id, req.user.id);

      if (!success) {
        return errorResponse(res, 'Record not found or unauthorized.', 404);
      }

      return successResponse(res, { id }, 'Record deleted successfully.');
    } catch (err) {
      return errorResponse(res, 'Failed to delete record.', 500, err);
    }
  }
}

module.exports = ProfitController;
