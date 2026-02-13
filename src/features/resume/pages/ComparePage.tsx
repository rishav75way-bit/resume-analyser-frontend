import React, { useMemo, useState } from 'react';
import { GitCompare, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useCompare } from '../hooks/useCompare';
import { LABELS } from '../../../app/utils/constants';
import { Card } from '../../../app/components/Card';
import { Spinner } from '../../../app/components/Spinner';
import { ErrorMessage } from '../../../app/components/ErrorMessage';
import type { ResumeAnalysis } from '../../../app/types';

const formatAnalysisLabel = (a: ResumeAnalysis) => {
    const date = new Date(a.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
    const score = typeof a.aiResult.resumeScore === 'number' ? a.aiResult.resumeScore : '–';
    return `${date} (Score: ${score})`;
};

export const ComparePage: React.FC = () => {
    const { history, isLoading, error } = useCompare();
    const [beforeId, setBeforeId] = useState<string>('');
    const [afterId, setAfterId] = useState<string>('');

    const sortedHistory = useMemo(() => {
        return [...history].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
    }, [history]);

    const before = useMemo(() => history.find((a) => a._id === beforeId) ?? null, [history, beforeId]);
    const after = useMemo(() => history.find((a) => a._id === afterId) ?? null, [history, afterId]);

    const scoreDiff = useMemo(() => {
        if (!before || !after) return null;
        const sBefore = typeof before.aiResult.resumeScore === 'number' ? before.aiResult.resumeScore : 0;
        const sAfter = typeof after.aiResult.resumeScore === 'number' ? after.aiResult.resumeScore : 0;
        return sAfter - sBefore;
    }, [before, after]);

    const keywordsAdded = useMemo(() => {
        if (!before || !after) return [];
        const setBefore = new Set((before.aiResult.keywordsPresent ?? []).map((k) => k.toLowerCase()));
        return (after.aiResult.keywordsPresent ?? []).filter((k) => !setBefore.has(k.toLowerCase()));
    }, [before, after]);

    const keywordsRemoved = useMemo(() => {
        if (!before || !after) return [];
        const setAfter = new Set((after.aiResult.keywordsPresent ?? []).map((k) => k.toLowerCase()));
        return (before.aiResult.keywordsPresent ?? []).filter((k) => !setAfter.has(k.toLowerCase()));
    }, [before, after]);

    if (isLoading && history.length === 0) {
        return (
            <div className="max-w-6xl mx-auto flex justify-center py-20">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto">
                <ErrorMessage message={error} />
            </div>
        );
    }

    if (history.length < 2) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                        {LABELS.COMPARE_TITLE}
                    </h1>
                    <p className="text-lg text-slate-400 font-medium">{LABELS.COMPARE_DESCRIPTION}</p>
                </div>
                <Card className="py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 mb-6">
                            <GitCompare size={56} className="text-slate-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-200 mb-3">{LABELS.NEED_AT_LEAST_TWO}</h3>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
            <div className="mb-4">
                <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                    {LABELS.COMPARE_TITLE}
                </h1>
                <p className="text-lg text-slate-400 font-medium">{LABELS.COMPARE_DESCRIPTION}</p>
            </div>

            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-200 mb-2">{LABELS.SELECT_BEFORE}</label>
                        <select
                            value={beforeId}
                            onChange={(e) => setBeforeId(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white focus:ring-2 focus:ring-primary-500/60 focus:border-primary-500"
                        >
                            <option value="">Select analysis</option>
                            {sortedHistory.map((a) => (
                                <option key={a._id} value={a._id}>
                                    {formatAnalysisLabel(a)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-200 mb-2">{LABELS.SELECT_AFTER}</label>
                        <select
                            value={afterId}
                            onChange={(e) => setAfterId(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white focus:ring-2 focus:ring-primary-500/60 focus:border-primary-500"
                        >
                            <option value="">Select analysis</option>
                            {sortedHistory.map((a) => (
                                <option key={a._id} value={a._id}>
                                    {formatAnalysisLabel(a)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </Card>

            {before && after && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card>
                        <h2 className="text-xl font-bold text-white mb-4">{LABELS.SCORE_CHANGE}</h2>
                        <div className="flex flex-wrap items-center gap-6">
                            <div className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                                <span className="text-slate-400 text-sm">Before</span>
                                <p className="text-2xl font-bold text-white">
                                    {typeof before.aiResult.resumeScore === 'number'
                                        ? before.aiResult.resumeScore
                                        : '–'}
                                    /10
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                {scoreDiff !== null && scoreDiff > 0 && (
                                    <TrendingUp className="text-green-400" size={28} />
                                )}
                                {scoreDiff !== null && scoreDiff < 0 && (
                                    <TrendingDown className="text-red-400" size={28} />
                                )}
                                {scoreDiff !== null && scoreDiff === 0 && (
                                    <Minus className="text-slate-400" size={28} />
                                )}
                                <span
                                    className={`text-2xl font-bold ${
                                        scoreDiff !== null && scoreDiff > 0
                                            ? 'text-green-400'
                                            : scoreDiff !== null && scoreDiff < 0
                                              ? 'text-red-400'
                                              : 'text-slate-400'
                                    }`}
                                >
                                    {scoreDiff !== null && scoreDiff > 0 ? '+' : ''}
                                    {scoreDiff ?? 0}
                                </span>
                            </div>
                            <div className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                                <span className="text-slate-400 text-sm">After</span>
                                <p className="text-2xl font-bold text-white">
                                    {typeof after.aiResult.resumeScore === 'number'
                                        ? after.aiResult.resumeScore
                                        : '–'}
                                    /10
                                </p>
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <h2 className="text-xl font-bold text-green-400 mb-4">{LABELS.KEYWORDS_ADDED}</h2>
                            {keywordsAdded.length === 0 ? (
                                <p className="text-slate-400 text-sm">No new keywords in after version.</p>
                            ) : (
                                <ul className="flex flex-col gap-2">
                                    {keywordsAdded.map((k, i) => (
                                        <li key={i} className="flex items-center gap-2 text-slate-200">
                                            <span className="w-2 h-2 rounded-full bg-green-500" />
                                            {k}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Card>
                        <Card>
                            <h2 className="text-xl font-bold text-amber-400 mb-4">{LABELS.KEYWORDS_REMOVED}</h2>
                            {keywordsRemoved.length === 0 ? (
                                <p className="text-slate-400 text-sm">No keywords removed.</p>
                            ) : (
                                <ul className="flex flex-col gap-2">
                                    {keywordsRemoved.map((k, i) => (
                                        <li key={i} className="flex items-center gap-2 text-slate-200">
                                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                                            {k}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card title={`${LABELS.STRENGTHS} (Before)`}>
                            <ul className="flex flex-col gap-2">
                                {(before.aiResult.strengths ?? []).slice(0, 5).map((s, i) => (
                                    <li key={i} className="text-slate-300 text-sm leading-relaxed">
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                        <Card title={`${LABELS.STRENGTHS} (After)`}>
                            <ul className="flex flex-col gap-2">
                                {(after.aiResult.strengths ?? []).slice(0, 5).map((s, i) => (
                                    <li key={i} className="text-slate-300 text-sm leading-relaxed">
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};
