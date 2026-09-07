/**
 * DAYDAY – أكلة شعبية
 * Centralized menu data (SOURCE OF TRUTH = restaurant menu boards).
 *
 * ─ RULES ─
 * • Prices come from the real menu boards. Never invent a price.
 *   If a price is unknown, set price: null → the UI shows "السعر في الـcaisse".
 * • "featured" (most expensive item / category) is computed automatically.
 * • Category cover image = image of the most expensive item that has an image
 *   (computed automatically — updating a price updates covers & highlights).
 * • img: null → the card shows a branded placeholder (no fake AI food photos).
 */

const MENU_IMG = '/static/menu/';

const CATEGORIES = [
  {
    id: 'lablabi',
    name: 'لبلابي',
    nameFr: 'Lablabi',
    icon: '🥣',
    items: [
      { id: 'lablabi-sec',    name: 'لبلابي sec',   nameFr: 'Lablabi sec',   price: 4.5, img: MENU_IMG + 'lablabi.webp',         desc: 'حمّص، خبز، هريسة، زيت و عظمة — الأكلة الشعبية بامتياز' },
      { id: 'hargma-sec',     name: 'هرقمة sec',    nameFr: 'Hargma sec',    price: 9,   img: null,                              desc: '' },
      { id: 'soupe-hargma',   name: 'Soupe هرقمة',  nameFr: 'Soupe hargma',  price: 10,  img: null,                              desc: '' },
      { id: 'sahn-akoud',     name: 'صحن عقد',      nameFr: 'Assiette akoud', price: 20, img: null,                              desc: '' },
      { id: 'lablabi-thon',   name: 'لبلابي + تن',  nameFr: 'Lablabi + thon', price: 7.5, img: MENU_IMG + 'lablabi-complet.webp', desc: 'لبلابي sec مع زيادة تن (4.5 + 3)' },
    ],
    extras: [
      { name: 'عظمة',       price: 1 },
      { name: 'زيت زيتونة', price: 1.5 },
      { name: 'تن',         price: 3 },
      { name: 'صحن ترشي',   price: 1.5 },
    ],
  },
  {
    id: 'sahn',
    name: 'صحن',
    nameFr: 'Assiettes',
    icon: '🍛',
    items: [
      { id: 'sahn-tounsi',      name: 'صحن تونسي',      nameFr: 'Assiette tunisienne', price: 7,  img: MENU_IMG + 'salade-thon.webp', desc: 'سلاطة، تن، زيتون، هريسة و ترشي' },
      { id: 'kafteji',          name: 'كفتاجي',          nameFr: 'Kafteji',             price: 6,  img: MENU_IMG + 'kafteji.webp',     desc: 'بطاطا، فلفل مقلي، طماطم، عجّة و مشوية' },
      { id: 'kafteji-escalope', name: 'كفتاجي اسكالوب', nameFr: 'Kafteji escalope',    price: 10, img: null,                          desc: '' },
      { id: 'kafteji-merguez',  name: 'كفتاجي مرقاز',   nameFr: 'Kafteji merguez',     price: 10, img: null,                          desc: '' },
      { id: 'kafteji-kebda',    name: 'كفتاجي كبدة',    nameFr: 'Kafteji kebda',       price: 10, img: null,                          desc: '' },
      { id: 'sahfa-thoum',      name: 'صحفة ثوم',       nameFr: 'Assiette thoum',      price: 7,  img: null,                          desc: '' },
      { id: 'slata-mechouia',   name: 'سلاطة مشوية',    nameFr: 'Slata mechouia',      price: null, img: MENU_IMG + 'slata-mechouia.webp', desc: 'مشوية بالفلفل و الطماطم، تن، زيتون و هريسة' },
    ],
  },
  {
    id: 'sahn-makli',
    name: 'صحن مقلي',
    nameFr: 'Assiettes frites',
    icon: '🍳',
    items: [
      { id: 'makli-escalope', name: 'اسكالوب مقلي', nameFr: 'Escalope',  price: 14, img: MENU_IMG + 'kafteji-escalope.webp', desc: 'اسكالوب مشرمل، بطاطا مقلية، عجّة، فلفل و طماطم' },
      { id: 'makli-merguez',  name: 'مرقاز مقلي',   nameFr: 'Merguez',   price: 14, img: MENU_IMG + 'kafteji-merguez.webp',  desc: 'مرقاز محمّر، بطاطا مقلية، عجّة، فلفل و طماطم' },
      { id: 'makli-kebda',    name: 'كبدة مقلية',   nameFr: 'Kebda',     price: 15, img: null,                               desc: '' },
      { id: 'makli-hout',     name: 'حوت مقلي',     nameFr: 'Poisson',   price: 20, img: null,                               desc: '' },
      { id: 'makli-mixte',    name: 'Mixte مقلي',   nameFr: 'Mixte',     price: 18, img: MENU_IMG + 'mixte-terre.webp',       desc: 'اسكالوب + مرقاز، بطاطا مقلية، عجّة و خضرة مقلية' },
      { id: 'makli-dayday',   name: 'دي دي مقلي',   nameFr: 'DayDay',    price: 22, img: null,                               desc: 'الصحن المقلي الخاص متاع الدار' },
    ],
  },
  {
    id: 'ojja',
    name: 'عجة',
    nameFr: 'Ojja',
    icon: '🍲',
    items: [
      { id: 'ojja-merguez',    name: 'عجة مرقاز',        nameFr: 'Ojja merguez',       price: 14, img: MENU_IMG + 'ojja-merguez.webp',    desc: 'عجّة بالمرقاز، صالصة حمراء، زيتون و بصل' },
      { id: 'ojja-akoud',      name: 'عجة عقد',          nameFr: 'Ojja akoud',         price: 22, img: null,                              desc: '' },
      { id: 'ojja-fruits-mer', name: 'عجة Fruits de mer', nameFr: 'Ojja fruits de mer', price: 28, img: MENU_IMG + 'ojja-fruits-mer.webp', desc: 'عجّة بفواكه البحر: بوزروق، كلامار و حوت' },
      { id: 'ojja-crevettes',  name: 'عجة Chevrettes',   nameFr: 'Ojja crevettes',     price: 25, img: MENU_IMG + 'ojja-crevettes.webp',  desc: 'عجّة بالقمبري، صالصة حمراء متبّلة' },
      { id: 'ojja-escalope',   name: 'عجة اسكالوب',      nameFr: 'Ojja escalope',      price: 14, img: MENU_IMG + 'ojja-escalope.webp',   desc: 'عجّة بالاسكالوب، صالصة حمراء، زيتون و بصل' },
      { id: 'ojja-mixte',      name: 'عجة Mixte',        nameFr: 'Ojja mixte',         price: 18, img: MENU_IMG + 'ojja-mixte.webp',      desc: 'عجّة مرقاز + اسكالوب' },
      { id: 'ojja-dayday',     name: 'عجة دي دي',        nameFr: 'Ojja DayDay',        price: 40, img: MENU_IMG + 'ojja-dayday.webp',     desc: 'العجّة الملكية متاع الدار: مرقاز، اسكالوب و فواكه البحر' },
    ],
  },
  {
    id: 'makrouna',
    name: 'مقرونة',
    nameFr: 'Makrouna',
    icon: '🍝',
    items: [
      { id: 'mak-crevettes',     name: 'مقرونة Chevrettes',   nameFr: 'Makrouna crevettes',     price: 25, img: MENU_IMG + 'makrouna-crevettes.webp',     desc: 'سباقيتي بالقمبري و صالصة حمراء متبّلة' },
      { id: 'mak-sauce-blanche', name: 'مقرونة Sauce blanche', nameFr: 'Makrouna sauce blanche', price: 17, img: MENU_IMG + 'makrouna-sauce-blanche.webp', desc: 'بان بالدجاج، صالصة بيضاء و فرماج مبشور' },
      { id: 'mak-putanesca',     name: 'مقرونة Putanesca',    nameFr: 'Makrouna putanesca',     price: 15, img: MENU_IMG + 'makrouna-putanesca.webp',     desc: 'سباقيتي بالتن، زيتون، كبّار و صالصة حمراء' },
      { id: 'mak-fruits-mer',    name: 'مقرونة Fruits de mer', nameFr: 'Makrouna fruits de mer', price: 28, img: MENU_IMG + 'makrouna-fruits-mer.webp',   desc: 'سباقيتي بفواكه البحر: قمبري، بوزروق و كلامار' },
      { id: 'mak-escalope',      name: 'مقرونة اسكالوب',      nameFr: 'Makrouna escalope',      price: 13, img: null,                                     desc: '' },
      { id: 'mak-bolognaise',    name: 'مقرونة Bolognaise',   nameFr: 'Makrouna bolognaise',    price: 18, img: MENU_IMG + 'makrouna-bolognaise.webp',    desc: 'سباقيتي بالصالصة الحمراء و قطع الدجاج' },
      { id: 'mak-thon-fromage',  name: 'مقرونة Thon Fromage', nameFr: 'Makrouna thon fromage',  price: 14, img: MENU_IMG + 'makrouna-thon-fromage.webp',  desc: 'سباقيتي بالتن و الفرماج المبشور' },
    ],
  },
  {
    id: 'plat-sauce',
    name: 'Plat + Sauce',
    nameFr: 'Plat + Sauce',
    icon: '🍽️',
    items: [
      { id: 'plat-mixte-terre',    name: 'Mixte Terre',      nameFr: 'Mixte terre',      price: 17, img: MENU_IMG + 'plat-mixte-terre.webp',    desc: 'اسكالوب + مرقاز، بطاطا، سلاطة، مشوية، ثوم و هريسة' },
      { id: 'plat-mixte-mer',      name: 'Mixte Mer',        nameFr: 'Mixte mer',        price: 35, img: null,                                  desc: '' },
      { id: 'plat-dayday',         name: 'Plat DayDay',      nameFr: 'Plat DayDay',      price: 21, img: MENU_IMG + 'plat-dayday.webp',          desc: 'الصحن الخاص متاع الدار: دجاج، بطاطا، سلاطة و صالصات' },
      { id: 'plat-hout',           name: 'حوت',              nameFr: 'Poisson',          price: 20, img: null,                                  desc: '' },
      { id: 'plat-escalope-grille', name: 'اسكالوب Grillé',  nameFr: 'Escalope grillée', price: 13, img: MENU_IMG + 'plat-escalope-grille.webp', desc: 'اسكالوب مشوي، بطاطا، سلاطة، مشوية، ثوم و هريسة' },
      { id: 'plat-escalope-panne',  name: 'اسكالوب Panné',   nameFr: 'Escalope panée',   price: 15, img: null,                                  desc: '' },
      { id: 'plat-tajine',         name: 'طاجين',            nameFr: 'Tajine',           price: 10, img: MENU_IMG + 'plat-tajine.webp',          desc: 'طاجين تونسي، بطاطا، سلاطة، مشوية، ثوم و هريسة' },
      { id: 'plat-merguez',        name: 'مرقاز',            nameFr: 'Merguez',          price: 14, img: MENU_IMG + 'plat-merguez.webp',         desc: 'مرقاز مشوي، بطاطا، سلاطة، مشوية، ثوم و هريسة' },
    ],
  },
  {
    id: 'djaj',
    name: 'دجاج',
    nameFr: 'Poulet',
    icon: '🍗',
    items: [
      { id: 'quart-djaj',        name: 'ربع دجاج',           nameFr: '¼ Poulet',          price: 12, img: MENU_IMG + 'quart-poulet.webp',       desc: 'ربع دجاجة مشوية، بطاطا، سلاطة، مشوية و صالصات' },
      { id: 'nos-djaj-sec',      name: 'نصف دجاج sec',       nameFr: '½ Poulet sec',      price: 12, img: MENU_IMG + 'demi-poulet-sec.webp',    desc: 'نصف دجاجة مشوية مع بطاطا مقلية' },
      { id: 'nos-djaj-complet',  name: 'نصف دجاج complet',   nameFr: '½ Poulet complet',  price: 17, img: MENU_IMG + 'demi-poulet-complet.webp', desc: 'نصف دجاجة، بطاطا، سلاطة، مشوية، ثوم و هريسة' },
      { id: 'djaja-sec',         name: 'دجاجة sec',          nameFr: 'Poulet entier sec', price: 19, img: MENU_IMG + 'poulet-sec.webp',          desc: 'دجاجة كاملة مشوية مع بطاطا مقلية' },
      { id: 'djaja-complet',     name: 'دجاجة complet',      nameFr: 'Poulet entier complet', price: 25, img: MENU_IMG + 'poulet-complet.webp', desc: 'دجاجة كاملة، بطاطا، سلاطة، مشوية، ثوم و هريسة' },
    ],
  },
  {
    id: 'kaskrout',
    name: 'كسكروت',
    nameFr: 'Casse-croûte',
    icon: '🥖',
    items: [
      { id: 'kk-kafteji',  name: 'كسكروت كفتاجي',  nameFr: 'Casse-croûte kafteji',  price: 4,   img: MENU_IMG + 'casse-croute-kafteji.webp',  desc: 'كفتاجي، بصل، معدنوس و زيتون في خبزة سخونة' },
      { id: 'kk-djaj',     name: 'كسكروت دجاج',    nameFr: 'Casse-croûte poulet',   price: 6,   img: MENU_IMG + 'casse-croute-poulet.webp',   desc: 'دجاج مشوي، سلاطة، زيتون و فلفل مشوي' },
      { id: 'kk-thon',     name: 'كسكروت تن',      nameFr: 'Casse-croûte thon',     price: 6.5, img: MENU_IMG + 'casse-croute-thon.webp',     desc: 'تن، سلاطة، زيتون و ترشي' },
      { id: 'kk-merguez',  name: 'كسكروت مرقاز',   nameFr: 'Casse-croûte merguez',  price: 7.5, img: MENU_IMG + 'casse-croute-merguez.webp',  desc: 'مرقاز مشوي، سلاطة، زيتون و فلفل مشوي' },
      { id: 'kk-escalope', name: 'كسكروت اسكالوب', nameFr: 'Casse-croûte escalope', price: 7.5, img: MENU_IMG + 'casse-croute-escalope.webp', desc: 'اسكالوب مشوي، سلاطة، معدنوس و فلفل محمّر' },
      { id: 'kk-kebda',    name: 'كسكروت كبدة',    nameFr: 'Casse-croûte kebda',    price: 8.5, img: null,                                    desc: '' },
    ],
  },
  {
    id: 'idhafat',
    name: 'إضافات',
    nameFr: 'Suppléments',
    icon: '➕',
    items: [
      { id: 'sup-frite',    name: 'فريت',       nameFr: 'Frites',        price: 3,   img: null, desc: '' },
      { id: 'sup-escalope', name: 'اسكالوب',    nameFr: 'Escalope',      price: 5,   img: null, desc: '' },
      { id: 'sup-merguez',  name: 'مرقاز',      nameFr: 'Merguez',       price: 5,   img: null, desc: '' },
      { id: 'sup-kebda',    name: 'كبدة',       nameFr: 'Kebda',         price: 5,   img: null, desc: '' },
      { id: 'sup-thon',     name: 'تن',         nameFr: 'Thon',          price: 3,   img: null, desc: '' },
      { id: 'sup-chorba',   name: 'صحفة شربة',  nameFr: 'Bol de soupe',  price: 3,   img: null, desc: '' },
      { id: 'sup-torchi',   name: 'صحن ترشي',   nameFr: 'Torchi',        price: 1.5, img: MENU_IMG + 'salade-tunisienne.webp', desc: '' },
      { id: 'sup-emballage', name: 'Emballage', nameFr: 'Emballage',     price: 0.5, img: null, desc: '' },
    ],
  },
  {
    id: 'machroubet',
    name: 'مشروبات',
    nameFr: 'Boissons',
    icon: '🥤',
    items: [
      { id: 'canette',     name: 'Canette',    nameFr: 'Canette',            price: 2.5, img: null, desc: '' },
      { id: 'eau-1l',      name: 'ماء 1L',     nameFr: 'Eau 1L',             price: 1.5, img: null, desc: '' },
      { id: 'blel-sghir',  name: 'بلار صغير',  nameFr: 'Boisson petite',     price: 1.5, img: null, desc: '' },
      { id: 'blel-kbir',   name: 'بلار كبير',  nameFr: 'Boisson grande',     price: 3.5, img: null, desc: '' },
    ],
  },
];

/* ── Auto-computation: featured item + category cover ─────────────────
   The most expensive item of each category is flagged `featured`
   and its image (or the priciest item WITH an image) becomes the
   category cover. Changing a price later updates everything. */
CATEGORIES.forEach((cat) => {
  let maxItem = null;
  cat.items.forEach((it) => {
    it.category = cat.id;
    it.categoryName = cat.name;
    it.available = it.available !== false;
    it.featured = false;
    if (it.price != null && (maxItem == null || it.price > maxItem.price)) maxItem = it;
  });
  if (maxItem) maxItem.featured = true;
  // Cover = image of priciest item that has an image
  const withImg = cat.items.filter((i) => i.img && i.price != null)
    .sort((a, b) => b.price - a.price);
  cat.cover = withImg.length ? withImg[0].img : (cat.items.find((i) => i.img)?.img || null);
  cat.coverItem = withImg.length ? withImg[0].id : null;
  cat.minPrice = Math.min(...cat.items.filter(i => i.price != null).map(i => i.price));
});

const ALL_ITEMS = CATEGORIES.flatMap((c) => c.items);

// expose globally
window.DAYDAY_MENU = { categories: CATEGORIES, items: ALL_ITEMS };
