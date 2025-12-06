/**
 * Register a ward admin
 * @param {Object} data - Admin registration data
 * @returns {Promise<Object>} Response from the API
 */
export const registerWardAdmin = async (data) => {
  try {
    const response = await fetch('/api/auth/ward_register.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Registration failed');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Register a user
 * @param {Object} data - User registration data
 * @returns {Promise<Object>} Response from the API
 */
export const registerUser = async (data) => {
  try {
    const response = await fetch('/api/auth/register.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Registration failed');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Login user or admin
 * @param {Object} credentials - Login credentials (email, password)
 * @returns {Promise<Object>} Response from the API
 */
export const login = async (credentials) => {
  try {
    // Add cache-busting query parameter to prevent 304 responses
    const url = `/api/auth/login.php?_t=${Date.now()}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
      cache: 'no-store',
      body: JSON.stringify(credentials),
    });

    // Handle 304 Not Modified status - retry with new timestamp
    if (response.status === 304) {
      const retryUrl = `/api/auth/login.php?_t=${Date.now()}`;
      const retryResponse = await fetch(retryUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
        cache: 'no-store',
        body: JSON.stringify(credentials),
      });
      
      if (!retryResponse.ok) {
        throw new Error('Login failed. Please try again.');
      }
      
      const result = await retryResponse.json();
      return result;
    }

    // Check if response has content before parsing JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response from server');
    }

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Login failed');
    }

    return result;
  } catch (error) {
    // If JSON parsing fails, provide a more helpful error message
    if (error instanceof SyntaxError) {
      throw new Error('Invalid response from server. Please try again.');
    }
    throw error;
  }
};

/**
 * Get complaints for admin
 * @param {number} limit - Number of complaints to fetch
 * @returns {Promise<Array>} Array of complaints
 */
export const getComplaints = async (limit = null) => {
  try {
    const token = localStorage.getItem('token');
    const url = limit 
      ? `/api/posts/get_all.php?type=complaint&limit=${limit}`
      : '/api/posts/get_all.php?type=complaint';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch complaints');
    }

    return result.data || result;
  } catch (error) {
    throw error;
  }
};

/**
 * Get samachar/updates
 * @param {number} limit - Number of updates to fetch
 * @returns {Promise<Array>} Array of updates
 */
export const getSamachar = async (limit = null) => {
  try {
    const token = localStorage.getItem('token');
    const url = limit 
      ? `/api/posts/get_all.php?type=update&limit=${limit}`
      : '/api/posts/get_all.php?type=update';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch samachar');
    }

    return result.data || result;
  } catch (error) {
    throw error;
  }
};

/**
 * Get events
 * @returns {Promise<Array>} Array of events
 */
export const getEvents = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/posts/get_all.php?type=event', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch events');
    }

    return result.data || result;
  } catch (error) {
    throw error;
  }
};

/**
 * Get help requests
 * @param {number} limit - Number of requests to fetch
 * @returns {Promise<Array>} Array of help requests
 */
export const getHelpRequests = async (limit = null) => {
  try {
    const token = localStorage.getItem('token');
    const url = limit 
      ? `/api/posts/get_all.php?type=help&limit=${limit}`
      : '/api/posts/get_all.php?type=help';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch help requests');
    }

    return result.data || result;
  } catch (error) {
    throw error;
  }
};

/**
 * Get lost & found items
 * @param {number} limit - Number of items to fetch
 * @returns {Promise<Array>} Array of lost & found items
 */
export const getLostFound = async (limit = null) => {
  try {
    const token = localStorage.getItem('token');
    const url = limit 
      ? `/api/posts/get_all.php?type=lost_found&limit=${limit}`
      : '/api/posts/get_all.php?type=lost_found';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch lost & found items');
    }

    return result.data || result;
  } catch (error) {
    throw error;
  }
};

/**
 * Get invitations
 * @param {number} limit - Number of invitations to fetch
 * @returns {Promise<Array>} Array of invitations
 */
export const getInvitations = async (limit = null) => {
  try {
    const token = localStorage.getItem('token');
    const url = limit 
      ? `/api/posts/get_all.php?type=invitation&limit=${limit}`
      : '/api/posts/get_all.php?type=invitation';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch invitations');
    }

    return result.data || result;
  } catch (error) {
    throw error;
  }
};

