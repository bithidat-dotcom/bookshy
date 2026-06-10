/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { X, Shield, Check } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        
        {/* Backdrop overlay */}
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
        />

        {/* Modal Main Panel */}
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-200">
          
          {/* Header */}
          <div className="bg-amber-500 px-6 py-4 flex items-center justify-between text-slate-950">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-slate-950" />
              <h2 className="text-base font-extrabold font-sans">শর্তাবলী এবং গোপনীয়তা নীতি (Terms & Privacy Policy)</h2>
            </div>
            <button 
              onClick={onClose}
              className="rounded-full p-1 text-slate-900 hover:bg-slate-900/10 cursor-pointer transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Guidelines and Details Content */}
          <div className="p-6 space-y-4 text-xs text-slate-700 leading-relaxed max-h-[60vh] overflow-y-auto">
            
            <section className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">১. ব্যবহারের সাধারণ নিয়োমাবলী</h3>
              <p>
                Booksy-bd একটি উন্মুক্ত পুরাতন বই এক্সচেঞ্জ ও কেনা-বেচা প্ল্যাটফর্ম। এখানে শিক্ষার্থীরা নিজেদের ব্যবহূত বইয়ের বিজ্ঞাপন প্রদান করতে পারে। কোনো ধরনের বেআইনি বা নকল বইয়ের তথ্য প্রদান সম্পূর্ণ নিষিদ্ধ।
              </p>
            </section>

            <section className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">২. তথ্যের সত্যতা</h3>
              <p>
                বিজ্ঞাপনদাতা যে বইয়ের ছবি ও তথ্য আপলোড করবেন, ক্রয়-বিক্রয়ের পূর্বে গ্রাহকদের তা বইয়ের সাথে মিলিয়ে নেওয়ার অনুরোধ করা যাচ্ছে। তথ্যের সকল দায়-দায়িত্ব বিজ্ঞাপনদাতার নিজের।
              </p>
            </section>

            <section className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">৩. ব্যক্তিগত তথ্যের সুরক্ষা (Privacy Policy)</h3>
              <p>
                আপনার কন্টাক্ট ইনফরমেশন এবং নাম শুধুমাত্র বই বিক্রির উদ্দেশ্যে অন্য সদস্যদের কাছে দৃশ্যমান হবে। আমরা কোনো বিজ্ঞাপন বা তৃতীয় পক্ষের সাথে এই মূল্যবান তথ্য শেয়ার করি না।
              </p>
            </section>

            <section className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">৪. সহায়তায় পৃষ্ঠপোষকতা</h3>
              <p>
                এই সেবাটি Ha-mim Residential School and College এর শিক্ষার্থীদের জন্য এবং সম্মানিত শিক্ষকদের সহযোগিতায় ডেভেলপ করা হয়েছে।
              </p>
            </section>

          </div>

          {/* Footer Trigger */}
          <div className="flex items-center justify-end p-4 border-t border-slate-100 bg-slate-50">
            <button
              onClick={onClose}
              className="flex items-center space-x-1 rounded-xl bg-slate-950 hover:bg-slate-800 text-white px-5 py-2 text-xs font-bold transition-all cursor-pointer"
            >
              <Check className="h-4 w-4" />
              <span>আমি একমত (I Agree)</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
