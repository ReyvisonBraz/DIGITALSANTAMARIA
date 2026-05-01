# Checklist de Prevenção para Novas Features

Use este checklist ao implementar qualquer nova funcionalidade no Digital Santa Maria.

## Antes de Escrever Código

- [ ] Entendi a estrutura de pastas e onde a nova feature se encaixa?
- [ ] Verifiquei se já existe um componente similar que posso reutilizar?
- [ ] Verifiquei se a feature precisa de novos tipos/interface em `firebase-blueprint.json`?
- [ ] A feature precisa de novas regras no Firestore (`firestore.rules`)?

## Durante a Implementação

### Logging
- [ ] Adicionei `createLogger('MeuComponente')` no topo do arquivo?
- [ ] Logei eventos importantes (submit, erro, navegação)?
- [ ] Usei `log.time()` para operações assíncronas que podem ser lentas?
- [ ] Evitei `console.log/error` direto?

### Tratamento de Erros
- [ ] Adicionei Error Boundary para esta seção?
- [ ] Operações Firebase estão em try/catch com mensagem amigável?
- [ ] Erros são logados com contexto suficiente para debug?
- [ ] A UI mostra feedback claro ao usuário em caso de erro?

### Estado e Renderização
- [ ] Evitei `Math.random()`, `Date.now()` ou valores não-determinísticos em JSX?
- [ ] Usei `key` estável em listas (não `key={idx}`)?
- [ ] `setTimeout`/`setInterval` têm cleanup no unmount?
- [ ] Usei o padrão `mounted` + `useEffect` para lógica client-side?

### Firebase e Dados
- [ ] Verifiquei conectividade (`navigator.onLine`) antes de operações Firebase?
- [ ] Usei `handleFirestoreError` ou logger para erros de Firebase?
- [ ] Dados mock têm valores estáveis (não aleatórios)?
- [ ] Evitei acessar `auth.currentUser` diretamente em utilitários?

### Imagens e Mídia
- [ ] Imagens externas têm fallback (`onError`)?
- [ ] Imagens usam `next/image` com dimensões explícitas?

### Acessibilidade
- [ ] A feature funciona com alto contraste?
- [ ] A feature respeita `--base-font-size` e `--layout-scale`?
- [ ] Botões têm `aria-label` ou texto descritivo?

## Antes do Deploy

- [ ] Rodei `npm run lint` e não há erros?
- [ ] Testei a feature com usuário não autenticado?
- [ ] Testei a feature offline?
- [ ] Verifiquei se há hydration warnings no console?
- [ ] Os logs estão sendo enviados para `/api/logs` corretamente?

## Após o Deploy

- [ ] Monitorei os logs no endpoint `/api/logs`?
- [ ] Verifiquei se há erros no console do navegador?
- [ ] Testei em mobile (viewport < 768px)?
