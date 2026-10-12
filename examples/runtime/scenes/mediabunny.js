import {Output,BufferTarget,WebMOutputFormat,CanvasSource,Input,BufferSource,ALL_FORMATS} from 'mediabunny';
import {loadVideo,seekVideo,artifact} from '../video-utils.js';
export async function create({root,fps}){
  const canvas=document.createElement('canvas');canvas.width=960;canvas.height=600;const ctx=canvas.getContext('2d');
  const target=new BufferTarget(),output=new Output({format:new WebMOutputFormat(),target});
  const source=new CanvasSource(canvas,{codec:'vp9',bitrate:1_600_000});output.addVideoTrack(source,{frameRate:fps});await output.start();
  for(let frame=0;frame<240;frame++){
    const t=frame/fps;ctx.fillStyle='#102323';ctx.fillRect(0,0,960,600);
    ctx.fillStyle='#f2efe8';ctx.font='800 65px "Inter Tight"';ctx.fillText('From canvas',40,130);ctx.fillText('to a real file.',40,195);
    for(let i=0;i<26;i++){
      const a=i*Math.PI*2/26+t*Math.PI/4,r=130+Math.sin(i*.7+t*Math.PI/4)*42;
      ctx.fillStyle=i%3===0?'#f2cb7e':'#70b6a9';ctx.beginPath();ctx.arc(675+Math.cos(a)*r,330+Math.sin(a)*r,8+i%4*2,0,Math.PI*2);ctx.fill();
    }
    ctx.strokeStyle='#77b4a8';ctx.lineWidth=2;ctx.beginPath();ctx.arc(675,330,205,0,Math.PI*2);ctx.stroke();
    ctx.font='16px "JetBrains Mono"';ctx.fillStyle='#c5d6d3';ctx.fillText('MEDIABUNNY / CANVASSOURCE → VP9 / WEBM',40,567);
    ctx.font='22px "JetBrains Mono"';ctx.fillText('240 FRAMES / 30 FPS',40,470);
    await source.add(frame/fps,1/fps);
  }
  source.close();await output.finalize();const bytes=new Uint8Array(target.buffer);
  const input=new Input({source:new BufferSource(bytes),formats:ALL_FORMATS});const duration=await input.computeDuration();const track=await input.getPrimaryVideoTrack();
  if(duration<7.99||!track)throw new Error('Mediabunny readback failed');
  window.__processingProof={codec:track.codec,duration,bytes:bytes.length,frames:240,encoder:'WebCodecs via Mediabunny CanvasSource',readback:true};
  artifact(bytes,'encoded.webm');
  const video=await loadVideo(URL.createObjectURL(new Blob([bytes],{type:'video/webm'})));video.style.cssText='position:absolute;inset:0;width:960px;height:600px';root.appendChild(video);
  return {label:'MEDIABUNNY',dark:true,feature:'CanvasSource real VP9 encoding, BufferTarget/WebM mux, Input duration/track readback, rendered output playback',seek:async f=>seekVideo(video,f/fps)};
}
