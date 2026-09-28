import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ScanLine, History, BotMessageSquare, Landmark, CircleDollarSign } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const MobileNav: React.FC = () => {
  const { t } = useLanguage();

  const items = [
    { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/history', label: 'History', icon: History },
    { to: '/detect', label: 'Scan', icon: ScanLine, isFab: true },
    { to: '/assistant', label: 'AI Chat', icon: BotMessageSquare },
    { to: '/profit', label: 'Profit', icon: CircleDollarSign }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-darkbg-surface/95 backdrop-blur-md border-t border-stone-200 dark:border-darkbg-border px-2 py-1 flex items-center justify-around shadow-lg">
      {items.map(item => {
        const Icon = item.icon;
        if (item.isFab) {
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex flex-col items-center -mt-6 group"
            >
              <div className="w-12 h-12 rounded-full bg-agri-600 text-white flex items-center justify-center shadow-lg shadow-agri-600/40 group-active:scale-95 transition-transform">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-agri-700 dark:text-agri-400 mt-1">
                {item.label}
              </span>
            </NavLink>
          );
        }

        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-3 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'text-agri-600 dark:text-agri-400 font-bold'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
