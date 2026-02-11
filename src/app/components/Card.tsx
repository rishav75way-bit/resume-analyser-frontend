import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, style }) => {
    return (
        <div className={`bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-800/95 backdrop-blur-xl border border-slate-800/60 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 hover:shadow-primary-500/10 hover:border-slate-700/80 transition-all duration-500 hover:-translate-y-0.5 ${className}`} style={style}>
            {title && (
                <div className="px-6 py-5 border-b border-slate-800/60 bg-gradient-to-r from-slate-900/80 via-slate-800/60 to-slate-900/80">
                    <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                </div>
            )}
            <div className="p-6">{children}</div>
        </div>
    );
};
