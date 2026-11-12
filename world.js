import * as T from 'three';
export function crearCiudad(scene){
 const mat=(c,r=.83,metal=0)=>new T.MeshStandardMaterial({color:c,roughness:r,metalness:metal});

 // Replace these file paths with your own seamless image assets.
 // Images load asynchronously; procedural textures remain as fallback.
 const TEXTURE_FILES={stone:'assets/suelo_piedra.jpg',road:'assets/carretera.jpg',wall:'assets/pared.jpg',grass:'assets/cesped.jpg'};
 const loadedTextures={};
 for(const [kind,url] of Object.entries(TEXTURE_FILES)){
   const image=new Image();image.decoding='async';image.onload=()=>{
     const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;
     const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0,512,512);
     const t=new T.CanvasTexture(canvas);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;
     loadedTextures[kind]=t;
     for(const entry of pendingTextures){if(entry.kind!==kind)continue;const copy=t.clone();copy.needsUpdate=true;copy.repeat.set(entry.rx,entry.ry);entry.material.map=copy;entry.material.needsUpdate=true}
   };image.onerror=()=>{};image.src=url;
 }
 const pendingTextures=[];
 const texture=(kind,base,seed=1)=>{
   const c=document.createElement('canvas');c.width=512;c.height=512;const q=c.getContext('2d');
   let rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
   q.fillStyle=base;q.fillRect(0,0,512,512);
   if(kind==='stone'||kind==='road'){
     const rows=kind==='stone'?12:20,cell=512/rows;
     for(let j=0;j<rows;j++)for(let i=0;i<rows;i++){
       let v=Math.floor(rnd()*24),a=kind==='stone'?`rgba(117,81,65,${.035+rnd()*.07})`:`rgba(230,218,200,${.02+rnd()*.04})`;
       q.fillStyle=a;q.fillRect(i*cell+1+(j%2)*cell*.25,j*cell+1,cell-2,cell-2);
     }
     q.strokeStyle=kind==='stone'?'rgba(106,75,65,.13)':'rgba(245,240,228,.06)';
     q.lineWidth=1;for(let j=0;j<rows;j++){q.beginPath();q.moveTo(0,j*cell);q.lineTo(512,j*cell);q.stroke()}
   }else if(kind==='wall'){
     for(let j=0;j<34;j++)for(let i=0;i<18;i++){q.fillStyle=`rgba(255,255,255,${rnd()*.065})`;q.fillRect(i*30+(j%2)*15,j*15,29,14)}
     for(let k=0;k<4500;k++){q.fillStyle=`rgba(66,49,52,${rnd()*.065})`;q.fillRect(rnd()*512,rnd()*512,1+rnd()*2,1+rnd()*2)}
   }else if(kind==='grass'){
     for(let k=0;k<14000;k++){q.fillStyle=rnd()>.5?'rgba(255,235,155,.12)':'rgba(20,80,47,.12)';q.fillRect(rnd()*512,rnd()*512,1+rnd()*3,2+rnd()*5)}
   }
   let t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=4;return t;
 };
 const textured=(kind,color,repeatX=1,repeatY=1)=>{let t=texture(kind,color,Math.floor(color.length*1337+repeatX*19));t.repeat.set(repeatX,repeatY);const material=new T.MeshStandardMaterial({map:t,roughness:.82});pendingTextures.push({kind,rx:repeatX,ry:repeatY,material});if(loadedTextures[kind]){const copy=loadedTextures[kind].clone();copy.needsUpdate=true;copy.repeat.set(repeatX,repeatY);material.map=copy}return material};
 const masonry=textured('stone','#d9c5ad',10,10),lawn=textured('grass','#77a879',15,15),asphalt=textured('road','#5b6271',8,8);
 const stone=mat('#f3dcca'),ivory=mat('#fff0d7'),terracotta=mat('#c77c76'),navy=mat('#333a61'),grass=mat('#6ba77a'),darkGrass=mat('#428d72'),wood=mat('#a16e54'),gold=mat('#efc477',.35,.2),glass=new T.MeshPhysicalMaterial({color:'#80d8e6',roughness:.13,metalness:.2,transparent:true,opacity:.73,side:T.DoubleSide}),water=new T.MeshPhysicalMaterial({color:'#47c4d5',roughness:.1,metalness:.18,transparent:true,opacity:.85});
 const mesh=(geo,m,x=0,y=0,z=0,parent=scene)=>{let o=new T.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o};
 const cyl=(r1,r2,h,m,x,y,z,n=24)=>mesh(new T.CylinderGeometry(r1,r2,h,n),m,x,y,z);
 const sphere=(r,m,x,y,z,detail=1)=>mesh(new T.IcosahedronGeometry(r,detail),m,x,y,z);
 const box=(w,h,d,m,x,y,z)=>mesh(new T.BoxGeometry(w,h,d),m,x,y,z);
 const ring=(r,t,m,x,y,z)=>{let o=mesh(new T.TorusGeometry(r,t,7,64),m,x,y,z);o.rotation.x=Math.PI/2;return o};
 const curved=(points,r,m)=>mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),Math.max(16,points.length*6),r,7,false),m);
 const sign=(name,x,y,z,w=8)=>{let c=document.createElement('canvas');c.width=1024;c.height=192;let q=c.getContext('2d');q.fillStyle='#252c4b';q.fillRect(0,0,1024,192);q.fillStyle='#ffe5a2';q.textAlign='center';q.textBaseline='middle';q.font='900 84px system-ui';q.fillText(name,512,98,940);let tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;return mesh(new T.PlaneGeometry(w,1.55),new T.MeshBasicMaterial({map:tex,side:T.DoubleSide}),x,y,z)};
 // Soft organic terrain and broad avenues: curved shapes instead of square tiled platforms.
 box(146,.45,146,lawn,0,-.45,0);
 const road=asphalt;
 for(let z of [-42,42]){box(142,.065,10,road,0,-.14,z);for(let x=-65;x<65;x+=11)box(4,.012,.12,ivory,x,-.097,z)}
 for(let x of [-42,42]){box(10,.065,142,road,x,-.13,0);for(let z=-65;z<65;z+=11)box(.12,.012,4,ivory,x,-.09,z)}
 // Oval plaza with smooth concentric rings and inlaid mosaic arcs.
 cyl(20,20,.18,masonry,0,-.04,0,96);cyl(18.7,18.7,.025,textured('stone','#e7cfc0',8,8),0,.064,0,96);
 for(let r of [10.2,15.1,18.4])ring(r,.075,ivory,0,.087,0);
 for(let i=0;i<32;i++){let a=i*Math.PI/16;let o=mesh(new T.TorusGeometry(16.8,.095,5,7,Math.PI/9),i%2?terracotta:gold,0,.091,0);o.rotation.set(Math.PI/2,0,a)}
 // Sculptural fountain: curved layered basins, bowl profiles, moving water droplets.
 const bowlProfile=[[0,0],[4.3,0],[4.7,.22],[4.6,.58],[4.3,.79],[3.8,.81],[3.72,.69],[0,.69]].map(p=>new T.Vector2(...p));
 mesh(new T.LatheGeometry(bowlProfile,64),stone,0,.18,0);cyl(3.74,3.74,.025,water,0,.875,0,64);
 const column=mesh(new T.LatheGeometry([[0,0],[.85,0],[.72,.2],[.52,.5],[.38,1.7],[.6,2.05],[.43,2.22],[0,2.22]].map(p=>new T.Vector2(...p)),48),ivory,0,.87,0);
 mesh(new T.LatheGeometry([[0,0],[1.8,0],[2.0,.12],[1.9,.38],[1.7,.48],[0,.48]].map(p=>new T.Vector2(...p)),48),stone,0,3.02,0);cyl(1.67,1.67,.035,water,0,3.49,0,48);sphere(.5,gold,0,4.25,0,2);
 const jets=[];for(let i=0;i<14;i++){let a=i*Math.PI/7,rr=2.5;curved([[Math.sin(a)*.95,3.52,Math.cos(a)*.95],[Math.sin(a)*1.8,3.88,Math.cos(a)*1.8],[Math.sin(a)*rr,1.05,Math.cos(a)*rr]],.038,mat('#a5eff7',.17));jets.push(sphere(.045,mat('#c6f9ff',.15),Math.sin(a)*rr,1.12,Math.cos(a)*rr))}
 // Curved architecture: elliptical multi-storey rotundas, round roof domes, arched glass windows.
 const shops=[{name:'ARENA PARTY',x:0,z:-29,color:'#9c83d4',desc:'¡Suelo falso! Cruza las baldosas sin caer.'},{name:'TK SHOP',x:-29,z:0,color:'#e6a0b8',desc:'Entra y descubre la colección de ropa.'},{name:'CLUB AMIGOS',x:29,z:0,color:'#80c6b7',desc:'Próximamente: salas multijugador y grupos.'},{name:'TROFEOS',x:-29,z:-29,color:'#edc98c',desc:'Próximamente: victorias y medallas.'},{name:'PARKOUR',x:29,z:-29,color:'#9cc99c',desc:'Prueba tus saltos en la plaza.'}];
 const palettes=['#8c7ac0','#cf8ba8','#66adae','#dbb47d','#83b38d'];
 shops.forEach((s,i)=>{
  const radius=i===0?8.3:6.5,height=i===0?12.5:9.5,wall=textured('wall',palettes[i],5,3),roof=mat(['#68548d','#a75d7e','#4b8e94','#a4755a','#688a6e'][i]);
  // 20-sided smooth circular buildings, not cuboid blocks.
  cyl(radius,radius,height,wall,s.x,height/2,s.z,40);
  cyl(radius+.38,radius+.38,.42,ivory,s.x,.32,s.z,48);
  for(let floor=0;floor<2;floor++){let yy=3.6+floor*3.7;ring(radius+.16,.17,ivory,s.x,yy,s.z)}
  // Domed roof with decorative ribs and a spire.
  const dome=mesh(new T.SphereGeometry(radius+.18,40,16,0,Math.PI*2,0,Math.PI/2),roof,s.x,height,s.z);dome.scale.y=.43;
  ring(radius+.1,.29,gold,s.x,height+.03,s.z);cyl(.19,.32,1.35,gold,s.x,height+radius*.43+.5,s.z);sphere(.33,gold,s.x,height+radius*.43+1.3,s.z,2);
  // Tall rounded windows wrapping around the curved facade.
  for(let floor=0;floor<2;floor++)for(let j=0;j<12;j++){
   const a=j*Math.PI/6,rad=radius+.045,x=s.x+Math.sin(a)*rad,z=s.z+Math.cos(a)*rad,y=1.8+floor*3.75;
   let pane=mesh(new T.PlaneGeometry(1.55,2.25),glass,x,y,z);pane.rotation.y=a;
   curved([[x-Math.cos(a)*.73,y+1.13,z+Math.sin(a)*.73],[x-Math.cos(a)*.52,y+1.62,z+Math.sin(a)*.52],[x,y+1.79,z],[x+Math.cos(a)*.52,y+1.62,z-Math.sin(a)*.52],[x+Math.cos(a)*.73,y+1.13,z-Math.sin(a)*.73]],.075,ivory);
   let mull=mesh(new T.CylinderGeometry(.035,.035,2.1,6),ivory,x,y,z);mull.position.add(new T.Vector3(Math.sin(a)*.12,0,Math.cos(a)*.12));
  }

  // Architectural detailing: pilasters, warm interior light, curved cornices, awnings.
  for(let j=0;j<16;j++){
    let a=j*Math.PI/8,xx=s.x+Math.sin(a)*(radius+.13),zz=s.z+Math.cos(a)*(radius+.13);
    let pil=mesh(new T.CylinderGeometry(.105,.12,height-.9,8),ivory,xx,height/2,zz);
    pil.castShadow=false;
    let cap=mesh(new T.SphereGeometry(.19,10,6),gold,xx,height-.55,zz);
    cap.scale.y=.4;
  }
  for(let level of [1.1,3.75,7.45,height-.6]){
    let corn=mesh(new T.TorusGeometry(radius+.25,.12,8,72),level===height-.6?gold:ivory,s.x,level,s.z);
    corn.rotation.x=Math.PI/2;
  }
  for(let j=0;j<8;j++){
    let a=(j+.5)*Math.PI/4;
    let xx=s.x+Math.sin(a)*(radius+.3),zz=s.z+Math.cos(a)*(radius+.3);
    let awning=mesh(new T.ConeGeometry(1.7,.75,4),mat(i%2?'#f0d6c4':'#f6e3c3'),xx,3.15,zz);
    awning.rotation.y=a+Math.PI/4;
    awning.scale.z=.48;
  }
  // Arched entrance on the near side, with steps and curved marquee.
  let front=s.z+radius+.16;
  mesh(new T.PlaneGeometry(3.15,4.1),navy,s.x,2.1,front);
  mesh(new T.PlaneGeometry(2.55,3.35),glass,s.x,1.9,front+.04);
  curved([[s.x-1.6,3.95,front],[s.x-1.1,4.55,front],[s.x,4.8,front],[s.x+1.1,4.55,front],[s.x+1.6,3.95,front]],.19,ivory);
  for(let k=0;k<3;k++)cyl(radius*.52+k*.12,radius*.52+k*.12,.12,stone,s.x,.08+k*.1,front+1.0+k*.28,32);
  sign(s.name,s.x,height-1.4,front+.12,i===0?9:7);
  for(let k=0;k<14;k++){let a=k*Math.PI/7;let x=s.x+Math.sin(a)*(radius+.9),z=s.z+Math.cos(a)*(radius+.9);cyl(.1,.1,.85,ivory,x,.5,z,8);sphere(.13,gold,x,.99,z)}
 });
 // Organic woodland: tapered twisted trunks and overlapping uneven leaf masses.
 const trunk=mat('#86644c'),leaf=[mat('#4b9469'),mat('#6caf79'),mat('#8bbd7e')];
 function tree(x,z,s=1){let g=new T.Group();g.position.set(x,0,z);g.scale.setScalar(s);scene.add(g);let main=mesh(new T.CylinderGeometry(.17,.38,3.6,9),trunk,0,1.8,0,g);main.rotation.z=.07;
  for(let i=0;i<5;i++){let a=i*2.4,xx=Math.cos(a)*.92,zz=Math.sin(a)*.9;let crown=mesh(new T.SphereGeometry(1.08+(i%3)*.2,12,9),leaf[i%3],xx,3.5+(i%3)*.45,zz,g);crown.scale.set(1.22,.87,1.15)}mesh(new T.SphereGeometry(1.12,12,9),leaf[1],0,4.9,0,g)}
 for(let i=0;i<18;i++){let a=i*Math.PI/9;tree(Math.sin(a)*23,Math.cos(a)*23,.9+(i%3)*.1)}
 for(let i=0;i<35;i++){let x=-63+(i*37%126),z=-63+(i*53%126);if(Math.hypot(x,z)<26||Math.abs(x+29)<10&&Math.abs(z)<10||Math.abs(x-29)<10&&Math.abs(z)<10)continue;tree(x,z,.8+(i%4)*.15)}
 // Rounded flower beds, sculpted shrubs, benches and vintage lamps.
 for(let i=0;i<12;i++){let a=i*Math.PI/6,x=Math.sin(a)*26,z=Math.cos(a)*26;cyl(1.35,1.55,.5,stone,x,.2,z,24);for(let j=0;j<9;j++){let t=j*2.4;let f=sphere(.22,mat(['#f7a7bf','#f9d48e','#a9c7ed'][j%3]),x+Math.cos(t)*(.4+(j%3)*.25),.6+(j%2)*.1,z+Math.sin(t)*(.4+(j%3)*.25));f.scale.y=.6}}
 function lamp(x,z){cyl(.09,.16,4.6,navy,x,2.3,z);sphere(.4,mat('#ffe5a6',.22),x,4.65,z,2);cyl(.52,.52,.15,navy,x,5.05,z)}
 for(let a=0;a<8;a++){let t=a*Math.PI/4;lamp(Math.sin(t)*31,Math.cos(t)*31)}
 // Park is a curved lawn, natural pond and winding paths, not a square green patch.
 cyl(14,14,.07,darkGrass,29,-.01,32,64);let pond=mesh(new T.SphereGeometry(6.1,48,16),water,30,.05,36);pond.scale.set(1,.03,.66);
 for(let i=0;i<48;i++){let a=i*Math.PI/24;let r=6.2+(i%3)*.1;sphere(.28,stone,30+Math.cos(a)*r,.12,36+Math.sin(a)*r*.65,1)}
 curved([[17,.12,25],[20,.13,23],[24,.13,24],[28,.13,27],[34,.13,29],[40,.13,27]],1.15,stone);
 for(let i=0;i<12;i++){let a=i*Math.PI/6;tree(29+Math.sin(a)*11,32+Math.cos(a)*11,.68)}
 // Round pavilion with vaulted canopy.
 cyl(3.3,3.3,.27,stone,19,.2,36,32);for(let i=0;i<8;i++){let a=i*Math.PI/4;cyl(.13,.17,3.1,ivory,19+Math.sin(a)*2.7,1.85,36+Math.cos(a)*2.7,10)}
 let gazebo=mesh(new T.SphereGeometry(3.35,32,12,0,Math.PI*2,0,Math.PI/2),terracotta,19,3.4,36);gazebo.scale.y=.55;
 // Small outer houses use rounded cylinders and conical / curved roofs, avoiding box houses.
 for(let i=0;i<13;i++){let a=i*Math.PI*2/13,x=Math.sin(a)*55,z=Math.cos(a)*55,r=3.7+(i%3)*.6,h=5.5+(i%4)*1.1;
  cyl(r,r,h,mat(['#e9b9ac','#b5d4c8','#d2c3e0','#e8d3a7'][i%4]),x,h/2,z,20);
  let roof=mesh(new T.ConeGeometry(r+1,2.5,24),mat(['#ac7770','#678c91','#93728a'][i%3]),x,h+1.3,z);roof.rotation.y=.2;
  for(let j=0;j<7;j++){let t=j*Math.PI*2/7;let px=x+Math.sin(t)*(r+.06),pz=z+Math.cos(t)*(r+.06);let p=mesh(new T.PlaneGeometry(1.15,1.8),glass,px,h*.55,pz);p.rotation.y=t}
 }

 // Planted garden borders, varied hedges and a curved walking promenade.
 const pathmat=textured('stone','#d8c1a8',6,3);
 for(let i=0;i<42;i++){
   const a=i*Math.PI*2/42,r=36.5,xx=Math.sin(a)*r,zz=Math.cos(a)*r;
   let p=mesh(new T.CylinderGeometry(1.25,1.25,.06,12),pathmat,xx,.025,zz);
   p.scale.z=.7;p.rotation.y=-a;
 }
 for(let i=0;i<28;i++){
   let a=i*2.39996,rr=27+(i%4)*1.4,xx=Math.sin(a)*rr,zz=Math.cos(a)*rr;
   if(Math.hypot(xx-29,zz-32)<15)continue;
   let bush=mesh(new T.SphereGeometry(.55+(i%3)*.18,12,9),leaf[i%3],xx,.5,zz);
   bush.scale.y=.7;
 }
 // Low-profile curved benches with legs and slatted seats.
 for(let i=0;i<9;i++){
   let a=i*Math.PI*2/9,rr=20.8,x=Math.sin(a)*rr,z=Math.cos(a)*rr;
   let bench=new T.Group();bench.position.set(x,0,z);bench.rotation.y=a;scene.add(bench);
   for(let k=-1;k<=1;k++){
     let plank=mesh(new T.BoxGeometry(2.5,.13,.23),wood,k*0,.63,.24+k*.29,bench);
     plank.castShadow=true;
   }
   for(let k of [-.95,.95])mesh(new T.CylinderGeometry(.085,.085,.6,8),navy,k,.32,.3,bench);
   let back=mesh(new T.BoxGeometry(2.5,.8,.12),wood,0,1.03,.9,bench);back.rotation.x=-.16;
 }
 // Clouds of flowers in landscaped patches.
 for(let i=0;i<170;i++){
   let a=i*2.39996,r=24+(i%11)*.42,x=Math.sin(a)*r,z=Math.cos(a)*r;
   if(Math.hypot(x-29,z-32)<16)continue;
   let blossom=mesh(new T.SphereGeometry(.09+(i%3)*.025,6,5),mat(['#f9d1a2','#f3b3c3','#f9f1d0','#b9c9fa'][i%4]),x,.22,z);
   blossom.castShadow=false;
 }
 // Animated fountain only: avoid hundreds of active lights for mobile performance.
 return {shops,update(t){for(let i=0;i<jets.length;i++)jets[i].position.y=1.12+Math.sin(t*2.8+i*.7)*.14}};
}
