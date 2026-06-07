# Home — `/`

Pagina inicial do portal. Dashboard com metricas, slider de hero, grade de servicos.

**Dados:** Firestore real (`events`, `notices`)
**Hook:** `useHomeMetrics()`
**Service:** `content.service.ts`

## Estrutura

| Secao | Fonte de dados | Fallback |
|---|---|---|
| Hero / Slider | `events` publicados | — |
| Metricas (14, 100%) | `events.length`, `notices.length` | Valores hardcoded se Firestore vazio |
| Grade de servicos | `navigation.ts` (constantes) | — |
| Avisos recentes | `notices` publicados | — |

## Funcionalidades

- Slider horizontal de eventos em destaque (cards com data, local, CTA)
- Metricas animadas: eventos ativos, avisos publicados
- Grade de 9 modulos de servico com icones (relatar, ouvidoria, saude, educacao, empregos, peticoes, gestao, obras, seguranca)
- Secao de avisos recentes com link para `/avisos`
- Banner de alerta (`AlertBanner`) no topo se houver noticia tipo `alerta`/`urgencia`

## Pontos de melhoria

- Metricas poderiam buscar mais colecoes para refletir dados reais
- Hero poderia ser via CMS (`notices` tipo `destaque`)
