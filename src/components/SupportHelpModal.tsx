/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Send, HelpCircle, Phone, ArrowRight, User } from 'lucide-react';
import { SupportMessage } from '../types';
import { saveSupportMessage } from '../lib/db';

interface SupportHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerPhone?: string;
  userNameFromSession?: string;
}

export default function SupportHelpModal({ isOpen, onClose, sellerPhone, userNameFromSession }: SupportHelpModalProps) {
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState<SupportMessage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load previous support tickets registered locally
  useEffect(() => {
    const stored = localStorage.getItem('boimela_support');
    if (stored) {
      setTickets(JSON.parse(stored));
    }
    if (userNameFromSession) {
      setUserName(userNameFromSession);
    }
  }, [isOpen, userNameFromSession]);

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userPhone.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      const newTicket = await saveSupportMessage(userName, userPhone, message);
      
      // Update local listing list state
      const updatedTickets = [newTicket, ...tickets];
      setTickets(updatedTickets);
      localStorage.setItem('boimela_support', JSON.stringify(updatedTickets));

      // Reset
      setMessage('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
        />

        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-200">
          
          {/* Solid blue clean minimalism header branding */}
          <div className="bg-blue-700 px-6 py-4 flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5 text-white" />
              <h2 className="text-lg font-bold">সহায়তা কেন্দ্র (Help Center)</h2>
            </div>
            <button 
              onClick={onClose}
              className="rounded-full p-1 text-blue-100 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Quick Helper Tips */}
            <div className="rounded-2xl bg-blue-50 p-4 shrink-0 text-xs text-blue-800 space-y-1.5 leading-relaxed border border-blue-100/30">
              <span className="font-extrabold text-[#1d4ed8] block">💡 কীভাবে বই কেনা-বেচা করবেন?</span>
              <p>১. নতুন বই বিক্রি করতে উপরের <b>"নতুন বই বিজ্ঞাপন দিন"</b> এ ক্লিক করুন।</p>
              <p>২. আপনার আপলোড করা বই সাথে সাথে অন্যান্য বিক্রেতা দেখতে পাবে।</p>
              <p>৩. কেউ কিনতে চাইলে আপনার দেওয়া মোবাইল নম্বরে তারা সরাসরি যোগাযোগ করবে।</p>
            </div>

            {/* Support Message form */}
            <form onSubmit={handleSubmitInquiry} className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
                সরাসরি মেসেজ পাঠান / প্রশ্ন করুন
              </h3>

              {success && (
                <div className="rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-800 border border-emerald-100">
                  ✓ আপনার মেসেজটি সফলভাবে জমা দেওয়া হয়েছে! আমাদের টিম শীঘ্রই যোগাযোগ করবে।
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">আপনার নাম</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="যেমন: আরিয়ান"
                      className="w-full rounded-xl border border-slate-200 pl-8 pr-3 py-2 text-xs font-medium focus:border-blue-500 bg-slate-50"
                    />
                    <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">মোবাইল নম্বর</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      placeholder="যেমন: ০১৭********"
                      className="w-full rounded-xl border border-slate-200 pl-8 pr-3 py-2 text-xs font-medium focus:border-blue-500 bg-slate-50"
                    />
                    <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">মেসেজ / মতামত লিখুন</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="একাডেমিক বইয়ের দাম কীভাবে নির্ধারণ করবো? বিস্তারিত এখানে লিখুন..."
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:border-blue-500 bg-slate-50 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-1.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white py-2.5 text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
              >
                <span>মেসেজ জমা দিন</span>
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>

            {/* Support Message history list */}
            {tickets.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-slate-100 max-h-[160px] overflow-y-auto">
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                  আপনার পূর্ববর্তী ইনকোয়ারি ({tickets.length})
                </h4>
                <div className="space-y-2">
                  {tickets.map((t) => (
                    <div key={t.id} className="rounded-xl bg-slate-50 p-3 text-xs border border-slate-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-700">{t.userName}</span>
                        <span className="rounded-full bg-orange-100 text-orange-800 px-2 py-0.5 text-[10px] font-bold">
                          পেন্ডিং
                        </span>
                      </div>
                      <p className="text-slate-500 line-clamp-1">{t.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
