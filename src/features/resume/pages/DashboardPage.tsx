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
                    <div className="mt-3 p-8 border-2 border-dashed border-slate-700/60 rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-800/20 text-center hover:border-primary-500/60 hover:bg-gradient-to-br hover:from-primary-500/5 hover:to-slate-800/30 transition-all duration-300 cursor-pointer">
                        <div className="p-3 rounded-xl bg-primary-500/10 border border-primary-500/20 w-fit mx-auto mb-4">
                            <Upload size={36} className="text-primary-400" />
                        </div>
                        <p className="text-sm font-medium text-slate-300 mb-1">{LABELS.FILE_UPLOAD_HINT}</p>
                        <p className="text-xs text-slate-500 font-medium">{LABELS.MAX_FILE_SIZE}</p>
                    </div>
                )}
            </div>
            {selectedFile && (
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-primary-500/10 via-slate-800/60 to-slate-800/60 border-2 border-primary-500/30 shadow-xl shadow-primary-500/10 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="p-3 rounded-xl bg-primary-500/20 border border-primary-500/30 shadow-lg">
                        <FileText size={22} className="text-primary-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-100 truncate mb-1">{selectedFile.name}</p>
                        <p className="text-xs text-slate-400 font-medium">{(selectedFile.size / 1024).toFixed(2)} KB</p>
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
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">{LABELS.PAGE_TITLE}</h1>
                <p className="text-lg text-slate-400 font-medium">{LABELS.PAGE_DESCRIPTION}</p>
            </div>
            <Card title={LABELS.ANALYZE}>
                <div className="flex gap-3 mb-8 border-b border-slate-800/60 pb-5">
                    <button
                        type="button"
                        onClick={() => handleModeChange('text')}
                        className={`flex items-center gap-2.5 px-5 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                            uploadMode === 'text'
                                ? 'text-primary-300 bg-gradient-to-r from-primary-500/20 to-primary-600/20 border-2 border-primary-500/40 shadow-lg shadow-primary-500/10'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-2 border-transparent hover:border-slate-700/50'
                        }`}
                    >
                        <FileText size={18} className={uploadMode === 'text' ? 'text-primary-400' : ''} />
                        <span>{LABELS.PASTE_TEXT}</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleModeChange('file')}
                        className={`flex items-center gap-2.5 px-5 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                            uploadMode === 'file'
                                ? 'text-primary-300 bg-gradient-to-r from-primary-500/20 to-primary-600/20 border-2 border-primary-500/40 shadow-lg shadow-primary-500/10'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-2 border-transparent hover:border-slate-700/50'
                        }`}
                    >
                        <Upload size={18} className={uploadMode === 'file' ? 'text-primary-400' : ''} />
                        <span>{LABELS.UPLOAD_PDF}</span>
                    </button>
                </div>
                <div className="transition-all duration-300">
                    {uploadMode === 'text' ? renderTextForm() : renderFileForm()}
                </div>
            </Card>

            {currentAnalysis && (
                <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                    <div className="flex justify-end">
                        <Button
                            variant="secondary"
                            onClick={() => exportAnalysisToPdf(currentAnalysis.aiResult)}
                            icon={<FileDown size={18} />}
                            className="shadow-lg"
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
