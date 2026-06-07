# Módulo: Atendimento Direto (/ouvidoria, /relatar)

## 1. Mapeamento de Arquivos
- **Páginas**: `/app/ouvidoria/page.tsx`, `/app/relatar/page.tsx`.
- **Componentes Frequentes**: Formulário de Multi-Step (Assistente/Wizard), Dropzone (Input de Arquivo In-Browser), Selectors baseados em Categorias de Problemas.

## 2. Análise Estrutural e de Interface
- **Estética e Acessibilidade**: Uso intensivo de validadores (bordas vermelhas se faltar campo, `Focus` ring em campos obrigatórios para leitores de tela).
- **Microinterações**: Ao selecionar a Categoria (ex: Buraco), o formulário dinamicamente aparece uma opção para "Enviar Foto" usando AnimatePresence.

## 3. Fluxos de Funcionalidade
1. **Submissão de Relato Tático**: Usuário escolhe onde e o quê -> Tira Foto -> Confirma Localização via Mapa ou Texto -> Submete.
2. **Acompanhamento (Ticketing)**: Visão de Timeline do ticket na aba do Perfil do usuário.

## 4. Plano Individual de Melhorias e Integração (Backlog)
- **Firebase/Cloud**:
  - Upload pesado: Imagens devem ir para o Firebase Storage gerar um token de leitura seguro. Esse path vai atrelado ao registro do problema urbano no Firestore.
- **UX/Next Steps**:
  - Offline First (PWA capability): Se o usuário tentar enviar relato no meio da rodovia sem sinal, salvar no `IndexedDB` temporariamente e enviar via Background Sync quando o 4G ligar.
