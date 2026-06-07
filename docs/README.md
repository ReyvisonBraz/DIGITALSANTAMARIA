# Documentacao — Conecta Santa Maria

> Portal do cidadao de Santa Maria do Para. 26 paginas, 14 services, 41 features, 30 componentes UI, Firebase Firestore em tempo real.

---

## Indice

### Arquitetura
| Arquivo | Conteudo |
|---|---|
| [`arquitetura/01_visao-geral.md`](arquitetura/01_visao-geral.md) | Visao geral do projeto, funcionalidades |
| [`arquitetura/02_stack.md`](arquitetura/02_stack.md) | Stack tecnologico completo |
| [`arquitetura/03_estrutura.md`](arquitetura/03_estrutura.md) | Estrutura de diretorios |
| [`arquitetura/04_fluxo-dados.md`](arquitetura/04_fluxo-dados.md) | Fluxo de dados: Firestore → Service → Hook → Pagina |

### Modulos (26 paginas)
| Arquivo | Pagina | Dados |
|---|---|---|
| [`modulos/01_home.md`](modulos/01_home.md) | `/` | Firestore real (events, notices) |
| [`modulos/02_relatar.md`](modulos/02_relatar.md) | `/relatar` | Firestore real (reports) |
| [`modulos/03_ouvidoria.md`](modulos/03_ouvidoria.md) | `/ouvidoria` | Firestore real (demands) |
| [`modulos/04_peticoes.md`](modulos/04_peticoes.md) | `/peticoes` | Firestore real (petitions) |
| [`modulos/05_saude.md`](modulos/05_saude.md) | `/saude` | Firestore real (health_units) |
| [`modulos/06_educacao.md`](modulos/06_educacao.md) | `/educacao` | Firestore real (education_schools, enrollments) |
| [`modulos/07_empregos.md`](modulos/07_empregos.md) | `/empregos` | Firestore real (jobs) |
| [`modulos/08_comercio.md`](modulos/08_comercio.md) | `/comercio` | Firestore real (businesses) |
| [`modulos/09_eventos.md`](modulos/09_eventos.md) | `/eventos` | Firestore real (events) |
| [`modulos/10_obras.md`](modulos/10_obras.md) | `/obras` | Firestore real (works) |
| [`modulos/11_avisos.md`](modulos/11_avisos.md) | `/avisos` | Firestore real (notices) |
| [`modulos/12_votos.md`](modulos/12_votos.md) | `/votos` | Firestore real (polls) |
| [`modulos/13_seguranca.md`](modulos/13_seguranca.md) | `/seguranca` | Firestore real (safety_zones, emergency_alerts) |
| [`modulos/14_transito.md`](modulos/14_transito.md) | `/transito` | Firestore real (traffic_alerts) |
| [`modulos/15_tributos.md`](modulos/15_tributos.md) | `/tributos` | Firestore real (tax_records) |
| [`modulos/16_social.md`](modulos/16_social.md) | `/social` | Firestore real (social_programs) |
| [`modulos/17_meio-ambiente.md`](modulos/17_meio-ambiente.md) | `/meio-ambiente` | Firestore real (environment_data) |
| [`modulos/18_comunidade.md`](modulos/18_comunidade.md) | `/comunidade` | Firestore real (community_groups) |
| [`modulos/19_servicos.md`](modulos/19_servicos.md) | `/servicos` | Firestore real (public_services) |
| [`modulos/20_gestao.md`](modulos/20_gestao.md) | `/gestao` | Firestore real (painel admin completo) |
| [`modulos/21_perfil.md`](modulos/21_perfil.md) | `/perfil` | Firestore real (painel do cidadao) |
| [`modulos/22_estaticas.md`](modulos/22_estaticas.md) | `/sobre`, `/legal` | Conteudo estatico |

### Referencia Tecnica
| Arquivo | Conteudo |
|---|---|
| [`referencia/01_servicos.md`](referencia/01_servicos.md) | Todos os 14 services com operacoes |
| [`referencia/02_tipos.md`](referencia/02_tipos.md) | Todos os tipos TypeScript |
| [`referencia/03_hooks.md`](referencia/03_hooks.md) | Todos os hooks (lib + features) |
| [`referencia/04_componentes.md`](referencia/04_componentes.md) | Componentes de UI reutilizaveis |
| [`referencia/05_firestore.md`](referencia/05_firestore.md) | Schema das colecoes no Firestore |
| [`referencia/06_seguranca.md`](referencia/06_seguranca.md) | Regras de seguranca e autenticacao |

### Guias
| Arquivo | Conteudo |
|---|---|
| [`guias/01_setup.md`](guias/01_setup.md) | Como rodar o projeto localmente |
| [`guias/02_novo-modulo.md`](guias/02_novo-modulo.md) | Como adicionar um novo modulo (passo a passo) |
| [`guias/03_cloud-functions.md`](guias/03_cloud-functions.md) | Cloud Functions (petition signatures, polls) |
| [`guias/04_gemini.md`](guias/04_gemini.md) | Integracao Gemini AI |

---

## Status Geral (Junho 2026)

| Metrica | Valor |
|---|---|
| Paginas com dados reais do Firestore | 24 de 26 (92%) |
| Services implementados | 14 |
| Features (componentes de dominio) | 41 |
| Componentes UI reutilizaveis | 12 (Modal, Button, Skeleton, etc.) |
| Tipos TypeScript | 13 modulos |
| Hooks | 8 (useContent, useAuth, useMobile, etc.) |
| Contexts/Providers | 4 (Auth, Toast, Accessibility, Notifications) |
| Servicos com listener em tempo real (onSnapshot) | 4 (businesses, demands, notifications, reports) |
| Cloud Functions deployadas | 2 (signPetition, votePoll) |
| API Routes (Gemini AI) | 2 (classify-report, suggest-response) |

---

## Comandos rapidos

```bash
npm run dev          # Dev server (Turbopack)
npx tsc --noEmit     # Type check
npm run build        # Build de producao
npm run lint         # ESLint
```

## Historico

Documentacao antiga de planejamento (Abril—Maio 2026) foi movida para [`../historico/`](../historico/).
