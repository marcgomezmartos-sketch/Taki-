 const captureProfileAvatar=()=>{
  try{
   const oldPos=camera.position.clone(),oldQuat=camera.quaternion.clone(),oldAspect=camera.aspect,oldTarget=renderer.getRenderTarget();
   const rt=new T.WebGLRenderTarget(256,440,{depthBuffer:true});
   const yaw=visual.rotation.y;camera.aspect=256/440;camera.updateProjectionMatrix();
   camera.position.copy(player.position).add(new T.Vector3(Math.sin(yaw)*4.8,2.5,Math.cos(yaw)*4.8));
   camera.lookAt(player.position.x,player.position.y+1.25,player.position.z);
   renderer.setRenderTarget(rt);renderer.render(scene,camera);
   const pixels=new Uint8Array(256*440*4);renderer.readRenderTargetPixels(rt,0,0,256,440,pixels);
   const cv=document.createElement('canvas');cv.width=256;cv.height=440;const ctx=cv.getContext('2d');
   const img=ctx.createImageData(256,440);
   for(let y=0;y<440;y++)img.data.set(pixels.subarray((439-y)*256*4,(440-y)*256*4),y*256*4);
   ctx.putImageData(img,0,0);const url=cv.toDataURL('image/png');
   renderer.setRenderTarget(oldTarget);rt.dispose();camera.position.copy(oldPos);camera.quaternion.copy(oldQuat);camera.aspect=oldAspect;camera.updateProjectionMatrix();
   return url;
  }catch(e){return null}
 };
 const social=installSocial({extras,avatar:captureProfileAvatar});
