(()=>{"use strict";
const KEY="aldo_footlocker_cart_v1";
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const isCat=location.pathname.includes("/categoria/");
const apiPrefix=isCat?"../api/":"api/";
const assetPrefix=isCat?"../assets/":"assets/";
let cart=[];
try{cart=JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){cart=[]}
const save=()=>{localStorage.setItem(KEY,JSON.stringify(cart));renderBadge();};
const moneyToCents=v=>{let s=String(v??"").replace(/[^\d,.-]/g,"").replace(/\./g,"").replace(",",".");let n=parseFloat(s);return Number.isFinite(n)?Math.round(n*100):0};
const fmt=c=>new Intl.NumberFormat("it-IT",{style:"currency",currency:"EUR"}).format((c||0)/100);
const getCount=()=>cart.reduce((a,x)=>a+x.qty,0);
function renderBadge(){
 let b=document.getElementById("aldo-cart-badge");
 if(!b)return;
 b.textContent=getCount();
 b.style.display=getCount()?"inline-flex":"none";
}
function add(item){
 const id=String(item.key||item.id||item.title);
 const old=cart.find(x=>x.key===id);
 if(old)old.qty++; else cart.push({...item,key:id,qty:1});
 save(); openCart();
}
function remove(key){cart=cart.filter(x=>x.key!==key);save();renderCart();}
function change(key,delta){const x=cart.find(x=>x.key===key);if(!x)return;x.qty+=delta;if(x.qty<1)return remove(key);save();renderCart();}
function injectStyle(){
 if(document.getElementById("aldo-cart-style"))return;
 const s=document.createElement("style");s.id="aldo-cart-style";s.textContent=`
 #aldo-cart-fab{position:fixed;right:18px;bottom:18px;z-index:99990;border:1px solid rgba(231,185,59,.55);background:#17140f;color:#fff;border-radius:999px;padding:12px 16px;box-shadow:0 10px 35px rgba(0,0,0,.4);font-weight:800;cursor:pointer;display:flex;align-items:center;gap:8px}
 #aldo-cart-badge{min-width:21px;height:21px;border-radius:50%;display:none;align-items:center;justify-content:center;background:#e7b93b;color:#111;font-size:11px}
 .aldo-cart-back{position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:99999;display:none}
 .aldo-cart-panel{position:absolute;right:0;top:0;width:min(94vw,430px);height:100%;background:#11100d;color:#fff;display:flex;flex-direction:column;box-shadow:-15px 0 50px rgba(0,0,0,.55)}
 .aldo-cart-head{padding:16px;border-bottom:1px solid #39342a;display:flex;justify-content:space-between;align-items:center;color:#e7b93b;font-weight:900;font-size:18px}
 .aldo-cart-close{border:0;background:none;color:#aaa;font-size:30px;cursor:pointer}
 .aldo-cart-list{flex:1;overflow:auto;padding:12px}
 .aldo-cart-item{display:grid;grid-template-columns:64px 1fr auto;gap:10px;padding:10px 0;border-bottom:1px solid #29261f}
 .aldo-cart-item img{width:64px;height:64px;object-fit:cover;border-radius:9px;background:#222}
 .aldo-cart-title{font-size:12px;line-height:1.35}.aldo-cart-price{color:#e7b93b;font-weight:800;margin-top:4px}
 .aldo-cart-controls{display:flex;align-items:center;gap:7px;margin-top:7px}.aldo-cart-controls button{width:26px;height:26px;border-radius:7px;border:1px solid #555;background:#1b1a17;color:#fff}
 .aldo-cart-del{border:0!important;background:none!important;color:#888!important;font-size:18px}
 .aldo-cart-foot{padding:14px;border-top:1px solid #39342a}.aldo-cart-total{display:flex;justify-content:space-between;font-weight:900;margin-bottom:10px}
 .aldo-cart-checkout{display:block;text-align:center;text-decoration:none;background:#e7b93b;color:#111;padding:13px;border-radius:999px;font-weight:900}
 .aldo-add-cart{display:block;width:100%;margin-top:12px;border:0;border-radius:999px;padding:13px;background:#e7b93b;color:#111;font-weight:900;cursor:pointer}
 `;
 document.head.appendChild(s);
}
function fab(){
 if(document.getElementById("aldo-cart-fab"))return;
 const b=document.createElement("button");b.id="aldo-cart-fab";b.innerHTML=`🛒 <span>Carrello</span> <span id="aldo-cart-badge"></span>`;
 b.onclick=openCart;document.body.appendChild(b);renderBadge();
}
function openCart(){const x=document.getElementById("aldo-cart-back");if(x){x.style.display="block";renderCart();}}
function closeCart(){const x=document.getElementById("aldo-cart-back");if(x)x.style.display="none"}
function renderCart(){
 const list=document.getElementById("aldo-cart-list"),total=document.getElementById("aldo-cart-total");
 if(!list)return;
 if(!cart.length){list.innerHTML=`<div style="padding:40px 10px;text-align:center;color:#999">La tua s𝗲𝗹𝗮 è vuota.</div>`}
 else list.innerHTML=cart.map(x=>`<div class="aldo-cart-item">
 <img src="${esc(x.image||"")}" alt=""><div><div class="aldo-cart-title">${esc(x.title)}</div><div class="aldo-cart-price">${fmt(x.unit_amount||0)}</div>
 <div class="aldo-cart-controls"><button data-act="minus" data-key="${esc(x.key)}">−</button><span>${x.qty}</span><button data-act="plus" data-key="${esc(x.key)}">+</button></div></div>
 <button class="aldo-cart-del" data-act="del" data-key="${esc(x.key)}">×</button></div>`).join("");
 total.textContent=fmt(cart.reduce((a,x)=>a+(x.unit_amount||0)*x.qty,0));
}
async function buildFromProductPage(){
 const key=new URLSearchParams(location.search).get("p"); if(!key)return;
 try{
  const r=await fetch(apiPrefix+"product-pages.json",{cache:"force-cache"});const data=await r.json();const p=data[key];if(!p)return;
  const card=document.querySelector(".card");if(!card)return;
  const btn=document.createElement("button");btn.className="aldo-add-cart";btn.textContent="🛒 Aggiungi al carrello";
  btn.onclick=()=>add({key,title:p.title,image:(p.photos||[])[0]||"",unit_amount:moneyToCents(p.price)});
  card.appendChild(btn);
 }catch(e){}
}
async function enhanceCards(){
 const links=[...document.querySelectorAll('a[href*="prodotto.html?p="]')];
 if(!links.length)return;
 let data={};try{const r=await fetch(apiPrefix+"product-pages.json",{cache:"force-cache"});data=await r.json()}catch(e){return}
 links.forEach(a=>{
  if(a.dataset.cartEnhanced)return;a.dataset.cartEnhanced="1";
  const m=a.href.match(/[?&]p=([^&#]+)/);const key=m&&decodeURIComponent(m[1]);const p=key&&data[key];if(!p)return;
  const parent=a.parentElement;if(!parent)return;
  const btn=document.createElement("button");btn.className="aldo-add-cart";btn.textContent="🛒 Aggiungi";
  btn.onclick=e=>{e.preventDefault();e.stopPropagation();add({key,title:p.title,image:(p.photos||[])[0]||"",unit_amount:moneyToCents(p.price)})};
  parent.appendChild(btn);
 });
}
function setup(){
 injectStyle();fab();
 const back=document.createElement("div");back.id="aldo-cart-back";back.className="aldo-cart-back";
 back.innerHTML=`<aside class="aldo-cart-panel"><div class="aldo-cart-head"><span>🛒 Il tuo carrello</span><button class="aldo-cart-close">×</button></div><div id="aldo-cart-list" class="aldo-cart-list"></div><div class="aldo-cart-foot"><div class="aldo-cart-total"><span>Totale</span><span id="aldo-cart-total">€0,00</span></div><a class="aldo-cart-checkout" href="${assetPrefix.replace("assets/","")}checkout.html">Procedi al pagamento</a></div></aside>`;
 back.onclick=e=>{if(e.target===back)closeCart()};back.querySelector(".aldo-cart-close").onclick=closeCart;
 back.addEventListener("click",e=>{const b=e.target.closest("button[data-act]");if(!b)return;const k=b.dataset.key,a=b.dataset.act;if(a==="del")remove(k);if(a==="plus")change(k,1);if(a==="minus")change(k,-1)});
 document.body.appendChild(back);renderCart();
 buildFromProductPage();enhanceCards();
 new MutationObserver(()=>{enhanceCards(); if(location.pathname.endsWith("/prodotto.html") && !document.querySelector(".aldo-add-cart")) buildFromProductPage();}).observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",setup);else setup();
window.ALDO_CART={add,open:openCart};
})();