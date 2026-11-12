import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldAlert,
  Users,
  FileText,
  HeartHandshake,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Flag,
  Search,
  SlidersHorizontal,
  Eye,
  BarChart3,
  Layers,
} from 'lucide-react';
import { ItemReport, CategoryType, ItemStatus } from '../types';
import { CATEGORIES_LIST } from '../utils/storage';

interface AdminDashboardProps {
  reports: ItemReport[];
  onUpdateReportStatus: (reportId: string, status: ItemStatus) => void;
  onDeleteReport: (reportId: string) => void;
  onViewDetails: (report: ItemReport) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  reports,
  onUpdateReportStatus,
  onDeleteReport,
  onViewDetails,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'flagged' | 'pending' | 'missing'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate real admin metrics from records
  const totalReports = reports.length;
  const lostCount = reports.filter((r) => r.type === 'lost').length;
  const foundCount = reports.filter((r) => r.type === 'found').length;
  const missingPersonsCount = reports.filter((r) => r.isMissingPerson).length;
  const reunitedCount = reports.filter((r) => r.status === 'Resolved').length;
  const pendingCount = reports.filter((r) => r.status === 'Pending').length;
  const flaggedCount = reports.filter((r) => r.isFlagged).length;

  const filtered = reports.filter((r) => {
    if (filterType === 'flagged' && !r.isFlagged) return false;
    if (filterType === 'pending' && r.status !== 'Pending') return false;
    if (filterType === 'missing' && !r.isMissingPerson) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.reporterName.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-4 h-4" />
            Back2U Administrator Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Platform Moderation & Security
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Real-time compliance monitoring, fraud prevention & lost-and-found report auditing
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-mono font-bold text-[#20C9A7]">
            Active Nodes: 18 Cities
          </span>
        </div>
      </div>

      {/* Admin Statistics Row (Prompt Requirement 17) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Lost', value: lostCount, color: 'text-rose-500' },
          { label: 'Total Found', value: foundCount, color: 'text-teal-500' },
          { label: 'Missing Persons', value: missingPersonsCount, color: 'text-amber-500' },
          { label: 'Reunited', value: reunitedCount, color: 'text-emerald-500' },
          { label: 'Pending Audit', value: pendingCount, color: 'text-blue-500' },
          { label: 'Flagged / Fraud', value: flaggedCount, color: 'text-purple-500' },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <span className="text-[11px] font-semibold text-slate-400 block truncate">
              {stat.label}
            </span>
            <span className={`text-2xl font-black mt-1 block ${stat.color}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Category Breakdown Snapshot */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#315FEA]" />
          Registry Distribution by Category
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 text-xs">
          {CATEGORIES_LIST.map((c) => {
            const count = reports.filter((r) => r.category === c.name).length;
            return (
              <div
                key={c.id}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between"
              >
                <span className="text-slate-600 dark:text-slate-300 font-medium truncate">
                  {c.name}
                </span>
                <span className="font-bold text-[#315FEA] dark:text-[#20C9A7]">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Moderation Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex gap-2">
            {(['all', 'flagged', 'pending', 'missing'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                  filterType === tab
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {tab === 'missing' ? 'Missing Persons' : tab}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reports or reporters..."
              className="pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#315FEA]"
            />
          </div>
        </div>

        {/* Table of Reports */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-semibold text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3">Report ID / Item</th>
                <th className="px-4 py-3">Type & Category</th>
                <th className="px-4 py-3">Location & Date</th>
                <th className="px-4 py-3">Reporter</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Moderator Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-[11px] text-slate-400 block">
                      {item.id}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white block mt-0.5 truncate max-w-xs">
                      {item.name}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.type === 'lost'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                          : 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-400'
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="block text-slate-500 mt-1">{item.category}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span>
                      {item.city}, {item.state}
                    </span>
                    <span className="text-slate-400 block">{item.date}</span>
                  </td>
                  <td className="px-4 py-3.5 font-medium">{item.reporterName}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        item.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onViewDetails(item)}
                        title="View Details"
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {item.status !== 'Resolved' && (
                        <button
                          onClick={() => onUpdateReportStatus(item.id, 'Resolved')}
                          title="Mark Verified & Resolved"
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteReport(item.id)}
                        title="Remove Fraudulent Report"
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
