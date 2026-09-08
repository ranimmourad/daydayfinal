# DAYDAY – أكلة شعبية · Digital Menu

## Project Overview
- **Name**: DAYDAY Digital Menu (منيو داي داي)
- **Goal**: Mobile-first QR digital menu (catalogue only — NO online ordering) for the Tunisian restaurant DAYDAY. Customers browse, choose, then order & pay at the caisse (Self-Service).
- **Language**: Tunisian Derja (Arabic script, RTL) mixed naturally with French.

## Currently Completed Features
- ✅ Hero welcome with DAYDAY chef branding + Self-Service explainer (المنيو ← اختار ← La caisse)
- ✅ 10 real categories / 63 real items transcribed from the restaurant's menu boards (source of truth — no invented prices)
- ✅ Real food photos (38 optimized `.webp`, converted from provided images, ~25% lighter)
- ✅ Instant search ("شنوّة تشهّيك؟") — Arabic-normalized + French accent-insensitive, multi-word
- ✅ Filter bottom sheet: categories (multi-select) + price ranges
- ✅ Category nav cards — cover image auto-selected = most expensive item with a photo
- ✅ "⭐ À découvrir" badge auto-computed = most expensive item per category (updates automatically when prices change)
- ✅ Sticky header + sticky category chip bar with scrollspy
- ✅ Lablabi extras strip (عظمة، زيت زيتونة، تن، ترشي) from the real board
- ✅ Back-to-top, no-results state ("ما لقيناش اللّي تفتّش عليه 😅"), image lazy-loading + fade-in
- ✅ Responsive: 1col mobile → 2 → 3 → 4 cols desktop · RTL · reduced-motion · keyboard focus rings
- ✅ Items with no photo/price on the boards stay editable placeholders (nothing invented)

## URLs
- **Sandbox preview**: https://3000-ij83mz0ie681u3xrqs49k-0e616f0a.sandbox.novita.ai
- **Production**: deploy to Vercel (see below)
- **API**: `/api/health` (Cloudflare preview only; Vercel build is 100% static)

## Deployment

### Vercel (primary target)
The app is **fully static** — `public/` is the site root, zero build step.
```bash
# Option A: CLI
npm i -g vercel
cd webapp && vercel --prod        # vercel.json sets outputDirectory=public, no build

# Option B: Git import on vercel.com
# Framework preset: "Other" · Build command: (empty) · Output directory: public
```

### Cloudflare Pages (also supported)
```bash
npm run build && npx wrangler pages deploy dist
```

### Local sandbox
```bash
npm run build && pm2 start ecosystem.config.cjs   # wrangler pages dev dist :3000
```

## Data Architecture
- **Storage**: none needed — menu lives in `public/static/menu-data.js` (single editable file)
- **Models**:
  - `Category { id, name, nameFr, icon, items[], extras[]?, cover*, coverItem*, minPrice* }`
  - `Item { id, name, nameFr, price, img, desc, category*, available, featured* }`
  - `*` = auto-computed: `featured` = highest price in category; `cover` = photo of priciest item with an image. Change a price → highlight & cover update automatically.
- `price: null` → card shows "السوم في الـcaisse" (never invented).

## Project Structure
```
webapp/
├── public/
│   ├── index.html            # static entry (Vercel serves this directly)
│   ├── _routes.json          # CF Pages: worker only handles /api/*
│   └── static/
│       ├── style.css         # design system (brand yellow/red/cream)
│       ├── app.js            # vanilla JS app (render/search/filter/nav)
│       ├── menu-data.js      # ★ SINGLE SOURCE OF TRUTH — edit menu here
│       ├── chef-dayday.webp  # brand assets
│       └── menu/*.webp       # 38 real food photos
├── src/index.tsx             # tiny Hono worker (CF preview only)
├── vercel.json               # static deploy config + cache headers
├── vite.config.ts / wrangler.jsonc / ecosystem.config.cjs
```

## User Guide
1. Scan the QR → menu opens with the Self-Service message.
2. Browse category cards or the sticky chip bar; tap → scrolls to the section.
3. Search "شنوّة تشهّيك؟" or filter (⚙️) by category/price.
4. Choose your meal → go to **la caisse** to order & pay. لا توجد طلبات أونلاين.

## Features Not Yet Implemented
- Admin dashboard to edit `menu-data.js` via UI
- Per-item photos for the ~20 board items without provided photos (placeholders shown)
- Contact/location in footer (not provided — intentionally omitted)
- PWA offline caching

## Recommended Next Steps
1. Deploy to Vercel & point the QR code at the production URL
2. Provide photos for the remaining items (drop into `public/static/menu/`, set `img` in `menu-data.js`)
3. Optional lightweight admin page (edit JSON → commit)
4. Add restaurant address/phone/hours to the footer when provided

## Tech Stack
- Vanilla JS + CSS (no framework runtime) · Hono (CF preview only) · Vite · fonts: Cairo + Changa
- **Platform**: Vercel static (primary) / Cloudflare Pages (secondary)
- **Last Updated**: 2026-09-08
