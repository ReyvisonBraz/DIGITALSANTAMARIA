# Padrões a Evitar

## 1. Dados Mock com Valores Aleatórios

❌ **Ruim:**
```tsx
<p>{Math.floor(Math.random() * 10) + 1}p</p>
```

✅ **Bom:**
```tsx
const [queueSize] = useState(() => Math.floor(Math.random() * 10) + 1);
<p>{queueSize}p</p>
```

**Motivo:** Evita hydration mismatch. Gera o valor uma vez no cliente.

---

## 2. Console.log / console.error Direto

❌ **Ruim:**
```tsx
console.error(error);
```

✅ **Bom:**
```tsx
log.error('Falha ao salvar', { operation: 'createReport' }, error);
```

**Motivo:** O logger centralizado persiste no localStorage e envia para o servidor, permitindo debug remoto.

---

## 3. Strings Mágicas sem Constantes

❌ **Ruim:**
```tsx
if (status === 'RESOLVIDO') { ... }
```

✅ **Bom:**
```tsx
const PROTOCOL_STATUS = { RESOLVIDO: 'RESOLVIDO', PENDENTE: 'PENDENTE' } as const;
if (status === PROTOCOL_STATUS.RESOLVIDO) { ... }
```

**Motivo:** Evita typos e facilita manutenção. Se o valor mudar, muda em um lugar só.

---

## 4. Acessar `auth.currentUser` Diretamente em Utilitários

❌ **Ruim:**
```tsx
auth.currentUser?.uid || 'anonymous'
```

✅ **Bom:**
```tsx
function handleError(error: any, userId?: string) { ... }
```

**Motivo:** Funções utilitárias não devem depender de estado global. Receba parâmetros explicitamente.

---

## 5. setTimeout sem Cleanup

❌ **Ruim:**
```tsx
setTimeout(() => setLoading(false), 1500);
```

✅ **Bom:**
```tsx
useEffect(() => {
  const timer = setTimeout(() => setLoading(false), 1500);
  return () => clearTimeout(timer);
}, []);
```

**Motivo:** Previne memory leaks e chamadas de setState em componentes desmontados.

---

## 6. Uso de `key={idx}` em Listas

❌ **Ruim:**
```tsx
{items.map((item, idx) => <div key={idx}>...)}
```

✅ **Bom:**
```tsx
{items.map(item => <div key={item.id}>...)}
// ou para mock data:
{items.map((item, idx) => <div key={`${item.name}-${idx}`}>...)}
```

**Motivo:** Índices como key quebram a reconciliação do React quando a lista muda.

---

## 7. CSS Inline para Lógica Responsiva

❌ **Ruim:**
```tsx
const isMobile = window.innerWidth < 768;
// usar isMobile para renderizar diferente
```

✅ **Bom:**
```tsx
// Usar Tailwind classes: hidden md:block / block md:hidden
// Ou useMediaQuery hook
```

**Motivo:** `window.innerWidth` não reage a mudanças de tamanho. Use CSS ou hooks baseados em eventos.

---

## 8. Submissão de Form sem Validação de Rede

❌ **Ruim:**
```tsx
await addDoc(collection(db, 'reports'), data);
```

✅ **Bom:**
```tsx
if (!navigator.onLine) {
  toast('Sem conexão. Dados salvos localmente.', 'warn');
  // salvar para retry
  return;
}
await addDoc(collection(db, 'reports'), data);
```

**Motivo:** O Firebase falha silenciosamente quando offline. Verifique conectividade antes de operações críticas.
