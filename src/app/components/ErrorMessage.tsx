import type React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
    message: string;
    className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = '' }) => {
    if (!message) return null;

    return (
        <div className={`flex items-start gap-3 text-sm text-red-400 bg-gradient-to-r from-red-950/40 to-red-900/30 p-4 rounded-xl border border-red-500/30 shadow-lg shadow-red-500/10 ${className}`}>
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">{message}</span>
        </div>
    );
};
