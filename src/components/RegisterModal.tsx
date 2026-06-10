/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, UserCheck, ShieldCheck, Flag, Smartphone } from 'lucide-react';
import { UserSession } from '../types';
import { LOCATIONS } from '../lib/calc';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: UserSession | null;
  onRegister: (session: UserSession) => void;
}

export default function RegisterModal({ isOpen, onClose, session, onRegister }: RegisterModalProps) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('ঢাকা (নীলক্ষেত)');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (session) {
      setDisplayName(session.displayName);
      setEmail(session.email);
      setPhone(session.phone || '');
      setLocation(session.location || 'ঢাকা (নীলক্ষেত)');
    } else {
      setDisplayName('');
      setEmail('');
      setPhone('');
      setLocation('ঢাকা (নীলক্ষেত)');
    }
  }, [session, isOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !phone.trim()) return;

    const emailValue = email.trim() || `${displayName.toLowerCase().replace(/\s+/g, '')}@boimela.com`;

    onRegister({
      uid: session?.uid || 'user_' + Math.random().toString(36).substr(2, 9),
      displayName,
      email: emailValue,
      phone,
      location
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
        />

        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md border border-slate-200">
          
          <div className="bg-blue-700 px-6 py-4 flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-white" />
              <h2 className="text-lg font-bold">বিক্রেতা প্রোফাইল রেজিস্ট্রেশন</h2>
            </div>
            <button 
              onClick={onClose}
              className="rounded-full p-1 text-blue-100 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="p-6 space-y-4">
            {success && (
              <div className="rounded-xl bg-emerald-50 p-3 border border-emerald-100 text-xs text-emerald-800 font-semibold text-center">
                ✓ প্রোফাইলটি সফলভাবে সেভ করা হয়েছে!
              </div>
            )}

            <div className="rounded-xl bg-slate-50 p-3.5 text-xs text-slate-600 border border-slate-100 leading-relaxed shrink-0">
              <span className="font-bold text-slate-800 flex items-center space-x-1 mb-1">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                <span>সুবিধা উপভোগ করুন</span>
              </span>
              একবার রেজিস্ট্রেশন করে রাখলে বই আপলোড করার সময় আপনার নাম ও যোগাযোগের ফোন নম্বর স্বয়ংক্রিয়ভাবে ফর্মের মধ্যে বসে যাবে।
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">আপনার পূর্ণ নাম (Name)</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="যেমন: আরিয়ান ইসলাম"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold focus:ring-2 focus:ring-blue-400/30 focus:border-blue-500 bg-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">যোগাযোগের মোবাইল নাম্বার</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="যেমন: ০১৭৮৯৪৫৬১২৩"
                    className="w-full rounded-xl border border-slate-200 pl-9 pr-3.5 py-2 text-xs font-semibold focus:ring-2 focus:ring-blue-400/30 focus:border-blue-500 bg-white outline-none"
                  />
                  <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">এलाকা / জোন (Location)</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-700 bg-white focus:ring-2 focus:ring-blue-400/30 focus:border-blue-500 outline-none cursor-pointer"
                >
                  {LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">ইমেইল এড্রেস (ঐচ্ছিক)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="যেমন: user@example.com"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold focus:ring-2 focus:ring-blue-400/30 focus:border-blue-500 bg-white outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 font-semibold"
              >
                বন্ধ করুন
              </button>
              <button
                type="submit"
                className="rounded-xl bg-blue-700 hover:bg-blue-600 text-white px-5 py-2 text-xs font-bold shadow-sm transition-colors cursor-pointer"
              >
                সংরক্ষণ করুন
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
