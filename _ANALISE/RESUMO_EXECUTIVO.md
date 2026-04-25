# Resumo Executivo — Digital Santa Maria

> Análise profunda consolidada. Abril 2026.

---

## O Que É o Projeto

**Digital Santa Maria** é uma plataforma web de governança municipal digital para Santa Maria do Pará (PA). Gerado no Google AI Studio com Next.js 15 + Firebase, propõe conectar cidadãos a 12 pilares de serviços municipais: saúde, educação, segurança, ouvidoria, petições, obras, empregos, tributação, comércio, meio ambiente, social e democracia participativa.

---

## Diagnóstico Real (após análise linha a linha)

> O projeto declara em sua própria documentação: *"O Frontend está COMPLETO e REDONDO, necessitando exclusivamente das chaves reais em Backend"*. A análise profunda revela que isso **subestima o trabalho restante**.

| Dimensão | % Real | Notas |
|---|---|---|
| Páginas / Rotas existentes | 100% | 22+ páginas existem e navegam |
| UI / Design visual | 100% | Componentes completos e responsivos |
| **Persistência de dados** | **~5%** | Só `/relatar` grava no Firestore |
| **Funcionalidades reais** | **~8%** | Quase tudo retorna um toast falso |
| Autenticação | 60% | Login funciona; roles não implementados |
| Integrações externas | 0% | Gemini, Maps, ViaCEP — zero código |
| Backend / Cloud Functions | 0% | Não existe nenhum |
| Acessibilidade | 40% | Context existe, ARIA ausente |
| Testes | 0% | Nenhum arquivo de teste |
| CI/CD | 0% | Não configurado |
| **Completude geral** | **~30%** | UI excelente; backend inexistente |

---

## A Única Funcionalidade 100% Real

Apenas **uma** das 22+ páginas grava dados de verdade:

```
/relatar → addDoc(collection(db, 'reports'), {...})
```

Tudo o mais — agendamentos, petições, candidaturas, ouvidoria, matrículas — exibe uma mensagem de sucesso (toast) e **descarta os dados**.

---

## Bugs Críticos Confirmados

| Bug | Arquivo | Impacto |
|---|---|---|
| Busca de protocolo funciona só com ID `2847192` | `app/ouvidoria/page.tsx:~150` | Ouvidoria inutilizável |
| Acesso admin por e-mail hardcoded | `app/gestao/page.tsx:46` | Segurança fraca, não escalável |
| Form de matrícula coleta 5 etapas e descarta tudo | `app/educacao/matricula/page.tsx:~50` | UX enganosa |
| Sugestão de grupo coletada mas descartada | `app/comunidade/page.tsx:~127` | Dado perdido silenciosamente |
| Candidatura a emprego perde no reload | `app/empregos/page.tsx:~92` | State-only, não persiste |
| Hydration mismatch no use-mobile hook | `hooks/use-mobile.ts:6` | Flicker no carregamento |

---

## Status Por Módulo

| Módulo | Rota | UI | Dados Reais | Bug Crítico | Prioridade |
|---|---|---|---|---|---|
| Relatar Problema | `/relatar` | ✅ | ✅ Parcial | Upload foto / GPS ausentes | 🔴 Alta |
| Ouvidoria | `/ouvidoria` | ✅ | ❌ | Busca hardcoded | 🔴 Alta |
| Petições | `/peticoes` | ✅ | ❌ | Sem persistência | 🔴 Alta |
| Saúde | `/saude` | ✅ | ❌ | Agendamento sem backend | 🔴 Alta |
| Gestão (Admin) | `/gestao` | ✅ | ❌ | Email hardcoded + sem persistência | 🔴 Alta |
| Perfil | `/perfil` | ✅ | ❌ | Form sem salvar | 🔴 Alta |
| Empregos | `/empregos` | ✅ | ❌ | Candidatura só em memória | 🟠 Média |
| Educação / Matrícula | `/educacao/matricula` | ✅ | ❌ | Form descartado | 🟠 Média |
| Comunidade | `/comunidade` | ✅ | ❌ | Sugestão descartada | 🟡 Baixa |
| Obras | `/obras` | ✅ | ❌ | Mock | 🟡 Baixa |
| Eventos | `/eventos` | ✅ | ❌ | Mock | 🟡 Baixa |
| Segurança | `/seguranca` | ✅ | ❌ | SOS sem envio real | 🟠 Média |
| Meio Ambiente | `/meio-ambiente` | ✅ | ❌ | Mock | 🟡 Baixa |
| Social | `/social` | ✅ | ❌ | Mock | 🟡 Baixa |
| Tributos | `/tributos` | ✅ | ❌ | Mock | 🟡 Baixa |
| Trânsito | `/transito` | ✅ | ❌ | Mock | 🟡 Baixa |
| Comércio | `/comercio` | ✅ | ❌ | Mock | 🟡 Baixa |
| Avisos | `/avisos` | ✅ | ❌ | Mock | 🟡 Baixa |
| Votos | `/votos` | ✅ | ❌ | Mock | 🟡 Baixa |
| Serviços | `/servicos` | ✅ | ❌ | Mock | 🟡 Baixa |
| Home | `/` | ✅ | ❌ | Stats hardcoded | 🟡 Baixa |
| Legal / Sobre | `/legal`, `/sobre` | ✅ | — | Conteúdo estático | — |

