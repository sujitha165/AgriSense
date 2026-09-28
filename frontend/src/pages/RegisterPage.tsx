import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, User, Mail, Phone, Lock, MapPin, Globe, Wheat, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { CROPS_LIST } from '../data/mockDiseases';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    location: 'Tamil Nadu',
    language: 'en',
    main_crop: 'Tomato'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register } = useAuth();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    const result = await register(formData);
    setIsLoading(false);

    if (result.success) {
      showToast('Registration successful! Welcome to AgriSense.', 'success');
      navigate('/dashboard');
    } else {
      setError(result.message || 'Registration failed. Please check your details.');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-agri-600 text-white flex items-center justify-center mx-auto shadow-md shadow-agri-600/20">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            {t('auth.registerTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            Join AgriSense to safeguard your crops with AI-powered pathology.
          </p>
        </div>

        <div className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {t('auth.fullName')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {t('auth.mobile')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 00000"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {t('auth.emailLabel')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="farmer@agrisense.in"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {t('auth.passwordLabel')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {t('auth.confirmPassword')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {t('auth.location')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Tamil Nadu"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Preferred Language */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {t('auth.preferredLanguage')}
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-darkbg-border bg-white dark:bg-darkbg-card text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
                >
                  <option value="en">English</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                </select>
              </div>

              {/* Main Crop */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {t('auth.mainCrop')}
                </label>
                <select
                  name="main_crop"
                  value={formData.main_crop}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-darkbg-border bg-white dark:bg-darkbg-card text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
                >
                  {CROPS_LIST.map(crop => (
                    <option key={crop} value={crop}>
                      {crop}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {t('auth.signUp')}
            </Button>
          </form>

          <div className="text-center pt-2 border-t border-stone-100 dark:border-darkbg-border text-xs text-stone-600 dark:text-stone-400">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link to="/login" className="font-semibold text-agri-600 dark:text-agri-400 hover:underline">
              {t('auth.signIn')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
