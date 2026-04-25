# Planejamento Detalhado: 04. Trânsito e Mobilidade (Zeladoria em Movimento)

Este documento detalha o funcionamento, UX e arquitetura técnica do pilar de Trânsito do Civic Guardian.

## 1. Central de Monitoramento (Mapa Dinâmico)

### 1.1. Componente: Mapa de Trânsito em Tempo Real
- **Descrição**: Mapa interativo com camadas de tráfego, radares e câmeras de monitoramento.
- **Interações**:
    - **Clique em Câmera**: Abre mini-player com streaming (ou frame atualizado) da câmera de segurança.
    - **Indicadores de Radar**: Exibe velocidade máxima e se está ativo (on-line).
- **Funcionamento**: 
    - Integração com Mapbox ou Google Maps para visualização.
    - Camada de radares via `/traffic_radars`.

### 1.2. Componente: Alertas de Via (Crowdsourcing)
- **Descrição**: Notificações enviadas por outros usuários ou pela central de tráfego.
- **Ações**: "Confirmar Alerta" ou "Alerta Resolvido" (Gamificação - ganha CivicPoints).

---

## 2. Rastreamento de Ônibus (Bus Tracker)

### 2.1. Componente: "Onde está o Ônibus?"
- **Descrição**: Seleção de linha e visualização do ícone do ônibus se movendo no mapa.
- **Previsão de Chegada**: Cálculo dinâmico baseado em GPS e velocidade média do trecho.
- **Funcionamento**: 
    - Sockets ou polling de 15s na coleção `/bus_locations`.

### 2.2. Componente: Recarga de Cartão Escolar/Social
- **Descrição**: Botão de integração para recarga via PIX diretamente no app.

---

## 3. Zona Azul Digital (Estacionamento Rotativo)

### 3.1. Componente: Ativador de Vaga
- **Descrição**: Timer visual com contagem regressiva para o tempo de estacionamento.
- **Ações**: "Renovar Tempo", "Finalizar Vaga".
- **Alerta**: Push quando faltar 5 min para expirar.

---

## 4. Recurso de Multas (Defesa Prévia)

### 4.1. Componente: Portal de Infrações
- **Fluxo**:
    1. Lista de multas vinculadas ao CPF do cidadão.
    2. Botão "Recorrer": Abre formulário simplificado para envio de justificativa e anexos.
- **Funcionamento**: Integração com o sistema do DETRAN/Secretaria de Trânsito.

---

## 5. Regras de Segurança (Firestore)
- **Caminho**: `/traffic_alerts/{id}`
- **Regra**: `create`: Se autenticado e possui nível de confiança > 5 (CivicScore).
- **Caminho**: `/bus_locations/{busId}` (Apenas leitura pública).
