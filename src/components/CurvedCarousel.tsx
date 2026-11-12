import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { CATEGORIES_LIST, CategoryInfo } from '../utils/storage';
import { ItemReport, CategoryType } from '../types';
import { IconRenderer } from './IconRenderer';

interface CurvedCarouselProps {
  reports: ItemReport[];
  onSelectCategory: (category: CategoryType) => void;
}

export const CurvedCarousel: React.FC<CurvedCarouselProps> = ({
  reports,
  onSelectCategory,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const categories = CATEGORIES_LIST;
  const count = categories.length;

  const getCategoryCount = useCallback(
    (catName: CategoryType) => {
      return reports.filter((r) => r.category === catName && r.status !== 'Closed').length;
    },
    [reports]
  );

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % count);
  }, [count]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Touch and pointer drag handling
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = e.clientX - dragStartX.current;
    if (diff > 45) {
      handlePrev();
    } else if (diff < -45) {
      handleNext();
    }
  };

  return (
    <div className="relative w-full py-4 overflow-hidden select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#315FEA]/10 text-[#315FEA] flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              3D Category Discovery
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive curved showcase across {count} verified categories
            </p>
          </div>
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrev}
            aria-label="Previous Category"
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-slate-400 px-1">
            {activeIndex + 1}/{count}
          </span>
          <button
            onClick={handleNext}
            aria-label="Next Category"
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D Curved Stage */}
      <div
        ref={carouselRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="relative h-[280px] w-full flex items-center justify-center cursor-grab active:cursor-grabbing perspective-1000"
      >
        <div className="relative w-full max-w-4xl h-full flex items-center justify-center preserve-3d">
          {categories.map((category, idx) => {
            // Calculate distance offset from activeIndex (-2, -1, 0, 1, 2)
            let offset = idx - activeIndex;
            if (offset > count / 2) offset -= count;
            if (offset < -count / 2) offset += count;

            // Only render cards within a visible range of 3 on either side for high performance
            const isVisible = Math.abs(offset) <= 3;
            if (!isVisible) return null;

            // 3D Cylinder geometry calculations
            const rotateY = offset * 22; // 22 degrees per slot along cylinder
            const translateX = offset * 180; // horizontal separation
            const translateZ = -Math.abs(offset) * 85; // curved depth
            const scale = 1 - Math.abs(offset) * 0.12;
            const opacity = 1 - Math.abs(offset) * 0.22;
            const isCenter = offset === 0;

            const itemCount = getCategoryCount(category.name);

            return (
              <motion.div
                key={category.id}
                initial={false}
                animate={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex: isCenter ? 30 : 20 - Math.abs(offset),
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                onClick={() => {
                  if (isCenter) {
                    // Intentionally user-clicked category! (Fix 10)
                    onSelectCategory(category.name);
                  } else {
                    setActiveIndex(idx);
                  }
                }}
                className={`absolute w-56 sm:w-64 h-[250px] rounded-2xl overflow-hidden shadow-xl border transition-all duration-300 ${
                  isCenter
                    ? 'border-[#315FEA] ring-4 ring-[#315FEA]/20 bg-white dark:bg-slate-800'
                    : 'border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90'
                }`}
              >
                {/* Image Background Banner */}
                <div className="relative h-32 w-full overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                  {/* Icon badge */}
                  <div
                    className="absolute top-3 left-3 w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md backdrop-blur-md"
                    style={{ backgroundColor: category.color }}
                  >
                    <IconRenderer name={category.icon} className="w-5 h-5" />
                  </div>

                  {/* Record Count Badge */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 backdrop-blur-sm shadow-sm">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </div>

                  {/* Category Name overlay */}
                  <div className="absolute bottom-2 left-3 right-3">
                    <h4 className="text-white font-bold text-base tracking-tight drop-shadow-sm truncate">
                      {category.name}
                    </h4>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3.5 flex flex-col justify-between h-[122px]">
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#315FEA] dark:text-[#20C9A7]">
                      {isCenter ? 'Click to browse' : 'Click to inspect'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      #{idx + 1}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mini Category Pill Quick Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-2 px-2 scrollbar-none">
        {categories.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setActiveIndex(i)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeIndex === i
                ? 'bg-[#315FEA] text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#315FEA]'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
};
