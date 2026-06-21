/**
 * Status de desenvolvimento das features do portal.
 *
 * Cada entrada mapeia uma feature/rota ao seu status atual.
 * Usado para exibir badges "Em Desenvolvimento" no painel admin e páginas públicas.
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
  { route: '/ouvidoria', label: 'Ouvidoria', status: 'complete', description: 'Manifestações com protocolo, busca e timeline', adminTab: 'demands' },
  { route: '/relatar', label: 'Relatar Problema', status: 'complete', description: 'Formulário com foto, GPS e classificação AI', adminTab: 'reports' },
  { route: '/peticoes', label: 'Petições', status: 'complete', description: 'Criação e assinatura com Cloud Function', adminTab: 'petitions' },
  { route: '/empregos', label: 'Empregos', status: 'complete', description: 'Vagas com candidatura e painel admin', adminTab: 'jobs' },
  { route: '/comercio', label: 'Comércio Local', status: 'complete', description: 'Negócios com aprovação e notificação', adminTab: 'businesses' },
  { route: '/eventos', label: 'Eventos', status: 'complete', description: 'Agenda cultural com CRUD admin', adminTab: 'events' },
  { route: '/obras', label: 'Obras', status: 'complete', description: 'Acompanhamento com progresso e atualizações', adminTab: 'works' },
  { route: '/avisos', label: 'Avisos', status: 'complete', description: 'Comunicados oficiais com prioridade e expiração', adminTab: 'notices' },
  { route: '/votos', label: 'Votos', status: 'complete', description: 'Enquetes com Cloud Function atômica', adminTab: 'polls' },
  { route: '/seguranca', label: 'Segurança', status: 'complete', description: 'Zonas seguras e alertas de emergência', adminTab: 'safety' },
  { route: '/transito', label: 'Trânsito', status: 'complete', description: 'Alertas com severidade e localização', adminTab: 'traffic' },
  { route: '/tributos', label: 'Tributos', status: 'complete', description: 'IPTU, ISS e certidões', adminTab: 'taxes' },
  { route: '/social', label: 'Social', status: 'complete', description: 'Programas sociais com requisitos', adminTab: 'social' },
  { route: '/meio-ambiente', label: 'Meio Ambiente', status: 'complete', description: 'Coleta, denúncias e áreas verdes', adminTab: 'environment' },
  { route: '/comunidade', label: 'Comunidade', status: 'complete', description: 'Grupos comunitários', adminTab: 'community' },
  { route: '/servicos', label: 'Serviços', status: 'complete', description: 'Catálogo de serviços públicos', adminTab: 'services' },
  { route: '/perfil', label: 'Painel do Cidadão', status: 'complete', description: 'Histórico, notificações e perfil com listener em tempo real' },
  { route: '/gestao', label: 'Painel de Gestão', status: 'complete', description: 'Admin completo com filas, conteúdo e usuários' },
  { route: '/sobre', label: 'Sobre', status: 'complete', description: 'Página institucional' },

  // ── Em Desenvolvimento ──
  {
    route: '/educacao',
    label: 'Educação',
    status: 'complete',
    description: 'Escolas municipais, matrícula online e portal do aluno.',
    adminTab: 'education',
  },
  {
    route: '/saude',
    label: 'Saúde',
    status: 'complete',
    description: 'Unidades de saúde com mapa interativo, agendamento, farmácia e carteira de vacinação digital.',
    adminTab: 'health',
  },
  {
    route: '/legal',
    label: 'Termos e Privacidade',
    status: 'complete',
    description: 'Termos de uso, privacidade LGPD e download de PDF completo.',
  },

  // ── Planejado ──
  {
    route: '/educacao/matricula',
    label: 'Matrícula Escolar',
    status: 'planned',
    description: 'Integração com sistema municipal de ensino prevista para fase 2.',
  },
];

/**
 * Rotas suspensas para a fase 2 do lançamento.
 *
 * Decisão de escopo (não de código): estas features podem estar prontas,
 * mas ficam fora do MVP para focar no núcleo de atendimento ao cidadão.
 * Elas são escondidas dos menus/dashboard e, se acessadas direto pela URL,
 * exibem a tela "Em breve".
 *
 * Para reativar uma feature, basta remover a rota desta lista — nada é deletado.
 */
export const SUSPENDED_ROUTES: readonly string[] = [
  '/saude',
  '/educacao',
  '/educacao/matricula',
  '/tributos',
  '/seguranca',
  '/transito',
  '/social',
  '/meio-ambiente',
  '/votos',
  '/comunidade',
  '/servicos',
];

/** Retorna true se a rota (ou uma rota-filha) está suspensa para a fase 2. */
export function isRouteSuspended(route: string): boolean {
  return SUSPENDED_ROUTES.some((r) => route === r || route.startsWith(`${r}/`));
}

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
