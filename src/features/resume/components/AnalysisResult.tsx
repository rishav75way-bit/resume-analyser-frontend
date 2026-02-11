import type React from 'react';
import { CheckCircle, AlertCircle, Wand2, Star, Check, X, FileText, AlertTriangle, Shield } from 'lucide-react';
import { Card } from '../../../app/components/Card';
import { LABELS } from '../../../app/utils/constants';
import type { AIResultData, ResumeLengthCheck, FormattingIssue, ATSWarning } from '../../../app/types';

interface AnalysisResultProps {
    result: AIResultData;
}

interface ListSection {
    kind: 'list';
    title: string;
    items: string[];
    color: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    bg: string;
}

interface ScoreSection {
    kind: 'score';
    title: string;
    score: number;
    summary: string;
}

type Section = ListSection | ScoreSection;

function buildSections(result: AIResultData): Section[] {
    const sections: Section[] = [];

    const hasScore = typeof result.resumeScore === 'number' || (result.scoreSummary && result.scoreSummary.length > 0);
    if (hasScore) {
        sections.push({
            kind: 'score',
            title: LABELS.RESUME_SCORE,
            score: typeof result.resumeScore === 'number' ? result.resumeScore : 0,
            summary: result.scoreSummary ?? '',
        });
    }

    const keywordsPresent = result.keywordsPresent ?? [];
    if (keywordsPresent.length > 0) {
        sections.push({
            kind: 'list',
            title: LABELS.KEYWORDS_PRESENT,
            items: keywordsPresent,
            color: 'text-green-400',
            icon: Check,
            bg: 'bg-green-500/10',
        });
    }

    const keywordsMissing = result.keywordsMissing ?? [];
    if (keywordsMissing.length > 0) {
        sections.push({
            kind: 'list',
            title: LABELS.KEYWORDS_MISSING,
            items: keywordsMissing,
            color: 'text-amber-400',
            icon: X,
            bg: 'bg-amber-500/10',
        });
    }

    sections.push(
        {
            kind: 'list',
            title: LABELS.STRENGTHS,
            items: result.strengths,
            color: 'text-green-400',
            icon: CheckCircle,
            bg: 'bg-green-500/10',
        },
        {
            kind: 'list',
            title: LABELS.WEAKNESSES,
            items: result.weaknesses,
            color: 'text-red-400',
            icon: AlertCircle,
            bg: 'bg-red-500/10',
        },
        {
            kind: 'list',
            title: LABELS.SUGGESTIONS,
            items: result.improvementSuggestions,
            color: 'text-primary-400',
            icon: Wand2,
            bg: 'bg-primary-500/10',
        }
    );

    return sections;
}

const renderLengthCheck = (lengthCheck: ResumeLengthCheck) => {
    const statusColors = {
        optimal: 'text-green-400',
        'too-short': 'text-amber-400',
        'too-long': 'text-red-400',
    };

    const statusBg = {
        optimal: 'bg-green-500/10',
        'too-short': 'bg-amber-500/10',
        'too-long': 'bg-red-500/10',
    };

    return (
        <Card className="animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-4 mb-6">
                <div className={`p-4 rounded-2xl ${statusBg[lengthCheck.status]} border border-opacity-30 shadow-xl`}>
                    <FileText className={statusColors[lengthCheck.status]} size={28} />
                </div>
                <h3 className={`text-2xl font-extrabold ${statusColors[lengthCheck.status]} tracking-tight`}>{LABELS.RESUME_LENGTH}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                    <p className="text-sm text-slate-400 mb-1">{LABELS.WORD_COUNT}</p>
                    <p className="text-2xl font-bold text-white">{lengthCheck.wordCount}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                    <p className="text-sm text-slate-400 mb-1">{LABELS.PAGE_ESTIMATE}</p>
                    <p className="text-2xl font-bold text-white">{lengthCheck.pageEstimate}</p>
                </div>
            </div>
            <div className={`p-4 rounded-xl ${statusBg[lengthCheck.status]} border ${statusColors[lengthCheck.status].replace('text-', 'border-')}/30`}>
                <p className="text-slate-200 leading-relaxed font-medium">{lengthCheck.recommendation}</p>
            </div>
        </Card>
    );
};

