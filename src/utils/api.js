// src/utils/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173/api';

// Helper to get auth token
const getAuthToken = () => localStorage.getItem('pooling_app_token');

// Helper function for making API requests
const makeRequest = async (endpoint, options = {}) => {
  // Build request URL
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Set up headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  // Add auth token if available
  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    // Parse JSON response if available
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    // Handle error responses
    if (!response.ok) {
      throw new Error(data.message || data || 'An error occurred');
    }
    
    return data;
  } catch (error) {
    // Re-throw the error for handling in components
    throw error;
  }
};

// API functions for Auth
export const authAPI = {
  login: (credentials) => {
    return makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },
  
  register: (userData) => {
    return makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },
  
  logout: () => {
    localStorage.removeItem('pooling_app_token');
  },
  
  validateToken: () => {
    return makeRequest('/auth/validate');
  },
  
  updateProfile: (updates) => {
    return makeRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },
  
  resetPassword: (email) => {
    return makeRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },
  
  confirmResetPassword: (token, newPassword) => {
    return makeRequest('/auth/reset-password/confirm', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword })
    });
  }
};

// API functions for Pools
export const poolsAPI = {
  getAllPools: () => {
    return makeRequest('/pools');
  },
  
  getPoolById: (id) => {
    return makeRequest(`/pools/${id}`);
  },
  
  createPool: (poolData) => {
    return makeRequest('/pools', {
      method: 'POST',
      body: JSON.stringify(poolData)
    });
  },
  
  updatePool: (id, updates) => {
    return makeRequest(`/pools/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },
  
  deletePool: (id) => {
    return makeRequest(`/pools/${id}`, {
      method: 'DELETE'
    });
  },
  
  joinPool: (inviteCode) => {
    return makeRequest('/pools/join', {
      method: 'POST',
      body: JSON.stringify({ inviteCode })
    });
  },
  
  leavePool: (poolId) => {
    return makeRequest(`/pools/${poolId}/leave`, {
      method: 'POST'
    });
  },
  
  getPoolMembers: (poolId) => {
    return makeRequest(`/pools/${poolId}/members`);
  },
  
  getPoolTransactions: (poolId) => {
    return makeRequest(`/pools/${poolId}/transactions`);
  }
};

// API functions for Transactions
export const transactionsAPI = {
  createTransaction: (poolId, transactionData) => {
    return makeRequest(`/pools/${poolId}/transactions`, {
      method: 'POST',
      body: JSON.stringify(transactionData)
    });
  },
  
  updateTransaction: (transactionId, updates) => {
    return makeRequest(`/transactions/${transactionId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },
  
  deleteTransaction: (transactionId) => {
    return makeRequest(`/transactions/${transactionId}`, {
      method: 'DELETE'
    });
  },
  
  getUserTransactions: () => {
    return makeRequest('/transactions/user');
  }
};

// API functions for User
export const userAPI = {
  getUserProfile: () => {
    return makeRequest('/user/profile');
  },
  
  updateUserProfile: (updates) => {
    return makeRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },
  
  changePassword: (currentPassword, newPassword) => {
    return makeRequest('/user/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  }
};

// Export all API functions
export const api = {
  auth: authAPI,
  pools: poolsAPI,
  transactions: transactionsAPI,
  user: userAPI
};

export default api;