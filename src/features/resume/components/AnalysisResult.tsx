import type React from 'react';
import { CheckCircle, AlertCircle, Wand2, Star, Check, X } from 'lucide-react';
import { Card } from '../../../app/components/Card';
import { LABELS } from '../../../app/utils/constants';
import type { AIResultData } from '../../../app/types';

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

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
    const sections = buildSections(result);

    return (
        <div className="flex flex-col gap-6">
            {sections.map((section, sectionIndex) => (
                <Card key={section.title + sectionIndex} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${sectionIndex * 100}ms` }}>
                    {section.kind === 'score' ? (
                        <>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 rounded-xl bg-primary-500/10 shadow-lg">
                                    <Star className="text-primary-400" size={26} />
                                </div>
                                <h3 className="text-2xl font-bold text-primary-400">{section.title}</h3>
                            </div>
                            <div className="flex items-center gap-4 flex-wrap">
                                <span className="text-4xl font-bold text-white">{section.score}</span>
                                <span className="text-slate-400">/ 10</span>
                            </div>
                            {section.summary && (
                                <p className="text-slate-300 leading-relaxed mt-3">{section.summary}</p>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`p-3 rounded-xl ${section.bg} shadow-lg`}>
                                    <section.icon className={section.color} size={26} />
                                </div>
                                <h3 className={`text-2xl font-bold ${section.color}`}>{section.title}</h3>
                            </div>
                            <ul className="flex flex-col gap-3">
                                {section.items.map((item, index) => (
                                    <li key={index} className="flex gap-3 group">
                                        <div className={`flex-shrink-0 w-1.5 rounded-full mt-2 ${section.bg} group-hover:w-2 transition-all duration-200`} />
                                        <p className="text-slate-300 leading-relaxed flex-1 group-hover:text-slate-200 transition-colors duration-200">
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
