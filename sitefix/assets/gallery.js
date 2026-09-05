(function(){"use strict";
var modal=null;
function make(){
  var o=document.createElement("div");
  o.id="ms-gallery-overlay";
  o.style.cssText="display:none;position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.94);flex-direction:column;align-items:center;justify-content:center;touch-action:none;opacity:0;transition:opacity .16s ease;will-change:opacity";
  var c=document.createElement("button");c.type="button";c.textContent="✕";c.setAttribute("aria-label","Chiudi");c.style.cssText="position:absolute;top:14px;right:14px;width:42px;height:42px;border:0;border-radius:50%;background:rgba(255,255,255,.14);color:#fff;font-size:19px;z-index:3";
  var n=document.createElement("div");n.style.cssText="position:absolute;top:20px;left:16px;color:#fff;font-size:13px;z-index:3";
  var w=document.createElement("div");w.style.cssText="position:relative;width:100%;max-width:700px;height:78vh;display:flex;align-items:center;justify-content:center;padding:0 48px;box-sizing:border-box;contain:layout paint";
  var im=document.createElement("img");im.alt="";im.draggable=false;im.decoding="async";im.fetchPriority="high";im.style.cssText="max-width:100%;max-height:100%;object-fit:contain;border-radius:8px;user-select:none;-webkit-user-drag:none;opacity:0;transition:opacity .12s ease;will-change:opacity";
  function b(label,text,side){var x=document.createElement("button");x.type="button";x.textContent=text;x.setAttribute("aria-label",label);x.style.cssText="position:absolute;"+side+":0;top:50%;transform:translateY(-50%);width:42px;height:58px;border:0;border-radius:9px;background:rgba(255,255,255,.12);color:#fff;font-size:30px;z-index:2";return x}
  var p=b("Foto precedente","‹","left"),q=b("Foto successiva","›","right");w.appendChild(im);w.appendChild(p);w.appendChild(q);
  var t=document.createElement("p");t.style.cssText="color:#fff;font-size:14px;max-width:680px;text-align:center;padding:10px 20px 0;line-height:1.4;margin:0";
  var wa=document.createElement("a");wa.target="_blank";wa.rel="noopener noreferrer";wa.textContent="Ordina su WhatsApp";wa.style.cssText="margin-top:14px;background:#d4af37;color:#111;font-weight:600;font-size:13px;padding:10px 18px;border-radius:9999px;text-decoration:none";
  var thumbs=document.createElement("div");
  thumbs.style.cssText="display:flex;gap:7px;width:min(700px,94vw);overflow-x:auto;padding:8px 4px 4px;box-sizing:border-box;scrollbar-width:thin";
  o.appendChild(c);o.appendChild(n);o.appendChild(w);o.appendChild(thumbs);o.appendChild(t);o.appendChild(wa);document.body.appendChild(o);
  var s={photos:[],i:0,title:""};
  function preload(idx){if(idx<0||idx>=s.photos.length)return;var x=new Image();x.decoding="async";x.src=s.photos[idx]}
  function render(){
    if(!s.photos.length)return;
    var src=s.photos[s.i];
    im.style.opacity="0";
    n.textContent=(s.i+1)+" / "+s.photos.length;
    t.textContent=s.title;
    wa.href="https://wa.me/393500990297?text="+encodeURIComponent("Ciao aldo footlocker! Sono interessato a questo articolo: "+s.title);
    var v=s.photos.length>1?"visible":"hidden";p.style.visibility=v;q.style.visibility=v;
    thumbs.innerHTML="";
    s.photos.forEach(function(url,idx){
      var b=document.createElement("button"); b.type="button"; b.setAttribute("aria-label","Foto "+(idx+1));
      b.style.cssText="flex:0 0 58px;width:58px;height:58px;padding:2px;border:2px solid "+(idx===s.i?"#d4af37":"rgba(255,255,255,.2)")+";border-radius:7px;background:rgba(255,255,255,.08);overflow:hidden";
      var ti=document.createElement("img"); ti.src=url; ti.loading="lazy"; ti.decoding="async"; ti.alt=""; ti.style.cssText="width:100%;height:100%;object-fit:cover;border-radius:5px";
      b.appendChild(ti); b.onclick=function(e){e.preventDefault();e.stopPropagation();s.i=idx;render()}; thumbs.appendChild(b);
    });
    var active=thumbs.children[s.i]; if(active)active.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"});
    im.onload=function(){im.style.opacity="1";im.onload=null};
    im.onerror=function(){im.style.opacity=".45";im.onload=null};
    im.src=src;
    preload(s.i+1);preload(s.i-1);
  }
  function open(photos,title){
    s.photos=(Array.isArray(photos)?photos:[]).filter(function(u){return typeof u==="string"&&u&&!/\.mp4(?:\?|$)/i.test(u)});
    if(!s.photos.length)return false;
    s.i=0;s.title=title||"";render();o.style.display="flex";document.body.style.overflow="hidden";
    requestAnimationFrame(function(){o.style.opacity="1"});return true
  }
  function hide(){o.style.opacity="0";setTimeout(function(){if(o.style.opacity==="0"){o.style.display="none";document.body.style.overflow="";im.removeAttribute("src")}},170)}
  p.onclick=function(e){e.preventDefault();e.stopPropagation();if(s.photos.length>1){s.i=(s.i-1+s.photos.length)%s.photos.length;render()}};
  q.onclick=function(e){e.preventDefault();e.stopPropagation();if(s.photos.length>1){s.i=(s.i+1)%s.photos.length;render()}};
  c.onclick=function(e){e.preventDefault();e.stopPropagation();hide()};o.onclick=function(e){if(e.target===o)hide()};
  document.addEventListener("keydown",function(e){if(o.style.display!=="flex")return;if(e.key==="Escape")hide();else if(e.key==="ArrowLeft")p.click();else if(e.key==="ArrowRight")q.click()});
  var tx=null;w.addEventListener("touchstart",function(e){tx=e.touches&&e.touches[0]?e.touches[0].clientX:null},{passive:true});
  w.addEventListener("touchend",function(e){if(tx===null||!e.changedTouches||!e.changedTouches[0])return;var dx=e.changedTouches[0].clientX-tx;tx=null;if(Math.abs(dx)<45||s.photos.length<2)return;if(dx<0)q.click();else p.click()},{passive:true});
  return{open:open}
}
function get(){if(!modal)modal=make();return modal}
window.ALDO_FOOTLOCKERGallery={open:function(photos,title){return get().open(photos,title)}}
function photos(btn){try{var x=btn.getAttribute("data-gallery");var a=x?JSON.parse(x):[];return Array.isArray(a)?a:[]}catch(_){return[]}}
function openProduct(btn){var a=btn.closest("article"),ph=photos(btn);if(!ph.length&&a){var i=a.querySelector('button[aria-label^="Apri "] img');if(i&&i.src)ph=[i.src]}if(!ph.length)return;var name=(btn.getAttribute("aria-label")||"").replace(/^Apri\s+/i,"");var pp=a&&a.querySelector("p.line-clamp-2");if(pp&&pp.textContent.trim())name=pp.textContent.trim();get().open(ph,name)}
document.addEventListener("click",function(e){var x=e.target;if(!x||!x.closest)return;var btn=x.closest('button[aria-label^="Apri "]');if(btn){e.preventDefault();e.stopPropagation();openProduct(btn);return}var tb=x.closest("article button");if(tb&&tb.querySelector("p.line-clamp-2")){var a=tb.closest("article"),gb=a&&a.querySelector('button[aria-label^="Apri "]');if(gb){e.preventDefault();e.stopPropagation();openProduct(gb)}}},true)
})();
