import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { MobileNav } from '../components/layout/MobileNav';
import { LanguageSelector } from '../components/ui/LanguageSelector';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { NotificationDropdown } from '../components/notifications/NotificationDropdown';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Search, ScanLine, Sprout } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-earth-50/50 dark:bg-darkbg-surface transition-colors">
      {/* Desktop & Tablet Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 h-16 bg-white/80 dark:bg-darkbg-surface/80 backdrop-blur-md border-b border-stone-200/80 dark:border-darkbg-border flex items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Mobile Brand & Breadcrumb */}
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="md:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-agri-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-forest dark:text-agri-400">AgriSense</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-darkbg-card px-3 py-1.5 rounded-full border border-stone-200 dark:border-darkbg-border">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>AI Crop Engine Online</span>
            </div>
          </div>

          {/* Right Controls: Quick Scan button + Language + Theme + Notifications + User Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/detect"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-agri-600 hover:bg-agri-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <ScanLine className="w-3.5 h-3.5" />
              <span>Quick Scan</span>
            </Link>

            <LanguageSelector compact />
            <ThemeToggle />
            <NotificationDropdown />

            {/* Profile Avatar Pill */}
            {user && (
              <Link
                to="/profile"
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-stone-100 dark:hover:bg-darkbg-card transition-colors"
                title="View Profile"
              >
                <img
                  src={user.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80'}
                  alt={user.name}
                  className="w-8 h-8 rounded-lg object-cover border border-agri-500/30"
                />
                <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 hidden lg:inline-block max-w-[100px] truncate">
                  {user.name}
                </span>
              </Link>
            )}
          </div>
        </header>

        {/* Page Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
};
