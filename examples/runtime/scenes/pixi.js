import {Application,Container,Sprite,Texture,Graphics,ColorMatrixFilter} from 'pixi.js';

export async function create({root,width,height,fps}) {
  root.style.background='#0e0f12';
  root.innerHTML=`<div style="position:absolute;top:64px;left:64px;z-index:3;color:#e9e6df"><span class="mono" style="font-size:16px;color:#bc993b;letter-spacing:3px">PARTICLES / WITH INTENT</span><h1 style="font-size:58px;line-height:1;letter-spacing:-2px;margin:18px 0">Chaos finds a form.</h1></div><div id="canvas" style="position:absolute;inset:0"></div>`;
  const app=new Application();await app.init({width,height,antialias:true,autoStart:false,preference:'webgl',backgroundAlpha:0,preserveDrawingBuffer:true});
  root.querySelector('#canvas').append(app.canvas);app.ticker.stop();
  const field=new Container();app.stage.addChild(field);
  const mask=document.createElement('canvas');mask.width=720;mask.height=250;const ctx=mask.getContext('2d');
  ctx.fillStyle='#fff';ctx.font='800 215px "Inter Tight"';ctx.textAlign='center';ctx.fillText('FORM',360,215);
  const img=ctx.getImageData(0,0,720,250).data,targets=[];
  for(let y=15;y<235;y+=12)for(let x=10;x<710;x+=12)if(img[(y*720+x)*4+3]>140)targets.push([x+120,y+240]);
  const sprites=targets.map((target,i)=>{const sprite=new Sprite(Texture.WHITE);sprite.width=7;sprite.height=7;sprite.anchor.set(.5);sprite.tint=[0xc9971c,0xeadbb0,0x76591a][i%3];field.addChild(sprite);return {sprite,target,phase:i*.137,start:[70+(i*137)%820,240+(i*53)%267]};});
  const rule=new Graphics().moveTo(64,514).lineTo(896,514).stroke({color:0x625438,width:1});app.stage.addChild(rule);
  const filter=new ColorMatrixFilter();field.filters=[filter];
  const ease=p=>1-Math.pow(1-Math.max(0,Math.min(1,p)),3);
  return {label:'PIXIJS / SPRITE FIELD + GPU FILTER',dark:true,feature:'Application, Sprite textures, Container, GPU ColorMatrixFilter, manual render',seek(frame){
    const t=frame/fps;let p=t<3.5?ease((t-.3)/2.3):t<5.5?1:ease((7.6-t)/2);
    filter.reset();filter.hue(Math.sin(t/8*Math.PI*2)*18,false);
    sprites.forEach(({sprite,target,start,phase})=>{const drift=1-p;sprite.x=start[0]+(target[0]-start[0])*p+Math.sin(t*2+phase)*12*drift;sprite.y=start[1]+(target[1]-start[1])*p+Math.cos(t*1.6+phase)*9*drift;sprite.rotation=drift*(phase+t);sprite.alpha=.45+.55*p;});
    app.render();
  }};
}
