# Sitara — Fine Jewellery

A Lahore house of hallmarked 22k gold, kundan, and the quiet pieces Pakistani women actually live in.

## Stack

TanStack Start (React 19) + Tailwind v4 + Postgres (Neon in production, PGLite in preview). One app, one schema: catalog, stock, orders, loyalty, staff.

## Local run

```bash
npm install
npm run dev
```

The app listens on port 8080. Auth and the database are provisioned by the host in production. Do not add a `.env` file in this workspace.

### Optional host variables (production)

| Name | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon Postgres |
| `XAI_API_KEY` | Sitara concierge (Grok) |

JazzCash, Easypaisa, and card stay **disabled** until merchant ids are saved in `/atelier` → Settings. Filling them does not mark an order paid — the desk confirms.

## Database

- `migrations/0001_auth.sql` — Better Auth
- `migrations/0002_store.sql` — stock, orders, reviews, loyalty, settings
- `migrations/0003_commerce.sql` — catalog, coupons, staff, honest payment/shipment columns

`npm run build` applies migrations.

## Admin

The first signed-in keeper **claims** `/atelier`. After that only staff can edit products, stock, prices, orders, coupons, and payment credentials.

## Tests

```bash
npm test
npm run typecheck
```

## Payments & shipping

- Totals (price, shipping, coupons, coins, gift wrap) are calculated on the server. The browser is not trusted.
- COD is a store setting.
- Bank transfer / Raast appear when an IBAN is saved.
- JazzCash, Easypaisa, and cards are unavailable until configured, and never simulate a successful charge.
- Shipping estimates mimic Leopard / TCS / Call Courier; complimentary over the desk’s threshold.

## Site map

`/`, `/shop`, `/shop/:slug`, `/bridal`, `/gifts`, `/arrivals`, `/bestsellers`, `/collections`, `/category/:slug`, `/journal`, `/craft`, `/try-on`, `/stack`, `/finder`, `/quiz`, `/match`, `/lookbook`, `/care`, `/size-guide`, `/returns`, `/contact`, `/track`, `/cart`, `/checkout`, `/account`, `/wishlist`, `/atelier`, `/login`

## Brand

Ivory, ink, champagne gold, deep emerald. Sitara is a star — not a template.
