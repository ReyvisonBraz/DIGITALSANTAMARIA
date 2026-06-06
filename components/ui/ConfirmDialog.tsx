'use client';

import { AlertTriangle, Loader2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  tone?: 'danger' | 'default';
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  loading = false,
  tone = 'default',
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const danger = tone === 'danger';

  return (
    <Modal isOpen={isOpen} onClose={loading ? () => undefined : onClose} title={title} className="max-w-md">
      <div className="space-y-5">
        <div className="flex gap-3">
          <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${danger ? 'bg-rose-50 text-rose-600' : 'bg-primary/10 text-primary'}`}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium leading-6 text-text-muted">{description}</p>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-text-muted transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2 text-xs font-black uppercase tracking-widest text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
              danger ? 'bg-rose-600 hover:bg-rose-700' : 'bg-primary hover:bg-primary-dark'
            }`}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
