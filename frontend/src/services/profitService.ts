import { ExpenseRecord, ExpenseSummary } from '../types';
import { apiRequest, LocalDB } from './api';

export const profitService = {
  async getExpensesAndSummary(): Promise<{ records: ExpenseRecord[]; summary: ExpenseSummary }> {
    const res = await apiRequest<{ records: ExpenseRecord[]; summary: ExpenseSummary }>('/profit');
    if (res.data && res.data.records) return res.data;

    const records = LocalDB.getExpenses();
    let totalExpenses = 0, totalRevenue = 0, totalProfit = 0;
    records.forEach(r => {
      totalExpenses += r.total_cost || 0;
      totalRevenue += r.revenue || 0;
      totalProfit += r.profit || 0;
    });
    const overallMargin = totalRevenue > 0 ? parseFloat(((totalProfit / totalRevenue) * 100).toFixed(1)) : 0;
    return {
      records,
      summary: {
        totalExpenses,
        totalRevenue,
        totalProfit,
        overallMargin,
        activeCropsCount: records.length
      }
    };
  },

  async addExpense(record: Omit<ExpenseRecord, 'id' | 'total_cost' | 'profit'>): Promise<ExpenseRecord> {
    const res = await apiRequest<ExpenseRecord>('/profit', {
      method: 'POST',
      body: JSON.stringify(record)
    });
    if (res.data && res.data.id) return res.data;

    const list = LocalDB.getExpenses();
    const total_cost = record.seed_cost + record.fertilizer_cost + record.labor_cost + record.pesticide_cost + record.other_cost;
    const profit = record.revenue - total_cost;
    const newRecord: ExpenseRecord = {
      ...record,
      id: Date.now(),
      total_cost,
      profit,
      created_at: new Date().toISOString()
    };
    list.unshift(newRecord);
    LocalDB.saveExpenses(list);
    return newRecord;
  },

  async deleteExpense(id: number): Promise<boolean> {
    try {
      await apiRequest(`/profit/${id}`, { method: 'DELETE' });
    } catch (e) {
      // ignore
    }
    const list = LocalDB.getExpenses().filter(r => r.id !== id);
    LocalDB.saveExpenses(list);
    return true;
  }
};
