export interface User {
  id: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  expires_in: number;
  token_type: string;
  user: User;
}

export interface LoginResponse {
  message: string;
  session: Session;
  user: User;
}

export interface ApiError {
  message: string;
  error?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
