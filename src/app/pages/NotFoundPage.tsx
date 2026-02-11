import React from 'react';
import { Link } from 'react-router-dom';
import { FileSearch, Home } from 'lucide-react';
import { ROUTES } from '../utils/constants';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export const NotFoundPage: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <Card className="max-w-lg w-full text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col items-center py-4">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-800/40 border border-slate-700/60 mb-8 shadow-2xl">
                        <FileSearch size={72} className="text-slate-400" />
                    </div>
                    <h1 className="text-8xl font-extrabold bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent mb-4 tracking-tight">404</h1>
                    <h2 className="text-3xl font-bold text-slate-200 mb-4 tracking-tight">Page Not Found</h2>
                    <p className="text-slate-400 mb-10 max-w-sm text-base leading-relaxed font-medium">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                    <Link to={ROUTES.DASHBOARD}>
                        <Button icon={<Home size={20} />} className="w-full sm:w-auto px-8 py-3 text-base">
                            Go to Dashboard
                        </Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
};
