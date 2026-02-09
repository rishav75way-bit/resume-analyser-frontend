import React from 'react';
import { INPUT_BASE_STYLES, INPUT_ERROR_STYLES, INPUT_NORMAL_STYLES, LABEL_STYLES, ERROR_TEXT_STYLES, FORM_CONTAINER_STYLES } from '../utils/styles';

interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    error?: string;
}

export const FileInput: React.FC<FileInputProps> = ({ label, error, className = '', ...props }) => {
    const borderStyles = error ? INPUT_ERROR_STYLES : INPUT_NORMAL_STYLES;

    return (
        <div className={FORM_CONTAINER_STYLES}>
            {label && <label className={LABEL_STYLES}>{label}</label>}
            <input
                type="file"
                className={`${INPUT_BASE_STYLES} ${borderStyles} file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-600 file:text-white hover:file:bg-primary-700 file:cursor-pointer file:transition-colors ${className}`}
                {...props}
            />
            {error && <span className={ERROR_TEXT_STYLES}>{error}</span>}
        </div>
    );
};
