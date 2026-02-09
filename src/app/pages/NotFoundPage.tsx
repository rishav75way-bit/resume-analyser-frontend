import React from 'react';
import { Link } from 'react-router-dom';
import { FileSearch, Home } from 'lucide-react';
import { ROUTES,  } from '../utils/constants';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export const NotFoundPage: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <Card className="max-w-md w-full text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col items-center">
                    <div className="p-4 rounded-full bg-slate-800/50 mb-6">
                        <FileSearch size={64} className="text-slate-400" />
                    </div>
                    <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                    <h2 className="text-2xl font-semibold text-slate-300 mb-3">Page Not Found</h2>
                    <p className="text-slate-400 mb-8 max-w-sm">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                    <Link to={ROUTES.DASHBOARD}>
                        <Button icon={<Home size={20} />} className="w-full sm:w-auto">
                            Go to Dashboard
                        </Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
};
