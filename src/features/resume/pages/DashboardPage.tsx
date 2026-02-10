import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileSearch, Upload, FileText, FileDown } from 'lucide-react';
import { useResumeAnalysis } from '../hooks/useResumeAnalysis';
import { LABELS } from '../../../app/utils/constants';
import { exportAnalysisToPdf } from '../../../app/utils/pdfExport';
import { Card } from '../../../app/components/Card';
import { TextArea } from '../../../app/components/TextArea';
import { FileInput } from '../../../app/components/FileInput';
import { Button } from '../../../app/components/Button';
import { AnalysisResult } from '../components/AnalysisResult';
import { ErrorMessage } from '../../../app/components/ErrorMessage';
import { analyzeResumeSchema } from '../schemas/resume.schema';
import type { AnalyzeResumeFormData } from '../schemas/resume.schema';

type UploadMode = 'text' | 'file';

export const DashboardPage: React.FC = () => {
    const { analyze, analyzeFromFile, currentAnalysis, isLoading, error } = useResumeAnalysis();
    const [uploadMode, setUploadMode] = useState<UploadMode>('text');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [lastErrorMode, setLastErrorMode] = useState<UploadMode | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm<AnalyzeResumeFormData>({
        resolver: zodResolver(analyzeResumeSchema),
    });

    const resumeText = watch('resumeText', '');
    const jobDescription = watch('jobDescription', '');

    const handleTextSubmit = (data: AnalyzeResumeFormData) => {
        setLastErrorMode('text');
        const jobDesc = data.jobDescription && data.jobDescription !== '' ? data.jobDescription : undefined;
        analyze(data.resumeText, jobDesc);
    };

    const handleFileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedFile) {
            setLastErrorMode('file');
            analyzeFromFile(selectedFile, jobDescription || undefined);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setSelectedFile(file);
    };

    const handleModeChange = (mode: UploadMode) => {
        setUploadMode(mode);
        setSelectedFile(null);
        setLastErrorMode(null);
        reset();
    };

    const shouldShowErrorInTextForm = uploadMode === 'text' && error && lastErrorMode === 'text';
    const shouldShowErrorInFileForm = uploadMode === 'file' && error && lastErrorMode === 'file';

    const renderTextForm = () => (
        <form onSubmit={handleSubmit(handleTextSubmit)} className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
                <TextArea
                    label={LABELS.RESUME_TEXT}
                    placeholder={LABELS.PASTE_RESUME}
                    error={errors.resumeText?.message}
                    {...register('resumeText')}
                />
                <TextArea
                    label={LABELS.TARGET_JOB_DESCRIPTION}
                    placeholder={LABELS.JOB_DESCRIPTION_PLACEHOLDER}
                    error={errors.jobDescription?.message}
                    {...register('jobDescription')}
                    className="min-h-[140px]"
                />
            </div>
            {shouldShowErrorInTextForm && <ErrorMessage message={error} />}
            <Button
                type="submit"
                isLoading={isLoading}
                disabled={!resumeText.trim()}
                icon={<FileSearch size={20} />}
            >
                {LABELS.SUBMIT}
            </Button>
        </form>
    );

    const renderFileForm = () => (
        <form onSubmit={handleFileSubmit} className="flex flex-col gap-4">
            <div className="relative">
                <FileInput
                    accept="application/pdf"
                    label={LABELS.SELECT_FILE}
                    error={shouldShowErrorInFileForm ? error : undefined}
                    onChange={handleFileChange}
                    className="cursor-pointer"
                />
                {!selectedFile && (
                    <div className="mt-2 p-6 border-2 border-dashed border-slate-700 rounded-lg bg-slate-800/30 text-center hover:border-primary-500/50 hover:bg-slate-800/50 transition-all duration-200">
                        <Upload size={32} className="mx-auto mb-2 text-slate-500" />
                        <p className="text-sm text-slate-400">{LABELS.FILE_UPLOAD_HINT}</p>
                        <p className="text-xs text-slate-500 mt-1">{LABELS.MAX_FILE_SIZE}</p>
                    </div>
                )}
            </div>
            {selectedFile && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="p-2 rounded-lg bg-primary-500/10">
                        <FileText size={20} className="text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">{selectedFile.name}</p>
                        <p className="text-xs text-slate-400">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                </div>
            )}
            {shouldShowErrorInFileForm && <ErrorMessage message={error} />}
            <Button
                type="submit"
                isLoading={isLoading}
                disabled={!selectedFile}
                icon={<Upload size={20} />}
                className="mt-2"
            >
                {LABELS.SUBMIT}
            </Button>
        </form>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-4xl font-bold text-white mb-2">{LABELS.PAGE_TITLE}</h1>
                <p className="text-slate-400">{LABELS.PAGE_DESCRIPTION}</p>
            </div>
            <Card title={LABELS.ANALYZE}>
                <div className="flex gap-2 mb-6 border-b border-slate-800/50 pb-4">
                    <button
                        type="button"
                        onClick={() => handleModeChange('text')}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                            uploadMode === 'text'
                                ? 'text-primary-400 bg-primary-500/10 border border-primary-500/30'
                                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
                        }`}
                    >
                        <FileText size={18} />
                        <span>{LABELS.PASTE_TEXT}</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleModeChange('file')}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                            uploadMode === 'file'
                                ? 'text-primary-400 bg-primary-500/10 border border-primary-500/30'
                                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
                        }`}
                    >
                        <Upload size={18} />
                        <span>{LABELS.UPLOAD_PDF}</span>
                    </button>
                </div>
                <div className="transition-all duration-300">
                    {uploadMode === 'text' ? renderTextForm() : renderFileForm()}
                </div>
            </Card>

            {currentAnalysis && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
                    <div className="flex justify-end">
                        <Button
                            variant="secondary"
                            onClick={() => exportAnalysisToPdf(currentAnalysis.aiResult)}
                            icon={<FileDown size={18} />}
                        >
                            {LABELS.EXPORT_PDF}
                        </Button>
                    </div>
                    <AnalysisResult result={currentAnalysis.aiResult} />
                </div>
            )}
        </div>
    );
};
