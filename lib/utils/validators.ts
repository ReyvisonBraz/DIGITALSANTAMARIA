export function validateCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11 || /^(\d)\1{10}$/.test(cleaned)) return false;

  const calcDigit = (base: string, factor: number): number => {
    let sum = 0;
    for (const digit of base) {
      sum += parseInt(digit) * factor--;
    }
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const digit1 = calcDigit(cleaned.slice(0, 9), 10);
  if (digit1 !== parseInt(cleaned[9])) return false;

  const digit2 = calcDigit(cleaned.slice(0, 10), 11);
  return digit2 === parseInt(cleaned[10]);
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
}

export function validateCEP(cep: string): boolean {
  return /^\d{5}-?\d{3}$/.test(cep);
}

export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}
