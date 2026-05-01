import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY não configurada.');
  return new GoogleGenerativeAI(apiKey);
}

export async function classifyReport(
  title: string,
  description: string
): Promise<'infrastructure' | 'environment' | 'security' | 'other'> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    safetySettings: SAFETY_SETTINGS,
    generationConfig: { temperature: 0, maxOutputTokens: 20 },
  });

  const prompt = `Classifique o relato municipal abaixo em UMA categoria:
- infrastructure: buraco, iluminação, calçada, água, esgoto, obra
- environment: lixo, entulho, árvore, poluição, área verde
- security: segurança pública, violência, policiamento
- other: qualquer outro

Título: "${title}"
Descrição: "${description}"

Responda apenas: infrastructure, environment, security ou other`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().toLowerCase();
    const valid = ['infrastructure', 'environment', 'security', 'other'] as const;
    return valid.find((t) => text.includes(t)) ?? 'other';
  } catch {
    return 'other';
  }
}

export async function suggestDemandResponse(type: string, subject: string, text: string): Promise<string> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    safetySettings: SAFETY_SETTINGS,
    generationConfig: { temperature: 0.4, maxOutputTokens: 300 },
  });

  const prompt = `Você é assistente da ouvidoria municipal.
Escreva rascunho de resposta FORMAL e OBJETIVA para a manifestação abaixo.
Máximo 3 parágrafos curtos, em português.

Tipo: ${type}
Assunto: ${subject}
Texto: ${text}

Rascunho:`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch {
    return '';
  }
}
