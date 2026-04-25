# Módulo: Segurança (/seguranca)

## 1. Mapeamento de Arquivos
- **Páginas**: `/app/seguranca/page.tsx`
- **Componentes Frequentes**: Panic Button (Alerta Imediato), Modal de Relato Anônimo, Heatmap (Mapa de Calor de Incidentes).

## 2. Análise Estrutural e de Interface
- **Estética e Acessibilidade**: Focado nas cores de alerta de emergência militar e cívica (Vermelho Rosa, Escuro). O "Botão de Pânico" deve ser sempre o maior "Target Click" da tela (Pelo menos 64x64px em mobile) para destreza sob stress.
- **Microinterações**: Botões de denúncia possuem confirmação em duplo-step para evitar falsos positivos acidentais.

## 3. Fluxos de Funcionalidade
1. **Denúncia Anônima**: Processo de form simples que deve retirar todo metadado rastreável da UI e do post.
2. **Alertas da Região**: Um ticker ou feed rolável (AlertBanner) que notifica enchentes, acidentes ou buscas na vizinhança.

## 4. Plano Individual de Melhorias e Integração (Backlog)
- **Firebase/Cloud**: 
  - A coleção `reports_security` deve ter bloqueio total de "Read" para o público. Apenas "Create" para cidadãos, e "Read/Update" para a Patrulha Cívica (`isAdmin`).
  - Lógica Atômica: Se usuário usar o Botão de Pânico, criar documento com timestamp estrito de servidor `request.time`.
- **UX/Next Steps**: 
  - Animação de pulsação CSS (Ping/Pulse) no Botão de Emergência.
  - Implementação do `navigator.geolocation.getCurrentPosition()` injetando latitude/longitude no disparo.