const renderFormattingIssues = (issues: FormattingIssue[]) => {
    if (issues.length === 0) return null;

    return (
        <Card className="animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-opacity-30 shadow-xl">
                    <AlertTriangle className="text-amber-400" size={28} />
                </div>
                <h3 className="text-2xl font-extrabold text-amber-400 tracking-tight">{LABELS.FORMATTING_ISSUES}</h3>
            </div>
            <div className="flex flex-col gap-4">
                {issues.map((issue, index) => (
                    <div key={index} className={`p-4 rounded-xl border ${issue.severity === 'error' ? 'bg-red-500/10 border-red-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                        <p className="text-slate-200 font-semibold mb-2">{issue.message}</p>
                        <p className="text-slate-300 text-sm leading-relaxed">{issue.suggestion}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const renderATSWarnings = (warnings: ATSWarning[]) => {
    if (warnings.length === 0) return null;

    const severityColors = {
        low: 'text-blue-400',
        medium: 'text-amber-400',
        high: 'text-red-400',
    };

    const severityBg = {
        low: 'bg-blue-500/10',
        medium: 'bg-amber-500/10',
        high: 'bg-red-500/10',
    };

    return (
        <Card className="animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-primary-500/10 border border-opacity-30 shadow-xl">
                    <Shield className="text-primary-400" size={28} />
                </div>
                <h3 className="text-2xl font-extrabold text-primary-400 tracking-tight">{LABELS.ATS_COMPATIBILITY}</h3>
            </div>
            <div className="flex flex-col gap-4">
                {warnings.map((warning, index) => (
                    <div key={index} className={`p-4 rounded-xl border ${severityBg[warning.severity]} ${severityColors[warning.severity].replace('text-', 'border-')}/30`}>
                        <div className="flex items-start justify-between mb-2">
                            <p className={`font-semibold ${severityColors[warning.severity]}`}>{warning.issue}</p>
                            <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${severityBg[warning.severity]} ${severityColors[warning.severity]} border ${severityColors[warning.severity].replace('text-', 'border-')}/30`}>
                                {warning.severity.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">{warning.recommendation}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
    const sections = buildSections(result);

    return (
        <div className="flex flex-col gap-6">
            {result.lengthCheck && renderLengthCheck(result.lengthCheck)}
            {result.formattingIssues && result.formattingIssues.length > 0 && renderFormattingIssues(result.formattingIssues)}
            {result.atsWarnings && result.atsWarnings.length > 0 && renderATSWarnings(result.atsWarnings)}
            {sections.map((section, sectionIndex) => (
                <Card key={section.title + sectionIndex} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${sectionIndex * 100}ms` }}>
                    {section.kind === 'score' ? (
                        <>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30 shadow-xl shadow-primary-500/20">
                                    <Star className="text-primary-300" size={28} />
                                </div>
                                <h3 className="text-3xl font-extrabold text-primary-300 tracking-tight">{section.title}</h3>
                            </div>
                            <div className="flex items-baseline gap-4 flex-wrap mb-4">
                                <span className="text-6xl font-extrabold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">{section.score}</span>
                                <span className="text-2xl text-slate-400 font-bold">/ 10</span>
                            </div>
                            {section.summary && (
                                <p className="text-slate-200 leading-relaxed mt-4 text-base font-medium bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">{section.summary}</p>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-4 mb-7">
                                <div className={`p-4 rounded-2xl ${section.bg} border border-opacity-30 shadow-xl`}>
                                    <section.icon className={section.color} size={28} />
                                </div>
                                <h3 className={`text-2xl font-extrabold ${section.color} tracking-tight`}>{section.title}</h3>
                            </div>
                            <ul className="flex flex-col gap-4">
                                {section.items.map((item, index) => (
                                    <li key={index} className="flex gap-4 group">
                                        <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2.5 ${section.bg.replace('bg-', 'bg-').replace('/10', '/30')} group-hover:w-3 group-hover:h-3 transition-all duration-300 shadow-lg`} />
                                        <p className="text-slate-200 leading-relaxed flex-1 group-hover:text-slate-100 transition-colors duration-300 font-medium text-base">
                                            {item}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </Card>
            ))}
        </div>
    );
};
