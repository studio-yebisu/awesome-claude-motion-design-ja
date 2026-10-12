/* Standalone illustrative seek(t) composition, not a HyperFrames contract. MIT. */
(() => {
  "use strict";
  const title = document.getElementById("example-title"), subtitle = document.getElementById("example-subtitle");
  const dot = document.getElementById("orbit-dot"), input = document.getElementById("seek-time");
  const output = document.getElementById("seek-output"), button = document.getElementById("play");
  const clamp = n => Math.max(0, Math.min(1, n));
  const ease = n => 1 - Math.pow(1 - clamp(n), 3);
  let time = 1.8, playing = false, last = 0, raf = 0;
  window.seek = function(seconds) {
    time = Math.max(0, Math.min(6, Number(seconds) || 0));
    const p = ease(time / .85), q = ease((time - .45) / .6);
    title.style.opacity = String(p); title.style.transform = `translateY(${35 * (1 - p)}px)`;
    subtitle.style.opacity = String(q); subtitle.style.transform = `translateY(${15 * (1 - q)}px)`;
    const r = 88 + Math.sin(time) * 9;
    dot.style.transform = `translate(calc(-50% + ${Math.cos(time * 1.4) * r}px),calc(-50% + ${Math.sin(time * 1.4) * 69}px)) scale(${.55 + .45 * ease(time / .8)})`;
    dot.style.opacity = String(.35 + .65 * p);
    input.value = String(time); output.textContent = `${time.toFixed(2)}s`;
    return {time, opacity:p};
  };
  function tick(now) { if (!playing || document.hidden) return; if (last) window.seek((time + Math.min((now-last)/1000,.05)) % 6); last = now; raf = requestAnimationFrame(tick); }
  function play(value) { playing=value; cancelAnimationFrame(raf); last=0; button.textContent=value ? "停止 Ⅱ" : "再生 ▶"; button.setAttribute("aria-pressed",String(value)); if(value&&!document.hidden) raf=requestAnimationFrame(tick); }
  button.addEventListener("click",()=>play(!playing)); input.addEventListener("input",()=>{play(false);window.seek(input.value);});
  document.addEventListener("visibilitychange",()=>{cancelAnimationFrame(raf);last=0;if(playing&&!document.hidden)raf=requestAnimationFrame(tick);});
  window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change",e=>{if(e.matches)play(false);});
  window.seek(time);
})();
