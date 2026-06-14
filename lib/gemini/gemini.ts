import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

function getGeminiClient(): GoogleGenerativeAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  return apiKey ? new GoogleGenerativeAI(apiKey) : null;
}

function limitText(value: string, maxLength: number): string {
  const trimmed = value.trim();
  return trimmed.length > maxLength ? `${trimmed.slice(0, maxLength)}...` : trimmed;
}

export async function classifyReport(
  title: string,
  description: string,
): Promise<'infrastructure' | 'environment' | 'security' | 'other'> {
  try {
    const genAI = getGeminiClient();
    if (!genAI) return 'other';

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      safetySettings: SAFETY_SETTINGS,
      generationConfig: { temperature: 0, maxOutputTokens: 20 },
    });

    const prompt = `Classifique o relato municipal abaixo em UMA categoria:
- infrastructure: buraco, iluminacao, calcada, agua, esgoto, obra
- environment: lixo, entulho, arvore, poluicao, area verde
- security: seguranca publica, violencia, policiamento
- other: qualquer outro

Titulo: "${limitText(title, 160)}"
Descrição: "${limitText(description, 1200)}"

Responda apenas: infrastructure, environment, security ou other`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().toLowerCase();
    const valid = ['infrastructure', 'environment', 'security', 'other'] as const;
    return valid.find((type) => text.includes(type)) ?? 'other';
  } catch {
    return 'other';
  }
}

export async function suggestDemandResponse(type: string, subject: string, text: string): Promise<string> {
  try {
    const genAI = getGeminiClient();
    if (!genAI) return '';

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      safetySettings: SAFETY_SETTINGS,
      generationConfig: { temperature: 0.4, maxOutputTokens: 300 },
    });

    const prompt = `Voce e assistente da ouvidoria municipal.
Escreva um rascunho de resposta FORMAL e OBJETIVA para a manifestacao abaixo.
Maximo 3 paragrafos curtos, em portugues.

Tipo: ${limitText(type, 80)}
Assunto: ${limitText(subject, 160)}
Texto: ${limitText(text, 1600)}

Rascunho:`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch {
    return '';
  }
}
