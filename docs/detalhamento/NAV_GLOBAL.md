# 📍 Menu Global e Componentes Transversais

Este documento detalha o funcionamento dos elementos que aparecem em múltiplas telas ou que servem de base para o sistema.

---

## 1. TopAppBar (Barra Superior)
- **ID**: `global-top-bar`
- **Botão: Menu Lateral (Sanduíche)**:
  - **Ação**: Abre gaveta com links rápidos.
  - **Visual**: Badge de notificação caso existam alertas não lidos.
- **Botão: Notificações (Sino)**:
  - **Função**: Abre o `NotificationsPanel`.
  - **Lógica**: Agrupa avisos de "Status Alterado" (Ouvidoria) e "Nova Votação".
- **Botão: Pesquisa (Lupa)**:
  - **Função**: Abre o `SearchModal`.
  - **Ação**: Busca global por Protocolos, Petições e Órgãos de Saúde.

## 2. BottomNavBar (Menu Móvel)
- **ID**: `global-bottom-nav`
- **Item: Início**: Reset da navegação.
- **Item: Serviços**: Grid de 12 ícones.
- **Item: Ouvidoria**: Acesso direto ao formulário/busca.
- **Item: Perfil**: Dados do usuário e ID Digital.

## 3. Sidebar de Gestão (Admin Only)
- **Acesso**: Apenas para `role === 'admin'`.
- **Botão: Dashboard**: Gráficos de eficiência.
- **Botão: Fila de Espera**: Lista de protocolos pendentes.
- **Botão: Configurações**: Gestão de cargos (quem pode responder o quê).

---

## 4. Modais Globais

### SearchModal
- **Input Principal**: Texto.
- **Filtros (Chips)**: Todas, Protocolos, Petições, Saúde.
- **Destaque**: Resultados recentes do usuário aparecem primeiro.

### NotificationsPanel
- **Lista de Itens**:
  - `Tipo: Alerta`: Vermelho (ex: enchente).
  - `Tipo: Status`: Azul (ex: seu protocolo avançou).
  - `Tipo: Social`: Verde (ex: petição que você assinou venceu).
- **Ação**: Clicar remove o badge e redireciona para a tela do item.
