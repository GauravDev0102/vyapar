# Vyapar

A shop-management web app for small local businesses: manage your shop profile,
products, and customer leads from one dashboard, and get a bilingual (Hindi/English)
storefront with WhatsApp ordering and printable QR codes.

## Run it

```bash
cd web
npm install
npm run dev
```

Open http://localhost:3000 — the landing page links into the dashboard.

## How it works today

- **Storage: browser `localStorage` only** (`lib/store.js`).
  All shop/product/lead data lives on the user's device. No database, no API keys,
  nothing to configure — install and it works.
- **No server required.** QR codes are generated in the browser (`lib/qr-client.js`),
  analytics are stored locally (`lib/analytics.js`), and product descriptions can be
  auto-filled with local templates (`lib/description.js`). Data can be exported/imported
  as JSON from the dashboard (export files are version 2; legacy version-1 export files
  import fine and are migrated automatically).
- **Leads carry stable ids.** Lead statuses are keyed by lead id (older data keyed by
  array index is migrated on load by `lib/store.js → normalizeLeads()`).

### Deliberately removed / parked

- A designed-but-unwired backend (MongoDB persistence, Cloudinary image upload,
  OpenAI descriptions, NextAuth sign-in, server analytics) is parked in
  `web/_parked-api/` — see that folder's README for env vars and npm packages needed
  to wire it back in.
- `lib/store-client.js` is the client half of that future server store; nothing
  imports it yet.
- Image upload is parked: product photos are set via a URL while uploading needs
  Cloudinary (or similar) on the server.

## Stack

- Next.js 16 (Pages Router, Turbopack), React 19, Tailwind CSS 4, framer-motion, qrcode
- `mobile/` — Expo/React Native companion (placeholder)

## Roadmap ideas

- Wire `_parked-api` routes for server persistence + image upload + real AI descriptions
- Auth + multi-tenant shops (currently single-shop, browser-local)
- Split `pages/dashboard.js` into per-section components
