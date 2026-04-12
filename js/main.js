document.addEventListener('DOMContentLoaded', function(){
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if(toggle && nav){
    toggle.addEventListener('click', ()=> nav.classList.toggle('open'));
  }

  document.body.addEventListener('click', (e)=>{
    const img = e.target.closest('.gallery img, .thumb img');
    if(!img) return;
    const src = img.dataset.src || img.src || img.getAttribute('src');
    if(!src) return;
    e.preventDefault();
    openLightbox(src, img.dataset.type || 'image');
  });

  function openLightbox(src, type){
    const wrapper = document.createElement('div');
    wrapper.className = 'lightbox';
    const inner = document.createElement('div');
    inner.className = 'lightbox-inner';
    if(type === 'video' || /\.mp4$/.test(src)){
      const v = document.createElement('video');
      v.src = src; v.controls = true; v.autoplay = true;
      inner.appendChild(v);
    } else {
      const i = document.createElement('img');
      i.src = src; i.alt = '';
      inner.appendChild(i);
    }
    wrapper.appendChild(inner);
    wrapper.addEventListener('click', ()=> wrapper.remove());
    document.body.appendChild(wrapper);
    function onKey(e){ if(e.key === 'Escape') { wrapper.remove(); document.removeEventListener('keydown', onKey); } }
    document.addEventListener('keydown', onKey);
  }

});
