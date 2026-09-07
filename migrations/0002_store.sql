create table if not exists product_stock (
  id text primary key,
  stock int not null default 0,
  sold_count int not null default 0
);

create table if not exists store_settings (
  id int primary key default 1,
  cod_enabled boolean not null default true,
  free_shipping_over int not null default 5000,
  gst_fashion_bps int not null default 0,
  whatsapp_number text not null default '923001112223',
  gold_24k_tola_pkr int not null default 352000,
  gold_updated_at timestamptz not null default now()
);

insert into store_settings (id) values (1) on conflict (id) do nothing;

insert into product_stock (id, stock, sold_count) values
  ('noor-jahan', 2, 18),
  ('mughal-choker', 3, 9),
  ('sitara-tikka', 5, 21),
  ('lahore-jhumkas', 4, 33),
  ('pair-kangan', 6, 14),
  ('dawn-stack', 12, 48),
  ('pearl-luna', 14, 61),
  ('thread-chain', 9, 27),
  ('whisper-bangle', 8, 19),
  ('gold-hoops', 11, 44),
  ('emerald-teardrop', 3, 7),
  ('constellation', 16, 22),
  ('sultan-ring', 2, 5),
  ('ravi-chain', 5, 11),
  ('moonlight-choker', 7, 8),
  ('payal-stars', 10, 16),
  ('cz-solitaire', 18, 29),
  ('rose-layered', 20, 41)
on conflict (id) do nothing;

create table if not exists profiles (
  user_id text primary key,
  display_name text,
  phone text,
  address_line text,
  city text,
  coins int not null default 0,
  store_credit_pkr int not null default 0,
  referral_code text not null,
  referred_by text,
  created_at timestamptz not null default now()
);
create unique index if not exists profiles_referral_code_idx on profiles (referral_code);

create table if not exists orders (
  id text primary key,
  user_id text not null,
  status text not null default 'placed',
  payment_method text not null,
  subtotal int not null,
  shipping int not null,
  tax int not null,
  discount int not null default 0,
  total int not null,
  city text not null,
  address_line text not null,
  phone text not null,
  courier text not null default 'leopard',
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists orders_user_id_idx on orders (user_id);

create table if not exists order_items (
  id serial primary key,
  order_id text not null references orders (id) on delete cascade,
  product_id text not null,
  name text not null,
  size text,
  qty int not null,
  unit_price int not null
);

create table if not exists reviews (
  id serial primary key,
  user_id text not null,
  product_id text not null,
  rating int not null,
  title text not null,
  body text not null,
  photo_data_url text,
  created_at timestamptz not null default now()
);
create index if not exists reviews_product_id_idx on reviews (product_id);
create index if not exists reviews_user_id_idx on reviews (user_id);

create table if not exists wishlists (
  user_id text not null,
  product_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table if not exists stock_alerts (
  user_id text not null,
  product_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table if not exists cart_snapshots (
  user_id text primary key,
  payload text not null,
  updated_at timestamptz not null default now()
);

insert into reviews (user_id, product_id, rating, title, body) values
  ('sitara-atelier', 'lahore-jhumkas', 5, 'They move in photographs', 'Wore these to my cousin’s walima. Light enough for eight hours, loud enough for the videographer.'),
  ('sitara-atelier', 'dawn-stack', 5, 'The daily ring', 'Stacked three. The emerald baguette is the only one anyone comments on — which is the point.'),
  ('sitara-atelier', 'pearl-luna', 5, 'Office uniform', 'Replaced a pair I had worn thin. Same scale, better posts.'),
  ('sitara-atelier', 'noor-jahan', 5, 'Worth the weight', 'The choker sits. I did not need a neck massage after the rukhsati. That is the review.');

