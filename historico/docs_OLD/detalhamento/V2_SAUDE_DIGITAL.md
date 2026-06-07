# Planejamento Detalhado: 01. Saúde Digital (Zeladoria de Vida)

Este documento detalha o funcionamento, UX e arquitetura técnica do pilar de Saúde do Civic Guardian.

## 1. Dashboard de Saúde (Visão Geral)

### 1.1. Componente: Resumo de Atendimento (KPIs)
- **Descrição**: Faixa superior com indicadores rápidos para o cidadão.
- **Botões/Interações**:
    - **Botão "Agendar Consulta"**: Abre o `AppointmentModal`.
    - **Indicador "Próximo Compromisso"**: Clique redireciona para o detalhe do agendamento.
- **Funcionamento**: 
    - Busca via Firestore na coleção `/health_appointments` onde `userId == auth.uid` e `date >= today()`.
    - Ordenado por data ascendente.

### 1.2. Componente: Status de Espera (Pronto Atendimento)
- **Descrição**: Cards dinâmicos das UPAs e Postos com tempo de espera estimado.
- **Sub-Componente: `ClinicCard`**:
    - **Elemento: Badge de Status**: Verde (Normal), Amarelo (Aumentado), Vermelho (Critico).
    - **Elemento: Contador de Pessoas**: "22 pessoas em espera".
    - **Ação "Ver Mapa"**: Abre o Google Maps com as coordenadas da unidade.
- **Funcionamento**:
    - Atualização em tempo real (onSnapshot) da coleção `/health_units`.
    - Cálculo de espera: Média aritmética do tempo de triagem dos últimos 10 protocolos finalizados.

---

## 2. Fluxo de Agendamento (AppointmentModal)

### 2.1. Etapa 1: Seleção de Especialidade
- **Componente**: Lista de chips ou cards com ícones (`Stethoscope`, `Bones`, etc).
- **Validação**: Verifica se a especialidade requer encaminhamento prévio. Se sim, e não houver encaminhamento no perfil, exibe alerta "Encaminhamento Necessário".

### 2.2. Etapa 2: Seleção de Unidade e Data
- **Componente**: Calendário interativo.
- **Funcionamento**: 
    - Desabilita datas sem vagas (busca em `/health_slots`).
    - Exibe distância da unidade baseada na Geolocation do usuário (se permitida).

### 2.3. Etapa 3: Confirmação e Protocolo
- **Componente**: Card de resumo com efeito tactile.
- **Botão "Confirmar"**: 
    - Executa `runTransaction` no Firestore para garantir que o slot não foi ocupado.
    - Gera ID único de protocolo (ex: `H-2026-X83B`).
    - Dispara notificação push/in-app.

---

## 3. ID de Vacinação Digital (Digital Passport)

### 3.1. Componente: Card QR Code
- **Descrição**: Card imitando o documento físico com QR Code central.
- **Elemento: QR Code**: 
    - Gera string assinada contendo `userId` e `timestamp`.
    - Permite que profissionais de saúde validem a autenticidade via app admin.
- **Funcionamento**: 
    - Integração (mock/simulada) com a API do Ministério da Saúde.
    - Armazenamento local (cache) para funcionamento offline.

### 3.2. Lista de Doses e Alertas
- **Componente**: Timeline de vacinas.
- **Ação "Agendar Dose"**: Direciona para o `AppointmentModal` com a categoria "Vacinação" pré-selecionada.

---

## 4. Busca em Farmácia Popular (Inventory Tracking)

### 4.1. Componente: Search Bar Medicamentos
- **Descrição**: Input com auto-complete baseado em estoque real.
- **Filtros**: "Disponível na Unidade Mais Próxima", "Uso Contínuo".

### 4.2. Componente: Resultado de Estoque
- **Elemento: Indicador de Quantidade**: "Estoque: Baixo" ou "Em Falta".
- **Ação "Me avise quando chegar"**: Cria um documento em `/inventory_alerts`.

---

## 5. Histórico de Saúde (EHR Cidadão)

### 5.1. Componente: Lista de Prontuários (Resumo)
- **Descrição**: Visualização cronológica de consultas e exames passados.
- **Botão "Baixar Comprovante"**: Gera PDF dinâmico com assinatura digital do Civic Guardian.
- **Visualização de Exames**: Preview de resultados laboratoriais (se PDF disponível).

---

## 6. Regras de Segurança (Firestore)
- **Caminho**: `/health_appointments/{id}`
- **Regra**: `read`: apenas se `resource.data.userId == request.auth.uid`.
- **Regra**: `write`: `isValidAppointment(incoming())` + validação de mutabilidade (data não pode ser no passado).
