(()=>{
'use strict';
if(window.__ALDO_WHEEL_LOADED)return;window.__ALDO_WHEEL_LOADED=true;
const products=[{"title":"🔝 OnRunning Loewe ON! citywalk Cloudtilt2.0 36-45 Loewe Loewe Scarpe","image":"https://xcimg.szwego.com/img/d4919494/20240813/i1723562445_5815_1.jpg","price":"€ 50","discount":"-20%","label":"Sneakers selezionate"},{"title":"🔝 2025 Logo Tr 35-44 Loewe Sneakers","image":"https://xcimg.szwego.com/img/0ec9ea2b/20250321/i1742562047179_5472_0_5.jpg","price":"€ 50","discount":"-10%","label":"Scarpe sportive"},{"title":"🔝 2025 Logo Tr 35-44 Loewe Sneakers","image":"https://xcimg.szwego.com/img/0ec9ea2b/20250321/i1742562293550_9430_0_4.jpg","price":"€ 50","discount":"-15%","label":"Sneakers uomo"},{"title":"🔝LOEWE 5cm 35 36 37 38 39 40 41 42 43 44 #M466S320 Scarpe Scarpe Scarpe Scarpe Scarpe Scarpe","image":"https://xcimg.szwego.com/img/f0593703/windows1739307980021_2542110721788917324.jpg","price":"€ 50","discount":"-25%","label":"Prodotti selezionati"},{"title":"🔝 LOEWE Scarpe Scarpe Scarpe","image":"https://xcimg.szwego.com/img/f0593703/windows1739307814859_9517347621511563975.jpg","price":"€ 50","discount":"-10%","label":"Abbigliamento"},{"title":"🔝 2025 Loewe Ballet Runner2.0 Logo Tr 35-40.39-45 ➕10 Scarpe sportive Scarpe Scarpe Scarpe","image":"https://xcimg.szwego.com/img/9c86d1d3/20241211/a1733857646151_3007.jpg","price":"€ 50","discount":"-30%","label":"Offerta speciale"},{"title":"🔝 2025 Loewe Ballet Runner2.0 Logo Tr 35-40.39-45 ➕10 Scarpe sportive Scarpe Scarpe Scarpe","image":"https://xcimg.szwego.com/img/9c86d1d3/20241211/a1733857808022_4561.jpg","price":"€ 50","discount":"-15%","label":"Sneakers donna"},{"title":"🔝 2025 Loewe Ballet Runner2.0 Logo Tr 35-40.39-45 ➕10 Scarpe sportive Scarpe Scarpe Scarpe","image":"https://xcimg.szwego.com/img/9c86d1d3/20241211/a1733857689919_4658.jpg","price":"€ 50","discount":"-20%","label":"Accessori"}];
const prizes=products;
const css=`
.aldo-wheel-overlay{position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.82);backdrop-filter:blur(7px);display:flex;align-items:center;justify-content:center;padding:14px;opacity:0;animation:aldoWheelFade .35s ease forwards;font-family:inherit}
.aldo-wheel-modal{width:min(96vw,520px);max-height:96vh;overflow:auto;background:radial-gradient(circle at 50% 15%,#282317 0,#11100d 42%,#080807 100%);border:1px solid rgba(231,185,59,.55);border-radius:24px;box-shadow:0 0 55px rgba(231,185,59,.18),0 20px 70px rgba(0,0,0,.65);color:#fff;position:relative;padding:18px 14px 16px;text-align:center}
.aldo-wheel-close{position:absolute;right:10px;top:8px;width:34px;height:34px;border:1px solid rgba(231,185,59,.35);border-radius:50%;background:#16140f;color:#e7b93b;font-size:25px;line-height:28px;cursor:pointer;z-index:8}
.aldo-wheel-kicker{color:#e7b93b;font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}
.aldo-wheel-title{font-size:29px;line-height:1.1;margin:4px 30px 4px;font-weight:900}
.aldo-wheel-sub{font-size:13px;color:#b9b5aa;margin:0 auto 10px;max-width:360px}
.aldo-wheel-stage{position:relative;width:min(92vw,410px);aspect-ratio:1;margin:8px auto 14px;display:grid;place-items:center}
.aldo-wheel-pointer{position:absolute;z-index:7;top:-4px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:15px solid transparent;border-right:15px solid transparent;border-top:34px solid #fff;filter:drop-shadow(0 2px 4px #000)}
.aldo-wheel-pointer:after{content:'';position:absolute;left:-10px;top:-31px;border-left:10px solid transparent;border-right:10px solid transparent;border-top:24px solid #e7b93b}
.aldo-wheel{position:absolute;inset:5px;border-radius:50%;overflow:hidden;border:9px solid #dcae32;box-shadow:inset 0 0 0 3px #fff3b0,0 0 25px rgba(231,185,59,.35);background:#17140d;transition:transform 4.8s cubic-bezier(.12,.72,.08,1);--wheel-rotation:0deg}
.aldo-wheel::after{content:'';position:absolute;inset:8px;border-radius:50%;border:2px solid rgba(255,255,255,.5);pointer-events:none}
.aldo-wheel-sectors{position:absolute;inset:0;border-radius:50%;background:conic-gradient(#161616 0 12.5%,#e6b63d 12.5% 25%,#fff8dc 25% 37.5%,#161616 37.5% 50%,#e6b63d 50% 62.5%,#fff8dc 62.5% 75%,#161616 75% 87.5%,#e6b63d 87.5% 100%)}
.aldo-wheel-item{position:absolute;left:50%;top:50%;width:92px;height:100px;margin:-50px 0 0 -46px;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:3}
.aldo-wheel-item .aldo-wheel-item-inner{width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-weight:900;line-height:1.05;transform:rotate(calc(var(--counter) - var(--wheel-rotation)));}
.aldo-wheel-item.dark{color:#fff}
.aldo-wheel-item b{font-size:17px;line-height:1}
.aldo-wheel-item span{font-size:9px;line-height:1.15;max-width:78px;margin-top:3px}
.aldo-wheel-item img{width:52px;height:52px;object-fit:contain;margin-top:4px;filter:drop-shadow(0 3px 3px rgba(0,0,0,.45));border-radius:7px;background:rgba(255,255,255,.18)}
.aldo-wheel-center{position:absolute;z-index:5;left:50%;top:50%;transform:translate(-50%,-50%);width:82px;height:82px;border-radius:50%;border:5px solid #f1c94e;background:#0c0c0b;box-shadow:0 0 0 3px #15130f,0 0 20px rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:13px;line-height:1.1;cursor:pointer}
.aldo-wheel-center:active{transform:translate(-50%,-50%) scale(.96)}
.aldo-wheel-spin{border:0;border-radius:14px;background:linear-gradient(135deg,#ffe68a,#e8aa00);color:#15120b;font-size:16px;font-weight:900;padding:13px 20px;cursor:pointer;box-shadow:0 7px 20px rgba(231,185,59,.2);width:min(92%,330px)}
.aldo-wheel-note{font-size:10px;color:#888;margin-top:8px}
.aldo-wheel-result{display:none;padding:14px;border:1px solid rgba(231,185,59,.35);border-radius:16px;background:rgba(231,185,59,.08);margin:5px auto 10px;max-width:370px}
.aldo-wheel-result strong{display:block;color:#e7b93b;font-size:26px}
.aldo-wheel-result img{width:70px;height:70px;object-fit:contain;margin:6px auto;border-radius:10px;background:#fff}
.aldo-wheel-claim{display:inline-block;margin-top:8px;padding:10px 16px;border-radius:12px;background:#25d366;color:#071b0b;text-decoration:none;font-weight:900;font-size:13px}
@keyframes aldoWheelFade{to{opacity:1}}
@media(max-width:420px){.aldo-wheel-title{font-size:24px}.aldo-wheel-modal{padding:16px 8px 13px}.aldo-wheel-stage{width:min(94vw,370px)}.aldo-wheel-item{width:78px;height:88px;margin:-44px 0 0 -39px}.aldo-wheel-item img{width:44px;height:44px}.aldo-wheel-item b{font-size:16px}.aldo-wheel-item span{font-size:8px;max-width:66px}.aldo-wheel-center{width:68px;height:68px;font-size:11px}}
`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
function esc(s){return String(s??'').replace(/[&<>"]+/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]||c));}
function show(){
 if(sessionStorage.getItem('aldo_wheel_seen')==='1')return;
 sessionStorage.setItem('aldo_wheel_seen','1');
 const overlay=document.createElement('div');overlay.className='aldo-wheel-overlay';
 overlay.innerHTML=`<div class="aldo-wheel-modal" role="dialog" aria-modal="true" aria-label="Ruota della fortuna">
 <button class="aldo-wheel-close" aria-label="Chiudi">×</button>
 <div class="aldo-wheel-kicker">ALDO FOOTLOCKER</div><div class="aldo-wheel-title">🎁 Ruota della fortuna</div>
 <p class="aldo-wheel-sub">Gira la ruota e scopri subito il tuo sconto speciale sui nostri prodotti.</p>
 <div class="aldo-wheel-stage"><div class="aldo-wheel-pointer"></div><div class="aldo-wheel" id="aldo-wheel"><div class="aldo-wheel-sectors"></div>
 ${prizes.map((p,i)=>{const a=i*45+22.5;return `<div class="aldo-wheel-item ${[0,3,6,7].includes(i)?'dark':''}" style="transform:rotate(${a}deg) translateY(-${Math.min(128, Math.max(108, 118))}px);--counter:-${a}deg"><div class="aldo-wheel-item-inner"><b>${esc(p.discount)}</b><span>${esc(p.label)}</span><img src="${esc(p.image)}" alt="${esc(p.title)}" loading="eager"></div></div>`}).join('')}
 <div class="aldo-wheel-center" id="aldo-wheel-center">GIRA!</div></div></div>
 <div class="aldo-wheel-result" id="aldo-wheel-result"></div>
 <button class="aldo-wheel-spin" id="aldo-wheel-spin">🎡 Gira la ruota</button>
 <div class="aldo-wheel-note">Offerta promozionale · un solo giro per sessione · condizioni applicabili.</div>
 </div>`;
 document.body.appendChild(overlay);
 const modal=overlay.querySelector('.aldo-wheel-modal'), wheel=overlay.querySelector('#aldo-wheel'), spin=overlay.querySelector('#aldo-wheel-spin'), center=overlay.querySelector('#aldo-wheel-center'), result=overlay.querySelector('#aldo-wheel-result');
 let spinning=false, turns=0;
 const close=()=>overlay.remove();
 overlay.querySelector('.aldo-wheel-close').onclick=close;
 overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
 const doSpin=()=>{if(spinning)return;spinning=true;spin.disabled=true;center.style.pointerEvents='none';
   const winner=Math.floor(Math.random()*prizes.length); const target=360-(winner*45+22.5); turns+=5;
   const finalRotation=turns*360+target;
   wheel.style.setProperty('--wheel-rotation', `${finalRotation}deg`);
   wheel.style.transform=`rotate(${finalRotation}deg)`;
   setTimeout(()=>{
     const p=prizes[winner];
     result.innerHTML=`<div>Hai vinto</div><strong>${esc(p.discount)}</strong><img src="${esc(p.image)}" alt="${esc(p.title)}"><div style="font-size:12px;color:#ddd">${esc(p.label)}</div><div style="font-size:11px;color:#aaa;margin-top:3px">${esc(p.title)}</div><a class="aldo-wheel-claim" target="_blank" rel="noopener" href="https://wa.me/393500990297?text=${encodeURIComponent('Ciao ALDO FOOTLOCKER! Ho vinto '+p.discount+' alla Ruota della Fortuna e vorrei usare lo sconto su: '+p.title)}">Richiedi lo sconto su WhatsApp</a>`;
     result.style.display='block';spin.style.display='none';center.textContent='✓';spinning=false;
   },4850);
 };
 spin.onclick=doSpin;center.onclick=doSpin;
 setTimeout(()=>spin.focus(),150);
}
function bootWheel(){
  // La ruota appare dopo la registrazione iniziale (18+).
  // Se l'utente non è ancora registrato, attendiamo senza bloccare la pagina.
  const registered=()=>{try{return !!localStorage.getItem('aldo_footlocker_user_v2')}catch(e){return false}};
  const tryShow=()=>{if(registered()){show();return true}return false};
  if(tryShow())return;
  let tries=0;
  const timer=setInterval(()=>{if(tryShow()||++tries>120)clearInterval(timer)},500);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(bootWheel,350));else setTimeout(bootWheel,350);
})();
