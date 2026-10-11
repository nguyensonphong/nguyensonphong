"""Sinh biến GraphQL productSet cho 1 phòng: python3 tools/rooms/build.py tools/rooms/kitchen.json OUTDIR"""
import json,sys
d=json.load(open(sys.argv[1])); out=sys.argv[2]
cats={s['handle']:s['title'] for c in json.load(open('tools/categories/categories.json')) for s in c['subs']}
items=[]
for c in d['cats']:
  for i,(t,v,p,cp) in enumerate(c['products']):
    items.append(dict(title=t,vendor=v,status="ACTIVE",productType=cats[c['tag']],tags=[c['tag'],'room-goi-y']+(['best-price'] if i==0 else []),
      descriptionHtml="<p>Bảo hành chính hãng, giao hàng toàn quốc.</p>",
      files=[dict(originalSource=f"https://images.unsplash.com/photo-{c['img'][i%len(c['img'])]}?w=1000&q=75&fm=jpg",contentType="IMAGE")],
      productOptions=[dict(name="Title",values=[dict(name="Default Title")])],
      variants=[dict(optionValues=[dict(optionName="Title",name="Default Title")],price=str(p),compareAtPrice=str(cp))]))
n=0
for b in range(0,len(items),16):
  ch=items[b:b+16]
  json.dump({f"p{k}":x for k,x in enumerate(ch)},open(f"{out}/b{n}.json",'w'),ensure_ascii=False); n+=1
print(len(items),'products in',n,'batches; counts per batch:',[len(items[b:b+16]) for b in range(0,len(items),16)])
