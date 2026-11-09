// All data below is mock data used by the prototype.
export const $ = n => '$' + n.toFixed(2);
export const sum = a => a.reduce((s, i) => s + i.p * i.q, 0);
export const MAXSIZE = 10;
export const DEADLINES = ['8:15 AM', '8:30 AM', '8:45 AM', '9:00 AM'];
export const MENU = [
 {id:1,cat:'Sets',name:'Kaya Toast Set',price:5.2,desc:'2 toast, 2 soft-boiled eggs, kopi or teh',set:1,e:'toast',img:''},
 {id:2,cat:'Sets',name:'French Toast Set',price:5.6,desc:'Kaya French toast, 2 eggs, kopi or teh',set:1,e:'toast',img:''},
 {id:3,cat:'Sets',name:'Peanut Butter Toast Set',price:5.2,desc:'Crunchy peanut butter toast, 2 eggs, kopi or teh',set:1,e:'toast',img:''},
 {id:4,cat:'Toast',name:'Butter Kaya Toast',price:2.4,desc:'Thin crispy toast, kaya and butter',e:'toast',img:''},
 {id:5,cat:'Toast',name:'Soft-boiled Eggs (2)',price:1.8,desc:'With soy sauce and white pepper',e:'egg',img:''},
 {id:6,cat:'Drinks',name:'Kopi',price:1.7,desc:'Coffee with condensed milk',dr:1,e:'cup',img:''},
 {id:7,cat:'Drinks',name:'Teh',price:1.7,desc:'Tea with condensed milk',dr:1,e:'cup',img:''},
 {id:8,cat:'Drinks',name:'Milo',price:2.4,desc:'Chocolate malt drink',dr:1,e:'cup',img:''}];
export const tm = ms => new Date(ms).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});
// Pickup slots are generated fresh (not baked in at import time) so they always sit ~15/30/45/60 min
// ahead of whenever the group is actually being created, instead of drifting stale.
export const SLOT_OFFSETS_MIN = [15, 30, 45, 60];
export const makeSlotMs = (base = Date.now()) => { const r = Math.ceil(base / 300000) * 300000; return SLOT_OFFSETS_MIN.map(m => r + m * 60000); };
export const makeSlotTimes = (base = Date.now()) => {
  const rounded = Math.ceil(base / 300000) * 300000; // round up to the next 5-minute mark, for a tidy label
  return SLOT_OFFSETS_MIN.map(m => tm(rounded + m * 60000));
};
// Capacity per outlet, one number per slot above (largest group size that slot can still take).
export const OUTLET_CAPS = [
 {n:'Ya Kun – Far East Square', w:'8 minutes', caps:[4,12,12,12]},
 {n:'Ya Kun – NTU North Spine', w:'12 minutes', caps:[12,4,12,12]},
 {n:'Ya Kun – Marina Bay Link Mall', w:'5 minutes', caps:[3,3,12,12]}];

export const REWARDS = [
 {id:'r1',t:'$2 off',cost:200,min:5,val:2},
 {id:'r2',t:'Free kopi',cost:150,min:3,val:0,free:'Kopi'}   /* adds a free kopi; no price deduction */,
 {id:'r3',t:'$5 off',cost:500,min:10,val:5}];
// pmeth = payment method the person selected (nothing is charged yet). paid/paidAmt/paidMeth are only set when the organiser sends the order.
const U = (id,n,pts,org) => ({id,n,pts,org,in:org?1:0,items:[],sub:null,paid:0,paidAmt:0,paidMeth:'',pmeth:null,rw:null,earned:0,left:0,hist:[]});
export const USERS0 = [U(0,'Alex',340,1),U(1,'Ben',260),U(2,'Calvin',90),U(3,'Dylan',520),U(4,'Eve',150),
 U(5,'Farah',410),U(6,'Gareth',75),U(7,'Hui Min',230),U(8,'Irfan',600),U(9,'Jia Wei',180)];
