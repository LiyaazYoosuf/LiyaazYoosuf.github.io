document.addEventListener('DOMContentLoaded', function(){
  const navToggle = document.getElementById('navToggle');
  if(navToggle){
    // ensure accessible state
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.addEventListener('click', () => {
      const isOpen = document.body.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('active'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  function isLocalLink(a){
    const href = a.getAttribute('href') || '';
    return !(href.startsWith('mailto:')||href.startsWith('tel:')||a.target) && (href.startsWith('/') || !href.startsWith('http'));
  }

  Array.from(document.querySelectorAll('a[href]')).forEach(a => {
    if(!isLocalLink(a)) return;
    a.addEventListener('click', (ev)=>{
      const href = a.getAttribute('href');
      if(href.startsWith('#')) return;
      ev.preventDefault();
      document.body.classList.add('fade-out');
      setTimeout(()=> window.location = href, 240);
    });
  });

  // Lightbox: create once and reuse for gallery images (skip on selected pages)
  (function(){
    const path = window.location.pathname || '';
    const excludedPaths = ['/', '/index.html', '/index.htm', '/pages/programming.html', '/pages/multimedia.html'];
    const galleryImgs = document.querySelectorAll('.card-media img, .grid img');
    const isExcluded = excludedPaths.includes(path) || excludedPaths.some(p => path.endsWith(p));
    if(isExcluded){
      // on the homepage and select pages we don't want images to open fullscreen; ensure cursor is default
      galleryImgs.forEach(img => { img.style.cursor = 'auto'; });
      return;
    }

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.innerHTML = '<button class="lightbox__close" aria-label="Close image">×</button><img class="lightbox__img" alt="">';
    document.body.appendChild(lightbox);

    const lbImg = lightbox.querySelector('.lightbox__img');
    const lbClose = lightbox.querySelector('.lightbox__close');

    function openLightbox(src, alt){
      lbImg.src = src;
      lbImg.alt = alt || '';
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lbClose.focus();
    }

    function closeLightbox(){
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setTimeout(()=>{ lbImg.src = ''; lbImg.alt = ''; }, 200);
    }

    lightbox.addEventListener('click', (e)=>{ if(e.target === lightbox) closeLightbox(); });
    lbClose.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox(); });

    // Attach to gallery images (cards/grid)
    galleryImgs.forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', (ev)=>{
        ev.preventDefault();
        ev.stopPropagation();
        // allow optional larger src via data-large attribute
        const large = img.dataset.large || img.src;
        openLightbox(large, img.alt || '');
      });
    });
  })();

  window.addEventListener('pageshow', ()=> document.body.classList.remove('fade-out'));
});
