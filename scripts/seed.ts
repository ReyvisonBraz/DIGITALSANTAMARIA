/**
 * Seed Script — Conecta Santa Maria
 *
 * Popula 17 coleções do Firestore com dados realistas do município.
 * Total: ~70 documentos com dados completos para todas as páginas do portal.
 *
 * Requer service account key do Firebase Admin SDK.
 * Coloque o JSON da chave na raiz do projeto.
 *
 * Uso: npx ts-node scripts/seed.ts
 * Seguro rodar múltiplas vezes (idempotente via merge: true).
 */

import { readFileSync, readdirSync } from 'fs';
import { createRequire } from 'module';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const admin = require('firebase-admin') as typeof import('firebase-admin');

// ---------------------------------------------------------------
// Init Firebase (Admin SDK)
// ---------------------------------------------------------------

const currentDir = dirname(fileURLToPath(import.meta.url));
const rootDir = join(currentDir, '..');

// Auto-detect service account key file
const files = readdirSync(rootDir);
const saFile = files.find(
  (f) => f.startsWith('conectasantamaria') && f.endsWith('.json') && f.includes('adminsdk')
);
if (!saFile) {
  console.error('❌ Service account key não encontrada na raiz do projeto.');
  console.error('   Baixe-a em: https://console.firebase.google.com/project/conectasantamaria-pa/settings/serviceaccounts/adminsdk');
  process.exit(1);
}

const saPath = join(rootDir, saFile);
const saKey = JSON.parse(readFileSync(saPath, 'utf-8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(saKey),
    projectId: saKey.project_id,
  });
}

const db = admin.firestore();
const ts = admin.firestore.FieldValue.serverTimestamp;

// ---------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------

type SeedDoc = Record<string, unknown> & { id: string };

interface SeedCollection {
  name: string;
  docs: SeedDoc[];
}

// ---------------------------------------------------------------
// Dados compartilhados
// ---------------------------------------------------------------

const LOCATIONS = {
  centro: 'Av. Barão do Rio Branco, 1200 - Centro',
  bomJesus: 'Rua das Palmeiras, 340 - Bom Jesus',
  vilaNova: 'Travessa São José, 89 - Vila Nova',
  matriz: 'Praça da Matriz, 10 - Centro',
  comercio: 'Rua do Comércio, 225 - Centro',
  saoFrancisco: 'Rua São Francisco, 450 - Centro',
  santosDumont: 'Av. Santos Dumont, 780 - Centro',
  casteloBranco: 'Av. Castelo Branco, 1500 - Centro',
  primeiraRua: 'Travessa Primeira, 55 - Bom Jesus',
  beiraRio: 'Av. Beira Rio, 320 - Vila Nova',
};

const PHONES = {
  prefeitura: '(91) 3311-1000',
  saude: '(91) 3311-2000',
  educacao: '(91) 3311-3000',
  obras: '(91) 3311-4000',
  social: '(91) 3311-5000',
  guarda: '(91) 3311-1900',
  bombeiro: '(91) 3311-1930',
};

// ---------------------------------------------------------------
// 1. Health Units
// ---------------------------------------------------------------

