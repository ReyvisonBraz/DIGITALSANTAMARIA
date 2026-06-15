import {
  canCitizenCancelDemand,
  canCitizenCancelReport,
  isDemandClosed,
  isReportClosed,
} from '@/lib/constants/protocols';

describe('protocol cancellation rules', () => {
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
