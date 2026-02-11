import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import { LABELS } from '../../../app/utils/constants';
import { Card } from '../../../app/components/Card';
import { Spinner } from '../../../app/components/Spinner';
import { ErrorMessage } from '../../../app/components/ErrorMessage';

const COLORS = ['#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#ef4444', '#f59e0b'];

export const AnalyticsPage: React.FC = () => {
    const { analytics, isLoading, error } = useAnalytics();

    const renderMetricCard = (title: string, value: string | number, icon: React.ReactNode, trend?: number) => {
        return (
            <Card className="hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-400 mb-2">{title}</p>
                        <p className="text-3xl font-bold text-white mb-1">{value}</p>
                        {trend !== undefined && trend !== 0 && (
                            <p className={`text-sm font-semibold ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {trend > 0 ? '+' : ''}{trend.toFixed(1)}
                            </p>
                        )}
                    </div>
                    <div className="p-3 rounded-xl bg-primary-500/10 border border-primary-500/20">
                        {icon}
                    </div>
                </div>
            </Card>
        );
    };

    const renderEmptyState = () => (
        <Card className="py-16">
            <div className="flex flex-col items-center justify-center text-center">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-800/40 border border-slate-700/60 mb-6 shadow-xl">
                    <BarChart3 size={56} className="text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-200 mb-3 tracking-tight">{LABELS.NO_ANALYTICS_DATA}</h3>
            </div>
        </Card>
    );

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto flex justify-center py-20">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto">
                <ErrorMessage message={error} />
            </div>
        );
    }

    if (!analytics || analytics.scoreTrends.length === 0) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">{LABELS.ANALYTICS_TITLE}</h1>
                    <p className="text-lg text-slate-400 font-medium">{LABELS.ANALYTICS_DESCRIPTION}</p>
                </div>
                {renderEmptyState()}
            </div>
        );
    }

    const { metrics, scoreTrends, keywordTrends } = analytics;

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
            <div className="mb-4">
                <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">{LABELS.ANALYTICS_TITLE}</h1>
                <p className="text-lg text-slate-400 font-medium">{LABELS.ANALYTICS_DESCRIPTION}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderMetricCard(LABELS.AVERAGE_SCORE, metrics.averageScore.toFixed(1), <BarChart3 className="text-primary-400" size={24} />)}
                {renderMetricCard(LABELS.LATEST_SCORE, metrics.latestScore.toFixed(1), <TrendingUp className="text-primary-400" size={24} />, metrics.scoreImprovement)}
                {renderMetricCard(LABELS.TOTAL_ANALYSES, metrics.totalAnalyses, <BarChart3 className="text-primary-400" size={24} />)}
                {renderMetricCard(LABELS.TOTAL_KEYWORDS, metrics.totalKeywords, <BarChart3 className="text-primary-400" size={24} />)}
            </div>

            <Card>
                <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">{LABELS.SCORE_TRENDS}</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={scoreTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                        <YAxis domain={[0, 10]} stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1e293b',
                                border: '1px solid #334155',
                                borderRadius: '0.75rem',
                                color: '#e2e8f0',
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#0ea5e9"
                            strokeWidth={3}
                            dot={{ fill: '#0ea5e9', r: 6 }}
                            activeDot={{ r: 8 }}
                            name="Resume Score"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Card>

            {keywordTrends.length > 0 && (
                <Card>
                    <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">{LABELS.KEYWORD_USAGE}</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={keywordTrends}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="keyword" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} angle={-45} textAnchor="end" height={100} />
                            <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid #334155',
                                    borderRadius: '0.75rem',
                                    color: '#e2e8f0',
                                }}
                            />
                            <Legend />
                            <Bar dataKey="count" name="Usage Count" radius={[8, 8, 0, 0]}>
                                {keywordTrends.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            )}
        </div>
    );
};