const healthUnits: SeedDoc[] = [
  {
    id: 'upa-central',
    name: 'UPA Central Santa Maria',
    type: 'upa',
    address: LOCATIONS.centro,
    phone: PHONES.saude,
    waitTime: 15,
    waitLevel: 'low',
    isOpen: true,
    openHours: '24h',
    specialties: ['Clínica Geral', 'Pediatria', 'Ortopedia'],
    lat: -1.3636,
    lng: -47.4481,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'clinica-familia-bom-jesus',
    name: 'Clínica da Família Bom Jesus',
    type: 'clinica',
    address: LOCATIONS.bomJesus,
    phone: '(91) 3311-2001',
    waitTime: 40,
    waitLevel: 'medium',
    isOpen: true,
    openHours: '07:00 - 19:00',
    specialties: ['Clínica Geral', 'Ginecologia', 'Pré-natal'],
    lat: -1.3550,
    lng: -47.4520,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'posto-vila-nova',
    name: 'Posto de Saúde Vila Nova',
    type: 'clinica',
    address: LOCATIONS.vilaNova,
    phone: '(91) 3311-2002',
    waitTime: 80,
    waitLevel: 'high',
    isOpen: true,
    openHours: '07:00 - 17:00',
    specialties: ['Clínica Geral', 'Vacinação'],
    lat: -1.3700,
    lng: -47.4400,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'farmacia-popular-municipal',
    name: 'Farmácia Popular Municipal',
    type: 'farmacia',
    address: LOCATIONS.matriz,
    phone: '(91) 3311-2003',
    waitTime: 5,
    waitLevel: 'low',
    isOpen: true,
    openHours: '08:00 - 20:00',
    specialties: ['Medicamentos gratuitos', 'Insulina'],
    lat: -1.3620,
    lng: -47.4460,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'cras-santa-maria',
    name: 'CRAS Santa Maria',
    type: 'cras',
    address: LOCATIONS.comercio,
    phone: PHONES.social,
    waitTime: 30,
    waitLevel: 'medium',
    isOpen: true,
    openHours: '08:00 - 17:00',
    specialties: ['Assistência Social', 'Cadastro Único'],
    lat: -1.3610,
    lng: -47.4490,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
];

// ---------------------------------------------------------------
// 2. Education Schools
// ---------------------------------------------------------------

const educationSchools: SeedDoc[] = [
  {
    id: 'emef-monteiro-lobato',
    title: 'E.M.E.F. Monteiro Lobato',
    description: 'Ensino Fundamental I e II com laboratório de informática e biblioteca.',
    type: 'Ensino Fundamental',
    address: LOCATIONS.santosDumont,
    phone: PHONES.educacao,
    availabilityStatus: 'Matrículas abertas',
    rating: 8.7,
    ideb: 6.2,
    imageURL: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=300&fit=crop',
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'em-joao-paulo-ii',
    title: 'E.M. João Paulo II',
    description: 'Educação Infantil e Fundamental I. Projetos de leitura e esporte.',
    type: 'Educação Infantil e Fundamental',
    address: LOCATIONS.bomJesus,
    phone: '(91) 3311-3001',
    availabilityStatus: 'Matrículas abertas',
    rating: 9.0,
    ideb: 6.5,
    imageURL: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'cei-ciranda-da-crianca',
    title: 'C.E.I. Ciranda da Criança',
    description: 'Centro de Educação Infantil. Berçário, maternal e pré-escola.',
    type: 'Educação Infantil',
    address: LOCATIONS.casteloBranco,
    phone: '(91) 3311-3002',
    availabilityStatus: 'Vagas limitadas',
    rating: 9.4,
    ideb: 0,
    imageURL: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop',
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'emef-santa-maria',
    title: 'E.M.E.F. Santa Maria',
    description: 'Ensino Fundamental completo. Laboratório de ciências e quadra poliesportiva.',
    type: 'Ensino Fundamental',
    address: LOCATIONS.primeiraRua,
    phone: '(91) 3311-3003',
    availabilityStatus: 'Matrículas abertas',
    rating: 7.8,
    ideb: 5.8,
    imageURL: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop',
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'cei-pequeno-aprendiz',
    title: 'C.E.I. Pequeno Aprendiz',
    description: 'Educação infantil com metodologia montessoriana. Turmas reduzidas.',
    type: 'Educação Infantil',
    address: LOCATIONS.beiraRio,
    phone: '(91) 3311-3004',
    availabilityStatus: 'Lista de espera',
    rating: 9.7,
    ideb: 0,
    imageURL: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop',
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
];

// ---------------------------------------------------------------
// 3. Pharmacy Items
// ---------------------------------------------------------------

const pharmacyItems: SeedDoc[] = [
  {
    id: 'amoxicilina-500mg',
    title: 'Amoxicilina 500mg',
    description: 'Antibiótico de amplo espectro. Caixa com 21 comprimidos.',
    category: 'antibiotico',
    unit: 'comprimido',
    quantity: 850,
    stockStatus: 'available',
    location: 'Farmácia Popular Municipal',
    requiresPrescription: true,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'ibuprofeno-600mg',
    title: 'Ibuprofeno 600mg',
    description: 'Anti-inflamatório e analgésico. Caixa com 20 comprimidos.',
    category: 'analgesico',
    unit: 'comprimido',
    quantity: 620,
    stockStatus: 'available',
    location: 'Farmácia Popular Municipal',
    requiresPrescription: false,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'losartana-50mg',
    title: 'Losartana 50mg',
    description: 'Anti-hipertensivo. Caixa com 30 comprimidos.',
    category: 'pressao',
    unit: 'comprimido',
    quantity: 340,
    stockStatus: 'available',
    location: 'Farmácia Popular Municipal',
    requiresPrescription: true,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'metformina-850mg',
    title: 'Metformina 850mg',
    description: 'Antidiabético oral. Caixa com 30 comprimidos.',
    category: 'diabetes',
    unit: 'comprimido',
    quantity: 210,
    stockStatus: 'low_stock',
    location: 'Farmácia Popular Municipal',
    requiresPrescription: true,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'dipirona-500mg',
    title: 'Dipirona Sódica 500mg',
    description: 'Analgésico e antitérmico. Caixa com 10 comprimidos.',
    category: 'analgesico',
    unit: 'comprimido',
    quantity: 1200,
    stockStatus: 'available',
    location: 'Farmácia Popular Municipal',
    requiresPrescription: false,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'sinvastatina-20mg',
    title: 'Sinvastatina 20mg',
    description: 'Redutor de colesterol. Caixa com 30 comprimidos.',
    category: 'pressao',
    unit: 'comprimido',
    quantity: 0,
    stockStatus: 'unavailable',
    location: 'Farmácia Popular Municipal',
    requiresPrescription: true,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'insulina-regular',
    title: 'Insulina Regular Humana',
    description: 'Insulina de ação rápida. Frasco 10ml.',
    category: 'diabetes',
    unit: 'frasco',
    quantity: 45,
    stockStatus: 'low_stock',
    location: 'Farmácia Popular Municipal',
    requiresPrescription: true,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'vacina-febre-amarela',
    title: 'Vacina Febre Amarela',
    description: 'Dose única. Disponível conforme calendário nacional.',
    category: 'vacina',
    unit: 'dose',
    quantity: 300,
    stockStatus: 'available',
    location: 'Posto de Saúde Vila Nova',
    requiresPrescription: false,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
];

// ---------------------------------------------------------------
// 4. Events
// ---------------------------------------------------------------

const events: SeedDoc[] = [
  {
    id: 'arraia-da-matriz',
    title: 'Arraiá da Matriz',
    description: 'Festa junina tradicional com quadrilhas, comidas típicas e show de forró pé de serra.',
    category: 'cultura',
    date: '2026-06-24',
    time: '20:00',
    location: 'Praça da Matriz',
    address: LOCATIONS.matriz,
    imageURL: 'https://images.unsplash.com/photo-1563821820323-9452eaad8317?w=400&h=300&fit=crop',
    isFree: true,
    price: 'Gratuito',
    organizer: 'Secretaria de Cultura',
    attendeesCount: 0,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'feira-do-empreendedor',
    title: 'Feira do Empreendedor 2026',
    description: 'Exposição de produtos locais, artesanato, gastronomia e palestras de negócios.',
    category: 'feira',
    date: '2026-07-15',
    time: '09:00',
    location: 'Ginásio Municipal',
    address: LOCATIONS.santosDumont,
    imageURL: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop',
    isFree: true,
    price: 'Gratuito',
    organizer: 'Secretaria de Desenvolvimento Econômico',
    attendeesCount: 0,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'campeonato-de-futebol',
    title: 'Campeonato Municipal de Futebol Amador',
    description: 'Inscrições abertas para times da cidade. Premiação de R$ 5.000,00.',
    category: 'esporte',
    date: '2026-08-01',
    time: '14:00',
    location: 'Estádio Municipal',
    address: LOCATIONS.casteloBranco,
    imageURL: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop',
    isFree: true,
    price: 'Inscrição gratuita',
    organizer: 'Secretaria de Esportes',
    attendeesCount: 0,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'mutirao-da-saude',
    title: 'Mutirão da Saúde',
    description: 'Consultas, exames e vacinação gratuita para toda a população.',
    category: 'saude',
    date: '2026-07-22',
    time: '08:00',
    location: 'UPA Central',
    address: LOCATIONS.centro,
    imageURL: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
    isFree: true,
    price: 'Gratuito',
    organizer: 'Secretaria de Saúde',
    attendeesCount: 0,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'semana-do-meio-ambiente',
    title: 'Semana do Meio Ambiente',
    description: 'Plantio de árvores, palestras, coleta seletiva e oficinas de reciclagem.',
    category: 'educacao',
    date: '2026-06-05',
    time: '08:00',
    location: 'Praça da Matriz',
    address: LOCATIONS.matriz,
    imageURL: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop',
    isFree: true,
    price: 'Gratuito',
    organizer: 'Secretaria de Meio Ambiente',
    attendeesCount: 0,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
];

// ---------------------------------------------------------------
// 5. Notices
// ---------------------------------------------------------------

const notices: SeedDoc[] = [
  {
    id: 'alerta-chuvas-fortes',
    title: 'Alerta: Chuvas Fortes',
    description: 'Defesa Civil alerta para chuvas fortes nos próximos dias. Evite áreas de alagamento.',
    type: 'alerta',
    priority: 'high',
    expiresAt: null,
    actionLabel: 'Ver áreas seguras',
    actionURL: '/seguranca',
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'iptu-2026-vencimento',
    title: 'IPTU 2026 — Vencimento',
    description: 'Primeira parcela do IPTU 2026 vence dia 15/07. Pague em cota única com 10% de desconto.',
    type: 'aviso',
    priority: 'medium',
    expiresAt: '2026-07-16',
    actionLabel: 'Ver tributos',
    actionURL: '/tributos',
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'matriculas-abertas',
    title: 'Matrículas Escolares Abertas',
    description: 'Período de matrícula para o segundo semestre. Vagas para educação infantil e fundamental.',
    type: 'comunicado',
    priority: 'medium',
    expiresAt: '2026-07-31',
    actionLabel: 'Fazer matrícula',
    actionURL: '/educacao/matricula',
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'urgencia-falta-agua',
    title: 'URGENTE: Falta de Água Programada',
    description: 'Manutenção emergencial na rede. Bairros afetados: Centro e Bom Jesus. Previsão: 4h.',
    type: 'urgencia',
    priority: 'critical',
    expiresAt: '2026-06-08',
    actionLabel: null,
    actionURL: null,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'vacinacao-antirrabica',
    title: 'Campanha de Vacinação Antirrábica',
    description: 'Vacinação gratuita para cães e gatos. Postos volantes nos bairros.',
    type: 'comunicado',
    priority: 'low',
    expiresAt: '2026-07-31',
    actionLabel: 'Ver postos',
    actionURL: '/saude',
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
];

// ---------------------------------------------------------------
// 6. Works
// ---------------------------------------------------------------

const works: SeedDoc[] = [
  {
    id: 'asfalto-bom-jesus',
    title: 'Pavimentação Asfáltica — Bom Jesus',
    description: 'Asfaltamento de 2,5 km de vias no bairro Bom Jesus. Inclui drenagem e sinalização.',
    category: 'asfalto',
    address: LOCATIONS.bomJesus,
    neighborhood: 'Bom Jesus',
    budget: 850000,
    progress: 72,
    startDate: '2026-01-15',
    endDate: '2026-08-30',
    contractor: 'Construtora Pará',
    imageURL: 'https://images.unsplash.com/photo-1590855295885-6c0c613b6ecf?w=400&h=300&fit=crop',
    updates: [
      { date: '2026-02-10', text: 'Terraplanagem concluída', progress: 30 },
      { date: '2026-04-15', text: 'Drenagem instalada. Início da pavimentação', progress: 50 },
      { date: '2026-05-20', text: '1.800m asfaltados. Sinalização em andamento', progress: 72 },
    ],
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'reforma-escola-monteiro',
    title: 'Reforma da E.M.E.F. Monteiro Lobato',
    description: 'Reforma estrutural: telhado, salas de aula, laboratório e quadra coberta.',
    category: 'escola',
    address: LOCATIONS.santosDumont,
    neighborhood: 'Centro',
    budget: 420000,
    progress: 45,
    startDate: '2026-03-01',
    endDate: '2026-10-15',
    contractor: 'Engenharia Norte',
    imageURL: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop',
    updates: [
      { date: '2026-03-20', text: 'Demolição de áreas condenadas', progress: 15 },
      { date: '2026-05-01', text: 'Novo telhado instalado. Reforço estrutural concluído', progress: 45 },
    ],
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'praca-matriz-revitalizacao',
    title: 'Revitalização da Praça da Matriz',
    description: 'Nova iluminação LED, paisagismo, playground e academia ao ar livre.',
    category: 'praca',
    address: LOCATIONS.matriz,
    neighborhood: 'Centro',
    budget: 280000,
    progress: 90,
    startDate: '2026-02-01',
    endDate: '2026-06-30',
    contractor: 'Parques & Jardins Ltda',
    imageURL: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69ce03?w=400&h=300&fit=crop',
    updates: [
      { date: '2026-03-15', text: 'Paisagismo concluído', progress: 50 },
      { date: '2026-05-10', text: 'Playground e academia instalados. Iluminação em teste', progress: 90 },
    ],
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'saneamento-vila-nova',
    title: 'Rede de Esgoto — Vila Nova',
    description: 'Implantação de rede coletora de esgoto em 3 km de vias.',
    category: 'saneamento',
    address: LOCATIONS.vilaNova,
    neighborhood: 'Vila Nova',
    budget: 1200000,
    progress: 35,
    startDate: '2026-01-05',
    endDate: '2026-12-20',
    contractor: 'Saneamento Pará S.A.',
    imageURL: 'https://images.unsplash.com/photo-1624916880243-40a8b6a99477?w=400&h=300&fit=crop',
    updates: [
      { date: '2026-02-28', text: 'Escavação concluída no trecho 1', progress: 20 },
      { date: '2026-04-20', text: 'Tubulação instalada em 1,2 km', progress: 35 },
    ],
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
];

// ---------------------------------------------------------------
// 7. Businesses
// ---------------------------------------------------------------

const businesses: SeedDoc[] = [
  {
    id: 'restaurante-sabor-para',
    title: 'Restaurante Sabor do Pará',
    description: 'Comida regional paraense. Especialidade em maniçoba, pato no tucupi e tacacá.',
    category: 'restaurante',
    address: LOCATIONS.saoFrancisco,
    phone: '(91) 99123-4567',
    whatsapp: '5591991234567',
    hours: 'Seg-Sáb: 11:00-22:00, Dom: 11:00-15:00',
    imageURL: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
    isOpen: true,
    lat: null,
    lng: null,
    ownerId: '',
    ownerName: '',
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'farmacia-santa-maria',
    title: 'Drogaria Santa Maria',
    description: 'Farmácia com entrega em domicílio. Medicamentos, perfumaria e produtos de higiene.',
    category: 'farmacia',
    address: LOCATIONS.matriz,
    phone: '(91) 99123-4568',
    whatsapp: '5591991234568',
    hours: 'Seg-Dom: 07:00-23:00',
    imageURL: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&h=300&fit=crop',
    isOpen: true,
    lat: null,
    lng: null,
    ownerId: '',
    ownerName: '',
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'supermercado-familia',
    title: 'Supermercado Família',
    description: 'Hortifrúti, açougue, laticínios e produtos de limpeza. Preços populares.',
    category: 'mercado',
    address: LOCATIONS.bomJesus,
    phone: '(91) 99123-4569',
    whatsapp: '5591991234569',
    hours: 'Seg-Sáb: 07:00-21:00, Dom: 07:00-13:00',
    imageURL: 'https://images.unsplash.com/photo-1534723328310-ea2ea62f1436?w=400&h=300&fit=crop',
    isOpen: true,
    lat: null,
    lng: null,
    ownerId: '',
    ownerName: '',
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'barbearia-dom-bigode',
    title: 'Barbearia Dom Bigode',
    description: 'Cortes modernos e tradicionais. Barba, hidratação e cerveja gelada.',
    category: 'servico',
    address: LOCATIONS.comercio,
    phone: '(91) 99123-4570',
    whatsapp: '5591991234570',
    hours: 'Seg-Sáb: 09:00-20:00',
    imageURL: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop',
    isOpen: true,
    lat: null,
    lng: null,
    ownerId: '',
    ownerName: '',
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'loja-artesanato-paraense',
    title: 'Artesanato Paraense',
    description: 'Peças em cerâmica marajoara, miriti, palha e madeira. Presentes regionais.',
    category: 'loja',
    address: LOCATIONS.santosDumont,
    phone: '(91) 99123-4571',
    whatsapp: '5591991234571',
    hours: 'Seg-Sáb: 08:00-18:00',
    imageURL: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop',
    isOpen: true,
    lat: null,
    lng: null,
    ownerId: '',
    ownerName: '',
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
];

// ---------------------------------------------------------------
// 8. Traffic Alerts
// ---------------------------------------------------------------

const trafficAlerts: SeedDoc[] = [
  {
    id: 'desvio-obra-centro',
    title: 'Desvio: Obra na Av. Santos Dumont',
    description: 'Trecho interditado entre Rua do Comércio e Av. Barão do Rio Branco. Usar rota alternativa pela Travessa São José.',
    type: 'obra',
    severity: 'media',
    location: 'Av. Santos Dumont, 780 - Centro',
    lat: null,
    lng: null,
    validUntil: '2026-08-30',
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'blitz-lei-seca',
    title: 'Blitz Lei Seca — Fim de Semana',
    description: 'Operação integrada Detran-PM. Pontos de fiscalização rotativos.',
    type: 'blitz',
    severity: 'baixa',
    location: 'Avenidas principais',
    lat: null,
    lng: null,
    validUntil: '2026-06-08',
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'alagamento-beira-rio',
    title: 'Alerta: Alagamento na Beira Rio',
    description: 'Após chuvas fortes. Evitar Av. Beira Rio. Usar rota do Castelo Branco.',
    type: 'alagamento',
    severity: 'alta',
    location: 'Av. Beira Rio, Vila Nova',
    lat: null,
    lng: null,
    validUntil: '2026-06-10',
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'evento-fechamento-matriz',
    title: 'Interdição: Arraiá da Matriz',
    description: 'Praça da Matriz e ruas adjacentes fechadas para o evento. Agentes de trânsito no local.',
    type: 'evento',
    severity: 'media',
    location: 'Praça da Matriz - Centro',
    lat: null,
    lng: null,
    validUntil: '2026-06-25',
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
];

// ---------------------------------------------------------------
// 9. Safety Zones
// ---------------------------------------------------------------

const safetyZones: SeedDoc[] = [
  {
    id: 'delegacia-policia-civil',
    title: 'Delegacia de Polícia Civil',
    description: 'Registro de ocorrências, investigações e emissão de documentos.',
    type: 'delegacia',
    address: LOCATIONS.santosDumont,
    phone: '(91) 3311-1900',
    emergencyPhone: '190',
    is24h: true,
    lat: null,
    lng: null,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'bombeiro-militar',
    title: 'Corpo de Bombeiros Militar',
    description: 'Combate a incêndios, salvamento aquático e resgate em altura.',
    type: 'bombeiro',
    address: LOCATIONS.casteloBranco,
    phone: PHONES.bombeiro,
    emergencyPhone: '193',
    is24h: true,
    lat: null,
    lng: null,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'guarda-municipal',
    title: 'Guarda Municipal',
    description: 'Patrulhamento preventivo, proteção de patrimônio público e apoio à fiscalização.',
    type: 'guarda_municipal',
    address: LOCATIONS.matriz,
    phone: PHONES.guarda,
    emergencyPhone: '153',
    is24h: false,
    lat: null,
    lng: null,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'defesa-civil',
    title: 'Defesa Civil Municipal',
    description: 'Prevenção e resposta a desastres naturais. Monitoramento de áreas de risco.',
    type: 'defesa_civil',
    address: LOCATIONS.comercio,
    phone: '(91) 3311-1990',
    emergencyPhone: '199',
    is24h: true,
    lat: null,
    lng: null,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
];

// ---------------------------------------------------------------
// 10. Social Programs
// ---------------------------------------------------------------

const socialPrograms: SeedDoc[] = [
  {
    id: 'bolsa-familia-cadastro',
    title: 'Cadastro Único — Bolsa Família',
    description: 'Inscrição e atualização cadastral para programas sociais federais.',
    category: 'bolsa_familia',
    requirements: ['RG e CPF', 'Comprovante de residência', 'Comprovante de renda', 'Certidão de nascimento dos dependentes'],
    documents: ['RG', 'CPF', 'Comprovante de residência', 'Comprovante de renda'],
    address: LOCATIONS.comercio,
    phone: PHONES.social,
    schedule: 'Seg-Sex: 08:00-14:00',
    targetAudience: 'Famílias em situação de vulnerabilidade social',
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'cras-atendimento',
    title: 'CRAS — Atendimento Social',
    description: 'Acolhimento, orientação e encaminhamento para serviços socioassistenciais.',
    category: 'cras',
    requirements: ['RG e CPF', 'Comprovante de residência', 'NIS (se tiver)'],
    documents: ['RG', 'CPF', 'Comprovante de residência'],
    address: LOCATIONS.comercio,
    phone: PHONES.social,
    schedule: 'Seg-Sex: 08:00-17:00',
    targetAudience: 'População em geral',
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'habitacao-minha-casa',
    title: 'Programa Habitacional Municipal',
    description: 'Inscrição para unidades habitacionais populares. Convênio Minha Casa Minha Vida.',
    category: 'habitacao',
    requirements: ['RG e CPF', 'Comprovante de residência', 'Comprovante de renda até 3 SM', 'Não possuir imóvel próprio'],
    documents: ['RG', 'CPF', 'Comprovante de residência', 'Declaração de IRPF', 'Certidão de casamento/nascimento'],
    address: LOCATIONS.santosDumont,
    phone: '(91) 3311-5001',
    schedule: 'Seg-Sex: 08:00-14:00',
    targetAudience: 'Famílias com renda de até 3 salários mínimos',
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'idoso-carteirinha',
    title: 'Carteira do Idoso Municipal',
    description: 'Emissão da carteira para gratuidade em transporte público e meia-entrada.',
    category: 'idoso',
    requirements: ['RG e CPF', 'Comprovante de residência', 'Foto 3x4', 'Ter 60 anos ou mais'],
    documents: ['RG', 'CPF', 'Comprovante de residência', 'Foto 3x4 recente'],
    address: LOCATIONS.comercio,
    phone: PHONES.social,
    schedule: 'Seg-Sex: 08:00-13:00',
    targetAudience: 'Idosos a partir de 60 anos',
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
];

// ---------------------------------------------------------------
// 11. Tax Records
// ---------------------------------------------------------------

const taxRecords: SeedDoc[] = [
  {
    id: 'iptu-2026',
    title: 'IPTU 2026',
    description: 'Imposto Predial e Territorial Urbano. Pagamento em cota única com 10% de desconto ou parcelado em até 10x.',
    type: 'iptu',
    year: 2026,
    dueDate: '2026-07-15',
    amount: 450.00,
    installmentCount: 10,
    installmentValue: 45.00,
    paymentMethods: ['Pix', 'Boleto bancário', 'Débito automático', 'Lotéricas'],
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'iss-2026',
    title: 'ISS 2026 — Prestadores de Serviço',
    description: 'Imposto Sobre Serviços de Qualquer Natureza. Declaração mensal obrigatória.',
    type: 'iss',
    year: 2026,
    dueDate: '2026-06-20',
    amount: 0,
    installmentCount: 1,
    installmentValue: 0,
    paymentMethods: ['Pix', 'Boleto bancário', 'Portal do Contribuinte'],
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'certidao-negativa',
    title: 'Certidão Negativa de Débitos',
    description: 'Emissão gratuita de certidão para comprovação de regularidade fiscal.',
    type: 'certidao',
    year: 2026,
    dueDate: '',
    amount: 0,
    installmentCount: 0,
    installmentValue: 0,
    paymentMethods: ['Portal do Contribuinte'],
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
];

// ---------------------------------------------------------------
// 12. Public Services
// ---------------------------------------------------------------

const publicServices: SeedDoc[] = [
  {
    id: 'emissao-rg',
    title: 'Emissão de RG',
    description: 'Carteira de identidade. 1ª e 2ª vias. Agendamento online.',
    category: 'documento',
    department: 'Polícia Civil',
    address: LOCATIONS.santosDumont,
    phone: '(91) 3311-1901',
    schedule: 'Seg-Sex: 08:00-14:00',
    requirements: ['Certidão de nascimento/casamento', 'CPF', 'Foto 3x4', 'Comprovante de residência'],
    onlineURL: null,
    steps: ['Agendar horário pelo site', 'Comparecer com documentos', 'Foto e biometria', 'Retirar em 15 dias úteis'],
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'alvara-funcionamento',
    title: 'Alvará de Funcionamento',
    description: 'Licença para funcionamento de estabelecimentos comerciais.',
    category: 'tributos',
    department: 'Secretaria de Finanças',
    address: LOCATIONS.matriz,
    phone: '(91) 3311-6001',
    schedule: 'Seg-Sex: 08:00-14:00',
    requirements: ['CNPJ', 'Contrato social', 'Alvará da vigilância sanitária', 'Alvará do corpo de bombeiros'],
    onlineURL: null,
    steps: ['Reunir documentação', 'Protocolar requerimento', 'Vistoria técnica', 'Retirar alvará'],
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'coleta-seletiva',
    title: 'Coleta Seletiva',
    description: 'Agendamento de coleta de materiais recicláveis. Resíduos sólidos domiciliares.',
    category: 'obras',
    department: 'Secretaria de Obras',
    address: LOCATIONS.centro,
    phone: PHONES.obras,
    schedule: 'Seg-Sáb: conforme bairro',
    requirements: ['Separar resíduos por tipo', 'Acondicionar em sacos adequados'],
    onlineURL: null,
    steps: ['Separar materiais recicláveis', 'Consultar dia da coleta por bairro', 'Dispor na calçada no dia'],
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'transporte-escolar',
    title: 'Transporte Escolar',
    description: 'Cadastro para transporte escolar gratuito da rede municipal.',
    category: 'educacao',
    department: 'Secretaria de Educação',
    address: LOCATIONS.santosDumont,
    phone: PHONES.educacao,
    schedule: 'Seg-Sex: 08:00-14:00',
    requirements: ['Matrícula escolar ativa', 'Comprovante de residência', 'RG e CPF do responsável'],
    onlineURL: null,
    steps: ['Comparecer à Secretaria de Educação', 'Preencher formulário', 'Apresentar documentos', 'Receber carteirinha'],
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'cartao-sus',
    title: 'Cartão SUS',
    description: 'Emissão e atualização do Cartão Nacional de Saúde.',
    category: 'saude',
    department: 'Secretaria de Saúde',
    address: LOCATIONS.centro,
    phone: PHONES.saude,
    schedule: 'Seg-Sex: 08:00-17:00',
    requirements: ['RG e CPF', 'Comprovante de residência', 'Certidão de nascimento'],
    onlineURL: null,
    steps: ['Comparecer à unidade de saúde', 'Apresentar documentos', 'Receber número do Cartão SUS'],
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
];

// ---------------------------------------------------------------
// 13. Community Groups
// ---------------------------------------------------------------

const communityGroups: SeedDoc[] = [
  {
    id: 'associacao-moradores-bom-jesus',
    title: 'Associação de Moradores do Bom Jesus',
    description: 'Grupo comunitário atuante em melhorias urbanas, segurança e eventos do bairro.',
    neighborhood: 'Bom Jesus',
    category: 'social',
    membersCount: 87,
    meetingSchedule: 'Primeiro sábado do mês, 16h',
    contactPhone: '(91) 99123-4580',
    imageURL: null,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'grupo-jovens-santa-maria',
    title: 'Grupo Jovens Santa Maria',
    description: 'Projetos de voluntariado, esporte e cultura para jovens de 14 a 24 anos.',
    neighborhood: 'Centro',
    category: 'cultura',
    membersCount: 45,
    meetingSchedule: 'Quartas-feiras, 19h',
    contactPhone: '(91) 99123-4581',
    imageURL: null,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'cooperativa-reciclagem',
    title: 'Cooperativa de Reciclagem Vila Nova',
    description: 'Cooperativa de catadores. Coleta, separação e venda de materiais recicláveis.',
    neighborhood: 'Vila Nova',
    category: 'meio_ambiente',
    membersCount: 23,
    meetingSchedule: 'Segundas-feiras, 08h',
    contactPhone: '(91) 99123-4582',
    imageURL: null,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
];

// ---------------------------------------------------------------
// 14. Polls
// ---------------------------------------------------------------

const polls: SeedDoc[] = [
  {
    id: 'consulta-travessia-elevada',
    title: 'Onde você quer a próxima travessia elevada?',
    description: 'Consulta pública para definir a localização da próxima faixa de pedestres elevada.',
    category: 'consulta',
    options: [
      { id: 'av-principal', text: 'Av. Barão do Rio Branco — em frente à Matriz', votes: 142 },
      { id: 'escola-monteiro', text: 'Av. Santos Dumont — próximo à E.M.E.F. Monteiro Lobato', votes: 98 },
      { id: 'bom-jesus', text: 'Rua das Palmeiras — entrada do Bom Jesus', votes: 76 },
      { id: 'upa', text: 'Av. Barão do Rio Branco — em frente à UPA', votes: 55 },
    ],
    totalVotes: 371,
    startDate: '2026-05-01',
    endDate: '2026-07-31',
    isActive: true,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'orcamento-participativo-2026',
    title: 'Orçamento Participativo 2026 — Prioridades',
    description: 'Escolha as 3 áreas que devem receber mais investimento no próximo ano.',
    category: 'orcamento',
    options: [
      { id: 'saude', text: 'Saúde — Reforma de postos e UPAs', votes: 203 },
      { id: 'educacao', text: 'Educação — Novas creches e escolas', votes: 187 },
      { id: 'infraestrutura', text: 'Infraestrutura — Asfalto e saneamento', votes: 165 },
      { id: 'seguranca', text: 'Segurança — Iluminação e câmeras', votes: 98 },
      { id: 'lazer', text: 'Lazer — Praças e áreas esportivas', votes: 72 },
    ],
    totalVotes: 725,
    startDate: '2026-04-01',
    endDate: '2026-09-30',
    isActive: true,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
];

// ---------------------------------------------------------------
// 15. Environment Data
// ---------------------------------------------------------------

const environmentData: SeedDoc[] = [
  {
    id: 'coleta-seletiva-centro',
    title: 'Coleta Seletiva — Centro',
    description: 'Coleta de recicláveis nas segundas e quintas-feiras. Seque e separe os materiais.',
    category: 'coleta',
    days: ['Segunda', 'Quinta'],
    schedule: 'A partir das 07:00',
    instructions: 'Separe papel, plástico, vidro e metal. Lave as embalagens antes de descartar.',
    contactPhone: PHONES.obras,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'disque-denuncia-ambiental',
    title: 'Disque Denúncia Ambiental',
    description: 'Canal para denunciar queimadas, desmatamento, poluição de rios e descarte irregular.',
    category: 'denuncia',
    days: ['Todos os dias'],
    schedule: '24h',
    instructions: 'Ligue ou envie WhatsApp com foto e localização. Denúncia anônima aceita.',
    contactPhone: '(91) 3311-8000',
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'programa-areas-verdes',
    title: 'Programa Áreas Verdes',
    description: 'Cadastro de voluntários para plantio e manutenção de praças e canteiros.',
    category: 'area_verde',
    days: ['Sábado'],
    schedule: '08:00-12:00',
    instructions: 'Inscrição no local. Levar chapéu, protetor solar e garrafa de água.',
    contactPhone: '(91) 3311-8001',
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'ponto-reciclagem-matriz',
    title: 'Ponto de Entrega Voluntária — Matriz',
    description: 'PEV para descarte de eletrônicos, óleo de cozinha, pilhas e baterias.',
    category: 'reciclagem',
    days: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    schedule: '08:00-17:00',
    instructions: 'Eletrônicos: computadores, celulares, cabos. Óleo: em garrafa PET fechada. Pilhas: em saco separado.',
    contactPhone: PHONES.obras,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
];

// ---------------------------------------------------------------
// 16. Jobs
// ---------------------------------------------------------------

const jobs: SeedDoc[] = [
  {
    id: 'agente-comunitario-saude',
    employerId: 'prefeitura',
    employerName: 'Prefeitura Municipal',
    title: 'Agente Comunitário de Saúde',
    description: 'Atuar na promoção da saúde em comunidades do município.',
    requirements: ['Ensino Médio', 'Residir na área'],
    benefits: ['Vale alimentação', 'Plano de saúde'],
    salary: 'R$ 2.824,00',
    type: 'clt',
    location: 'Santa Maria do Pará - PA',
    tags: ['Saúde', 'Comunidade'],
    isActive: true,
    isFeatured: true,
    applicationCount: 0,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'professor-educacao-basica',
    employerId: 'prefeitura',
    employerName: 'Prefeitura Municipal',
    title: 'Professor de Educação Básica',
    description: 'Lecionar para turmas do ensino fundamental.',
    requirements: ['Licenciatura', 'Experiência'],
    benefits: ['PCCS', 'Plano de saúde'],
    salary: 'R$ 4.200,00',
    type: 'clt',
    location: 'Santa Maria do Pará - PA',
    tags: ['Educação', 'Ensino'],
    isActive: true,
    isFeatured: true,
    applicationCount: 0,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'operador-caixa',
    employerId: 'comercio_local',
    employerName: 'Supermercado Família',
    title: 'Operador de Caixa',
    description: 'Atendimento ao cliente e operação de caixa.',
    requirements: ['Ensino Médio', 'Atendimento'],
    benefits: ['Vale refeição'],
    salary: 'R$ 1.600,00',
    type: 'clt',
    location: 'Santa Maria do Pará - PA',
    tags: ['Comércio', 'Atendimento'],
    isActive: true,
    isFeatured: false,
    applicationCount: 0,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
  {
    id: 'auxiliar-servicos-gerais',
    employerId: 'prefeitura',
    employerName: 'Secretaria de Obras',
    title: 'Auxiliar de Serviços Gerais',
    description: 'Manutenção de espaços públicos.',
    requirements: ['Ensino Fundamental'],
    benefits: ['Vale transporte'],
    salary: 'R$ 1.412,00',
    type: 'temporario',
    location: 'Santa Maria do Pará - PA',
    tags: ['Obras', 'Serviços'],
    isActive: true,
    isFeatured: false,
    applicationCount: 0,
    status: 'published',
    createdAt: ts(),
    updatedAt: ts(),
    deletedAt: null,
  },
];

// ---------------------------------------------------------------
// 17. Petitions
// ---------------------------------------------------------------

const petitions: SeedDoc[] = [
  {
    id: 'semaforo-av-principal',
    creatorId: 'seed',
    creatorName: 'Associação de Moradores',
    creatorPhotoURL: null,
    title: 'Semáforo na Av. Principal',
    description: 'Alto índice de acidentes. Solicitamos instalação urgente de semáforo.',
    category: 'Trânsito',
    goal: 500,
    signaturesCount: 127,
    status: 'active',
    officialReply: null,
    coverImageURL: null,
    createdAt: ts(),
    updatedAt: ts(),
  },
  {
    id: 'reforma-escola-municipal',
    creatorId: 'seed',
    creatorName: 'Pais e Mestres',
    creatorPhotoURL: null,
    title: 'Reforma da Escola Municipal',
    description: 'Escola com instalações precárias precisa de reforma estrutural.',
    category: 'Educação',
    goal: 1000,
    signaturesCount: 634,
    status: 'active',
    officialReply: null,
    coverImageURL: null,
    createdAt: ts(),
    updatedAt: ts(),
  },
  {
    id: 'area-lazer-bom-jesus',
    creatorId: 'seed',
    creatorName: 'Associação Comunitária',
    creatorPhotoURL: null,
    title: 'Área de lazer no Bom Jesus',
    description: 'O bairro precisa de praça, quadra e espaço seguro para crianças.',
    category: 'Lazer',
    goal: 300,
    signaturesCount: 89,
    status: 'active',
    officialReply: null,
    coverImageURL: null,
    createdAt: ts(),
    updatedAt: ts(),
  },
];

// ---------------------------------------------------------------
// Seed engine
// ---------------------------------------------------------------

const ALL_COLLECTIONS: SeedCollection[] = [
  { name: 'health_units',        docs: healthUnits },
  { name: 'education_schools',   docs: educationSchools },
  { name: 'pharmacy_items',      docs: pharmacyItems },
  { name: 'events',              docs: events },
  { name: 'notices',             docs: notices },
  { name: 'works',               docs: works },
  { name: 'businesses',          docs: businesses },
  { name: 'traffic_alerts',      docs: trafficAlerts },
  { name: 'safety_zones',        docs: safetyZones },
  { name: 'social_programs',     docs: socialPrograms },
  { name: 'tax_records',         docs: taxRecords },
  { name: 'public_services',     docs: publicServices },
  { name: 'community_groups',    docs: communityGroups },
  { name: 'polls',               docs: polls },
  { name: 'environment_data',    docs: environmentData },
  { name: 'jobs',                docs: jobs },
  { name: 'petitions',           docs: petitions },
];

/**
 * Escreve documentos em batches de até 500 operações.
 * Usa set com merge: true para idempotência.
 */
async function seedCollection(col: SeedCollection): Promise<number> {
  const batch = db.batch();
  let totalWritten = 0;

  for (const { id, ...data } of col.docs) {
    batch.set(db.collection(col.name).doc(id), data, { merge: true });
    totalWritten++;
  }

  await batch.commit();
  return totalWritten;
}

async function main() {
  console.log('═'.repeat(60));
  console.log('  Conecta Santa Maria — Seed de Dados (Admin SDK)');
  console.log('═'.repeat(60));
  console.log(`  Projeto: ${saKey.project_id}`);
  console.log(`  Service account: ${saKey.client_email}`);
  console.log(`  Coleções: ${ALL_COLLECTIONS.length}`);
  console.log(`  Total docs: ${ALL_COLLECTIONS.reduce((sum, c) => sum + c.docs.length, 0)}`);
  console.log('═'.repeat(60));
  console.log('');

  let totalDocs = 0;
  let errors = 0;

  for (const collection of ALL_COLLECTIONS) {
    try {
      const count = await seedCollection(collection);
      totalDocs += count;
      console.log(`  ✅ ${collection.name.padEnd(25)} ${count} docs`);
    } catch (error) {
      errors++;
      const msg = error instanceof Error ? error.message : String(error);
      console.log(`  ❌ ${collection.name.padEnd(25)} ERRO: ${msg}`);
    }
  }

  console.log('');
  console.log('═'.repeat(60));
  console.log(`  Total: ${totalDocs} documentos em ${ALL_COLLECTIONS.length} coleções`);
  if (errors > 0) {
    console.log(`  ⚠️  ${errors} coleção(ões) com erro`);
  }
  console.log('═'.repeat(60));

  process.exit(errors > 0 ? 1 : 0);
}

main();
