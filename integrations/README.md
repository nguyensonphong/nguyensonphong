# GKMALL Data Hub — Shopify · Supabase · NocoDB · Lark Base

```
Shopify (nguồn bán hàng)
   │  shopify-to-supabase.mjs (2h/lần)          ▲ apply-approved.mjs (chỉ đề xuất đã duyệt)
   ▼                                            │
Supabase Postgres (GK_project) ── kho dữ liệu chính ──┐
   ▲  NocoDB: xem/lọc dữ liệu, tạo đề xuất           │ lark-sync.mjs
   │  (ops.change_requests, trạng thái 'pending')    ▼
                                         Lark Base: Báo cáo + Phê duyệt
```

Quy trình sửa dữ liệu: **NocoDB tạo đề xuất → Lark duyệt → script áp dụng lên Shopify → đồng bộ lại về Supabase**.
Không ai sửa thẳng Shopify qua NocoDB, nên mọi thay đổi giá/nội dung đều có người duyệt và lịch sử.

## Phân loại dữ liệu (3 schema trên Supabase)

| Nhóm | Schema | Bảng | Nguồn Shopify |
|---|---|---|---|
| **1. Sản phẩm / Dịch vụ** | `catalog` | `products` (cột `is_service` = không cần vận chuyển), `variants` (SKU, barcode, tồn kho), `collections`, `product_collections`, `brands` (metaobject *Thương hiệu*), `product_media` (link ảnh, video, 3D theo thứ tự; file vẫn nằm trên Shopify CDN) | Product, Variant, Collection, Metaobject `brand`, Product media |
| **2. Giá cả / Khuyến mãi** | `pricing` | `variant_prices` (giá bán, giá gốc, giá vốn, `discount_pct` tự tính), `price_history` (trigger tự ghi mỗi lần giá đổi), `discounts` (mã/tự động, %/số tiền, BXGY, freeship) | Variant price/compareAtPrice, InventoryItem.unitCost, Discounts |
| **3. Content** | `content` | `product_content` (mô tả HTML, SEO title/description), `articles` (blog *News*, *Cẩm nang nhà đẹp*), `pages` | descriptionHtml, seo, Article, Page |
| Vận hành | `ops` | `change_requests` (đề xuất & phê duyệt), `sync_log`, view `v_product_report`, view `v_product_media_check` (số ảnh/video, thiếu alt text) | — |

Schema đã được áp dụng lên project Supabase `GK_project` (file `supabase/migrations/001_gkmall_schema.sql`, bảng media ở `003_product_media.sql`). Hiện cửa hàng có 467 sản phẩm, 280 collection, 4 discount, 35 thương hiệu, 20 page, 2 blog.

## Cài đặt

### 1. Shopify — tạo app ở Dev Dashboard
Shopify không cho tạo custom app mới trong admin nữa (Apps → Develop apps chỉ còn cho app cũ).
1. Admin → Settings → Apps → **Develop apps** → *Build apps in Dev Dashboard* (hoặc vào https://dev.shopify.com).
2. **Create app** → *Start from Dev Dashboard* → tên `GKMALL Data Hub`.
3. Tab **Versions** → bỏ trống App URL → **Scopes**:
   `read_products, write_products, read_inventory, read_discounts, read_metaobjects, read_content, write_content, read_online_store_pages, write_online_store_pages` → **Release**.
4. **Home** → *Install app* → chọn store `gkmall-store` → Install.
5. **Settings** → copy **Client ID** và **Client secret** → `SHOPIFY_CLIENT_ID`, `SHOPIFY_CLIENT_SECRET`.
Script tự đổi 2 khoá này lấy access token (hạn 24h, tự xin lại mỗi lần chạy).

### 2. Supabase
- Lấy connection string: nút **Connect** → Session pooler → `SUPABASE_DB_URL`. Dạng đúng:
  `postgresql://postgres.fkgbwhruhnmghlevjxex:<MẬT_KHẨU>@aws-0-ap-south-1.pooler.supabase.com:5432/postgres`
  (host là `aws-0-...`, không phải `aws-1-...`; lỗi `tenant/user ... not found` nghĩa là sai host).
- Chạy `supabase/migrations/002_nocodb_role.sql` trong SQL Editor (đổi mật khẩu) để tạo user `nocodb`.

### 3. NocoDB (chỉnh sửa / nhập liệu)
NocoDB → New Base → **Connect External Data Source** → PostgreSQL, dùng host pooler Supabase, user `nocodb`, bật SSL. Thêm lần lượt các schema `catalog`, `pricing`, `content`, `ops` (mỗi schema 1 source = 3 nhóm dữ liệu tách bạch).
Gợi ý view:
- `ops.change_requests` → Form "Đề xuất thay đổi" (các cột: category, entity, shopify_id, field, old_value, new_value, reason, requested_by, status=`pending`).
- `catalog.products` / `pricing.variant_prices` → Grid xem; copy `shopify_id` vào đề xuất.

Trường hỗ trợ áp dụng tự động:

| entity | field |
|---|---|
| `variant` | `price`, `compare_at_price` |
| `product` | `title`, `status`, `product_type`, `vendor`, `tags` (phân cách dấu phẩy), `description_html`, `seo_title`, `seo_description` |
| `article` | `title`, `body_html`, `summary_html` |
| `page` | `title`, `body_html` |

### 4. Lark Base (báo cáo & phê duyệt)
1. Lark Developer Console → tạo **Custom App**, quyền `bitable:app`; thêm app vào Base (… → Add document app).
2. Tạo Base với 2 bảng (tên cột phải đúng):
   - **Báo cáo sản phẩm**: Handle, Sản phẩm, Thương hiệu, Loại, Trạng thái, SKU, Biến thể (Text) · Tồn kho, Giá bán, Giá gốc, % Giảm, Độ dài mô tả (Number) · SEO đủ (Checkbox). Dùng Dashboard của Lark để vẽ biểu đồ.
   - **Phê duyệt thay đổi**: Mã đề xuất (Number), Nhóm dữ liệu (Single select: Sản phẩm/Dịch vụ, Giá & Khuyến mãi, Content), Đối tượng, Shopify ID, Trường, Giá trị cũ, Giá trị mới, Lý do, Người đề xuất, Ghi chú hệ thống (Text), Trạng thái (Single select: Chờ duyệt, Đã duyệt, Từ chối, Đã áp dụng, Lỗi), Người duyệt (Person).
   Có thể bật Automation của Lark: khi có bản ghi "Chờ duyệt" → gửi tin nhắn cho trưởng nhóm.
3. Lấy `LARK_BASE_TOKEN` từ URL, `table_id` của từng bảng.

### 5. Chạy
```bash
cp integrations/.env.example .env   # điền giá trị
npm install
node --env-file=.env integrations/sync/shopify-to-supabase.mjs        # hoặc: ... catalog | pricing | content | media
node --env-file=.env integrations/sync/lark-sync.mjs                  # push-report | push-requests | pull-approvals
node --env-file=.env integrations/sync/apply-approved.mjs
```
Tự động: thêm các biến trên vào GitHub → Settings → Secrets → Actions; workflow `.github/workflows/data-sync.yml` chạy 2 giờ/lần (hoặc bấm *Run workflow*).
