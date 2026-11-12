import * as T from 'three';import {crearCiudad} from './world.js?v=detail47';import {crearBarbasV4} from './barbas_v5.js?v=rig47';import {iniciarExtras} from './features.js?v=music45';
function iniciarBarbasParty(){
const $=id=>document.getElementById(id), scene=new T.Scene();scene.background=new T.Color('#e99588');scene.fog=new T.FogExp2('#d99c94',.0035);// Skybox image path: replace with your own panoramic sky asset.
 const SKY_IMAGE='assets/cielo_ciudad.jpg';
 const skyImage=new Image();skyImage.decoding='async';skyImage.onload=()=>{const c=document.createElement('canvas');c.width=2048;c.height=1024;const q=c.getContext('2d');q.drawImage(skyImage,0,0,c.width,c.height);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;scene.userData.citySky=t;if(mode!=='parkour')scene.background=new T.Color('#b4dcf0')};skyImage.onerror=()=>{};skyImage.src=SKY_IMAGE;
 const camera=new T.PerspectiveCamera(65,innerWidth/innerHeight,.1,180);const renderer=new T.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.06;document.body.prepend(renderer.domElement);
scene.add(new T.HemisphereLight('#f5f6ff','#7895a2',2.05));const sun=new T.DirectionalLight('#fff2dc',3.4);sun.position.set(-65,16,-45);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-70;sun.shadow.camera.right=70;sun.shadow.camera.top=70;sun.shadow.camera.bottom=-70;sun.shadow.bias=-.0003;scene.add(sun);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;const amb=new T.AmbientLight('#e9e4ff',.68);scene.add(amb);
const mat=(color,emissive)=>new T.MeshStandardMaterial({color,roughness:.8,emissive:emissive||'#000000',emissiveIntensity:emissive?.5:0});function block(w,h,d,m,x,y,z){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);scene.add(o);return o}function ball(r,m,x,y,z){let o=new T.Mesh(new T.SphereGeometry(r,12,8),m);o.position.set(x,y,z);scene.add(o);return o}function cyl(r1,r2,h,m,x,y,z){let o=new T.Mesh(new T.CylinderGeometry(r1,r2,h,24),m);o.position.set(x,y,z);scene.add(o);return o}function sign(label,x,y,z,color='#fff'){let c=document.createElement('canvas');c.width=512;c.height=128;let q=c.getContext('2d');q.fillStyle='#282447';q.fillRect(0,0,512,128);q.fillStyle=color;q.font='bold 53px system-ui';q.textAlign='center';q.fillText(label,256,81);let tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;let p=new T.Mesh(new T.PlaneGeometry(6,1.5),new T.MeshBasicMaterial({map:tex,side:T.DoubleSide}));p.position.set(x,y,z);scene.add(p);return p}
// Hand-painted panoramic sky and distant cloud silhouettes; no missing external assets needed.
 const skyCanvas=document.createElement('canvas');skyCanvas.width=2048;skyCanvas.height=1024;
 const skyCtx=skyCanvas.getContext('2d'),skyGrad=skyCtx.createLinearGradient(0,0,0,1024);
 skyGrad.addColorStop(0,'#4e84bc');skyGrad.addColorStop(.34,'#82b8e2');skyGrad.addColorStop(.65,'#c4dfee');skyGrad.addColorStop(.86,'#f5d9bd');skyGrad.addColorStop(1,'#f4bda5');
 skyCtx.fillStyle=skyGrad;skyCtx.fillRect(0,0,2048,1024);
 let cloudSeed=318;const random=()=>{cloudSeed=(cloudSeed*1664525+1013904223)>>>0;return cloudSeed/4294967296};
 for(let i=0;i<95;i++){const x=random()*2048,y=270+random()*460,sz=18+random()*70;skyCtx.fillStyle='rgba(255,250,242,'+(.045+random()*.14)+')';for(let j=0;j<5;j++){skyCtx.beginPath();skyCtx.ellipse(x+(j-2)*sz*.5,y+Math.sin(j*2)*sz*.18,sz*.9,sz*.22,0,0,Math.PI*2);skyCtx.fill()}}
 const generatedSky=new T.CanvasTexture(skyCanvas);generatedSky.colorSpace=T.SRGBColorSpace;generatedSky.mapping=T.EquirectangularReflectionMapping;
 scene.userData.citySky=new T.Color('#b4dcf0');scene.background=new T.Color('#b4dcf0');scene.fog=new T.FogExp2('#c3e0ee',.001);
