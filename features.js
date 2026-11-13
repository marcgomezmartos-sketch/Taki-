import * as T from 'three';
export function iniciarExtras({player,model,head,rig,showStatus}){
 const inventory=[{"id":"capBlack","name":"Gorra urbana negra","kind":"cap","price":1250,"color":"#171a22","emoji":"🧢","design":"classic"},{"id":"capRed","name":"Gorra roja","kind":"cap","price":1450,"color":"#bf3548","emoji":"🧢","design":"classic"},{"id":"jacketBlue","name":"Chaqueta azul","kind":"jacket","price":3900,"color":"#3569a5","emoji":"🧥","design":"bomber"},{"id":"jacketGreen","name":"Chaqueta verde","kind":"jacket","price":4900,"color":"#4d7858","emoji":"🧥","design":"utility"},{"id":"pantsBeige","name":"Pantalón beige","kind":"pants","price":2800,"color":"#b6a18b","emoji":"👖","design":"cargo"},{"id":"pantsGrey","name":"Pantalón gris","kind":"pants","price":3100,"color":"#777d8a","emoji":"👖","design":"tailored"},{"id":"shoesWhite","name":"Zapatillas blancas","kind":"shoes","price":2400,"color":"#eeeeea","emoji":"👟","design":"runner"},{"id":"capVarsity","name":"Gorra varsity bordada","kind":"cap","price":2100,"color":"#17394d","emoji":"🧢","design":"varsity"},{"id":"capTrucker","name":"Gorra trucker vintage","kind":"cap","price":1950,"color":"#ddc9a7","emoji":"🧢","design":"trucker"},{"id":"capFive","name":"Gorra five-panel gráfica","kind":"cap","price":2400,"color":"#cf754b","emoji":"🧢","design":"five"},{"id":"bucketSafari","name":"Bucket safari","kind":"cap","price":2900,"color":"#9b9772","emoji":"👒","design":"bucket"},{"id":"bucketDenim","name":"Bucket denim bordado","kind":"cap","price":3400,"color":"#41627f","emoji":"👒","design":"bucket"},{"id":"beanieRib","name":"Gorro de punto canalé","kind":"cap","price":2600,"color":"#ab5674","emoji":"🧶","design":"beanie"},{"id":"beanieStar","name":"Gorro estrella","kind":"cap","price":3200,"color":"#27234e","emoji":"⭐","design":"beanie"},{"id":"visorSport","name":"Visera deportiva","kind":"cap","price":1800,"color":"#f5ede5","emoji":"🧢","design":"visor"},{"id":"teeGraphic","name":"Camiseta gráfico retro","kind":"jacket","price":3300,"color":"#e9d5a3","emoji":"👕","design":"graphic"},{"id":"teeSkate","name":"Camiseta skate oversized","kind":"jacket","price":3900,"color":"#252b39","emoji":"👕","design":"skate"},{"id":"teeStripe","name":"Camiseta rayas marineras","kind":"jacket","price":3500,"color":"#e5e4d9","emoji":"👕","design":"stripe"},{"id":"poloClub","name":"Polo club bordado","kind":"jacket","price":4800,"color":"#1f5a51","emoji":"👕","design":"polo"},{"id":"topRib","name":"Top canalé corto","kind":"jacket","price":3900,"color":"#f2b4bc","emoji":"🎀","design":"crop"},{"id":"topHalter","name":"Top halter satinado","kind":"jacket","price":5900,"color":"#654a8e","emoji":"🎀","design":"halter"},{"id":"topCorset","name":"Top corsé de diseño","kind":"jacket","price":7500,"color":"#cf607e","emoji":"🎀","design":"corset"},{"id":"topSport","name":"Top deportivo técnico","kind":"jacket","price":4600,"color":"#8bcee0","emoji":"🎽","design":"sport"},{"id":"blouseBow","name":"Blusa con lazo","kind":"jacket","price":6200,"color":"#f4e8d8","emoji":"👚","design":"blouse"},{"id":"hoodieCloud","name":"Sudadera nube bordada","kind":"jacket","price":7200,"color":"#b2d7e4","emoji":"🧥","design":"hoodie"},{"id":"hoodiePatch","name":"Sudadera parche de manga","kind":"jacket","price":8900,"color":"#343a46","emoji":"🧥","design":"patch"},{"id":"jacketVarsity","name":"Chaqueta universitaria","kind":"jacket","price":10900,"color":"#8e3b51","emoji":"🧥","design":"varsity"},{"id":"jacketLeather","name":"Cazadora biker","kind":"jacket","price":13500,"color":"#242129","emoji":"🧥","design":"leather"},{"id":"jacketDenim","name":"Chaqueta vaquera","kind":"jacket","price":9800,"color":"#4579a4","emoji":"🧥","design":"denim"},{"id":"cardiganPearl","name":"Cárdigan perla","kind":"jacket","price":8400,"color":"#ead9c6","emoji":"🧶","design":"cardigan"},{"id":"shortDenim","name":"Short vaquero desgastado","kind":"pants","price":4900,"color":"#6596bd","emoji":"🩳","design":"denimshort"},{"id":"shortCargo","name":"Bermuda cargo","kind":"pants","price":5900,"color":"#838a65","emoji":"🩳","design":"cargoShort"},{"id":"shortSport","name":"Short running","kind":"pants","price":3200,"color":"#323f62","emoji":"🩳","design":"sportShort"},{"id":"shortPleat","name":"Short sastre plisado","kind":"pants","price":6500,"color":"#cbbba4","emoji":"🩳","design":"tailoredShort"},{"id":"skirtPleat","name":"Falda plisada college","kind":"pants","price":6900,"color":"#495e81","emoji":"👗","design":"pleated"},{"id":"skirtDenim","name":"Minifalda vaquera","kind":"pants","price":5900,"color":"#48799c","emoji":"👗","design":"denimskirt"},{"id":"skirtFloral","name":"Falda floral vuelo","kind":"pants","price":7900,"color":"#d885a6","emoji":"🌸","design":"floral"},{"id":"skirtSatin","name":"Falda satinada midi","kind":"pants","price":9900,"color":"#b78d9c","emoji":"👗","design":"midi"},{"id":"pantsWide","name":"Pantalón wide-leg","kind":"pants","price":8900,"color":"#d4b99b","emoji":"👖","design":"wide"},{"id":"pantsTech","name":"Cargo técnico","kind":"pants","price":9900,"color":"#313c40","emoji":"👖","design":"tech"},{"id":"pantsFlare","name":"Pantalón flare","kind":"pants","price":8500,"color":"#684d72","emoji":"👖","design":"flare"},{"id":"jeansPatch","name":"Jeans parches bordados","kind":"pants","price":9300,"color":"#416a9c","emoji":"👖","design":"patch"},{"id":"dressSummer","name":"Vestido verano floral","kind":"dress","price":12900,"color":"#f0bd9b","emoji":"👗","design":"summer"},{"id":"dressParty","name":"Vestido fiesta brillante","kind":"dress","price":24900,"color":"#6544a8","emoji":"✨","design":"party"},{"id":"dressDenim","name":"Vestido denim botones","kind":"dress","price":14500,"color":"#467ca8","emoji":"👗","design":"denim"},{"id":"dressRibbon","name":"Vestido lazos pastel","kind":"dress","price":18900,"color":"#e5a2c0","emoji":"🎀","design":"ribbon"},{"id":"dressElegant","name":"Vestido noche elegante","kind":"dress","price":32000,"color":"#20243c","emoji":"👗","design":"evening"},{"id":"dressGarden","name":"Vestido jardín romántico","kind":"dress","price":15900,"color":"#b5d3a1","emoji":"🌷","design":"garden"},{"id":"shoesRetro","name":"Bambas retro 90s","kind":"shoes","price":7500,"color":"#f0d9b0","emoji":"👟","design":"retro"},{"id":"shoesHigh","name":"Bambas caña alta","kind":"shoes","price":8900,"color":"#bb4c52","emoji":"👟","design":"high"},{"id":"shoesChunky","name":"Bambas chunky","kind":"shoes","price":11500,"color":"#e4e1d8","emoji":"👟","design":"chunky"},{"id":"shoesSkate","name":"Bambas skate","kind":"shoes","price":8200,"color":"#353b4e","emoji":"👟","design":"skate"},{"id":"shoesNeon","name":"Bambas runner neón","kind":"shoes","price":13900,"color":"#80e1d4","emoji":"👟","design":"neon"},{"id":"shoesCanvas","name":"Zapatillas lona clásica","kind":"shoes","price":4500,"color":"#d1b1bf","emoji":"👟","design":"canvas"},{"id":"shoesMary","name":"Merceditas con hebilla","kind":"shoes","price":6900,"color":"#482e40","emoji":"👞","design":"mary"},{"id":"shoesBoot","name":"Botines de plataforma","kind":"shoes","price":12500,"color":"#3b3034","emoji":"🥾","design":"boots"},{"id":"shoesBallet","name":"Bailarinas con lazo","kind":"shoes","price":5500,"color":"#e9b8bc","emoji":"🥿","design":"ballet"}];
 // Premium boutique collection and bag department.
 inventory.unshift(
  {id:'crtzWidePants',name:'Corteiz · pantalón ancho',kind:'pants',price:12500,color:'#33393b',emoji:'👖',design:'crtzWide',section:'exclusive'},
  {id:'stonePinkHoodie',name:'Stone Island · sudadera rosa',kind:'jacket',price:16900,color:'#dba5b9',emoji:'🧥',design:'stonePink',section:'exclusive'},
  {id:'goyardGreyBag',name:'Goyard · bolso gris',kind:'bag',price:21500,color:'#6c7175',emoji:'👜',design:'goyardGrey',section:'bags'}
 );
 const STARTER_TOP='starterRagTop',STARTER_SHORTS='starterRagShorts';
 inventory.unshift(
  {id:STARTER_TOP,name:'Camiseta vieja rota',kind:'jacket',price:0,color:'#9d9484',emoji:'👕',design:'ragged'},
  {id:STARTER_SHORTS,name:'Pantalones cortos rotos',kind:'pants',price:0,color:'#716a5e',emoji:'🩳',design:'raggedShort'}
 );
 const key='barbas-party-economy-v1';
 let saved={};
 let coins=Number.isFinite(saved.coins)?saved.coins:0,owned=new Set(Array.isArray(saved.owned)?saved.owned:[]),equipped=saved.equipped||{};
 let avatarStyle='';let cloudReady=false;let cloudSaveChain=Promise.resolve();const save=()=>{const data={coins,owned:[...owned],equipped,avatarStyle};if(cloudReady&&window.barbasAccount?.save){cloudSaveChain=cloudSaveChain.catch(()=>{}).then(()=>window.barbasAccount.save(data)).catch(e=>{showStatus('Error guardando partida: '+(e.code||e.message))})}};
 const style=document.createElement('style');style.textContent=`
 #coinsHud{position:fixed;top:75px;left:14px;z-index:6;background:#201b39d9;border:1px solid #ffe19a66;border-radius:12px;padding:8px 12px;font-weight:900;color:#ffe38a}
 #shopButton,#audioButton{position:fixed;z-index:7;right:12px;display:none;font-size:13px;padding:10px 12px;border-radius:12px}
 #shopButton{top:65px}#audioButton{top:115px}#wardrobeButton{position:fixed;right:12px;top:66px;z-index:7;display:none;padding:11px 14px;border-radius:16px;background:linear-gradient(120deg,#d9f9ff,#8ed4f0);color:#153448;font-weight:900;font-size:13px;box-shadow:0 5px 19px #173e5666;border:1px solid #ffffffc7}
 #shopOverlay{position:fixed;inset:0;z-index:15;display:none;flex-direction:column;align-items:center;background:#17162bea;overflow:auto;padding:22px 12px 120px;touch-action:pan-y}
 #shopOverlay h2{margin:5px 0;color:#ffdb73;font-size:29px}#shopOverlay .shopGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;width:min(640px,100%);margin:14px auto}
 #shopOverlay .product{background:#302b4c;border:1px solid #ffffff29;border-radius:15px;padding:13px 8px;display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center}
 #shopOverlay .product .emoji{font-size:37px}#shopOverlay .product button{font-size:12px;padding:10px;width:100%}#shopOverlay .product small{color:#fce2a1}
 #shopOverlay .shopHead{display:flex;justify-content:space-between;align-items:center;gap:12px;width:min(640px,100%)}

 #shopOverlay{background:linear-gradient(145deg,#1b1534f5,#29203ff7);padding-top:14px}
 #shopOverlay .shopHead{position:sticky;top:0;z-index:3;background:#211a39f5;padding:8px;border-radius:16px}
 #shopOverlay .shopGrid{width:min(880px,100%);grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}
 #shopOverlay .product{background:linear-gradient(145deg,#39314f,#252039);border:1px solid #d9bb8455;padding:10px;gap:7px}
 #shopOverlay .product b{font-size:13px;min-height:32px}
 #shopOverlay .product small{font-size:14px;font-weight:900;color:#ffdb79}
 #shopFilters{display:flex;flex-wrap:nowrap;gap:7px;width:min(880px,100%);overflow-x:auto;scrollbar-width:thin;touch-action:pan-x;padding:9px 2px}
 #shopFilters button{flex-shrink:0;padding:10px 12px;border-radius:30px;font-size:11px;background:#433753;color:#fff}
 #shopFilters button.selected{background:#ffdc75;color:#281b36}
 .productArt{height:126px;width:100%;border-radius:12px;background:radial-gradient(circle at 50% 20%,#e3d4d6,#97869c 68%,#66546f);display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative}
 .garmentIcon{position:relative;background:var(--fabric);width:72px;height:82px;clip-path:polygon(25% 0,75% 0,100% 18%,86% 40%,77% 35%,77% 100%,23% 100%,23% 35%,14% 40%,0 18%);box-shadow:inset 0 0 18px #0003}
 .garmentTrim{position:absolute;inset:0;background:transparent}
 .productArt.cap .garmentIcon{width:88px;height:48px;border-radius:55% 55% 10% 10%;clip-path:none;transform:translateY(-8px)}
 .productArt.cap .garmentIcon:after{content:"";position:absolute;left:30%;right:-30%;bottom:-8px;height:14px;border-radius:50%;background:var(--fabric)}
 .productArt.cap.bucket .garmentIcon,.productArt.cap.beanie .garmentIcon{border-radius:45% 45% 18% 18%;height:57px}
 .productArt.cap.bucket .garmentIcon:after{left:-25%;right:-25%;bottom:0}
 .productArt.pants .garmentIcon{clip-path:polygon(8% 0,92% 0,100% 100%,55% 100%,50% 40%,45% 100%,0 100%);height:88px;width:77px}
 .productArt.pants.pleated .garmentIcon,.productArt.pants.floral .garmentIcon,.productArt.pants.denimskirt .garmentIcon,.productArt.pants.midi .garmentIcon{clip-path:polygon(24% 0,76% 0,100% 100%,0 100%);width:96px}
 .productArt.dress .garmentIcon{clip-path:polygon(31% 0,69% 0,84% 16%,70% 42%,100% 100%,0 100%,30% 42%,16% 16%);height:108px;width:99px}
 .productArt.shoes .garmentIcon{width:105px;height:49px;clip-path:polygon(0 50%,35% 28%,51% 0,76% 0,83% 43%,100% 66%,100% 100%,0 100%);border-bottom:8px solid #fff}
 .productArt.stripe .garmentTrim{background:repeating-linear-gradient(0deg,transparent 0 13px,#264a76 13px 20px)}
 .productArt.graphic .garmentTrim,.productArt.skate .garmentTrim{background:radial-gradient(circle at 50% 48%,#ffe2a9 0 14px,transparent 15px)}
 .productArt.varsity .garmentTrim{background:linear-gradient(90deg,#f0e1b8 0 17%,transparent 17% 83%,#f0e1b8 83%)}
 .productArt.floral .garmentTrim,.productArt.summer .garmentTrim,.productArt.garden .garmentTrim{background:radial-gradient(circle at 27% 40%,#fff2c5 0 5px,transparent 6px),radial-gradient(circle at 73% 72%,#fff2c5 0 5px,transparent 6px),radial-gradient(circle at 70% 22%,#f6d1dc 0 6px,transparent 7px)}
 .productArt.patch .garmentTrim,.productArt.denim .garmentTrim{background:linear-gradient(90deg,transparent 44%,#ffffff66 45% 47%,transparent 48%)}
 .productArt.party .garmentTrim,.productArt.evening .garmentTrim{background:radial-gradient(circle at 50% 20%,#fff8b5 0 3px,transparent 4px),radial-gradient(circle at 35% 63%,#fff8b5 0 3px,transparent 4px)}
 .productArt.ribbon .garmentTrim,.productArt.blouse .garmentTrim{background:radial-gradient(ellipse at 50% 27%,#fff2e6 0 13px,transparent 14px)}
 @media(min-width:680px){#shopOverlay .shopGrid{grid-template-columns:repeat(4,minmax(0,1fr))}}
 `;document.head.append(style);
 const hud=document.createElement('div');hud.id='coinsHud';document.body.append(hud);
 const shopButton=document.createElement('button');shopButton.id='shopButton';shopButton.textContent='🛍️ TIENDA';document.body.append(shopButton);
 const wardrobeButton=document.createElement('button');wardrobeButton.id='wardrobeButton';wardrobeButton.textContent='👕 VESTUARIO';document.body.append(wardrobeButton);
 const audioButton=document.createElement('button');audioButton.id='audioButton';audioButton.textContent='♫ Música: ON';document.body.append(audioButton);
 const overlay=document.createElement('section');overlay.id='shopOverlay';overlay.innerHTML='<div class="shopHead"><h2>🛍️ TK SHOP · PROBADOR</h2><button id="closeShop">✕ VOLVER A LA TIENDA</button></div><p>Prenda seleccionada del expositor.</p><strong id="shopBalance"></strong><div class="shopGrid"></div>';document.body.append(overlay);
 const updateHud=()=>{hud.textContent='🪙 '+coins+' monedas';overlay.querySelector('#shopBalance').textContent='Saldo: '+coins+' 🪙'};
 // Avatar selection is purely visual; every clothing category is unisex.
 const stylePanel=document.createElement('div');stylePanel.id='avatarStylePanel';
 stylePanel.innerHTML='<div class="avatarStyleCard"><small>BARBAS · TU PERSONAJE</small><h2>¿Qué personaje quieres?</h2><p>Elige el aspecto que prefieras. Toda la ropa es para los dos personajes y podrás cambiar cuando quieras.</p><div class="avatarChoices"><button data-style="man">👨 PERSONAJE CHICO</button><button data-style="woman">👩 PERSONAJE CHICA</button></div></div>';
 document.body.append(stylePanel);
 const styleCSS=document.createElement('style');styleCSS.textContent=`
 #avatarStylePanel{position:fixed;inset:0;z-index:55;display:none;align-items:center;justify-content:center;padding:22px;background:#15171ce8;backdrop-filter:blur(12px);color:#fff}
 #avatarStylePanel .avatarStyleCard{width:min(420px,95vw);padding:28px 20px;background:#292d35;border:2px solid #c89e70;border-radius:20px;text-align:center;box-shadow:0 18px 65px #0009}
 #avatarStylePanel small{letter-spacing:2px;color:#e5ba8e}#avatarStylePanel h2{font-size:27px;margin:14px 0}#avatarStylePanel p{line-height:1.5;color:#d7d8d8;font-size:14px}
 #avatarStylePanel .avatarChoices{display:grid;gap:12px;margin-top:20px}
 #avatarStylePanel button{border:1px solid #f2d4ac;background:#e7c198;color:#27211d;font-weight:900;border-radius:13px;padding:15px;font-size:15px}
 #avatarStylePanel button:last-child{background:#d9b6a9}
 #wardrobeGender{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 18px}#wardrobeGender button{flex:1;min-width:125px;background:#46515a;color:#fff;border:1px solid #c7a47d}#wardrobeGender button.active{background:#d8b48d;color:#24252a}
 `;document.head.append(styleCSS);
 function setAvatarStyle(style,persist=true){
  avatarStyle=style==='woman'?'woman':'man';
  rig.setAvatarStyle?.(avatarStyle);
  stylePanel.style.display='none';
  if(persist)save();
  if(typeof drawGenderButtons==='function')drawGenderButtons();
  if(typeof refreshWardrobePreview==='function')refreshWardrobePreview();
 }
 stylePanel.querySelectorAll('[data-style]').forEach(b=>b.onclick=()=>setAvatarStyle(b.dataset.style));
 const accessories=new T.Group();model.add(accessories);const headwear=new T.Group();(head||model).add(headwear);
 function itemMesh(geo,color,x,y,z,parent=accessories){const m=new T.Mesh(geo,new T.MeshStandardMaterial({color,roughness:.92}));m.position.set(x,y,z);parent.add(m);return m}
 function applyOutfit(){
 accessories.clear();headwear.clear();for(const p of wearableParts)p.parent?.remove(p);wearableParts.length=0;
 const fitted=(rings,color,parent)=>{const mesh=rig.garment(new T.MeshStandardMaterial({color,roughness:1,side:T.DoubleSide}),rings,parent,28);wearableParts.push(mesh);return mesh};
 const get=kind=>inventory.find(x=>x.id===equipped[kind]);
 const cap=get('cap');if(cap){
  const material=new T.MeshStandardMaterial({color:cap.color,roughness:.82,side:T.DoubleSide});
  // The crown is fitted around the actual skull (head center y=0), rather than
  // floating as a small hemisphere over the hair.
  const crown=new T.Mesh(new T.SphereGeometry(1,28,16,0,Math.PI*2,0,Math.PI*.57),material);
  crown.scale.set(.294,.32,.276);crown.position.set(0,.055,0);headwear.add(crown);
  const band=new T.Mesh(new T.CylinderGeometry(.285,.29,.085,32),material);
  band.position.y=.09;headwear.add(band);
  const brim=new T.Mesh(new T.SphereGeometry(1,24,10,0,Math.PI*2,0,Math.PI),material);
  brim.scale.set(.285,.018,.175);brim.position.set(0,.075,.247);headwear.add(brim);
  if(['beanie','wool','knit'].includes(cap.design)){brim.visible=false;band.scale.set(1,1.4,1);crown.position.y=.08}
  if(['bucket','fisher'].includes(cap.design)){brim.scale.set(.37,.03,.36);brim.position.z=0;brim.position.y=.055}
 }
 const dress=get('dress'),jacket=get('jacket'),pants=get('pants'),bag=get('bag');
 // Hide the original skin torso when a garment covers it: prevents skin-coloured holes.
 if(rig.body.children[0])rig.body.children[0].visible=!(jacket||dress);
 // Every garment is attached to the animated body rig. Overlapping cuffs and
 // generous joints avoid exposed skin at shoulder, elbow, waist and knee.
 const meshBall=(parent,color,x,y,z,sx,sy,sz)=>{const m=new T.Mesh(new T.SphereGeometry(1,20,14),new T.MeshStandardMaterial({color,roughness:.91}));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;parent.add(m);wearableParts.push(m);return m};
 const coverTorso=(color)=>fitted([[1.245,.356,.268],[1.31,.38,.28],[1.44,.389,.288],[1.66,.41,.294],[1.83,.405,.291],[1.96,.355,.267],[2.055,.28,.215],[2.095,.165,.145]],color,rig.body);
 const sleeve=(color,long=true)=>{
  for(let i=0;i<2;i++){
   const arm=rig.arms[i],elbow=rig.elbows[i];
   // Shoulder dome must overlap the torso and upper arm to hide the skin seam
   // even during arm swing and when viewed from above.
   meshBall(arm,color,0,.005,0,.172,.21,.168);
   meshBall(arm,color,0,-.12,0,.167,.21,.164);
   fitted([[-.39,.151,.153],[-.27,.173,.17],[-.10,.185,.18],[.05,.195,.191],[.14,.152,.158]],color,arm);
   if(long){
    meshBall(elbow,color,0,-.035,0,.155,.175,.154);
    fitted([[-.345,.13,.133],[-.27,.153,.155],[-.10,.159,.161],[.09,.156,.157]],color,elbow);
    meshBall(elbow,color,0,-.29,0,.139,.058,.14);
   }else{
    // Short sleeves still close over the upper arm instead of leaving a skin gap.
    meshBall(arm,color,0,-.24,0,.17,.11,.168);
   }
  }
 };
 const skirtTypes=['pleated','denimskirt','floral','midi'];
 const shortTypes=['denimshort','cargoShort','sportShort','tailoredShort','raggedShort'];
 for(const piece of rig.baseShorts)piece.visible=!(pants||dress);
 if(rig.baseWaist)rig.baseWaist.visible=!(pants||dress);
 if(jacket&&!dress){coverTorso(jacket.color);const isShort=['graphic','skate','stripe','polo','crop','halter','corset','sport','blouse'].includes(jacket.design);sleeve(jacket.color,!isShort);
 // Waistband overlaps trousers and torso; cropped tops intentionally leave waist exposed.
 if(!['crop','halter','corset','sport'].includes(jacket.design)){
 // Flat overlapping hem rather than a large oval sticking out of the hoodie.
 fitted([[1.235,.355,.27],[1.27,.373,.281],[1.33,.375,.281]],jacket.color,rig.body);
 }
 if(jacket.design==='patch'){const patch=new T.Mesh(new T.BoxGeometry(.012,.17,.16),new T.MeshStandardMaterial({color:'#1c2422',roughness:1}));patch.position.set(.172,-.22,0);rig.arms[1].add(patch);wearableParts.push(patch)}
 }
 if(pants&&!dress){const isSkirt=skirtTypes.includes(pants.design),isShort=shortTypes.includes(pants.design);
 // Hip cover joins both legs to the torso; avoids skin-colored crotch gaps.
 fitted([[1.18,.343,.26],[1.29,.356,.268],[1.39,.347,.257]],pants.color,rig.body);
 if(isSkirt){const hem=pants.design==='midi'?.65:.91;fitted([[hem,.47,.39],[hem+.13,.49,.41],[1.12,.405,.32],[1.35,.352,.26]],pants.color,rig.body)}
 else{for(let i=0;i<2;i++){const leg=rig.legs[i];fitted([[-.56,.193,.187],[-.39,.211,.208],[-.16,.233,.225],[.10,.229,.222]],pants.color,leg);meshBall(leg,pants.color,0,-.06,0,.212,.12,.21);
 if(!isShort){const knee=rig.knees[i];meshBall(knee,pants.color,0,-.10,0,.177,.24,.18);fitted([[-.55,.173,.177],[-.39,.181,.184],[-.19,.192,.197],[.10,.196,.197]],pants.color,knee);meshBall(knee,pants.color,0,-.43,0,.173,.09,.18)}
 }}
 }
 if(dress){coverTorso(dress.color);const hem=['party','evening'].includes(dress.design)?.65:.55;fitted([[hem,hem,.52],[hem+.12,hem*.96,.49],[1.06,.45,.36],[1.35,.35,.26]],dress.color,rig.body);meshBall(rig.body,dress.color,0,1.33,0,.35,.10,.25);
 if(['denim','garden'].includes(dress.design))sleeve(dress.color,false);
 if(['ribbon','summer','garden'].includes(dress.design))for(const side of [-1,1])meshBall(rig.body,'#fff2d9',side*.18,1.65,.277,.085,.085,.04)
 }
 // Distressed starter clothes: visible uneven fabric patches, seams and frayed hems.
 if(jacket?.design==='ragged'&&!dress){const ragColors=['#5b534b','#766d60','#b2a694'];for(let i=0;i<7;i++){const side=i%2?-1:1;const patch=new T.Mesh(new T.PlaneGeometry(.055+i%3*.035,.085+i%2*.045),new T.MeshStandardMaterial({color:ragColors[i%3],roughness:1,side:T.DoubleSide}));patch.position.set(side*(.08+(i%3)*.07),1.4+(i%4)*.15,.28);patch.rotation.z=(i-3)*.12;rig.body.add(patch);wearableParts.push(patch)}for(let i=0;i<2;i++){const cuff=meshBall(rig.arms[i],'#665e52',0,-.28,.125,.1,.025,.018);cuff.rotation.z=i?.17:-.15}}
 if(pants?.design==='raggedShort'&&!dress){for(let i=0;i<2;i++){const patch=meshBall(rig.legs[i],i?'#504c46':'#8a8072',0,-.43,.183,.095,.045,.018);patch.rotation.z=i?.16:-.2;meshBall(rig.legs[i],'#4f4b44',0,-.49,.16,.13,.022,.02)}}
 // Wearable designer detailing: canvas logos follow the animated body.
 const logo=(parent,word,bg,fg,x,y,z,w=.22,h=.16)=>{
  const cv=document.createElement('canvas');cv.width=256;cv.height=128;const ctx=cv.getContext('2d');
  ctx.fillStyle=bg;ctx.fillRect(0,0,256,128);ctx.strokeStyle=fg;ctx.lineWidth=7;ctx.strokeRect(6,6,244,116);
  ctx.fillStyle=fg;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 45px Arial';ctx.fillText(word,128,64,235);
  const tx=new T.CanvasTexture(cv);tx.colorSpace=T.SRGBColorSpace;
  const mesh=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:tx,transparent:true,side:T.DoubleSide}));
  mesh.position.set(x,y,z);parent.add(mesh);wearableParts.push(mesh);return mesh;
 };
 if(jacket?.design==='stonePink'&&!dress){
  // Sleeve badge is attached to the arm rather than floating on the torso.
  logo(rig.arms[1],'STONE','#242b2d','#d4dfad',.164,-.24,.08,.18,.15);
  meshBall(rig.body,'#c889a1',0,1.5,.285,.20,.14,.018);
 }
 if(pants?.design==='crtzWide'&&!dress){
  logo(rig.legs[0],'CRTZ','#323a3a','#f2f2e6',-.03,-.22,.235,.24,.12);
  for(const leg of rig.legs)meshBall(leg,pants.color,0,-.44,0,.245,.12,.23);
  for(const knee of rig.knees)meshBall(knee,pants.color,0,-.22,0,.225,.30,.22);
 }
 if(bag){
  const strapMat=new T.MeshStandardMaterial({color:'#3d4245',roughness:.78,side:T.DoubleSide});
  const strap=new T.Mesh(new T.TorusGeometry(.36,.042,8,24,Math.PI),strapMat);
  strap.rotation.z=Math.PI;strap.position.set(.46,1.67,.16);rig.body.add(strap);wearableParts.push(strap);
  const bagMat=new T.MeshStandardMaterial({color:bag.color,roughness:.77});
  const bagMesh=new T.Mesh(new T.BoxGeometry(.55,.41,.22),bagMat);bagMesh.position.set(.53,1.23,.17);rig.body.add(bagMesh);wearableParts.push(bagMesh);
  logo(rig.body,'GOYARD','#555c60','#d4d1c8',.53,1.25,.285,.39,.15);
 }
 const shoes=get('shoes');if(shoes){for(const knee of rig.knees){const shoe=new T.Mesh(new T.SphereGeometry(1,20,12),new T.MeshStandardMaterial({color:shoes.color,roughness:1}));shoe.position.set(0,-.545,.095);shoe.scale.set(.213,.092,.29);knee.add(shoe);wearableParts.push(shoe)}}
 }
 const wearableParts=[];
 
 // Private dressing room: a 3D preview of the actual equipped character.
 const wardrobe=document.createElement('section');wardrobe.id='wardrobeRoom';wardrobe.innerHTML=`<div class="wardrobeTop"><div><small>🛸 IDENTIDAD DIGITAL</small><h2>👕 VESTUARIO</h2></div><button id="wardrobeClose">✕ VOLVER</button></div><div class="wardrobeStage"><canvas id="wardrobeCanvas"></canvas><div class="wardrobeHint">Tu personaje con la ropa que llevas puesta</div></div><div class="wardrobeBottom"><h3>ELIGE TU PERSONAJE</h3><div id="wardrobeGender"></div><h3>EQUIPAMIENTO DISPONIBLE</h3><p>Tus dos prendas iniciales son gratuitas para siempre. Puedes equiparlas, combinar otras prendas o quitarlas.</p><div id="wardrobeItems"></div><button id="wardrobeClear">QUITAR PRENDAS EQUIPADAS</button></div>`;document.body.append(wardrobe);
 const roomStyle=document.createElement('style');roomStyle.textContent=`
 #wardrobeRoom{position:fixed;inset:0;z-index:30;display:none;flex-direction:column;background:radial-gradient(ellipse at 50% -20%,#2b6284,#101b32 55%,#0b1325);overflow:auto;touch-action:pan-y;color:white;padding:15px 16px 24px;align-items:center}
 #wardrobeRoom .wardrobeTop{display:flex;justify-content:space-between;align-items:center;width:min(700px,100%);gap:12px}
 #wardrobeRoom h2{margin:0;color:#8ce8ff;font-size:27px}#wardrobeRoom small{color:#8cd4e9;letter-spacing:2px}#wardrobeRoom button{font-size:12px;padding:12px 15px;border-radius:13px}
 #wardrobeRoom .wardrobeStage{width:min(700px,100%);height:34vh;min-height:220px;max-height:350px;position:relative;background:radial-gradient(ellipse at center,#83c7e0 0%,#305775 55%,#112640 100%);border-radius:23px;margin:12px 0;overflow:hidden;border:1px solid #ffffff55}
 #wardrobeCanvas{width:100%;height:100%;display:block;touch-action:none}.wardrobeHint{position:absolute;bottom:8px;text-align:center;width:100%;font-size:11px;color:#fff8}
 #wardrobeRoom .wardrobeBottom{width:min(700px,100%)}#wardrobeRoom h3{margin:4px 0;color:#ffdd91}#wardrobeRoom p{font-size:12px;color:#e6d7e6}
 #wardrobeItems{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin:12px 0}#wardrobeItems button{background:#d8edf7;color:#163148;text-align:left;min-height:56px}#wardrobeItems button.wearing{background:#9ce4c5}#wardrobeClear{background:#ee9eb2;width:100%}
 `;document.head.append(roomStyle);
 let wardrobeRenderer=null,wardrobeScene=null,wardrobeCamera=null,wardrobePreview=null,wardrobeOpen=false,wardrobeAngle=0;
 function refreshWardrobePreview(){if(!wardrobeScene)return;if(wardrobePreview)wardrobeScene.remove(wardrobePreview);wardrobePreview=model.clone(true);wardrobePreview.rotation.y=Math.PI;wardrobeScene.add(wardrobePreview)}
 function drawGenderButtons(){const wrap=wardrobe.querySelector('#wardrobeGender');if(!wrap)return;wrap.replaceChildren();for(const [style,label] of [['man','👨 CHICO'],['woman','👩 CHICA']]){const b=document.createElement('button');b.textContent=label;b.className=avatarStyle===style?'active':'';b.onclick=()=>setAvatarStyle(style);wrap.append(b)}}
 function drawWardrobe(){drawGenderButtons();const area=wardrobe.querySelector('#wardrobeItems');area.replaceChildren();for(const kind of ['cap','jacket','pants','dress','shoes','bag']){const none=document.createElement('button');none.textContent='✕ Sin '+({cap:'gorra',jacket:'chaqueta',pants:'pantalón',shoes:'zapatillas',dress:'vestido',bag:'bolso'}[kind]);none.className=!equipped[kind]?'wearing':'';none.onclick=()=>{delete equipped[kind];applyOutfit();save();drawWardrobe();refreshWardrobePreview()};area.append(none);for(const item of inventory.filter(i=>i.kind===kind&&owned.has(i.id))){const btn=document.createElement('button');btn.textContent=item.emoji+' '+item.name+(equipped[kind]===item.id?' ✓':'');btn.className=equipped[kind]===item.id?'wearing':'';btn.onclick=()=>{equipped[kind]=item.id;if(kind==='dress'){delete equipped.jacket;delete equipped.pants}else if(kind==='jacket'||kind==='pants')delete equipped.dress;applyOutfit();save();drawWardrobe();refreshWardrobePreview()};area.append(btn)}}}
 function openWardrobe(){if(!window.barbasAccount?.ready){showStatus('Inicia sesión con Google primero');return}wardrobeOpen=true;wardrobe.style.display='flex';drawWardrobe();if(!wardrobeRenderer){const canvas=wardrobe.querySelector('#wardrobeCanvas');wardrobeRenderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});wardrobeRenderer.setPixelRatio(Math.min(devicePixelRatio,1.5));wardrobeScene=new T.Scene();wardrobeScene.add(new T.HemisphereLight('#ffffff','#786081',2.2));const light=new T.DirectionalLight('#fff3dc',2);light.position.set(3,6,6);wardrobeScene.add(light);wardrobeCamera=new T.PerspectiveCamera(36,1,.1,30);wardrobeCamera.position.set(0,1.05,5.5);wardrobeCamera.lookAt(0,.95,0)}refreshWardrobePreview();renderWardrobe()}
 function renderWardrobe(){if(!wardrobeOpen)return;const canvas=wardrobeRenderer.domElement,w=canvas.clientWidth,h=canvas.clientHeight;if(w&&h){wardrobeRenderer.setSize(w,h,false);wardrobeCamera.aspect=w/h;wardrobeCamera.updateProjectionMatrix();if(wardrobePreview)wardrobePreview.rotation.y=wardrobeAngle;wardrobeRenderer.render(wardrobeScene,wardrobeCamera)}requestAnimationFrame(renderWardrobe)}
 function closeWardrobe(){wardrobeOpen=false;wardrobe.style.display='none'}
 wardrobe.querySelector('#wardrobeClose').onclick=closeWardrobe;wardrobe.querySelector('#wardrobeClear').onclick=()=>{equipped={};applyOutfit();save();drawWardrobe();refreshWardrobePreview()};
 let turnStart=null;wardrobe.querySelector('#wardrobeCanvas').addEventListener('pointerdown',e=>{turnStart=e.clientX;e.currentTarget.setPointerCapture(e.pointerId)});wardrobe.querySelector('#wardrobeCanvas').addEventListener('pointermove',e=>{if(turnStart!==null){wardrobeAngle+=(e.clientX-turnStart)*.009;turnStart=e.clientX}});wardrobe.querySelector('#wardrobeCanvas').addEventListener('pointerup',()=>turnStart=null);
 wardrobeButton.onclick=openWardrobe;
 window.barbasOpenWardrobe=openWardrobe;
 window.barbasSetAvatarStyle=setAvatarStyle;
 let selectedItem=null,shopCategory='all';
 const categoryNames={all:'✨ TODO',exclusive:'💎 EXCLUSIVOS',bag:'👜 BOLSOS',cap:'🧢 GORROS',jacket:'👕 TOPS Y CHAQUETAS',pants:'👖 PANTALONES Y FALDAS',dress:'👗 VESTIDOS',shoes:'👟 BAMBAS'};
 const filters=document.createElement('div');filters.id='shopFilters';overlay.querySelector('.shopGrid').before(filters);
 function drawShop(){
  const grid=overlay.querySelector('.shopGrid');grid.replaceChildren();filters.replaceChildren();filters.style.display=selectedItem?'none':'flex';
  for(const [kind,label] of Object.entries(categoryNames)){const f=document.createElement('button');f.textContent=label;f.className=shopCategory===kind?'selected':'';f.onclick=()=>{shopCategory=kind;drawShop()};filters.append(f)}
  for(const it of inventory){
   if(selectedItem&&it.id!==selectedItem)continue;
   if(!selectedItem&&shopCategory!=='all'&&(shopCategory==='exclusive'?it.section!=='exclusive':it.kind!==shopCategory))continue;
   const card=document.createElement('div');card.className='product';card.dataset.itemId=it.id;
   const art=document.createElement('div');art.className='productArt '+it.kind+' '+it.design;art.style.setProperty('--fabric',it.color);
   const shape=document.createElement('div');shape.className='garmentIcon';const trim=document.createElement('div');trim.className='garmentTrim';shape.append(trim);art.append(shape);
   const name=document.createElement('b');name.textContent=it.name;
   const price=document.createElement('small');price.textContent=it.price.toLocaleString('es-ES')+' 🪙';
   const btn=document.createElement('button');const have=owned.has(it.id),wearing=equipped[it.kind]===it.id;
   btn.textContent=wearing?'✓ EQUIPADO':have?'PONER':'COMPRAR';btn.disabled=wearing;
   btn.onclick=()=>{if(!owned.has(it.id)){if(coins<it.price){showStatus('Necesitas '+(it.price-coins).toLocaleString('es-ES')+' monedas más');sound('error');return}coins-=it.price;owned.add(it.id);sound('buy')}else sound('equip');equipped[it.kind]=it.id;if(it.kind==='dress'){delete equipped.jacket;delete equipped.pants}else if(it.kind==='jacket'||it.kind==='pants')delete equipped.dress;applyOutfit();save();updateHud();drawShop()};
   card.append(art,name,price,btn);grid.append(card)
  }
 }
 let shopOpen=false;
 function openShop(itemId){if(!itemId||!inventory.some(it=>it.id===itemId))return;selectedItem=itemId;shopCategory='all';shopOpen=true;overlay.style.display='flex';drawShop();updateHud();sound('open')}
 function closeShop(){shopOpen=false;selectedItem=null;overlay.style.display='none';sound('close')}
 shopButton.onclick=()=>showStatus('Las compras se hacen en los expositores de TK SHOP');overlay.querySelector('#closeShop').onclick=closeShop;
 let ctx,musicBus,sfxBus,musicTimer,musicOn=true,step=0,ambience;
 const audioPrefsKey='barbas-audio-settings-v1';
 let audioPrefs={music:42,effects:55};try{audioPrefs={...audioPrefs,...JSON.parse(localStorage.getItem(audioPrefsKey)||'{}')}}catch{}
 // Original synthwave-inspired soundtrack for the futuristic hub (no external music files).
 const melody=[659.25,0,783.99,987.77,0,783.99,659.25,0,587.33,0,659.25,783.99,880,0,783.99,0,523.25,0,659.25,783.99,0,659.25,587.33,0,493.88,0,587.33,659.25,783.99,0,659.25,0];
 const chords=[[220,261.63,329.63],[174.61,220,261.63],[196,246.94,293.66],[164.81,196,246.94]];
 const bass=[110,87.31,98,82.41];
 function drum(freq,volume=.2,decay=.14){if(!ctx||!musicBus)return;const now=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(freq*2.4,now);o.frequency.exponentialRampToValueAtTime(freq,now+.07);g.gain.setValueAtTime(volume,now);g.gain.exponentialRampToValueAtTime(.0001,now+decay);o.connect(g);g.connect(musicBus);o.start(now);o.stop(now+decay+.01)}
 function hat(){if(!ctx||!musicBus)return;const len=Math.floor(ctx.sampleRate*.045),buffer=ctx.createBuffer(1,len,ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<len;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/len,2);const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();src.buffer=buffer;filter.type='highpass';filter.frequency.value=6800;gain.gain.value=.065;src.connect(filter);filter.connect(gain);gain.connect(musicBus);src.start()}
 function syncVolumes(){if(musicBus)musicBus.gain.setTargetAtTime(musicOn?Math.max(0,Math.min(100,audioPrefs.music))/100*.24:0,ctx.currentTime,.06);if(sfxBus)sfxBus.gain.setTargetAtTime(Math.max(0,Math.min(100,audioPrefs.effects))/100*.28,ctx.currentTime,.04)}
 window.addEventListener('barbas-audio-change',e=>{audioPrefs={...audioPrefs,...e.detail};syncVolumes()});
 function ensureAudio(){if(!ctx){ctx=new (window.AudioContext||window.webkitAudioContext)();musicBus=ctx.createGain();sfxBus=ctx.createGain();musicBus.connect(ctx.destination);sfxBus.connect(ctx.destination);syncVolumes();const buffer=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.05;const noise=ctx.createBufferSource();noise.buffer=buffer;noise.loop=true;const low=ctx.createBiquadFilter();low.type='lowpass';low.frequency.value=160;ambience=ctx.createGain();ambience.gain.value=.004;noise.connect(low);low.connect(ambience);ambience.connect(musicBus);noise.start()}if(ctx.state==='suspended')ctx.resume();if(!musicTimer)musicTimer=setInterval(()=>{if(!musicOn||!ctx)return;const n=melody[step%melody.length],ch=chords[Math.floor(step/8)%4];if(n)tone(n,.22,'triangle',.115,musicBus);if(step%8===0){for(const f of ch)tone(f,1.75,'sine',.065,musicBus)}if(step%2===0){tone(bass[Math.floor(step/8)%4]*(step%8===6?2:1),.23,'sawtooth',.075,musicBus);drum(55,.23,.16)}if(step%4===2)drum(160,.075,.075);if(step%2===1)hat();step++},245)}
 function tone(freq,duration,type='sine',volume=.25,bus=sfxBus){if(!ctx||!bus)return;const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=freq;const now=ctx.currentTime;g.gain.setValueAtTime(0,now);g.gain.linearRampToValueAtTime(volume,now+.055);g.gain.setValueAtTime(volume*.75,now+Math.max(.06,duration*.36));g.gain.exponentialRampToValueAtTime(.0001,now+duration+.16);o.connect(g);g.connect(bus);o.start(now);o.stop(now+duration+.18)}
 function sound(type){if(!ctx)return;const presets={jump:[[330,.13],[440,.19]],step:[[110,.05]],buy:[[440,.11],[660,.2],[880,.3]],equip:[[550,.12]],open:[[390,.12],[520,.2]],close:[[320,.1]],error:[[170,.2],[130,.2]],coin:[[620,.09],[930,.15]]};let delay=0;for(const [f,d] of presets[type]||[]){setTimeout(()=>tone(f,d,type==='step'?'triangle':'sine',type==='step'?.07:.26),delay);delay+=90}}
 audioButton.onclick=()=>{ensureAudio();musicOn=!musicOn;syncVolumes();audioButton.textContent='♫ Música: '+(musicOn?'ON':'OFF')};
 function start(){if(!avatarStyle)stylePanel.style.display='flex';ensureAudio();shopButton.style.display='none';wardrobeButton.style.display='block';audioButton.style.display='block';hud.style.display='block'}
 function hide(){shopButton.style.display='none';wardrobeButton.style.display='none';audioButton.style.display='none';hud.style.display='none';closeWardrobe();closeShop()}
 let walkSound=0;
 function update(dt,moving,speed){if(!moving||shopOpen)return;walkSound+=dt;if(walkSound>.42){sound('step');walkSound=0}}
 function reward(amount,message){coins+=amount;updateHud();save();sound('coin');showStatus('🪙 +'+amount+' monedas · '+message)}
 function useCloudProfile(data){
  if(!data||cloudReady)return;
  coins=Number.isFinite(data.coins)?data.coins:0;
  avatarStyle=data.avatarStyle==='woman'?'woman':data.avatarStyle==='man'?'man':'';
  if(avatarStyle)setAvatarStyle(avatarStyle,false);
  owned=new Set(Array.isArray(data.owned)?data.owned:[]);
  equipped=data.equipped&&typeof data.equipped==='object'?{...data.equipped}:{};
  // Every existing account receives both permanent starter items, without
  // losing its previously purchased outfits, coins or current selections.
  const needsGrant=!owned.has(STARTER_TOP)||!owned.has(STARTER_SHORTS);
  owned.add(STARTER_TOP);owned.add(STARTER_SHORTS);
  cloudReady=true;
  if(needsGrant)save();
  applyOutfit();updateHud();
 }
 window.addEventListener('barbas-profile-ready',e=>useCloudProfile(e.detail));if(window.barbasAccount?.ready&&window.barbasAccount.profile)useCloudProfile(window.barbasAccount.profile);applyOutfit();updateHud();hud.style.display='none';
 return {start,hide,openShop,closeShop,inventory,reward,get shopOpen(){return shopOpen},update,sound,ensureAudio};
}
