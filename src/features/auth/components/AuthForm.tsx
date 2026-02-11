import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { LABELS } from '../../../app/utils/constants';
import { Card } from '../../../app/components/Card';
import { Input } from '../../../app/components/Input';
import { Button } from '../../../app/components/Button';
import { ErrorMessage } from '../../../app/components/ErrorMessage';

interface AuthFormData {
    email: string;
    password: string;
}

interface AuthFormProps {
    schema: z.ZodObject<Record<string, z.ZodTypeAny>>;
    onSubmit: (data: AuthFormData) => void;
    isLoading: boolean;
    error: string | null;
    title: string;
    submitLabel: string;
    footerText: string;
    footerLinkText: string;
    footerLinkTo: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({
    schema,
    onSubmit,
    isLoading,
    error,
    title,
    submitLabel,
    footerText,
    footerLinkText,
    footerLinkTo,
}) => {
    const form = useForm<AuthFormData>({
        resolver: zodResolver(schema) as unknown as Resolver<AuthFormData>,
    });

    const handleSubmit = (data: AuthFormData) => {
        onSubmit(data);
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12">
            <Card title={title} className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
                    <Input
                        label={LABELS.EMAIL}
                        type="email"
                        placeholder="Enter your email"
                        error={form.formState.errors.email?.message}
                        {...form.register('email')}
                    />
                    <Input
                        label={LABELS.PASSWORD}
                        type="password"
                        placeholder="Enter your password"
                        error={form.formState.errors.password?.message}
                        {...form.register('password')}
                    />

                    {error && <ErrorMessage message={error} />}

                    <Button type="submit" isLoading={isLoading} className="mt-2 w-full py-3 text-base">
                        {submitLabel}
                    </Button>

                    <div className="text-center mt-8 pt-6 border-t border-slate-800/60">
                        <span className="text-sm text-slate-400 font-medium">{footerText} </span>
                        <Link to={footerLinkTo} className="text-sm text-primary-400 hover:text-primary-300 font-semibold transition-colors duration-300 underline decoration-primary-500/50 underline-offset-2 hover:decoration-primary-400">
                            {footerLinkText}
                        </Link>
                    </div>
                </form>
            </Card>
        </div>
    );
};
