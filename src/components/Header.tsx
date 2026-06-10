/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, HelpCircle, UserPlus, Sparkles, MapPin, Phone, Mail, Search } from 'lucide-react';
import { UserSession } from '../types';

interface HeaderProps {
  session: UserSession | null;
  onOpenHelp: () => void;
  onOpenRegister: () => void;
  onOpenPostBook: () => void;
  isFirebaseActive: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Header({ 
  session, 
  onOpenHelp, 
  onOpenRegister, 
  onOpenPostBook,
  isFirebaseActive,
  searchQuery,
  setSearchQuery
}: HeaderProps) {
  return (
    <div className="w-full flex flex-col">
      <header className="relative w-full bg-blue-700 shadow-md z-20">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            
            {/* Headline in Bangla & App Brand */}
            <div className="flex items-center space-x-3 sm:space-x-4 shrink-0 py-1">
              <div className="flex h-11 w-11 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-white shadow-lg border-2 border-amber-300 overflow-hidden shrink-0">
                <img 
                  src="https://i.pinimg.com/1200x/9a/2e/8f/9a2e8ffd8a5776c22991fe5e535a4c62.jpg" 
                  alt="Booksy-bd Logo" 
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-0.5 text-left">
                <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white hover:text-amber-300 transition-colors duration-200 font-sans uppercase leading-none">
                  Booksy-bd
                </h1>
                <span className="bg-amber-400 text-blue-950 text-[8px] sm:text-[10px] px-2 py-0.5 rounded-full border border-amber-300 font-black tracking-wider inline-block uppercase leading-none">
                  SECURE BOOK EXCHANGE
                </span>
                <span className="text-[8px] sm:text-[9px] text-blue-100 block font-medium leading-none">
                  মুদ্রিত শিক্ষার উন্মুক্ত জ্ঞানের প্রবেশদ্বার
                </span>
              </div>
            </div>

            {/* Middle Search Bar - Integrated specifically into the header */}
            <div id="header-search-bar-container" className="w-full lg:max-w-xs xl:max-w-md relative group">
              <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
                <Search className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="বই খুঁজুন (নাম, লেখক বা স্থান)... / Search here..."
                className="block w-full rounded-xl border border-slate-200 bg-white py-2 sm:py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 font-sans shadow-sm"
              />
            </div>

            {/* Action Buttons Interface with Glass Effects and Bengali Typography - Standardized 3 Buttons layout */}
            <div className="grid grid-cols-3 gap-1.5 w-full sm:flex sm:flex-wrap sm:w-auto sm:gap-2 sm:items-center sm:justify-end shrink-0">
              
              {/* Support Message/Help Button (Minimal glass element) */}
              <button
                onClick={onOpenHelp}
                className="group flex flex-col sm:flex-row items-center justify-center space-y-0.5 sm:space-y-0 sm:space-x-1.5 backdrop-blur-md bg-white/11 border border-white/20 text-white px-1 py-2 sm:px-4 sm:py-2 rounded-xl text-[9px] xs:text-[10px] sm:text-xs font-bold hover:bg-white/20 transition-all shadow-xs cursor-pointer text-center"
              >
                <HelpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-100 shrink-0" />
                <span className="leading-tight sm:leading-normal">সাপোর্ট ও মেসেজ</span>
              </button>

              {/* Register / Session Button (Minimal glass element) */}
              <button
                onClick={onOpenRegister}
                className="group flex flex-col sm:flex-row items-center justify-center space-y-0.5 sm:space-y-0 sm:space-x-1.5 backdrop-blur-md bg-white/11 border border-white/20 text-white px-1 py-2 sm:px-4 sm:py-2 rounded-xl text-[9px] xs:text-[10px] sm:text-xs font-bold hover:bg-white/20 transition-all shadow-xs cursor-pointer text-center"
              >
                <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-100 shrink-0" />
                <span className="leading-tight sm:leading-normal truncate max-w-full">
                  {session ? `${session.displayName}` : 'রেজিস্ট্রেশন'}
                </span>
              </button>

              {/* Post New Book Action Trigger Button */}
              <button
                onClick={onOpenPostBook}
                className="flex flex-col sm:flex-row items-center justify-center space-y-0.5 sm:space-y-0 sm:space-x-1.5 rounded-xl bg-white text-blue-700 px-1 py-2 sm:px-4 sm:py-2 text-[9px] xs:text-[10px] sm:text-xs font-black shadow-sm hover:bg-slate-50 hover:shadow-md transition-all active:scale-95 text-center"
              >
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-amber-500 animate-pulse" />
                <span className="leading-tight sm:leading-normal">নতুন বিজ্ঞাপন</span>
              </button>

            </div>

          </div>
        </div>
      </header>
    </div>
  );
}
