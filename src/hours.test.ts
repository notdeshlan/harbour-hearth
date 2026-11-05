import { describe, expect, it } from 'vitest';
import { cafeNow, openStatus } from './hours';

// Durban is UTC+2 all year (no daylight saving), so 08:00Z is 10:00 at the café.
describe('cafeNow', () => {
  it('reports café time, not the visitor’s time', () => {
    expect(cafeNow(new Date('2026-11-05T08:00:00Z'))).toEqual({ day: 4, minutes: 600 });
  });

  it('rolls over to the next day after 22:00 UTC', () => {
    expect(cafeNow(new Date('2026-11-05T22:30:00Z'))).toEqual({ day: 5, minutes: 30 });
  });
});

describe('openStatus', () => {
  it('is open mid-morning on a weekday', () => {
    expect(openStatus(new Date('2026-11-05T08:00:00Z'))).toEqual({ open: true, label: 'Open now · until 17:00' });
  });

  it('warns when closing soon', () => {
    const status = openStatus(new Date('2026-11-05T14:30:00Z')); // 16:30 Thursday
    expect(status.open).toBe(true);
    expect(status.label).toContain('Closing soon');
  });

  it('says when it opens later the same day', () => {
    expect(openStatus(new Date('2026-11-07T04:00:00Z'))).toEqual({ open: false, label: 'Closed · opens today at 08:00' });
  });

  it('points to tomorrow after closing', () => {
    expect(openStatus(new Date('2026-11-05T15:30:00Z'))).toEqual({ open: false, label: 'Closed · opens tomorrow at 07:00' });
  });

  it('handles Sunday afternoon rolling into Monday', () => {
    expect(openStatus(new Date('2026-11-08T11:30:00Z'))).toEqual({ open: false, label: 'Closed · opens tomorrow at 07:00' });
  });
});
