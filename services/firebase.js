/**
 * Firebase service module for Intention-Ally
 * Contains functions to interact with Firebase Firestore
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let firebaseApp;
let firestoreDb;

/**
 * Initialize Firebase app and Firestore
 * @returns {Object} Firestore database instance
 */
export const initFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (!firebaseApp) {
      // Verify all required config values are present
      const configValues = Object.values(firebaseConfig);
      if (configValues.some(value => !value)) {
        console.error('Firebase config is incomplete:', 
          Object.keys(firebaseConfig).filter(key => !firebaseConfig[key]));
        return null;
      }
      
      // Initialize Firebase
      firebaseApp = initializeApp(firebaseConfig);
      console.log('Firebase initialized successfully');
    }
    
    // Get Firestore instance
    if (!firestoreDb) {
      firestoreDb = getFirestore(firebaseApp);
      console.log('Firestore database connected');
    }
    
    return firestoreDb;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return null;
  }
};

/**
 * Saves search results to Firebase Firestore
 * @param {string} keyword - The keyword that was searched
 * @param {Array} results - Array of search result objects
 * @returns {Promise<Object>} - Response from Firebase
 */
export const saveSearchResults = async (keyword, results) => {
  try {
    const db = initFirebase();
    if (!db) throw new Error('Firebase not initialized');
    
    // Create a document with the search session data
    const searchSession = {
      keyword,
      timestamp: Timestamp.now(),
      results
    };
    
    // Add document to "searches" collection
    const docRef = await addDoc(collection(db, 'searches'), searchSession);
    
    return {
      success: true,
      message: `Search results saved to Firebase with ID: ${docRef.id}`,
      id: docRef.id
    };
  } catch (error) {
    console.error('Error saving search results to Firebase:', error);
    throw error;
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
    if (!db) throw new Error('Firebase not initialized');
    
    // Calculate the date for filtering (days ago from now)
    const daysAgoDate = new Date();
    daysAgoDate.setDate(daysAgoDate.getDate() - days);
    
    // Query the searches collection
    const searchesQuery = query(
      collection(db, 'searches'),
      where('timestamp', '>=', Timestamp.fromDate(daysAgoDate))
    );
    
    const querySnapshot = await getDocs(searchesQuery);
    
    // Convert query results to an array of search sessions
    const searchSessions = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      searchSessions.push({
        id: doc.id,
        keyword: data.keyword,
        timestamp: data.timestamp.toDate(),
        results: data.results
      });
    });
    
    return searchSessions;
  } catch (error) {
    console.error('Error fetching search results from Firebase:', error);
    throw error;
  }
};

export default {
  initFirebase,
  saveSearchResults,
  fetchSearchResults
};