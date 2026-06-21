'use client';

import React, { useState } from 'react';
import {
  FileLock2,
  Scale,
  ShieldCheck,
  Database,
  Eye,
  UserRoundCheck,
  Search,
  ChevronRight,
  Info,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState<'termos' | 'privacidade'>('termos');

  const downloadPDF = () => {
    const date = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>Conecta Santa Maria — Documento Legal</title>
<style>
  body { font-family: Georgia, serif; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1e293b; line-height: 1.8; }
  h1 { font-size: 28px; border-bottom: 3px solid #1a56bc; padding-bottom: 16px; margin-bottom: 8px; }
  h2 { font-size: 22px; margin-top: 36px; color: #1a56bc; }
  h3 { font-size: 18px; margin-top: 28px; }
  p { margin: 12px 0; }
  .header { text-align: center; margin-bottom: 40px; }
  .header p { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 2px; }
  .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
  .section { margin-bottom: 32px; }
  .section-num { display: inline-block; width: 28px; height: 28px; background: #f1f5f9; border-radius: 6px; text-align: center; line-height: 28px; font-size: 12px; font-weight: bold; margin-right: 8px; }
  @media print { body { margin: 0; } }
</style>
</head>
<body>
  <div class="header">
    <p>Prefeitura Municipal de Santa Maria do Pará</p>
    <h1>Conecta Santa Maria — Documento Legal</h1>
    <p>Emissão: ${date}</p>
  </div>

  <h2>Termos de Uso do Portal</h2>

  <div class="section">
    <h3><span class="section-num">01</span>Aceitação dos Termos</h3>
    <p>Ao acessar e utilizar o portal Conecta Santa Maria, você concorda integralmente com as regras aqui estabelecidas. Este portal é uma ferramenta de utilidade pública e seu uso indevido pode acarretar em bloqueio de acesso.</p>
  </div>

  <div class="section">
    <h3><span class="section-num">02</span>Responsabilidade do Usuário</h3>
    <p>O usuário é o único responsável pela veracidade das informações fornecidas nos relatos de zeladoria, petições e votos. Informações falsas ou trotes são passíveis de sanções civis e administrativas.</p>
  </div>

  <div class="section">
    <h3><span class="section-num">03</span>Disponibilidade do Serviço</h3>
    <p>A administração municipal reserva-se o direito de realizar manutenções programadas no portal, podendo haver instabilidades temporárias nos serviços de agendamento e consulta de protocolos.</p>
  </div>

  <h2>Política de Privacidade (LGPD)</h2>

  <div class="section">
    <h3>Coleta de Dados</h3>
    <p>Coletamos apenas o essencial para sua identificação via Google Auth e geolocalização aproximada para serviços de vizinhança.</p>
  </div>

  <div class="section">
    <h3>Finalidade</h3>
    <p>Seus dados nunca serão compartilhados com terceiros para fins comerciais. O uso é estritamente para gestão de serviços públicos.</p>
  </div>

  <div class="section">
    <h3><span class="section-num">01</span>Seus Direitos</h3>
    <p>Em conformidade com a Lei Geral de Proteção de Dados (13.709/2018), você pode solicitar a qualquer momento a exclusão definitiva de seu histórico de atividades e dados cadastrais do portal municipal.</p>
  </div>

  <div class="section">
    <h3><span class="section-num">02</span>Segurança</h3>
    <p>Utilizamos criptografia de ponta a ponta em todos os envios de formulários técnicos e documentos anexados nos processos de ouvidoria e agendamento de saúde.</p>
  </div>

  <div class="footer">
    Documento gerado automaticamente pelo portal Conecta Santa Maria em ${date}.<br/>
    Para dúvidas, entre em contato com a Ouvidoria Municipal.
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) {
      win.onload = () => {
        win.print();
      };
    }
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto min-h-screen p-6 md:p-12 pb-32 gap-12">
      
      {/* Header */}
      <section className="text-center space-y-6">
        <div className="inline-flex p-4 bg-tertiary/10 rounded-3xl border-2 border-tertiary/20 text-tertiary mb-2">
          <FileLock2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-semibold text-text-main tracking-tight leading-[1.0]" style={{ fontFamily: 'var(--font-display)' }}>
            Centro <span className="text-secondary">legal</span>
          </h1>
          <p className="text-[11px] font-bold text-text-muted uppercase tracking-[0.24em]">Conformidade e segurança de dados</p>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex p-2 bg-surface rounded-[2rem] border-2 border-border max-w-md mx-auto w-full">
         <button 
          onClick={() => setActiveTab('termos')}
          className={cn(
            "flex-1 py-4 rounded-3xl font-semibold text-[11px] uppercase tracking-widest transition-all active:scale-95",
            activeTab === 'termos' ? "bg-white text-tertiary shadow-lg border-2 border-tertiary/10" : "text-text-muted"
          )}
         >
            Termos de Uso
         </button>
         <button 
          onClick={() => setActiveTab('privacidade')}
          className={cn(
            "flex-1 py-4 rounded-3xl font-semibold text-[11px] uppercase tracking-widest transition-all active:scale-95",
            activeTab === 'privacidade' ? "bg-white text-primary shadow-lg border-2 border-primary/10" : "text-text-muted"
          )}
         >
            Privacidade
         </button>
      </div>

      <div className="bg-white p-8 md:p-16 rounded-[2rem] border-2 border-border shadow-xl">
        <AnimatePresence mode="wait">
          {activeTab === 'termos' ? (
            <motion.div 
              key="termos"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              <div className="flex items-center gap-4 text-tertiary">
                 <Scale className="w-8 h-8" />
                 <h2 className="text-3xl font-semibold tracking-tight">Termos de Uso do Portal</h2>
              </div>
              
              <div className="prose prose-slate max-w-none font-ui space-y-8 text-text-main">
                <section className="space-y-4">
                  <h3 className="font-semibold text-xl tracking-tight text-text-main flex items-center gap-3">
                    <span className="w-8 h-8 bg-surface rounded-lg flex items-center justify-center text-xs font-semibold">01</span>
                    Aceitação dos Termos
                  </h3>
                  <p className="opacity-80 leading-relaxed font-medium">
                    Ao acessar e utilizar o portal Conecta Santa Maria, você concorda integralmente com as regras aqui estabelecidas. Este portal é uma ferramenta de utilidade pública e seu uso indevido pode acarretar em bloqueio de acesso.
                  </p>
                </section>

                <section className="space-y-4">
                  <h3 className="font-semibold text-xl tracking-tight text-text-main flex items-center gap-3">
                    <span className="w-8 h-8 bg-surface rounded-lg flex items-center justify-center text-xs font-semibold">02</span>
                    Responsabilidade do Usuário
                  </h3>
                  <p className="opacity-80 leading-relaxed font-medium">
                    O usuário é o único responsável pela veracidade das informações fornecidas nos relatos de zeladoria, petições e votos. Informações falsas ou trotes são passíveis de sanções civis e administrativas.
                  </p>
                </section>

                <section className="space-y-4">
                  <h3 className="font-semibold text-xl tracking-tight text-text-main flex items-center gap-3">
                    <span className="w-8 h-8 bg-surface rounded-lg flex items-center justify-center text-xs font-semibold">03</span>
                    Disponibilidade do Serviço
                  </h3>
                  <p className="opacity-80 leading-relaxed font-medium">
                    A administração municipal reserva-se o direito de realizar manutenções programadas no portal, podendo haver instabilidades temporárias nos serviços de agendamento e consulta de protocolos.
                  </p>
                </section>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="privacidade"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              <div className="flex items-center gap-4 text-primary">
                 <ShieldCheck className="w-8 h-8" />
                 <h2 className="text-3xl font-semibold tracking-tight">Política de Privacidade (LGPD)</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                 <div className="p-8 bg-surface rounded-3xl border-2 border-border shadow-inner space-y-4">
                    <Database className="w-8 h-8 text-primary" />
                    <h4 className="font-semibold tracking-tight">Coleta de Dados</h4>
                    <p className="text-xs font-ui font-medium opacity-70 leading-relaxed">Coletamos apenas o essencial para sua identificação via Google Auth e geolocalização aproximada para serviços de vizinhança.</p>
                 </div>
                 <div className="p-8 bg-surface rounded-3xl border-2 border-border shadow-inner space-y-4">
                    <Eye className="w-8 h-8 text-primary" />
                    <h4 className="font-semibold tracking-tight">Finalidade</h4>
                    <p className="text-xs font-ui font-medium opacity-70 leading-relaxed">Seus dados nunca serão compartilhados com terceiros para fins comerciais. O uso é estritamente para gestão de serviços públicos.</p>
                 </div>
              </div>

              <div className="prose prose-slate max-w-none font-ui space-y-8 text-text-main">
                <section className="space-y-4">
                  <h3 className="font-semibold text-xl tracking-tight text-text-main flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-xs font-semibold text-primary">01</span>
                    Seus Direitos
                  </h3>
                  <p className="opacity-80 leading-relaxed font-medium">
                    Em conformidade com a Lei Geral de Proteção de Dados (13.709/2018), você pode solicitar a qualquer momento a exclusão definitiva de seu histórico de atividades e dados cadastrais do portal municipal.
                  </p>
                </section>

                <section className="space-y-4">
                  <h3 className="font-semibold text-xl tracking-tight text-text-main flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-xs font-semibold text-primary">02</span>
                    Segurança
                  </h3>
                  <p className="opacity-80 leading-relaxed font-medium">
                    Utilizamos criptografia de ponta a ponta em todos os envios de formulários técnicos e documentos anexados nos processos de ouvidoria e agendamento de saúde.
                  </p>
                </section>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-surface-container rounded-[2rem] border-2 border-border">
         <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-text-muted" />
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.2em]">Última atualização: 10 de Janeiro de 2026</span>
         </div>
         <div className="flex flex-col items-end gap-2">
            <button
               onClick={downloadPDF}
               className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-widest hover:underline transition-all"
            >
               <Download className="w-4 h-4" />
               Baixar PDF Completo
               <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-semibold text-text-muted/70">Formato imprimível</span>
         </div>
      </div>

    </div>
  );
}
