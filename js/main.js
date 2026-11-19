/* Лидер Авто — скрипты */
// ===== Настройки: заменить на реальные =====
const WA = '79298770000';
// cls: eco | comfort | business | suv ; price — ₽/сутки (примерные)
const CARS = [
  {id:'rio',     name:'Kia Rio',            sub:'или аналог',   cls:'eco',      clsName:'Эконом',       img:'rio',      price:2500, seats:5, gear:'АКПП', fuel:'АИ-92'},
  {id:'solaris', name:'Hyundai Solaris',    sub:'или аналог',   cls:'eco',      clsName:'Эконом',       img:'solaris',  price:2500, seats:5, gear:'АКПП', fuel:'АИ-92'},
  {id:'k5',      name:'Kia K5',             sub:'2.0 AT',       cls:'comfort',  clsName:'Комфорт',      img:'k5',       price:4500, seats:5, gear:'АКПП', fuel:'АИ-95'},
  {id:'camry',   name:'Toyota Camry',       sub:'2.5 AT',       cls:'business', clsName:'Бизнес',       img:'camry',    price:6000, seats:5, gear:'АКПП', fuel:'АИ-95'},
  {id:'merc',    name:'Mercedes-Benz C',    sub:'C 200',        cls:'business', clsName:'Бизнес',       img:'mercedes', price:8000, seats:5, gear:'АКПП', fuel:'АИ-95'},
  {id:'rav4',    name:'Toyota RAV4',        sub:'полный привод',cls:'suv',      clsName:'Кроссовер',    img:'rav4',     price:6500, seats:5, gear:'АКПП', fuel:'АИ-95'},
];

const fmt = n => n.toLocaleString('ru-RU') + ' ₽';
const ico = {
  seats:'<svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="3.5"/><path d="M5 21c0-4 3-7 7-7s7 3 7 7"/></svg>',
  gear:'<svg viewBox="0 0 24 24"><circle cx="6" cy="6" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="12" cy="18" r="2"/><path d="M6 8v8M12 8v8M18 8v4H6"/></svg>',
  fuel:'<svg viewBox="0 0 24 24"><path d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M3 21h13M7 8h5M15 10h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V9l-3-3"/></svg>',
  arr:'<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
};

const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;

// fleet grid
const grid = document.getElementById('grid');
grid.innerHTML = CARS.map((c,i)=>`
  <article class="car" data-c="${c.cls}">
    <div class="car-img"><img src="assets/img/${c.img}.webp" alt="${c.name} — аренда в Махачкале" loading="lazy"><span class="car-cls">${c.clsName}</span></div>
    <div class="car-body">
      <h3>${c.name}<small>${c.sub}</small></h3>
      <div class="specs"><span>${ico.seats}${c.seats} мест</span><span>${ico.gear}${c.gear}</span><span>${ico.fuel}${c.fuel}</span></div>
      <div class="car-foot">
        <div class="price">от<b>${c.price.toLocaleString('ru-RU')} <i>₽/сутки</i></b></div>
        <a class="book" href="#booking" data-car="${c.id}" aria-label="Забронировать ${c.name}">${ico.arr}</a>
      </div>
    </div>
  </article>`).join('');

// filter
document.querySelectorAll('.tab').forEach(t=>t.addEventListener('click',()=>{
  document.querySelectorAll('.tab').forEach(x=>{x.classList.remove('on');x.setAttribute('aria-selected','false')});
  t.classList.add('on');t.setAttribute('aria-selected','true');
  const f=t.dataset.f;
  const shown=[];
  grid.querySelectorAll('.car').forEach(c=>{const on=f==='all'||c.dataset.c===f;c.classList.toggle('hide',!on);if(on)shown.push(c)});
  if(!REDUCED) shown.forEach((c,i)=>c.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:260,delay:i*35,easing:'cubic-bezier(.23,1,.32,1)',fill:'backwards'}));
}));

