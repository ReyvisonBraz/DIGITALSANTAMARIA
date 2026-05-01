# Bugs Conhecidos

## 1. Valores Aleatórios em JSX Causam Hydration Mismatch

**Onde:** `app/saude/page.tsx:155`

```tsx
<p className="text-[8px] font-black text-text-muted uppercase tracking-widest opacity-60">Filas: {Math.floor(Math.random() * 10) + 1}p</p>
```

**Problema:** `Math.random()` é chamado durante a renderização. No SSR, o valor gerado no servidor difere do valor gerado no cliente, causando hydration mismatch.

**Correção:** Usar `useState` + `useEffect` para gerar o valor apenas no cliente, ou usar dados fixos/mock.

**Prevenção:** Nunca use `Math.random()`, `Date.now()`, ou qualquer valor não-determinístico diretamente em JSX. Extraia para estado com inicialização no cliente.

---

## 2. Erro com `console.error` Genérico

**Onde:** `app/relatar/page.tsx:106` (agora corrigido)

```tsx
console.error(error);
toast('Erro ao enviar relato oficial.', 'error');
```

**Problema:** `console.error` não envia o erro para nenhum sistema de monitoramento. Erros silenciosos em produção.

**Correção:** Substituído por `log.error()` que persiste no localStorage e envia para o endpoint `/api/logs`.

**Prevenção:** Nunca use `console.error` diretamente. Use sempre o logger centralizado.

---

## 3. `handleFirestoreError` Serializa Erro Como JSON String

**Onde:** `lib/firebase.ts:41-42`

```tsx
if (info.error.includes('insufficient permissions')) {
  throw new Error(JSON.stringify(info));
}
```

**Problema:** O erro é convertido para string JSON, perdendo a estrutura de Error e dificultando o rastreamento em ferramentas de erro.

**Correção:** Criar uma classe de erro customizada `FirestoreError` que mantenha os metadados sem serialização manual.

**Prevenção:** Nunca lance `new Error(JSON.stringify(...))`. Use classes de erro customizadas.

---

## 4. Acesso Direto a `auth.currentUser` Fora do Contexto

**Onde:** `lib/firebase.ts:29-38`

```tsx
auth.currentUser?.uid || 'anonymous',
```

**Problema:** Em `handleFirestoreError`, o `currentUser` é acessado diretamente de `auth` em vez de usar o contexto `useAuth()`. Isso funciona porque é um módulo singleton, mas cria inconsistência se o AuthProvider não estiver montado.

**Correção:** Aceitar `userId` como parâmetro em vez de depender de `auth.currentUser`.

**Prevenção:** Sempre passe dados do usuário como parâmetros explícitos em funções utilitárias.

---

## 5. `key={idx}` em Listas sem IDs Únicos

**Onde:** Múltiplos componentes (IssueCard, AppointmentModal, SaudePage, etc.)

```tsx
{clinics.map((clinic, idx) => (
  <div key={idx} ...>
```

**Problema:** Usar índice como key causa problemas de reconciliação do React quando a lista é reordenada ou filtrada. Pode causar perda de estado em inputs e animações.

**Correção:** Usar IDs únicos estáveis. Para dados mock, usar `key={clinic.name}` ou adicionar um campo `id`.

**Prevenção:** Nunca use `key={idx}` em listas que podem ser reordenadas, filtradas ou ter items adicionados/removidos.

---

## 6. Imagens Externas sem Fallback

**Onde:** Múltiplos componentes (TopAppBar, Page, IssueCard)

```tsx
<Image src={user.photoURL || 'https://picsum.photos/seed/user/100/100'} ...
```

**Problema:** Se o `picsum.photos` estiver fora do ar (ou o usuário estiver offline), a imagem quebra sem fallback visual.

**Correção:** Adicionar `onError` handler para trocar por uma imagem local ou placeholder inline.

**Prevenção:** Sempre forneça fallback para imagens externas, especialmente serviços de terceiros.

---

## 7. Ausência de Error Boundaries

**Onde:** Em toda a aplicação

**Problema:** Nenhum Error Boundary React envolve os componentes. Um erro não tratado em qualquer componente pode derrubar a árvore inteira.

**Correção:** Criar um componente `ErrorBoundary` e envolver seções críticas (formulários, painéis principais).

**Prevenção:** Sempre adicione Error Boundaries em novas seções/páginas. É um requisito de resiliência.

---

## 8. Timers Não Limpos em `setTimeout`

**Onde:** `components/AppointmentModal.tsx:64`

```tsx
setTimeout(() => {
  setLoading(false);
  setStep(5);
  toast('Consulta agendada com sucesso!', 'success');
}, 1500);
```

**Problema:** Se o modal for fechado antes do timeout completar, o `setState` ainda será chamado, causando memory leak e erro "Can't perform a React state update on an unmounted component".

**Correção:** Usar `useRef` para armazenar o timeout e limpá-lo no `useEffect` return.

**Prevenção:** Todo `setTimeout`/`setInterval` em componentes React deve ser limpo no unmount.
