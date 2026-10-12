import {createTimeline,stagger,svg} from 'animejs';

export async function create({root,width,height,fps}) {
  root.style.background='#f2efe8';
  root.innerHTML=`<div style="position:absolute;left:65px;top:65px"><div class="mono" style="font-size:16px;letter-spacing:3px;color:#6279bb">A SEQUENCE / NOT A GUESS</div><h1 style="font-size:69px;line-height:1;letter-spacing:-3px;margin:22px 0">ORDER.<br>THEN FLOW.</h1><p style="font-size:21px;color:#687189">A path becomes a system.</p></div><svg width="960" height="600" style="position:absolute;inset:0"><path id="line" d="M466 391 C430 320 574 329 563 242 S703 168 752 247 S855 378 806 424" fill="none" stroke="#2f55d4" stroke-width="4" stroke-linecap="round"/></svg><div id="dots" style="position:absolute;left:460px;top:205px;width:362px;display:grid;grid-template-columns:repeat(7,1fr);gap:18px"></div>`;
  const grid=root.querySelector('#dots');
  for(let i=0;i<42;i++){const dot=document.createElement('i');dot.className='dot';dot.style.cssText='width:28px;height:28px;border-radius:7px;background:#2f55d4;opacity:0;display:block';grid.append(dot);}
  const timeline=createTimeline({autoplay:false,defaults:{ease:'out(3)'}});
  timeline.add(svg.createDrawable(root.querySelector('#line')),{draw:['0 0','0 1'],duration:2100},0);
  timeline.add(root.querySelectorAll('.dot'),{opacity:[0,.9],scale:[.2,1],rotate:[-45,0],duration:800,delay:stagger(35,{grid:[7,6],from:'center'})},1100);
  timeline.add(root.querySelectorAll('.dot'),{borderRadius:['7px','50%'],scale:[1,.55],duration:900,delay:stagger(20,{grid:[7,6],from:'center'})},3300);
  timeline.add(root.querySelectorAll('.dot'),{opacity:0,scale:0,duration:1000,delay:stagger(18,{grid:[7,6],from:'last'})},5900);
  timeline.add(svg.createDrawable(root.querySelector('#line')),{draw:['0 1','0 0'],duration:1500},6400);
  return {label:'ANIME.JS / SVG DRAW + GRID STAGGER',feature:'createTimeline, svg.createDrawable, center-grid stagger, seek',seek(frame){timeline.seek(frame/fps*1000);}};
}
