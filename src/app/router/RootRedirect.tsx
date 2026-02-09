import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { ROUTES } from '../utils/constants';

export const RootRedirect: React.FC = () => {
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    
    return <Navigate to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN} replace />;
};