const sunset=new T.Mesh(new T.SphereGeometry(11,32,24),new T.MeshBasicMaterial({color:'#ffd08a',fog:false,depthWrite:false}));sunset.position.set(-100,27,-100);scene.add(sunset);const world=crearCiudad(scene);const shops=world.shops;
const player=new T.Group();scene.add(player);const visual=new T.Group();player.add(visual);// V4 integrada: se construye directamente desde el código del taller.
const personajeV4=crearBarbasV4();
const model=personajeV4.root;
visual.add(model);
const extras=iniciarExtras({player,model,head:personajeV4.head,rig:personajeV4,showStatus:message=>{$('status').textContent=message}});
// En la V4 la cara apunta a +Z; la ciudad usa -Z como dirección de avance.
model.rotation.y=Math.PI;
const movementVelocity=new T.Vector3();let active=false,mode='city',vel=0,onGround=true,angle=0,pitch=.24,targetAngle=0,targetPitch=.24,anim=0,groundY=0,near=null,skinTint='original';let keys=new Set();addEventListener('keydown',e=>{keys.add(e.code);if(e.code==='Space')jump();if(e.code==='KeyE')interact()});addEventListener('keyup',e=>keys.delete(e.code));document.querySelectorAll('[data-key]').forEach(b=>{let k=b.dataset.key;b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(k)});for(let ev of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,()=>keys.delete(k))});// Analog touch joystick: circular thumb pad, diagonal movement and smooth dead zone.
const pad=document.querySelector('.pad');let joystick={x:0,y:0};
if(pad){pad.style.pointerEvents='auto';pad.innerHTML='<div id="joyBase"><div id="joyKnob"></div></div>';pad.style.cssText='position:relative;width:145px;height:145px;display:flex;align-items:center;justify-content:center;touch-action:none;flex-shrink:0;pointer-events:auto;user-select:none;-webkit-user-select:none';const css=document.createElement('style');css.textContent='#joyBase{pointer-events:auto;position:relative;width:132px;height:132px;border-radius:50%;background:#ffffff70;border:3px solid #ffffffaa;box-shadow:inset 0 2px 12px #17132755;touch-action:none}#joyKnob{position:absolute;width:57px;height:57px;border-radius:50%;background:#8ec8ed;border:3px solid #e6f8ff;box-shadow:0 4px 12px #12132a55;left:50%;top:50%;transform:translate(-50%,-50%);pointer-events:none}';document.head.append(css);const knob=pad.querySelector('#joyKnob');let pid=null;const move=e=>{const rect=pad.getBoundingClientRect(),cx=rect.left+rect.width/2,cy=rect.top+rect.height/2,dx=e.clientX-cx,dy=e.clientY-cy,limit=46,len=Math.hypot(dx,dy),scale=len>limit?limit/len:1;joystick.x=dx*scale/limit;joystick.y=dy*scale/limit;knob.style.left='calc(50% + '+(joystick.x*limit)+'px)';knob.style.top='calc(50% + '+(joystick.y*limit)+'px)'};pad.addEventListener('pointerdown',e=>{if(!active)return;e.preventDefault();e.stopPropagation();pid=e.pointerId;pad.setPointerCapture(pid);move(e)});pad.addEventListener('pointermove',e=>{if(e.pointerId===pid){e.preventDefault();e.stopPropagation();move(e)}});const reset=e=>{if(pid!==null&&(e.pointerId===pid||e.type==='lostpointercapture')){pid=null;joystick.x=0;joystick.y=0;knob.style.left='50%';knob.style.top='50%'}};for(const ev of ['pointerup','pointercancel','lostpointercapture'])pad.addEventListener(ev,reset)}
$('jump').addEventListener('pointerdown',e=>{e.preventDefault();jump()});$('interact').onclick=interact;$('start').onclick=()=>{if(!window.barbasAccount?.ready){$('notice').textContent='Inicia sesión con Google y espera a que se cargue tu partida';return}active=true;$('menu').style.display='none';$('controls').style.display='flex';$('topbtn').style.display='block';extras.start();$('hud').style.display='block';mapButton.style.display='block'};$('topbtn').onclick=()=>{active=false;$('menu').style.display='flex';$('controls').style.display='none';$('topbtn').style.display='none';extras.hide();$('hud').style.display='none';mapButton.style.display='none';mapFull.style.display='none';fullMapOpen=false};$('closePanel').onclick=()=>{$('panel').style.display='none';active=true};function jump(){if(active&&onGround){vel=8.6;onGround=false;extras.sound('jump')}}function openPanel(title,desc){active=false;$('panel').style.display='flex';$('panelTitle').textContent=title;$('panelText').textContent=desc;$('skinChoice').innerHTML='';}function interact(){if(!active)return;if(mode==='shop'){if(player.position.z>286){leaveShop();return}const item=shopItems.find(o=>Math.hypot(player.position.x-o.x,player.position.z-(235+o.z))<3.3);if(item){extras.openShop(item.id)}else{$('status').textContent='Acércate a una prenda y pulsa USAR para comprarla'}return}if(mode==='parkour'){$('status').textContent='🧗 PARKOUR · Salta con el botón SALTAR. ¡Llega a la meta!';return}if(mode==='arena'){openPanel('SUELO FALSO','Cruza el puente de baldosas. ¡Algunas desaparecen!');return}if(!near){$('status').textContent='Acércate a una tienda para interactuar';return}if(near.name==='TK SHOP'){enterShop();extras.sound('open');return}if(near.name==='PARKOUR'){enterParkour();extras.sound('open');return}if(near.name==='ARENA PARTY'){mode='arena';resetArena();$('status').textContent='🏁 SUELO FALSO · Cruza hasta la meta';return}openPanel(near.name,near.desc)}

