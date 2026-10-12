import {Deck,MapView} from '@deck.gl/core';
import {HexagonLayer} from '@deck.gl/aggregation-layers';
import {ArcLayer} from '@deck.gl/layers';
export async function create({root,fps}){
  root.style.background='#0e0f12';
  const canvas=document.createElement('canvas');canvas.style.cssText='position:absolute;inset:0;background:#0e0f12';root.appendChild(canvas);
  let resolve;const ready=new Promise(r=>resolve=r);
  const data=Array.from({length:5000},(_,i)=>{
    const a=i*2.3999632297,r=Math.sqrt((i%1000)/1000)*.07;
    return {position:[139.75+Math.cos(a)*r+(i%5-2)*.008,35.69+Math.sin(a)*r*.65],weight:1+(i%11)};
  });
  const arcs=Array.from({length:9},(_,i)=>({source:[139.75,35.69],target:[139.75+Math.cos(i*.7)*.09,35.69+Math.sin(i*.7)*.056]}));
  const deck=new Deck({canvas,width:960,height:600,views:new MapView({repeat:false}),viewState:{longitude:139.75,latitude:35.69,zoom:11.3,pitch:48,bearing:-25},controller:false,useDevicePixels:1,onLoad:resolve,parameters:{clearColor:[.055,.059,.071,1]},layers:[]});
  await ready;
  const ui=document.createElement('div');ui.style.cssText='position:absolute;inset:0;color:#f2efe8;pointer-events:none';ui.innerHTML='<div style="position:absolute;left:40px;top:45px;font:17px JetBrains Mono">EXAMPLE DATA / 5,000 POINTS</div><h1 style="position:absolute;left:37px;top:85px;font-size:74px;line-height:1;margin:0;letter-spacing:-.04em">Urban pulse.</h1>';root.appendChild(ui);
  return {label:'DECK.GL',dark:true,feature:'HexagonLayer aggregation + ArcLayer, synthetic geospatial data, dynamic elevationScale',seek:async f=>{
    const t=f/fps,phase=(1-Math.cos(t*Math.PI/4))/2;
    deck.setProps({layers:[new HexagonLayer({id:'density',data,getPosition:d=>d.position,getElevationWeight:d=>d.weight,getColorWeight:d=>d.weight,radius:340,extruded:true,elevationScale:.12+phase*.38,elevationRange:[0,1300],colorRange:[[14,76,66],[16,110,89],[31,145,110],[72,190,127],[168,226,159],[237,252,193]],coverage:.78,gpuAggregation:true}),new ArcLayer({id:'routes',data:arcs,getSourcePosition:d=>d.source,getTargetPosition:d=>d.target,getSourceColor:[210,235,150,80],getTargetColor:[100,185,130,80],getWidth:2,opacity:.4+phase*.5})]});
    deck.redraw(true);
  }};
}
