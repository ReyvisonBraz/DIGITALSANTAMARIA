# 15 — Integração Gemini AI

> A API key já existe no .env.example. O código de integração não existe.
> Este módulo implementa classificação de relatos e sugestões para admin.

---

## Instalar Dependência

```bash
npm install @google/generative-ai
```

---

## Arquivo: `lib/gemini/gemini.ts` (NOVO)

```typescript
/**
 * Módulo de integração com Google Gemini AI.
 * Usa o modelo gemini-1.5-flash (rápido e econômico).
 *
 * A API key é lida de GEMINI_API_KEY no ambiente.
 * Nunca exposta ao cliente — apenas em Server Components ou API Routes.
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Configurações de segurança (evita respostas inapropriadas)
const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

/**
 * Cria uma instância do cliente Gemini.
 * Exporta como função para evitar erro em runtime sem API key.
 */
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY não configurada no ambiente.');
  }
  return new GoogleGenerativeAI(apiKey);
}

/**
 * Classifica o tipo de um relato urbano com base no título e descrição.
 * Retorna: 'infrastructure' | 'environment' | 'security' | 'other'
 *
 * @example
 * const type = await classifyReport('Buraco na rua', 'Há um buraco enorme...');
 * // returns: 'infrastructure'
 */
export async function classifyReport(
  title: string,
  description: string
): Promise<'infrastructure' | 'environment' | 'security' | 'other'> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    safetySettings: SAFETY_SETTINGS,
    generationConfig: {
      temperature: 0,       // determinístico para classificação
      maxOutputTokens: 20,  // resposta curta — apenas a categoria
    },
  });

  const prompt = `Você é um sistema de classificação de reclamações municipais.
Classifique o relato abaixo em UMA das categorias:
- infrastructure: problemas físicos (buraco, iluminação, calçada, água, esgoto)
- environment: problemas ambientais (lixo, entulho, árvore, poluição)
- security: problemas de segurança pública
- other: qualquer outra categoria

Relato:
Título: "${title}"
Descrição: "${description}"

Responda APENAS com uma das palavras: infrastructure, environment, security, other`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().toLowerCase();

    const validTypes = ['infrastructure', 'environment', 'security', 'other'] as const;
    const matched = validTypes.find((t) => text.includes(t));
    return matched ?? 'other';
  } catch (error) {
    console.error('[classifyReport] Erro Gemini:', error);
    return 'other'; // fallback seguro
  }
}

/**
 * Sugere uma resposta oficial para uma demanda da ouvidoria.
 * Usado no painel admin para acelerar a triagem.
 *
 * @param type - Tipo da demanda (reclamacao, sugestao, etc.)
 * @param subject - Assunto resumido
 * @param text - Texto completo da demanda
 * @returns Rascunho de resposta formal em português
 */
export async function suggestDemandResponse(
  type: string,
  subject: string,
  text: string
): Promise<string> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    safetySettings: SAFETY_SETTINGS,
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 300,
    },
  });

  const prompt = `Você é um assistente da ouvidoria municipal de Santa Maria do Pará, PA, Brasil.
Escreva um rascunho de resposta FORMAL e OBJETIVA para a seguinte manifestação cidadã.
A resposta deve ser respeitosa, informativa e em português brasileiro formal.
Máximo 3 parágrafos curtos.

Tipo: ${type}
Assunto: ${subject}
Texto: ${text}

Rascunho de resposta:`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('[suggestDemandResponse] Erro Gemini:', error);
    return ''; // fallback: campo vazio para admin preencher manualmente
  }
}

/**
 * Gera um resumo conciso de uma petição para exibição no painel admin.
 *
 * @param title - Título da petição
 * @param description - Descrição completa
 * @returns Resumo em 2 linhas
 */
export async function summarizePetition(
  title: string,
  description: string
): Promise<string> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    safetySettings: SAFETY_SETTINGS,
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 100,
    },
  });

  const prompt = `Resuma a seguinte petição cidadã em 1-2 frases simples, em português.

Título: ${title}
Descrição: ${description}

Resumo:`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch {
    return description.slice(0, 120) + '...'; // fallback: trunca descrição
  }
}
```

---

## Arquivo: `app/api/classify-report/route.ts` (NOVO — API Route)

```typescript
/**
 * API Route para classificar relatos com Gemini AI.
 * Roda no servidor (não expõe a API key ao cliente).
 *
 * POST /api/classify-report
 * Body: { title: string, description: string }
 * Response: { type: 'infrastructure' | 'environment' | 'security' | 'other' }
 */

import { NextRequest, NextResponse } from 'next/server';
import { classifyReport } from '@/lib/gemini/gemini';

export async function POST(request: NextRequest) {
  try {
    const { title, description } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: 'title e description são obrigatórios' },
        { status: 400 }
      );
    }

    const type = await classifyReport(title, description);
    return NextResponse.json({ type });
  } catch (error) {
    console.error('[/api/classify-report]', error);
    return NextResponse.json({ type: 'other' }); // fallback seguro
  }
}
```

---

## Arquivo: `app/api/suggest-response/route.ts` (NOVO)

```typescript
/**
 * API Route para sugerir resposta de demanda com Gemini AI.
 *
 * POST /api/suggest-response
 * Body: { type: string, subject: string, text: string }
 * Response: { suggestion: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { suggestDemandResponse } from '@/lib/gemini/gemini';

export async function POST(request: NextRequest) {
  try {
    const { type, subject, text } = await request.json();

    if (!type || !subject || !text) {
      return NextResponse.json({ suggestion: '' });
    }

    const suggestion = await suggestDemandResponse(type, subject, text);
    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error('[/api/suggest-response]', error);
    return NextResponse.json({ suggestion: '' });
  }
}
```

---

## Como Integrar no Módulo Relatar

```typescript
// Em app/relatar/page.tsx — auto-classificar ao avançar da etapa 2

const autoClassify = async () => {
  if (!formData.title || !formData.description) return;

  try {
    const res = await fetch('/api/classify-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: formData.title,
        description: formData.description,
      }),
    });
    const { type } = await res.json();

    // Preenche a categoria automaticamente se o usuário não escolheu
    if (!formData.category) {
      setFormData((prev) => ({ ...prev, category: type }));
    }
  } catch {
    // silencioso — usuário pode selecionar manualmente
  }
};

// Chamar no handleNext quando step === 2
```

---

## Como Integrar no Painel Admin (Sugestão de Resposta)

```typescript
// Em features/gestao/StatusUpdater.tsx

const [loadingSuggestion, setLoadingSuggestion] = useState(false);

const fetchSuggestion = async () => {
  setLoadingSuggestion(true);
  try {
    const res = await fetch('/api/suggest-response', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: item._type === 'demand' ? (item as Demand).type : 'reclamacao',
        subject: item._type === 'report' ? item.title : (item as Demand).subject,
        text: item._type === 'report' ? item.description : (item as Demand).content.text,
      }),
    });
    const { suggestion } = await res.json();
    if (suggestion) setResponse(suggestion);
  } finally {
    setLoadingSuggestion(false);
  }
};

// Botão "Sugerir com IA" ao lado do textarea de resposta
```
