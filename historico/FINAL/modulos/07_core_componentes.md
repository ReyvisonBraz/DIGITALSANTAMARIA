# Módulo: Core da Aplicação e Componentes (/components, layout, config)

## 1. Mapeamento de Arquivos
- **Páginas Globais/Wrappers**: `/app/layout.tsx`, `/app/globals.css`.
- **Componentes Frequentes Globais**: Navbar superior, SideNavigation (Sidebar Esquerda para Desktop, Drawer para Mobile), ToastProvider, SearchModal Omnichanel.

## 2. Análise Estrutural e de Interface
- **Estética e Acessibilidade**: Fontes (`Inter` primária, peso claro) carregadas nativamente sem render block. Cores centralizadas via classes utilitárias do Tailwind.
- **Microinterações Globais**: Animação de `Page Transitions` suaves entre seções usando framer-motion/motion.

## 3. Fluxos de Funcionalidade
1. **O Modal de Busca (`Ctrl+K`)**: Intercepta comandos de todo canto do aplicativo. Ele executa a função vitalícia de mapeador tático.
2. **Autenticação Passiva**: Sistema retém a sessão do munícipe no token HTTP, evitando re-logins frustrantes.

## 4. Plano Individual de Melhorias e Integração (Backlog)
- **Arquitetura/Código**:
  - Eliminar eventuais Server Components (arquivos `.tsx`) que estajam renderizando estados (`useState`) erradamente sem a tag `'use client'`. Garantir máxima limpeza e isolamento folha-a-folha (leaf component concept).
- **UX/Next Steps**:
  - Redutor de Bandeira de Bugs (Error Boundary): Se a API cair, envelopar a aplicação inteira caindo graciosa para um modal customizado: "A prefeitura tá em manutenção técnica", ao invés das temidas telas de erro cruas de Next.js.
