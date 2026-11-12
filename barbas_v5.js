import * as T from 'three';
// Barbas V5: clean, modular avatar. Clothing and skin share articulated pivots.
export function crearBarbasV4(){
 const root=new T.Group(),body=new T.Group();root.add(body);
 const material=c=>new T.MeshStandardMaterial({color:c,roughness:.95,side:T.DoubleSide});
 const skin=material('#e8a574'),shade=material('#d48e62'),dark=material('#17191c'),hair=material('#171519'),shorts=material('#1b1c21'),white=material('#fff8ee'),iris=material('#30221d');
 function ell(parent,mat,x,y,z,sx,sy,sz){const m=new T.Mesh(new T.SphereGeometry(1,24,16),mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;parent.add(m);return m}
 function garment(mat,rings,parent=body,n=28){const pos=[],idx=[];for(const [y,rx,rz,cz=0] of rings){for(let i=0;i<n;i++){const a=i/n*Math.PI*2;pos.push(Math.sin(a)*rx,y,Math.cos(a)*rz+cz)}}for(let j=0;j<rings.length-1;j++)for(let i=0;i<n;i++){const a=j*n+i,b=j*n+(i+1)%n,c=(j+1)*n+i,d=(j+1)*n+(i+1)%n;idx.push(a,c,b,b,c,d)}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setIndex(idx);geo.computeVertexNormals();const m=new T.Mesh(geo,mat);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
 // Rounded torso, separate from any outfit.
 garment(skin,[[1.30,.29,.205],[1.42,.34,.23],[1.65,.37,.245],[1.87,.355,.232],[2.04,.235,.17]]);
 ell(body,skin,0,1.40,0,.33,.19,.23);
 ell(body,skin,0,2.07,0,.115,.17,.115);
 const head=new T.Group();head.position.set(0,2.34,.02);body.add(head);const face={eyes:[],brows:[]};
 ell(head,skin,0,.02,0,.29,.315,.265);
 for(const side of [-1,1]){ell(head,skin,side*.286,-.02,.01,.055,.082,.055);ell(head,white,side*.115,.09,.247,.052,.054,.026);face.eyes.push(ell(head,iris,side*.112,.09,.274,.027,.032,.012));const brow=ell(head,hair,side*.115,.203,.251,.088,.018,.018);brow.rotation.z=side*.12;face.brows.push(brow)}
 ell(head,shade,0,-.035,.266,.065,.073,.061);
 // Signature full beard stays on every avatar and follows head movement.
 ell(head,dark,0,-.187,.124,.256,.174,.19);
 ell(head,dark,0,-.22,.235,.19,.11,.083);
 for(const side of [-1,1]){ell(head,dark,side*.215,-.123,.14,.055,.145,.105);ell(head,dark,side*.073,-.09,.29,.093,.038,.033)}
 ell(head,skin,0,-.145,.29,.105,.043,.024);
 // Bald by default: no scalp hair. Beard and eyebrows are permanent.
 const arms=[],elbows=[],legs=[],knees=[],baseShorts=[];
 for(const side of [-1,1]){
  const arm=new T.Group();arm.position.set(side*.385,1.94,0);body.add(arm);arms.push(arm);
  ell(arm,skin,0,-.12,0,.14,.23,.14);
  garment(skin,[[-.36,.117,.12],[-.25,.132,.135],[-.10,.142,.142],[.02,.135,.135]],arm);
  const elbow=new T.Group();elbow.position.y=-.33;arm.add(elbow);elbows.push(elbow);
  ell(elbow,skin,0,-.12,0,.113,.20,.115);
  ell(elbow,skin,0,-.30,.01,.103,.105,.10);
  const leg=new T.Group();leg.position.set(side*.184,1.35,0);body.add(leg);legs.push(leg);
  garment(skin,[[-.61,.169,.166],[-.39,.183,.178],[-.16,.205,.198],[.02,.195,.194]],leg);
  baseShorts.push(garment(shorts,[[-.23,.208,.199],[-.17,.217,.208],[-.02,.22,.211],[.065,.205,.205]],leg));
  const knee=new T.Group();knee.position.y=-.53;leg.add(knee);knees.push(knee);
  ell(knee,skin,0,-.17,0,.15,.29,.153);
  ell(knee,dark,0,-.49,.07,.19,.09,.245);
 }
 ell(body,shorts,0,1.33,0,.34,.15,.235);
 let t=0,blend=0,stride=0,land=0,wasAir=false,runBlend=0,turnLean=0;
 let idleShift=0,lookTarget=0,nextLook=2.2,headLook=0,headTilt=0;
 const damp=(current,target,speed,dt)=>T.MathUtils.damp(current,target,speed,dt);
 function actualizar(dt,mode='quieto',state={}){
  dt=Math.min(Math.max(dt,0),.05);t+=dt;
  const moving=mode==='caminar'||mode==='correr',running=mode==='correr',air=!!state.aire;
  blend=damp(blend,moving?1:0,moving?4.7:6.5,dt);
  runBlend=damp(runBlend,running?1:0,3.7,dt);
  // Speed-sensitive step cycle with smooth transitions between standing, walking and sprinting.
  const locomotionSpeed=Math.max(0,state.velocidad||0);const frequency=1.15+locomotionSpeed*.18;
  stride+=dt*Math.PI*2*frequency*Math.max(.15,blend);
  const phase=stride,amp=(.38+.34*runBlend)*blend;
  if(wasAir&&!air)land=1;wasAir=air;land=damp(land,0,6.8,dt);
  const ease=(obj,axis,target,speed=9)=>{obj.rotation[axis]=damp(obj.rotation[axis],target,speed,dt)};
  const footLift=Math.max(0,Math.sin(phase));
  for(let i=0;i<2;i++){
   const side=i===0?-1:1,cycle=phase+i*Math.PI;
   const swing=Math.sin(cycle),forward=Math.cos(cycle);
   const lift=Math.max(0,forward);
   // The planted leg stays straighter; the swinging leg folds and rises.
   const hip=air?(state.subiendo?-.32:.26):swing*amp+Math.max(0,forward)*.10*blend;
   ease(legs[i],'x',hip,9);
   ease(legs[i],'z',air?side*.12:side*(.032+.022*runBlend)*blend,8);
   ease(legs[i],'y',side*.022*blend,8);
   ease(knees[i],'x',air?(state.subiendo?.68:.38):Math.pow(lift,1.3)*(.58+.27*runBlend)*blend+.19*land,11);
   // Arms counter-swing to legs, with elbow flex and a subtle wrist-side sway.
   ease(arms[i],'x',air?-.55:-swing*amp*.72-.09*runBlend*blend+Math.sin(t*1.6+i*2.1)*.012*(1-blend),8);
   ease(arms[i],'z',air?side*.25:side*(.10+.055*runBlend*blend)+Math.cos(cycle)*.018*blend,7);
   ease(arms[i],'y',-side*.065*blend+Math.sin(cycle)*.02*blend,7);
   ease(elbows[i],'x',air?-.72:-.10-(.19+.37*runBlend)*blend-lift*.13*blend,9);
   ease(elbows[i],'z',side*.028*blend,7);
  }
  const bounce=(Math.cos(phase*2)-1)*.014*(1+.5*runBlend)*blend;
  const lateral=Math.sin(phase)*.023*blend;
  body.position.y=damp(body.position.y,air?.035:bounce-land*.09+Math.sin(t*2.05)*.005*(1-blend),10,dt);
  body.position.x=damp(body.position.x,air?0:lateral,8,dt);
  body.position.z=damp(body.position.z,air?-.025:Math.cos(phase)*.012*blend,7,dt);
  // Pelvis and shoulders rotate in opposite directions, breaking the rigid robot silhouette.
  ease(body,'x',air?(state.subiendo?-.12:.12):-.025-.09*runBlend*blend+Math.cos(phase*2)*.017*blend+land*.11,7);
  ease(body,'y',air?0:Math.sin(phase)*.068*blend,6);
  ease(body,'z',air?0:Math.sin(phase)*.039*blend,6);
  // The head stabilizes against body motion and occasionally glances around when idle.
  nextLook-=dt;if(nextLook<=0){lookTarget=Math.sin(t*1.37)*.17;nextLook=2.2+1.1*(1+Math.sin(t*.73))}
  headLook=damp(headLook,blend?0:lookTarget,1.5,dt);
  ease(head,'x',-body.rotation.x*.46+Math.sin(t*1.7)*.012+land*.06,5.5);
  ease(head,'y',headLook-body.rotation.y*.45+Math.sin(phase)*.014*blend,4.8);
  ease(head,'z',-body.rotation.z*.58+Math.sin(t*.82)*.014,5);
  head.position.y=damp(head.position.y,2.34+Math.sin(t*2.1)*.008,6,dt);
  // Natural blinks, not a repeated mechanical scale jump.
  const blinkPhase=t%4.1,eyeOpen=1-.92*Math.pow(Math.max(0,1-Math.abs(blinkPhase-3.55)/.115),2);
  for(const eye of face.eyes)eye.scale.y=.032*eyeOpen;
  const breathe=1+Math.sin(t*2.05)*.006;
  body.scale.set(breathe,1,1);
 }
 root.scale.setScalar(.64);return {root,body,head,arms,elbows,legs,knees,garment,baseShorts,actualizar};
}
