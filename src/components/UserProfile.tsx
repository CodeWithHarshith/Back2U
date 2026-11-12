import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Shield,
  Save,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Bell,
  Sun,
  Moon,
} from 'lucide-react';
import { UserProfile as UserProfileType } from '../types';

interface UserProfileProps {
  user: UserProfileType;
  onSaveUser: (user: UserProfileType) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  onSaveUser,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    city: user.city,
    state: user.state,
    maskPhone: user.privacy.maskPhone,
    receiveMatchAlerts: user.privacy.receiveMatchAlerts,
    receiveEmailDigests: user.privacy.receiveEmailDigests,
    role: user.role,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfileType = {
      ...user,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      state: formData.state,
      role: formData.role,
      privacy: {
        maskPhone: formData.maskPhone,
        receiveMatchAlerts: formData.receiveMatchAlerts,
        receiveEmailDigests: formData.receiveEmailDigests,
      },
    };
    onSaveUser(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-xl"
          />
          <span className="absolute bottom-1 right-1 p-1 rounded-full bg-emerald-500 text-white shadow-md">
            <CheckCircle2 className="w-4 h-4" />
          </span>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {user.name}
            </h1>
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                user.role === 'admin'
                  ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                  : 'bg-blue-100 dark:bg-blue-950/60 text-[#315FEA]'
              }`}
            >
              {user.role === 'admin' ? 'System Administrator' : 'Verified Community Member'}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-center sm:justify-start gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#315FEA]" />
            {user.city}, {user.state} • Member since {user.createdAt}
          </p>

          {/* Quick Metrics */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-6 justify-center sm:justify-start text-xs">
            <div>
              <span className="text-slate-400 block">Total Reports Submitted</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {user.totalReports}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Successful Reunions</span>
              <span className="text-lg font-bold text-emerald-600">
                {user.reunionsCount}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Trust Level</span>
              <span className="text-lg font-bold text-[#315FEA]">Tier 1 Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit & Settings Form - INPUT VISIBILITY FIX (Fix 8) */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Profile & Security Settings
            </h2>
            <p className="text-xs text-slate-500">
              Update personal details and manage privacy preferences
            </p>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Settings Saved!
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#315FEA]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#315FEA]"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#315FEA]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              City
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#315FEA]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              State
            </label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#315FEA]"
            />
          </div>
        </div>

        {/* Role Switcher Demo Control */}
        <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-purple-900 dark:text-purple-200">
              Role Switcher (Community Demo)
            </h4>
            <p className="text-[11px] text-purple-700 dark:text-purple-300">
              Toggle between User and Administrator to test Admin Dashboard capabilities
            </p>
          </div>
          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value as 'user' | 'admin' })
            }
            className="px-3 py-1.5 rounded-xl text-xs font-bold border border-purple-300 bg-white text-purple-900 dark:bg-slate-800 dark:text-purple-100"
          >
            <option value="user">User Mode</option>
            <option value="admin">Admin Mode</option>
          </select>
        </div>

        {/* Privacy & Notification Preferences */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Privacy & Preferences
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Phone Number Masking
              </h4>
              <p className="text-[11px] text-slate-500">
                Hide direct phone from public visitors; allow contact only through Back2U chat
              </p>
            </div>
            <input
              type="checkbox"
              checked={formData.maskPhone}
              onChange={(e) => setFormData({ ...formData, maskPhone: e.target.checked })}
              className="w-4 h-4 text-[#315FEA] rounded focus:ring-[#315FEA]"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Real-Time Match Alerts
              </h4>
              <p className="text-[11px] text-slate-500">
                Receive instant notifications when an item matches your lost report
              </p>
            </div>
            <input
              type="checkbox"
              checked={formData.receiveMatchAlerts}
              onChange={(e) =>
                setFormData({ ...formData, receiveMatchAlerts: e.target.checked })
              }
              className="w-4 h-4 text-[#315FEA] rounded focus:ring-[#315FEA]"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Appearance (Dark / Light Mode)
              </h4>
              <p className="text-[11px] text-slate-500">
                Toggle dark navy theme or crisp light background
              </p>
            </div>
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 shadow-sm flex items-center gap-1.5 text-xs font-semibold"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#315FEA] hover:bg-[#264ecc] text-white text-sm font-bold shadow-md transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            Save Profile Settings
          </button>
        </div>
      </form>
    </div>
  );
};
