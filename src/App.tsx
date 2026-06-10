/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Plus, 
  HelpCircle, 
  Sparkles, 
  Filter, 
  ShoppingBag, 
  Check, 
  Loader2,
  ChevronRight,
  Bookmark,
  ArrowRight,
  CheckCircle,
  Search,
  Users,
  UserCheck
} from 'lucide-react';
import { Book, UserSession } from './types';
import { fetchAllBooks, saveNewBook, updateBookDetails } from './lib/db';
import { isFirebaseConfigured } from './lib/firebase';

// Components
import Header from './components/Header';
import SearchFilters from './components/SearchFilters';
import BookCard from './components/BookCard';
import BookSlider from './components/BookSlider';
import PostBookModal from './components/PostBookModal';
import RegisterModal from './components/RegisterModal';
import PurchaseModal from './components/PurchaseModal';
import SupportHelpModal from './components/SupportHelpModal';
import BookDetailsModal from './components/BookDetailsModal';
import TermsModal from './components/TermsModal';
import BannerAndTargetSection from './components/BannerAndTargetSection';

export default function App() {
  // Books & Loading States
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // User Profile Session
  const [session, setSession] = useState<UserSession | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');

  // Modal Open/Close states
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [selectedBookForPurchase, setSelectedBookForPurchase] = useState<Book | null>(null);
  const [selectedBookForDetails, setSelectedBookForDetails] = useState<Book | null>(null);
  const [pendingBookToBuy, setPendingBookToBuy] = useState<Book | null>(null);

  // Load User Profile on startup
  useEffect(() => {
    const cached = localStorage.getItem('boimela_profile');
    if (cached) {
      setSession(JSON.parse(cached));
    }
  }, []);

  // Fetch listed books from our DB abstraction engine
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const list = await fetchAllBooks();
        setBooks(list);
      } catch (err) {
        console.error("Error fetching listings: ", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [refreshTrigger]);

  // Handler for saving customer registration profile session
  const handleRegisterProfile = (newSession: UserSession) => {
    setSession(newSession);
    localStorage.setItem('boimela_profile', JSON.stringify(newSession));
    
    // Automatically open purchase modal if they registered in order to buy a specific book
    if (pendingBookToBuy) {
      setSelectedBookForPurchase(pendingBookToBuy);
      setPendingBookToBuy(null);
    }
  };

  // Handler for purchase click - checks registration session before letting user buy a book
  const handleInitiateBuy = (book: Book) => {
    if (!session) {
      setPendingBookToBuy(book);
      setIsRegisterOpen(true);
    } else {
      setSelectedBookForPurchase(book);
    }
  };

  // Handler for adding a newly submitted book listing to DB
  const handleCreateBookListing = async (newBookData: Omit<Book, 'id' | 'createdAt' | 'isSold'>) => {
    try {
      const added = await saveNewBook(newBookData);
      setBooks(prev => [added, ...prev]);
    } catch (e) {
      console.error("Failed to list book", e);
    }
  };

  // Handler for finishing/buying an active listed book
  const handleConfirmPurchase = async (bookId: string, buyerName: string, buyerPhone: string) => {
    const targetBook = books.find(b => b.id === bookId);
    if (!targetBook) return;

    const updatedBook: Book = {
      ...targetBook,
      isSold: true,
      buyerName,
      buyerPhone,
      soldAt: new Date().toISOString()
    };

    try {
      await updateBookDetails(updatedBook);
      // Update state
      setBooks(prev => prev.map(b => b.id === bookId ? updatedBook : b));
    } catch (e) {
      console.error("Failed to buy book", e);
    }
  };

  // Computation of dynamic stats dashboard metrics specifically for the top Hero banner & dashboard views
  const dashboardStats = useMemo(() => {
    const totalCount = books.length;
    const activeCount = books.filter(b => !b.isSold).length;
    
    // Compute unique seller names to represent actual sellers (contributors) count dynamically
    const uniqueSellersSet = new Set(books.filter(b => b.sellerName).map(b => b.sellerName.trim()));
    const uniqueBuyersSet = new Set(books.filter(b => b.buyerName && b.buyerName.trim() !== '').map(b => b.buyerName!.trim()));
    const totalSellers = uniqueSellersSet.size;
    
    // Members count incorporates actual active unique sellers and buyers plus current user session
    const allMembers = new Set([...Array.from(uniqueSellersSet), ...Array.from(uniqueBuyersSet)]);
    if (session && session.displayName) {
      allMembers.add(session.displayName.trim());
    }
    const totalMembers = allMembers.size;

    return {
      totalCount,
      activeCount,
      totalMembers,
      totalSellers
    };
  }, [books, session]);

  // Recommended books memoization - showcases best deals, prime conditions, or high-value academic/popular items
  const recommendedBooks = useMemo(() => {
    return [...books]
      .filter(b => !b.isSold)
      .sort((a, b) => {
        // Higher discount or higher custom rating (excellent quality) gets prioritized
        const scoreA = (a.discount * 2.5) + (a.condition === 'excellent' || a.condition === 'new' ? 40 : 0);
        const scoreB = (b.discount * 2.5) + (b.condition === 'excellent' || b.condition === 'new' ? 40 : 0);
        return scoreB - scoreA;
      });
  }, [books]);

  // Filtering System: title, author, category types, grade, and physical condition checks
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // 1. Text Search matching Book Name, Author, or Location
      const matchText = searchQuery.trim() === '' || 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.sellerLocation.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Book genre type filter
      const matchType = selectedType === 'all' || book.bookType === selectedType;

      // 3. School Grade Academic Class levels matching filter
      const matchClass = selectedClass === 'all' || book.classLevel === selectedClass;

      // 4. Physical physicalCondition filter matching
      const matchCondition = selectedCondition === 'all' || book.condition === selectedCondition;

      return matchText && matchType && matchClass && matchCondition;
    });
  }, [books, searchQuery, selectedType, selectedClass, selectedCondition]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedClass('all');
    setSelectedCondition('all');
  };

  return (
    <div 
      className="min-h-screen text-slate-800 flex flex-col font-sans relative"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.92)), url("https://i.postimg.cc/YCnz6qhh/closeup-stack-books-with-one-open-book-top-98862-4577.avif")`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      
      {/* Header component including support buttons & user session indicators */}
      <Header 
        session={session}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenPostBook={() => setIsPostOpen(true)}
        isFirebaseActive={isFirebaseConfigured}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Core Platform Content Area */}
      <main className="flex-grow mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Live Animating Banner Slider & Community Target Tracker */}
        <BannerAndTargetSection books={books} onOpenPost={() => setIsPostOpen(true)} />

        {/* Dynamic 4-Box Stats Dashboard matching top-tier app style */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Books */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-xs flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 shrink-0">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold tracking-wider font-sans uppercase">Total Books</p>
              <h3 className="text-lg font-black text-slate-800 tracking-tight font-sans mt-0.5">
                {dashboardStats.totalCount}টি
              </h3>
              <p className="text-[10px] text-slate-500 font-medium font-sans">মোট আপলোডকৃত বই</p>
            </div>
          </div>

          {/* Card 2: Active Books */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-xs flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold tracking-wider font-sans uppercase font-sans">Active Books</p>
              <h3 className="text-lg font-black text-slate-800 tracking-tight font-sans mt-0.5">
                {dashboardStats.activeCount}টি
              </h3>
              <p className="text-[10px] text-slate-500 font-medium font-sans">বিক্রির জন্য প্রস্তুত</p>
            </div>
          </div>

          {/* Card 3: Total Members */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-xs flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-sky-50 text-sky-600 shrink-0">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold tracking-wider font-sans uppercase font-sans">Total Members</p>
              <h3 className="text-lg font-black text-slate-800 tracking-tight font-sans mt-0.5">
                {dashboardStats.totalMembers}জন
              </h3>
              <p className="text-[10px] text-slate-500 font-medium font-sans">নিবন্ধিত লাইভ সদস্য</p>
            </div>
          </div>

          {/* Card 4: Sellers */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-xs flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-orange-50 text-orange-600 shrink-0">
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold tracking-wider font-sans uppercase font-sans">Total Sellers</p>
              <h3 className="text-lg font-black text-slate-800 tracking-tight font-sans mt-0.5">
                {dashboardStats.totalSellers}জন
              </h3>
              <p className="text-[10px] text-slate-500 font-medium font-sans font-sans">সক্রিয় বই বিক্রেতাগণ</p>
            </div>
          </div>
        </div>
        
        {/* Recent Book Uploads Slider with Bilingual features */}
        <BookSlider 
          books={books} 
          title="রিসেন্ট আপলোড করা বই সমূহ"
          subtitle="Explore the latest second-hand books posted by our student community"
          englishBadge="RECENT UPLOADS"
          onBuy={setSelectedBookForDetails} 
        />

        {/* Recommended Books Slider with Bilingual features */}
        <BookSlider 
          books={recommendedBooks} 
          title="আপনার জন্য রিকমেন্ডেড বই"
          subtitle="Curated collection of books in excellent condition and with the highest savings"
          englishBadge="RECOMMENDED FOR YOU"
          onBuy={setSelectedBookForDetails} 
        />

        {/* Elegant All-In-One Filter Toggle Row directly above the Catalog listings */}
        <div className="pt-2">
          <SearchFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            selectedCondition={selectedCondition}
            setSelectedCondition={setSelectedCondition}
            books={books}
            onResetFilters={resetAllFilters}
          />
        </div>

        {/* Primary Catalog Inventory list - Expanded to full width 4 columns on desktop */}
        <section id="main-catalog-container" className="space-y-6 pt-6 border-t border-slate-200/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4 border-slate-150">
            <div className="flex items-center space-x-2">
              <span className="h-6 w-1 rounded-full bg-blue-600 block" />
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                বই সমাহার ({filteredBooks.length} টি বিজ্ঞাপন পাওয়া গেছে)
              </h2>
            </div>
            
            {/* Quick stats on overall volume */}
            <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              মোট আপলোডকৃত বই: {books.length} টি
            </span>
          </div>

          {/* Loading indicator */}
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
              <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
              <p className="text-sm font-semibold text-slate-500">পরবর্তী বইয়ের খাতা লোড করা হচ্ছে...</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-16 text-center space-y-4 max-w-lg mx-auto">
              <Bookmark className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="text-base font-extrabold text-slate-800">দুঃখিত, কোনো বই মিলছে না!</h3>
              <p className="text-xs text-slate-500">
                আপনার অনুসন্ধানের ফিল্টার মিলিয়ে কোনো পুরাতন বইয়ের বিজ্ঞাপন এখনই উপলব্ধ নেই। দয়া করে অন্য কোনো বিষয় সিলেক্ট করুন অথবা নতুন বই আপলোড করুন।
              </p>
              <button 
                onClick={resetAllFilters}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50/50 hover:bg-blue-50 cursor-pointer"
              >
                সব ফিল্টার মুছে ফেলুন
              </button>
            </div>
          ) : (
            // Books Grid - Enhanced with full-width responsive columns design (up to col-span-4)
            <div className="grid grid-cols-2 gap-3.5 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredBooks.map((book) => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  onBuy={setSelectedBookForDetails}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modern High-contrast Footer with Legal Bangladesh compliance info */}
      <footer className="bg-slate-900 text-slate-400 mt-20 border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg border-2 border-amber-300 overflow-hidden shrink-0">
                <img 
                  src="https://i.pinimg.com/1200x/9a/2e/8f/9a2e8ffd8a5776c22991fe5e535a4c62.jpg" 
                  alt="Booksy-bd Logo" 
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <span className="text-xl font-black text-white block tracking-tight">Booksy-bd</span>
                <span className="text-xs text-amber-400 block font-semibold leading-none mt-1">পুরাতন বই কেনা-বেচা প্ল্যাটফর্ম</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">মুদ্রিত শিক্ষার উন্মুক্ত জ্ঞানের প্রবেশদ্বার</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-400">
              <button onClick={() => setIsHelpOpen(true)} className="hover:text-amber-400 cursor-pointer transition-colors">সহায়তা চেয়ে মেসেজ</button>
              <span className="text-slate-700">•</span>
              <button onClick={() => setIsRegisterOpen(true)} className="hover:text-amber-400 cursor-pointer transition-colors">আমার একাউন্ট</button>
              <span className="text-slate-700">•</span>
              <button onClick={() => setIsPostOpen(true)} className="hover:text-amber-400 cursor-pointer transition-colors">নতুন ক্যাটাগরি তৈরি</button>
              <span className="text-slate-700">•</span>
              <button onClick={() => setIsTermsOpen(true)} className="hover:text-amber-400 cursor-pointer transition-colors text-amber-500">শর্তাবলী এবং গোপনীয়তা নীতি (Terms & Policy)</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-850/60 text-xs">
            <div className="space-y-1">
              <p className="text-slate-400 font-bold">
                Created by <span className="text-white hover:text-amber-300 font-extrabold transition-all">Prangon</span>
              </p>
              <p className="text-slate-500 text-[11px]">
                Powered by <span className="text-slate-300 font-semibold">Ha-mim Residential School and College</span>
              </p>
            </div>
            
            <div className="flex flex-col md:items-end justify-center text-left md:text-right space-y-1">
              <p className="text-slate-500">
                © {new Date().getFullYear()} Booksy-bd পুরাতন বই এক্সচেঞ্জ। সমস্ত অধিকার সংরক্ষিত।
              </p>
              <p className="text-slate-500 flex items-center md:justify-end">
                বাংলায় তৈরি ও চালিত <span className="text-rose-500 mx-1">♥</span> বাংলাদেশের শিক্ষার্থীদের কল্যাণে।
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal Dialog Panels */}

      <PostBookModal 
        isOpen={isPostOpen}
        onClose={() => setIsPostOpen(false)}
        onSubmit={handleCreateBookListing}
        session={session}
      />

      <RegisterModal 
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        session={session}
        onRegister={handleRegisterProfile}
      />

      <PurchaseModal 
        isOpen={!!selectedBookForPurchase}
        onClose={() => setSelectedBookForPurchase(null)}
        book={selectedBookForPurchase}
        session={session}
        onConfirmPurchase={handleConfirmPurchase}
      />

      <SupportHelpModal 
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        userNameFromSession={session?.displayName}
      />

      <BookDetailsModal 
        isOpen={!!selectedBookForDetails}
        onClose={() => setSelectedBookForDetails(null)}
        book={selectedBookForDetails}
        onBuy={handleInitiateBuy}
      />

      <TermsModal 
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      {/* Floating Support WhatsApp help badge */}
      <a 
        href="https://wa.me/8801716807465"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-[#25d366] hover:bg-[#20ba5a] shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-bounce cursor-pointer group"
        title="WhatsApp Support"
      >
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/WhatsApp_icon.png/500px-WhatsApp_icon.png" 
          alt="WhatsApp Help" 
          referrerPolicy="no-referrer"
          className="h-9 w-9 sm:h-10 sm:w-10 object-contain"
        />
        {/* Compact tooltip details bubble */}
        <span className="absolute right-full mr-3 whitespace-nowrap bg-slate-900/95 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-md border border-slate-800">
          যেকোনো সমস্যায় সাহায্য নিন (WhatsApp Support)
        </span>
      </a>

    </div>
  );
}
