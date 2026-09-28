import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Calendar,
  Layers,
  ArrowRight,
  Trash2,
  ScanLine,
  Eye,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { diseaseService } from '../services/diseaseService';
import { ScanRecord, Severity } from '../types';
import { formatDate, getSeverityStyles } from '../utils/formatters';
import { CROPS_LIST } from '../data/mockDiseases';

export const HistoryPage: React.FC = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');

  const loadHistory = async () => {
    try {
      const data = await diseaseService.getHistory();
      setScans(data);
    } catch (err) {
      console.error('History load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this scan from your history?')) {
      await diseaseService.deleteScan(id);
      setScans(prev => prev.filter(s => s.id !== id));
      showToast('Scan report deleted.', 'info');
    }
  };

  // Filtered scans
  const filteredScans = scans.filter(scan => {
    const matchesCrop = selectedCrop === 'All' || scan.crop.toLowerCase() === selectedCrop.toLowerCase();
    const matchesSeverity = selectedSeverity === 'All' || scan.severity.toLowerCase() === selectedSeverity.toLowerCase();
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      scan.disease.toLowerCase().includes(query) ||
      scan.crop.toLowerCase().includes(query) ||
      (scan.notes && scan.notes.toLowerCase().includes(query));

    return matchesCrop && matchesSeverity && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            {t('history.title')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            {t('history.subtitle')}
          </p>
        </div>

        <Button
          onClick={() => navigate('/detect')}
          icon={<ScanLine className="w-4 h-4" />}
          size="sm"
        >
          {t('dashboard.scanButton')}
        </Button>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-2xl p-4 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={t('history.searchPlaceholder')}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 dark:border-darkbg-border bg-stone-50 dark:bg-darkbg-input text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
          />
        </div>

        {/* Crop Filter */}
        <div className="sm:col-span-3">
          <select
            value={selectedCrop}
            onChange={e => setSelectedCrop(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-darkbg-border bg-stone-50 dark:bg-darkbg-input text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
          >
            <option value="All">{t('history.filterCrop')}</option>
            {CROPS_LIST.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Severity Filter */}
        <div className="sm:col-span-3">
          <select
            value={selectedSeverity}
            onChange={e => setSelectedSeverity(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-darkbg-border bg-stone-50 dark:bg-darkbg-input text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
          >
            <option value="All">{t('history.filterSeverity')}</option>
            <option value="Healthy">Healthy</option>
            <option value="Low">Low</option>
            <option value="Moderate">Moderate</option>
            <option value="Severe">Severe</option>
          </select>
        </div>
      </div>

      {/* Scans List / Cards */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-4 border-agri-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-stone-500">Loading scan history...</p>
        </div>
      ) : filteredScans.length === 0 ? (
        <div className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto">
          <AlertCircle className="w-12 h-12 text-stone-400 mx-auto" />
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
            {t('history.emptyHistory')}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Try adjusting your search query or upload a leaf photo to start monitoring.
          </p>
          <Button size="sm" onClick={() => navigate('/detect')}>
            Start First Scan
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredScans.map(scan => {
            const severityStyle = getSeverityStyles(scan.severity);
            return (
              <div
                key={scan.id}
                onClick={() => navigate(`/results/${scan.id}`)}
                className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-agri-500/40 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Photo with Overlay Badges */}
                  <div className="relative aspect-16/10 bg-stone-900 overflow-hidden">
                    <img
                      src={scan.image_url}
                      alt={scan.disease}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold border backdrop-blur-md shadow-xs ${severityStyle.badge}`}
                      >
                        {scan.severity}
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-2.5 bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-md text-[11px] font-mono">
                      {scan.confidence}% match
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                        {scan.crop}
                      </span>
                      <span className="text-[11px] text-stone-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(scan.created_at)}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-stone-900 dark:text-stone-100 group-hover:text-agri-600 dark:group-hover:text-agri-400 transition-colors">
                      {scan.disease}
                    </h3>

                    {scan.symptoms && scan.symptoms.length > 0 && (
                      <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                        {scan.symptoms[0]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="px-4 py-3 bg-stone-50/60 dark:bg-darkbg-input/40 border-t border-stone-100 dark:border-darkbg-border flex items-center justify-between text-xs">
                  <span className="font-semibold text-agri-600 dark:text-agri-400 flex items-center gap-1 group-hover:underline">
                    <Eye className="w-3.5 h-3.5" />
                    {t('history.viewReport')}
                  </span>

                  <button
                    type="button"
                    onClick={e => handleDelete(e, scan.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
                    title="Delete Scan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
