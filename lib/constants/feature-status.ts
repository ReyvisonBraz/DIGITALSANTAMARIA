/**
 * Status de desenvolvimento das features do portal.
 *
 * Cada entrada mapeia uma feature/rota ao seu status atual.
 * Usado para exibir badges "Em Desenvolvimento" no painel admin e paginas publicas.
 */

export type FeatureStatus = 'complete' | 'in_development' | 'planned';

export interface FeatureEntry {
  route: string;
  label: string;
  status: FeatureStatus;
  description: string;
  adminTab?: string;
}

export const FEATURE_STATUS: readonly FeatureEntry[] = [
  // ── Completas ──
  { route: '/ouvidoria', label: 'Ouvidoria', status: 'complete', description: 'Manifestacoes com protocolo, busca e timeline', adminTab: 'demands' },
  { route: '/relatar', label: 'Relatar Problema', status: 'complete', description: 'Formulario com foto, GPS e classificacao AI', adminTab: 'reports' },
  { route: '/peticoes', label: 'Peticoes', status: 'complete', description: 'Criacao e assinatura com Cloud Function', adminTab: 'petitions' },
  { route: '/empregos', label: 'Empregos', status: 'complete', description: 'Vagas com candidatura e painel admin', adminTab: 'jobs' },
  { route: '/comercio', label: 'Comercio Local', status: 'complete', description: 'Negocios com aprovacao e notificacao', adminTab: 'businesses' },
  { route: '/eventos', label: 'Eventos', status: 'complete', description: 'Agenda cultural com CRUD admin', adminTab: 'events' },
  { route: '/obras', label: 'Obras', status: 'complete', description: 'Acompanhamento com progresso e atualizacoes', adminTab: 'works' },
  { route: '/avisos', label: 'Avisos', status: 'complete', description: 'Comunicados oficiais com prioridade e expiracao', adminTab: 'notices' },
  { route: '/votos', label: 'Votos', status: 'complete', description: 'Enquetes com Cloud Function atomica', adminTab: 'polls' },
  { route: '/seguranca', label: 'Seguranca', status: 'complete', description: 'Zonas seguras e alertas de emergencia', adminTab: 'safety' },
  { route: '/transito', label: 'Transito', status: 'complete', description: 'Alertas com severidade e localizacao', adminTab: 'traffic' },
  { route: '/tributos', label: 'Tributos', status: 'complete', description: 'IPTU, ISS e certidoes', adminTab: 'taxes' },
  { route: '/social', label: 'Social', status: 'complete', description: 'Programas sociais com requisitos', adminTab: 'social' },
  { route: '/meio-ambiente', label: 'Meio Ambiente', status: 'complete', description: 'Coleta, denuncias e areas verdes', adminTab: 'environment' },
  { route: '/comunidade', label: 'Comunidade', status: 'complete', description: 'Grupos comunitarios', adminTab: 'community' },
  { route: '/servicos', label: 'Servicos', status: 'complete', description: 'Catalogo de servicos publicos', adminTab: 'services' },
  { route: '/perfil', label: 'Painel do Cidadao', status: 'complete', description: 'Historico, notificacoes e perfil com listener em tempo real' },
  { route: '/gestao', label: 'Painel de Gestao', status: 'complete', description: 'Admin completo com filas, conteudo e usuarios' },
  { route: '/sobre', label: 'Sobre', status: 'complete', description: 'Pagina institucional' },

  // ── Em Desenvolvimento ──
  {
    route: '/educacao',
    label: 'Educacao',
    status: 'in_development',
    description: 'Dashboard do aluno (notas, frequencia, cardapio, onibus) em construcao. Escolas e matriculas ja funcionam.',
    adminTab: 'education',
  },
  {
    route: '/saude',
    label: 'Saude',
    status: 'in_development',
    description: 'Carteira de vacinacao digital e mapa interativo em construcao. Unidades, agendamento e farmacia ja funcionam.',
    adminTab: 'health',
  },
  {
    route: '/legal',
    label: 'Termos e Privacidade',
    status: 'in_development',
    description: 'Download de PDF completo em construcao. Conteudo dos termos ja disponivel.',
  },

  // ── Planejado ──
  {
    route: '/educacao/matricula',
    label: 'Matricula Escolar',
    status: 'planned',
    description: 'Integracao com sistema municipal de ensino prevista para fase 2.',
  },
];

export function getFeatureStatus(route: string): FeatureEntry | undefined {
  return FEATURE_STATUS.find((f) => f.route === route);
}

export function getFeaturesByStatus(status: FeatureStatus): FeatureEntry[] {
  return FEATURE_STATUS.filter((f) => f.status === status);
}

export function getAdminTabFeatures(): FeatureEntry[] {
  return FEATURE_STATUS.filter((f) => f.adminTab);
}

export function getIncompleteFeatures(): FeatureEntry[] {
  return FEATURE_STATUS.filter((f) => f.status !== 'complete');
}
