import React, { useState, useEffect } from 'react';
import { SchemeCard } from '../components/schemes/SchemeCard';
import { useLanguage } from '../context/LanguageContext';
import { GovernmentScheme } from '../types';
import { LocalDB, apiRequest } from '../services/api';
import { Landmark, Search, Filter, Sparkles, CheckCircle2 } from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const SchemesPage: React.FC = () => {
  const { t } = useLanguage();
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSchemes() {
      try {
        const res = await apiRequest<GovernmentScheme[]>('/schemes');
        setSchemes(res.data || LocalDB.getSchemes());
      } catch (err) {
        setSchemes(LocalDB.getSchemes());
      } finally {
        setIsLoading(false);
      }
    }
    loadSchemes();
  }, []);

  const categories = [
    { key: 'All', label: t('schemes.tabs.all') },
    { key: 'Subsidy', label: t('schemes.tabs.subsidy') },
    { key: 'Insurance', label: t('schemes.tabs.insurance') },
    { key: 'Loans', label: t('schemes.tabs.loans') },
    { key: 'Central Government', label: t('schemes.tabs.central') },
    { key: 'State Government', label: t('schemes.tabs.state') }
  ];

  const filteredSchemes = schemes.filter(s => {
    const matchesCategory = activeTab === 'All' || s.category.toLowerCase() === activeTab.toLowerCase();
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.benefits.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              {t('schemes.title')}
            </h1>
            <Badge variant="blue" icon={<Landmark className="w-3.5 h-3.5" />}>
              Govt Verified
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            {t('schemes.subtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search schemes or subsidies..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 dark:border-darkbg-border bg-white dark:bg-darkbg-card text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-stone-200/80 dark:border-darkbg-border">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveTab(cat.key)}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-xl transition-all whitespace-nowrap border-b-2 ${
              activeTab === cat.key
                ? 'border-agri-600 text-agri-700 dark:text-agri-400 bg-agri-50/50 dark:bg-agri-950/30'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-darkbg-card'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Schemes Grid */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-4 border-agri-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-stone-500">Loading government programs...</p>
        </div>
      ) : filteredSchemes.length === 0 ? (
        <div className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-3xl p-12 text-center space-y-3 max-w-md mx-auto">
          <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
            No schemes found matching "{searchTerm}".
          </p>
          <button
            onClick={() => {
              setActiveTab('All');
              setSearchTerm('');
            }}
            className="text-xs text-agri-600 hover:underline font-semibold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map(scheme => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      )}
    </div>
  );
};
