/* Arena Seven: native JS, lightweight motion, accessible interactions */
'use strict';
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const year=$('#yr');
if(year) year.textContent=new Date().getFullYear();

// Custom pointer — desktop-only progressive enhancement with one RAF loop.
const cursor=$('.custom-cursor');
const finePointer=window.matchMedia('(hover:hover) and (pointer:fine)');
if(cursor && finePointer.matches && !reducedMotion.matches){
  const dot=$('.cursor-dot',cursor);
  const ring=$('.cursor-ring',cursor);
  const label=$('.cursor-label',cursor);
  let pointerX=-100,pointerY=-100,ringX=pointerX,ringY=pointerY,frame=0;
  const render=()=>{
    ringX+=(pointerX-ringX)*.18;
    ringY+=(pointerY-ringY)*.18;
    dot.style.transform=`translate3d(${pointerX}px,${pointerY}px,0)`;
    const scale=cursor.classList.contains('is-clicking')?.72:1;
    ring.style.transform=`translate3d(${ringX}px,${ringY}px,0) scale(${scale})`;
    frame=requestAnimationFrame(render);
  };
  const setCursorState=(state,text='')=>{
    cursor.classList.remove('is-link','is-play','is-whatsapp');
    if(state) cursor.classList.add(`is-${state}`);
    label.textContent=text;
  };
  const magneticCtas=$$('.hero-actions .btn,.nav-book,.booking-card .btn-whatsapp,.carousel-controls button');
  magneticCtas.forEach(cta=>{
    cta.classList.add('magnetic-cta');
    cta.addEventListener('pointermove',event=>{
      const rect=cta.getBoundingClientRect();
      const x=Math.max(-4,Math.min(4,(event.clientX-(rect.left+rect.width/2))*.08));
      const y=Math.max(-3,Math.min(3,(event.clientY-(rect.top+rect.height/2))*.08));
      cta.style.setProperty('--mag-x',`${x}px`);
      cta.style.setProperty('--mag-y',`${y}px`);
    },{passive:true});
    cta.addEventListener('pointerleave',()=>{
      cta.style.setProperty('--mag-x','0px');
      cta.style.setProperty('--mag-y','0px');
    });
  });
  $$('.sport-card,a,button').forEach(element=>{
    element.addEventListener('pointerenter',()=>{
      if(element.matches('.carousel-slide')) setCursorState('view','VIEW');
      else if(element.matches('a[href*="wa.me"]')) setCursorState('whatsapp');
      else if(element.matches('.sport-card') || element.closest('.sport-card')) setCursorState('play','PLAY');
      else setCursorState('link');
    });
    element.addEventListener('pointerleave',()=>setCursorState());
  });
  document.addEventListener('pointermove',event=>{
    pointerX=event.clientX;
    pointerY=event.clientY;
    cursor.classList.add('is-visible');
  },{passive:true});
  document.addEventListener('pointerleave',()=>cursor.classList.remove('is-visible'));
  document.addEventListener('pointerdown',()=>cursor.classList.add('is-clicking'));
  document.addEventListener('pointerup',()=>cursor.classList.remove('is-clicking'));
  document.documentElement.classList.add('custom-cursor-active');
  render();
  window.addEventListener('pagehide',()=>cancelAnimationFrame(frame),{once:true});
}

// Mobile navigation — accessible button, closes on navigation / Escape / outside tap.
const nav=$('.site-nav');
const toggle=$('.menu-toggle');
const menu=$('#nav-links');
if(toggle && menu){
  const setMenu=(open)=>{
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?'Close menu':'Open menu');
    menu.classList.toggle('is-open',open);
  };
  toggle.addEventListener('click',()=>setMenu(toggle.getAttribute('aria-expanded')!=='true'));
  $$('a',menu).forEach(link=>link.addEventListener('click',()=>setMenu(false)));
  document.addEventListener('pointerdown',(event)=>{if(!nav.contains(event.target))setMenu(false)});
  document.addEventListener('keydown',(event)=>{if(event.key==='Escape' && toggle.getAttribute('aria-expanded')==='true'){setMenu(false);toggle.focus()}});
  window.addEventListener('resize',()=>{if(window.innerWidth>880)setMenu(false)},{passive:true});
}

