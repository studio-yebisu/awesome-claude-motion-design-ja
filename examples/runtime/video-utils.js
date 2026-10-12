export async function loadVideo(url){
  const video=document.createElement('video');video.muted=true;video.playsInline=true;video.preload='auto';
  await new Promise((resolve,reject)=>{video.addEventListener('loadeddata',resolve,{once:true});video.addEventListener('error',()=>reject(new Error(`Video decode ${video.error?.code}: ${video.error?.message}`)),{once:true});video.src=url;});
  video.pause();return video;
}
export async function seekVideo(video,time){
  if(Math.abs(video.currentTime-time)<.0001)return;
  await new Promise((resolve,reject)=>{video.addEventListener('seeked',resolve,{once:true});video.addEventListener('error',reject,{once:true});video.currentTime=Math.min(time,video.duration-.001);});
}
export function artifact(bytes,filename){
  let binary='';for(let n=0;n<bytes.length;n+=8192)binary+=String.fromCharCode(...bytes.subarray(n,n+8192));
  window.__producedMedia={filename,base64:btoa(binary)};
}
