//Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation
export const isStrongPassword = (password) => {
  // At least 8 characters, with numbers and letters
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
};

// Phone number validation (US format)
export const isValidPhone = (phone) => {
  const phoneRegex = /^\D*(\d\D*){10}$/; // Extracts 10 digits
  return phoneRegex.test(phone);
};

// Username validation (alphanumeric, underscores, 3-20 chars)
export const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

// Required field validation
export const required = (value) => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return value !== undefined && value !== null && value.trim() !== '';
};

// Min length validation
export const minLength = (min) => (value) => {
  if (!value) return false;
  return value.length >= min;
};

// Max length validation
export const maxLength = (max) => (value) => {
  if (!value) return true;
  return value.length <= max;
};

// Numeric value validation
export const isNumber = (value) => {
  if (!value) return false;
  return !isNaN(parseFloat(value)) && isFinite(value);
};

// Positive number validation
export const isPositiveNumber = (value) => {
  if (!isNumber(value)) return false;
  return parseFloat(value) > 0;
};

// Matching values validation (e.g., password confirmation)
export const matches = (field) => (value, data) => {
  return value === data[field];
};

// Form validation helper function
export const validateForm = (values, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(field => {
    const fieldRules = validationRules[field];
    
    for (let i = 0; i < fieldRules.length; i++) {
      const rule = fieldRules[i];
      
      if (!rule.validator(values[field], values)) {
        errors[field] = rule.message;
        break;
      }
    }
  });
  
  return errors;
};