import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { CROPS_LIST } from '../data/mockDiseases';
import { UserCheck, MapPin, Mail, Phone, Wheat, Globe, Check, Save } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const { t } = useLanguage();

  const [name, setName] = useState(user?.name || 'Arun Kumar');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [location, setLocation] = useState(user?.location || 'Coimbatore, Tamil Nadu');
  const [language, setLanguage] = useState(user?.language || 'en');
  const [mainCrop, setMainCrop] = useState(user?.main_crop || 'Tomato');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile({
      name,
      phone,
      location,
      language: language as any,
      main_crop: mainCrop
    });
    setIsSaving(false);
    showToast('Farmer profile updated successfully!', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
          {t('nav.profile')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Manage your personal farmer credentials, cultivated parcels, and region preferences.
        </p>
      </div>

      <div className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-3xl p-6 sm:p-8 shadow-xs space-y-8">
        {/* Profile Avatar Card */}
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-stone-100 dark:border-darkbg-border text-center sm:text-left">
          <img
            src={user?.avatar_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
            alt={user?.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-agri-500/40 shadow-sm"
          />
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-stone-900 dark:text-stone-100">
              {user?.name}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {user?.email} • Member since August 2025
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <Badge variant="emerald" size="sm">
                Verified Farmer
              </Badge>
              <Badge variant="stone" size="sm">
                Primary Crop: {user?.main_crop}
              </Badge>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
                required
              />
            </div>

            {/* Email (Readonly) */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-darkbg-border bg-stone-100 dark:bg-darkbg-card text-stone-500 text-sm cursor-not-allowed"
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Mobile Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Farm Location / District
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
                required
              />
            </div>

            {/* Main Crop */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Main Cultivated Crop
              </label>
              <select
                value={mainCrop}
                onChange={e => setMainCrop(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-darkbg-border bg-white dark:bg-darkbg-card text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
              >
                {CROPS_LIST.map(crop => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred Language */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Preferred Regional Language
              </label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-darkbg-border bg-white dark:bg-darkbg-card text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-agri-500 focus:outline-none"
              >
                <option value="en">English</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              isLoading={isSaving}
              icon={<Save className="w-4 h-4" />}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
