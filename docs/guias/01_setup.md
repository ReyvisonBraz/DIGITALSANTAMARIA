# Setup Local — Como Rodar o Projeto

## Pre-requisitos

- Node.js 18+
- npm 9+
- Conta Google (para login)
- Projeto Firebase configurado (Firestore, Auth, Storage)

## Instalacao

```bash
git clone <repo-url>
cd DIGITALSANTAMARIA
npm install
```

## Configuracao Firebase

### 1. Criar `.env.local` (NAO versionar)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=1:...
NEXT_PUBLIC_FIREBASE_DATABASE_ID=seu-database-id
NEXT_PUBLIC_GEMINI_API_KEY=...
```

> Se as env vars nao existirem, o sistema usa `firebase-applet-config.json` como fallback.

### 2. Ativar Firebase Auth

No console Firebase → Authentication → Sign-in method:
- Ativar **Google** como provider

### 3. Deploy das Firestore Rules

```bash
npx firebase deploy --only firestore:rules
npx firebase deploy --only storage:rules
```

### 4. Criar admin inicial

No console Firebase → Firestore → criar documento:
```
Colecao: admins
Documento: <seu-uid-do-firebase-auth>
Campos: { role: "admin" }
```

### 5. Rodar seed (opcional)

```bash
npx ts-node scripts/seed.ts
```

Popula colecoes com dados iniciais: unidades de saude, vagas de emprego, peticoes, admin.

## Rodar

```bash
npm run dev     # Dev server em http://localhost:3000 (Turbopack)
```

## Verificar

```bash
npx tsc --noEmit   # Type check
npm run build      # Build de producao
npm run lint       # ESLint
```

## Troubleshooting

### Erro de authDomain
Se o login falhar, verifique se o dominio `localhost` esta autorizado em Firebase Auth → Settings → Authorized domains.

### Firestore permission denied
Certifique-se de que as Firestore rules foram deployadas e que o admin inicial foi criado.

### Hydration errors no console
Ignorar warnings de hydration durante desenvolvimento (esperados com estados assincronos). Nao afetam producao.
