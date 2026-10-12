// Original code-directed film applying the reference collection's seek(t) build method.
export async function create({root,fps}){
  const c=document.createElement('canvas');c.width=960;c.height=600;root.appendChild(c);const g=c.getContext('2d');
  const ease=x=>{x=Math.min(1,Math.max(0,x));return x*x*(3-2*x);};
  const keys=[['A line becomes a world.','BRIEF / ORIGINAL STUDY'],['A world follows a clock.','BUILD / SEEK(T)'],['Every frame has a place.','RENDER / CODE-DIRECTED']];
  return {label:'OPUS VIDEO PROMPTS / METHOD STUDY',dark:true,feature:'Original Canvas film inspired by the reference collection: explicit beat map, seek(time), persistent visual, coded render; reference is not an engine',seek:async frame=>{
    const t=frame/fps;g.fillStyle='#141b27';g.fillRect(0,0,960,600);
    const stage=t<2.7?0:t<5.3?1:2,alpha=t<7.2?1:1-ease((t-7.2)/.65);
    g.globalAlpha=alpha;g.fillStyle='#e7bc78';g.font='16px "JetBrains Mono"';g.fillText('REFERENCE-INSPIRED / ORIGINAL CANVAS FILM',40,56);
    g.fillStyle='#f2efe8';g.font='800 54px "Inter Tight"';g.fillText(keys[stage][0],40,129);g.font='16px "JetBrains Mono"';g.fillStyle='#e7bc78';g.fillText(keys[stage][1],40,165);
    const spread=ease((t-.7)/1.7)*(1-ease((t-6.2)/1));
    const morph=ease((t-2.7)/1.1)*(1-ease((t-6.2)/1));
    for(let i=0;i<37;i++){
      const x=110+i*20,y=360+Math.sin(i*.24+t*Math.PI/4)*75*spread;
      const radius=3+Math.sin(i*.34)**2*morph*9;
      g.fillStyle=i%6===0?'#f2efe8':'#e7bc78';g.beginPath();g.arc(x,y,radius,0,Math.PI*2);g.fill();
      if(i>0){g.strokeStyle='#dfac6555';g.beginPath();g.moveTo(x-20,360+Math.sin((i-1)*.24+t*Math.PI/4)*75*spread);g.lineTo(x,y);g.stroke();}
    }
    g.fillStyle='#f2efe8';g.font='20px "Inter Tight"';g.fillText('An explicit brief, a timed scene, a real render.',40,505);g.globalAlpha=1;
  }};
}
