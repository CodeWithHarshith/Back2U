import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, X, Search, HeartHandshake } from 'lucide-react';

interface FloatingReportButtonProps {
  onOpenReportModal: (type: 'lost' | 'found') => void;
}

export const FloatingReportButton: React.FC<FloatingReportButtonProps> = ({
  onOpenReportModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 flex flex-col items-end gap-2.5 pointer-events-auto">
      {/* Expandable Options Popover */}
      {isOpen && (
        <div className="flex flex-col gap-2 items-end mb-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Report Found Item Button */}
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenReportModal('found');
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#20C9A7] hover:bg-[#17a98c] text-white shadow-xl font-bold text-xs transition-all hover:scale-105 active:scale-95"
          >
            <span>Report Found Item</span>
            <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </button>

          {/* Report Lost Item Button */}
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenReportModal('lost');
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#315FEA] hover:bg-[#264ecc] text-white shadow-xl font-bold text-xs transition-all hover:scale-105 active:scale-95"
          >
            <span>Report Lost Item</span>
            <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Report lost or found item"
        className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl shadow-2xl flex items-center justify-center text-white transition-all duration-300 ${
          isOpen
            ? 'bg-slate-800 rotate-90 ring-4 ring-slate-800/20'
            : 'bg-gradient-to-tr from-[#315FEA] to-[#20C9A7] ring-4 ring-[#315FEA]/20'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};
