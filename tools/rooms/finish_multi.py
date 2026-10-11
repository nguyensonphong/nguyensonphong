"""Gộp publish + ảnh danh mục + menu cho nhiều phòng vào 1 mutation.
python3 tools/rooms/finish_multi.py room1.json "ids..." room2.json "ids..." ..."""
import subprocess,sys,json,re
args=sys.argv[1:]; q=None; v=None; decl=['$pub:ID!']
for k in range(0,len(args),2):
  out=subprocess.run(['python3','tools/rooms/finish.py',args[k],args[k+1]],capture_output=True,text=True).stdout.splitlines()
  body=out[0][out[0].index('{ ')+2:out[0].rindex('}')]
  n=k//2
  body=re.sub(r'\b(p|c)(\d+):',lambda m:f'{m.group(1)}{n}x{m.group(2)}:',body).replace('m:menuUpdate',f'm{n}:menuUpdate').replace('items:$items',f'items:$items{n}')
  decl.append(f'$items{n}:[MenuItemUpdateInput!]!')
  vv=json.loads(out[1]); v=v or {'pub':vv['pub']}; v[f'items{n}']=vv['items']
  q=(q or '')+body
print('mutation('+','.join(decl)+'){ '+q+'}'); print(json.dumps(v,ensure_ascii=True))
