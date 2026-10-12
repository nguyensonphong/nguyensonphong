"""pending_publish.txt + brands -> mutation publish sản phẩm, tạo collection brand, slogan. Usage: pub.py 'Vendor|handle|slogan|imgurl' ..."""
import sys
P = 'input:{publicationId:"gid://shopify/Publication/311083827447"}'
ids = [i for ln in open('products/pending_publish.txt') for i in ln.split()[1:]]
q = [f'p{n}:publishablePublish(id:"gid://shopify/Product/{i}",{P}){{userErrors{{message}}}}' for n, i in enumerate(ids)]
for n, a in enumerate(sys.argv[1:]):
    v, h, s, img = a.split('|', 3)
    q.append(f'c{n}:collectionCreate(input:{{title:"{v}",handle:"{h}",templateSuffix:"brand",ruleSet:{{appliedDisjunctively:false,rules:[{{column:VENDOR,relation:EQUALS,condition:"{v}"}}]}},image:{{src:"{img}",altText:"{v}"}}}}){{collection{{id}} userErrors{{message}}}}')
    q.append(f'm{n}:metaobjectUpsert(handle:{{type:"brand",handle:"{h}"}},metaobject:{{fields:[{{key:"slogan",value:"{s}"}}]}}){{userErrors{{message}}}}')
print("mutation{" + " ".join(q) + "}")
