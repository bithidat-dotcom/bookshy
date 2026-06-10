/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, User, Phone, MapPin, Tag, Calendar, ShoppingBag, ShoppingCart, HelpCircle, CheckCircle } from 'lucide-react';
import { Book } from '../types';
import { getConditionBadge } from '../lib/calc';

interface BookDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
  onBuy: (book: Book) => void;
}

export default function BookDetailsModal({ isOpen, onClose, book, onBuy }: BookDetailsModalProps) {
  const [activeImage, setActiveImage] = useState<string>('');
  const [cartSuccess, setCartSuccess] = useState<boolean>(false);

  // Set the default primary preview cover image when book modal loads
  useEffect(() => {
    if (book) {
      setActiveImage(book.imageUri);
      setCartSuccess(false);
    }
  }, [book, isOpen]);

  // Amalgamate primary and auxiliary gallery image lists
  const allImages = React.useMemo(() => {
    if (!book) return [];
    const images: string[] = [book.imageUri];
    if (book.additionalImages && Array.isArray(book.additionalImages)) {
      book.additionalImages.forEach(img => {
        if (img && !images.includes(img)) {
          images.push(img);
        }
      });
    }
    return images;
  }, [book]);

  if (!isOpen || !book) return null;

  const conditionBadge = getConditionBadge(book.condition);

  const handleAddToCart = () => {
    setCartSuccess(true);
    setTimeout(() => {
      setCartSuccess(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        
        {/* Backdrop overlay effect */}
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
        />

        {/* Modal Sheet body */}
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-4xl border border-slate-200">
          
          {/* Header section with closing button */}
          <div className="absolute right-4 top-4 z-10">
            <button 
              onClick={onClose}
              className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-all cursor-pointer shadow-xs"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Image Viewing Stage with switching thumbnails */}
              <div className="space-y-4">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center p-2 shadow-inner">
                  <img
                    src={activeImage || book.imageUri}
                    alt={book.title}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain rounded-lg transition-all duration-300 transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600';
                    }}
                  />
                  
                  {/* Sold badge visual override */}
                  {book.isSold && (
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center">
                      <span className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-black text-white tracking-widest uppercase">
                        SOLDOUT (বিক্রি শেষ)
                      </span>
                    </div>
                  )}

                  {/* Quantity Count indicator overlay */}
                  <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                    ছবি: {allImages.indexOf(activeImage) + 1} / {allImages.length}
                  </div>
                </div>

                {/* Multiple thumbnails collection (carousel selection layout) */}
                {allImages.length > 1 && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">বইয়ের অন্যান্য ছবি সমূহ (গ্যালারি স্ক্রল):</p>
                    <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                      {allImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImage(img)}
                          className={`relative h-14 w-18 shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                            activeImage === img 
                              ? 'border-blue-600 ring-2 ring-blue-100 scale-102 shadow-sm' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <img src={img} alt={`Preview ${idx}`} className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Information, Seller details and CTA buttons */}
              <div className="flex flex-col justify-between space-y-6">
                
                <div>
                  {/* Category hierarchy */}
                  <div className="flex flex-wrap gap-2 items-center mb-3">
                    <span className="rounded-full bg-amber-400 text-slate-950 px-3 py-1 text-[10px] font-black uppercase tracking-wider border border-amber-300">
                      {book.bookType && book.bookType.toUpperCase()}
                    </span>
                    {book.classLevel && book.classLevel !== 'N/A' && (
                      <span className="rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-[10px] font-bold">
                        শ্রেণী: {book.classLevel}
                      </span>
                    )}
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${conditionBadge.color} border`}>
                      অবস্থা: {conditionBadge.label}
                    </span>
                  </div>

                  {/* Book Title */}
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                    {book.title}
                  </h1>

                  {/* Author / Publisher Name */}
                  <p className="text-sm mt-1 text-slate-500 font-medium">
                    লেখক / প্রকাশনী: <span className="text-slate-800 font-extrabold">{book.author}</span>
                  </p>

                  {/* Pricing Sheet */}
                  <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">বইয়ের নির্ধারিত বিক্রয়মূল্য</span>
                      <div className="flex items-baseline space-x-2.5">
                        <span className="text-3xl font-black text-amber-700">৳{book.price}</span>
                        {book.originalPrice && book.originalPrice > book.price && (
                          <span className="text-xs line-through text-slate-400 font-mono">৳{book.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    {book.discount > 0 && (
                      <div className="bg-rose-50 border border-rose-100 text-rose-600 px-2.5 py-1.5 rounded-lg text-center shadow-xs">
                        <span className="text-[9px] uppercase tracking-wider font-extrabold block">সাশ্রয়ী ছাড়</span>
                        <span className="text-sm font-black block leading-none mt-0.5">-{book.discount}% OFF</span>
                      </div>
                    )}
                  </div>

                  {/* Description Box */}
                  <div className="mt-5 space-y-1.5">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">বিজ্ঞাপন বিবরণ বা মন্তব্য:</h3>
                    <div className="bg-slate-50/50 rounded-xl p-3.5 border border-slate-150/60 max-h-36 overflow-y-auto text-xs leading-relaxed text-slate-700 font-medium whitespace-pre-line">
                      {book.description || 'বইটি সম্পর্কে বিক্রেতা বাড়তি কোনো মন্তব্য প্রদান করেননি। আপনি সরাসরি নাম্বারে যোগাযোগ করতে পারেন।'}
                    </div>
                  </div>
                </div>

                {/* Seller & Contact Specs section */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <div className="bg-amber-400/10 rounded-xl p-4 border border-amber-400/25 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-550 font-black uppercase tracking-wider block">reseller/Seller Profile</span>
                      <span className="inline-flex items-center text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">Verified Member</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Seller Name */}
                      <div className="flex items-center space-x-2">
                        <div className="p-1 rounded bg-amber-400/20 text-slate-900">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400 font-bold block leading-none">বিজ্ঞাপনদাতা</p>
                          <span className="font-extrabold text-slate-800">{book.sellerName || 'নাম্বার গোপন রাখা হয়েছে'}</span>
                        </div>
                      </div>

                      {/* Location Area */}
                      <div className="flex items-center space-x-2">
                        <div className="p-1 rounded bg-slate-100 text-rose-500">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400 font-bold block leading-none">স্টোরেজ জোন / এলাকা</p>
                          <span className="font-extrabold text-slate-800">{book.sellerLocation || 'ঢাকা'}</span>
                        </div>
                      </div>

                      {/* Contact Phone (Clickable / Instant dials) */}
                      {book.sellerPhone && (
                        <div className="flex items-center space-x-2 sm:col-span-2 bg-white rounded-lg p-2 border border-amber-400/30">
                          <div className="p-1.5 rounded bg-amber-400/20 text-slate-900">
                            <Phone className="h-4 w-4" />
                          </div>
                          <div className="flex-grow">
                            <p className="text-[9px] text-slate-400 font-bold leading-none">সরাসরি কল করতে ট্যাপ করুন</p>
                            <a 
                              href={`tel:${book.sellerPhone}`} 
                              className="font-black text-amber-700 text-sm hover:underline tracking-wide block mt-0.5"
                            >
                              {book.sellerPhone}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Success Alerts for adding to cart */}
                  {cartSuccess && (
                     <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-2.5 text-xs text-emerald-800 font-semibold flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>বইটি সফলভাবে আপনার কার্টে যোগ করা হয়েছে!</span>
                     </div>
                  )}

                  {/* Operational Interactive Action buttons */}
                  <div className="flex items-center gap-3 pt-1">
                    
                    {/* Add to Cart button */}
                    <button
                      onClick={handleAddToCart}
                      disabled={book.isSold}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-3 rounded-xl border border-slate-200 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
                    >
                      <ShoppingCart className="h-4 w-4 text-slate-650" />
                      <span>সব ক্যাটাগরির কার্ট (Cart)</span>
                    </button>

                    {/* Main transaction purchase buy button */}
                    {!book.isSold ? (
                      <button
                        onClick={() => {
                          onBuy(book);
                          onClose();
                        }}
                        className="flex-1 bg-amber-400 hover:bg-amber-505 hover:bg-amber-500 text-slate-950 font-black text-xs px-5 py-3 rounded-xl shadow-md flex items-center justify-center space-x-2 cursor-pointer transition-all active:scale-95 border border-amber-400"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        <span>সরাসরি কিনুন (Buy Now)</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex-1 bg-slate-200 text-slate-400 font-bold text-xs px-5 py-3 rounded-xl flex items-center justify-center cursor-not-allowed"
                      >
                        SOLDOUT
                      </button>
                    )}

                  </div>

                </div>

              </div>
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
