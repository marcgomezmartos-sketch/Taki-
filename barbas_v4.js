// Barbas V4: geometría original del taller, adaptada como personaje del juego.
// No es un GLB ni un rig esquelético; pivotes articulados para correr/caminar.
import * as T from 'three';
export function crearBarbasV4(){
const mat=(c,rough=.98)=>new T.MeshStandardMaterial({color:c,roughness:rough});const pink=mat('#d96c9c'),pinkLight=mat('#ed9abd'),pinkDark=mat('#b74e7d'),skin=mat('#e7a16d'),skinLight=mat('#f0ae7c'),black=mat('#141416'),charcoal=mat('#202024'),pant=mat('#171719'),pant2=mat('#222225'),sole=mat('#111113'),olive=mat('#42453c'),metal=mat('#888d8a',.45),yellow=mat('#d9d632');
// Flat cloth roughness, subtle seams, fewer plastic highlights.
const stitch=mat('#b74a7b'), beardMat=mat('#101012'), beardEdge=mat('#1c1a1a');
const skinShade=mat('#cb845b'), clothShadow=mat('#ad4e7d'), pocketSeam=mat('#303034'), eyeDark=mat('#17181a');
// Matte textile grain: fine, non-repeating fabric noise and soft lighting.
function clothTexture(base,shadow){const cv=document.createElement('canvas');cv.width=cv.height=256;const ctx=cv.getContext('2d');ctx.fillStyle=base;ctx.fillRect(0,0,256,256);let seed=413;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};for(let i=0;i<15000;i++){let v=rand();ctx.fillStyle=v>.55?'rgba(255,255,255,.035)':'rgba(20,10,18,.035)';ctx.fillRect(rand()*256,rand()*256,1,1.5)}for(let i=0;i<200;i++){ctx.strokeStyle='rgba(255,255,255,.028)';ctx.beginPath();let x=rand()*256,y=rand()*256;ctx.moveTo(x,y);ctx.lineTo(x+rand()*3,y+rand()*6);ctx.stroke()}const t=new T.CanvasTexture(cv);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(2,2);t.colorSpace=T.SRGBColorSpace;return t}
for(const m of [pink,pinkLight,pinkDark]){m.map=clothTexture('#ffffff');m.roughness=1;m.needsUpdate=true}
for(const m of [pant,pant2]){m.map=clothTexture('#eeeeee');m.roughness=1;m.needsUpdate=true}
const root=new T.Group();const body=new T.Group();root.add(body);
function mesh(g,m,parent=body,x=0,y=0,z=0){let o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
function ell(m,p,s,parent=body){const o=mesh(new T.SphereGeometry(1,32,22),m,parent,...p);o.scale.set(...s);return o}
function box(m,p,s,parent=body,r=.03){const o=mesh(new T.BoxGeometry(...s),m,parent,...p);return o}
function cyl(m,a,b,r1,r2,parent=body){let v=new T.Vector3(...b).sub(new T.Vector3(...a));const o=mesh(new T.CylinderGeometry(r2,r1,v.length(),16),m,parent,...new T.Vector3(...a).addScaledVector(v,.5).toArray());o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());return o}
function curve(m,points,r=.016,parent=body){return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),32,r,7,false),m,parent)}
// Tailored jacket body: rounded polygonal cross-sections rather than inflated spheres.
function garment(m,rings,parent=body,n=16){
 const verts=[],inds=[];
 for(const [y,rx,rz,cz=0] of rings)for(let i=0;i<n;i++){
  const a=i/n*Math.PI*2;verts.push(Math.sin(a)*rx,y,Math.cos(a)*rz+cz);
 }
 for(let j=0;j<rings.length-1;j++)for(let i=0;i<n;i++){
  let a=j*n+i,b=j*n+(i+1)%n,c=(j+1)*n+i,d=(j+1)*n+(i+1)%n;
  inds.push(a,b,c,b,d,c);
 }
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(verts,3));g.setIndex(inds);g.computeVertexNormals();return mesh(g,m,parent);
}
function line(m,pts,r=.007,parent=body){return curve(m,pts,r,parent)}
garment(pink,[[1.27,.33,.22],[1.38,.345,.235],[1.43,.365,.245],[1.57,.39,.255],[1.78,.395,.25],[1.97,.35,.23],[2.06,.28,.20]],body,28);
garment(pinkDark,[[1.355,.36,.248],[1.415,.38,.255]]);
// Continuous waist and hip shells cover the moving leg pivots; no white gap during running.
ell(pant,[0,1.37,-.012],[.375,.19,.248]);
ell(pink,[0,1.49,-.005],[.34,.10,.235]);
// Underarm panels remain attached to the torso when the arms swing.
for(const side of [-1,1]){
 const joint=ell(pink,[side*.366,1.91,-.006],[.115,.145,.145]);joint.rotation.z=side*.16;
}
// Hood behind the neck, with distinct opening and soft folded fabric
const hood=ell(pink,[0,2.02,-.22],[.39,.23,.22]);
ell(pinkDark,[0,2.10,-.115],[.25,.12,.13]);
for(const side of [-1,1]){
 line(stitch,[[side*.35,1.43,.14],[side*.38,1.49,.16],[side*.40,1.57,.17]],.006);
 line(pinkDark,[[side*.16,1.99,.22],[side*.18,1.92,.28],[side*.19,1.84,.28]],.008);
}
// Neck and skull: keep original game-like proportions, but use subtler facial features
cyl(skin,[0,1.99,.02],[0,2.19,.02],.12,.115);
const head=new T.Group();head.position.set(0,2.34,.035);body.add(head);
ell(skin,[0,.06,0],[.293,.333,.258],head);
ell(skin,[-.308,-.025,.015],[.049,.082,.055],head);
ell(skin,[.308,-.025,.015],[.049,.082,.055],head);
// Beard: one continuous silhouette instead of detached spherical blobs.
// Shape extruded in the XY plane; front is toward positive Z.
function beardShape(){
 const shape=new T.Shape();shape.moveTo(-.263,.016);shape.bezierCurveTo(-.276,-.09,-.27,-.22,-.18,-.294);
 shape.quadraticCurveTo(0,-.38,.18,-.294);shape.bezierCurveTo(.27,-.22,.276,-.09,.263,.016);
 shape.lineTo(.215,-.045);shape.quadraticCurveTo(.17,-.105,.105,-.12);
 shape.quadraticCurveTo(0,-.143,-.105,-.12);shape.quadraticCurveTo(-.17,-.105,-.215,-.045);shape.closePath();
 return shape;
}
const bg=new T.ExtrudeGeometry(beardShape(),{depth:.045,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.026,bevelThickness:.021,curveSegments:14});
mesh(bg,beardMat,head,0,0,.244);
// Side beard blending toward ears, subtle jaw volume
for(const side of [-1,1]){
 const cheek=ell(beardMat,[side*.219,-.135,.136],[.045,.14,.095],head);
 cheek.rotation.z=side*.12;
}
// Mouth opening and moustache blended with beard
ell(skin,[0,-.13,.29],[.115,.045,.03],head);
for(const side of [-1,1]){
 const m=ell(beardMat,[side*.074,-.104,.315],[.092,.034,.037],head);m.rotation.z=side*.13;
}
ell(skin,[0,-.035,.252],[.046,.058,.043],head);
// Subtle nose bridge, cheek planes and under-eye skin to reduce the toy-like appearance.
ell(skinShade,[0,-.086,.297],[.065,.018,.016],head);
for(const side of [-1,1]){
 const cheek=ell(skin,[side*.218,-.005,.207],[.083,.069,.045],head);cheek.rotation.z=side*.18;
 const eyelid=ell(skin,[side*.136,.184,.253],[.085,.023,.032],head);eyelid.rotation.z=-side*.06;
}
// Eyes slightly smaller, eyelids and eyebrows shaped rather than oval toy parts
const white=mat('#fff9f3'),iris=mat('#241f1d');
for(const side of [-1,1]){
 ell(white,[side*.135,.12,.245],[.054,.055,.025],head);
 ell(iris,[side*.13,.114,.275],[.027,.033,.013],head);
 ell(mat('#ffffff'),[side*.113,.137,.291],[.009,.011,.006],head);
 const brow=ell(beardMat,[side*.135,.25,.245],[.098,.019,.023],head);brow.rotation.z=side*.17;
}
// Sleeves: tapered, cloth-shaped arms, cuff seams, small creases.
const arms=[],elbows=[];
for(const side of [-1,1]){
 const pivot=new T.Group();pivot.position.set(side*.392,1.96,0);body.add(pivot);arms.push(pivot);
 const sleeve=new T.Group();pivot.add(sleeve);sleeve.position.x=side*.065;
 // Rounded upper-arm shoulder insert, always overlapping the jacket and sleeve.
 ell(pink,[0,-.06,-.006],[.145,.16,.145],sleeve);
 garment(pink,[[-.56,.117,.115],[-.49,.132,.13],[-.36,.142,.145],[-.19,.154,.153],[-.04,.16,.16],[.035,.135,.14]],sleeve,24);
 garment(pinkDark,[[-.585,.13,.13],[-.545,.147,.147]],sleeve);
 // Articulated forearm, anchored at the elbow. The overlap hides the hinge.
 const elbow=new T.Group();elbow.position.set(0,-.315,0);sleeve.add(elbow);elbows.push(elbow);
 ell(pink,[0,-.015,0],[.14,.16,.143],elbow);
 garment(pink,[[ -.275,.124,.125],[-.22,.135,.137],[-.10,.145,.144],[.025,.145,.145]],elbow,24);
 ell(skin,[0,-.31,.005],[.08,.098,.078],elbow);
 // Cuff rim and forearm fabric fold.
 ell(pinkDark,[0,-.235,.005],[.135,.035,.133],elbow);
 line(pinkLight,[[-.10,-.12,.152],[0,-.15,.178],[.10,-.11,.15]],.006,elbow);
 line(stitch,[[side*.155,-.36,.07],[side*.16,-.39,.10],[side*.15,-.43,.12]],.007,sleeve);
 line(pinkLight,[[side*.15,-.17,.07],[side*.17,-.20,.11]],.009,sleeve);
 if(side===1){
   // High contrast sleeve compass badge, on the outer face of the RIGHT upper arm.
   const patchCanvas=document.createElement('canvas');patchCanvas.width=512;patchCanvas.height=512;
   const c=patchCanvas.getContext('2d');
   c.fillStyle='#141719';c.fillRect(0,0,512,512);
   c.strokeStyle='#d5c83a';c.lineWidth=13;c.beginPath();c.arc(256,256,145,0,Math.PI*2);c.stroke();
   c.lineWidth=10;c.beginPath();c.moveTo(256,66);c.lineTo(256,446);c.moveTo(66,256);c.lineTo(446,256);c.stroke();
   c.beginPath();c.moveTo(256,106);c.lineTo(285,226);c.lineTo(406,256);c.lineTo(285,285);c.lineTo(256,406);c.lineTo(227,285);c.lineTo(106,256);c.lineTo(227,227);c.closePath();c.stroke();
   c.beginPath();c.arc(256,256,31,0,Math.PI*2);c.fillStyle='#d5c83a';c.fill();
   const texture=new T.CanvasTexture(patchCanvas);texture.colorSpace=T.SRGBColorSpace;
   const pm=new T.MeshStandardMaterial({map:texture,roughness:1,side:T.DoubleSide});
   const badgeBack=box(beardMat,[.204,-.20,0],[.018,.248,.236],sleeve);
   const patch=mesh(new T.PlaneGeometry(.219,.229),pm,sleeve,.216,-.20,.002);
   patch.rotation.y=Math.PI/2;
   for(const z of [-.124,.124])line(charcoal,[[.217,-.31,z],[.217,-.09,z]],.005,sleeve);

 }
}
// Loose cargo trousers with straighter fabric silhouette and layered utility pockets
const legs=[],knees=[];
for(const side of [-1,1]){
 const pivot=new T.Group();pivot.position.set(side*.207,1.40,0);body.add(pivot);legs.push(pivot);
 garment(pant,[[-.61,.228,.215],[-.55,.23,.213],[-.40,.226,.21],[-.18,.218,.205],[.02,.205,.195]],pivot,28);
 // Lower leg is a separate pivot so the knee can flex while running.
 const knee=new T.Group();knee.position.y=-.56;pivot.add(knee);knees.push(knee);
 garment(pant,[[-.50,.20,.20],[-.42,.215,.205],[-.25,.225,.21],[-.02,.23,.215]],knee,24);
 garment(pant2,[[-.49,.20,.20],[-.42,.215,.205]],knee);
 // pocket flap and hanging pocket on outer thigh
 const pocket=box(pant2,[side*.245,-.49,.035],[.115,.26,.255],pivot);
 // Cargo pocket edges and top flap
 box(charcoal,[side*.30,-.372,.035],[.03,.058,.277],pivot);
 line(pocketSeam,[[side*.315,-.41,-.11],[side*.315,-.61,-.11]],.005,pivot);
 box(charcoal,[side*.31,-.39,.037],[.022,.06,.268],pivot);
 line(charcoal,[[side*.235,-.53,.18],[side*.235,-.66,.18]],.008,pivot);
 // Natural folds at ankle
 for(let i=0;i<3;i++)line(charcoal,[[-.16,-.33+i*.06,.205],[0,-.345+i*.06,.216],[.16,-.32+i*.06,.205]],.006,knee);
 // Proper sneaker with toe, sole and laces
 ell(sole,[0,-.565,.095],[.203,.079,.28],knee);
 ell(charcoal,[0,-.53,.19],[.189,.075,.205],knee);
 for(let i=0;i<4;i++)line(metal,[[-.09,-.475,.30-i*.035],[.09,-.475,.30-i*.035]],.004,knee);
}
// Tailored textile details: sleeve wrinkles, side seams, hems and cargo folds.
for(const side of [-1,1]){
 line(stitch,[[side*.32,1.41,.14],[side*.34,1.52,.16],[side*.36,1.65,.14]],.005);
 line(pinkLight,[[side*.18,1.48,.222],[side*.27,1.50,.215],[side*.33,1.46,.17]],.006);
 line(clothShadow,[[side*.23,1.73,.233],[side*.30,1.70,.207],[side*.37,1.75,.15]],.005);
 line(stitch,[[side*.26,1.39,.18],[side*.17,1.37,.229],[0,1.37,.238]],.005);
}
// Front pocket seams on hoodie, shaped as diagonals rather than flat rectangles.
for(const side of [-1,1]){
 line(stitch,[[side*.12,1.55,.255],[side*.19,1.62,.24],[side*.29,1.62,.19]],.008);
 line(pinkLight,[[side*.13,1.56,.264],[side*.19,1.625,.248]],.004);
}
// Subtle jaw and beard definition; avoids shiny disconnected beard spheres.
for(const side of [-1,1]){
 line(beardEdge,[[side*.21,-.06,.218],[side*.225,-.16,.224],[side*.15,-.29,.24]],.008,head);
 line(skinShade,[[side*.055,-.16,.318],[side*.015,-.165,.317]],.004,head);
}
// Zip, cords, seams, strap and structured pouch
line(charcoal,[[0,1.41,.258],[0,1.72,.287],[0,1.98,.245]],.009);
for(const side of [-1,1])line(charcoal,[[side*.12,2.03,.21],[side*.125,1.85,.28]],.008);
line(olive,[[-.30,2.01,.24],[-.15,1.84,.295],[.02,1.65,.316],[.26,1.46,.25]],.033);
const pouch=box(olive,[.25,1.52,.33],[.21,.235,.105]);
box(charcoal,[.25,1.395,.39],[.26,.027,.115]);
box(charcoal,[.25,1.58,.389],[.21,.015,.009]);

