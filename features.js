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
 const overlay=document.createElement('section');overlay.id='shopOverlay';overlay.innerHTML='<div class="shopHead"><h2>🛍️ TK SHOP</h2><button id="closeShop">✕ CERRAR</button></div><p>Compra ropa con monedas que ganas explorando.</p><strong id="shopBalance"></strong><div class="shopGrid"></div>';document.body.append(overlay);
 const updateHud=()=>{hud.textContent='🪙 '+coins+' monedas';overlay.querySelector('#shopBalance').textContent='Saldo: '+coins+' 🪙'};
 const accessories=new T.Group();model.add(accessories);const headwear=new T.Group();(head||model).add(headwear);
 function itemMesh(geo,color,x,y,z,parent=accessories){const m=new T.Mesh(geo,new T.MeshStandardMaterial({color,roughness:.92}));m.position.set(x,y,z);parent.add(m);return m}
 function applyOutfit(){accessories.clear();headwear.clear();for(const kind of ['cap','jacket','pants','shoes']){const it=inventory.find(x=>x.id===equipped[kind]);if(!it)continue;const c=it.color;if(kind==='cap'){const cap=new T.Mesh(new T.SphereGeometry(1,24,12,0,Math.PI*2,0,Math.PI/2),new T.MeshStandardMaterial({color:c,roughness:.94}));cap.scale.set(.314,.165,.29);cap.position.set(0,.29,-.012);headwear.add(cap);itemMesh(new T.BoxGeometry(.42,.028,.22),c,0,.29,.29,headwear)}if(kind==='jacket'){itemMesh(new T.BoxGeometry(.79,.7,.53),c,0,1.73,0);for(const x of [-.49,.49])itemMesh(new T.BoxGeometry(.23,.66,.3),c,x,1.65,0)}if(kind==='pants'){for(const x of [-.18,.18])itemMesh(new T.BoxGeometry(.29,.68,.34),c,x,.62,0)}if(kind==='shoes'){for(const x of [-.19,.19])itemMesh(new T.BoxGeometry(.35,.19,.52),c,x,.13,.09)}}}
 let selectedItem=null;function drawShop(){const grid=overlay.querySelector('.shopGrid');grid.replaceChildren();for(const it of inventory){if(selectedItem&&it.id!==selectedItem)continue;const card=document.createElement('div');card.className='product';card.dataset.itemId=it.id;const emoji=document.createElement('div');emoji.className='emoji';emoji.textContent=it.emoji;const name=document.createElement('b');name.textContent=it.name;const price=document.createElement('small');price.textContent=it.price+' 🪙';const btn=document.createElement('button');const have=owned.has(it.id),wearing=equipped[it.kind]===it.id;btn.textContent=wearing?'✓ EQUIPADO':have?'PONER':'COMPRAR';btn.disabled=wearing;btn.onclick=()=>{if(!owned.has(it.id)){if(coins<it.price){showStatus('No tienes monedas suficientes');sound('error');return}coins-=it.price;owned.add(it.id);sound('buy')}else sound('equip');equipped[it.kind]=it.id;applyOutfit();save();updateHud();drawShop()};card.append(emoji,name,price,btn);grid.append(card)}}
 let shopOpen=false;
 function openShop(itemId){if(!itemId)return;selectedItem=itemId;shopOpen=true;overlay.style.display='flex';drawShop();updateHud();sound('open')}
 function closeShop(){shopOpen=false;selectedItem=null;overlay.style.display='none';sound('close')}
 shopButton.onclick=()=>showStatus('Entra en TK SHOP para comprar ropa');overlay.querySelector('#closeShop').onclick=closeShop;
 let ctx,master,musicTimer,musicOn=true,step=0;
 // Original cozy village-inspired melody: gentle marimba, soft chords and light bass.
 const melody=[392,440,523.25,587.33,523.25,440,392,329.63,349.23,392,440,493.88,440,392,349.23,329.63,392,440,523.25,659.25,587.33,523.25,440,392,349.23,392,440,523.25,440,392,329.63,293.66];
 const chords=[[261.63,329.63,392],[220,261.63,329.63],[174.61,220,261.63],[196,246.94,293.66]];
 let ambience;
 function ensureAudio(){if(!ctx){ctx=new (window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=.21;master.connect(ctx.destination);const buffer=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.16;const noise=ctx.createBufferSource();noise.buffer=buffer;noise.loop=true;const low=ctx.createBiquadFilter();low.type='lowpass';low.frequency.value=320;ambience=ctx.createGain();ambience.gain.value=.018;noise.connect(low);low.connect(ambience);ambience.connect(master);noise.start()}if(ctx.state==='suspended')ctx.resume();if(!musicTimer)musicTimer=setInterval(()=>{if(!musicOn||!ctx)return;const beat=step%8,n=melody[step%melody.length],ch=chords[Math.floor(step/8)%4];if(step%2===0)tone(n,.24,'triangle',.13);if(beat===0){for(const f of ch)tone(f,1.2,'sine',.055);tone(ch[0]/2,.35,'triangle',.19)}if(beat===4)tone(ch[0]/2,.29,'triangle',.15);if(beat===0||beat===4)kick();if(beat===2||beat===6)snare();if(beat%2===1)hat();step++},215)}
 function tone(freq,duration,type='sine',volume=.25){if(!ctx)return;const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.0001,ctx.currentTime);g.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),ctx.currentTime+.012);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+duration);o.connect(g);g.connect(master);o.start();o.stop(ctx.currentTime+duration+.02)}
 function kick(){if(!ctx)return;const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(130,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(48,ctx.currentTime+.12);g.gain.setValueAtTime(.19,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.15);o.connect(g);g.connect(master);o.start();o.stop(ctx.currentTime+.16)}
 function hat(){tone(1800,.035,'square',.013)}
 function snare(){tone(260,.07,'triangle',.09);tone(1350,.05,'square',.014)}
 function sound(type){if(!ctx)return;const presets={jump:[[330,.13],[440,.19]],step:[[110,.05]],buy:[[440,.11],[660,.2],[880,.3]],equip:[[550,.12]],open:[[390,.12],[520,.2]],close:[[320,.1]],error:[[170,.2],[130,.2]],coin:[[620,.09],[930,.15]]};let delay=0;for(const [f,d] of presets[type]||[]){setTimeout(()=>tone(f,d,type==='step'?'triangle':'sine',type==='step'?.07:.26),delay);delay+=90}}
 audioButton.onclick=()=>{ensureAudio();musicOn=!musicOn;if(ambience)ambience.gain.value=musicOn?.02:0;audioButton.textContent='♫ Música: '+(musicOn?'ON':'OFF')};
 function start(){ensureAudio();shopButton.style.display='none';audioButton.style.display='block';hud.style.display='block'}
 function hide(){shopButton.style.display='none';audioButton.style.display='none';hud.style.display='none';closeShop()}
 let walkSound=0;
 function update(dt,moving,speed){if(!moving||shopOpen)return;walkSound+=dt;if(walkSound>.42){sound('step');walkSound=0}}
 function reward(amount,message){coins+=amount;updateHud();save();sound('coin');showStatus('🪙 +'+amount+' monedas · '+message)}
 applyOutfit();updateHud();hud.style.display='none';
 return {start,hide,openShop,closeShop,inventory,reward,get shopOpen(){return shopOpen},update,sound,ensureAudio};
}
