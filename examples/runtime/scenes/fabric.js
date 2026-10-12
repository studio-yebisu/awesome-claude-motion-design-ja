import {Canvas,Rect,Circle,Textbox,Group} from 'fabric';

export async function create({root,width,height,fps}) {
  root.style.background='#f2efe8';
  root.innerHTML=`<canvas></canvas><div class="mono" style="position:absolute;right:60px;top:76px;z-index:5;color:#816b30;font-size:16px">OBJECTS → GROUP → SVG</div><div id="svg-note" style="position:absolute;left:60px;bottom:100px;font:15px 'JetBrains Mono';color:#816b30">select: 3 objects</div>`;
  const canvas=new Canvas(root.querySelector('canvas'),{width,height,backgroundColor:'#f2efe8',selection:true,renderOnAddRemove:false});
  const title=new Textbox('MAKE IT\nEDITABLE.',{left:60,top:85,width:340,originX:'left',originY:'top',fontFamily:'Inter Tight',fontSize:68,fontWeight:800,lineHeight:.9,fill:'#161514',selectable:false});
  const subtitle=new Textbox('One object model.\nEvery part stays in reach.',{left:63,top:304,width:330,originX:'left',originY:'top',fontFamily:'Inter Tight',fontSize:21,fill:'#766c52',lineHeight:1.45,selectable:false});
  canvas.add(title,subtitle);
  const rect=new Rect({left:-108,top:-68,width:176,height:134,rx:18,ry:18,fill:'#c9971c',originX:'center',originY:'center'});
  const circle=new Circle({left:50,top:2,radius:75,fill:'#eadbb0',stroke:'#c9971c',strokeWidth:3,originX:'center',originY:'center'});
  const text=new Textbox('Aa',{left:-24,top:-30,width:140,fontFamily:'Inter Tight',fontSize:89,fontWeight:800,fill:'#282418',originX:'center',originY:'center'});
  const group=new Group([rect,circle,text],{left:675,top:309,originX:'center',originY:'center',borderColor:'#8e721e',cornerColor:'#f2efe8',cornerStrokeColor:'#8e721e',transparentCorners:false,cornerStyle:'circle',cornerSize:13,borderScaleFactor:1.8});
  canvas.add(group);canvas.setActiveObject(group);
  const ease=p=>1-Math.pow(1-Math.max(0,Math.min(1,p)),3);
  return {label:'FABRIC.JS / OBJECT MODEL + SVG EXPORT',feature:'Canvas, Group, editable selection controls, object transformations, toSVG',seek(frame){
    const t=frame/fps;const p=t<4?ease((t-.8)/2):ease((7.3-t)/2);
    group.set({angle:Math.sin(t/8*Math.PI*2)*18,scaleX:1+p*.23,scaleY:1+p*.23});group.setCoords();
    if(t>3&&t<5.5){root.querySelector('#svg-note').textContent=`toSVG(): ${canvas.toSVG().length.toLocaleString('en-US')} characters / vector output`;}
    else root.querySelector('#svg-note').textContent='select: grouped shapes + editable type';
    canvas.renderAll();
  }};
}
