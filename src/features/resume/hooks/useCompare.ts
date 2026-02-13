import { useState, useCallback, useEffect } from 'react';
import { AxiosError } from 'axios';
import apiClient from '../../../app/api/client';
import { API_ROUTES } from '../../../app/utils/constants';
import type { ResumeAnalysis, HistoryResponse } from '../../../app/types';

interface BackendError {
    message: string;
}

export const useCompare = () => {
    const [history, setHistory] = useState<ResumeAnalysis[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHistoryForCompare = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get<HistoryResponse>(API_ROUTES.RESUME.HISTORY, {
                params: { page: 1, limit: 30 },
            });
            setHistory(response.data.data);
        } catch (err) {
            const axiosError = err as AxiosError<BackendError>;
            setError(axiosError.response?.data?.message || axiosError.message || 'Failed to fetch history');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistoryForCompare();
    }, [fetchHistoryForCompare]);

    return { history, isLoading, error, refetch: fetchHistoryForCompare };
};
