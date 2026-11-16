// Barbas Minigames V81 — lightweight, shared amusement-park art direction.
// Decorative only: no collision meshes are changed.
export function decorateArena(T,parent,kind='race'){
 const g=new T.Group();g.name='BARBAS_THEME_'+kind;parent.add(g);
 const palette={race:['#ff4eab','#ffcf43','#28cbf1'],water:['#20d7ed','#ffcc38','#ff67aa'],future:['#aa64ff','#35eaff','#ffda4c'],karts:['#ffbb36','#ff5d8b','#25d7ec'],futsal:['#238ce9','#ffca37','#f7faff'],rollers:['#f864ac','#ffd84c','#46d8ee'],jump:['#8e62f4','#ff6baf','#fbd953'],shop:['#ed9a4f','#282b56','#ffdc84'],parkour:['#ec73be','#56d8d0','#ffd56b'],arena:['#e869b3','#58cbe8','#ffdd72']}[kind]||['#ff61a7','#ffd84c','#48d8ef'];
 const m=c=>new T.MeshStandardMaterial({color:c,roughness:.46,metalness:.08});
 const mats=palette.map(m),white=m('#f8f3e6'),dark=m('#263252');
 const put=(geo,mat,x,y,z,rx=0,ry=0,rz=0)=>{const o=new T.Mesh(geo,mat);o.position.set(x,y,z);o.rotation.set(rx,ry,rz);o.receiveShadow=true;g.add(o);return o};
 const tube=(r,R,mat,x,y,z)=>put(new T.TorusGeometry(r,R,8,24),mat,x,y,z);
 const pole=(x,y,z,h,mat)=>put(new T.CylinderGeometry(.14,.19,h,8),mat,x,y+h/2,z);
 const arch=(x,z,w,h,primary)=>{for(const side of [-1,1]){pole(x+side*w/2,0,z,h-1,primary);put(new T.SphereGeometry(.4,10,7),white,x+side*w/2,h-1,z)}put(new T.TorusGeometry(w/2,.32,8,24,Math.PI),primary,x,h-1,z,0,0,0);put(new T.BoxGeometry(w*.48,.56,.16),dark,x,h+.25,z)};
 const banner=(x,z,side=1)=>{pole(x,0,z,5,mats[1]);put(new T.PlaneGeometry(1.65,2.4),mats[0],x+side*.8,3.9,z,0,side*.3,0);put(new T.SphereGeometry(.27,8,6),white,x,5.1,z)};
 const ring=(x,y,z,r)=>{tube(r,.3,mats[0],x,y,z);tube(r-.43,.1,mats[1],x,y,z);put(new T.SphereGeometry(.42,12,8),white,x,y+r,z)};
 if(kind==='futsal'){
  for(const z of [-22,22])for(const x of [-10,10]){pole(x,0,z,8,mats[1]);put(new T.SphereGeometry(.65,10,8),white,x,8,z)}
  for(const z of [-17,0,17])for(const x of [-22,22])banner(x,z,x>0?-1:1);
  for(const z of [-13,13]){put(new T.TorusGeometry(3,.14,8,30),mats[1],0,10.7,z,Math.PI/2);put(new T.SphereGeometry(.45,12,8),white,0,10.7,z)}
 }else if(kind==='shop'){
  for(const z of [-38,-14,12,36]){arch(0,z,11,5.6,mats[1]);for(const x of [-13.5,13.5])banner(x,z,x>0?-1:1)}
  for(const x of [-12,12])for(const z of [-45,-25,-5,15,35]){put(new T.CylinderGeometry(.65,.82,.65,12),mats[0],x,.3,z);put(new T.SphereGeometry(.65,10,8),mats[2],x,1,z)}
 }else if(kind==='parkour'){
  for(const z of [-1,-16.8,-34]){ring(0,5,z,2.5);for(const x of [-4.6,4.6])banner(x,z,x>0?-1:1)}
  for(const z of [-8.5,-21,-29.5]){put(new T.TorusGeometry(2.2,.24,8,24),mats[1],0,4.7,z);put(new T.SphereGeometry(.5,10,8),mats[0],0,7,z)}
 }else if(kind==='karts'){
  for(const z of [5,-28,-60,-94]){arch(0,z,18,7,mats[0]);for(const x of [-12,12])banner(x,z,x>0?-1:1)}
  for(const z of [-15,-45,-75]){for(const x of [-13,13]){put(new T.CylinderGeometry(1.3,1.5,1.8,14),mats[1],x,.8,z);tube(1.4,.19,mats[2],x,1.8,z)}}
 }else if(kind==='rollers'||kind==='jump'){
  for(const z of [-10,0,10])for(const x of [-14,14]){banner(x,z,x>0?-1:1);put(new T.TorusGeometry(1.2,.3,8,20),mats[2],x,6,z)}
  for(const x of [-8,0,8])ring(x,6,-14,1.5);
 }else{
  for(const z of [-3,-24,-47,-70,-99]){arch(0,z,16,6.5,mats[0]);for(const x of [-10.5,10.5])banner(x,z,x>0?-1:1)}
  for(const z of [-18,-42,-64,-86])for(const x of [-11.5,11.5]){put(new T.CylinderGeometry(1.25,1.4,2.2,14),mats[2],x,1.3,z,0,0,Math.PI/2);put(new T.TorusGeometry(1.1,.23,8,18),mats[1],x,1.3,z,0,Math.PI/2)}
 }
 return g;
}
