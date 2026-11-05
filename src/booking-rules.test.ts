import { describe, expect, it } from 'vitest';
import { addDays, cafeDate, slotsFor, validateBooking, type BookingValues } from './booking-rules';

const THURSDAY_10AM = new Date('2026-11-05T08:00:00Z'); // 10:00 in Durban

const valid: BookingValues = {
  name: 'Thandi Mokoena',
  email: 'thandi@example.com',
  phone: '082 123 4567',
  date: '2026-11-07',
  time: '10:00',
  guests: '4',
  notes: '',
  deck: true,
};

describe('dates', () => {
  it('uses the café’s date, even late at night UTC', () => {
    expect(cafeDate(new Date('2026-11-05T22:30:00Z'))).toBe('2026-11-06');
  });

  it('adds days across month ends', () => {
    expect(addDays('2026-11-29', 3)).toBe('2026-12-02');
  });
});

describe('slotsFor', () => {
  it('offers half-hour slots until an hour before closing', () => {
    const sunday = slotsFor('2026-11-08', THURSDAY_10AM);
    expect(sunday[0]).toBe('08:00');
    expect(sunday.at(-1)).toBe('12:00');
    expect(sunday).toHaveLength(9);
  });

  it('skips slots that are too soon on the day', () => {
    const today = slotsFor('2026-11-05', new Date('2026-11-05T08:10:00Z')); // 10:10
    expect(today[0]).toBe('11:00');
    expect(today.at(-1)).toBe('16:00');
  });

  it('returns nothing once the last seating has passed', () => {
    expect(slotsFor('2026-11-05', new Date('2026-11-05T14:00:00Z'))).toEqual([]);
  });

  it('returns nothing for a malformed date', () => {
    expect(slotsFor('next tuesday', THURSDAY_10AM)).toEqual([]);
  });
});

describe('validateBooking', () => {
  it('accepts a complete booking', () => {
    expect(validateBooking(valid, THURSDAY_10AM)).toEqual({});
  });

  it('flags every missing required field', () => {
    const errors = validateBooking({ ...valid, name: '', email: '', date: '', time: '' }, THURSDAY_10AM);
    expect(Object.keys(errors).sort()).toEqual(['date', 'email', 'name']);
  });

  it('rejects dates in the past and too far ahead', () => {
    expect(validateBooking({ ...valid, date: '2026-11-04' }, THURSDAY_10AM).date).toMatch(/passed/);
    expect(validateBooking({ ...valid, date: '2027-03-01' }, THURSDAY_10AM).date).toMatch(/60 days/);
  });

  it('rejects a time outside the slots for that day', () => {
    // Saturday closes at 15:00, so the last seating is 14:00.
    expect(validateBooking({ ...valid, time: '14:30' }, THURSDAY_10AM).time).toBeDefined();
  });

  it('checks email, phone and party size', () => {
    const errors = validateBooking({ ...valid, email: 'thandi@', phone: 'call me', guests: '13' }, THURSDAY_10AM);
    expect(errors.email).toBeDefined();
    expect(errors.phone).toBeDefined();
    expect(errors.guests).toBeDefined();
  });

  it('lets phone be left empty', () => {
    expect(validateBooking({ ...valid, phone: '' }, THURSDAY_10AM).phone).toBeUndefined();
  });
});
