import { CATEGORIES, MENU, TAG_LABELS } from './data';
import { dishCard } from './cards';
import { ALL_TAGS, matches, parseFilters, serializeFilters, type CategoryFilter } from './menu-filter';

export function initMenu(): void {
  const root = document.querySelector<HTMLElement>('[data-menu]');
  if (!root) return;

  const form = root.querySelector<HTMLFormElement>('[data-menu-form]')!;
  const search = root.querySelector<HTMLInputElement>('[data-menu-search]')!;
  const chips = root.querySelector<HTMLElement>('[data-menu-categories]')!;
  const diet = root.querySelector<HTMLElement>('[data-menu-diet]')!;
  const results = root.querySelector<HTMLElement>('[data-menu-results]')!;
  const count = root.querySelector<HTMLElement>('[data-menu-count]')!;

  const filters = parseFilters(location.search);

  const options: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: 'Everything' },
    ...CATEGORIES.map(({ id, label }) => ({ id, label })),
  ];
  chips.replaceChildren(
    ...options.map(({ id, label }) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chip';
      button.textContent = label;
      button.dataset.category = id;
      button.addEventListener('click', () => {
        filters.category = id;
        update();
      });
      return button;
    }),
  );

  const toggles = ALL_TAGS.map((tag) => {
    const label = document.createElement('label');
    label.className = 'toggle';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.value = tag;
    input.checked = filters.tags.includes(tag);
    input.addEventListener('change', () => {
      filters.tags = toggles.filter((t) => t.checked).map((t) => t.value as typeof tag);
      update();
    });
    const text = document.createElement('span');
    text.textContent = TAG_LABELS[tag];
    label.append(input, text);
    diet.append(label);
    return input;
  });

  search.value = filters.query;
  let debounce: number | undefined;
  search.addEventListener('input', () => {
    window.clearTimeout(debounce);
    debounce = window.setTimeout(() => {
      filters.query = search.value;
      update();
    }, 120);
  });
  form.addEventListener('submit', (event) => event.preventDefault());

  function reset(): void {
    filters.category = 'all';
    filters.query = '';
    filters.tags = [];
    search.value = '';
    toggles.forEach((t) => (t.checked = false));
    update();
    search.focus();
  }

  function update(): void {
    chips.querySelectorAll<HTMLButtonElement>('.chip').forEach((chip) => {
      chip.setAttribute('aria-pressed', String(chip.dataset.category === filters.category));
    });

    const shown = MENU.filter((item) => matches(item, filters));
    const fragment = document.createDocumentFragment();

    for (const category of CATEGORIES) {
      const items = shown.filter((item) => item.category === category.id);
      if (!items.length) continue;

      const group = document.createElement('section');
      group.className = 'menu-group';
      group.setAttribute('aria-labelledby', `group-${category.id}`);

      const head = document.createElement('div');
      head.className = 'menu-group-head';
      const title = document.createElement('h2');
      title.id = `group-${category.id}`;
      title.textContent = category.label;
      const blurb = document.createElement('p');
      blurb.textContent = category.blurb;
      head.append(title, blurb);

      const grid = document.createElement('div');
      grid.className = 'card-grid';
      grid.append(...items.map(dishCard));

      group.append(head, grid);
      fragment.append(group);
    }

    if (!shown.length) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.innerHTML = '<h2>Nothing matches that, sorry</h2><p>Try a different word or clear the filters.</p>';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn btn-ghost';
      button.textContent = 'Clear filters';
      button.addEventListener('click', reset);
      empty.append(button);
      fragment.append(empty);
    }

    results.replaceChildren(fragment);
    count.textContent =
      shown.length === MENU.length
        ? `Showing all ${MENU.length} items`
        : `Showing ${shown.length} of ${MENU.length} items`;

    history.replaceState(null, '', `${location.pathname}${serializeFilters(filters)}`);
  }

  update();
}
