import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';
import apiClient from '../../../app/api/client';
import { API_ROUTES } from '../../../app/utils/constants';
import type { AnalyticsData, AnalyticsResponse } from '../../../app/types';

interface BackendError {
    message: string;
}

export const useAnalytics = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

    const fetchAnalytics = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get<AnalyticsResponse>(API_ROUTES.RESUME.ANALYTICS);
            setAnalytics(response.data.data);
        } catch (err) {
            const axiosError = err as AxiosError<BackendError>;
            setError(axiosError.response?.data?.message || axiosError.message || 'Failed to fetch analytics');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    return { analytics, isLoading, error, refetch: fetchAnalytics };
};
