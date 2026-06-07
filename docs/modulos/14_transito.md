# Transito — `/transito`

Alertas e informacoes de transito e mobilidade.

**Dados:** Firestore real (`traffic_alerts`)
**Padrao:** Catalogo (usa `useContent<TrafficAlert>`)

## Dados exibidos

- Tipo: acidente, obra, desvio, congestionamento
- Severidade: baixa, media, alta, critica
- Localizacao e validade (`validUntil`)

## Admin

`TrafficAdmin` — CRUD com tipo, severidade, localizacao e validade.
