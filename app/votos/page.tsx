'use client';

import React, { useState } from 'react';
import { CheckCircle2, Gavel, Loader2, Vote } from 'lucide-react';
import { useContent } from '@/lib/hooks/use-content';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import ContentPage from '@/components/ui/ContentPage';
import ContentHero from '@/components/ui/ContentHero';
import { votePoll } from '@/services/polls.service';
import type { Poll, PollOption } from '@/types';

export default function VotosPage() {
  const { data, loading, error, refresh } = useContent<Poll>('polls');
  const { user, login } = useAuth();
  const { toast } = useToast();
  const [votingKey, setVotingKey] = useState<string | null>(null);

  const handleVote = async (poll: Poll, option: PollOption) => {
    if (!poll.isActive) {
      toast('Esta votação já foi encerrada.', 'error');
      return;
    }

    if (!user) {
      try {
        await login();
      } catch (loginError) {
        toast(loginError instanceof Error ? loginError.message : 'Não foi possível iniciar o login.', 'error');
      }
      return;
    }

    const key = `${poll.id}:${option.id}`;
    setVotingKey(key);
    try {
      await votePoll(poll.id, option.id);
      toast('Voto registrado com sucesso.', 'success');
      refresh();
    } catch (voteError) {
      const message = voteError instanceof Error ? voteError.message : 'Erro ao registrar voto.';
      toast(message.includes('already-exists') ? 'Você já votou nesta consulta.' : message, 'error');
    } finally {
      setVotingKey(null);
    }
  };

  return (
    <div className="flex min-h-screen w-full max-w-7xl flex-col gap-10 p-4 pb-32 md:mx-auto md:p-12">
      <ContentHero
        icon={Gavel}
        label="Democracia"
        title="Votações Cidadãs"
        subtitle="Orçamento participativo, consultas públicas e projetos de lei."
        accent="primary"
      />

      <ContentPage
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyMessage="Nenhuma votação ativa no momento."
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {data.map((poll) => (
            <article key={poll.id} className="civic-card flex flex-col gap-5 p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-violet-600/20 bg-violet-600/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-violet-700">
                  {poll.category}
                </span>
                <span className={poll.isActive
                  ? 'rounded-full border border-green-200 bg-green-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-green-700'
                  : 'rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-gray-600'}
                >
                  {poll.isActive ? 'Ativa' : 'Encerrada'}
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-semibold tracking-normal text-text-main">{poll.title}</h2>
                <p className="mt-2 text-sm font-medium leading-6 text-text-muted">{poll.description}</p>
              </div>

              <div className="space-y-3">
                {poll.options.map((option) => {
                  const percent = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
                  const key = `${poll.id}:${option.id}`;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleVote(poll, option)}
                      disabled={!poll.isActive || votingKey !== null}
                      className="group w-full rounded-2xl border border-border bg-white p-4 text-left transition hover:border-primary hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="text-sm font-bold text-text-main">{option.text}</span>
                        <span className="inline-flex items-center gap-2 text-xs font-black text-primary">
                          {votingKey === key ? <Loader2 className="h-4 w-4 animate-spin" /> : <Vote className="h-4 w-4" />}
                          {option.votes} voto{option.votes === 1 ? '' : 's'}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-surface">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
                      </div>
                      <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-text-muted">
                        {percent}% do total
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-xs font-bold text-text-muted">
                <span>{poll.totalVotes} voto{poll.totalVotes === 1 ? '' : 's'} registrados</span>
                {poll.isActive ? (
                  <span className="inline-flex items-center gap-1 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                    Participação aberta
                  </span>
                ) : (
                  <span>Período encerrado</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </ContentPage>
    </div>
  );
}
