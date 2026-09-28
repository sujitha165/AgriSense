import React, { useState } from 'react';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/formatters';
import { useLanguage } from '../../context/LanguageContext';
import { CROPS_LIST } from '../../data/mockDiseases';
import { Calculator, PlusCircle } from 'lucide-react';

interface ExpenseFormProps {
  onSave: (data: any) => void;
  onCancel?: () => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSave, onCancel }) => {
  const { t } = useLanguage();

  const [crop, setCrop] = useState('Tomato');
  const [landArea, setLandArea] = useState('2.0');
  const [seedCost, setSeedCost] = useState('6000');
  const [fertilizerCost, setFertilizerCost] = useState('12000');
  const [laborCost, setLaborCost] = useState('18000');
  const [pesticideCost, setPesticideCost] = useState('5000');
  const [otherCost, setOtherCost] = useState('3000');
  const [revenue, setRevenue] = useState('85000');
  const [season, setSeason] = useState('Kharif');
  const [notes, setNotes] = useState('');

  // Live calculation
  const totalExpense =
    (parseFloat(seedCost) || 0) +
    (parseFloat(fertilizerCost) || 0) +
    (parseFloat(laborCost) || 0) +
    (parseFloat(pesticideCost) || 0) +
    (parseFloat(otherCost) || 0);

  const expectedRev = parseFloat(revenue) || 0;
  const estimatedProfit = expectedRev - totalExpense;
  const margin = expectedRev > 0 ? ((estimatedProfit / expectedRev) * 100).toFixed(1) : '0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      crop,
      land_area: parseFloat(landArea) || 1,
      seed_cost: parseFloat(seedCost) || 0,
      fertilizer_cost: parseFloat(fertilizerCost) || 0,
      labor_cost: parseFloat(laborCost) || 0,
      pesticide_cost: parseFloat(pesticideCost) || 0,
      other_cost: parseFloat(otherCost) || 0,
      revenue: expectedRev,
      season,
      notes
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Live Financial Summary Banner */}
      <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div>
          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Total Expenses</span>
          <p className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-0.5">
            {formatCurrency(totalExpense)}
          </p>
        </div>
        <div>
          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Expected Revenue</span>
          <p className="text-lg font-bold text-stone-900 dark:text-stone-100 mt-0.5">
            {formatCurrency(expectedRev)}
          </p>
        </div>
        <div>
          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Estimated Net Profit</span>
          <p
            className={`text-lg font-bold mt-0.5 ${
              estimatedProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
            }`}
          >
            {formatCurrency(estimatedProfit)} ({margin}%)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Crop Selection */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
            {t('profit.crop')} *
          </label>
          <select
            value={crop}
            onChange={e => setCrop(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-darkbg-border bg-white dark:bg-darkbg-card text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
            required
          >
            {CROPS_LIST.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Land Area */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
            {t('profit.landArea')} *
          </label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            value={landArea}
            onChange={e => setLandArea(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-darkbg-border bg-white dark:bg-darkbg-card text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
            required
          />
        </div>

        {/* Seed Cost */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
            {t('profit.seedCost')}
          </label>
          <input
            type="number"
            min="0"
            value={seedCost}
            onChange={e => setSeedCost(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-darkbg-border bg-white dark:bg-darkbg-card text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
          />
        </div>

        {/* Fertilizer Cost */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
            {t('profit.fertilizerCost')}
          </label>
          <input
            type="number"
            min="0"
            value={fertilizerCost}
            onChange={e => setFertilizerCost(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-darkbg-border bg-white dark:bg-darkbg-card text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
          />
        </div>

        {/* Labor Cost */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
            {t('profit.laborCost')}
          </label>
          <input
            type="number"
            min="0"
            value={laborCost}
            onChange={e => setLaborCost(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-darkbg-border bg-white dark:bg-darkbg-card text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
          />
        </div>

        {/* Pesticide Cost */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
            {t('profit.pesticideCost')}
          </label>
          <input
            type="number"
            min="0"
            value={pesticideCost}
            onChange={e => setPesticideCost(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-darkbg-border bg-white dark:bg-darkbg-card text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
          />
        </div>

        {/* Other Expenses */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
            {t('profit.otherCost')}
          </label>
          <input
            type="number"
            min="0"
            value={otherCost}
            onChange={e => setOtherCost(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-darkbg-border bg-white dark:bg-darkbg-card text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
          />
        </div>

        {/* Expected Revenue */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
            {t('profit.revenue')} *
          </label>
          <input
            type="number"
            min="0"
            value={revenue}
            onChange={e => setRevenue(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-darkbg-border bg-white dark:bg-darkbg-card text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Season */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
            {t('profit.season')}
          </label>
          <input
            type="text"
            placeholder="e.g. Kharif 2026, Rabi"
            value={season}
            onChange={e => setSeason(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-darkbg-border bg-white dark:bg-darkbg-card text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
            Field Notes / Yield Estimate
          </label>
          <input
            type="text"
            placeholder="e.g. Expected 120 crates, early intervention"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-darkbg-border bg-white dark:bg-darkbg-card text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" icon={<PlusCircle className="w-4 h-4" />}>
          {t('profit.saveRecord')}
        </Button>
      </div>
    </form>
  );
};
