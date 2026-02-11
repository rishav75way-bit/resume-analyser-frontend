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
    const baseStyles = 'px-5 py-2.5 rounded-xl font-semibold text-sm tracking-tight transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100';

    const variants = {
        primary: 'bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 text-white hover:from-primary-400 hover:via-primary-500 hover:to-primary-400 active:scale-[0.98] shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40',
        secondary: 'bg-gradient-to-r from-slate-700 to-slate-800 text-white hover:from-slate-600 hover:to-slate-700 active:scale-[0.98] shadow-md shadow-black/20 hover:shadow-lg',
        danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 active:scale-[0.98] shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40',
        ghost: 'bg-transparent text-primary-400 hover:bg-slate-800/60 hover:text-primary-300 active:scale-[0.98] border border-transparent hover:border-slate-700/50',
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
