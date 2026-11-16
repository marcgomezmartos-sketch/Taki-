// BARBAS V83 — shared environmental art pass for every playable arena.
// Visual meshes only: no collisions or scoring logic altered.
export function premiumWorld(T,root,kind){
 const g=new T.Group();g.name='PREMIUM_V83_'+kind;root.add(g);
 const mat=(c,r=.5,metal=.04)=>new T.MeshStandardMaterial({color:c,roughness:r,metalness:metal});
 const navy=mat('#182b4c'),ivory=mat('#fff2d6'),gold=mat('#ffca55',.35,.17),teal=mat('#17b8c1',.38),coral=mat('#ff6287',.4),blue=mat('#3979f4',.4),green=mat('#2f927c');
 const add=(geo,m,x,y,z)=>{const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=false;o.receiveShadow=true;g.add(o);return o};
 const box=(w,h,d,m,x,y,z)=>add(new T.BoxGeometry(w,h,d),m,x,y,z);
 const cyl=(a,b,h,m,x,y,z,n=12)=>add(new T.CylinderGeometry(a,b,h,n),m,x,y,z);
 const orb=(r,m,x,y,z)=>add(new T.IcosahedronGeometry(r,1),m,x,y,z);
 function banner(text,x,y,z,w=8,h=2,rotation=0){
   const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');
   const grad=ctx.createLinearGradient(0,0,512,128);grad.addColorStop(0,'#142949');grad.addColorStop(1,'#28477c');ctx.fillStyle=grad;ctx.fillRect(0,0,512,128);
   ctx.strokeStyle='#ffcf6e';ctx.lineWidth=10;ctx.strokeRect(6,6,500,116);
   ctx.fillStyle='#fff6d9';ctx.font='900 48px system-ui';ctx.textAlign='center';ctx.fillText(text,256,83,490);
   const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;
   const o=add(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:tex,side:T.DoubleSide,transparent:true}),x,y,z);o.rotation.y=rotation;return o;
 }
 function tree(x,z,s=1){cyl(.17*s,.27*s,2.5*s,mat('#8d5b48'),x,1.2*s,z);for(let i=0;i<3;i++)orb((1.1+i*.12)*s,i%2?green:teal,x+(i-1)*.48*s,(3+i*.33)*s,z)}
 function lantern(x,z,h=4){cyl(.08,.12,h,navy,x,h/2,z);orb(.28,gold,x,h+.12,z)}
 function stadium(){
  const court=mat('#279b9b',.36),lines=ivory;
  box(26,.025,40,court,0,-.175,0);
  for(const x of [-12.3,12.3])box(.09,.025,39,lines,x,-.148,0);
  for(const z of [-19.4,19.4])box(24.7,.025,.09,lines,0,-.148,z);
  box(24.7,.025,.09,lines,0,-.148,0);
  const ring=add(new T.RingGeometry(2.8,2.9,64),lines,0,-.137,0);ring.rotation.x=-Math.PI/2;
  // Realistic bleacher rhythm and perimeter boards instead of random floating shapes.
  for(const side of [-1,1]){
   for(let tier=0;tier<5;tier++){
    const x=side*(14.2+tier*1.9),y=.55+tier*.9;
    box(.12,.7,45,navy,x+side*.85,y+.12,0);
    for(let z=-20;z<=20;z+=4){box(.12,.12,2.5,gold,x+side*.98,y+.6,z)}
   }
   banner('BARBAS FUTSAL',side*13.2,3.2,0,9,1.4,side*Math.PI/2);
  }
  for(const z of [-24.1,24.1]){
   banner('BARBAS ARENA',0,7.4,z,15,2,z>0?Math.PI:0);
   for(let x=-11;x<=11;x+=4)lantern(x,z>0?23.7:-23.7,3.6);
  }
  // Floodlights on court roof with actual illumination.
  for(const x of [-10,10])for(const z of [-13,0,13]){
   box(3.7,.11,1.2,ivory,x,11.45,z);
   const l=new T.PointLight('#fff0cf',7,23,2);l.position.set(x,10.7,z);g.add(l);
  }
 }
 function park(type){
  const racing=['race','water','future','karts'].includes(type);
  const width=type==='karts'?27:25;
  const len=racing?130:65;
  const center=racing?-49:0;
  // Side scenery is deliberately OUTSIDE the playable collision corridor.
  const left=-width,right=width;
  const grass=type==='water'?mat('#d8cba5'):type==='future'?mat('#303d7c'):mat('#4bba8b');
  for(const side of [-1,1]){
   const x=side*width;
   box(11,.3,len,grass,x,-1.4,center);
   for(let i=0;i<9;i++){
    const z=center-len/2+6+i*(len-12)/8;
    if(type==='future'){
     box(2.8,5,2.8,navy,x,1.3,z);
     box(3,.18,3,teal,x,3.9,z);
     box(.2,3,.2,coral,x-side*1.4,1.7,z);
    }else if(type==='water'){
     cyl(1.6,2.2,1.3,ivory,x,-.4,z);
     cyl(.16,.22,3.7,mat('#987154'),x,1.9,z);
     for(let j=0;j<4;j++){const leaf=add(new T.SphereGeometry(1.5,9,6),green,x+Math.cos(j*Math.PI/2)*1.2,4.1,z+Math.sin(j*Math.PI/2)*1.2);leaf.scale.set(.85,.25,1.5);leaf.rotation.y=j*Math.PI/2}
    }else if(i%3===0){tree(x,z,1.15)}
    else if(i%3===1){lantern(x,z,4.3)}
    else{box(3,1.5,2.3,navy,x,.15,z);box(3.3,.22,2.6,gold,x,1.02,z)}
   }
  }
  if(racing){banner(type==='water'?'AQUA RUSH':type==='future'?'NEON SPRINT':type==='karts'?'KART GRAND PRIX':'BARBAS RACE',0,8,-104,13,2.1)}
  else banner(type==='jump'?'SALTA Y SOBREVIVE':type==='rollers'?'ROLLER RUMBLE':'BARBAS PARK',0,8,-20,12,2);
 }
 if(kind==='futsal')stadium();else park(kind);
 return g;
}
