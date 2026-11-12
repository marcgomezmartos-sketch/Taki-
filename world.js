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
 return {shops,update(t){for(const s of ships){const a=s.phase+t*s.speed;s.g.position.set(Math.sin(a)*s.r,s.height+Math.sin(t*1.2+s.phase)*.5,Math.cos(a)*s.r);s.g.rotation.y=a+Math.PI/2;s.g.rotation.z=Math.sin(t*1.3+s.phase)*.055}}};
}
