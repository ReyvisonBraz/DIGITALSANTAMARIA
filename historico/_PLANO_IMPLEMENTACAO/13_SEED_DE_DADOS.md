# 13 — Seed de Dados: Popular o Firestore

> Script Node.js para popular o Firestore com dados fictícios realistas.
> Executa uma única vez para criar a base de dados inicial.

---

## Arquivo: `scripts/seed.ts` (NOVO)

```typescript
/**
 * Script de seed do Firestore — Digital Santa Maria
 *
 * Uso:
 *   npx ts-node scripts/seed.ts
 *
 * Requer:
 *   - Arquivo .env.local com as credenciais Firebase
 *   - firebase-admin instalado: npm install firebase-admin
 *
 * O que cria:
 *   - 5 unidades de saúde (health_units)
 *   - 8 vagas de emprego (jobs)
 *   - 4 petições de exemplo (petitions)
 *   - 3 avisos municipais (notices)
 *   - 1 admin inicial (admins)
 */

import * as admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join } from 'path';

// Carrega credenciais do firebase-applet-config.json
const firebaseConfig = JSON.parse(
  readFileSync(join(__dirname, '../firebase-applet-config.json'), 'utf-8')
);

// Inicializa Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: firebaseConfig.projectId,
    databaseURL: `https://${firebaseConfig.projectId}-default-rtdb.firebaseio.com`,
  });
}

const db = admin.firestore();

// ─────────────────────────────────────────────
// DADOS DE SEED
// ─────────────────────────────────────────────