---

## Schema Firestore — Gap Analysis

O `firebase-blueprint.json` define 8 coleções. Apenas 1 é usada:

| Coleção | Definida | Usada no código | Gaps adicionais |
|---|---|---|---|
| `users` | ✅ | ⚠️ Parcial (criada no login) | Sem campos de role/points |
| `reports` | ✅ | ✅ Usada em `/relatar` | Faltam foto e geolocalização |
| `appointments` | ✅ | ❌ | Zero código de escrita |
| `jobs` | ✅ | ❌ | Zero código de escrita |
| `job_applications` | ✅ | ❌ | Zero código de escrita |
| `emergency_alerts` | ✅ | ❌ | Zero código de escrita |
| `petitions` | ✅ | ❌ | Zero código de escrita |
| `petition_signatures` | ✅ | ❌ | Zero código de escrita |
| `admins` | ❌ não no blueprint | ❌ | Referenciada nas rules, sem schema |
| `demands` | ❌ não no blueprint | ❌ | Documentada em `ARQUITETURA_TECNICA.md` |
| `health_units` | ❌ | ❌ | Necessária para `/saude` |

---

## Para Rodar Localmente — Resumo

```bash
# 1. Instalar dependências
npm install

# 2. Criar .env.local
cp .env.example .env.local
# Editar: APP_URL=http://localhost:3000

# 3. Rodar
npm run dev
# Acesse: http://localhost:3000
```

**O que funciona imediatamente:** navegação, login Google, UI completa, `/relatar` → Firestore.  
**O que não funciona:** quase todas as demais funcionalidades (dados mock, sem persistência).

Detalhes completos: [RODAR_LOCALMENTE.md](./RODAR_LOCALMENTE.md)

---

## Prioridades de Refinamento

### Correções Imediatas (baixo esforço, alto impacto)

1. **Conectar formulários ao Firestore** — petições, agendamentos, perfil, ouvidoria, matrículas  
   Esforço: adicionar `addDoc`/`updateDoc` em cada formulário  

2. **Corrigir autenticação admin** — remover e-mail hardcoded  
   `const adminDoc = await getDoc(doc(db, 'admins', user.uid))`  

3. **Corrigir busca de protocolo na ouvidoria** — query real ao Firestore  

4. **Seed de dados** — popular Firestore com clínicas, vagas, obras e eventos fictícios

### Implementações de Médio Prazo

5. **Upload de fotos** → Firebase Storage em `/relatar` e `/perfil`  
6. **Geolocalização real** → `navigator.geolocation` no formulário de relato  
7. **Cloud Functions** → e-mails, protocolos, notificações push  
8. **Gemini AI** → classificação automática de relatos (API key já existe)

### Melhorias de Qualidade

9. **Tipos TypeScript** → eliminar `any`, criar `types/index.ts` centralizado  
10. **Error boundaries** → `app/error.tsx`, `app/not-found.tsx`, skeletons de loading  
11. **Preferências de acessibilidade** → persistir no `localStorage`  
12. **Testes** → Jest + Firebase Emulator para operações CRUD críticas

---

## Referências

| Documento | Conteúdo |
|---|---|
| [ESTADO_ATUAL.md](./ESTADO_ATUAL.md) | Análise profunda linha a linha — bugs, gaps, métricas |
| [COMO_DEVERIA_SER.md](./COMO_DEVERIA_SER.md) | Visão de produto, integrações, roadmap detalhado |
| [RODAR_LOCALMENTE.md](./RODAR_LOCALMENTE.md) | Guia completo de setup local com troubleshooting |
| [../firebase-blueprint.json](../firebase-blueprint.json) | Schemas das 8 coleções Firestore |
| [../firestore.rules](../firestore.rules) | Regras de segurança (bem escritas) |
| [../docs/ARQUITETURA_TECNICA.md](../docs/ARQUITETURA_TECNICA.md) | Arquitetura desejada (inclui coleções ausentes do blueprint) |
| [../FINAL/PLANO_GERAL_INDEX.md](../FINAL/PLANO_GERAL_INDEX.md) | Declaração de completude do frontend |