const shop=new T.Group();scene.add(shop);shop.position.set(0,0,235);shop.visible=false;
const ivory=mat('#f6eee2'),dark=mat('#26253b'),gold=mat('#caa46b'),oak=mat('#97725d'),pink=mat('#e5b7bd'),cream=mat('#ffebd3');
function item(geo,material,x,y,z,parent=shop){const o=new T.Mesh(geo,material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
function bx(x,y,z,a,b,c,m){return item(new T.BoxGeometry(a,b,c),m,x,y,z)}
// Giant four-aisle boutique: 34 x 108 metres, 57 individual products, no floating catalogue.
bx(0,-.16,0,34,.3,108,ivory);bx(0,7.1,0,34,.3,108,dark);
for(const x of [-16.9,16.9])bx(x,3.5,0,.24,7,108,cream);
bx(0,3.5,-53.9,34,7,.24,cream);
for(const x of [-12,12])bx(x,3.5,53.9,10,7,.24,cream);
bx(0,6.4,53.9,14,1.1,.24,cream);
for(let x=-15;x<=15;x+=3)for(let z=-52;z<=52;z+=4)bx(x,.006,z,2.95,.018,3.95,((x+15)/3+(z+52)/4)%2?ivory:cream);
for(const x of [-16.65,16.65]){bx(x,3.8,0,.1,.16,106,gold);for(const z of [-40,-20,0,20,40]){bx(x*.92,1.4,z,1.1,.13,4,oak);bx(x*.92,3.4,z,1.1,.13,4,oak)}}
for(const z of [-46,-34,-22,-10,2,14,26,38,50])for(const x of [-11,-3.6,3.6,11]){const light=item(new T.CylinderGeometry(.45,.45,.06,18),new T.MeshBasicMaterial({color:'#fff2cf'}),x,6.88,z);light.rotation.x=Math.PI/2}
for(const z of [-36,0,36]){const l=new T.PointLight('#ffe9cf',110,42,1.5);l.position.set(0,6,z);shop.add(l)}
function label(text,x,y,z,width=5){const canvas=document.createElement('canvas');canvas.width=768;canvas.height=144;const c=canvas.getContext('2d');c.fillStyle='#28253e';c.fillRect(0,0,768,144);c.fillStyle='#ffe4ac';c.textAlign='center';c.font='900 66px system-ui';c.fillText(text,384,94,730);const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;item(new T.PlaneGeometry(width,width*144/768),new T.MeshBasicMaterial({map:texture,side:T.DoubleSide}),x,y,z)}
label('TK SHOP · MEGASTORE',0,5.2,-53.65,13);
label('GORROS',-11,4.4,-49,5);label('STREETWEAR',-3.6,4.4,-49,5);label('FALDAS Y VESTIDOS',3.6,4.4,-49,6);label('BAMBAS',11,4.4,-49,5);
label('SALIDA',0,5.4,53.6,7);
bx(0,.9,-51,7,1.8,2.2,oak);bx(0,1.85,-51,7,.16,2.2,ivory);
for(const x of [-14.4,14.4])for(const z of [-32,0,32]){bx(x,2.9,z,1.4,5.8,.16,pink);bx(x,5.8,z,1.6,.18,1.2,gold)}
const shopItems=[];const shopCatalog=Array.isArray(extras.inventory)?extras.inventory:[];
const lanes=[-11,-3.6,3.6,11];
for(let i=0;i<shopCatalog.length;i++){
 const product=shopCatalog[i],x=lanes[i%4],z=-45+Math.floor(i/4)*6.55;
 const stand=new T.Group();stand.position.set(x,0,z);shop.add(stand);
 const platform=new T.Mesh(new T.BoxGeometry(2.8,.13,2.4),oak);platform.position.y=.23;stand.add(platform);
 const plinth=new T.Mesh(new T.BoxGeometry(1.6,.8,1.4),ivory);plinth.position.y=.68;stand.add(plinth);
 const cloth=new T.MeshStandardMaterial({color:product.color,roughness:.85});
 const display=new T.Group();display.position.y=1.65;stand.add(display);
 const part=(w,h,d,px,py,pz)=>{const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),cloth);mesh.position.set(px,py,pz);display.add(mesh)};
 if(product.kind==='cap'){const crown=new T.Mesh(new T.SphereGeometry(.42,18,10,0,Math.PI*2,0,Math.PI/2),cloth);crown.position.y=.07;display.add(crown);part(.7,.05,.36,0,-.06,.33)}
 if(product.kind==='jacket'){const short=['crop','halter','sport','corset'].includes(product.design);part(.92,short?.68:1.02,.28,0,short?.22:0,0);for(const side of [-1,1])part(.26,short?.3:.76,.3,side*.59,.12,0)}
 if(product.kind==='pants'){const skirt=['pleated','denimskirt','floral','midi'].includes(product.design);if(skirt){const skirtMesh=new T.Mesh(new T.CylinderGeometry(.35,.68,.9,16),cloth);display.add(skirtMesh)}else{part(.78,.35,.32,0,.33,0);for(const side of [-1,1])part(.33,.8,.32,side*.22,-.25,0)}}
 if(product.kind==='dress'){part(.64,.55,.3,0,.3,0);const skirt=new T.Mesh(new T.CylinderGeometry(.34,.76,.95,16),cloth);skirt.position.y=-.44;display.add(skirt)}
 if(product.kind==='shoes'){part(.51,.25,.78,-.33,0,.06);part(.51,.25,.78,.33,0,.06)}
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=160;const c=canvas.getContext('2d');c.fillStyle='#2c2741';c.fillRect(0,0,512,160);c.fillStyle='#fff4db';c.textAlign='center';c.font='bold 31px system-ui';c.fillText(product.name,256,62,490);c.fillStyle='#ffd56f';c.font='bold 40px system-ui';c.fillText(product.price.toLocaleString('es-ES')+' MONEDAS',256,126,490);
 const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;
 const tag=new T.Mesh(new T.PlaneGeometry(2.85,.89),new T.MeshBasicMaterial({map:texture,side:T.DoubleSide}));tag.position.set(0,2.9,.25);stand.add(tag);
 shopItems.push({id:product.id,x,z});
}
// Shop exterior and city are spatially separated to avoid overlap.
function enterShop(){mode='shop';shop.visible=true;player.position.set(0,0,283);vel=0;onGround=true;angle=0;targetAngle=0;keys.clear();$('status').textContent='🛍️ TK SHOP · Recorre los pasillos y pulsa USAR cerca de cada producto'}
function leaveShop(){mode='city';shop.visible=false;player.position.set(-29,0,9);vel=0;onGround=true;keys.clear();$('status').textContent='Has salido de TK SHOP'}

 // PARKOUR SKY: instanced course in a separate scene area, checkpoint, falling reset and prize.
 const parkour=new T.Group();scene.add(parkour);parkour.position.set(0,0,375);parkour.visible=false;
 const parkPlatforms=[],parkColors=['#f4ae83','#91c7d5','#c9a2ec','#a4d6a4','#ffd783'];
 const parkLayout=[
 [0,0,0,6,6],[0,0,-4.3,3.7,3.7],[1.2,.5,-8.5,3.6,3.6],
 [-.9,1,-12.6,3.6,3.6],[0,1.35,-16.8,4.8,4.5],
 [1.4,1.75,-21,3.6,3.6],[-.5,2.1,-25.2,3.6,3.6],
 [0,2.5,-29.5,4.5,4.5],[0,2.5,-34,7,6.5]];
 for(let i=0;i<parkLayout.length;i++){const [x,y,z,w,d]=parkLayout[i];const p=new T.Mesh(new T.BoxGeometry(w,.38,d),mat(i===4?'#ffe27b':i===8?'#8de5b5':parkColors[i%parkColors.length]));p.position.set(x,y-.19,z);p.castShadow=true;p.receiveShadow=true;parkour.add(p);parkPlatforms.push({x,y,z,w,d,mesh:p});const edge=new T.Mesh(new T.BoxGeometry(w,.12,d),new T.MeshBasicMaterial({color:i===4?'#fff2a4':'#ffffff',transparent:true,opacity:.25}));edge.position.set(x,y+.04,z);parkour.add(edge)}
 for(let i of [0,4,8]){const p=parkPlatforms[i];const pole=new T.Mesh(new T.CylinderGeometry(.055,.055,2.4,8),mat('#ffebbc'));pole.position.set(p.x-p.w/2+.25,p.y+1.2,p.z);parkour.add(pole);const banner=new T.Mesh(new T.BoxGeometry(1.7,.68,.09),mat(i===8?'#7bdfa3':'#ffce68'));banner.position.set(p.x-p.w/2+1.08,p.y+2.1,p.z);parkour.add(banner)}

