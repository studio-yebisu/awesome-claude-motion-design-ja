// Integration authored by Codex using the actual Emil skill inputs and Opus's returned rule applications.
const clamp=x=>Math.min(1,Math.max(0,x));
function step(t){
  if(t<=0)return 0;const w=52,z=.86,wd=w*Math.sqrt(1-z*z);
  return 1-Math.exp(-z*w*t)*(Math.cos(wd*t)+z*w/wd*Math.sin(wd*t));
}
function retarget(t,keys){let result=0,last=0;for(const [at,value]of keys){result+=(value-last)*step(t-at);last=value;}return result;}
export async function create({root,fps}){
  const el=(parent,css,text)=>{const d=document.createElement('div');d.style.cssText='position:absolute;'+css;d.textContent=text||'';parent.appendChild(d);return d;};
  root.style.background='#f2efe8';
  el(root,'left:40px;top:46px;font:17px JetBrains Mono;color:#64675c','EMIL SKILLS / EXAMPLE PRODUCT');
  el(root,'left:37px;top:85px;font-size:66px;font-weight:800;line-height:.98;letter-spacing:-.04em','A little motion.');
  el(root,'left:37px;top:151px;font-size:66px;font-weight:800;line-height:.98;letter-spacing:-.04em','A lot of clarity.');
  const panel=el(root,'left:40px;top:251px;width:880px;height:277px;border:1px solid #c7c9bd;border-radius:14px;background:#fcfbf7');
  el(panel,'left:27px;top:25px;font-size:28px;font-weight:600','Studio notes');
  el(panel,'left:28px;top:68px;font-size:18px;color:#6d7364','An original motion study, ready to share.');
  for(let i=0;i<3;i++)el(panel,`left:28px;top:${115+i*25}px;width:${[560,450,500][i]}px;height:9px;border-radius:4px;background:#e9eadf`);
  const button=el(panel,'right:28px;top:26px;width:135px;height:44px;border-radius:9px;background:#27321e;color:white;text-align:center;padding-top:11px;font-size:17px;font-weight:600','Share ↗');
  const popover=el(panel,'right:28px;top:78px;width:250px;height:132px;border:1px solid #d9dfcc;border-radius:11px;background:#fff;box-shadow:0 12px 28px #212d171a;transform-origin:182px -8px');
  el(popover,'left:18px;top:19px;font-size:17px;font-weight:600','Copy a link');el(popover,'left:18px;top:61px;width:214px;height:38px;border-radius:6px;background:#eef1e6;padding:9px 12px;font-size:15px;color:#586447','Anyone with the link');
  const toast=el(panel,'left:275px;bottom:20px;width:330px;height:42px;border-radius:9px;background:#27321e;color:#fff;font-size:16px;padding:11px 17px','✓  Link copied. Ready when you are.');
  const cursor=el(root,'left:0;top:0;width:20px;height:25px;z-index:10;font-size:26px;color:#111','↖');
  const detail=el(root,'left:40px;top:215px;font:14px JetBrains Mono;color:#78806b');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  return {label:'EMIL / ORIGIN + INTERRUPTIBLE MOTION',feature:'Skill applied: trigger origin, transform/opacity, closed-form retargeted spring preserving velocity, <300ms response, reduced motion, labelled quarter-speed review',seek:async f=>{
    const t=f/fps;
    const slow=t>=4.8&&t<6.8;
    const clock=slow?2.55+(t-4.8)*.25:t;
    const p=clamp(retarget(clock,[[1.2,1],[2.6,0],[2.665,1],[3.95,0]]));
    const q=clamp(retarget(clock,[[1.6,1],[3.6,0]]));
    popover.style.opacity=String(p);popover.style.transform=reduced?'none':`translateY(${(1-p)*-5}px) scale(${.96+p*.04})`;
    toast.style.opacity=String(q);toast.style.transform=reduced?'none':`translateY(${(1-q)*8}px)`;
    const clicks=[1.2,2.6,2.665];let pressure=0;for(const at of clicks)pressure+=Math.exp(-Math.abs(clock-at)*45);
    button.style.transform=reduced?'none':`scale(${1-.025*clamp(pressure)})`;
    const moving=clamp((clock-.45)/.5);cursor.style.transform=`translate(${570+moving*220}px,${410-moving*125}px)`;
    detail.textContent=slow?'0.25× REVIEW / REVERSE AND RETARGET':'QUICK RESPONSE / FROM THE TRIGGER / CONTINUOUS RETARGET';
    cursor.style.opacity=String(1-clamp((t-7)/.5));
  }};
}
