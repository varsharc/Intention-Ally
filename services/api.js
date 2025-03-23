/**
 * API service module for Intention-Ally
 * Contains functions to interact with the backend API
 */

/**
 * Generic API call handler with error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - Response data
 */
const apiCall = async (endpoint, options = {}) => {
  try {
    const url = `/api/backend${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error: ${error.message}`);
    throw error;
  }
};

/**
 * Fetches all tracked keywords
 * @returns {Promise<Array>} List of keyword objects
 */
export const fetchKeywords = async () => {
  try {
    const response = await apiCall('/keywords');
    return response;
  } catch (error) {
    console.error('Failed to fetch keywords:', error);
    return [];
  }
};

/**
 * Adds a new keyword to track
 * @param {string} keyword - The keyword to add
 * @returns {Promise<Object>} Response message
 */
export const addKeyword = async (keyword) => {
  return apiCall(`/keywords/add/${encodeURIComponent(keyword)}`, {
    method: 'POST',
  });
};

/**
 * Removes a tracked keyword
 * @param {string} keyword - The keyword to remove
 * @returns {Promise<Object>} Response message
 */
export const removeKeyword = async (keyword) => {
  return apiCall(`/keywords/remove/${encodeURIComponent(keyword)}`, {
    method: 'POST',
  });
};

/**
 * Performs a search for a specific keyword and optionally saves to Firebase
 * @param {string} keyword - The keyword to search for
 * @param {boolean} saveToFirebase - Whether to save results to Firebase
 * @returns {Promise<Object>} Search results
 */
export const searchKeyword = async (keyword, saveToFirebase = false) => {
  return apiCall(`/search/${encodeURIComponent(keyword)}${saveToFirebase ? '?save=true' : ''}`);
};

/**
 * Fetches recent search results for all keywords
 * @param {number} days - Number of days to look back (default: 7)
 * @param {boolean} useFirebase - Whether to fetch from Firebase instead of local storage
 * @returns {Promise<Array>} Search results data
 */
export const fetchResults = async (days = 7, useFirebase = false) => {
  return apiCall(`/results?days=${days}${useFirebase ? '&source=firebase' : ''}`);
};

/**
 * Manually triggers a search for all active keywords
 * @param {boolean} saveToFirebase - Whether to save results to Firebase
 * @returns {Promise<Object>} Response with search results summary
 */
export const runManualSearch = async (saveToFirebase = false) => {
  return apiCall('/run-search', {
    method: 'POST',
    body: JSON.stringify({ saveToFirebase }),
  });
};

const api = {
  fetchKeywords,
  addKeyword,
  removeKeyword,
  searchKeyword,
  fetchResults,
  runManualSearch,
};

export default api;