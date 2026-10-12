"""Dòng 'Loại|Tên|Mã|Giá|Link|Ảnh' (stdin) -> products/<brand>_raw.json. Giá trống = 1.000.000. Usage: quick.py brand"""
import json, sys
raw = {}
for ln in sys.stdin:
    if not ln.strip(): continue
    t, n, m, p, l, i = [x.strip() for x in ln.split('|', 5)]
    raw.setdefault(t, []).append({"name": n, "model": m, "price": p or "1.000.000", "link": l, "img": i})
json.dump(raw, open(f"products/{sys.argv[1]}_raw.json", "w"), ensure_ascii=False, indent=0)
