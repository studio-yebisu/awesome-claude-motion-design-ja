import Rive from '@rive-app/canvas-advanced';
import wasmUrl from '@rive-app/canvas-advanced/rive.wasm?url';
import assetUrl from '../assets/rocket.riv?url';
export async function create({root,fps}){
  const canvas=document.createElement('canvas');canvas.width=480;canvas.height=400;canvas.style.cssText='position:absolute;left:440px;top:115px;width:480px;height:400px;background:#e5e1d5;border-radius:16px';root.appendChild(canvas);
  const ui=document.createElement('div');ui.innerHTML='<div style="position:absolute;left:40px;top:46px;font:17px JetBrains Mono">ANIMATION / MANUAL ADVANCE</div><h1 style="position:absolute;left:40px;top:145px;font-size:73px;line-height:.95;letter-spacing:-.04em;margin:0">Time is<br/>a control.</h1><div style="position:absolute;left:40px;top:367px;font:17px JetBrains Mono">RIVE TEST ASSET: ROCKET</div><div style="position:absolute;left:40px;top:414px;width:345px;height:3px;background:#b7b2a7"><i id="rive-knob" style="position:absolute;top:-6px;width:15px;height:15px;border-radius:50%;background:#b65a32"></i></div>';root.appendChild(ui);
  const rive=await Rive({locateFile:()=>wasmUrl});const bytes=new Uint8Array(await(await fetch(assetUrl)).arrayBuffer());
  const file=await rive.load(bytes,undefined,false),art=file.defaultArtboard(),renderer=rive.makeRenderer(canvas);
  const animations=Array.from({length:art.animationCount()},(_,i)=>art.animationByIndex(i).name);
  if(!animations.length)throw new Error('Official asset has no animation');
  const selected=animations.includes('Press')?'Press':animations[0];
  const anim=new rive.LinearAnimationInstance(art.animationByName(selected),art);
  const knob=ui.querySelector('#rive-knob');
  return {label:'RIVE RUNTIME',feature:`Advanced Canvas WASM runtime, LinearAnimationInstance ${selected} time/advance/apply; upstream rocket.riv (${animations.join(', ')})`,seek:async frame=>{
    const t=frame/fps,phase=(1-Math.cos(t*Math.PI/4))/2;
    anim.time=phase;anim.advance(0);anim.apply(1);art.advance(0);
    renderer.clear();renderer.save();renderer.align(rive.Fit.contain,rive.Alignment.center,{minX:0,minY:0,maxX:480,maxY:400},art.bounds);art.draw(renderer);renderer.restore();rive.resolveAnimationFrame();
    knob.style.transform=`translateX(${phase*330}px)`;
  }};
}
