// Profile and party interface for Barbas Minigames.
export function installSocial({extras,avatar}){
 const css=document.createElement('style');css.textContent=`
 #barbasSocial{position:fixed;inset:0;z-index:145;display:none;align-items:center;justify-content:center;background:#091b38eb;padding:16px;font-family:system-ui;color:#fff}
 #barbasSocial.open{display:flex}#barbasSocial .socialPanel{position:relative;width:min(94vw,640px);max-height:88vh;overflow:auto;border:3px solid #a1f4ff;border-radius:27px;background:linear-gradient(150deg,#284c9a,#182e64 60%,#102047);box-shadow:0 15px 0 #091631,0 30px 70px #061226;padding:22px}
 #barbasSocial h2{margin:0 0 7px;font-size:clamp(24px,6vw,35px);color:#ffe483}#barbasSocial p{font-size:13px;color:#d2edff}
 #barbasSocial .socialClose{position:absolute;right:13px;top:12px;background:#e9f5ff;color:#21355c;border-radius:12px;padding:9px 13px}
 #barbasSocial .profileLayout{display:grid;grid-template-columns:42% 1fr;gap:14px;margin-top:16px}
 #barbasSocial .portrait{min-height:275px;border:2px solid #8edbf6;border-radius:18px;background:radial-gradient(circle at 50% 36%,#7ddcf9,#2656a0 75%);display:flex;align-items:center;justify-content:center;overflow:hidden}
 #barbasSocial .portrait img{width:100%;height:100%;max-height:360px;object-fit:contain}
 #barbasSocial .stats{display:grid;gap:9px}#barbasSocial .stat{background:#ffffff18;border:1px solid #ffffff38;border-radius:14px;padding:12px;font-size:13px}
 #barbasSocial .stat b{display:block;color:#ffe483;font-size:22px}#barbasSocial label{display:block;margin-top:12px;font-weight:800}
 #barbasSocial input{width:100%;background:#f5f9ff;color:#17294d;border:2px solid #91dfff;border-radius:12px;padding:13px;font:700 16px system-ui;touch-action:auto}
 #barbasSocial .socialBtn{margin-top:10px;background:#ffd352;color:#1a3264;border:2px solid white;border-radius:13px;font:900 15px system-ui;padding:12px 16px}
 #barbasSocial .muted{color:#bbd8ef;font-size:12px}#barbasSocial .partyBox{background:#ffffff16;border:1px solid #ffffff50;border-radius:16px;padding:14px;margin:13px 0}
 @media(max-width:400px){#barbasSocial .profileLayout{grid-template-columns:40% 1fr}#barbasSocial .portrait{min-height:235px}#barbasSocial .socialPanel{padding:16px}#barbasSocial .stat{padding:8px}}
 `;document.head.append(css);
 const panel=document.createElement('div');panel.id='barbasSocial';document.body.append(panel);
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let stats={name:'Jugador',wins:0,matches:0},loadedUser=null,writeQueue=Promise.resolve();
 const persist=()=>{const account=window.barbasAccount;if(!account?.ready||!account.save)return;const payload={displayName:stats.name,wins:stats.wins,matches:stats.matches};writeQueue=writeQueue.catch(()=>{}).then(()=>account.save(payload)).catch(e=>console.warn('Profile save:',e))};
 function load(data){const account=window.barbasAccount;if(!account?.user||loadedUser===account.user.uid)return;loadedUser=account.user.uid;stats={name:(typeof data.displayName==='string'&&data.displayName.trim())?data.displayName.trim().slice(0,18):(account.user.displayName||'Jugador').slice(0,18),wins:Math.max(0,Number(data.wins)||0),matches:Math.max(0,Number(data.matches)||0)};if(panel.classList.contains('open'))render(panel.dataset.tab)}
 window.addEventListener('barbas-profile-ready',e=>load(e.detail));if(window.barbasAccount?.ready)load(window.barbasAccount.profile||{});
 window.barbasPlayerName=()=>stats.name;
 window.barbasRecordMatch=won=>{stats.matches++;if(won)stats.wins++;persist()};
 function render(tab){
  panel.dataset.tab=tab;
  if(tab==='profile'){
   const coins=document.querySelector('#coinsHud')?.textContent||'Monedas';
   panel.innerHTML='<div class="socialPanel"><button class="socialClose">✕</button><h2>MI PERFIL</h2><p>Tu personaje, tu nombre y tus logros.</p><div class="profileLayout"><div class="portrait" id="socialPortrait"><span>Cargando personaje…</span></div><div class="stats"><div class="stat">NOMBRE<b>'+esc(stats.name)+'</b></div><div class="stat">VICTORIAS<b>'+stats.wins+'</b></div><div class="stat">PARTIDAS<b>'+stats.matches+'</b></div><div class="stat">DINERO<b>'+esc(coins)+'</b></div></div></div><label for="socialName">Cambiar nombre (gratis, siempre)</label><input id="socialName" maxlength="18" placeholder="Tu nombre" value="'+esc(stats.name)+'"><button class="socialBtn" id="socialSave">GUARDAR NOMBRE</button><p class="muted" id="socialMessage">Tu nombre aparecerá en las partidas y celebraciones.</p></div>';
   const img=avatar?.();if(img){const portrait=panel.querySelector('#socialPortrait');portrait.innerHTML='<img alt="Tu skin actual" src="'+img+'">'}
   panel.querySelector('#socialSave').onclick=()=>{const input=panel.querySelector('#socialName'),name=input.value.trim().replace(/[<>]/g,'').slice(0,18);if(name.length<2){panel.querySelector('#socialMessage').textContent='Escribe al menos 2 caracteres';return}stats.name=name;persist();render('profile');panel.querySelector('#socialMessage').textContent='Nombre actualizado gratis'};
  }else{
   panel.innerHTML='<div class="socialPanel"><button class="socialClose">✕</button><h2>GRUPO Y AMIGOS</h2><p>Prepara tu equipo para cuando llegue el multijugador.</p><div class="partyBox"><h3>INVITAR A AMIGOS</h3><p>Comparte Barbas Minigames para que tus amigos puedan entrar.</p><button class="socialBtn" id="socialInvite">COMPARTIR INVITACIÓN</button></div><div class="partyBox"><h3>MI GRUPO</h3><p>El sistema de salas y grupos online todavía no está conectado. Aquí podrás crear un grupo y aceptar invitaciones cuando esté disponible.</p></div><div class="partyBox"><h3>MIS AMIGOS</h3><p>La lista de amigos necesita el servicio online; aún no hay solicitudes ni amigos sincronizados.</p></div><p class="muted" id="socialMessage"></p></div>';
   panel.querySelector('#socialInvite').onclick=async()=>{const url='https://marcgomezmartos-sketch.github.io/Taki-/';try{if(navigator.share)await navigator.share({title:'Barbas Minigames',text:'¡Ven a jugar a Barbas Minigames!',url});else if(navigator.clipboard){await navigator.clipboard.writeText(url);panel.querySelector('#socialMessage').textContent='Enlace copiado'}else panel.querySelector('#socialMessage').textContent=url}catch(e){if(e.name!=='AbortError')panel.querySelector('#socialMessage').textContent=url}};
  }
  panel.querySelector('.socialClose').onclick=close;
 }
 function open(tab){render(tab);panel.classList.add('open')}
 function close(){panel.classList.remove('open')}
 return {open,close};
}
