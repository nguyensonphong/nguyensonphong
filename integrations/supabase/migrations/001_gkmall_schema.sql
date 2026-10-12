-- GKMALL data hub: Shopify -> Supabase (host) <-> NocoDB (edit) <-> Lark Base (report/approve)
-- 3 nhóm dữ liệu = 3 schema: catalog (sản phẩm/dịch vụ), pricing (giá & khuyến mãi), content (nội dung)
create schema if not exists catalog;
create schema if not exists pricing;
create schema if not exists content;
create schema if not exists ops;

-- ========== 1. SẢN PHẨM / DỊCH VỤ ==========
create table catalog.brands (
  shopify_id text primary key,          -- gid://shopify/Metaobject/...
  handle text unique not null,
  name text,
  fields jsonb default '{}'::jsonb,
  synced_at timestamptz default now()
);
create table catalog.products (
  shopify_id text primary key,          -- gid://shopify/Product/...
  handle text unique not null,
  title text not null,
  product_type text,
  vendor text,
  brand_handle text,
  status text,                          -- ACTIVE | DRAFT | ARCHIVED
  tags text[] default '{}',
  is_service boolean default false,     -- dịch vụ (lắp đặt, bảo hành...) = product không cần vận chuyển
  total_inventory int,
  featured_image text,
  shopify_created_at timestamptz,
  shopify_updated_at timestamptz,
  synced_at timestamptz default now()
);
create table catalog.variants (
  shopify_id text primary key,
  product_id text not null references catalog.products(shopify_id) on delete cascade,
  title text,
  sku text,
  barcode text,
  inventory_quantity int,
  options jsonb default '[]'::jsonb,
  synced_at timestamptz default now()
);
create index on catalog.variants(product_id);
create index on catalog.variants(sku);
create table catalog.collections (
  shopify_id text primary key,
  handle text unique not null,
  title text,
  is_smart boolean default false,
  products_count int,
  synced_at timestamptz default now()
);
create table catalog.product_collections (
  product_id text references catalog.products(shopify_id) on delete cascade,
  collection_id text references catalog.collections(shopify_id) on delete cascade,
  primary key (product_id, collection_id)
);

-- ========== 2. GIÁ CẢ / KHUYẾN MÃI ==========
create table pricing.variant_prices (
  variant_id text primary key references catalog.variants(shopify_id) on delete cascade,
  product_id text not null,
  price numeric(14,0),                  -- VND
  compare_at_price numeric(14,0),
  unit_cost numeric(14,0),
  discount_pct numeric(5,2) generated always as (
    case when compare_at_price > 0 and price < compare_at_price
         then round((1 - price / compare_at_price) * 100, 2) end) stored,
  synced_at timestamptz default now()
);
create table pricing.price_history (
  id bigserial primary key,
  variant_id text not null,
  price numeric(14,0),
  compare_at_price numeric(14,0),
  recorded_at timestamptz default now()
);
create table pricing.discounts (
  shopify_id text primary key,
  title text,
  code text,
  discount_type text,                   -- percentage | fixed_amount | bxgy | free_shipping
  value numeric(14,2),
  status text,                          -- ACTIVE | SCHEDULED | EXPIRED
  starts_at timestamptz,
  ends_at timestamptz,
  usage_count int,
  raw jsonb,
  synced_at timestamptz default now()
);

-- ========== 3. CONTENT ==========
create table content.product_content (
  product_id text primary key references catalog.products(shopify_id) on delete cascade,
  description_html text,
  seo_title text,
  seo_description text,
  synced_at timestamptz default now()
);
create table content.articles (
  shopify_id text primary key,
  blog_handle text,
  handle text,
  title text,
  author text,
  tags text[] default '{}',
  summary_html text,
  body_html text,
  is_published boolean,
  published_at timestamptz,
  synced_at timestamptz default now()
);
create table content.pages (
  shopify_id text primary key,
  handle text unique,
  title text,
  body_html text,
  is_published boolean,
  synced_at timestamptz default now()
);

-- ========== OPS: đề xuất thay đổi + phê duyệt (NocoDB -> Lark -> Shopify) ==========
create type ops.request_status as enum ('draft','pending','approved','rejected','applied','failed');
create table ops.change_requests (
  id bigserial primary key,
  category text not null check (category in ('catalog','pricing','content')),
  entity text not null,                 -- product | variant | collection | article | page | discount
  shopify_id text not null,
  field text not null,                  -- vd: price, compare_at_price, title, status, seo_title, body_html
  old_value text,
  new_value text not null,
  reason text,
  requested_by text,
  status ops.request_status not null default 'draft',
  approver text,
  approved_at timestamptz,
  lark_record_id text,
  applied_at timestamptz,
  error text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index on ops.change_requests(status);
create table ops.sync_log (
  id bigserial primary key,
  job text not null,
  started_at timestamptz default now(),
  finished_at timestamptz,
  rows int,
  ok boolean,
  message text
);

create or replace function ops.touch_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end $$;
create trigger trg_cr_updated before update on ops.change_requests
  for each row execute function ops.touch_updated_at();

-- Ghi lịch sử giá mỗi khi giá đổi
create or replace function pricing.log_price() returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_op = 'INSERT' or new.price is distinct from old.price
     or new.compare_at_price is distinct from old.compare_at_price then
    insert into pricing.price_history(variant_id, price, compare_at_price)
    values (new.variant_id, new.price, new.compare_at_price);
  end if;
  return new;
end $$;
create trigger trg_price_hist after insert or update on pricing.variant_prices
  for each row execute function pricing.log_price();

-- View báo cáo phẳng cho Lark Base
create view ops.v_product_report with (security_invoker = true) as
select p.handle, p.title, p.vendor, p.product_type, p.status, p.total_inventory,
       v.sku, v.title as variant_title, vp.price, vp.compare_at_price, vp.discount_pct,
       (pc.seo_title is not null and pc.seo_description is not null) as seo_ok,
       length(coalesce(pc.description_html,'')) as description_len
from catalog.products p
join catalog.variants v on v.product_id = p.shopify_id
left join pricing.variant_prices vp on vp.variant_id = v.shopify_id
left join content.product_content pc on pc.product_id = p.shopify_id;

-- Bảo mật: không mở cho anon; chỉ service_role (sync) và user Postgres riêng cho NocoDB
do $$ declare t record; begin
  for t in select schemaname, tablename from pg_tables where schemaname in ('catalog','pricing','content','ops') loop
    execute format('alter table %I.%I enable row level security', t.schemaname, t.tablename);
  end loop;
end $$;
grant usage on schema catalog, pricing, content, ops to service_role;
grant all on all tables in schema catalog, pricing, content, ops to service_role;
grant all on all sequences in schema catalog, pricing, content, ops to service_role;
