import { useState, useCallback } from 'react';

export const useForm = (initialValues = {}, validate = () => ({})) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);
  
  // Set form values
  const setFormValues = useCallback((newValues) => {
    setValues(newValues);
  }, []);
  
  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);
  
  // Handle blur events for field-level validation
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    const validationErrors = validate(values);
    setErrors(validationErrors);
  }, [values, validate]);
  
  // Handle form submission
  const handleSubmit = useCallback(async (onSubmit) => {
    return async (e) => {
      if (e) e.preventDefault();
      
      // Mark all fields as touched
      const touchedFields = Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      
      setTouched(touchedFields);
      
      // Validate
      const validationErrors = validate(values);
      setErrors(validationErrors);
      
      // Only submit if no errors
      if (Object.keys(validationErrors).length === 0) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } catch (error) {
          // Handle submission errors
          console.error(error);
        } finally {
          setIsSubmitting(false);
        }
      }
    };
  }, [values, validate]);
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFormValues
  };
};

// src/hooks/useFetch.js
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shouldRefetch, setShouldRefetch] = useState(0);
  const { isAuthenticated } = useAuth();
  
  // Add auth token to headers if user is authenticated
  const getHeaders = () => {
    const headers = { ...options.headers };
    
    if (isAuthenticated) {
      const token = localStorage.getItem('pooling_app_token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return headers;
  };
  
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Trigger a refetch
  const refetch = () => {
    setShouldRefetch(prev => prev + 1);
  };
  
  useEffect(() => {
    // Don't fetch if URL is not provided
    if (!url) return;
    
    fetchData();
  }, [url, shouldRefetch]);
  
  return { data, isLoading, error, refetch };
};

// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  
  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  
  // Listen for changes to this local storage key in other tabs/windows
  useEffect(() => {
    function handleStorageChange(e) {
      if (e.key === key && e.newValue !== e.oldValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(error);
        }
      }
    }
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);
  
  return [storedValue, setValue];
};

// src/hooks/useNotification.js
import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

export const useNotification = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  
  return context;
};