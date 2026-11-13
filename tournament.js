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
 const banner=document.createElement('div');banner.id='roundDirector';banner.innerHTML='<div id="roundLabel"></div><div id="roundTitle"></div><div id="roundSub"></div><button id="roundContinue">CONTINUAR</button>';document.body.append(banner);
 const style=document.createElement('style');style.textContent=`
 #roundDirector{position:fixed;inset:0;z-index:150;display:none;align-items:center;justify-content:center;background:#091b42de;padding:18px;color:white;font-family:system-ui;text-align:center}
 #roundDirector>div{max-width:500px}#roundLabel{font-size:16px;letter-spacing:3px;font-weight:900;color:#ffe36b}#roundTitle{font-size:clamp(34px,10vw,65px);line-height:1.02;font-weight:1000;text-shadow:0 6px #25468e;margin:16px 0}#roundSub{font-size:17px;font-weight:700;color:#e0f9ff;margin:15px auto;max-width:420px}#roundContinue{background:#ffce47;color:#172d65;border:3px solid white;border-radius:17px;padding:16px 28px;font-weight:1000;font-size:19px;box-shadow:0 6px #bb791e;display:none}
 #roundDirector.show{display:flex;flex-direction:column}#roundDirector #roundTitle{animation:roundPop .5s cubic-bezier(.1,1.4,.3,1)}@keyframes roundPop{from{transform:scale(.4);opacity:0}to{transform:scale(1);opacity:1}}
 #roundHUD{position:fixed;top:33%;left:50%;transform:translateX(-50%);z-index:19;display:none;white-space:nowrap;max-width:95vw;background:#143a73e8;border:2px solid #ffffffae;color:#fff;padding:9px 15px;border-radius:17px;font:900 13px system-ui;text-align:center;pointer-events:none}
 #roundActions{position:fixed;right:12px;bottom:175px;z-index:18;display:none;gap:8px}#roundActions button{border:2px solid white;border-radius:16px;background:#ffd350;color:#1c3363;padding:13px;font:900 14px system-ui}
 `;document.head.append(style);
 const hud=document.createElement('div');hud.id='roundHUD';document.body.append(hud);
 const actions=document.createElement('div');actions.id='roundActions';actions.innerHTML='<button id="roundPass">PASE</button><button id="roundShoot">CHUTAR</button>';document.body.append(actions);
 let current=null,stage=0,alive=10,time=0,score=0,enemy=0,seekers=[],isSeeker=false,hitCooldown=0,finishers=0,roundToken=0,started=false,ballVelocity=new T.Vector3(),throwTimer=0;
 const prelim=['futsal','hide','race'],finals=['water','robot','future'];
 const labels={futsal:'FÚTBOL SALA 5 VS 5',hide:'ESCONDITE EN EL PARQUE',race:'CARRERA DE OBSTÁCULOS',water:'FINAL · PARQUE ACUÁTICO',robot:'FINAL · ROBOT LANZADOR',future:'FINAL · CARRERA FUTURISTA'};
 const intro={futsal:'Primer equipo en marcar 2 goles o el que gane al terminar 5 minutos.',hide:'5 buscan y 5 se esconden. Sobrevive o encuentra a tus rivales.',race:'¡Los primeros 5 en cruzar la meta se clasifican!',water:'Solo uno puede ganar: llega primero a la meta.',robot:'Evita los proyectiles del robot. ¡El último en pie gana!',future:'Una carrera entre portales y obstáculos. Solo gana el primero.'};
 const show=(label,title,sub,button)=>{banner.classList.add('show');banner.querySelector('#roundLabel').textContent=label;banner.querySelector('#roundTitle').textContent=title;banner.querySelector('#roundSub').textContent=sub;const b=banner.querySelector('button');b.style.display=button?'block':'none';b.onclick=button||null};
 const hideBanner=()=>banner.classList.remove('show');
 function reset(){while(root.children.length>10){let x=root.children[root.children.length-1];root.remove(x);if(x.geometry)x.geometry.dispose()}for(let b of bots){b.visible=true;b.position.set(0,0,0)}ball.visible=false;ballVelocity.set(0,0,0);hitCooldown=0;throwTimer=0;finishers=0;score=enemy=0;time=0;actions.style.display='none';}
 function makeWorld(kind){
  reset();root.visible=true;
  const race=kind==='race'||kind==='water'||kind==='future';
  if(kind==='futsal'){
   cube(25,.6,40,material('#46ad80'),0,-.35,0);
   for(let i=-4;i<=4;i++)cube(.11,.03,39,material('#c7f5e8'),i*2.7,.01,0);
   cube(8,3,.3,material('#fff'),0,1.5,-20);cube(8,3,.3,material('#fff'),0,1.5,20);
   ball.visible=true;ball.position.set(0,.5,0);
   bots.forEach((b,i)=>b.position.set((i%5-2)*3,0,i<4?-6:7));
   player.position.set(0,0,9);actions.style.display='flex';
  }else if(kind==='hide'){
   cube(72,.7,72,floorMat,0,-.4,0);
   for(let i=0;i<38;i++){let x=Math.sin(i*17.7)*30,z=Math.cos(i*11.3)*30;if(Math.abs(x)<5&&Math.abs(z)<5)continue;cube(i%3===0?4:2,2+i%4,2+i%2,[pink,blue,gold][i%3],x,1,z)}
   for(let i=0;i<8;i++){let a=i*Math.PI/4;sphere(1.7,material('#56bc67'),Math.cos(a)*25,3.8,Math.sin(a)*25);cube(.5,3,.5,material('#996b49'),Math.cos(a)*25,1.5,Math.sin(a)*25)}
   bots.forEach((b,i)=>b.position.set(Math.sin(i*2)*18,0,Math.cos(i*2)*18));
   isSeeker=Math.random()<.5;seekers=isSeeker?[0,1,2,3]:[0,1,2,3,4];
   player.position.set(0,0,0);
  }else if(race){
   cube(15,.8,130,kind==='water'?blue:kind==='future'?material('#6e64c8'):floorMat,0,-.45,-49);
   for(let i=0;i<15;i++){let z=5-i*7.5;
    if(kind==='water'){cube(13,.6,.6,gold,0,.3,z);sphere(1.2,pink,Math.sin(i*3)*4,1.1,z)}
    else if(kind==='future'){cube(2,3,2,[pink,gold,blue][i%3],Math.sin(i*5)*4,1.5,z);let ring=new T.Mesh(new T.TorusGeometry(3,.24,8,24),gold);ring.position.set(0,3,z);root.add(ring)}
    else{cube(2.8,2.6,2.8,[pink,gold,blue][i%3],Math.sin(i*3)*4,1.3,z)}
   }
   cube(15,5,.3,gold,0,3,-109);
   bots.forEach((b,i)=>{b.visible=stage===0||i<4;b.position.set((i%5-2)*2.1,0,4+Math.floor(i/5)*2)});
   player.position.set(0,0,8);
  }else if(kind==='robot'){
   cube(25,.8,25,material('#7e80d5'),0,-.5,0);
   cube(5,6,3,material('#485c8b'),0,3,-16);
   sphere(1.5,pink,0,6,-14);
   bots.forEach((b,i)=>{b.visible=i<4;b.position.set(Math.sin(i*.7)*7,0,Math.cos(i*.7)*7)});
   player.position.set(0,0,8);
  }
 }
 function startRound(kind){
  current=kind;started=false;makeWorld(kind);
  const token=++roundToken;let count=3;
  const countdown=()=>{if(token!==roundToken)return;if(count>0){show('RONDA '+(stage+1),String(count),labels[kind],null);count--;setTimeout(countdown,850)}else{hideBanner();started=true;time=0}};
  let spins=0;const options=stage===0?prelim:finals;const spin=()=>{if(token!==roundToken)return;if(spins<9){show('SORTEO DE MINIJUEGO',labels[options[spins%options.length]],'¿Qué desafío tocará?',null);spins++;setTimeout(spin,130)}else{show('¡MODO SELECCIONADO!',labels[kind],intro[kind],null);setTimeout(countdown,1100)}};spin();
 }
 function next(){stage++;if(stage===1){alive=5;startRound(finals[Math.floor(Math.random()*finals.length)])}else end(true)}
 function end(won){started=false;roundToken++;const prize=won?150:25;if(extras.reward)extras.reward(prize,won?'🏆 CAMPEÓN':'Ronda terminada');show(won?'🏆 ¡VICTORIA!':'ELIMINADO',won?'¡ERES EL CAMPEÓN!':'¡BUEN INTENTO!',(won?'Has ganado la final. ':'Has quedado fuera del torneo. ')+'+'+prize+' monedas',()=>{hideBanner();stop();ui.returnMap()});}
 function qualify(){started=false;roundToken++;show('¡CLASIFICADO!','¡PASAS DE RONDA!','Quedan 5 participantes. Prepárate para la gran final.',()=>{hideBanner();next()})}
 function start(){stage=0;alive=10;show('TORNEO DE 10 JUGADORES','¡PREPÁRATE!','9 bots competirán contigo. Clasifícate entre los 5 mejores para disputar una final.',()=>{hideBanner();startRound(prelim[Math.floor(Math.random()*prelim.length)])});}
 function stop(){roundToken++;current=null;started=false;root.visible=false;actions.style.display='none';hud.style.display='none';hideBanner()}
 function kick(shoot){
  if(current!=='futsal'||!started)return;
  if(player.position.distanceTo(ball.position)>4){ui.status('Acércate al balón');return}
  const yaw=ui.getYaw(),speed=shoot?18:10;
  ballVelocity.set(-Math.sin(yaw)*speed,0,-Math.cos(yaw)*speed);
  if(shoot&&Math.abs(ball.position.z)>14&&Math.abs(ball.position.x)<4){score++;ball.position.set(0,.5,0);ballVelocity.set(0,0,0)}
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
   let rank=1;bots.forEach((b,i)=>{b.position.z-=dt*(3.3+i%4*.38);b.position.z=Math.max(-110,b.position.z);if(b.position.z<p.z)rank++});
   for(let i=0;i<15;i++){let z=5-i*7.5;if(Math.abs(p.z-z)<1.2&&Math.abs(p.x-Math.sin(i*(current==='future'?5:3))*4)<1.7&&hitCooldown===0){p.z+=3;hitCooldown=1.2}}
   hud.textContent='🏁 '+labels[current]+' · Puesto '+rank+'/'+(stage?5:10);
   if(p.z<=-105){if(stage===0){rank<=5?qualify():end(false)}else end(rank===1)}
   else if(time>100){if(stage===0){rank<=5?qualify():end(false)}else end(false)}
  }else if(current==='futsal'){
   ball.position.addScaledVector(ballVelocity,dt);ballVelocity.multiplyScalar(Math.exp(-1.8*dt));
   if(Math.abs(ball.position.x)>11)ballVelocity.x*=-.8;
   if(Math.abs(ball.position.z)>19){if(Math.abs(ball.position.x)<4){if(ball.position.z<0)score++;else enemy++}ball.position.set(0,.5,0);ballVelocity.set(0,0,0)}
   bots.forEach((b,i)=>{const target=i<4?ball.position:p.position;let v=target.clone().sub(b.position);v.y=0;if(v.length()>1)b.position.addScaledVector(v.normalize(),dt*(i<4?2.8:2.2));if(i>=4&&b.position.distanceTo(ball.position)<1.1&&Math.random()<dt*.6){ballVelocity.set(Math.sin(i)*5,0,8)}});
   hud.textContent='⚽ '+score+' - '+enemy+' · '+Math.max(0,300-Math.floor(time))+'s · PASE / CHUTAR';
   if(score>=2||enemy>=2||time>=300){score>enemy?qualify():end(false)}
  }else if(current==='hide'){
   bots.forEach((b,i)=>{const hunter=seekers.includes(i);const target=hunter?p:new T.Vector3(Math.sin(time*.3+i)*26,0,Math.cos(time*.2+i)*26);let v=target.clone().sub(b.position);v.y=0;if(v.length()>.5)b.position.addScaledVector(v.normalize(),dt*(hunter?2.3:2.3));if(hunter&&!isSeeker&&b.position.distanceTo(p)<1.2)end(false);if(isSeeker&&!hunter&&b.position.distanceTo(p)<1.4){b.visible=false;seekers.push(i)}});
   hud.textContent='🫣 '+(isSeeker?'BUSCA A LOS ESCONDIDOS':'ESCÓNDETE')+' · '+Math.max(0,60-Math.floor(time))+'s';
   if(time>=60)qualify();
  }else if(current==='robot'){
   throwTimer+=dt;
   if(throwTimer>1.2){throwTimer=0;const b=bots[Math.floor(Math.random()*bots.length)];if(b.visible){b.position.set((Math.random()-.5)*20,0,(Math.random()-.5)*20)}}
   bots.forEach((b,i)=>{if(!b.visible)return;b.position.x+=Math.sin(time*2+i)*dt*1.6;if(Math.random()<dt*.15)b.visible=false});
   if(Math.random()<dt*.6&&hitCooldown===0){let x=(Math.random()-.5)*23,z=(Math.random()-.5)*23;let projectile=sphere(.8,pink,x,2,z);setTimeout(()=>{root.remove(projectile);projectile.geometry.dispose()},550);if(Math.hypot(p.x-x,p.z-z)<1.6){end(false)}}
   const left=bots.filter(b=>b.visible).length;hud.textContent='🤖 SUPERVIVENCIA · '+(left+1)+' restantes';
   if(left===0)end(true);
  }
  return true;
 }
 return {start,stop,update,kick,get running(){return !!current},get started(){return started}};
}
