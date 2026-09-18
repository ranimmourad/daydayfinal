/**
 * DAYDAY – ديْ ديْ · أكلة شعبية
 * SOURCE OF TRUTH = restaurant menu boards. Never invent a price.
 * price: null → UI shows "السوم في الـcaisse".
 * featured + category cover = auto-computed from highest price.
 */

const MENU_IMG = '/static/menu/';

const CATEGORIES = [
  {
    id: 'ojja', name: 'عجة', nameFr: 'Ojja', icon: '🍲',
    items: [
      { id: 'ojja-merguez',    name: 'عجة مرقاز',         nameFr: 'Ojja merguez',       price: 14, img: MENU_IMG + 'ojja-merguez.webp' },
      { id: 'ojja-akoud',      name: 'عجة عقد',           nameFr: 'Ojja akoud',         price: 22, img: null },
      { id: 'ojja-fruits-mer', name: 'عجة Fruits de mer', nameFr: 'Ojja fruits de mer', price: 28, img: MENU_IMG + 'ojja-fruits-mer.webp' },
      { id: 'ojja-crevettes',  name: 'عجة Chevrettes',    nameFr: 'Ojja crevettes',     price: 25, img: MENU_IMG + 'ojja-crevettes.webp' },
      { id: 'ojja-escalope',   name: 'عجة اسكالوب',       nameFr: 'Ojja escalope',      price: 14, img: MENU_IMG + 'ojja-escalope.webp' },
      { id: 'ojja-mixte',      name: 'عجة Mixte',         nameFr: 'Ojja mixte',         price: 18, img: MENU_IMG + 'ojja-mixte.webp' },
      { id: 'ojja-dayday',     name: 'عجة ديْ ديْ',         nameFr: 'Ojja DayDay',        price: 40, img: MENU_IMG + 'ojja-dayday.webp' },
    ],
  },
  {
    id: 'makrouna', name: 'مقرونة', nameFr: 'Makrouna', icon: '🍝',
    items: [
      { id: 'mak-crevettes',     name: 'مقرونة Chevrettes',    nameFr: 'Makrouna crevettes',     price: 25, img: MENU_IMG + 'makrouna-crevettes.webp' },
      { id: 'mak-sauce-blanche', name: 'مقرونة Sauce blanche', nameFr: 'Makrouna sauce blanche', price: 17, img: MENU_IMG + 'makrouna-sauce-blanche.webp' },
      { id: 'mak-putanesca',     name: 'مقرونة Putanesca',     nameFr: 'Makrouna putanesca',     price: 15, img: MENU_IMG + 'makrouna-putanesca.webp' },
      { id: 'mak-fruits-mer',    name: 'مقرونة Fruits de mer', nameFr: 'Makrouna fruits de mer', price: 28, img: MENU_IMG + 'makrouna-fruits-mer.webp' },
      { id: 'mak-escalope',      name: 'مقرونة اسكالوب',       nameFr: 'Makrouna escalope',      price: 13, img: null },
      { id: 'mak-bolognaise',    name: 'مقرونة Bolognaise',    nameFr: 'Makrouna bolognaise',    price: 18, img: MENU_IMG + 'makrouna-bolognaise.webp' },
      { id: 'mak-thon-fromage',  name: 'مقرونة Thon Fromage',  nameFr: 'Makrouna thon fromage',  price: 14, img: MENU_IMG + 'makrouna-thon-fromage.webp' },
    ],
  },
  {
    id: 'lablabi', name: 'لبلابي', nameFr: 'Lablabi', icon: '🥣',
    items: [
      { id: 'lablabi-sec',  name: 'لبلابي sec',  nameFr: 'Lablabi sec',    price: 4.5, img: MENU_IMG + 'lablabi.webp' },
      { id: 'hargma-sec',   name: 'هرقمة sec',   nameFr: 'Hargma sec',     price: 9,   img: null },
      { id: 'soupe-hargma', name: 'Soupe هرقمة', nameFr: 'Soupe hargma',   price: 10,  img: null },
      { id: 'sahn-akoud',   name: 'صحن عقد',     nameFr: 'Assiette akoud', price: 20,  img: null },
    ],
    extras: [
      { name: 'عظمة', price: 1 },
      { name: 'زيت زيتونة', price: 1.5 },
      { name: 'تن', price: 3 },
      { name: 'صحن ترشي', price: 1.5 },
    ],
  },
  {
    id: 'sahn', name: 'صحن', nameFr: 'Assiettes', icon: '🍛',
    items: [
      { id: 'sahn-tounsi',      name: 'صحن تونسي',      nameFr: 'Assiette tunisienne', price: 7,    img: MENU_IMG + 'salade-thon.webp' },
      { id: 'kafteji',          name: 'كفتاجي',          nameFr: 'Kafteji',             price: 6,    img: MENU_IMG + 'kafteji.webp' },
      { id: 'kafteji-escalope', name: 'كفتاجي اسكالوب', nameFr: 'Kafteji escalope',    price: 10,   img: null },
      { id: 'kafteji-merguez',  name: 'كفتاجي مرقاز',   nameFr: 'Kafteji merguez',     price: 10,   img: null },
      { id: 'kafteji-kebda',    name: 'كفتاجي كبدة',    nameFr: 'Kafteji kebda',       price: 10,   img: null },
      { id: 'sahfa-thoum',      name: 'صحفة ثوم',       nameFr: 'Assiette thoum',      price: 7,    img: null },
    ],
  },
  {
    id: 'sahn-makli', name: 'صحن مقلي', nameFr: 'Assiettes frites', icon: '🍳',
    items: [
      { id: 'makli-escalope', name: 'مقلي اسكالوب', nameFr: 'Escalope', price: 14, img: MENU_IMG + 'kafteji-escalope.webp' },
      { id: 'makli-merguez',  name: 'مقلي مرقاز',   nameFr: 'Merguez',  price: 14, img: MENU_IMG + 'kafteji-merguez.webp' },
      { id: 'makli-kebda',    name: 'مقلي كبدة',    nameFr: 'Kebda',    price: 15, img: null },
      { id: 'makli-hout',     name: 'مقلي حوت',     nameFr: 'Poisson',  price: 20, img: null },
      { id: 'makli-mixte',    name: 'مقلي Mixte',   nameFr: 'Mixte',    price: 18, img: MENU_IMG + 'mixte-terre.webp' },
      { id: 'makli-dayday',   name: 'مقلي ديْ ديْ',   nameFr: 'DayDay',   price: 22, img: null },
    ],
  },
  {
    id: 'plat-sauce', name: 'Plat + Sauce', nameFr: 'Plat + Sauce', icon: '🍽️',
    items: [
      { id: 'plat-mixte-terre',     name: 'Mixte Terre',     nameFr: 'Mixte terre',      price: 17, img: MENU_IMG + 'plat-mixte-terre.webp' },
      { id: 'plat-mixte-mer',       name: 'Mixte Mer',       nameFr: 'Mixte mer',        price: 35, img: null },
      { id: 'plat-dayday',          name: 'Plat DayDay',     nameFr: 'Plat DayDay',      price: 21, img: MENU_IMG + 'plat-dayday.webp' },
      { id: 'plat-hout',            name: 'حوت',             nameFr: 'Poisson',          price: 20, img: null },
      { id: 'plat-escalope-grille', name: 'اسكالوب Grillé',  nameFr: 'Escalope grillée', price: 13, img: MENU_IMG + 'plat-escalope-grille.webp' },
      { id: 'plat-escalope-panne',  name: 'اسكالوب Panné',   nameFr: 'Escalope panée',   price: 15, img: null },
      { id: 'plat-tajine',          name: 'طاجين',           nameFr: 'Tajine',           price: 10, img: MENU_IMG + 'plat-tajine.webp' },
      { id: 'plat-merguez',         name: 'مرقاز',           nameFr: 'Merguez',          price: 14, img: MENU_IMG + 'plat-merguez.webp' },
    ],
    extras: [
      { name: 'Sauce', price: 5 }
    ],
  },
  {
    id: 'djaj', name: 'دجاج', nameFr: 'Poulet', icon: '🍗',
    items: [
      { id: 'quart-djaj',       name: 'ربع دجاج',         nameFr: '¼ Poulet',              price: 12, img: MENU_IMG + 'quart-poulet.webp' },
      { id: 'nos-djaj-sec',     name: 'نصف دجاج sec',     nameFr: '½ Poulet sec',          price: 12, img: MENU_IMG + 'demi-poulet-sec.webp' },
      { id: 'nos-djaj-complet', name: 'نصف دجاج complet', nameFr: '½ Poulet complet',      price: 17, img: MENU_IMG + 'demi-poulet-complet.webp' },
      { id: 'djaja-sec',        name: 'دجاجة sec',        nameFr: 'Poulet entier sec',     price: 19, img: MENU_IMG + 'poulet-sec.webp' },
      { id: 'djaja-complet',    name: 'دجاجة complet',    nameFr: 'Poulet entier complet', price: 25, img: MENU_IMG + 'poulet-complet.webp' },
    ],
  },
  {
    id: 'kaskrout', name: 'كسكروت', nameFr: 'Casse-croûte', icon: '🥖',
    items: [
      { id: 'kk-kafteji',  name: 'كسكروت كفتاجي',  nameFr: 'Kafteji',  price: 4,   img: MENU_IMG + 'casse-croute-kafteji.webp' },
      { id: 'kk-djaj',     name: 'كسكروت دجاج',    nameFr: 'Poulet',   price: 6,   img: MENU_IMG + 'casse-croute-poulet.webp' },
      { id: 'kk-thon',     name: 'كسكروت تن',      nameFr: 'Thon',     price: 6.5, img: MENU_IMG + 'casse-croute-thon.webp' },
      { id: 'kk-merguez',  name: 'كسكروت مرقاز',   nameFr: 'Merguez',  price: 7.5, img: MENU_IMG + 'casse-croute-merguez.webp' },
      { id: 'kk-escalope', name: 'كسكروت اسكالوب', nameFr: 'Escalope', price: 7.5, img: MENU_IMG + 'casse-croute-escalope.webp' },
      { id: 'kk-kebda',    name: 'كسكروت كبدة',    nameFr: 'Kebda',    price: 8.5, img: null },
    ],
  },
  {
    id: 'idhafat', name: 'إضافات', nameFr: 'Suppléments', icon: '➕',
    items: [
      { id: 'sup-frite',     name: 'فريت',      nameFr: 'Frites',       price: 3,   img: null },
      { id: 'sup-escalope',  name: 'اسكالوب',   nameFr: 'Escalope',     price: 5,   img: null },
      { id: 'sup-merguez',   name: 'مرقاز',     nameFr: 'Merguez',      price: 5,   img: null },
      { id: 'sup-kebda',     name: 'كبدة',      nameFr: 'Kebda',        price: 5,   img: null },
      { id: 'sup-thon',      name: 'تن',        nameFr: 'Thon',         price: 3,   img: null },
      { id: 'sup-chorba',    name: 'صحفة شربة', nameFr: 'Bol de soupe', price: 3,   img: null },
      { id: 'sup-torchi',    name: 'صحن ترشي',  nameFr: 'Torchi',       price: 1.5, img: MENU_IMG + 'salade-tunisienne.webp' },
      { id: 'sup-emballage', name: 'Emballage', nameFr: 'Emballage',    price: 0.5, img: null },
    ],
  },
  {
    id: 'machroubet', name: 'مشروبات', nameFr: 'Boissons', icon: '🥤',
    items: [
      { id: 'canette',    name: 'Canette',   nameFr: 'Canette',        price: 2.5, img: null },
      { id: 'eau-1l',     name: 'ماء 1L',    nameFr: 'Eau 1L',         price: 1.5, img: null },
      { id: 'blel-sghir', name: 'بلار صغير', nameFr: 'Boisson petite', price: 1.5, img: null },
      { id: 'blel-kbir',  name: 'بلار كبير', nameFr: 'Boisson grande', price: 3.5, img: null },
    ],
  },
];

/* Auto: featured = priciest item / category · cover = priciest item WITH photo */
CATEGORIES.forEach((cat) => {
  let maxItem = null;
  cat.items.forEach((it) => {
    it.category = cat.id;
    it.categoryName = cat.name;
    it.icon = cat.icon;
    it.available = it.available !== false;
    it.featured = false;
    if (it.price != null && (maxItem == null || it.price > maxItem.price)) maxItem = it;
  });
  if (maxItem) maxItem.featured = true;
  const withImg = cat.items.filter((i) => i.img && i.price != null).sort((a, b) => b.price - a.price);
  cat.cover = withImg.length ? withImg[0].img : (cat.items.find((i) => i.img)?.img || null);
  cat.minPrice = Math.min(...cat.items.filter((i) => i.price != null).map((i) => i.price));
});

const ALL_ITEMS = CATEGORIES.flatMap((c) => c.items);
window.DAYDAY_MENU = { categories: CATEGORIES, items: ALL_ITEMS };
