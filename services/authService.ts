import * as SecureStore from 'expo-secure-store';
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants/api';
import { LoginCredentials, LoginResponse } from '../types/auth';

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      console.log('Attempting login with:', credentials);
      console.log('API endpoint:', API_ENDPOINTS.LOGIN);
      
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY3Z4bnRvbW1pdnZuZHhxZW16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MTgxNjgsImV4cCI6MjA2NDE5NDE2OH0.-PGlQ9dBjQJ-X1pX62rghrhiK6P_Hki8KYg5bSfUDmc',
        },
        body: JSON.stringify(credentials),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Error response:', errorData);
        
        // Gestion spécifique des erreurs 401 (credentials invalides)
        if (response.status === 401) {
          throw new Error('Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.');
        }
        
        // Gestion des autres erreurs
        const errorMessage = errorData.message || errorData.error || `Erreur de connexion (${response.status})`;
        throw new Error(errorMessage);
      }

      const data: LoginResponse = await response.json();
      console.log('Login successful - Raw response data:', data);
      console.log('Session access token type:', typeof data.session?.access_token);
      console.log('Session refresh token type:', typeof data.session?.refresh_token);
      console.log('User data type:', typeof data.user);
      
      // Store tokens securely - utiliser la structure session
      await this.storeTokens(data.session?.access_token, data.session?.refresh_token);
      await this.storeUserData(data.user);
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async getStoredTokens(): Promise<{ accessToken: string | null; refreshToken: string | null }> {
    try {
      const accessToken = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
      const refreshToken = await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
      
      console.log('Retrieved tokens from storage:');
      console.log('Access token exists:', !!accessToken);
      console.log('Access token preview:', accessToken ? accessToken.substring(0, 20) + '...' : 'null');
      console.log('Refresh token exists:', !!refreshToken);
      
      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Error retrieving tokens:', error);
      return { accessToken: null, refreshToken: null };
    }
  }

  async getStoredUserData(): Promise<any> {
    try {
      const userData = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting stored user data:', error);
      return null;
    }
  }

  private async storeTokens(accessToken: any, refreshToken: any): Promise<void> {
    console.log('Storing tokens - Access token:', accessToken);
    console.log('Storing tokens - Refresh token:', refreshToken);
    
    // Convertir en chaînes de caractères si nécessaire
    const accessTokenString = String(accessToken);
    const refreshTokenString = String(refreshToken);
    
    console.log('Converted access token:', accessTokenString);
    console.log('Converted refresh token:', refreshTokenString);
    
    await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, accessTokenString);
    await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, refreshTokenString);
  }

  private async storeUserData(user: any): Promise<void> {
    console.log('Storing user data:', user);
    // S'assurer que les données utilisateur sont sérialisées en JSON string
    const userDataString = JSON.stringify(user);
    console.log('Serialized user data:', userDataString);
    await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, userDataString);
  }
}

export const authService = new AuthService();
