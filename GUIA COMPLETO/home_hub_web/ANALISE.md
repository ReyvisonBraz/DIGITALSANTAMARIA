# Análise de Design: Home Hub (Página Inicial)

## Visão Geral
O Home Hub é o ponto de entrada do cidadão. Ele deve transmitir autoridade e facilidade de acesso.

## Aplicação do DESIGN.md
- **Header:** Utiliza o Azul Cívico (#005aab) com altura de 64px. Logo utiliza `Public Sans` Black para peso institucional.
- **Alert Banner:** Implementado no topo com a cor de erro (#ba1a1a), seguindo o princípio de "Urgent Alert".
- **Hero:** Imagem panorâmica da cidade com gradiente sobreposto para garantir legibilidade do título em `Zilla Slab`.
- **Grids de Serviço:** Utiliza o padrão de 5 colunas no desktop. Cards têm borda inferior de 2px que engrossa para 4px no hover, conforme a diretriz de "Tactile Boundaries".
- **Ícones:** Material Symbols Outlined em 36px/40px dentro de círculos `primary-fixed`.

## Elementos Chave para Adaptação
1. **Componente Reutilizável:** `ServiceCard` com props para ícone, título e descrição.
2. **Sistema de Temas:** Garantir que as variáveis de cor (surface-container, on-surface, etc.) estejam no `globals.css` ou `tailwind.config`.
3. **Responsividade:** O grid deve colapsar de 5 colunas para 2 ou 1 em dispositivos móveis.
