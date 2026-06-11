/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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

const SLIDES = [
  {
    id: 1,
    image: "https://i.postimg.cc/BQPvc24r/Man-happy-reading-book-Booksy-BD-202606101504.jpg",
    tagline: "Booksy-bd Premium",
    title: "বইমেলা পুরাতন বই এক্সচেঞ্জ ও কেনা-বেচার বিশ্বস্ত ঠিকানা!",
    subtitle: "Booksy-bd: শিক্ষা হোক সহজ এবং সবার জন্য উন্মুক্ত!",
    description: "আপনার পড়া পুরাতন বইগুলো অলস ফেলে না রেখে এখানে বিনামূল্যে পোস্ট করুন, অথবা অর্ধেক বা তারও কম মূল্যে সংগ্রহ করুন আপনার প্রয়োজনীয় একাডেমিক সিলেবাস বুকস।"
  },
  {
    id: 2,
    image: "https://img.freepik.com/premium-photo/open-book-with-fanned-pages-against-light-blue-background_1113571-8273.jpg?semt=ais_hybrid&w=740&q=80",
    tagline: "Booksy-bd Swap Hub",
    title: "লাইভ বুক এক্সচেঞ্জ ও কন্ডিশন ভেরিফিকেশন!",
    subtitle: "সহজ যোগাযোগ, নির্ভরযোগ্য ডিল ও সেরা সেভিংস",
    description: "আমাদের ড্যাশবোর্ডে কন্ডিশন যাচাই করে সরাসরি বিক্রেতার সাথে কথা বলুন এবং সবচেয়ে সাশ্রয়ী মূল্যে আপনার পছন্দের একাডেমিক বই সংগ্রহ করুন।"
  }
];

export default function BannerAndTargetSection({ books, onOpenPost }: BannerAndTargetSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Automatic slide cycle interval set to 7 seconds (7000ms)
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const slide = SLIDES[currentSlide];

  return (
    <div 
      id="bookify-sales-analytics" 
      className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 min-h-[200px] sm:min-h-[420px] flex flex-col justify-between group bg-slate-950 w-full mb-8"
    >
      {/* Full Image Background Layer with Overlay for Readability */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[12s] scale-100"
          style={{ 
            backgroundImage: `url("${slide.image}")`,
            backgroundPosition: 'center 35%'
          }}
        />
      </AnimatePresence>
      
      {/* Transparent dark gradient overlays to let the image shine through with absolute contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/40 z-0" />
      <div className="absolute inset-0 bg-sky-950/20 z-0 mix-blend-multiply" />
      
      {/* Content layout wrapper */}
      <div className="relative z-10 p-4 sm:p-10 md:p-14 flex flex-col justify-between space-y-4 sm:space-y-8 min-h-[200px] sm:min-h-[420px] h-full">
        
        {/* Top Row: Simple Tag, Slide Pagination dots, Dismiss close button */}
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[8.5px] sm:text-[10px] font-black uppercase tracking-widest bg-sky-500/25 text-white border border-white/20 backdrop-blur-md flex items-center gap-1 sm:gap-1.5 shadow-xl">
            <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-sky-300 animate-pulse shrink-0" />
            {slide.tagline}
          </span>

          {/* Pagination Bullet Indicators */}
          <div className="flex items-center space-x-2">
            {SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(index);
                }}
                className={`h-1.5 sm:h-2 rounded-full cursor-pointer transition-all duration-300 ${
                  index === currentSlide ? 'w-5 sm:w-6 bg-sky-400' : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            className="p-1 sm:p-2 rounded-full bg-slate-900/40 text-white/80 hover:bg-slate-900/60 hover:text-white transition-all cursor-pointer border border-white/10 backdrop-blur-md active:scale-90"
          >
            <X className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Middle Content */}
        <div className="max-w-2xl space-y-1.5 sm:space-y-4 text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.5 }}
              className="space-y-1.5 sm:space-y-3"
            >
              <h2 className="text-base sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight drop-shadow-2xl font-sans">
                {slide.title}
              </h2>
              
              <p className="text-[10px] sm:text-base font-bold text-sky-300 font-sans tracking-wide drop-shadow-lg">
                {slide.subtitle}
              </p>
              
              <p className="hidden sm:block text-xs sm:text-sm md:text-base text-slate-200 font-medium leading-relaxed drop-shadow-md">
                {slide.description}
              </p>
            </motion.div>
          </AnimatePresence>
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

    </div>
  );
}
