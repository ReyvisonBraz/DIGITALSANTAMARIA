# Mapa Oficial de Rotas

Data: 2026-05-22

Este mapa organiza as rotas existentes conforme o plano de reconstrucao.

## 1. Rotas do MVP

Estas rotas devem funcionar primeiro de verdade.

| Rota | Papel | Publica/logada | Status desejado |
|---|---|---|---|
| `/` | Home publica/portal da cidade | Publica | Refatorar para portal publico |
| `/perfil` | Painel do Cidadao inicial | Logada | Pode virar `/painel` depois |
| `/ouvidoria` | Abrir solicitacao/manifestacao e consultar protocolo | Publica ou semi-logada | Definir com `/relatar` |
| `/relatar` | Atalho legado para solicitacao | Redireciona | Redirecionar para `/ouvidoria` |
| `/gestao` | Painel administrativo | Logada/admin | Trocar qualquer regra hardcoded por role |
| `/peticoes` | Lista/criacao de peticoes | Publica + acoes logadas | Manter no MVP |
| `/peticoes/[id]` | Detalhe e assinatura de peticao | Publica + assinatura logada | Manter no MVP |

## 2. APIs do MVP

| Rota | Papel | Status desejado |
|---|---|---|
| `/api/classify-report` | Classificar relato com Gemini | Opcional no MVP |
| `/api/suggest-response` | Sugerir resposta administrativa com Gemini | Opcional no MVP |
| `/api/logs` | Receber logs | Validar necessidade |

## 3. Rotas institucionais

Estas podem permanecer publicas e simples.

| Rota | Papel | Status desejado |
|---|---|---|
| `/sobre` | Sobre o portal | Publica/informativa |
| `/legal` | Termos e privacidade | Publica/informativa |
| `/servicos` | Diretorio de servicos | Publica, talvez simplificada |

## 4. Rotas secundarias para fase posterior

Estas rotas continuam existindo, mas nao comandam a primeira entrega.

| Rota | Modulo | Acao sugerida |
|---|---|---|
| `/saude` | Saude | Fase 2 |
| `/educacao` | Educacao | Fase 2 |
| `/educacao/matricula` | Matricula | Fase 2 |
| `/empregos` | Empregos | Fase 2 |
| `/tributos` | Tributos | Fase futura/informativa |
| `/obras` | Obras | Fase futura/informativa |
| `/obras/[id]` | Detalhe de obra | Fase futura/informativa |
| `/eventos` | Eventos | Fase futura/informativa |
| `/eventos/[id]` | Detalhe de evento | Fase futura/informativa |
| `/comercio` | Comercio local | Fase futura/informativa |
| `/comunidade` | Comunidade | Fase futura/informativa |
| `/social` | Social | Fase futura/informativa |
| `/meio-ambiente` | Meio ambiente | Fase futura/informativa |
| `/seguranca` | Seguranca | Fase futura/informativa |
| `/transito` | Transito | Fase futura/informativa |
| `/votos` | Votacoes | Fase futura/informativa |
| `/avisos` | Avisos | Pode entrar como conteudo publico depois |

## 5. Decisoes pendentes

### `/perfil` ou `/painel`

O Painel do Cidadao pode usar a rota atual `/perfil`, mas conceitualmente talvez seja melhor criar `/painel` e deixar `/perfil` apenas para edicao de dados.

Opcao recomendada:

- MVP: usar `/perfil` como painel simples para evitar criar rota nova agora.
- Depois: separar `/painel` e `/perfil`.

### `/ouvidoria` e `/relatar`

Existem duas possibilidades:

1. Unificar tudo em `/ouvidoria`.
2. Manter `/ouvidoria` para manifestacoes gerais e `/relatar` para problemas urbanos.

Opcao recomendada para MVP:

- A Home chama "Abrir solicitacao" e leva para `/ouvidoria`.
- Dentro de `/ouvidoria`, o usuario escolhe tipo/categoria, inclusive "Problema urbano".
- `/relatar` vira atalho legado e redireciona para `/ouvidoria`.

## 6. Implicacao para o menu

Menu principal do MVP deve destacar:

- Inicio.
- Abrir solicitacao.
- Consultar protocolo.
- Peticoes.
- Painel do Cidadao.

Os outros modulos podem ficar em "Servicos" ou fora do destaque inicial.

## 7. Decisao aplicada

Arquivo ajustado:

- `lib/constants/navigation.ts`

Alteracoes:

- Navegacao mobile agora prioriza o MVP:
  - Inicio.
  - Solicitar.
  - Protocolo.
  - Peticoes.
  - Painel.
- Links de rodape foram reduzidos para itens essenciais.
- Explorer continua oferecendo acesso aos modulos secundarios, mas com o MVP no topo.
- Home/dashboard modules agora priorizam:
  - Abrir solicitacao.
  - Consultar protocolo.
  - Peticoes.
  - Painel do Cidadao.

## 8. Atualizacao aplicada em 2026-05-23

- `app/relatar/page.tsx` agora redireciona para `/ouvidoria`.
- Isso evita dois fluxos diferentes de protocolo (`reports` e `demands`) competindo no MVP.
- A entrada oficial para abrir ou consultar solicitacao passa a ser `/ouvidoria`.
