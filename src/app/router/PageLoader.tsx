import React from 'react';
import { Spinner } from '../components/Spinner';

export const PageLoader: React.FC = () => {
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <Spinner size="lg" />
        </div>
    );
};
