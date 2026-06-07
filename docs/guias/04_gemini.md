# Gemini AI — Integracao

Google Gemini AI para classificacao automatica e sugestao de respostas.

---

## Configuracao

```env
NEXT_PUBLIC_GEMINI_API_KEY=sua-chave-api
```

## API Routes (`app/api/`)

### POST `/api/classify-report`

Classifica automaticamente o tipo de um relato baseado na descricao.

**Input:**
```json
{ "description": "buraco na rua principal" }
```

**Output:**
```json
{ "type": "infrastructure", "confidence": 0.95 }
```

**Tipos possiveis:** `infrastructure`, `environment`, `security`, `other`

**Implementacao:** `lib/gemini/gemini.ts → classifyReport()`

---

### POST `/api/suggest-response`

Sugere uma resposta formal para demandas da ouvidoria.

**Input:**
```json
{
  "type": "reclamacao",
  "category": "infraestrutura",
  "description": "falta de iluminacao na praca central"
}
```

**Output:**
```json
{ "response": "Prezado cidadao, recebemos sua reclamacao sobre..." }
```

**Implementacao:** `lib/gemini/gemini.ts → suggestDemandResponse()`

---

## Uso no codigo

**Relatar problema:**
```typescript
// features/relatar/ReportForm.tsx
const tipoSugerido = await fetch('/api/classify-report', {
  method: 'POST',
  body: JSON.stringify({ description }),
}).then(r => r.json())
```

**Painel admin (responder demanda):**
```typescript
// features/gestao/StatusUpdater.tsx
const sugestao = await fetch('/api/suggest-response', {
  method: 'POST',
  body: JSON.stringify({ type, category, description }),
}).then(r => r.json())
```

---

## Rate limiting

Ambas as APIs tem rate limiting basico (1 req/s por IP).
