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
    const { fetchHistory, deleteAnalysis, deletingId, history, isLoading, error, pagination } = useResumeAnalysis();
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
        <Card className="py-16">
            <div className="flex flex-col items-center justify-center text-center">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-800/40 border border-slate-700/60 mb-6 shadow-xl">
                    <FileText size={56} className="text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-200 mb-3 tracking-tight">{LABELS.NO_ANALYSIS_HISTORY}</h3>
                <p className="text-slate-400 max-w-md text-base leading-relaxed">{LABELS.NO_HISTORY}</p>
            </div>
        </Card>
    );

    const renderHistoryList = () => (
        <div className="flex flex-col gap-6">
            {history.map((analysis, index) => (
                <div key={analysis._id} className="animate-in fade-in slide-in-from-bottom-4">
                    <HistoryItem
                        analysis={analysis}
                        onDelete={deleteAnalysis}
                        isDeleting={deletingId === analysis._id}
                    />
                </div>
            ))}
        </div>
    );

    const renderPaginationInfo = () => {
        if (!pagination || pagination.total === 0) return null;

        return (
            <div className="text-center text-sm text-slate-300 mb-6 font-medium bg-slate-800/40 px-4 py-2.5 rounded-xl border border-slate-700/60 inline-block mx-auto">
                {LABELS.SHOWING_ANALYSES} <span className="text-primary-400 font-bold">{history.length}</span> {LABELS.OF_ANALYSES} <span className="text-primary-400 font-bold">{pagination.total}</span> {LABELS.ANALYSES}
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
        <div className="max-w-5xl mx-auto flex flex-col gap-10">
            <div className="mb-4">
                <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">{LABELS.HISTORY}</h1>
                <p className="text-lg text-slate-400 font-medium">{LABELS.VIEW_PAST_ANALYSES}</p>
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
