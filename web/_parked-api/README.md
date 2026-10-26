# Parked API routes

These finished-but-unwired routes were moved out of `pages/api/` on 2026-10-26 so
`npm run build` works **without** their missing npm dependencies (`openai`,
`mongodb`, `cloudinary`, `next-auth`). Next.js only compiles files under `pages/`,
so code parked here is never built and cannot break install.

## What's here

| File | Purpose | Needs (env) | Needs (npm) |
|---|---|---|---|
| `store.js` | Server-side shop/products/leads persistence | `MONGODB_URI` | `mongodb` |
| `store-mongodb.js` | The MongoDB storage layer used by `store.js` | `MONGODB_URI` | `mongodb` |
| `upload.js` | Product image upload | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | `cloudinary` |
| `ai-product-description.js` | AI-generated product descriptions | `OPENAI_API_KEY` (optional `AI_MODEL`) | `openai` |
| `qr.js` | QR code generation for shop links | — | (`qrcode` if restored) |
| `analytics.js` | Shop analytics endpoints | — | — |
| `auth/[...nextauth].js` | Sign-in (Google + email magic link) | Google/email OAuth + SMTP creds, `NEXTAUTH_SECRET` | `next-auth` (+ `nodemailer` for email) |

## How to restore

1. Move the wanted files back under `pages/api/` (keep `store-mongodb.js` in `lib/`,
   and move the auth folder back too).
2. `npm i openai mongodb cloudinary next-auth` (as needed).
3. Create `web/.env` from the env column above and restart `npm run dev`.
4. All UI pages persist via `lib/store.js` (localStorage). When server persistence
   is added, pages swap to the `/api/store` calls in `lib/store-client.js`
   (keep it in sync with `lib/store.js` as the API surface).
