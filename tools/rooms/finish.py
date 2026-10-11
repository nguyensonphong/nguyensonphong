"""In mutation publish + ảnh danh mục + menu cho 1 phòng.
python3 tools/rooms/finish.py ROOM.json "id1 id2 ..."  -> in ra query và variables(JSON) của menu"""
import json,sys
d=json.load(open(sys.argv[1])); ids=sys.argv[2].split()
cats={s['handle']:s['title'] for c in json.load(open('tools/categories/categories.json')) for s in c['subs']}
col={l.split()[0]:l.split()[1] for l in open('tools/rooms/l2-collections.txt')}
menus=json.load(open('tools/rooms/menu-ids.json'))
tabs=json.load(open('tools/rooms/room-tabs.json'))[d['room']]
P='gid://shopify/Publication/311083827447'
q=['mutation($items:[MenuItemUpdateInput!]!){']
q+=[f'p{i}:publishablePublish(id:"gid://shopify/Product/{x.split("/")[-1]}",input:{{publicationId:"{P}"}}){{userErrors{{message}}}}' for i,x in enumerate(ids)]
q+=[f'c{i}:collectionUpdate(input:{{id:"gid://shopify/Collection/{col[c["tag"]]}",image:{{src:"https://images.unsplash.com/photo-{c["img"][0]}?w=800&q=75&fm=jpg"}}}}){{userErrors{{message}}}}' for i,c in enumerate(d['cats'])]
q.append(f'm:menuUpdate(id:"{menus[d["room"]]}",title:"{d.get("menu_title","Phòng")}",items:$items){{userErrors{{message}}}}')
q.append('}')
print(' '.join(q)); print(json.dumps({"items":[dict(title=cats[h],type="HTTP",url="/collections/"+h,items=[]) for h in tabs]},ensure_ascii=False))
