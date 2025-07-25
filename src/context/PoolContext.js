import { createContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  pools: [],
  currentPool: null,
  isLoading: false,
  error: null
};

// Pool reducer
const poolReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_POOLS_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_POOLS_SUCCESS':
      return { 
        ...state, 
        isLoading: false, 
        pools: action.payload,
        error: null 
      };
    case 'FETCH_POOLS_FAILURE':
      return { 
        ...state, 
        isLoading: false, 
        error: action.payload 
      };
    case 'SET_CURRENT_POOL':
      return { 
        ...state, 
        currentPool: action.payload 
      };
    case 'CREATE_POOL_SUCCESS':
      return { 
        ...state, 
        pools: [...state.pools, action.payload],
        currentPool: action.payload
      };
    case 'UPDATE_POOL_SUCCESS':
      return { 
        ...state, 
        pools: state.pools.map(pool => 
          pool.id === action.payload.id ? action.payload : pool
        ),
        currentPool: state.currentPool?.id === action.payload.id 
          ? action.payload 
          : state.currentPool
      };
    case 'DELETE_POOL_SUCCESS':
      return { 
        ...state, 
        pools: state.pools.filter(pool => pool.id !== action.payload),
        currentPool: state.currentPool?.id === action.payload ? null : state.currentPool
      };
    case 'JOIN_POOL_SUCCESS':
      return {
        ...state,
        pools: [...state.pools, action.payload],
        currentPool: action.payload
      };
    default:
      return state;
  }
};

// Create context
export const PoolContext = createContext();

export const PoolProvider = ({ children }) => {
  const [state, dispatch] = useReducer(poolReducer, initialState);
  
  // Load user's pools on mount
  useEffect(() => {
    const loadPools = async () => {
      const token = localStorage.getItem('pooling_app_token');
      if (!token) return;
      
      try {
        dispatch({ type: 'FETCH_POOLS_START' });
        
        const response = await fetch('/api/pools', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch pools');
        }
        
        const data = await response.json();
        dispatch({ type: 'FETCH_POOLS_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_POOLS_FAILURE', payload: error.message });
      }
    };
    
    loadPools();
  }, []);
  
  // Set current pool
  const setCurrentPool = (poolId) => {
    const pool = state.pools.find(p => p.id === poolId);
    dispatch({ type: 'SET_CURRENT_POOL', payload: pool });
  };
  
  // Create new pool
  const createPool = async (poolData) => {
    const token = localStorage.getItem('pooling_app_token');
    
    try {
      const response = await fetch('/api/pools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(poolData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create pool');
      }
      
      const newPool = await response.json();
      dispatch({ type: 'CREATE_POOL_SUCCESS', payload: newPool });
      return newPool;
    } catch (error) {
      throw error;
    }
  };
  
  // Update pool
  const updatePool = async (poolId, updates) => {
    const token = localStorage.getItem('pooling_app_token');
    
    try {
      const response = await fetch(`/api/pools/${poolId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update pool');
      }
      
      const updatedPool = await response.json();
      dispatch({ type: 'UPDATE_POOL_SUCCESS', payload: updatedPool });
      return updatedPool;
    } catch (error) {
      throw error;
    }
  };
  
  // Delete pool
  const deletePool = async (poolId) => {
    const token = localStorage.getItem('pooling_app_token');
    
    try {
      const response = await fetch(`/api/pools/${poolId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete pool');
      }
      
      dispatch({ type: 'DELETE_POOL_SUCCESS', payload: poolId });
    } catch (error) {
      throw error;
    }
  };
  
  // Join pool with invite code
  const joinPool = async (inviteCode) => {
    const token = localStorage.getItem('pooling_app_token');
    
    try {
      const response = await fetch('/api/pools/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ inviteCode })
      });
      
      if (!response.ok) {
        throw new Error('Failed to join pool');
      }
      
      const joinedPool = await response.json();
      dispatch({ type: 'JOIN_POOL_SUCCESS', payload: joinedPool });
      return joinedPool;
    } catch (error) {
      throw error;
    }
  };
  
  return (
    <PoolContext.Provider value={{
      ...state,
      setCurrentPool,
      createPool,
      updatePool,
      deletePool,
      joinPool
    }}>
      {children}
    </PoolContext.Provider>
  );
};