/**
 * Firebase service module for Intention-Ally
 * Contains functions to interact with Firebase Firestore
 */
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';

let firebaseApp;
let firestoreDb;

/**
 * Initialize Firebase app and Firestore
 * @returns {Object} Firestore database instance
 */
export const initFirebase = () => {
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
  
  // Initialize Firebase
  firebaseApp = initializeApp(firebaseConfig);
  firestoreDb = getFirestore(firebaseApp);
  
  return firestoreDb;
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
    const searchSessionRef = collection(db, 'searchSessions');
    
    // Format the data for Firebase
    const formattedResults = results.map(result => ({
      title: result.title,
      url: result.url,
      description: result.description,
      date: result.date ? Timestamp.fromDate(new Date(result.date)) : Timestamp.now(),
    }));
    
    // Add a new document with the search session data
    const docRef = await addDoc(searchSessionRef, {
      keyword,
      results: formattedResults,
      timestamp: Timestamp.now(),
    });
    
    return { message: `Saved to Firebase with ID: ${docRef.id}` };
  } catch (error) {
    console.error('Error saving to Firebase:', error);
    throw new Error('Failed to save search results to Firebase');
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
        keyword: data.keyword,
        results,
        timestamp: data.timestamp.toDate(),
      });
    });
    
    return sessions;
  } catch (error) {
    console.error('Error fetching from Firebase:', error);
    throw new Error('Failed to fetch search results from Firebase');
  }
};