// A bright blue sky with cloud islands, trees and decorative parkour challenges.
 const parkSky=new T.Color('#78b9f4'),parkFog=new T.FogExp2('#a9d8f7',.002);
 const cityFog=scene.fog;
 const cloudMat=new T.MeshStandardMaterial({color:'#fff8ee',roughness:1});
 const islandMat=mat('#8cb6a0'),rockMat=mat('#798a9c');
 const cloudGeo=new T.SphereGeometry(1,10,8);
 function cloud(x,y,z,size){const g=new T.Group();g.position.set(x,y,z);parkour.add(g);for(let i=0;i<5;i++){const m=new T.Mesh(cloudGeo,cloudMat);m.position.set((i-2)*size*.46,Math.sin(i*2.3)*size*.15,Math.cos(i)*size*.18);m.scale.set(size*.75,size*.36,size*.52);g.add(m)}}
 for(let i=0;i<22;i++){const z=-i*5+15;const side=i%2?1:-1;cloud(side*(15+(i%4)*5),8+(i%5)*3,z,3+(i%3));}
 for(let i=0;i<8;i++){const z=8-i*10,side=i%2?1:-1,x=side*(13+i%3*4);const rock=new T.Mesh(new T.CylinderGeometry(3,1.2,4,7),rockMat);rock.position.set(x,-4,z);parkour.add(rock);const turf=new T.Mesh(new T.CylinderGeometry(3.5,3.3,.4,8),islandMat);turf.position.set(x,-1.8,z);parkour.add(turf);const trunk=new T.Mesh(new T.CylinderGeometry(.18,.24,2,7),mat('#795946'));trunk.position.set(x,.0,z);parkour.add(trunk);const leaves=new T.Mesh(new T.IcosahedronGeometry(1.3,1),mat(i%2?'#57b48b':'#71c79d'));leaves.position.set(x,1.4,z);parkour.add(leaves)}
 // Visual variety: speed arrows, ring, stepping stones, a low tunnel, and finish arch.
 for(const z of [-3.8,-4.2]){const arrow=new T.Mesh(new T.BoxGeometry(.48,.04,.7),new T.MeshBasicMaterial({color:'#53e7ff'}));arrow.rotation.y=Math.PI/4;arrow.position.set(0,.08,z);parkour.add(arrow)}
 const ring=new T.Mesh(new T.TorusGeometry(1.45,.12,8,32),new T.MeshStandardMaterial({color:'#69f0ef',emissive:'#237d88',emissiveIntensity:.5}));ring.position.set(1.2,2.25,-8.5);parkour.add(ring);
 for(const z of [-11.9,-12.6,-13.3]){const stone=new T.Mesh(new T.CylinderGeometry(.36,.36,.08,12),mat('#f9d888'));stone.position.set(-.9,1.06,z);parkour.add(stone)}
 const tunnel=new T.Group();tunnel.position.set(0,1.35,-16.8);parkour.add(tunnel);for(const x of [-1.7,1.7]){const pillar=new T.Mesh(new T.BoxGeometry(.22,2.3,.25),mat('#a68de8'));pillar.position.set(x,1.15,0);tunnel.add(pillar)}const beam=new T.Mesh(new T.BoxGeometry(3.65,.24,.3),mat('#a68de8'));beam.position.y=2.3;tunnel.add(beam);
 const finish=new T.Group();finish.position.set(0,2.5,-34);parkour.add(finish);for(const x of [-2.5,2.5]){const post=new T.Mesh(new T.BoxGeometry(.35,3.2,.35),mat('#ffe1a0'));post.position.set(x,1.6,0);finish.add(post)}const top=new T.Mesh(new T.BoxGeometry(5.4,.55,.4),mat('#a17bd6'));top.position.y=3.2;finish.add(top);
 let parkCheckpoint=0,parkDone=false,parkFails=0;
 function parkRespawn(){const p=parkPlatforms[parkCheckpoint];player.position.set(p.x,p.y+.08,375+p.z);vel=0;onGround=true;keys.clear();joystick.x=0;joystick.y=0}
 function enterParkour(){mode='parkour';parkour.visible=true;scene.background=parkSky;scene.fog=parkFog;parkCheckpoint=0;parkDone=false;parkFails=0;angle=0;targetAngle=0;targetPitch=.28;parkRespawn();$('status').textContent='🧗 PARKOUR · Salta de plataforma en plataforma. ¡Checkpoint a mitad!'}
 function leaveParkour(message){parkour.visible=false;scene.background=scene.userData.citySky||new T.Color('#b4dcf0');scene.fog=cityFog;mode='city';player.position.set(29,0,-18);vel=0;onGround=true;keys.clear();$('status').textContent=message}
