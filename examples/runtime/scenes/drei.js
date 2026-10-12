import React,{useRef} from 'react';
import {createRoot,extend,useFrame,advance} from '@react-three/fiber';
import {RoundedBox,Edges,Center,ContactShadows} from '@react-three/drei';
import * as THREE from 'three';
extend(THREE);
export async function create({root,fps}){
  root.innerHTML='<h1 style="position:absolute;left:40px;top:56px;font-size:62px;line-height:.96;margin:0;letter-spacing:-.035em">Soft edges.<br/>Solid presence.</h1><div style="position:absolute;left:40px;top:208px;font:16px JetBrains Mono">DREI / STUDIO OBJECT</div>';
  const canvas=document.createElement('canvas');canvas.style.cssText='position:absolute;left:300px;top:60px;width:635px;height:470px';root.appendChild(canvas);
  const e=React.createElement;let t=0,state,res;const ready=new Promise(r=>res=r);
  function Object(){
    const ref=useRef();useFrame(()=>{ref.current.rotation.y=.4+Math.sin(t*Math.PI/4)*.65;ref.current.position.y=.22+Math.sin(t*Math.PI/4)*.08;});
    return e('group',{ref},e(Center,{},e(RoundedBox,{args:[2.8,2,.85],radius:.23,smoothness:5},e('meshStandardMaterial',{color:'#da7048',metalness:.2,roughness:.38}),e(Edges,{color:'#5d2011',threshold:20}))),e('mesh',{position:[0,0,.48]},e('circleGeometry',{args:[.34,60]}),e('meshStandardMaterial',{color:'#f2efe8',roughness:.3})),e('mesh',{position:[0,-.65,.44]},e('boxGeometry',{args:[1.25,.04,.03]}),e('meshBasicMaterial',{color:'#702d19'})));
  }
  const r=createRoot(canvas);await r.configure({size:{width:635,height:470,top:0,left:0},frameloop:'never',dpr:1,gl:{antialias:true,alpha:true,preserveDrawingBuffer:true},camera:{position:[4,2,6],fov:38},onCreated:s=>{state=s;res();}});
  r.render(e(React.Fragment,{},e('ambientLight',{intensity:1.8}),e('directionalLight',{position:[-4,5,5],intensity:3}),e(Object),e(ContactShadows,{position:[0,-1.1,0],scale:8,blur:2,far:4,opacity:.35,color:'#602211',frames:Infinity,resolution:128})));
  await ready;
  return {label:'DREI',feature:'RoundedBox, Center, Edges, ContactShadows; Fiber manual frames',seek:async f=>{t=f/fps;advance(t,true,state);}};
}
