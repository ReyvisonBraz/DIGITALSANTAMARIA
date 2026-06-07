# Planejamento Detalhado: 11. Assistência Social (Zeladoria Humana)

Este documento detalha o funcionamento, UX e arquitetura técnica do pilar de Assistência Social do Civic Guardian.

## 1. Cadastro Único (CadÚnico) Digital

### 1.1. Componente: Status do Benefatário
- **Descrição**: Visualize se seu CadÚnico está atualizado ou se precisa de revisão (biometria/documentação).
- **Notificação**: Alertas automáticos 30 dias antes do vencimento da atualização cadastral.
- **Funcionamento**: 
    - Leitura da coleção `/social_profiles/{userId}` integrada com dados do Governo Federal (simulado).

---

## 2. Rede de Apoio CRAS/CREAS

### 2.1. Componente: Agendamento de Atendimento Social
- **Fluxo**:
    1. Usuário seleciona o motivo (Bolsa Família, Auxílio Gás, Atendimento Psicológico).
    2. Identifica o CRAS de referência baseado no endereço.
    3. Escolhe data e hora.
- **Destaque**: Histórico de atendimentos realizados.

---

## 3. Habitação Popular

### 3.1. Componente: Fila da Habitação
- **Descrição**: Acompanhamento transparente do sorteio ou ordem de prioridade para programas habitacionais municipais.
- **Documentação**: Upload de documentos socioeconômicos para pontuação no programa.

---

## 4. Solidariedade Digital

### 4.1. Componente: Banco de Doações
- **Descrição**: Conexão entre o cidadão que quer doar (Móveis, Roupas, Alimentos) e o Fundo Social de Solidariedade.
- **Ação**: "Solicitar Coleta de Doação": A prefeitura busca itens grandes em casa.

---

## 5. Regras de Segurança (Firestore)
- **Caminho**: `/social_profiles/{id}`
- **Regra**: `read`: Apenas o `ownerId` ou Assistente Social (Admin). PII EXTREMAMENTE PROTEGIDA.
- **Caminho**: `/social_appointments/{id}` 
- **Regra**: `create`: Se autenticado. `read`: User ou Admin.
