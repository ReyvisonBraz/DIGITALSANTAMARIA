export function formatDate(date: Date | { seconds: number; toDate?: () => Date } | string): string {
  if (date && typeof date === 'object' && 'seconds' in date) {
    return new Date((date as { seconds: number }).seconds * 1000).toLocaleDateString('pt-BR');
  }
  return new Date(date as string | Date).toLocaleDateString('pt-BR');
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatProtocol(protocolId: string): string {
  return protocolId.toUpperCase();
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function formatRelativeTime(date: Date | { seconds: number }): string {
  const now = Date.now();
  const then = 'seconds' in date ? (date as { seconds: number }).seconds * 1000 : (date as Date).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'agora';
  if (minutes < 60) return `${minutes} min atrás`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h atrás`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d atrás`;
  return formatDate(new Date(then));
}
