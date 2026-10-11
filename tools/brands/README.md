# Cơ sở dữ liệu thương hiệu (Shopify metaobject `brand`)

- Định nghĩa: metaobject type `brand` (Admin → Content → Metaobjects → Thương hiệu), có trang web tại `/pages/thuong-hieu/<handle>`.
- Trường: name, logo, vendor (khớp Vendor sản phẩm), country, founded, headquarters, category, tagline, history (rich text), products_guide (rich text), topics (#chủ đề), website, featured, logo_credit.
- Dữ liệu nguồn: `brands.json` (danh sách + logo Wikimedia), `content_a.py` / `content_b.py` (bài viết), `fetch_wikidata.py` (năm thành lập, quốc gia, logo), `build_metaobjects.py` (sinh biến metaobjectUpsert).
- Logo: lấy từ Wikimedia Commons (đa số Public domain, Lock&Lock và Häfele là CC BY-SA 4.0); logo vẫn là nhãn hiệu của từng hãng.
- Thêm hãng mới: thêm vào `brands.json` + nội dung trong content_*.py, tải logo bằng fileCreate, chạy build_metaobjects.py rồi metaobjectUpsert.
