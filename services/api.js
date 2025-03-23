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
  return await callApi(`/add-keyword/${encodeURIComponent(keyword)}`, {
    method: 'POST',
  });
};

/**
 * Removes a tracked keyword
 * @param {string} keyword - The keyword to remove
 * @returns {Promise<Object>} Response message
 */
export const removeKeyword = async (keyword) => {
  return await callApi(`/remove-keyword/${encodeURIComponent(keyword)}`, {
    method: 'DELETE',
  });
};

/**
 * Performs a search for a specific keyword
 * @param {string} keyword - The keyword to search for
 * @returns {Promise<Object>} Search results
 */
export const searchKeyword = async (keyword) => {
  return await callApi(`/search/${encodeURIComponent(keyword)}`);
};

/**
 * Fetches recent search results for all keywords
 * @param {number} days - Number of days to look back (default: 7)
 * @returns {Promise<Array>} Search results data
 */
export const fetchResults = async (days = 7) => {
  return await callApi(`/results?days=${days}`);
};

/**
 * Manually triggers a search for all active keywords
 * @returns {Promise<Object>} Response with search results summary
 */
export const runManualSearch = async () => {
  return await callApi('/run-search', {
    method: 'POST',
  });
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