# Performance Audit — Conecta Santa Maria

## Relatório de Bundle Analysis (10/07/2026)

### Top 10 Rotas por Tamanho (JS não comprimido)

| Rota | Tamanho | MB |
|------|---------|-----|
| `/perfil` | 1,350.6 KB | 1.32 MB |
| `/gestao` | 1,319.7 KB | 1.29 MB |
| `/relatar` | 1,289.4 KB | 1.26 MB |
| `/educacao` | 1,262.0 KB | 1.23 MB |
| `/saude` | 1,260.4 KB | 1.23 MB |
| `/ouvidoria` | 1,258.3 KB | 1.23 MB |
| `/` (home) | 1,252.7 KB | 1.22 MB |
| `/peticoes` | 1,246.0 KB | 1.22 MB |
| `/seguranca` | 1,245.3 KB | 1.22 MB |
| `/educacao/matricula` | 1,243.0 KB | 1.21 MB |

### Resumo

- **Total de rotas:** 28
- **Tamanho total (não comprimido):** 34.2 MB
- **Tamanho médio por rota:** 1,250.9 KB (1.22 MB)

### Diagnóstico

1. **Bundles muito grandes** — Todas as rotas carregam ~1.2 MB de JS, indicando que o bundle compartilhado (framework + libs) é enorme.
2. **Pouca code-splitting** — A diferença entre a rota maior e menor é apenas ~100 KB, sugerindo que a maioria do código é carregado em todas as rotas.
3. **Lazy loading efetivo** — HealthMap e AppointmentModal já usam `next/dynamic`.

### Recomendações

1. **Verificar bundle do framework** — O bundle base de ~1.2 MB inclui React, Next.js, Firebase, Framer Motion, etc.
2. **Tree shaking** — Verificar se todas as importações estão usando paths específicos (ex: `import { X } from 'lucide-react'` em vez de `import * from 'lucide-react'`).
3. **Dynamic imports** — Considerar lazy loading de módulos pesados como `firebase/firestore`, `@google/generative-ai`, `motion/react`.

## Como rodar Lighthouse

```bash
# 1. Iniciar o servidor de desenvolvimento
npm run dev

# 2. Em outro terminal, rodar o Lighthouse
npm run lighthouse

# 3. Abrir o relatório gerado
# lighthouse-report.html
```

## Core Web Vitals — Checklists

### LCP (Largest Contentful Painting) < 2.5s
- [ ] Otimizar imagens com `next/image`
- [ ] Preload de fontes críticas
- [ ] Lazy loading de componentes pesados

### FID (First Input Delay) < 100ms
- [ ] Reduzir bundle size do JavaScript
- [ ] Code splitting efetivo
- [ ] Web Workers para cálculos pesados

### CLS (Cumulative Layout Shift) < 0.1
- [ ] Definir dimensões explícitas em imagens
- [ ] Usar `font-display: swap` para fontes
- [ ] Reservar espaço para componentes carregados async
