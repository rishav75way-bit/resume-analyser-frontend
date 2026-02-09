import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/authSlice';
import type { AuthState } from './slices/authSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

export type RootState = {
    auth: AuthState;
};

export type AppDispatch = typeof store.dispatch;
