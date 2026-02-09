import React from 'react';
import { loginSchema } from '../schemas';
import type { LoginFormData } from '../schemas';
import { useAuth } from '../hooks/useAuth';
import { LABELS, ROUTES } from '../../../app/utils/constants';
import { AuthForm } from '../components/AuthForm';

export const LoginPage: React.FC = () => {
    const { login, isLoading, error } = useAuth();

    const onSubmit = (data: LoginFormData) => {
        login(data);
    };

    return (
        <AuthForm
            schema={loginSchema}
            onSubmit={onSubmit}
            isLoading={isLoading}
            error={error}
            title={LABELS.LOGIN}
            submitLabel={LABELS.LOGIN}
            footerText={LABELS.DONT_HAVE_ACCOUNT}
            footerLinkText={LABELS.SIGN_UP}
            footerLinkTo={ROUTES.REGISTER}
        />
    );
};
