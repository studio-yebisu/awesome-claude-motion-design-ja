/* Pure time-based original artwork; playback is a separate UI concern. MIT. */
(() => {
  "use strict";
  const clamp = (v) => Math.max(0, Math.min(1, v));
  const ease = (v) => 1 - Math.pow(1 - clamp(v), 3);
  const select = (s) => Array.from(document.querySelectorAll(s));
  const nodes = {
    cursor: select("[data-demo-cursor]"), render: select("[data-demo-render]"),
    playhead: select("[data-demo-playhead]"), letters: select("[data-demo-letter]"),
    pill: select("[data-demo-pill]"), cube: select("[data-demo-cube]"),
    petals: select("[data-demo-petals]"), vector: select("[data-demo-vector]"),
    bars: select("[data-demo-bar]")
  };
  function seek(seconds) {
    const t = Math.max(0, Math.min(6, Number(seconds) || 0));
    nodes.cursor.forEach(el => { el.style.transform = `translate(${-80 + 78 * ease(t / 2)}px,${-8 * Math.sin(t * 2)}px)`; });
    nodes.render.forEach(el => { el.style.transform = `translateX(${Math.sin(t * 2) * 5}px)`; });
    nodes.playhead.forEach(el => { el.style.left = `${t / 6 * 100}%`; });
    nodes.letters.forEach(el => {
      const n = Number(el.dataset.demoLetter);
      const p = ease((t - n * .13) / .7);
      el.style.transform = `translateY(${(1 - p) * 35 + Math.sin(t * 2 - n * .5) * 2}px)`;
      el.style.opacity = String(.35 + .65 * p);
    });
    nodes.pill.forEach(el => { el.style.transform = `translateX(${Math.sin(t * 1.6) * 12}px)`; });
    nodes.cube.forEach(el => { el.style.transform = `rotateX(${-22 + Math.sin(t) * 9}deg) rotateY(${28 + t * 38}deg)`; });
    nodes.petals.forEach(el => { el.setAttribute("transform", `translate(145 94) rotate(${t * 26})`); });
    nodes.vector.forEach(el => { el.setAttribute("transform", `translate(274 94) rotate(${-t * 18}) scale(${.82 + .18 * ease(t / 1.4)})`); });
    nodes.bars.forEach(el => {
      const n = Number(el.dataset.demoBar);
      const h = (58 + n * 18 + Math.sin(t * 1.7 + n) * 17) * (.35 + .65 * ease((t - n * .15) / 1.1));
      el.setAttribute("height", String(h)); el.setAttribute("y", String(155 - h));
    });
    return t;
  }
  window.MotionGuideDemo = Object.freeze({seek});
  seek(1.8);
})();
