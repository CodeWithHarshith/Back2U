import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Eye,
  MapPin,
  Calendar,
  AlertTriangle,
  HeartHandshake,
} from 'lucide-react';
import { MatchRecord, ItemReport } from '../types';

interface AIMatchingViewProps {
  matches: MatchRecord[];
  reports: ItemReport[];
  onViewReport: (report: ItemReport) => void;
  onStartChat: (report: ItemReport) => void;
  onUpdateMatchStatus: (matchId: string, status: MatchRecord['status']) => void;
}

export const AIMatchingView: React.FC<AIMatchingViewProps> = ({
  matches,
  reports,
  onViewReport,
  onStartChat,
  onUpdateMatchStatus,
}) => {
  // Helper to resolve report object from ID
  const getReport = (id: string) => reports.find((r) => r.id === id);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#101B35] via-[#1a2d5a] to-[#315FEA] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#20C9A7] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Intelligent Neural Matcher
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Potential Lost & Found Matches
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">
            Our multi-parameter algorithm analyzes brand, geolocation proximity, time windows, and physical descriptions to suggest likely reunited pairs.
          </p>
        </div>

        {/* Decorative circle glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#20C9A7]/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Mandatory Safety Notice (Prompt Requirement 13) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 dark:text-amber-200 space-y-1">
          <h4 className="font-bold text-sm">Automated Match Verification Disclaimer</h4>
          <p className="leading-relaxed">
            Never automatically declare ownership based solely on AI predictions. Always require additional verification (distinguishing marks, serial numbers, proof of purchase, or identity documents) before returning valuable items.
          </p>
        </div>
      </div>

      {/* Match Cards List */}
      {matches.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            No Potential Matches Right Now
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            As new lost and found reports are submitted in your region, Back2U will automatically notify you when strong correlations emerge.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {matches.map((match) => {
            const lostItem = getReport(match.lostReportId);
            const foundItem = getReport(match.foundReportId);

            if (!lostItem || !foundItem) return null;

            return (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg transition-all"
              >
                {/* Match Score & Status Top Bar */}
                <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
                  <div className="flex items-center gap-3">
                    {/* Radial or pill score indicator */}
                    <div
                      className={`px-3 py-1.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm ${
                        match.matchPercentage >= 80
                          ? 'bg-emerald-500 text-white'
                          : match.matchPercentage >= 65
                          ? 'bg-[#315FEA] text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {match.matchPercentage}% AI Confidence
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      Match ID: {match.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        match.status === 'Reunited'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : match.status === 'Verified'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                          : match.status === 'Rejected'
                          ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          : 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400'
                      }`}
                    >
                      {match.status} Match
                    </span>
                  </div>
                </div>

                {/* Side-by-Side Comparison Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
                  {/* LOST ITEM COLUMN */}
                  <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500 text-white uppercase">
                          Lost Report
                        </span>
                        <span className="font-mono text-xs text-slate-400">
                          {lostItem.id}
                        </span>
                      </div>

                      <div className="flex gap-3 items-start">
                        {lostItem.photographs?.[0] && (
                          <img
                            src={lostItem.photographs[0]}
                            alt={lostItem.name}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                          />
                        )}
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                            {lostItem.name}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Category: {lostItem.category}
                          </p>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                            <MapPin className="w-3 h-3 text-[#315FEA]" />
                            {lostItem.landmark}, {lostItem.city}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            Lost: {lostItem.date}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 line-clamp-2 italic bg-white/60 dark:bg-slate-900/60 p-2 rounded-lg">
                        &ldquo;{lostItem.description}&rdquo;
                      </p>
                    </div>

                    <button
                      onClick={() => onViewReport(lostItem)}
                      className="mt-3 w-full py-1.5 rounded-xl bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Lost Details
                    </button>
                  </div>

                  {/* FOUND ITEM COLUMN */}
                  <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#20C9A7] text-slate-900 uppercase">
                          Found Report
                        </span>
                        <span className="font-mono text-xs text-slate-400">
                          {foundItem.id}
                        </span>
                      </div>

                      <div className="flex gap-3 items-start">
                        {foundItem.photographs?.[0] && (
                          <img
                            src={foundItem.photographs[0]}
                            alt={foundItem.name}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                          />
                        )}
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                            {foundItem.name}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Category: {foundItem.category}
                          </p>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                            <MapPin className="w-3 h-3 text-[#20C9A7]" />
                            {foundItem.landmark}, {foundItem.city}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            Found: {foundItem.date}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 line-clamp-2 italic bg-white/60 dark:bg-slate-900/60 p-2 rounded-lg">
                        &ldquo;{foundItem.description}&rdquo;
                      </p>
                    </div>

                    <button
                      onClick={() => onViewReport(foundItem)}
                      className="mt-3 w-full py-1.5 rounded-xl bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Found Details
                    </button>
                  </div>
                </div>

                {/* AI Reason Breakdown Checklist */}
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80">
                  <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Matching Correlation Analysis
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {match.reasons.map((reason, rIdx) => (
                      <div
                        key={rIdx}
                        className="flex items-center gap-2 text-slate-600 dark:text-slate-300"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onStartChat(foundItem)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#315FEA] hover:bg-[#264ecc] text-white text-xs font-bold shadow-sm transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Contact Finder / Reporter
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {match.status !== 'Reunited' && (
                      <button
                        onClick={() => onUpdateMatchStatus(match.id, 'Reunited')}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-colors"
                      >
                        <HeartHandshake className="w-3.5 h-3.5" />
                        Mark Reunited
                      </button>
                    )}

                    {match.status === 'Potential' && (
                      <button
                        onClick={() => onUpdateMatchStatus(match.id, 'Rejected')}
                        className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        Not a Match
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
