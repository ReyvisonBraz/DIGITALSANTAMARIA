'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  BarChart3, 
  Users, 
  Search, 
  Filter,
  MessageSquare,
  ArrowUpRight,
  ChevronRight,
  ShieldCheck,
  FileText,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';
import { useAuth } from '@/lib/auth-context';

const initialIssues = [
  { id: 'OUV-2026-1024', user: 'Carlos Silva', type: 'Reclamação', subject: 'Buraco na Rua das Flores', status: 'Pendente', date: '24/10/2026', priority: 'Média', content: 'Há um buraco enorme em frente ao número 42 que está causando acidentes.', response: '' },
  { id: 'OUV-2026-1025', user: 'Maria Souza', type: 'Dúvida', subject: 'IPTU 2026 - Datas', status: 'Em Análise', date: '25/10/2026', priority: 'Baixa', content: 'Gostaria de saber se o carnê do IPTU 2026 já está disponível para impressão no site.', response: '' },
  { id: 'PET-2026-003', user: 'João Pereira', type: 'Petição', subject: 'Reforma da Praça Central', status: 'Triagem Jurídica', date: '26/10/2026', priority: 'Alta', content: 'A praça central precisa de novos bancos e iluminação LED urgente para lazer seguro.', response: '' },
  { id: 'OUV-2026-1026', user: 'Anônimo', type: 'Denúncia', subject: 'Descarte Irregular', status: 'Pendente', date: '26/10/2026', priority: 'Crítica', content: 'Caminhão de placa ABC-1234 descartando entulho em área de preservação.', response: '' },
];

