import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {getAuth,GoogleAuthProvider,signInWithPopup,signInWithRedirect,getRedirectResult,onAuthStateChanged,signOut} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import {getFirestore,doc,getDoc,setDoc} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
const config={apiKey:'AIzaSyDWzuJvzjGZacHfVskYLSq4owidPwIaCw0',authDomain:'barbas-party.firebaseapp.com',projectId:'barbas-party',storageBucket:'barbas-party.firebasestorage.app',messagingSenderId:'823876406954',appId:'1:823876406954:web:a4679d5ead5c734ac88ad3'};
const app=initializeApp(config),auth=getAuth(app),db=getFirestore(app),provider=new GoogleAuthProvider();
const login=document.getElementById('googleLogin'),start=document.getElementById('start'),status=document.getElementById('authStatus'),logout=document.getElementById('logout');
window.barbasAccount={ready:false,user:null,save:null};
start.disabled=true;start.style.opacity='.5';
function report(message){status.textContent=message}
async function loadProfile(user){const ref=doc(db,'players',user.uid);let snapshot;try{snapshot=await getDoc(ref)}catch(e){report('No se pudo leer la partida: revisa Firestore y sus reglas. '+e.code);return}
let data=snapshot.exists()?snapshot.data():null;
if(!data){data={coins:400,owned:[],equipped:{},createdAt:new Date().toISOString()};try{await setDoc(ref,data)}catch(e){report('No se pudo crear la partida: '+e.code);return}}
window.barbasAccount={ready:true,user,profile:data,save:async payload=>{await setDoc(ref,{...payload,updatedAt:new Date().toISOString()},{merge:true})}};
window.dispatchEvent(new CustomEvent('barbas-profile-ready',{detail:data}));
login.style.display='none';logout.style.display='inline-block';start.disabled=false;start.style.opacity='1';report('✓ Sesión iniciada: '+(user.displayName||user.email||'Jugador'))}
onAuthStateChanged(auth,async user=>{window.barbasAccount={ready:false,user:null,save:null};start.disabled=true;start.style.opacity='.5';if(!user){login.style.display='inline-block';logout.style.display='none';report('Inicia sesión con Google para cargar tu partida');return}report('Cargando tu partida...');await loadProfile(user)});
login.addEventListener('click',async()=>{report('Abriendo Google...');try{await signInWithPopup(auth,provider)}catch(e){if(e.code==='auth/popup-blocked'){try{await signInWithRedirect(auth,provider);return}catch(err){report('Error al conectar con Google: '+err.code);return}}report('Error de Google: '+(e.code||e.message)+'. Comprueba el dominio autorizado en Firebase.')}});
logout.addEventListener('click',async()=>{await signOut(auth);location.reload()});
getRedirectResult(auth).catch(e=>report('Error al volver de Google: '+e.code));
