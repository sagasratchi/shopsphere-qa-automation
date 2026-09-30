const assert=require('node:assert/strict');
const server=require('./server');
server.listen(0,'127.0.0.1',async()=>{
 const base='http://127.0.0.1:'+server.address().port;let token='';let checks=0;
 async function request(route,body,status=200){const r=await fetch(base+'/api/'+route,{method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:body===undefined?undefined:JSON.stringify(body)});const j=await r.json();assert.equal(r.status,status,JSON.stringify(j));checks++;return j;}
 try{
 token=(await request('register',{email:'check-'+Date.now()+'@example.test',password:'Testing123!'})).token;
 await request('cart',{id:'bag',quantity:1});await request('coupon',{code:'SAVE10'},400);
 await request('cart',{id:'bag',quantity:0});await request('cart',{id:'shirt',quantity:2});
 let j=await request('coupon',{code:'SAVE10'});assert.deepEqual([j.cart.subtotal,j.cart.discount,j.cart.shipping,j.cart.total],[5000,500,500,5000]);
 j=await request('coupon',{code:'SAVE10'});assert.equal(j.cart.discount,500);
 await request('payment',{outcome:'failure'},402);assert.equal((await request('cart')).cart.coupon,'SAVE10');
 await request('cart',{id:'shirt',quantity:1});assert.equal((await request('cart')).cart.coupon,null);
 await request('cart',{id:'shirt',quantity:0});await request('cart',{id:'headphones',quantity:2});await request('cart',{id:'cent',quantity:1});
 j=await request('coupon',{code:'SAVE10'});assert.deepEqual([j.cart.discount,j.cart.shipping,j.cart.total],[2000,0,18001]);
 await request('cart',{id:'headphones',quantity:1});await request('cart',{id:'notebook',quantity:11});
 for(const [qty,shipping,total] of [[10,500,10499],[11,0,10000],[12,0,10001]]){await request('cart',{id:'cent',quantity:qty});j=await request('cart');assert.equal(j.cart.shipping,shipping);assert.equal(j.cart.total,total);}
 await request('coupon',{code:''},400);await request('coupon',{code:'INVALID10'},400);await request('coupon',{code:'EXPIRED10'},400);await request('coupon',{code:'INACTIVE10'},400);
 const paid=await request('payment',{outcome:'success'});assert.equal(paid.order.coupon,'SAVE10');assert.equal((await request('orders')).orders.length,1);
 await request('cart',{id:'shirt',quantity:2});await request('coupon',{code:'SAVE10'},400);
 await request('logout',{});await request('coupon',{code:'SAVE10'},401);
 console.log('PASS: '+checks+' API response checks plus pricing/state assertions.');
 }catch(e){console.error(e);process.exitCode=1;}finally{server.close();}
});
