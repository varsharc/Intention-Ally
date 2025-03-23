/**
 * Firebase service module for Intention-Ally
 * Contains functions to interact with Firebase Firestore with storage optimization
 */
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  setDoc,
  doc,
  query, 
  where, 
  orderBy,
  limit,
  Timestamp,
  writeBatch,
  deleteDoc
} from 'firebase/firestore';

let firebaseApp;
let firestoreDb;
const STORAGE_LIMIT_PER_KEYWORD = 50; // Maximum number of results to keep per keyword
const RESULTS_PER_PAGE = 10; // Number of results to display per page in UI

/**
 * Initialize Firebase app and Firestore
 * @returns {Object} Firestore database instance
 */
export const initFirebase = () => {
  try {
    if (firebaseApp) return firestoreDb;
    
    // Firebase configuration from environment variables
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
    
    // Check if all required config values are present
    const missingKeys = Object.entries(firebaseConfig)
      .filter(([key, value]) => !value)
      .map(([key]) => key);
    
    if (missingKeys.length > 0) {
      console.warn(`Firebase initialization missing environment variables: ${missingKeys.join(', ')}`);
      return null;
    }
    
    // Initialize Firebase
    firebaseApp = initializeApp(firebaseConfig);
    firestoreDb = getFirestore(firebaseApp);
    
    return firestoreDb;
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    return null;
  }
};

/**
 * Get Firebase connection status
 * @returns {boolean} Whether Firebase is connected
 */
export const isFirebaseConnected = () => {
  return !!firestoreDb;
};

/**
 * Saves keyword metadata to track statistics and latest search time
 * @param {string} keyword - The keyword to update
 * @param {number} resultCount - Number of results found for this keyword
 * @returns {Promise<void>}
 */
export const updateKeywordMetadata = async (keyword, resultCount) => {
  try {
    const db = initFirebase();
    if (!db) return;
    
    const keywordRef = doc(db, 'keywords', keyword);
    
    // Get existing doc or create new one
    const keywordDoc = await getDoc(keywordRef);
    const now = Timestamp.now();
    
    if (keywordDoc.exists()) {
      // Update existing document
      const data = keywordDoc.data();
      await setDoc(keywordRef, {
        keyword,
        searchCount: (data.searchCount || 0) + 1,
        lastSearched: now,
        totalResults: (data.totalResults || 0) + resultCount,
        avgResultsPerSearch: Math.round(((data.totalResults || 0) + resultCount) / ((data.searchCount || 0) + 1)),
      });
    } else {
      // Create new document
      await setDoc(keywordRef, {
        keyword,
        searchCount: 1,
        lastSearched: now,
        firstSearched: now,
        totalResults: resultCount,
        avgResultsPerSearch: resultCount,
      });
    }
  } catch (error) {
    console.error('Error updating keyword metadata:', error);
  }
};

/**
 * Saves search results to Firebase Firestore with storage optimization
 * @param {string} keyword - The keyword that was searched
 * @param {Array} results - Array of search result objects
 * @returns {Promise<Object>} - Response from Firebase
 */
export const saveSearchResults = async (keyword, results) => {
  try {
    const db = initFirebase();
    if (!db) {
      return { message: "Firebase not initialized. Check environment variables." };
    }
    
    const searchSessionRef = collection(db, 'searchSessions');
    const batch = writeBatch(db);
    
    // Format the data for Firebase - only keep essential data to reduce storage
    const formattedResults = results.map(result => ({
      title: result.title,
      url: result.url,
      // Store a truncated description to save space
      description: result.description ? result.description.substring(0, 250) : '',
      date: result.date ? Timestamp.fromDate(new Date(result.date)) : Timestamp.now(),
    }));
    
    // Add a new document with the search session data
    const docRef = await addDoc(searchSessionRef, {
      keyword,
      results: formattedResults,
      timestamp: Timestamp.now(),
      resultCount: results.length,
    });
    
    // Update keyword metadata
    await updateKeywordMetadata(keyword, results.length);
    
    // Check if we need to clean up old data for this keyword
    await cleanupOldSearches(keyword);
    
    return { message: `Saved to Firebase with ID: ${docRef.id}` };
  } catch (error) {
    console.error('Error saving to Firebase:', error);
    return { error: 'Failed to save search results to Firebase', details: error.message };
  }
};

