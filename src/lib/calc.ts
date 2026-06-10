/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const BOOK_TYPES = [
  { value: 'all', label: 'সকল প্রকার' },
  { value: 'academic', label: 'শিক্ষামূলক / একাডেমিক গাইড' },
  { value: 'novel', label: 'উপন্যাস ও গল্প' },
  { value: 'islamic', label: 'ইসলামিক ও দ্বীনি বই' },
  { value: 'guide', label: 'ভর্তি প্রস্তুতি ও চাকরির গাইড' },
  { value: 'dictionary', label: 'অভিধান ও ভাষাশিক্ষা' },
  { value: 'other', label: 'অন্যান্য বইপত্র' }
];

export const CLASS_LEVELS = [
  { value: 'all', label: 'সকল শ্রেণী / লেভেল' },
  { value: 'Class 1-5', label: 'class ১ - ৫ (প্রাথমিক)' },
  { value: 'Class 6-8', label: 'class ৬ - ৮ (নিম্ন মাধ্যমিক)' },
  { value: 'Class 9-10', label: 'class ৯ - ১০ (মাধ্যমিক)' },
  { value: 'HSC', label: 'এইচএসসি (১১ - ১২)' },
  { value: 'Admission', label: 'বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি' },
  { value: 'Honours-Masters', label: 'অনার্স ও মাস্টার্স' },
  { value: 'N/A', label: 'প্রযোজ্য নয় (সাধারণ উপন্যাস/অন্যান্য)' }
];

export const CONDITIONS = [
  { value: 'new', label: 'একেবারে নতুন (New)' },
  { value: 'excellent', label: 'খুবই চমৎকার (Excellent)' },
  { value: 'good', label: 'মোটামুটি ভালো (Good)' },
  { value: 'fair', label: 'পড়ার উপযোগী (Fair)' }
];

export const LOCATIONS = [
  'ঢাকা (মিরপুর)',
  'ঢাকা (উত্তরা)',
  'ঢাকা (ফার্মগেট)',
  'ঢাকা (নীলক্ষেত)',
  'চট্টগ্রাম (চকবাজার)',
  'সিলেট (আম্বরখানা)',
  'রাজশাহী (বিশ্ববিদ্যালয় এলাকা)',
  'খুলনা',
  'বরিশাল',
  'রংপুর',
  'ময়মনসিংহ'
];

/**
 * Calculares discount price
 */
export function calculateDiscountPrice(originalPrice: number, discountPercent: number): number {
  if (!originalPrice || originalPrice <= 0) return 0;
  const reduction = (originalPrice * discountPercent) / 100;
  return Math.round(originalPrice - reduction);
}

/**
 * Maps condition value to colored badge and styled label in Bengali
 */
export function getConditionBadge(condition: string) {
  switch (condition) {
    case 'new':
      return { label: 'একেবারে নতুন', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    case 'excellent':
      return { label: 'খুব ভালো কন্ডিশন', color: 'bg-blue-100 text-blue-800 border-blue-300' };
    case 'good':
      return { label: 'ভালো কন্ডিশন', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    case 'fair':
      return { label: 'সাধারণ কন্ডিশন', color: 'bg-stone-100 text-stone-800 border-stone-300' };
    default:
      return { label: 'অজানা', color: 'bg-gray-100 text-gray-800 border-gray-300' };
  }
}
