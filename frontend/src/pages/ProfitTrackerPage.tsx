import React, { useState, useEffect } from 'react';
import { ExpenseForm } from '../components/profit/ExpenseForm';
import { ExpenseBreakdownChart } from '../components/profit/ExpenseBreakdownChart';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { profitService } from '../services/profitService';
import { ExpenseRecord, ExpenseSummary } from '../types';
import { formatCurrency, formatDate } from '../../src/utils/formatters';
import {
  CircleDollarSign,
  Plus,
  Trash2,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  PieChart,
  Layers,
  Calendar
} from 'lucide-react';

export const ProfitTrackerPage: React.FC = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [records, setRecords] = useState<ExpenseRecord[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await profitService.getExpensesAndSummary();
      setRecords(data.records);
      setSummary(data.summary);
    } catch (e) {
      console.error('Profit data error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddRecord = async (formData: any) => {
    try {
      await profitService.addExpense(formData);
      showToast('Crop expense record saved successfully!', 'success');
      setIsAddModalOpen(false);
      loadData();
    } catch (e) {
      showToast('Failed to save record.', 'error');
    }
  };

  const handleDeleteRecord = async (id: number) => {
    if (window.confirm(t('profit.deleteConfirm'))) {
      await profitService.deleteExpense(id);
      showToast('Record deleted.', 'info');
      loadData();
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              {t('profit.title')}
            </h1>
            <Badge variant="emerald" icon={<TrendingUp className="w-3.5 h-3.5" />}>
              Crop Financials (₹)
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            {t('profit.subtitle')}
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
          size="sm"
        >
          {t('profit.addRecord')}
        </Button>
      </div>

      {/* 3-Pillar Farm Economics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Card 1: Total Farm Expenses */}
        <div className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-3xl p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              {t('profit.totalExpenses')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
            {formatCurrency(summary ? summary.totalExpenses : 0)}
          </p>
          <span className="text-[11px] text-stone-400">
            Across {records.length} tracked crop parcels
          </span>
        </div>

        {/* Card 2: Expected Revenue */}
        <div className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-3xl p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
            {formatCurrency(summary ? summary.totalRevenue : 0)}
          </p>
          <span className="text-[11px] text-stone-400">
            Estimated market realization
          </span>
        </div>

        {/* Card 3: Net Profit */}
        <div className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-3xl p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              {t('profit.estimatedProfit')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {formatCurrency(summary ? summary.totalProfit : 0)}
          </p>
          <span className="text-[11px] font-semibold text-emerald-600">
            Margin: {summary ? summary.overallMargin : 0}% net return
          </span>
        </div>
      </div>

      {/* Visual Input Cost Distribution Chart */}
      <ExpenseBreakdownChart records={records} />

      {/* Multi-crop Records Table */}
      <div className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-3xl overflow-hidden shadow-xs space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
            Crop Cultivation Portfolio
          </h3>
          <span className="text-xs text-stone-400">
            Showing {records.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-stone-200 dark:border-darkbg-border text-stone-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Crop</th>
                <th className="py-3 px-4">Area (Acres)</th>
                <th className="py-3 px-4">Expenses</th>
                <th className="py-3 px-4">Revenue</th>
                <th className="py-3 px-4">Net Profit</th>
                <th className="py-3 px-4">Season</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-darkbg-border">
              {records.map(rec => {
                const isProfitable = rec.profit >= 0;
                return (
                  <tr
                    key={rec.id}
                    className="hover:bg-stone-50/70 dark:hover:bg-darkbg-input/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-stone-900 dark:text-stone-100">
                      {rec.crop}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 dark:text-stone-300">
                      {rec.land_area}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-rose-600 dark:text-rose-400 font-mono">
                      {formatCurrency(rec.total_cost)}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-stone-800 dark:text-stone-200 font-mono">
                      {formatCurrency(rec.revenue)}
                    </td>
                    <td className="py-3.5 px-4 font-bold font-mono">
                      <span className={isProfitable ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}>
                        {formatCurrency(rec.profit)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-stone-500 dark:text-stone-400">
                      {rec.season || 'Kharif'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteRecord(rec.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Record Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={t('profit.addRecord')}
        maxWidth="lg"
      >
        <ExpenseForm
          onSave={handleAddRecord}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
