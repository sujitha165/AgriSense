import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, ShieldCheck, ArrowRight, Menu, X } from 'lucide-react';
import { LanguageSelector } from '../ui/LanguageSelector';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-darkbg-surface/85 border-b border-stone-200/80 dark:border-darkbg-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-agri-600 flex items-center justify-center text-white shadow-md shadow-agri-600/20 group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-forest dark:text-agri-400 font-sans">
              AgriSense
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-stone-500 dark:text-stone-400 -mt-1 hidden sm:block">
              Smart Crop AI
            </span>
          </div>
        </Link>

        {/* Public Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600 dark:text-stone-300">
          <Link to="/" className="hover:text-agri-600 dark:hover:text-agri-400 transition-colors">
            Home
          </Link>
          <a href="#how-it-works" className="hover:text-agri-600 dark:hover:text-agri-400 transition-colors">
            How It Works
          </a>
          <a href="#supported-crops" className="hover:text-agri-600 dark:hover:text-agri-400 transition-colors">
            Supported Crops
          </a>
          <Link to="/schemes" className="hover:text-agri-600 dark:hover:text-agri-400 transition-colors">
            Govt Schemes
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSelector compact />
          <ThemeToggle />

          {isAuthenticated ? (
            <Button
              size="sm"
              onClick={() => navigate('/dashboard')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              <span className="hidden sm:inline">Go to Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register" className="hidden sm:inline-block">
                <Button size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-darkbg-card"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-6 border-b border-stone-200 dark:border-darkbg-border bg-white dark:bg-darkbg-card space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-700 dark:text-stone-200 font-medium"
          >
            Home
          </Link>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-700 dark:text-stone-200 font-medium"
          >
            How It Works
          </a>
          <a
            href="#supported-crops"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-700 dark:text-stone-200 font-medium"
          >
            Supported Crops
          </a>
          <Link
            to="/schemes"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-700 dark:text-stone-200 font-medium"
          >
            Govt Schemes
          </Link>
          <div className="pt-2 border-t border-stone-100 dark:border-darkbg-border flex gap-2">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full" size="sm">
                    Register
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/dashboard" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full" size="sm">
                  Go to Farmer Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
