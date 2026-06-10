/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MapPin, Phone, Tag, Calendar, ShoppingBag, Eye, User, Share2 } from 'lucide-react';
import { Book } from '../types';
import { getConditionBadge, calculateDiscountPrice } from '../lib/calc';

interface BookCardProps {
  book: Book;
  onBuy: (book: Book) => void;
  key?: string;
}

export default function BookCard({ book, onBuy }: BookCardProps) {
  const badgeInfo = getConditionBadge(book.condition);
  const finalPrice = calculateDiscountPrice(book.originalPrice || book.price, book.discount);
  
  // Format dates elegantly for bengali representation
  const dateStr = React.useMemo(() => {
    try {
      const date = new Date(book.createdAt);
      return date.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return 'সম্প্রতি';
    }
  }, [book.createdAt]);

  return (
    <div 
      id={`book-card-${book.id}`}
      onClick={() => onBuy(book)}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer h-full"
    >
      
      {/* Container holding book cover visual & badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
        <img
          src={book.imageUri}
          alt={book.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
          onError={(e) => {
            // Backup placeholder image in case user upload fails
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400';
          }}
        />

        {/* Dynamic Condition Status Tag */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
          <span className={`inline-block border rounded-md sm:rounded-lg px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] font-bold shadow-xs ${badgeInfo.color}`}>
            {badgeInfo.label}
          </span>
        </div>

        {/* Categories / Genre badge */}
        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3">
          <span className="inline-block rounded bg-slate-900/80 px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] font-bold tracking-wide text-white">
            {book.bookType === 'academic' ? `${book.classLevel}` : book.genre}
          </span>
        </div>

        {/* Big visual overlay if the item is sold */}
        {book.isSold && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-xs text-center p-2 sm:p-4">
            <span className="rounded-md sm:rounded-lg bg-rose-600 px-2 sm:px-3.5 py-0.5 sm:py-1 text-[9px] sm:text-xs font-bold uppercase tracking-wider text-white shadow-sm">
              বিক্রি শেষ (SOLD)
            </span>
            {book.buyerName && (
              <p className="mt-1 text-[9px] sm:text-xs text-slate-300 font-medium truncate max-w-full px-1">
                ক্রেতা: <span className="text-white">{book.buyerName}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Main core Details section */}
      <div className="flex flex-1 flex-col p-2.5 sm:p-4">
        <div className="flex-1">
          
          {/* Reseller Name header info */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 text-[9px] sm:text-[11px] text-slate-400 mb-1.5 sm:mb-2 truncate">
            <User className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-blue-600 shrink-0" />
            <span className="font-semibold text-slate-600 truncate max-w-[45px] sm:max-w-[80px]">{book.sellerName}</span>
            <span>•</span>
            <span className="truncate">{dateStr}</span>
          </div>

          {/* Book Title */}
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors duration-150">
            {book.title}
          </h3>

          {/* Author Name */}
          <p className="mt-0.5 text-[10px] sm:text-xs text-slate-500 truncate">
            লেখক: <span className="font-medium text-slate-705">{book.author}</span>
          </p>

          {/* Physical Location Tag */}
          <div className="mt-1 sm:mt-2 flex items-center text-[10px] sm:text-[11px] text-slate-400">
            <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-slate-400 mr-0.5 sm:mr-1 shrink-0" />
            <span className="truncate">{book.sellerLocation}</span>
          </div>

          {/* Description line-clamp if exists - hidden on mobile to align card height side-by-side */}
          {book.description && (
            <p className="hidden sm:block mt-2.5 text-[11px] text-slate-500 leading-relaxed line-clamp-2 bg-slate-50 p-2 rounded-lg">
              {book.description}
            </p>
          )}

        </div>

        {/* Pricing Panel: Demonstrating Fair Value assessments */}
        <div className="mt-2.5 sm:mt-3.5 pt-2 sm:pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2">
          <div>
            <div className="flex flex-col">
              {book.originalPrice && book.originalPrice > book.price ? (
                <span className="text-[9px] sm:text-[11px] line-through text-slate-400 leading-none">
                  ৳{book.originalPrice}
                </span>
              ) : null}
              <div className="flex items-center space-x-1 sm:space-x-1.5">
                <span className="text-sm sm:text-base font-black text-blue-600">
                  ৳{book.price}
                </span>
                {book.discount > 0 && (
                  <span className="rounded bg-sky-50 px-0.5 sm:px-1 py-0.5 text-[8px] sm:text-[9px] font-bold text-blue-600 border border-blue-100 leading-none">
                    -{book.discount}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Buying interactive button: styled with minimal high-contrast dark style */}
          {!book.isSold ? (
            <button
              onClick={(e) => { e.stopPropagation(); onBuy(book); }}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-850 text-white text-[10px] sm:text-[11px] px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-md sm:rounded-lg font-bold uppercase tracking-wider transition-colors cursor-pointer active:scale-95 text-center shrink-0"
            >
              Buy
            </button>
          ) : (
            <span className="w-full sm:w-auto text-center rounded bg-slate-100 px-2 py-1.5 text-[9px] sm:text-[10px] font-semibold text-slate-400 shrink-0">
              SOLD
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
