"""vars.json -> mutation productSet (alias) có sẵn tag lọc. Usage: make_mut.py vars.json > mut.graphql"""
import json, sys, re, unicodedata
def slug(s):
    s = unicodedata.normalize('NFD', s.lower().replace('đ', 'd'))
    return re.sub(r'[^a-z0-9]+', '-', ''.join(c for c in s if unicodedata.category(c) != 'Mn')).strip('-')
COLORS = [("đen","Đen"),("than","Đen"),("trắng","Trắng"),("bạc","Bạc"),("xám","Xám"),("be","Be"),("xanh","Xanh"),("hồng","Hồng"),("vàng","Vàng"),("gương","Gương")]
DEFAULT = {"Tivi": "Đen", "Điều hòa": "Trắng"}
SMALL = {"Máy sấy tóc","Máy tăm nước","Bàn ủi","Máy hút bụi","Máy lọc không khí","Máy xay sinh tố","Nồi cơm điện","Nồi chiên không dầu","Ấm siêu tốc","Loa","Tai nghe","Hộp đựng thực phẩm","Bình giữ nhiệt"}
v = json.load(open(sys.argv[1]))
for p in v.values():
    t = p['title'].lower(); tg = ["loai-" + slug(p['productType'])]
    c = next((c for k, c in COLORS if re.search(r'(^|[\s/])' + k + r'($|[\s/,])', t)), DEFAULT.get(p['productType']))
    if c: tg.append("mau-" + slug(c))
    if p['productType'] in SMALL: tg.append("giao-nhanh")
    if float(p['variants'][0]['price']) < 40000000: tg.append("giao-trong-ngay")
    p['tags'] += tg
print(json.dumps({"query": "mutation(" + ",".join(f"${k}:ProductSetInput!" for k in v) + "){" + " ".join(f"{k}:productSet(synchronous:true,input:${k}){{product{{id}} userErrors{{message}}}}" for k in v) + "}", "variables": v}, ensure_ascii=False))
