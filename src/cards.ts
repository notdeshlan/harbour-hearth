import { TAG_LABELS, type Category, type MenuItem } from './data';

const svg = (body: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

const ICONS: Record<Category, string> = {
  coffee: svg('<path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M8 3c0 1.5 1 1.5 1 3M12 3c0 1.5 1 1.5 1 3"/>'),
  breakfast: svg('<circle cx="10" cy="12" r="7"/><circle cx="10" cy="12" r="2.5"/><path d="M15.5 16.5l5 4"/>'),
  lunch: svg('<path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M8 7c0-1.5 1-1.5 1-3M12 7c0-1.5 1-1.5 1-3M16 7c0-1.5 1-1.5 1-3"/>'),
  bakes: svg('<path d="M6 12h12l-1.5 8h-9z"/><path d="M5 12a7 5 0 0 1 14 0"/><path d="M10 12l.5 8M14 12l-.5 8"/>'),
};

export const formatPrice = (rand: number) => `R${rand}`;

export function dishCard(item: MenuItem): HTMLElement {
  const card = document.createElement('article');
  card.className = 'dish';
  card.innerHTML = `
    <div class="dish-top">
      <span class="dish-icon" aria-hidden="true">${ICONS[item.category]}</span>
      <span class="dish-price"></span>
    </div>
    <h3></h3>
    <p></p>`;
  card.querySelector('.dish-price')!.textContent = formatPrice(item.price);
  card.querySelector('h3')!.textContent = item.name;
  card.querySelector('p')!.textContent = item.description;

  if (item.tags.length) {
    const tags = document.createElement('ul');
    tags.className = 'tags';
    tags.setAttribute('aria-label', 'Dietary');
    for (const tag of item.tags) {
      const li = document.createElement('li');
      li.className = `tag tag-${tag}`;
      li.textContent = TAG_LABELS[tag];
      tags.append(li);
    }
    card.append(tags);
  }
  return card;
}
