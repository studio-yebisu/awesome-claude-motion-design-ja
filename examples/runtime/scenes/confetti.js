export async function create({root,fps}){
  const realRaf=window.requestAnimationFrame,realCancel=window.cancelAnimationFrame;
  let callbacks=new Map(),nextId=0,time=10000,previous=-1;
  const virtualRaf=cb=>{const id=++nextId;callbacks.set(id,cb);return id;};
  window.requestAnimationFrame=virtualRaf;window.cancelAnimationFrame=id=>callbacks.delete(id);
  const {default:confetti}=await import('canvas-confetti');
  window.requestAnimationFrame=realRaf;window.cancelAnimationFrame=realCancel;
  root.innerHTML='<div style="position:absolute;left:40px;top:48px;font:18px JetBrains Mono">ONE SMALL CELEBRATION</div><div style="position:absolute;left:40px;top:203px;font-size:89px;line-height:.95;font-weight:800;letter-spacing:-.04em">You made<br/>something.</div><div style="position:absolute;left:625px;top:225px;font-size:105px;color:#138262">✓</div>';
  const canvas=document.createElement('canvas');canvas.width=960;canvas.height=600;canvas.style.cssText='position:absolute;inset:0;pointer-events:none';root.appendChild(canvas);
  const fire=confetti.create(canvas,{useWorker:false,resize:false});
  const diamond=confetti.shapeFromPath({path:'M0 -8 L5 0 L0 8 L-5 0Z'});
  function reset(){fire.reset();callbacks.clear();previous=-1;time+=10000;}
  const seek=async frame=>{
    window.requestAnimationFrame=virtualRaf;window.cancelAnimationFrame=id=>callbacks.delete(id);
    const random=Math.random;let seed=314159;Math.random=()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296;};
    try{
      if(frame<previous)reset();
      for(let n=previous+1;n<=frame;n++){
        if(n===30)fire({particleCount:115,angle:117,spread:72,startVelocity:39,gravity:.76,decay:.955,ticks:240,origin:{x:.74,y:.52},colors:['#138262','#d2ac5e','#e96c36'],shapes:[diamond,'circle','square'],scalar:1.1,disableForReducedMotion:false});
        for(let sub=0;sub<2;sub++){time+=16.667;const batch=[...callbacks.values()];callbacks.clear();for(const cb of batch)cb(time);}
      }
      previous=frame;
    }finally{Math.random=random;window.requestAnimationFrame=realRaf;window.cancelAnimationFrame=realCancel;}
  };
  return {label:'CANVAS CONFETTI',feature:'Real particle physics, custom path shape, seeded random + virtual 60Hz RAF capture',seek};
}
