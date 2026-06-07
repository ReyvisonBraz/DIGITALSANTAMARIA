# Seguranca — `/seguranca`

Zonas seguras e alertas de emergencia.

**Dados:** Firestore real (`safety_zones`, `emergency_alerts`)
**Service:** `emergency.service.ts`
**Padrao:** Catalogo (usa `useContent<SafetyZone>`)

## Funcionalidades

- **Mapa de zonas seguras** — `safety_zones` com nivel de risco
- **Botao SOS** — vibracao de 3s + criacao de alerta (`createEmergencyAlert`)
- **Protocolo SEG-...** gerado automaticamente

## Admin

- `GenericCatalogAdmin` para `safety_zones`
- `EmergencyAlertsAdmin` para fila de alertas

## Colecoes

| Colecao | Proposito |
|---|---|
| `safety_zones` | Zonas (name, riskLevel, location, status) |
| `emergency_alerts` | Alertas (userId, type, location, status, protocol) |
