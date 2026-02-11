import React, { useState } from 'react';
import { Clock, ChevronDown, ChevronUp, Trash2, FileDown } from 'lucide-react';
import { AnalysisResult } from './AnalysisResult';
import { Card } from '../../../app/components/Card';
import { Button } from '../../../app/components/Button';
import { ConfirmModal } from '../../../app/components/ConfirmModal';
import { LABELS } from '../../../app/utils/constants';
import { exportAnalysisToPdf } from '../../../app/utils/pdfExport';
import type { ResumeAnalysis } from '../../../app/types';

interface HistoryItemProps {
    analysis: ResumeAnalysis;
    onDelete: (analysisId: string) => Promise<boolean>;
    isDeleting: boolean;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ analysis, onDelete, isDeleting }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);

    const confirmDelete = async () => {
        const ok = await onDelete(analysis._id);
        if (ok) {
            closeDeleteModal();
        }
    };

    const formattedDate = new Date(analysis.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const formattedTime = new Date(analysis.createdAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <>
            <Card className="hover:scale-[1.01] hover:shadow-primary-500/5 transition-all duration-300">
                <div className="flex items-center justify-between mb-5 pb-5 border-b border-slate-800/60">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/10 border border-primary-500/30 shadow-lg">
                            <Clock size={18} className="text-primary-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-200 mb-1">{formattedDate}</p>
                            <p className="text-xs text-slate-400 font-medium">{formattedTime}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => exportAnalysisToPdf(analysis.aiResult)}
                            className="text-sm gap-1.5 hover:bg-slate-800/50"
                            icon={<FileDown size={16} />}
                        >
                            <span className="hidden sm:inline">{LABELS.EXPORT_PDF}</span>
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={openDeleteModal}
                            disabled={isDeleting}
                            className="text-sm gap-1.5 hover:bg-red-500/10 text-slate-400 hover:text-red-400"
                            icon={<Trash2 size={16} />}
                        >
                            <span className="hidden sm:inline">{LABELS.DELETE}</span>
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-sm gap-1.5 hover:bg-slate-800/50"
                        >
                            {isExpanded ? (
                                <>
                                    <ChevronUp size={16} />
                                    <span className="hidden sm:inline">{LABELS.HIDE_ANALYSIS}</span>
                                </>
                            ) : (
                                <>
                                    <ChevronDown size={16} />
                                    <span className="hidden sm:inline">{LABELS.VIEW_ANALYSIS}</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
                <div className="mb-5 p-5 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-800/30 border border-slate-700/50 shadow-inner">
                    <p className={`text-slate-200 text-sm leading-relaxed font-medium ${isExpanded ? '' : 'line-clamp-3'}`}>
                        "{analysis.resumeText}"
                    </p>
                </div>
                {isExpanded && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <AnalysisResult result={analysis.aiResult} />
                    </div>
                )}
            </Card>
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title={LABELS.DELETE_TITLE}
                message={LABELS.CONFIRM_DELETE}
                confirmLabel={LABELS.CONFIRM}
                cancelLabel={LABELS.CANCEL}
                isConfirmLoading={isDeleting}
                onConfirm={confirmDelete}
                onCancel={closeDeleteModal}
            />
        </>
    );
};
