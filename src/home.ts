import { MENU } from './data';
import { dishCard } from './cards';

export function initHome(): void {
  const featured = document.querySelector<HTMLElement>('[data-featured]');
  if (!featured) return;
  featured.replaceChildren(...MENU.filter((item) => item.featured).map(dishCard));
}
