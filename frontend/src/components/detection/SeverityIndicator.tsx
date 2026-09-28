import React from 'react';
import { Severity } from '../../types';
import { getSeverityStyles } from '../../utils/formatters';
import { useLanguage } from '../../context/LanguageContext';

interface SeverityIndicatorProps {
  severity: Severity;
}

export const SeverityIndicator: React.FC<SeverityIndicatorProps> = ({ severity }) => {
  const { t } = useLanguage();
  const styles = getSeverityStyles(severity);

  if (severity === 'Not assessed') {
    return (
      <div className="bg-white dark:bg-darkbg-card p-4 rounded-2xl border border-stone-200 dark:border-darkbg-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Disease Severity</span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${styles.badge}`}>Not assessed</span>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400">The disease classifier identifies the disease class; it does not measure how much of the plant is infected.</p>
      </div>
    );
  }

  const levels: { key: Severity; label: string; desc: string }[] = [
    { key: 'Healthy', label: 'Healthy', desc: 'Normal vigor, no infection' },
    { key: 'Low', label: 'Low', desc: 'Isolated leaf spots, minor spread' },
    { key: 'Moderate', label: 'Moderate', desc: 'Spread to multiple branches' },
    { key: 'Severe', label: 'Severe', desc: 'Widespread foliage loss/wilting' }
  ];

  return (
    <div className="bg-white dark:bg-darkbg-card p-4 rounded-2xl border border-stone-200 dark:border-darkbg-border space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
          Disease Severity
        </span>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-bold border ${styles.badge}`}
        >
          {t(`severityLevels.${severity}`, severity)}
        </span>
      </div>

      {/* 4-Segment Visual Gauge */}
      <div className="grid grid-cols-4 gap-1.5 h-2.5 rounded-full overflow-hidden bg-stone-100 dark:bg-darkbg-border p-0.5">
        {levels.map(lvl => {
          const isSelected = lvl.key === severity;
          let segmentColor = 'bg-stone-200 dark:bg-darkbg-border';
          if (isSelected) {
            if (lvl.key === 'Healthy') segmentColor = 'bg-emerald-500 shadow-sm';
            else if (lvl.key === 'Low') segmentColor = 'bg-blue-500 shadow-sm';
            else if (lvl.key === 'Moderate') segmentColor = 'bg-amber-500 shadow-sm';
            else if (lvl.key === 'Severe') segmentColor = 'bg-rose-500 shadow-sm';
          }

          return (
            <div
              key={lvl.key}
              className={`rounded-full transition-all duration-300 ${segmentColor}`}
              title={`${lvl.label}: ${lvl.desc}`}
            />
          );
        })}
      </div>

      <p className="text-xs text-stone-500 dark:text-stone-400">
        {levels.find(l => l.key === severity)?.desc}
      </p>
    </div>
  );
};
