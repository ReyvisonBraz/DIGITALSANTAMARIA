# Saude — `/saude`

Unidades de saude, agendamento de consultas e farmacia popular.

**Dados:** Firestore real (`health_units`, `pharmacy_items`)
**Features:** `WaitTimeBadge`, `useHealthUnits()`
**Service:** `appointments.service.ts`
**Componente:** `AppointmentModal`, `HealthHistoryPanel`, `ClinicCard`

## Secoes

### Unidades de saude
- Lista de `health_units` com `ClinicCard`
- Badge de tempo de espera colorido (`WaitTimeBadge`: low/medium/high/critical)
- Modal de agendamento (`AppointmentModal`) — 4 etapas:
  1. Selecionar unidade
  2. Selecionar especialidade
  3. Escolher data/hora
  4. Confirmar

### Farmacia popular
- Lista de medicamentos (`pharmacy_items`)
- Fallback: 3 medicamentos hardcoded se colecao vazia

### Vacinas (mock)
- Dados de vacinacao ainda nao conectados ao Firestore

## Funcionalidades

- **Agendamento** — `createAppointment()` grava em `appointments`
- **Historico** — `HealthHistoryPanel` mostra consultas do usuario
- **Admin** — `HealthUnitsAdmin` gerencia unidades e agendamentos

## Colecoes

| Colecao | Proposito |
|---|---|
| `health_units` | Unidades (name, type, address, waitTime, specialties, hours) |
| `appointments` | Agendamentos (userId, unitId, specialty, date, time, status) |
| `pharmacy_items` | Medicamentos (name, category, price, pharmacyId) |

## Pontos de melhoria

- Secao de vacinas ainda nao conectada ao Firestore
- Tempo de espera e estatico (idealmente via Cloud Function simulando dados)
