import { describe, expect, it } from 'vitest';
import { MENU } from './data';
import { matches, parseFilters, serializeFilters, type Filters } from './menu-filter';

const none: Filters = { category: 'all', query: '', tags: [] };
const find = (filters: Partial<Filters>) => MENU.filter((item) => matches(item, { ...none, ...filters })).map((i) => i.id);

describe('menu filtering', () => {
  it('shows everything with no filters', () => {
    expect(find({})).toHaveLength(MENU.length);
  });

  it('filters by category', () => {
    expect(find({ category: 'bakes' })).toEqual(['cardamom-bun', 'koeksister-cruffin', 'polenta-cake', 'banana-bread']);
  });

  it('counts vegan dishes as vegetarian', () => {
    expect(find({ tags: ['v'] })).toContain('banana-bread');
  });

  it('combines dietary tags', () => {
    expect(find({ tags: ['vg', 'gf'] })).toEqual(['espresso', 'iced-oat-latte', 'oats', 'butternut-salad']);
  });

  it('searches names and descriptions, ignoring case and accents', () => {
    expect(find({ query: 'GRUYERE' })).toEqual(['mushroom-toastie']);
    // Every word has to match, in any order.
    expect(find({ query: 'salmon sourdough' })).toEqual(['benedict']);
    expect(find({ query: 'oat milk' })).toEqual(['iced-oat-latte', 'oats']);
  });
});

describe('filters in the URL', () => {
  it('round-trips through the query string', () => {
    const filters: Filters = { category: 'lunch', query: 'curry', tags: ['gf'] };
    expect(parseFilters(serializeFilters(filters))).toEqual(filters);
  });

  it('ignores unknown values', () => {
    expect(parseFilters('?cat=dessert&diet=keto,vg')).toEqual({ category: 'all', query: '', tags: ['vg'] });
  });

  it('produces a clean URL when nothing is filtered', () => {
    expect(serializeFilters(none)).toBe('');
  });
});
