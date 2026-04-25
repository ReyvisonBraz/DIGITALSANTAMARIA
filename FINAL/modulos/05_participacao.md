# Módulo: Participação Cidadã (/peticoes, /votos, /eventos, /comunidade, /social)

## 1. Mapeamento de Arquivos
- **Páginas**: `/app/peticoes/page.tsx`, `/app/comunidade/page.tsx`, `/app/votos/page.tsx`.
- **Componentes Frequentes**: Botão "Assinar Agora", Post de Fórum (Comments/Like), Modal de Confirmação de Identidade, ProgressBar de Metas.

## 2. Análise Estrutural e de Interface
- **Estética e Acessibilidade**: O coração vibrante do app. Muito uso de imagens, avatares de usuários, ícones preenchidos (`lucide-react`). Engajamento social forte.
- **Microinterações**: Efeito de vibração, fogos (particles) ou confetti ao assinar uma petição bem-sucedida.

## 3. Fluxos de Funcionalidade
1. **Petições Virtuais**: Listagem, pesquisa, clique em Petição singular, verificação do usuário, clique Assinar, atualização atômica de "+1".
2. **Fóruns Civis (/comunidade)**: Fluxo Clássico (CRUD) de posts sociais de bairro.

## 4. Plano Individual de Melhorias e Integração (Backlog)
- **Firebase/Cloud**:
  - O fluxo The Atomicity Guarantee (`existsAfter`) DEVE ser usado nas petições. Uma assinatura é criada na subcoleção `petitions/{id}/signatures/{userId}` e, num Batch Write, o `signaturesCount` no doc da repetição deve ganhar incremento atômico (`increment(1)`).
- **UX/Next Steps**:
  - Compartilhamento Nativo: Injetar Web Share API (`navigator.share`) para facilitar difusão no WhatsApp.
