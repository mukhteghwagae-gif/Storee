# Sitara Atelier — desk guide

Sign in, then open **Private office** (`/atelier`). If the house has no keeper yet, **Claim the atelier**. After that, only staff see the desk.

## Dashboard
Counts come from real orders and events. Abandoned bags are stored snapshots — email recovery is not connected.

## Products
Create or edit a piece without touching code: name, slug, price, stock, collection, images, publish flags, featured / new / best seller. Hidden pieces leave the storefront.

## Orders
Advance: Pending → Confirmed → Processing → Packed → Dispatched → Out for delivery → Delivered. Cancel restocks. **Mark paid** / **Cash collected** is the only way an order becomes paid. The website never pretends a JazzCash or card charge succeeded.

## Customers, reviews, coupons, enquiries
Profiles, collector reviews (removable), coupon codes, and contact notes.

## Settings
- Cash on delivery
- Free-shipping threshold
- WhatsApp
- Bank / IBAN / Raast (enables bank transfer at checkout)
- JazzCash merchant, Easypaisa store, card public key — leave empty to keep those methods disabled
- Homepage hero copy

## Collector account
Orders, tracking, cancel (early statuses), returns (after delivery), addresses, wishlist, referral code.

## Tracking
`/track` — order id or token plus the checkout mobile. Live courier scans are not connected.

## Concierge
The chat bubble answers from the catalog when `XAI_API_KEY` is present. Otherwise it tells the guest to WhatsApp.
