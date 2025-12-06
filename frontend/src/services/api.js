/**
 * Register a ward admin
 * @param {Object} data - Admin registration data
 * @returns {Promise<Object>} Response from the API
 */
export const registerWardAdmin = async (data) => {
  try {
    const response = await fetch('http://localhost:8000/api/auth/ward_register', {
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
    const response = await fetch('https://localhost:8000/api/auth/register', {
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
    const response = await fetch('https://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Login failed');
    }

    return result;
  } catch (error) {
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
      ? `http://localhost:8000/api/posts/get_all.php?type=complaint&limit=${limit}`
      : 'http://localhost:8000/api/posts/get_all.php?type=complaint';
    
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
      ? `http://localhost:8000/api/posts/get_all.php?type=update&limit=${limit}`
      : 'http://localhost:8000/api/posts/get_all.php?type=update';
    
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
    const response = await fetch('http://localhost:8000/api/posts/get_all.php?type=event', {
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
      ? `http://localhost:8000/api/posts/get_all.php?type=help&limit=${limit}`
      : 'http://localhost:8000/api/posts/get_all.php?type=help';
    
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
      ? `http://localhost:8000/api/posts/get_all.php?type=lost_found&limit=${limit}`
      : 'http://localhost:8000/api/posts/get_all.php?type=lost_found';
    
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
      ? `http://localhost:8000/api/posts/get_all.php?type=invitation&limit=${limit}`
      : 'http://localhost:8000/api/posts/get_all.php?type=invitation';
    
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

