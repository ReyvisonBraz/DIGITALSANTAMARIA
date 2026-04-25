'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Building2, 
  MapPin, 
  Users, 
  ShieldCheck, 
  ExternalLink, 
  AlertTriangle, 
  TreePine, 
  Home,
  Verified,
  Shield,
  Zap,
  Megaphone,
  Plus,
  CheckCircle2,
  Lock,
  ArrowRight,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '@/lib/toast-context';
import Modal from '@/components/ui/Modal';
import { cn } from '@/lib/utils';

import { useRouter } from 'next/navigation';

interface NeighborhoodGroup {
  id: string;
  name: string;
  members: number;
  description: string;
  isOfficial: boolean;
  link: string;
}

const neighborhoods = [
  {
    name: 'Centro',
    icon: Building2,
    groups: [
      {
        id: 'c1',
        name: 'Segurança Centro',
        members: 428,
        description: 'Monitoramento colaborativo e alertas da Guarda Municipal em tempo real.',
        isOfficial: true,
        link: 'https://chat.whatsapp.com/example-seguranca'
      },
      {
        id: 'c2',
        name: 'Zeladoria e Comércio',
        members: 156,
        description: 'Discussões sobre limpeza urbana, iluminação e suporte aos lojistas.',
        isOfficial: false,
        link: 'https://chat.whatsapp.com/example-comercio'
      }
    ]
  },
  {
    name: 'Jardim Alvorada',
    icon: TreePine,
    groups: [
      {
        id: 'a1',
        name: 'Alvorada Solidária',
        members: 312,
        description: 'Grupo de apoio mútuo, doações e eventos comunitários no bairro.',
        isOfficial: true,
        link: 'https://chat.whatsapp.com/example-solidario'
      },
      {
        id: 'a2',
        name: 'Vizinhança Atenta',
        members: 89,
        description: 'Rede de proteção entre vizinhos para as ruas das Flores e Ipês.',
        isOfficial: false,
        link: 'https://chat.whatsapp.com/example-vizinhanca'
      }
    ]
  },
  {
    name: 'Vila Nova',
    icon: Home,
    groups: [
      {
        id: 'v1',
        name: 'Vila Nova Unida',
        members: 567,
        description: 'O maior grupo do bairro. Informações gerais e classificados locais.',
        isOfficial: true,
        link: 'https://chat.whatsapp.com/example-unida'
      }
    ]
  }
];

