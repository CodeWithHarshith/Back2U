import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  HeartHandshake,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Upload,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { ItemReport, CategoryType } from '../types';
import { CATEGORIES_LIST } from '../utils/storage';

interface ReportFoundFormProps {
  onSubmit: (report: ItemReport) => void;
  onCancel: () => void;
}

export const ReportFoundForm: React.FC<ReportFoundFormProps> = ({ onSubmit, onCancel }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<ItemReport | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Wallets' as CategoryType,
    brand: '',
    colour: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    city: 'Bangalore',
    landmark: '',
    identificationFeatures: '',
    photographs: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    ],
    contactName: 'Sahil Sanveer',
    contactPhone: '+91 98765 43210',
    contactEmail: 'sahilsanveer1234@gmail.com',
    showPhonePublicly: false,
    allowDirectCall: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = 'Found item name is required';
      if (!formData.category) newErrors.category = 'Please select a category';
      if (!formData.description.trim()) newErrors.description = 'Please describe the found item';
    } else if (currentStep === 2) {
      if (!formData.date) newErrors.date = 'Date found is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.landmark.trim()) newErrors.landmark = 'Location / Landmark where found is required';
    } else if (currentStep === 3) {
      if (!formData.identificationFeatures.trim()) {
        newErrors.identificationFeatures = 'Please describe distinguishing marks to prevent false claims';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(3, prev + 1));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({
            ...prev,
            photographs: [reader.result as string, ...prev.photographs],
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const uniqueId = `B2U-FND-${Math.floor(10000 + Math.random() * 90000)}`;
      const newReport: ItemReport = {
        id: uniqueId,
        type: 'found',
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        colour: formData.colour,
        description: formData.description,
        photographs: formData.photographs,
        date: formData.date,
        state: formData.state,
        district: formData.district,
        city: formData.city,
        landmark: formData.landmark,
        identificationFeatures: formData.identificationFeatures,
        contactPreferences: {
          name: formData.contactName,
          phone: formData.contactPhone,
          email: formData.contactEmail,
          allowDirectCall: formData.allowDirectCall,
          showPhonePublicly: formData.showPhonePublicly,
          preferredContactMethod: 'chat',
        },
        status: 'Active',
        userId: 'current-user-1',
        reporterName: formData.contactName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onSubmit(newReport);
      setSubmittedReport(newReport);
      setIsSubmitting(false);
    }, 600);
  };

  if (submittedReport) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 max-w-2xl mx-auto shadow-xl border border-slate-200 dark:border-slate-800 text-center">
        <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-950/60 text-[#20C9A7] flex items-center justify-center mx-auto mb-4">
          <HeartHandshake className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Thank You for Reporting a Found Item!
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-6">
          Your report is now live. Back2U has initiated automated intelligent matching against active lost reports in {submittedReport.city}.
        </p>

        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 max-w-sm mx-auto mb-6 text-left border border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-400 uppercase font-semibold mb-1">
            Unique Found Item ID
          </div>
          <div className="text-lg font-mono font-bold text-[#20C9A7]">
            {submittedReport.id}
          </div>
          <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#315FEA]" />
            Matching algorithm scanning...
          </div>
        </div>

        <button
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl bg-[#20C9A7] hover:bg-[#17a98c] text-white font-semibold text-sm shadow-md transition-all"
        >
          View Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 max-w-3xl mx-auto shadow-xl border border-slate-200 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 dark:bg-teal-950/60 text-[#20C9A7] uppercase tracking-wider">
            Found Report
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-2">
            Report a Found Item
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Help reconnect a rightful owner with their lost belonging
          </p>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="py-4">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0 -translate-y-1/2" />
          {[
            { num: 1, label: 'Item Overview' },
            { num: 2, label: 'Found Location' },
            { num: 3, label: 'Safekeeping & Contact' },
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-[#20C9A7] text-white ring-4 ring-[#20C9A7]/20'
                    : step > s.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
              </div>
              <span className="text-[11px] font-medium text-slate-500 mt-1 hidden sm:block">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="found-item-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Item Found *
              </label>
              <input
                id="found-item-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Black Men Bifold Wallet, Samsung Smartphone"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#20C9A7] text-sm"
              />
              {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="found-category" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select
                  id="found-category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as CategoryType })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#20C9A7] text-sm"
                >
                  {CATEGORIES_LIST.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="found-brand" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Brand (if visible)
                </label>
                <input
                  id="found-brand"
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="e.g. Tommy Hilfiger, Samsung, Titan"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#20C9A7] text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="found-colour" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Colour
              </label>
              <input
                id="found-colour"
                type="text"
                value={formData.colour}
                onChange={(e) => setFormData({ ...formData, colour: e.target.value })}
                placeholder="e.g. Black, Brown, Silver"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#20C9A7] text-sm"
              />
            </div>

            <div>
              <label htmlFor="found-description" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Description of Item *
              </label>
              <textarea
                id="found-description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe current condition and where it is currently stored..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#20C9A7] text-sm"
              />
              {errors.description && (
                <p className="text-xs text-rose-500 mt-1">{errors.description}</p>
              )}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="found-date" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Date Found *
              </label>
              <input
                id="found-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#20C9A7] text-sm"
              />
              {errors.date && <p className="text-xs text-rose-500 mt-1">{errors.date}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="found-state" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  State *
                </label>
                <input
                  id="found-state"
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#20C9A7] text-sm"
                />
              </div>

              <div>
                <label htmlFor="found-city" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  City / Town *
                </label>
                <input
                  id="found-city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#20C9A7] text-sm"
                />
                {errors.city && <p className="text-xs text-rose-500 mt-1">{errors.city}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="found-landmark" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Landmark / Specific Spot Where Found *
              </label>
              <input
                id="found-landmark"
                type="text"
                value={formData.landmark}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                placeholder="e.g. Near Indiranagar Metro entrance, auto stand, restaurant table"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#20C9A7] text-sm"
              />
              {errors.landmark && <p className="text-xs text-rose-500 mt-1">{errors.landmark}</p>}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="found-id-features" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Distinguishing Features to Verify Claimant *
              </label>
              <textarea
                id="found-id-features"
                rows={3}
                value={formData.identificationFeatures}
                onChange={(e) =>
                  setFormData({ ...formData, identificationFeatures: e.target.value })
                }
                placeholder="E.g. What specific question should the owner answer? (e.g. serial digits, wallpaper description, contents inside)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#20C9A7] text-sm"
              />
              {errors.identificationFeatures && (
                <p className="text-xs text-rose-500 mt-1">{errors.identificationFeatures}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Photographs
              </label>
              <div className="flex flex-wrap gap-3 items-center">
                {formData.photographs.map((pic, i) => (
                  <div
                    key={i}
                    className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-[#20C9A7] shadow-sm"
                  >
                    <img src={pic} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ))}
                <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:text-[#20C9A7] hover:border-[#20C9A7] cursor-pointer transition-colors">
                  <Upload className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-semibold">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 text-xs text-teal-800 dark:text-teal-200 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 shrink-0 text-[#20C9A7]" />
              <p>
                <strong>Finder Safety Notice:</strong> You do not need to give out your home address. Handover can be arranged at the nearest police station or metro helpdesk.
              </p>
            </div>
          </motion.div>
        )}

        <div className="flex items-center justify-between pt-5 border-t border-slate-100 dark:border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#20C9A7] hover:bg-[#17a98c] text-white text-sm font-semibold shadow-md transition-all"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-7 py-2.5 rounded-xl bg-gradient-to-r from-[#20C9A7] to-[#315FEA] hover:opacity-95 text-white text-sm font-bold shadow-lg transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Registering Report...' : 'Publish Found Report'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
