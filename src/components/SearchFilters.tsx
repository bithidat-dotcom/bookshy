/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Filter, BookOpen, RefreshCcw, Layers, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { BOOK_TYPES, CLASS_LEVELS } from '../lib/calc';
import { Book } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedClass: string;
  setSelectedClass: (cls: string) => void;
  selectedCondition: string;
  setSelectedCondition: (cond: string) => void;
  books: Book[];
  onResetFilters: () => void;
}

export default function SearchFilters({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  selectedClass,
  setSelectedClass,
  selectedCondition,
  setSelectedCondition,
  books,
  onResetFilters
}: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate active filters count
  const activeFiltersCount = 
    (selectedType !== 'all' ? 1 : 0) + 
    (selectedClass !== 'all' ? 1 : 0) + 
    (selectedCondition !== 'all' ? 1 : 0);

  return (
    <div className="w-full bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/60 p-4 sm:p-5 shadow-sm space-y-4">
      
      {/* Top Main Bar: Search Input and the All-in-One Filter Button */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        
        {/* Search Bar - Spanning full remaining space */}
        <div className="relative flex-grow">
          <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
            <Search className="h-4.5 w-4.5 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="বইয়ের নাম, লেখক অথবা স্থান দিয়ে খুঁজুন... (Search books, authors, location...)"
            className="block w-full rounded-xl border border-slate-200 bg-white/90 py-3 pl-11 pr-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 font-sans shadow-xs"
          />
        </div>

        {/* The All-In-One Filter Toggle button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          id="toggle-filter-panel-element"
          className={`flex items-center justify-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold transition-all duration-350 cursor-pointer border active:scale-95 shrink-0 ${
            isExpanded || activeFiltersCount > 0 
              ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/15 hover:bg-blue-700'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="font-sans font-extrabold uppercase tracking-wide">
            {isExpanded ? 'ফিল্টার বন্ধ করুন' : 'অ্যাডভান্সড ফিল্টার'}
          </span>
          
          {activeFiltersCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-black text-slate-950 animate-pulse">
              {activeFiltersCount}
            </span>
          )}

          {isExpanded ? <ChevronUp className="h-3.5 w-3.5 opacity-80" /> : <ChevronDown className="h-3.5 w-3.5 opacity-80" />}
        </button>

      </div>

      {/* Expandable Advanced Filters Drawer Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: 1, 
              height: 'auto',
              transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
            }}
            exit={{ 
              opacity: 0, 
              height: 0,
              transition: { duration: 0.25, ease: 'easeInOut' }
            }}
            className="overflow-hidden border-t border-slate-100 pt-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              
              {/* Category selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block font-sans">
                  Book Type / বইয়ের ধরণ
                </label>
                <div id="filter-field-type" className="relative">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-500 transition-all appearance-none cursor-pointer font-sans shadow-xs"
                  >
                    {BOOK_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                    <Filter className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>

              {/* Education Level selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block font-sans">
                  Education Level / ক্লাস
                </label>
                <div id="filter-field-class" className="relative">
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-500 transition-all appearance-none cursor-pointer font-sans shadow-xs"
                  >
                    {CLASS_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                    <Layers className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>

              {/* Condition level selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block font-sans">
                  Condition / বইয়ের অবস্থা
                </label>
                <div id="filter-field-condition" className="relative">
                  <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-500 transition-all appearance-none cursor-pointer font-sans shadow-xs"
                  >
                    <option value="all">All Conditions / সব অবস্থা</option>
                    <option value="new">Brand New (একেবারে নতুন)</option>
                    <option value="excellent">Excellent (খুবই ভালো)</option>
                    <option value="good">Good (মোটামুটি ভালো)</option>
                    <option value="fair">Fair (পড়ার উপযোগী)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                    <BookOpen className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Reset Trigger option */}
            {activeFiltersCount > 0 && (
              <div className="flex justify-end pt-4 border-t border-slate-55 mt-4">
                <button
                  onClick={onResetFilters}
                  className="flex items-center space-x-2 text-xs text-red-500 hover:text-red-600 transition-all font-semibold font-sans cursor-pointer bg-red-50 hover:bg-red-100/70 px-4 py-1.5 rounded-lg border border-red-100"
                >
                  <RefreshCcw className="h-3 w-3" />
                  <span>মুছে ফেলুন (Reset All Filters)</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
