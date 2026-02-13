import React, { useEffect, useState } from 'react';
import { FileDown, FileText } from 'lucide-react';
import { useResumeAnalysis } from '../hooks/useResumeAnalysis';
import { useCoverLetterHistory } from '../../coverLetter/hooks/useCoverLetterHistory';
import { LABELS } from '../../../app/utils/constants';
import { Card } from '../../../app/components/Card';
import { Button } from '../../../app/components/Button';
import { Spinner } from '../../../app/components/Spinner';
import { RESUME_TEMPLATES, type ResumeTemplateId } from '../../../app/utils/resumeTemplates';
import { exportResumeToPdf, exportResumeToDocx } from '../../../app/utils/formattedResumeExport';
import type { ResumeAnalysis } from '../../../app/types';
import type { CoverLetter } from '../../../app/types';

type ExportFormat = 'pdf' | 'docx';

export const DownloadResumePage: React.FC = () => {
    const { fetchHistory, history, isLoading: resumeLoading } = useResumeAnalysis();
    const { fetchHistory: fetchCoverLetters, history: coverLetters, isLoading: coverLoading } = useCoverLetterHistory();
    const [selectedResume, setSelectedResume] = useState<ResumeAnalysis | null>(null);
    const [templateId, setTemplateId] = useState<ResumeTemplateId>('professional');
    const [format, setFormat] = useState<ExportFormat>('pdf');
    const [includeCoverLetter, setIncludeCoverLetter] = useState(false);
    const [selectedCoverLetter, setSelectedCoverLetter] = useState<CoverLetter | null>(null);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        fetchHistory(1, 20, false);
    }, [fetchHistory]);
    useEffect(() => {
        fetchCoverLetters(1, 20, false);
    }, [fetchCoverLetters]);

    const handleDownload = async () => {
        if (!selectedResume) return;
        setExporting(true);
        try {
            const coverText = includeCoverLetter && selectedCoverLetter ? selectedCoverLetter.coverLetter : undefined;
            if (format === 'pdf') {
                exportResumeToPdf(selectedResume.resumeText, templateId, coverText);
            } else {
                await exportResumeToDocx(selectedResume.resumeText, templateId, coverText);
            }
        } finally {
            setExporting(false);
        }
    };

    const isEmpty = history.length === 0;
    const canDownload = selectedResume && !exporting;

    return (
        <div className="max-w-3xl mx-auto flex flex-col gap-10">
            <div className="mb-4">
                <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                    {LABELS.DOWNLOAD_RESUME_TITLE}
                </h1>
                <p className="text-lg text-slate-400 font-medium">{LABELS.DOWNLOAD_RESUME_DESCRIPTION}</p>
            </div>

            <Card>
                {(resumeLoading || coverLoading) && history.length === 0 ? (
                    <div className="flex justify-center py-12">
                        <Spinner />
                    </div>
                ) : isEmpty ? (
                    <div className="py-12 text-center">
                        <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 w-fit mx-auto mb-4">
                            <FileText size={48} className="text-slate-400" />
                        </div>
                        <p className="text-slate-300 font-medium">{LABELS.NO_RESUME_HISTORY}</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        <div>
                            <label className="text-sm font-semibold text-slate-200 mb-2 block">
                                {LABELS.SELECT_RESUME_TO_EXPORT}
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto">
                                {history.map((analysis) => (
                                    <button
                                        key={analysis._id}
                                        type="button"
                                        onClick={() => setSelectedResume(analysis)}
                                        className={`p-4 rounded-xl text-left border transition-all duration-300 ${
                                            selectedResume?._id === analysis._id
                                                ? 'bg-primary-500/20 border-primary-500/50 text-primary-200'
                                                : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-slate-600'
                                        }`}
                                    >
                                        <span className="text-xs font-medium text-slate-400 block mb-1">
                                            {new Date(analysis.createdAt).toLocaleDateString()}
                                        </span>
                                        <p className="text-sm line-clamp-2">{analysis.resumeText.substring(0, 120)}...</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-200 mb-2 block">{LABELS.SELECT_TEMPLATE}</label>
                            <select
                                value={templateId}
                                onChange={(e) => setTemplateId(e.target.value as ResumeTemplateId)}
                                className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/60 focus:border-primary-500"
                            >
                                {RESUME_TEMPLATES.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name} – {t.description}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-200 mb-2 block">{LABELS.EXPORT_FORMAT}</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="format"
                                        value="pdf"
                                        checked={format === 'pdf'}
                                        onChange={() => setFormat('pdf')}
                                        className="text-primary-500 focus:ring-primary-500"
                                    />
                                    <span className="text-slate-200">{LABELS.FORMAT_PDF}</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="format"
                                        value="docx"
                                        checked={format === 'docx'}
                                        onChange={() => setFormat('docx')}
                                        className="text-primary-500 focus:ring-primary-500"
                                    />
                                    <span className="text-slate-200">{LABELS.FORMAT_DOCX}</span>
                                </label>
                            </div>
                        </div>

                        <div className="border-t border-slate-700/60 pt-6">
                            <label className="flex items-center gap-2 cursor-pointer mb-3">
                                <input
                                    type="checkbox"
                                    checked={includeCoverLetter}
                                    onChange={(e) => {
                                        setIncludeCoverLetter(e.target.checked);
                                        if (!e.target.checked) setSelectedCoverLetter(null);
                                    }}
                                    className="rounded border-slate-600 text-primary-500 focus:ring-primary-500"
                                />
                                <span className="text-slate-200 font-medium">{LABELS.INCLUDE_COVER_LETTER}</span>
                            </label>
                            {includeCoverLetter && (
                                <div className="mt-2">
                                    <label className="text-sm text-slate-400 mb-2 block">{LABELS.SELECT_COVER_LETTER}</label>
                                    {coverLetters.length === 0 ? (
                                        <p className="text-sm text-slate-500">{LABELS.NO_COVER_LETTERS_OPTIONAL}</p>
                                    ) : (
                                        <select
                                            value={selectedCoverLetter?._id ?? ''}
                                            onChange={(e) => {
                                                const id = e.target.value;
                                                setSelectedCoverLetter(coverLetters.find((c) => c._id === id) ?? null);
                                            }}
                                            className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/60"
                                        >
                                            <option value="">— Select one —</option>
                                            {coverLetters.map((c) => (
                                                <option key={c._id} value={c._id}>
                                                    {new Date(c.createdAt).toLocaleDateString()} – {c.coverLetter.substring(0, 50)}...
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            )}
                        </div>

                        <Button
                            onClick={handleDownload}
                            disabled={!canDownload}
                            isLoading={exporting}
                            icon={<FileDown size={18} />}
                            className="w-full sm:w-auto"
                        >
                            {exporting ? 'Preparing…' : LABELS.DOWNLOAD}
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
};
