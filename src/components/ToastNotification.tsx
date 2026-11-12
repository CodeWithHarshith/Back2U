import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div
      className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    // Automatically dismiss toast after 2.5 seconds (Fix 10)
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 2500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-[#315FEA] shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/90 dark:bg-emerald-950/80',
    info: 'border-blue-200 dark:border-blue-900/50 bg-blue-50/90 dark:bg-blue-950/80',
    warning: 'border-amber-200 dark:border-amber-900/50 bg-amber-50/90 dark:bg-amber-950/80',
    error: 'border-rose-200 dark:border-rose-900/50 bg-rose-50/90 dark:bg-rose-950/80',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`pointer-events-auto rounded-xl p-3.5 shadow-lg backdrop-blur-md border ${
        borders[toast.type]
      } flex items-start gap-3`}
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
          {toast.title}
        </h4>
        {toast.description && (
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
