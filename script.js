const PHONE="918267930564";
/* Add photos/videos: put files in assets/gallery/ and list them here. */
const GALLERY=[
  // {type:"img",src:"assets/gallery/photo1.jpg",alt:"Box cricket at Arena Seven"},
  // {type:"video",src:"assets/gallery/match.mp4"},
];
const $=s=>document.querySelector(s);
const y=$("#yr");if(y)y.textContent=new Date().getFullYear();
const gal=$("#gal");
if(gal){const t=GALLERY.length?GALLERY:Array.from({length:6},()=>null);
gal.innerHTML=t.map(x=>!x?'<div class="tile">Photo coming soon</div>':x.type==="video"?`<div class="tile"><video src="${x.src}" controls playsinline preload="metadata"></video></div>`:`<div class="tile"><img src="${x.src}" alt="${x.alt||"Arena Seven"}" loading="lazy"></div>`).join("")}
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
