import {
  DAYS_AHEAD,
  MAX_GUESTS,
  addDays,
  cafeDate,
  slotsFor,
  validateBooking,
  type BookingErrors,
  type BookingField,
  type BookingValues,
} from './booking-rules';

const FIELDS: BookingField[] = ['name', 'email', 'phone', 'date', 'time', 'guests', 'notes'];

const longDate = new Intl.DateTimeFormat('en-ZA', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

function bookingReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'HH-';
  for (let i = 0; i < 5; i++) ref += chars[Math.floor(Math.random() * chars.length)];
  return ref;
}

export function initBooking(): void {
  const formEl = document.querySelector<HTMLFormElement>('[data-booking]');
  const successEl = document.querySelector<HTMLElement>('[data-booking-success]');
  if (!formEl || !successEl) return;
  const form: HTMLFormElement = formEl;
  const success: HTMLElement = successEl;

  const date = form.querySelector<HTMLInputElement>('#b-date')!;
  const time = form.querySelector<HTMLSelectElement>('#b-time')!;
  const guests = form.querySelector<HTMLSelectElement>('#b-guests')!;
  const notes = form.querySelector<HTMLTextAreaElement>('#b-notes')!;
  const notesCount = form.querySelector<HTMLElement>('[data-notes-count]')!;
  const alert = form.querySelector<HTMLElement>('[data-form-alert]')!;
  const touched = new Set<BookingField>();

  guests.replaceChildren(
    ...Array.from({ length: MAX_GUESTS }, (_, i) => new Option(`${i + 1} ${i === 0 ? 'guest' : 'guests'}`, String(i + 1))),
  );

  function setDefaults(): void {
    const now = new Date();
    const today = cafeDate(now);
    date.min = today;
    date.max = addDays(today, DAYS_AHEAD);
    date.value = slotsFor(today, now).length ? today : addDays(today, 1);
    guests.value = '2';
    fillTimes();
  }

  function fillTimes(): void {
    const previous = time.value;
    const slots = slotsFor(date.value, new Date());
    const prompt = !date.value ? 'Pick a date first' : slots.length ? 'Choose a time' : 'No times left on this day';
    time.replaceChildren(new Option(prompt, ''), ...slots.map((slot) => new Option(slot, slot)));
    if (slots.includes(previous)) time.value = previous;
  }

  function read(): BookingValues {
    const data = new FormData(form);
    const text = (key: string) => String(data.get(key) ?? '');
    return {
      name: text('name'),
      email: text('email'),
      phone: text('phone'),
      date: text('date'),
      time: text('time'),
      guests: text('guests'),
      notes: text('notes'),
      deck: data.get('deck') === 'on',
    };
  }

  function showErrors(errors: BookingErrors, only?: Set<BookingField>): void {
    for (const field of FIELDS) {
      if (only && !only.has(field)) continue;
      const input = form.elements.namedItem(field) as HTMLElement | null;
      const message = form.querySelector<HTMLElement>(`#b-${field}-error`);
      if (!input || !message) continue;
      const error = errors[field];
      if (error) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
      message.textContent = error ?? '';
      message.hidden = !error;
    }
  }

  const revalidate = () => {
    if (touched.size) showErrors(validateBooking(read(), new Date()), touched);
  };

  form.addEventListener('focusout', (event) => {
    const name = (event.target as HTMLInputElement).name as BookingField;
    if (!FIELDS.includes(name)) return;
    touched.add(name);
    revalidate();
  });

  date.addEventListener('change', () => {
    fillTimes();
    revalidate();
  });
  time.addEventListener('change', revalidate);

  notes.addEventListener('input', () => {
    notesCount.textContent = String(notes.value.length);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const values = read();
    const errors = validateBooking(values, new Date());
    FIELDS.forEach((field) => touched.add(field));
    showErrors(errors);

    const invalid = FIELDS.filter((field) => errors[field]);
    if (invalid.length) {
      alert.textContent =
        invalid.length === 1 ? 'Please fix the highlighted field.' : `Please fix the ${invalid.length} highlighted fields.`;
      alert.hidden = false;
      (form.elements.namedItem(invalid[0]) as HTMLElement).focus();
      return;
    }
    alert.hidden = true;
    showConfirmation(values);
  });

  function showConfirmation(v: BookingValues): void {
    success.querySelector('[data-success-name]')!.textContent = v.name.trim().split(/\s+/)[0];
    success.querySelector('[data-success-email]')!.textContent = v.email.trim();

    const rows: [string, string][] = [
      ['Reference', bookingReference()],
      ['Date', longDate.format(new Date(`${v.date}T00:00:00Z`))],
      ['Time', v.time],
      ['Guests', v.guests],
      ['Seating', v.deck ? 'On the deck if we can' : 'Wherever is free'],
    ];
    if (v.phone.trim()) rows.push(['Phone', v.phone.trim()]);
    if (v.notes.trim()) rows.push(['Notes', v.notes.trim()]);

    const summary = success.querySelector<HTMLElement>('[data-success-summary]')!;
    summary.replaceChildren(
      ...rows.flatMap(([label, value]) => {
        const dt = document.createElement('dt');
        dt.textContent = label;
        const dd = document.createElement('dd');
        dd.textContent = value;
        return [dt, dd];
      }),
    );

    form.hidden = true;
    success.hidden = false;
    success.focus();
    success.scrollIntoView({ block: 'center' });
  }

  success.querySelector('[data-booking-again]')!.addEventListener('click', () => {
    form.reset();
    touched.clear();
    showErrors({});
    alert.hidden = true;
    notesCount.textContent = '0';
    setDefaults();
    success.hidden = true;
    form.hidden = false;
    form.querySelector<HTMLInputElement>('#b-name')!.focus();
  });

  setDefaults();
}
