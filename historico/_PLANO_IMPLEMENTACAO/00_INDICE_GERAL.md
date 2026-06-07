# Plano de Implementação — Digital Santa Maria
# ÍNDICE GERAL

> Versão: 1.0 | Data: Abril 2026  
> Baseado em análise profunda linha a linha de todo o projeto.

---

## Visão do Plano

Este plano cobre a implementação completa de **frontend + backend** do Digital Santa Maria.
Cada arquivo nesta pasta detalha uma camada ou módulo específico.

**Filosofia de implementação:**
- Um arquivo de código por responsabilidade
- Pastas separadas por domínio (feature folders)
- Tudo comentado em português brasileiro
- Sem `any` — tipos explícitos em todos os arquivos
- Firestore como única fonte da verdade
- Cloud Functions para toda lógica de negócio

---

## Estrutura dos Arquivos de Plano

```
_PLANO_IMPLEMENTACAO/
├── 00_INDICE_GERAL.md              ← Este arquivo
├── 01_ESTRUTURA_PASTAS.md          ← Nova estrutura de diretórios completa
├── 02_TIPOS_E_SCHEMAS.md           ← Todos os tipos TypeScript + schemas Firestore
├── 03_FIREBASE_CONFIG.md           ← Firebase, Firestore rules atualizadas, Storage
├── 04_AUTENTICACAO_E_ROLES.md      ← Auth, roles, middleware de proteção
├── 05_MODULO_RELATAR.md            ← /relatar: upload de foto + geolocalização real
├── 06_MODULO_OUVIDORIA.md          ← /ouvidoria: persistência + protocolo real
├── 07_MODULO_PETICOES.md           ← /peticoes: criação + assinatura atômica
├── 08_MODULO_SAUDE.md              ← /saude: dados reais + agendamento real
├── 09_MODULO_EMPREGOS.md           ← /empregos: vagas + candidatura real
├── 10_MODULO_GESTAO_ADMIN.md       ← /gestao: painel admin com roles reais
├── 11_MODULO_PERFIL.md             ← /perfil: edição + foto + histórico real
├── 12_COMPONENTES_GLOBAIS.md       ← Search, Notifications, Stats — com dados reais
├── 13_SEED_DE_DADOS.md             ← Scripts para popular Firestore
├── 14_CLOUD_FUNCTIONS.md           ← Funções backend: e-mail, protocolo, notificações
├── 15_GEMINI_AI.md                 ← Integração Gemini AI para classificação
└── 16_ORDEM_DE_EXECUCAO.md        ← Ordem exata de implementação com dependências
```

---

## Resumo das Fases

| Fase | Arquivos | O Que Entrega | Semanas |
|---|---|---|---|
| **Fase 1 — Fundação** | 01, 02, 03, 04 | Estrutura, tipos, Firebase, auth com roles | 1 |
| **Fase 2 — Persistência Core** | 05, 06, 07 | Relatar, Ouvidoria, Petições funcionando | 1–2 |
| **Fase 3 — Módulos Principais** | 08, 09, 10, 11 | Saúde, Empregos, Admin, Perfil | 2 |
| **Fase 4 — Dados e Backend** | 12, 13, 14 | Componentes globais, seed, Cloud Functions | 1–2 |
| **Fase 5 — IA e Refinamento** | 15, 16 | Gemini AI, ordem final de entrega | 1 |

**Total estimado:** 7–9 semanas de desenvolvimento focado.

---

## Stack Final Confirmada

```
Frontend:  Next.js 15 + React 19 RC + TypeScript strict
Styling:   Tailwind CSS 4 + design system existente (Zilla Slab / Public Sans)
Animation: Motion 11 (Framer)
Icons:     Lucide React 1.9
Charts:    Recharts 2.10 + D3 7.8

Backend:   Firebase Firestore (cloud)
Auth:      Firebase Auth (Google OAuth)
Storage:   Firebase Storage (fotos/docs)
Functions: Firebase Cloud Functions (Node 20)
AI:        Google Gemini 1.5 Flash

Novas Deps a Instalar:
  @google/generative-ai    → Gemini AI
  @vis.gl/react-google-maps → Google Maps
  firebase-admin           → Cloud Functions
```
