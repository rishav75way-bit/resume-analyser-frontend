import type React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    cancelLabel: string;
    isConfirmLoading?: boolean;
    onConfirm: () => void | Promise<void>;
    onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    confirmLabel,
    cancelLabel,
    isConfirmLoading = false,
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 animate-in fade-in duration-300">
            <div className="w-full max-w-lg animate-in scale-in duration-300">
                <Card className="border-2 border-slate-700/80 shadow-2xl">
                    <div className="flex items-start justify-between gap-4 mb-6">
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{title}</h3>
                            <p className="text-base text-slate-300 leading-relaxed font-medium">{message}</p>
                        </div>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all duration-300 border border-transparent hover:border-slate-700/50"
                            aria-label={cancelLabel}
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                        <Button variant="ghost" onClick={onCancel} disabled={isConfirmLoading} className="px-6">
                            {cancelLabel}
                        </Button>
                        <Button variant="danger" onClick={onConfirm} isLoading={isConfirmLoading} className="px-6">
                            {confirmLabel}
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

