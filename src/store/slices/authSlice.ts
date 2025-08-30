import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, UserDetails } from '@/types/types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<UserDetails>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoggedOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    updateUserDp: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.dp = action.payload;
      }
    },
  },
});

export const { setAuthenticated, setLoading, setError, clearError, setLoggedOut,updateUserDp } = authSlice.actions;
export default authSlice.reducer;
