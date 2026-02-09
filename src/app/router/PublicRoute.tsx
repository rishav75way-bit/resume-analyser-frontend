import type React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { ROUTES } from '../utils/constants';

interface PublicRouteProps {
    children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    if (isAuthenticated) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    return <>{children}</>;
};
