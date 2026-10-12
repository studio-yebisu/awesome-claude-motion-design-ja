import React,{useRef} from 'react';
import {createRoot,extend,useFrame,advance} from '@react-three/fiber';
import * as THREE from 'three';
extend(THREE);
export async function create({root,width,height,fps}){
  root.innerHTML='<div style="position:absolute;left:40px;top:54px;font:18px JetBrains Mono">DECLARATIVE SPACE</div><h1 style="position:absolute;left:40px;top:90px;font-size:66px;line-height:.95;letter-spacing:-.04em;margin:0">A system<br/>in balance.</h1>';
  const canvas=document.createElement('canvas');canvas.style.cssText='position:absolute;left:325px;top:130px;width:620px;height:410px';root.appendChild(canvas);
  let state,t=0,readyResolve;const ready=new Promise(r=>readyResolve=r);
  const e=React.createElement;
  function Sculpture(){
    const group=useRef();
    useFrame(()=>{group.current.rotation.set(.28*Math.sin(t*Math.PI/4),t*Math.PI/4,.2*Math.sin(t*Math.PI/4));});
    return e('group',{ref:group},[0,1,2].map(i=>e('mesh',{key:i,rotation:[i*Math.PI/3,i*Math.PI/4,0]},e('torusGeometry',{args:[1.8-i*.33,.1,24,100]}),e('meshStandardMaterial',{color:['#134bcc','#3883d5','#49a4c4'][i],metalness:.5,roughness:.25}))),e('mesh',{},e('icosahedronGeometry',{args:[.6,1]}),e('meshStandardMaterial',{color:'#e5ca81',metalness:.7,roughness:.3})));
  }
  const r=createRoot(canvas);
  await r.configure({size:{width:620,height:410,top:0,left:0},frameloop:'never',dpr:1,gl:{antialias:true,alpha:true,preserveDrawingBuffer:true},camera:{position:[4,2.4,6],fov:42},onCreated:s=>{state=s;readyResolve();}});
  r.render(e(React.Fragment,{},e('ambientLight',{intensity:1.5}),e('directionalLight',{position:[4,7,6],intensity:4}),e(Sculpture)));
  await ready;
  return {label:'REACT THREE FIBER',feature:'React reconciler, declarative meshes, useFrame, frameloop=never, manual advance',seek:async f=>{t=f/fps;advance(t,true,state);}};
}
