import { UserDetails } from "./UserDetails.tpye";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name: string;
}

export interface AuthState {
    user: UserDetails | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}