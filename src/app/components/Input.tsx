import React from 'react';
import { INPUT_BASE_STYLES, INPUT_ERROR_STYLES, INPUT_NORMAL_STYLES, LABEL_STYLES, ERROR_TEXT_STYLES, FORM_CONTAINER_STYLES } from '../utils/styles';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
    const borderStyles = error ? INPUT_ERROR_STYLES : INPUT_NORMAL_STYLES;

    return (
        <div className={FORM_CONTAINER_STYLES}>
            {label && <label className={LABEL_STYLES}>{label}</label>}
            <input
                className={`${INPUT_BASE_STYLES} ${borderStyles} ${className}`}
                {...props}
            />
            {error && <span className={ERROR_TEXT_STYLES}>{error}</span>}
        </div>
    );
};
