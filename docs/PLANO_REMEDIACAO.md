# Plano de Remediação — Auditoria Crítica (Junho 2026)

> Documento de trabalho derivado de uma auditoria crítica do estado atual do projeto.
> Cada **Parte** é auto-contida e pode ser executada de forma independente por um agente
> humano ou IA, sem precisar das demais. Leia a seção **"Como usar este documento"** antes de começar.

---

## Como usar este documento

- Cada item é uma **Parte** (`P#`) com: severidade, área, arquivos-alvo, contexto, passos, **critérios de aceite** e dependências.
- Pegue **uma Parte por vez**. Antes de iniciar, atualize o status na tabela de progresso para `🔄 Em andamento` com seu nome/IA.
- Ao concluir, marque `✅ Concluída` e preencha a coluna "Notas" com o commit/resumo do que mudou.
- **Não** inicie uma Parte cujas dependências (coluna "Dep.") ainda não estejam ✅.
- Toda Parte deve terminar com `npx tsc --noEmit`, `npm run lint` e `npm test` **verdes**. Esse é o portão mínimo (é o que o CI roda — ver `.github/workflows/ci.yml`).
- Não invente dados nem reintroduza mocks sem o aviso visual (`DevBanner`). Para portal público, veracidade > preencher tela.

### Legenda de severidade
- 🔴 **Crítico** — quebra funcionalidade-núcleo, risco de segurança/jurídico, ou bloqueia build.
- 🟠 **Importante** — qualidade/confiabilidade/acessibilidade; não bloqueia, mas é dívida séria.
- 🟡 **Higiene** — limpeza, consistência, dívida menor.

---

## Tabela de progresso

| # | Parte | Sev. | Área | Dep. | Status | Notas |
|---|---|---|---|---|---|---|
| P1 | Allowlist de imagens (`next/image`) | 🔴 | Segurança/Config | — | ⬜ Pendente | |
| P2 | Reativar Storage + upload de fotos | 🔴 | UX/Infra | — | ⬜ Pendente | |
| P3 | Auditoria de dados mockados | 🔴 | Produto/Confiança | — | ⬜ Pendente | |
| P4 | Portão de build/CI verde | 🔴 | Processo | — | 🟡 Parcial | import quebrado de Petições já removido nesta sessão |
| P5 | Acessibilidade — mínimo de tipografia | 🟠 | A11y/Design | — | ⬜ Pendente | |
| P6 | Cobertura de testes dos `services/` | 🟠 | Qualidade | — | ⬜ Pendente | |
| P7 | Unificar linguagem visual / tokens | 🟠 | Design System | P5 | 🟡 Parcial | heros unificados nesta sessão (ver Apêndice A) |
| P8 | Higiene de código (TODO/console/morto) | 🟡 | Manutenção | — | ⬜ Pendente | |

---

## P1 — 🔴 Allowlist de imagens no `next/image`

**Área:** Segurança / Configuração · **Dep.:** nenhuma · **Esforço:** baixo (~30 min) · **Risco:** baixo

### Contexto
`next.config.ts` tem `remotePatterns` com `{ protocol: 'https', hostname: '**' }`, que permite **qualquer** host HTTPS.
Isso transforma o otimizador de imagem do Next em um **proxy aberto** (vetor de SSRF e abuso de banda) e
torna as 8 entradas específicas logo abaixo **código morto** (o `**` já casa com tudo).

