# Módulo: Saúde (/saude)

## 1. Mapeamento de Arquivos
- **Páginas**: `/app/saude/page.tsx`, `/app/saude/[id]/page.tsx` (se existir visualização de hospital/posto).
- **Componentes Frequentes**: Cards de Hospitais/UPAs, Barra de Tempo Espera, Modal de Agendamento, Formulário de Carteira de Vacinação.

## 2. Análise Estrutural e de Interface
- **Estética e Acessibilidade**: Interface focada no verde (`text-emerald-600`, `bg-emerald-50`). Transmite calma e higiene. Layout de grade (CSS Grid) agrupa informações complexas de forma legível.
- **Microinterações**: Os cards de unidades de saúde têm efeito hover para indicar clicabilidade (`hover:shadow-md transition-all`).

## 3. Fluxos de Funcionalidade
1. **Ver Tempo de Espera**: Um gráfico/barra ou indicador visual simplificado (Verde/Amarelo/Vermelho). Atualmente operando em UI, requer "listeners" em real-time do banco.
2. **Agendamento de Consultas**: Fluxo através de um Modal. Necessário tratar dependência de calendário complexa e bloqueios de horários concorrentes.

## 4. Plano Individual de Melhorias e Integração (Backlog)
- **Firebase/Cloud**: 
  - Mapear Firestore Collection `hospitals` e `appointments`.
  - Criar Regra Firestore impedindo que Usuário A agende em cima ou veja consultas do Usuário B (The Master Gate Rule).
- **UX/Next Steps**: 
  - Integrar API do Google Maps para ordenar as UPAs por proximidade geográfica usando `geolocation` do browser local.
  - Otimização do Modal de calendário para prevenir duplo-click na submissão de consulta.
