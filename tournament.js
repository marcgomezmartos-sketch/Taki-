import {crearBarbasV4} from './barbas_v5.js?v=rig58';
// Barbas Minigames V63: round director. Local bots until multiplayer backend is ready.
export function createTournament(T,scene,player,extras,ui){
 const root=new T.Group();scene.add(root);root.visible=false;
 const material=(c)=>new T.MeshStandardMaterial({color:c,roughness:.73,metalness:.03});
 const floorMat=material('#58cfa5'),pink=material('#fa6caa'),blue=material('#57baf4'),gold=material('#ffd75b');
 const cube=(w,h,d,m,x,y,z)=>{let a=new T.Mesh(new T.BoxGeometry(w,h,d),m);a.position.set(x,y,z);a.receiveShadow=true;root.add(a);return a};
 const sphere=(r,m,x,y,z)=>{let a=new T.Mesh(new T.SphereGeometry(r,12,8),m);a.position.set(x,y,z);root.add(a);return a};
 // Bots use the SAME articulated character rig as the player, not placeholder capsules.
 const botStyles=[
  {name:'Alex_07',gender:'man',top:'#f34c54',pants:'#27334c',shoes:'#f4f4ec',cap:'#151a24'},
  {name:'LunaPlay',gender:'woman',top:'#bc67ed',pants:'#353050',shoes:'#ffffff',cap:null},
  {name:'MaxPro',gender:'man',top:'#f5c34b',pants:'#263d65',shoes:'#f8f8fa',cap:'#20232e'},
  {name:'NereaGG',gender:'woman',top:'#4ec4ad',pants:'#353e58',shoes:'#f8d7e6',cap:null},
  {name:'Dani_FC',gender:'man',top:'#f78cae',pants:'#232e42',shoes:'#fafafa',cap:'#f7f0df'},
  {name:'MiaStar',gender:'woman',top:'#76a4ff',pants:'#544270',shoes:'#fff2dc',cap:null},
  {name:'LeoRush',gender:'man',top:'#f08b44',pants:'#27344d',shoes:'#e6f7ff',cap:'#101827'},
  {name:'SaraWin',gender:'woman',top:'#ff6a8c',pants:'#344866',shoes:'#ffffff',cap:null},
  {name:'Izan99',gender:'man',top:'#5fd1db',pants:'#393951',shoes:'#fff6e0',cap:'#26324a'}
 ];
 const bots=[],botRigs=[],botPrev=[];
 const outfitMaterial=(hex)=>new T.MeshStandardMaterial({color:hex,roughness:.88,metalness:0,side:T.DoubleSide});
 for(let i=0;i<9;i++){
  const preset=botStyles[i],rig=crearBarbasV4();
  rig.setAvatarStyle(preset.gender);
  const g=new T.Group();g.add(rig.root);
  // Clothes follow the torso, thighs and animated arms/knees, like the player's wardrobe.
  const top=outfitMaterial(preset.top),trousers=outfitMaterial(preset.pants),sneakers=outfitMaterial(preset.shoes);
  rig.garment(top,[[1.34,.307,.24],[1.48,.352,.266],[1.7,.378,.274],[1.94,.345,.252],[2.035,.235,.185]],rig.body,18);
  for(const arm of rig.arms){
   rig.garment(top,[[-.34,.143,.15],[-.18,.16,.16],[.05,.168,.164]],arm,14);
  }
  for(const leg of rig.legs){
   rig.garment(trousers,[[-.56,.19,.196],[-.33,.21,.212],[.05,.222,.22]],leg,14);
  }
  for(const knee of rig.knees){
   rig.garment(trousers,[[-.38,.15,.16],[-.18,.177,.18],[.07,.18,.184]],knee,14);
  }
  for(const foot of rig.feet){
   const shoe=new T.Mesh(new T.BoxGeometry(.36,.14,.52),sneakers);shoe.position.set(0,-.14,.13);foot.add(shoe);
  }
  if(preset.cap){
   const capMat=outfitMaterial(preset.cap);
   const cap=new T.Mesh(new T.SphereGeometry(.31,14,8,0,Math.PI*2,0,Math.PI*.48),capMat);
   cap.position.set(0,.32,0);rig.head.add(cap);
   const brim=new T.Mesh(new T.BoxGeometry(.41,.055,.25),capMat);brim.position.set(0,.33,.27);rig.head.add(brim);
  }
  // Lightweight floating gamer tag, attached to each moving character.
  const labelCanvas=document.createElement('canvas');labelCanvas.width=256;labelCanvas.height=64;
  const ctx=labelCanvas.getContext('2d');ctx.fillStyle='rgba(16,25,54,.85)';ctx.beginPath();ctx.roundRect(3,4,250,54,17);ctx.fill();
  ctx.font='bold 29px system-ui';ctx.fillStyle='#ffffff';ctx.textAlign='center';ctx.fillText(preset.name,128,43);
  const tex=new T.CanvasTexture(labelCanvas);tex.colorSpace=T.SRGBColorSpace;
  const tag=new T.Sprite(new T.SpriteMaterial({map:tex,transparent:true,depthWrite:false}));tag.scale.set(1.35,.34,1);tag.position.y=2.5;g.add(tag);
  g.userData.lastPosition=new T.Vector3();g.userData.rig=rig;g.userData.name=preset.name;
  root.add(g);bots.push(g);botRigs.push(rig);botPrev.push(new T.Vector3());
 }
 // Individual personalities and tactical positions prevent the nine bots from forming one swarm.
 const botBrain=bots.map((b,i)=>({phase:i*1.73,pace:.86+(i%4)*.09,decision:0,target:new T.Vector3(),lane:(i%5-2)*2.6,role:i%4,raceCheckpoint:8,raceStun:0,raceJump:0,raceFinish:false,raceFails:0}));
 const kitBlue=outfitMaterial('#176eea'),kitRed=outfitMaterial('#ef414f');
 const botShirts=bots.map(b=>b.userData.rig.body.children.filter(o=>o.isMesh&&o.material?.color&&o.material.color.getHexString()===botStyles[bots.indexOf(b)].top.slice(1).toLowerCase()));
 const goalSplash=document.createElement('div');goalSplash.style.cssText='position:fixed;left:50%;top:22%;transform:translate(-50%,-50%) scale(.7);z-index:9998;pointer-events:none;display:none;text-align:center;color:white;font:900 clamp(30px,9vw,70px) system-ui;text-shadow:0 5px 0 #152b64,0 9px 28px #001a43;transition:transform .24s';document.body.appendChild(goalSplash);
 let goalToken=0,lastTouch='TÚ',goalPause=0;
 function celebrateGoal(who,ours){goalPause=2.1;goalToken++;const token=goalToken;goalSplash.innerHTML='<div style="font-size:65px">⚽</div><div>¡GOOOOL!</div><div style="font-size:23px;background:'+(ours?'#176eea':'#e94350')+';border-radius:18px;padding:10px 20px">'+who.replace(/</g,'&lt;')+'</div>';goalSplash.style.display='block';requestAnimationFrame(()=>goalSplash.style.transform='translate(-50%,-50%) scale(1)');setTimeout(()=>{if(token===goalToken){goalSplash.style.display='none';goalSplash.style.transform='translate(-50%,-50%) scale(.7)'}},1950)}
 function setFutsalKits(){bots.forEach((b,i)=>{const color=i<4?kitBlue:kitRed;for(const o of botShirts[i])o.material=color;const tag=b.children.find(o=>o.isSprite);if(tag)tag.material.color.set(i<4?'#a8cbff':'#ffc2c8')})}
 const ball=sphere(.4,material('#fff8df'),0,.5,0);ball.visible=false;
 const banner=document.createElement('div');banner.id='roundDirector';banner.innerHTML='<div class="roundPark"><div class="roundFerris"></div><div class="roundTent"></div><div class="roundLights"></div></div><div class="roundContent"><div id="roundLabel"></div><div id="roundWheel"><div class="roundWheelFace"><div class="wheelIcon">🎡</div></div><div class="wheelPointer">▼</div></div><div id="roundTitle"></div><div id="roundSub"></div><button id="roundContinue">CONTINUAR</button></div><div id="roundAvatar"></div>';document.body.append(banner);
 const style=document.createElement('style');style.textContent=`
 #roundDirector{position:fixed;inset:0;z-index:150;display:none;align-items:center;justify-content:center;background:#091b42de;padding:18px;color:white;font-family:system-ui;text-align:center}
 #roundDirector>div{max-width:500px}#roundLabel{font-size:16px;letter-spacing:3px;font-weight:900;color:#ffe36b}#roundTitle{font-size:clamp(34px,10vw,65px);line-height:1.02;font-weight:1000;text-shadow:0 6px #25468e;margin:16px 0}#roundSub{font-size:17px;font-weight:700;color:#e0f9ff;margin:15px auto;max-width:420px}#roundContinue{background:#ffce47;color:#172d65;border:3px solid white;border-radius:17px;padding:16px 28px;font-weight:1000;font-size:19px;box-shadow:0 6px #bb791e;display:none}
 #roundDirector.show{display:flex;flex-direction:column}#roundDirector #roundTitle{animation:roundPop .5s cubic-bezier(.1,1.4,.3,1)}@keyframes roundPop{from{transform:scale(.4);opacity:0}to{transform:scale(1);opacity:1}}
 #roundHUD{position:fixed;top:105px;left:50%;transform:translateX(-50%);z-index:19;display:none;white-space:nowrap;max-width:95vw;background:#143a73e8;border:2px solid #ffffffae;color:#fff;padding:9px 15px;border-radius:17px;font:900 12px system-ui;text-align:center;pointer-events:none;box-shadow:0 5px 18px #071b4b80}
 #roundActions{position:fixed;right:12px;bottom:175px;z-index:18;display:none;gap:8px}#roundActions button{border:2px solid white;border-radius:16px;background:#ffd350;color:#1c3363;padding:13px;font:900 14px system-ui}

 #roundDirector{background:radial-gradient(ellipse at 50% 38%,#80dfff 0%,#3e9fe0 38%,#174a91 100%);overflow:hidden}
 .roundPark{position:absolute;inset:0;pointer-events:none;background:linear-gradient(0deg,#40c985 0 19%,transparent 19%);overflow:hidden}
 .roundFerris{position:absolute;bottom:13%;left:-65px;width:260px;height:260px;border:18px dashed #fff2a0;border-radius:50%;box-shadow:0 0 0 12px #e875b5,inset 0 0 0 12px #79e6f7;opacity:.95;animation:wheelRotate 14s linear infinite}
 .roundFerris:after{content:'';position:absolute;left:50%;top:50%;width:18px;height:18px;border-radius:50%;background:#fff;transform:translate(-50%,-50%);box-shadow:0 0 0 10px #ffcf49}
 .roundTent{position:absolute;right:-38px;bottom:14%;width:220px;height:180px;background:repeating-linear-gradient(90deg,#f85e99 0 32px,#ffe18c 32px 64px);clip-path:polygon(50% 0,100% 62%,100% 100%,0 100%,0 62%);filter:drop-shadow(0 12px 0 #a13d85)}
 .roundLights{position:absolute;left:0;right:0;top:7%;height:22px;background:repeating-radial-gradient(circle at 10px 10px,#ffed76 0 5px,transparent 6px 30px);opacity:.85}
 .roundContent{position:relative;z-index:2;width:min(95vw,480px);padding:22px 18px 28px;background:linear-gradient(165deg,#204b9aef,#251c69ed);border:4px solid #fff3b6;border-radius:30px;box-shadow:0 12px 0 #17245d,0 24px 70px #14205c88}
 #roundWheel{width:190px;height:190px;position:relative;margin:15px auto 5px;filter:drop-shadow(0 7px 0 #102b6e)}
 .roundWheelFace{width:100%;height:100%;border-radius:50%;border:10px solid #ffde70;background:conic-gradient(#ff6b99 0deg 60deg,#6fd3f7 60deg 120deg,#ffd260 120deg 180deg,#67dc9c 180deg 240deg,#a687fa 240deg 300deg,#ff9559 300deg);box-shadow:inset 0 0 0 5px #ffffffa8;display:grid;place-items:center;animation:wheelRotate .9s cubic-bezier(.25,.1,.3,1) infinite}
 .wheelIcon{font-size:54px;background:#254f9c;border:5px solid #fff4c1;width:88px;height:88px;border-radius:50%;display:grid;place-items:center}
 .wheelPointer{position:absolute;top:-26px;left:calc(50% - 18px);font-size:37px;color:#fff4b0;text-shadow:0 3px #aa5d2a}
 @keyframes wheelRotate{to{transform:rotate(360deg)}}
 #roundDirector.result{background:linear-gradient(145deg,#74d8f9,#8d7af2 58%,#56d7a1)}
 #roundDirector.result .roundContent{width:55%;margin-left:auto;margin-right:0;padding:22px 10px;background:linear-gradient(160deg,#263fb8,#472a9a);box-shadow:0 10px 0 #171b68,0 25px 65px #11255e99}
 #roundDirector.result #roundWheel{display:none}
 #roundDirector.result #roundAvatar{display:block}
 #roundAvatar{display:none;position:absolute;z-index:3;left:3%;bottom:20%;width:42%;height:48%;background:linear-gradient(#4fb2f0,#7a68cf);background-size:cover;background-position:center;border-radius:26px;border:4px solid #fff3bb;box-shadow:0 8px 0 #1e4281,0 15px 35px #14205c77;animation:avatarBounce .9s ease-in-out infinite alternate}
 #roundAvatar:before{content:none}
 #roundAvatar:after{content:none}
 @keyframes avatarBounce{to{transform:translateY(-12px) rotate(-3deg)}}
 #roundDirector.result #roundTitle{font-size:clamp(21px,6vw,40px);color:#ffe478;text-shadow:0 3px #c4548b}
 #roundDirector.result #roundSub{font-size:14px}#roundDirector.result .roundLights{background:repeating-linear-gradient(95deg,transparent 0 32px,#ffe75d 33px 42px,#ff619d 43px 52px,#7de9ff 53px 63px,transparent 64px 100px);height:35px;animation:confettiFloat 2s linear infinite}@keyframes confettiFloat{to{background-position:140px 0}}
 `;document.head.append(style);
 const hud=document.createElement('div');hud.id='roundHUD';document.body.append(hud);
 const useButton=document.querySelector('[data-key="KeyE"]')||document.querySelector('[data-key="KeyF"]');
 const actions=document.createElement('div');actions.id='roundActions';actions.innerHTML='<button id="roundPass">PASE</button><button id="roundShoot">CHUTAR</button>';document.body.append(actions);
 let survivalParts=[],survivalHit=0;let hiding=false,hideSpot=null,roundRewarded=false,showResult=false,robotParts=null,shots=[],obstacles=[],gaps=[],raceRespawn=8,raceLastZ=8,robotClock=0;
 let current=null,stage=0,alive=10,time=0,score=0,enemy=0,seekers=[],isSeeker=false,hitCooldown=0,finishers=0,roundToken=0,started=false,ballVelocity=new T.Vector3(),throwTimer=0;
 const prelim=['futsal','rollers','jump','race'],finals=['water','robot','future'];
 const labels={futsal:'FÚTBOL SALA 5 VS 5',rollers:'RODILLOS INFERNALES',jump:'SALTO MORTAL',race:'CARRERA DE OBSTÁCULOS',water:'FINAL · PARQUE ACUÁTICO',robot:'FINAL · ROBOT LANZADOR',future:'FINAL · CARRERA FUTURISTA'};
 const intro={futsal:'Primer equipo en marcar 2 goles o el que gane al terminar 5 minutos.',rollers:'Aguanta en los rodillos que giran sin caerte. ¡Solo clasifican cinco!',jump:'Salta las barras giratorias y esquiva las plataformas que desaparecen.',race:'¡Los primeros 5 en cruzar la meta se clasifican!',water:'Solo uno puede ganar: llega primero a la meta.',robot:'Evita los proyectiles del robot. ¡El último en pie gana!',future:'Una carrera entre portales y obstáculos. Solo gana el primero.'};
 const show=(label,title,sub,button)=>{banner.classList.add('show');banner.classList.toggle('result',showResult);banner.querySelector('#roundLabel').textContent=label;banner.querySelector('#roundTitle').textContent=title;banner.querySelector('#roundSub').textContent=sub;const b=banner.querySelector('button');b.style.display=button?'block':'none';b.onclick=button||null};
 const hideBanner=()=>banner.classList.remove('show');
 function reset(){goalToken++;goalSplash.style.display='none';goalPause=0;lastTouch='TÚ';hiding=false;hideSpot=null;roundRewarded=false;showResult=false;robotParts=null;shots=[];obstacles=[];gaps=[];raceRespawn=8;raceLastZ=8;robotClock=0;survivalParts=[];survivalHit=0;while(root.children.length>10){let x=root.children[root.children.length-1];root.remove(x);if(x.geometry)x.geometry.dispose()}for(let b of bots){b.visible=true;b.position.set(0,0,0);b.userData.lastPosition.copy(b.position)}for(const brain of botBrain){brain.raceCheckpoint=8;brain.raceStun=0;brain.raceJump=0;brain.raceFinish=false;brain.raceFails=0}ball.visible=false;ballVelocity.set(0,0,0);hitCooldown=0;throwTimer=0;finishers=0;score=enemy=0;time=0;actions.style.display='none';}

 const lightMat=material('#ffdf74'),darkMat=material('#252f56'),whiteMat=material('#f8f7f1');
 function buildArena(){
   const stadium=material('#40577e'),seatColors=[material('#f55e87'),material('#65cfff'),material('#ffd05e')];
   cube(31,.5,46,material('#e1b68b'),0,-.58,0);
   cube(26,.06,40,material('#32ad9e'),0,-.23,0);
   for(const side of [-1,1]){
     for(let tier=0;tier<5;tier++){
       const x=side*(14+tier*1.9),y=.65+tier*.9;
       cube(1.9,.5,46,stadium,x,y-.3,0);
       for(let j=0;j<25;j++){
         const z=-21+j*1.75,seat=cube(.85,.55,.9,seatColors[(j+tier)%3],x,y,z);
         if((j+tier)%3!==0){const fan=sphere(.23,material(['#f0b887','#c88862','#e7d0a6'][j%3]),x,y+.55,z);fan.userData.crowd=true}
       }
     }
   }
   for(const end of [-1,1]){
     cube(32,12,.8,darkMat,0,5.5,end*25);
     cube(31,2,.9,blue,0,11,end*25);
     for(let j=0;j<12;j++)sphere(.3,lightMat,(j-5.5)*2.5,10.5,end*24.4);
   }
   cube(2,12,51,stadium,-25,5.5,0);cube(2,12,51,stadium,25,5.5,0);
   cube(51,.7,51,stadium,0,12,0);
   for(let i=-2;i<=2;i++)for(let j=-2;j<=2;j++)cube(4,.1,3,whiteMat,i*8,11.6,j*8);
   for(const z of [-19.6,19.6]){
     const g=material('#fff');cube(8,.22,.25,g,0,3,z);
     cube(.22,3,.22,g,-4,1.5,z);cube(.22,3,.22,g,4,1.5,z);
     for(let i=-3;i<=3;i++)cube(.025,2.8,.025,g,i,1.5,z);
   }
   cube(.15,.04,39,whiteMat,-12.3,.06,0);cube(.15,.04,39,whiteMat,12.3,.06,0);
   cube(25,.04,.13,whiteMat,0,.06,0);
   const center=new T.Mesh(new T.RingGeometry(2.7,2.8,40),whiteMat);center.rotation.x=-Math.PI/2;center.position.y=.06;root.add(center);
 }
 function buildAmusement(){
   const asphalt=material('#7cce8d'),wood=material('#b97a51');
   cube(75,.6,75,asphalt,0,-.4,0);
   for(let i=0;i<28;i++){
     const a=i*2.4,r=12+i%5*4,x=Math.sin(a)*r,z=Math.cos(a)*r;
     if(i%3===0){cube(4,2.5,4,[pink,blue,gold][i%3],x,1.25,z);cube(4.5,.5,4.5,whiteMat,x,2.8,z)}
     else if(i%3===1){cube(3,4,3,wood,x,2,z);const roof=new T.Mesh(new T.ConeGeometry(3.5,2.5,6),[pink,blue,gold][i%3]);roof.position.set(x,5.1,z);root.add(roof)}
     else {cube(.45,3,.45,wood,x,1.5,z);sphere(1.8,material('#40b985'),x,4,z)}
   }
   for(let i=0;i<3;i++){
     const x=-22+i*21,z=-22;
     const ring=new T.Mesh(new T.TorusGeometry(6,.35,8,32),[pink,blue,gold][i]);ring.position.set(x,8,z);root.add(ring);
     cube(.5,8,.5,whiteMat,x-3,4,z);cube(.5,8,.5,whiteMat,x+3,4,z);
     for(let j=0;j<8;j++){let a=j*Math.PI/4;sphere(.65,[pink,blue,gold][(j+i)%3],x+Math.cos(a)*6,8+Math.sin(a)*6,z)}
   }
   for(let i=0;i<12;i++){const z=-31+i*5.4;cube(1,.12,1,lightMat,-32,.3,z);cube(1,.12,1,lightMat,32,.3,z)}
 }
 function buildSurvival(kind){
  const rollers=kind==='rollers',colors=['#ff73b8','#5ad8f2','#ffe16e','#8edb9e'];
  if(rollers){
   for(let i=0;i<4;i++){
    const x=(i-1.5)*5.1;
    const cylinder=new T.Mesh(new T.CylinderGeometry(2.45,2.45,24,20),material(colors[i]));
    cylinder.rotation.x=Math.PI/2;cylinder.position.set(x,-2.25,0);root.add(cylinder);
    survivalParts.push({type:'roller',mesh:cylinder,x});
    for(let j=0;j<7;j++){const ring=new T.Mesh(new T.TorusGeometry(2.46,.12,6,18),material('#fff4c6'));ring.position.set(x,-2.25,-9+j*3);root.add(ring)}
   }
   cube(25,1,.9,material('#344a76'),0,-1,-12.5);cube(25,1,.9,material('#344a76'),0,-1,12.5);
  }else{
   for(let i=0;i<12;i++){
    const tile=new T.Mesh(new T.CylinderGeometry(11.3,11.3,.6,3,1,false,i*Math.PI/6,Math.PI/6),material(colors[i%4]));
    tile.position.y=-.38;root.add(tile);survivalParts.push({type:'tile',mesh:tile,index:i,alive:true});
   }
   const armGroup=new T.Group();armGroup.position.y=.62;root.add(armGroup);
   const lower=new T.Mesh(new T.BoxGeometry(21,.3,.55),material('#ff488e'));armGroup.add(lower);
   const upper=new T.Mesh(new T.BoxGeometry(.55,.35,21),material('#fff1a1'));upper.position.y=1.35;armGroup.add(upper);
   const hub=new T.Mesh(new T.CylinderGeometry(.9,.9,2,12),material('#334579'));hub.position.y=.6;root.add(hub);
   survivalParts.push({type:'arms',mesh:armGroup});
  }
  bots.forEach((b,i)=>{b.visible=true;const a=i*Math.PI*2/9;b.position.set(rollers?(i%4-1.5)*5.1:Math.cos(a)*7,0,rollers?-7+Math.floor(i/4)*6:Math.sin(a)*7)});
  player.position.set(rollers?-2.55:0,0,rollers?8:7);
 }
 function use(){if(current!=='hide'||!started||isSeeker)return false;if(hiding){hiding=false;hideSpot=null;ui.status('Has salido del escondite');return true}
   for(let i=0;i<root.children.length;i++){const a=root.children[i];if(!a.isMesh||a.userData.crowd)continue;if(a.geometry?.type!=='BoxGeometry')continue;
    const x=a.position.x,z=a.position.z;if(Math.hypot(player.position.x-x,player.position.z-z)<3.4&&a.position.y>0.3){hiding=true;hideSpot=new T.Vector3(x,0,z);ui.status('¡Escondido! Pulsa USAR para salir');return true}}
   ui.status('Acércate a una caseta o atracción y pulsa USAR');return true;
 }
 function makeWorld(kind){
  reset();root.visible=true;
  const race=kind==='race'||kind==='water'||kind==='future';
  if(kind==='futsal'){
   buildArena();setFutsalKits();
   ball.visible=true;ball.position.set(0,.5,0);
   bots.forEach((b,i)=>b.position.set((i%5-2)*3,0,i<4?3: -5));
   player.position.set(0,0,9);actions.style.display='flex';
  }else if(kind==='rollers'||kind==='jump'){
   buildSurvival(kind);
  }else if(kind==='hide'){
   buildAmusement();
   bots.forEach((b,i)=>b.position.set(Math.sin(i*2)*18,0,Math.cos(i*2)*18));
   isSeeker=Math.random()<.5;seekers=isSeeker?[0,1,2,3]:[0,1,2,3,4];ui.status(isSeeker?'🔍 BUSCAS: encuentra a los cinco escondidos':'🙈 TE ESCONDES: pulsa USAR cerca de una atracción');
   player.position.set(0,0,0);
  }else if(race){
   const track=kind==='water'?material('#38c6dc'):kind==='future'?material('#6668d8'):material('#53c5a4');
   const trim=kind==='water'?material('#fff4ba'):material('#fff8e3');
   const addBlock=(x,z,w,d,h=2,type='block',speed=0)=>{cube(w,h,d,[pink,blue,gold][obstacles.length%3],x,h/2,z);obstacles.push({x,z,w,d,h,type,speed,phase:obstacles.length*1.7})};
   // Modular racecourse: real gaps, jumping pads, maze, moving gates and finish.
   const segments=[[10,-10],[-13.2,-32],[-35.2,-52],[-55.2,-75],[-78.2,-110]];
   for(const [a,b] of segments){
     cube(15,.8,Math.abs(a-b),track,0,-.48,(a+b)/2);
     cube(.35,.65,Math.abs(a-b),trim,-7.7,.05,(a+b)/2);
     cube(.35,.65,Math.abs(a-b),trim,7.7,.05,(a+b)/2);
   }
   gaps=[{a:-10,b:-13.2},{a:-32,b:-35.2},{a:-52,b:-55.2},{a:-75,b:-78.2}];
   for(const z of [-10,-32,-52,-75]){cube(15,.15,.45,gold,0,.05,z+.6);cube(15,.15,.45,pink,0,.05,z-.6)}
   // Alternating zig-zag maze: walls must be navigated around.
   for(let i=0;i<4;i++){const z=-20-i*2.8,side=i%2===0?-1:1;addBlock(side*3.1,z,8,1.15,3.4,'maze')}
   // Slalom bumpers, timed moving blockers and revolving beams.
   for(let i=0;i<4;i++){addBlock(Math.sin(i*2.4)*3.4,-41-i*2.4,2.3,2.3,2.5,'bumper')}
   for(let i=0;i<3;i++){addBlock(0,-61-i*4.5,3.2,1.2,3.5,'moving',2.4+i*.35)}
   for(let i=0;i<3;i++){addBlock(Math.sin(i*2.5)*3,-84-i*6,2.3,2.3,2.6,'bumper')}
   for(let i=0;i<10;i++){const z=6-i*12;for(const x of [-9,9]){cube(.6,3,.6,whiteMat,x,1.5,z);sphere(.48,[pink,gold,blue][i%3],x,3.2,z)}}
   for(const z of [-25,-48,-69,-95]){const ring=new T.Mesh(new T.TorusGeometry(5,.35,8,24),gold);ring.position.set(0,5,z);root.add(ring)}
   cube(15,.18,.7,gold,0,.2,-106);cube(.8,7,.8,whiteMat,-7,3.5,-106);cube(.8,7,.8,whiteMat,7,3.5,-106);
   cube(15,1,.8,pink,0,7,-106);
   bots.forEach((b,i)=>{b.visible=stage===0||i<4;b.position.set((i%5-2)*2.1,0,4+Math.floor(i/5)*2)});
   player.position.set(0,0,8);
  }else if(kind==='robot'){
   const steel=material('#364766'),armor=material('#536e9b'),glow=new T.MeshStandardMaterial({color:'#50eaff',emissive:'#20bfe7',emissiveIntensity:1.6,metalness:.35,roughness:.22});
   const danger=new T.MeshStandardMaterial({color:'#ff416e',emissive:'#ff3157',emissiveIntensity:1.5,transparent:true,opacity:.65});
   cube(27,.8,27,material('#6867b8'),0,-.5,0);
   for(let i=0;i<4;i++){const z=-11+i*7.3;cube(27,.12,.18,glow,0,.05,z);cube(.2,.12,27,glow,-12.6,.05,0);cube(.2,.12,27,glow,12.6,.05,0)}
   for(let i=0;i<8;i++){const a=i*Math.PI/4;cube(1,2,1,armor,Math.cos(a)*15,1,Math.sin(a)*15);sphere(.65,glow,Math.cos(a)*15,2.3,Math.sin(a)*15)}
   const machine=new T.Group();machine.position.set(0,0,-18);root.add(machine);
   const part=(geo,mat,x,y,z)=>{const m=new T.Mesh(geo,mat);m.position.set(x,y,z);machine.add(m);return m};
   part(new T.CylinderGeometry(2.4,3.5,1.2,12),steel,0,.6,0);
   part(new T.BoxGeometry(3.5,4.8,2.5),armor,0,4,0);
   part(new T.SphereGeometry(1.7,16,12),steel,0,7.3,0);
   for(const x of [-.72,.72]){part(new T.SphereGeometry(.34,12,8),glow,x,7.5,1.5)}
   part(new T.BoxGeometry(1.5,.22,.22),danger,0,6.75,1.6);
   for(const x of [-2.6,2.6]){
     part(new T.CylinderGeometry(.65,.8,3.1,10),armor,x,4.2,0).rotation.z=x<0?-.25:.25;
     part(new T.SphereGeometry(.8,12,8),steel,x*1.25,2.65,0);
   }
   const turret=part(new T.CylinderGeometry(.75,1,3,12),steel,0,5.2,2);turret.rotation.x=Math.PI/2;
   part(new T.CylinderGeometry(.42,.42,3.2,12),glow,0,5.2,3.3).rotation.x=Math.PI/2;
   robotParts={machine,turret,danger,glow};
   bots.forEach((b,i)=>{b.visible=i<4;b.position.set(Math.sin(i*1.45)*8,0,Math.cos(i*1.45)*8)});
   player.position.set(0,0,8);ui.status('🤖 ROBOT: ¡esquiva las zonas rojas antes de que dispare!');
  }
 }
 function startRound(kind){
  showResult=false;current=kind;started=false;makeWorld(kind);
  root.visible=false;hud.style.display='none';const token=++roundToken;let count=3;
  const countdown=()=>{if(token!==roundToken)return;if(count>0){show('RONDA '+(stage+1),String(count),labels[kind],null);count--;setTimeout(countdown,850)}else{hideBanner();root.visible=true;hud.style.display='block';started=true;time=0}};
  let spins=0;const options=stage===0?prelim:finals;const spin=()=>{if(token!==roundToken)return;if(spins<9){show('RULETA DEL PARQUE',labels[options[spins%options.length]],'Girando la ruleta de minijuegos…',null);spins++;setTimeout(spin,130)}else{show('¡MODO SELECCIONADO!',labels[kind],intro[kind],null);setTimeout(countdown,1100)}};spin();
 }
 function next(){stage++;if(stage===1){alive=5;startRound(finals[Math.floor(Math.random()*finals.length)])}else end(true)}
 function end(won){if(roundRewarded)return;roundRewarded=true;started=false;roundToken++;const prize=won?150:25;if(extras.reward)extras.reward(prize,won?'🏆 CAMPEÓN':'Ronda terminada');showResult=true;root.visible=false;banner.classList.add('result');const portrait=ui.captureAvatar?.();const avatar=banner.querySelector('#roundAvatar');if(portrait){avatar.style.backgroundImage='url('+portrait+')';avatar.style.borderRadius='24px'}else{avatar.style.backgroundImage='none'}show(won?'🏆 ¡VICTORIA!':'ELIMINADO',won?'¡ERES EL CAMPEÓN!':'¡BUEN INTENTO!',(won?'Has ganado la final. ':'Has quedado fuera del torneo. ')+'+'+prize+' monedas',()=>{hideBanner();stop();ui.returnMap()});}
 function qualify(){if(!started)return;showResult=false;started=false;roundToken++;root.visible=false;show('¡CLASIFICADO!','¡PASAS DE RONDA!','Quedan 5 participantes. Prepárate para la gran final.',()=>{hideBanner();next()})}
 function start(){showResult=false;stage=0;alive=10;show('TORNEO DE 10 JUGADORES','¡PREPÁRATE!','9 bots competirán contigo. Clasifícate entre los 5 mejores para disputar una final.',()=>{hideBanner();startRound(prelim[Math.floor(Math.random()*prelim.length)])});}
 function stop(){goalToken++;goalSplash.style.display='none';roundToken++;current=null;started=false;root.visible=false;banner.classList.remove('result');actions.style.display='none';hud.style.display='none';hideBanner()}
 function kick(shoot){
  if(current!=='futsal'||!started)return;
  if(Math.hypot(player.position.x-ball.position.x,player.position.z-ball.position.z)>3.2){ui.status('Acércate al balón');return}
  const yaw=ui.getYaw(),speed=shoot?24:13;
  lastTouch='TÚ';ballVelocity.set(-Math.sin(yaw)*speed,0,-Math.cos(yaw)*speed);
  ui.status(shoot?'⚽ ¡CHUT!':'⚽ ¡PASE!')
 }
 actions.querySelector('#roundPass').onclick=()=>kick(false);
 actions.querySelector('#roundShoot').onclick=()=>kick(true);
 function update(dt){
  if(!current||!started)return false;
  time+=dt;hitCooldown=Math.max(0,hitCooldown-dt);
  const p=player.position;
  const race=current==='race'||current==='water'||current==='future';
  if(race){p.x=T.MathUtils.clamp(p.x,-7,7);p.z=T.MathUtils.clamp(p.z,-110,10)}
  else if(current==='futsal'){p.x=T.MathUtils.clamp(p.x,-12,12);p.z=T.MathUtils.clamp(p.z,-19,19)}
  else if(current==='rollers'||current==='jump'){p.x=T.MathUtils.clamp(p.x,-12,12);p.z=T.MathUtils.clamp(p.z,-12,12)}
  else if(current==='hide'){p.x=T.MathUtils.clamp(p.x,-35,35);p.z=T.MathUtils.clamp(p.z,-35,35)}
  else {p.x=T.MathUtils.clamp(p.x,-12,12);p.z=T.MathUtils.clamp(p.z,-12,12)}
  if(race){
   let rank=1;
   bots.forEach((b,i)=>{
    if(!b.visible)return;
    const brain=botBrain[i];if(brain.raceFinish){if(b.position.z<p.z)rank++;return}
    brain.raceStun=Math.max(0,brain.raceStun-dt);
    brain.raceJump=Math.max(0,brain.raceJump-dt);
    if(brain.raceStun<=0){
     // Each competitor chooses a separate line and steers around actual obstacle hitboxes.
     const lookZ=b.position.z-3.4;
     let lane=brain.lane+Math.sin(time*.75+brain.phase)*.6;
     for(const o of obstacles){
      const ox=o.type==='moving'?Math.sin(time*o.speed+o.phase)*5:o.x;
      if(Math.abs(lookZ-o.z)<o.d*.5+2.3&&Math.abs(lane-ox)<o.w*.5+.9){
       const left=ox-o.w*.5-1.15,right=ox+o.w*.5+1.15;
       lane=Math.abs(left-brain.lane)<Math.abs(right-brain.lane)?left:right;
      }
     }
     lane=T.MathUtils.clamp(lane,-6.6,6.6);
     const delta=lane-b.position.x;
     b.position.x+=T.MathUtils.clamp(delta,-dt*3.8,dt*3.8);
     const speed=(3.4+(i%3)*.45)*brain.pace;
     b.position.z=Math.max(-107,b.position.z-dt*speed);
     if(gaps.some(g=>b.position.z<g.a+.65&&b.position.z>g.b-1.1))brain.raceJump=Math.max(brain.raceJump,.55);
    }
    b.position.y=brain.raceJump>0?Math.sin((1-brain.raceJump/.55)*Math.PI)*1.4:0;
    const gap=gaps.find(g=>b.position.z<g.a&&b.position.z>g.b);
    let collided=false;
    for(const o of obstacles){
     const ox=o.type==='moving'?Math.sin(time*o.speed+o.phase)*5:o.x;
     if(Math.abs(b.position.z-o.z)<o.d*.5+.38&&Math.abs(b.position.x-ox)<o.w*.5+.35&&b.position.y<o.h+.12){collided=true;break}
    }
    // Same setbacks as a human: a wall knocks you back, a missed jump respawns at checkpoint.
    if(collided&&brain.raceStun<=0){b.position.z=Math.min(9,b.position.z+2.8);brain.raceStun=.8;brain.raceFails++}
    if(gap&&brain.raceJump<=0){b.position.set(brain.lane,0,brain.raceCheckpoint);brain.raceStun=1.1;brain.raceFails++}
    if(!gap){for(const cp of [-18,-42,-83])if(b.position.z<cp&&brain.raceCheckpoint>cp)brain.raceCheckpoint=cp}
    if(b.position.z<=-105){brain.raceFinish=true;finishers++;b.position.z=-107}
    if(b.position.z<p.z)rank++;
   });
   // Save progress at solid sections; falling in a gap returns to last checkpoint.
   const crossing=gaps.find(g=>p.z<g.a&&p.z>g.b);
   if(!crossing&&p.z<raceLastZ-2){raceLastZ=p.z;if(p.z< -18&&raceRespawn> -18)raceRespawn=-18;if(p.z< -42&&raceRespawn> -42)raceRespawn=-42;if(p.z< -83&&raceRespawn> -83)raceRespawn=-83}
   if(crossing&&p.y< -3){p.set(0,0,raceRespawn);hitCooldown=1;ui.status('💦 ¡Caída! Vuelves al último checkpoint')}
   for(const o of obstacles){
     const ox=o.type==='moving'?Math.sin(time*o.speed+o.phase)*5:o.x;
     if(Math.abs(p.z-o.z)<o.d*.5+.48&&Math.abs(p.x-ox)<o.w*.5+.4&&p.y<o.h+.15){
       if(hitCooldown<=0){p.z=Math.min(9,p.z+2.8);hitCooldown=.7;ui.status('💥 ¡Obstáculo! Esquiva o salta')}
     }
   }
   hud.textContent='🏁 '+labels[current]+' · '+rank+'/'+(stage?5:10)+' · '+Math.max(0,105-Math.floor(time))+'s';
   if(p.z<=-105){if(stage===0){rank<=5?qualify():end(false)}else end(rank===1)}
   else if(time>105){if(stage===0){rank<=5?qualify():end(false)}else end(false)}
  }else if(current==='futsal'){
   if(goalPause>0){goalPause-=dt;hud.textContent='⚽ AZUL '+score+' - '+enemy+' ROJO · ¡GOOOL!';return true}
   ball.position.addScaledVector(ballVelocity,dt);ballVelocity.multiplyScalar(Math.exp(-1.8*dt));
   if(Math.abs(ball.position.x)>11){ball.position.x=T.MathUtils.clamp(ball.position.x,-11,11);ballVelocity.x*=-.8}
   if(Math.abs(ball.position.z)>19){
    if(Math.abs(ball.position.x)<4){
     const ours=ball.position.z<0;if(ours)score++;else enemy++;
     celebrateGoal(lastTouch,ours);
     bots.forEach((b,i)=>{b.position.set(botBrain[i].lane,0,i<4?4:-4);b.userData.lastPosition.copy(b.position)});
    }
    ball.position.set(0,.5,0);ballVelocity.set(0,0,0);
   }
   bots.forEach((b,i)=>{
    const brain=botBrain[i],teammate=i<4,attack=teammate?-1:1;
    const nearest=bots.reduce((best,other,j)=>{if(i===j||!other.visible||(j<4)!==teammate)return best;return Math.min(best,other.position.distanceTo(ball.position))},100);
    const distance=b.position.distanceTo(ball.position),chase=distance<nearest+.4&&distance<9;
    // Defenders hold their half; wingers open up, attackers make runs.
    const lane=brain.lane+Math.sin(time*.55+brain.phase)*1.1;
    const desiredX=chase?ball.position.x:lane;
    const desiredZ=chase?ball.position.z:Math.max(-16,Math.min(16,ball.position.z*.30+attack*(brain.role===0?8:brain.role===1?3:0)));
    const dx=desiredX-b.position.x,dz=desiredZ-b.position.z,d=Math.hypot(dx,dz);
    if(d>.35){const pace=(chase?3.4:2.2)*brain.pace;b.position.x+=dx/d*Math.min(d,pace*dt);b.position.z+=dz/d*Math.min(d,pace*dt)}
    // Separation avoids obvious overlapping conga-lines.
    for(let j=0;j<i;j++){const other=bots[j];const ox=b.position.x-other.position.x,oz=b.position.z-other.position.z,dd=Math.hypot(ox,oz);if(dd<1.15&&dd>.01){b.position.x+=ox/dd*dt*1.8;b.position.z+=oz/dd*dt*1.8}}
    b.position.x=T.MathUtils.clamp(b.position.x,-10.5,10.5);b.position.z=T.MathUtils.clamp(b.position.z,-17.5,17.5);
    brain.decision-=dt;
    if(distance<1.15&&brain.decision<=0){
     const targetX=teammate?Math.sin(time+i)*2:Math.sin(time+i*2)*2;
     const aimX=targetX-b.position.x,aimZ=(teammate?-19:19)-b.position.z;
     const length=Math.hypot(aimX,aimZ)||1;
     ballVelocity.set(aimX/length*(9+Math.random()*7),0,aimZ/length*(9+Math.random()*7));
     lastTouch=botStyles[i].name;brain.decision=1.2+Math.random()*.9;
    }
   });
   hud.textContent='⚽ AZUL '+score+' - '+enemy+' ROJO · '+Math.max(0,300-Math.floor(time))+'s';
   if(goalPause<=0&&(score>=2||enemy>=2||time>=300)){score>enemy?qualify():end(false)}
  }else if(current==='rollers'||current==='jump'){
   const rollers=current==='rollers',spin=1.1+Math.min(1.8,time*.017);
   for(const part of survivalParts){
    if(part.type==='roller')part.mesh.rotation.z+=dt*spin*(part.x<0?1:-1);
    if(part.type==='arms')part.mesh.rotation.y+=dt*spin;
    if(part.type==='tile'&&time>12){const wave=Math.floor((time-12)/5),gone=(part.index+wave*5)%12<Math.min(5,1+Math.floor(time/20));part.alive=!gone;part.mesh.visible=!gone}
   }
   const grounded=pos=>{
    if(rollers)return Math.abs(pos.z)<11.5&&survivalParts.some(q=>q.type==='roller'&&Math.abs(pos.x-q.x)<2.12);
    if(Math.hypot(pos.x,pos.z)>11)return false;
    const a=(Math.atan2(pos.z,pos.x)+Math.PI*2)%(Math.PI*2),sector=Math.floor(a/(Math.PI/6));
    return survivalParts.some(q=>q.type==='tile'&&q.index===sector&&q.alive);
   };
   const hitBar=(pos,jumping)=>{
    if(rollers)return !jumping&&Math.sin(time*2.3+pos.z*.65+pos.x)>.997;
    const arm=survivalParts.find(q=>q.type==='arms');
    const a=Math.atan2(pos.z,pos.x)-arm.mesh.rotation.y;
    return !jumping&&Math.abs(Math.sin(a))<.08&&Math.hypot(pos.x,pos.z)>1.2;
   };
   if((!grounded(p)||hitBar(p,p.y>.65))&&survivalHit<=0){survivalHit=1;end(false);return true}
   survivalHit=Math.max(0,survivalHit-dt);
   let remaining=1;
   bots.forEach((b,i)=>{
    if(!b.visible)return;
    const brain=botBrain[i];
    if(rollers){
     const target=(i%4-1.5)*5.1+Math.sin(time*.7+brain.phase)*.65;
     b.position.x+=T.MathUtils.clamp(target-b.position.x,-dt*2.7,dt*2.7);
     b.position.z=T.MathUtils.clamp(b.position.z+Math.sin(time*.6+brain.phase)*dt*2,-10,10);
    }else{
     const a=Math.atan2(b.position.z,b.position.x)+dt*(i%2?-.25:.3),rad=6.5+Math.sin(time*.3+brain.phase)*1.8;
     b.position.set(Math.cos(a)*rad,0,Math.sin(a)*rad);
    }
    if(brain.raceJump<=0&&Math.sin(time*2.3+brain.phase)>.88)brain.raceJump=.7;
    brain.raceJump=Math.max(0,brain.raceJump-dt);
    b.position.y=brain.raceJump>0?Math.sin((1-brain.raceJump/.7)*Math.PI)*1.15:0;
    if(!grounded(b.position)||hitBar(b.position,b.position.y>.65)){b.visible=false;return}
    remaining++;
   });
   hud.textContent=(rollers?'🎢 RODILLOS INFERNALES':'🌀 SALTO MORTAL')+' · '+remaining+' restantes · '+Math.max(0,90-Math.floor(time))+'s';
   if(remaining<=5||time>=90)qualify();
  }else if(current==='hide'){
   bots.forEach((b,i)=>{const hunter=seekers.includes(i);const target=hunter?(hiding?b.position:p):new T.Vector3(Math.sin(time*.3+i)*26,0,Math.cos(time*.2+i)*26);let v=target.clone().sub(b.position);v.y=0;if(v.length()>.5)b.position.addScaledVector(v.normalize(),dt*(hunter?2.3:2.3));if(hunter&&!isSeeker&&!hiding&&b.position.distanceTo(p)<1.2)end(false);if(isSeeker&&!hunter&&b.position.distanceTo(p)<1.4){b.visible=false;seekers.push(i)}});
   hud.textContent='🫣 '+(isSeeker?'TE TOCA BUSCAR':'TE TOCA ESCONDERTE')+(hiding?' · OCULTO':' · USAR PARA ESCONDERTE')+' · '+Math.max(0,60-Math.floor(time))+'s';
   if(time>=60){if(isSeeker){bots.filter((b,i)=>!seekers.includes(i)&&b.visible).length===0?qualify():end(false)}else qualify()}
  }else if(current==='robot'){
   robotClock+=dt;throwTimer+=dt;
   if(robotParts){
     robotParts.machine.rotation.y=Math.sin(time*1.3)*.28;
     robotParts.machine.position.y=Math.sin(time*2)*.2;
   }
   // Visible telegraphed projectiles: first a warning circle, then a flying sphere, then impact.
   if(throwTimer>2.1){
     throwTimer=0;
     const living=[{position:p,player:true},...bots.filter(b=>b.visible).map(b=>({position:b.position,player:false}))];
     const target=living[Math.floor(Math.random()*living.length)];
     const x=T.MathUtils.clamp(target.position.x+(Math.random()-.5)*1.4,-10,10);
     const z=T.MathUtils.clamp(target.position.z+(Math.random()-.5)*1.4,-10,10);
     const warningMat=new T.MeshBasicMaterial({color:'#ff3e61',transparent:true,opacity:.55,depthWrite:false,side:T.DoubleSide});
     const warning=new T.Mesh(new T.RingGeometry(.9,1.5,24),warningMat);warning.rotation.x=-Math.PI/2;warning.position.set(x,.12,z);root.add(warning);
     const shell=new T.Mesh(new T.SphereGeometry(.72,12,8),new T.MeshStandardMaterial({color:'#ff627f',emissive:'#ff2355',emissiveIntensity:1.1,roughness:.25}));
     shell.position.set(0,6,-15);root.add(shell);
     shots.push({x,z,warning,shell,age:0,targetPlayer:target.player,hit:false});
     ui.status(target.player?'🔴 ¡EL ROBOT TE APUNTA! ¡MUÉVETE!':'🎯 El robot apunta a un rival');
   }
   for(let i=shots.length-1;i>=0;i--){
     const sh=shots[i];sh.age+=dt;
     sh.warning.material.opacity=.3+Math.sin(sh.age*17)*.2;
     const flight=T.MathUtils.clamp((sh.age-.8)/.75,0,1);
     sh.shell.position.set(sh.x*flight,6+(1-flight)*.3-5.25*flight, -15+(sh.z+15)*flight);
     sh.shell.visible=sh.age>.8&&sh.age<1.6;
     if(sh.age>=1.6&&!sh.hit){
       sh.hit=true;sh.warning.material.color.set('#fff1a4');sh.warning.scale.setScalar(1.7);
       if(Math.hypot(p.x-sh.x,p.z-sh.z)<1.55){end(false);return true}
       for(const b of bots){if(b.visible&&Math.hypot(b.position.x-sh.x,b.position.z-sh.z)<1.6)b.visible=false}
     }
     if(sh.age>1.95){root.remove(sh.warning,sh.shell);sh.warning.geometry.dispose();sh.warning.material.dispose();sh.shell.geometry.dispose();sh.shell.material.dispose();shots.splice(i,1)}
   }
   bots.forEach((b,i)=>{if(!b.visible)return;b.position.x=T.MathUtils.clamp(b.position.x+Math.sin(time*1.8+i*2)*dt*2.5,-10,10);b.position.z=T.MathUtils.clamp(b.position.z+Math.cos(time*1.3+i)*dt*1.7,-10,10)});
   const left=bots.filter(b=>b.visible).length;
   hud.textContent='🤖 ROBOT · '+(left+1)+' restantes · ESQUIVA LAS MARCAS ROJAS';
   if(left===0)end(true);

  }
  bots.forEach((b,i)=>{if(!b.visible)return;const previous=b.userData.lastPosition;const dx=b.position.x-previous.x,dz=b.position.z-previous.z;const dist=Math.hypot(dx,dz);const speed=Math.min(9,dist/Math.max(dt,.01));if(dist>.001){const target=Math.atan2(dx,dz);b.rotation.y+=Math.atan2(Math.sin(target-b.rotation.y),Math.cos(target-b.rotation.y))*Math.min(1,dt*9)}botRigs[i].actualizar(dt,speed>.4?(speed>5?'correr':'caminar'):'quieto',{velocidad:speed});previous.copy(b.position)});
  return true;
 }
 return {start,stop,update,kick,use,hasGround:()=>!(current==='race'||current==='water'||current==='future')||!gaps.some(g=>player.position.z<g.a&&player.position.z>g.b),get running(){return !!current},get started(){return started}};
}
