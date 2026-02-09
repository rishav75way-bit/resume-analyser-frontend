import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { z } from 'zod';
import type { User } from '../../types';
import { STORAGE_KEYS } from '../../utils/constants';

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

const userSchema = z.object({
    id: z.string(),
    email: z.string().email(),
});

const getInitialState = (): AuthState => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    
    let user: User | null = null;
    if (userJson) {
        try {
            const parsed: unknown = JSON.parse(userJson);
            const validated = userSchema.safeParse(parsed);
            if (validated.success) {
                user = validated.data;
            }
        } catch {
            user = null;
        }
    }

    return {
        user,
        token,
        isAuthenticated: !!token,
    };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; token: string }>
        ) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            localStorage.setItem(STORAGE_KEYS.TOKEN, action.payload.token);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload.user));
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
export default authReducer;
