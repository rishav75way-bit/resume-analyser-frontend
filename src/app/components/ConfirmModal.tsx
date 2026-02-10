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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            <div className="w-full max-w-lg">
                <Card className="border border-slate-700/60">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-white">{title}</h3>
                            <p className="text-sm text-slate-400 mt-2">{message}</p>
                        </div>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
                            aria-label={cancelLabel}
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="ghost" onClick={onCancel} disabled={isConfirmLoading}>
                            {cancelLabel}
                        </Button>
                        <Button variant="danger" onClick={onConfirm} isLoading={isConfirmLoading}>
                            {confirmLabel}
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