export default function GestaoPage() {
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [issues, setIssues] = useState(initialIssues);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [adminResponse, setAdminResponse] = useState('');

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // SEGURANÇA: Bloqueio estrito de acesso
  if (!user || user.email !== 'littlefigther50@gmail.com') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <div className="w-20 h-20 bg-accent-danger/10 text-accent-danger rounded-[2rem] flex items-center justify-center mb-6">
           <AlertCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-text-main uppercase tracking-tight mb-2">Acesso Restrito</h2>
        <p className="text-text-muted font-ui max-w-md">
          Você não tem permissão para acessar o Centro de Governança. Este painel é exclusivo para gestores públicos autorizados.
        </p>
      </div>
    );
  }

  const stats = [
    { label: 'Demandas Totais', value: '1.2k', icon: FileText, color: 'text-primary' },
    { label: 'Aguardando Triagem', value: '42', icon: Clock, color: 'text-accent-warning' },
    { label: 'Cidadãos Ativos', value: '8.5k', icon: Users, color: 'text-green-600' },
    { label: 'Eficiência de Resposta', value: '92%', icon: BarChart3, color: 'text-blue-600' },
  ];

  const handleResolve = (id: string, customResponse?: string) => {
    setIssues(issues.map(i => i.id === id ? { ...i, status: 'Resolvido', response: customResponse || i.response } : i));
    toast('Protocolo marcado como resolvido e cidadão notificado!', 'success');
    setSelectedIssue(null);
    setAdminResponse('');
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setIssues(issues.map(i => i.id === id ? { ...i, status: newStatus } : i));
    toast(`Status atualizado para: ${newStatus}`, 'info');
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 md:p-12 pb-32 gap-8 md:gap-10">
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-black text-primary uppercase tracking-[0.2em] md:tracking-[0.3em]">
             <ShieldCheck className="w-3 md:w-4 h-3 md:h-4" />
             Painel de Gestão Pública
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-text-main tracking-tighter uppercase leading-none">
            Centro de <span className="text-primary">Governança</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3 bg-surface p-2 rounded-xl md:rounded-2xl border-2 border-border shadow-inner w-full md:w-auto">
           <div className="w-10 h-10 bg-primary/10 rounded-lg md:rounded-xl flex items-center justify-center text-primary shrink-0">
              <Building2 className="w-6 h-6" />
           </div>
           <div className="pr-4 overflow-hidden">
              <p className="text-[8px] md:text-[10px] font-black text-text-muted uppercase tracking-widest leading-none truncate">Prefeitura de</p>
              <p className="text-xs md:text-sm font-black text-text-main uppercase truncate">Cidade Exemplo</p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2rem] border-2 border-border shadow-sm flex flex-col gap-3 md:gap-4 group hover:border-primary transition-all">
             <div className={cn("p-2.5 md:p-3 rounded-lg md:rounded-xl bg-surface border border-border w-fit transition-transform group-hover:scale-110", s.color)}>
                <s.icon className="w-4 md:w-5 h-4 md:h-5" />
             </div>
             <div>
                <p className="text-[8px] md:text-[10px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">{s.label}</p>
                <p className="text-xl md:text-3xl font-black text-text-main tracking-tighter leading-none">{s.value}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl md:rounded-[3.5rem] border-2 border-border border-b-[8px] md:border-b-[12px] border-b-primary shadow-2xl overflow-hidden">
         <div className="p-6 md:p-8 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-surface/30">
            <div className="flex items-center gap-3">
               <Filter className="w-4 md:w-5 h-4 md:h-5 text-text-muted" />
               <h2 className="text-lg md:text-xl font-black text-text-main uppercase tracking-tight">Fila de Atendimento</h2>
            </div>
            <div className="relative w-full sm:w-64">
               <input 
                 placeholder="Buscar Protocolo..." 
                 className="w-full h-10 md:h-11 bg-white border-2 border-border pl-10 pr-4 rounded-xl text-[10px] md:text-xs font-bold outline-none focus:border-primary transition-all shadow-inner"
               />
               <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            </div>
         </div>

         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[700px]">
               <thead>
                  <tr className="bg-surface/50">
                     <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest border-r border-border">Protocolo</th>
                     <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest border-r border-border">Cidadão</th>
                     <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest border-r border-border">Status</th>
                     <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest border-r border-border">Urgência</th>
                     <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest">Ações</th>
                  </tr>
               </thead>
               <tbody>
                  {issues.map((issue) => (
                     <tr key={issue.id} className="border-t border-border hover:bg-surface/20 transition-all group">
                        <td className="px-6 md:px-8 py-4 md:py-6">
                           <span className="text-[10px] md:text-xs font-black text-primary font-mono">{issue.id}</span>
                        </td>
                        <td className="px-6 md:px-8 py-4 md:py-6">
                           <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                 <p className="text-xs md:text-sm font-black text-text-main leading-none">{issue.user}</p>
                                 {issue.priority === 'Crítica' && (
                                   <div className="flex items-center gap-1 px-1.5 py-0.5 bg-accent-danger/10 text-accent-danger rounded-full text-[7px] md:text-[8px] font-black uppercase ring-1 ring-accent-danger/20 shrink-0">
                                      <Sparkles className="w-2 h-2" />
                                      AI Priority
                                   </div>
                                 )}
                              </div>
                              <p className="text-[9px] md:text-[10px] font-medium text-text-muted truncate max-w-[150px]">{issue.subject}</p>
                           </div>
                        </td>
                        <td className="px-6 md:px-8 py-4 md:py-6">
                           <div className={cn(
                             "inline-flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest shrink-0",
                             issue.status === 'Resolvido' ? "bg-green-50 text-green-600 border border-green-200" : "bg-accent-warning/10 text-accent-warning border border-accent-warning/20"
                           )}>
                              {issue.status}
                           </div>
                        </td>
                        <td className="px-6 md:px-8 py-4 md:py-6">
                           <div className={cn(
                             "flex items-center gap-1.5 md:gap-2 text-[9px] md:text-[10px] font-black uppercase shrink-0",
                             issue.priority === 'Crítica' ? "text-accent-danger" : (issue.priority === 'Alta' ? "text-primary" : "text-text-muted")
                           )}>
                              <AlertCircle className="w-3 h-3" />
                              {issue.priority}
                           </div>
                        </td>
                        <td className="px-6 md:px-8 py-4 md:py-6 text-right">
                           <div className="flex gap-2">
                              <button 
                                onClick={() => setSelectedIssue(issue)}
                                className="p-2 md:p-2.5 bg-primary/10 text-primary rounded-lg md:rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm border border-primary/10"
                              >
                                 <FileText className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleResolve(issue.id)}
                                className="p-2 md:p-2.5 bg-green-50 text-green-600 rounded-lg md:rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm border border-green-100"
                              >
                                 <CheckCircle2 className="w-4 h-4" />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
         <div className="bg-text-main p-8 md:p-10 rounded-2xl md:rounded-[3rem] text-white space-y-4 md:space-y-6 relative overflow-hidden group">
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter">Prioridades Populares</h3>
            <p className="text-xs md:text-sm font-ui opacity-70 leading-relaxed">
               Ações de governo priorizadas pelos cidadãos para o próximo ciclo orçamentário.
            </p>
            <div className="space-y-3 md:space-y-4 pt-2 md:pt-4">
               <div className="flex items-center justify-between p-3 md:p-4 bg-white/5 rounded-xl md:rounded-2xl border border-white/10 group-hover:border-primary transition-all">
                  <div className="flex items-center gap-3 md:gap-4">
                     <div className="w-8 md:w-10 h-8 md:h-10 bg-primary/20 rounded-lg md:rounded-xl flex items-center justify-center text-primary text-[10px] md:text-xs font-black">#1</div>
                     <div>
                        <p className="text-[10px] md:text-xs font-black uppercase leading-tight">Iluminação da Praça Central</p>
                        <p className="text-[8px] md:text-[10px] opacity-40 uppercase font-black">92% de aprovação</p>
                     </div>
                  </div>
                  <ArrowUpRight className="w-4 md:w-5 h-4 md:h-5 text-primary" />
               </div>
               <div className="flex items-center justify-between p-3 md:p-4 bg-white/5 rounded-xl md:rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3 md:gap-4">
                     <div className="w-8 md:w-10 h-8 md:h-10 bg-white/10 rounded-lg md:rounded-xl flex items-center justify-center text-white/50 text-[10px] md:text-xs font-black">#2</div>
                     <div>
                        <p className="text-[10px] md:text-xs font-black uppercase leading-tight">Nova Ciclovia Sul</p>
                        <p className="text-[8px] md:text-[10px] opacity-40 uppercase font-black">74% de aprovação</p>
                     </div>
                  </div>
                  <ArrowUpRight className="w-4 md:w-5 h-4 md:h-5 opacity-20" />
               </div>
            </div>
            <Users className="absolute -right-6 md:-right-10 -bottom-6 md:-bottom-10 w-40 md:w-48 h-40 md:h-48 opacity-[0.03] pointer-events-none" />
         </div>

         <div className="bg-surface p-8 md:p-10 rounded-2xl md:rounded-[3rem] border-2 border-border border-dashed flex flex-col items-center justify-center text-center space-y-4 md:space-y-6">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl flex items-center justify-center border-2 border-border shadow-xl">
               <Building2 className="w-7 md:w-8 h-7 md:h-8 text-text-muted" />
            </div>
            <div className="space-y-1 md:space-y-2">
               <h4 className="text-lg md:text-xl font-black text-text-main uppercase tracking-tight">Relatório de Impacto</h4>
               <p className="text-[10px] md:text-xs font-medium text-text-muted font-ui max-w-[240px] leading-relaxed">
                  Gere um PDF detalhando todas as resoluções do mês para o Portal da Transparência.
               </p>
            </div>
            <button className="btn-tactile bg-white border-2 border-border text-text-main px-6 md:px-8 py-3 rounded-lg md:rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:border-primary hover:text-primary transition-all w-full sm:w-auto">
               Gerar Relatório Completo
            </button>
         </div>
      </section>

      {/* Response Drawer / Modal Simulation */}
      <AnimatePresence>
        {selectedIssue && (
          <div className="fixed inset-0 z-[120] flex items-center justify-end p-0 sm:p-6 bg-text-main/60 backdrop-blur-sm">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="bg-white h-full sm:h-auto sm:max-h-[90vh] w-full sm:max-w-2xl sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border-l-4 border-primary"
            >
               <div className="p-8 border-b border-border bg-surface/30 flex justify-between items-center">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Análise de Demanda</p>
                     <h3 className="text-2xl font-black text-text-main uppercase tracking-tighter">{selectedIssue.id}</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedIssue(null)}
                    className="p-3 bg-white border-2 border-border rounded-2xl hover:text-accent-danger transition-all"
                  >
                     <ChevronRight className="w-6 h-6" />
                  </button>
               </div>

               <div className="p-8 space-y-10 overflow-y-auto no-scrollbar flex-grow">
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-1">
                        <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">Manifestante</span>
                        <p className="text-sm font-black text-text-main">{selectedIssue.user}</p>
                     </div>
                     <div className="space-y-1 text-right">
                        <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">Data de Registro</span>
                        <p className="text-sm font-black text-text-main">{selectedIssue.date}</p>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest">Conteúdo da Mensagem</h4>
                     </div>
                     <div className="p-6 bg-surface rounded-3xl border-2 border-border border-dashed font-ui text-sm font-medium text-text-muted leading-relaxed">
                        "{selectedIssue.content}"
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="flex items-center gap-3">
                        <ArrowUpRight className="w-5 h-5 text-primary" />
                        <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest">Resposta da Gestão</h4>
                     </div>
                     <textarea 
                       rows={5}
                       placeholder="Escreva aqui a resposta oficial que o cidadão receberá..."
                       value={adminResponse}
                       onChange={(e) => setAdminResponse(e.target.value)}
                       className="w-full bg-white border-2 border-border p-5 rounded-3xl font-bold focus:border-primary outline-none transition-all shadow-inner resize-none font-ui text-sm"
                     />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-border">
                     <button 
                       onClick={() => handleUpdateStatus(selectedIssue.id, 'Em Análise')}
                       className="flex-1 py-4 bg-surface text-text-main rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-border hover:border-primary transition-all shadow-sm"
                     >
                        Mover para Análise
                     </button>
                     <button 
                       onClick={() => handleResolve(selectedIssue.id, adminResponse)}
                       disabled={!adminResponse}
                       className="flex-2 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 transition-all"
                     >
                        Responder e Finalizar
                        <CheckCircle2 className="w-5 h-5" />
                     </button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
