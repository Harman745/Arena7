const PHONE="918267930564";
const GALLERY=[
  {src:"assets/gallery/1.PNG",alt:"Arena Seven turf under floodlights"},
  {src:"assets/gallery/2.jpg.jpeg",alt:"Arena Seven turf and cricket pitch"},
  {src:"assets/gallery/3.PNG",alt:"Players enjoying a cricket match at Arena Seven"},
  {src:"assets/gallery/3E314887-3C13-4999-8687-827F3479B23E.PNG",alt:"Arena Seven turf at night"},
];
const $=s=>document.querySelector(s);
const y=$("#yr");if(y)y.textContent=new Date().getFullYear();
const gal=$("#gal");
if(gal){
  gal.className="carousel";
  gal.innerHTML=`<div class="carousel-viewport"><div class="carousel-track">${GALLERY.map((x,i)=>`<button class="carousel-slide" type="button" data-gallery-index="${i}" aria-label="Open photo ${i+1}: ${x.alt}"><img src="${x.src}" alt="${x.alt}" loading="${i?"lazy":"eager"}"></button>`).join("")}</div></div><button class="carousel-prev" type="button" aria-label="Previous photo">&#8592;</button><button class="carousel-next" type="button" aria-label="Next photo">&#8594;</button><div class="carousel-dots" aria-label="Choose a photo">${GALLERY.map((x,i)=>`<button type="button" data-carousel-index="${i}" aria-label="Show photo ${i+1}"${i?"":" aria-current=\"true\""}></button>`).join("")}</div>`;
  const track=gal.querySelector(".carousel-track"),dots=[...gal.querySelectorAll("[data-carousel-index]")];
  let slide=0;
  function moveTo(index){slide=(index+GALLERY.length)%GALLERY.length;track.style.transform=`translateX(-${slide*100}%)`;dots.forEach((dot,i)=>dot.setAttribute("aria-current",i===slide?"true":"false"))}
  const next=()=>moveTo(slide+1),previous=()=>moveTo(slide-1);
  gal.querySelector(".carousel-next").addEventListener("click",next);
  gal.querySelector(".carousel-prev").addEventListener("click",previous);
  dots.forEach(dot=>dot.addEventListener("click",()=>moveTo(+dot.dataset.carouselIndex)));
  let timer=setInterval(next,4500);
  gal.addEventListener("mouseenter",()=>clearInterval(timer));
  gal.addEventListener("mouseleave",()=>{clearInterval(timer);timer=setInterval(next,4500)});
  gal.addEventListener("focusin",()=>clearInterval(timer));
  gal.addEventListener("focusout",()=>{clearInterval(timer);timer=setInterval(next,4500)});
  const lightbox=document.createElement("div");
  lightbox.className="lightbox";
  lightbox.setAttribute("aria-hidden","true");
  lightbox.innerHTML='<button class="lightbox-close" type="button" aria-label="Close gallery">&times;</button><button class="lightbox-prev" type="button" aria-label="Previous photo">&#8592;</button><figure><img alt=""><figcaption></figcaption></figure><button class="lightbox-next" type="button" aria-label="Next photo">&#8594;</button>';
  document.body.append(lightbox);
  const lightboxImage=lightbox.querySelector("img"),caption=lightbox.querySelector("figcaption");
  let current=0;
  function show(index){current=(index+GALLERY.length)%GALLERY.length;const item=GALLERY[current];lightboxImage.src=item.src;lightboxImage.alt=item.alt;caption.textContent=`${current+1} / ${GALLERY.length}`}
  function close(){lightbox.classList.remove("is-open");lightbox.setAttribute("aria-hidden","true")}
  gal.addEventListener("click",e=>{const tile=e.target.closest("[data-gallery-index]");if(!tile)return;show(+tile.dataset.galleryIndex);lightbox.classList.add("is-open");lightbox.setAttribute("aria-hidden","false")});
  lightbox.querySelector(".lightbox-close").addEventListener("click",close);
  lightbox.querySelector(".lightbox-prev").addEventListener("click",()=>show(current-1));
  lightbox.querySelector(".lightbox-next").addEventListener("click",()=>show(current+1));
  lightbox.addEventListener("click",e=>{if(e.target===lightbox)close()});
  document.addEventListener("keydown",e=>{if(!lightbox.classList.contains("is-open"))return;if(e.key==="Escape")close();if(e.key==="ArrowLeft")show(current-1);if(e.key==="ArrowRight")show(current+1)});
}
const bf=$("#bf");
if(bf){
const OPEN=6,CLOSE=24;/* slot hours shown in the picker (edit if different) */
const pad=n=>String(n).padStart(2,"0"),now=new Date(),d=$("#d"),slots=$("#slots");
const iso=x=>`${x.getFullYear()}-${pad(x.getMonth()+1)}-${pad(x.getDate())}`;
const fmt=h=>{const x=h%24;return (x%12||12)+" "+(x>=12?"PM":"AM")};
d.min=iso(now);d.value=iso(now);
const chosen=()=>[...slots.querySelectorAll("input:checked")].map(i=>+i.value);
function sum(){const c=chosen();$("#sum").textContent=c.length?`${c.length} hour${c.length>1?"s":""} selected`:""}
function draw(){const today=d.value===iso(now);slots.innerHTML="";
for(let h=OPEN;h<CLOSE;h++)slots.insertAdjacentHTML("beforeend",`<input type="checkbox" id="s${h}" value="${h}" ${today&&h<=now.getHours()?"disabled":""}><label for="s${h}">${fmt(h)} to ${fmt(h+1)}</label>`);sum()}
d.addEventListener("change",draw);slots.addEventListener("change",sum);draw();
bf.addEventListener("submit",e=>{e.preventDefault();
const c=chosen(),name=$("#n").value.trim(),ph=$("#p").value.trim(),err=$("#err");
if(!d.value)return err.textContent="Pick a date.";
if(!c.length)return err.textContent="Pick at least one hour.";
if(!name)return err.textContent="Enter your name.";
if(ph.replace(/\D/g,"").length<10)return err.textContent="Enter a valid 10-digit phone number.";
err.textContent="";
const g=document.querySelector("input[name=g]:checked").value;
const dt=new Date(d.value+"T00:00").toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
const msg=`Hi Arena Seven, I'd like to book:\nSport: ${g}\nDate: ${dt}\nHours: ${c.sort((a,b)=>a-b).map(h=>fmt(h)+" to "+fmt(h+1)).join(", ")}\nName: ${name}\nPhone: ${ph}`;
window.open(`https://wa.me/${PHONE}?text=`+encodeURIComponent(msg),"_blank","noopener")})}
