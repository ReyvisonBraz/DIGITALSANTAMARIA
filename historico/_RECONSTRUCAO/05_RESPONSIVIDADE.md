# Responsividade Mobile e Web

Decisao registrada: 2026-05-22

## Problema percebido

O projeto atual tem telas visualmente fortes, mas algumas partes ficam grandes demais no mobile e tambem em certas larguras web.

Isso precisa ser tratado como requisito do produto, nao como detalhe final.

## Regra geral

Todo layout do MVP deve funcionar bem em:

- Mobile pequeno.
- Mobile grande.
- Tablet.
- Desktop.
- Desktop largo.

## Principios

- A Home publica deve ser clara e leve no celular.
- Botoes principais devem caber bem sem texto esmagado.
- Cards nao devem ficar gigantes em desktop.
- Hero nao deve ocupar altura excessiva no mobile.
- Textos grandes devem ser usados com cuidado.
- Modais e paineis precisam caber na tela pequena.
- Navegacao mobile deve ser simples e previsivel.
- Conteudo essencial deve aparecer sem exigir scroll exagerado.

## Criterio de aceite para cada pagina do MVP

Antes de considerar uma pagina pronta:

- Deve ser usavel no celular.
- Deve ser usavel no desktop.
- Nao deve ter textos cortados.
- Nao deve ter botoes gigantes ou desproporcionais.
- Nao deve ter cards ocupando espaco demais sem necessidade.
- A hierarquia visual precisa ser clara nas duas telas.

## Paginas prioritarias para revisao responsiva

1. Home publica.
2. Painel do Cidadao.
3. Ouvidoria/abrir solicitacao.
4. Consulta de protocolo.
5. Gestao/admin.
6. Peticoes.

## Decisao pratica

Ao refatorar cada pagina do MVP, a responsividade sera revisada junto da funcionalidade.

Nao vamos deixar mobile/web para uma etapa isolada no fim.

## Atualizacao aplicada em 2026-05-23

Arquivos revisados nesta etapa:

- `app/page.tsx`
- `app/ouvidoria/page.tsx`
- `features/ouvidoria/DemandForm.tsx`
- `features/ouvidoria/ProtocolSearch.tsx`
- `app/peticoes/page.tsx`
- `app/peticoes/[id]/page.tsx`
- `components/CreatePetitionModal.tsx`
- `app/gestao/page.tsx`
- `features/gestao/StatusUpdater.tsx`
- `features/gestao/PetitionsAdminPanel.tsx`
- `features/gestao/MetricsDashboard.tsx`
- `components/ProfileSettingsPanel.tsx`
- `features/perfil/EditProfileForm.tsx`
- `components/TopAppBar.tsx`
- `components/BottomNavBar.tsx`
- `components/Footer.tsx`
- `components/SearchModal.tsx`
- `components/NotificationsPanel.tsx`
- `lib/constants/navigation.ts`
- `app/globals.css`

Mudancas aplicadas:

- Textos visiveis foram limpos para evitar codificacao quebrada.
- Cards principais foram reduzidos de tamanho no mobile.
- Botoes foram mantidos com altura minima consistente.
- Grids passaram a respeitar melhor mobile, tablet e desktop.
- Modal de criacao de peticao ficou mais simples, com resumo antes de publicar.
- Painel de gestao ficou mais compacto para mobile/web.
- Painel de perfil e atalhos administrativos foram limpos.
- Barra superior, busca, notificacoes, footer e navegacao mobile foram simplificados.
- Textos globais de navegacao foram corrigidos.
- Letter spacing global foi normalizado para evitar texto apertado.

Validacao:

- `npm.cmd run build` passou com sucesso.
- O build confirmou Firebase `digitalsantamaria-2ced4` e banco `(default)`.
- Busca por caracteres quebrados no MVP nao encontrou `Ã`, `Â`, `ð` ou `�`.
- Busca por caracteres quebrados nos componentes globais tambem passou.
