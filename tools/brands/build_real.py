"""Sản phẩm thật từ trang hãng VN -> ProductSetInput. Usage: build_real.py raw.json Vendor out.json"""
import json, sys, re
raw = json.load(open(sys.argv[1])); vendor = sys.argv[2]
num = lambda s: int(s.replace('.', '')) if s else 0
out = {}; i = 0
for t, items in raw.items():
    for j, x in enumerate(items):
        model = x['link'].rstrip('/').split('/')[-1].split('-')[-1].upper()
        if model.startswith('SV') or len(model) < 6:  # mã nằm trước hậu tố -sv
            parts = x['link'].rstrip('/').split('/')[-1].split('-'); model = (parts[-2] + '/' + parts[-1]).upper()
        price = num(x['price']); cmp = price + num(x.get('orig', ''))
        title = x['name'] if vendor.lower() in x['name'].lower() else f"{x['name']} {vendor}"
        title = f"{title} {model}"
        tags = [f"brand-{vendor.lower()}", "hang-chinh-hang", "free-shipping"]
        if j == 0: tags.append("best-price")
        if price >= 9000000 and t in ("Tivi", "Điều hòa", "Tủ lạnh", "Máy giặt", "Máy rửa bát", "Máy hút mùi"): tags.append("free-install")
        desc = (f"<p><strong>{x['name']}</strong> – mã sản phẩm <strong>{model}</strong>, hàng chính hãng {vendor} Việt Nam, bảo hành theo chính sách của hãng.</p>"
                f"<p>Thông số và giá niêm yết tham khảo từ trang chính thức của {vendor} Việt Nam: <a href=\"{x['link']}\" target=\"_blank\" rel=\"nofollow noopener\">xem trên website hãng</a>.</p>")
        v = {"optionValues": [{"optionName": "Title", "name": "Default Title"}], "price": str(price), "sku": model}
        if cmp > price: v["compareAtPrice"] = str(cmp)
        out[f"p{i}"] = {"title": title, "vendor": vendor, "status": "ACTIVE", "productType": t, "tags": tags, "descriptionHtml": desc,
                        "files": [{"originalSource": x['img'], "contentType": "IMAGE", "alt": title}],
                        "productOptions": [{"name": "Title", "values": [{"name": "Default Title"}]}], "variants": [v]}
        i += 1
json.dump(out, open(sys.argv[3], 'w'), ensure_ascii=False, separators=(',', ':'))
for k, v in out.items(): print(k, v['productType'], '|', v['title'], '|', v['variants'][0]['price'], v['variants'][0].get('compareAtPrice'))
