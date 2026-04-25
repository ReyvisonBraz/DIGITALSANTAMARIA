# Módulo: Economia e Tributos (/tributos, /comercio, /empregos)

## 1. Mapeamento de Arquivos
- **Páginas**: `/app/tributos/page.tsx`, `/app/comercio/page.tsx`, `/app/empregos/page.tsx`.
- **Componentes Frequentes**: Tabelas Financeiras, Visualizador de Faturas (Receipts), Mural de Vagas em formato de Grid, Modal de Upload de CV.

## 2. Análise Estrutural e de Interface
- **Estética e Acessibilidade**: `Tributos` foca em minimalismo branco e azul corporativo; as dividas devem ser informadas de maneira clara porém sem causar hostilidade. `Empregos` e `Comercio` usam estilo "Marketplace", com filtros laterais e lista central.
- **Microinterações**: Copiar código PIX no painel de tributos inclui "Toast" imediato ("Código Copiado!").

## 3. Fluxos de Funcionalidade
1. **Emissão de IPTU/Guias**: Sistema tabulado demonstrando histórico de adimplência.
2. **Match de Empregos**: Lista de cards de vagas. Fluxo "1-Click Apply" aproveitando os dados do Firebase Auth de quem está logado.

## 4. Plano Individual de Melhorias e Integração (Backlog)
- **Firebase/Cloud**:
  - `Tributos`: Leitura blindada. Coleção de tributos atrelada como subcoleção de `users/{userId}/tributos`. Apenas a própria Prefeitura pode `Write`.
  - `Empregos`: Criação de index com arrays categorizando a vaga.
- **UX/Next Steps**:
  - Integração Webhook com gateways para constar "Pago" em tempo real no dashboard quando o PIX for verificado.
  - Adicionar esqueletos de carregamento (Skeleton Loaders) nas tabelas, pois chamadas de pagamento costumam ser lentas.
