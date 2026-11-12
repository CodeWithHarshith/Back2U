import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  MapPin,
  Calendar,
  Shield,
  ShieldCheck,
  IndianRupee,
  Phone,
  Mail,
  MessageSquare,
  Bookmark,
  Share2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Tag,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ItemReport } from '../types';

interface ItemDetailsModalProps {
  report: ItemReport | null;
  onClose: () => void;
  onStartChat: (report: ItemReport) => void;
  onToggleSave: (reportId: string) => void;
  isSaved: boolean;
  onMarkReunited?: (reportId: string) => void;
}

export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({
  report,
  onClose,
  onStartChat,
  onToggleSave,
  isSaved,
  onMarkReunited,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [copiedShare, setCopiedShare] = useState(false);
  const [claimVerificationText, setClaimVerificationText] = useState('');
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimSent, setClaimSent] = useState(false);

  if (!report) return null;

  const isLost = report.type === 'lost';

  const handleShare = () => {
    navigator.clipboard?.writeText(
      `Back2U Lost & Found Alert: ${report.name} in ${report.city}, ${report.state}. Report ID: ${report.id}`
    );
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleSendClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimVerificationText.trim()) return;
    setClaimSent(true);
    setTimeout(() => {
      setShowClaimForm(false);
      setClaimSent(false);
      onStartChat(report);
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-report-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 my-auto flex flex-col max-h-[92vh]"
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                isLost
                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                  : 'bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400'
              }`}
            >
              {isLost ? 'Lost Item Report' : 'Found Item Report'}
            </span>
            <span className="font-mono text-xs font-semibold text-slate-400">
              {report.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(report.id)}
              aria-label={isSaved ? 'Remove Bookmark' : 'Bookmark Item'}
              className={`p-2 rounded-xl border transition-colors ${
                isSaved
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-600'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800'
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={handleShare}
              aria-label="Share Report"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {copiedShare && (
          <div className="bg-emerald-500 text-white text-xs text-center py-1 font-semibold">
            Report summary and link copied to clipboard!
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Title & Status Badge */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <h2
                id="modal-report-title"
                className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight"
              >
                {report.name}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#315FEA]" />
                  {report.landmark}, {report.city}, {report.state}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {isLost ? 'Lost on' : 'Found on'}: {report.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  {report.category}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  report.status === 'Resolved'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : report.status === 'Potential Match'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                }`}
              >
                {report.status}
              </span>

              {report.reward && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <IndianRupee className="w-3 h-3" />
                  Reward: {report.reward}
                </span>
              )}
            </div>
          </div>

          {/* Missing Person Warning Banner if applicable */}
          {report.isMissingPerson && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                CRITICAL MISSING PERSON NOTICE
              </div>
              {report.personDetails && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block">Age:</span>
                    <span className="font-semibold">{report.personDetails.age} years</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Gender:</span>
                    <span className="font-semibold">{report.personDetails.gender}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Height:</span>
                    <span className="font-semibold">{report.personDetails.height}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Clothing:</span>
                    <span className="font-semibold">{report.personDetails.clothingDescription}</span>
                  </div>
                </div>
              )}
              {report.personDetails?.medicalConditions && (
                <div className="text-xs pt-1 border-t border-rose-200 dark:border-rose-900/40">
                  <span className="font-bold">Medical notes:</span>{' '}
                  {report.personDetails.medicalConditions}
                </div>
              )}
            </div>
          )}

          {/* Photographs Gallery */}
          {report.photographs && report.photographs.length > 0 && (
            <div className="space-y-2">
              <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <img
                  src={report.photographs[selectedPhotoIndex] || report.photographs[0]}
                  alt={report.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {report.photographs.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {report.photographs.map((photo, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        selectedPhotoIndex === idx
                          ? 'border-[#315FEA] scale-105'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Description & Item Specs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Detailed Description
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  {report.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Identification & Distinguishing Marks
                </h4>
                <div className="text-sm text-slate-700 dark:text-slate-200 bg-blue-50/50 dark:bg-blue-950/30 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/40 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#315FEA] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-100">
                      {report.identificationFeatures}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Must be verified before handover or return of property.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Specs Sidebar */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 h-fit">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Specifications
              </h4>

              <div className="text-xs space-y-2">
                {report.brand && (
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500">Brand / Make:</span>
                    <span className="font-semibold text-slate-800 dark:text-white">
                      {report.brand}
                    </span>
                  </div>
                )}

                {report.colour && (
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500">Colour:</span>
                    <span className="font-semibold text-slate-800 dark:text-white">
                      {report.colour}
                    </span>
                  </div>
                )}

                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Reporter:</span>
                  <span className="font-semibold text-slate-800 dark:text-white">
                    {report.reporterName}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Report Date:</span>
                  <span className="font-semibold text-slate-800 dark:text-white">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Safe Handover:</span>
                  <span className="font-semibold text-emerald-600">Police / Metro Desk</span>
                </div>
              </div>
            </div>
          </div>

          {/* Claim Verification Box */}
          {showClaimForm && (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSendClaim}
              className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-3"
            >
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Submit Ownership Proof / Distinguishing Question Answer
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                To prevent fraud, provide details only the legitimate owner would know (e.g., serial number digits, private wallpaper, wallet compartment contents).
              </p>
              <textarea
                rows={2}
                value={claimVerificationText}
                onChange={(e) => setClaimVerificationText(e.target.value)}
                placeholder="My item has this specific mark / serial / wallpaper..."
                className="w-full px-3.5 py-2 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#315FEA]"
              />
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={claimSent}
                  className="px-4 py-2 rounded-xl bg-[#315FEA] text-white font-semibold text-xs shadow-sm hover:bg-[#264ecc] transition-all"
                >
                  {claimSent ? 'Verified! Opening Chat...' : 'Send Proof & Open Chat'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowClaimForm(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-[#20C9A7]" />
            Back2U Escrow & Privacy Protection Active
          </div>

          <div className="flex items-center gap-2.5">
            {report.status !== 'Resolved' && onMarkReunited && (
              <button
                onClick={() => {
                  onMarkReunited(report.id);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mark as Reunited
              </button>
            )}

            {!showClaimForm && (
              <button
                onClick={() => setShowClaimForm(true)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold hover:bg-slate-300 transition-colors"
              >
                {isLost ? 'I Found This Item' : 'This is My Item'}
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onStartChat(report);
              }}
              className="px-5 py-2 rounded-xl bg-[#315FEA] hover:bg-[#264ecc] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Start Safe Chat
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
