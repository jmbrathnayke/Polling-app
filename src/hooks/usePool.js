import { useContext } from 'react';
import { PoolContext } from '../context/PoolContext.js';
import { useNotification } from './useNotification';

export const usePool = () => {
  const context = useContext(PoolContext);
  const { error } = useNotification();
  
  if (!context) {
    throw new Error('usePool must be used within a PoolProvider');
  }
  
  // Enhanced methods with error handling
  const createPoolWithNotification = async (poolData) => {
    try {
      return await context.createPool(poolData);
    } catch (err) {
      error(err.message || 'Failed to create pool');
      throw err;
    }
  };
  
  const updatePoolWithNotification = async (poolId, updates) => {
    try {
      return await context.updatePool(poolId, updates);
    } catch (err) {
      error(err.message || 'Failed to update pool');
      throw err;
    }
  };
  
  const deletePoolWithNotification = async (poolId) => {
    try {
      await context.deletePool(poolId);
    } catch (err) {
      error(err.message || 'Failed to delete pool');
      throw err;
    }
  };
  
  const joinPoolWithNotification = async (inviteCode) => {
    try {
      return await context.joinPool(inviteCode);
    } catch (err) {
      error(err.message || 'Failed to join pool');
      throw err;
    }
  };
  
  return {
    ...context,
    createPool: createPoolWithNotification,
    updatePool: updatePoolWithNotification,
    deletePool: deletePoolWithNotification,
    joinPool: joinPoolWithNotification
  };
};