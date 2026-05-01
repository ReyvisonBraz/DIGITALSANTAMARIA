import * as admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join } from 'path';

const config = JSON.parse(
  readFileSync(join(__dirname, '../firebase-applet-config.json'), 'utf-8')
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: config.projectId,
  });
}

const db = admin.firestore();
const ts = admin.firestore.FieldValue.serverTimestamp;

const healthUnits = [
  { name: 'UPA Central Santa Maria', type: 'upa', address: 'Av. Principal, 1200 - Centro', phone: '(91) 3311-0001', waitTime: '15 min', waitLevel: 'low', isOpen: true, openHours: '24h', specialties: ['Clínica Geral', 'Pediatria', 'Ortopedia'], updatedAt: ts() },
  { name: 'Clínica da Família Bom Jesus', type: 'clinica', address: 'Rua das Palmeiras, 340 - Bom Jesus', phone: '(91) 3311-0002', waitTime: '40 min', waitLevel: 'medium', isOpen: true, openHours: '07:00 - 19:00', specialties: ['Clínica Geral', 'Ginecologia', 'Pré-natal'], updatedAt: ts() },
  { name: 'Posto de Saúde Vila Nova', type: 'clinica', address: 'Travessa São José, 89 - Vila Nova', phone: '(91) 3311-0003', waitTime: '1h 20min', waitLevel: 'high', isOpen: true, openHours: '07:00 - 17:00', specialties: ['Clínica Geral', 'Vacinação'], updatedAt: ts() },
  { name: 'Farmácia Popular Municipal', type: 'farmacia', address: 'Praça da Matriz, 10 - Centro', phone: '(91) 3311-0004', waitTime: '5 min', waitLevel: 'low', isOpen: true, openHours: '08:00 - 20:00', specialties: ['Medicamentos Gratuitos', 'Insulina'], updatedAt: ts() },
  { name: 'CRAS Santa Maria', type: 'cras', address: 'Rua do Comercio, 225 - Centro', phone: '(91) 3311-0005', waitTime: '30 min', waitLevel: 'medium', isOpen: true, openHours: '08:00 - 17:00', specialties: ['Assistência Social', 'Cadastro Único'], updatedAt: ts() },
];

const jobs = [
  { employerId: 'prefeitura', employerName: 'Prefeitura Municipal', title: 'Agente Comunitário de Saúde', description: 'Atuar na promoção da saúde em comunidades do município.', requirements: ['Ensino Médio', 'Residir na área'], benefits: ['Vale alimentação', 'Plano de saúde'], salary: 'R$ 2.824,00', type: 'clt', location: 'Santa Maria do Pará - PA', tags: ['Saúde', 'Comunidade'], isActive: true, isFeatured: true, applicationCount: 0, createdAt: ts(), updatedAt: ts() },
  { employerId: 'prefeitura', employerName: 'Prefeitura Municipal', title: 'Professor de Educação Básica', description: 'Lecionar para turmas do ensino fundamental.', requirements: ['Licenciatura', 'Experiência'], benefits: ['PCCS', 'Plano de saúde'], salary: 'R$ 4.200,00', type: 'clt', location: 'Santa Maria do Pará - PA', tags: ['Educação', 'Ensino'], isActive: true, isFeatured: true, applicationCount: 0, createdAt: ts(), updatedAt: ts() },
  { employerId: 'comercio_local', employerName: 'Supermercado Família', title: 'Operador de Caixa', description: 'Atendimento ao cliente e operação de caixa.', requirements: ['Ensino Médio', 'Atendimento'], benefits: ['Vale refeição'], salary: 'R$ 1.600,00', type: 'clt', location: 'Santa Maria do Pará - PA', tags: ['Comércio', 'Atendimento'], isActive: true, isFeatured: false, applicationCount: 0, createdAt: ts(), updatedAt: ts() },
  { employerId: 'prefeitura', employerName: 'Secretaria de Obras', title: 'Auxiliar de Serviços Gerais', description: 'Manutenção de espaços públicos.', requirements: ['Ensino Fundamental'], benefits: ['Vale transporte'], salary: 'R$ 1.412,00', type: 'temporario', location: 'Santa Maria do Pará - PA', tags: ['Obras', 'Serviços'], isActive: true, isFeatured: false, applicationCount: 0, createdAt: ts(), updatedAt: ts() },
];

const petitions = [
  { creatorId: 'seed', creatorName: 'Associação de Moradores', creatorPhotoURL: null, title: 'Semáforo na Av. Principal', description: 'Alto índice de acidentes, solicitamos semáforo urgente.', category: 'Trânsito', goal: 500, signaturesCount: 127, status: 'active', officialReply: null, coverImageURL: null, createdAt: ts(), updatedAt: ts() },
  { creatorId: 'seed', creatorName: 'Pais e Mestres', creatorPhotoURL: null, title: 'Reforma da Escola Municipal', description: 'Escola com instalações precárias, reforma urgente.', category: 'Educação', goal: 1000, signaturesCount: 634, status: 'active', officialReply: null, coverImageURL: null, createdAt: ts(), updatedAt: ts() },
  { creatorId: 'seed', creatorName: 'Associação Comunitária', creatorPhotoURL: null, title: 'Área de Lazer no Bom Jesus', description: 'Bairro sem praça ou quadra esportiva.', category: 'Lazer', goal: 300, signaturesCount: 89, status: 'active', officialReply: null, coverImageURL: null, createdAt: ts(), updatedAt: ts() },
];

async function seedCollection(name: string, data: Record<string, unknown>[]) {
  const batch = db.batch();
  for (const item of data) {
    batch.set(db.collection(name).doc(), item);
  }
  await batch.commit();
  console.log(`✅ ${data.length} documentos criados em '${name}'`);
}

async function main() {
  console.log('🌱 Iniciando seed do Firestore...\n');
  try {
    await seedCollection('health_units', healthUnits);
    await seedCollection('jobs', jobs);
    await seedCollection('petitions', petitions);
    console.log('\n✨ Seed concluído!');
    console.log('⚠️  Crie o admin manualmente:');
    console.log('   Firebase Console → Firestore → /admins/{uid}');
    console.log('   Campos: role: "admin", grantedAt: timestamp');
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

main();
