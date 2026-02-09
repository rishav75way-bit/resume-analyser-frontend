import type React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
    message: string;
    className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = '' }) => {
    if (!message) return null;

    return (
        <div className={`flex items-center gap-2 text-sm text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20 ${className}`}>
            <AlertCircle size={16} />
            <span>{message}</span>
        </div>
    );
};
