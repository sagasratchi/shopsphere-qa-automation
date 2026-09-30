// ShopSphere: local-only QA training application, not a production store.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const file = path.join(__dirname, 'practice-data.json');
const db = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : { users: [], sessions: {}, orders: [] };
const products = [
  {id:'shirt',name:'Cotton shirt',cents:2500},
  {id:'bag',name:'Everyday bag',cents:4999},
  {id:'headphones',name:'Studio headphones',cents:10000},
  {id:'notebook',name:'Notebook',cents:100},
  {id:'cent',name:'QA boundary adjustment (test item)',cents:1}
];
function save(){ fs.writeFileSync(file,JSON.stringify(db,null,2)); }
function fail(message,status=400){throw Object.assign(new Error(message),{status});}
function summary(s){
  const items=s.items.map(i=>({...products.find(p=>p.id===i.id),quantity:i.quantity}));
  const subtotal=items.reduce((n,i)=>n+i.cents*i.quantity,0);
  const user=db.users.find(u=>u.id===s.userId);
  if(subtotal<5000 || !user || user.used.includes(s.coupon)) s.coupon=null;
  const discount=s.coupon ? Math.min(Math.floor((subtotal+5)/10),2000) : 0;
  const shipping=items.length && subtotal-discount<10000 ? 500 : 0;
  return {items,coupon:s.coupon,subtotal,discount,shipping,total:subtotal-discount+shipping,currency:'EUR',user:user?{id:user.id,email:user.email,usedCoupons:user.used}:null};
}
const server=http.createServer(async(req,res)=>{
  const send=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
  try {
    if(!/^localhost(:\d+)?$|^127\.0\.0\.1(:\d+)?$/.test(req.headers.host||'')) return send(403,{message:'Local access only'});
    const route=new URL(req.url,'http://localhost').pathname;
    if(req.method==='GET'&&route==='/'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});return res.end(fs.readFileSync(path.join(__dirname,'index.html')));}
    if(!route.startsWith('/api/'))return send(404,{message:'Not found'});
    if(req.headers.origin && !['http://localhost:'+server.address().port,'http://127.0.0.1:'+server.address().port].includes(req.headers.origin))return send(403,{message:'Origin not allowed'});
    if(!['GET','POST'].includes(req.method))return send(405,{message:'Method not allowed'});
    let token=(req.headers.authorization||'').replace(/^Bearer /,'') || /(?:^|;\s*)sid=([a-f0-9]+)/.exec(req.headers.cookie||'')?.[1];
    if(!db.sessions[token]){token=crypto.randomBytes(24).toString('hex');db.sessions[token]={items:[],coupon:null,userId:null};res.setHeader('Set-Cookie',`sid=${token}; HttpOnly; SameSite=Strict; Path=/`);}
    const s=db.sessions[token];
    let body={};
    if(req.method==='POST'){
      if(!(req.headers['content-type']||'').startsWith('application/json'))fail('Use application/json',415);
      let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>16000)fail('Request too large',413);}
      try{body=JSON.parse(raw||'{}');}catch{fail('Invalid JSON');}
      if(!body||Array.isArray(body)||typeof body!=='object')fail('JSON object required');
    }
    let message='OK', extra={};
    const key=req.method+' '+route;
    if(key==='GET /api/products')return send(200,{products});
    if(key==='POST /api/register'||key==='POST /api/login'){
      const email=String(body.email||'').trim().toLowerCase(),password=String(body.password||'');
      if(!/^\S+@\S+\.\S+$/.test(email)||password.length<8)fail('Use a valid test email and a password of at least 8 characters');
      let u=db.users.find(u=>u.email===email);
      if(route.endsWith('register')){
        if(u)fail('Email already registered',409);
        const salt=crypto.randomBytes(16).toString('hex');
        u={id:crypto.randomUUID(),email,salt,hash:crypto.scryptSync(password,salt,64).toString('hex'),used:[]};db.users.push(u);
      }else if(!u||!crypto.timingSafeEqual(Buffer.from(u.hash,'hex'),crypto.scryptSync(password,u.salt,64)))fail('Invalid credentials',401);
      s.userId=u.id;s.coupon=null;extra.token=token;message='Logged in successfully';
    }else if(key==='POST /api/logout'){s.userId=null;s.coupon=null;message='Logged out';
    }else if(key==='POST /api/cart'){
      if(!products.some(p=>p.id===body.id)||!Number.isInteger(body.quantity)||body.quantity<0||body.quantity>10000)fail('Valid product id and integer quantity 0–10000 required');
      const previous=s.coupon;s.items=s.items.filter(i=>i.id!==body.id);if(body.quantity)s.items.push({id:body.id,quantity:body.quantity});summary(s);
      message=previous&&!s.coupon?'Coupon removed: minimum subtotal €50.00 required':'Cart updated';
    }else if(key==='POST /api/coupon'){
      const code=String(body.code||'').trim();
      if(!code)fail('Coupon code is empty');
      if(!s.userId)fail('Login to continue',401);
      if(code==='EXPIRED10')fail('Coupon has expired');
      if(code==='INACTIVE10')fail('Coupon is inactive');
      if(code!=='SAVE10')fail('Coupon code was not found');
      if(db.users.find(u=>u.id===s.userId).used.includes(code))fail('Coupon has already been used');
      if(summary(s).subtotal<5000)fail('Minimum subtotal of €50.00 is required');
      s.coupon=code;message='Coupon applied successfully';
    }else if(key==='POST /api/remove-coupon'){s.coupon=null;message='Coupon removed';
    }else if(key==='POST /api/payment'){
      if(!s.userId)fail('Login to continue',401);
      if(!s.items.length)fail('Cart is empty');
      if(!['success','failure'].includes(body.outcome))fail('Choose success or failure');
      if(body.outcome==='failure')fail('Simulated payment failed; coupon not consumed',402);
      const totals=summary(s);
      const order={id:crypto.randomUUID(),userId:s.userId,createdAt:new Date().toISOString(),...totals};
      db.orders.push(order);if(s.coupon)db.users.find(u=>u.id===s.userId).used.push(s.coupon);
      s.items=[];s.coupon=null;extra.order=order;message='Simulated payment successful. Order confirmed.';
    }else if(key==='GET /api/orders'){
      if(!s.userId)fail('Login to continue',401);extra.orders=db.orders.filter(o=>o.userId===s.userId);
    }else if(key!=='GET /api/cart')return send(404,{message:'Not found'});
    const cart=summary(s);save();send(200,{message,cart,...extra});
  }catch(e){send(e.status||500,{message:e.status?e.message:'Server error'});}
});
if(require.main===module)server.listen(3000,'127.0.0.1',()=>console.log('ShopSphere QA: http://127.0.0.1:3000 — Ctrl+C to stop'));
module.exports=server;