// Progress line and subtle nav elevation (one animation frame per scroll).
const progress=$('.scroll-progress');
let framePending=false;
function updateScroll(){
  const scrollMax=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
  if(progress) progress.style.transform=`scaleX(${Math.max(0,Math.min(1,window.scrollY/scrollMax))})`;
  if(nav) nav.classList.toggle('is-scrolled',window.scrollY>16);
  framePending=false;
}
window.addEventListener('scroll',()=>{if(!framePending){framePending=true;requestAnimationFrame(updateScroll)}},{passive:true});
window.addEventListener('resize',updateScroll,{passive:true});
updateScroll();

// Elegant section entrance animation, never hides content when JS/motion support is absent.
if('IntersectionObserver' in window && !reducedMotion.matches){
  document.documentElement.classList.add('can-animate');
  const revealObserver=new IntersectionObserver((entries,observer)=>{
    for(const entry of entries){
      if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}
    }
  },{threshold:0.09,rootMargin:'0px 0px -35px 0px'});
  $$('.reveal').forEach(item=>revealObserver.observe(item));
}

// Spotlight follows the pointer on sport cards; skipped on touch devices.
if(window.matchMedia('(hover:hover) and (pointer:fine)').matches && !reducedMotion.matches){
  $$('.sport-card').forEach(card=>{
    card.addEventListener('pointermove',event=>{
      const rect=card.getBoundingClientRect();
      card.style.setProperty('--mx',`${event.clientX-rect.left}px`);
      card.style.setProperty('--my',`${event.clientY-rect.top}px`);
    },{passive:true});
  });
}

// Keep current home section in sync with navigation while scrolling.
const homeSections=['home','sports','gallery','book','contact'].map(id=>document.getElementById(id)).filter(Boolean);
if(homeSections.length===5 && 'IntersectionObserver' in window){
  const items=$$('#nav-links a');
  const sectionObserver=new IntersectionObserver(entries=>{
    const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
    if(!visible.length)return;
    const id=visible[0].target.id;
    items.forEach(a=>{
      a.classList.toggle('on',a.getAttribute('href')===`#${id}`);
      if(a.getAttribute('href')===`#${id}`) a.setAttribute('aria-current','location');
      else a.removeAttribute('aria-current');
    });
  },{rootMargin:'-20% 0px -55% 0px',threshold:[0,.1,.3,.5]});
  homeSections.forEach(section=>sectionObserver.observe(section));
}

