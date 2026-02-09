import React, { useState } from 'react';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { AnalysisResult } from './AnalysisResult';
import { Card } from '../../../app/components/Card';
import { Button } from '../../../app/components/Button';
import type { ResumeAnalysis } from '../../../app/types';

interface HistoryItemProps {
    analysis: ResumeAnalysis;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ analysis }) => {
    const [isExpanded, setIsExpanded] = useState(false);

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
        <Card className="hover:scale-[1.01] transition-transform duration-200">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800/50">
                <div className="flex items-center gap-2 flex-1">
                    <div className="p-1.5 rounded-lg bg-slate-800/50">
                        <Clock size={16} className="text-slate-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-300">{formattedDate}</p>
                        <p className="text-xs text-slate-500">{formattedTime}</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-sm gap-1.5 hover:bg-slate-800/50"
                >
                    {isExpanded ? (
                        <>
                            <ChevronUp size={16} />
                            <span className="hidden sm:inline">Hide Analysis</span>
                        </>
                    ) : (
                        <>
                            <ChevronDown size={16} />
                            <span className="hidden sm:inline">View Analysis</span>
                        </>
                    )}
                </Button>
            </div>
            <div className="mb-4 p-4 rounded-lg bg-slate-800/30 border border-slate-700/30">
                <p className={`text-slate-300 text-sm leading-relaxed italic ${isExpanded ? '' : 'line-clamp-3'}`}>
                    "{analysis.resumeText}"
                </p>
            </div>
            {isExpanded && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <AnalysisResult result={analysis.aiResult} />
                </div>
            )}
        </Card>
    );
};