export default function ComunidadePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [isSuggestingGroup, setIsSuggestingGroup] = useState(false);
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [suggestionData, setSuggestionData] = useState({ name: '', neighborhood: 'Centro', description: '' });

  const handleJoinGroup = () => {
    if (!rulesAccepted) {
       toast('Você precisa aceitar as regras para continuar.', 'info');
       return;
    }
    toast('Redirecionando para o WhatsApp oficial...', 'success');
    setTimeout(() => {
       window.open(selectedGroup.link, '_blank');
       setSelectedGroup(null);
       setRulesAccepted(false);
    }, 1000);
  };

  const handleSuggestGroup = (e: React.FormEvent) => {
    e.preventDefault();
    toast('Sugestão enviada para análise da equipe de moderação!', 'success');
    setIsSuggestingGroup(false);
    setSuggestionData({ name: '', neighborhood: 'Centro', description: '' });
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      {/* Alert Banner */}
      <div 
        onClick={() => router.push('/avisos')}
        className="bg-rose-600 text-white w-full py-4 px-8 flex items-center justify-center gap-3 shadow-lg z-10 sticky top-0 md:relative cursor-pointer hover:bg-rose-700 transition-colors"
      >
        <AlertTriangle className="w-5 h-5 fill-white/10 shrink-0" />
        <span className="text-[10px] md:text-sm font-black uppercase tracking-widest leading-none text-center underline decoration-white/30">
          Atenção: Chuvas fortes previstas. Toque para ver alertas da Defesa Civil em tempo real.
        </span>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-20">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
           <section className="text-center md:text-left space-y-6">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                <Sparkles className="w-3 h-3" />
                Vizinhança Conectada 2026
             </div>
             <h1 className="text-4xl md:text-7xl font-black text-text-main tracking-tighter leading-tight uppercase md:not-italic">
               Sua Voz No <span className="text-primary">Bairro</span>
             </h1>
             <p className="text-lg md:text-xl text-text-muted max-w-xl font-ui font-medium leading-relaxed">
               Participe ativamente das discussões sobre segurança, zeladoria e eventos. Conecte-se com quem mora perto de você.
             </p>
             <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 bg-surface px-4 py-2 rounded-xl border border-border">
                   <Users className="w-4 h-4 text-primary" />
                   <span className="text-xs font-black uppercase">2.5k Ativos</span>
                </div>
                <div className="flex items-center gap-2 bg-surface px-4 py-2 rounded-xl border border-border">
                   <Building2 className="w-4 h-4 text-primary" />
                   <span className="text-xs font-black uppercase">12 Bairros</span>
                </div>
             </div>
           </section>

           <div className="grid grid-cols-2 gap-4">
              <div className="bg-text-main p-8 rounded-[3rem] text-white space-y-4 shadow-2xl relative overflow-hidden group cursor-pointer" onClick={() => router.push('/avisos')}>
                 <Megaphone className="w-8 h-8 text-primary" />
                 <p className="text-lg font-black tracking-tight leading-tight uppercase italic">Alertas em <br/> Tempo Real</p>
                 <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                   <Megaphone className="w-32 h-32" />
                 </div>
              </div>
              <div className="bg-surface p-8 rounded-[3rem] border-2 border-border shadow-sm space-y-4 group">
                 <ShieldCheck className="w-8 h-8 text-primary" />
                 <p className="text-lg font-black text-text-main tracking-tight leading-tight uppercase italic">Segurança <br/> Colaborativa</p>
                 <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-32 h-32" />
                 </div>
              </div>
           </div>
        </div>

        {/* Neighborhood Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {neighborhoods.map((neighborhood) => (
            <section key={neighborhood.name} className="space-y-8">
              <div className="flex items-center gap-3 pb-3 border-b-4 border-primary/20">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-inner">
                  <neighborhood.icon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-text-main tracking-tight underline decoration-primary/30 decoration-4">
                  {neighborhood.name}
                </h2>
              </div>

              <div className="space-y-6">
                {neighborhood.groups.map((group) => (
                  <motion.div 
                    key={group.id}
                    whileHover={{ y: -8 }}
                    className="bg-white p-6 rounded-[2rem] shadow-sm border-2 border-border border-b-8 border-b-primary group transition-all"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-1">
                        <h3 className="text-xl font-black text-text-main group-hover:text-primary transition-colors tracking-tight uppercase">
                          {group.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-text-muted uppercase tracking-widest bg-surface px-2 py-1 rounded-lg border border-border">
                           <Users className="w-3 h-3" />
                           {group.members} membros
                        </div>
                      </div>
                      {group.isOfficial && (
                        <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-primary/20">
                          Oficial
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-text-muted font-ui font-medium leading-relaxed mb-8">
                      {group.description}
                    </p>
                    <button 
                      onClick={() => setSelectedGroup(group)}
                      className="w-full btn-tactile bg-primary text-white py-4 font-black flex items-center justify-center gap-3 text-xs uppercase tracking-widest group/btn shadow-xl shadow-primary/20"
                    >
                      Entrar no Grupo
                      <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
          
          <section className="space-y-8">
             <div className="flex items-center gap-3 pb-3 border-b-4 border-primary/20">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-inner">
                  <Plus className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-text-main tracking-tight decoration-primary/30 decoration-4">
                  Outras Áreas
                </h2>
              </div>
              <div 
                onClick={() => setIsSuggestingGroup(true)}
                className="relative group overflow-hidden rounded-[2.5rem] h-64 border-2 border-border shadow-md border-b-8 border-b-primary cursor-pointer active:scale-95 transition-all"
              >
                <Image 
                  src="https://picsum.photos/seed/comm/600/400" 
                  alt="Sugerir"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/60 to-transparent flex items-end p-8">
                  <div className="flex items-center gap-4 text-white">
                     <div className="p-3 bg-white text-primary rounded-2xl shadow-xl">
                       <Plus className="w-6 h-6" />
                     </div>
                     <p className="font-black text-lg uppercase tracking-tighter leading-tight italic">Sugerir grupo <br/> para seu bairro</p>
                  </div>
                </div>
              </div>
          </section>
        </div>

        {/* Benefits & Rules Section */}
        <section className="bg-surface p-10 md:p-16 rounded-[3.5rem] border-2 border-border border-b-[12px] border-b-primary shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-16 items-center relative z-10">
            <div className="flex-1 space-y-12">
              <div className="space-y-2">
                 <h2 className="text-4xl md:text-5xl font-black text-text-main tracking-tighter uppercase leading-none italic">
                    Força Comunitária
                 </h2>
                 <p className="text-lg font-ui font-medium text-text-muted">A união faz a gestão mais eficiente.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                {[
                  { icon: Verified, title: 'Monitoramento', desc: 'Moderadores oficiais mantêm o foco na zeladoria.' },
                  { icon: Zap, title: 'Alertas Flash', desc: 'Sinais de perigo ou interrupções enviadas em segundos.' },
                  { icon: Users, title: 'Colaboração', desc: 'Encontre ajuda rápida de vizinhos para necessidades diárias.' },
                  { icon: Megaphone, title: 'Direto ao Ponto', desc: 'Demandas do grupo vão direto ao painel do secretário.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-5 group">
                    <div className="p-4 bg-white rounded-2xl shadow-sm text-primary border border-border h-fit group-hover:bg-primary group-hover:text-white transition-all">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-black text-text-main text-lg tracking-tight uppercase">{item.title}</p>
                      <p className="text-sm text-text-muted font-ui font-bold leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-96 bg-white p-10 rounded-[2.5rem] shadow-2xl border-4 border-border/50 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-8 relative z-10">
                <Shield className="w-7 h-7 text-primary fill-primary/10" />
                <h4 className="font-black text-xl text-text-main tracking-tight uppercase">Código de Ética</h4>
              </div>
              <ul className="space-y-5 text-text-muted font-ui font-bold text-sm relative z-10">
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">1</div>
                  Proibido propaganda de qualquer natureza comercial ou política.
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">2</div>
                  Respeito mútuo é a base: ataques pessoais geram expulsão imediata.
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">3</div>
                  Fake News são crime. Verifique antes de compartilhar.
                </li>
              </ul>
              <div className="absolute -right-10 -bottom-10 p-8 opacity-[0.03] pointer-events-none">
                 <Shield className="w-64 h-64" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modal: Join Group Confirmation */}
      <Modal
        isOpen={!!selectedGroup}
        onClose={() => {
           setSelectedGroup(null);
           setRulesAccepted(false);
        }}
        title="Validar Acesso ao Grupo"
      >
        {selectedGroup && (
          <div className="space-y-8 overflow-hidden">
            <div className="bg-primary/5 p-6 rounded-3xl border-2 border-primary/20 flex items-center gap-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg border-2 border-primary/10 shrink-0">
                 <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-1">
                 <h4 className="font-black text-xl text-text-main tracking-tighter uppercase italic leading-none">{selectedGroup.name}</h4>
                 <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{selectedGroup.members} membros verificados</p>
              </div>
            </div>

            <div className="space-y-6">
               <div className="px-2">
                  <h5 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">Termos de Participação</h5>
                  <div className="space-y-3">
                     {[
                       'Entendo que este grupo é exclusivo para zeladoria e segurança.',
                       'Concordo em não compartilhar spam ou links externos.',
                       'Estou ciente das regras de silenciamento do grupo.'
                     ].map((rule, idx) => (
                        <div key={idx} className="flex gap-3 text-xs font-bold font-ui text-text-main bg-surface/50 p-3 rounded-xl border border-border shadow-inner">
                           <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                           {rule}
                        </div>
                     ))}
                  </div>
               </div>

               <label className="flex items-center gap-4 bg-surface p-5 rounded-2xl border-2 border-border cursor-pointer group hover:border-primary transition-all shadow-inner">
                  <div className="relative">
                     <input 
                       type="checkbox" 
                       checked={rulesAccepted}
                       onChange={() => setRulesAccepted(!rulesAccepted)}
                       className="peer w-7 h-7 rounded-lg border-2 border-border text-primary focus:ring-0 checked:bg-primary transition-all cursor-pointer appearance-none"
                     />
                     <CheckCircle2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-tight group-hover:text-primary transition-colors">Li e aceito as regras do bairro</span>
               </label>
            </div>

            <button 
              onClick={handleJoinGroup}
              disabled={!rulesAccepted}
              className={cn(
                "w-full btn-tactile py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all",
                rulesAccepted ? "bg-primary text-white shadow-primary/20" : "bg-border text-text-muted cursor-not-allowed"
              )}
            >
              Ir para o WhatsApp Oficial
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>
        )}
      </Modal>

      {/* Modal: Suggest Group */}
      <Modal
        isOpen={isSuggestingGroup}
        onClose={() => setIsSuggestingGroup(false)}
        title="Sugerir Nova Comunidade"
      >
        <form onSubmit={handleSuggestGroup} className="space-y-8">
           <div className="text-center p-4">
              <div className="p-4 bg-orange-50 rounded-full w-20 h-20 mx-auto flex items-center justify-center border-4 border-orange-100 rotate-6 shadow-inner mb-4">
                 <Building2 className="w-10 h-10 text-orange-500" />
              </div>
              <h4 className="text-2xl font-black text-text-main tracking-tight uppercase italic leading-none">Criar Nova Rede</h4>
              <p className="text-sm font-medium text-text-muted font-ui mt-2">Sugerindo um espaço para colaboração em seu setor.</p>
           </div>

           <div className="space-y-5">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Nome Sugerido</label>
                 <input 
                   required
                   value={suggestionData.name}
                   onChange={e => setSuggestionData({...suggestionData, name: e.target.value})}
                   className="w-full bg-surface border-2 border-border p-4 rounded-xl font-bold shadow-inner placeholder:not-italic italic" 
                   placeholder="Ex: Zeladoria Rua das Flores" 
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Bairro / Região</label>
                 <select 
                   value={suggestionData.neighborhood}
                   onChange={e => setSuggestionData({...suggestionData, neighborhood: e.target.value})}
                   className="w-full bg-surface border-2 border-border p-4 rounded-xl font-bold shadow-inner appearance-none outline-none"
                 >
                    <option>Centro</option>
                    <option>Jardim Alvorada</option>
                    <option>Vila Nova</option>
                    <option>Zona Sul</option>
                 </select>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Objetivo do Grupo</label>
                 <textarea 
                   required
                   value={suggestionData.description}
                   onChange={e => setSuggestionData({...suggestionData, description: e.target.value})}
                   className="w-full bg-surface border-2 border-border p-4 rounded-xl font-bold shadow-inner h-32 italic resize-none" 
                   placeholder="Qual o propósito principal desta comunidade?" 
                 />
              </div>
           </div>

           <button 
             type="submit"
             className="w-full btn-tactile bg-text-main text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
           >
             Enviar para Avaliação
             <ArrowRight className="w-5 h-5" />
           </button>
        </form>
      </Modal>
    </div>
  );
}
