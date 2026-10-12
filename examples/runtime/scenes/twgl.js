import * as twgl from 'twgl.js';

export async function create({root,width,height,fps}) {
  root.style.background='#0e0f12';
  root.innerHTML=`<canvas></canvas><div style="position:absolute;left:64px;top:68px;color:#eee9df;pointer-events:none"><div class="mono" style="font-size:16px;letter-spacing:3px;color:#aab5b0">FIELD STUDY / 05</div><h1 style="font-size:76px;line-height:.95;letter-spacing:-4px;margin:24px 0 0">SHAPE<br>THE SIGNAL.</h1><p style="font-size:21px;color:#aab5b0">A fragment shader. One evolving field.</p></div>`;
  const canvas=root.querySelector('canvas');canvas.width=width;canvas.height=height;
  const gl=canvas.getContext('webgl',{preserveDrawingBuffer:true,antialias:true});
  if(!gl)throw new Error('WebGL unavailable');
  const vertex=`attribute vec4 position;void main(){gl_Position=position;}`;
  const fragment=`precision highp float;
uniform vec2 u_resolution;uniform float u_time;
float wave(vec2 p,float t){return sin(p.x*3.+t)*.35+sin(p.y*4.-t*2.)*.25+sin((p.x+p.y)*2.+t)*.18;}
void main(){vec2 uv=gl_FragCoord.xy/u_resolution;vec2 p=(uv-.5)*vec2(1.6,1.);
float phase=u_time*6.2831853/8.;p.x-=.28;float w=wave(p*3.,phase);
float field=sin((p.x+p.y*.6+w*.35)*18.+phase*2.);
float band=smoothstep(.78,.85,field);float second=smoothstep(.82,.86,sin((p.x+p.y*.6+w*.35)*18.+phase*2.+.4));
float soft=exp(-length(p-vec2(.18,0.))*.85);vec3 bg=vec3(.055,.059,.071);
vec3 cyan=vec3(.30,.70,.56);vec3 pale=vec3(.88,.89,.75);
vec3 col=bg+cyan*band*soft*.70+pale*second*soft*.36;
col*=smoothstep(-.65,-.38,p.x);float grain=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);col+=(grain-.5)*.018;
gl_FragColor=vec4(col,1.);}`;
  const program=twgl.createProgramInfo(gl,[vertex,fragment]);
  const buffer=twgl.primitives.createXYQuadBufferInfo(gl);
  gl.useProgram(program.program);twgl.setBuffersAndAttributes(gl,program,buffer);
  return {label:'TWGL / CUSTOM FRAGMENT SHADER',dark:true,feature:'createProgramInfo, shader uniforms, WebGL drawBufferInfo',seek(frame){
    gl.viewport(0,0,width,height);twgl.setUniforms(program,{u_resolution:[width,height],u_time:frame/fps});twgl.drawBufferInfo(gl,buffer);
  }};
}
