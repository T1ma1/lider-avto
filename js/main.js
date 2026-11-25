/* Автопрокат «ЛАЙТ» */
const PHONE_WA='79898888854';
// Цены — из сообщения владельца (₽ в сутки). Фото: настоящие фото этих моделей с Wikimedia Commons — серия одной машины на модель (<id>-N.webp), авторы в credits.html.
const CARS=[
  {id:'granta', name:'Lada Granta', sub:'Седан', price:1800, photos:['granta-1','granta-2']},
  {id:'polo', name:'Volkswagen Polo', sub:'Седан', price:2500, photos:['polo-1','polo-2','polo-3']},
  {id:'solaris', name:'Hyundai Solaris', sub:'Седан', price:2700, photos:['solaris-1','solaris-2']},
  {id:'rio', name:'Kia Rio', sub:'Седан, 2022', price:2800, photos:['rio-1','rio-2']},
  {id:'elantra', name:'Hyundai Elantra', sub:'Седан, 2021', price:3500, photos:['elantra-1','elantra-2','elantra-3']},
  {id:'changan', name:'Changan UNI-Z', sub:'Кроссовер', price:4500, photos:['changan-1','changan-2']},
  {id:'camry', name:'Toyota Camry 55', sub:'Седан', price:4500, photos:['camry-1','camry-2','camry-3']},
  {id:'gac', name:'GAC', sub:'Кроссовер', price:8000, photos:['gac-1','gac-2','gac-3']},
  {id:'li6', name:'Li Auto L6', sub:'Кроссовер', price:10000, photos:['li6-1','li6-2','li6-3']},
];
const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmt=n=>n.toLocaleString('ru-RU');
const src=p=>`assets/img/cars/${p}.webp`;

// галерея: листается пальцем/колёсиком (scroll-snap), точки, стрелки, счётчик
function gallery(el,car,big){
  el.innerHTML=`<div class="gal-track">${car.photos.map((p,i)=>`<img src="${src(p)}" alt="${car.name} — фото ${i+1}" loading="${big||i?'lazy':'eager'}" class="${big?'':'cover'}" draggable="false">`).join('')}</div>`+
    (car.photos.length>1?`<div class="gal-dots">${car.photos.map((_,i)=>`<i class="${i?'':'on'}"></i>`).join('')}</div><button class="gal-arr l" aria-label="Предыдущее фото">‹</button><button class="gal-arr r" aria-label="Следующее фото">›</button><span class="gal-n">1/${car.photos.length}</span>`:'');
  const tr=el.querySelector('.gal-track'), dots=[...el.querySelectorAll('.gal-dots i')], n=el.querySelector('.gal-n');
  const idx=()=>Math.round(tr.scrollLeft/tr.clientWidth);
  tr.addEventListener('scroll',()=>{const i=idx();dots.forEach((d,k)=>d.classList.toggle('on',k===i));if(n)n.textContent=`${i+1}/${car.photos.length}`},{passive:true});
  const go=d=>{const i=Math.max(0,Math.min(car.photos.length-1,idx()+d));tr.scrollTo({left:i*tr.clientWidth,behavior:REDUCED?'auto':'smooth'})};
  el.querySelector('.gal-arr.l')?.addEventListener('click',e=>{e.stopPropagation();go(-1)});
  el.querySelector('.gal-arr.r')?.addEventListener('click',e=>{e.stopPropagation();go(1)});
}

// карточки автопарка
const list=document.getElementById('cars');
list.innerHTML=CARS.map((c,k)=>`
  <article class="car" style="--rd:${(k%3)*90}ms" data-id="${c.id}" tabindex="0" aria-label="${c.name}, ${fmt(c.price)} рублей в сутки — подробнее">
    <div class="gal"></div>
    <div class="car-body">
      <div><h3>${c.name}</h3><small>${c.sub}</small></div>
      <div class="car-price"><b>${fmt(c.price)} ₽</b><span>в сутки</span></div>
    </div>
    <button class="car-more" type="button">Подробнее</button>
  </article>`).join('');
list.querySelectorAll('.car').forEach(card=>{
  const car=CARS.find(c=>c.id===card.dataset.id);
  gallery(card.querySelector('.gal'),car,false);
  // нажатие открывает «подробнее»; свайп по фото — только листает
  let sx=0, sy=0, moved=false;
  card.addEventListener('pointerdown',e=>{sx=e.clientX;sy=e.clientY;moved=false});
  card.addEventListener('pointermove',e=>{if(Math.abs(e.clientX-sx)>8||Math.abs(e.clientY-sy)>8)moved=true});
  card.addEventListener('click',e=>{if(moved||e.target.closest('.gal-arr'))return;openSheet(car)});
  card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openSheet(car)}});
});

// окно «подробнее»
const sheet=document.getElementById('sheet');
function openSheet(car){
  gallery(document.getElementById('sheetGal'),car,true);
  document.getElementById('sheetName').textContent=car.name;
  document.getElementById('sheetSub').textContent=car.sub;
  document.getElementById('sheetPrice').textContent=fmt(car.price);
  document.getElementById('sheetWa').href=`https://wa.me/${PHONE_WA}?text=${encodeURIComponent(`Здравствуйте! Хочу арендовать ${car.name} (${fmt(car.price)} ₽/сутки).`)}`;
  if(sheet.showModal) sheet.showModal(); else sheet.setAttribute('open','');
  document.body.style.overflow='hidden';
}
function closeSheet(){ if(sheet.open) sheet.close(); }
sheet.addEventListener('close',()=>{document.body.style.overflow=''});
document.getElementById('sheetX').addEventListener('click',closeSheet);
sheet.addEventListener('click',e=>{if(e.target===sheet)closeSheet()});   // клик по фону

// интро: знак → «ЛАЙТ» → подпись → шторка; клик или клавиша — пропуск
const root=document.documentElement, intro=document.getElementById('intro');
function introEnd(){
  if(!root.classList.contains('intro-on')) return;
  intro.classList.add('out'); root.classList.remove('intro-on');
  setTimeout(()=>intro.remove(),950);
}
if(root.classList.contains('intro-on')){
  const t=location.hash==='#hold'?0:setTimeout(introEnd,2900);
  const skip=()=>{clearTimeout(t);introEnd()};
  intro.addEventListener('pointerdown',skip,{once:true});
  addEventListener('keydown',skip,{once:true});
} else intro.remove();

document.getElementById('yr').textContent=new Date().getFullYear();

// нижняя панель на телефоне — когда кнопки первого экрана ушли с экрана
const dock=document.querySelector('.dock'), heroCta=document.querySelector('.hero .cta');
new IntersectionObserver(([e])=>dock.classList.toggle('show',!e.isIntersecting&&e.boundingClientRect.top<0)).observe(heroCta);

// тихое появление блоков при прокрутке (один раз)
const rvEls=document.querySelectorAll('.rv,.rv-kids,.car');
if('IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px',threshold:.12});
  rvEls.forEach(el=>io.observe(el));
} else rvEls.forEach(el=>el.classList.add('in'));

// мягкий свет за курсором на карточках «В каждой машине»
document.querySelectorAll('.ft').forEach(el=>el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.setProperty('--mx',(e.clientX-r.left)+'px');el.style.setProperty('--my',(e.clientY-r.top)+'px')}));
