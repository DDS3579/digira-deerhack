// Base URL
const BASE_URL = 'http://localhost:8000/api/';

/**
 * Login user or admin - SIMPLIFIED to avoid CORS
 */
export const login = async (credentials) => {
  try {
    console.log("Login attempt with:", credentials);
    
    // Create unique URL with timestamp
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const url = `${BASE_URL}auth/login.php?nocache=${timestamp}&rand=${random}`;
    
    console.log("Login URL:", url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // NO CUSTOM HEADERS HERE - they trigger CORS preflight
      },
      body: JSON.stringify(credentials),
    });

    console.log('Login response status:', response.status);
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Login failed');
    }

    return result;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Register a ward admin
 */
export const registerWardAdmin = async (data) => {
  console.log("Registering ward admin:", data);
  const response = await fetch(`${BASE_URL}auth/ward_register.php?nocache=${Date.now()}`, {
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
};

/**
 * Register a user
 */
export const registerUser = async (data) => {
  console.log("Registering user:", data);
  const response = await fetch(`${BASE_URL}auth/register.php?nocache=${Date.now()}`, {
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
};

/**
 * Get all wards for dropdown
 */
export const getWards = async () => {
  console.log("Fetching wards...");
  const response = await fetch(`${BASE_URL}ward/get_wards.php?nocache=${Date.now()}`);
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error('Failed to fetch wards');
  }
  
  return result;
};