### Evidência
- [next.config.ts:15-69](../next.config.ts#L15-L69) — bloco `images.remotePatterns`, com `hostname: '**'` nas linhas 18-19.

### Passos
1. Remover a entrada coringa `{ protocol: 'https', hostname: '**' }`.
2. Manter **apenas** os hosts realmente usados. Inventário atual de hosts externos:
   - `firebasestorage.googleapis.com` (uploads reais — manter)
   - `lh3.googleusercontent.com` (avatar Google — manter)
   - `picsum.photos`, `api.qrserver.com`, `i.pravatar.cc`, `api.dicebear.com`, `www.apple.com`, `www.google.com` → **só manter se** ainda houver uso real; após **P3**, vários destes devem sumir do código e podem ser removidos daqui também.
3. Conferir que nenhuma imagem renderizada quebrou (`grep -rE "picsum|qrserver|pravatar|dicebear"`).

### Critérios de aceite
- [ ] `next.config.ts` não contém mais `hostname: '**'`.
- [ ] Apenas hosts efetivamente referenciados no código permanecem na lista.
- [ ] `tsc`, `lint`, `test` verdes; nenhuma imagem da UI quebrada.

---

## P2 — 🔴 Reativar Storage e restaurar upload de fotos

**Área:** UX / Infra · **Dep.:** nenhuma · **Esforço:** médio-alto · **Risco:** médio (mexe em infra + regras)

### Contexto
O upload de imagem foi **desativado** e substituído por "cole uma URL HTTPS pública". Para o fluxo-núcleo
"Relatar problema" (foto de buraco, lixo, etc.), isso é inviável para o cidadão real no celular. O mesmo
padrão atinge avatar de perfil e logo de comércio. A infra de Storage **existe** (`storage.rules`,
`storage.service.ts`), apenas não está ligada na UI.

### Evidência
- [features/relatar/PhotoUpload.tsx](../features/relatar/PhotoUpload.tsx) — input `type="url"`; texto "Upload direto fica desativado enquanto o Storage nao estiver ativo" (linha ~50).
- [features/perfil/AvatarUpload.tsx](../features/perfil/AvatarUpload.tsx) — mesmo padrão de URL.
- [features/perfil/MyBusinessesSection.tsx](../features/perfil/MyBusinessesSection.tsx) — logo via URL.
- [services/storage.service.ts](../services/storage.service.ts) — verificar o que já existe.
- [storage.rules](../storage.rules) — regras (1.1KB).

### Passos
1. Validar/ajustar `storage.rules`: leitura pública das imagens de relatos; escrita só autenticada, com limite de tamanho e `contentType` de imagem.
2. Implementar upload real em `storage.service.ts` (se incompleto): `uploadImage(file, path)` → retorna `downloadURL`, com validação de tipo/tamanho client-side.
3. Reescrever `PhotoUpload.tsx` para `<input type="file" accept="image/*" capture>`, com preview local, barra de progresso e fallback de erro. Manter opção de URL como secundária (opcional).
4. Replicar em `AvatarUpload.tsx` e no logo de `MyBusinessesSection.tsx`.
5. Garantir `firebasestorage.googleapis.com` na allowlist do P1.
6. Testar caminho feliz e erros (arquivo grande, tipo inválido, offline).

### Critérios de aceite
- [ ] Cidadão consegue anexar foto do dispositivo no fluxo "Relatar" sem colar URL.
- [ ] Upload grava no Storage e persiste o `downloadURL` no documento.
- [ ] `storage.rules` impõe auth na escrita + limite de tamanho/tipo.
- [ ] Estados de loading/erro tratados; `tsc`/`lint`/`test` verdes.

---

## P3 — 🔴 Auditoria de dados mockados / fabricados

**Área:** Produto / Confiança · **Dep.:** nenhuma · **Esforço:** alto · **Risco:** baixo (técnico), alto (institucional se ignorado)

### Contexto
Num portal de **governo**, dado fabricado exibido como real é risco institucional e potencialmente jurídico.
Hoje há dados inventados sem aviso em várias telas. Regra: **ou conecta dado real, ou marca claramente como
demonstração** (`DevBanner`/`DevBadge`), nunca deixar passar como oficial.

### Evidência (inventário a confirmar e completar)
- [app/saude/page.tsx](../app/saude/page.tsx) — marcadores de mapa fixos ("UPA Central — 15 min"), `fallbackMedicines`, QR de vacina via `api.qrserver.com`, imagem de mapa via `picsum.photos`.
- [app/educacao/page.tsx](../app/educacao/page.tsx) — `schools` hardcoded (IDEB/nota/rating), dashboard do aluno ("8.4", "94%", "425 mentores"), cardápio/transporte fictícios.
- [app/empregos/page.tsx](../app/empregos/page.tsx) — conferir origem das vagas (real via service vs. mock).
- Buscar todos: `grep -rEl "picsum|qrserver|pravatar|dicebear|fallback[A-Z]|const mock" app components features`.

### Passos
1. Montar **planilha/lista** de cada bloco de dado: tela → dado → origem (real / fallback / hardcoded / externo).
2. Para cada bloco, decidir: **(a)** conectar a `service` real, **(b)** envolver em `DevBanner` com texto honesto, ou **(c)** remover.
3. Padronizar: nenhuma informação numérica "oficial" (IDEB, espera, estoque, frequência) sem origem real OU sem aviso de demonstração visível **acima** do dado.
4. Após limpeza, remover hosts órfãos da allowlist (sincronizar com P1).

### Critérios de aceite
- [ ] Lista de inventário commitada (pode ser uma seção nova neste doc ou `docs/INVENTARIO_DADOS.md`).
- [ ] Nenhuma tela exibe número "oficial" fabricado sem `DevBanner` visível.
- [ ] `tsc`/`lint`/`test` verdes.

---

## P4 — 🔴 Portão de build/CI verde (e mantê-lo)

**Área:** Processo · **Dep.:** nenhuma · **Esforço:** baixo · **Risco:** baixo · **Status:** 🟡 Parcial

### Contexto
A `main` chegou a ter `tsc` quebrado: a página de Petições importava `CreatePetitionModal`, removido no
commit `88bed3e`. O CI (`ci.yml`) roda `tsc` + `lint` + `test` na `main`/PRs — ou seja, **estava vermelho e
foi mesclado por cima**. Isso já foi corrigido nesta sessão (import/estado/botão/modal removidos), mas a
*disciplina* precisa ser garantida.

### Evidência
- [.github/workflows/ci.yml](../.github/workflows/ci.yml) — job `validate` com tsc/lint/test.
- [app/peticoes/page.tsx](../app/peticoes/page.tsx) — já saneado nesta sessão.

### Passos
1. Confirmar `tsc`/`lint`/`test` verdes localmente e no CI da `main`.
2. Habilitar **branch protection** na `main` exigindo o check `validate` verde para merge (config no GitHub, não no código).
3. (Opcional) Adicionar `npm run build` ao CI para pegar erros de build de produção que o `tsc --noEmit` não pega.
4. Remover artefatos versionados que não deveriam estar na árvore: `.next/`, `tsconfig.tsbuildinfo` (conferir `.gitignore` — já ignora, então só `git rm --cached` se estiverem trackeados).

### Critérios de aceite
- [ ] CI verde na `main`.
- [ ] Branch protection exigindo CI configurada (anotar quem configurou).
- [ ] Nenhum artefato de build trackeado no git.

---

## P5 — 🟠 Acessibilidade: mínimo de tipografia

**Área:** A11y / Design · **Dep.:** nenhuma · **Esforço:** médio · **Risco:** médio (mexe em muitos arquivos)

### Contexto
Há **187** ocorrências de `text-[8px]`, `text-[9px]` e `text-[10px]`, quase sempre com `uppercase tracking-widest`
— a pior combinação de legibilidade. Portal municipal tem **obrigação legal de acessibilidade** e atende
idosos/baixa visão. Os `aria-*` existentes não compensam texto de 8px.

### Evidência
- Contar/localizar: `grep -rEo "text-\[(8|9|10)px\]" app components features | wc -l` (≈187).
- Arquivos mais afetados: `app/educacao/*`, `app/saude/page.tsx`, `app/empregos/page.tsx`, `app/seguranca/page.tsx`, `components/HealthHistoryPanel.tsx`, `features/saude/WaitTimeBadge.tsx`.

### Passos
1. Definir escala mínima no design system: **nada abaixo de 12px** para texto legível (eyebrows/labels mínimos = `text-xs`/12px).
2. Criar utilitário de "eyebrow/label" padronizado em `globals.css` (ex.: `.label-caps`) com tamanho ≥ 11–12px, `tracking` moderado e contraste adequado, e substituir as combinações `text-[8/9px] uppercase tracking-widest`.
3. Substituição mecânica por arquivo: `text-[8px]`→`text-[11px]`, `text-[9px]`→`text-[11px]`, `text-[10px]`→`text-[11px]` (revisar caso a caso onde quebrar layout).
4. Conferir contraste (WCAG AA) das cores `text-muted` sobre fundos claros.

### Critérios de aceite
- [ ] Zero ocorrências de `text-[8px]` e `text-[9px]`; `text-[10px]` justificado caso a caso.
- [ ] Labels/eyebrows usando classe padronizada do design system.
- [ ] `tsc`/`lint`/`test` verdes; layouts revisados (sem quebra visível).

---

## P6 — 🟠 Cobertura de testes dos `services/`

**Área:** Qualidade · **Dep.:** nenhuma · **Esforço:** alto · **Risco:** baixo

### Contexto
Existem **5** arquivos de teste, todos de utilitários (`protocol`, `rate-limit`, `validators`). **Zero** testes
nos **14 services** (camada que toca Firestore e protocolos do cidadão — maior risco) e zero nos 131 componentes.
Há também testes duplicados: `protocol.test.ts` **e** `protocols.test.ts`.

### Evidência
- `__tests__/lib/*` — apenas utils.
- [services/](../services/) — 14 services sem teste (`demands`, `reports`, `petitions`, `appointments`, `jobs`, `educacao`, `emergency`, `users`, `businesses`, `content`, `notifications`, `polls`, `admin-audit`, `storage`).

### Passos
1. Resolver duplicata `protocol.test.ts` vs `protocols.test.ts` (manter um).
2. Priorizar testes dos services de **maior risco**: `demands`, `reports`, `petitions`, `users` (escrita/transação/autorização).
3. Mockar Firestore (ou usar emulador — já há script `emulators` no `package.json`) e cobrir: caminho feliz, erro de permissão, dados inválidos, idempotência de protocolo.
4. Meta inicial realista: cobrir os 4 services críticos + smoke test de 2–3 fluxos de UI.

### Critérios de aceite
- [ ] Sem testes duplicados.
- [ ] ≥ 4 services críticos com testes de caminho feliz + erro.
- [ ] `npm test` verde e rodando no CI.

---

## P7 — 🟠 Unificar linguagem visual / tokens

**Área:** Design System · **Dep.:** P5 · **Esforço:** médio-alto · **Risco:** médio · **Status:** 🟡 Parcial

### Contexto
Coexistem **duas linguagens visuais**: o sistema "oficial" (`civic-card`, `hero-panel`, raio ~1.4rem, `border`)
e páginas bespoke com `rounded-[3rem]/[4rem]/[5rem]`, `border-2`, `shadow-4xl` e `blue-600` chapado.
Saúde/Educação/Empregos destoam de Ouvidoria/Gestão/Perfil. Os **heros** já foram unificados nesta sessão
(ver Apêndice A), mas raios, espessura de borda, sombras e cores hardcoded ainda divergem no miolo das páginas.

### Evidência
- `grep -rEo "rounded-\[[0-9]rem\]" app components features` — raios fora de escala.
- `grep -rl "blue-600\|blue-700" app components features` — cor hardcoded em vez de token `primary`.
- `grep -rl "border-2\|shadow-4xl\|shadow-3xl" app components features` — escala fora do padrão.

### Passos
1. Definir escala canônica de raio/sombra/borda no `@theme`/`globals.css` (ex.: raios `lg/xl/2xl`, duas sombras assinatura já existentes).
2. Substituir `blue-600/700` por tokens `primary`/`primary-dark`.
3. Normalizar `border-2`→`border` e raios bespoke para a escala canônica, página a página (cards de listagem, modais, formulários).
4. Consolidar cards em torno de `civic-card`/`glass-panel` onde fizer sentido.

### Critérios de aceite
- [ ] Zero `blue-600`/`blue-700` hardcoded.
- [ ] Raios/sombras dentro da escala definida.
- [ ] Páginas de serviço visualmente coesas entre si; `tsc`/`lint`/`test` verdes.

---

## P8 — 🟡 Higiene de código

**Área:** Manutenção · **Dep.:** nenhuma · **Esforço:** baixo-médio · **Risco:** baixo

### Contexto
Dívida menor espalhada: **21** `TODO/FIXME`, **13** `console.*` em produção, código zumbi (ex.: `loadPetitions`
virou no-op "mantido para compatibilidade").

### Evidência
- `grep -rEi "TODO|FIXME|HACK|XXX" app components features lib services` (≈21).
- `grep -rE "console\.(log|error|warn)" app components features lib services` (≈13).
- [app/peticoes/page.tsx](../app/peticoes/page.tsx) — `loadPetitions` no-op remanescente.

### Passos
1. Triar cada `TODO/FIXME`: resolver, virar issue, ou remover se obsoleto.
2. Trocar `console.*` por logger central (já existe `app/api/logs/route.ts` — avaliar) ou remover.
3. Remover código morto/no-ops (ex.: `loadPetitions`, se não for mais usado por `SignatureButton`).

### Critérios de aceite
- [ ] `console.*` removidos/centralizados em produção.
- [ ] `TODO/FIXME` triados (lista do que ficou e por quê).
- [ ] Sem código morto óbvio; `tsc`/`lint`/`test` verdes.

---

## Apêndice A — Já feito nesta sessão (não refazer)

Trabalho de design já aplicado e validado (`tsc`/`lint` verdes):

- **Design system** ([app/globals.css](../app/globals.css)): novos utilitários `.hero-grid-overlay`, `.ring-highlight`/`.ring-highlight-dark`, `.stat-tile` (com `--tile-accent`), `.sheen-on-hover`.
- **ContentHero** ([components/ui/ContentHero.tsx](../components/ui/ContentHero.tsx)): textura de grade, brilho no topo, anel decorativo, glow de acento e linha de acento — eleva os 15 serviços que o usam.
- **Painel do Cidadão** ([app/perfil/page.tsx](../app/perfil/page.tsx)): avatar com anel gradiente + selo "Conectado"; métricas com acentos distintos via `.stat-tile`; card "Como usar" com textura.
- **Painel Admin** ([app/gestao/page.tsx](../app/gestao/page.tsx) + [features/gestao/AdminOverview.tsx](../features/gestao/AdminOverview.tsx)): hero com orb; card "Itens pedindo ação" navy com textura; cards de fila com brilho/realce.
- **Heros bespoke unificados**: Educação ([app/educacao/page.tsx](../app/educacao/page.tsx)) — troca de `bg-blue-600` por gradiente da marca + textura; Empregos ([app/empregos/page.tsx](../app/empregos/page.tsx)) — hero navy + busca integrada; Saúde ([app/saude/page.tsx](../app/saude/page.tsx)) — card focal com textura; Ouvidoria ([app/ouvidoria/page.tsx](../app/ouvidoria/page.tsx)) e Petições ([app/peticoes/page.tsx](../app/peticoes/page.tsx)) — orb decorativo; Home ([app/page.tsx](../app/page.tsx)) — painel navy com textura.
- **Petições**: removido o fluxo de criação quebrado (import/estado/botão/modal de `CreatePetitionModal`) — `tsc` voltou a passar.

> Observação para P7: a unificação acima foi só dos **heros**. O miolo (cards de listagem, modais, formulários) ainda tem raios/bordas/cores divergentes.

---

## Apêndice B — Notas da auditoria (grades por quesito)

| Quesito | Nota | Comentário |
|---|---|---|
| Visual/UI | 8.5 | Forte, mas inconsistente entre páginas (ver P7) |
| UX real | 4.0 | Fluxos-núcleo (foto, criar petição) quebrados/falsos (P2) |
| Veracidade dos dados | 3.0 | Muito mock sem aviso num site público (P3) |
| Arquitetura | 7.5 | Boa separação, services organizados |
| Segurança | 6.5 | Rules sólidas, mas `image '**'` (P1) |
| Testes/qualidade | 3.5 | Quase só utils; 0 em UI/services (P6) |
| Acessibilidade | 4.5 | Boa intenção (aria), texto pequeno demais (P5) |
| Disciplina/processo | 4.0 | CI existe mas main quebrou (P4) |

**Pontos fortes confirmados:** higiene de segredos (gitignore correto), `firestore.rules` robusto (15KB),
arquitetura por features + 14 services, CI configurado, baseline de `aria-*` (106 ocorrências).
