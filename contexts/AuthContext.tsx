import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { authService } from '../services/authService';
import { AuthState, LoginCredentials, User } from '../types/auth';

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; accessToken: string; refreshToken: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_SESSION'; payload: { user: User; accessToken: string; refreshToken: string } };

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,
  isAuthenticated: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isLoading: false,
        isAuthenticated: true,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'RESTORE_SESSION':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isLoading: false,
        isAuthenticated: true,
      };
    default:
      return state;
  }
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for existing session on app start
    const checkExistingSession = async () => {
      try {
        const { accessToken, refreshToken } = await authService.getStoredTokens();
        const userData = await authService.getStoredUserData();

        if (accessToken && refreshToken && userData) {
          dispatch({
            type: 'RESTORE_SESSION',
            payload: { user: userData, accessToken, refreshToken },
          });
        } else {
          dispatch({ type: 'LOGIN_FAILURE', payload: 'No existing session' });
        }
      } catch (error) {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Failed to restore session' });
      }
    };

    checkExistingSession();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authService.login(credentials);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.user,
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
        },
      });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error instanceof Error ? error.message : 'Login failed' });
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

