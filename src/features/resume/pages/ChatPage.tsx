import React, { useEffect, useState, useRef } from 'react';
import { MessageCircle, Send, FileText, Download, X, Sparkles } from 'lucide-react';
import { useResumeAnalysis } from '../hooks/useResumeAnalysis';
import { useResumeChat, type ChatMessage } from '../hooks/useResumeChat';
import { LABELS } from '../../../app/utils/constants';
import { Card } from '../../../app/components/Card';
import { Button } from '../../../app/components/Button';
import { Spinner } from '../../../app/components/Spinner';
import { ErrorMessage } from '../../../app/components/ErrorMessage';
import { TextArea } from '../../../app/components/TextArea';
import type { ResumeAnalysis } from '../../../app/types';
import { exportResumeToPdf, exportResumeToDocx } from '../../../app/utils/formattedResumeExport';
import type { ResumeTemplateId } from '../../../app/utils/resumeTemplates';

export const ChatPage: React.FC = () => {
    const { fetchHistory, history, isLoading: resumeLoading } = useResumeAnalysis();
    const { sendMessage, messages, isLoading: chatLoading, error, clearMessages } = useResumeChat();
    const [selectedResume, setSelectedResume] = useState<ResumeAnalysis | null>(null);
    const [question, setQuestion] = useState('');
    const [updatedResume, setUpdatedResume] = useState<string | null>(null);
    const [showUpdatedResume, setShowUpdatedResume] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [exportFormat, setExportFormat] = useState<'pdf' | 'docx'>('pdf');
    const [templateId, setTemplateId] = useState<ResumeTemplateId>('professional');

    useEffect(() => {
        fetchHistory(1, 20, false);
    }, [fetchHistory]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage?.updatedResume) {
            setUpdatedResume(lastMessage.updatedResume);
        }
    }, [messages]);

    const handleSend = async () => {
        if (!selectedResume || !question.trim()) return;
        const result = await sendMessage(selectedResume.resumeText, question);
        if (result?.updatedResume) {
            setUpdatedResume(result.updatedResume);
        }
        setQuestion('');
    };

    const handleDownloadUpdated = () => {
        if (!updatedResume) return;
        if (exportFormat === 'pdf') {
            exportResumeToPdf(updatedResume, templateId);
        } else {
            exportResumeToDocx(updatedResume, templateId);
        }
    };

    const formatMessageContent = (content: string) => {
        let formatted = content;
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '$1');
        formatted = formatted.replace(/^#{1,6}\s+/gm, '');
        formatted = formatted.replace(/```[\s\S]*?```/g, '');
        formatted = formatted.replace(/`([^`]+)`/g, '$1');
        formatted = formatted.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
        formatted = formatted.replace(/([:\s])\*([^*\n])/g, '$1$2');
        formatted = formatted.replace(/([^*\n])\*([:\s\n])/g, '$1$2');
        return formatted;
    };

    const renderMessage = (message: ChatMessage) => {
        const formattedContent = formatMessageContent(message.content);
        const lines = formattedContent.split('\n');
        const processedLines: React.ReactNode[] = [];
        let lastType: 'empty' | 'main-point' | 'sub-point' | 'bullet' | 'paragraph' | null = null;
        
        lines.forEach((line, idx) => {
            const trimmedLine = line.trim();
            
            if (!trimmedLine) {
                if (lastType !== 'empty' && idx > 0 && idx < lines.length - 1) {
                    processedLines.push(<div key={`empty-${idx}`} className="h-4" />);
                    lastType = 'empty';
                }
                return;
            }
            
            if (/^\d+\.\s+[A-Z]/.test(trimmedLine)) {
                const match = trimmedLine.match(/^(\d+)\.\s+(.+)/);
                if (match) {
                    let spacing = 'mt-6';
                    if (lastType === 'main-point') {
                        spacing = 'mt-8';
                    } else if (lastType === null) {
                        spacing = 'mt-0';
                    }
                    processedLines.push(
                        <div key={idx} className={`mb-4 ${spacing}`}>
                            <div className="flex items-start gap-3">
                                <span className="text-primary-400 font-bold text-lg flex-shrink-0 mt-0.5">
                                    {match[1]}.
                                </span>
                                <span className="flex-1 text-base font-semibold text-slate-100 leading-relaxed">
                                    {match[2]}
                                </span>
                            </div>
                        </div>
                    );
                    lastType = 'main-point';
                    return;
                }
            }
            
            if (/^(Examples|Why|Actionable|Note|Tip|Warning|Summary|Conclusion):\*?/i.test(trimmedLine)) {
                const cleanLine = trimmedLine.replace(/\*+$/, '').replace(/\*+:/g, ':');
                const parts = cleanLine.split(':');
                processedLines.push(
                    <div key={idx} className="ml-8 mb-3 mt-4">
                        <span className="text-primary-300 font-semibold text-base">{parts[0]}:</span>
                        {parts[1] && <span className="ml-2 text-slate-200">{parts[1].trim()}</span>}
                    </div>
                );
                lastType = 'sub-point';
                return;
            }
            
            if (/^\*\s/.test(trimmedLine)) {
                const bulletText = trimmedLine.replace(/^\*\s*/, '').trim();
                processedLines.push(
                    <div key={idx} className="ml-10 mb-2.5 flex items-start gap-2">
                        <span className="text-primary-400 mt-1.5 flex-shrink-0">•</span>
                        <span className="flex-1 leading-relaxed">{bulletText}</span>
                    </div>
                );
                lastType = 'bullet';
                return;
            }
            
            if (/^[\-•]\s/.test(trimmedLine)) {
                const bulletText = trimmedLine.replace(/^[\-•]\s*/, '').trim();
                processedLines.push(
                    <div key={idx} className="ml-10 mb-2 flex items-start gap-2">
                        <span className="text-primary-400 mt-1.5 flex-shrink-0">•</span>
                        <span className="flex-1 leading-relaxed">{bulletText}</span>
                    </div>
                );
                lastType = 'bullet';
                return;
            }
            
            if (/^\d+\.\d+\.\s/.test(trimmedLine) || /^[a-z]\.\s/i.test(trimmedLine)) {
                const match = trimmedLine.match(/^([a-z0-9\.]+)\s+(.+)/i);
                if (match) {
                    processedLines.push(
                        <div key={idx} className="ml-10 mb-2 flex items-start gap-2">
                            <span className="text-primary-400 mt-1.5 flex-shrink-0 font-medium">
                                {match[1]}.
                            </span>
                            <span className="flex-1 leading-relaxed">{match[2]}</span>
                        </div>
                    );
                    lastType = 'bullet';
                    return;
                }
            }
            
            if (/^\d+\.\s/.test(trimmedLine)) {
                const match = trimmedLine.match(/^(\d+)\.\s+(.+)/);
                if (match) {
                    processedLines.push(
                        <div key={idx} className="ml-8 mb-2 flex items-start gap-2">
                            <span className="text-primary-400 mt-1.5 flex-shrink-0 font-semibold">
                                {match[1]}.
                            </span>
                            <span className="flex-1 leading-relaxed">{match[2]}</span>
                        </div>
                    );
                    lastType = 'sub-point';
                    return;
                }
            }
            
            if ((trimmedLine.endsWith(':') && trimmedLine.length < 80) || 
                (trimmedLine.length < 60 && trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length > 5)) {
                let spacing = 'mt-4';
                if (lastType === 'main-point' || lastType === null) {
                    spacing = 'mt-6';
                }
                processedLines.push(
                    <h4 key={idx} className={`text-primary-300 font-semibold ${spacing} mb-3 text-base first:mt-0`}>
                        {trimmedLine}
                    </h4>
                );
                lastType = 'sub-point';
                return;
            }
            
            let spacing = 'mt-3';
            if (lastType === 'paragraph') {
                spacing = 'mt-2';
            }
            processedLines.push(
                <p key={idx} className={`mb-2 last:mb-0 leading-relaxed ${spacing}`}>
                    {trimmedLine}
                </p>
            );
            lastType = 'paragraph';
        });
        
        return (
            <div
                key={message.id}
                className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
                {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30 flex items-center justify-center shadow-lg">
                        <Sparkles size={20} className="text-primary-400" />
                    </div>
                )}
                <div
                    className={`max-w-[85%] lg:max-w-[75%] rounded-2xl px-5 py-4 shadow-lg ${
                        message.role === 'user'
                            ? 'bg-gradient-to-br from-primary-500/20 via-primary-500/15 to-primary-600/20 border border-primary-500/40 text-primary-50'
                            : 'bg-slate-800/80 backdrop-blur-sm border border-slate-700/60 text-slate-100'
                    }`}
                >
                    <div className="text-[15px] leading-relaxed break-words">
                        {processedLines}
                    </div>
                    {message.updatedResume && (
                        <div className="mt-4 pt-4 border-t border-slate-700/50">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                                    <span className="text-green-400 text-xs">✓</span>
                                </div>
                                <p className="text-sm text-green-400 font-medium">Resume updated successfully</p>
                            </div>
                            <Button
                                variant="secondary"
                                onClick={() => setShowUpdatedResume(true)}
                                icon={<FileText size={16} />}
                                className="text-sm"
                            >
                                View Updated Resume
                            </Button>
                        </div>
                    )}
                </div>
                {message.role === 'user' && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600/50 flex items-center justify-center shadow-lg">
                        <span className="text-xs font-semibold text-slate-200">You</span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-6 py-6">
            <div className="mb-4">
                <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                    {LABELS.CHAT_TITLE}
                </h1>
                <p className="text-base text-slate-400">{LABELS.CHAT_DESCRIPTION}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <Card>
                        <h3 className="text-base font-semibold text-slate-200 mb-4">{LABELS.SELECT_RESUME_FOR_CHAT}</h3>
                        {resumeLoading && history.length === 0 ? (
                            <div className="flex justify-center py-8">
                                <Spinner />
                            </div>
                        ) : history.length === 0 ? (
                            <p className="text-slate-400 text-sm">{LABELS.NO_RESUME_HISTORY}</p>
                        ) : (
                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                                {history.map((analysis) => (
                                    <button
                                        key={analysis._id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedResume(analysis);
                                            setUpdatedResume(null);
                                            setShowUpdatedResume(false);
                                        }}
                                        className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                                            selectedResume?._id === analysis._id
                                                ? 'bg-primary-500/20 border-primary-500/50 text-primary-200 shadow-lg shadow-primary-500/10'
                                                : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800/70'
                                        }`}
                                    >
                                        <span className="text-xs text-slate-400 block mb-1 font-medium">
                                            {new Date(analysis.createdAt).toLocaleDateString()}
                                        </span>
                                        <p className="text-sm line-clamp-2 leading-relaxed">{analysis.resumeText.substring(0, 100)}...</p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </Card>

                    {selectedResume && (
                        <Card>
                            <h3 className="text-sm font-semibold text-slate-300 mb-3">{LABELS.EXAMPLE_QUESTIONS}</h3>
                            <div className="space-y-2">
                                {[
                                    LABELS.EXAMPLE_Q1,
                                    LABELS.EXAMPLE_Q2,
                                    LABELS.EXAMPLE_Q3,
                                    LABELS.EXAMPLE_Q4,
                                ].map((q, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setQuestion(q)}
                                        className="w-full text-left text-sm text-slate-400 hover:text-primary-400 hover:bg-primary-500/10 p-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-800/60 transition-all duration-200 border border-transparent hover:border-primary-500/30"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>

                <div className="lg:col-span-3 flex flex-col">
                    <Card className="flex flex-col h-[600px]">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700/50 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary-500/10 border border-primary-500/30">
                                    <MessageCircle size={20} className="text-primary-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-200">Chat</h3>
                                    {selectedResume && (
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Chatting about resume from {new Date(selectedResume.createdAt).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {messages.length > 0 && (
                                <Button variant="ghost" onClick={clearMessages} icon={<X size={16} />} className="text-sm">
                                    {LABELS.CLEAR_CHAT}
                                </Button>
                            )}
                        </div>

                        {!selectedResume ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="p-4 rounded-full bg-slate-800/60 border border-slate-700/50 w-fit mx-auto mb-4">
                                        <MessageCircle size={48} className="text-slate-600" />
                                    </div>
                                    <p className="text-slate-400 text-lg mb-1">{LABELS.NO_RESUME_SELECTED_CHAT}</p>
                                    <p className="text-slate-500 text-sm">Select a resume from the sidebar to start chatting</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex-1 overflow-y-auto mb-4 px-4 py-4 space-y-6 max-h-[450px]">
                                    {messages.length === 0 ? (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="text-center max-w-md">
                                                <div className="p-4 rounded-full bg-primary-500/10 border border-primary-500/30 w-fit mx-auto mb-4">
                                                    <Sparkles size={40} className="text-primary-400 opacity-70" />
                                                </div>
                                                <p className="text-slate-300 text-lg font-medium mb-2">Start a conversation</p>
                                                <p className="text-slate-500 text-sm">Ask questions about your resume, get improvement suggestions, or request updates</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {messages.map(renderMessage)}
                                            {chatLoading && (
                                                <div className="flex gap-4">
                                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center shadow-lg">
                                                        <Sparkles size={20} className="text-primary-400 animate-pulse" />
                                                    </div>
                                                    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl px-5 py-4 shadow-lg">
                                                        <Spinner size="sm" />
                                                    </div>
                                                </div>
                                            )}
                                            <div ref={messagesEndRef} />
                                        </>
                                    )}
                                </div>

                                {error && <ErrorMessage message={error} className="mb-4 flex-shrink-0" />}

                                <div className="border-t border-slate-700/50 pt-4 flex-shrink-0">
                                    <div className="flex gap-3">
                                        <TextArea
                                            value={question}
                                            onChange={(e) => setQuestion(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSend();
                                                }
                                            }}
                                            placeholder={LABELS.TYPE_YOUR_QUESTION}
                                            className="flex-1 min-h-[100px] max-h-[200px] resize-none text-base"
                                        />
                                        <Button
                                            onClick={handleSend}
                                            disabled={!question.trim() || chatLoading || !selectedResume}
                                            isLoading={chatLoading}
                                            icon={<Send size={20} />}
                                            className="self-end h-[100px] px-6"
                                        >
                                            {LABELS.SEND}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </Card>

                    {updatedResume && (
                        <Card className="mt-4 border-green-500/30 bg-green-500/5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/30">
                                        <FileText size={20} className="text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-200">{LABELS.UPDATED_RESUME}</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">Ready to download</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <select
                                        value={templateId}
                                        onChange={(e) => setTemplateId(e.target.value as ResumeTemplateId)}
                                        className="px-3 py-2 bg-slate-800/60 border border-slate-700/60 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                                    >
                                        <option value="professional">Professional</option>
                                        <option value="modern">Modern</option>
                                    </select>
                                    <select
                                        value={exportFormat}
                                        onChange={(e) => setExportFormat(e.target.value as 'pdf' | 'docx')}
                                        className="px-3 py-2 bg-slate-800/60 border border-slate-700/60 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                                    >
                                        <option value="pdf">PDF</option>
                                        <option value="docx">DOCX</option>
                                    </select>
                                    <Button
                                        onClick={handleDownloadUpdated}
                                        icon={<Download size={18} />}
                                        variant="secondary"
                                        className="text-sm"
                                    >
                                        {LABELS.DOWNLOAD_UPDATED_RESUME}
                                    </Button>
                                </div>
                            </div>
                            {showUpdatedResume ? (
                                <div className="bg-slate-900/60 p-5 rounded-lg border border-slate-700/50 max-h-[400px] overflow-y-auto">
                                    <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                                        {updatedResume}
                                    </pre>
                                </div>
                            ) : (
                                <Button
                                    variant="ghost"
                                    onClick={() => setShowUpdatedResume(true)}
                                    className="w-full"
                                    icon={<FileText size={16} />}
                                >
                                    View Updated Resume Text
                                </Button>
                            )}
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};
