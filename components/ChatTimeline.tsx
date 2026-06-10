'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, Clock, Loader2, MessageSquare, Send, ShieldCheck, UserRound, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/lib/toast-context';
import { formatDate } from '@/lib/utils/formatters';

/**
 * Mensagem genérica na timeline de conversa.
 */
export interface TimelineMessage {
  id: string;
  authorName: string;
  authorRole: 'citizen' | 'staff' | 'system';
  message: string;
  createdAt: { seconds: number; nanoseconds?: number; toDate?: () => Date } | string;
  isStaff: boolean;
}

/**
 * Adaptador de serviço — o parent fornece as funções de dados.
 */
export interface ChatTimelineAdapter {
  /** Real-time listener de mensagens. Retorna função de unsubscribe. */
  listenMessages: (
    entityId: string,
    onChange: (rawMessages: { id: string; authorName: string; authorRole: string; message: string; createdAt: any }[]) => void,
    onError?: (error: unknown) => void,
  ) => () => void;
  /** Cria uma nova mensagem. */
  createMessage: (input: {
    entityId: string;
    authorId: string;
    authorName: string;
    authorRole: string;
    message: string;
  }) => Promise<any>;
  /** Marca a conversa como lida pelo cidadão. */
  markAsRead: (entityId: string) => Promise<void>;
}

interface ChatTimelineProps {
  entityId: string;
  /** Mensagem inicial (a do formulário de criação). */
  initialAuthorName: string;
  initialMessage: string;
  initialCreatedAt: any;
  /** Resposta legada (antes do chat existir). */
  legacyResponseText?: string;
  legacyResponseAuthorName?: string;
  /** Serviço de dados. */
  adapter: ChatTimelineAdapter;
  /** Pode responder? (pré-computado pelo parent). */
  canReply: boolean;
  currentUserId: string;
  currentUserName: string;
  /** Deve marcar como lido? */
  shouldMarkRead: boolean;
  /** Configuração visual. */
  title?: string;
  conversationAriaLabel?: string;
  replyPlaceholder?: string;
  compact?: boolean;
}

const ROLE_ICON: Record<string, typeof UserRound> = {
  citizen: UserRound,
  staff: ShieldCheck,
  system: CheckCircle2,
};

function messageDate(createdAt: any): string {
  return createdAt ? formatDate(createdAt) : 'Agora';
}

export default function ChatTimeline({
  entityId,
  initialAuthorName,
  initialMessage,
  initialCreatedAt,
  legacyResponseText,
  legacyResponseAuthorName = 'Prefeitura',
  adapter,
  canReply,
  currentUserId,
  currentUserName,
  shouldMarkRead,
  title = 'Conversa do protocolo',
  conversationAriaLabel = 'Conversa do protocolo',
  replyPlaceholder = 'Escreva uma resposta...',
  compact = false,
}: ChatTimelineProps) {
  const { toast } = useToast();
  const [rawMessages, setRawMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const firstLoadRef = useRef(true);

  // ── Real-time listener ──────────────────────────────────
  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = adapter.listenMessages(
      entityId,
      (items) => {
        setRawMessages(items);
        setLoading(false);
        setError(null);
      },
      () => {
        setError('Não foi possível carregar a conversa.');
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [entityId, adapter]);

  // ── Auto-scroll ─────────────────────────────────────────
  useEffect(() => {
    if (rawMessages.length > 0) {
      bottomRef.current?.scrollIntoView({
        behavior: firstLoadRef.current ? 'auto' : 'smooth',
      });
      firstLoadRef.current = false;
    }
  }, [rawMessages.length]);

  // ── Mark as read ────────────────────────────────────────
  useEffect(() => {
    if (!shouldMarkRead) return;
    adapter.markAsRead(entityId).catch(() => {});
  }, [shouldMarkRead, entityId, adapter]);

  // ── Monta timeline (inicial + mensagens + legado) ───────
  const timeline = useMemo<TimelineMessage[]>(() => {
    const items: TimelineMessage[] = [
      {
        id: `initial-${entityId}`,
        authorName: initialAuthorName,
        authorRole: 'citizen',
        message: initialMessage,
        createdAt: initialCreatedAt,
        isStaff: false,
      },
    ];

    for (const m of rawMessages) {
      items.push({
        id: m.id,
        authorName: m.authorName || 'Sistema',
        authorRole: m.authorRole || 'system',
        message: m.message || '',
        createdAt: m.createdAt,
        isStaff: m.authorRole === 'staff',
      });
    }

    // Resposta legada (adminAction de antes do chat)
    const legacy = legacyResponseText?.trim();
    const alreadyInMessages = legacy
      ? rawMessages.some(
          (m) => m.authorRole === 'staff' && m.message?.trim() === legacy,
        )
      : true;

    if (legacy && !alreadyInMessages) {
      items.push({
        id: `legacy-${entityId}`,
        authorName: legacyResponseAuthorName,
        authorRole: 'staff',
        message: legacyResponseText!,
        createdAt: new Date().toISOString() as any,
        isStaff: true,
      });
    }

    return items;
  }, [entityId, initialAuthorName, initialMessage, initialCreatedAt, legacyResponseText, legacyResponseAuthorName, rawMessages]);

  // ── Enviar resposta ─────────────────────────────────────
  const handleReply = async () => {
    const message = reply.trim();
    if (!message || !canReply) return;

    setSubmitting(true);
    try {
      await adapter.createMessage({
        entityId,
        authorId: currentUserId,
        authorName: currentUserName || 'Cidadão',
        authorRole: 'citizen',
        message,
      });
      setReply('');
      toast('Resposta enviada.', 'success');
    } catch {
      toast('Não foi possível enviar a resposta.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ──────────────────────────────────────────────
  return (
    <section className={compact ? 'space-y-3' : 'rounded-xl border border-border bg-white p-4'}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-muted">
          <MessageSquare className="h-4 w-4 text-primary" />
          {title}
        </div>
        {loading && <Loader2 className="h-4 w-4 animate-spin text-text-muted" />}
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="mt-4 space-y-3" role="log" aria-live="polite" aria-label={conversationAriaLabel}>
        {timeline.map((msg) => {
          const Icon = ROLE_ICON[msg.authorRole] || UserRound;

          return (
            <article
              key={msg.id}
              className={`rounded-xl border p-4 ${msg.isStaff ? 'border-green-200 bg-green-50' : 'border-border bg-surface'}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full ${msg.isStaff ? 'bg-green-600 text-white' : 'bg-primary/10 text-primary'}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-black text-text-main">{msg.authorName}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                      {msg.isStaff ? 'Prefeitura' : msg.authorRole === 'system' ? 'Sistema' : 'Cidadão'}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-text-muted">
                  <Clock className="h-3.5 w-3.5" />
                  {messageDate(msg.createdAt)}
                </span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm font-medium leading-6 text-text-muted">{msg.message}</p>
            </article>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {canReply && (
        <form
          onSubmit={(e) => { e.preventDefault(); handleReply(); }}
          className="mt-4 rounded-xl border border-border bg-surface p-3"
        >
          <label className="block space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Responder à prefeitura</span>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={3}
              maxLength={800}
              placeholder={replyPlaceholder}
              aria-label="Mensagem de resposta"
              className="w-full resize-none rounded-xl border border-border bg-white p-3 text-sm font-medium leading-6 text-text-main outline-none transition focus:border-primary"
            />
          </label>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-text-muted">{reply.trim().length}/800</span>
            <button
              type="submit"
              disabled={submitting || !reply.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Enviar resposta
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
