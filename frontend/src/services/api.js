/**
 * Register a ward admin
 * @param {Object} data - Admin registration data
 * @returns {Promise<Object>} Response from the API
 */
export const registerWardAdmin = async (data) => {
  try {
    const response = await fetch('http://localhost:8000/api/auth/ward_register.php', {
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
    const response = await fetch('https://localhost:8000/api/auth/register.php', {
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
    const response = await fetch('https://localhost:8000/api/auth/login.php', {
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

