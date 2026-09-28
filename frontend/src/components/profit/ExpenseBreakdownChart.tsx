import React from 'react';
import { ExpenseRecord } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface ExpenseBreakdownChartProps {
  records: ExpenseRecord[];
}

export const ExpenseBreakdownChart: React.FC<ExpenseBreakdownChartProps> = ({ records }) => {
  let totalSeed = 0;
  let totalFert = 0;
  let totalLabor = 0;
  let totalPest = 0;
  let totalOther = 0;

  records.forEach(r => {
    totalSeed += r.seed_cost || 0;
    totalFert += r.fertilizer_cost || 0;
    totalLabor += r.labor_cost || 0;
    totalPest += r.pesticide_cost || 0;
    totalOther += r.other_cost || 0;
  });

  const grandTotal = totalSeed + totalFert + totalLabor + totalPest + totalOther;

  const categories = [
    { label: 'Labor', amount: totalLabor, color: 'bg-amber-500', barColor: '#f59e0b', text: 'text-amber-600' },
    { label: 'Fertilizers', amount: totalFert, color: 'bg-emerald-500', barColor: '#10b981', text: 'text-emerald-600' },
    { label: 'Seeds', amount: totalSeed, color: 'bg-blue-500', barColor: '#3b82f6', text: 'text-blue-600' },
    { label: 'Pesticides', amount: totalPest, color: 'bg-rose-500', barColor: '#f43f5e', text: 'text-rose-600' },
    { label: 'Other', amount: totalOther, color: 'bg-purple-500', barColor: '#a855f7', text: 'text-purple-600' }
  ];

  return (
    <div className="bg-white dark:bg-darkbg-card rounded-2xl border border-stone-200 dark:border-darkbg-border p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
          Input Cost Distribution
        </h4>
        <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
          Total: {formatCurrency(grandTotal)}
        </span>
      </div>

      {/* Segmented Cost Stack Bar */}
      {grandTotal > 0 ? (
        <>
          <div className="h-4 w-full rounded-full overflow-hidden flex bg-stone-100 dark:bg-darkbg-border">
            {categories.map(cat => {
              const pct = ((cat.amount / grandTotal) * 100).toFixed(1);
              if (cat.amount <= 0) return null;
              return (
                <div
                  key={cat.label}
                  style={{ width: `${pct}%` }}
                  className={`${cat.color} h-full transition-all duration-500`}
                  title={`${cat.label}: ${formatCurrency(cat.amount)} (${pct}%)`}
                />
              );
            })}
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {categories.map(cat => {
              const pct = grandTotal > 0 ? ((cat.amount / grandTotal) * 100).toFixed(1) : '0';
              return (
                <div key={cat.label} className="flex items-center gap-2 text-xs">
                  <span className={`w-3 h-3 rounded-full ${cat.color} shrink-0`} />
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-stone-700 dark:text-stone-300 truncate">
                      {cat.label} ({pct}%)
                    </span>
                    <span className="text-stone-400 font-mono text-[11px]">
                      {formatCurrency(cat.amount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <p className="text-xs text-stone-400 py-6 text-center">
          No expense records entered yet.
        </p>
      )}
    </div>
  );
};
