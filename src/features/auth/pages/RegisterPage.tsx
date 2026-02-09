import React from 'react';
import { registerSchema } from '../schemas';
import type { RegisterFormData } from '../schemas';
import { useAuth } from '../hooks/useAuth';
import { LABELS, ROUTES } from '../../../app/utils/constants';
import { AuthForm } from '../components/AuthForm';

export const RegisterPage: React.FC = () => {
    const { register: registerUser, isLoading, error } = useAuth();

    const onSubmit = (data: RegisterFormData) => {
        registerUser(data);
    };

    return (
        <AuthForm
            schema={registerSchema}
            onSubmit={onSubmit}
            isLoading={isLoading}
            error={error}
            title={LABELS.REGISTER}
            submitLabel={LABELS.SIGN_UP}
            footerText={LABELS.ALREADY_HAVE_ACCOUNT}
            footerLinkText={LABELS.LOGIN}
            footerLinkTo={ROUTES.LOGIN}
        />
    );
};
