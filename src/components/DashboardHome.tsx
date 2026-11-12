import React from 'react';
import { motion } from 'motion/react';
import {
  Search,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  Bell,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  MapPin,
  Calendar,
  Plus,
  Eye,
  MessageSquare,
  Award,
  Users,
} from 'lucide-react';
import { ItemReport, DashboardStats, AppNotification, CategoryType } from '../types';
import { CurvedCarousel } from './CurvedCarousel';

interface DashboardHomeProps {
  stats: DashboardStats;
  reports: ItemReport[];
  notifications: AppNotification[];
  onSelectCategory: (category: CategoryType) => void;
  onOpenReportModal: (type: 'lost' | 'found') => void;
  onViewReport: (report: ItemReport) => void;
  onNavigateToMatches: () => void;
  onNavigateToTab: (tab: any) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  stats,
  reports,
  notifications,
  onSelectCategory,
  onOpenReportModal,
  onViewReport,
  onNavigateToMatches,
  onNavigateToTab,
}) => {
  // Sort recent activity (latest created items first)
  const recentReports = [...reports]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const reunitedItems = reports.filter((r) => r.status === 'Resolved').slice(0, 2);

  return (
    <div className="space-y-8">
      {/* 1. Welcome Section (Prompt 3) */}
      <div className="relative bg-gradient-to-br from-[#101B35] via-[#16274e] to-[#315FEA] text-white rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#20C9A7] text-xs font-bold uppercase tracking-wider mb-4 border border-white/10">
            <ShieldCheck className="w-4 h-4 text-[#20C9A7]" />
            India&apos;s Lost &amp; Found Network
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome Back to Back2U!
          </h1>
          <p className="text-slate-200 text-sm sm:text-base mt-2.5 leading-relaxed font-normal">
            Your personal space to track lost belongings, manage reports and reconnect people with their possessions.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => onOpenReportModal('lost')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#101B35] hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-lg transition-all active:scale-95"
            >
              <Search className="w-4 h-4 text-[#315FEA]" />
              Report Lost Item
            </button>
            <button
              onClick={() => onOpenReportModal('found')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#20C9A7] hover:bg-[#17a98c] text-slate-900 font-bold text-xs sm:text-sm shadow-lg transition-all active:scale-95"
            >
              <HeartHandshake className="w-4 h-4" />
              Report Found Item
            </button>
            <button
              onClick={onNavigateToMatches}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-md transition-colors"
            >
              <Sparkles className="w-4 h-4 text-[#20C9A7]" />
              Check Matches ({stats.potentialMatches})
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#20C9A7]/20 to-[#315FEA]/30 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Dynamic Statistic Cards (Calculated strictly from real records) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {[
          {
            label: 'Total Lost Items',
            value: stats.totalLost,
            icon: Search,
            color: 'text-rose-500',
            bg: 'bg-rose-50 dark:bg-rose-950/40',
            border: 'border-rose-100 dark:border-rose-900/30',
            onClick: () => onNavigateToTab('lost'),
          },
          {
            label: 'Total Found Items',
            value: stats.totalFound,
            icon: HeartHandshake,
            color: 'text-[#20C9A7]',
            bg: 'bg-teal-50 dark:bg-teal-950/40',
            border: 'border-teal-100 dark:border-teal-900/30',
            onClick: () => onNavigateToTab('found'),
          },
          {
            label: 'Successfully Reunited',
            value: stats.successfullyReunited,
            icon: Award,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50 dark:bg-emerald-950/40',
            border: 'border-emerald-100 dark:border-emerald-900/30',
            onClick: () => onNavigateToTab('browse'),
          },
          {
            label: 'Active Reports',
            value: stats.activeReports,
            icon: TrendingUp,
            color: 'text-[#315FEA]',
            bg: 'bg-blue-50 dark:bg-blue-950/40',
            border: 'border-blue-100 dark:border-blue-900/30',
            onClick: () => onNavigateToTab('my-reports'),
          },
          {
            label: 'Potential Matches',
            value: stats.potentialMatches,
            icon: Sparkles,
            color: 'text-purple-500',
            bg: 'bg-purple-50 dark:bg-purple-950/40',
            border: 'border-purple-100 dark:border-purple-900/30',
            onClick: onNavigateToMatches,
          },
          {
            label: 'Unread Notifications',
            value: stats.unreadNotifications,
            icon: Bell,
            color: 'text-amber-500',
            bg: 'bg-amber-50 dark:bg-amber-950/40',
            border: 'border-amber-100 dark:border-amber-900/30',
            onClick: () => onNavigateToTab('notifications'),
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -2 }}
              onClick={item.onClick}
              className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border ${item.border} shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 line-clamp-1">
                  {item.label}
                </span>
                <div className={`p-1.5 rounded-lg ${item.bg} ${item.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {item.value}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Verified Records
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 3. 3D Curved Carousel (Category Management) */}
      {/* Fix 10: No default filter toast or auto-selection */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <CurvedCarousel reports={reports} onSelectCategory={onSelectCategory} />
      </div>

      {/* 4. Recent Activity & Reunited Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Feed (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#315FEA]/10 text-[#315FEA] flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Recent Activity
                </h3>
                <p className="text-xs text-slate-400">
                  Latest lost submissions, found items and status transitions
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateToTab('browse')}
              className="text-xs font-semibold text-[#315FEA] hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentReports.map((report) => {
              const isLost = report.type === 'lost';
              return (
                <div
                  key={report.id}
                  className="py-3.5 flex items-center justify-between gap-3 group hover:bg-slate-50/60 dark:hover:bg-slate-800/40 px-2 rounded-2xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={
                        report.photographs?.[0] ||
                        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=200&q=80'
                      }
                      alt={report.name}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            isLost
                              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                              : 'bg-teal-100 dark:bg-teal-950/60 text-[#20C9A7]'
                          }`}
                        >
                          {isLost ? 'Lost' : 'Found'}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {report.id}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5 group-hover:text-[#315FEA] transition-colors">
                        {report.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-[#315FEA]" />
                        {report.city}, {report.state} • {report.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold hidden sm:inline ${
                        report.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {report.status}
                    </span>
                    <button
                      onClick={() => onViewReport(report)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-[#315FEA] hover:text-white transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar: Successful Reunions & Verification Hub */}
        <div className="space-y-4">
          {/* Successfully Reunited Highlight */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white/20 uppercase tracking-wider">
                Community Success
              </span>
              <h3 className="text-lg font-bold mt-2">
                Bruno Safely Reunited!
              </h3>
              <p className="text-xs text-emerald-50 mt-1 leading-relaxed">
                Golden Retriever Bruno went missing in HSR Layout and was matched within 18 hours through Back2U collar verification.
              </p>
              <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-100">Location: Bangalore</span>
                <span className="font-mono text-emerald-200">100% Verified</span>
              </div>
            </div>
          </div>

          {/* Verification Protocol Notice */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-[#315FEA]" />
              Safe Handover Protocol
            </div>
            <ul className="text-xs text-slate-500 space-y-2">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Meet at public venues like Metro stations or police stations.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Never transfer advance courier fees or rewards prior to physical inspection.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Verify unique serial numbers or photo lockscreens before handover.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
