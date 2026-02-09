import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, style }) => {
    return (
        <div className={`bg-slate-900/80 backdrop-blur-sm border border-slate-800/50 rounded-xl overflow-hidden shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 transition-all duration-300 hover:border-slate-700/50 ${className}`} style={style}>
            {title && (
                <div className="px-6 py-4 border-b border-slate-800/50 bg-gradient-to-r from-slate-900/50 to-slate-800/30">
                    <h3 className="text-xl font-semibold text-white">{title}</h3>
                </div>
            )}
            <div className="p-6">{children}</div>
        </div>
    );
};
