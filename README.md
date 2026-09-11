# ديْ ديْ DAYDAY – أكلة شعبية · Digital QR Menu

## Project Overview
- **Name**: ديْ ديْ (DAYDAY) digital menu
- **Goal**: Fast, mobile-first QR menu — customers pick a dish in seconds, then order at the caisse (Self-Service, no online ordering)
- **Language**: Tunisian Derja (Arabic script + French mix), full RTL

## Design (v2 — fast one-tap menu)
Redesigned after client feedback ("too basic and long"):
- **Category tabs** at the top (with round photo thumbnails) — one tap shows ONE category panel instantly, no long scrolling
- **Compact row cards**: photo + name + price only (no descriptions)
- **Featured hero card** at the top of each category = auto-computed priciest item, badge "⭐ À découvrir"
- **Inline price chips**: الكل / أقل من 10 DT / 10–20 DT / أكثر من 20 DT
- **Always-visible search** in the sticky header (Arabic-normalized + French accent folding), global results with category tags
- Self-service one-liner strip under the header
- Extras strip (lablabi add-ons) inside the lablabi panel

## Data Architecture
- **Source of truth**: `public/static/menu-data.js` — 10 categories, 63 items transcribed from the real menu boards (never invent prices; unknown price → `null` → "السوم في الـcaisse")
- **Auto-computed**: `featured` (priciest per category) + category `cover` (priciest item with photo) + `minPrice` — update automatically when prices change
- **Images**: 38 real food photos in `public/static/menu/*.webp` + brand assets `logo-dayday.webp`, `chef-dayday.webp`
- No backend storage — fully static SPA (vanilla JS), Hono worker only serves `/api/health`

## URLs
- **Sandbox preview**: served by PM2 + wrangler on port 3000
- **Deploy targets**: Vercel (static, `vercel.json` → `public/`) or Cloudflare Pages (`npm run build` → `dist/`)

## User Guide
1. Scan the QR → menu opens on the first category
2. Tap a category tab → its dishes appear instantly (featured dish on top)
3. Filter by price chips or search "شنوّة تشهّيك؟"
4. Note your choice and عَدّي الـcommande للـcaisse 😋

## Editing the Menu
Edit `public/static/menu-data.js` only: change `price`, add/remove items, set `img` path. Featured item and category covers recompute automatically.

## Deployment
- **Platform**: Vercel (static) / Cloudflare Pages
- **Tech Stack**: Vanilla JS SPA + Hono (health only) + TailwindCSS-free custom CSS · Cairo/Changa fonts
- **Build**: `npm run build` (vite → dist/)
- **Last Updated**: 2026-09-11
