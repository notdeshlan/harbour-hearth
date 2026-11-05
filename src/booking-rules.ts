import { HOURS, TIMEZONE, cafeNow, fromMinutes, toMinutes } from './hours';

export const MAX_GUESTS = 12;
export const DAYS_AHEAD = 60;
/** The last table is seated an hour before closing. */
const LAST_SEATING_MIN = 60;
/** Same-day bookings need at least this much notice. */
const LEAD_TIME_MIN = 30;
const SLOT_MIN = 30;

export interface BookingValues {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  notes: string;
  deck: boolean;
}

export type BookingField = Exclude<keyof BookingValues, 'deck'>;
export type BookingErrors = Partial<Record<BookingField, string>>;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s()-]{9,16}$/;

const dateFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** Today's date at the café, as YYYY-MM-DD. */
export function cafeDate(now: Date): string {
  return dateFormat.format(now);
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function weekday(date: string): number {
  return new Date(`${date}T00:00:00Z`).getUTCDay();
}

/** Bookable times on a date, in 30-minute steps, skipping times already too close on the day. */
export function slotsFor(date: string, now: Date): string[] {
  if (!DATE_RE.test(date)) return [];
  const hours = HOURS[weekday(date)];
  if (!hours) return [];

  let first = toMinutes(hours.open);
  const last = toMinutes(hours.close) - LAST_SEATING_MIN;

  if (date === cafeDate(now)) {
    const earliest = cafeNow(now).minutes + LEAD_TIME_MIN;
    first = Math.max(first, Math.ceil(earliest / SLOT_MIN) * SLOT_MIN);
  }

  const slots: string[] = [];
  for (let m = first; m <= last; m += SLOT_MIN) slots.push(fromMinutes(m));
  return slots;
}

export function validateBooking(v: BookingValues, now: Date): BookingErrors {
  const errors: BookingErrors = {};

  if (v.name.trim().length < 2) errors.name = 'Please tell us your name.';

  const email = v.email.trim();
  if (!email) errors.email = 'We need an email address to confirm your table.';
  else if (!EMAIL_RE.test(email)) errors.email = "That email address doesn't look right.";

  const phone = v.phone.trim();
  if (phone && !PHONE_RE.test(phone)) errors.phone = 'Use digits only, for example 082 123 4567.';

  const today = cafeDate(now);
  if (!DATE_RE.test(v.date)) errors.date = 'Choose a date.';
  else if (v.date < today) errors.date = 'That date has already passed.';
  else if (v.date > addDays(today, DAYS_AHEAD)) errors.date = `We take bookings up to ${DAYS_AHEAD} days ahead.`;
  else if (!v.time) errors.time = 'Choose a time.';
  else if (!slotsFor(v.date, now).includes(v.time)) errors.time = "That time isn't available. Please pick another.";

  const guests = Number(v.guests);
  if (!Number.isInteger(guests) || guests < 1 || guests > MAX_GUESTS) {
    errors.guests = `Choose between 1 and ${MAX_GUESTS} guests.`;
  }

  if (v.notes.length > 300) errors.notes = 'Please keep notes under 300 characters.';

  return errors;
}
