import React, { useState, useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { FileText, Sparkles, FileDown, History } from 'lucide-react';
import { useCoverLetter } from '../hooks/useCoverLetter';
import { useResumeAnalysis } from '../../resume/hooks/useResumeAnalysis';
import { LABELS, ROUTES } from '../../../app/utils/constants';
import { exportCoverLetterToPdf } from '../../../app/utils/coverLetterExport';
import { Card } from '../../../app/components/Card';
import { TextArea } from '../../../app/components/TextArea';
import { Button } from '../../../app/components/Button';
import { ErrorMessage } from '../../../app/components/ErrorMessage';
import { generateCoverLetterSchema } from '../schemas/coverLetter.schema';
import type { GenerateCoverLetterFormData } from '../schemas/coverLetter.schema';
import type { ResumeAnalysis } from '../../../app/types';

export const CoverLetterPage: React.FC = () => {
    const { generateCoverLetter, coverLetter, isLoading, error, reset } = useCoverLetter();
    const { fetchHistory, history } = useResumeAnalysis();
    const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<GenerateCoverLetterFormData>({
        resolver: zodResolver(generateCoverLetterSchema) as unknown as Resolver<GenerateCoverLetterFormData>,
    });

    const resumeText = watch('resumeText', '');

    useEffect(() => {
        fetchHistory(1, 10, false);
    }, [fetchHistory]);

    const handleResumeSelect = (analysis: ResumeAnalysis) => {
        setSelectedResumeId(analysis._id);
        setValue('resumeText', analysis.resumeText);
        reset();
    };

    const onSubmit = async (data: GenerateCoverLetterFormData) => {
        const jobDesc = data.jobDescription && data.jobDescription !== '' ? data.jobDescription : undefined;
        await generateCoverLetter(data.resumeText, jobDesc);
    };

    const handleExport = () => {
        if (coverLetter) {
            exportCoverLetterToPdf(coverLetter);
        }
    };

    return (
        <div className="max-w-5xl mx-auto flex flex-col gap-10">
            <div className="mb-4 flex items-start justify-between">
                <div>
                    <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                        {LABELS.COVER_LETTER_TITLE}
                    </h1>
                    <p className="text-lg text-slate-400 font-medium">{LABELS.COVER_LETTER_DESCRIPTION}</p>
                </div>
                <Link to={ROUTES.COVER_LETTER_HISTORY}>
                    <Button variant="ghost" icon={<History size={18} />} className="hidden sm:flex">
                        {LABELS.COVER_LETTER_HISTORY}
                    </Button>
                </Link>
            </div>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                    {history.length > 0 && (
                        <div className="mb-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                            <label className="text-sm font-semibold text-slate-200 mb-3 block">
                                {LABELS.USE_RESUME_FROM_HISTORY}
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                                {history.map((analysis) => (
                                    <button
                                        key={analysis._id}
                                        type="button"
                                        onClick={() => handleResumeSelect(analysis)}
                                        className={`p-3 rounded-lg text-left border transition-all duration-300 ${
                                            selectedResumeId === analysis._id
                                                ? 'bg-primary-500/20 border-primary-500/40 text-primary-300'
                                                : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800/70'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <History size={16} />
                                            <span className="text-xs font-medium text-slate-400">
                                                {new Date(analysis.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm line-clamp-2">{analysis.resumeText.substring(0, 100)}...</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <TextArea
                        label={LABELS.RESUME_TEXT}
                        placeholder={LABELS.PASTE_RESUME}
                        error={errors.resumeText?.message}
                        {...register('resumeText')}
                        className="min-h-[200px]"
                    />

                    <TextArea
                        label={LABELS.TARGET_JOB_DESCRIPTION}
                        placeholder={LABELS.JOB_DESCRIPTION_PLACEHOLDER}
                        error={errors.jobDescription?.message}
                        {...register('jobDescription')}
                        className="min-h-[180px]"
                    />

                    {error && <ErrorMessage message={error} />}

                    <Button
                        type="submit"
                        isLoading={isLoading}
                        disabled={!resumeText.trim()}
                        icon={<Sparkles size={20} />}
                        className="w-full sm:w-auto"
                    >
                        {isLoading ? LABELS.GENERATING : LABELS.GENERATE_COVER_LETTER}
                    </Button>
                </form>
            </Card>

            {coverLetter && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30 shadow-xl shadow-primary-500/20">
                                    <FileText className="text-primary-300" size={28} />
                                </div>
                                <h2 className="text-2xl font-extrabold text-white tracking-tight">Generated Cover Letter</h2>
                            </div>
                            <Button variant="secondary" onClick={handleExport} icon={<FileDown size={18} />}>
                                {LABELS.EXPORT_PDF}
                            </Button>
                        </div>
                        <div className="prose prose-invert max-w-none">
                            <div className="bg-slate-800/40 p-6 rounded-xl border border-slate-700/50">
                                <div className="text-slate-200 leading-relaxed whitespace-pre-wrap font-medium">
                                    {coverLetter}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};
