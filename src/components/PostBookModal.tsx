/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Upload, Info, AlertCircle, Sparkles, BookOpen, Calendar, MapPin, Phone, User, DollarSign } from 'lucide-react';
import { Book, UserSession } from '../types';
import { BOOK_TYPES, CLASS_LEVELS, CONDITIONS, LOCATIONS, calculateDiscountPrice } from '../lib/calc';

interface PostBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookData: Omit<Book, 'id' | 'createdAt' | 'isSold'>) => void;
  session: UserSession | null;
}

export default function PostBookModal({ isOpen, onClose, onSubmit, session }: PostBookModalProps) {
  // Form Inputs
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [bookType, setBookType] = useState('academic');
  const [classLevel, setClassLevel] = useState('N/A');
  const [originalPrice, setOriginalPrice] = useState(300);
  const [discount, setDiscount] = useState(40);
  const [condition, setCondition] = useState<'new' | 'excellent' | 'good' | 'fair'>('excellent');
  
  // Date and Images
  const [publishDate, setPublishDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [imageUri, setImageUri] = useState('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  
  // Seller Contact
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerLocation, setSellerLocation] = useState('ঢাকা (নীলক্ষেত)');
  const [description, setDescription] = useState('');
  
  // States
  const [error, setError] = useState('');

  // Auto-fill form fields if the user has an active session profile
  useEffect(() => {
    if (session) {
      setSellerName(session.displayName || '');
      if (session.phone) setSellerPhone(session.phone);
      if (session.location) setSellerLocation(session.location);
    }
  }, [session, isOpen]);

  // Handle bookType changing to update standard genre labels as well
  useEffect(() => {
    const matching = BOOK_TYPES.find(b => b.value === bookType);
    if (matching) {
      setGenre(matching.label);
    }
    // Auto-update Class Level based on book types
    if (bookType !== 'academic') {
      setClassLevel('N/A');
    } else if (classLevel === 'N/A') {
      setClassLevel('Class 9-10');
    }
  }, [bookType]);

  // Compute live fair value listing price
  const finalPrice = calculateDiscountPrice(originalPrice, discount);

  // Convert Device Gallery file to base64 data string for the primary image
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setError("दुঃখিত, ফাইলের সাইজ অনেক বেশি বড় (সর্বোচ্চ ৮ মেগাবাইট অনুমোদিত)।");
        return;
      }
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUri(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Convert auxiliary images
  const handleAuxImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setError("অতিরিক্ত ফটোর সাইজটি সর্বোচ্চ ৮ মেগাবাইট হতে পারবে।");
        return;
      }
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const updated = [...additionalImages];
          updated[index] = reader.result;
          setAdditionalImages(updated);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAuxImage = (index: number) => {
    const updated = [...additionalImages];
    updated.splice(index, 1);
    setAdditionalImages(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Field Valuations Setup
    if (!title.trim() || !author.trim() || !sellerName.trim() || !sellerPhone.trim()) {
      setError("অন অনুগ্রহ করে লাল তারকা (*) চিহ্নিত সকল প্রয়োজনীয় তথ্য পূরণ করুন।");
      return;
    }

    if (!imageUri) {
      setError("বইটির অন্তত একটি মূল কভার ফটো আপলোড করুন (এটি লিংকে রূপান্তরিত হবে)।");
      return;
    }

    if (originalPrice <= 0 || finalPrice < 0) {
      setError("বইয়ের দাম সঠিক সংখ্যা হতে হবে।");
      return;
    }

    // Capture publish date within the description or save it in additional config
    const enhancedDescription = description.trim() 
      ? `${description.trim()}\n[প্রকাশের তারিখ: ${publishDate}]`
      : `[প্রকাশের তারিখ: ${publishDate}]`;

    onSubmit({
      title,
      author,
      genre: genre || "অন্যান্য",
      bookType,
      classLevel,
      price: finalPrice,
      originalPrice,
      discount,
      condition,
      imageUri,
      additionalImages: additionalImages.filter(Boolean), // remove gaps
      sellerName,
      sellerPhone,
      sellerLocation,
      description: enhancedDescription
    });

    // Reset Inputs
    setTitle('');
    setAuthor('');
    setDescription('');
    setImageUri('');
    setAdditionalImages([]);
    setPublishDate(new Date().toISOString().substring(0, 10));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Dark overlay backdrop */}
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
        />

        {/* Modal Main container */}
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl border border-slate-200">
          
          {/* Header section in deep blue styling */}
          <div className="bg-blue-700 px-6 py-4 flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-white" />
              <h2 className="text-lg font-bold font-sans">বই বিক্রির বিবরণী ও বিজ্ঞাপন ফরম</h2>
            </div>
            <button 
              onClick={onClose}
              className="rounded-full p-1 text-blue-100 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {error && (
              <div className="rounded-xl bg-rose-50 p-3.5 border border-rose-100 flex items-start space-x-2.5 text-xs text-rose-700 font-medium animate-shake">
                <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Core details inputs */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  বইয়ের নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="যেমন: উচ্চতর গণিত দ্বিতীয় পত্র"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none bg-slate-50 transition-all text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  লেখক / প্রকাশনী <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="যেমন: আহসান হাবীব"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none bg-slate-50 transition-all text-slate-800"
                />
              </div>
            </div>

            {/* Categorization & Publish Date Selection */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  বইয়ের ধরণ (Type)
                </label>
                <select
                  value={bookType}
                  onChange={(e) => setBookType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none cursor-pointer"
                >
                  {BOOK_TYPES.filter(b => b.value !== 'all').map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  শ্রেণী / শিক্ষাগত লেভেল
                </label>
                <select
                  value={classLevel}
                  disabled={bookType !== 'academic'}
                  onChange={(e) => setClassLevel(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none cursor-pointer"
                >
                  {CLASS_LEVELS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-blue-600" />
                  <span>প্রকাশের তারিখ <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="date"
                  required
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-slate-50 text-slate-800"
                />
              </div>
            </div>

            {/* Pricing Details Panel: Demonstrates dynamic listings price calculator */}
            <div className="rounded-2xl bg-amber-500/5 p-4 border border-amber-500/10 space-y-3">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wide flex items-center space-x-1.5">
                <Info className="h-3.5 w-3.5" />
                <span>বইয়ের মূল্য ও ছাড় মূল্যায়নকারী ক্যালকুলেটর</span>
              </h4>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    নতুন বইয়ের আসল দাম (৳)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold focus:border-blue-500 bg-white text-slate-850"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1 flex justify-between">
                    <span>ছাড় দিন (%):</span>
                    <span className="font-extrabold text-blue-700">{discount}% ছাড়</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full py-2 h-2 bg-slate-200 rounded-lg cursor-pointer accent-blue-600 focus:outline-none"
                  />
                </div>

                {/* Final Listed price shown on active calculation */}
                <div className="rounded-xl bg-white p-2 border border-slate-100 flex flex-col justify-center items-center">
                  <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-400">
                    বিক্রয়মূল্য (Resale Price)
                  </span>
                  <span className="text-base font-black text-blue-600">
                    ৳{finalPrice} Taka
                  </span>
                  <span className="text-[9px] text-emerald-600 font-bold">
                    সাশ্রয় হচ্ছে ৳{originalPrice - finalPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Book state and Primary Cover Photo Upload */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  বইয়ের নতুনত্ব / কন্ডিশন
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
                >
                  {CONDITIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Primary file selector converting raw image to links instantly */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                  <ImageIcon className="h-3.5 w-3.5 text-blue-600" />
                  <span>প্রধান কভার ফটো আপলোড <span className="text-rose-500">*</span></span>
                </label>
                {!imageUri ? (
                  <div className="relative flex items-center justify-center border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 p-3 hover:bg-slate-100 transition-colors duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="text-center space-y-1">
                      <Upload className="mx-auto h-4.5 w-4.5 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-600 block">গ্যালারি থেকে সিলেক্ট করুন</span>
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-16 flex items-center justify-between px-3">
                    <div className="flex items-center space-x-2">
                      <img 
                        src={imageUri} 
                        alt="Primary Preview" 
                        className="h-10 w-10 rounded-lg object-cover border border-white"
                      />
                      <div>
                        <span className="text-[10px] font-bold text-emerald-600 block">✓ মূল ছবি লিংকড</span>
                        <span className="text-[9px] text-slate-400 block truncate max-w-[120px]">converted to base64</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImageUri('')}
                      className="rounded-full bg-slate-200 p-1 text-slate-500 hover:bg-rose-100 hover:text-rose-600 cursor-pointer transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Multiple Supplementary images slots */}
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <label className="text-xs font-bold text-slate-700 block">
                অতিরিক্ত ছবি সমূহ (ঐচ্ছিক - সর্বোচ্চ ৩টি দিতে পারবেন)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map((idx) => {
                  const currentImg = additionalImages[idx];
                  return (
                    <div key={idx} className="relative h-16 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden hover:bg-slate-100">
                      {currentImg ? (
                        <>
                          <img src={currentImg} alt={`Aux ${idx}`} className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeAuxImage(idx)}
                            className="absolute top-1 right-1 bg-slate-900/80 hover:bg-rose-600 rounded-full p-0.5 text-white cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </>
                      ) : (
                        <div className="relative w-full h-full flex items-center justify-center cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleAuxImageChange(idx, e)}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          />
                          <div className="text-center">
                            <Upload className="mx-auto h-3.5 w-3.5 text-slate-300" />
                            <span className="text-[8px] font-bold text-slate-400 block mt-0.5">ছবি {idx + 1}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Seller contact details and description */}
            <div className="border-t border-slate-100 pt-4 space-y-4">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                বিক্রেতার নাম, কন্টাক্ট নাম্বার ও লোকেশন
              </h4>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    আপনার নাম (Seller Name) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    placeholder="যেমন: সায়মন চৌধুরী"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:border-blue-500 focus:outline-none bg-slate-50 text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    কন্টাক্ট নাম্বার (Phone) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    placeholder="যেমন: +৮৮০১৭১৬৮০৭৪৬৫"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:border-blue-500 focus:outline-none bg-slate-50 text-slate-800"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    লোকেশন / জোন (Locations)
                  </label>
                  <select
                    value={sellerLocation}
                    onChange={(e) => setSellerLocation(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 bg-slate-50 focus:border-blue-500"
                  >
                    {LOCATIONS.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  বই সম্পর্কে মন্তব্য বা বাড়তি গেটওয়ে তথ্য (ঐচ্ছিক)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="যেমন: বইয়ের মাঝখানের পাতায় লাল রঙের ছোট্ট কলমের দাগ আছে..."
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:border-blue-500 focus:outline-none bg-slate-50 transition-all resize-none text-slate-850"
                />
              </div>
            </div>

            {/* Submission triggers */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                type="submit"
                className="flex items-center space-x-1.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white px-5 py-2.5 text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <Sparkles className="h-4 w-4" />
                <span>বিজ্ঞাপন তৈরি করুন</span>
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
