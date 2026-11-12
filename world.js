import * as T from 'three';
// Barbas Minigames: enclosed science-fiction megadome hub.
export function crearCiudad(scene){
 const make=(c,metal=.3,rough=.48,emissive=null)=>new T.MeshStandardMaterial({color:c,metalness:metal,roughness:rough,emissive:emissive||'#000000',emissiveIntensity:emissive?.75:0,side:T.DoubleSide});
 const steel=make('#d4e1ec',.48,.35),panel=make('#e4ecf5',.32,.48),dark=make('#a7c7d8',.25,.55),floor=make('#c7dbe7',.22,.7),chrome=make('#f0f5f9',.52,.25),glass=make('#82c8e5',.26,.21,'#225d7d');
 const cyan=new T.MeshBasicMaterial({color:'#62cce8',side:T.DoubleSide}),violet=new T.MeshBasicMaterial({color:'#9b9bdb',side:T.DoubleSide}),gold=new T.MeshBasicMaterial({color:'#e8bb72',side:T.DoubleSide}),pink=new T.MeshBasicMaterial({color:'#e5a6c6',side:T.DoubleSide});
 const mesh=(geo,mat,x=0,y=0,z=0,parent=scene)=>{const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=false;m.receiveShadow=true;parent.add(m);return m};
 const box=(w,h,d,m,x,y,z,p=scene)=>mesh(new T.BoxGeometry(w,h,d),m,x,y,z,p);
 const cyl=(rt,rb,h,m,x,y,z,n=24,p=scene)=>mesh(new T.CylinderGeometry(rt,rb,h,n),m,x,y,z,p);
 const ball=(r,m,x,y,z,p=scene)=>mesh(new T.SphereGeometry(r,16,10),m,x,y,z,p);
 const torus=(r,t,m,x,y,z,p=scene)=>{const a=mesh(new T.TorusGeometry(r,t,8,64),m,x,y,z,p);a.rotation.x=Math.PI/2;return a};
 const sign=(txt,x,y,z,w=10,color='#a6f8ff')=>{const c=document.createElement('canvas');c.width=1024;c.height=160;const ctx=c.getContext('2d');ctx.fillStyle='#081729';ctx.fillRect(0,0,1024,160);ctx.strokeStyle=color;ctx.lineWidth=10;ctx.strokeRect(5,5,1014,150);ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 75px system-ui';ctx.fillText(txt,512,82,980);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return mesh(new T.PlaneGeometry(w,1.55),new T.MeshBasicMaterial({map:t,transparent:true,side:T.DoubleSide}),x,y,z)};
 // Bright enclosed sky garden: an airy futuristic atrium, not a dark cage.
 box(124,.5,124,floor,0,-.42,0);
 const wallMaterial=new T.MeshStandardMaterial({color:'#b7d9e9',roughness:.56,side:T.BackSide});
 mesh(new T.CylinderGeometry(61,61,47,64,1,true),wallMaterial,0,23,0);
 // Translucent-looking blue dome, seen from underneath. Soft colors create daylight.
 const domeMat=new T.MeshBasicMaterial({color:'#a9d9f1',side:T.BackSide,fog:false});
 const dome=mesh(new T.SphereGeometry(61,64,24,0,Math.PI*2,0,Math.PI/2),domeMat,0,46,0);
 dome.scale.y=.54;
 // Minimal structural ribs, warm accent lighting.
 for(const h of [8,25,46])torus(60.5,.12,chrome,0,h,0);
 for(let k=0;k<12;k++){const ang=k*Math.PI/6,x=Math.sin(ang)*60,z=Math.cos(ang)*60;
  cyl(.26,.32,42,chrome,x,21,z,8);
 }
 for(const radius of [25,48])torus(radius,.12,chrome,0,45,0);
 // Soft plaza paving and garden islands bring back the welcoming city atmosphere.
 cyl(19,19,.12,panel,0,.04,0,64);
 for(const radius of [10,17.7])torus(radius,.065,chrome,0,.13,0);
 cyl(3.8,3.8,.35,steel,0,.2,0,48);
 const garden=make('#7fb99d',0,.9),treeTrunk=make('#9a8470',0,.94),leaves=make('#69a98d',0,.9);
 for(let k=0;k<10;k++){const ang=k*Math.PI/5,x=Math.sin(ang)*22,z=Math.cos(ang)*22;
  cyl(2.6,2.6,.22,garden,x,.11,z,24);
  cyl(.19,.25,2.8,treeTrunk,x,1.5,z,10);
  const canopy=ball(1.55,leaves,x,3.5,z);canopy.scale.y=.82;
  cyl(2.75,2.75,.12,chrome,x,.04,z,24);
 }
 // Wide readable pathways to all attractions.
 const paving=make('#f1f5f5',.08,.72);
 for(const [x,z,w,d] of [[0,-16,8,28],[-16,0,28,8],[16,0,28,8],[29,-16,8,28],[-29,-16,8,28]]){
  box(w,.035,d,paving,x,.08,z);
 }
 // Five dedicated futuristic buildings. All gameplay entrances keep their original coordinates.
 const shops=[{name:'ARENA PARTY',x:0,z:-29,color:'#55efff',desc:'Edificio principal: entra a jugar minijuegos.'},{name:'TK SHOP',x:-29,z:0,color:'#ff79d7',desc:'Compra y equipa ropa.'},{name:'CLUB AMIGOS',x:29,z:0,color:'#9b8aff',desc:'Online próximamente.'},{name:'TROFEOS',x:-29,z:-29,color:'#ffd57b',desc:'Próximamente.'},{name:'PARKOUR',x:29,z:-29,color:'#9af8b3',desc:'Salta y gana monedas.'}];
 shops.forEach((s,i)=>{
  const main=i===0,r=main?8.3:6.5,h=main?15.5:12.5,accent=[cyan,pink,violet,gold,cyan][i];
  // Modern rounded glass-and-white architecture, with fewer cleaner details.
  cyl(r,r,h,steel,s.x,h/2,s.z,32);
  cyl(r+.3,r+.3,.35,chrome,s.x,.26,s.z,40);
  for(let level of [3.5,7.7,h-.4])torus(r+.07,.105,accent,s.x,level,s.z);
  for(let j=0;j<12;j++){const angle=j*Math.PI/6,x=s.x+Math.sin(angle)*(r+.04),z=s.z+Math.cos(angle)*(r+.04);
   const window=box(2.55,3.0,.12,glass,x,5.45,z);window.rotation.y=angle;
   const window2=box(2.55,2.5,.12,glass,x,10.2,z);window2.rotation.y=angle;
   const seam=box(.11,h-.8,.12,chrome,x,h/2,z);seam.rotation.y=angle;
  }
  // Elegant rounded roof with a subtle beacon.
  const roof=mesh(new T.SphereGeometry(r+.25,32,12,0,Math.PI*2,0,Math.PI/2),panel,s.x,h,s.z);
  roof.scale.y=.3;
  torus(r+.2,.17,chrome,s.x,h,s.z);
  const spire=cyl(.25,.5,2.3,chrome,s.x,h+2.2,s.z,12);
  ball(.36,accent,s.x,h+3.6,s.z);
  const front=s.z+r+.12;
  box(4.6,5.4,.25,chrome,s.x,2.7,front);
  box(3.65,4.5,.27,glass,s.x,2.45,front+.16);
  for(const xx of [-2.2,2.2])box(.15,5.1,.3,accent,s.x+xx,2.7,front+.25);
  sign(main?'★ MINIJUEGOS ★':s.name,s.x,h-1.3,front+.5,main?9:7,s.color);
  if(main){const ring=torus(2.1,.12,gold,s.x,h+6,s.z);ring.rotation.x=.15}
 });
 // Raised holographic arrows guide players from spawn to the main arena.
 for(let i=0;i<7;i++){const z=-3.2-i*3.05;
  const arrow=mesh(new T.ConeGeometry(.65,1.6,3),gold,0,.23,z);arrow.rotation.x=-Math.PI/2;arrow.rotation.z=Math.PI/2;
  for(const x of [-2.4,2.4])box(.13,.025,2.2,cyan,x,.12,z);
 }
 // Clean futuristic city furniture, seating and floating displays.
 for(let i=0;i<8;i++){const ang=i*Math.PI/4,r=39,x=Math.sin(ang)*r,z=Math.cos(ang)*r;
  cyl(1.2,1.5,.6,panel,x,.3,z,16);
  cyl(.13,.17,3.5,chrome,x,2.2,z,10);
  const light=ball(.55,cyan,x,4,z);light.scale.y=.5;
 }
 // V44 visual overhaul: patterned paving, sculpted gardens, architectural depth and animated holograms.
 const stoneTile=make('#dbe8ee',.12,.78),darkTile=make('#9cb6c7',.18,.66),warm=make('#ffebce',.12,.55);
 // Distinct paved avenues and inset floor panels instead of an empty flat surface.
 for(let x=-54;x<=54;x+=6)for(let z=-54;z<=54;z+=6){
  if(Math.hypot(x,z)>56)continue;
  const m=((Math.round(x/6)+Math.round(z/6))%3===0)?stoneTile:floor;
  const tile=box(5.82,.012,5.82,m,x,-.145,z);
  if((Math.round(x/6)+Math.round(z/6))%7===0)box(1.6,.018,.06,chrome,x,-.128,z);
 }
 // Flowing cyan inlaid routes to each activity, with directional chevrons.
 const paths=[{x:0,z:-22,w:5.7,d:31},{x:-21,z:0,w:31,d:5.7},{x:21,z:0,w:31,d:5.7},{x:-20,z:-29,w:29,d:5.7},{x:20,z:-29,w:29,d:5.7}];
 for(const p of paths){box(p.w,.025,p.d,stoneTile,p.x,.09,p.z);
  if(p.w>p.d){for(const z of [p.z-2.65,p.z+2.65])box(p.w,.028,.065,cyan,p.x,.112,z)}
  else{for(const x of [p.x-2.65,p.x+2.65])box(.065,.028,p.d,cyan,x,.112,p.z)}
 }
 // Floating garden terraces, decorative planting and flower-like light pods.
 const green1=make('#69ad8f',0,.9),green2=make('#a2c7a7',0,.9),wood=make('#b99c7b',.08,.82);
 for(let i=0;i<16;i++){const a=i*Math.PI*2/16,rr=33+(i%3)*2.5,x=Math.sin(a)*rr,z=Math.cos(a)*rr;
  cyl(2.05,2.25,.6,chrome,x,.31,z,20);
  cyl(1.82,1.82,.12,green1,x,.66,z,20);
  for(let j=0;j<3;j++){const ang=j*2.09+i;const xx=x+Math.sin(ang)*.87,zz=z+Math.cos(ang)*.87;
   const shrub=ball(.64,j%2?green2:green1,xx,1.2,zz);shrub.scale.y=.75;
  }
  if(i%2===0){cyl(.09,.11,2.0,wood,x,1.65,z,8);const crown=ball(.8,green2,x,2.7,z);crown.scale.y=.8}
 }
 // Elegant elevated bridge rails and detailed shopfronts.
 for(const [i,sh] of shops.entries()){
  const r=i===0?8.3:6.5,h=i===0?15.5:12.5,accent=[cyan,pink,violet,gold,cyan][i];
  for(let j=0;j<12;j++){const a=j*Math.PI/6,x=sh.x+Math.sin(a)*(r+.28),z=sh.z+Math.cos(a)*(r+.28);
   for(const y of [2.4,6.8,10.5]){const lamp=box(1.0,.10,.13,accent,x,y,z);lamp.rotation.y=a}
   const balcony=box(2.3,.15,.5,chrome,x,8.1,z);balcony.rotation.y=a;
  }
  for(const y of [4.2,8.8]){const band=torus(r+.42,.1,chrome,sh.x,y,sh.z);band.castShadow=false}
  // Front plaza signage and projecting light canopy.
  const front=sh.z+r+1.1;
  box(6.6,.26,2.3,chrome,sh.x,5.3,front);
  box(6.1,.08,2.3,accent,sh.x,5.12,front);
  for(const xx of [-2.8,2.8])cyl(.12,.12,4.7,chrome,sh.x+xx,2.4,front+1,10);
  for(const xx of [-4.7,4.7]){cyl(.55,.62,.48,chrome,sh.x+xx,.25,front+1.8);ball(.43,accent,sh.x+xx,.85,front+1.8)}
 }
 // Landmark sculptures and seating make the hub feel inhabited.
 for(let i=0;i<8;i++){const a=i*Math.PI/4,rr=26,x=Math.sin(a)*rr,z=Math.cos(a)*rr;
  const seat=box(3.5,.36,1.0,wood,x,.47,z);seat.rotation.y=a;
  for(const v of [-1.2,1.2]){const leg=box(.17,.4,.8,chrome,x+Math.cos(a)*v,.23,z-Math.sin(a)*v);leg.rotation.y=a}
 }
 const holo=[];
 for(let i=0;i<5;i++){const sh=shops[i],g=new T.Group();scene.add(g);
  g.position.set(sh.x,19+(i===0?4:0),sh.z);
  const icon=mesh(new T.OctahedronGeometry(i===0?1.7:1.0),[gold,pink,violet,gold,cyan][i],0,0,0,g);
  const ring=mesh(new T.TorusGeometry(i===0?2.8:1.7,.075,8,40),chrome,0,0,0,g);
  holo.push({g,icon,ring,phase:i*.9});
 }
 // V46 landmark architecture: lively centerpiece, light sculpture and transit pods.
 const pearl=make('#f8f2e5',.24,.25),water=make('#61c9e5',.2,.18),copper=make('#e6ad7c',.45,.35);
 // Circular landmark fountain with cascading water layers, visible at spawn.
 cyl(5.4,5.4,.65,chrome,0,.36,0,48);
 cyl(4.95,4.95,.12,water,0,.75,0,48);
 for(let i=0;i<8;i++){const a=i*Math.PI/4,x=Math.sin(a)*4,z=Math.cos(a)*4;
  const jet=cyl(.09,.13,1.1,water,x,1.35,z,8);jet.rotation.z=Math.sin(a)*.15;
  ball(.22,pearl,x,2.03,z);
 }
 cyl(1.4,1.9,1.0,chrome,0,1.4,0,24);
 const crystal=mesh(new T.OctahedronGeometry(2.15,0),glass,0,5.1,0);
 const orbitA=torus(3.25,.11,copper,0,5.1,0);orbitA.rotation.x=.8;
 const orbitB=torus(2.7,.09,cyan,0,5.1,0);orbitB.rotation.z=.7;
 // Colorful high-level transit lines and floating glass platforms.
 const transit=[];
 for(let i=0;i<8;i++){const a=i*Math.PI/4,r=39,x=Math.sin(a)*r,z=Math.cos(a)*r;
  const pod=new T.Group();scene.add(pod);
  const hull=mesh(new T.SphereGeometry(1.5,16,10),i%2?glass:pearl,0,0,0,pod);hull.scale.set(1,.55,.8);
  box(2.1,.13,1.4,chrome,0,-.36,0,pod);
  for(const xx of [-.85,.85])ball(.16,i%2?pink:cyan,xx,-.36,.75,pod);
  transit.push({pod,a,r,height:14+i%3*2});
 }
 // Architectural ribbons and banners to distinguish the attractions.
 for(let i=0;i<shops.length;i++){const sh=shops[i],accent=[cyan,pink,violet,gold,cyan][i],front=sh.z+(i===0?8.3:6.5)+3;
  for(const dx of [-6.4,6.4]){
   cyl(.16,.22,7,chrome,sh.x+dx,3.5,front,10);
   const banner=box(1.3,3.5,.12,accent,sh.x+dx,5.0,front);
   box(1.5,.18,.2,chrome,sh.x+dx,6.85,front);
  }
  // Glass pavement display pads create depth at each entrance.
  for(let j=-2;j<=2;j++)box(.7,.05,1.1,j%2?water:chrome,sh.x+j*1.1,.13,front+3);
 }
 // Decorative street gardens with colorful flowering lights.
 for(let i=0;i<30;i++){const a=i*2.39996,r=25+(i%5)*3.6,x=Math.sin(a)*r,z=Math.cos(a)*r;
  if(Math.hypot(x,z)>53)continue;
  cyl(.08,.12,.65,green1,x,.55,z,7);
  ball(.2,[pink,gold,cyan,violet][i%4],x,.93,z);
 }
 // Small flying ships orbit below the capsule ceiling, animated in update().
 const ships=[];
 for(let i=0;i<5;i++){const g=new T.Group();scene.add(g);const body=mesh(new T.SphereGeometry(1.8,16,8),panel,0,0,0,g);body.scale.set(1,.25,.65);
  const cockpit=ball(.72,glass,0,.32,0,g);cockpit.scale.set(1,.38,.8);
  for(const side of [-1,1]){box(2.3,.12,.8,steel,side*1.65,0,0,g);ball(.25,cyan,side*2.6,.06,0,g)}
  box(.65,.22,.15,pink,0,0,1.2,g);
  ships.push({g,r:22+i*6,phase:i*Math.PI*2/7,speed:(i%2?-.12:.14)+i*.008,height:36+(i%3)*3});
 }
 // Lights tuned for mobile: emissive materials do most of the work.
 const centerLight=new T.PointLight('#eaf8ff',18,45,2);centerLight.position.set(0,20,0);scene.add(centerLight);
 const arenaLight=new T.PointLight('#fff2d9',13,24,2);arenaLight.position.set(0,14,-29);scene.add(arenaLight);
 return {shops,update(t){crystal.rotation.y=t*.25;crystal.position.y=5.1+Math.sin(t*1.1)*.25;orbitA.rotation.y=t*.18;orbitB.rotation.y=-t*.2;for(const p of transit){const a=p.a+t*.075;p.pod.position.set(Math.sin(a)*p.r,p.height+Math.sin(t+p.a)*.22,Math.cos(a)*p.r);p.pod.rotation.y=a+Math.PI/2}for(const h of holo){h.g.position.y=19+(h.phase===0?4:0)+Math.sin(t*1.2+h.phase)*.38;h.icon.rotation.y=t*.48;h.ring.rotation.y=t*.27;h.ring.rotation.x=Math.sin(t*.4+h.phase)*.23}for(const s of ships){const a=s.phase+t*s.speed;s.g.position.set(Math.sin(a)*s.r,s.height+Math.sin(t*1.2+s.phase)*.5,Math.cos(a)*s.r);s.g.rotation.y=a+Math.PI/2;s.g.rotation.z=Math.sin(t*1.3+s.phase)*.055}}};
}
