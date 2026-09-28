import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Mail, Lock, AlertCircle, ArrowRight, Zap } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('arun.farmer@agrisense.in');
  const [password, setPassword] = useState('Farmer@123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, loginDemoFarmer } = useAuth();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      showToast('Welcome back to AgriSense!', 'success');
      navigate('/dashboard');
    } else {
      setError(result.message || 'Invalid email or password. You can also use Quick Demo Login.');
    }
  };

  const handleQuickDemo = () => {
    loginDemoFarmer();
    showToast('Logged in as Farmer Arun Kumar (Demo Mode)', 'success');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-agri-600 text-white flex items-center justify-center mx-auto shadow-md shadow-agri-600/20">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            {t('auth.loginTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            {t('auth.loginSubtitle')}
          </p>
        </div>

        {/* Quick Demo Farmer Button */}
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80 rounded-2xl p-4 text-center space-y-2">
          <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
            Exploring AgriSense for review or presentation?
          </p>
          <Button
            type="button"
            onClick={handleQuickDemo}
            className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-md"
            icon={<Zap className="w-4 h-4" />}
          >
            {t('auth.demoLoginBtn')}
          </Button>
          <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
            Instant 1-click access with preloaded crops & detection reports
          </span>
        </div>

        {/* Normal Login Card */}
        <div className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {t('auth.emailLabel')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  {t('auth.passwordLabel')}
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-agri-600 dark:text-agri-400 hover:underline"
                >
                  {t('auth.forgotPassword')}
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {t('auth.signIn')}
            </Button>
          </form>

          <div className="text-center pt-2 border-t border-stone-100 dark:border-darkbg-border text-xs text-stone-600 dark:text-stone-400">
            {t('auth.dontHaveAccount')}{' '}
            <Link to="/register" className="font-semibold text-agri-600 dark:text-agri-400 hover:underline">
              {t('auth.signUp')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
