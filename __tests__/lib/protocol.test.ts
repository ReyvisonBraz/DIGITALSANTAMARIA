import { generateProtocolId, generateDemandProtocolId } from '@/lib/utils/protocol';
import {
  canCitizenCancelDemand,
  canCitizenCancelReport,
  isDemandClosed,
  isReportClosed,
} from '@/lib/constants/protocols';

describe('Protocol Utils', () => {
  describe('generateProtocolId', () => {
    it('should generate a protocol with default prefix GC', () => {
      const protocol = generateProtocolId();
      expect(protocol).toMatch(/^GC-\d{4}-[A-Z0-9]{6}$/);
    });

    it('should generate a protocol with custom prefix', () => {
      const protocol = generateProtocolId('OUV');
      expect(protocol).toMatch(/^OUV-\d{4}-[A-Z0-9]{6}$/);
    });

    it('should include the current year', () => {
      const year = new Date().getFullYear().toString();
      const protocol = generateProtocolId();
      expect(protocol).toContain(year);
    });

    it('should generate unique protocols', () => {
      const set = new Set<string>();
      for (let i = 0; i < 100; i++) {
        set.add(generateProtocolId());
      }
      expect(set.size).toBe(100);
    });

    it('should use only valid characters in the code', () => {
      const protocol = generateProtocolId();
      const code = protocol.split('-')[2];
      expect(code).toMatch(/^[A-Z0-9]{6}$/);
    });

    it('should have exactly 3 parts separated by dash', () => {
      const protocol = generateProtocolId();
      expect(protocol.split('-').length).toBe(3);
    });
  });

  describe('generateDemandProtocolId', () => {
    it('should generate OUV prefixed protocol', () => {
      const protocol = generateDemandProtocolId();
      expect(protocol).toMatch(/^OUV-\d{4}-[A-Z0-9]{6}$/);
    });
  });

  describe('cancellation rules', () => {
    it('allows citizens to cancel open non-anonymous demands only', () => {
      expect(canCitizenCancelDemand('pending', false)).toBe(true);
      expect(canCitizenCancelDemand('analyzing', false)).toBe(true);
      expect(canCitizenCancelDemand('pending', true)).toBe(false);
      expect(canCitizenCancelDemand('solved', false)).toBe(false);
      expect(canCitizenCancelDemand('rejected', false)).toBe(false);
      expect(canCitizenCancelDemand('cancelled', false)).toBe(false);
    });

    it('allows citizens to cancel open reports only', () => {
      expect(canCitizenCancelReport('pending')).toBe(true);
      expect(canCitizenCancelReport('in_review')).toBe(true);
      expect(canCitizenCancelReport('resolved')).toBe(false);
      expect(canCitizenCancelReport('rejected')).toBe(false);
      expect(canCitizenCancelReport('cancelled')).toBe(false);
    });

    it('treats cancelled protocols as closed', () => {
      expect(isDemandClosed('cancelled')).toBe(true);
      expect(isReportClosed('cancelled')).toBe(true);
    });
  });
});
