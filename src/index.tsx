import { Hono } from 'hono'

/**
 * DAYDAY digital menu is a fully static app (public/index.html).
 * This worker only exists for the Cloudflare Pages preview/deploy path;
 * static assets (including index.html) are served before the worker runs.
 * On Vercel, the app deploys as a pure static site (see vercel.json).
 */
const app = new Hono()

app.get('/api/health', (c) => c.json({ ok: true, app: 'dayday-menu' }))

export default app
