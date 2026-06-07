# 🏥 Saúde: Detalhamento de UI/UX

O módulo mais complexo em termos de agendamento e dados sensíveis.

---

## 1. Dashboard de Saúde (`/saude`)

### Botão: Novo Agendamento
- **Fluxo**:
  1. Escolha da Especialidade (Clínico, Dentista, etc).
  2. Escolha da Unidade (Baseado na proximidade/CEP).
  3. Seleção de Data/Hora (Grid de horários disponíveis).

### Card: ID de Vacinação Digital
- **Visual**: QR Code centralizado.
- **Lista**: Vacinas tomadas e próximas doses (alerta visual para atrasos).

---

## 2. Modal de Agendamento (`AppointmentModal`)

### Componente: Calendário Interativo
- **Visual**: Dias com vagas em azul, dias lotados em cinza.
- **Lógica**: Sincronização em tempo real (evita double booking).

### Seção: Preparação
- Instruções automáticas baseadas na consulta (ex: "Comparecer em jejum").

---

## 3. Consulta de Medicamentos (`/saude/farmacia`)

### Barra de Busca
- Nome do medicamento ou princípio ativo.

### Resultado: Unidades com Estoque
- Lista de farmácias municipais.
- Badge: `Estoque Alto`, `Estoque Baixo` ou `Em Falta`.
- **Botão: Rota**: Abre Google Maps para a farmácia selecionada.
