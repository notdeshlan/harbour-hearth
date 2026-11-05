import { CATEGORIES, TAG_LABELS, type Category, type MenuItem, type Tag } from './data';

export type CategoryFilter = Category | 'all';

export interface Filters {
  category: CategoryFilter;
  query: string;
  tags: Tag[];
}

export const ALL_TAGS = Object.keys(TAG_LABELS) as Tag[];

const normalise = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

function hasTag(item: MenuItem, tag: Tag): boolean {
  // Vegan dishes are vegetarian too.
  if (tag === 'v') return item.tags.includes('v') || item.tags.includes('vg');
  return item.tags.includes(tag);
}

export function matches(item: MenuItem, filters: Filters): boolean {
  if (filters.category !== 'all' && item.category !== filters.category) return false;
  if (!filters.tags.every((tag) => hasTag(item, tag))) return false;

  const words = normalise(filters.query).split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const haystack = normalise(`${item.name} ${item.description}`);
  return words.every((word) => haystack.includes(word));
}

export function parseFilters(search: string): Filters {
  const params = new URLSearchParams(search);
  const cat = params.get('cat');
  const category = CATEGORIES.some((c) => c.id === cat) ? (cat as Category) : 'all';
  const tags = (params.get('diet') ?? '')
    .split(',')
    .filter((t): t is Tag => (ALL_TAGS as string[]).includes(t));
  return { category, query: params.get('q') ?? '', tags };
}

export function serializeFilters(filters: Filters): string {
  const params = new URLSearchParams();
  if (filters.category !== 'all') params.set('cat', filters.category);
  if (filters.query.trim()) params.set('q', filters.query.trim());
  if (filters.tags.length) params.set('diet', filters.tags.join(','));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}
