document.addEventListener('DOMContentLoaded', function(){
  const navToggle = document.getElementById('navToggle');
  if(navToggle) navToggle.addEventListener('click', () => document.body.classList.toggle('nav-open'));

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

  window.addEventListener('pageshow', ()=> document.body.classList.remove('fade-out'));
});
