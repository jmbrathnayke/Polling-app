// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Name validation
const isValidName = (name) => {
  return name && name.trim().length >= 2;
};

// Generic validation response
const validationError = (message) => ({
  success: false,
  message,
});

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidName,
  validationError,
};