// Demo "card on file" per person, purely cosmetic for the prototype.
export const CARD_LAST4 = {0:'1111',1:'2222',2:'3333',3:'4444',4:'5555',5:'6666',6:'7777',7:'8888',8:'9999',9:'1212'};
// Demo Cherish accounts, so the login screen has something real to check against.
export const ACCOUNTS = USERS0.map(u => ({id:u.id, identifier:u.n.toLowerCase().replace(/\s+/g,'')+'@yakun.demo', password:'kaya1234'}));

export const DEMO_ORDERS = {
 1:[{id:2,name:'French Toast Set',o:'Teh',q:1,p:5.6}],
 2:[{id:1,name:'Kaya Toast Set',o:'Kopi O, less sweet',q:1,p:5.2}],
 3:[{id:1,name:'Kaya Toast Set',o:'Kopi',q:1,p:5.2},{id:5,name:'Soft-boiled Eggs (2)',o:'As served',q:1,p:1.8}],
 4:[{id:2,name:'French Toast Set',o:'Kopi O, iced',q:1,p:6.2}],
 5:[{id:3,name:'Peanut Butter Toast Set',o:'Teh O',q:1,p:5.2}],
 6:[{id:6,name:'Kopi',o:'Normal, hot',q:2,p:1.7},{id:4,name:'Butter Kaya Toast',o:'As served',q:1,p:2.4}],
 7:[{id:1,name:'Kaya Toast Set',o:'Teh, less sweet',q:1,p:5.2}],
 8:[{id:2,name:'French Toast Set',o:'Kopi',q:1,p:5.6},{id:8,name:'Milo',o:'Normal, hot',q:1,p:2.4}],
 9:[{id:1,name:'Kaya Toast Set',o:'Kopi O, kosong',q:1,p:5.2}]};
export const SAVED0 = [
 {name:'Marketing Team',members:['Alex','Ben','Calvin','Dylan']},
 {name:'Friday Breakfast Crew',members:['Alex','Ben','Dylan','Eve']},
 {name:'Project Team',members:['Alex','Calvin','Eve']}];
// Previous group orders. Each entry keeps the date/time, outlet, pickup slot and EVERY submitted member's own items,
// so each person sees "what I ordered" and the organiser sees "who got what".
const ho = (items, rw='') => { const owed = items.reduce((s,i)=>s+i.p*i.q,0); return {items, owed, rw, earn: Math.floor(owed*10)}; };
const it = (id,name,o,q,p) => ({id,name,o,q,p});
const tot = orders => Object.values(orders).reduce((s,o)=>s+o.owed,0);
const O1 = {
 0: ho([it(1,'Kaya Toast Set','Kopi O, less sweet',1,5.2)]),
 1: ho([it(2,'French Toast Set','Teh',1,5.6),it(6,'Kopi','Normal, hot',1,1.7)]),
 3: ho([it(1,'Kaya Toast Set','Kopi',1,5.2),it(4,'Butter Kaya Toast','As served',1,2.4)])};
const O2 = {
 0: ho([it(2,'French Toast Set','Teh',1,5.6),it(8,'Milo','Normal, iced',1,3.0)]),
 1: ho([it(1,'Kaya Toast Set','Kopi O',1,5.2)]),
 2: ho([it(3,'Peanut Butter Toast Set','Teh O, kosong',1,5.2)]),
 3: ho([it(1,'Kaya Toast Set','Kopi',2,5.2)])};
export const HIST0 = [
 {id:'YT0987',name:'Friday Breakfast Crew',at:new Date(2026,8,18,8,20).getTime(),outlet:'Ya Kun – Far East Square',slot:'8:45 AM',coll:'C-017',status:'collected',pay:'individual',members:['Alex','Ben','Dylan'],orders:O1,total:tot(O1)},
 {id:'YT0951',name:'Marketing Team',at:new Date(2026,8,8,8,35).getTime(),outlet:'Ya Kun – NTU North Spine',slot:'9:00 AM',coll:'C-029',status:'collected',pay:'individual',members:['Alex','Ben','Calvin','Dylan'],orders:O2,total:tot(O2)}];
