var yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();
var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- Live clock (construction banner) ---- */
try{
  var liveClockEl = document.getElementById('liveClock');
  if(liveClockEl){
    var updateClock = function(){
      liveClockEl.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };
    updateClock();
    setInterval(updateClock, 1000);
  }
}catch(e){ console.error('Live clock init failed:', e); }

/* Every block below is isolated in its own try/catch. If one CDN library
   fails to load (network hiccup, ad-blocker, offline preview, etc.) it
   will not stop the rest of the page's scripts from running. */

/* ---- Icons ---- */
try{
  if(window.lucide) lucide.createIcons();
}catch(e){ console.error('Lucide init failed:', e); }

/* ---- AOS (with fallback so content is never stuck invisible) ---- */
try{
  if(window.AOS){
    AOS.init({
      duration: 600,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
      disable: reducedMotion
    });
  } else {
    throw new Error('AOS not loaded');
  }
}catch(e){
  console.error('AOS init failed, revealing content without scroll animation:', e);
  document.querySelectorAll('[data-aos]').forEach(function(el){
    el.classList.add('aos-animate');
    el.removeAttribute('data-aos');
  });
}
// Safety net: if AOS's own CSS ever leaves elements hidden (e.g. init ran
// before all elements existed), force everything visible after load.
window.addEventListener('load', function(){
  setTimeout(function(){
    document.querySelectorAll('[data-aos]:not(.aos-animate)').forEach(function(el){
      el.classList.add('aos-animate');
    });
  }, 2500);
});

/* ---- particles.js hero background (optional, non-critical) ---- */
try{
  if(window.particlesJS && !reducedMotion){
    particlesJS('particles-js', {
      particles: {
        number: { value: 34, density: { enable: true, value_area: 900 } },
        color: { value: '#00C9B1' },
        shape: { type: 'circle' },
        opacity: { value: 0.35, random: true },
        size: { value: 2.6, random: true },
        line_linked: { enable: true, distance: 150, color: '#00C9B1', opacity: 0.15, width: 1 },
        move: { enable: true, speed: 0.6, random: true, out_mode: 'out' }
      },
      interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: false }, resize: true },
        modes: { grab: { distance: 140, line_linked: { opacity: 0.3 } } }
      },
      retina_detect: true
    });
  }
}catch(e){ console.error('particles.js init failed:', e); }

/* ---- Nav scroll state + active link highlighting (pure vanilla, no deps) ---- */
try{
  var navEl = document.getElementById('nav');
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('[data-nav]');
  var backToTop = document.getElementById('backToTop');

  var onScroll = function(){
    if(window.scrollY > 40){
      navEl.classList.add('bg-navy/85','backdrop-blur-lg','shadow-lg','py-3');
      navEl.classList.remove('py-4');
    } else {
      navEl.classList.remove('bg-navy/85','backdrop-blur-lg','shadow-lg','py-3');
      navEl.classList.add('py-4');
    }
    if(backToTop) backToTop.classList.toggle('show', window.scrollY > 600);

    var scrollPos = window.scrollY + 140;
    var current = 'home';
    sections.forEach(function(sec){
      if(scrollPos >= sec.offsetTop) current = sec.id;
    });
    navLinks.forEach(function(a){
      a.classList.toggle('active', a.getAttribute('href') === '#'+current);
    });
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
}catch(e){ console.error('Nav scroll init failed:', e); }

/* ---- Mobile menu ---- */
try{
  var navToggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  var closeMenu = document.getElementById('closeMenu');
  if(navToggle && mobileMenu && closeMenu){
    navToggle.addEventListener('click', function(){ mobileMenu.classList.remove('-translate-y-full'); document.body.style.overflow='hidden'; });
    closeMenu.addEventListener('click', function(){ mobileMenu.classList.add('-translate-y-full'); document.body.style.overflow=''; });
    mobileMenu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ mobileMenu.classList.add('-translate-y-full'); document.body.style.overflow=''; });
    });
  }
}catch(e){ console.error('Mobile menu init failed:', e); }

/* ---- Hero contact CTA smooth scroll ---- */
try{
  var heroContactBtn = document.getElementById('heroContactBtn');
  if(heroContactBtn){
    heroContactBtn.addEventListener('click', function(e){
      e.preventDefault();
      var contactSection = document.getElementById('contact');
      if(contactSection) contactSection.scrollIntoView({behavior: reducedMotion ? 'auto' : 'smooth', block:'start'});
    });
  }
}catch(e){ console.error('Hero CTA init failed:', e); }

/* ---- Back to top ---- */
try{
  if(backToTop){
    backToTop.addEventListener('click', function(){
      window.scrollTo({top:0, behavior: reducedMotion ? 'auto':'smooth'});
    });
  }
}catch(e){ console.error('Back to top init failed:', e); }

/* ---- Certifications carousel (Swiper) ---- */
try{
  if(window.Swiper){
    var certSwiper = new Swiper('.cert-swiper', {
      slidesPerView: 'auto',
      spaceBetween: 22,
      grabCursor: true,
      mousewheel: { forceToAxis: true },
      keyboard: { enabled: true },
      pagination: { el: '.cert-swiper .swiper-pagination', type: 'progressbar' },
      a11y: { enabled: true },
    });
    var certPrevBtn = document.getElementById('certPrevBtn');
    var certNextBtn = document.getElementById('certNextBtn');
    if(certPrevBtn) certPrevBtn.addEventListener('click', function(){ certSwiper.slidePrev(); });
    if(certNextBtn) certNextBtn.addEventListener('click', function(){ certSwiper.slideNext(); });
  } else {
    throw new Error('Swiper not loaded');
  }
}catch(e){ console.error('Certifications carousel init failed:', e); }

/* ---- Testimonials carousel (Swiper) ---- */
try{
  if(window.Swiper){
    new Swiper('.testi-swiper', {
      loop: true,
      effect: 'fade',
      fadeEffect: { crossFade: true },
      autoplay: reducedMotion ? false : { delay: 6000, disableOnInteraction: false },
      pagination: { el: '.testi-swiper .swiper-pagination', clickable: true },
    });
  }
}catch(e){ console.error('Testimonials carousel init failed:', e); }

/* ---- Timeline expand ---- */
try{
  document.querySelectorAll('[data-tl-toggle]').forEach(function(card){
    card.addEventListener('click', function(){
      card.closest('[data-tl]').classList.toggle('open');
    });
  });
}catch(e){ console.error('Timeline init failed:', e); }
