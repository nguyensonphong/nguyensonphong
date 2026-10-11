"""Sản phẩm demo Samsung cho landing page thương hiệu (vendor = Samsung)."""
import json, sys
U = "https://images.unsplash.com/photo-{}?w=1000&q=75&fm=jpg"
P = [
 ("Tivi", "Smart Tivi Samsung Crystal UHD 4K 55 inch", 11990000, 14990000, "1567690187548-f07b1d7bf5a9"),
 ("Tivi", "Smart Tivi Samsung Neo QLED 4K 65 inch", 32990000, 39990000, "1584280795027-321f4d68e77b"),
 ("Tivi", "Smart Tivi Samsung QLED 4K 50 inch", 13490000, 16990000, "1646861039459-fd9e3aabf3fb"),
 ("Tivi", "Smart Tivi Samsung OLED 4K 77 inch", 59990000, 69990000, "1595935736128-db1f0a261263"),
 ("Tủ lạnh", "Tủ lạnh Samsung Inverter 2 cửa 382 lít", 10490000, 12990000, "1674143941110-f7ef253ea1f4"),
 ("Tủ lạnh", "Tủ lạnh Samsung Side by Side Inverter 655 lít", 22990000, 27990000, "1643356472833-5b1f2cd4ca3c"),
 ("Tủ lạnh", "Tủ lạnh Samsung Bespoke 4 cửa 599 lít", 39990000, 45990000, "1642497590397-7f4384a19966"),
 ("Máy giặt", "Máy giặt Samsung AI EcoBubble cửa trước 10 kg", 11990000, 14490000, "1626806787461-102c1bfaaea1"),
 ("Máy giặt", "Máy giặt sấy Samsung Inverter 12/8 kg", 18990000, 22990000, "1604335399105-a0c585fd81a1"),
 ("Máy giặt", "Máy giặt Samsung cửa trên Inverter 9 kg", 6990000, 8490000, "1622473590925-e3616c0a41bf"),
 ("Điều hòa", "Điều hòa Samsung WindFree Inverter 1 HP", 9990000, 11990000, "1726614846573-c1ac2e6161d1"),
 ("Điều hòa", "Điều hòa Samsung Digital Inverter 1.5 HP", 11490000, 13490000, "1759772238012-9d5ad59ae637"),
 ("Điều hòa", "Điều hòa Samsung WindFree AI 2 HP", 17990000, 20990000, "1757219525975-03b5984bc6e8"),
 ("Robot hút bụi", "Robot hút bụi lau nhà Samsung Jet Bot AI+", 19990000, 24990000, "1653990480360-31a12ce9723e"),
 ("Robot hút bụi", "Robot hút bụi Samsung Jet Bot tự đổ rác", 12990000, 15990000, "1558317374-067fb5f30001"),
 ("Lò vi sóng", "Lò vi sóng Samsung có nướng 23 lít", 2690000, 3290000, "1585659722983-3a675dabf23d"),
 ("Lò vi sóng", "Lò vi sóng Samsung Bespoke 30 lít", 4990000, 5990000, "1690731849383-514935755156"),
]
seen = set(); out = {}
for i, (t, title, price, cmp, img) in enumerate(P):
    tags = ["brand-samsung", "free-shipping"]
    if t not in seen: tags.append("best-price"); seen.add(t)
    if price >= 9000000 and t in ("Tivi", "Điều hòa", "Tủ lạnh", "Máy giặt"): tags.append("free-install")
    out[f"p{i}"] = {"title": title, "vendor": "Samsung", "status": "ACTIVE", "productType": t, "tags": tags,
        "descriptionHtml": f"<p>{title} chính hãng Samsung, bảo hành theo tiêu chuẩn của hãng tại Việt Nam. Giao hàng toàn quốc.</p>",
        "files": [{"originalSource": U.format(img), "contentType": "IMAGE"}],
        "productOptions": [{"name": "Title", "values": [{"name": "Default Title"}]}],
        "variants": [{"optionValues": [{"optionName": "Title", "name": "Default Title"}], "price": str(price), "compareAtPrice": str(cmp)}]}
json.dump(out, open(sys.argv[1], "w"), ensure_ascii=False, separators=(",", ":"))
print(len(out))
