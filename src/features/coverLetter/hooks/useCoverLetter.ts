import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import apiClient from '../../../app/api/client';
import { API_ROUTES } from '../../../app/utils/constants';

interface BackendError {
    message: string;
}

import type { CoverLetter } from '../../../app/types';

interface CoverLetterResponse {
    success: boolean;
    message?: string;
    data: CoverLetter;
}

export const useCoverLetter = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [coverLetter, setCoverLetter] = useState<string | null>(null);
    const [coverLetterData, setCoverLetterData] = useState<CoverLetter | null>(null);

    const generateCoverLetter = useCallback(async (resumeText: string, jobDescription?: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.post<CoverLetterResponse>(API_ROUTES.COVER_LETTER.GENERATE, {
                resumeText,
                jobDescription: jobDescription || undefined,
            });
            setCoverLetter(response.data.data.coverLetter);
            setCoverLetterData(response.data.data);
            return response.data.data.coverLetter;
        } catch (err) {
            const axiosError = err as AxiosError<BackendError>;
            setError(axiosError.response?.data?.message || axiosError.message || 'Failed to generate cover letter');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setCoverLetter(null);
        setCoverLetterData(null);
        setError(null);
    }, []);

    return { generateCoverLetter, coverLetter, coverLetterData, isLoading, error, reset };
};
