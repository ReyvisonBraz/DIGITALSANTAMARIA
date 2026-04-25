# Como Rodar o Projeto Localmente — Digital Santa Maria

> Guia detalhado baseado na análise profunda do código e configurações reais do projeto.

---

## Pré-requisitos

| Ferramenta | Versão mínima | Como verificar |
|---|---|---|
| Node.js | 18.x LTS | `node -v` |
| npm | 9.x+ | `npm -v` |
| Git | qualquer | `git --version` |

Instale Node.js em: https://nodejs.org (versão LTS — 20.x recomendada)

> **Nota:** O projeto usa React 19 RC e Next.js 15 — versões cutting-edge mas funcionais.

---

## 1. Instalar Dependências

```bash
cd "c:\Users\reyvison\Desktop\VS CODE\DIGITALSANTAMARIA"
npm install
```

Instala ~300MB de dependências. Principais pacotes:
- `next@15.0.0` + `react@19.0.0-rc.1`
- `firebase@12.12.1`
- `tailwindcss@4.2.4`
- `motion@11.0.0` (animações)
- `recharts@2.10.0` + `d3@7.8.0` (gráficos)

---

## 2. Configurar Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```bash
cp .env.example .env.local
```

Edite `.env.local`:
```env
# URL local (obrigatório para Next.js)
APP_URL=http://localhost:3000

# Chave da API Gemini (opcional para testes — IA não está implementada no código ainda)
# Obtenha em: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=sua_chave_aqui
```

> **Importante:** As credenciais Firebase já estão em `firebase-applet-config.json` — não precisa de variáveis adicionais para Firebase funcionar localmente.

---

## 3. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse: **http://localhost:3000**

O servidor usa Hot Module Replacement (HMR) — recarrega automaticamente ao salvar arquivos.  
Exceção: em ambiente AI Studio, HMR é desabilitado via `DISABLE_HMR=true`.

---

## 4. O Que Funciona Imediatamente (sem configuração extra)

| Funcionalidade | Status | Detalhes |
|---|---|---|
| Todas as 22+ páginas carregam | ✅ | Navegação completa |
| Login com Google | ✅ | Firebase Auth com conta Google |
| Logout | ✅ | |
| Design responsivo | ✅ | Mobile e desktop |
| Todas as animações | ✅ | Motion library |
| Enviar relato (`/relatar`) | ✅ | Grava na coleção `reports` do Firestore |
| Toast notifications | ✅ | Feedback visual |
| Painel admin (`/gestao`) | ✅* | *Só com e-mail `littlefigther50@gmail.com` |

---

## 5. O Que NÃO Funciona (e por quê)

| Funcionalidade | Status | Motivo Técnico |
|---|---|---|
| Criar petição | ❌ | `CreatePetitionModal` não tem `addDoc` |
| Assinar petição | ❌ | Só muda state local |
| Agendar consulta | ❌ | `AppointmentModal` sem `addDoc` |
| Editar perfil | ❌ | `ProfileSettingsPanel` sem `updateDoc` |
| Matrícula escolar | ❌ | Form descarta dados no submit |
| Busca global | ❌ | `SearchModal` sem lógica de busca |
| Upload de foto | ❌ | Sem integração com Firebase Storage |
| Geolocalização | ❌ | `navigator.geolocation` não chamado |
| Notificações push | ❌ | Sem Cloud Functions / FCM |
| Dados dinâmicos (clínicas, vagas, obras) | ❌ | Arrays hardcoded nos arquivos `.tsx` |
| Classificação com Gemini AI | ❌ | API key existe, zero código de integração |
| Busca de protocolo na ouvidoria | ❌* | *Só funciona com o ID hardcoded `2847192` |
| Pagamento de tributos | ❌ | Só UI |
| Candidatura a emprego | ❌ | State perde no reload |

---

## 6. Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento (porta 3000)
npm run build    # Build de produção
npm start        # Rodar build de produção
npm run lint     # ESLint (warnings não bloqueiam build)
```

---

## 7. Acessar o Painel Admin

O painel em `/gestao` verifica o e-mail do usuário logado:

```typescript
// app/gestao/page.tsx, linha 46
if (!user || user.email !== 'littlefigther50@gmail.com') { ... }
```

