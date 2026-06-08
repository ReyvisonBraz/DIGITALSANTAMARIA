import type { Timestamp } from 'firebase/firestore';

export type ContentStatus = 'published' | 'draft' | 'archived' | 'pending_approval';

export interface BaseContent {
  id: string;
  title: string;
  description: string;
  status: ContentStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;
}

// Obras públicas
export interface Work extends BaseContent {
  category: 'asfalto' | 'saneamento' | 'escola' | 'hospital' | 'praca' | 'ponte' | 'outros';
  address: string;
  neighborhood: string;
  budget: number;
  progress: number; // 0-100
  startDate: string;
  endDate: string;
  contractor: string;
  imageURL: string | null;
  updates: WorkUpdate[];
}

export interface WorkUpdate {
  date: string;
  text: string;
  progress: number;
}

// Eventos
export interface Event extends BaseContent {
  category: 'cultura' | 'esporte' | 'educacao' | 'saude' | 'feira' | 'show' | 'outros';
  date: string;
  time: string;
  location: string;
  address: string;
  imageURL: string | null;
  isFree: boolean;
  price: string;
  organizer: string;
  attendeesCount: number;
}

// Avisos e alertas
export interface Notice extends BaseContent {
  type: 'alerta' | 'aviso' | 'comunicado' | 'urgencia';
  priority: 'low' | 'medium' | 'high' | 'critical';
  expiresAt: string | null;
  actionLabel: string | null;
  actionURL: string | null;
}

// Grupos comunitários
export interface CommunityGroup extends BaseContent {
  neighborhood: string;
  category: 'seguranca' | 'cultura' | 'esporte' | 'meio_ambiente' | 'social' | 'outros';
  membersCount: number;
  meetingSchedule: string;
  contactPhone: string;
  imageURL: string | null;
}

// Comércio local
export interface Business extends BaseContent {
  category: 'restaurante' | 'farmacia' | 'mercado' | 'servico' | 'loja' | 'outros';
  address: string;
  phone: string;
  whatsapp: string;
  hours: string;
  imageURL: string | null;
  isOpen: boolean;
  lat: number | null;
  lng: number | null;
  /** uid do cidadão dono do negócio (vazio quando cadastrado direto pela prefeitura). */
  ownerId: string;
  /** Nome de exibição do dono no momento do cadastro. */
  ownerName: string;
  /** Mensagem do admin ao reprovar (opcional). */
  reviewNote?: string | null;
}

// Zonas de segurança
export interface SafetyZone extends BaseContent {
  type: 'delegacia' | 'policiamento' | 'guarda_municipal' | 'bombeiro' | 'defesa_civil';
  address: string;
  phone: string;
  emergencyPhone: string;
  is24h: boolean;
  lat: number | null;
  lng: number | null;
}

// Meio ambiente
export interface EnvironmentData extends BaseContent {
  category: 'coleta' | 'denuncia' | 'programa' | 'area_verde' | 'reciclagem';
  days: string[];
  schedule: string;
  instructions: string;
  contactPhone: string;
}

// Programas sociais
export interface SocialProgram extends BaseContent {
  category: 'habitacao' | 'cras' | 'cadastro_unico' | 'bolsa_familia' | 'idoso' | 'crianca';
  requirements: string[];
  documents: string[];
  address: string;
  phone: string;
  schedule: string;
  targetAudience: string;
}

// Tributos
export interface TaxRecord extends BaseContent {
  type: 'iptu' | 'iss' | 'taxa' | 'certidao' | 'parcelamento';
  year: number;
  dueDate: string;
  amount: number;
  installmentCount: number;
  installmentValue: number;
  paymentMethods: string[];
}

// Trânsito
export interface TrafficAlert extends BaseContent {
  type: 'acidente' | 'obra' | 'desvio' | 'blitz' | 'evento' | 'alagamento';
  severity: 'baixa' | 'media' | 'alta' | 'critica';
  location: string;
  lat: number | null;
  lng: number | null;
  validUntil: string;
}

// Votações
export interface Poll extends BaseContent {
  category: 'orcamento' | 'lei' | 'consulta' | 'projeto';
  options: PollOption[];
  totalVotes: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

// Catálogo de serviços
export interface PublicService extends BaseContent {
  category: 'documento' | 'saude' | 'educacao' | 'social' | 'tributos' | 'obras' | 'transito' | 'outros';
  department: string;
  address: string;
  phone: string;
  schedule: string;
  requirements: string[];
  onlineURL: string | null;
  steps: string[];
}

// Estoque da farmacia municipal
export interface PharmacyItem extends BaseContent {
  category: 'antibiotico' | 'analgesico' | 'pressao' | 'diabetes' | 'vacina' | 'outros';
  unit: string;
  quantity: number;
  stockStatus: 'available' | 'low_stock' | 'unavailable';
  location: string;
  requiresPrescription: boolean;
}

// Escolas municipais
export interface EducationSchool extends BaseContent {
  type: string;
  address: string;
  phone?: string;
  availabilityStatus: string;
  rating: number;
  ideb: number;
  imageURL: string | null;
}
