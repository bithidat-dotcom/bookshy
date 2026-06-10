/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Smartphone, User, Landmark, Tag, PhoneCall } from 'lucide-react';
import { Book, UserSession } from '../types';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
  session: UserSession | null;
  onConfirmPurchase: (bookId: string, buyerName: string, buyerPhone: string) => void;
}

export default function PurchaseModal({ 
  isOpen, 
  onClose, 
  book, 
  session, 
  onConfirmPurchase 
}: PurchaseModalProps) {
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session) {
      setBuyerName(session.displayName);
      if (session.phone) setBuyerPhone(session.phone);
    } else {
      setBuyerName('');
      setBuyerPhone('');
    }
    setSuccess(false);
    setError('');
  }, [book, session, isOpen]);

  if (!isOpen || !book) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerPhone.trim()) {
      setError("অনগ্রহ করে আপনার নাম এবং মোবাইল নম্বরটি সিলেক্ট করুন।");
      return;
    }

    onConfirmPurchase(book.id, buyerName, buyerPhone);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
        />

        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md border border-slate-200">
          
          <div className="bg-blue-700 px-6 py-4 flex items-center justify-between text-white">
            <h2 className="text-lg font-bold flex items-center space-x-2">
              <Landmark className="h-5 w-5 text-white" />
              <span>বই কেনার বিবরণ</span>
            </h2>
            <button 
              onClick={onClose}
              className="rounded-full p-1 text-blue-100 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleConfirm} className="p-6 space-y-4">
            
            {success ? (
              <div className="rounded-2xl bg-emerald-50 p-6 text-center border border-emerald-100 space-y-3 shrink-0">
                <CheckCircle className="mx-auto h-12 w-12 text-emerald-500 animate-bounce" />
                <h3 className="text-base font-extrabold text-emerald-900">অভিনন্দন! ডিলটি সফল হয়েছে</h3>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  বইটি আপনার জন্য বুক করা হয়েছে। বিক্রেতা <b>{book.sellerName}</b> এর সাথে ফোনে এই নম্বরে কথা বলুন:
                </p>
                <div className="rounded-xl bg-white p-3 border border-emerald-100 text-sm font-extrabold text-blue-800 inline-block">
                  {book.sellerPhone}
                </div>
              </div>
            ) : (
              <>
                {/* Book Mini summary */}
                <div className="flex items-center space-x-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 shrink-0">
                  <img 
                    src={book.imageUri} 
                    alt={book.title} 
                    className="h-16 w-12 object-cover rounded-xl shadow-xs"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400';
                    }}
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{book.title}</h3>
                    <p className="text-xs text-slate-500">লেখক: {book.author}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm font-extrabold text-rose-600">৳{book.price}</span>
                      <span className="text-[10px] text-slate-400 line-through">আসল দাম: ৳{book.originalPrice}</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl bg-rose-50 p-2.5 border border-rose-100 text-xs text-rose-700 font-bold">
                    {error}
                  </div>
                )}

                {/* Buyer contact inputs */}
                <div className="space-y-3.5 pt-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    আপনার ক্রেতা প্রোফাইল তথ্য প্রদান করুন
                  </h4>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">আপনার নাম</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="যেমন: সাবিহা রহমান"
                        className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs font-medium focus:border-blue-500 bg-slate-50"
                      />
                      <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">আপনার যোগাযোগের ফোন নম্বর</label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        placeholder="যেমন: ০১৮********"
                        className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs font-medium focus:border-blue-500 bg-slate-50"
                      />
                      <Smartphone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Seller Phone Details Disclosure */}
                <div className="rounded-2xl bg-amber-500/5 p-4 border border-amber-500/10 shrink-0 text-xs text-amber-800 leading-relaxed">
                  <span className="font-extrabold block mb-1 text-[#b45309] flex items-center space-x-1">
                    <PhoneCall className="h-4 w-4" />
                    <span>সরাসরি যোগাযোগের নীতি</span>
                  </span>
                  "কিনুন" বাটনে ক্লিক করলে বইটি বিক্রি চিহ্নিত হবে এবং তাৎক্ষণিকভাবে বিক্রেতার মোবাইল নম্বর আপনার সামনে প্রদর্শিত হবে যাতে আপনি সরাসরি কল দিয়ে বইটি সংগ্রহ করে নিতে পারেন।
                </div>

                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                  >
                    বন্ধ করুন
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 text-xs font-bold tracking-wide cursor-pointer shadow-sm active:scale-95"
                  >
                    কিনুন ও নম্বর দেখুন
                  </button>
                </div>
              </>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}
