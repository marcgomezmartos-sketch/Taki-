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
 const head=new T.Group();head.position.set(0,2.34,.02);body.add(head);
 ell(head,skin,0,.02,0,.29,.315,.265);
 for(const side of [-1,1]){ell(head,skin,side*.286,-.02,.01,.055,.082,.055);ell(head,white,side*.115,.09,.247,.052,.054,.026);ell(head,iris,side*.112,.09,.274,.027,.032,.012);const brow=ell(head,hair,side*.115,.203,.251,.088,.018,.018);brow.rotation.z=side*.12}
 ell(head,shade,0,-.035,.266,.065,.073,.061);
 // Signature full beard stays on every avatar and follows head movement.
 ell(head,dark,0,-.187,.124,.256,.174,.19);
 ell(head,dark,0,-.22,.235,.19,.11,.083);
 for(const side of [-1,1]){ell(head,dark,side*.215,-.123,.14,.055,.145,.105);ell(head,dark,side*.073,-.09,.29,.093,.038,.033)}
 ell(head,skin,0,-.145,.29,.105,.043,.024);
 ell(head,hair,0,.292,-.025,.285,.058,.23);
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
 let t=0,blend=0;
 function actualizar(dt,mode='quieto',state={}){dt=Math.min(dt,.05);t+=dt;const moving=mode==='caminar'||mode==='correr',running=mode==='correr';blend=T.MathUtils.damp(blend,moving?1:0,8,dt);const phase=t*(running?11:7),a=(running?.62:.37)*blend;for(let i=0;i<2;i++){const p=Math.sin(phase+i*Math.PI)*a;legs[i].rotation.x=T.MathUtils.damp(legs[i].rotation.x,state.aire?-.18:p,10,dt);arms[i].rotation.x=T.MathUtils.damp(arms[i].rotation.x,state.aire?-.3:-p*.9,10,dt);knees[i].rotation.x=T.MathUtils.damp(knees[i].rotation.x,Math.max(0,-Math.sin(phase+i*Math.PI))*.28*blend,10,dt);elbows[i].rotation.x=T.MathUtils.damp(elbows[i].rotation.x,-.18-.22*blend,10,dt)}body.position.y=state.aire?0:Math.abs(Math.sin(phase))*.022*blend;body.rotation.x=T.MathUtils.damp(body.rotation.x,moving?-.055:0,6,dt);head.rotation.y=Math.sin(t)*.012}
 root.scale.setScalar(.64);return {root,body,head,arms,elbows,legs,knees,garment,baseShorts,actualizar};
}
