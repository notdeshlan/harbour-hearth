export type Category = 'coffee' | 'breakfast' | 'lunch' | 'bakes';
export type Tag = 'v' | 'vg' | 'gf';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  /** Price in South African rand. */
  price: number;
  category: Category;
  tags: Tag[];
  featured?: boolean;
}

export const CATEGORIES: ReadonlyArray<{ id: Category; label: string; blurb: string }> = [
  { id: 'coffee', label: 'Coffee & drinks', blurb: 'Roasted every Tuesday, two streets away.' },
  { id: 'breakfast', label: 'Breakfast', blurb: 'Served all day, because why not.' },
  { id: 'lunch', label: 'Lunch', blurb: 'From 11:30 until the kitchen closes.' },
  { id: 'bakes', label: 'Bakes', blurb: 'Baked every morning. Usually gone by three.' },
];

export const TAG_LABELS: Record<Tag, string> = {
  v: 'Vegetarian',
  vg: 'Vegan',
  gf: 'Gluten-free',
};

export const MENU: ReadonlyArray<MenuItem> = [
  // Coffee & drinks
  { id: 'espresso', name: 'Espresso', description: 'Our Harbour Blend: dark chocolate, molasses and a little citrus.', price: 28, category: 'coffee', tags: ['vg', 'gf'] },
  { id: 'flat-white', name: 'Flat white', description: 'Double shot with silky steamed milk. The one most regulars order.', price: 38, category: 'coffee', tags: ['v', 'gf'] },
  { id: 'cappuccino', name: 'Cappuccino', description: 'Classic, foamy and dusted with cocoa if you like.', price: 36, category: 'coffee', tags: ['v', 'gf'] },
  { id: 'cortado', name: 'Cortado', description: 'Equal parts espresso and warm milk. Small and strong.', price: 34, category: 'coffee', tags: ['v', 'gf'] },
  { id: 'iced-oat-latte', name: 'Iced oat latte', description: 'Single-origin espresso over ice with creamy oat milk.', price: 45, category: 'coffee', tags: ['vg', 'gf'] },
  { id: 'red-cappuccino', name: 'Rooibos cappuccino', description: 'Caffeine-free red espresso, steamed milk and a drizzle of honey.', price: 36, category: 'coffee', tags: ['v', 'gf'] },
  { id: 'chai', name: 'Masala chai latte', description: 'House-brewed chai with cardamom, clove and fresh ginger.', price: 42, category: 'coffee', tags: ['v', 'gf'] },

  // Breakfast
  { id: 'benedict', name: 'Harbour Benedict', description: 'Poached eggs and smoked salmon on toasted sourdough with lemon hollandaise.', price: 112, category: 'breakfast', tags: [], featured: true },
  { id: 'shakshuka', name: 'Shakshuka', description: 'Eggs baked in spiced tomato and pepper sauce, with feta and herbs.', price: 92, category: 'breakfast', tags: ['v', 'gf'] },
  { id: 'avo-feta', name: 'Avo & feta toast', description: 'Smashed avocado, whipped feta, chilli and toasted seeds on rye.', price: 85, category: 'breakfast', tags: ['v'] },
  { id: 'oats', name: 'Coconut overnight oats', description: 'Oats soaked in coconut milk with mango, passion fruit and toasted coconut.', price: 65, category: 'breakfast', tags: ['vg', 'gf'] },
  { id: 'full-hearth', name: 'The Full Hearth', description: 'Two eggs, bacon, boerewors, mushrooms, tomato and toast. Bring an appetite.', price: 128, category: 'breakfast', tags: [] },

  // Lunch
  { id: 'bunny', name: 'Quarter mutton bunny', description: 'A Durban classic: slow-cooked mutton curry in a hollowed half-loaf, with sambals.', price: 118, category: 'lunch', tags: [], featured: true },
  { id: 'fish-chips', name: 'Line fish & chips', description: "Today's catch in a crisp beer batter, hand-cut chips and tartare sauce.", price: 145, category: 'lunch', tags: [] },
  { id: 'butternut-salad', name: 'Roast butternut salad', description: 'Charred butternut, lentils, rocket, pomegranate and tahini dressing.', price: 95, category: 'lunch', tags: ['vg', 'gf'] },
  { id: 'peri-wrap', name: 'Peri-peri chicken wrap', description: 'Grilled chicken, pickled onion, slaw and our house peri-peri mayo.', price: 105, category: 'lunch', tags: [] },
  { id: 'mushroom-toastie', name: 'Mushroom & thyme toastie', description: 'Garlic mushrooms, gruyère and thyme pressed in sourdough.', price: 88, category: 'lunch', tags: ['v'] },

  // Bakes
  { id: 'cardamom-bun', name: 'Cardamom bun', description: 'Soft, buttery and knotted by hand. Best with a flat white.', price: 32, category: 'bakes', tags: ['v'], featured: true },
  { id: 'koeksister-cruffin', name: 'Koeksister cruffin', description: 'Flaky croissant dough, spiced syrup and a crunchy coconut top.', price: 38, category: 'bakes', tags: ['v'] },
  { id: 'polenta-cake', name: 'Lemon & polenta cake', description: 'Moist, zesty and naturally gluten-free.', price: 42, category: 'bakes', tags: ['v', 'gf'] },
  { id: 'banana-bread', name: 'Vegan banana bread', description: 'Toasted and served with peanut butter and a pinch of salt.', price: 36, category: 'bakes', tags: ['vg'] },
];
