import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Search,
  HeartHandshake,
  Users,
  PlusCircle,
  FileCheck,
  Sparkles,
  Bookmark,
  MessageSquare,
  Bell,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ShieldAlert,
  Menu,
  X,
  Sun,
  Moon,
  ShieldCheck,
} from 'lucide-react';
import { UserProfile, DashboardStats } from '../types';

export type NavItemKey =
  | 'dashboard'
  | 'browse'
  | 'lost'
  | 'found'
  | 'missing'
  | 'report-lost'
  | 'report-found'
  | 'my-reports'
  | 'matches'
  | 'saved'
  | 'messages'
  | 'notifications'
  | 'profile'
  | 'settings'
  | 'help'
  | 'admin';

interface NavigationProps {
  currentTab: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  stats: DashboardStats;
  user: UserProfile;
  isMobileOpen: boolean;
  onToggleMobile: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

interface NavItem {
  key: NavItemKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  alert?: boolean;
  highlight?: boolean;
  color?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  stats,
  user,
  isMobileOpen,
  onToggleMobile,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const mainNavItems: NavItem[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'browse', label: 'Browse Items', icon: Compass },
    { key: 'lost', label: 'Lost Items', icon: Search, badge: stats.totalLost },
    { key: 'found', label: 'Found Items', icon: HeartHandshake, badge: stats.totalFound },
    { key: 'missing', label: 'Missing Persons', icon: Users, badge: stats.missingPersonsCount, alert: true },
  ];

  const reportNavItems: NavItem[] = [
    { key: 'report-lost', label: 'Report Lost Item', icon: PlusCircle, color: 'text-rose-500' },
    { key: 'report-found', label: 'Report Found Item', icon: PlusCircle, color: 'text-teal-500' },
    { key: 'my-reports', label: 'My Reports', icon: FileCheck },
    { key: 'matches', label: 'Potential Matches', icon: Sparkles, badge: stats.potentialMatches, highlight: true },
    { key: 'saved', label: 'Saved Items', icon: Bookmark },
  ];

  const communityNavItems: NavItem[] = [
    { key: 'messages', label: 'Messages', icon: MessageSquare, badge: 1 },
    { key: 'notifications', label: 'Notifications', icon: Bell, badge: stats.unreadNotifications },
    { key: 'profile', label: 'My Profile', icon: User },
    { key: 'settings', label: 'Settings', icon: Settings },
    { key: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  const renderNavGroup = (items: NavItem[], title?: string) => (
    <div className="space-y-1">
      {title && (
        <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
          {title}
        </h4>
      )}
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.key;
        return (
          <button
            key={item.key}
            onClick={() => {
              onSelectTab(item.key);
              if (isMobileOpen) onToggleMobile();
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
              isActive
                ? 'bg-[#315FEA] text-white shadow-md shadow-[#315FEA]/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 group-hover:text-[#315FEA] dark:group-hover:text-[#20C9A7]'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </div>

            {/* Badges */}
            {typeof item.badge === 'number' && item.badge > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive
                    ? 'bg-white text-[#315FEA]'
                    : item.highlight
                    ? 'bg-[#315FEA] text-white animate-pulse'
                    : item.alert
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onToggleMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Sidebar (Desktop fixed left, Mobile slide-in drawer) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-[#101B35] border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#315FEA] to-[#20C9A7] flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-[#315FEA]/20">
              B2U
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white block">
                BACK<span className="text-[#315FEA] dark:text-[#20C9A7]">2U</span>
              </span>
              <span className="text-[9px] font-semibold text-slate-400 block tracking-wider uppercase">
                Lost & Found Network
              </span>
            </div>
          </div>

          <button
            onClick={onToggleMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
          {renderNavGroup(mainNavItems, 'Discovery')}
          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3" />
          {renderNavGroup(reportNavItems, 'Reports & Recovery')}
          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3" />
          {renderNavGroup(communityNavItems, 'Community & Account')}

          {/* Admin Dashboard shortcut if admin */}
          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3">
            <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-purple-400 mb-1">
              Administration
            </h4>
            <button
              onClick={() => {
                onSelectTab('admin');
                if (isMobileOpen) onToggleMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === 'admin'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Staff
              </span>
            </button>
          </div>
        </div>

        {/* User Card / Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <span className="flex items-center gap-2">
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {isDarkMode ? 'Theme: Dark' : 'Theme: Light'}
            </span>
          </button>

          {/* User Snippet */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div
              onClick={() => onSelectTab('profile')}
              className="flex items-center gap-2.5 cursor-pointer min-w-0"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-600"
              />
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                  {user.name}
                </span>
                <span className="text-[10px] text-slate-400 truncate block">
                  {user.city} • {user.role}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                alert('You are currently viewing Back2U session. Clear cookies or switch accounts in profile.');
              }}
              title="Logout"
              aria-label="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
