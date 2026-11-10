"""Deterministic, project-owned fixtures; no downloaded artwork."""
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'example/assets'
OUT.mkdir(exist_ok=True)
def prop(v): return {'a': 0, 'k': v}
def anim(a,b,end=60,ease=False,hold=False):
    return {'a':1,'k':[{'t':0,'s':a if isinstance(a,list) else [a],
      'e':b if isinstance(b,list) else [b], 'h':int(hold),
      'o':{'x':[.42 if ease else 0], 'y':[0]},
      'i':{'x':[.58 if ease else 1], 'y':[1]}},
      {'t':end,'s':b if isinstance(b,list) else [b]}]}
def tr(p=[0,0],r=0,s=[100,100],o=100):
    return {'a':prop([0,0]),'p':prop(p),'r':prop(r),'s':prop(s),'o':prop(o)}
def fill(c=[.12,.63,.9],o=100,rule=1): return {'ty':'fl','c':prop(c),'o':prop(o),'r':rule}
def stroke(c=[.9,.3,.2],w=3): return {'ty':'st','c':prop(c),'o':prop(100),'w':prop(w),'lc':2,'lj':2,'ml':4}
def ellipse(p=[0,0],s=[40,40],d=1): return {'ty':'el','p':prop(p),'s':prop(s),'d':d}
def rect(p=[0,0],s=[40,40],r=0): return {'ty':'rc','p':prop(p),'s':prop(s),'r':prop(r)}
def group(items,t=None): return {'ty':'gr','it':items+[{'ty':'tr',**(t or tr())}]}
def layer(items,t=None,ind=1,**kw):
    return {'ty':4,'ind':ind,'nm':f'Layer {ind}','ip':0,'op':60,'st':0,'sr':1,
      'ks':t or tr(),'shapes':items,**kw}
def comp(layers): return {'v':'5.12.2','fr':30,'ip':0,'op':60,'w':256,'h':256,'ddd':0,'assets':[],'layers':layers}
def shape(n,phase=0):
    v=[]
    for i in range(n):
        angle=i/n*math.tau
        radius=65+12*math.sin(i*5/n*math.tau+phase)
        v.append([radius*math.cos(angle),radius*math.sin(angle)])
    return {'v':v,'i':[[0,0]]*n,'o':[[0,0]]*n,'c':True}

icon_t=tr([128,128]); icon_t['r']=anim(0,360)
icon = comp([layer([group([rect(s=[110,110],r=18),fill(),stroke()],icon_t),
  group([ellipse(s=[28,28]),fill([1,.8,.2])],tr([128,128]))])])
static=comp([layer([group([rect([128,128],[160,120],20),fill(),stroke()]),
  group([ellipse([128,128],[50,50]),fill([1,.8,.2])])])])
items=[]
for i in range(100):
    t=tr([16+(i%10)*25,16+(i//10)*25]); t['r']=anim(0,360)
    t['s']=anim([65,65],[110,110],ease=True)
    items.append(group([ellipse(s=[16,16]) if i%2 else rect(s=[16,16],r=3),
      fill([.1+(i%3)*.25,.3+(i%5)*.1,.85])],t))
many=comp([layer(items)])
morphs=[]
for i in range(8):
    ks={'a':1,'k':[{'t':0,'s':[shape(128)],'e':[shape(128,2)],
      'o':{'x':[.42],'y':[0]},'i':{'x':[.58],'y':[1]}},
      {'t':60,'s':[shape(128,2)]}]}
    morphs.append(group([{'ty':'sh','ks':ks},fill([.2,.3+i*.07,.9],o=55)],tr([128,128],r=i*8,s=[60+i*5]*2)))
morph=comp([layer(morphs)])
features=comp([
  layer([group([rect([60,70],[80,50],10),fill([.2,.8,.5]),stroke()]),
    group([ellipse([180,75],[70,40],3),ellipse([180,75],[30,20]),fill([.8,.3,.7],rule=2)]),
    group([{'ty':'sh','ks':prop({'v':[[20,180],[90,140],[140,200]],'i':[[0,0],[-20,0],[0,-20]],'o':[[20,-20],[20,0],[0,0]],'c':False})},stroke([.8,.6,.1],5)])],ind=2,parent=1),
  {'ty':3,'ind':1,'ip':0,'op':60,'ks':tr([5,10]),'st':0,'sr':1}
])
for name,value in {'icon':icon,'static':static,'many_shapes':many,'morph':morph,'features':features}.items():
    (OUT/f'{name}.json').write_text(json.dumps(value,separators=(',',':'))+'\n')
