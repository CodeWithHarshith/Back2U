import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Menu,
  Search,
  Bell,
  MessageSquare,
  Sparkles,
  Sun,
  Moon,
  Plus,
  Shield,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import {
  ItemReport,
  CategoryType,
  DashboardStats,
  MatchRecord,
  AppNotification,
  Conversation,
  MessageItem,
  UserProfile as UserProfileType,
} from './types';
import { StorageService } from './utils/storage';
import { Navigation, NavItemKey } from './components/Navigation';
import { DashboardHome } from './components/DashboardHome';
import { ItemManagement } from './components/ItemManagement';
import { ReportLostForm } from './components/ReportLostForm';
import { ReportFoundForm } from './components/ReportFoundForm';
import { AIMatchingView } from './components/AIMatchingView';
import { MessagingView } from './components/MessagingView';
import { NotificationCenter } from './components/NotificationCenter';
import { UserProfile } from './components/UserProfile';
import { AdminDashboard } from './components/AdminDashboard';
import { ItemDetailsModal } from './components/ItemDetailsModal';
import { EditReportModal } from './components/EditReportModal';
import { FloatingReportButton } from './components/FloatingReportButton';
import { ToastNotification, ToastMessage } from './components/ToastNotification';

export default function App() {
  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<NavItemKey>('dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Data State loaded from StorageService
  const [reports, setReports] = useState<ItemReport[]>([]);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [user, setUser] = useState<UserProfileType>(StorageService.getUser());
  const [savedItemIds, setSavedItemIds] = useState<string[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalLost: 0,
    totalFound: 0,
    successfullyReunited: 0,
    activeReports: 0,
    potentialMatches: 0,
    unreadNotifications: 0,
    missingPersonsCount: 0,
  });

  // Category Filtering - FIX 10: Must NOT be set to 'Electronics' by default!
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<CategoryType | null>(null);

  // Modals & Active Selections
  const [reportModalType, setReportModalType] = useState<'lost' | 'found' | null>(null);
  const [detailsReport, setDetailsReport] = useState<ItemReport | null>(null);
  const [editingReport, setEditingReport] = useState<ItemReport | null>(null);
  const [activeChatConversationId, setActiveChatConversationId] = useState<string | undefined>(undefined);

  // Toast Notifications for intentional user actions
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage['type'], title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Initialize and load data from Storage
  const refreshData = useCallback(() => {
    const rep = StorageService.getReports();
    const mat = StorageService.getMatches();
    const not = StorageService.getNotifications();
    const conv = StorageService.getConversations();
    const usr = StorageService.getUser();
    const saved = StorageService.getSavedItemIds();
    const st = StorageService.calculateStats();

    setReports(rep);
    setMatches(mat);
    setNotifications(not);
    setConversations(conv);
    setUser(usr);
    setSavedItemIds(saved);
    setStats(st);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Dark Mode toggler
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  // Category Selection handler from 3D Curved Carousel (Fix 10)
  const handleSelectCategory = (category: CategoryType) => {
    setSelectedCategoryFilter(category);
    setCurrentTab('browse');
    // Intentional user action toast only! (Fix 10)
    addToast('info', `Filtered by ${category}`, `Showing lost and found articles for ${category}`);
  };

  // Lost/Found Form Submissions
  const handleCreateReport = (newReport: ItemReport) => {
    StorageService.addReport(newReport);
    refreshData();
    setReportModalType(null);
    addToast(
      'success',
      `${newReport.type === 'lost' ? 'Lost' : 'Found'} Item Registered!`,
      `Report ID: ${newReport.id}`
    );
  };

  // Edit Report Save
  const handleSaveEditedReport = (updated: ItemReport) => {
    StorageService.updateReport(updated);
    refreshData();
    setEditingReport(null);
    addToast('success', 'Report Updated Successfully');
  };

  // Delete Report
  const handleDeleteReport = (reportId: string) => {
    StorageService.deleteReport(reportId);
    refreshData();
    addToast('info', 'Report Removed', `Report ${reportId} has been deleted.`);
  };

  // Bookmark Toggle
  const handleToggleSave = (reportId: string) => {
    const isNowSaved = StorageService.toggleSaveItem(reportId);
    setSavedItemIds(StorageService.getSavedItemIds());
    addToast(
      'info',
      isNowSaved ? 'Saved to Bookmarks' : 'Removed from Bookmarks'
    );
  };

  // Match Status Updates (e.g. mark Reunited)
  const handleUpdateMatchStatus = (matchId: string, status: MatchRecord['status']) => {
    StorageService.updateMatchStatus(matchId, status);
    refreshData();
    if (status === 'Reunited') {
      addToast('success', 'Item Reunited!', 'Both records marked as resolved.');
    }
  };

  // Start Safe Chat for an item
  const handleStartChat = (report: ItemReport) => {
    // Check if conversation already exists or create new
    const existing = conversations.find((c) => c.reportId === report.id);
    if (existing) {
      setActiveChatConversationId(existing.id);
    } else {
      const newConv: Conversation = {
        id: `CONV-${Date.now()}`,
        reportId: report.id,
        reportName: report.name,
        participantId: report.userId,
        participantName: report.reporterName,
        participantAvatar:
          report.photographs?.[0] ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
        lastMessage: 'Hi, I saw your report on Back2U.',
        lastMessageTimestamp: 'Just now',
        unreadCount: 0,
      };
      const updated = [newConv, ...conversations];
      StorageService.saveConversations(updated);
      setConversations(updated);
      setActiveChatConversationId(newConv.id);
    }
    setCurrentTab('messages');
  };

  // Send message in active chat
  const handleSendMessage = (conversationId: string, text: string) => {
    StorageService.sendMessage(conversationId, text, user.name);
    refreshData();
  };

  // Update User Profile
  const handleSaveUser = (updatedUser: UserProfileType) => {
    StorageService.saveUser(updatedUser);
    setUser(updatedUser);
    addToast('success', 'Profile Updated Successfully');
  };

  // Current messages for active conversation
  const currentMessages = useMemo(() => {
    if (!activeChatConversationId) {
      const firstId = conversations[0]?.id;
      return firstId ? StorageService.getMessages(firstId) : [];
    }
    return StorageService.getMessages(activeChatConversationId);
  }, [activeChatConversationId, conversations]);

  return (
    <div className={`min-h-screen bg-[#F7F9FC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200`}>
      {/* Toast Notification Container */}
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />

      {/* Responsive Left Navigation */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'report-lost') {
            setReportModalType('lost');
          } else if (tab === 'report-found') {
            setReportModalType('found');
          } else {
            setCurrentTab(tab);
          }
        }}
        stats={stats}
        user={user}
        isMobileOpen={isMobileNavOpen}
        onToggleMobile={() => setIsMobileNavOpen(!isMobileNavOpen)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Content Area (offset by sidebar width on desktop) */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#101B35]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Open Navigation Menu"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Section Name */}
            <div>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                Back2U Network /{' '}
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                {currentTab.replace('-', ' ')}
              </span>
            </div>
          </div>

          {/* Header Action Shortcuts */}
          <div className="flex items-center gap-2.5">
            {/* Quick Match Alerts pill */}
            <button
              onClick={() => setCurrentTab('matches')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden sm:inline">Matches</span>
              <span className="px-1.5 py-0.2 bg-purple-600 text-white rounded-full text-[10px]">
                {stats.potentialMatches}
              </span>
            </button>

            {/* Quick Notifications shortcut */}
            <button
              onClick={() => setCurrentTab('notifications')}
              aria-label="Open notifications"
              className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {stats.unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* Quick Chat shortcut */}
            <button
              onClick={() => setCurrentTab('messages')}
              aria-label="Open messages"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            {/* Dark Mode toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Avatar */}
            <button
              onClick={() => setCurrentTab('profile')}
              aria-label="Open profile settings"
              className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-lg object-cover border border-slate-300 dark:border-slate-600"
              />
            </button>
          </div>
        </header>

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto pb-32 sm:pb-24">
          {currentTab === 'dashboard' && (
            <DashboardHome
              stats={stats}
              reports={reports}
              notifications={notifications}
              onSelectCategory={handleSelectCategory}
              onOpenReportModal={(type) => setReportModalType(type)}
              onViewReport={(r) => setDetailsReport(r)}
              onNavigateToMatches={() => setCurrentTab('matches')}
              onNavigateToTab={(t) => setCurrentTab(t)}
            />
          )}

          {(currentTab === 'browse' ||
            currentTab === 'lost' ||
            currentTab === 'found' ||
            currentTab === 'missing' ||
            currentTab === 'my-reports' ||
            currentTab === 'saved') && (
            <ItemManagement
              reports={reports}
              viewMode={
                currentTab === 'lost'
                  ? 'lost'
                  : currentTab === 'found'
                  ? 'found'
                  : currentTab === 'missing'
                  ? 'missing'
                  : currentTab === 'my-reports'
                  ? 'my-reports'
                  : currentTab === 'saved'
                  ? 'saved'
                  : 'browse'
              }
              savedItemIds={savedItemIds}
              currentUserId={user.id}
              selectedCategoryFilter={selectedCategoryFilter}
              onClearCategoryFilter={() => setSelectedCategoryFilter(null)}
              onViewDetails={(r) => setDetailsReport(r)}
              onEditReport={(r) => setEditingReport(r)}
              onDeleteReport={handleDeleteReport}
              onToggleSave={handleToggleSave}
              onOpenReportModal={(type) => setReportModalType(type)}
            />
          )}

          {currentTab === 'matches' && (
            <AIMatchingView
              matches={matches}
              reports={reports}
              onViewReport={(r) => setDetailsReport(r)}
              onStartChat={handleStartChat}
              onUpdateMatchStatus={handleUpdateMatchStatus}
            />
          )}

          {currentTab === 'messages' && (
            <MessagingView
              conversations={conversations}
              activeConversationId={activeChatConversationId}
              messages={currentMessages}
              currentUserId={user.id}
              currentUserName={user.name}
              onSelectConversation={(id) => setActiveChatConversationId(id)}
              onSendMessage={handleSendMessage}
              onBlockUser={(id) => {
                addToast('info', 'User blocked from messaging');
              }}
            />
          )}

          {currentTab === 'notifications' && (
            <NotificationCenter
              notifications={notifications}
              onMarkRead={(id) => {
                StorageService.markNotificationRead(id);
                refreshData();
              }}
              onMarkAllRead={() => {
                StorageService.markAllNotificationsRead();
                refreshData();
                addToast('info', 'All notifications marked as read');
              }}
              onDeleteNotification={(id) => {
                StorageService.deleteNotification(id);
                refreshData();
              }}
              onNavigateToReport={(reportId, matchId) => {
                if (matchId) {
                  setCurrentTab('matches');
                } else if (reportId) {
                  const rep = reports.find((r) => r.id === reportId);
                  if (rep) setDetailsReport(rep);
                }
              }}
            />
          )}

          {currentTab === 'profile' && (
            <UserProfile
              user={user}
              onSaveUser={handleSaveUser}
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
            />
          )}

          {currentTab === 'settings' && (
            <UserProfile
              user={user}
              onSaveUser={handleSaveUser}
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
            />
          )}

          {currentTab === 'admin' && (
            <AdminDashboard
              reports={reports}
              onUpdateReportStatus={(id, status) => {
                const rep = reports.find((r) => r.id === id);
                if (rep) {
                  StorageService.updateReport({ ...rep, status });
                  refreshData();
                  addToast('success', `Report status changed to ${status}`);
                }
              }}
              onDeleteReport={handleDeleteReport}
              onViewDetails={(r) => setDetailsReport(r)}
            />
          )}

          {currentTab === 'help' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl max-w-3xl mx-auto space-y-6">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950/60 text-[#315FEA]">
                  Support & Protocol
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                  Back2U Help Center & FAQ
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  How India&apos;s Lost &amp; Found Network works and how to protect yourself
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                    What should I do if I find an item?
                  </h4>
                  <p className="leading-relaxed">
                    Click &apos;Report Found Item&apos;, upload clear photos without revealing private serial numbers or passwords, and keep the item safe. Back2U will automatically notify you if an owner matches your report.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                    How does AI Matching work?
                  </h4>
                  <p className="leading-relaxed">
                    Our neural matching engine analyzes category overlap, keyword similarity, geolocation proximity in Indian cities (Bangalore, Mumbai, Delhi, etc.), and reporting timeframes to calculate confidence scores.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                    Safety & Fraud Protection
                  </h4>
                  <p className="leading-relaxed">
                    Never pay courier charges upfront to unverified individuals. We recommend exchanging high-value belongings inside police stations, airport helpdesks, or metro control stations.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating Report Button - FIX 12: Fixed, safe-area inset compliant, no overlap */}
      <FloatingReportButton onOpenReportModal={(type) => setReportModalType(type)} />

      {/* Report Modals */}
      {reportModalType === 'lost' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="my-auto w-full">
            <ReportLostForm
              onSubmit={handleCreateReport}
              onCancel={() => setReportModalType(null)}
            />
          </div>
        </div>
      )}

      {reportModalType === 'found' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="my-auto w-full">
            <ReportFoundForm
              onSubmit={handleCreateReport}
              onCancel={() => setReportModalType(null)}
            />
          </div>
        </div>
      )}

      {/* Details Modal */}
      <ItemDetailsModal
        report={detailsReport}
        onClose={() => setDetailsReport(null)}
        onStartChat={handleStartChat}
        onToggleSave={handleToggleSave}
        isSaved={detailsReport ? savedItemIds.includes(detailsReport.id) : false}
        onMarkReunited={(id) => {
          const rep = reports.find((r) => r.id === id);
          if (rep) {
            StorageService.updateReport({ ...rep, status: 'Resolved' });
            refreshData();
            addToast('success', 'Item marked as successfully reunited!');
          }
        }}
      />

      {/* Edit Report Modal */}
      {editingReport && (
        <EditReportModal
          report={editingReport}
          onSave={handleSaveEditedReport}
          onClose={() => setEditingReport(null)}
        />
      )}
    </div>
  );
}
