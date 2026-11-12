import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Bell,
  CheckCircle2,
  Trash2,
  Sparkles,
  MessageSquare,
  HeartHandshake,
  ShieldCheck,
  CheckCheck,
  ExternalLink,
} from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationCenterProps {
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDeleteNotification: (id: string) => void;
  onNavigateToReport: (reportId?: string, matchId?: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onDeleteNotification,
  onNavigateToReport,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'matches'>('all');

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'matches') return n.type === 'match';
    return true;
  });

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'match':
        return <Sparkles className="w-5 h-5 text-[#315FEA]" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-[#20C9A7]" />;
      case 'reunion':
        return <HeartHandshake className="w-5 h-5 text-emerald-500" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#315FEA]/10 text-[#315FEA] flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Notification Centre
            </h2>
            <p className="text-xs text-slate-500">
              Updates on potential matches, messages and recovery statuses
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onMarkAllRead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'unread', 'matches'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
              filter === tab
                ? 'bg-[#315FEA] text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {tab === 'matches' ? 'Match Alerts' : tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
        {filteredNotifs.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No notifications in this view
          </div>
        ) : (
          filteredNotifs.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`py-4 flex items-start justify-between gap-4 transition-colors ${
                !notif.read ? 'bg-blue-50/40 dark:bg-blue-950/20 px-3 rounded-2xl' : ''
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                  {getIcon(notif.type)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {notif.title}
                    </h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#315FEA]" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                    {notif.timestamp}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                {(notif.reportId || notif.matchId) && (
                  <button
                    onClick={() => onNavigateToReport(notif.reportId, notif.matchId)}
                    title="View related item / match"
                    className="p-2 rounded-xl text-[#315FEA] hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
                {!notif.read && (
                  <button
                    onClick={() => onMarkRead(notif.id)}
                    title="Mark as read"
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => onDeleteNotification(notif.id)}
                  title="Delete notification"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
