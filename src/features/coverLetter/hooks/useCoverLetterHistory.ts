import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';
import apiClient from '../../../app/api/client';
import { API_ROUTES } from '../../../app/utils/constants';
import type { CoverLetter, CoverLetterHistoryResponse, PaginationInfo } from '../../../app/types';

interface BackendError {
    message: string;
}

export const useCoverLetterHistory = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<CoverLetter[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchHistory = useCallback(async (page: number = 1, limit: number = 10, append: boolean = false) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get<CoverLetterHistoryResponse>(API_ROUTES.COVER_LETTER.HISTORY, {
                params: { page, limit },
            });
            if (append && response.data.pagination) {
                setHistory((prev) => [...prev, ...response.data.data]);
            } else {
                setHistory(response.data.data);
            }
            if (response.data.pagination) {
                setPagination(response.data.pagination);
            }
        } catch (err) {
            const axiosError = err as AxiosError<BackendError>;
            setError(axiosError.response?.data?.message || axiosError.message || 'Failed to fetch cover letter history');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteCoverLetter = useCallback(async (coverLetterId: string) => {
        setError(null);
        setDeletingId(coverLetterId);
        try {
            await apiClient.delete(API_ROUTES.COVER_LETTER.HISTORY_ITEM(coverLetterId));
            setHistory((prev) => prev.filter((item) => item._id !== coverLetterId));
            setPagination((prev) =>
                prev ? { ...prev, total: Math.max(0, prev.total - 1) } : null
            );
            return true;
        } catch (err) {
            const axiosError = err as AxiosError<BackendError>;
            setError(axiosError.response?.data?.message || axiosError.message || 'Failed to delete cover letter');
            return false;
        } finally {
            setDeletingId(null);
        }
    }, []);

    useEffect(() => {
        fetchHistory(1, 10, false);
    }, [fetchHistory]);

    return { history, pagination, isLoading, error, fetchHistory, deleteCoverLetter, deletingId };
};
