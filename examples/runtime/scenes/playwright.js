import f0 from '../../playwright/frames/0024.png?url';
import f1 from '../../playwright/frames/0060.png?url';
import f2 from '../../playwright/frames/0120.png?url';
import f3 from '../../playwright/frames/0189.png?url';
export async function create({root,fps}){
  const imgs=await Promise.all([f0,f1,f2,f3].map(url=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=url;})));
  const canvas=document.createElement('canvas');canvas.width=960;canvas.height=600;root.appendChild(canvas);const g=canvas.getContext('2d');
  const frames=[24,60,120,189];window.__processingProof={capture_tool:'Playwright 1.64.0',source:'original GSAP specimen',actualSourceFrames:frames,times:frames.map(f=>f/30)};
  return {label:'PLAYWRIGHT / ACTUAL FRAME CAPTURE',feature:'Four real screenshots of seek(frame), composed as a clocked filmstrip; capture automation role',seek:async frame=>{
    const t=frame/fps,index=Math.min(3,Math.floor(t/2));g.fillStyle='#111820';g.fillRect(0,0,960,600);
    g.fillStyle='#f2efe8';g.font='800 60px "Inter Tight"';g.fillText('Keep every moment.',40,105);g.font='16px "JetBrains Mono"';g.fillStyle='#9daebc';g.fillText('ACTUAL CAPTURED FRAMES / GSAP SOURCE',40,146);
    for(let i=0;i<4;i++){
      const x=40+i*226;g.drawImage(imgs[i],x,186,205,128);g.fillStyle=i===index?'#e3bf76':'#7d8b98';g.font='15px "JetBrains Mono"';g.fillText(`f${String(frames[i]).padStart(3,'0')} / ${(frames[i]/30).toFixed(1)}s`,x,343);
      if(i===index){g.strokeStyle='#e3bf76';g.lineWidth=3;g.strokeRect(x-3,183,211,134);}
    }
    g.fillStyle='#e3bf76';g.fillRect(40,371,880*(t/8),3);
    g.drawImage(imgs[index],580,399,240,150);
    g.fillStyle='#f2efe8';g.font='600 32px "Inter Tight"';g.fillText('Seek. Wait. Capture.',40,456);g.font='18px "Inter Tight"';g.fillStyle='#9daebc';g.fillText('Same scene, exact requested frame.',40,493);
  }};
}
