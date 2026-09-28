import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ScanLine,
  History,
  ShieldCheck,
  BotMessageSquare,
  Landmark,
  CircleDollarSign,
  UserCheck,
  Settings,
  LogOut,
  Sprout,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onToggle }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { to: '/detect', label: t('nav.detect'), icon: ScanLine, highlight: true },
    { to: '/history', label: t('nav.history'), icon: History },
    { to: '/assistant', label: t('nav.assistant'), icon: BotMessageSquare },
    { to: '/schemes', label: t('nav.schemes'), icon: Landmark },
    { to: '/profit', label: t('nav.profit'), icon: CircleDollarSign },
    { to: '/profile', label: t('nav.profile'), icon: UserCheck },
    { to: '/settings', label: t('nav.settings'), icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`hidden md:flex flex-col justify-between h-screen sticky top-0 bg-white dark:bg-darkbg-surface border-r border-stone-200 dark:border-darkbg-border transition-all duration-300 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand & Toggle Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-stone-200/80 dark:border-darkbg-border">
          <NavLink to="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-agri-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-agri-600/20">
              <Sprout className="w-6 h-6" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-lg text-forest dark:text-agri-400 tracking-tight truncate">
                  AgriSense
                </span>
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider -mt-1 truncate">
                  Farmer Portal
                </span>
              </div>
            )}
          </NavLink>

          {onToggle && (
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-darkbg-card transition-colors"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-agri-600 text-white shadow-md shadow-agri-600/20 font-semibold'
                      : item.highlight
                      ? 'text-agri-700 dark:text-agri-300 bg-agri-50 dark:bg-agri-950/40 hover:bg-agri-100 dark:hover:bg-agri-950/70'
                      : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-darkbg-card hover:text-stone-900 dark:hover:text-white'
                  }`
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 ${item.highlight ? 'animate-pulse-subtle' : ''}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User profile strip & Logout */}
      <div className="p-3 border-t border-stone-200/80 dark:border-darkbg-border space-y-2">
        {!collapsed && user && (
          <div className="flex items-center gap-3 p-2 rounded-xl bg-stone-50 dark:bg-darkbg-card border border-stone-200/60 dark:border-darkbg-border">
            <img
              src={user.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80'}
              alt={user.name}
              className="w-9 h-9 rounded-lg object-cover border border-stone-200 shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                {user.name}
              </span>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                {user.location || 'Tamil Nadu'}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Logout"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>{t('nav.logout')}</span>}
        </button>
      </div>
    </aside>
  );
};