let tiempo=0,blend=0,lean=0,hop=0;
function actualizar(dt,modo='quieto',estado={}){
 dt=Math.min(dt,.05);tiempo+=dt;
 const correr=modo==='correr',caminar=modo==='caminar'||correr;
 const aire=!!estado.aire,subiendo=!!estado.subiendo;
 const objetivo=caminar?1:0;
 blend=T.MathUtils.damp(blend,objetivo,caminar?8:6,dt);
 const f=correr?11.8:7.3;
 const fase=tiempo*f;
 const a=(correr?.64:.36)*blend;
 // Opposite arm / leg motion. Forearms bend independently at the elbow.
 for(let i=0;i<2;i++){
  const p=fase+i*Math.PI;
  const pierna=Math.sin(p)*a;
  const brazo=-Math.sin(p)*a*(correr?1.2:1.05);
  const lado=i===0?-1:1;
  legs[i].rotation.x=T.MathUtils.damp(legs[i].rotation.x,aire?(subiendo?-.23:.16):pierna,11,dt);
  legs[i].rotation.z=T.MathUtils.damp(legs[i].rotation.z,aire?lado*.09:lado*.025*blend,9,dt);
  if(knees[i])knees[i].rotation.x=T.MathUtils.damp(knees[i].rotation.x,aire?(subiendo?.45:.22):Math.max(0,-Math.sin(p))*(correr?.65:.28)*blend,10,dt);
  arms[i].rotation.x=T.MathUtils.damp(arms[i].rotation.x,aire?(subiendo?-.8:-.35):brazo,12,dt);
  arms[i].rotation.z=T.MathUtils.damp(arms[i].rotation.z,aire?lado*.25:lado*(correr?.23:.13),9,dt);
  arms[i].rotation.y=T.MathUtils.damp(arms[i].rotation.y,aire?lado*.1:lado*.07*blend,8,dt);
  if(elbows[i])elbows[i].rotation.x=T.MathUtils.damp(elbows[i].rotation.x,aire?-.7:(correr?-.8:-.25)*blend,12,dt);
 }
 const targetLean=aire?(subiendo?-.12:.08):caminar?(correr?-.16:-.07):0;
 lean=T.MathUtils.damp(lean,targetLean,6,dt);
 body.rotation.x=lean;
 body.rotation.z=caminar&&!aire?Math.sin(fase)*.018*blend:0;
 body.position.y=aire?0:Math.abs(Math.sin(fase))*(correr?.042:.019)*blend;
 head.rotation.x=T.MathUtils.damp(head.rotation.x,-lean*.35,7,dt);
 head.rotation.y=Math.sin(tiempo*1.2)*.012;
}
// El personaje del taller mide aproximadamente 2.9 unidades; lo escalamos a 1.9.
root.scale.setScalar(.64);
return {root,actualizar};
}
