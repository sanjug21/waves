
export interface UserDetails {
  _id: string;
  name: string;
  email: string;
  dp?: string;
  bio?: string;
  online?: boolean;
}

export interface AuthState {
  user: UserDetails | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name: string;
}

