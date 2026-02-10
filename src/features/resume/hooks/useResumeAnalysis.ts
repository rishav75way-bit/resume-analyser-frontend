import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import apiClient from '../../../app/api/client';
import { API_ROUTES, LABELS } from '../../../app/utils/constants';
import type { AnalysisResponse, HistoryResponse, ResumeAnalysis, PaginationInfo } from '../../../app/types';

interface BackendError {
    message: string;
}

export const useResumeAnalysis = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<ResumeAnalysis[]>([]);
    const [currentAnalysis, setCurrentAnalysis] = useState<ResumeAnalysis | null>(null);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const analyze = async (resumeText: string, jobDescription?: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.post<AnalysisResponse>(API_ROUTES.RESUME.ANALYZE, {
                resumeText,
                jobDescription,
            });
            setCurrentAnalysis(response.data.data);
            return response.data.data;
        } catch (err) {
            const axiosError = err as AxiosError<BackendError>;
            setError(axiosError.response?.data?.message || axiosError.message || LABELS.RESUME_ANALYSIS_FAILED);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const analyzeFromFile = async (file: File, jobDescription?: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('file', file);
            if (jobDescription) {
                formData.append('jobDescription', jobDescription);
            }

            const response = await apiClient.post<AnalysisResponse>(
                API_ROUTES.RESUME.ANALYZE_UPLOAD,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setCurrentAnalysis(response.data.data);
            return response.data.data;
        } catch (err) {
            const axiosError = err as AxiosError<BackendError>;
            setError(axiosError.response?.data?.message || axiosError.message || LABELS.RESUME_ANALYSIS_FAILED);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const fetchHistory = useCallback(async (page: number = 1, limit: number = 6, append: boolean = false) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get<HistoryResponse>(API_ROUTES.RESUME.HISTORY, {
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
            setError(axiosError.response?.data?.message || axiosError.message || LABELS.FETCH_HISTORY_FAILED);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteAnalysis = useCallback(async (analysisId: string) => {
        setError(null);
        setDeletingId(analysisId);
        try {
            await apiClient.delete(API_ROUTES.RESUME.HISTORY_ITEM(analysisId));
            setHistory((prev) => prev.filter((a) => a._id !== analysisId));
            setPagination((prev) =>
                prev ? { ...prev, total: Math.max(0, prev.total - 1) } : null
            );
            return true;
        } catch (err) {
            const axiosError = err as AxiosError<BackendError>;
            setError(axiosError.response?.data?.message || axiosError.message || LABELS.DELETE_FAILED);
            return false;
        } finally {
            setDeletingId(null);
        }
    }, []);

    return { analyze, analyzeFromFile, fetchHistory, deleteAnalysis, deletingId, history, currentAnalysis, isLoading, error, pagination };
};
