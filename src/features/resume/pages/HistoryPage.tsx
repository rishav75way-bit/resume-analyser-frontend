import React, { useEffect, useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { useResumeAnalysis } from '../hooks/useResumeAnalysis';
import { LABELS } from '../../../app/utils/constants';
import { Card } from '../../../app/components/Card';
import { Spinner } from '../../../app/components/Spinner';
import { ErrorMessage } from '../../../app/components/ErrorMessage';
import { HistoryItem } from '../components/HistoryItem';
import { Button } from '../../../app/components/Button';

export const HistoryPage: React.FC = () => {
    const { fetchHistory, history, isLoading, error, pagination } = useResumeAnalysis();
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    useEffect(() => {
        fetchHistory(1, 6, false);
        setCurrentPage(1);
    }, [fetchHistory]);

    const handleLoadMore = async () => {
        if (!pagination?.hasNextPage || isLoadingMore) return;

        setIsLoadingMore(true);
        const nextPage = currentPage + 1;
        await fetchHistory(nextPage, 6, true);
        setCurrentPage(nextPage);
        setIsLoadingMore(false);
    };

    const renderEmptyState = () => (
        <Card className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
                <div className="p-4 rounded-full bg-slate-800/50 mb-4">
                    <FileText size={48} className="text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-300 mb-2">{LABELS.NO_ANALYSIS_HISTORY}</h3>
                <p className="text-slate-400 max-w-md">{LABELS.NO_HISTORY}</p>
            </div>
        </Card>
    );

    const renderHistoryList = () => (
        <div className="flex flex-col gap-6">
            {history.map((analysis, index) => (
                <div key={analysis._id} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 50}ms` }}>
                    <HistoryItem analysis={analysis} />
                </div>
            ))}
        </div>
    );

    const renderPaginationInfo = () => {
        if (!pagination || pagination.total === 0) return null;

        return (
            <div className="text-center text-sm text-slate-400 mb-4">
                {LABELS.SHOWING_ANALYSES} {history.length} {LABELS.OF_ANALYSES} {pagination.total} {LABELS.ANALYSES}
            </div>
        );
    };

    const renderLoadMoreButton = () => {
        if (!pagination?.hasNextPage || history.length === 0) return null;

        return (
            <div className="flex justify-center mt-6">
                <Button
                    onClick={handleLoadMore}
                    isLoading={isLoadingMore}
                    disabled={isLoadingMore || !pagination.hasNextPage}
                    variant="secondary"
                    icon={isLoadingMore ? <Loader2 size={18} className="animate-spin" /> : undefined}
                >
                    {isLoadingMore ? LABELS.LOADING : LABELS.LOAD_MORE}
                </Button>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <div className="mb-2">
                <h1 className="text-4xl font-bold text-white mb-2">{LABELS.HISTORY}</h1>
                <p className="text-slate-400">{LABELS.VIEW_PAST_ANALYSES}</p>
            </div>

            {isLoading && history.length === 0 && (
                <div className="flex justify-center py-12">
                    <Spinner />
                </div>
            )}

            {error && <ErrorMessage message={error} />}

            {!isLoading && history.length === 0 && !error && renderEmptyState()}

            {history.length > 0 && (
                <>
                    {renderPaginationInfo()}
                    {renderHistoryList()}
                    {renderLoadMoreButton()}
                </>
            )}
        </div>
    );
};
