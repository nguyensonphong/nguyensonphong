"""Lấy logo (P154), năm thành lập (P571), quốc gia (P17), trụ sở (P159) của hãng từ Wikidata."""
import json, sys, urllib.request, urllib.parse
UA = {"User-Agent": "GKMALL-brand-db/1.0 (nguyensonphong@gmail.com)"}
def get(url):
    return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30))
brands = json.load(open(sys.argv[1]))
titles = [b["wiki"] for b in brands]
out = {}
for i in range(0, len(titles), 40):
    q = urllib.parse.urlencode({"action": "wbgetentities", "sites": "enwiki", "titles": "|".join(titles[i:i+40]),
                                "props": "claims|sitelinks", "format": "json"})
    d = get("https://www.wikidata.org/w/api.php?" + q)
    for qid, e in d["entities"].items():
        if "missing" in e: continue
        t = e["sitelinks"]["enwiki"]["title"]
        c = e.get("claims", {})
        val = lambda p: [x["mainsnak"].get("datavalue", {}).get("value") for x in c.get(p, [])]
        logo = val("P154")
        inc = val("P571")
        out[t] = {"qid": qid, "logo": logo[-1] if logo else None,
                  "founded": inc[0]["time"][1:5] if inc and inc[0] else None,
                  "country": [v["id"] for v in val("P17") if v], "hq": [v["id"] for v in val("P159") if v]}
# đổi Q-id quốc gia/trụ sở sang tên tiếng Việt (fallback tiếng Anh)
ids = sorted({x for v in out.values() for x in v["country"][:1] + v["hq"][:1]})
names = {}
for i in range(0, len(ids), 50):
    d = get("https://www.wikidata.org/w/api.php?" + urllib.parse.urlencode({"action": "wbgetentities", "ids": "|".join(ids[i:i+50]), "props": "labels", "languages": "vi|en", "format": "json"}))
    for k, e in d["entities"].items():
        l = e.get("labels", {}); names[k] = (l.get("vi") or l.get("en") or {}).get("value")
for v in out.values():
    v["country"] = names.get(v["country"][0]) if v["country"] else None
    v["hq"] = names.get(v["hq"][0]) if v["hq"] else None
json.dump(out, open(sys.argv[2], "w"), ensure_ascii=False, indent=1)
for b in brands:
    w = out.get(b["wiki"]) or next((v for k, v in out.items() if k.lower() == b["wiki"].replace("_", " ").lower()), None)
    print(b["name"], "|", w and w["logo"], "|", w and w["founded"], "|", w and w["country"], "|", w and w["hq"])
