const DIGITS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateCode(length: number): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += DIGITS[Math.floor(Math.random() * DIGITS.length)];
  }
  return code;
}

export function generateProtocolId(prefix: string = 'GC'): string {
  const year = new Date().getFullYear();
  const code = generateCode(6);
  return `${prefix}-${year}-${code}`;
}

export function generateDemandProtocolId(): string {
  return generateProtocolId('OUV');
}
