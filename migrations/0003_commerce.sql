-- Sitara commerce: catalog, coupons, staff, honest order states, no fake sales.

alter table orders add column if not exists guest_name text;
alter table orders add column if not exists gift_wrap boolean not null default false;
alter table orders add column if not exists gift_message text;
alter table orders add column if not exists payment_status text not null default 'unpaid';
alter table orders add column if not exists shipment_status text not null default 'unfulfilled';
alter table orders add column if not exists tracking_token text;
alter table orders add column if not exists coupon_code text;
alter table orders add column if not exists return_reason text;
alter table orders add column if not exists cancelled_at timestamptz;
alter table orders add column if not exists tracking_note text;

create unique index if not exists orders_tracking_token_idx on orders (tracking_token);

update product_stock set sold_count = 0;
delete from reviews where user_id = 'sitara-atelier';

create table if not exists catalog_products (
  slug text primary key,
  payload text not null,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists staff (
  user_id text primary key,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create table if not exists coupons (
  code text primary key,
  kind text not null,
  value int not null default 0,
  min_subtotal int not null default 0,
  max_uses int,
  uses int not null default 0,
  active boolean not null default true,
  note text
);

insert into coupons (code, kind, value, min_subtotal, note) values
  ('STARLIGHT10', 'percent', 10, 0, 'Ten percent courtesy'),
  ('STAR5', 'percent', 5, 0, 'Five percent courtesy'),
  ('COIN500', 'fixed', 500, 3000, 'Rs 500 off over Rs 3,000'),
  ('SHIPFREE', 'shipping', 0, 0, 'Complimentary shipping')
on conflict (code) do nothing;

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
);
create index if not exists addresses_user_id_idx on addresses (user_id);

create table if not exists newsletter_subscribers (
  email text primary key,
  created_at timestamptz not null default now()
);

create table if not exists enquiries (
  id serial primary key,
  name text not null,
  email text,
  phone text,
  message text not null,
  product_id text,
  created_at timestamptz not null default now()
);

create table if not exists return_requests (
  id serial primary key,
  order_id text not null references orders (id) on delete cascade,
  user_id text not null,
  reason text not null,
  status text not null default 'requested',
  created_at timestamptz not null default now()
);

create table if not exists order_events (
  id serial primary key,
  order_id text not null,
  status text not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists analytics_events (
  id serial primary key,
  name text not null,
  payload text,
  created_at timestamptz not null default now()
);

alter table store_settings add column if not exists bank_name text;
alter table store_settings add column if not exists bank_iban text;
alter table store_settings add column if not exists bank_account_title text;
alter table store_settings add column if not exists raast_id text;
alter table store_settings add column if not exists jazzcash_merchant_id text;
alter table store_settings add column if not exists easypaisa_store_id text;
alter table store_settings add column if not exists card_public_key text;
alter table store_settings add column if not exists hero_kicker text;
alter table store_settings add column if not exists hero_title text;
alter table store_settings add column if not exists hero_dek text;
alter table store_settings add column if not exists gift_wrap_pkr int not null default 650;