// booking form
const sel=document.getElementById('fCar'), from=document.getElementById('fFrom'), to=document.getElementById('fTo');
sel.innerHTML = CARS.map(c=>`<option value="${c.id}">${c.name} — от ${fmt(c.price)}/сутки</option>`).join('');
const iso=d=>new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);
const today=new Date(); const tmr=new Date(Date.now()+864e5);
from.value=iso(today); to.value=iso(new Date(Date.now()+3*864e5)); from.min=iso(today); to.min=iso(tmr);
const days=()=>Math.max(1,Math.round((new Date(to.value)-new Date(from.value))/864e5)||1);
const disc=d=>d>=30?.8:d>=7?.85:d>=3?.93:1;
const plural=(n,a,b,c)=>{n=Math.abs(n)%100;const m=n%10;return n>10&&n<20?c:m>1&&m<5?b:m===1?a:c};
function est(){
  const c=CARS.find(x=>x.id===sel.value), d=days();
  if(new Date(to.value)<=new Date(from.value)){to.value=iso(new Date(new Date(from.value).getTime()+864e5))}
  to.min=iso(new Date(new Date(from.value).getTime()+864e5));
  const sum=Math.round(c.price*d*disc(d)/100)*100;
  document.getElementById('estDays').textContent=`Примерно за ${d} ${plural(d,'сутки','суток','суток')}${disc(d)<1?' · со скидкой':''}`;
  document.getElementById('estSum').textContent=fmt(sum);
}
[sel,from,to].forEach(el=>el.addEventListener('change',est)); est();
document.querySelectorAll('[data-car]').forEach(a=>a.addEventListener('click',()=>{sel.value=a.dataset.car;est()}));
document.getElementById('fConsent').addEventListener('change',e=>e.target.closest('.consent').classList.remove('err'));
const dRu=v=>v.split('-').reverse().join('.');
document.getElementById('bkForm').addEventListener('submit',e=>{
  e.preventDefault();
  const cons=document.getElementById('fConsent');
  if(!cons.checked){cons.closest('.consent').classList.add('err');cons.focus();return}
  const c=CARS.find(x=>x.id===sel.value);
  const name=document.getElementById('fName').value.trim(), ph=document.getElementById('fPhone').value.trim();
  const msg=`Здравствуйте! Хочу забронировать ${c.name}\nС ${dRu(from.value)} по ${dRu(to.value)} (${days()} ${plural(days(),'сутки','суток','суток')})\n${document.getElementById('estSum').textContent} — примерная стоимость`+(name?`\nИмя: ${name}`:'')+(ph?`\nТелефон: ${ph}`:'');
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`,'_blank','noopener');
});

// header: прячется при прокрутке вниз, возвращается при прокрутке вверх
const hdr=document.getElementById('hdr'), burger=document.getElementById('burger'), dock=document.querySelector('.dock');
const heroCta=document.querySelector('.hero-cta'), booking=document.getElementById('booking');
let lastY=scrollY, ticking=false;
function onScroll(){
  const y=scrollY;
  hdr.classList.toggle('solid',y>40);
  if(!document.body.classList.contains('open')) hdr.classList.toggle('hide',y>lastY&&y>400);
  lastY=y; ticking=false;
}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true}); onScroll();

// мобильная панель: только когда кнопки первого экрана ушли и форма брони не на экране
if(dock){
  let ctaGone=false, bookingOn=false;
  const upd=()=>dock.classList.toggle('show',ctaGone&&!bookingOn);
  new IntersectionObserver(([e])=>{ctaGone=!e.isIntersecting&&e.boundingClientRect.top<0;upd()}).observe(heroCta);
  new IntersectionObserver(([e])=>{bookingOn=e.isIntersecting;upd()},{threshold:.25}).observe(booking);
}

// меню
document.querySelectorAll('.mnav a').forEach((a,i)=>a.style.setProperty('--i',i));
burger.addEventListener('click',()=>{const o=document.body.classList.toggle('open');burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'Закрыть меню':'Открыть меню');document.body.style.overflow=o?'hidden':'';hdr.classList.remove('hide')});
document.querySelectorAll('.mnav a').forEach(a=>a.addEventListener('click',()=>{document.body.classList.remove('open');document.body.style.overflow='';burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Открыть меню')}));

// заголовки секций → слова
function splitWords(el){
  let i=0;
  const walk=n=>{[...n.childNodes].forEach(c=>{
    if(c.nodeType===3){
      const frag=document.createDocumentFragment();
      c.textContent.split(/( +)/).forEach(t=>{
        if(!t) return;
        if(/^ +$/.test(t)){frag.append(t);return}
        const w=document.createElement('span');w.className='w';
        const s=document.createElement('span');s.textContent=t;s.style.setProperty('--i',i++);
        w.append(s);frag.append(w);
      });
      c.replaceWith(frag);
    } else if(c.nodeType===1) walk(c);
  })};
  walk(el); el.classList.add('split');
}
document.querySelectorAll('main h2').forEach(splitWords);
document.querySelectorAll('main .eyebrow').forEach(e=>{ if(!e.closest('.hero')) e.classList.add('draw') });
const fb=document.querySelector('.foot-big');
if(fb){let k=0;fb.innerHTML=[...fb.textContent].map(ch=>ch===' '?' ':`<span class="ch" style="--i:${k++}">${ch}</span>`).join('')}

// один раз, когда элемент заходит на экран
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -12% 0px'});
document.querySelectorAll('.split,.eyebrow.draw,.reveal,.foot-big').forEach(el=>io.observe(el));

// фото дороги: медленный параллакс только у картинки (не у текста)
const px=document.getElementById('parallax');
if(px&&!REDUCED){
  let pt=false;
  addEventListener('scroll',()=>{if(pt)return;pt=true;requestAnimationFrame(()=>{const r=px.parentElement.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)px.style.transform=`translate3d(0,${(r.top/innerHeight)*-8}%,0)`;pt=false})},{passive:true});
}

// =====================================================================
// Дорога: одна метафора на всю страницу
// =====================================================================
const root=document.documentElement;
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const smooth=t=>t*t*(3-2*t);

// 1. Заголовок hero статичный: «Аренда авто в Махачкале»
const heroEl=document.querySelector('.hero');
let heroOn=true;
new IntersectionObserver(([e])=>{heroOn=e.isIntersecting}).observe(heroEl);

// 2. Серпантин под машиной: по нему к машине бежит свет фар; при прокрутке дорога выпрямляется
const cv=document.getElementById('road'), ctx=cv.getContext('2d'), carEl=document.querySelector('.hero-car');
let RW=0,RH=0,dpr=1,baseY=0,carX=0,calmT=0,calm=0;
const WAVES=[{f:.0052,p:.4,a:1},{f:.0109,p:2.1,a:.55},{f:.0021,p:4.2,a:.8},{f:.0187,p:1.3,a:.25}];
function sizeRoad(){
  dpr=Math.min(2,devicePixelRatio||1);
  const r=heroEl.getBoundingClientRect();
  RW=r.width; RH=r.height; cv.width=Math.round(RW*dpr); cv.height=Math.round(RH*dpr);
  // по макету, без учёта анимации заезда (offset* не видят transform)
  baseY=carEl.offsetTop+carEl.offsetHeight*.79; carX=carEl.offsetLeft+carEl.offsetWidth*.16;
}
function roadY(x){
  if(x>=carX) return baseY;
  const k=smooth(1-x/carX); let s=0;
  for(const w of WAVES) s+=Math.sin(x*w.f+w.p)*w.a;
  return baseY+s*Math.min(RH*.075,70)*k*(1-calm);
}
function drawRoad(t){
  ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,RW,RH);
  if(carX<160) return;                       // на узком экране машина во всю ширину — дорогу не рисуем
  const g=ctx.createLinearGradient(0,0,RW,0);
  g.addColorStop(0,'rgba(239,233,223,0)'); g.addColorStop(.18,'rgba(239,233,223,.26)'); g.addColorStop(1,'rgba(239,233,223,.1)');
  ctx.beginPath(); for(let x=0;x<=RW;x+=3){const y=roadY(x); x?ctx.lineTo(x,y):ctx.moveTo(x,y)}
  ctx.strokeStyle=g; ctx.lineWidth=1; ctx.stroke();
  if(REDUCED) return;
  const tt=t-roadT0; if(roadT0<0||tt>3200||tt<0) return; const ph=tt/3200; if(ph>.82) return;
  const px=smooth(ph/.82)*carX;
  for(let i=1;i<34;i++){const x=px-i*6; if(x<0)break; const a=(1-i/34);
    ctx.fillStyle=`rgba(230,207,159,${a*.45})`; ctx.beginPath(); ctx.arc(x,roadY(x),1.3*a+.3,0,7); ctx.fill()}
  const y=roadY(px), rg=ctx.createRadialGradient(px,y,0,px,y,24);
  rg.addColorStop(0,'rgba(244,222,170,.95)'); rg.addColorStop(.25,'rgba(230,207,159,.35)'); rg.addColorStop(1,'rgba(230,207,159,0)');
  ctx.fillStyle=rg; ctx.beginPath(); ctx.arc(px,y,24,0,7); ctx.fill();
}

// 3. Автопарк: закреплённая лента, едет вбок; одометр считает машины
const fleet=document.getElementById('fleet'), how=document.getElementById('how');
const odoNow=document.getElementById('odoNow'), odoAll=document.getElementById('odoAll'), odoBar=document.getElementById('odoBar');
const pinMQ=matchMedia('(min-width:1024px) and (min-height:640px)');
let pinOK=false, travel=0;
function layoutPins(){
  pinOK=false; root.classList.remove('pin');   // без закрепления: всё течёт вместе со страницей
  grid.style.transform='';
  if(pinOK){
    const w=fleet.querySelector('.wrap').getBoundingClientRect().width;
    travel=Math.max(0,grid.offsetWidth-w);
    fleet.style.height=(innerHeight+travel*1.15)+'px';
    how.style.height=(innerHeight*2.4)+'px';
  } else { travel=0; fleet.style.height=''; how.style.height='' }
  const n=grid.querySelectorAll('.car:not(.hide)').length; odoAll.textContent=String(n).padStart(2,'0');
}
document.querySelectorAll('.tab').forEach(t=>t.addEventListener('click',()=>{layoutPins();if(pinOK){const top=fleet.getBoundingClientRect().top+scrollY;if(scrollY>top)scrollTo(0,top)}onScene()}));

// 4. Шаги: до ключей 15 → 0 минут
const stepsEl=document.querySelector('.steps'), stepLis=[...stepsEl.children], kmin=document.getElementById('kmin'), kfig=document.querySelector('.steps-img');
stepsEl.classList.add('js-steps');
let minShown=15, minAnim=0;
function setMinutes(to){
  if(to===minShown) return;
  minShown=to; kfig.classList.toggle('zero',to===0);
  roll(kmin,String(to).padStart(2,'0'));
}
function lightSteps(n){
  stepLis.forEach((li,i)=>li.classList.toggle('on',i<n));
  setMinutes(n?+stepLis[n-1].dataset.min:15);
}
if(REDUCED) lightSteps(4);
else {
  // телефон и узкий экран: шаг загорается, когда доходит до середины экрана
  const stepIO=new IntersectionObserver(es=>{ if(pinOK) return;
    es.forEach(e=>{ if(!e.isIntersecting) return;
      const i=stepLis.indexOf(e.target)+1, lit=stepLis.filter(l=>l.classList.contains('on')).length;
      if(i>lit) lightSteps(i);
    });
  },{rootMargin:'0px 0px -45% 0px'});
  stepLis.forEach(li=>stepIO.observe(li));
}

// 5. Маршрут: линия рисуется прокруткой, точка-машина едет, остановки загораются
const map=document.getElementById('routeMap'), trail=document.getElementById('trail'), carDot=document.getElementById('carDot');
const L=trail.getTotalLength();
trail.style.strokeDasharray=L; trail.style.strokeDashoffset=L;
const stops=[...map.querySelectorAll('.stop')].map(g=>{
  const c=g.querySelector('circle'), cx=+c.getAttribute('cx'), cy=+c.getAttribute('cy');
  let best=0,bd=1e9; for(let s=0;s<=400;s++){const p=trail.getPointAtLength(L*s/400), d=(p.x-cx)**2+(p.y-cy)**2; if(d<bd){bd=d;best=s/400}}
  return {g,at:best};
});
let routeP=-1;
function drawRoute(p){
  if(Math.abs(p-routeP)<.001) return; routeP=p;
  trail.style.strokeDashoffset=L*(1-p);
  const pt=trail.getPointAtLength(L*p); carDot.setAttribute('cx',pt.x); carDot.setAttribute('cy',pt.y);
  stops.forEach(s=>s.g.classList.toggle('on',p>=s.at-.005));
}

// =====================================================================
// Сцены истории: машина заезжает (hero) → уезжает и оставляет след →
// паркуется у вас (бронь). Каждая срабатывает один раз, когда блок на экране.
// =====================================================================

// одометр — только для отсчёта «до ключей»
function roll(el,text,instant){
  const chars=[...text];
  if(!el.__roll||el.__roll.len!==chars.length){
    el.innerHTML=chars.map((c,i)=>`<span class="dr" aria-hidden="true"><span class="dr-s" style="--i:${i}">${'0123456789'.split('').map(d=>`<i>${d}</i>`).join('')}</span></span>`).join('');
    el.__roll={len:chars.length};
    if(instant) el.classList.add('dr-now');
    void el.offsetWidth;
  }
  el.setAttribute('aria-label',text+' мин');
  [...el.querySelectorAll('.dr-s')].forEach((s,k)=>{s.style.transform=`translateY(${-(+chars[k])*10}%)`});
  if(instant) requestAnimationFrame(()=>el.classList.remove('dr-now'));
}
if(!REDUCED) roll(kmin,'15',true);

// запуск сцены, когда блок заметно на экране
function onScene1(el,fn,th=.45){
  if(!el) return;
  if(REDUCED){el.classList.add('played');return}
  const o=new IntersectionObserver(([e])=>{if(e.isIntersecting){o.disconnect();fn(el)}},{threshold:th});
  o.observe(el);
}
onScene1(document.getElementById('away'),el=>el.classList.add('play'),.55);
onScene1(document.querySelector('.park'),el=>el.classList.add('play'),.6);

// общий проход по сценам
function onScene(){
  const vh=innerHeight;
  calmT=clamp(scrollY/(heroEl.offsetHeight*.7));
  if(pinOK){
    const r=fleet.getBoundingClientRect(), p=clamp(-r.top/Math.max(1,travel*1.15));
    grid.style.transform=`translate3d(${(-p*travel).toFixed(1)}px,0,0)`;
    const n=grid.querySelectorAll('.car:not(.hide)').length;
    odoNow.textContent=String(Math.min(n,1+Math.round(p*(n-1)))).padStart(2,'0'); odoBar.parentElement.style.setProperty('--fp',p.toFixed(3));
    const hr=how.getBoundingClientRect(), hp=clamp(-hr.top/Math.max(1,hr.height-vh));
    lightSteps(Math.min(4,Math.floor(hp*4.6)));
  }
  const mr=map.getBoundingClientRect();
  drawRoute(REDUCED?1:clamp((vh*.85-mr.top)/(vh*.75)));
}
addEventListener('scroll',onScene,{passive:true});
let rz; addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(()=>{sizeRoad();layoutPins();onScene()},150)});
function frame(t){
  calm+=(calmT-calm)*.08;
  if(heroOn) drawRoad(t);
  requestAnimationFrame(frame);
}
// интро: при каждой загрузке и обновлении страницы; касание или клавиша — пропустить
let roadT0=-1;
const introEl=document.getElementById('intro');
function introEnd(){
  if(!root.classList.contains('intro-on')) return;
  introEl.classList.add('out');
  root.classList.remove('intro-on');            // hero оживает: машина заезжает
  roadT0=performance.now();
  setTimeout(()=>introEl.remove(),900);
}
if(root.classList.contains('intro-on')){
  // логотип прорисовывается, буквы поднимаются, затем шторка — как на других сайтах
  const tid=setTimeout(introEnd,2950);
  const skip=()=>{clearTimeout(tid);introEnd()};
  introEl.addEventListener('pointerdown',skip,{once:true});
  addEventListener('keydown',skip,{once:true});
} else { introEl&&introEl.remove(); roadT0=0 }

function start(){sizeRoad();layoutPins();onScene();if(REDUCED){drawRoad(0)}else requestAnimationFrame(frame)}
if(document.readyState==='complete') start(); else addEventListener('load',start);

// open now (Махачкала UTC+3)
(function(){const now=new Date(Date.now()+(new Date().getTimezoneOffset()+180)*6e4);const h=now.getHours()+now.getMinutes()/60;const el=document.getElementById('openNow');const open=h>=10&&h<19;el.classList.toggle('closed',!open);el.querySelector('span').textContent=open?'Сейчас открыто':'Сейчас закрыто · откроемся в 10:00'})();
document.getElementById('yr').textContent=new Date().getFullYear();

// «ЛИДЕР АВТО» в подвале — ровно по ширине колонки на любом экране
const fbig=document.querySelector('.foot-big');
function fitFoot(){ if(!fbig) return; fbig.style.fontSize='100px'; const rg=document.createRange(); rg.selectNodeContents(fbig); const w=fbig.clientWidth, tw=rg.getBoundingClientRect().width; if(tw) fbig.style.fontSize=(100*w/tw*.985).toFixed(2)+'px' }
fitFoot(); addEventListener('resize',fitFoot); document.fonts&&document.fonts.ready.then(fitFoot);