// Gallery: optimized photos, touch swipes, keyboard and lightbox.
const photos=[
  {src:'assets/gallery/turf-night.webp',alt:'Arena Seven turf illuminated at night',label:'AFTER DARK'},
  {src:'assets/gallery/pitch-view.webp',alt:'A view of the cricket pitch at Arena Seven',label:'THE PLAYING FIELD'},
  {src:'assets/gallery/match-night.webp',alt:'Cricket match at Arena Seven',label:'GAME NIGHT'},
  {src:'assets/gallery/players-on-turf.webp',alt:'Players on the floodlit Arena Seven turf',label:'WHERE WE PLAY'}
];
const gal=$('#gal');
if(gal){
  gal.classList.add('carousel');
  gal.innerHTML=`<div class="carousel-viewport"><div class="carousel-track">${photos.map((p,i)=>
    `<button class="carousel-slide" type="button" data-photo="${i}" aria-label="Open image ${i+1} of ${photos.length}: ${p.alt}"><img src="${p.src}" alt="${p.alt}" loading="${i===0?'eager':'lazy'}" decoding="async"><span class="slide-label"><small>ARENA SEVEN / 0${i+1}</small>${p.label}</span></button>`
  ).join('')}</div></div><span class="carousel-count" aria-live="off">01 / 0${photos.length}</span><div class="carousel-controls"><button class="carousel-prev" type="button" aria-label="Previous photo"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button><button class="carousel-next" type="button" aria-label="Next photo"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button></div><div class="carousel-dots" aria-label="Select gallery photo">${photos.map((_,i)=>`<button type="button" data-dot="${i}" aria-label="Show photo ${i+1}" aria-current="${i===0?'true':'false'}"></button>`).join('')}</div>`;
  const track=$('.carousel-track',gal);
  const count=$('.carousel-count',gal);
  const dots=$$('[data-dot]',gal);
  let active=0,timer=null,hovered=false,hasFocus=false,onscreen=true;
  const go=(i)=>{
    active=(i+photos.length)%photos.length;
    track.style.transform=`translate3d(-${active*100}%,0,0)`;
    dots.forEach((dot,index)=>dot.setAttribute('aria-current',index===active?'true':'false'));
    count.textContent=`${String(active+1).padStart(2,'0')} / ${String(photos.length).padStart(2,'0')}`;
  };
  const stop=()=>{if(timer){clearInterval(timer);timer=null}};
  const start=()=>{
    stop();
    if(!reducedMotion.matches && !hovered && !hasFocus && onscreen && !document.hidden){
      timer=setInterval(()=>go(active+1),5500);
    }
  };
  $('.carousel-prev',gal).addEventListener('click',()=>{go(active-1);start()});
  $('.carousel-next',gal).addEventListener('click',()=>{go(active+1);start()});
  dots.forEach(dot=>dot.addEventListener('click',()=>{go(Number(dot.dataset.dot));start()}));
  gal.addEventListener('mouseenter',()=>{hovered=true;stop()});
  gal.addEventListener('mouseleave',()=>{hovered=false;start()});
  gal.addEventListener('focusin',()=>{hasFocus=true;stop()});
  gal.addEventListener('focusout',()=>{setTimeout(()=>{hasFocus=gal.contains(document.activeElement);start()},0)});
  document.addEventListener('visibilitychange',start);
  reducedMotion.addEventListener?.('change',start);
  if('IntersectionObserver' in window){
    const galleryObserver=new IntersectionObserver(entries=>{onscreen=entries[0].isIntersecting;start()},{threshold:.12});
    galleryObserver.observe(gal);
  }
  // Horizontal swipe on photos, without preventing normal vertical page scrolling.
  let startX=0,startY=0,swiped=false;
  const viewport=$('.carousel-viewport',gal);
  viewport.addEventListener('touchstart',e=>{startX=e.touches[0].clientX;startY=e.touches[0].clientY;swiped=false},{passive:true});
  viewport.addEventListener('touchend',e=>{
    const dx=e.changedTouches[0].clientX-startX,dy=e.changedTouches[0].clientY-startY;
    if(Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)*1.3){swiped=true;go(active+(dx<0?1:-1));start()}
  },{passive:true});

  const modal=document.createElement('div');
  modal.className='lightbox';modal.setAttribute('role','dialog');modal.setAttribute('aria-label','Arena Seven photo gallery');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-hidden','true');
  modal.innerHTML='<button class="lightbox-close" type="button" aria-label="Close full-screen photo">×</button><button class="lightbox-prev" type="button" aria-label="Previous full-screen photo">←</button><figure><img src="" alt=""><figcaption></figcaption></figure><button class="lightbox-next" type="button" aria-label="Next full-screen photo">→</button>';
  document.body.appendChild(modal);
  const modalImg=$('figure img',modal),modalCaption=$('figcaption',modal);
  let modalIndex=0,returnFocus=null;
  const showModalImage=index=>{
    modalIndex=(index+photos.length)%photos.length;
    modalImg.src=photos[modalIndex].src;modalImg.alt=photos[modalIndex].alt;
    modalCaption.textContent=`${modalIndex+1} / ${photos.length} — ${photos[modalIndex].label}`;
  };
  const closeModal=()=>{
    if(!modal.classList.contains('is-open'))return;
    modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('lightbox-open');
    if(returnFocus) returnFocus.focus();
    start();
  };
  const openModal=(index,opener)=>{
    returnFocus=opener;showModalImage(index);modal.classList.add('is-open');
    modal.setAttribute('aria-hidden','false');document.body.classList.add('lightbox-open');
    stop();$('.lightbox-close',modal).focus();
  };
  gal.addEventListener('click',event=>{
    const photo=event.target.closest('[data-photo]');
    if(!photo||swiped){swiped=false;return}
    openModal(Number(photo.dataset.photo),photo);
  });
  $('.lightbox-close',modal).addEventListener('click',closeModal);
  $('.lightbox-prev',modal).addEventListener('click',()=>showModalImage(modalIndex-1));
  $('.lightbox-next',modal).addEventListener('click',()=>showModalImage(modalIndex+1));
  modal.addEventListener('click',event=>{if(event.target===modal)closeModal()});
  document.addEventListener('keydown',event=>{
    if(!modal.classList.contains('is-open'))return;
    if(event.key==='Escape'){closeModal();return}
    if(event.key==='ArrowLeft')showModalImage(modalIndex-1);
    if(event.key==='ArrowRight')showModalImage(modalIndex+1);
    if(event.key==='Tab'){
      const controls=$$('button',modal);
      if(event.shiftKey && document.activeElement===controls[0]){event.preventDefault();controls[controls.length-1].focus()}
      else if(!event.shiftKey && document.activeElement===controls[controls.length-1]){event.preventDefault();controls[0].focus()}
    }
  });
  start();
}
