# Planejamento Detalhado: 08. Cultura e Lazer (Zeladoria Criativa)

Este documento detalha o funcionamento, UX e arquitetura técnica do pilar de Cultura do Civic Guardian.

## 1. Calendário Central de Eventos

### 1.1. Componente: Agenda Interativa
- **Descrição**: Timeline visual de eventos municipais e parceiros.
- **Interações**:
    - **Filtrar por Interesse**: Música, Teatro, Esportes, Workshop.
    - **Confirmar Presença**: Gera um lembrete (Push Notification) 2h antes do evento.
- **Funcionamento**: 
    - Coleção `/events`. Cada evento possui `geo` e `attendeesCount`.

### 1.2. Componente: Check-in Geo-localizado
- **Descrição**: Botão que só ativa quando o usuário está no local do evento.
- **Gamificação**: Ganha medalhas (badges) de "Cidadão Participativo" que dão prioridade em editais futuros.

---

## 2. Reserva de Espaços Públicos

### 2.1. Componente: Sistema de Reservas Digital
- **Descrição**: Reserva de auditórios, quadras poliesportivas e centros culturais.
- **Fluxo**:
    1. Escolha do espaço.
    2. Seleção de horário (Grid de ocupação em tempo real).
    3. Justificativa de uso (Documento PDF).
    4. Aprovação da Secretaria.
- **Funcionamento**: 
    - Coleção `/space_reservations`.

---

## 3. Editais de Fomento à Cultura

### 3.1. Componente: Portal de Editais (Lei Aldir Blanc / Paulo Gustavo)
- **Descrição**: Listagem de verbas disponíveis para artistas locais.
- **Ação**: "Inscrever Projeto": Upload de documentos e plano de trabalho.
- **Transparência**: Lista de projetos aprovados e valores destinados.

---

## 4. Mapa do Lazer Urbano

### 4.1. Componente: Explorar Equipamentos Públicos
- **Descrição**: Mapa com Museus, Bibliotecas, WiFi Livre e Parques.
- **Destaque**: "O que fazer hoje de graça?" (Lista automática de eventos free).

---

## 5. Regras de Segurança (Firestore)
- **Caminho**: `/events/{id}` (Leitura pública).
- **Caminho**: `/space_reservations/{id}` 
- **Regra**: `create`: Se autenticado. `read`: Dono da reserva ou Admin.
- **Caminho**: `/cultural_projects/{id}` (Público após homologação).
