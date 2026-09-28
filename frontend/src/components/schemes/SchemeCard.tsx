import React, { useState } from 'react';
import { GovernmentScheme } from '../../types';
import { ExternalLink, Check, ChevronDown, ChevronUp, FileText, Award } from 'lucide-react';
import { Badge } from '../common/Badge';

interface SchemeCardProps {
  scheme: GovernmentScheme;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ scheme }) => {
  const [expanded, setExpanded] = useState(false);

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case 'Subsidy':
        return 'emerald';
      case 'Insurance':
        return 'blue';
      case 'Loans':
        return 'amber';
      case 'Central Government':
        return 'stone';
      case 'State Government':
        return 'rose';
      default:
        return 'stone';
    }
  };

  return (
    <div className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant={getCategoryBadgeVariant(scheme.category) as any}>
            {scheme.category}
          </Badge>
          <span className="text-[11px] font-mono font-bold text-stone-400 bg-stone-100 dark:bg-darkbg-border px-2 py-0.5 rounded-md">
            {scheme.code}
          </span>
        </div>

        {/* Scheme Name */}
        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 leading-snug">
          {scheme.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
          {scheme.description}
        </p>

        {/* Highlighted Benefits Box */}
        <div className="bg-agri-50/70 dark:bg-agri-950/30 border border-agri-200/80 dark:border-agri-800/60 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-agri-800 dark:text-agri-300 mb-1">
            <Award className="w-3.5 h-3.5 shrink-0" />
            <span>Key Benefits</span>
          </div>
          <p className="text-xs text-stone-700 dark:text-stone-300 leading-normal">
            {scheme.benefits}
          </p>
        </div>

        {/* Collapsible Eligibility & Application Steps */}
        {expanded && (
          <div className="pt-2 space-y-3 border-t border-stone-100 dark:border-darkbg-border animate-fadeIn text-xs">
            <div>
              <span className="font-bold text-stone-800 dark:text-stone-200 block mb-1">
                Eligibility:
              </span>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                {scheme.eligibility}
              </p>
            </div>

            <div>
              <span className="font-bold text-stone-800 dark:text-stone-200 block mb-1">
                How to Apply:
              </span>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                {scheme.application_process}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="pt-4 mt-3 border-t border-stone-100 dark:border-darkbg-border flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-medium text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 flex items-center gap-1"
        >
          {expanded ? (
            <>
              Less Details <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Eligibility & Apply <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        {scheme.official_url ? (
          <a
            href={scheme.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-forest dark:bg-agri-700 hover:bg-forest-light text-white text-xs font-medium transition-colors"
          >
            <span>Visit Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <span className="text-[11px] text-stone-400 italic">
            Official link will be connected
          </span>
        )}
      </div>
    </div>
  );
};
