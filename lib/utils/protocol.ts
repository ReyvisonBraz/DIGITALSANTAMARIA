/**
 * @module protocol
 * @description Gera códigos de protocolo no formato `PREFIXO-ANO-CÓDIGO`
 * (ex.: `OUV-2026-A3K9P2`). O trecho aleatório usa a Web Crypto API
 * (`crypto.getRandomValues`), que é criptograficamente segura — ao contrário
 * de `Math.random()`, é imprevisível e tem chance de colisão desprezível.
 *
 * @example
 * ```ts
 * generateProtocolId('OUV'); // → 'OUV-2026-A3K9P2'
 * ```
 */

/**
 * Alfabeto do código aleatório. Tem 36 símbolos (0-9, A-Z).
 * Sem caracteres ambíguos removidos de propósito: mantemos o conjunto cheio
 * para maximizar a quantidade de combinações possíveis.
 */
const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Quantos caracteres aleatórios o código tem. 6 → 36^6 ≈ 2,2 bilhões de combinações. */
const CODE_LENGTH = 6;

/**
 * Gera uma sequência aleatória e segura de `length` caracteres do ALPHABET.
 *
 * Usa rejection sampling para evitar "viés de módulo": como 256 não é múltiplo
 * de 36, mapear bytes direto com `% 36` faria alguns caracteres saírem com mais
 * frequência. Descartamos os bytes da faixa que causaria viés e sorteamos de novo.
 */
function generateSecureCode(length: number): string {
  const max = Math.floor(256 / ALPHABET.length) * ALPHABET.length; // 252 para 36 símbolos
  let code = '';

  while (code.length < length) {
    const bytes = new Uint8Array(length - code.length);
    crypto.getRandomValues(bytes);

    for (const byte of bytes) {
      if (byte < max) {
        code += ALPHABET[byte % ALPHABET.length];
      }
      // bytes >= max são descartados (evita viés); o while sorteia o que faltar
    }
  }

  return code;
}

/**
 * Monta um protocolo completo no formato `PREFIXO-ANO-CÓDIGO`.
 * @param prefix Sigla do tipo de protocolo (ex.: 'OUV', 'MAT', 'GC').
 */
export function generateProtocolId(prefix: string = 'GC'): string {
  const year = new Date().getFullYear();
  const code = generateSecureCode(CODE_LENGTH);
  return `${prefix}-${year}-${code}`;
}

/** Protocolo de demandas da Ouvidoria (prefixo OUV). */
export function generateDemandProtocolId(): string {
  return generateProtocolId('OUV');
}
