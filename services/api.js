/**
 * API service module for Intention-Ally
 * Contains functions to interact with the backend API
 */

const API_BASE_URL = '/api/backend';

/**
 * Generic API call handler with error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - Response data
 */
const callApi = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Add default headers
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
    
    // Merge options
    const fetchOptions = {
      ...defaultOptions,
      ...options,
    };
    
    console.log(`API Call: ${options.method || 'GET'} ${url}`);
    
    // Make the request
    const response = await fetch(url, fetchOptions);
    
    // Parse JSON response
    const data = await response.json();
    
    // Check if response is ok
    if (!response.ok) {
      // Format error message
      const errorMessage = data.detail || data.message || `Error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Fetches all tracked keywords
 * @returns {Promise<Array>} List of keyword objects
 */
export const fetchKeywords = async () => {
  return await callApi('/keywords');
};

/**
 * Adds a new keyword to track
 * @param {string} keyword - The keyword to add
 * @returns {Promise<Object>} Response message
 */
export const addKeyword = async (keyword) => {
  return await callApi(`/keywords`, {
    method: 'POST',
    body: JSON.stringify({ keyword: keyword }),
  });
};

/**
 * Removes a tracked keyword
 * @param {string} keyword - The keyword to remove
 * @returns {Promise<Object>} Response message
 */
export const removeKeyword = async (keyword) => {
  return await callApi(`/keywords/${encodeURIComponent(keyword)}`, {
    method: 'DELETE',
  });
};

/**
 * Performs a search for a specific keyword and optionally saves to Firebase
 * @param {string} keyword - The keyword to search for
 * @param {boolean} saveToFirebase - Whether to save results to Firebase
 * @returns {Promise<Object>} Search results
 */
export const searchKeyword = async (keyword, saveToFirebase = false) => {
  const response = await callApi(`/search/${encodeURIComponent(keyword)}`);
  
  // If we need to save to Firebase and the search was successful
  if (saveToFirebase && response.success && response.results && response.results.length > 0) {
    try {
      // Import dynamically to avoid circular dependencies
      const { saveSearchResults } = await import('./firebase');
      
      // Save the results
      await saveSearchResults(keyword, response.results);
      console.log(`Saved search results for "${keyword}" to Firebase`);
    } catch (error) {
      console.error('Failed to save to Firebase:', error);
      // Don't throw the error - we still want to return search results even if Firebase storage fails
    }
  }
  
  return response;
};

/**
 * Fetches recent search results for all keywords
 * @param {number} days - Number of days to look back (default: 7)
 * @param {boolean} useFirebase - Whether to fetch from Firebase instead of local storage
 * @returns {Promise<Array>} Search results data
 */
export const fetchResults = async (days = 7, useFirebase = false) => {
  if (useFirebase) {
    try {
      // Import dynamically to avoid circular dependencies
      const { fetchSearchResults } = await import('./firebase');
      
      // Get results from Firebase
      return await fetchSearchResults(days);
    } catch (error) {
      console.error('Failed to fetch from Firebase:', error);
      // Fallback to local storage if Firebase fails
      console.log('Falling back to local storage');
    }
  }
  
  // Use local storage (default)
  return await callApi(`/results?days=${days}`);
};

/**
 * Manually triggers a search for all active keywords
 * @param {boolean} saveToFirebase - Whether to save results to Firebase
 * @returns {Promise<Object>} Response with search results summary
 */
export const runManualSearch = async (saveToFirebase = false) => {
  const response = await callApi('/run-search', {
    method: 'POST',
  });
  
  // If we need to save to Firebase and the search was successful
  if (saveToFirebase && response.results && Array.isArray(response.results)) {
    try {
      // Import dynamically to avoid circular dependencies
      const { saveSearchResults } = await import('./firebase');
      
      // For each keyword with successful results, save to Firebase
      for (const result of response.results) {
        if (result.count && !result.error) {
          // We need to get the actual search results for this keyword
          const searchResponse = await searchKeyword(result.keyword);
          
          if (searchResponse.success && searchResponse.results) {
            await saveSearchResults(result.keyword, searchResponse.results);
            console.log(`Saved batch search results for "${result.keyword}" to Firebase`);
          }
        }
      }
    } catch (error) {
      console.error('Failed to save batch results to Firebase:', error);
      // Don't throw the error - we still want to return search results even if Firebase storage fails
    }
  }
  
  return response;
};

// Export all API functions as the default export
const api = {
  fetchKeywords,
  addKeyword,
  removeKeyword,
  searchKeyword,
  fetchResults,
  runManualSearch,
};

export default api;