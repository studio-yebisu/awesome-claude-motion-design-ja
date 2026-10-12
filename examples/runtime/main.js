import '@fontsource/inter-tight/latin-600.css';
import '@fontsource/inter-tight/latin-800.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import './plate.css';

const id=new URLSearchParams(location.search).get('scene')||'gsap';
const modules=import.meta.glob('./scenes/*.js');
const root=document.getElementById('scene-root');
const name=document.getElementById('plate-name'),frameLabel=document.getElementById('plate-frame');
let seekImpl;
window.__scene={id,fps:30,durationFrames:240,ready:null,seek:async frame=>{
  if(!seekImpl)throw new Error('Scene not ready');
  frameLabel.textContent=`${String(frame).padStart(3,'0')} / 240`;
  await seekImpl(frame);
}};
window.__scene.ready=(async()=>{
  const load=modules[`./scenes/${id}.js`];if(!load)throw new Error(`Unknown scene ${id}`);
  await Promise.all([document.fonts.load('600 30px "Inter Tight"'),document.fonts.load('800 70px "Inter Tight"'),document.fonts.load('400 18px "JetBrains Mono"')]);
  await document.fonts.ready;
  const module=await load();
  const scene=await module.create({root,width:960,height:600,fps:30,durationFrames:240});
  seekImpl=scene.seek;
  name.textContent=scene.label||id.toUpperCase();
  if(scene.dark)document.documentElement.style.setProperty('--plate-ink','#e9e6df');
  window.__scene.feature=scene.feature||'';
  await document.fonts.ready;
  await window.__scene.seek(0);
  window.__scene.readyState='ready';
  return true;
})().catch(error=>{
  document.getElementById('load-error').textContent=String(error.stack||error);
  window.__scene.error=String(error);throw error;
});
