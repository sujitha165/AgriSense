import React from 'react';

interface ConfidenceMeterProps {
  confidence: number;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ confidence }) => {
  const safeConfidence = Math.min(100, Math.max(0, confidence));

  const getColor = () => {
    if (safeConfidence >= 90) return 'text-emerald-600 dark:text-emerald-400 stroke-emerald-500';
    if (safeConfidence >= 75) return 'text-agri-600 dark:text-agri-400 stroke-agri-500';
    if (safeConfidence >= 40) return 'text-amber-500 stroke-amber-500';
    return 'text-rose-600 dark:text-rose-400 stroke-rose-500';
  };

  // SVG circular calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeConfidence / 100) * circumference;

  return (
    <div className="flex items-center gap-4 bg-white dark:bg-darkbg-card p-4 rounded-2xl border border-stone-200 dark:border-darkbg-border">
      <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
        <svg className="w-20 h-20 -rotate-90 transform" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-stone-100 dark:stroke-darkbg-border"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Active progress */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className={`transition-all duration-1000 ease-out ${getColor()}`}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <span className="absolute text-sm font-extrabold text-stone-900 dark:text-stone-100">
          {safeConfidence.toFixed(1)}%
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
          AI Confidence
        </span>
        <span className="text-sm font-bold text-stone-800 dark:text-stone-200 mt-0.5">
          {safeConfidence >= 90 ? 'High Certainty' : safeConfidence >= 75 ? 'Reliable Match' : safeConfidence >= 40 ? 'Moderate Match' : 'Low Confidence'}
        </span>
        <span className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          {safeConfidence >= 40 ? 'Based on image pattern classification' : 'Retake a focused photo in natural light and verify the crop.'}
        </span>
      </div>
    </div>
  );
};
