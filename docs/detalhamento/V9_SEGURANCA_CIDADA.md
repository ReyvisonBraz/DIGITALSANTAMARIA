# Planejamento Detalhado: 09. Segurança Pública (Zeladoria Protetiva)

Este documento detalha o funcionamento, UX e arquitetura técnica do pilar de Segurança do Civic Guardian.

## 1. Botão do Pânico (SOS Município)

### 1.1. Componente: SOS de Ata Impacto
- **Descrição**: Botão crítico para emergências de segurança (Assalto, Agressão, Violência Doméstica).
- **UX**: 
    - Ativação por pressão longa (3 segundos).
    - Feedback háptico (vibração contínua).
    - Ativa microfone do dispositivo (Opcional, com permissão).
- **Ação**: Envia localização GPS em tempo real para a viatura da Guarda Civil Municipal (GCM) mais próxima.
- **Funcionamento**: 
    - WebSocket ou integrador de despacho (vias `/emergency_alerts`).

---

## 2. Mapa de Colaboração Cidadã

### 2.1. Componente: Relato de Atividade Suspeita
- **Fluxo**:
    1. Usuário seleciona ponto no mapa.
    2. Escolhe ícone (Iluminação Precária, Vandalismo, Atividade Suspeita).
    3. Notifica a vizinhança num raio de 500m via Push.
- **Destaque**: Não substitui o 190, mas auxilia no patrulhamento preventivo da GCM.

---

## 3. Câmeras do Bairro (Muralha Digital)

### 3.1. Componente: Acesso a Câmeras Públicas
- **Descrição**: Visualização de câmeras instaladas em pontos estratégicos (Parques, Semáforos).
- **Transparência**: O cidadão pode ver o que a central de monitoramento vê, promovendo confiança.

---

## 4. Dicas e Alertas Regionalizados

### 4.1. Componente: Feed de Segurança
- **Descrição**: Alertas sobre golpes corriqueiros na região ou avisos de patrulhamento reforçado.

---

## 5. Regras de Segurança (Firestore)
- **Caminho**: `/emergency_alerts/{id}`
- **Regra**: `create`: Se autenticado e verificado. `read`: GCM e User (vítima).
- **Caminho**: `/neighborhood_alerts/{id}` (Público nas proximidades).
