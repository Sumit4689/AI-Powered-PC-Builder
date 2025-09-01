/**
 * API service to handle all HTTP requests
 * Uses environment variables for API URLs
 */

// Determine the API URL based on the environment
export const API_BASE_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.PROD 
    ? 'https://ai-powered-pc-builder.onrender.com' // Default production URL
    : 'http://localhost:11822'
);

/**
 * Make a fetch request with the specified options
 * @param {string} endpoint - API endpoint (without the base URL)
 * @param {Object} options - Fetch options (method, headers, body)
 * @returns {Promise} - Promise resolving to the JSON response
 */
export const fetchApi = async (endpoint, options = {}) => {
  // Add '/api' prefix in production environment
  const apiPrefix = import.meta.env.PROD ? '/api' : '';
  const url = `${API_BASE_URL}${apiPrefix}${endpoint}`;
  
  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    
    // If the response is not ok, throw an error
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }
    
    // Parse the response as JSON
    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

/**
 * HTTP GET request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional fetch options
 */
export const get = (endpoint, options = {}) => {
  return fetchApi(endpoint, { 
    method: 'GET',
    ...options
  });
};

/**
 * HTTP POST request
 * @param {string} endpoint - API endpoint
 * @param {Object} body - Request body
 * @param {Object} options - Additional fetch options
 */
export const post = (endpoint, body = {}, options = {}) => {
  return fetchApi(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    ...options
  });
};

/**
 * HTTP PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} body - Request body
 * @param {Object} options - Additional fetch options
 */
export const put = (endpoint, body = {}, options = {}) => {
  return fetchApi(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
    ...options
  });
};

/**
 * HTTP DELETE request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional fetch options
 */
export const del = (endpoint, options = {}) => {
  return fetchApi(endpoint, {
    method: 'DELETE',
    ...options
  });
};

export default {
  get,
  post,
  put,
  delete: del,
  API_BASE_URL
};
