import { readFileSync } from 'fs';
import { createRequire } from 'module';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const admin = require('firebase-admin') as typeof import('firebase-admin');

type SeedDoc = Record<string, unknown> & {
  id: string;
};

const currentDir = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(
  readFileSync(join(currentDir, '../firebase-applet-config.json'), 'utf-8')
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: config.projectId,
  });
}

const db = admin.firestore();
const ts = admin.firestore.FieldValue.serverTimestamp;

const healthUnits: SeedDoc[] = [
  {
    id: 'upa-central',
    name: 'UPA Central Santa Maria',
    type: 'upa',
    address: 'Av. Principal, 1200 - Centro',
    phone: '(91) 3311-0001',
    waitTime: '15 min',
    waitLevel: 'low',
    isOpen: true,
    openHours: '24h',
    specialties: ['Clinica Geral', 'Pediatria', 'Ortopedia'],
    updatedAt: ts(),
  },
  {
    id: 'clinica-familia-bom-jesus',
    name: 'Clinica da Familia Bom Jesus',
    type: 'clinica',
    address: 'Rua das Palmeiras, 340 - Bom Jesus',
    phone: '(91) 3311-0002',
    waitTime: '40 min',
    waitLevel: 'medium',
    isOpen: true,
    openHours: '07:00 - 19:00',
    specialties: ['Clinica Geral', 'Ginecologia', 'Pre-natal'],
    updatedAt: ts(),
  },
  {
    id: 'posto-vila-nova',
    name: 'Posto de Saude Vila Nova',
    type: 'clinica',
    address: 'Travessa Sao Jose, 89 - Vila Nova',
    phone: '(91) 3311-0003',
    waitTime: '1h 20min',
    waitLevel: 'high',
    isOpen: true,
    openHours: '07:00 - 17:00',
    specialties: ['Clinica Geral', 'Vacinacao'],
    updatedAt: ts(),
  },
  {
    id: 'farmacia-popular-municipal',
    name: 'Farmacia Popular Municipal',
    type: 'farmacia',
    address: 'Praca da Matriz, 10 - Centro',
    phone: '(91) 3311-0004',
    waitTime: '5 min',
    waitLevel: 'low',
    isOpen: true,
    openHours: '08:00 - 20:00',
    specialties: ['Medicamentos gratuitos', 'Insulina'],
    updatedAt: ts(),
  },
  {
    id: 'cras-santa-maria',
    name: 'CRAS Santa Maria',
    type: 'cras',
    address: 'Rua do Comercio, 225 - Centro',
    phone: '(91) 3311-0005',
    waitTime: '30 min',
    waitLevel: 'medium',
    isOpen: true,
    openHours: '08:00 - 17:00',
    specialties: ['Assistencia Social', 'Cadastro Unico'],
    updatedAt: ts(),
  },
];

const jobs: SeedDoc[] = [
  {
    id: 'agente-comunitario-saude',
    employerId: 'prefeitura',
    employerName: 'Prefeitura Municipal',
    title: 'Agente Comunitario de Saude',
    description: 'Atuar na promocao da saude em comunidades do municipio.',
    requirements: ['Ensino Medio', 'Residir na area'],
    benefits: ['Vale alimentacao', 'Plano de saude'],
    salary: 'R$ 2.824,00',
    type: 'clt',
    location: 'Santa Maria do Para - PA',
    tags: ['Saude', 'Comunidade'],
    isActive: true,
    isFeatured: true,
    applicationCount: 0,
    createdAt: ts(),
    updatedAt: ts(),
  },
  {
    id: 'professor-educacao-basica',
    employerId: 'prefeitura',
    employerName: 'Prefeitura Municipal',
    title: 'Professor de Educacao Basica',
    description: 'Lecionar para turmas do ensino fundamental.',
    requirements: ['Licenciatura', 'Experiencia'],
    benefits: ['PCCS', 'Plano de saude'],
    salary: 'R$ 4.200,00',
    type: 'clt',
    location: 'Santa Maria do Para - PA',
    tags: ['Educacao', 'Ensino'],
    isActive: true,
    isFeatured: true,
    applicationCount: 0,
    createdAt: ts(),
    updatedAt: ts(),
  },
  {
    id: 'operador-caixa',
    employerId: 'comercio_local',
    employerName: 'Supermercado Familia',
    title: 'Operador de Caixa',
    description: 'Atendimento ao cliente e operacao de caixa.',
    requirements: ['Ensino Medio', 'Atendimento'],
    benefits: ['Vale refeicao'],
    salary: 'R$ 1.600,00',
    type: 'clt',
    location: 'Santa Maria do Para - PA',
    tags: ['Comercio', 'Atendimento'],
    isActive: true,
    isFeatured: false,
    applicationCount: 0,
    createdAt: ts(),
    updatedAt: ts(),
  },
  {
    id: 'auxiliar-servicos-gerais',
    employerId: 'prefeitura',
    employerName: 'Secretaria de Obras',
    title: 'Auxiliar de Servicos Gerais',
    description: 'Manutencao de espacos publicos.',
    requirements: ['Ensino Fundamental'],
    benefits: ['Vale transporte'],
    salary: 'R$ 1.412,00',
    type: 'temporario',
    location: 'Santa Maria do Para - PA',
    tags: ['Obras', 'Servicos'],
    isActive: true,
    isFeatured: false,
    applicationCount: 0,
    createdAt: ts(),
    updatedAt: ts(),
  },
];

const petitions: SeedDoc[] = [
  {
    id: 'semaforo-av-principal',
    creatorId: 'seed',
    creatorName: 'Associacao de Moradores',
    creatorPhotoURL: null,
    title: 'Semaforo na Av. Principal',
    description: 'Alto indice de acidentes. Solicitamos instalacao urgente de semaforo.',
    category: 'Transito',
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
    description: 'Escola com instalacoes precarias precisa de reforma estrutural.',
    category: 'Educacao',
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
    creatorName: 'Associacao Comunitaria',
    creatorPhotoURL: null,
    title: 'Area de lazer no Bom Jesus',
    description: 'O bairro precisa de praca, quadra e espaco seguro para criancas.',
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

async function seedCollection(name: string, data: SeedDoc[]) {
  const batch = db.batch();

  for (const { id, ...item } of data) {
    batch.set(db.collection(name).doc(id), item, { merge: true });
  }

  await batch.commit();
  console.log(`${data.length} documentos sincronizados em '${name}'`);
}

async function main() {
  console.log('Iniciando seed idempotente do Firestore...');

  await seedCollection('health_units', healthUnits);
  await seedCollection('jobs', jobs);
  await seedCollection('petitions', petitions);

  console.log('Seed concluido.');
}

main().catch((error) => {
  console.error('Erro no seed:', error);
  process.exit(1);
});
