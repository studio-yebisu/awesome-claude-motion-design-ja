import lottie from 'lottie-web';

const constant=k=>({a:0,k});
const animated=(a,b)=>({a:1,k:[{t:0,s:a,e:b,o:{x:.33,y:0},i:{x:.67,y:1}},{t:240,s:b}]});
const stroke={ty:'st',c:constant([.78,.59,.11,1]),o:constant(100),w:constant(3),lc:2,lj:2};

export async function create({root,width,height,fps}) {
  root.innerHTML=`<div style="position:absolute;left:62px;top:62px"><div class="mono" style="font-size:16px;color:#947222;letter-spacing:3px">ONE JSON / TWO RENDERERS</div><h1 style="font-size:58px;line-height:1.1;letter-spacing:-2px;margin:20px 0">Keep the motion.<br>Choose the surface.</h1></div><div id="svg-view" style="position:absolute;left:90px;top:208px;width:320px;height:290px"></div><div id="canvas-view" style="position:absolute;left:550px;top:208px;width:320px;height:290px"></div><div style="position:absolute;left:236px;top:505px;font:16px 'JetBrains Mono';color:#86681e">SVG</div><div style="position:absolute;left:678px;top:505px;font:16px 'JetBrains Mono';color:#86681e">CANVAS</div><div style="position:absolute;left:480px;top:229px;height:250px;border-left:1px solid #d0c8b4"></div>`;
  const shapes=[];
  for(let j=0;j<4;j++)shapes.push({ty:'gr',it:[{ty:'el',p:constant([0,-63]),s:constant([58,120])},{ty:'fl',c:constant([.78,.59,.11,1]),o:constant(86),r:1},{ty:'tr',p:constant([0,0]),a:constant([0,0]),s:constant([100,100]),r:constant(j*90),o:constant(100),sk:constant(0),sa:constant(0)}]});
  shapes.push({ty:'el',p:constant([0,0]),s:constant([38,38])},{ty:'fl',c:constant([.10,.10,.09,1]),o:constant(100),r:1});
  const data={v:'5.13.0',fr:fps,ip:0,op:240,w:320,h:290,nm:'Original orbital mark',ddd:0,assets:[],layers:[
    {ddd:0,ind:1,ty:4,nm:'Orbit',sr:1,ks:{o:constant(100),r:animated([0],[360]),p:constant([160,145,0]),a:constant([0,0,0]),s:constant([100,100,100])},ao:0,shapes,ip:0,op:240,st:0,bm:0},
    {ddd:0,ind:2,ty:4,nm:'Ring',sr:1,ks:{o:constant(100),r:constant(0),p:constant([160,145,0]),a:constant([0,0,0]),s:constant([100,100,100])},ao:0,shapes:[{ty:'el',p:constant([0,0]),s:constant([256,256])},stroke,{ty:'tm',s:constant(0),e:constant(100),o:animated([0],[360]),m:1}],ip:0,op:240,st:0,bm:0}
  ]};
  const renderers=['svg','canvas'];
  const players=renderers.map(renderer=>lottie.loadAnimation({container:root.querySelector(`#${renderer}-view`),renderer,loop:true,autoplay:false,animationData:structuredClone(data)}));
  await Promise.all(players.map(player=>new Promise(resolve=>{if(player.isLoaded)resolve();else player.addEventListener('DOMLoaded',resolve);} )));
  return {label:'LOTTIE WEB / ORIGINAL JSON, SVG + CANVAS',feature:'loadAnimation, original vector JSON, SVG and Canvas renderers, goToAndStop',animationData:data,seek(frame){players.forEach(player=>player.goToAndStop(frame,true));}};
}
