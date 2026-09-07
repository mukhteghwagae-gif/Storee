-- Order money reversal + one-shot restock. Guest cancel uses the same rows.

alter table orders add column if not exists coins_used int not null default 0;
alter table orders add column if not exists store_credit_used int not null default 0;
alter table orders add column if not exists restocked boolean not null default false;

create unique index if not exists reviews_user_product_idx on reviews (user_id, product_id);
