// Original scene body for the upstream /motion template; no upstream template is redistributed.
const T={hook:.3,lens:1.8,turn:3.4,proof:5.8,light:7.1,close:8.1,return:10.2};
const POINTS=(()=>{const r=rng(707);return Array.from({length:48},()=>({a:r()*TAU,r:110+r()*110,phase:r()*TAU}));})();
function lens(x,y,size,open,t){
  ctx.save();ctx.translate(x,y);ctx.scale(size/180,size/180);
  const metal=ctx.createLinearGradient(-100,-100,100,100);metal.addColorStop(0,'#bdced0');metal.addColorStop(.4,'#183c3b');metal.addColorStop(1,'#8faea0');
  circle(0,0,100);ctx.fillStyle=metal;ctx.fill();
  circle(0,0,89);ctx.fillStyle='#0a1715';ctx.fill();
  for(let i=0;i<6;i++){
    ctx.save();ctx.rotate(i*TAU/6);
    const edge=23+open*42;
    ctx.beginPath();ctx.moveTo(edge,-90);ctx.lineTo(100,-90);ctx.lineTo(100,100);ctx.lineTo(edge-14,100);ctx.closePath();
    const blade=ctx.createLinearGradient(edge,0,100,0);blade.addColorStop(0,'#315e4c');blade.addColorStop(1,'#142b26');ctx.fillStyle=blade;ctx.fill();ctx.restore();
  }
  glow(SPR.mint,0,0,160,.2+open*.2);
  glowStroke(()=>circle(0,0,97),'170,225,191',1.1,.7);
  ctx.restore();
}
function draw(t){
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';bgDark(t);
  const focus=eInOut(P(t,T.turn,2.2));
  const fade=1-eInOut(P(t,T.light,.8));
  if(fade>0){
    ctx.save();ctx.globalAlpha*=fade;
    const arrive=eOut5(P(t,T.lens,.9));
    lens(W/2,H*.53,180*arrive,.2+focus*.8,t);
    ctx.save();ctx.globalCompositeOperation='lighter';
    for(const p of POINTS){
      const a=p.a+.22*Math.sin(t*.7+p.phase),r=lerp(p.r,20,focus);
      glow(SPR.mint,W/2+Math.cos(a)*r,H*.53+Math.sin(a)*r,12+focus*9,(.35+focus*.2)*arrive);
    }
    ctx.restore();ctx.restore();
  }
  softText('Find your focus.',W/2,108,`italic 57px ${SERIF}`,'#edf9d8',T.hook,2.8,t,{stag:.025});
  softText('Let the noise fall away.',W/2,100,`italic 49px ${SERIF}`,'#edf9d8',3.7,6.9,t,{stag:.025});
  if(t>T.light){
    ctx.save();ctx.globalAlpha*=eInOut(P(t,T.light,.8))*(1-eInOut(P(t,T.return,1.4)));bgLight();
    glowStroke(()=>circle(W/2,H*.53,35+Math.sin(t*1.1)*3),'59,110,66',2,1);
    softText('Give motion a purpose.',W/2,140,`italic 58px ${SERIF}`,'#214b30',T.close,10.25,t,{stag:.025});
    ctx.font=`18px ${SANS}`;ctx.textAlign='center';ctx.fillStyle='#547156';ctx.fillText('ORIGINAL SCENE / SKILL-APPLIED CANVAS FILM',W/2,515);
    ctx.restore();
  }
  bloom(W/2,H*.53,t,T.light,1);
  finishFrame(t,.18);
}
