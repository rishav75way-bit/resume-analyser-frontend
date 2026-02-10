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

export interface AIResultData {
    resumeScore?: number;
    scoreSummary?: string;
    strengths: string[];
    weaknesses: string[];
    improvementSuggestions: string[];
    keywordsPresent?: string[];
    keywordsMissing?: string[];
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
