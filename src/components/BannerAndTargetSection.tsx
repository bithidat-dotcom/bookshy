/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles,
  BookOpen,
  X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Book } from '../types';

interface BannerAndTargetSectionProps {
  books: Book[];
  onOpenPost: () => void;
}

export default function BannerAndTargetSection({ books, onOpenPost }: BannerAndTargetSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div 
        id="bookify-sales-analytics" 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } 
        }}
        exit={{ 
          opacity: 0, 
          transition: { duration: 0.5 } 
        }}
        className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 min-h-[200px] sm:min-h-[420px] flex flex-col justify-between group bg-slate-900 w-full mb-8"
      >
        
        {/* Full Image Background Layer with Overlay for Readability */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[12s] group-hover:scale-105"
          style={{ 
            backgroundImage: `url("https://img.freepik.com/premium-photo/open-book-with-fanned-pages-against-light-blue-background_1113571-8273.jpg?semt=ais_hybrid&w=740&q=80")`,
            backgroundPosition: '50% 30%'
          }}
        />
        
        {/* Slightly more transparent overlays to let the image shine through more clearly */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-slate-950/30 z-0" />
        <div className="absolute inset-0 bg-sky-900/10 z-0 mix-blend-overlay" />
        
        {/* Content layout wrapper */}
        <div className="relative z-10 p-4 sm:p-10 md:p-14 flex flex-col justify-between space-y-4 sm:space-y-8 min-h-[200px] sm:min-h-[420px] h-full">
          
          {/* Top Row: Simple Tag & Close Dismiss button */}
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 sm:px-3.5 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest bg-sky-500/25 text-white border border-white/20 backdrop-blur-md flex items-center gap-1 sm:gap-1.5 shadow-xl">
              <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-sky-300 animate-pulse" />
              Booksy-bd Premium
            </span>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 sm:p-2 rounded-full bg-slate-900/40 text-white/80 hover:bg-slate-900/60 hover:text-white transition-all cursor-pointer border border-white/10 backdrop-blur-md active:scale-90"
            >
              <X className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Middle Content */}
          <div className="max-w-2xl space-y-1.5 sm:space-y-4 text-left">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 1.0 }}
              className="text-base sm:text-3.5xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight drop-shadow-2xl"
            >
              বইমেলা পুরাতন বই এক্সচেঞ্জ ও কেনা-বেচার বিশ্বস্ত ঠিকানা!
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 1.0 }}
              className="text-[10px] sm:text-base font-bold text-sky-300 font-sans tracking-wide drop-shadow-lg"
            >
              Booksy-bd: শিক্ষা হোক সহজ এবং সবার জন্য উন্মুক্ত!
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1.2 }}
              className="hidden sm:block text-xs sm:text-sm md:text-base text-slate-200 font-medium leading-relaxed drop-shadow-md"
            >
              আপনার পড়া পুরাতন বইগুলো অলস ফেলে না রেখে এখানে বিনামূল্যে পোস্ট করুন, অথবা অর্ধেক বা তারও কম মূল্যে সংগ্রহ করুন আপনার প্রয়োজনীয় একাডেমিক সিলেবাস বুকস।
            </motion.p>
          </div>

          {/* Bottom Footer Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-t border-white/10 pt-3 sm:pt-6">
            <div className="hidden sm:flex items-center space-x-2.5 text-[10px] sm:text-xs text-white/90 font-bold bg-white/10 p-2 rounded-lg border border-white/5 backdrop-blur-sm self-start sm:self-auto">
              <BookOpen className="h-3.5 w-3.5 text-sky-400 shrink-0" />
              <span>Created with care by Prangon</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenPost}
              className="flex items-center justify-center space-x-2 sm:space-x-3 rounded-xl sm:rounded-2xl bg-sky-500 hover:bg-sky-400 text-white px-4 sm:px-8 py-2 sm:py-3.5 text-[11px] sm:text-sm font-black transition-all cursor-pointer shadow-[0_0_20px_rgba(14,165,233,0.3)] w-full sm:w-auto"
            >
              <span>বই বিক্রয় করুন / এক্সচেঞ্জ শুরু করুন</span>
              <ArrowRight className="h-3.5 w-3.5 sm:h-5 sm:w-5 shrink-0" />
            </motion.button>
          </div>

        </div>

      </motion.div>
    </AnimatePresence>
  );
}
