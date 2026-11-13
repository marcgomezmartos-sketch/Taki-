import * as T from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {SSAOPass} from 'three/addons/postprocessing/SSAOPass.js';

// V55: adaptive cinematic graphics, prioritizing stable mobile frame times.
export function createGraphics(renderer,scene,camera){
 const mobile=/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);
 const maxPixelRatio=mobile?Math.min(devicePixelRatio,1):Math.min(devicePixelRatio,1.4);
 renderer.setPixelRatio(maxPixelRatio);
 renderer.outputColorSpace=T.SRGBColorSpace;
 renderer.toneMapping=T.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.14;
 renderer.shadowMap.enabled=true;
 renderer.shadowMap.type=T.PCFSoftShadowMap;
 renderer.shadowMap.autoUpdate=false;
 const composer=mobile?null:new EffectComposer(renderer);
 if(composer)composer.addPass(new RenderPass(scene,camera));
 let ao=null;
 if(!mobile&&composer){
  try{
   ao=new SSAOPass(scene,camera,Math.max(1,Math.round(innerWidth*.7)),Math.max(1,Math.round(innerHeight*.7)));
   ao.kernelRadius=7;ao.minDistance=.004;ao.maxDistance=.12;
   composer.addPass(ao);
  }catch(e){console.warn('SSAO disabled',e)}
 }
 const bloom=composer?new UnrealBloomPass(new T.Vector2(innerWidth,innerHeight),.14,.25,.96):null;
 if(composer){composer.addPass(bloom);composer.addPass(new OutputPass())}
 function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h);if(composer)composer.setSize(w,h);if(ao)ao.setSize(Math.round(w*.7),Math.round(h*.7));if(bloom)bloom.setSize(w,h)}
 resize();
 // Small ground-hugging particles, using one GPU point cloud.
 const count=mobile?22:85;
 const positions=new Float32Array(count*3),seeds=new Float32Array(count*3);
 let seed=271828;
 const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 for(let i=0;i<count;i++){seeds[i*3]=rand()*Math.PI*2;seeds[i*3+1]=rand()*2;seeds[i*3+2]=rand();positions[i*3]=(rand()-.5)*48;positions[i*3+1]=.35+rand()*5;positions[i*3+2]=(rand()-.5)*48}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(positions,3));
 const dust=new T.Points(geo,new T.PointsMaterial({color:'#ffe3ad',size:mobile?.09:.11,transparent:true,opacity:.33,depthWrite:false,sizeAttenuation:true,blending:T.AdditiveBlending}));
 dust.frustumCulled=false;scene.add(dust);
 const kickCount=mobile?10:22,kickPos=new Float32Array(kickCount*3),kickLife=new Float32Array(kickCount);
 const kickGeo=new T.BufferGeometry();kickGeo.setAttribute('position',new T.BufferAttribute(kickPos,3));
 const kicks=new T.Points(kickGeo,new T.PointsMaterial({color:'#d2bc98',size:.095,transparent:true,opacity:.58,depthWrite:false}));
 kicks.frustumCulled=false;scene.add(kicks);
 let tick=0,spawn=0;
 function update(dt,player,moving,mode){
  tick+=dt;
  const arr=geo.attributes.position.array;
  const cx=player.position.x,cz=player.position.z;
  for(let i=0;i<count;i++){const j=i*3;arr[j]=cx+Math.sin(seeds[j]+tick*.09)*(12+seeds[j+2]*12);arr[j+1]=.55+seeds[j+1]*2.3+Math.sin(tick*.6+seeds[j])*.22;arr[j+2]=cz+Math.cos(seeds[j]*1.7+tick*.06)*(12+seeds[j+2]*12)}
  geo.attributes.position.needsUpdate=true;
  if(mode!=='city'){dust.visible=false;kicks.visible=false;return}
  dust.visible=true;kicks.visible=true;
  for(let i=0;i<kickCount;i++){const j=i*3;if(kickLife[i]>0){kickLife[i]-=dt;kickPos[j+1]+=.36*dt;kickPos[j]+=Math.sin(i*3.7)*dt*.32;kickPos[j+2]+=Math.cos(i*2.7)*dt*.32}else kickPos[j+1]=-100}
  spawn+=dt;if(moving&&spawn>.055){spawn=0;const i=Math.floor(rand()*kickCount),j=i*3;kickLife[i]=.42+rand()*.35;kickPos[j]=cx+(rand()-.5)*.4;kickPos[j+1]=.08;kickPos[j+2]=cz+(rand()-.5)*.4}
  kickGeo.attributes.position.needsUpdate=true;
 }
 return {render(){if(composer)composer.render();else renderer.render(scene,camera)},resize,update};
}
