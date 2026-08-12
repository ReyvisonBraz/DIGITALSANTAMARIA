# Plano de Produto — Conecta Santa Maria

> Direção de lançamento: **atendimento municipal claro, rastreável e útil**.

## 1. Decisão de produto

O Conecta Santa Maria não será lançado como um catálogo de tudo o que a Prefeitura pode fazer. No lançamento, ele é o lugar onde o morador consegue **resolver uma necessidade com a Prefeitura e acompanhar o retorno**.

**Proposta em uma frase**

> Relate um problema, faça um pedido e acompanhe a resposta da Prefeitura em um só lugar.

O diferencial não é ter muitas abas: é fechar o ciclo com foto/localização quando necessário, protocolo, status e conversa entre cidadão e equipe responsável.

## 2. Público e problema prioritário

| Público | Necessidade | Resposta do portal |
| --- | --- | --- |
| Morador com problema urbano | Informar o problema sem saber o setor responsável | Relato guiado com foto, localização e protocolo |
| Morador com pedido ou manifestação | Falar com a Prefeitura por um canal formal | Ouvidoria com categoria, confirmação e prazo |
| Pessoa que já fez contato | Saber se houve avanço sem telefonar ou ir presencialmente | Consulta por protocolo, histórico e notificações |
| Morador buscando informação confiável | Encontrar avisos relevantes da cidade | Avisos oficiais, agenda e obras em superfícies secundárias |

## 3. MVP de lançamento

### Jornadas que precisam funcionar de ponta a ponta

1. **Relatar um problema** — `/relatar`
   - Exemplos: buraco, iluminação, descarte irregular e risco urbano.
   - Diferencial: foto opcional, localização e classificação assistida.
   - Resultado: protocolo, encaminhamento e acompanhamento no histórico.

2. **Fazer um pedido** — `/ouvidoria`
   - Exemplos: pedido, reclamação, denúncia, sugestão ou elogio.
   - Resultado: protocolo, prazo informado e canal de resposta.

3. **Acompanhar um pedido** — `/ouvidoria?tab=search`
   - A pessoa informa o protocolo e vê status, detalhes e conversa.
   - O mesmo caminho aparece na área pessoal para pedidos vinculados ao login.

4. **Minha área** — `/perfil`
   - Histórico, protocolos, atividades e notificações do cidadão.

### Informação de apoio, não promessa de serviço

- `/avisos`, `/eventos` e `/obras` continuam públicos como conteúdo oficial.
- Eles ficam abaixo das jornadas de atendimento na home e não concorrem com o primeiro passo do cidadão.

## 4. Escopo adiado

As rotas abaixo permanecem no repositório, mas estão em `SUSPENDED_ROUTES`: não aparecem em menus e exibem “Em breve” se acessadas diretamente.

| Área | Motivo para adiar | Condição para reativar |
| --- | --- | --- |
| Petições | Exige política de moderação, critérios de publicação e responsáveis por respostas públicas | Política aprovada, equipe de moderação e SLA definido |
| Empregos | Precisa de rotina de curadoria de vagas, validade e suporte a candidatos | Fonte de vagas, responsável editorial e calendário de atualização |
| Comércio local | Precisa de cadastro confiável, consentimento e manutenção contínua | Processo de adesão, revisão e responsável pelo diretório |
| Saúde, educação, tributos e demais catálogos | Têm alto impacto e dependem de dados/setores integrados | Integração, dono operacional e teste com cidadãos antes da abertura |

**Regra:** código pronto não é motivo suficiente para aparecer no lançamento. Uma área só fica pública quando tem dados, responsável e expectativa de resposta real.

## 5. Arquitetura de navegação do lançamento

```text
Início
├── Relatar problema
├── Fazer pedido
├── Acompanhar pedido
├── Minha área
└── Informações oficiais
    ├── Avisos
    ├── Eventos
    └── Obras
```

Na barra mobile, os cinco destinos são: **Início, Relatar, Pedir, Acompanhar e Minha área**. Cada um tem uma função distinta.

## 6. Linguagem de produto

| Evitar como primeiro termo | Preferir | Quando usar o termo técnico |
| --- | --- | --- |
| Protocolo | Acompanhar meu pedido | No número gerado e na tela de consulta |
| Solicitação | Fazer um pedido | Em formulários e comunicações formais, quando necessário |
| Painel do Cidadão | Minha área | Em contexto institucional ou de conta |
| Manifestação | Pedido, reclamação, denúncia, sugestão ou elogio | Em textos jurídicos e de ouvidoria |

## 7. Métricas de sucesso

Instrumentar antes de abrir o portal ao público e acompanhar semanalmente:

| Métrica | Meta inicial | Como interpretar |
| --- | --- | --- |
| Compreensão da home | 80% das pessoas explicam a proposta após 5 segundos | Mede clareza da primeira dobra |
| Início de fluxo correto | 85% escolhem “Relatar” vs. “Fazer pedido” corretamente em teste | Mede orientação, não volume |
| Conclusão de relato/pedido | 60% ou mais dos formulários iniciados são enviados | Investigar campos que causam abandono |
| Consulta bem-sucedida | 90% das buscas com protocolo válido retornam o item | Mede confiança no acompanhamento |
| Tempo até primeira ação | Menos de 30 segundos | Mede se a home está ajudando, não distraindo |
| Tempo de primeira resposta | SLA definido por setor | Métrica operacional obrigatória antes de ampliar canais |

Eventos mínimos: `home_action_selected`, `report_started`, `report_submitted`, `request_started`, `request_submitted`, `protocol_search_started`, `protocol_search_found` e `protocol_search_not_found`. Nunca registrar texto do cidadão, foto, localização exata ou número completo de protocolo em analytics.

## 8. Roteiro de entrega

### Agora — estabilizar o MVP

- Validar as quatro jornadas com moradores e servidores.
- Conferir textos, estados vazios, erros e mensagens de prazo.
- Definir quem responde cada categoria e o SLA real.
- Publicar somente os módulos com dados ativos.

### Em seguida — confiança e operação

- Mostrar prazos e responsável/setor quando a informação existir.
- Criar triagem operacional no painel de gestão.
- Implantar métricas de funil sem coletar conteúdo sensível.
- Rodar testes de usabilidade mensais com 5–8 moradores.

### Depois — ampliar com evidência

- Reativar um módulo por vez, a partir de demanda medida e capacidade operacional.
- Petições só depois de política pública de moderação.
- Catálogos setoriais só depois de integração de dados e dono operacional.

## 9. Critério de aceite para qualquer nova área

Uma funcionalidade nova só entra no menu se responder “sim” a todos os itens:

- Resolve uma necessidade clara e frequente do morador?
- Há dados confiáveis para mantê-la atualizada?
- Existe um setor responsável por responder ou corrigir algo?
- A pessoa entende o resultado esperado antes de começar?
- Há estado vazio, erro, acessibilidade e caminho de volta?
- Há uma métrica que mostrará se ela realmente ajuda?
