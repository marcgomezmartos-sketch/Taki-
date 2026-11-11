import * as T from 'three';
export function iniciarExtras({player,model,head,showStatus}){
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
 let saved={};try{saved=JSON.parse(localStorage.getItem(key)||'{}')||{}}catch{}
 let coins=Number.isFinite(saved.coins)?saved.coins:400,owned=new Set(Array.isArray(saved.owned)?saved.owned:[]),equipped=saved.equipped||{};
 const save=()=>{try{localStorage.setItem(key,JSON.stringify({coins,owned:[...owned],equipped}))}catch{}};
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
 function applyOutfit(){accessories.clear();headwear.clear();for(const kind of ['cap','jacket','pants','shoes']){const it=inventory.find(x=>x.id===equipped[kind]);if(!it)continue;const c=it.color;if(kind==='cap'){const cap=new T.Mesh(new T.SphereGeometry(1,24,12,0,Math.PI*2,0,Math.PI/2),new T.MeshStandardMaterial({color:c,roughness:.94}));cap.scale.set(.314,.165,.29);cap.position.set(0,.29,-.012);headwear.add(cap);itemMesh(new T.BoxGeometry(.42,.028,.22),c,0,.29,.29,headwear)}if(kind==='jacket'){itemMesh(new T.BoxGeometry(.79,.7,.53),c,0,1.73,0);for(const x of [-.49,.49])itemMesh(new T.BoxGeometry(.23,.66,.3),c,x,1.65,0)}if(kind==='pants'){for(const x of [-.18,.18])itemMesh(new T.BoxGeometry(.29,.68,.34),c,x,.62,0)}if(kind==='shoes'){for(const x of [-.19,.19])itemMesh(new T.BoxGeometry(.35,.19,.52),c,x,.13,.09)}}}
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
 applyOutfit();updateHud();hud.style.display='none';
 return {start,hide,openShop,closeShop,inventory,reward,get shopOpen(){return shopOpen},update,sound,ensureAudio};
}