**Para testar com sua própria conta:** edite temporariamente o arquivo [app/gestao/page.tsx](../app/gestao/page.tsx) e substitua o e-mail pelo seu.

**Futuramente:** substituir por verificação na coleção `admins` no Firestore.

---

## 8. Firebase — Detalhes da Conexão

O projeto conecta ao Firebase real (cloud) — não roda localmente por padrão.

**Projeto Firebase:**
- Project ID: `gen-lang-client-0701591157`
- Database: `ai-studio-cbf81fa4-073d-45d7-88fd-f054c5080e02`
- Arquivo de config: `firebase-applet-config.json`

**O que acontece ao rodar localmente:**
- Login/logout → Firebase Auth cloud
- Dados enviados pelo `/relatar` → Firestore cloud real
- Demais operações → não chegam ao Firestore (sem código de escrita)

---

## 9. Opção: Firebase Emulator (Testes Isolados)

Para testar sem afetar os dados reais na nuvem:

```bash
# 1. Instalar Firebase CLI
npm install -g firebase-tools

# 2. Autenticar
firebase login

# 3. Inicializar emuladores (na pasta do projeto)
firebase init emulators
# Selecione: Authentication, Firestore

# 4. Iniciar emuladores
firebase emulators:start --only auth,firestore
```

Emuladores rodam em:
- Firestore UI: `http://localhost:4000`
- Auth: `http://localhost:9099`
- Firestore: `http://localhost:8080`

Para conectar o app ao emulador, adicionar em `lib/firebase.ts`:
```typescript
import { connectFirestoreEmulator } from 'firebase/firestore';
import { connectAuthEmulator } from 'firebase/auth';

if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_EMULATOR) {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099');
}
```

E adicionar ao `.env.local`:
```env
NEXT_PUBLIC_USE_EMULATOR=true
```

---

## 10. Build de Produção Local

```bash
npm run build
npm start
```

Acesse: **http://localhost:3000**

> O build usa `output: 'standalone'` — gera `.next/standalone/` otimizado para Docker/Cloud Run.  
> TypeScript errors são verificados no build. ESLint warnings são ignorados (`ignoreDuringBuilds: true`).

---

## 11. Problemas Comuns e Soluções

### Dependências corrompidas
```bash
rm -rf node_modules .next
npm install
npm run dev
```

### Login com Google não abre popup
- Verifique se está em `http://localhost:3000` (domínio autorizado no Firebase)
- Bloqueador de popup do browser pode bloquear o `signInWithPopup`
- Solução: permitir popups para localhost no browser

### Hydration mismatch no console
- Erro conhecido: `hooks/use-mobile.ts` e `accessibility-context.tsx`
- Não impede o funcionamento — só aparece no console de desenvolvimento

### Porta 3000 em uso
```bash
npm run dev -- -p 3001
# Acesse: http://localhost:3001
```

### Erro "Permission denied" no Firestore
- Ocorre quando usuário não está logado e tenta acessar dado protegido
- Faça login com Google antes de usar funcionalidades que gravam dados
- As `firestore.rules` exigem autenticação para a maioria das operações

### Build falha com erro de TypeScript
O `next.config.ts` tem `typescript.ignoreBuildErrors: false` — erros de tipo **bloqueiam** o build.  
Para identificar: `npx tsc --noEmit`

---

## 12. Variáveis de Ambiente — Referência Completa

```env
# .env.local

# Obrigatório
APP_URL=http://localhost:3000

# Para funcionalidades de IA (código ainda não implementado)
GEMINI_API_KEY=sua_chave_google_ai

# Para usar Firebase Emulator local em vez do cloud
NEXT_PUBLIC_USE_EMULATOR=true

# Usado pelo AI Studio para desabilitar HMR
# DISABLE_HMR=true  ← não definir localmente
```

---

## 13. Verificar se Está Funcionando

Após `npm run dev`, verifique:

1. `http://localhost:3000` carrega a home ✅
2. Clicar no ícone de usuário → login Google funciona ✅
3. Ir em `/relatar` → preencher formulário → enviar → protocolo gerado ✅
4. Verificar no [Firebase Console](https://console.firebase.google.com) → Firestore → coleção `reports` → documento criado ✅

Se os 4 passos funcionam, o ambiente local está correto.