const tiles=[];let arenaBuilt=false;function resetArena(){if(!arenaBuilt){block(19,.6,10,mat('#a1dcb2'),0,-.4,86);block(19,.6,10,mat('#a1dcb2'),0,-.4,56);for(let r=0;r<8;r++)for(let c=0;c<7;c++){let t=block(2.45,.35,2.45,mat((r+c)%2?'#f8a5d8':'#a9b2fc'),(c-3)*2.55,-.12,65+r*2.55);tiles.push({mesh:t,r,c,safe:c===(r*3+2)%7,broken:false})}arenaBuilt=true}for(let t of tiles){t.broken=false;t.mesh.visible=true;t.mesh.material.color.set((t.r+t.c)%2?'#f8a5d8':'#a9b2fc')}player.position.set(0,0,87);vel=0;onGround=true}function backCity(msg){mode='city';player.position.set(0,0,10);vel=0;onGround=true;$('status').textContent=msg}
player.position.set(0,0,11);$('hud').style.display='none';let dragging=false,lastX=0,lastY=0,dragPointer=null;renderer.domElement.style.touchAction='none';renderer.domElement.addEventListener('pointerdown',e=>{if(!active||extras.shopOpen)return;dragging=true;dragPointer=e.pointerId;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)});renderer.domElement.addEventListener('pointerup',()=>{dragging=false;dragPointer=null});renderer.domElement.addEventListener('pointercancel',()=>{dragging=false;dragPointer=null});renderer.domElement.addEventListener('pointermove',e=>{if(!active||!dragging||e.pointerId!==dragPointer)return;targetAngle-=(e.clientX-lastX)*.005;targetPitch=T.MathUtils.clamp(targetPitch+(e.clientY-lastY)*.004,-.25,.85);lastX=e.clientX;lastY=e.clientY});

 // City minimap. Positions come from the same shop coordinates used in world.js.
 const mapStyle=document.createElement('style');mapStyle.textContent=`
 #miniMap{position:fixed;right:12px;top:126px;z-index:5;width:112px;height:112px;border:2px solid #ffe0a3;border-radius:17px;overflow:hidden;background:#24384d;box-shadow:0 5px 22px #100e2a99;padding:0;display:none;touch-action:manipulation}
 #miniMap canvas{width:100%;height:100%}
 #mapFull{position:fixed;inset:0;z-index:24;background:#15162ceE;display:none;align-items:center;justify-content:center;flex-direction:column;gap:10px;padding:16px;touch-action:manipulation}
 #mapFull .mapHeader{width:min(560px,100%);display:flex;align-items:center;justify-content:space-between;gap:8px;color:#ffe4a1}
 #mapFull .mapHeader b{font-size:19px}#mapFull .mapHeader button{font-size:13px}
 #mapFull canvas{display:block;width:min(560px,100%);aspect-ratio:1;max-height:72vh;border-radius:18px;border:2px solid #ffe3a6;box-shadow:0 8px 28px #0008}
 #mapLegend{max-width:560px;text-align:center;font-size:12px;color:#e7e4ed;line-height:1.6}
 `;document.head.append(mapStyle);
 const mapButton=document.createElement('button');mapButton.id='miniMap';mapButton.setAttribute('aria-label','Abrir mapa completo');mapButton.innerHTML='<canvas width="300" height="300"></canvas>';document.body.append(mapButton);
 const mapFull=document.createElement('section');mapFull.id='mapFull';mapFull.innerHTML='<div class="mapHeader"><b>🗺️ BARBAS MINIGAMES · MAPA</b><button id="mapClose">✕ CERRAR</button></div><canvas width="800" height="800"></canvas><div id="mapLegend">🟡 Tú · 🛍️ TK SHOP · 🏆 Arena · 🧗 Parkour · 👥 Online (próximamente) · 🏅 Trofeos (próximamente)</div>';document.body.append(mapFull);
 let fullMapOpen=false;mapButton.onclick=()=>{if(!active)return;fullMapOpen=true;mapFull.style.display='flex';drawMap(mapFull.querySelector('canvas'),true)};mapFull.querySelector('#mapClose').onclick=()=>{fullMapOpen=false;mapFull.style.display='none'};
 // Clear, always-visible main objective with distance and contextual instructions.
 // Compact contextual navigation: no permanent objective banner obscuring the game.
 const objective=document.createElement('div');objective.id='mainObjective';objective.innerHTML='<span>🏆 Los minijuegos están en ARENA PARTY</span>';document.body.append(objective);
 const objectiveStyle=document.createElement('style');objectiveStyle.textContent=`
 #mainObjective{position:fixed;left:50%;bottom:22%;transform:translateX(-50%);z-index:5;max-width:74vw;padding:9px 15px;border-radius:24px;background:#ffffffec;border:1px solid #c4dfe7;box-shadow:0 5px 18px #1c3d5060;color:#25475e;font:700 12px system-ui;text-align:center;pointer-events:none;display:none;backdrop-filter:blur(8px)}
 @media(max-width:600px){#mainObjective{bottom:19%;font-size:11px;max-width:70vw;padding:7px 12px}}
 `;document.head.append(objectiveStyle);
 let lastObjectiveText='',guideStarted=0;
 function updateObjective(){if(!active||mode!=='city'){objective.style.display='none';return}
  if(!guideStarted)guideStarted=performance.now();
  const d=Math.round(Math.hypot(player.position.x,player.position.z+24));
  const nearArena=d<11;
  const show=nearArena||performance.now()-guideStarted<9500;
  objective.style.display=show?'block':'none';
  if(!show)return;
  const msg=nearArena?'🏆 ARENA PARTY · Pulsa USAR para jugar':d<24?'✨ ¡Ya estás cerca de los minijuegos!':'🎮 ¡Bienvenido! Sigue el camino hasta ARENA PARTY';
  if(lastObjectiveText!==msg){objective.querySelector('span').textContent=msg;lastObjectiveText=msg}
 }
 const mapPoints=shops.map(sh=>({name:sh.name,x:sh.x,z:sh.z+5,active:sh.name==='TK SHOP'||sh.name==='ARENA PARTY'||sh.name==='PARKOUR',icon:sh.name==='TK SHOP'?'🛍️':sh.name==='ARENA PARTY'?'🏆':sh.name==='PARKOUR'?'🧗':sh.name==='CLUB AMIGOS'?'👥':'🏅'}));
 function drawMap(canvas,large=false){
  const c=canvas.getContext('2d'),w=canvas.width,h=canvas.height,scale=w/146;
  c.clearRect(0,0,w,h);c.fillStyle='#13263c';c.fillRect(0,0,w,h);c.strokeStyle='#55cbd8';c.lineWidth=4*scale;c.strokeRect(13*scale,13*scale,120*scale,120*scale);
  const pt=(x,z)=>[(x+73)*scale,(z+73)*scale];
  c.fillStyle='#263b52';c.fillRect(...pt(-57,-57),114*scale,114*scale);
  c.fillStyle='#344b62';for(const q of [-42,42]){c.fillRect(...pt(-73,q-5),146*scale,10*scale);c.fillRect(...pt(q-5,-73),10*scale,146*scale)}
  c.fillStyle='#304d68';c.beginPath();c.arc(...pt(0,0),20*scale,0,Math.PI*2);c.fill();c.strokeStyle='#f5e2bc';c.lineWidth=2*scale;c.stroke();
  c.fillStyle='#5df0ff';c.beginPath();c.arc(...pt(0,0),4.8*scale,0,Math.PI*2);c.fill();
  for(const sh of mapPoints){const [x,y]=pt(sh.x,sh.z);c.beginPath();c.arc(x,y,(large?7:8)*scale,0,Math.PI*2);c.fillStyle=sh.name==='ARENA PARTY'?'#f9c65e':sh.active?'#305b76':'#455266';c.fill();c.strokeStyle=sh.active?'#ffdc7a':'#b9c0c7';c.lineWidth=1.4*scale;c.stroke();c.font=(large?9:12)*scale+'px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(sh.icon,x,y);if(large){c.fillStyle='#1f2538';c.font='bold '+3.7*scale+'px system-ui';c.fillText(sh.name,x,y+12*scale)}}
  if(mode==='city'){const [x,y]=pt(player.position.x,player.position.z);c.beginPath();c.arc(x,y,3.4*scale,0,Math.PI*2);c.fillStyle='#ffe25b';c.fill();c.strokeStyle='#21223b';c.lineWidth=1.2*scale;c.stroke();c.beginPath();c.moveTo(x,y);c.lineTo(x-Math.sin(angle)*8*scale,y-Math.cos(angle)*8*scale);c.strokeStyle='#ffe25b';c.lineWidth=2*scale;c.stroke()}
  else{c.fillStyle='#1d2741';c.font='bold '+(large?5:7)*scale+'px system-ui';c.textAlign='center';c.fillText('ESTÁS DENTRO DE '+(mode==='shop'?'TK SHOP':'ARENA'),w/2,h-7*scale)}
 }
 let mapFrame=0;
const clock=new T.Clock();function loop(){requestAnimationFrame(loop);let dt=Math.min(clock.getDelta(),.04);if(active&&!extras.shopOpen){let v=new T.Vector3(joystick.x+(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0),0,joystick.y+(keys.has('KeyS')?1:0)-(keys.has('KeyW')?1:0));let strength=Math.min(1,v.length());let moving=strength>.12;v.normalize().multiplyScalar(moving?strength:0).applyAxisAngle(new T.Vector3(0,1,0),angle);let speed=keys.has('ShiftLeft')?8.4:5;const desiredVelocity=v.clone().multiplyScalar(speed);const responsiveness=1-Math.exp(-(moving?11:15)*dt);movementVelocity.lerp(desiredVelocity,responsiveness);if(movementVelocity.lengthSq()<.001)movementVelocity.set(0,0,0);player.position.addScaledVector(movementVelocity,dt);const actualSpeed=movementVelocity.length();const isMoving=actualSpeed>.17;extras.update(dt,isMoving,actualSpeed);if(isMoving){const desiredYaw=Math.atan2(-movementVelocity.x,-movementVelocity.z);visual.rotation.y+=Math.atan2(Math.sin(desiredYaw-visual.rotation.y),Math.cos(desiredYaw-visual.rotation.y))*(1-Math.exp(-12*dt));}visual.position.y=0;visual.rotation.z=T.MathUtils.damp(visual.rotation.z,0,12,dt);vel-=23*dt;player.position.y+=vel*dt;let prevY=player.position.y-vel*dt;let support=(mode==='city'||mode==='shop')||(player.position.z>80&&player.position.z<92)||(player.position.z>51&&player.position.z<61);if(mode==='parkour'){
  support=false;let floor=null;
  for(let k=0;k<parkPlatforms.length;k++){const p=parkPlatforms[k];if(Math.abs(player.position.x-p.x)<p.w/2-.12&&Math.abs(player.position.z-(375+p.z))<p.d/2-.12&&vel<=0&&prevY>=p.y-.16&&player.position.y<=p.y+.10){if(floor===null||p.y>floor.y)floor={...p,k}}}
  if(floor){player.position.y=floor.y;vel=0;onGround=true;support=true;if(floor.k>=4&&parkCheckpoint===0){parkCheckpoint=4;extras.sound('buy');$('status').textContent='🚩 ¡Checkpoint conseguido!'}if(floor.k===8&&!parkDone){parkDone=true;extras.reward(10,'🏆 ¡Parkour completado! +10 monedas');leaveParkour('🏆 ¡Parkour superado! Has ganado 10 monedas')}}
  else if(player.position.y < -9){parkFails++;parkRespawn();$('status').textContent='💨 Caída '+parkFails+' · Reapareces en el checkpoint'}
  if(mode==='parkour'&&!floor)onGround=false;if(mode==='parkour'){$('status').textContent=parkCheckpoint===0?'🧗 PARKOUR · Salta a la siguiente plataforma':'🚩 CHECKPOINT · ¡Ya queda poco!';}
 }if(mode==='arena'){for(let t of tiles){if(!t.broken&&Math.abs(player.position.x-t.mesh.position.x)<1.18&&Math.abs(player.position.z-t.mesh.position.z)<1.18){support=true;if(onGround&&!t.safe){t.broken=true;t.mesh.material.color.set('#f15b76');setTimeout(()=>t.mesh.visible=false,180)}}}if(player.position.z<61){extras.reward(150,'¡Arena completada!');backCity('🏆 ¡Meta alcanzada! +150 monedas');}else if(player.position.y< -6){backCity('💦 Has caído. Vuelve a Arena Party para reintentar')}}if(support&&player.position.y<=0&&vel<=0){player.position.y=0;vel=0;onGround=true}else if(!support&&player.position.y<=0){onGround=false}if(mode==='shop'){player.position.x=T.MathUtils.clamp(player.position.x,-16.1,16.1);player.position.z=T.MathUtils.clamp(player.position.z,181.5,288.5);$('status').textContent=player.position.z>285?'🛍️ TK SHOP · Pulsa USAR para salir':'🛍️ TK SHOP · Acércate a una prenda y pulsa USAR para comprar'}if(mode==='city'){player.position.x=T.MathUtils.clamp(player.position.x,-57,57);player.position.z=T.MathUtils.clamp(player.position.z,-57,57);near=shops.find(s=>Math.hypot(s.x-player.position.x,s.z+5-player.position.z)<8);$('status').textContent=near?'Pulsa USAR para entrar en '+near.name:''}}personajeV4.actualizar(dt,active&&movementVelocity.length()>.17?(movementVelocity.length()>6.1?'correr':'caminar'):'quieto',{aire:!onGround,subiendo:vel>0,velocidad:movementVelocity.length()});angle+=Math.atan2(Math.sin(targetAngle-angle),Math.cos(targetAngle-angle))*Math.min(1,dt*9);pitch+=(targetPitch-pitch)*Math.min(1,dt*9);let desired=player.position.clone().add(new T.Vector3(Math.sin(angle)*6*Math.cos(pitch),1.5+6*Math.sin(pitch),Math.cos(angle)*6*Math.cos(pitch)));camera.position.lerp(desired,Math.min(1,dt*8));camera.lookAt(player.position.x,player.position.y+1.45,player.position.z);world.update(clock.elapsedTime);if(active&&++mapFrame%9===0){updateObjective();drawMap(mapButton.querySelector('canvas'));if(fullMapOpen)drawMap(mapFull.querySelector('canvas'),true)}renderer.render(scene,camera)}loop();addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});

}
iniciarBarbasParty();
