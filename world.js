import * as T from 'three';
// BARBAS MINIGAMES — Brooklyn-inspired neighborhood hub, original fictional layout.
export function crearCiudad(scene){
 // Seeded procedural PBR surface maps: all assets are generated locally.
 let seed=31931;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 const textureCache=new Map();
 function surface(kind,color){
  const key=kind+color;if(textureCache.has(key))return textureCache.get(key);
  const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d');
  const base=new T.Color(color),rgb=v=>'rgb('+Math.round(T.MathUtils.clamp(base.r*255*v,0,255))+','+Math.round(T.MathUtils.clamp(base.g*255*v,0,255))+','+Math.round(T.MathUtils.clamp(base.b*255*v,0,255))+')';
  g.fillStyle=color;g.fillRect(0,0,512,512);
  if(kind==='brick'){
   const bh=45,bw=115;for(let row=0;row<13;row++)for(let col=-1;col<6;col++){
    const x=col*bw+(row%2)*bw/2,y=row*bh;
    g.fillStyle='#c5b8a6';g.fillRect(x-2,y-2,bw+2,bh+2);
    g.fillStyle=rgb(.8+rnd()*.38);g.fillRect(x+2,y+2,bw-5,bh-5);
    for(let i=0;i<15;i++){g.fillStyle=rnd()>.5?'#ffffff0b':'#100b0b18';g.fillRect(x+rnd()*bw,y+rnd()*bh,2+rnd()*12,1+rnd()*3)}
   }
  }else if(kind==='asphalt'||kind==='concrete'){
   for(let i=0;i<14500;i++){const v=rnd();g.fillStyle=v>.5?'#ffffff13':'#00000016';g.fillRect(rnd()*512,rnd()*512,1+rnd()*3,1+rnd()*3)}
   if(kind==='concrete'){g.strokeStyle='#4b4d4e36';g.lineWidth=2;for(let x=0;x<512;x+=128){g.beginPath();g.moveTo(x,0);g.lineTo(x,512);g.stroke()}for(let y=0;y<512;y+=128){g.beginPath();g.moveTo(0,y);g.lineTo(512,y);g.stroke()}}
  }else if(kind==='wood'){for(let i=0;i<110;i++){g.fillStyle=rnd()>.5?'#00000017':'#ffffff12';g.fillRect(0,rnd()*512,512,1+rnd()*4)}}
  const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;map.wrapS=map.wrapT=T.RepeatWrapping;map.anisotropy=4;map.repeat.set(kind==='brick'?2:kind==='asphalt'?10:kind==='concrete'?5:2,kind==='brick'?3:kind==='asphalt'?10:kind==='concrete'?5:2);
  const bump=map.clone();bump.colorSpace=T.NoColorSpace;bump.needsUpdate=true;
  textureCache.set(key,{map,bump});return {map,bump};
 }
 const mat=(color,roughness=.85,metalness=.02,kind='')=>{
  const opts={color:kind?'#ffffff':color,roughness,metalness};
  if(kind){const t=surface(kind,color);opts.map=t.map;opts.bumpMap=t.bump;opts.bumpScale=kind==='brick'?.035:.018}
  return new T.MeshStandardMaterial(opts)
 };
 const asphalt=mat('#40434b',.96,.02,'asphalt'),sidewalk=mat('#a7a39c',.95,0,'concrete'),concrete=mat('#d0c9b9',.94,0,'concrete'),brick=[mat('#a55343',.9,0,'brick'),mat('#935444',.9,0,'brick'),mat('#c08a65',.9,0,'brick'),mat('#6d4e4c',.9,0,'brick'),mat('#a97b5d',.9,0,'brick')],glass=mat('#507b8b',.25,.25),metal=mat('#424b50',.48,.55),black=mat('#292d32'),paint=mat('#e9e0c8'),green=mat('#527f56'),wood=mat('#7b553c',.82,0,'wood'),gold=mat('#e8c783');
 const box=(w,h,d,m,x,y,z,parent=scene)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.receiveShadow=true;o.castShadow=(h>1.3&&w>1&&d>.4);parent.add(o);return o};
 const cyl=(rt,rb,h,m,x,y,z,n=12,parent=scene)=>{const o=new T.Mesh(new T.CylinderGeometry(rt,rb,h,n),m);o.position.set(x,y,z);o.castShadow=h>1.1;parent.add(o);return o};
 const ball=(r,m,x,y,z,parent=scene)=>{const o=new T.Mesh(new T.SphereGeometry(r,12,8),m);o.position.set(x,y,z);parent.add(o);return o};
 const sign=(txt,x,y,z,w=9)=>{const c=document.createElement('canvas');c.width=1024;c.height=200;const g=c.getContext('2d');g.fillStyle='#252e34';g.fillRect(0,0,1024,200);g.fillStyle='#f4e5c6';g.font='900 76px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText(txt,512,105,970);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;const o=new T.Mesh(new T.PlaneGeometry(w,1.7),new T.MeshBasicMaterial({map:t,side:T.DoubleSide}));o.position.set(x,y,z);scene.add(o)};
 // Open neighborhood: streets, crossings, pavement and a central pocket park.
 box(134,.45,134,asphalt,0,-.37,0);
 for(const z of [-38,0,38]){box(134,.09,13,asphalt,0,-.07,z);for(let x=-62;x<65;x+=11)box(5,.012,.12,paint,x,-.009,z)}
 for(const x of [-38,0,38]){box(13,.09,134,asphalt,x,-.07,0);for(let z=-62;z<65;z+=11)box(.12,.012,5,paint,x,-.009,z)}
 for(const [x,z,w,d] of [[-19,-19,23,23],[19,-19,23,23],[-19,19,23,23],[19,19,23,23],[-52,0,12,23],[52,0,12,23]]){
  box(w,.21,d,sidewalk,x,.06,z);box(w-.5,.018,d-.5,concrete,x,.18,z);
 }
 // Five recognizable destination buildings with street-facing entrances.
 const shops=[
  {name:'ARENA PARTY',x:0,z:-29,color:'#b76846',desc:'Minijuegos'},
  {name:'TK SHOP',x:-29,z:0,color:'#a27652',desc:'Ropa y estilo'},
  {name:'CLUB AMIGOS',x:29,z:0,color:'#836b63',desc:'Online'},
  {name:'TROFEOS',x:-29,z:-29,color:'#8c554b',desc:'Trofeos'},
  {name:'PARKOUR',x:29,z:-29,color:'#aa8065',desc:'Parkour'}
 ];
 shops.forEach((s,i)=>{
  const w=i===0?17:14,h=i===0?19:15,d=i===0?16:13;
  box(w,h,d,brick[i],s.x,h/2,s.z);
  box(w+.7,.55,d+.6,concrete,s.x,h+.1,s.z);
  // Cornices, fire escapes and window lintels: classic Brooklyn street architecture.
  for(const level of [4.8,9.4,14]){if(level>h-1)continue;
   for(const dx of [-w*.32,0,w*.32]){
    box(2.4,2.9,.14,glass,s.x+dx,level,s.z+d/2+.085);
    box(2.8,.18,.32,concrete,s.x+dx,level+1.55,s.z+d/2+.22);
    box(2.8,.15,.35,concrete,s.x+dx,level-1.52,s.z+d/2+.22);
    box(.11,2.85,.22,metal,s.x+dx,level,s.z+d/2+.21);
   }
   for(const side of [-1,1]){box(.12,2.7,2.4,glass,s.x+side*w/2,level,s.z);box(.22,.16,2.8,concrete,s.x+side*w/2,level+1.48,s.z)}
  }
  for(const level of [3.6,8.2,12.8]){if(level>h-1)continue;
   const fire=box(3.1,.16,1.05,metal,s.x+w*.29,level,s.z+d/2+1.0);
   for(const xx of [-1.3,1.3])box(.09,1.05,.09,metal,s.x+w*.29+xx,level+.55,s.z+d/2+1.42);
  }
  const front=s.z+d/2+.17;
  box(5.0,4.0,.25,black,s.x,2.0,front);
  box(3.8,3.1,.27,glass,s.x,1.8,front+.13);
  box(5.5,.28,1.7,i===0?gold:metal,s.x,4.25,front+1);
  sign(s.name,s.x,5.5,front+.65,i===0?11:8.2);
  for(const side of [-1,1]){cyl(.23,.3,.6,concrete,s.x+side*(w/2+1.5),.36,front+2);ball(.55,green,s.x+side*(w/2+1.5),1.05,front+2)}
 });
 // Residential background blocks: real streetscape, not a sealed dome.
 const residential=[[-52,-51,16,24],[-16,-52,13,20],[17,-52,14,23],[52,-51,16,27],[-53,50,15,19],[-18,52,14,25],[18,52,14,23],[52,51,16,20],[-53,-18,13,18],[53,20,13,21]];
 residential.forEach(([x,z,w,h],i)=>{const m=brick[(i+2)%brick.length];box(w,h,11,m,x,h/2,z);box(w+.4,.35,11.4,concrete,x,h+.15,z);
  for(let level=4;level<h-1;level+=4.3)for(let dx=-w/2+2.3;dx<w/2-1;dx+=3.3){
   box(1.7,2.1,.13,glass,x+dx,level,z+(z<0?5.58:-5.58));
   box(2.05,.13,.26,concrete,x+dx,level-1.1,z+(z<0?5.7:-5.7));
  }
 });
 // Architectural street details: layered facades, door frames, awnings and balconies.
 const trim=mat('#c6b4a0',.72),iron=mat('#353d43',.5,.5),accent=mat('#dcb16c',.38,.24);
 shops.forEach((sh,i)=>{
  const w=i===0?17:14,d=i===0?16:13,h=i===0?19:15,front=sh.z+d/2+.24;
  for(let y=3.6;y<h-1;y+=4.6){
   box(w+.22,.17,.34,trim,sh.x,y,front-.12);
   for(const dx of [-w*.32,0,w*.32]){
    box(2.45,.10,.42,iron,sh.x+dx,y+.28,front+.11);
    for(let k=0;k<3;k++)box(.035,1.7,.08,iron,sh.x+dx-.77+k*.77,y+1.35,front+.12);
   }
  }
  for(const side of [-1,1]){box(.22,4.2,.36,trim,sh.x+side*2.55,2.05,front+.3);box(.28,1.6,.34,accent,sh.x+side*3.1,3.3,front+.35)}
  const awning=box(5.9,.13,2.15,mat(i%2?'#bd7256':'#3b6577',.7),sh.x,4.05,front+1.2);awning.rotation.x=-.09;
 });
 // Concrete cracks, road repairs and tactile curb details.
 const repair=mat('#353b40',.97,.01,'asphalt');
 for(let i=0;i<22;i++){const x=-51+rnd()*102,z=-51+rnd()*102;const patch=box(.5+rnd()*2,.012,.25+rnd()*1.5,repair,x,-.008,z);patch.rotation.y=rnd()*6.28}
 // Small neon-free warm streetlights and shop-window light accents.
 const glowMat=new T.MeshStandardMaterial({color:'#f6d7a3',emissive:'#ffd4a0',emissiveIntensity:1.7,roughness:.4});
 for(const [x,z] of [[-14,-43],[14,-43],[-43,13],[43,13]]){ball(.23,glowMat,x,6.5,z)}
 const accents=[];
 for(const [x,y,z] of [[0,5,-19],[-29,4,9],[29,4,9]]){const light=new T.PointLight('#ffc88c',1.8,12,2);light.position.set(x,y,z);scene.add(light);accents.push(light)}
 // Street furniture: lamp posts, subway entrance, hydrants, benches, trees.
 const lamps=[];
 for(const x of [-43,-14,14,43])for(const z of [-43,13,43]){if(Math.abs(x)<20&&Math.abs(z)<20)continue;
  cyl(.13,.2,6.3,metal,x,3.15,z,10);ball(.4,gold,x,6.45,z);lamps.push([x,z]);
 }
 for(let i=0;i<18;i++){const a=i*2.399,r=20+(i%4)*6,x=Math.sin(a)*r,z=Math.cos(a)*r;
  if(Math.abs(x)>48||Math.abs(z)>48)continue;
  cyl(.24,.32,3.2,wood,x,1.7,z);ball(1.7,green,x,4,z);ball(1.15,green,x+.8,4.5,z+.35);
  cyl(1.6,1.6,.18,concrete,x,.2,z);
 }
 for(const [x,z] of [[-9,18],[9,18],[-10,-12],[11,12]]){box(3.2,.23,.9,wood,x,.72,z);for(const dx of [-1.1,1.1])box(.16,.65,.65,metal,x+dx,.37,z)}
 for(const [x,z] of [[-13,9],[15,-13],[-43,28],[44,28]]){cyl(.21,.22,.8,mat('#b84d3d'),x,.4,z);cyl(.3,.3,.12,mat('#b84d3d'),x,.76,z)}
 // Basketball court and brick mural make the neighborhood feel lived-in.
 box(13,.045,9,mat('#936c56'),-17,.2,25);
 for(const x of [-22,-12]){cyl(.13,.13,4,metal,x,2.1,25);box(1.6,1.2,.13,paint,x,4.1,25);const hoop=new T.Mesh(new T.TorusGeometry(.42,.055,8,20),mat('#b94e36'));hoop.position.set(x,3.45,25.55);hoop.rotation.x=Math.PI/2;scene.add(hoop)}
 const mural=box(8,4,.12,mat('#d1a568'),-52,5,-44);
 sign('BROOKLYN VIBES',-52,6.1,-43.85,7.3);
 return {shops,update(){}};
}
