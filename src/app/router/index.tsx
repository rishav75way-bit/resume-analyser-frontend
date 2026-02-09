import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { Layout } from '../layouts/Layout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { RootRedirect } from './RootRedirect';
import { PageLoader } from './PageLoader';
import { NotFoundPage } from '../pages/NotFoundPage';

const LoginPage = lazy(() => import('../../features/auth/pages/LoginPage').then(module => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('../../features/auth/pages/RegisterPage').then(module => ({ default: module.RegisterPage })));
const DashboardPage = lazy(() => import('../../features/resume/pages/DashboardPage').then(module => ({ default: module.DashboardPage })));
const HistoryPage = lazy(() => import('../../features/resume/pages/HistoryPage').then(module => ({ default: module.HistoryPage })));

const LazyLoginPage = () => (
    <Suspense fallback={<PageLoader />}>
        <LoginPage />
    </Suspense>
);

const LazyRegisterPage = () => (
    <Suspense fallback={<PageLoader />}>
        <RegisterPage />
    </Suspense>
);

const LazyDashboardPage = () => (
    <Suspense fallback={<PageLoader />}>
        <DashboardPage />
    </Suspense>
);

const LazyHistoryPage = () => (
    <Suspense fallback={<PageLoader />}>
        <HistoryPage />
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
                path: '*',
                element: <NotFoundPage />,
            },
        ],
    },
]);
