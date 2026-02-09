import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    isLoading?: boolean;
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    isLoading = false,
    className = '',
    disabled,
    icon,
    ...props
}) => {
    const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 active:scale-95 shadow-lg shadow-primary-500/20',
        secondary: 'bg-slate-700 text-white hover:bg-slate-600 active:scale-95',
        danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-95',
        ghost: 'bg-transparent text-primary-400 hover:bg-slate-800 active:scale-95',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <Spinner size="sm" />
            ) : (
                <>
                    {icon}
                    {children}
                </>
            )}
        </button>
    );
};
