# Base Tecnica

Data: 2026-05-22

## Build inicial

Comando usado:

```bash
npm.cmd run build
```

## Problemas encontrados

### 1. PowerShell bloqueou `npm.ps1`

O comando `npm run build` falhou porque a politica de execucao do Windows bloqueia scripts `.ps1`.

Solucao pratica:

- Usar `npm.cmd run build` no PowerShell.

### 2. Turbopack escolheu raiz errada

O Next detectou outro `package-lock.json` em `C:\Users\Reyvison` e tentou usar essa pasta como workspace root.

Isso causou erro de permissao ao ler `C:\Users\Reyvison`.

Solucao aplicada:

- Definir `turbopack.root` em `next.config.ts` apontando para a raiz real do projeto.

### 3. Build dependia de Google Fonts externo

O build falhou ao buscar `Inter` e `Outfit` via `next/font/google`.

Como o ambiente pode estar sem rede, isso torna o build fragil.

Solucao aplicada:

- Remover `next/font/google` do `app/layout.tsx`.
- Usar fallback tipografico via CSS.

Observacao:

- Depois podemos adicionar fontes locais se quisermos manter uma identidade visual mais controlada.

## Resultado atual

O build passou com sucesso.

Rotas geradas:

- `/`
- `/avisos`
- `/comercio`
- `/comunidade`
- `/educacao`
- `/educacao/matricula`
- `/empregos`
- `/eventos`
- `/eventos/[id]`
- `/gestao`
- `/legal`
- `/meio-ambiente`
- `/obras`
- `/obras/[id]`
- `/ouvidoria`
- `/perfil`
- `/peticoes`
- `/peticoes/[id]`
- `/relatar`
- `/saude`
- `/seguranca`
- `/servicos`
- `/sobre`
- `/social`
- `/transito`
- `/tributos`
- `/votos`
- `/api/classify-report`
- `/api/logs`
- `/api/suggest-response`

## Proximo passo tecnico

Criar mapa oficial de rotas:

- Rotas do MVP.
- Rotas secundarias.
- Rotas informativas.
- Rotas administrativas.
- Rotas API.
