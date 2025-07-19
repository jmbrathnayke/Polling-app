import { createContext, useState, useCallback } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  
  // Add notification
  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now();
    
    setNotifications(prev => [
      ...prev,
      { id, message, type, duration }
    ]);
    
    // Auto remove notification after duration
    setTimeout(() => {
      removeNotification(id);
    }, duration);
    
    return id;
  }, []);
  
  // Remove notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);
  
  // Helper functions for different notification types
  const success = useCallback((message, duration) => {
    return addNotification(message, 'success', duration);
  }, [addNotification]);
  
  const error = useCallback((message, duration) => {
    return addNotification(message, 'error', duration);
  }, [addNotification]);
  
  const warning = useCallback((message, duration) => {
    return addNotification(message, 'warning', duration);
  }, [addNotification]);
  
  const info = useCallback((message, duration) => {
    return addNotification(message, 'info', duration);
  }, [addNotification]);
  
  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      success,
      error,
      warning,
      info
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

// src/context/ThemeContext.js
import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  
  // On mount, check for saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('pooling_app_theme');
    
    // Check saved preference, then system preference
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);
  
  // Update theme when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pooling_app_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pooling_app_theme', 'light');
    }
  }, [darkMode]);
  
  // Toggle theme
  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };
  
  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};