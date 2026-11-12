import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  MapPin,
  Sparkles,
  Camera,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Upload,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  IndianRupee,
  Phone,
  Mail,
  User,
  ArrowRight,
} from 'lucide-react';
import { ItemReport, CategoryType } from '../types';
import { CATEGORIES_LIST } from '../utils/storage';

interface ReportLostFormProps {
  onSubmit: (report: ItemReport) => void;
  onCancel: () => void;
}

export const ReportLostForm: React.FC<ReportLostFormProps> = ({ onSubmit, onCancel }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<ItemReport | null>(null);

  // Form State with pre-initialized values for guaranteed input visibility (Fix 8)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Mobile Phones' as CategoryType,
    brand: '',
    colour: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    city: 'Bangalore',
    landmark: '',
    identificationFeatures: '',
    reward: '',
    photographs: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    ],
    contactName: 'Sahil Sanveer',
    contactPhone: '+91 98765 43210',
    contactEmail: 'sahilsanveer1234@gmail.com',
    allowDirectCall: true,
    showPhonePublicly: false,
    preferredContactMethod: 'chat' as 'chat' | 'phone' | 'email',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = 'Item name is required';
      if (!formData.category) newErrors.category = 'Please select a category';
      if (!formData.description.trim()) newErrors.description = 'Please describe your lost item';
    } else if (currentStep === 2) {
      if (!formData.date) newErrors.date = 'Date lost is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.landmark.trim()) newErrors.landmark = 'Nearest landmark or location is required';
    } else if (currentStep === 3) {
      if (!formData.identificationFeatures.trim()) {
        newErrors.identificationFeatures = 'Identification marks or serial details help verify ownership';
      }
    } else if (currentStep === 4) {
      if (!formData.contactName.trim()) newErrors.contactName = 'Your name is required';
      if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Contact phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(4, prev + 1));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  // Image upload simulator / file reader
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
    if (!validateStep(4)) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const uniqueId = `B2U-LST-${Math.floor(10000 + Math.random() * 90000)}`;
      const newReport: ItemReport = {
        id: uniqueId,
        type: 'lost',
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
        reward: formData.reward ? `₹${formData.reward.replace(/[^0-9]/g, '')}` : undefined,
        contactPreferences: {
          name: formData.contactName,
          phone: formData.contactPhone,
          email: formData.contactEmail,
          allowDirectCall: formData.allowDirectCall,
          showPhonePublicly: formData.showPhonePublicly,
          preferredContactMethod: formData.preferredContactMethod,
        },
        status: 'Active',
        userId: 'current-user-1',
        reporterName: formData.contactName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isMissingPerson: formData.category === 'Missing Persons',
      };

      onSubmit(newReport);
      setSubmittedReport(newReport);
      setIsSubmitting(false);
    }, 600);
  };

  // Quick preset filler for easy demonstration
  const handleQuickFill = (preset: 'phone' | 'wallet') => {
    if (preset === 'phone') {
      setFormData((prev) => ({
        ...prev,
        name: 'Samsung Galaxy Phone',
        category: 'Mobile Phones',
        brand: 'Samsung',
        colour: 'Phantom Black',
        description: 'Lost my Samsung Galaxy Phone while getting out of an auto near Indiranagar. Has a black case.',
        city: 'Bangalore',
        state: 'Karnataka',
        district: 'Bengaluru Urban',
        landmark: 'Indiranagar 100ft Road Metro',
        identificationFeatures: 'Tiny scratch on bottom edge, lockscreen wallpaper of mountains',
        reward: '2000',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        name: 'Lost my black wallet',
        category: 'Wallets',
        brand: 'Tommy Hilfiger',
        colour: 'Black',
        description: 'My item was lost yesterday. Contained cards and driver license.',
        city: 'Bangalore',
        state: 'Karnataka',
        district: 'Bengaluru Urban',
        landmark: 'Church Street Metro Gate',
        identificationFeatures: 'Metal Hilfiger crest, SBI credit card inside',
        reward: '1500',
      }));
    }
  };

  if (submittedReport) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 max-w-2xl mx-auto shadow-xl border border-slate-200 dark:border-slate-800 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Lost Item Report Published!
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-6">
          Your report is now live across the Back2U network. Our AI matching system is actively scanning newly found items in {submittedReport.city}.
        </p>

        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 max-w-sm mx-auto mb-6 text-left border border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-400 uppercase font-semibold mb-1">
            Unique Report Tracking ID
          </div>
          <div className="text-lg font-mono font-bold text-[#315FEA] dark:text-[#20C9A7]">
            {submittedReport.id}
          </div>
          <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Active on National Lost & Found Registry
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl bg-[#315FEA] hover:bg-[#264ecc] text-white font-semibold text-sm shadow-md transition-all"
          >
            Go to My Reports
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 max-w-3xl mx-auto shadow-xl border border-slate-200 dark:border-slate-800">
      {/* Header & Quick Fill demo helpers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 uppercase tracking-wider">
            Lost Report
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-2">
            Report a Lost Item
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Provide detailed information to maximize the chances of successful recovery
          </p>
        </div>

        {/* Quick Test Demo Helpers */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">Fill sample:</span>
          <button
            type="button"
            onClick={() => handleQuickFill('phone')}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#315FEA] hover:bg-blue-100 transition-colors"
          >
            Galaxy Phone
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('wallet')}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 hover:bg-emerald-100 transition-colors"
          >
            Black Wallet
          </button>
        </div>
      </div>

      {/* Multi-Step Indicator */}
      <div className="py-4">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0 -translate-y-1/2" />
          {[
            { num: 1, label: 'Overview' },
            { num: 2, label: 'Location' },
            { num: 3, label: 'Details' },
            { num: 4, label: 'Contact' },
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-[#315FEA] text-white ring-4 ring-[#315FEA]/20'
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

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="lost-item-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Item Name *
              </label>
              <input
                id="lost-item-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Samsung Galaxy Phone, Black leather wallet"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#315FEA] text-sm"
              />
              {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lost-category" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select
                  id="lost-category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryType })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#315FEA] text-sm"
                >
                  {CATEGORIES_LIST.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-xs text-rose-500 mt-1">{errors.category}</p>}
              </div>

              <div>
                <label htmlFor="lost-brand" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Brand / Make (Optional)
                </label>
                <input
                  id="lost-brand"
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="e.g. Samsung, Apple, Tommy Hilfiger"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#315FEA] text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="lost-colour" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Primary Colour
              </label>
              <input
                id="lost-colour"
                type="text"
                value={formData.colour}
                onChange={(e) => setFormData({ ...formData, colour: e.target.value })}
                placeholder="e.g. Phantom Black, Navy Blue, Brown"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#315FEA] text-sm"
              />
            </div>

            <div>
              <label htmlFor="lost-description" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Detailed Description *
              </label>
              <textarea
                id="lost-description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe how and where the item was lost, packaging, case details..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#315FEA] text-sm"
              />
              {errors.description && (
                <p className="text-xs text-rose-500 mt-1">{errors.description}</p>
              )}
            </div>
          </motion.div>
        )}

        {/* STEP 2: Location & Date */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="lost-date" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Date Lost *
              </label>
              <input
                id="lost-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#315FEA] text-sm"
              />
              {errors.date && <p className="text-xs text-rose-500 mt-1">{errors.date}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lost-state" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  State *
                </label>
                <input
                  id="lost-state"
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="e.g. Karnataka, Maharashtra, Delhi"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#315FEA] text-sm"
                />
                {errors.state && <p className="text-xs text-rose-500 mt-1">{errors.state}</p>}
              </div>

              <div>
                <label htmlFor="lost-city" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  City / Town *
                </label>
                <input
                  id="lost-city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Bangalore, Mumbai, Delhi"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#315FEA] text-sm"
                />
                {errors.city && <p className="text-xs text-rose-500 mt-1">{errors.city}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="lost-landmark" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Specific Landmark / Spot Lost *
              </label>
              <input
                id="lost-landmark"
                type="text"
                value={formData.landmark}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                placeholder="e.g. Indiranagar Metro Station Gate 2, Auto-rickshaw from Indiranagar"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#315FEA] text-sm"
              />
              {errors.landmark && <p className="text-xs text-rose-500 mt-1">{errors.landmark}</p>}
            </div>
          </motion.div>
        )}

        {/* STEP 3: Specific Details & Identification */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="lost-id-features" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Secret Distinguishing / Identification Features *
              </label>
              <textarea
                id="lost-id-features"
                rows={3}
                value={formData.identificationFeatures}
                onChange={(e) =>
                  setFormData({ ...formData, identificationFeatures: e.target.value })
                }
                placeholder="Mention unique scratches, serial numbers, case marks, lockscreen photos, or cards inside. Used to verify actual ownership."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#315FEA] text-sm"
              />
              {errors.identificationFeatures && (
                <p className="text-xs text-rose-500 mt-1">{errors.identificationFeatures}</p>
              )}
            </div>

            <div>
              <label htmlFor="lost-reward" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Optional Reward (in ₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  ₹
                </span>
                <input
                  id="lost-reward"
                  type="text"
                  value={formData.reward}
                  onChange={(e) =>
                    setFormData({ ...formData, reward: e.target.value.replace(/[^0-9]/g, '') })
                  }
                  placeholder="e.g. 2000 (Optional incentive for the finder)"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#315FEA] text-sm"
                />
              </div>
            </div>

            {/* Photo Preview & Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Photographs / Reference Image
              </label>
              <div className="flex flex-wrap gap-3 items-center">
                {formData.photographs.map((pic, i) => (
                  <div
                    key={i}
                    className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-[#315FEA] shadow-sm"
                  >
                    <img src={pic} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ))}
                <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:text-[#315FEA] hover:border-[#315FEA] cursor-pointer transition-colors">
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
          </motion.div>
        )}

        {/* STEP 4: Photographs & Contact Preferences */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="lost-contact-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Your Full Name *
              </label>
              <input
                id="lost-contact-name"
                type="text"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#315FEA] text-sm"
              />
              {errors.contactName && (
                <p className="text-xs text-rose-500 mt-1">{errors.contactName}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lost-contact-phone" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Contact Phone *
                </label>
                <input
                  id="lost-contact-phone"
                  type="text"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#315FEA] text-sm"
                />
                {errors.contactPhone && (
                  <p className="text-xs text-rose-500 mt-1">{errors.contactPhone}</p>
                )}
              </div>

              <div>
                <label htmlFor="lost-contact-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  id="lost-contact-email"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#315FEA] text-sm"
                />
              </div>
            </div>

            {/* Privacy Controls */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Mask Phone Number
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Keep your direct phone private; require finders to connect via Back2U secure chat first
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={!formData.showPhonePublicly}
                  onChange={(e) =>
                    setFormData({ ...formData, showPhonePublicly: !e.target.checked })
                  }
                  className="w-4 h-4 text-[#315FEA] rounded focus:ring-[#315FEA]"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Allow Direct Phone Call
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Allow verified law enforcement / metro officials to call directly
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.allowDirectCall}
                  onChange={(e) =>
                    setFormData({ ...formData, allowDirectCall: e.target.checked })
                  }
                  className="w-4 h-4 text-[#315FEA] rounded focus:ring-[#315FEA]"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Buttons / Actions */}
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

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#315FEA] hover:bg-[#264ecc] text-white text-sm font-semibold shadow-md transition-all"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-7 py-2.5 rounded-xl bg-gradient-to-r from-[#315FEA] to-[#20C9A7] hover:opacity-95 text-white text-sm font-bold shadow-lg transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Publishing Report...' : 'Publish Lost Report'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
