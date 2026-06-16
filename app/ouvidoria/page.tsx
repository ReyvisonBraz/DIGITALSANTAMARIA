'use client';

import { useState } from 'react';
import { CheckCircle2, Clock3, FileText, MessageSquare, Phone, SearchCheck, ShieldCheck } from 'lucide-react';
import DemandForm from '@/features/ouvidoria/DemandForm';
import ProtocolSearch from '@/features/ouvidoria/ProtocolSearch';

export default function OuvidoriaPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'search'>('create');
  const [createdProtocol, setCreatedProtocol] = useState<string | null>(null);

  return (
    <div className="page-shell">
      <section className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 md:px-10 lg:px-12">
        <div className="hero-panel grid grid-cols-1 gap-6 p-5 sm:p-7 md:grid-cols-[1fr_0.78fr] md:p-9">
          <div className="relative z-10 space-y-6">
            <div className="soft-chip w-fit">
              <ShieldCheck className="h-4 w-4" />
              Canal oficial
            </div>

            <div className="max-w-3xl space-y-3 animate-float-in">
              <h1 className="text-3xl font-semibold leading-tight tracking-normal text-text-main sm:text-5xl lg:text-6xl">
                Ouvidoria e solicitações
              </h1>
              <p className="max-w-2xl text-base font-medium leading-7 text-text-muted">
                Abra uma solicitação, registre uma manifestação ou consulte o andamento pelo protocolo.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap">
              <button
                onClick={() => setActiveTab('create')}
                className={activeTab === 'create' ? 'action-button-primary' : 'action-button-secondary'}
              >
                <MessageSquare className="h-4 w-4" />
                Abrir solicitação
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={activeTab === 'search' ? 'action-button-primary' : 'action-button-secondary'}
              >
                <SearchCheck className="h-4 w-4" />
                Consultar protocolo
              </button>
            </div>
          </div>

          <aside className="relative z-10 glass-panel p-4 md:p-5">
            <h2 className="text-lg font-semibold tracking-normal text-text-main">Antes de começar</h2>
            <div className="mt-4 space-y-3">
              {[
                {
                  icon: FileText,
                  text: 'Informe o máximo de detalhes possível para acelerar o encaminhamento.',
                },
                {
                  icon: Phone,
                  text: 'Em emergência, use também canais telefônicos ou presenciais do município.',
                },
                {
                  icon: Clock3,
                  text: 'Solicitações vinculadas ao login aparecem no Painel do Cidadão.',
                },
              ].map((item) => (
                <div key={item.text} className="civic-card flex gap-3 p-4">
                  <item.icon className="relative z-10 mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="relative z-10 text-sm font-medium leading-6 text-text-muted">{item.text}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <main className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-5 px-4 py-7 sm:px-6 md:px-10 lg:grid-cols-[1fr_0.35fr] lg:px-12">
        <section className="glass-panel p-4 md:p-6">
          <div className="mb-5 border-b border-border pb-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              {activeTab === 'create' ? 'Novo protocolo' : 'Acompanhamento'}
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-normal text-text-main">
              {activeTab === 'create' ? 'Abrir solicitação' : 'Consultar protocolo'}
            </h2>
          </div>

          {createdProtocol && activeTab === 'create' && (
            <div className="mb-5 rounded-2xl border border-green-200 bg-green-50/90 p-4 text-green-900 shadow-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Solicitação protocolada com sucesso.</p>
                  <p className="mt-1 break-all font-mono text-base font-semibold text-green-800 sm:text-lg">
                    {createdProtocol}
                  </p>
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
          <div className="civic-card p-5">
            <p className="relative z-10 text-xs font-semibold uppercase tracking-widest text-text-muted">Prazo de resposta</p>
            <p className="relative z-10 mt-2 text-3xl font-semibold text-text-main">Ate 20 dias uteis</p>
            <p className="relative z-10 mt-2 text-sm font-medium leading-6 text-text-muted">
              O prazo pode variar conforme a complexidade e o setor responsável.
            </p>
          </div>
          <div className="rounded-[1.25rem] bg-gradient-to-br from-text-main to-primary-dark p-5 text-white shadow-[0_18px_48px_rgba(15,23,42,0.16)]">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-light">Painel do Cidadão</p>
            <p className="mt-2 text-sm font-medium leading-6 text-white/75">
              Solicitações feitas com login aparecem automaticamente no histórico.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
