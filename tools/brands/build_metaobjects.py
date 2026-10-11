"""Sinh biến cho metaobjectUpsert từ brands.json + content_*.py + logo ids."""
import json, sys
sys.path.insert(0, '.')
from content_b import C
brands = json.load(open('brands.json'))
logos = json.load(open(sys.argv[1]))  # {handle: MediaImage gid}
HQ_FIX = {"carrier": "Palm Beach Gardens, Florida", "dyson": "Singapore", "hitachi": "Tokyo", "daikin": "Osaka", "sony": "Tokyo", "toshiba": "Kawasaki", "mitsubishi-electric": "Tokyo"}
def t(v): return {"type": "text", "value": v}
def rich(blocks): return json.dumps({"type": "root", "children": blocks}, ensure_ascii=False)
def h(v): return {"type": "heading", "level": 3, "children": [t(v)]}
def p(v): return {"type": "paragraph", "children": [t(v)]}
def ul(items): return {"type": "list", "listType": "unordered", "children": [{"type": "list-item", "children": x} for x in items]}
FEATURED = {"samsung","lg","panasonic","sony","toshiba","daikin","electrolux","philips","xiaomi","tefal","bosch","toto"}
out = []
for b in brands:
    c = C[b['handle']]
    history = rich([p(x) for x in c['history']])
    guide = rich([h("Dòng sản phẩm nổi bật"),
                  ul([[{"type": "text", "value": n + ": ", "bold": True}, t(d)] for n, d in c['lines']]),
                  h("Tư vấn chọn mua"), ul([[t(x)] for x in c['tips']])])
    fields = [("name", b['name']), ("vendor", b['name']), ("country", b['country'] or ""), ("founded", b['founded'] or ""),
              ("headquarters", HQ_FIX.get(b['handle'], b['hq'] or "")), ("category", b['cat']), ("tagline", c['tagline']),
              ("history", history), ("products_guide", guide), ("topics", json.dumps(c['topics'], ensure_ascii=False)),
              ("website", c['website']), ("featured", "true" if b['handle'] in FEATURED else "false"),
              ("logo", logos[b['handle']]), ("logo_credit", "Wikimedia Commons – " + b['logo_file'] + " (" + (b.get('logo_license') or '') + ")")]
    out.append({"handle": {"type": "brand", "handle": b['handle']},
                "metaobject": {"fields": [{"key": k, "value": v} for k, v in fields if v != ""],
                               "capabilities": {"publishable": {"status": "ACTIVE"}}}})
json.dump(out, open(sys.argv[2], 'w'), ensure_ascii=False)
print(len(out), "brands")
