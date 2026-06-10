/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, BookOpen, User, ShoppingBag, ArrowRight } from 'lucide-react';
import { Book } from '../types';

interface BookSliderProps {
  books: Book[];
  title: string;
  subtitle: string;
  englishBadge?: string;
  onBuy: (book: Book) => void;
}

export default function BookSlider({ books, title, subtitle, englishBadge, onBuy }: BookSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Take the relevant items
  const activeBooks = books.filter(b => !b.isSold).slice(0, 10);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;
      const targetScroll = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  if (activeBooks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 border border-slate-100 rounded-3xl p-5 bg-slate-50/50">
      {/* Dynamic Header with slider actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700 shadow-xs">
            <BookOpen className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">{title}</h2>
              {englishBadge && (
                <span className="bg-blue-600 text-white text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full uppercase font-sans animate-pulse">
                  {englishBadge}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">{subtitle}</p>
          </div>
        </div>

        {/* Horizontal Navigation Control Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => scroll('left')}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-xs hover:bg-slate-50 transition-all duration-150 active:scale-95 cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-xs hover:bg-slate-50 transition-all duration-150 active:scale-95 cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Slide Container Area */}
      <div 
        ref={scrollContainerRef}
        className="flex w-full gap-4 overflow-x-auto pb-3 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent select-none"
        style={{ scrollbarWidth: 'thin' }}
      >
        {activeBooks.map((book) => {
          // Calculate discount banner text
          const hasDiscount = book.originalPrice && book.originalPrice > book.price;
          const discountPercent = hasDiscount && book.originalPrice 
            ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
            : 0;

          return (
            <div
              key={`slider-item-${book.id}`}
              onClick={() => onBuy(book)}
              className="w-[250px] sm:w-[275px] shrink-0 snap-start rounded-2xl bg-white border border-slate-200/70 p-3 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Visual Image Banner inside slide card */}
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-50 mb-3 group">
                  <img
                    src={book.imageUri}
                    alt={book.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400';
                    }}
                  />
                  
                  {/* Badge displaying condition */}
                  <div className="absolute top-2 left-2">
                    <span className="inline-block rounded-md bg-slate-900/90 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 border border-slate-800 shadow-xs">
                      {book.condition === 'excellent' ? '✨ Excellent' : book.condition === 'good' ? '👍 Good' : '📖 Fair'}
                    </span>
                  </div>

                  {/* Discount percentage tag */}
                  {discountPercent > 0 && (
                    <div className="absolute top-2 right-2">
                      <span className="inline-block rounded-md bg-rose-600 text-white text-[9px] font-bold px-2 py-0.5 shadow-sm font-sans">
                        {discountPercent}% OFF
                      </span>
                    </div>
                  )}
                </div>

                {/* Listing Details */}
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                    {book.bookType === 'academic' ? `Class: ${book.classLevel}` : book.genre}
                  </span>
                  <span className="text-[9px] text-slate-400 capitalize font-mono">{book.bookType}</span>
                </div>
                
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1 mt-1 hover:text-blue-600 transition-colors" title={book.title}>
                  {book.title}
                </h3>
                
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  By: <span className="font-semibold text-slate-700">{book.author}</span>
                </p>

                {/* Location indicator */}
                <div className="flex items-center text-[10px] text-slate-400 mt-2 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                  <User className="h-3 w-3 mr-1 text-slate-400 shrink-0" />
                  <span className="truncate max-w-[100px] font-medium text-slate-600">{book.sellerName}</span>
                  <span className="mx-1 text-slate-300">•</span>
                  <span className="truncate max-w-[90px] text-slate-500">{book.sellerLocation}</span>
                </div>
              </div>

              {/* Purchase Details bottom actions bar */}
              <div className="mt-3.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline space-x-1 font-sans">
                    <span className="text-xs text-slate-400 mr-0.5">Price:</span>
                    <span className="text-sm font-black text-rose-600">৳{book.price}</span>
                    {hasDiscount && (
                      <span className="text-[10px] line-through text-slate-400">৳{book.originalPrice}</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); onBuy(book); }}
                  className="bg-blue-700 hover:bg-blue-650 text-white text-[10px] px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer active:scale-95 flex items-center space-x-1"
                >
                  <ShoppingBag className="h-3 w-3" />
                  <span className="font-sans tracking-wide">BUY NOW</span>
                </button>
              </div>
            </div>
          );
        })}

        {/* View all card end slide placeholder */}
        <div className="w-[180px] shrink-0 snap-start rounded-2xl bg-slate-200/30 border border-slate-200/55 p-4 flex flex-col justify-center items-center text-center space-y-3 cursor-pointer hover:bg-slate-200/60 transition-colors"
             onClick={() => {
               const el = document.getElementById('search-filter-condition');
               if (el) el.scrollIntoView({ behavior: 'smooth' });
             }}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-600 shadow-xs border border-slate-100">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 font-sans">View All Books</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">মোট {activeBooks.length}টি বই আছে</p>
          </div>
          <span className="inline-flex items-center space-x-1 text-[11px] text-blue-600 font-bold font-sans">
            <span>Explore</span>
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
