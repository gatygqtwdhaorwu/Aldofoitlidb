(()=>{
'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
let cats=null,products=null;
const API_BASE = location.pathname.includes('/categoria/') ? '../api/' : 'api/';
const load=async()=>{
  try{
    const [a,b]=await Promise.all([
      fetch(API_BASE+'catalog-categories.json',{cache:'force-cache'}),
      fetch(API_BASE+'catalog-search.json',{cache:'force-cache'})
    ]);
    if(!a.ok||!b.ok) throw new Error('catalog data unavailable');
    cats=await a.json(); products=await b.json();
  }catch(e){cats=[];products=[];}
};
const css=`
.local-ui-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.76);z-index:9998;display:flex;justify-content:flex-end}
.local-cat-panel{width:min(92vw,430px);height:100%;background:#1b1a17;box-shadow:-10px 0 35px rgba(0,0,0,.45);display:flex;flex-direction:column}
.local-cat-head{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;border-bottom:1px solid rgba(212,175,55,.22);color:#e7b93b;font-size:18px;font-weight:700}
.local-cat-close,.local-search-close{background:none;border:0;color:#aaa;font-size:32px;line-height:1;cursor:pointer;padding:0 2px}
.local-cat-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;overflow:auto;padding:16px}
.local-cat-item{color:#aaa;text-decoration:none;text-align:center;font-size:12px;line-height:1.35}
.local-cat-item img{display:block;width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:8px;background:#fff;margin-bottom:6px}
.local-search-panel{position:fixed;inset:0;background:#080807;z-index:9997;display:none;overflow:auto}
.local-search-inner{width:min(100%,900px);margin:0 auto;padding:14px 12px 30px}
.local-search-head{position:sticky;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 2px 14px;background:#080807;color:#e7b93b;font-weight:700;border-bottom:1px solid rgba(212,175,55,.2)}
.local-search-head span{font-size:16px}
.local-search-results{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding-top:12px}
.local-search-item{display:flex;flex-direction:column;text-decoration:none;color:#ddd;background:#171613;border:1px solid rgba(212,175,55,.16);border-radius:12px;overflow:hidden;min-width:0;cursor:pointer}
.local-search-item img{display:block;width:100%;aspect-ratio:1/1;object-fit:cover;background:#fff}
.local-search-info{padding:9px 10px 11px}
.local-search-title{font-size:12px;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.local-search-price{margin-top:5px;color:#e7b93b;font-size:15px;font-weight:800}
.local-search-count{font-size:11px;color:#999;margin-top:2px}
.local-search-empty{padding:30px 10px;color:#aaa;text-align:center;font-size:13px}
@media(max-width:520px){.local-cat-grid{gap:10px;padding:14px}.local-search-inner{padding-left:10px;padding-right:10px}.local-search-results{gap:8px}.local-search-info{padding:8px}.local-search-title{font-size:11px}.local-search-price{font-size:14px}}
`;
const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
const closeEl=el=>{if(el)el.remove()};
function openCats(){
 if(document.querySelector('.local-ui-backdrop'))return;
 const wrap=document.createElement('div');wrap.className='local-ui-backdrop';
 const panel=document.createElement('aside');panel.className='local-cat-panel';
 panel.innerHTML='<div class="local-cat-head"><span>Tutte le categorie</span><button class="local-cat-close" aria-label="Chiudi">×</button></div><div class="local-cat-grid"><div class="local-search-empty">Caricamento categorie…</div></div>';
 wrap.appendChild(panel);document.body.appendChild(wrap);
 const close=()=>closeEl(wrap);wrap.addEventListener('click',e=>{if(e.target===wrap)close()});panel.querySelector('.local-cat-close').onclick=close;
 const grid=panel.querySelector('.local-cat-grid');
 const render=()=>{if(!cats?.length){grid.innerHTML='<div class="local-search-empty">Nessuna categoria disponibile</div>';return;}const prefix=location.pathname.includes('/categoria/')?'../':'';grid.innerHTML=cats.map(c=>{const raw=String(c.href||'').replace(/^\/+/, '').replace(/\.html$/,'')+'.html';return `<a class="local-cat-item" href="${prefix}${esc(raw)}"><img loading="lazy" decoding="async" src="${esc(c.image)}" alt="${esc(c.name)}" onerror="this.style.opacity='.35'"><span>${esc(c.name)}</span></a>`}).join('')};
 if(cats)render();else load().then(render);
}
function openSearch(input,box){
 const q=input.value.trim();
 if(q.length<2){box.style.display='none';return;}
 if(!products){box.innerHTML='<div class="local-search-inner"><div class="local-search-head"><span>Cerca nel catalogo</span><button class="local-search-close">×</button></div><div class="local-search-empty">Caricamento…</div></div>';box.style.display='block';box.querySelector('button').onclick=()=>box.style.display='none';load().then(()=>openSearch(input,box));return;}
 const nq=norm(q),res=products.filter(x=>norm(x.title).includes(nq)).slice(0,40);
 box.innerHTML=`<div class="local-search-inner"><div class="local-search-head"><span>Risultati per “${esc(q)}” <small style="color:#888;font-weight:400">${res.length}${res.length===40?'+':''}</small></span><button class="local-search-close" aria-label="Chiudi">×</button></div>${res.length?`<div class="local-search-results">${res.map((x,i)=>`<button type="button" class="local-search-item" data-search-index="${i}"><img loading="lazy" decoding="async" src="${esc(x.image)}" alt="${esc(x.title)}"><div class="local-search-info"><div class="local-search-title">${esc(x.title)}</div>${x.price?`<div class="local-search-price">${esc(x.price)}</div>`:''}<div class="local-search-count">${Array.isArray(x.gallery)?x.gallery.length:1} foto</div></div></button>`).join('')}</div>`:'<div class="local-search-empty">Nessun prodotto trovato</div>'}</div>`;
 box.style.display='block';
 box.querySelector('.local-search-close').onclick=()=>box.style.display='none';
 box.querySelectorAll('[data-search-index]').forEach((el,i)=>el.onclick=()=>{
   const x=res[i];
   if(x && window.ALDO_FOOTLOCKERGallery && Array.isArray(x.gallery) && x.gallery.length){box.style.display='none';window.ALDO_FOOTLOCKERGallery.open(x.gallery,x.title);}
 });
}
function setup(){
 const inputs=[...document.querySelectorAll('input[placeholder="Cerca nel catalogo"]')];
 const buttons=[...document.querySelectorAll('button')].filter(b=>norm(b.textContent)==='categorie');
 buttons.forEach(b=>{if(b.dataset.localUiBound)return;b.dataset.localUiBound='1';b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();openCats();},true)});
 inputs.forEach(input=>{if(input.dataset.localUiBound)return;input.dataset.localUiBound='1';let timer;
   const box=document.createElement('div');box.className='local-search-panel';document.body.appendChild(box);
   input.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>openSearch(input,box),220)});
   input.addEventListener('focus',()=>{if(input.value.trim().length>=2)openSearch(input,box)});
   document.addEventListener('click',e=>{if(!box.contains(e.target)&&e.target!==input&&box.style.display==='block')box.style.display='none'});
   input.addEventListener('keydown',e=>{if(e.key==='Escape'){box.style.display='none';input.blur()}});
 });
}
load();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();
