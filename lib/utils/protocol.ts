const DIGITS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateCode(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  let code = '';
  for (let i = 0; i < length; i++) {
    code += DIGITS[array[i] % DIGITS.length];
  }
  return code;
}

/**
 * Gera um ID de protocolo único no formato `PREFIXO-AAAA-XXXXXX`.
 * Usa 6 caracteres alfanuméricos aleatórios via `crypto.getRandomValues`.
 * @param prefix - Prefixo do protocolo (padrão: 'GC').
 * @returns ID do protocolo (ex: GC-2026-A1B2C3).
 */
export function generateProtocolId(prefix: string = 'GC'): string {
  const year = new Date().getFullYear();
  const code = generateCode(6);
  return `${prefix}-${year}-${code}`;
}

/**
 * Gera um ID de protocolo para demandas/ouvidoria com prefixo 'OUV'.
 * @returns ID do protocolo (ex: OUV-2026-A1B2C3).
 */
export function generateDemandProtocolId(): string {
  return generateProtocolId('OUV');
}
