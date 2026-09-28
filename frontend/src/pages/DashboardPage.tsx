import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ScanLine,
  ShieldCheck,
  AlertTriangle,
  BookmarkCheck,
  CircleDollarSign,
  ArrowRight,
  TrendingUp,
  BotMessageSquare,
  Landmark,
  Sparkles,
  Calendar,
  Layers
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ScanRecord, ExpenseSummary } from '../types';
import { diseaseService } from '../services/diseaseService';
import { profitService } from '../services/profitService';
import { formatDate, formatCurrency, getSeverityStyles } from '../utils/formatters';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [profitSummary, setProfitSummary] = useState<ExpenseSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [scansData, profitData] = await Promise.all([
          diseaseService.getHistory(),
          profitService.getExpensesAndSummary()
        ]);
        setScans(scansData);
        setProfitSummary(profitData.summary);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const totalScans = scans.length;
  const healthyCrops = scans.filter(s => s.severity === 'Healthy').length;
  const diseasesDetected = scans.filter(s => s.severity !== 'Healthy').length;
  const treatmentsSaved = scans.filter(s => s.treatment && s.treatment.length > 0).length;

  return (
    <div className="space-y-8">
      {/* Top Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-darkbg-card p-6 rounded-3xl border border-stone-200/80 dark:border-darkbg-border shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              {t('dashboard.greeting')}
            </h1>
            <span className="text-xs bg-agri-100 text-agri-800 dark:bg-agri-950 dark:text-agri-300 font-bold px-2.5 py-0.5 rounded-full">
              {user?.main_crop || 'Tomato'} Farmer
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            {t('dashboard.subtitle')} • Farm plot: {user?.location || 'Tamil Nadu, India'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="md"
            onClick={() => navigate('/detect')}
            icon={<ScanLine className="w-4 h-4" />}
          >
            {t('dashboard.scanButton')}
          </Button>
        </div>
      </div>

      {/* Statistics 4-Grid Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Total Scans */}
        <div className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-2xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              {t('dashboard.stats.totalScans')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ScanLine className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
            {totalScans}
          </p>
          <span className="text-[11px] text-stone-400 flex items-center gap-1">
            <Layers className="w-3 h-3" /> Across all crop seasons
          </span>
        </div>

        {/* Card 2: Healthy Crops */}
        <div className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-2xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              {t('dashboard.stats.healthyCrops')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {healthyCrops}
          </p>
          <span className="text-[11px] text-stone-400">
            {totalScans > 0 ? `${((healthyCrops / totalScans) * 100).toFixed(0)}% of total scans` : 'Zero scans'}
          </span>
        </div>

        {/* Card 3: Diseases Detected */}
        <div className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-2xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              {t('dashboard.stats.diseasesDetected')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
            {diseasesDetected}
          </p>
          <span className="text-[11px] text-stone-400">
            Early intervention guidance provided
          </span>
        </div>

        {/* Card 4: Farm Net Profit */}
        <div className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-2xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              {t('dashboard.stats.profitTracked')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-forest/10 dark:bg-agri-950/60 text-forest dark:text-agri-400 flex items-center justify-center">
              <CircleDollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-forest dark:text-agri-400">
            {formatCurrency(profitSummary ? profitSummary.totalProfit : 124800)}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Margin: {profitSummary ? profitSummary.overallMargin : 39}%
          </span>
        </div>
      </div>

      {/* Featured Quick Scan Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-forest via-agri-800 to-forest-light text-white p-6 sm:p-10 shadow-lg">
        <div className="max-w-xl space-y-3 relative z-10">
          <Badge variant="emerald" className="bg-white/20 text-white border-white/30 backdrop-blur-xs">
            Instant AI Pathology
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('dashboard.quickScanTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            {t('dashboard.quickScanDesc')}
          </p>
          <div className="pt-2">
            <Button
              size="md"
              onClick={() => navigate('/detect')}
              className="bg-white text-forest hover:bg-emerald-50 focus:ring-white shadow-md font-bold"
              icon={<ScanLine className="w-4 h-4 text-agri-600" />}
            >
              {t('dashboard.scanButton')}
            </Button>
          </div>
        </div>

        {/* Decorative graphic in background */}
        <div className="absolute right-4 bottom-2 opacity-15 pointer-events-none hidden sm:block">
          <ScanLine className="w-56 h-56 text-white" />
        </div>
      </div>

      {/* Recent Scans Table / Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {t('dashboard.recentScans')}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Latest diagnostic reports for your cultivated plots
            </p>
          </div>

          <Link
            to="/history"
            className="text-xs font-semibold text-agri-600 dark:text-agri-400 hover:underline flex items-center gap-1"
          >
            {t('dashboard.viewAll')}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {scans.length === 0 ? (
          <div className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-2xl p-8 text-center space-y-3">
            <p className="text-sm text-stone-500">{t('dashboard.noScansYet')}</p>
            <Button size="sm" onClick={() => navigate('/detect')}>
              Perform First Scan
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scans.slice(0, 3).map(scan => {
              const severityStyle = getSeverityStyles(scan.severity);
              return (
                <div
                  key={scan.id}
                  onClick={() => navigate(`/results/${scan.id}`)}
                  className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-2xl p-4 shadow-xs hover:shadow-md hover:border-agri-500/40 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-stone-900">
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

                    <div>
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                        {scan.crop}
                      </span>
                      <h4 className="text-base font-extrabold text-stone-900 dark:text-stone-100 group-hover:text-agri-600 dark:group-hover:text-agri-400 transition-colors">
                        {scan.disease}
                      </h4>
                    </div>

                    <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
                      {scan.symptoms && scan.symptoms[0]}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-stone-100 dark:border-darkbg-border flex items-center justify-between text-xs text-stone-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(scan.created_at)}
                    </span>
                    <span className="font-semibold text-agri-600 dark:text-agri-400 group-hover:underline">
                      View Report →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fast Shortcuts 2-Column: AI Assistant & Govt Schemes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Assistant Card */}
        <div
          onClick={() => navigate('/assistant')}
          className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-2xl p-6 shadow-xs hover:border-agri-500 transition-all cursor-pointer flex items-center gap-4 group"
        >
          <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <BotMessageSquare className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-agri-600 transition-colors">
              AgriSense AI Assistant
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Ask 24/7 questions about organic fertilizer ratios, pesticide precautions, and weed control.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-agri-600 group-hover:translate-x-1 transition-all shrink-0" />
        </div>

        {/* Schemes Card */}
        <div
          onClick={() => navigate('/schemes')}
          className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-2xl p-6 shadow-xs hover:border-agri-500 transition-all cursor-pointer flex items-center gap-4 group"
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Landmark className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-agri-600 transition-colors">
              Government Schemes & Subsidies
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Access verified central and state subsidies: PM-KISAN, PMFBY crop insurance, and SMAM tractor grants.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-agri-600 group-hover:translate-x-1 transition-all shrink-0" />
        </div>
      </div>
    </div>
  );
};
