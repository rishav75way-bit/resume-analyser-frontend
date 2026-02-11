export interface User {
    id: string;
    email: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
    };
}

export interface ScoreTrend {
    date: string;
    score: number;
}

export interface KeywordTrend {
    keyword: string;
    count: number;
    percentage: number;
}

export interface AnalyticsMetrics {
    averageScore: number;
    latestScore: number;
    scoreImprovement: number;
    totalAnalyses: number;
    totalKeywords: number;
}

export interface AnalyticsData {
    scoreTrends: ScoreTrend[];
    keywordTrends: KeywordTrend[];
    metrics: AnalyticsMetrics;
}

export interface AnalyticsResponse {
    success: boolean;
    data: AnalyticsData;
}

export interface ResumeLengthCheck {
    wordCount: number;
    pageEstimate: number;
    status: 'optimal' | 'too-short' | 'too-long';
    recommendation: string;
}

export interface FormattingIssue {
    type: 'missing-section' | 'inconsistent-formatting' | 'poor-structure' | 'ats-unfriendly';
    severity: 'warning' | 'error';
    message: string;
    suggestion: string;
}

export interface ATSWarning {
    issue: string;
    severity: 'low' | 'medium' | 'high';
    recommendation: string;
}

export interface AIResultData {
    resumeScore?: number;
    scoreSummary?: string;
    strengths: string[];
    weaknesses: string[];
    improvementSuggestions: string[];
    keywordsPresent?: string[];
    keywordsMissing?: string[];
    lengthCheck?: ResumeLengthCheck;
    formattingIssues?: FormattingIssue[];
    atsWarnings?: ATSWarning[];
}

export interface ResumeAnalysis {
    _id: string;
    userId: string;
    resumeText: string;
    aiResult: AIResultData;
    createdAt: string;
}

export interface AnalysisResponse {
    success: boolean;
    message?: string;
    data: ResumeAnalysis;
}

export interface PaginationInfo {
    total: number;
    hasNextPage: boolean;
}

export interface HistoryResponse {
    success: boolean;
    data: ResumeAnalysis[];
    pagination?: PaginationInfo;
}
