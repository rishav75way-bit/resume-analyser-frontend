import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import apiClient from '../../../app/api/client';
import { API_ROUTES, ROUTES, LABELS } from '../../../app/utils/constants';
import { setCredentials } from '../../../app/store/slices/authSlice';
import type { AuthResponse } from '../../../app/types';
import type { LoginFormData, RegisterFormData } from '../schemas';

interface BackendError {
    message: string;
}

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleAuth = async (
        data: LoginFormData | RegisterFormData,
        path: string,
        redirectPath: string
    ) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.post<AuthResponse>(path, data);
            const { user, token } = response.data.data;
            dispatch(setCredentials({ user, token }));
            navigate(redirectPath);
        } catch (err) {
            const axiosError = err as AxiosError<BackendError>;
            const message = axiosError.response?.data?.message || axiosError.message || LABELS.AUTH_FAILED;
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const login = (data: LoginFormData) => handleAuth(data, API_ROUTES.AUTH.LOGIN, ROUTES.DASHBOARD);
    const register = (data: RegisterFormData) => handleAuth(data, API_ROUTES.AUTH.REGISTER, ROUTES.DASHBOARD);

    return { login, register, isLoading, error };
};
