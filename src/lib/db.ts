/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  setDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { isFirebaseConfigured, db, auth } from './firebase';
import { Book, SupportMessage } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Pre-populated default books in Bengali to provide a gorgeous initial experience
const MOCK_BOOKS: Book[] = [];

// Write mock books to localStorage if not populated
const initLocalStorage = () => {
  const storedBooks = localStorage.getItem('boimela_books');
  if (storedBooks) {
    try {
      const parsed: Book[] = JSON.parse(storedBooks);
      // Filter out any older sample books
      const filtered = parsed.filter(b => !b.id.startsWith('sample-book-'));
      localStorage.setItem('boimela_books', JSON.stringify(filtered));
    } catch (e) {
      localStorage.setItem('boimela_books', '[]');
    }
  } else {
    localStorage.setItem('boimela_books', '[]');
  }
  
  if (!localStorage.getItem('boimela_support')) {
    localStorage.setItem('boimela_support', JSON.stringify([]));
  }
};

initLocalStorage();

/**
 * Fetch all listed books
 */
export async function fetchAllBooks(): Promise<Book[]> {
  if (isFirebaseConfigured) {
    const path = 'books';
    try {
      const q = query(collection(db, path));
      const snapshot = await getDocs(q);
      const booksList: Book[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        booksList.push({
          ...data,
          id: docSnap.id
        } as Book);
      });
      
      // If Firestore database is configured but empty, populate with default mocks so user immediately has content
      if (booksList.length === 0) {
        for (const defaultBook of MOCK_BOOKS) {
          await setDoc(doc(db, path, defaultBook.id), {
            ...defaultBook,
            createdAt: new Date().toISOString()
          });
          booksList.push(defaultBook);
        }
      }
      return booksList;
    } catch (err) {
      // In case we face access rules errors, capture and rethrow safely conforming to specs
      handleFirestoreError(err, OperationType.LIST, path);
    }
  }

  // Local Storage fallback
  const stored = localStorage.getItem('boimela_books');
  return stored ? JSON.parse(stored) : MOCK_BOOKS;
}

/**
 * Register a new book listing
 */
export async function saveNewBook(bookData: Omit<Book, 'id' | 'createdAt' | 'isSold'>): Promise<Book> {
  const newId = 'book_' + Math.random().toString(36).substr(2, 9);
  const newBook: Book = {
    ...bookData,
    id: newId,
    createdAt: new Date().toISOString(),
    isSold: false
  };

  if (isFirebaseConfigured) {
    const path = 'books';
    try {
      await setDoc(doc(db, path, newId), newBook);
      return newBook;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `${path}/${newId}`);
    }
  }

  // Local Storage
  const stored = localStorage.getItem('boimela_books');
  const books: Book[] = stored ? JSON.parse(stored) : [];
  books.unshift(newBook);
  localStorage.setItem('boimela_books', JSON.stringify(books));
  return newBook;
}

/**
 * Update book info or buy status
 */
export async function updateBookDetails(updatedBook: Book): Promise<Book> {
  if (isFirebaseConfigured) {
    const path = `books/${updatedBook.id}`;
    try {
      await setDoc(doc(db, 'books', updatedBook.id), updatedBook);
      return updatedBook;
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }

  // Local Storage
  const stored = localStorage.getItem('boimela_books');
  if (stored) {
    const books: Book[] = JSON.parse(stored);
    const index = books.findIndex(b => b.id === updatedBook.id);
    if (index !== -1) {
      books[index] = updatedBook;
      localStorage.setItem('boimela_books', JSON.stringify(books));
    }
  }
  return updatedBook;
}

/**
 * Submit support/help query
 */
export async function saveSupportMessage(userName: string, userPhone: string, message: string): Promise<SupportMessage> {
  const newId = 'support_' + Math.random().toString(36).substr(2, 9);
  const supportObj: SupportMessage = {
    id: newId,
    userName,
    userPhone,
    message,
    createdAt: new Date().toISOString(),
    status: 'pending'
  };

  if (isFirebaseConfigured) {
    const path = 'support_messages';
    try {
      await setDoc(doc(db, path, newId), supportObj);
      return supportObj;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `${path}/${newId}`);
    }
  }

  // Local Storage Fallback
  const stored = localStorage.getItem('boimela_support');
  const items: SupportMessage[] = stored ? JSON.parse(stored) : [];
  items.unshift(supportObj);
  localStorage.setItem('boimela_support', JSON.stringify(items));
  return supportObj;
}
