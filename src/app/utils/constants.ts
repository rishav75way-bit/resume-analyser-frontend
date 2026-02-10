export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    HISTORY: '/history',
};

export const API_ROUTES = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
    },
    RESUME: {
        ANALYZE: '/resume/analyze',
        ANALYZE_UPLOAD: '/resume/analyze/upload',
        HISTORY: '/resume/history',
        HISTORY_ITEM: (id: string) => `/resume/history/${id}`,
    },
};

export const STORAGE_KEYS = {
    TOKEN: 'auth_token',
    USER: 'user_data',
};

export const LABELS = {
    APP_NAME: 'ResumeAI',
    ANALYZE: 'Analyze',
    HISTORY: 'History',
    LOGOUT: 'Logout',
    LOGIN: 'Login',
    SIGN_UP: 'Sign Up',
    STRENGTHS: 'Strengths',
    WEAKNESSES: 'Weaknesses',
    SUGGESTIONS: 'Improvement Suggestions',
    SUBMIT: 'Submit for Analysis',
    PASTE_RESUME: 'Paste your resume text here...',
    SELECT_FILE: 'Select PDF file',
    FILE_SELECTED: 'File selected',
    ANALYZING: 'Analyzing...',
    REGISTER: 'Register',
    ALREADY_HAVE_ACCOUNT: 'Already have an account?',
    DONT_HAVE_ACCOUNT: 'Don\'t have an account?',
    EMAIL: 'Email',
    PASSWORD: 'Password',
    AUTH_FAILED: 'Authentication failed',
    USER_NOT_FOUND: 'User not found',
    RESUME_ANALYSIS_FAILED: 'Resume analysis failed',
    FETCH_HISTORY_FAILED: 'Failed to fetch history',
    NO_HISTORY: 'No analysis history found',
    BACK_TO_LOGIN: 'Back to Login',
    RESUME_TEXT: 'Resume text',
    TARGET_JOB_DESCRIPTION: 'Target job description (optional)',
    JOB_DESCRIPTION_PLACEHOLDER: 'Paste the job description here to get tailored feedback for this specific role...',
    PASTE_TEXT: 'Paste Text',
    UPLOAD_PDF: 'Upload PDF',
    PAGE_TITLE: 'Resume Analysis',
    PAGE_DESCRIPTION: 'Get AI-powered insights to improve your resume',
    FILE_UPLOAD_HINT: 'Click to select or drag and drop a PDF file',
    MAX_FILE_SIZE: 'Maximum file size: 5MB',
    LOADING: 'Loading...',
    LOAD_MORE: 'Load More',
    NO_ANALYSIS_HISTORY: 'No Analysis History',
    VIEW_PAST_ANALYSES: 'View your past resume analyses',
    SHOWING_ANALYSES: 'Showing',
    OF_ANALYSES: 'of',
    ANALYSES: 'analyses',
    RESUME_SCORE: 'Resume Score',
    SCORE_SUMMARY: 'Summary',
    KEYWORDS_PRESENT: 'Keywords in resume',
    KEYWORDS_MISSING: 'Keywords to add',
    EXPORT_PDF: 'Export PDF',
    DELETE: 'Delete',
    CONFIRM: 'Confirm',
    CANCEL: 'Cancel',
    DELETE_TITLE: 'Delete analysis',
    CONFIRM_DELETE: 'Are you sure you want to delete this analysis?',
    DELETE_FAILED: 'Failed to delete analysis',
    VIEW_ANALYSIS: 'View Analysis',
    HIDE_ANALYSIS: 'Hide Analysis',
};

export const NAV_LINKS = [
    { to: ROUTES.DASHBOARD, label: LABELS.ANALYZE },
    { to: ROUTES.HISTORY, label: LABELS.HISTORY },
];

export const NAV_ICON_MAP: Record<string, string> = {
    [ROUTES.DASHBOARD]: 'FileSearch',
    [ROUTES.HISTORY]: 'History',
};
