import React from 'react';
import {AbsoluteFill,interpolate,spring,useCurrentFrame,useVideoConfig} from 'remotion';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const palette=['#1f53ff','#d64432','#15836b'];
const labels=['Editorial','Launch','Product'];
export const VariantFilm:React.FC=()=>{
  const f=useCurrentFrame(),{fps}=useVideoConfig();
  const p=interpolate(f,[25,58,94,127,163,194,218,239],[0,0,1,1,2,2,0,0],clamp);
  return <AbsoluteFill style={{background:'#f2efe8',color:'#141414',fontFamily:'Inter Tight'}}>
    <div style={{position:'absolute',left:40,top:46,fontSize:18,fontFamily:'JetBrains Mono'}}>ONE COMPOSITION / THREE INPUTS</div>
    <div style={{position:'absolute',left:40,top:91,fontSize:64,lineHeight:1,fontWeight:800,letterSpacing:'-.04em'}}>Make room<br/>for variation.</div>
    {[0,1,2].map(i=>{
      const appear=spring({frame:f-i*7,fps,config:{damping:200}})*interpolate(f,[213,239],[1,0],clamp);
      const active=Math.max(0,1-Math.abs(p-i));
      const w=240;
      return <div key={i} style={{position:'absolute',left:40+i*295,top:282,width:w,height:230,border:'1px solid #b9b6ac',borderRadius:8,overflow:'hidden',opacity:appear,transform:`translateY(${(1-appear)*30}px)`}}>
        <div style={{position:'absolute',inset:0,background:palette[i],opacity:.12+active*.88}}/>
        <div style={{position:'absolute',left:20,top:20,width:65,height:65,borderRadius:i===0?'50%':i===1?'3px':'24px',background:active>.5?'#fff':palette[i],transform:`rotate(${f/240*360+i*20}deg) scale(${.85+active*.2})`}}/>
        <div style={{position:'absolute',left:20,bottom:55,fontSize:29,fontWeight:600,color:active>.5?'#fff':'#141414'}}>{labels[i]}</div>
        <div style={{position:'absolute',left:20,bottom:23,fontSize:14,fontFamily:'JetBrains Mono',color:active>.5?'#fff':'#141414'}}>PROP {i+1} / ORIGINAL DEMO</div>
      </div>;
    })}
    <div style={{position:'absolute',left:40,bottom:22,fontFamily:'JetBrains Mono',fontSize:15}}>REMOTION / PARAMETRIC REACT COMPOSITION</div>
  </AbsoluteFill>;
};
