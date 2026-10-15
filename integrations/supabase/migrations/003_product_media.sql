-- Ảnh, video, mô hình 3D của sản phẩm: chỉ lưu link + thông tin, file vẫn nằm trên Shopify CDN
create table if not exists catalog.product_media (
  shopify_id text not null,             -- gid://shopify/MediaImage|Video|ExternalVideo|Model3d/...
  product_id text not null references catalog.products(shopify_id) on delete cascade,
  position int not null,                -- thứ tự hiển thị, 1 = ảnh đại diện
  media_type text not null,             -- IMAGE | VIDEO | EXTERNAL_VIDEO | MODEL_3D
  url text,                             -- ảnh gốc, file video mp4, link YouTube/Vimeo hoặc file 3D
  preview_url text,                     -- ảnh xem trước (với video là ảnh bìa)
  alt text,
  mime_type text,
  width int,
  height int,
  duration_ms int,                      -- video
  host text,                            -- YOUTUBE | VIMEO cho video ngoài
  status text,                          -- READY | PROCESSING | FAILED | UPLOADED
  synced_at timestamptz default now(),
  primary key (product_id, shopify_id)
);
create index if not exists product_media_product_idx on catalog.product_media(product_id, position);
alter table catalog.product_media enable row level security;
grant all on catalog.product_media to service_role;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'nocodb') then
    grant select on catalog.product_media to nocodb;
  end if;
end $$;

-- Kiểm tra nhanh: sản phẩm thiếu ảnh, thiếu alt text, có video hay không
create or replace view ops.v_product_media_check with (security_invoker = true) as
select p.shopify_id as product_id, p.handle, p.title, p.vendor, p.status,
       count(m.shopify_id)                                                   as media_count,
       count(*) filter (where m.media_type = 'IMAGE')                         as image_count,
       count(*) filter (where m.media_type in ('VIDEO', 'EXTERNAL_VIDEO'))    as video_count,
       count(*) filter (where m.shopify_id is not null and coalesce(btrim(m.alt), '') = '') as missing_alt,
       count(*) filter (where m.status = 'FAILED')                            as failed_count
from catalog.products p
left join catalog.product_media m on m.product_id = p.shopify_id
group by p.shopify_id, p.handle, p.title, p.vendor, p.status;
grant select on ops.v_product_media_check to service_role;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'nocodb') then
    grant select on ops.v_product_media_check to nocodb;
  end if;
end $$;
