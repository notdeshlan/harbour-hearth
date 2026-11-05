import './styles/main.css';
import { openStatus, renderHours } from './hours';

function setupNav(): void {
  const toggle = document.querySelector<HTMLButtonElement>('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 821px)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}

function setupHeader(): void {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function setupReveal(): void {
  const items = document.querySelectorAll('.reveal');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  items.forEach((el) => observer.observe(el));
}

function setupHours(): void {
  const update = () => {
    const status = openStatus(new Date());
    document.querySelectorAll<HTMLElement>('[data-open-status]').forEach((el) => {
      el.textContent = status.label;
      el.classList.toggle('is-open', status.open);
    });
  };
  update();
  window.setInterval(update, 60_000);
  document.querySelectorAll<HTMLElement>('[data-hours]').forEach((el) => renderHours(el));
}

setupNav();
setupHeader();
setupReveal();
setupHours();
document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = String(new Date().getFullYear())));

// Load each page's own script only where it is needed.
switch (document.body.dataset.page) {
  case 'home':
    import('./home').then((m) => m.initHome());
    break;
  case 'menu':
    import('./menu').then((m) => m.initMenu());
    break;
  case 'contact':
    import('./booking').then((m) => m.initBooking());
    break;
}
