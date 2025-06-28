export interface User {
  id: number;
  name: string;
  email: string;
  login: string;
  type: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  login: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresIn: string;
}