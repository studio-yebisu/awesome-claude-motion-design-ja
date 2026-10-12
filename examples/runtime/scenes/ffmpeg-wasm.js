import {FFmpeg} from '@ffmpeg/ffmpeg';
import coreURL from '@ffmpeg/core?url';
import wasmURL from '@ffmpeg/core/wasm?url';
import {loadVideo,seekVideo,artifact} from '../video-utils.js';
export async function create({root,fps}){
  const original=new Uint8Array(await(await fetch('/source.mp4')).arrayBuffer());
  const ffmpeg=new FFmpeg();await ffmpeg.load({coreURL,wasmURL});await ffmpeg.writeFile('source.mp4',original.slice());
  const command=['-i','source.mp4','-vf','hue=h=105:s=.8,scale=420:262','-c:v','libx264','-preset','ultrafast','-crf','21','-an','result.mp4'];
  const exit=await ffmpeg.exec(command);if(exit!==0)throw new Error('WASM FFmpeg failed: '+exit);
  const result=await ffmpeg.readFile('result.mp4');if(!(result instanceof Uint8Array))throw new Error('No encoded bytes');
  artifact(result,'processed.mp4');window.__processingProof={engine:'@ffmpeg/core 0.12.10 (WASM)',command,exit,inputBytes:original.length,outputBytes:result.length};
  const a=await loadVideo(URL.createObjectURL(new Blob([original],{type:'video/mp4'}))),b=await loadVideo(URL.createObjectURL(new Blob([result],{type:'video/mp4'})));
  root.innerHTML='<div style="position:absolute;left:40px;top:46px;font:17px JetBrains Mono">ACTUAL BROWSER TRANSCODE</div><h1 style="position:absolute;left:37px;top:83px;font-size:62px;line-height:1;letter-spacing:-.035em;margin:0">Same frames. New colour.</h1><div style="position:absolute;left:40px;top:447px;font:16px JetBrains Mono">SOURCE / FFMPEG SIGNAL</div><div style="position:absolute;left:500px;top:447px;font:16px JetBrains Mono">WASM OUTPUT / HUE + SCALE</div>';
  a.style.cssText='position:absolute;left:40px;top:180px;width:420px;height:262px;border-radius:8px';b.style.cssText='position:absolute;left:500px;top:180px;width:420px;height:262px;border-radius:8px';root.append(a,b);ffmpeg.terminate();
  return {label:'FFMPEG.WASM',feature:'Real WASM load/writeFile/exec/readFile; original procedural input, hue + scale + H.264 transcode; before/after playback',seek:async f=>{await Promise.all([seekVideo(a,f/fps),seekVideo(b,f/fps)]);}};
}
