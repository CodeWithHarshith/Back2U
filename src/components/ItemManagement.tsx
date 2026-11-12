import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  Filter,
  Plus,
  MapPin,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Bookmark,
  Share2,
  Tag,
  CheckCircle2,
  AlertCircle,
  SlidersHorizontal,
  X,
  IndianRupee,
} from 'lucide-react';
import { ItemReport, CategoryType, ItemStatus, ItemType } from '../types';
import { CATEGORIES_LIST } from '../utils/storage';

interface ItemManagementProps {
  reports: ItemReport[];
  viewMode: 'browse' | 'lost' | 'found' | 'missing' | 'my-reports' | 'saved';
  savedItemIds: string[];
  currentUserId: string;
  selectedCategoryFilter?: CategoryType | null;
  onClearCategoryFilter?: () => void;
  onViewDetails: (report: ItemReport) => void;
  onEditReport: (report: ItemReport) => void;
  onDeleteReport: (reportId: string) => void;
  onToggleSave: (reportId: string) => void;
  onOpenReportModal: (type: 'lost' | 'found') => void;
}

export const ItemManagement: React.FC<ItemManagementProps> = ({
  reports,
  viewMode,
  savedItemIds,
  currentUserId,
  selectedCategoryFilter,
  onClearCategoryFilter,
  onViewDetails,
  onEditReport,
  onDeleteReport,
  onToggleSave,
  onOpenReportModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>(selectedCategoryFilter || 'all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Sync categoryFilter if prop changes (e.g. from 3D carousel navigation)
  React.useEffect(() => {
    if (selectedCategoryFilter) {
      setCategoryFilter(selectedCategoryFilter);
    }
  }, [selectedCategoryFilter]);

  // Extract unique cities
  const uniqueCities = useMemo(() => {
    const set = new Set(reports.map((r) => r.city).filter(Boolean));
    return Array.from(set);
  }, [reports]);

  // Filter and sort items
  const filteredReports = useMemo(() => {
    return reports
      .filter((item) => {
        // Base view mode filter
        if (viewMode === 'lost' && item.type !== 'lost') return false;
        if (viewMode === 'found' && item.type !== 'found') return false;
        if (viewMode === 'missing' && !item.isMissingPerson) return false;
        if (viewMode === 'my-reports' && item.userId !== currentUserId) return false;
        if (viewMode === 'saved' && !savedItemIds.includes(item.id)) return false;

        // Search filter (name, description, landmark, brand, ID)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesSearch =
            item.name.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.landmark.toLowerCase().includes(q) ||
            item.city.toLowerCase().includes(q) ||
            item.id.toLowerCase().includes(q) ||
            (item.brand && item.brand.toLowerCase().includes(q));
          if (!matchesSearch) return false;
        }

        // Category filter
        if (categoryFilter !== 'all' && item.category !== categoryFilter) {
          return false;
        }

        // Status filter
        if (statusFilter !== 'all' && item.status !== statusFilter) {
          return false;
        }

        // City filter
        if (cityFilter !== 'all' && item.city !== cityFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [
    reports,
    viewMode,
    currentUserId,
    savedItemIds,
    searchQuery,
    categoryFilter,
    statusFilter,
    cityFilter,
    sortBy,
  ]);

  const viewTitles = {
    browse: 'Browse All Items',
    lost: 'Lost Belongings Registry',
    found: 'Found Items Registry',
    missing: 'Missing Persons Tracing',
    'my-reports': 'My Submitted Reports',
    saved: 'My Saved Items',
  };

  const viewDescriptions = {
    browse: 'Explore all registered lost and found articles across India',
    lost: 'Active reports of items missing and reported by their owners',
    found: 'Items safely recovered and waiting for rightful owner verification',
    missing: 'Urgent missing person notices with police tracking records',
    'my-reports': 'Manage, edit and update status for your own reported items',
    saved: 'Quick access to reports you have bookmarked for tracking',
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {viewTitles[viewMode]}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {viewDescriptions[viewMode]}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenReportModal('lost')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#315FEA] hover:bg-[#264ecc] text-white text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Report Lost Item
          </button>
          <button
            onClick={() => onOpenReportModal('found')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#20C9A7] hover:bg-[#17a98c] text-white text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Report Found Item
          </button>
        </div>
      </div>

      {/* Filter & Search Bar - GUARANTEED INPUT TEXT VISIBILITY (Fix 8) */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID, brand, location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#315FEA] shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#315FEA] shadow-xs"
            >
              <option value="all">All Categories</option>
              {CATEGORIES_LIST.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#315FEA] shadow-xs"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Potential Match">Potential Match</option>
              <option value="Under Verification">Under Verification</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Secondary Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">City:</span>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Cities</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {categoryFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-[#315FEA] font-semibold text-[11px]">
                {categoryFilter}
                <button
                  onClick={() => {
                    setCategoryFilter('all');
                    if (onClearCategoryFilter) onClearCategoryFilter();
                  }}
                  className="hover:text-blue-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Sort:</span>
            <button
              onClick={() => setSortBy('newest')}
              className={`px-2 py-1 rounded-lg font-medium transition-colors ${
                sortBy === 'newest'
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Newest First
            </button>
            <button
              onClick={() => setSortBy('oldest')}
              className={`px-2 py-1 rounded-lg font-medium transition-colors ${
                sortBy === 'oldest'
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Oldest First
            </button>
            <span className="text-slate-400 ml-2">
              Found {filteredReports.length} {filteredReports.length === 1 ? 'record' : 'records'}
            </span>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            No Reports Found
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            No items matched your current search filters. Try clearing some filters or report a new lost/found item.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setStatusFilter('all');
                setCityFilter('all');
                if (onClearCategoryFilter) onClearCategoryFilter();
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReports.map((item) => {
            const isUserOwner = item.userId === currentUserId;
            const isSaved = savedItemIds.includes(item.id);
            const isLost = item.type === 'lost';

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Card Image Banner */}
                <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={
                      item.photographs && item.photographs[0]
                        ? item.photographs[0]
                        : 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

                  {/* Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
                        isLost
                          ? 'bg-rose-500/90 text-white'
                          : 'bg-[#20C9A7]/90 text-slate-900'
                      }`}
                    >
                      {isLost ? 'Lost' : 'Found'}
                    </span>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => onToggleSave(item.id)}
                    aria-label={isSaved ? 'Remove Bookmark' : 'Bookmark Item'}
                    className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-colors ${
                      isSaved
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'bg-black/40 text-white hover:bg-black/60'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5 fill-current" />
                  </button>

                  {/* Status Badge */}
                  <div className="absolute bottom-3 left-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold backdrop-blur-md ${
                        item.status === 'Resolved'
                          ? 'bg-emerald-500 text-white'
                          : item.status === 'Potential Match'
                          ? 'bg-purple-600 text-white animate-pulse'
                          : 'bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* Reward Badge */}
                  {item.reward && (
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-sm flex items-center gap-0.5">
                      <IndianRupee className="w-3 h-3" />
                      {item.reward}
                    </div>
                  )}
                </div>

                {/* Card Content Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Unique ID & Category */}
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="font-mono font-medium">{item.id}</span>
                      <span className="font-semibold text-slate-600 dark:text-slate-300">
                        {item.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#315FEA] transition-colors">
                      {item.name}
                    </h3>

                    {/* Description excerpt */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Metadata: Location and Date */}
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#315FEA] shrink-0" />
                        <span className="truncate">
                          {item.landmark}, {item.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onViewDetails(item)}
                      className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#315FEA] hover:text-white text-slate-800 dark:text-slate-200 text-xs font-bold transition-all text-center"
                    >
                      View Details
                    </button>

                    {isUserOwner && (
                      <>
                        <button
                          onClick={() => onEditReport(item)}
                          title="Edit this report"
                          aria-label={`Edit ${item.name}`}
                          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(item.id)}
                          title="Delete this report"
                          aria-label={`Delete ${item.name}`}
                          className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Inline Delete Confirmation Dialog */}
                {confirmDeleteId === item.id && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/80 border-t border-rose-200 dark:border-rose-900/60 text-xs text-rose-900 dark:text-rose-200 flex items-center justify-between">
                    <span>Delete this report permanently?</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          onDeleteReport(item.id);
                          setConfirmDeleteId(null);
                        }}
                        className="px-2 py-1 rounded bg-rose-600 text-white font-bold text-[11px]"
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
