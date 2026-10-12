import createGlobe from 'cobe';

export async function create({root,width,height,fps}) {
  root.style.background='#f2efe8';
  root.innerHTML=`<div style="position:absolute;top:73px;left:65px;z-index:2"><span class="mono" style="font-size:16px;color:#677d75;letter-spacing:3px">CONNECTED / BY DESIGN</span><h1 style="font-size:70px;line-height:1.04;letter-spacing:-3px;margin:28px 0 20px">A SMALL<br>WORLD.<br>A BIG IDEA.</h1><div style="border-left:3px solid #1f8a70;padding-left:17px;font-size:21px;line-height:1.6;color:#65756e">Three locations.<br>One continuous signal.</div></div><canvas style="position:absolute;right:-150px;top:2px;width:750px;height:600px"></canvas><div id="place" class="mono" style="position:absolute;right:80px;bottom:98px;font-size:17px;color:#477c6c">TOKYO / 35.68, 139.69</div>`;
  const canvas=root.querySelector('canvas');
  const markers=[{location:[35.68,139.69],size:.065},{location:[51.51,-.13],size:.065},{location:[40.71,-74.0],size:.065}];
  let t=0;
  const globe=createGlobe(canvas,{devicePixelRatio:1,width:750,height:600,phi:.7,theta:.2,dark:0,diffuse:1.4,mapSamples:20000,mapBrightness:5,baseColor:[.77,.82,.77],markerColor:[.12,.54,.44],glowColor:[.95,.94,.9],markers,opacity:1,onRender:state=>{
    state.phi=.7+Math.sin(t/8*Math.PI*2)*.5;state.theta=.2;state.width=750;state.height=600;
  }});
  const names=['TOKYO / 35.68, 139.69','LONDON / 51.51, -0.13','NEW YORK / 40.71, -74.00'];
  return {label:'COBE / WEBGL GLOBE + MARKERS',feature:'createGlobe, geographic markers, phi updates',seek:async frame=>{
    t=frame/fps;root.querySelector('#place').textContent=names[Math.floor(frame/80)%3];
    if(typeof globe.update==='function')globe.update({phi:.7+Math.sin(t/8*Math.PI*2)*.5});
  }};
}
