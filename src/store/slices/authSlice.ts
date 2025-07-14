import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {User, AuthState} from '@/models/user.model';

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
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },

        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },

        setUser(state, action: PayloadAction<User | null>) {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
        },

        clearUser(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        }
    },
})

export const { setLoading, setError, setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;