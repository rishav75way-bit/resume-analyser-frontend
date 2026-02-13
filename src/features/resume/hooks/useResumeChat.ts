import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import apiClient from '../../../app/api/client';
import { API_ROUTES } from '../../../app/utils/constants';

interface BackendError {
    message: string;
}

interface ChatResponse {
    success: boolean;
    message: string;
    data: {
        answer: string;
        updatedResume?: string;
    };
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    updatedResume?: string;
}

export const useResumeChat = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const sendMessage = useCallback(async (resumeText: string, question: string) => {
        setIsLoading(true);
        setError(null);

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: question,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);

        try {
            const response = await apiClient.post<ChatResponse>(API_ROUTES.RESUME.CHAT, {
                resumeText,
                question,
            });

            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.data.data.answer,
                timestamp: new Date(),
                updatedResume: response.data.data.updatedResume,
            };

            setMessages((prev) => [...prev, assistantMessage]);
            return assistantMessage;
        } catch (err) {
            const axiosError = err as AxiosError<BackendError>;
            const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Failed to get chat response';
            setError(errorMessage);
            
            const errorMessageObj: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `Error: ${errorMessage}`,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessageObj]);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearMessages = useCallback(() => {
        setMessages([]);
        setError(null);
    }, []);

    return { sendMessage, messages, isLoading, error, clearMessages };
};
