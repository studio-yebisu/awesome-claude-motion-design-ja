import {animate,stagger} from 'motion';

export async function create({root,width,height,fps}) {
  root.innerHTML=`<div style="position:absolute;left:62px;top:64px"><div class="mono" style="font-size:16px;color:#6279bb;letter-spacing:3px">INTERRUPTIBLE / CONTINUOUS / CLEAR</div><h1 style="font-size:63px;line-height:1.02;letter-spacing:-2px;margin:23px 0">A small gesture.<br>A complete change.</h1></div><div id="cards" style="position:absolute;left:65px;top:285px;display:flex;gap:18px"><div class="card" style="background:#2f55d4;color:#fff"><span class="mono">01</span><b>PLAN</b><i>↗</i></div><div class="card" style="background:#dce2f0"><span class="mono">02</span><b>BUILD</b><i>↗</i></div><div class="card" style="background:#dce2f0"><span class="mono">03</span><b>SHIP</b><i>↗</i></div></div><div id="pointer" style="position:absolute;top:415px;left:344px;font-size:39px;color:#171c29;z-index:4">↖</div><div id="details" style="position:absolute;left:380px;top:307px;opacity:0"><span class="mono" style="font-size:16px;color:#2f55d4">ONE SOURCE OF TRUTH</span><p style="font-size:27px;line-height:1.4;margin:15px 0">From the first idea<br>to the final frame.</p><div style="height:5px;width:270px;background:#c5cfec;border-radius:9px"><div id="line-progress" style="width:0;height:5px;background:#2f55d4;border-radius:9px"></div></div></div>`;
  const style=document.createElement('style');style.textContent=`.card{width:262px;height:204px;border-radius:18px;padding:24px;position:relative}.card span{font-size:17px;opacity:.65}.card b{display:block;font-size:47px;letter-spacing:-2px;margin-top:18px}.card i{position:absolute;right:22px;bottom:22px;font:30px 'Inter Tight';font-style:normal}`;root.append(style);
  const cards=root.querySelectorAll('.card');
  const controls=animate([
    [root.querySelector('#pointer'),{x:[0,-165,0],y:[0,-55,0]},{duration:1.2,at:.5}],
    [cards[0],{width:[262,830]},{duration:1,at:1.5,ease:[.16,1,.3,1]}],
    [[cards[1],cards[2]],{opacity:[1,0],scale:[1,.8]},{duration:.45,delay:stagger(.05),at:1.45}],
    [root.querySelector('#details'),{opacity:[0,1],x:[25,0]},{duration:.65,at:2.2}],
    [root.querySelector('#line-progress'),{width:[0,270]},{duration:1.4,at:2.9,ease:'easeInOut'}],
    [root.querySelector('#details'),{opacity:0},{duration:.3,at:5.5}],
    [cards[0],{width:262},{duration:1,at:5.8,ease:[.16,1,.3,1]}],
    [[cards[1],cards[2]],{opacity:1,scale:1},{duration:.65,delay:stagger(.08),at:6.35}]
  ],{autoplay:false});controls.pause();
  return {label:'MOTION / SEQUENCE + STAGGER + STATE CHANGE',feature:'animate sequence, motion playback time, stagger, layout dimensions and easing',seek(frame){controls.time=frame/fps;}};
}
