// Opus supplied the scene and product drawing continuation; Codex completed the truncated helper section.
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const lerp=(a,b,k)=>a+(b-a)*k;
const seg=(t,a,b)=>clamp((t-a)/(b-a));
const io=x=>x*x*(3-2*x);
const out=x=>1-(1-x)**3;
const inn=x=>x**3;
function stepResp(t,f,z){if(t<=0)return 0;const w=f*2*Math.PI;if(z>=1)return 1-(1+w*t)*Math.exp(-w*t);const wd=w*Math.sqrt(1-z*z);return 1-Math.exp(-z*w*t)*(Math.cos(wd*t)+z*w/wd*Math.sin(wd*t));}
const spacing=(g,n)=>{if('letterSpacing' in g)g.letterSpacing=n;};
const FIN={fog:{lo:'#939e9b',hi:'#f2eee1',grille:'#525d5a',hole:'#151f1c'},ink:{lo:'#121b23',hi:'#536a7e',grille:'#17232e',hole:'#05090b'},ember:{lo:'#7d3626',hi:'#e39968',grille:'#703e2d',hole:'#2a180f'}};
const WALL=[{t:[1.1,2.95],colors:['#044b60','#2ba6a0'],copy:'A closer kind of sound.'},{t:[3.05,4.8],colors:['#2e2461','#7973b9'],copy:'Made to move with you.'},{t:[4.95,6.35],colors:['#9d422d','#dda265'],copy:'Find your own tone.'}];
const WALL_T=[[1.1,1.5],[3.05,3.4],[4.95,5.3]];
function drawWall(g,w,a){if(a<=0)return;g.save();g.globalAlpha=a;const bg=g.createLinearGradient(0,0,960,600);bg.addColorStop(0,w.colors[0]);bg.addColorStop(1,w.colors[1]);g.fillStyle=bg;g.fillRect(0,0,960,600);const glow=g.createRadialGradient(670,350,10,670,350,680);glow.addColorStop(0,'#ffffff28');glow.addColorStop(1,'#ffffff00');g.fillStyle=glow;g.fillRect(0,0,960,600);g.restore();}
function caption(g,w,a,dy){if(a<=0)return;g.save();g.globalAlpha=a;g.textAlign='center';g.fillStyle='#fff';g.font='600 32px "Inter Tight"';spacing(g,'-.7px');g.fillText(w.copy,480,182+dy);g.restore();}
function menuBar(g){g.save();g.fillStyle='#0008';g.fillRect(0,0,960,29);g.font='600 12px "Inter Tight"';g.fillStyle='#fff9';spacing(g,'0px');g.textAlign='left';['SONORA','File','View','Window','Help'].forEach((s,i)=>g.fillText(s,40+i*77,19));g.fillStyle='#ffffff60';for(let i=0;i<3;i++)g.fillRect(830+i*18,11,10,4);g.restore();}
function island(t,reduced){
 const targets=[[1.2,340,83],[3.02,405,72],[4.9,465,77],[6.45,88,28]];
 let w=88,h=28,pw=88,ph=28;
 for(const [at,nw,nh]of targets){const sw=reduced?seg(t,at,at+.12):stepResp(t-at,6,.9),sh=reduced?seg(t,at,at+.12):stepResp(t-at,7,.95);w+=(nw-pw)*sw;h+=(nh-ph)*sh;pw=nw;ph=nh;}
 return [w,h];
}
function drawIsland(g,w,h,t){g.save();g.fillStyle='#070707';g.beginPath();g.roundRect(480-w/2,-15,w,h+15,20);g.fill();if(h>42){g.globalAlpha=clamp((h-38)/30);g.fillStyle='#e5e6df';g.font='600 16px "Inter Tight"';g.textAlign='left';spacing(g,'0px');g.fillText('SONORA',480-w/2+20,34);g.fillStyle='#515251';for(let i=0;i<3;i++)g.fillRect(480-w/2+20,45+i*7,Math.max(10,w*.45-i*10),2);g.fillStyle='#adb9a2';g.beginPath();g.arc(480+w/2-37,39,11,0,Math.PI*2);g.fill();}g.restore();}
function drawSpeaker(g,x,y,scale,c,light,a){
 if(a<=0)return;g.save();g.globalAlpha*=a;g.translate(x,y);g.scale(scale,scale);
 const w=184,h=238,gy=-17;
 g.save();g.scale(1,.19);const shadow=g.createRadialGradient(0,600,1,0,600,130);shadow.addColorStop(0,'#0006');shadow.addColorStop(1,'#0000');g.fillStyle=shadow;g.fillRect(-150,420,300,350);g.restore();
 const body=g.createLinearGradient(-w/2,-h/2,w/2,h/2);body.addColorStop(0,c.hi);body.addColorStop(.5,c.lo);body.addColorStop(1,c.hi);
 g.beginPath();g.roundRect(-w/2,-h/2,w,h,32);g.fillStyle=body;g.fill();
 g.save();g.clip();g.translate(light*70,0);
 const sp=g.createLinearGradient(-80,0,80,0);sp.addColorStop(
0, 'rgba(255,255,255,0)'); sp.addColorStop(0.5, 'rgba(255,255,255,0.3)'); sp.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = sp; g.fillRect(-w / 2, -h / 2, w, h); g.restore();
  const rim = g.createLinearGradient(0, -h / 2, 0, h / 2);
  rim.addColorStop(0, 'rgba(255,255,255,0.55)'); rim.addColorStop(0.5, 'rgba(255,255,255,0.06)'); rim.addColorStop(1, 'rgba(0,0,0,0.3)');
  g.strokeStyle = rim; g.lineWidth = 1.5; g.stroke();
  g.beginPath(); g.arc(0, gy, 68, 0, Math.PI * 2); g.fillStyle = c.grille; g.fill();
  g.strokeStyle = 'rgba(0,0,0,0.2)'; g.lineWidth = 2; g.stroke();
  g.fillStyle = c.hole;
  for (let k = 0; k <= 6; k++) {
    const r = k * 9.6, n = k ? Math.round((Math.PI * 2 * r) / 9.5) : 1;
    for (let i = 0; i < n; i++) {
      const an = (i / n) * Math.PI * 2 + k * 0.35;
      g.beginPath(); g.arc(Math.cos(an) * r, gy + Math.sin(an) * r, 2.2, 0, Math.PI * 2); g.fill();
    }
  }
  const sheen = g.createRadialGradient(-24, gy - 30, 4, 0, gy, 70);
  sheen.addColorStop(0, 'rgba(255,255,255,0.22)'); sheen.addColorStop(1, 'rgba(0,0,0,0.18)');
  g.fillStyle = sheen; g.beginPath(); g.arc(0, gy, 68, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.roundRect(-28, 72, 56, 14, 7); g.fillStyle = c.lo; g.fill();
  g.fillStyle = c.hi; g.fillRect(-18, 78.2, 7, 1.6); g.fillRect(11, 78.2, 7, 1.6); g.fillRect(13.7, 75.5, 1.6, 7);
  g.restore();
}
function titleCard(g, a) {
  if (a <= 0.001) return;
  g.globalAlpha = a; g.textAlign = 'center'; g.fillStyle = '#fff';
  g.font = `800 64px 'Inter Tight'`; spacing(g, '14px'); g.fillText('SONORA', 487, 298);
  g.font = `600 22px 'Inter Tight'`; spacing(g, '-0.3px'); g.fillStyle = 'rgba(255,255,255,0.64)'; g.fillText('The pocket speaker.', 480, 342);
  g.font = `400 11px 'JetBrains Mono'`; spacing(g, '2.4px'); g.fillStyle = 'rgba(255,255,255,0.4)'; g.fillText('EXAMPLE · FICTIONAL PRODUCT', 481, 386);
  g.globalAlpha = 1; g.textAlign = 'left'; spacing(g, '0px');
}

export function create({ root, width = 960, height = 600, fps = 30, durationFrames = 240 }) {
  const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  root.textContent = '';
  Object.assign(root.style, { position: 'absolute', width: width + 'px', height: height + 'px', overflow: 'hidden', background: '#000' });
  const mk = () => { const c = document.createElement('canvas'); c.width = width * dpr; c.height = height * dpr; return c; };
  const cv = mk(), off = mk();
  Object.assign(cv.style, { position: 'absolute', left: '0', top: '0', width: width + 'px', height: height + 'px' });
  root.appendChild(cv);
  const g = cv.getContext('2d'), pg = off.getContext('2d');
  async function seek(frame) {
    const t = (((frame % durationFrames) + durationFrames) % durationFrames) / fps;
    // Reduced motion: springs and camera moves become steps, bridged by quick fades.
    const E = reduced ? (k) => (k < 0.5 ? 0 : 1) : io;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = '#000'; g.fillRect(0, 0, 960, 600);
    WALL.forEach((wl, i) => drawWall(g, wl, out(seg(t, WALL_T[i][0], WALL_T[i][1]))));
    // One continuous camera: macro drift on the grille, a log-space pull back, then the family steps out.
    const sA = 2.4 - 0.2 * seg(t, 1.1, 3);
    const rk = E(seg(t, 3, 3.9)), fk = E(seg(t, 4.85, 5.6)), xk = inn(seg(t, 6.4, 6.85));
    let s = Math.exp(lerp(Math.log(sA), 0, rk)) * (1 + 0.02 * seg(t, 3.9, 4.85));
    let y = lerp(380 + 24 * sA, 330, rk);
    s = lerp(s, 0.82, fk) * (1 - 0.05 * xk);
    y = lerp(y, 344, fk);
    const dip = reduced ? Math.min(clamp(Math.abs(t - 3.45) / 0.15), clamp(Math.abs(t - 5.22) / 0.15)) : 1;
    const light = lerp(-1, 1, io(seg(t, 1.1, 6.4)));
    pg.setTransform(1, 0, 0, 1, 0, 0); pg.clearRect(0, 0, off.width, off.height);
    pg.setTransform(dpr, 0, 0, dpr, 0, 0);
    [[FIN.ink, -1, 4.9], [FIN.ember, 1, 4.98]].forEach(([c, dir, t0]) => {
      const k = reduced ? fk : stepResp(t - t0, 9, 0.8);
      drawSpeaker(pg, 480 + dir * 236 * k, y, s * lerp(0.9, 1, k), c, light, clamp(k * 1.6) * dip);
    });
    drawSpeaker(pg, 480, y, s, FIN.fog, light, out(seg(t, 1.08, 1.5)) * dip);
    // Product layer fades out before the footer band (y 550..600 stays clear).
    pg.globalCompositeOperation = 'destination-in';
    const fade = pg.createLinearGradient(0, 470, 0, 548);
    fade.addColorStop(0, 'rgba(0,0,0,1)'); fade.addColorStop(1, 'rgba(0,0,0,0)');
    pg.fillStyle = fade; pg.fillRect(0, 0, 960, 600);
    pg.globalCompositeOperation = 'source-over';
    g.drawImage(off, 0, 0, 960, 600);
    const black = io(seg(t, 6.45, 6.85));
    if (black > 0) { g.globalAlpha = black; g.fillStyle = '#000'; g.fillRect(0, 0, 960, 600); g.globalAlpha = 1; }
    WALL.forEach((wl) => {
      const [a, b] = wl.t, k = out(seg(t, a, a + 0.45));
      caption(g, wl, k * (1 - inn(seg(t, b, b + 0.28))), reduced ? 0 : 12 * (1 - k));
    });
    menuBar(g);
    const [iw, ih] = island(t, reduced);
    drawIsland(g, iw, ih, t);
    titleCard(g, t < 4 ? 1 - inn(seg(t, 1, 1.25)) : out(seg(t, 6.95, 7.4)));
  }
  return { seek, label: 'Charlie · apple-launch-film', feature: 'SONORA (EXAMPLE): island widget, gradient wallpapers, detail to reveal to family', dark: true };
}
export default { create };
