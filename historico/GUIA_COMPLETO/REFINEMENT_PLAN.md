# Plano de Refinamento: Civic Guardian

Este documento detalha as etapas subsequentes para otimizar, refinar e integrar completamente o portal Civic Guardian. A adaptação da interface visual foi concluída com sucesso nas iterações anteriores; agora, o foco é a interatividade, o roteamento correto e o gerenciamento de estado (UX flow).

Siga estas tarefas sequencialmente, validando e realizando *lint/build* após cada macro-fase.

## Fase 1: Fundações Interativas (A "Casa")

**Objetivo:** Criar componentes universais para não repetir lógica e unificar a experiência.

1. **Ajuste Fino de Roteamento:**
   * Garantir que `TopAppBar.tsx` e `BottomNavBar.tsx` apontem para TODAS as rotas ativas (adicionar `/empregos`, `/comunidade`, `/comercio`). Considere um menu dropdown ou offcanvas para mobile se houver muitos links.
   * Na `app/page.tsx`, ajustar o botão principal ("Começar Agora" / "Ver todos") para não usar apenas `href="#"`.

2. **Criação do \`<Modal>\` Universal (`/components/ui/Modal.tsx`)**
   * *Para quê?* Termos de aceite (Comunidade), confirmações de petição, detalhes rápidos de vagas.
   * *Features:* Fundo com overlay (`bg-black/50`), botão de fechar (`X`), suporte a filhos dinâmicos (`children`), usando foco invisível no fundo pra fechar. Animações com `motion`.

3. **Criação do \`<SidePanel>\` Universal (`/components/ui/SidePanel.tsx`)**
   * *Para quê?* Exibir detalhes ricos ao clicar no Card de um Comércio, Vaga de Emprego ou Ambulatório.
   * *Features:* Deslizar da direita (`translateX(100%)` a `0`), fundo embaçado, ocupando toda a altura.

4. **Sistema de Toast (Notificações Rápidas) (`/lib/toast.ts` + `<ToastContainer>`)**
   * Feedbacks como "Agendamento confirmado!", "Alerta enviado".
   * Pode ser uma implementação simples customizada em cima do Tailwind num Provider.

---

## Fase 2: Otimizando o Engajamento (Relatar & Petições)

**Alvo:** `app/relatar/page.tsx` e `app/peticoes/page.tsx`

1. **O Multi-Step do Relatar (`/relatar`)**
   * Dividir a tela atual (um formulário longo) em 3 etapas com botões de "Próximo":
      * Passo 1: Informações Básicas (O que é? Categoria)
      * Passo 2: Localização (Mostrar um mapa simulado / Endereço)
      * Passo 3: Midia (Upload de Foto simulado)
   * Criar a Tela/Modal de Sucesso simulando o protocolo gerado com opção: "Ver meus relatos" -> Redirecionar para Dashboard (`/perfil`).

2. **A "Voz do Bairro" em Ação (`/peticoes`)**
   * Transformar os filtros no topo (`Recentes`, `Populares`, `Map_Pin`) em estados do React filtrando o array.
   * Clicar no botão "Ver Detalhes" deve abrir o `<SidePanel>` com estatísticas completas, uma barra de progresso do objetivo (ex: 800/1000) e os comentários.
   * O botão "Apoiar" nas petições (dentro ou fora) abre o `<Modal>` pedindo confirmação (`Vocë confirma seu apoio com os dados CPF ***...?`). Ao aceitar, lança um *Toast* e soma +1 localmente no array.

---

## Fase 3: Economia e Saúde (Descoberta Local)

**Alvo:** `app/comercio/page.tsx` e `app/saude/page.tsx`

1. **Agendamento Dinâmico (`/saude`)**
   * Refatorar o `<AppointmentModal>` que construímos para usar um fluxo multi-step interno: 
     1. Seçāo "Especialidade". 
     2. Seçāo "Data e Hora" (grid de botões pequenos estilo Calendly).
     3. Select: "Confirmar Agendamento".
   * Adicionar interatividade no "Próximos Agendamentos". Botão "Cancelar Agendamento" abre o `<Modal>` universal perguntando "Tem certeza?". Ao aceitar -> *Toast* -> Ocultar item da tela.

2. **O Mapa e Lista de Comércio (`/comercio`)**
   * Conectar a seleção da Categoria (`Restaurantes`, `Farmácias`) para que a lista na esqueda reflita perfeitamente.
   * Clicar nos marcadores no mapa (pins simulados customizados) deve dar scroll para o Card correspondente ou abrir o `<SidePanel>` "Loja em Foco".
   * No `<SidePanel> Loja`: Colocar "Promoção da Semana", "Horário de Funcionamento" e um botão "Como Chegar" que jogue um Toast e finja rota no mapa.

---

## Fase 4: Comunidade e Empregos (Integração Social)

**Alvo:** `app/empregos/page.tsx` e `app/comunidade/page.tsx`

1. **Vagas de Emprego Dinâmicas (`/empregos`)**
   * Os Checkboxes criados devem atualizar os cards (estado React). Se todos vazios, mostrar tela vazia legal (Já tem algo assim formatado).
   * Clicar em "Candidatar-se" numa vaga oficial -> Abrir `<Modal>` "Envio Rápido pelo Perfil Cidadão" -> Botão Submeter -> *Toast* de sucesso e botão muda para "Candidatura Enviada (desabilitado)".

2. **Comunidade Viva (`/comunidade`)**
   * O fluxo central é o botão "Entrar no Grupo" (ícone "open_in_new"). Ele **não deve** ser um redirecionamento direto (simulando a vida real isso é spam).
   * Fluxo ao clicar: Abre `<Modal>` "Diretrizes de Convivência" específico do grupo -> Leia a lista -> Botão "Concordo, entrar agora".
   * Clicar no Bloco "Sugerir um grupo": Abrir Modal com form rápido -> Sucesso -> Toast: "Enviado a moderação".

---

## Fase 5: Dashboard Cidadão (Meu Perfil) & Votos

1. **Revisar Consultas Públicas (`/votos`)**
   * Garantir que a votação aconteça na interface: Os cards (ex: "Revitalização da Praça") com opção de "APROVO" / "REPROVO". 
   * Preencher uma barra de porcentagem ao clicar, usando animação.

2. **Criação da Rota de Perfil do Cidadão (`/perfil`)**
   * *O Cidadão Logado:* Onde vão as coisas que ele cria? Ao clicar na foto (navbar), ir para `/perfil`.
   * Criar layout de Dashboard pessoal simples com Tabs (abas): "Meus Protocolos", "Minhas Consultas", "Petições Apoiadas".
   * Mostrar itens simulados nessas listas resgatando os mockups das telas correspondentes.

---

**Nota ao Dev Agent:** Siga esta ordem de execução, marcando os milestones ou conversando com o usuário para a verificação em cada fase. Procure isolar os arquivos CSS dentro dos arquivos do Tailwind, não criar `.module.css`. A UI central é baseada fortemente no `lucide-react` para ícones e paleta de cores importada do Tailwind Root. Mantenha os comentários no código em PT-BR para facilitar a manutenção futura.
