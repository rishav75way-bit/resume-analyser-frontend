import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { Layout } from '../layouts/Layout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { RootRedirect } from './RootRedirect';
import { NotFoundPage } from '../pages/NotFoundPage';

const LoginPage = lazy(() => import('../../features/auth/pages/LoginPage').then(module => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('../../features/auth/pages/RegisterPage').then(module => ({ default: module.RegisterPage })));
const DashboardPage = lazy(() => import('../../features/resume/pages/DashboardPage').then(module => ({ default: module.DashboardPage })));
const HistoryPage = lazy(() => import('../../features/resume/pages/HistoryPage').then(module => ({ default: module.HistoryPage })));
const ComparePage = lazy(() => import('../../features/resume/pages/ComparePage').then(module => ({ default: module.ComparePage })));
const AnalyticsPage = lazy(() => import('../../features/resume/pages/AnalyticsPage').then(module => ({ default: module.AnalyticsPage })));
const CoverLetterPage = lazy(() => import('../../features/coverLetter/pages/CoverLetterPage').then(module => ({ default: module.CoverLetterPage })));
const CoverLetterHistoryPage = lazy(() => import('../../features/coverLetter/pages/CoverLetterHistoryPage').then(module => ({ default: module.CoverLetterHistoryPage })));
const DownloadResumePage = lazy(() => import('../../features/resume/pages/DownloadResumePage').then(module => ({ default: module.DownloadResumePage })));
const ChatPage = lazy(() => import('../../features/resume/pages/ChatPage').then(module => ({ default: module.ChatPage })));

const LazyLoginPage = () => (
    <Suspense fallback={null}>
        <LoginPage />
    </Suspense>
);

const LazyRegisterPage = () => (
    <Suspense fallback={null}>
        <RegisterPage />
    </Suspense>
);

const LazyDashboardPage = () => (
    <Suspense fallback={null}>
        <DashboardPage />
    </Suspense>
);

const LazyHistoryPage = () => (
    <Suspense fallback={null}>
        <HistoryPage />
    </Suspense>
);

const LazyComparePage = () => (
    <Suspense fallback={null}>
        <ComparePage />
    </Suspense>
);

const LazyAnalyticsPage = () => (
    <Suspense fallback={null}>
        <AnalyticsPage />
    </Suspense>
);

const LazyCoverLetterPage = () => (
    <Suspense fallback={null}>
        <CoverLetterPage />
    </Suspense>
);

const LazyCoverLetterHistoryPage = () => (
    <Suspense fallback={null}>
        <CoverLetterHistoryPage />
    </Suspense>
);

const LazyDownloadResumePage = () => (
    <Suspense fallback={null}>
        <DownloadResumePage />
    </Suspense>
);

const LazyChatPage = () => (
    <Suspense fallback={null}>
        <ChatPage />
    </Suspense>
);

export const router = createBrowserRouter([
    {
        path: ROUTES.HOME,
        element: <Layout />,
        children: [
            {
                path: ROUTES.HOME,
                element: <RootRedirect />,
            },
            {
                path: ROUTES.LOGIN,
                element: (
                    <PublicRoute>
                        <LazyLoginPage />
                    </PublicRoute>
                ),
            },
            {
                path: ROUTES.REGISTER,
                element: (
                    <PublicRoute>
                        <LazyRegisterPage />
                    </PublicRoute>
                ),
            },
            {
                path: ROUTES.DASHBOARD,
                element: (
                    <ProtectedRoute>
                        <LazyDashboardPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: ROUTES.HISTORY,
                element: (
                    <ProtectedRoute>
                        <LazyHistoryPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: ROUTES.COMPARE,
                element: (
                    <ProtectedRoute>
                        <LazyComparePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: ROUTES.ANALYTICS,
                element: (
                    <ProtectedRoute>
                        <LazyAnalyticsPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: ROUTES.COVER_LETTER,
                element: (
                    <ProtectedRoute>
                        <LazyCoverLetterPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: ROUTES.COVER_LETTER_HISTORY,
                element: (
                    <ProtectedRoute>
                        <LazyCoverLetterHistoryPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: ROUTES.DOWNLOAD_RESUME,
                element: (
                    <ProtectedRoute>
                        <LazyDownloadResumePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: ROUTES.CHAT,
                element: (
                    <ProtectedRoute>
                        <LazyChatPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: '*',
                element: <NotFoundPage />,
            },
        ],
    },
]);
