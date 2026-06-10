import { generateProtocolId, generateDemandProtocolId } from '@/lib/utils/protocol';

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
});
