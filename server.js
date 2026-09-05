require("dotenv").config();
const express=require("express");
const Stripe=require("stripe");
const fs=require("fs");
const path=require("path");
const crypto=require("crypto");

const app=express();
const PORT=process.env.PORT||3000;
const STRIPE_SECRET_KEY=process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET=process.env.STRIPE_WEBHOOK_SECRET;
const BASE_URL=(process.env.BASE_URL||"http://127.0.0.1:"+PORT).replace(/\/$/,"");
if(!STRIPE_SECRET_KEY) console.warn("STRIPE_SECRET_KEY non configurata: il checkout Stripe non funzionerà.");
const stripe=STRIPE_SECRET_KEY?new Stripe(STRIPE_SECRET_KEY):null;
const root=path.join(__dirname,"sitefix");
const ordersFile=path.join(__dirname,"orders.json");
function readOrders(){try{return JSON.parse(fs.readFileSync(ordersFile,"utf8"))}catch(e){return {}}}
function writeOrders(x){fs.writeFileSync(ordersFile,JSON.stringify(x,null,2))}
function moneyToCents(v){let s=String(v??"").replace(/[^\d,.-]/g,"").replace(/\./g,"").replace(",",".");let n=parseFloat(s);return Number.isFinite(n)?Math.round(n*100):0}
function orderId(){return "ALD-"+new Date().toISOString().slice(0,10).replace(/-/g,"")+"-"+crypto.randomBytes(3).toString("hex").toUpperCase()}

app.get("/api/health",(req,res)=>res.json({ok:true,stripe:!!stripe}));
app.post("/api/webhook",express.raw({type:"application/json"}),(req,res)=>{
 if(!stripe||!STRIPE_WEBHOOK_SECRET)return res.status(400).send("Webhook not configured");
 let event;try{event=stripe.webhooks.constructEvent(req.body,req.headers["stripe-signature"],STRIPE_WEBHOOK_SECRET)}catch(e){return res.status(400).send("Invalid signature")}
 const orders=readOrders();
 if(event.type==="checkout.session.completed"){
  const s=event.data.object,id=s.metadata?.orderId;
  if(id&&orders[id]){orders[id].status="paid";orders[id].stripePaymentStatus=s.payment_status;orders[id].paidAt=new Date().toISOString();writeOrders(orders)}
 }
 res.json({received:true});
});
app.use(express.json({limit:"100kb"}));

let productPages=null;
function getProducts(){if(!productPages)productPages=JSON.parse(fs.readFileSync(path.join(root,"api/product-pages.json"),"utf8"));return productPages}
app.post("/api/create-checkout-session",async(req,res)=>{
 try{
  if(!stripe)return res.status(503).json({error:"Stripe non è configurato sul server."});
  const body=req.body||{},items=Array.isArray(body.items)?body.items:[],customer=body.customer||{};
  if(!items.length)return res.status(400).json({error:"Carrello vuoto."});
  if(!customer.name||!customer.email||!customer.address||!customer.city||!customer.postal)return res.status(400).json({error:"Dati di consegna incompleti."});
  const products=getProducts(),line_items=[];let total=0;
  for(const item of items){
   const p=products[String(item.key)];const qty=Math.max(1,Math.min(20,parseInt(item.qty,10)||1));
   if(!p)return res.status(400).json({error:"Un prodotto nel carrello non è più disponibile."});
   const unit=moneyToCents(p.price);if(unit<50)return res.status(400).json({error:"Prezzo prodotto non valido."});
   total+=unit*qty;
   line_items.push({price_data:{currency:"eur",product_data:{name:String(p.title).slice(0,500),images:(p.photos||[]).filter(x=>/^https?:\/\//.test(x)).slice(0,1)},unit_amount:unit},quantity:qty});
  }
  const id=orderId(),orders=readOrders();
  orders[id]={orderId:id,status:"pending",total:new Intl.NumberFormat("it-IT",{style:"currency",currency:"EUR"}).format(total/100),totalCents:total,customer:{name:customer.name,email:customer.email,address:customer.address,city:customer.city,postal:customer.postal,country:customer.country||"IT"},createdAt:new Date().toISOString()};
  writeOrders(orders);
  const session=await stripe.checkout.sessions.create({
   mode:"payment",line_items,customer_email:customer.email,
   billing_address_collection:"required",
   shipping_address_collection:{allowed_countries:["IT","FR","DE","ES","AT","BE","NL","PT","IE","CH"]},
   metadata:{orderId:id},payment_intent_data:{metadata:{orderId:id}},
   success_url:BASE_URL+"/success.html?session_id={CHECKOUT_SESSION_ID}",
   cancel_url:BASE_URL+"/checkout.html"
  });
  orders[id].stripeSessionId=session.id;writeOrders(orders);
  res.json({url:session.url,orderId:id});
 }catch(e){console.error(e);res.status(500).json({error:"Impossibile creare il pagamento."})}
});
app.get("/api/session/:sessionId",async(req,res)=>{
 try{if(!stripe)return res.status(503).json({error:"Stripe non configurato"});const s=await stripe.checkout.sessions.retrieve(req.params.sessionId);const id=s.metadata?.orderId;const orders=readOrders();if(!id||!orders[id])return res.status(404).json({error:"Ordine non trovato"});if(s.payment_status==="paid"&&orders[id].status==="pending"){orders[id].status="paid";orders[id].stripePaymentStatus=s.payment_status;orders[id].paidAt=new Date().toISOString();writeOrders(orders)}res.json({orderId:id,status:orders[id].status})}
 catch(e){res.status(400).json({error:"Sessione non valida"})}
});
app.get("/api/orders/:id",(req,res)=>{const o=readOrders()[req.params.id];if(!o)return res.status(404).json({error:"Ordine non trovato"});res.json({orderId:o.orderId,status:o.status,total:o.total,createdAt:o.createdAt})});
app.use(express.static(root,{extensions:["html"]}));
app.use((req,res)=>res.status(404).send("Pagina non trovata"));
app.listen(PORT,"127.0.0.1",()=>console.log("aldo footlocker server: "+BASE_URL));
