export const API_BASE_URL = 'https://gbcvxntommivvndxqemz.supabase.co/functions/v1';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login`,
  ORPHANAGE_STATS: `${API_BASE_URL}/orphanage-stats`,
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
} as const;

