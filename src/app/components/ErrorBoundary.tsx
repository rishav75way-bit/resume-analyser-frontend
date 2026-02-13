import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { ROUTES } from '../utils/constants';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        if (process.env.NODE_ENV === 'development') {
            console.error('ErrorBoundary caught an error:', error, errorInfo);
        }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = ROUTES.DASHBOARD;
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                    <Card className="max-w-2xl w-full">
                        <div className="flex flex-col items-center text-center">
                            <div className="p-4 rounded-full bg-red-500/20 border border-red-500/30 mb-6">
                                <AlertCircle size={48} className="text-red-400" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-4">Something went wrong</h1>
                            <p className="text-slate-400 mb-6">
                                {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
                            </p>
                            <div className="flex gap-4">
                                <Button onClick={this.handleReset} variant="secondary">
                                    Go to Dashboard
                                </Button>
                                <Button onClick={() => window.location.reload()}>
                                    Reload Page
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}
