import {
  normalizeDemandStatus,
  normalizeDemandType,
  getDemandStatusLabel,
  getDemandTypeLabel,
  hasUnreadStaffMessage,
  buildDemandSearchText,
  hasUnreadReportStaffMessage,
  buildReportSearchText,
  timestampMillis,
  demandStatusLabel,
  demandTypeLabel,
  demandStatusOptions,
  reportStatusLabel,
  reportTypeLabel,
  reportStatusOptions,
} from '@/features/gestao/gestao.utils';
import type { Demand, Report } from '@/types';
import type { Timestamp } from 'firebase/firestore';

/** Timestamp mínimo para satisfazer o tipo sem importar o SDK do Firebase. */
const ts = { seconds: 0, nanoseconds: 0 } as unknown as Timestamp;

// ─── normalizeDemandStatus ───────────────────────────────────────────────────

describe('normalizeDemandStatus', () => {
  it('passes through known statuses unchanged', () => {
    expect(normalizeDemandStatus('pending')).toBe('pending');
    expect(normalizeDemandStatus('analyzing')).toBe('analyzing');
    expect(normalizeDemandStatus('solved')).toBe('solved');
    expect(normalizeDemandStatus('rejected')).toBe('rejected');
  });

  it('maps legacy "in_review" to "analyzing"', () => {
    expect(normalizeDemandStatus('in_review')).toBe('analyzing');
  });

  it('falls back to "pending" for unknown values', () => {
    expect(normalizeDemandStatus('')).toBe('pending');
    expect(normalizeDemandStatus('closed')).toBe('pending');
  });
});

// ─── normalizeDemandType ─────────────────────────────────────────────────────

describe('normalizeDemandType', () => {
  it('passes through known types unchanged', () => {
    expect(normalizeDemandType('reclamacao')).toBe('reclamacao');
    expect(normalizeDemandType('sugestao')).toBe('sugestao');
    expect(normalizeDemandType('denuncia')).toBe('denuncia');
    expect(normalizeDemandType('elogio')).toBe('elogio');
  });

  it('maps legacy "solicitação" to "sugestao"', () => {
    expect(normalizeDemandType('solicitação')).toBe('sugestao');
  });

  it('falls back to "reclamacao" for unknown values', () => {
    expect(normalizeDemandType('')).toBe('reclamacao');
    expect(normalizeDemandType('outro')).toBe('reclamacao');
  });
});

// ─── getDemandStatusLabel / getDemandTypeLabel ───────────────────────────────

describe('getDemandStatusLabel', () => {
  it('returns the correct Portuguese label for each known status', () => {
    expect(getDemandStatusLabel('pending')).toBe('Pendente');
    expect(getDemandStatusLabel('analyzing')).toBe('Em análise');
    expect(getDemandStatusLabel('solved')).toBe('Resolvida');
    expect(getDemandStatusLabel('rejected')).toBe('Recusada');
  });

  it('handles legacy "in_review" via normalization', () => {
    expect(getDemandStatusLabel('in_review')).toBe('Em análise');
  });
});

describe('getDemandTypeLabel', () => {
  it('returns the correct Portuguese label for each known type', () => {
    expect(getDemandTypeLabel('reclamacao')).toBe('Reclamação');
    expect(getDemandTypeLabel('sugestao')).toBe('Solicitação');
    expect(getDemandTypeLabel('denuncia')).toBe('Denúncia');
    expect(getDemandTypeLabel('elogio')).toBe('Elogio');
  });
});

// ─── Label map exhaustiveness ─────────────────────────────────────────────────

describe('demandStatusLabel', () => {
  it('is consistent with demandStatusOptions', () => {
    for (const { value, label } of demandStatusOptions) {
      expect(demandStatusLabel[value]).toBe(label);
    }
  });
});

describe('demandTypeLabel', () => {
  it('has a non-empty label for every known DemandType', () => {
    const types = ['reclamacao', 'sugestao', 'denuncia', 'elogio'] as const;
    for (const type of types) {
      expect(demandTypeLabel[type].length).toBeGreaterThan(0);
    }
  });
});

describe('reportStatusLabel', () => {
  it('is consistent with reportStatusOptions', () => {
    for (const { value, label } of reportStatusOptions) {
      expect(reportStatusLabel[value]).toBe(label);
    }
  });
});

describe('reportTypeLabel', () => {
  it('has a non-empty label for every known ReportType', () => {
    const types = ['infrastructure', 'environment', 'security', 'other'] as const;
    for (const type of types) {
      expect(reportTypeLabel[type].length).toBeGreaterThan(0);
    }
  });
});

// ─── hasUnreadStaffMessage ───────────────────────────────────────────────────

