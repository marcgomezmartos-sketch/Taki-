// V84: real procedural 3D mesh assets, PBR textures, and time-based animations.
// Built as geometry rather than flat concept art, optimized for mobile WebGL.
export function buildArtAssets(T,root,kind){
 const group=new T.Group();group.name='V84_3D_ASSETS';root.add(group);
 const animated=[];let seed=4242;const rand=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296};
 function texture(type){
  const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');
  const base=type==='asphalt'?'#404750':type==='wood'?'#9b6c46':type==='stone'?'#a9a69a':'#278a91';
  ctx.fillStyle=base;ctx.fillRect(0,0,256,256);
  for(let i=0;i<3800;i++){const v=rand()*255|0;ctx.fillStyle='rgba('+v+','+v+','+v+','+(type==='asphalt'?.06:.035)+')';ctx.fillRect(rand()*256,rand()*256,rand()*3+1,rand()*3+1)}
  if(type==='stone'||type==='wood'){ctx.strokeStyle='rgba(18,28,35,.18)';ctx.lineWidth=2;for(let j=0;j<7;j++){const y=j*40;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(256,y);ctx.stroke();if(type==='stone')for(let x=j%2?0:50;x<256;x+=90){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+40);ctx.stroke()}}}
  const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.anisotropy=4;return tex;
 }
 const asphalt=texture('asphalt'),stone=texture('stone'),wood=texture('wood'),court=texture('court');
 const mat=(c,r=.42,m=.05)=>new T.MeshStandardMaterial({color:c,roughness:r,metalness:m});
 const gold=mat('#ffcd56',.26,.2),purple=mat('#5736a2',.34),blue=mat('#2570d5',.35),pink=mat('#ef4985',.32),dark=mat('#273345',.52),white=mat('#f8f3e6',.38);
 const add=(geo,m,x,y,z)=>{const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.receiveShadow=true;group.add(o);return o};
 const box=(w,h,d,m,x,y,z)=>add(new T.BoxGeometry(w,h,d),m,x,y,z);
 const cylinder=(r1,r2,h,m,x,y,z,n=16)=>add(new T.CylinderGeometry(r1,r2,h,n),m,x,y,z);
 function tube(points,r,m){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));return add(new T.TubeGeometry(curve,Math.max(12,points.length*6),r,8,false),m,0,0,0)}
 function arch(x,z,scale=1){for(const side of [-1,1])cylinder(.33*scale,.42*scale,5.2*scale,purple,x+side*5*scale,2.6*scale,z);
  tube([[x-5*scale,5.2*scale,z],[x-4*scale,6.3*scale,z],[x,7*scale,z],[x+4*scale,6.3*scale,z],[x+5*scale,5.2*scale,z]],.34*scale,gold);
  for(const side of [-1,1]){const l=new T.Mesh(new T.SphereGeometry(.28*scale,10,8),white);l.position.set(x+side*4.5*scale,5.8*scale,z);group.add(l)}
 }
 function palm(x,z,s=1){
  cylinder(.17*s,.34*s,4.8*s,mat('#8c634a'),x,2.4*s,z);
  for(let i=0;i<7;i++){const a=i*Math.PI*2/7;const pts=[[x,4.9*s,z],[x+Math.cos(a)*1.4*s,5.3*s,z+Math.sin(a)*1.4*s],[x+Math.cos(a)*3*s,3.8*s,z+Math.sin(a)*3*s]];
   tube(pts,.13*s,mat(i%2?'#187c69':'#289d70',.8))}
 }
 function barrier(x,z,side){const m=side>0?pink:white;
  box(.7,.65,3.5,m,x,.18,z);
  const trim=box(.77,.1,3.5,dark,x,.57,z);trim.castShadow=false;
 }
 function spotlight(x,z){cylinder(.12,.16,7,dark,x,3.5,z);const fixture=box(2.3,.55,.8,white,x,7.15,z);fixture.rotation.x=-.3;const light=new T.SpotLight('#fff0dc',35,32,Math.PI/5,.7,2);light.position.set(x,7,z);light.target.position.set(x*.65,0,z*.6);group.add(light,light.target)}
 if(kind==='futsal'){
  const floor=box(25.7,.02,39.7,new T.MeshStandardMaterial({map:court,roughness:.23,metalness:.1}),0,-.18,0);
  floor.material.map.repeat.set(4,6);floor.material.map.needsUpdate=true;
  for(const side of [-1,1])for(let i=0;i<8;i++){const z=-19+i*5.2;barrier(side*13.4,z,side)}
  for(const x of [-12,12])for(const z of [-18,18])spotlight(x,z);
  for(const z of [-19.8,19.8]){
   // Curved net support, posts, and actual grid net.
   for(const x of [-4,4])cylinder(.105,.105,3.2,white,x,1.45,z);
   box(8.2,.13,.13,white,0,3,z);
   const net=new T.MeshBasicMaterial({color:'#dbeaf2',transparent:true,opacity:.48,side:T.DoubleSide,depthWrite:false});
   for(let x=-3.8;x<=3.8;x+=.55)box(.014,2.8,.015,net,x,1.5,z);
   for(let y=.3;y<3;y+=.45)box(7.8,.014,.015,net,0,y,z);
  }
 }else if(['race','water','future','karts'].includes(kind)){
  const kart=kind==='karts',track=kind==='water'?mat('#139fba',.19):kind==='future'?mat('#414aa6',.27):new T.MeshStandardMaterial({map:asphalt,roughness:.58});
  const end=kart?-106:-108;
  if(kart){
   // Continuous visual tarmac overlay; driving collision still uses original route.
   for(let i=0;i<60;i++){const z=8-i*1.92,x=Math.sin(-z/18)*3.2+Math.sin(-z/37)*2.4;box(11.4,.022,1.95,track,x,-.195,z)}
  }else{
   for(const [a,b] of [[10,-10],[-13.2,-32],[-35.2,-52],[-55.2,-75],[-78.2,-110]])box(14.7,.022,Math.abs(a-b),track,0,-.06,(a+b)/2);
  }
  for(let i=0;i<15;i++){
   const z=5-i*7.7,x=kart?Math.sin(-z/18)*3.2+Math.sin(-z/37)*2.4:0;
   for(const side of [-1,1]){
    const bx=x+side*(kart?6.3:8.4);
    barrier(bx,z,side);
    if(i%4===0){palm(bx+side*5,z,1.05)}
   }
  }
  arch(0,end,1);
  if(kind==='water'){
   const waterMat=new T.MeshStandardMaterial({color:'#087da9',roughness:.13,metalness:.12,transparent:true,opacity:.85});
   for(const side of [-1,1]){const w=box(35,.02,120,waterMat,side*29,-1.8,-50);animated.push({mesh:w,type:'water',phase:side})}
  }
  if(kind==='future')for(let i=0;i<9;i++){const z=4-i*13;for(const side of [-1,1]){const p=box(.22,3,.22,side>0?pink:blue,side*9,1.7,z);animated.push({mesh:p,type:'pulse',phase:i*.6})}}
 }else{
  // Survival modes: replace flat silhouettes with dimensional supports and animated set dressing.
  for(let i=0;i<10;i++){const a=i*Math.PI/5,r=18;const x=Math.cos(a)*r,z=Math.sin(a)*r;palm(x,z,.9)}
  arch(0,-17,1.15);
  for(const x of [-13,13])for(const z of [-13,13])spotlight(x,z);
 }
 const update=(dt,time)=>{for(const a of animated){if(a.type==='water')a.mesh.position.y=-1.8+Math.sin(time*1.3+a.phase)*.035;else if(a.type==='pulse')a.mesh.scale.y=.75+Math.sin(time*2+a.phase)*.22}};
 return {group,update};
}
