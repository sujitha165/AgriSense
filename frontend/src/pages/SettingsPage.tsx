import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Sun, Moon, Globe, Bell, Shield, Key, Check } from 'lucide-react';
import { Language } from '../types';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, languages, t } = useLanguage();
  const { showToast } = useToast();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);
  const [dataSharing, setDataSharing] = useState(true);

  const handleSavePreferences = () => {
    showToast('Preferences updated successfully!', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
          {t('settings.title')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Customize your display theme, language dialect, alert frequencies, and data security.
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: Appearance & Theme */}
        <div className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-base">
            <Sun className="w-5 h-5 text-amber-500" />
            <h3>{t('settings.theme')}</h3>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {t('settings.themeDesc')}
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            {/* Light Mode Option */}
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                theme === 'light'
                  ? 'border-agri-600 bg-agri-50/50 dark:bg-agri-950/40 text-agri-900 dark:text-agri-100 ring-2 ring-agri-500/20 font-semibold'
                  : 'border-stone-200 dark:border-darkbg-border hover:bg-stone-50 text-stone-700 dark:text-stone-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sun className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-sm font-bold">Light Theme</p>
                  <p className="text-[11px] text-stone-400">Clean outdoor daylight readability</p>
                </div>
              </div>
              {theme === 'light' && <Check className="w-5 h-5 text-agri-600" />}
            </button>

            {/* Dark Mode Option */}
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                theme === 'dark'
                  ? 'border-agri-600 bg-agri-50/50 dark:bg-agri-950/40 text-agri-900 dark:text-agri-100 ring-2 ring-agri-500/20 font-semibold'
                  : 'border-stone-200 dark:border-darkbg-border hover:bg-stone-50 text-stone-700 dark:text-stone-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-sm font-bold">Dark Theme</p>
                  <p className="text-[11px] text-stone-400">Night-friendly low eye strain</p>
                </div>
              </div>
              {theme === 'dark' && <Check className="w-5 h-5 text-agri-600" />}
            </button>
          </div>
        </div>

        {/* Section 2: Regional Language Selection */}
        <div className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-base">
            <Globe className="w-5 h-5 text-agri-600" />
            <h3>{t('settings.language')}</h3>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {t('settings.languageDesc')}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {languages.map(l => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLanguage(l.code as Language)}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  language === l.code
                    ? 'border-agri-600 bg-agri-50 dark:bg-agri-950 text-agri-800 dark:text-agri-200 ring-2 ring-agri-500/20 font-bold shadow-xs'
                    : 'border-stone-200 dark:border-darkbg-border hover:bg-stone-50 dark:hover:bg-darkbg-input text-stone-700 dark:text-stone-300'
                }`}
              >
                <span className="text-sm block">{l.native}</span>
                <span className="text-[11px] text-stone-400">{l.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Notifications & Alerts */}
        <div className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-base">
            <Bell className="w-5 h-5 text-blue-500" />
            <h3>{t('settings.notifications')}</h3>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="space-y-0.5">
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  Crop Pathology & Scan Alerts
                </span>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Notify me when disease analysis completes and recommendations are formulated.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={e => setNotificationsEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-agri-600 focus:ring-agri-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer pt-3 border-t border-stone-100 dark:border-darkbg-border">
              <div className="space-y-0.5">
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  New Government Subsidy Schemes
                </span>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Alert me when new state or central agricultural grants open for application.
                </p>
              </div>
              <input
                type="checkbox"
                checked={soundAlerts}
                onChange={e => setSoundAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-agri-600 focus:ring-agri-500"
              />
            </label>
          </div>
        </div>

        {/* Section 4: Privacy & Account */}
        <div className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-base">
            <Shield className="w-5 h-5 text-emerald-600" />
            <h3>Privacy & Agricultural Data Security</h3>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            <p className="leading-relaxed">
              AgriSense safeguards your farm geolocation and field photos. We use encrypted storage compatible with cloud deployments.
            </p>
            <div className="flex items-center justify-between pt-2">
              <span className="font-medium text-stone-700 dark:text-stone-200">
                Anonymous Leaf Analytics for AI Research
              </span>
              <input
                type="checkbox"
                checked={dataSharing}
                onChange={e => setDataSharing(e.target.checked)}
                className="w-4 h-4 rounded text-agri-600 focus:ring-agri-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handleSavePreferences}>
            {t('settings.saveSettings')}
          </Button>
        </div>
      </div>
    </div>
  );
};
