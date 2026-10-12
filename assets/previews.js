(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const clips=[...document.querySelectorAll('video[data-preview]')];
  const visible=new Set();let playing=!reduced.matches;
  const toggle=document.querySelector('#preview-toggle');
  const updateLabel=()=>{if(toggle){toggle.textContent=playing?'作例を停止 Ⅱ':'作例を再生 ▶';toggle.setAttribute('aria-pressed',String(playing));}};
  function load(video){if(!video.getAttribute('src')){video.src=video.dataset.src;video.load();}}
  function synchronize(){
    for(const video of clips){
      if(playing&&visible.has(video)&&!document.hidden&&!document.querySelector('.preview-dialog[open]')){load(video);video.play().catch(()=>{});}
      else video.pause();
    }
  }
  const observer=new IntersectionObserver(entries=>{
    for(const e of entries){if(e.isIntersecting)visible.add(e.target);else visible.delete(e.target);}
    synchronize();
  },{threshold:.15});
  clips.forEach(v=>observer.observe(v));
  if(toggle)toggle.addEventListener('click',()=>{playing=!playing;updateLabel();synchronize();});
  document.addEventListener('visibilitychange',synchronize);
  reduced.addEventListener('change',e=>{if(e.matches){playing=false;updateLabel();synchronize();}});
  updateLabel();
  const dialog=document.createElement('dialog');dialog.className='preview-dialog';
  dialog.setAttribute('aria-labelledby','preview-dialog-title');
  dialog.innerHTML='<div class="preview-dialog-head"><h2 id="preview-dialog-title"></h2><button type="button" class="preview-close" aria-label="拡大再生を閉じる">閉じる ×</button></div><video controls loop playsinline muted></video><p class="preview-dialog-description"></p><div class="preview-dialog-links"><a class="dialog-gif">GIFを開く ↗</a><a class="dialog-source" target="_blank" rel="noopener noreferrer">制作コード ↗</a></div>';
  document.body.appendChild(dialog);const player=dialog.querySelector('video');let trigger;
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-open-preview]');if(!button)return;
    trigger=button;dialog.querySelector('h2').textContent=button.dataset.title;
    dialog.querySelector('.preview-dialog-description').textContent=button.dataset.description;
    dialog.querySelector('.dialog-gif').href=button.dataset.gif;
    dialog.querySelector('.dialog-source').href=button.dataset.source;
    for(const v of clips)v.pause();
    player.src=button.dataset.openPreview;dialog.showModal();player.play().catch(()=>{});
    dialog.querySelector('.preview-close').focus();
  });
  dialog.querySelector('.preview-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog){const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{player.pause();player.removeAttribute('src');player.load();trigger?.focus();synchronize();});
})();
