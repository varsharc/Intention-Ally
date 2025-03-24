/**
 * Firebase service module for Intention-Ally
 * 
 * Contains core Firebase and Firestore integration functions and data models.
 * This module handles Firebase initialization and provides utility functions
 * for interacting with Firestore collections.
 */
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, addDoc, query, 
  where, getDocs, Timestamp, doc, setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Global instances to avoid re-initialization
let firebaseApp;
let firestoreDb;
let firebaseAuth;

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
      console.info('Firebase initialized successfully');
    }
    
    // Get Firestore instance
    if (!firestoreDb) {
      firestoreDb = getFirestore(firebaseApp);
      console.info('Firestore database connected');
    }
    
    // Initialize Auth
    if (!firebaseAuth) {
      firebaseAuth = getAuth(firebaseApp);
      console.info('Firebase Auth initialized');
    }
    
    return firestoreDb;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return null;
  }
};

/**
 * Get Firebase Auth instance
 * @returns {Object} Firebase Auth instance
 */
export const getFirebaseAuth = () => {
  if (!firebaseAuth) {
    initFirebase();
  }
  return firebaseAuth;
};

/**
 * Saves search configuration to Firestore
 * @param {Object} config - Search configuration object
 * @param {string} userId - ID of the user who created the configuration
 * @returns {Promise<string>} - ID of the created document
 */
export const saveSearchConfig = async (config, userId) => {
  try {
    const db = initFirebase();
    if (!db) throw new Error('Firebase not initialized');
    
    // Create a search configuration object
    const searchConfig = {
      userId,
      name: config.name,
      keywords: config.keywords,
      templateType: config.templateType,
      authorityThreshold: config.authorityThreshold,
      updateFrequency: config.updateFrequency,
      advancedParams: config.advancedParams || {},
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    // Add document to "searchConfigs" collection
    const docRef = await addDoc(collection(db, 'searchConfigs'), searchConfig);
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving search configuration:', error);
    throw error;
  }
};

/**
 * Saves search results to Firestore
 * @param {string} configId - ID of the search configuration
 * @param {Array} results - Array of search result objects
 * @returns {Promise<Object>} - IDs of created documents
 */
export const saveSearchResults = async (configId, results) => {
  try {
    const db = initFirebase();
    if (!db) throw new Error('Firebase not initialized');
    
    const resultIds = [];
    
    // Process each result and save individually for better performance
    for (const result of results) {
      // Create a search result object
      const searchResult = {
        configId,
        title: result.title,
        url: result.url,
        snippet: result.snippet || '',
        sourceDomain: result.sourceDomain || new URL(result.url).hostname,
        authorityScore: result.authorityScore || 0,
        discoveredAt: serverTimestamp(),
        metadata: result.metadata || {},
        cluster: result.cluster || null,
        x: result.x || 0,
        y: result.y || 0,
        processed: result.processed || false
      };
      
      // Add document to "searchResults" collection
      const docRef = await addDoc(collection(db, 'searchResults'), searchResult);
      resultIds.push(docRef.id);
    }
    
    // Update search config with last run timestamp
    await updateSearchConfigTimestamp(configId);
    
    return {
      success: true,
      count: resultIds.length,
      resultIds
    };
  } catch (error) {
    console.error('Error saving search results:', error);
    throw error;
  }
};

/**
 * Updates the lastRun timestamp on a search configuration
 * @param {string} configId - ID of the search configuration
 * @returns {Promise<void>}
 */
export const updateSearchConfigTimestamp = async (configId) => {
  try {
    const db = initFirebase();
    if (!db) throw new Error('Firebase not initialized');
    
    await setDoc(doc(db, 'searchConfigs', configId), {
      lastRun: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error(`Error updating timestamp for config ${configId}:`, error);
    throw error;
  }
};

/**
 * Fetches search configurations for a user
 * @param {string} userId - ID of the user
 * @returns {Promise<Array>} - Array of search configuration objects
 */
export const fetchSearchConfigs = async (userId) => {
  try {
    const db = initFirebase();
    if (!db) throw new Error('Firebase not initialized');
    
    // Query the searchConfigs collection for the user
    const configsQuery = query(
      collection(db, 'searchConfigs'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(configsQuery);
    
    // Convert query results to an array of configurations
    const configs = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      configs.push({
        id: doc.id,
        name: data.name,
        keywords: data.keywords,
        templateType: data.templateType,
        authorityThreshold: data.authorityThreshold,
        updateFrequency: data.updateFrequency,
        advancedParams: data.advancedParams,
        isActive: data.isActive,
        createdAt: data.createdAt?.toDate(),
        lastRun: data.lastRun?.toDate(),
      });
    });
    
    return configs;
  } catch (error) {
    console.error('Error fetching search configs:', error);
    throw error;
  }
};

/**
 * Fetches search results for a specific configuration
 * @param {string} configId - ID of the search configuration
 * @param {number} limit - Maximum number of results to return
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Array>} - Array of search result objects
 */
export const fetchSearchResults = async (configId, limit = 10, offset = 0) => {
  try {
    const db = initFirebase();
    if (!db) throw new Error('Firebase not initialized');
    
    // Query the searchResults collection for the config
    const resultsQuery = query(
      collection(db, 'searchResults'),
      where('configId', '==', configId)
    );
    
    const querySnapshot = await getDocs(resultsQuery);
    
    // Convert query results to an array of results
    const allResults = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      allResults.push({
        id: doc.id,
        title: data.title,
        url: data.url,
        snippet: data.snippet,
        sourceDomain: data.sourceDomain,
        authorityScore: data.authorityScore,
        discoveredAt: data.discoveredAt?.toDate(),
        metadata: data.metadata,
        cluster: data.cluster,
        x: data.x,
        y: data.y
      });
    });
    
    // Sort by authority score and apply pagination
    const sortedResults = allResults.sort((a, b) => b.authorityScore - a.authorityScore);
    const paginatedResults = sortedResults.slice(offset, offset + limit);
    
    return {
      results: paginatedResults,
      total: allResults.length,
      hasMore: offset + limit < allResults.length
    };
  } catch (error) {
    console.error('Error fetching search results:', error);
    throw error;
  }
};

// Initialize Firebase right away if not in a server environment
if (typeof window !== 'undefined') {
  initFirebase();
}

export default {
  initFirebase,
  getFirebaseAuth,
  saveSearchConfig,
  saveSearchResults,
  fetchSearchConfigs,
  fetchSearchResults,
  updateSearchConfigTimestamp
};