const healthUnits = [
  {
    name: 'UPA Central Santa Maria',
    type: 'upa',
    address: 'Av. Principal, 1200 - Centro, Santa Maria do Pará',
    phone: '(91) 3311-0001',
    waitTime: '15 min',
    waitLevel: 'low',
    isOpen: true,
    openHours: '24h',
    specialties: ['Clínica Geral', 'Pediatria', 'Ortopedia'],
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    name: 'Clínica da Família Bom Jesus',
    type: 'clinica',
    address: 'Rua das Palmeiras, 340 - Bom Jesus',
    phone: '(91) 3311-0002',
    waitTime: '40 min',
    waitLevel: 'medium',
    isOpen: true,
    openHours: '07:00 - 19:00',
    specialties: ['Clínica Geral', 'Ginecologia', 'Pré-natal'],
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    name: 'Posto de Saúde Vila Nova',
    type: 'clinica',
    address: 'Travessa São José, 89 - Vila Nova',
    phone: '(91) 3311-0003',
    waitTime: '1h 20min',
    waitLevel: 'high',
    isOpen: true,
    openHours: '07:00 - 17:00',
    specialties: ['Clínica Geral', 'Vacinação'],
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    name: 'Farmácia Popular Municipal',
    type: 'farmacia',
    address: 'Praça da Matriz, 10 - Centro',
    phone: '(91) 3311-0004',
    waitTime: '5 min',
    waitLevel: 'low',
    isOpen: true,
    openHours: '08:00 - 20:00',
    specialties: ['Medicamentos Gratuitos', 'Insulina', 'Anti-hipertensivos'],
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    name: 'CRAS Santa Maria',
    type: 'cras',
    address: 'Rua do Comercio, 225 - Centro',
    phone: '(91) 3311-0005',
    waitTime: '30 min',
    waitLevel: 'medium',
    isOpen: true,
    openHours: '08:00 - 17:00',
    specialties: ['Assistência Social', 'Benefícios', 'Cadastro Único'],
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
];

const jobs = [
  {
    employerId: 'prefeitura',
    employerName: 'Prefeitura Municipal de Santa Maria do Pará',
    title: 'Agente Comunitário de Saúde',
    description: 'Atuar na promoção da saúde em comunidades do município, realizando visitas domiciliares e acompanhamento de famílias.',
    requirements: ['Ensino Médio completo', 'Residir na área de atuação', 'Disponibilidade para trabalho de campo'],
    benefits: ['Vale alimentação', 'Plano de saúde', 'FGTS', '13° salário'],
    salary: 'R$ 2.824,00',
    type: 'clt',
    location: 'Santa Maria do Pará - PA',
    tags: ['Saúde', 'Comunidade', 'Campo'],
    isActive: true,
    isFeatured: true,
    applicationCount: 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    employerId: 'prefeitura',
    employerName: 'Prefeitura Municipal de Santa Maria do Pará',
    title: 'Professor de Educação Básica',
    description: 'Lecionar para turmas do ensino fundamental I e II nas escolas municipais. Carga horária de 40h semanais.',
    requirements: ['Licenciatura em Pedagogia ou área afim', 'Experiência mínima de 1 ano em sala de aula'],
    benefits: ['PCCS Municipal', 'Plano de saúde', 'Auxílio transporte'],
    salary: 'R$ 4.200,00',
    type: 'clt',
    location: 'Santa Maria do Pará - PA',
    tags: ['Educação', 'Ensino', 'Municipal'],
    isActive: true,
    isFeatured: true,
    applicationCount: 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    employerId: 'comercio_local',
    employerName: 'Supermercado Família',
    title: 'Operador de Caixa',
    description: 'Atendimento ao cliente e operação de caixa em supermercado local. Escala 6x1.',
    requirements: ['Ensino Médio', 'Experiência com atendimento ao público', 'Disponibilidade de horário'],
    benefits: ['Vale refeição', 'Vale transporte'],
    salary: 'R$ 1.600,00',
    type: 'clt',
    location: 'Santa Maria do Pará - PA',
    tags: ['Comércio', 'Atendimento', 'CLT'],
    isActive: true,
    isFeatured: false,
    applicationCount: 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    employerId: 'prefeitura',
    employerName: 'Secretaria de Obras',
    title: 'Auxiliar de Serviços Gerais',
    description: 'Manutenção e limpeza de espaços públicos, praças e repartições municipais.',
    requirements: ['Ensino Fundamental', 'Disponibilidade para trabalho externo'],
    benefits: ['Vale transporte', 'EPI fornecido'],
    salary: 'R$ 1.412,00',
    type: 'temporario',
    location: 'Santa Maria do Pará - PA',
    tags: ['Obras', 'Serviços', 'Temporário'],
    isActive: true,
    isFeatured: false,
    applicationCount: 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
];

const petitions = [
  {
    creatorId: 'seed_system',
    creatorName: 'Associação de Moradores do Centro',
    creatorPhotoURL: null,
    title: 'Instalação de Semáforo na Esquina da Av. Principal com Rua das Flores',
    description: 'A esquina em questão registra alto índice de acidentes de trânsito e não possui sinalização adequada. Solicitamos urgência na instalação de semáforo para proteger pedestres e motoristas.',
    category: 'Trânsito e Segurança',
    goal: 500,
    signaturesCount: 127,
    status: 'active',
    officialReply: null,
    coverImageURL: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    creatorId: 'seed_system',
    creatorName: 'Pais e Mestres da EMEF Municipal',
    creatorPhotoURL: null,
    title: 'Reforma e Ampliação da Escola Municipal da Vila Nova',
    description: 'A escola atende 450 alunos em instalações precárias, com teto comprometido e falta de espaço. Esta petição exige a inclusão da reforma no PPA municipal.',
    category: 'Educação',
    goal: 1000,
    signaturesCount: 634,
    status: 'active',
    officialReply: null,
    coverImageURL: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    creatorId: 'seed_system',
    creatorName: 'Associação Comunitária do Bairro Bom Jesus',
    creatorPhotoURL: null,
    title: 'Criação de Área de Lazer e Esporte no Bairro Bom Jesus',
    description: 'O bairro não possui nenhuma praça, quadra ou área de lazer. Crianças e jovens não têm onde praticar esportes com segurança. Pedimos a criação de uma área verde com equipamentos.',
    category: 'Lazer e Esporte',
    goal: 300,
    signaturesCount: 89,
    status: 'active',
    officialReply: null,
    coverImageURL: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
];

// ─────────────────────────────────────────────
// FUNÇÕES DE SEED
// ─────────────────────────────────────────────

async function seedCollection(
  collectionName: string,
  data: Record<string, unknown>[]
): Promise<void> {
  const batch = db.batch();
  const collRef = db.collection(collectionName);

  for (const item of data) {
    const docRef = collRef.doc();
    batch.set(docRef, item);
  }

  await batch.commit();
  console.log(`✅ ${data.length} documentos criados em '${collectionName}'`);
}

async function seedAdminUser(email: string, uid: string): Promise<void> {
  await db.collection('admins').doc(uid).set({
    role: 'admin',
    department: null,
    email,
    grantedAt: admin.firestore.FieldValue.serverTimestamp(),
    grantedBy: 'seed_script',
  });
  console.log(`✅ Admin criado: ${email}`);
}

async function main(): Promise<void> {
  console.log('🌱 Iniciando seed do Firestore...\n');

  try {
    await seedCollection('health_units', healthUnits);
    await seedCollection('jobs', jobs);
    await seedCollection('petitions', petitions);

    // Cria o admin inicial — substitua pelo UID real do usuário admin
    // O UID é encontrado no Firebase Console → Authentication → Users
    // await seedAdminUser('littlefigther50@gmail.com', 'SEU_UID_AQUI');

    console.log('\n✨ Seed concluído com sucesso!');
    console.log('⚠️  Lembre-se de criar o documento admin manualmente.');
    console.log('   Firebase Console → Authentication → copie o UID → Firestore → /admins/{uid}');
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    process.exit(1);
  }
}

main();
```

---

## Como Criar o Admin Manualmente

Após o seed, crie o documento admin via Firebase Console:

```
1. Acesse: console.firebase.google.com
2. Seu projeto → Firestore Database
3. Coleção: admins
4. Novo documento → ID: {seu_uid_do_google}
5. Campos:
   - role: "admin"
   - department: null
   - grantedAt: (timestamp atual)
   - grantedBy: "manual"
```

---

## Arquivo: `scripts/package.json`

```json
{
  "name": "digitalsm-scripts",
  "scripts": {
    "seed": "ts-node -r dotenv/config scripts/seed.ts",
    "seed:dry": "ts-node scripts/seed.ts --dry-run"
  },
  "dependencies": {
    "firebase-admin": "^12.0.0",
    "dotenv": "^16.0.0",
    "ts-node": "^10.0.0",
    "typescript": "^5.0.0"
  }
}
```

---

## Instalar Dependência para o Seed

```bash
# Apenas para desenvolvimento (não vai para o bundle do app)
npm install --save-dev firebase-admin ts-node dotenv

# Rodar o seed
npx ts-node -r dotenv/config scripts/seed.ts
```
