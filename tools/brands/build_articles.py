"""Sinh ArticleCreateInput cho blog Cẩm nang từ brands.json + content_*.py."""
import json, sys, html
sys.path.insert(0, '.')
from content_b import C
brands = json.load(open('brands.json'))
logos = json.load(open('logos_url.json'))
e = html.escape
out = []
for b in brands:
    c = C[b['handle']]
    body = f"<p><strong>{e(c['tagline'])}</strong></p>"
    facts = [x for x in [("Xuất xứ", b.get('country')), ("Thành lập", b.get('founded')), ("Ngành hàng mạnh", b.get('cat'))] if x[1]]
    body += "<ul>" + "".join(f"<li><strong>{k}:</strong> {e(v)}</li>" for k, v in facts) + "</ul>"
    body += f"<h2>Lịch sử thương hiệu {e(b['name'])}</h2>" + "".join(f"<p>{e(x)}</p>" for x in c['history'])
    body += f"<h2>{e(b['name'])} có những dòng sản phẩm nào?</h2><ul>" + "".join(f"<li><strong>{e(n)}:</strong> {e(d)}</li>" for n, d in c['lines']) + "</ul>"
    body += f"<h2>Tư vấn chọn mua sản phẩm {e(b['name'])}</h2><ul>" + "".join(f"<li>{e(x)}</li>" for x in c['tips']) + "</ul>"
    body += f'<p><a href="/collections/{b["handle"]}">Xem sản phẩm {e(b["name"])} chính hãng tại GKMALL ›</a></p>'
    body += f"<p><em>Logo: Wikimedia Commons ({e(b.get('logo_license') or '')}). Logo là nhãn hiệu thuộc sở hữu của {e(b['name'])}.</em></p>"
    out.append({"blogId": "gid://shopify/Blog/118715154679", "title": f"Thương hiệu {b['name']}: lịch sử và tư vấn chọn mua",
                "handle": f"thuong-hieu-{b['handle']}", "author": {"name": "GKMALL"}, "isPublished": True,
                "summary": f"<p>{e(c['tagline'])}</p>", "body": body,
                "tags": ["thuong-hieu", b['name']] + c['topics'],
                "image": {"url": logos[b['handle']], "altText": "Logo " + b['name']}})
json.dump(out, open(sys.argv[1], 'w'), ensure_ascii=False)
print(len(out), sum(len(json.dumps(x, ensure_ascii=False)) for x in out))
