/**
 * @module utils
 * @description Barrel export de utilitários.
 *
 * Uso: `import { formatDate, validateCPF } from '@/lib/utils/formatters';`
 */

export { formatDate, formatCurrency, formatProtocol, formatPhone, formatRelativeTime } from './formatters';
export { validateCPF, validateEmail, validatePhone, validateCEP, validateRequired } from './validators';
export { generateProtocolId, generateDemandProtocolId } from './protocol';
export { byCreatedAtAsc, byCreatedAtDesc } from './sort';
