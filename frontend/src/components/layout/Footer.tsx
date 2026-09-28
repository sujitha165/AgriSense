import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, PhoneCall, ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-white dark:bg-darkbg-surface border-t border-stone-200 dark:border-darkbg-border pt-12 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-agri-600 flex items-center justify-center text-white shadow-md shadow-agri-600/20">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-forest dark:text-agri-400">AgriSense</span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Smart Detection. Better Decisions. Healthier Crops.
              An AI-powered agricultural diagnosis and intelligence platform engineered for farmers.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-agri-700 dark:text-agri-400 bg-agri-50 dark:bg-agri-950/40 p-2.5 rounded-xl border border-agri-200 dark:border-agri-800">
              <PhoneCall className="w-4 h-4 shrink-0" />
              <span>Kisan Helpline: 1800-180-1551</span>
            </div>
          </div>

          {/* Col 2: Fast Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 mb-4">
              Farmer Tools
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-600 dark:text-stone-300">
              <li>
                <Link to="/detect" className="hover:text-agri-600 dark:hover:text-agri-400 transition-colors">
                  AI Crop Disease Scan
                </Link>
              </li>
              <li>
                <Link to="/assistant" className="hover:text-agri-600 dark:hover:text-agri-400 transition-colors">
                  AgriSense AI Assistant
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-agri-600 dark:hover:text-agri-400 transition-colors">
                  Diagnosis History & Reports
                </Link>
              </li>
              <li>
                <Link to="/profit" className="hover:text-agri-600 dark:hover:text-agri-400 transition-colors">
                  Crop Profit & Expense Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Supported Crops */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 mb-4">
              Supported Crops
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 dark:text-stone-300">
              <span>🍅 Tomato</span>
              <span>🥔 Potato</span>
              <span>🌾 Rice (Paddy)</span>
              <span>🍎 Apple</span>
              <span>🌽 Maize (Corn)</span>
              <span>🌿 Cotton</span>
              <span>🫑 Pepper</span>
              <span>🍇 Grape</span>
            </div>
          </div>

          {/* Col 4: Safety & Disclaimer */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 mb-4">
              Safety & Advice
            </h4>
            <div className="flex items-start gap-2 text-xs text-stone-500 dark:text-stone-400 bg-stone-50 dark:bg-darkbg-card p-3 rounded-xl border border-stone-200 dark:border-darkbg-border leading-relaxed">
              <ShieldCheck className="w-5 h-5 text-agri-600 shrink-0 mt-0.5" />
              <span>
                AgriSense provides AI diagnostic support and validated agronomic guidance. For severe infestations, always confirm with local agricultural extension officers.
              </span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-200/80 dark:border-darkbg-border flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-3">
          <p>© {new Date().getFullYear()} AgriSense Platform. Dedicated to farmer prosperity.</p>
          <p className="flex items-center gap-1">
            Built with modern AI and responsive engineering
          </p>
        </div>
      </div>
    </footer>
  );
};
