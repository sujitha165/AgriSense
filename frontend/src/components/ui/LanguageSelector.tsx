import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../types';

export const LanguageSelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-darkbg-border bg-white dark:bg-darkbg-card hover:bg-stone-50 dark:hover:bg-darkbg-input text-stone-700 dark:text-stone-200 text-sm font-medium transition-all shadow-xs"
        aria-label="Select Language"
      >
        <Globe className="w-4 h-4 text-agri-600 dark:text-agri-400" />
        {!compact && <span>{currentLang.native}</span>}
        <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border shadow-xl z-50 py-1.5 animate-in fade-in slide-in-from-top-1">
          <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-stone-400 border-b border-stone-100 dark:border-darkbg-border mb-1">
            Choose Language
          </div>
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code as Language);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2 text-sm text-left transition-colors ${
                language === lang.code
                  ? 'bg-agri-50 dark:bg-agri-950/40 text-agri-700 dark:text-agri-300 font-semibold'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-darkbg-input'
              }`}
            >
              <div className="flex flex-col">
                <span className="font-medium">{lang.native}</span>
                <span className="text-[11px] text-stone-400">{lang.label}</span>
              </div>
              {language === lang.code && <Check className="w-4 h-4 text-agri-600 dark:text-agri-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
