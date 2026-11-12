import * as T from 'three';
// Barbas V48: rebuilt anatomically articulated character with jointed feet and hands.
// Outfit API retained: body/head/arms/elbows/legs/knees/garment.
export function crearBarbasV4(){
 const root=new T.Group(),body=new T.Group();root.add(body);
 const mat=(c,r=.84)=>new T.MeshStandardMaterial({color:c,roughness:r,side:T.DoubleSide});
 const skin=mat('#e7aa80'),shade=mat('#c98b65'),dark=mat('#1b1b21'),hair=mat('#17161a'),shorts=mat('#202633'),white=mat('#fff9ed'),iris=mat('#32221c');
 const sphere=new T.SphereGeometry(1,20,14);
 const ell=(p,m,x,y,z,sx,sy,sz)=>{const o=new T.Mesh(sphere,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;p.add(o);return o};
 function garment(m,rings,p=body,n=28){const pos=[],idx=[];for(const [y,rx,rz,cz=0] of rings){for(let i=0;i<n;i++){const a=i/n*Math.PI*2;pos.push(Math.sin(a)*rx,y,Math.cos(a)*rz+cz)}}for(let j=0;j<rings.length-1;j++)for(let i=0;i<n;i++){const a=j*n+i,b=j*n+(i+1)%n,c=(j+1)*n+i,d=(j+1)*n+(i+1)%n;idx.push(a,c,b,b,c,d)}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();const o=new T.Mesh(g,m);o.castShadow=true;o.receiveShadow=true;p.add(o);return o}
 // Softly shaped torso, hips and collar.
 garment(skin,[[1.27,.28,.21],[1.37,.33,.235],[1.62,.365,.255],[1.83,.35,.24],[2.04,.235,.18],[2.10,.13,.12]]);
 ell(body,skin,0,1.35,0,.34,.17,.245);
 ell(body,skin,0,2.075,0,.12,.16,.12);
 const head=new T.Group();head.position.set(0,2.34,.025);body.add(head);const face={eyes:[],brows:[]};
 ell(head,skin,0,.01,0,.28,.315,.26);
 for(const side of [-1,1]){ell(head,skin,side*.277,-.015,0,.055,.079,.054);ell(head,white,side*.113,.082,.238,.054,.048,.026);face.eyes.push(ell(head,iris,side*.11,.083,.263,.025,.029,.013));const brow=ell(head,hair,side*.115,.188,.245,.086,.019,.022);brow.rotation.z=side*.1;face.brows.push(brow)}
 ell(head,shade,0,-.025,.255,.062,.068,.07);
 ell(head,dark,0,-.182,.126,.247,.174,.187);
 ell(head,dark,0,-.214,.232,.184,.107,.078);
 for(const side of [-1,1]){ell(head,dark,side*.21,-.125,.137,.058,.138,.1);ell(head,dark,side*.07,-.086,.285,.09,.034,.029)}
 ell(head,skin,0,-.144,.29,.103,.041,.024);
 const arms=[],elbows=[],wrists=[],legs=[],knees=[],feet=[],baseShorts=[];
 for(const side of [-1,1]){
  const arm=new T.Group();arm.position.set(side*.38,1.93,0);body.add(arm);arms.push(arm);
  ell(arm,skin,0,-.035,0,.158,.17,.15);
  garment(skin,[[-.355,.105,.111],[-.27,.126,.128],[-.12,.143,.145],[.035,.145,.146]],arm);
  const elbow=new T.Group();elbow.position.y=-.34;arm.add(elbow);elbows.push(elbow);
  ell(elbow,skin,0,-.01,0,.116,.12,.116);
  garment(skin,[[-.29,.091,.098],[-.21,.112,.115],[-.06,.123,.126],[.055,.114,.117]],elbow);
  const wrist=new T.Group();wrist.position.y=-.29;elbow.add(wrist);wrists.push(wrist);
  ell(wrist,skin,0,-.082,.012,.105,.145,.095);
  ell(wrist,skin,side*.07,-.058,.07,.045,.098,.049);
  for(let f=0;f<3;f++)ell(wrist,skin,(f-1)*.053,-.196,.028,.029,.055,.035);
  const leg=new T.Group();leg.position.set(side*.185,1.35,0);body.add(leg);legs.push(leg);
  ell(leg,skin,0,-.09,0,.214,.2,.207);
  garment(skin,[[-.56,.153,.157],[-.41,.18,.182],[-.20,.207,.207],[.06,.20,.203]],leg);
  baseShorts.push(garment(shorts,[[-.235,.211,.208],[-.15,.223,.218],[.045,.22,.218]],leg));
  const knee=new T.Group();knee.position.y=-.54;leg.add(knee);knees.push(knee);
  ell(knee,skin,0,-.01,.018,.168,.13,.167);
  garment(skin,[[-.38,.113,.12],[-.24,.14,.149],[-.07,.157,.162],[.065,.164,.168]],knee);
  const foot=new T.Group();foot.position.y=-.42;knee.add(foot);feet.push(foot);
  ell(foot,dark,0,-.10,.125,.195,.125,.30);
  ell(foot,dark,0,-.12,.30,.19,.092,.17);
  ell(foot,white,0,-.194,.155,.19,.027,.285);
 }
 // Waist geometry is concealed by equipped clothing.
 const baseWaist=ell(body,shorts,0,1.31,0,.33,.15,.24);
 let t=0,blend=0,runBlend=0,phase=0,landing=0,wasAir=false,look=0,lookGoal=0,lookTimer=0;
 const damp=(v,target,speed,dt)=>T.MathUtils.damp(v,target,speed,dt);
 function actualizar(dt,mode='quieto',state={}){
  dt=Math.min(Math.max(dt,0),.05);t+=dt;
  const air=!!state.aire,run=mode==='correr',speed=Math.max(0,state.velocidad||0),moving=speed>.16&&mode!=='quieto';
  blend=damp(blend,moving?1:0,moving?6.5:9,dt);
  runBlend=damp(runBlend,run?1:0,5,dt);
  // Footstep cycle follows actual travel speed, rather than time alone.
  phase+=dt*(speed*.98+1.0)*Math.max(.13,blend);
  if(wasAir&&!air)landing=1;wasAir=air;landing=damp(landing,0,8,dt);
  const swing=(.52+.27*runBlend)*blend;
  const ease=(o,axis,value,k=11)=>o.rotation[axis]=damp(o.rotation[axis],value,k,dt);
  for(let i=0;i<2;i++){
   const side=i===0?-1:1,cycle=phase+i*Math.PI,step=Math.sin(cycle),recovery=Math.max(0,Math.cos(cycle)),push=Math.max(0,-Math.cos(cycle));
   const thigh=air?(state.subiendo?-.42:.28):step*swing;
   ease(legs[i],'x',thigh,12);
   ease(legs[i],'z',side*(.045+.03*runBlend)*blend,9);
   ease(knees[i],'x',air?.65:recovery*(.88+.3*runBlend)*blend+.14*landing,13);
   // Ankle pitches the toe up during swing and pushes off behind the body.
   ease(feet[i],'x',air?-.14:(-.20*recovery+.29*push)*blend,14);
   ease(feet[i],'z',side*.025*blend,10);
   ease(arms[i],'x',air?-.55:-step*swing*.95,10);
   ease(arms[i],'z',side*(.15+.05*runBlend*blend),9);
   ease(elbows[i],'x',air?-.72:-.20-(.24+.26*runBlend)*blend-recovery*.16*blend,12);
   ease(elbows[i],'z',side*.035,9);
   ease(wrists[i],'x',air?.06:Math.sin(cycle+.45)*.11*blend,9);
   ease(wrists[i],'z',side*.04,8);
  }
  const bob=(Math.cos(phase*2)-1)*.015*blend;
  body.position.y=damp(body.position.y,air?.045:bob-.09*landing+Math.sin(t*2)*.005*(1-blend),11,dt);
  body.position.x=damp(body.position.x,Math.sin(phase)*.024*blend,9,dt);
  ease(body,'x',air?(state.subiendo?-.12:.13):-.045-.07*runBlend*blend+.1*landing,8);
  ease(body,'y',Math.sin(phase)*.07*blend,8);
  ease(body,'z',Math.sin(phase)*.033*blend,8);
  lookTimer-=dt;if(lookTimer<=0){lookGoal=Math.sin(t*.87)*.13;lookTimer=2.5+Math.abs(Math.sin(t))};
  look=damp(look,moving?0:lookGoal,2,dt);
  ease(head,'x',-body.rotation.x*.48+Math.sin(t*1.8)*.01,6);
  ease(head,'y',look-body.rotation.y*.45,6);
  ease(head,'z',-body.rotation.z*.6,6);
  const blink=t%4.35,openness=1-.96*Math.max(0,1-Math.abs(blink-3.7)/.12);
  for(const eye of face.eyes)eye.scale.y=.029*openness;
  body.scale.x=1+Math.sin(t*2.05)*.005;
 }
 root.scale.setScalar(.64);
 return {root,body,head,arms,elbows,wrists,legs,knees,feet,garment,baseShorts,baseWaist,actualizar};
}
