/* ══════════════════════════════════════════════════════
   DAYDAY – أكلة شعبية · Digital Menu App
   Pure vanilla JS, renders from window.DAYDAY_MENU.
   ══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const { categories, items } = window.DAYDAY_MENU;

  /* ── State ── */
  const state = {
    query: '',
    filterCats: new Set(),   // empty = all
    priceRange: null,        // null = all, else [min, max]
  };

  const PRICE_RANGES = [
    { id: 'p1', label: 'أقل من 10 DT', min: 0, max: 9.99 },
    { id: 'p2', label: '10 – 20 DT', min: 10, max: 20 },
    { id: 'p3', label: 'أكثر من 20 DT', min: 20.01, max: Infinity },
  ];

  /* ── Helpers ── */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function fmtPrice(p) {
    if (p == null) return null;
    return (p % 1 === 0 ? String(p) : p.toFixed(1)).replace(/\.0$/, '');
  }

  function normalize(s) {
    return (s || '')
      .toLowerCase()
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/[ًٌٍَُِّْ]/g, '')
      .replace(/[éèêë]/g, 'e')
      .replace(/[àâ]/g, 'a')
      .replace(/[ûù]/g, 'u')
      .replace(/ô/g, 'o')
      .replace(/ç/g, 'c');
  }

  function matchesSearch(item, q) {
    if (!q) return true;
    const hay = normalize(
      item.name + ' ' + (item.nameFr || '') + ' ' + (item.desc || '') + ' ' + (item.categoryName || '')
    );
    return q.split(/\s+/).every((w) => hay.includes(w));
  }

  function matchesFilters(item) {
    if (state.filterCats.size && !state.filterCats.has(item.category)) return false;
    if (state.priceRange) {
      if (item.price == null) return false;
      const [min, max] = state.priceRange;
      if (item.price < min || item.price > max) return false;
    }
    return true;
  }

  function itemVisible(item) {
    return item.available && matchesSearch(item, normalize(state.query.trim())) && matchesFilters(item);
  }

  /* ── Render: static shell ── */
  function render() {
    const app = $('#app');
    app.innerHTML = `
      <header class="site-header">
        <div class="header-row">
          <div class="brand">
            <img class="brand-logo" src="/static/chef-dayday.webp" alt="شيف داي داي" width="44" height="44" />
            <div class="brand-text">
              <div class="brand-name">DAYDAY</div>
              <div class="brand-tag">أكلة شعبيّة</div>
            </div>
          </div>
          <button class="header-search-btn" id="header-search-btn" aria-label="فتّش في المنيو">🔎</button>
        </div>
        <nav class="cat-bar" aria-label="أقسام المنيو">
          <div class="cat-bar-inner" id="cat-bar-inner">
            <button class="cat-chip active" data-target="top">🏠 الكل</button>
            ${categories.map((c) => `
              <button class="cat-chip" data-target="cat-${c.id}">${c.icon} ${c.name}</button>
            `).join('')}
          </div>
        </nav>
      </header>

      <section class="hero" id="top">
        <div class="hero-inner">
          <img class="hero-chef" src="/static/chef-dayday.webp" alt="شيف داي داي" width="108" height="108" />
          <h1 class="hero-title">داي داي</h1>
          <p class="hero-sub">DAYDAY · أكلة شعبيّة</p>
          <section class="selfservice-card" aria-label="طريقة الطلب">
            <p class="selfservice-title">إحنا Self-Service 👋</p>
            <p class="selfservice-text">اختار اللّي يشهّيك و عَدّي الـcommande للـcaisse</p>
            <div class="selfservice-steps" aria-hidden="true">
              <div class="ss-step"><span class="ss-icon">📖</span><span class="ss-label">المنيو</span></div>
              <span class="ss-arrow">←</span>
              <div class="ss-step"><span class="ss-icon">😋</span><span class="ss-label">اختار</span></div>
              <span class="ss-arrow">←</span>
              <div class="ss-step"><span class="ss-icon">💰</span><span class="ss-label">La caisse</span></div>
            </div>
          </section>
        </div>
      </section>

      <div class="search-zone">
        <div class="search-row">
          <div class="search-box">
            <span class="icon" aria-hidden="true">🔎</span>
            <input type="search" id="search-input" placeholder="شنوّة تشهّيك؟"
                   aria-label="فتّش على أكلة" autocomplete="off" enterkeyhint="search" />
            <button class="search-clear" id="search-clear" aria-label="امسح البحث">✕</button>
          </div>
          <button class="filter-btn" id="filter-btn" aria-label="فلترة المنيو" aria-haspopup="dialog">
            <span aria-hidden="true">⚙️</span>
            <span class="filter-badge" id="filter-badge"></span>
          </button>
        </div>
      </div>

      <main>
        <section id="cat-nav-section" aria-label="الأقسام">
          <div class="section-heading"><h2>🍽️ الأقسام</h2><div class="line"></div></div>
          <div class="cat-grid" id="cat-grid"></div>
        </section>

        <div id="menu-sections"></div>

        <div class="no-results" id="no-results">
          <div class="emoji">😅</div>
          <p>ما لقيناش اللّي تفتّش عليه</p>
          <small>جرّب كلمة أخرى ولا نحّي الفلاتر</small><br />
          <button id="reset-all-btn">رجّع الكل</button>
        </div>
      </main>

      <footer class="site-footer">
        <img class="footer-logo" src="/static/chef-dayday.webp" alt="" width="66" height="66" />
        <div class="footer-name">DAYDAY</div>
        <div class="footer-tag">أكلة شعبيّة</div>
        <p class="footer-msg">يعطيكم الصحّة ❤️</p>
        <p class="footer-note">الأسعار بالدينار التونسي (DT) · Self-Service · الطلب و الخلاص في الـcaisse</p>
      </footer>

      <button class="back-top" id="back-top" aria-label="ارجع للفوق">↑</button>

      <div class="sheet-overlay" id="sheet-overlay"></div>
      <div class="sheet" id="filter-sheet" role="dialog" aria-modal="true" aria-label="فلترة المنيو">
        <div class="sheet-handle" aria-hidden="true"></div>
        <h3>فلتري كيما تحب 🎛️</h3>
        <div class="sheet-group">
          <div class="g-label">الأقسام</div>
          <div class="pill-row" id="pill-cats">
            <button class="pill active" data-cat="all">الكل</button>
            ${categories.map((c) => `<button class="pill" data-cat="${c.id}">${c.icon} ${c.name}</button>`).join('')}
          </div>
        </div>
        <div class="sheet-group">
          <div class="g-label">السوم</div>
          <div class="pill-row" id="pill-price">
            <button class="pill active" data-price="all">الكل</button>
            ${PRICE_RANGES.map((r) => `<button class="pill" data-price="${r.id}">${r.label}</button>`).join('')}
          </div>
        </div>
        <div class="sheet-actions">
          <button class="apply" id="sheet-apply">شوف النتيجة ✅</button>
          <button class="reset" id="sheet-reset">صفّر</button>
        </div>
      </div>
    `;

    renderCategoryCards();
    renderMenuSections();
    bindEvents();
  }

  /* ── Render: category nav cards ── */
  function renderCategoryCards() {
    const grid = $('#cat-grid');
    grid.innerHTML = categories.map((c) => {
      const visible = c.items.filter(itemVisible).length;
      const media = c.cover
        ? `<img src="${c.cover}" alt="${c.name}" loading="lazy" width="400" height="216" onload="this.classList.add('loaded')" />`
        : `<div class="cat-card-noimg" aria-hidden="true">${c.icon}</div>`;
      return `
        <button class="cat-card" data-target="cat-${c.id}" aria-label="قسم ${c.name}">
          ${media}
          <span class="cat-card-label">
            <span class="cat-card-name">${c.icon} ${c.name}</span>
            <span class="cat-card-count">${visible} أكلة</span>
          </span>
        </button>`;
    }).join('') + `
      <button class="cat-card all-card" data-target="menu-sections" aria-label="شوف المنيو الكامل">
        <div class="cat-card-noimg">الكل 👇</div>
        <span class="cat-card-label">
          <span class="cat-card-name">المنيو الكامل</span>
          <span class="cat-card-count">${items.filter(itemVisible).length} أكلة</span>
        </span>
      </button>`;
  }

  /* ── Render: item card ── */
  function itemCard(item) {
    const price = fmtPrice(item.price);
    const media = item.img
      ? `<img src="${item.img}" alt="${item.name}" loading="lazy" width="480" height="300" onload="this.classList.add('loaded')" />`
      : `<div class="item-noimg"><span class="emoji" aria-hidden="true">${categoryIcon(item.category)}</span><span class="txt">DAYDAY</span></div>`;
    return `
      <article class="item-card${item.featured ? ' featured' : ''}" data-id="${item.id}">
        <div class="item-img-wrap">
          ${item.featured ? '<span class="featured-badge">⭐ À découvrir</span>' : ''}
          ${media}
        </div>
        <div class="item-body">
          <h3 class="item-name">${item.name}${item.nameFr && item.nameFr !== item.name ? `<span class="fr">${item.nameFr}</span>` : ''}</h3>
          ${item.desc ? `<p class="item-desc">${item.desc}</p>` : ''}
          <div class="item-footer">
            ${price != null
              ? `<span class="item-price">${price} <span class="dt">DT</span></span>`
              : `<span class="item-price noprice">السوم في الـcaisse</span>`}
            <span class="item-cat-tag">${item.categoryName}</span>
          </div>
        </div>
      </article>`;
  }

  function categoryIcon(catId) {
    const c = categories.find((x) => x.id === catId);
    return c ? c.icon : '🍽️';
  }

  /* ── Render: menu sections ── */
  function renderMenuSections() {
    const wrap = $('#menu-sections');
    let anyVisible = false;

    wrap.innerHTML = categories.map((c) => {
      const vis = c.items.filter(itemVisible);
      if (!vis.length) return '';
      anyVisible = true;
      const extras = (c.extras && !state.query && !state.priceRange)
        ? `<div class="extras-strip">
             <div class="extras-title">إضافات على الـ${c.name} ➕</div>
             <ul>${c.extras.map((e) => `<li>${e.name} <b>${fmtPrice(e.price)} DT</b></li>`).join('')}</ul>
           </div>`
        : '';
      return `
        <section class="menu-section" id="cat-${c.id}" aria-label="${c.name}">
          <div class="menu-section-header">
            <span class="cat-icon" aria-hidden="true">${c.icon}</span>
            <h2>${c.name}</h2>
            <span class="fr">${c.nameFr}</span>
          </div>
          <p class="menu-section-sub">${vis.length} أكلة · تبدا من ${fmtPrice(c.minPrice)} DT</p>
          <div class="items-grid">${vis.map(itemCard).join('')}</div>
          ${extras}
        </section>`;
    }).join('');

    $('#no-results').classList.toggle('visible', !anyVisible);
    $('#cat-nav-section').style.display =
      (state.query || state.filterCats.size || state.priceRange) ? 'none' : '';
  }

  /* ── Re-render dynamic parts only ── */
  function refresh() {
    renderMenuSections();
    renderCategoryCards();
    updateFilterBadge();
  }

  function updateFilterBadge() {
    const n = (state.filterCats.size ? 1 : 0) + (state.priceRange ? 1 : 0);
    const badge = $('#filter-badge');
    badge.textContent = n;
    badge.classList.toggle('visible', n > 0);
  }

  /* ── Events ── */
  function bindEvents() {
    // Search
    const input = $('#search-input');
    const clearBtn = $('#search-clear');
    let t;
    input.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        state.query = input.value;
        clearBtn.classList.toggle('visible', !!input.value);
        refresh();
      }, 120);
    });
    clearBtn.addEventListener('click', () => {
      input.value = ''; state.query = '';
      clearBtn.classList.remove('visible');
      refresh(); input.focus();
    });
    $('#header-search-btn').addEventListener('click', () => {
      $('.search-zone').scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => input.focus({ preventScroll: true }), 350);
    });

    // Category navigation (chips + cards) — event delegation
    document.addEventListener('click', (e) => {
      const nav = e.target.closest('[data-target]');
      if (!nav) return;
      const id = nav.dataset.target;
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (id === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Active chip on scroll (scrollspy)
    const chipFor = (id) => $$('.cat-chip').find((c) => c.dataset.target === id);
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          $$('.cat-chip').forEach((c) => c.classList.remove('active'));
          const chip = chipFor(en.target.id);
          if (chip) {
            chip.classList.add('active');
            chip.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
          }
        }
      });
    }, { rootMargin: '-25% 0px -65% 0px' });
    const observeSections = () => $$('.menu-section').forEach((s) => spy.observe(s));
    observeSections();
    // re-observe after re-renders
    const mo = new MutationObserver(observeSections);
    mo.observe($('#menu-sections'), { childList: true });

    // Filter sheet
    const sheet = $('#filter-sheet');
    const overlay = $('#sheet-overlay');
    const openSheet = () => { sheet.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; };
    const closeSheet = () => { sheet.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = ''; };
    $('#filter-btn').addEventListener('click', openSheet);
    overlay.addEventListener('click', closeSheet);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });

    // Category pills (multi-select)
    $('#pill-cats').addEventListener('click', (e) => {
      const pill = e.target.closest('.pill'); if (!pill) return;
      const cat = pill.dataset.cat;
      const pills = $$('#pill-cats .pill');
      if (cat === 'all') {
        state.filterCats.clear();
        pills.forEach((p) => p.classList.toggle('active', p.dataset.cat === 'all'));
      } else {
        state.filterCats.has(cat) ? state.filterCats.delete(cat) : state.filterCats.add(cat);
        pills.forEach((p) => {
          if (p.dataset.cat === 'all') p.classList.toggle('active', state.filterCats.size === 0);
          else p.classList.toggle('active', state.filterCats.has(p.dataset.cat));
        });
      }
      refresh();
    });

    // Price pills (single-select)
    $('#pill-price').addEventListener('click', (e) => {
      const pill = e.target.closest('.pill'); if (!pill) return;
      const id = pill.dataset.price;
      $$('#pill-price .pill').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      if (id === 'all') state.priceRange = null;
      else {
        const r = PRICE_RANGES.find((x) => x.id === id);
        state.priceRange = [r.min, r.max];
      }
      refresh();
    });

    $('#sheet-apply').addEventListener('click', () => {
      closeSheet();
      $('#menu-sections').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    $('#sheet-reset').addEventListener('click', () => {
      state.filterCats.clear(); state.priceRange = null;
      $$('#pill-cats .pill').forEach((p) => p.classList.toggle('active', p.dataset.cat === 'all'));
      $$('#pill-price .pill').forEach((p) => p.classList.toggle('active', p.dataset.price === 'all'));
      refresh();
    });

    // Reset from no-results
    $('#reset-all-btn').addEventListener('click', () => {
      state.query = ''; state.filterCats.clear(); state.priceRange = null;
      input.value = ''; clearBtn.classList.remove('visible');
      $$('#pill-cats .pill').forEach((p) => p.classList.toggle('active', p.dataset.cat === 'all'));
      $$('#pill-price .pill').forEach((p) => p.classList.toggle('active', p.dataset.price === 'all'));
      refresh();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Back to top
    const backTop = $('#back-top');
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('visible', window.scrollY > 700);
    }, { passive: true });
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  render();
})();
