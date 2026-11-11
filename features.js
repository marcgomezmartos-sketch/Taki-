import * as T from 'three';
export function iniciarExtras({player,model,head,rig,showStatus}){
 const inventory=[
 {id:'capBlack',name:'Gorra urbana negra',kind:'cap',price:75,color:'#171a22',emoji:'🧢'},
 {id:'capRed',name:'Gorra roja',kind:'cap',price:90,color:'#bf3548',emoji:'🧢'},
 {id:'jacketBlue',name:'Chaqueta azul',kind:'jacket',price:180,color:'#3569a5',emoji:'🧥'},
 {id:'jacketGreen',name:'Chaqueta verde',kind:'jacket',price:210,color:'#4d7858',emoji:'🧥'},
 {id:'pantsBeige',name:'Pantalón beige',kind:'pants',price:120,color:'#b6a18b',emoji:'👖'},
 {id:'pantsGrey',name:'Pantalón gris',kind:'pants',price:135,color:'#777d8a',emoji:'👖'},
 {id:'shoesWhite',name:'Zapatillas blancas',kind:'shoes',price:95,color:'#eeeeea',emoji:'👟'}
 ];
 const key='barbas-party-economy-v1';
 let saved={};
 let coins=Number.isFinite(saved.coins)?saved.coins:0,owned=new Set(Array.isArray(saved.owned)?saved.owned:[]),equipped=saved.equipped||{};
 let cloudReady=false;let cloudSaveChain=Promise.resolve();const save=()=>{const data={coins,owned:[...owned],equipped};if(cloudReady&&window.barbasAccount?.save){cloudSaveChain=cloudSaveChain.catch(()=>{}).then(()=>window.barbasAccount.save(data)).catch(e=>{showStatus('Error guardando partida: '+(e.code||e.message))})}};
 const style=document.createElement('style');style.textContent=`
 #coinsHud{position:fixed;top:75px;left:14px;z-index:6;background:#201b39d9;border:1px solid #ffe19a66;border-radius:12px;padding:8px 12px;font-weight:900;color:#ffe38a}
 #shopButton,#audioButton{position:fixed;z-index:7;right:12px;display:none;font-size:13px;padding:10px 12px;border-radius:12px}
 #shopButton{top:65px}#audioButton{top:115px}
 #shopOverlay{position:fixed;inset:0;z-index:15;display:none;flex-direction:column;align-items:center;background:#17162bea;overflow:auto;padding:22px 12px 120px;touch-action:pan-y}
 #shopOverlay h2{margin:5px 0;color:#ffdb73;font-size:29px}#shopOverlay .shopGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;width:min(640px,100%);margin:14px auto}
 #shopOverlay .product{background:#302b4c;border:1px solid #ffffff29;border-radius:15px;padding:13px 8px;display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center}
 #shopOverlay .product .emoji{font-size:37px}#shopOverlay .product button{font-size:12px;padding:10px;width:100%}#shopOverlay .product small{color:#fce2a1}
 #shopOverlay .shopHead{display:flex;justify-content:space-between;align-items:center;gap:12px;width:min(640px,100%)}
 `;document.head.append(style);
 const hud=document.createElement('div');hud.id='coinsHud';document.body.append(hud);
 const shopButton=document.createElement('button');shopButton.id='shopButton';shopButton.textContent='🛍️ TIENDA';document.body.append(shopButton);
 const audioButton=document.createElement('button');audioButton.id='audioButton';audioButton.textContent='♫ Música: ON';document.body.append(audioButton);
 const overlay=document.createElement('section');overlay.id='shopOverlay';overlay.innerHTML='<div class="shopHead"><h2>🛍️ TK SHOP</h2><button id="closeShop">✕ CERRAR</button></div><p>Compra ropa con monedas que ganas completando actividades.</p><strong id="shopBalance"></strong><div class="shopGrid"></div>';document.body.append(overlay);
 const updateHud=()=>{hud.textContent='🪙 '+coins+' monedas';overlay.querySelector('#shopBalance').textContent='Saldo: '+coins+' 🪙'};
 const accessories=new T.Group();model.add(accessories);const headwear=new T.Group();(head||model).add(headwear);
 function itemMesh(geo,color,x,y,z,parent=accessories){const m=new T.Mesh(geo,new T.MeshStandardMaterial({color,roughness:.92}));m.position.set(x,y,z);parent.add(m);return m}
 function applyOutfit(){
 accessories.clear();headwear.clear();for(const p of wearableParts)p.parent?.remove(p);wearableParts.length=0;
 const fitted=(rings,color,parent)=>{const mesh=rig.garment(new T.MeshStandardMaterial({color,roughness:1,side:T.DoubleSide}),rings,parent,28);wearableParts.push(mesh);return mesh};
 const get=kind=>inventory.find(x=>x.id===equipped[kind]);
 const cap=get('cap');if(cap){const material=new T.MeshStandardMaterial({color:cap.color,roughness:1});const crown=new T.Mesh(new T.SphereGeometry(1,32,16,0,Math.PI*2,0,Math.PI/2),material);crown.scale.set(.305,.155,.278);crown.position.set(0,.30,0);headwear.add(crown);const brim=new T.Mesh(new T.SphereGeometry(1,24,10,0,Math.PI*2,0,Math.PI),material);brim.scale.set(.22,.018,.15);brim.position.set(0,.30,.275);headwear.add(brim)}
 const jacket=get('jacket');if(jacket){const c=jacket.color;fitted([[1.28,.342,.233],[1.39,.358,.251],[1.55,.402,.273],[1.77,.413,.269],[1.96,.367,.244],[2.045,.292,.213]],c,rig.body);for(let i=0;i<rig.arms.length;i++){const arm=rig.arms[i],elbow=rig.elbows[i];fitted([[-.34,.145,.143],[-.22,.158,.155],[-.08,.16,.159],[.045,.145,.145]],c,arm);fitted([[-.31,.125,.127],[-.23,.133,.134],[-.10,.14,.14],[.04,.145,.143]],c,elbow);const cuff=new T.Mesh(new T.CylinderGeometry(.13,.13,.035,20),new T.MeshStandardMaterial({color:c,roughness:1}));cuff.position.y=-.30;elbow.add(cuff);wearableParts.push(cuff)}
 // Sleeve badge belongs to the purchased jacket, never to bare skin.
 const arm=rig.arms[1];const badgeCanvas=document.createElement('canvas');badgeCanvas.width=128;badgeCanvas.height=128;const b=badgeCanvas.getContext('2d');b.fillStyle='#161a1c';b.fillRect(0,0,128,128);b.strokeStyle='#c9c34d';b.lineWidth=5;b.beginPath();b.arc(64,64,43,0,Math.PI*2);b.stroke();b.beginPath();b.moveTo(64,27);b.lineTo(75,53);b.lineTo(101,64);b.lineTo(75,75);b.lineTo(64,101);b.lineTo(53,75);b.lineTo(27,64);b.lineTo(53,53);b.closePath();b.stroke();const tex=new T.CanvasTexture(badgeCanvas);tex.colorSpace=T.SRGBColorSpace;const patch=new T.Mesh(new T.PlaneGeometry(.18,.18),new T.MeshStandardMaterial({map:tex,side:T.DoubleSide,roughness:1}));patch.position.set(.17,-.24,0);patch.rotation.y=Math.PI/2;arm.add(patch);wearableParts.push(patch)}
 const pants=get('pants');if(pants){for(const leg of rig.legs)fitted([[-.53,.193,.188],[-.36,.207,.204],[-.15,.231,.225],[.06,.228,.223]],pants.color,leg);for(const knee of rig.knees)fitted([[-.47,.175,.18],[-.25,.19,.195],[-.01,.207,.21]],pants.color,knee)}
 const shoes=get('shoes');if(shoes){for(const knee of rig.knees){const shoe=new T.Mesh(new T.SphereGeometry(1,20,12),new T.MeshStandardMaterial({color:shoes.color,roughness:1}));shoe.position.set(0,-.545,.095);shoe.scale.set(.213,.092,.29);knee.add(shoe);wearableParts.push(shoe)}}
 }
 const wearableParts=[];
 
 // Private dressing room: a 3D preview of the actual equipped character.
 const wardrobe=document.createElement('section');wardrobe.id='wardrobeRoom';wardrobe.innerHTML=`<div class="wardrobeTop"><div><small>✨ MI PERSONAJE</small><h2>👤 VESTIDOR</h2></div><button id="wardrobeClose">✕ VOLVER</button></div><div class="wardrobeStage"><canvas id="wardrobeCanvas"></canvas><div class="wardrobeHint">Tu personaje con la ropa que llevas puesta</div></div><div class="wardrobeBottom"><h3>MI ARMARIO</h3><p>Elige entre tus prendas compradas. Puedes quitarte cualquier prenda.</p><div id="wardrobeItems"></div><button id="wardrobeClear">QUITAR TODA LA ROPA</button></div>`;document.body.append(wardrobe);
 const roomStyle=document.createElement('style');roomStyle.textContent=`
 #wardrobeRoom{position:fixed;inset:0;z-index:30;display:none;flex-direction:column;background:linear-gradient(145deg,#282442,#4a3757);overflow:auto;touch-action:pan-y;color:white;padding:15px 16px 24px;align-items:center}
 #wardrobeRoom .wardrobeTop{display:flex;justify-content:space-between;align-items:center;width:min(700px,100%);gap:12px}
 #wardrobeRoom h2{margin:0;color:#ffe4a3;font-size:27px}#wardrobeRoom small{color:#eec8de;letter-spacing:2px}#wardrobeRoom button{font-size:12px;padding:12px 15px;border-radius:13px}
 #wardrobeRoom .wardrobeStage{width:min(700px,100%);height:34vh;min-height:220px;max-height:350px;position:relative;background:radial-gradient(ellipse at center,#c8a8bc 0%,#806c92 60%,#4b426e 100%);border-radius:23px;margin:12px 0;overflow:hidden;border:1px solid #ffffff55}
 #wardrobeCanvas{width:100%;height:100%;display:block;touch-action:none}.wardrobeHint{position:absolute;bottom:8px;text-align:center;width:100%;font-size:11px;color:#fff8}
 #wardrobeRoom .wardrobeBottom{width:min(700px,100%)}#wardrobeRoom h3{margin:4px 0;color:#ffdd91}#wardrobeRoom p{font-size:12px;color:#e6d7e6}
 #wardrobeItems{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin:12px 0}#wardrobeItems button{background:#fff2df;color:#2e2545;text-align:left;min-height:56px}#wardrobeItems button.wearing{background:#b4edcb}#wardrobeClear{background:#ee9eb2;width:100%}
 `;document.head.append(roomStyle);
 let wardrobeRenderer=null,wardrobeScene=null,wardrobeCamera=null,wardrobePreview=null,wardrobeOpen=false,wardrobeAngle=0;
 function refreshWardrobePreview(){if(!wardrobeScene)return;if(wardrobePreview)wardrobeScene.remove(wardrobePreview);wardrobePreview=model.clone(true);wardrobePreview.rotation.y=Math.PI;wardrobeScene.add(wardrobePreview)}
 function drawWardrobe(){const area=wardrobe.querySelector('#wardrobeItems');area.replaceChildren();for(const kind of ['cap','jacket','pants','shoes']){const none=document.createElement('button');none.textContent='✕ Sin '+({cap:'gorra',jacket:'chaqueta',pants:'pantalón',shoes:'zapatillas'}[kind]);none.className=!equipped[kind]?'wearing':'';none.onclick=()=>{delete equipped[kind];applyOutfit();save();drawWardrobe();refreshWardrobePreview()};area.append(none);for(const item of inventory.filter(i=>i.kind===kind&&owned.has(i.id))){const btn=document.createElement('button');btn.textContent=item.emoji+' '+item.name+(equipped[kind]===item.id?' ✓':'');btn.className=equipped[kind]===item.id?'wearing':'';btn.onclick=()=>{equipped[kind]=item.id;applyOutfit();save();drawWardrobe();refreshWardrobePreview()};area.append(btn)}}}
 function openWardrobe(){if(!window.barbasAccount?.ready){showStatus('Inicia sesión con Google primero');return}wardrobeOpen=true;wardrobe.style.display='flex';drawWardrobe();if(!wardrobeRenderer){const canvas=wardrobe.querySelector('#wardrobeCanvas');wardrobeRenderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});wardrobeRenderer.setPixelRatio(Math.min(devicePixelRatio,1.5));wardrobeScene=new T.Scene();wardrobeScene.add(new T.HemisphereLight('#ffffff','#786081',2.2));const light=new T.DirectionalLight('#fff3dc',2);light.position.set(3,6,6);wardrobeScene.add(light);wardrobeCamera=new T.PerspectiveCamera(36,1,.1,30);wardrobeCamera.position.set(0,1.05,5.5);wardrobeCamera.lookAt(0,.95,0)}refreshWardrobePreview();renderWardrobe()}
 function renderWardrobe(){if(!wardrobeOpen)return;const canvas=wardrobeRenderer.domElement,w=canvas.clientWidth,h=canvas.clientHeight;if(w&&h){wardrobeRenderer.setSize(w,h,false);wardrobeCamera.aspect=w/h;wardrobeCamera.updateProjectionMatrix();if(wardrobePreview)wardrobePreview.rotation.y=wardrobeAngle;wardrobeRenderer.render(wardrobeScene,wardrobeCamera)}requestAnimationFrame(renderWardrobe)}
 function closeWardrobe(){wardrobeOpen=false;wardrobe.style.display='none'}
 wardrobe.querySelector('#wardrobeClose').onclick=closeWardrobe;wardrobe.querySelector('#wardrobeClear').onclick=()=>{equipped={};applyOutfit();save();drawWardrobe();refreshWardrobePreview()};
 let turnStart=null;wardrobe.querySelector('#wardrobeCanvas').addEventListener('pointerdown',e=>{turnStart=e.clientX;e.currentTarget.setPointerCapture(e.pointerId)});wardrobe.querySelector('#wardrobeCanvas').addEventListener('pointermove',e=>{if(turnStart!==null){wardrobeAngle+=(e.clientX-turnStart)*.009;turnStart=e.clientX}});wardrobe.querySelector('#wardrobeCanvas').addEventListener('pointerup',()=>turnStart=null);
 window.barbasOpenWardrobe=openWardrobe;
 let selectedItem=null;function drawShop(){const grid=overlay.querySelector('.shopGrid');grid.replaceChildren();for(const it of inventory){if(selectedItem&&it.id!==selectedItem)continue;const card=document.createElement('div');card.className='product';card.dataset.itemId=it.id;const emoji=document.createElement('div');emoji.className='emoji';emoji.textContent=it.emoji;const name=document.createElement('b');name.textContent=it.name;const price=document.createElement('small');price.textContent=it.price+' 🪙';const btn=document.createElement('button');const have=owned.has(it.id),wearing=equipped[it.kind]===it.id;btn.textContent=wearing?'✓ EQUIPADO':have?'PONER':'COMPRAR';btn.disabled=wearing;btn.onclick=()=>{if(!owned.has(it.id)){if(coins<it.price){showStatus('No tienes monedas suficientes');sound('error');return}coins-=it.price;owned.add(it.id);sound('buy')}else sound('equip');equipped[it.kind]=it.id;applyOutfit();save();updateHud();drawShop()};card.append(emoji,name,price,btn);grid.append(card)}}
 let shopOpen=false;
 function openShop(itemId){if(!itemId)return;selectedItem=itemId;shopOpen=true;overlay.style.display='flex';drawShop();updateHud();sound('open')}
 function closeShop(){shopOpen=false;selectedItem=null;overlay.style.display='none';sound('close')}
 shopButton.onclick=()=>showStatus('Entra en TK SHOP para comprar ropa');overlay.querySelector('#closeShop').onclick=closeShop;
 let ctx,musicBus,sfxBus,musicTimer,musicOn=true,step=0,ambience;
 const audioPrefsKey='barbas-audio-settings-v1';
 let audioPrefs={music:42,effects:55};try{audioPrefs={...audioPrefs,...JSON.parse(localStorage.getItem(audioPrefsKey)||'{}')}}catch{}
 const melody=[392,0,440,493.88,523.25,0,440,392,349.23,0,392,440,493.88,440,392,0,329.63,0,349.23,392,440,0,392,349.23,329.63,0,293.66,329.63,349.23,392,0,0];
 const chords=[[261.63,329.63,392],[220,261.63,329.63],[174.61,220,261.63],[196,246.94,293.66]];
 function syncVolumes(){if(musicBus)musicBus.gain.setTargetAtTime(musicOn?Math.max(0,Math.min(100,audioPrefs.music))/100*.24:0,ctx.currentTime,.06);if(sfxBus)sfxBus.gain.setTargetAtTime(Math.max(0,Math.min(100,audioPrefs.effects))/100*.28,ctx.currentTime,.04)}
 window.addEventListener('barbas-audio-change',e=>{audioPrefs={...audioPrefs,...e.detail};syncVolumes()});
 function ensureAudio(){if(!ctx){ctx=new (window.AudioContext||window.webkitAudioContext)();musicBus=ctx.createGain();sfxBus=ctx.createGain();musicBus.connect(ctx.destination);sfxBus.connect(ctx.destination);syncVolumes();const buffer=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.05;const noise=ctx.createBufferSource();noise.buffer=buffer;noise.loop=true;const low=ctx.createBiquadFilter();low.type='lowpass';low.frequency.value=160;ambience=ctx.createGain();ambience.gain.value=.004;noise.connect(low);low.connect(ambience);ambience.connect(musicBus);noise.start()}if(ctx.state==='suspended')ctx.resume();if(!musicTimer)musicTimer=setInterval(()=>{if(!musicOn||!ctx)return;const n=melody[step%melody.length],ch=chords[Math.floor(step/8)%4];if(n)tone(n,.43,'sine',.19,musicBus);if(step%8===0){for(const f of ch)tone(f,1.65,'sine',.085,musicBus);tone(ch[0]/2,1.15,'sine',.16,musicBus)}if(step%8===4)tone(ch[0]/2,.8,'sine',.08,musicBus);step++},340)}
 function tone(freq,duration,type='sine',volume=.25,bus=sfxBus){if(!ctx||!bus)return;const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=freq;const now=ctx.currentTime;g.gain.setValueAtTime(0,now);g.gain.linearRampToValueAtTime(volume,now+.055);g.gain.setValueAtTime(volume*.75,now+Math.max(.06,duration*.36));g.gain.exponentialRampToValueAtTime(.0001,now+duration+.16);o.connect(g);g.connect(bus);o.start(now);o.stop(now+duration+.18)}
 function sound(type){if(!ctx)return;const presets={jump:[[330,.13],[440,.19]],step:[[110,.05]],buy:[[440,.11],[660,.2],[880,.3]],equip:[[550,.12]],open:[[390,.12],[520,.2]],close:[[320,.1]],error:[[170,.2],[130,.2]],coin:[[620,.09],[930,.15]]};let delay=0;for(const [f,d] of presets[type]||[]){setTimeout(()=>tone(f,d,type==='step'?'triangle':'sine',type==='step'?.07:.26),delay);delay+=90}}
 audioButton.onclick=()=>{ensureAudio();musicOn=!musicOn;syncVolumes();audioButton.textContent='♫ Música: '+(musicOn?'ON':'OFF')};
 function start(){ensureAudio();shopButton.style.display='none';audioButton.style.display='block';hud.style.display='block'}
 function hide(){shopButton.style.display='none';audioButton.style.display='none';hud.style.display='none';closeShop()}
 let walkSound=0;
 function update(dt,moving,speed){if(!moving||shopOpen)return;walkSound+=dt;if(walkSound>.42){sound('step');walkSound=0}}
 function reward(amount,message){coins+=amount;updateHud();save();sound('coin');showStatus('🪙 +'+amount+' monedas · '+message)}
 function useCloudProfile(data){if(!data||cloudReady)return;coins=Number.isFinite(data.coins)?data.coins:400;owned=new Set(Array.isArray(data.owned)?data.owned:[]);equipped=data.equipped&&typeof data.equipped==='object'?data.equipped:{};cloudReady=true;applyOutfit();updateHud()}window.addEventListener('barbas-profile-ready',e=>useCloudProfile(e.detail));if(window.barbasAccount?.ready&&window.barbasAccount.profile)useCloudProfile(window.barbasAccount.profile);applyOutfit();updateHud();hud.style.display='none';
 return {start,hide,openShop,closeShop,inventory,reward,get shopOpen(){return shopOpen},update,sound,ensureAudio};
}