describe('hasUnreadStaffMessage', () => {
  const base: Demand = {
    id: '1', protocolId: 'OUV-2024-ABC123', userId: 'u1',
    subject: 'Teste', category: 'outros', type: 'reclamacao', status: 'pending',
    content: { text: 'texto', attachments: [] },
    createdAt: ts, updatedAt: ts, deletedAt: null,
  };

  it('returns true when unreadByStaff is true', () => {
    const d: Demand = { ...base, conversation: { unreadByStaff: true, unreadByCitizen: false, lastMessageAuthorName: '' } };
    expect(hasUnreadStaffMessage(d)).toBe(true);
  });

  it('returns false when unreadByStaff is false', () => {
    const d: Demand = { ...base, conversation: { unreadByStaff: false, unreadByCitizen: false, lastMessageAuthorName: '' } };
    expect(hasUnreadStaffMessage(d)).toBe(false);
  });

  it('returns false when conversation is absent', () => {
    expect(hasUnreadStaffMessage(base)).toBe(false);
  });
});

// ─── buildDemandSearchText ───────────────────────────────────────────────────

describe('buildDemandSearchText', () => {
  const demand: Demand = {
    id: '1', protocolId: 'OUV-2024-ABC123', userId: 'u1',
    subject: 'Buraco na rua', category: 'infraestrutura',
    type: 'reclamacao', status: 'pending',
    content: { text: 'Há um buraco perigoso', attachments: [] },
    createdAt: ts, updatedAt: ts, deletedAt: null,
  };

  it('includes protocol, subject and body text', () => {
    const text = buildDemandSearchText(demand);
    expect(text).toContain('ouv-2024-abc123');
    expect(text).toContain('buraco na rua');
    expect(text).toContain('há um buraco perigoso');
  });

  it('includes status and type labels in Portuguese', () => {
    const text = buildDemandSearchText(demand);
    expect(text).toContain('pendente');
    expect(text).toContain('reclamação');
  });

  it('includes unread indicator and author name when unreadByStaff is true', () => {
    const d: Demand = {
      ...demand,
      conversation: { unreadByStaff: true, unreadByCitizen: false, lastMessageAuthorName: 'Maria' },
    };
    const text = buildDemandSearchText(d);
    expect(text).toContain('nova resposta cidadão');
    expect(text).toContain('maria');
  });

  it('produces fully lowercase output', () => {
    const text = buildDemandSearchText(demand);
    expect(text).toBe(text.toLowerCase());
  });
});

// ─── hasUnreadReportStaffMessage ─────────────────────────────────────────────

describe('hasUnreadReportStaffMessage', () => {
  const base: Report = {
    id: '1', protocolId: 'GC-2024-ABC123', userId: 'u1',
    title: 'Lâmpada queimada', description: 'Rua escura', reporterName: 'João',
    type: 'infrastructure', status: 'pending',
    location: { lat: 0, lng: 0, address: '' },
    createdAt: ts, updatedAt: ts, deletedAt: null,
  };

  it('returns true when unreadByStaff is true', () => {
    const r: Report = { ...base, conversation: { unreadByStaff: true, unreadByCitizen: false, lastMessageAuthorName: '' } };
    expect(hasUnreadReportStaffMessage(r)).toBe(true);
  });

  it('returns false when conversation is absent', () => {
    expect(hasUnreadReportStaffMessage(base)).toBe(false);
  });
});

// ─── buildReportSearchText ───────────────────────────────────────────────────

describe('buildReportSearchText', () => {
  const report: Report = {
    id: '1', protocolId: 'GC-2024-XYZ789', userId: 'u1',
    title: 'Lâmpada queimada', description: 'Rua totalmente escura à noite',
    reporterName: 'Maria Silva',
    type: 'infrastructure', status: 'in_review',
    location: { lat: 0, lng: 0, address: '' },
    createdAt: ts, updatedAt: ts, deletedAt: null,
  };

  it('includes protocol, title, description and reporter name', () => {
    const text = buildReportSearchText(report);
    expect(text).toContain('gc-2024-xyz789');
    expect(text).toContain('lâmpada queimada');
    expect(text).toContain('rua totalmente escura à noite');
    expect(text).toContain('maria silva');
  });

  it('includes type and status labels in Portuguese', () => {
    const text = buildReportSearchText(report);
    expect(text).toContain('infraestrutura');
    expect(text).toContain('em análise');
  });

  it('produces fully lowercase output', () => {
    const text = buildReportSearchText(report);
    expect(text).toBe(text.toLowerCase());
  });
});

// ─── timestampMillis ─────────────────────────────────────────────────────────

describe('timestampMillis', () => {
  it('converts a Firestore Timestamp-like object to milliseconds', () => {
    expect(timestampMillis({ seconds: 1700000000 })).toBe(1700000000000);
  });

  it('returns 0 for null', () => {
    expect(timestampMillis(null)).toBe(0);
  });

  it('returns 0 for undefined', () => {
    expect(timestampMillis(undefined)).toBe(0);
  });

  it('returns 0 for a plain string', () => {
    expect(timestampMillis('2024-01-01')).toBe(0);
  });

  it('returns 0 for an object missing the seconds field', () => {
    expect(timestampMillis({ nanoseconds: 0 })).toBe(0);
  });

  it('returns 0 when seconds is not a number', () => {
    expect(timestampMillis({ seconds: 'abc' })).toBe(0);
  });
});
