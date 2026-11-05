/** The café keeps Durban time, whatever time zone the visitor is in. */
export const TIMEZONE = 'Africa/Johannesburg';

export interface DayHours {
  open: string;
  close: string;
}

/** Opening hours indexed by day of the week, Sunday = 0. */
export const HOURS: ReadonlyArray<DayHours | null> = [
  { open: '08:00', close: '13:00' }, // Sunday
  { open: '07:00', close: '17:00' }, // Monday
  { open: '07:00', close: '17:00' }, // Tuesday
  { open: '07:00', close: '17:00' }, // Wednesday
  { open: '07:00', close: '17:00' }, // Thursday
  { open: '07:00', close: '17:00' }, // Friday
  { open: '08:00', close: '15:00' }, // Saturday
];

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const CLOSING_SOON_MIN = 45;

export function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function fromMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

const clockFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: TIMEZONE,
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

/** The day of the week and minutes past midnight at the café right now. */
export function cafeNow(date: Date): { day: number; minutes: number } {
  const parts = clockFormat.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? '';
  return {
    day: SHORT_DAYS.indexOf(get('weekday')),
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  };
}

export interface OpenStatus {
  open: boolean;
  label: string;
}

export function openStatus(date: Date): OpenStatus {
  const { day, minutes } = cafeNow(date);
  const today = HOURS[day];

  if (today) {
    const open = toMinutes(today.open);
    const close = toMinutes(today.close);
    if (minutes >= open && minutes < close) {
      return close - minutes <= CLOSING_SOON_MIN
        ? { open: true, label: `Closing soon · last orders by ${today.close}` }
        : { open: true, label: `Open now · until ${today.close}` };
    }
    if (minutes < open) {
      return { open: false, label: `Closed · opens today at ${today.open}` };
    }
  }

  for (let ahead = 1; ahead <= 7; ahead++) {
    const next = (day + ahead) % 7;
    const hours = HOURS[next];
    if (hours) {
      const when = ahead === 1 ? 'tomorrow' : DAY_NAMES[next];
      return { open: false, label: `Closed · opens ${when} at ${hours.open}` };
    }
  }
  return { open: false, label: 'Closed' };
}

/** Renders the weekly hours as a list, Monday first, with today highlighted. */
export function renderHours(container: HTMLElement, date = new Date()): void {
  const { day: today } = cafeNow(date);
  const list = document.createElement('ul');
  list.className = 'hours-list';

  for (const day of [1, 2, 3, 4, 5, 6, 0]) {
    const item = document.createElement('li');
    const name = document.createElement('span');
    name.textContent = DAY_NAMES[day];
    if (day === today) {
      item.classList.add('is-today');
      const badge = document.createElement('small');
      badge.textContent = 'Today';
      name.append(' ', badge);
    }
    const hours = HOURS[day];
    const time = document.createElement('span');
    time.textContent = hours ? `${hours.open} – ${hours.close}` : 'Closed';
    item.append(name, time);
    list.append(item);
  }

  container.replaceChildren(list);
}
