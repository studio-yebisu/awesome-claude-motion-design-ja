import pageUrl from '../../kinetic-typography/index.html?url';
export async function create({root,fps}){
  const frame=document.createElement('iframe');frame.style.cssText='position:absolute;inset:0;border:0;width:960px;height:600px';root.appendChild(frame);
  await new Promise((resolve,reject)=>{frame.onload=resolve;frame.onerror=reject;frame.src=pageUrl+'?t=0&embed=1';});
  await frame.contentWindow.__ready;
  return {label:'IART / KINETIC TYPOGRAPHY SKILL',dark:true,feature:'Actual pack applied: line mask, 80ms stagger, 480ms ease-out reveal, aria labels, reduced motion, standalone time freeze',seek:async f=>frame.contentWindow.seek(f/fps)};
}
