// API Configuration
export const API_CONFIG = {
  // Change this to your backend server URL
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  
  // Timeout settings
  TIMEOUT: 10000,
  
  // Retry settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
}

// Environment check
export const isDevelopment = process.env.NODE_ENV === 'development'
export const isProduction = process.env.NODE_ENV === 'production'
