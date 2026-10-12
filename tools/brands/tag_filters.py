"""Gắn tag lọc kiểu HomePro: loai-*, mau-*, giao-*. Input: JSON nodes (id,title,productType,price)."""
import json, sys, re, unicodedata
def slug(s):
    s = unicodedata.normalize('NFD', s.lower().replace('đ', 'd'))
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')
COLORS = [("đen", "Đen"), ("than", "Đen"), ("trắng", "Trắng"), ("bạc", "Bạc"), ("xám", "Xám"), ("be", "Be"), ("xanh", "Xanh"), ("hồng", "Hồng"), ("vàng", "Vàng"), ("gương", "Gương")]
DEFAULT = {"Tivi": "Đen", "Điều hòa": "Trắng"}
SMALL = {"Máy sấy tóc", "Máy tăm nước", "Bàn ủi", "Máy hút bụi", "Máy lọc không khí"}
nodes = json.load(open(sys.argv[1]))
out = []
for n in nodes:
    t = n['title'].lower(); tags = ["loai-" + slug(n['productType'])]
    color = next((c for k, c in COLORS if re.search(r'(^|[\s/])' + k + r'($|[\s/,])', t)), DEFAULT.get(n['productType']))
    if color: tags.append("mau-" + slug(color))
    if n['productType'] in SMALL: tags.append("giao-nhanh")
    if float(n['price']) < 40000000: tags.append("giao-trong-ngay")
    out.append((n['id'], tags))
q = "mutation{" + " ".join(f'a{i}:tagsAdd(id:"{pid}",tags:{json.dumps(tg, ensure_ascii=False)}){{userErrors{{message}}}}' for i, (pid, tg) in enumerate(out)) + "}"
print(q)
