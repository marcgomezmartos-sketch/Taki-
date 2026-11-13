// Barbas Minigames V63: round director. Local bots until multiplayer backend is ready.
export function createTournament(T,scene,player,extras,ui){
 const root=new T.Group();scene.add(root);root.visible=false;
 const material=(c)=>new T.MeshStandardMaterial({color:c,roughness:.73,metalness:.03});
 const floorMat=material('#58cfa5'),pink=material('#fa6caa'),blue=material('#57baf4'),gold=material('#ffd75b');
 const cube=(w,h,d,m,x,y,z)=>{let a=new T.Mesh(new T.BoxGeometry(w,h,d),m);a.position.set(x,y,z);a.receiveShadow=true;root.add(a);return a};
 const sphere=(r,m,x,y,z)=>{let a=new T.Mesh(new T.SphereGeometry(r,12,8),m);a.position.set(x,y,z);root.add(a);return a};
 const botMat=[material('#fc765e'),material('#9d75f8'),material('#f7d74e'),material('#69cba9'),material('#f48ac6')];
 const bots=[];for(let i=0;i<9;i++){let g=new T.Group();let body=new T.Mesh(new T.CapsuleGeometry(.38,.8,4,8),botMat[i%5]);body.position.y=1;g.add(body);let head=new T.Mesh(new T.SphereGeometry(.35,10,8),material('#e5b48b'));head.position.y=1.85;g.add(head);root.add(g);bots.push(g)}
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
 #roundDirector.result .roundContent{width:58%;margin-left:auto;margin-right:0;padding:26px 12px}
 #roundDirector.result #roundWheel{display:none}
 #roundDirector.result #roundAvatar{display:block}
 #roundAvatar{display:none;position:absolute;z-index:3;left:7%;bottom:20%;width:110px;height:205px;background:linear-gradient(#e6b18b 0 23%,#1577d2 23% 61%,#424c70 61% 100%);border-radius:52px 52px 20px 20px;border:5px solid #fff;box-shadow:0 8px 0 #1e4281;animation:avatarBounce .9s ease-in-out infinite alternate}
 #roundAvatar:before{content:'●  ●';position:absolute;top:25px;left:19px;color:#162a44;font-size:18px;letter-spacing:8px}
 #roundAvatar:after{content:'';position:absolute;left:23px;top:53px;width:54px;height:15px;background:#272338;border-radius:0 0 20px 20px}
 @keyframes avatarBounce{to{transform:translateY(-12px) rotate(-3deg)}}
 #roundDirector.result #roundTitle{font-size:clamp(24px,6vw,40px)}
 #roundDirector.result #roundSub{font-size:14px}
 `;document.head.append(style);
 const hud=document.createElement('div');hud.id='roundHUD';document.body.append(hud);
 const useButton=document.querySelector('[data-key="KeyE"]')||document.querySelector('[data-key="KeyF"]');
 const actions=document.createElement('div');actions.id='roundActions';actions.innerHTML='<button id="roundPass">PASE</button><button id="roundShoot">CHUTAR</button>';document.body.append(actions);
 let hiding=false,hideSpot=null,roundRewarded=false,showResult=false,robotParts=null,shots=[],obstacles=[],gaps=[],raceRespawn=8,raceLastZ=8,robotClock=0;
 let current=null,stage=0,alive=10,time=0,score=0,enemy=0,seekers=[],isSeeker=false,hitCooldown=0,finishers=0,roundToken=0,started=false,ballVelocity=new T.Vector3(),throwTimer=0;
 const prelim=['futsal','hide','race'],finals=['water','robot','future'];
 const labels={futsal:'FÚTBOL SALA 5 VS 5',hide:'ESCONDITE EN EL PARQUE',race:'CARRERA DE OBSTÁCULOS',water:'FINAL · PARQUE ACUÁTICO',robot:'FINAL · ROBOT LANZADOR',future:'FINAL · CARRERA FUTURISTA'};
 const intro={futsal:'Primer equipo en marcar 2 goles o el que gane al terminar 5 minutos.',hide:'5 buscan y 5 se esconden. Sobrevive o encuentra a tus rivales.',race:'¡Los primeros 5 en cruzar la meta se clasifican!',water:'Solo uno puede ganar: llega primero a la meta.',robot:'Evita los proyectiles del robot. ¡El último en pie gana!',future:'Una carrera entre portales y obstáculos. Solo gana el primero.'};
 const show=(label,title,sub,button)=>{banner.classList.add('show');banner.classList.toggle('result',showResult);banner.querySelector('#roundLabel').textContent=label;banner.querySelector('#roundTitle').textContent=title;banner.querySelector('#roundSub').textContent=sub;const b=banner.querySelector('button');b.style.display=button?'block':'none';b.onclick=button||null};
 const hideBanner=()=>banner.classList.remove('show');
 function reset(){hiding=false;hideSpot=null;roundRewarded=false;showResult=false;robotParts=null;shots=[];obstacles=[];gaps=[];raceRespawn=8;raceLastZ=8;robotClock=0;while(root.children.length>10){let x=root.children[root.children.length-1];root.remove(x);if(x.geometry)x.geometry.dispose()}for(let b of bots){b.visible=true;b.position.set(0,0,0)}ball.visible=false;ballVelocity.set(0,0,0);hitCooldown=0;throwTimer=0;finishers=0;score=enemy=0;time=0;actions.style.display='none';}

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
 function use(){if(current!=='hide'||!started||isSeeker)return false;if(hiding){hiding=false;hideSpot=null;ui.status('Has salido del escondite');return true}
   for(let i=0;i<root.children.length;i++){const a=root.children[i];if(!a.isMesh||a.userData.crowd)continue;if(a.geometry?.type!=='BoxGeometry')continue;
    const x=a.position.x,z=a.position.z;if(Math.hypot(player.position.x-x,player.position.z-z)<3.4&&a.position.y>0.3){hiding=true;hideSpot=new T.Vector3(x,0,z);ui.status('¡Escondido! Pulsa USAR para salir');return true}}
   ui.status('Acércate a una caseta o atracción y pulsa USAR');return true;
 }
 function makeWorld(kind){
  reset();root.visible=true;
  const race=kind==='race'||kind==='water'||kind==='future';
  if(kind==='futsal'){
   buildArena();
   ball.visible=true;ball.position.set(0,.5,0);
   bots.forEach((b,i)=>b.position.set((i%5-2)*3,0,i<4?-6:7));
   player.position.set(0,0,9);actions.style.display='flex';
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
 function end(won){if(roundRewarded)return;roundRewarded=true;started=false;roundToken++;const prize=won?150:25;if(extras.reward)extras.reward(prize,won?'🏆 CAMPEÓN':'Ronda terminada');showResult=true;root.visible=false;banner.classList.add('result');show(won?'🏆 ¡VICTORIA!':'ELIMINADO',won?'¡ERES EL CAMPEÓN!':'¡BUEN INTENTO!',(won?'Has ganado la final. ':'Has quedado fuera del torneo. ')+'+'+prize+' monedas',()=>{hideBanner();stop();ui.returnMap()});}
 function qualify(){if(!started)return;showResult=false;started=false;roundToken++;root.visible=false;show('¡CLASIFICADO!','¡PASAS DE RONDA!','Quedan 5 participantes. Prepárate para la gran final.',()=>{hideBanner();next()})}
 function start(){showResult=false;stage=0;alive=10;show('TORNEO DE 10 JUGADORES','¡PREPÁRATE!','9 bots competirán contigo. Clasifícate entre los 5 mejores para disputar una final.',()=>{hideBanner();startRound(prelim[Math.floor(Math.random()*prelim.length)])});}
 function stop(){roundToken++;current=null;started=false;root.visible=false;banner.classList.remove('result');actions.style.display='none';hud.style.display='none';hideBanner()}
 function kick(shoot){
  if(current!=='futsal'||!started)return;
  if(Math.hypot(player.position.x-ball.position.x,player.position.z-ball.position.z)>3.2){ui.status('Acércate al balón');return}
  const yaw=ui.getYaw(),speed=shoot?24:13;
  ballVelocity.set(-Math.sin(yaw)*speed,0,-Math.cos(yaw)*speed);
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
  else if(current==='hide'){p.x=T.MathUtils.clamp(p.x,-35,35);p.z=T.MathUtils.clamp(p.z,-35,35)}
  else {p.x=T.MathUtils.clamp(p.x,-12,12);p.z=T.MathUtils.clamp(p.z,-12,12)}
  if(race){
   let rank=1;
   bots.forEach((b,i)=>{if(!b.visible)return;
     const speed=2.9+(i%4)*.37;
     b.position.z=Math.max(-107,b.position.z-dt*speed);
     // Bots occasionally wait at jumping gaps and slow at the maze.
     if(gaps.some(g=>b.position.z<g.a&&b.position.z>g.b))b.position.y=1.5;else b.position.y=0;
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
   ball.position.addScaledVector(ballVelocity,dt);ballVelocity.multiplyScalar(Math.exp(-1.8*dt));
   if(Math.abs(ball.position.x)>11){ball.position.x=T.MathUtils.clamp(ball.position.x,-11,11);ballVelocity.x*=-.8}
   if(Math.abs(ball.position.z)>19){if(Math.abs(ball.position.x)<4){if(ball.position.z<0)score++;else enemy++}ball.position.set(0,.5,0);ballVelocity.set(0,0,0)}
   bots.forEach((b,i)=>{const target=i<4?ball.position:p;let v=target.clone().sub(b.position);v.y=0;if(v.length()>1)b.position.addScaledVector(v.normalize(),dt*(i<4?2.8:2.2));if(i>=4&&b.position.distanceTo(ball.position)<1.1&&Math.random()<dt*.6){ballVelocity.set(Math.sin(i)*5,0,8)}});
   hud.textContent='⚽ '+score+' - '+enemy+' · '+Math.max(0,300-Math.floor(time))+'s · PASE / CHUTAR';
   if(score>=2||enemy>=2||time>=300){score>enemy?qualify():end(false)}
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
  return true;
 }
 return {start,stop,update,kick,use,hasGround:()=>!(current==='race'||current==='water'||current==='future')||!gaps.some(g=>player.position.z<g.a&&player.position.z>g.b),get running(){return !!current},get started(){return started}};
}
