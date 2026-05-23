'use client';

import { useState } from 'react';
import { CheckCircle2, FileText, MessageSquare, Phone, SearchCheck, ShieldCheck } from 'lucide-react';
import DemandForm from '@/features/ouvidoria/DemandForm';
import ProtocolSearch from '@/features/ouvidoria/ProtocolSearch';

export default function OuvidoriaPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'search'>('create');
  const [createdProtocol, setCreatedProtocol] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-12">
      <section className="border-b border-border bg-white">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 md:grid-cols-[1fr_0.8fr] md:px-10 md:py-12 lg:px-12">
          <div className="space-y-5">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
              <ShieldCheck className="h-4 w-4" />
              Canal oficial
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-black leading-tight tracking-normal text-text-main sm:text-4xl lg:text-5xl">
                Ouvidoria e solicitações
              </h1>
              <p className="max-w-2xl text-base font-medium leading-7 text-text-muted">
                Abra uma solicitação, registre uma manifestação ou consulte o andamento
                pelo número de protocolo.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setActiveTab('create')}
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-black uppercase tracking-widest transition ${
                  activeTab === 'create'
                    ? 'bg-primary text-white'
                    : 'border border-border bg-white text-text-main hover:border-primary hover:text-primary'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                Abrir solicitação
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-black uppercase tracking-widest transition ${
                  activeTab === 'search'
                    ? 'bg-primary text-white'
                    : 'border border-border bg-white text-text-main hover:border-primary hover:text-primary'
                }`}
              >
                <SearchCheck className="h-4 w-4" />
                Consultar protocolo
              </button>
            </div>
          </div>

          <aside className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="text-lg font-black tracking-normal text-text-main">Antes de começar</h2>
            <div className="mt-4 space-y-3">
              <div className="flex gap-3 rounded-xl bg-white p-4">
                <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm font-medium leading-6 text-text-muted">
                  Informe o máximo de detalhes possível para facilitar o atendimento.
                </p>
              </div>
              <div className="flex gap-3 rounded-xl bg-white p-4">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm font-medium leading-6 text-text-muted">
                  Para atendimento emergencial, procure também os canais presenciais ou telefônicos do município.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <main className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 md:px-10 lg:grid-cols-[1fr_0.35fr] lg:px-12">
        <section className="rounded-2xl border border-border bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 border-b border-border pb-5">
            <p className="text-xs font-black uppercase tracking-widest text-primary">
              {activeTab === 'create' ? 'Novo protocolo' : 'Acompanhamento'}
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-normal text-text-main">
              {activeTab === 'create' ? 'Abrir solicitação' : 'Consultar protocolo'}
            </h2>
          </div>

          {createdProtocol && activeTab === 'create' && (
            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-green-900">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="text-sm font-black">Solicitação protocolada com sucesso.</p>
                  <p className="mt-1 break-all font-mono text-lg font-black text-green-800">{createdProtocol}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'create' ? (
            <DemandForm onSuccess={(protocolId) => setCreatedProtocol(protocolId)} />
          ) : (
            <ProtocolSearch />
          )}
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-widest text-text-muted">Prazo de resposta</p>
            <p className="mt-2 text-2xl font-black text-text-main">Até 20 dias úteis</p>
            <p className="mt-2 text-sm font-medium leading-6 text-text-muted">
              O prazo pode variar conforme a complexidade e o setor responsável.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-text-main p-5 text-white shadow-sm">
            <p className="text-xs font-black uppercase tracking-widest text-primary-light">Painel do Cidadão</p>
            <p className="mt-2 text-sm font-medium leading-6 text-white/70">
              Solicitações vinculadas ao login poderão aparecer no histórico do cidadão.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
