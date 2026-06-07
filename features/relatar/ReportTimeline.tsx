'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Clock, Loader2, MessageSquare, Send, ShieldCheck, UserRound } from 'lucide-react';
import { createReportMessage, getReportMessages } from '@/services/reports.service';
import { useToast } from '@/lib/toast-context';
import { formatDate } from '@/lib/utils/formatters';
import type { Report, ReportMessage } from '@/types';

const roleLabel: Record<ReportMessage['authorRole'], string> = {
  citizen: 'Cidadao',
  staff: 'Prefeitura',
  system: 'Sistema',
};

const roleIcon = {
  citizen: UserRound,
  staff: ShieldCheck,
  system: CheckCircle2,
};

type TimelineMessage = Pick<ReportMessage, 'id' | 'authorName' | 'authorRole' | 'message' | 'createdAt'>;

function messageDate(message: TimelineMessage) {
  return message.createdAt ? formatDate(message.createdAt) : 'Agora';
}

interface ReportTimelineProps {
  report: Report;
  compact?: boolean;
  allowCitizenReply?: boolean;
  currentUserId?: string;
  currentUserName?: string;
}

export default function ReportTimeline({
  report,
  compact = false,
  allowCitizenReply = false,
  currentUserId = '',
  currentUserName = '',
}: ReportTimelineProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ReportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reply, setReply] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function loadMessages() {
      setLoading(true);
      setError(null);
      try {
        const items = await getReportMessages(report.id);
        if (mounted) setMessages(items);
      } catch {
        if (mounted) setError('Nao foi possivel carregar a conversa deste relato.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadMessages();

    return () => {
      mounted = false;
    };
  }, [report.id, report.updatedAt, refreshTick]);

  const timeline = useMemo(() => {
    const base: TimelineMessage[] = [
      {
        id: `initial-${report.id}`,
        authorName: report.reporterName || 'Cidadao',
        authorRole: 'citizen',
        message: report.description,
        createdAt: report.createdAt,
      },
      ...messages,
    ];

    const hasLegacyResponse = report.adminResponse?.trim()
      && !messages.some((message) => message.authorRole === 'staff' && message.message === report.adminResponse);

    if (hasLegacyResponse) {
      base.push({
        id: `legacy-response-${report.id}`,
        authorName: 'Prefeitura',
        authorRole: 'staff',
        message: report.adminResponse || '',
        createdAt: report.updatedAt,
      });
    }

    return base;
  }, [report, messages]);

  const canReply = allowCitizenReply && currentUserId === report.reporterId;

  const handleReply = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = reply.trim();
    if (!message || !canReply) return;

    setSubmitting(true);
    try {
      await createReportMessage({
        reportId: report.id,
        authorId: currentUserId,
        authorName: currentUserName || 'Cidadao',
        authorRole: 'citizen',
        message,
      });
      setReply('');
      setRefreshTick((current) => current + 1);
      toast('Resposta enviada para a conversa.', 'success');
    } catch {
      toast('Nao foi possivel enviar a resposta.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={compact ? 'space-y-3' : 'rounded-xl border border-border bg-white p-4'}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-muted">
          <MessageSquare className="h-4 w-4 text-primary" />
          Conversa do relato
        </div>
        {loading && <Loader2 className="h-4 w-4 animate-spin text-text-muted" />}
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="mt-4 space-y-3">
        {timeline.map((message) => {
          const Icon = roleIcon[message.authorRole];
          const isStaff = message.authorRole === 'staff';

          return (
            <article
              key={message.id}
              className={`rounded-xl border p-4 ${isStaff ? 'border-green-200 bg-green-50' : 'border-border bg-surface'}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full ${isStaff ? 'bg-green-600 text-white' : 'bg-primary/10 text-primary'}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-black text-text-main">{message.authorName || roleLabel[message.authorRole]}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                      {roleLabel[message.authorRole]}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-text-muted">
                  <Clock className="h-3.5 w-3.5" />
                  {messageDate(message)}
                </span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm font-medium leading-6 text-text-muted">{message.message}</p>
            </article>
          );
        })}
      </div>

      {canReply && (
        <form onSubmit={handleReply} className="mt-4 rounded-xl border border-border bg-surface p-3">
          <label className="block space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Responder a prefeitura</span>
            <textarea
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              rows={3}
              maxLength={800}
              placeholder="Escreva uma nova informacao ou resposta sobre este relato"
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
