/**
 * DAYDAY – ديْ ديْ · أكلة شعبية
 * Fast one-tap digital menu: tabs → one category panel at a time.
 */
(function () {
  'use strict';

  const DATA = window.DAYDAY_MENU;
  if (!DATA) return;

  const state = {
    cat: DATA.categories[0].id,
    query: '',
    price: 'all', // all | lt10 | 10-20 | gt20
  };

  /* ── Helpers ─────────────────────────────────── */
  const esc = (s) =>
    String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));

  const fmtPrice = (p) => {
    if (p == null) return null;
    const n = Number(p);
    return Number.isInteger(n) ? String(n) : String(n).replace(/\.0$/, '');
  };

  const normalize = (s) =>
    String(s || '')
      .toLowerCase()
      .replace(/[\u064B-\u065F\u0670]/g, '')
      .replace(/[أإآٱ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/ؤ/g, 'و')
      .replace(/ئ/g, 'ي')
      .replace(/[éèêë]/g, 'e')
      .replace(/[àâä]/g, 'a')
      .replace(/[ùûü]/g, 'u')
      .replace(/[îï]/g, 'i')
      .replace(/ô/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/\s+/g, ' ')
      .trim();

  const matchPrice = (p) => {
    if (state.price === 'all') return true;
    if (p == null) return false;
    if (state.price === 'lt10') return p < 10;
    if (state.price === '10-20') return p >= 10 && p <= 20;
    if (state.price === 'gt20') return p > 20;
    return true;
  };

  const priceHTML = (p, cls) => {
    const f = fmtPrice(p);
    return f == null
      ? `<span class="${cls} noprice">السوم في الـcaisse</span>`
      : `<span class="${cls}">${f}<span class="dt"> DT</span></span>`;
  };

  const imgTag = (src, alt, cls) =>
    `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async"${cls ? ` class="${cls}"` : ''} onload="this.classList.add('loaded')" onerror="this.remove()">`;

  /* ── Render pieces ───────────────────────────── */
  const rowCard = (it, showCat) => `
    <article class="row-card${it.featured ? ' is-feat' : ''}" id="item-${esc(it.id)}">
      ${it.featured ? '<span class="row-feat-star">⭐ À découvrir</span>' : ''}
      <div class="row-thumb">
        ${it.img ? imgTag(it.img, it.name) : `<span class="noimg" aria-hidden="true">${esc(it.icon)}</span>`}
      </div>
      <div class="row-info">
        <div class="row-name">${esc(it.name)}<span class="fr">${esc(it.nameFr || '')}</span></div>
        ${showCat ? `<div class="row-cat">${esc(it.icon)} ${esc(it.categoryName)}</div>` : ''}
      </div>
      ${priceHTML(it.price, 'row-price')}
    </article>`;

  const featCard = (it) => `
    <article class="feat-card" id="feat-${esc(it.id)}">
      <div class="f-img">
        <span class="feat-badge">⭐ À découvrir</span>
        ${it.img ? imgTag(it.img, it.name) : `<span class="f-noimg" aria-hidden="true">${esc(it.icon)}</span>`}
      </div>
      <div class="f-row">
        <div class="f-name">${esc(it.name)}<span class="fr">${esc(it.nameFr || '')}</span></div>
        ${priceHTML(it.price, 'f-price')}
      </div>
    </article>`;

  const extrasStrip = (extras) => {
    if (!extras || !extras.length) return '';
    return `
      <div class="extras-strip">
        <div class="extras-title">➕ زيد على اللبلابي</div>
        <ul>${extras
          .map((e) => `<li>${esc(e.name)} <b>${fmtPrice(e.price)} DT</b></li>`)
          .join('')}</ul>
      </div>`;
  };

  const noResults = () => `
    <div class="no-results">
      <div class="emoji">🍽️</div>
      <p>ما لقينا شيء بهذا الاسم</p>
      <small>جرّب كلمة أخرى ولا تصفّح الأصناف</small>
      <button type="button" id="reset-btn">شوف المنيو الكامل</button>
    </div>`;

  /* ── Main render ─────────────────────────────── */
  function renderShell() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <header class="site-header">
        <div class="header-row">
          <div class="brand">
            <img src="/static/chef-dayday.webp" alt="شيف ديْ ديْ" class="brand-logo" onload="this.classList.add('loaded')" onerror="this.remove()">
            <img src="/static/logo-wordmark.webp" alt="ديْ ديْ – أكلة شعبيّة" class="brand-wordmark" onload="this.classList.add('loaded')" onerror="this.remove()">
          </div>
          <div class="header-search">
            <span class="icon" aria-hidden="true">🔍</span>
            <input type="search" id="search-input" placeholder="شنوّة تشهّيك؟" autocomplete="off" enterkeyhint="search" aria-label="لوّج في المنيو">
            <button type="button" class="search-clear" id="search-clear" aria-label="امسح">✕</button>
          </div>
        </div>
        <div class="ss-strip">إحنا <b>Self-Service</b> 👋 اختار اللّي يشهّيك و عَدّي الـ<b>commande</b> للـ<b>caisse</b></div>
        <nav class="tabs" id="tabs" aria-label="أصناف المنيو">
          <div class="tabs-inner">
            ${DATA.categories
              .map(
                (c) => `
              <button type="button" class="tab${c.id === state.cat ? ' active' : ''}" data-cat="${esc(c.id)}" aria-pressed="${c.id === state.cat}">
                <span class="t-media">${c.cover ? imgTag(c.cover, c.name) : `<span aria-hidden="true">${esc(c.icon)}</span>`}</span>
                <span class="t-name">${esc(c.name)}</span>
              </button>`
              )
              .join('')}
          </div>
        </nav>
      </header>
      <main>
        <div class="toolbar" id="toolbar">
          <span class="count" id="count"></span>
          <button type="button" class="price-chip" data-price="all">الكل</button>
          <button type="button" class="price-chip" data-price="lt10">أقل من 10 DT</button>
          <button type="button" class="price-chip" data-price="10-20">10 – 20 DT</button>
          <button type="button" class="price-chip" data-price="gt20">أكثر من 20 DT</button>
        </div>
        <section id="panel-wrap"></section>
      </main>
      <footer class="site-footer">
        <img src="/static/chef-dayday.webp" alt="شيف ديْ ديْ" class="footer-logo" onload="this.classList.add('loaded')" onerror="this.remove()">
        <img src="/static/logo-wordmark.webp" alt="ديْ ديْ" class="footer-wordmark" onload="this.classList.add('loaded')" onerror="this.remove()">
        <div class="footer-tag">أكلة شعبية · Self-Service</div>
        <div class="footer-msg">يعطيكم الصحّة ❤️</div>
        <div class="footer-note">الأسعار بالدينار التونسي (DT) · تتغيّر حسب المطعم</div>
      </footer>
      <button type="button" class="back-top" id="back-top" aria-label="ارجع للفوق">↑</button>
    `;
    bindEvents();
    renderPanel();
  }

  function renderPanel() {
    const wrap = document.getElementById('panel-wrap');
    const container = document.getElementById('app');
    const searching = state.query.length > 0;
    container.classList.toggle('searching', searching);

    let html = '';
    let count = 0;

    if (searching) {
      const q = normalize(state.query);
      const results = DATA.items.filter(
        (it) =>
          matchPrice(it.price) &&
          (normalize(it.name).includes(q) ||
            normalize(it.nameFr).includes(q) ||
            normalize(it.categoryName).includes(q))
      );
      count = results.length;
      if (!results.length) {
        html = `<div class="panel">${noResults()}</div>`;
      } else {
        html = `
          <div class="panel">
            <div class="results-title">نتيجة اللّوجان: <b>${count}</b> ${count === 1 ? 'ماكلة' : 'ماكلة'} 😋</div>
            <div class="rows">${results.map((it) => rowCard(it, true)).join('')}</div>
          </div>`;
      }
    } else {
      const cat = DATA.categories.find((c) => c.id === state.cat) || DATA.categories[0];
      const items = cat.items.filter((it) => matchPrice(it.price));
      count = items.length;
      const feat = items.find((it) => it.featured && it.img);
      const rest = feat ? items.filter((it) => it !== feat) : items;
      if (!items.length) {
        html = `<div class="panel">${noResults()}</div>`;
      } else {
        html = `
          <div class="panel">
            ${feat ? featCard(feat) : ''}
            <div class="rows">${rest.map((it) => rowCard(it, false)).join('')}</div>
            ${extrasStrip(cat.extras)}
          </div>`;
      }
    }

    wrap.innerHTML = html;
    const countEl = document.getElementById('count');
    if (countEl) countEl.textContent = `${count} ماكلة`;

    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn)
      resetBtn.addEventListener('click', () => {
        state.query = '';
        state.price = 'all';
        const input = document.getElementById('search-input');
        if (input) input.value = '';
        syncSearchClear();
        syncChips();
        renderPanel();
      });
  }

  /* ── UI sync ─────────────────────────────────── */
  function syncTabs() {
    document.querySelectorAll('.tab').forEach((t) => {
      const on = t.dataset.cat === state.cat;
      t.classList.toggle('active', on);
      t.setAttribute('aria-pressed', String(on));
    });
  }

  function syncChips() {
    document.querySelectorAll('.price-chip').forEach((c) => {
      c.classList.toggle('active', c.dataset.price === state.price);
    });
  }

  function syncSearchClear() {
    const btn = document.getElementById('search-clear');
    if (btn) btn.classList.toggle('visible', state.query.length > 0);
  }

  /* ── Events ──────────────────────────────────── */
  function bindEvents() {
    document.getElementById('tabs').addEventListener('click', (e) => {
      const tab = e.target.closest('.tab');
      if (!tab) return;
      state.cat = tab.dataset.cat;
      // leaving search mode when a tab is tapped
      if (state.query) {
        state.query = '';
        const input = document.getElementById('search-input');
        if (input) input.value = '';
        syncSearchClear();
      }
      syncTabs();
      renderPanel();
    });

    document.getElementById('toolbar').addEventListener('click', (e) => {
      const chip = e.target.closest('.price-chip');
      if (!chip) return;
      state.price = chip.dataset.price;
      syncChips();
      renderPanel();
    });

    const input = document.getElementById('search-input');
    let deb;
    input.addEventListener('input', () => {
      clearTimeout(deb);
      deb = setTimeout(() => {
        state.query = input.value.trim();
        syncSearchClear();
        renderPanel();
      }, 120);
    });

    document.getElementById('search-clear').addEventListener('click', () => {
      input.value = '';
      state.query = '';
      syncSearchClear();
      renderPanel();
      input.focus();
    });

    const backTop = document.getElementById('back-top');
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    window.addEventListener(
      'scroll',
      () => backTop.classList.toggle('visible', window.scrollY > 500),
      { passive: true }
    );
  }

  /* ── Init ────────────────────────────────────── */
  syncChipsAfterShell();

  function syncChipsAfterShell() {
    renderShell();
    syncChips();
    syncSearchClear();
  }
})();
