/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string; // Basic core genre or category
  bookType: string; // e.g. Academic, Novel, Science, Islamic, Adventure, etc.
  classLevel: string; // For academic books (e.g. Class 1-10, HSC, University, N/A)
  price: number;
  originalPrice?: number;
  discount: number; // Discount percentage (e.g. 15 for 15%)
  condition: 'new' | 'excellent' | 'good' | 'fair'; // Condition of the book
  imageUri: string; // Base64 data link or image URL for preview
  additionalImages?: string[]; // Multiple auxiliary images for carousel or detail preview
  sellerName: string;
  sellerPhone: string;
  sellerLocation: string;
  createdAt: any; // Date string or Firebase Timestamp
  isSold: boolean;
  buyerName?: string;
  buyerPhone?: string;
  soldAt?: string;
  description?: string;
}

export interface SupportMessage {
  id: string;
  userName: string;
  userPhone: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'resolved';
}

export interface UserSession {
  uid: string;
  displayName: string;
  email: string;
  phone?: string;
  location?: string;
}
