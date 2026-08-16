require("dotenv").config();
const express=require("express"),crypto=require("crypto"),fs=require ("fs"),path=require("path"),Razorpay=require("razorpay");
const app=express();app.use(express.json({limit:"1mb"}));const PORT=process.env.PORT||3000;const db=path.join(__dirname,"orders.json");
const read=()=>{try{return JSON.parse(fs.readFileSync(db,"utf8"))}catch{return[]}};const save=x=>fs.writeFileSync(db,JSON.stringify(x,null,2));
const rp=process.env.RAZORPAY_KEY_ID&&process.env.RAZORPAY_KEY_SECRET?new Razorpay({key_id:process.env.RAZORPAY_KEY_ID,key_secret:process.env.RAZORPAY_KEY_SECRET}):null;

const PAGE=String.raw`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#173b1b"><title>The Spice Saga — Order Online</title><style>@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@600;700&display=swap');
:root{--green:#173b1b;--deep:#0e170f;--gold:#c99527;--cream:#f8f0dc;--dark:#10110e;--muted:#77736b;--line:#ded2b6}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;color:#27251f;background:#fbf7ec;font-family:"DM Sans",sans-serif}.nav{height:76px;display:flex;align-items:center;justify-content:space-between;padding:9px 5%;background:var(--cream);border-bottom:1px solid #d9c8a2;position:sticky;top:0;z-index:30}.brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:#352414}.mark{width:45px;height:45px;border-radius:50%;background:var(--green);color:#e2b94d;display:grid;place-items:center}.brand strong{font:700 20px "Playfair Display",serif;display:block}.brand small{font-size:9px;color:#806d52;display:block}.nav nav{display:flex;gap:25px}.nav nav a{color:#403727;text-decoration:none;font-weight:700}.cart{border:1px solid #b79b63;background:var(--green);color:#fff;padding:10px 15px;border-radius:22px;cursor:pointer}.hero{min-height:520px;background:linear-gradient(90deg,rgba(14,23,15,.96),rgba(23,59,27,.83)),radial-gradient(circle at 80% 40%,#c99527,transparent 20%);color:#fff;display:flex;align-items:center}.hero-copy{width:90%;max-width:1100px;margin:auto}.kicker{color:#e0bd63;font-weight:700;letter-spacing:2px;font-size:11px}.hero h1{font:700 clamp(52px,7vw,88px)/.95 "Playfair Display",serif;margin:18px 0}.hero h1 span{color:#e1b54a}.hero p{max-width:600px;color:#ddd6c7;font-size:18px;line-height:1.6}.gold{background:var(--gold);color:#15130d;border:0;border-radius:7px;padding:14px 23px;font-weight:800;cursor:pointer}.promise{display:grid;grid-template-columns:repeat(3,1fr);max-width:1100px;margin:auto;border-bottom:1px solid var(--line);background:#fffaf0}.promise div{text-align:center;padding:20px;border-right:1px solid var(--line)}.promise div:last-child{border:0}.promise b{display:block;margin-top:4px}.promise small{display:block;color:var(--muted);margin-top:3px}main,.combo-section{width:90%;max-width:1100px;margin:auto;padding:60px 0}.title{text-align:center}.title>span{font-size:11px;letter-spacing:2px;font-weight:800;color:#9a6f16}.title h2{font:700 40px "Playfair Display",serif;margin:7px 0}.title p{color:var(--muted)}.tabs{display:flex;gap:8px;overflow:auto;padding:20px 0}.tab{white-space:nowrap;border:1px solid #c9bb9c;background:#fffaf0;color:#4a4439;border-radius:20px;padding:9px 14px;cursor:pointer}.tab.active{background:var(--green);color:#fff;border-color:var(--green)}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.card{background:#fffdf6;border:1px solid var(--line);border-radius:12px;padding:18px;display:flex;flex-direction:column;min-height:235px}.icon{height:55px;font-size:38px}.card h3{font:700 20px "Playfair Display",serif;margin:0 0 5px}.desc{font-size:12px;color:#777;line-height:1.45;min-height:35px}.price{font-weight:800;font-size:18px;color:#1b391d;margin:12px 0}.add{margin-top:auto;border:1px solid var(--green);background:transparent;color:var(--green);padding:10px;border-radius:7px;font-weight:800;cursor:pointer}.add:hover{background:var(--green);color:white}.combo-section{border-top:1px solid var(--line)}.combo-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}.combo{background:var(--green);color:white;border-radius:12px;padding:20px}.combo h3{font:700 23px "Playfair Display",serif;margin:0 0 10px;color:#e3bb55}.combo p{color:#e4dfd3;line-height:1.55}.combo .cprice{font-size:22px;font-weight:800;color:#fff;margin:12px 0}.combo button{width:100%;background:#e1b14a;border:0;border-radius:7px;padding:11px;font-weight:800;cursor:pointer}footer{background:#112513;color:#ddd;padding:35px 5%;display:flex;justify-content:space-between}.muted{color:#9a9a92}.shade{display:none;position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:60}.drawer{position:absolute;right:0;top:0;height:100%;width:min(450px,100%);background:#fffaf0;padding:25px;overflow:auto}.drawer-head{display:flex;justify-content:space-between}.drawer-head button,.x{border:0;background:none;font-size:30px;cursor:pointer}.cartrow{display:flex;justify-content:space-between;gap:10px;padding:14px 0;border-bottom:1px solid var(--line)}.qty button{border:1px solid #bbb;background:#fff;padding:3px 8px;border-radius:5px}.total{display:flex;justify-content:space-between;font-size:22px;padding:20px 0}.full{width:100%}.modal{place-items:center;padding:15px}.checkout{position:relative;background:#fffaf0;width:min(480px,100%);border:1px solid var(--line);border-radius:14px;padding:28px}.checkout h2{font:700 34px "Playfair Display",serif;margin:0}.checkout label{display:block;font-size:13px;color:#625c50;margin:14px 0}.checkout input,.checkout textarea{width:100%;display:block;margin-top:6px;padding:12px;border:1px solid #cbbd9f;border-radius:7px;background:white;font:inherit}.pay{display:flex;justify-content:space-between;border-top:1px solid var(--line);padding:17px 0;margin-top:7px}.checkout small{display:block;text-align:center;color:#888;margin-top:10px}.x{position:absolute;right:12px;top:7px}@media(max-width:760px){.grid{grid-template-columns:repeat(2,1fr)}.promise{grid-template-columns:1fr}.promise div{border-right:0;border-bottom:1px solid var(--line)}.combo-grid{grid-template-columns:1fr}.nav nav{display:none}}@media(max-width:520px){.grid{grid-template-columns:1fr}.hero h1{font-size:55px}.title h2{font-size:34px}}
</style></head><body>
<header class="nav">
  <a class="brand" href="#"><div class="mark">✦</div><div><strong>The Spice Saga</strong><small>Where Every Bite Tells a Story</small></div></a>
  <nav><a href="#menu">Menu</a><a href="#combos">Combos</a></nav>
  <button class="cart" onclick="openCart()">🛒 <span id="count">0</span></button>
</header>

<section class="hero">
  <div class="hero-copy">
    <span class="kicker">THE SPICE SAGA • IIT INDORE</span>
    <h1>Good food.<br><span>Great stories.</span></h1>
    <p>Your favourite Indian, tandoori, biryani and comfort-food classics — freshly prepared and available for direct ordering.</p>
    <button class="gold" onclick="document.querySelector('#menu').scrollIntoView({behavior:'smooth'})">ORDER NOW</button>
  </div>
</section>

<section class="promise">
 <div>🔥<b>Freshly prepared</b><small>Made to order</small></div>
 <div>⚡<b>Direct ordering</b><small>Simple & fast</small></div>
 <div>💳<b>Secure payment</b><small>Razorpay checkout</small></div>
</section>

<main id="menu">
 <div class="title"><span>OUR MENU</span><h2>Choose your craving</h2><p>All prices shown are as per the current menu supplied by The Spice Saga.</p></div>
 <div id="tabs" class="tabs"></div>
 <div id="items" class="grid"></div>
</main>

<section id="combos" class="combo-section">
 <div class="title"><span>VALUE PICKS</span><h2>Combo & Meal Menu</h2></div>
 <div id="combosGrid" class="combo-grid"></div>
</section>

<footer><div><strong>The Spice Saga</strong><p>Near IIT Indore</p></div><div><p>Direct online ordering</p><p class="muted">© <span id="year"></span> The Spice Saga</p></div></footer>

<div id="drawer" class="shade" onclick="shadeClose(event)">
 <aside class="drawer" onclick="event.stopPropagation()">
  <div class="drawer-head"><h2>Your Order</h2><button onclick="closeCart()">×</button></div>
  <div id="cart"></div><div class="total"><span>Total</span><b id="total">₹0</b></div>
  <button class="gold full" onclick="checkout()">PROCEED TO CHECKOUT</button>
 </aside>
</div>

<div id="modal" class="shade modal"><div class="checkout">
 <button class="x" onclick="closeCheckout()">×</button>
 <h2>Checkout</h2><p class="muted">No registration required.</p>
 <label>Name<input id="name" placeholder="Your name"></label>
 <label>Mobile<input id="phone" maxlength="10" inputmode="numeric" placeholder="10-digit mobile number"></label>
 <label>Delivery location<input id="location" placeholder="Hostel / delivery point"></label>
 <label>Special instructions<textarea id="notes" placeholder="Optional"></textarea></label>
 <div class="pay"><span>Amount to pay</span><b id="paytotal">₹0</b></div>
 <button class="gold full" onclick="pay()">PAY SECURELY</button>
 <small>Payment will open in Razorpay.</small>
 </div></div>

<script src="https://checkout.razorpay.com/v1/checkout.js"></script><script>const menu=[
["Plain Dal","Veg Main Course",149,"🥣"],["Dal Tadka","Veg Main Course",169,"🌶️"],["Rajma Masala","Veg Main Course",179,"🫘"],["Chana Masala","Veg Main Course",179,"🥘"],["Sev Tamatar","Veg Main Course",159,"🍅"],["Aaloo Zeera","Veg Main Course",149,"🥔"],["Veg Keema","Veg Main Course",179,"🥘"],["Mushroom Masala","Veg Main Course",269,"🍄"],["Cream Pepper Mushroom","Veg Main Course",279,"🍄"],["Mix Veg","Veg Main Course",179,"🥗"],["Kaju Curry","Veg Main Course",279,"🥜"],
["Paneer Bhurji","Veg Main Course",279,"🧀"],["Kadhai Paneer","Veg Main Course",279,"🧀"],["Butter Paneer Masala","Veg Main Course",289,"🧈"],["Paneer Angara","Veg Main Course",299,"🔥"],["Palak Paneer","Veg Main Course",279,"🌿"],["Paneer Kolhapuri","Veg Main Course",299,"🌶️"],["Paneer Chettinad","Veg Main Course",299,"🌶️"],["Paneer Tikka Masala","Veg Main Course",299,"🧀"],["Cream Pepper Paneer","Veg Main Course",309,"🧀"],["Paneer Lababdar","Veg Main Course",309,"🧀"],["Kaju Paneer","Veg Main Course",309,"🥜"],
["Butter Chicken (4 Pcs)","Non Veg Main Course",259,"🍗"],["Chicken Tikka Masala (4 Pcs)","Non Veg Main Course",259,"🍗"],["Kadhai Chicken (4 Pcs)","Non Veg Main Course",259,"🍗"],["Chicken Angara (4 Pcs)","Non Veg Main Course",259,"🔥"],["Cream Pepper Chicken (4 Pcs)","Non Veg Main Course",269,"🍗"],["Champaran Chicken (6 Pcs)","Non Veg Main Course",379,"🍗"],["Kolhapuri Chicken (4 Pcs)","Non Veg Main Course",279,"🌶️"],["Kosha Chicken (4 Pcs)","Non Veg Main Course",279,"🍗"],["Chicken Chettinad (4 Pcs)","Non Veg Main Course",279,"🌶️"],["Guntur Fiery Chicken (4 Pcs)","Non Veg Main Course",279,"🌶️"],["Konkani Chicken Curry (4 Pcs)","Non Veg Main Course",279,"🥥"],["Egg Curry (4 Pcs)","Non Veg Main Course",159,"🥚"],["Fish Masala (4 Pcs)","Non Veg Main Course",269,"🐟"],["Prawn Curry","Non Veg Main Course",329,"🍤"],["Mutton Rogan Josh (4 Pcs)","Non Veg Main Course",369,"🍖"],
["Tandoori Chicken Half (4 Pcs)","Non Veg Starters",249,"🔥"],["Tandoori Chicken Full (8 Pcs)","Non Veg Starters",469,"🔥"],["Chicken Tikka (8 Pcs)","Non Veg Starters",249,"🔥"],["Chicken Malai Tikka (8 Pcs)","Non Veg Starters",269,"🍗"],["Chicken Hariyali Tikka (8 Pcs)","Non Veg Starters",269,"🌿"],["Chicken Angara Tikka (8 Pcs)","Non Veg Starters",269,"🔥"],["Chicken Seekh Kebab (8 Pcs)","Non Veg Starters",209,"🍢"],["Chicken Tangdi Kebab (4 Pcs)","Non Veg Starters",219,"🍗"],["Chicken Kalmi Kebab (2 Pcs)","Non Veg Starters",239,"🍗"],["Fish Tikka (8 Pcs)","Non Veg Starters",269,"🐟"],["Mutton Keema Naan","Non Veg Starters",199,"🥙"],
["Chilli Chicken","Chinese",229,"🌶️"],["Schezwan Fried Chicken","Chinese",229,"🌶️"],["Chilli Fish","Chinese",249,"🐟"],["Chilli Garlic Prawns","Chinese",299,"🍤"],["Smokey Fried Chicken","Continental",229,"🍗"],["Chicken Cutlet (Chop)","Continental",179,"🍗"],["Chicken Salami","Continental",189,"🥩"],
["Chicken Pakora","Indian Snacks",179,"🍗"],["Chicken 65","Indian Snacks",199,"🔥"],["Chicken Angara (Dry)","Indian Snacks",219,"🔥"],["Prawn 65","Indian Snacks",299,"🍤"],["Fish Pakora","Indian Snacks",179,"🐟"],["Fish Fry (2 Pcs)","Indian Snacks",119,"🐟"],["Fish 65","Indian Snacks",209,"🔥"],
["Egg Roll","Rolls",89,"🌯"],["Chicken Roll","Rolls",149,"🌯"],["Prawn Mushroom Roll","Rolls",189,"🌯"],
["Paneer Tikka","Veg Starters",219,"🧀"],["Malai Paneer Tikka","Veg Starters",239,"🧀"],["Hariyali Paneer Tikka","Veg Starters",239,"🌿"],["Soya Chaap Tikka (8 Pcs)","Veg Starters",209,"🥙"],["Malai Chaap Tikka (8 Pcs)","Veg Starters",229,"🥙"],["Hariyali Chaap Tikka (8 Pcs)","Veg Starters",229,"🌿"],["Mushroom Tikka","Veg Starters",239,"🍄"],["Mushroom Malai Tikka","Veg Starters",259,"🍄"],["Stuffed Mushroom Paneer Naan","Veg Starters",159,"🥙"],["Stuffed Aloo Pyaz Naan","Veg Starters",109,"🥙"],["Paneer Pakora (8 Pcs)","Veg Starters",179,"🧀"],["Hara Bhara Kebab (8 Pcs)","Veg Starters",179,"🥬"],["Veg Roll","Rolls",99,"🌯"],["Cheese Paneer Roll","Rolls",129,"🌯"],["Mushroom Olive Roll","Rolls",139,"🌯"],["French Fries","Fries",99,"🍟"],["Peri Peri Fries","Fries",119,"🍟"],["Chilli Paneer (Dry)","Chinese",229,"🌶️"],["Chilli Mushroom (Dry)","Chinese",229,"🍄"],
["Hyderabadi Dum Biryani (4 Pcs)","Biryani",189,"🍚"],["Kolkata Chicken Biryani (4 Pcs)","Biryani",199,"🍚"],
["Tawa Roti","Bread Basket",12,"🫓"],["Butter Tawa Roti","Bread Basket",16,"🫓"],["Tandoori Roti","Bread Basket",16,"🫓"],["Butter Tandoori Roti","Bread Basket",20,"🫓"],["Butter Naan","Bread Basket",40,"🫓"],["Garlic Butter Naan","Bread Basket",50,"🫓"],["Plain Paratha","Bread Basket",25,"🫓"],["Laccha Paratha","Bread Basket",45,"🫓"],
["Steam Rice","Rice Ritual",69,"🍚"],["Zeera Rice","Rice Ritual",89,"🍚"],["Curd Rice","Rice Ritual",109,"🍚"],["Tomato Rice","Rice Ritual",119,"🍚"],["Butter Khichdi","Rice Ritual",129,"🍚"],["Veg Pulao","Rice Ritual",149,"🍚"],["Egg Fried Rice","Rice Ritual",109,"🍚"],["Schezwan Egg Fried Rice","Rice Ritual",119,"🍚"],["Chicken Fried Rice","Rice Ritual",149,"🍚"],["Schezwan Chicken Fried Rice","Rice Ritual",159,"🍚"],
["Gulab Jamun (2 Pcs)","Desserts",50,"🍮"],["Rasgulla (2 Pcs)","Desserts",50,"🍡"],["Plain Curd","Extras",30,"🥣"],["Raita","Extras",40,"🥣"],["Salad","Extras",30,"🥗"],["Cream Salad","Extras",50,"🥗"],["Tea","Beverages",10,"☕"],["Coffee","Beverages",25,"☕"],["Cold Drink","Beverages","MRP","🥤"],["Mineral Water","Beverages","MRP","💧"],["Chhaj (Buttermilk)","Beverages",25,"🥛"],["Lemon Soda","Beverages",25,"🥤"]
].map((x,i)=>({id:i+1,n:x[0],c:x[1],p:x[2],i:x[3]}));

const combos=[
["Butter Paneer Masala Combo","Butter Paneer Masala + Zeera Rice OR 3 Butter Roti + 200 ml Coke OR Raita",159],
["Butter / Kadhai Chicken Combo","Butter or Kadhai Chicken (2 Pcs) + Zeera Rice OR 3 Butter Roti + 200 ml Coke OR Raita",189],
["Egg Curry Combo","Egg Curry (2 Pcs) + Zeera Rice OR 3 Butter Roti + 200 ml Coke OR Raita",149],
["Fish Curry Combo","Fish Curry (2 Pcs) + Zeera Rice OR 3 Butter Roti + 200 ml Coke OR Raita",179],
["Mutton Curry Combo","Mutton Curry (2 Pcs) + Zeera Rice OR 3 Butter Roti + 200 ml Coke OR Raita",259],
["Veg Meal 1 • Lunch Only","Paneer Curry + Dal + Seasonal Veg + Bowl of Rice + 2 Butter Tawa Roti + Raita + Salad",199],
["Veg Meal 2 • Lunch Only","Paneer Curry + Seasonal Veg + 2 Butter Naan + Raita + Salad",199],
["Non Veg Meal 1 • Lunch Only","Egg Curry (2 Pcs) + Paneer Curry + 2 Butter Naan + Raita + Salad",209],
["Non Veg Meal 2 • Lunch Only","Egg Curry (2 Pcs) + Fish Curry (1 Pc) + Bowl of Rice + 2 Butter Roti + Raita + Salad",229],
["Non Veg Meal 3 • Lunch Only","Chicken Curry (2 Pcs) + Fish Curry (1 Pc) + Bowl of Rice + 2 Butter Roti + Raita + Salad",279]
].map((x,i)=>({n:x[0],c:x[1],p:x[2],i:x[3],id:i+1}));

let cart=[];
const cats=["All",...new Set(menu.map(x=>x.c))];
document.querySelector("#year").textContent=new Date().getFullYear();
document.querySelector("#tabs").innerHTML=cats.map((c,i)=>'<button class="tab '+(i===0?"active":"")+'" onclick="filterCat(\\''+c+'\\',this)">'+c+'</button>').join("");
render(menu);
document.querySelector("#combosGrid").innerHTML=combos.map((x,i)=>'<div class="combo"><h3>'+x[0]+'</h3><p>'+x[1]+'</p><div class="cprice">₹'+x[2]+'</div><button onclick="addCombo('+i+')">ADD COMBO</button></div>').join("");

function render(list){document.querySelector("#items").innerHTML=list.map(x=>'<article class="card"><div class="icon">'+x.i+'</div><h3>'+x.n+'</h3><div class="desc">'+x.c+'</div><div class="price">'+(typeof x.p==="number"?"₹"+x.p:x.p)+'</div><button class="add" '+(typeof x.p!=="number"?"disabled":"")+' onclick="add('+x.id+')">'+(typeof x.p==="number"?"ADD TO ORDER":"CALL TO ORDER")+'</button></article>').join("")}
function filterCat(c,b){document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");render(c==="All"?menu:menu.filter(x=>x.c===c))}
function add(id){let x=menu.find(a=>a.id===id);let z=cart.find(a=>a.key==="m"+id);z?z.q++:cart.push({key:"m"+id,name:x.n,price:x.p,q:1});update();openCart()}
function addCombo(i){let x=combos[i],z=cart.find(a=>a.key==="c"+i);z?z.q++:cart.push({key:"c"+i,name:x[0],price:x[2],q:1});update();openCart()}
function update(){document.querySelector("#count").textContent=cart.reduce((s,x)=>s+x.q,0);document.querySelector("#cart").innerHTML=cart.length?cart.map(x=>'<div class="cartrow"><div><b>'+x.name+'</b><br><span class="muted">₹'+x.price+' × '+x.q+'</span></div><div class="qty"><button onclick="change(\\''+x.key+'\\',-1)">−</button> '+x.q+' <button onclick="change(\\''+x.key+'\\',1)">+</button></div></div>').join(""):'<p class="muted">Your cart is empty.</p>';document.querySelector("#total").textContent="₹"+sum()}
function change(k,n){let x=cart.find(a=>a.key===k);x.q+=n;if(x.q<=0)cart=cart.filter(a=>a.key!==k);update()}
function sum(){return cart.reduce((s,x)=>s+(typeof x.price==="number"?x.price:0)*x.q,0)}
function openCart(){document.querySelector("#drawer").style.display="block";update()}function closeCart(){document.querySelector("#drawer").style.display="none"}function shadeClose(e){if(e.target.id==="drawer")closeCart()}
function checkout(){if(!cart.length)return alert("Please add items to your order.");closeCart();document.querySelector("#paytotal").textContent="₹"+sum();document.querySelector("#modal").style.display="grid"}function closeCheckout(){document.querySelector("#modal").style.display="none"}
async function pay(){
 const name=document.querySelector("#name").value.trim(),phone=document.querySelector("#phone").value.trim(),location=document.querySelector("#location").value.trim(),notes=document.querySelector("#notes").value.trim();
 if(!name||!/^[0-9]{10}$/.test(phone)||!location)return alert("Please enter your name, 10-digit mobile number and delivery location.");
 try{let r=await fetch("/api/create-order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({amount:sum(),name,phone,location,notes,items:cart})});let o=await r.json();if(!r.ok)throw new Error(o.error);
 let rz=new Razorpay({key:o.key_id,amount:o.amount,currency:"INR",name:"The Spice Saga",description:"Food Order",order_id:o.id,prefill:{name,contact:"+91"+phone},theme:{color:"#c99527"},handler:async function(resp){let v=await fetch("/api/verify-payment",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...resp,customer:{name,phone,location,notes},items:cart})}).then(x=>x.json());if(v.success){cart=[];update();closeCheckout();alert("Order confirmed! Order ID: "+v.order_number)}else alert("Payment verification failed. Please contact The Spice Saga.")}});rz.on("payment.failed",()=>alert("Payment failed or cancelled. Please try again."));rz.open()
 }catch(e){alert(e.message||"Unable to start payment.")}
}</script></body></html>`;

app.get("/",(req,res)=>res.type("html").send(PAGE));

app.post("/api/create-order",async(req,res)=>{try{if(!rp)return res.status(503).json({error:"Razorpay is not configured"});const {amount}=req.body;if(!amount)return res.status(400).json({error:"Amount is required"});const order=await rp.orders.create({amount:Math.round(Number(amount)*100),currency:"INR",receipt:"order_"+Date.now()});res.json(order)}catch(e){console.error(e);res.status(500).json({error:"Unable to create order"})}});
app.listen(process.env.PORT||10000,"0.0.0.0",()=>console.log("Server running"));
