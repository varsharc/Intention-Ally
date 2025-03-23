/**
 * API service module for Intention-Ally
 * Contains functions to interact with the backend API
 */
import { saveSearchResults as saveToFirebase, fetchSearchResults as fetchFromFirebase } from './firebase';

// Base API URL (adjust based on environment)
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api/backend' 
  : '/api/backend';

/**
 * Generic API call handler with error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - Response data
 */
const apiCall = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`Making API request to: ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    // Check if response is ok (status in the range 200-299)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
    }
    
    // Parse JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

/**
 * Fetches all tracked keywords
 * @returns {Promise<Array>} List of keyword objects
 */
export const fetchKeywords = async () => {
  try {
    const data = await apiCall('/keywords');
    return data || [];
  } catch (error) {
    console.error('Error fetching keywords:', error);
    
    // Return sample data for development/demo purposes
    return [
      { value: 'carbon insetting', created_at: new Date().toISOString(), is_active: true },
      { value: 'sustainable logistics', created_at: new Date().toISOString(), is_active: true },
      { value: 'scope 3 emissions', created_at: new Date().toISOString(), is_active: true }
    ];
  }
};

/**
 * Adds a new keyword to track
 * @param {string} keyword - The keyword to add
 * @returns {Promise<Object>} Response message
 */
export const addKeyword = async (keyword) => {
  try {
    const data = await apiCall(`/keywords/add/${encodeURIComponent(keyword)}`, {
      method: 'POST',
    });
    return data;
  } catch (error) {
    console.error('Error adding keyword:', error);
    throw error;
  }
};

/**
 * Removes a tracked keyword
 * @param {string} keyword - The keyword to remove
 * @returns {Promise<Object>} Response message
 */
export const removeKeyword = async (keyword) => {
  try {
    const data = await apiCall(`/keywords/remove/${encodeURIComponent(keyword)}`, {
      method: 'DELETE',
    });
    return data;
  } catch (error) {
    console.error('Error removing keyword:', error);
    throw error;
  }
};

/**
 * Performs a search for a specific keyword and optionally saves to Firebase
 * @param {string} keyword - The keyword to search for
 * @param {boolean} saveToFirebase - Whether to save results to Firebase
 * @returns {Promise<Object>} Search results
 */
export const searchKeyword = async (keyword, saveToFirebase = false) => {
  try {
    const data = await apiCall(`/search/${encodeURIComponent(keyword)}`);
    
    // If the search was successful and results should be saved to Firebase
    if (data.success && data.results && saveToFirebase) {
      try {
        await saveToFirebase(keyword, data.results);
        console.log('Search results saved to Firebase');
      } catch (firebaseError) {
        console.error('Error saving to Firebase:', firebaseError);
        // Continue even if Firebase save fails
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error searching keyword:', error);
    throw error;
  }
};

/**
 * Fetches recent search results for all keywords
 * @param {number} days - Number of days to look back (default: 7)
 * @param {boolean} useFirebase - Whether to fetch from Firebase instead of local storage
 * @returns {Promise<Array>} Search results data
 */
export const fetchResults = async (days = 7, useFirebase = false) => {
  try {
    if (useFirebase) {
      // Get results from Firebase
      return await fetchFromFirebase(days);
    } else {
      // Get results from backend API
      const data = await apiCall(`/results?days=${days}`);
      return data || [];
    }
  } catch (error) {
    console.error('Error fetching results:', error);
    throw error;
  }
};

/**
 * Manually triggers a search for all active keywords
 * @param {boolean} saveToFirebase - Whether to save results to Firebase
 * @returns {Promise<Object>} Response with search results summary
 */
export const runManualSearch = async (saveToFirebase = false) => {
  try {
    const data = await apiCall('/run-search', {
      method: 'POST',
      body: JSON.stringify({ save_to_firebase: saveToFirebase }),
    });
    return data;
  } catch (error) {
    console.error('Error running manual search:', error);
    throw error;
  }
};

// Export all API functions as a default object
const api = {
  fetchKeywords,
  addKeyword,
  removeKeyword,
  searchKeyword,
  fetchResults,
  runManualSearch,
};

export default api;