/**
 * Cleanup old search sessions to keep storage optimized
 * @param {string} keyword - The keyword to cleanup old sessions for
 */
export const cleanupOldSearches = async (keyword) => {
  try {
    const db = initFirebase();
    if (!db) return;
    
    const searchSessionRef = collection(db, 'searchSessions');
    
    // Find all search sessions for this keyword, ordered by timestamp
    const q = query(
      searchSessionRef,
      where('keyword', '==', keyword),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    // If we have more than the limit, delete the oldest ones
    if (querySnapshot.size > STORAGE_LIMIT_PER_KEYWORD) {
      // Skip the newest STORAGE_LIMIT_PER_KEYWORD sessions and delete the rest
      const sessionsToDelete = querySnapshot.docs.slice(STORAGE_LIMIT_PER_KEYWORD);
      
      // Use batched writes for better performance
      const batch = writeBatch(db);
      sessionsToDelete.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      // Commit the batch
      await batch.commit();
      console.log(`Cleaned up ${sessionsToDelete.length} old search sessions for "${keyword}"`);
    }
  } catch (error) {
    console.error('Error cleaning up old searches:', error);
  }
};

/**
 * Fetches recent search results from Firebase Firestore
 * @param {number} days - Number of days to look back
 * @returns {Promise<Array>} - Array of search sessions with results
 */
export const fetchSearchResults = async (days = 7) => {
  try {
    const db = initFirebase();
    if (!db) {
      return [];
    }
    
    const searchSessionRef = collection(db, 'searchSessions');
    
    // Calculate date from X days ago
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);
    
    // Create a query against the collection
    const q = query(
      searchSessionRef,
      where('timestamp', '>=', Timestamp.fromDate(dateLimit)),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const sessions = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Convert Firestore Timestamps to JavaScript dates
      const results = data.results.map(result => ({
        ...result,
        date: result.date.toDate(),
      }));
      
      sessions.push({
        id: doc.id,
        keyword: data.keyword,
        results,
        timestamp: data.timestamp.toDate(),
        resultCount: data.resultCount || results.length,
      });
    });
    
    return sessions;
  } catch (error) {
    console.error('Error fetching from Firebase:', error);
    return [];
  }
};

/**
 * Get keyword statistics from metadata collection
 * @returns {Promise<Array>} Array of keyword statistic objects
 */
export const getKeywordStats = async () => {
  try {
    const db = initFirebase();
    if (!db) return [];
    
    const keywordsRef = collection(db, 'keywords');
    const q = query(keywordsRef, orderBy('lastSearched', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const keywords = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      keywords.push({
        keyword: data.keyword,
        searchCount: data.searchCount || 0,
        lastSearched: data.lastSearched ? data.lastSearched.toDate() : null,
        firstSearched: data.firstSearched ? data.firstSearched.toDate() : null,
        totalResults: data.totalResults || 0,
        avgResultsPerSearch: data.avgResultsPerSearch || 0,
      });
    });
    
    return keywords;
  } catch (error) {
    console.error('Error fetching keyword stats:', error);
    return [];
  }
};

/**
 * Get storage usage metrics for searches
 * @returns {Promise<Object>} Storage usage metrics
 */
export const getStorageMetrics = async () => {
  try {
    const db = initFirebase();
    if (!db) return { totalSessions: 0, totalKeywords: 0, oldestSession: null };
    
    // Get session count
    const sessionsRef = collection(db, 'searchSessions');
    const sessionsQuery = query(sessionsRef, orderBy('timestamp', 'asc'), limit(1));
    const sessionsSnapshot = await getDocs(sessionsQuery);
    
    let oldestSession = null;
    if (!sessionsSnapshot.empty) {
      const oldestDoc = sessionsSnapshot.docs[0];
      oldestSession = oldestDoc.data().timestamp.toDate();
    }
    
    // Count all sessions
    const allSessionsSnapshot = await getDocs(sessionsRef);
    const totalSessions = allSessionsSnapshot.size;
    
    // Count keywords
    const keywordsRef = collection(db, 'keywords');
    const keywordsSnapshot = await getDocs(keywordsRef);
    const totalKeywords = keywordsSnapshot.size;
    
    return { totalSessions, totalKeywords, oldestSession };
  } catch (error) {
    console.error('Error getting storage metrics:', error);
    return { totalSessions: 0, totalKeywords: 0, oldestSession: null };
  }
};