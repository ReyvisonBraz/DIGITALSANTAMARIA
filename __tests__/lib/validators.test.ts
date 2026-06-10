import { validateCPF, validateEmail, validatePhone, validateCEP, validateRequired } from '@/lib/utils/validators';

describe('Validators', () => {
  describe('validateCPF', () => {
    it('should accept valid CPF', () => {
      expect(validateCPF('529.982.247-25')).toBe(true);
      expect(validateCPF('52998224725')).toBe(true);
    });

    it('should reject invalid CPF', () => {
      expect(validateCPF('123.456.789-00')).toBe(false);
      expect(validateCPF('000.000.000-00')).toBe(false);
      expect(validateCPF('11111111111')).toBe(false);
    });

    it('should reject wrong length', () => {
      expect(validateCPF('123')).toBe(false);
      expect(validateCPF('123456789012')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(validateCPF('')).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('should accept valid emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('not-email')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('should accept valid phone numbers', () => {
      expect(validatePhone('(91) 99999-0000')).toBe(true);
      expect(validatePhone('91999990000')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validatePhone('')).toBe(false);
      expect(validatePhone('123')).toBe(false);
    });
  });

  describe('validateCEP', () => {
    it('should accept valid CEP', () => {
      expect(validateCEP('68720-000')).toBe(true);
      expect(validateCEP('68720000')).toBe(true);
    });

    it('should reject invalid CEP', () => {
      expect(validateCEP('')).toBe(false);
      expect(validateCEP('12345')).toBe(false);
    });
  });

  describe('validateRequired', () => {
    it('should accept non-empty strings', () => {
      expect(validateRequired('hello')).toBe(true);
      expect(validateRequired(' a ')).toBe(true);
    });

    it('should reject empty/whitespace strings', () => {
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false);
    });
  });
});
