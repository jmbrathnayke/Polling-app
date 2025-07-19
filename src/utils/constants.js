// API Status Codes
export const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  };
  
  // Pool Types
  export const POOL_TYPES = {
    SAVINGS: 'savings',
    INVESTMENT: 'investment',
    EXPENSE: 'expense',
    CHARITABLE: 'charitable',
    OTHER: 'other'
  };
  
  // Transaction Types
  export const TRANSACTION_TYPES = {
    DEPOSIT: 'deposit',
    WITHDRAWAL: 'withdrawal',
    EXPENSE: 'expense',
    TRANSFER: 'transfer',
    FEE: 'fee',
    INTEREST: 'interest',
    OTHER: 'other'
  };
  
  // User Roles
  export const USER_ROLES = {
    ADMIN: 'admin',
    POOL_OWNER: 'pool_owner',
    MEMBER: 'member',
    GUEST: 'guest'
  };
  
  // Payment Methods
  export const PAYMENT_METHODS = {
    CARD: 'card',
    BANK_TRANSFER: 'bank_transfer',
    CASH: 'cash',
    MOBILE_WALLET: 'mobile_wallet',
    OTHER: 'other'
  };
  
  // Notification Types
  export const NOTIFICATION_TYPES = {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error'
  };
  
  // Sort Options
  export const SORT_OPTIONS = {
    DATE_ASC: 'date_asc',
    DATE_DESC: 'date_desc',
    AMOUNT_ASC: 'amount_asc',
    AMOUNT_DESC: 'amount_desc',
    NAME_ASC: 'name_asc',
    NAME_DESC: 'name_desc'
  };
  
  // Time intervals
  export const TIME_INTERVALS = {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    BIWEEKLY: 'biweekly',
    MONTHLY: 'monthly',
    QUARTERLY: 'quarterly',
    YEARLY: 'yearly'
  };
  
  // App routes
  export const ROUTES = {
    HOME: '/',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    POOLS: '/pools',
    POOL_DETAIL: '/pools/:id',
    CREATE_POOL: '/pools/create',
    TRANSACTIONS: '/transactions'
  };
  
  // Local storage keys
  export const STORAGE_KEYS = {
    TOKEN: 'pooling_app_token',
    USER: 'pooling_app_user',
    THEME: 'pooling_app_theme',
    LANGUAGE: 'pooling_app_language'
  };
  
  // Default settings
  export const DEFAULT_SETTINGS = {
    THEME: 'light',
    LANGUAGE: 'en',
    CURRENCY: 'USD',
    NOTIFICATIONS_ENABLED: true
  };
  
  // Pagination
  export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100]
  };