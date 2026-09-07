import { PRODUCTS, type Product } from "@/lib/catalog";
import type { Sql } from "@/lib/db";

export async function ensureCommerceSchema(sql: Sql) {
  await sql.query(`
    create table if not exists catalog_products (
      slug text primary key,
      payload text not null,
      published boolean not null default true,
      updated_at timestamptz not null default now()
    )
  `);
  await sql.query(`
    create table if not exists staff (
      user_id text primary key,
      role text not null default 'admin',
      created_at timestamptz not null default now()
    )
  `);
  await sql.query(`
    create table if not exists coupons (
      code text primary key,
      kind text not null,
      value int not null default 0,
      min_subtotal int not null default 0,
      max_uses int,
      uses int not null default 0,
      active boolean not null default true,
      note text
    )
  `);
  await sql.query(`
    insert into coupons (code, kind, value, min_subtotal, note) values
      ('STARLIGHT10', 'percent', 10, 0, 'Ten percent courtesy'),
      ('STAR5', 'percent', 5, 0, 'Five percent courtesy'),
      ('COIN500', 'fixed', 500, 3000, 'Rs 500 off over Rs 3,000'),
      ('SHIPFREE', 'shipping', 0, 0, 'Complimentary shipping')
    on conflict (code) do nothing
  `);
  await sql.query(`
    create table if not exists addresses (
      id serial primary key,
      user_id text not null,
      label text not null default 'Home',
      name text,
      phone text,
      address_line text not null,
      city text not null,
      is_default boolean not null default false,
      created_at timestamptz not null default now()
    )
  `);
  await sql.query(`
    create table if not exists newsletter_subscribers (
      email text primary key,
      created_at timestamptz not null default now()
    )
  `);
  await sql.query(`
    create table if not exists enquiries (
      id serial primary key,
      name text not null,
      email text,
      phone text,
      message text not null,
      product_id text,
      created_at timestamptz not null default now()
    )
  `);
  await sql.query(`
    create table if not exists return_requests (
      id serial primary key,
      order_id text not null,
      user_id text not null,
      reason text not null,
      status text not null default 'requested',
      created_at timestamptz not null default now()
    )
  `);
  await sql.query(`
    create table if not exists order_events (
      id serial primary key,
      order_id text not null,
      status text not null,
      note text,
      created_at timestamptz not null default now()
    )
  `);
  await sql.query(`
    create table if not exists analytics_events (
      id serial primary key,
      name text not null,
      payload text,
      created_at timestamptz not null default now()
    )
  `);
  const alters = [
    "alter table orders add column if not exists guest_name text",
    "alter table orders add column if not exists gift_wrap boolean not null default false",
    "alter table orders add column if not exists gift_message text",
    "alter table orders add column if not exists payment_status text not null default 'unpaid'",
    "alter table orders add column if not exists shipment_status text not null default 'unfulfilled'",
    "alter table orders add column if not exists tracking_token text",
    "alter table orders add column if not exists coupon_code text",
    "alter table orders add column if not exists return_reason text",
    "alter table orders add column if not exists cancelled_at timestamptz",
    "alter table orders add column if not exists tracking_note text",
    "alter table store_settings add column if not exists bank_name text",
    "alter table store_settings add column if not exists bank_iban text",
    "alter table store_settings add column if not exists bank_account_title text",
    "alter table store_settings add column if not exists raast_id text",
    "alter table store_settings add column if not exists jazzcash_merchant_id text",
    "alter table store_settings add column if not exists easypaisa_store_id text",
    "alter table store_settings add column if not exists card_public_key text",
    "alter table store_settings add column if not exists hero_kicker text",
    "alter table store_settings add column if not exists hero_title text",
    "alter table store_settings add column if not exists hero_dek text",
    "alter table store_settings add column if not exists gift_wrap_pkr int not null default 650",
    "alter table orders add column if not exists coins_used int not null default 0",
    "alter table orders add column if not exists store_credit_used int not null default 0",
    "alter table orders add column if not exists restocked boolean not null default false",
  ];
  for (const q of alters) {
    try {
      await sql.query(q);
    } catch {
      /* column may already exist on older backends */
    }
  }
}

export async function seedCatalog(sql: Sql) {
  await ensureCommerceSchema(sql);
  for (const p of PRODUCTS) {
    await sql`
      insert into catalog_products (slug, payload, published)
      values (${p.slug}, ${JSON.stringify(p)}, true)
      on conflict (slug) do nothing
    `;
  }
  for (const p of PRODUCTS) {
    await sql`
      insert into product_stock (id, stock, sold_count)
      values (${p.slug}, ${p.defaultStock}, 0)
      on conflict (id) do nothing
    `;
  }
}

export function parseProduct(payload: string, slug: string): Product | null {
  try {
    const p = JSON.parse(payload) as Product;
    if (!p || typeof p.price !== "number" || !p.name) return null;
    p.slug = slug;
    return p;
  } catch {
    return null;
  }
}

export async function loadCatalog(sql: Sql, publishedOnly = true): Promise<Product[]> {
  await seedCatalog(sql);
  const rows = publishedOnly
    ? await sql<{ slug: string; payload: string }>`
        select slug, payload from catalog_products where published = true order by slug
      `
    : await sql<{ slug: string; payload: string }>`
        select slug, payload from catalog_products order by slug
      `;
  const out: Product[] = [];
  for (const row of rows) {
    const p = parseProduct(row.payload, row.slug);
    if (p) out.push(p);
  }
  return out.length > 0 ? out : PRODUCTS;
}

export function catalogMap(list: Product[]): Record<string, Product> {
  return Object.fromEntries(list.map((p) => [p.slug, p]));
}
