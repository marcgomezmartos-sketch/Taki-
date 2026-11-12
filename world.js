import * as T from 'three';
// Barbas Minigames: enclosed science-fiction megadome hub.
export function crearCiudad(scene){
 const make=(c,metal=.3,rough=.48,emissive=null)=>new T.MeshStandardMaterial({color:c,metalness:metal,roughness:rough,emissive:emissive||'#000000',emissiveIntensity:emissive?.75:0,side:T.DoubleSide});
 const steel=make('#17283d',.75,.32),panel=make('#283d57',.66,.4),dark=make('#0b1426',.55,.43),floor=make('#20334b',.35,.65),chrome=make('#a3c3d5',.83,.21),glass=make('#327ba1',.45,.17,'#0a253d');
 const cyan=new T.MeshBasicMaterial({color:'#48efff',side:T.DoubleSide}),violet=new T.MeshBasicMaterial({color:'#a177ff',side:T.DoubleSide}),gold=new T.MeshBasicMaterial({color:'#ffd57b',side:T.DoubleSide}),pink=new T.MeshBasicMaterial({color:'#ff77d2',side:T.DoubleSide});
 const mesh=(geo,mat,x=0,y=0,z=0,parent=scene)=>{const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=false;m.receiveShadow=true;parent.add(m);return m};
 const box=(w,h,d,m,x,y,z,p=scene)=>mesh(new T.BoxGeometry(w,h,d),m,x,y,z,p);
 const cyl=(rt,rb,h,m,x,y,z,n=24,p=scene)=>mesh(new T.CylinderGeometry(rt,rb,h,n),m,x,y,z,p);
 const ball=(r,m,x,y,z,p=scene)=>mesh(new T.SphereGeometry(r,16,10),m,x,y,z,p);
 const torus=(r,t,m,x,y,z,p=scene)=>{const a=mesh(new T.TorusGeometry(r,t,8,64),m,x,y,z,p);a.rotation.x=Math.PI/2;return a};
 const sign=(txt,x,y,z,w=10,color='#a6f8ff')=>{const c=document.createElement('canvas');c.width=1024;c.height=160;const ctx=c.getContext('2d');ctx.fillStyle='#081729';ctx.fillRect(0,0,1024,160);ctx.strokeStyle=color;ctx.lineWidth=10;ctx.strokeRect(5,5,1014,150);ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 75px system-ui';ctx.fillText(txt,512,82,980);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return mesh(new T.PlaneGeometry(w,1.55),new T.MeshBasicMaterial({map:t,transparent:true,side:T.DoubleSide}),x,y,z)};
 // Entire environment is INSIDE a sealed metallic capsule. No outdoor sky.
 box(124,.5,124,floor,0,-.42,0);
 cyl(61.8,61.8,46,dark,0,23,0,96);
 const interior=mesh(new T.CylinderGeometry(60.7,60.7,46,96,1,true),steel,0,23,0);
 interior.material.side=T.BackSide;
 const roof=mesh(new T.SphereGeometry(61,64,20,0,Math.PI*2,0,Math.PI/2),dark,0,43,0);
 roof.material.side=T.BackSide;roof.scale.y=.42;
 // Luminous ceiling ribs and radial ring systems.
 for(let h of [9,19,31,43])torus(60.5,.18,h%2?cyan:violet,0,h,0);
 for(let k=0;k<32;k++){const a=k*Math.PI/16,x=Math.sin(a)*60,z=Math.cos(a)*60;
  box(.32,42,.32,k%4===0?cyan:panel,x,22,z);
  if(k%4===0)ball(.5,gold,x,39,z);
 }
 for(let radius of [14,29,45,57])torus(radius,.18,radius===29?gold:cyan,0,44,0);
 for(let k=0;k<24;k++){const a=k*Math.PI/12;const x=Math.sin(a)*49,z=Math.cos(a)*49;const light=box(4,.12,.4,cyan,x,45,z);light.rotation.y=a}
 // Futuristic dark plaza with high-contrast luminous navigation.
 cyl(19,19,.13,panel,0,.05,0,64);
 for(let radius of [8,13.5,18.6])torus(radius,.095,cyan,0,.13,0);
 cyl(4.2,4.2,.22,steel,0,.17,0,40);torus(4.0,.17,gold,0,.31,0);
 const core=ball(1.5,glass,0,3.2,0);core.scale.y=1.5;torus(2.4,.11,cyan,0,3.2,0);
 // Five dedicated futuristic buildings. All gameplay entrances keep their original coordinates.
 const shops=[{name:'ARENA PARTY',x:0,z:-29,color:'#55efff',desc:'Edificio principal: entra a jugar minijuegos.'},{name:'TK SHOP',x:-29,z:0,color:'#ff79d7',desc:'Compra y equipa ropa.'},{name:'CLUB AMIGOS',x:29,z:0,color:'#9b8aff',desc:'Online próximamente.'},{name:'TROFEOS',x:-29,z:-29,color:'#ffd57b',desc:'Próximamente.'},{name:'PARKOUR',x:29,z:-29,color:'#9af8b3',desc:'Salta y gana monedas.'}];
 shops.forEach((s,i)=>{
  const main=i===0,r=main?8.3:6.5,h=main?19:14.5,accent=[cyan,pink,violet,gold,cyan][i];
  cyl(r,r,h,steel,s.x,h/2,s.z,12);
  cyl(r+.8,r+.8,.65,chrome,s.x,.32,s.z,12);
  for(const level of [2.4,6.7,11.2,h-.55])torus(r+.12,.18,accent,s.x,level,s.z);
  // Faceted towers with huge glass window modules, vertical luminous seams.
  for(let j=0;j<12;j++){const a=j*Math.PI/6,x=s.x+Math.sin(a)*(r+.11),z=s.z+Math.cos(a)*(r+.11);
   const pane=box(2.5,main?9:7,.12,glass,x,h*.54,z);pane.rotation.y=a;
   const strip=box(.13,h-.9,.15,j%3===0?accent:chrome,x,h/2,z);strip.rotation.y=a;
   const lamp=ball(.22,accent,x,h-1,z);
  }
  cyl(r*.76,r*.95,3.3,panel,s.x,h+1.65,s.z,12);
  torus(r*.78,.27,accent,s.x,h+3.2,s.z);
  cyl(1.0,2.5,3.3,glass,s.x,h+4.9,s.z,8);
  ball(.72,accent,s.x,h+7.1,s.z);
  // Bright portal: visible entrance on the side facing the plaza.
  const front=s.z+r+.12;
  box(4.8,5.8,.4,dark,s.x,3.0,front);
  box(3.65,4.7,.42,glass,s.x,2.7,front+.23);
  for(const x of [-2.3,2.3])box(.24,5.7,.4,accent,s.x+x,3,front+.36);
  box(5.0,.26,.4,accent,s.x,5.8,front+.35);
  sign(main?'MINIJUEGOS · ENTRA AQUI':s.name,s.x,h-2,front+.5,main?11:8,s.color);
  // Floating marker above each building; arena is by far the largest.
  const beacon=torus(main?3.1:1.55,.19,accent,s.x,h+9.5,s.z);beacon.rotation.x=.2;
 });
 // Raised holographic arrows guide players from spawn to the main arena.
 for(let i=0;i<7;i++){const z=-3.2-i*3.05;
  const arrow=mesh(new T.ConeGeometry(.65,1.6,3),gold,0,.23,z);arrow.rotation.x=-Math.PI/2;arrow.rotation.z=Math.PI/2;
  for(const x of [-2.4,2.4])box(.13,.025,2.2,cyan,x,.12,z);
 }
 // Suspended skyways and futuristic infrastructure.
 for(let i=0;i<12;i++){const a=i*Math.PI/6,r=49,x=Math.sin(a)*r,z=Math.cos(a)*r;
  const pillar=cyl(.6,.85,22,panel,x,11,z,8);
  for(const h of [3,11,19])torus(.82,.09,cyan,x,h,z);
  const top=box(3.2,1.0,3.2,chrome,x,23,z);top.rotation.y=a;
 }
 // Futuristic billboards and display pods along the inner ring.
 for(let i=0;i<10;i++){const a=i*Math.PI/5,r=46,x=Math.sin(a)*r,z=Math.cos(a)*r;
  cyl(1.6,2.0,.5,panel,x,.3,z,8);
  cyl(.12,.2,4.2,chrome,x,2.5,z,8);
  const screen=box(3.1,2.0,.18,i%2?glass:panel,x,5,z);screen.rotation.y=a;
  box(3.2,.1,.22,i%2?pink:cyan,x,6.05,z).rotation.y=a;
 }
 // Small flying ships orbit below the capsule ceiling, animated in update().
 const ships=[];
 for(let i=0;i<7;i++){const g=new T.Group();scene.add(g);const body=mesh(new T.SphereGeometry(1.8,16,8),panel,0,0,0,g);body.scale.set(1,.25,.65);
  const cockpit=ball(.72,glass,0,.32,0,g);cockpit.scale.set(1,.38,.8);
  for(const side of [-1,1]){box(2.3,.12,.8,steel,side*1.65,0,0,g);ball(.25,cyan,side*2.6,.06,0,g)}
  box(.65,.22,.15,pink,0,0,1.2,g);
  ships.push({g,r:18+i*4.8,phase:i*Math.PI*2/7,speed:(i%2?-.12:.14)+i*.008,height:31+(i%3)*3});
 }
 // Lights tuned for mobile: emissive materials do most of the work.
 const centerLight=new T.PointLight('#65dfff',35,45,2);centerLight.position.set(0,20,0);scene.add(centerLight);
 const arenaLight=new T.PointLight('#8b9fff',20,24,2);arenaLight.position.set(0,14,-29);scene.add(arenaLight);
 return {shops,update(t){for(const s of ships){const a=s.phase+t*s.speed;s.g.position.set(Math.sin(a)*s.r,s.height+Math.sin(t*1.2+s.phase)*.5,Math.cos(a)*s.r);s.g.rotation.y=a+Math.PI/2;s.g.rotation.z=Math.sin(t*1.3+s.phase)*.055}}};
}
