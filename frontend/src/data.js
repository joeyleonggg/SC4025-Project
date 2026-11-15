// All data below is mock data used by the prototype.
export const $ = n => '$' + n.toFixed(2);
export const sum = a => a.reduce((s, i) => s + i.p * i.q, 0);
export const MAXSIZE = 10;
export const DEADLINES = ['8:15 AM', '8:30 AM', '8:45 AM', '9:00 AM'];
export const MENU = [
 {"id":1,"cat":"Sets","name":"Set A - Kaya Toast Set (Kaya & Sliced Butter)","price":6.3,"set":1,"e":"toast","desc":"Toast, 2 soft-boiled eggs and your choice of drink","photo":{"src":"/menu/source-01.jpg","x":15,"y":365,"size":270}},
 {"id":9,"cat":"Sets","name":"Set B - Kaya Peanut Set (Kaya & Creamy Peanut)","price":6.3,"set":1,"e":"toast","desc":"Toast, 2 soft-boiled eggs and your choice of drink","photo":{"src":"/menu/source-01.jpg","x":304,"y":365,"size":270}},
 {"id":3,"cat":"Sets","name":"Set B2 - Peanut Toast Set (Creamy Peanut only)","price":6.3,"set":1,"e":"toast","desc":"Toast, 2 soft-boiled eggs and your choice of drink","photo":{"src":"/menu/source-02.jpg","x":15,"y":244,"size":270}},
 {"id":10,"cat":"Sets","name":"Set C - Butter Sugar Toast Set","price":6.3,"set":1,"e":"toast","desc":"Toast, 2 soft-boiled eggs and your choice of drink","photo":{"src":"/menu/source-02.jpg","x":304,"y":244,"size":270}},
 {"id":2,"cat":"Sets","name":"Set D - French Toast Set (with Kaya Dip)","price":6.3,"set":1,"e":"toast","desc":"Toast, 2 soft-boiled eggs and your choice of drink","estimated":true,"photo":{"src":"/menu/source-02.jpg","x":15,"y":715,"size":270}},
 {"id":11,"cat":"Sets","name":"Set E - Smoked Cheese French Toast Set (with Kaya Dip)","price":6.7,"set":1,"e":"toast","desc":"Toast, 2 soft-boiled eggs and your choice of drink","estimated":true,"photo":{"src":"/menu/source-02.jpg","x":304,"y":715,"size":270}},
 {"id":12,"cat":"Sets","name":"Set F1 - Steamed Bread Set (Kaya & Sliced Butter)","price":6.4,"set":1,"e":"toast","desc":"Steamed bread, 2 soft-boiled eggs and your choice of drink","photo":{"src":"/menu/source-03.jpg","x":15,"y":211,"size":270}},
 {"id":13,"cat":"Sets","name":"Set F2 - Steamed Bread Set (Kaya & Creamy Peanut)","price":6.4,"set":1,"e":"toast","desc":"Steamed bread, 2 soft-boiled eggs and your choice of drink","photo":{"src":"/menu/source-03.jpg","x":304,"y":211,"size":270}},
 {"id":14,"cat":"Hot beverages","name":"Soya Milk Coffee","price":3.5,"dr":1,"e":"cup","desc":"Hot beverage","photo":{"src":"/menu/source-04.jpg","x":15,"y":210,"size":270}},
 {"id":15,"cat":"Hot beverages","name":"Soya Milk Coffee O","price":3.3,"dr":1,"e":"cup","desc":"Hot beverage","photo":{"src":"/menu/source-04.jpg","x":304,"y":210,"size":270}},
 {"id":16,"cat":"Hot beverages","name":"Soya Milk Tea","price":3.5,"dr":1,"e":"cup","desc":"Hot beverage","photo":{"src":"/menu/source-04.jpg","x":15,"y":650,"size":270}},
 {"id":17,"cat":"Hot beverages","name":"Soya Milk Tea O","price":3.3,"dr":1,"e":"cup","desc":"Hot beverage","photo":{"src":"/menu/source-04.jpg","x":304,"y":650,"size":270}},
 {"id":18,"cat":"Hot beverages","name":"Coffee O","price":2,"dr":1,"e":"cup","desc":"Hot beverage","photo":{"src":"/menu/source-05.jpg","x":15,"y":270,"size":270}},
 {"id":19,"cat":"Hot beverages","name":"Tea O","price":2,"dr":1,"e":"cup","desc":"Hot beverage","photo":{"src":"/menu/source-05.jpg","x":304,"y":270,"size":270}},
 {"id":20,"cat":"Hot beverages","name":"Yuan Yang O","price":2.1,"dr":1,"e":"cup","desc":"Hot beverage","photo":{"src":"/menu/source-05.jpg","x":15,"y":738,"size":270}},
 {"id":6,"cat":"Hot beverages","name":"Coffee","price":2.2,"dr":1,"e":"cup","desc":"Hot beverage","photo":{"src":"/menu/source-05.jpg","x":304,"y":738,"size":270}},
 {"id":7,"cat":"Hot beverages","name":"Tea","price":2.2,"dr":1,"e":"cup","desc":"Hot beverage","photo":{"src":"/menu/source-06.jpg","x":15,"y":214,"size":270}},
 {"id":21,"cat":"Hot beverages","name":"Yuan Yang","price":2.3,"dr":1,"e":"cup","desc":"Hot beverage","photo":{"src":"/menu/source-06.jpg","x":304,"y":214,"size":270}},
 {"id":22,"cat":"Hot beverages","name":"Coffee C","price":2.4,"dr":1,"e":"cup","desc":"Hot beverage","photo":{"src":"/menu/source-06.jpg","x":15,"y":687,"size":270}},
 {"id":23,"cat":"Hot beverages","name":"Tea C","price":2.4,"dr":1,"e":"cup","desc":"Hot beverage","photo":{"src":"/menu/source-06.jpg","x":304,"y":687,"size":270}},
 {"id":24,"cat":"Hot beverages","name":"Yuan Yang C","price":2.5,"dr":1,"e":"cup","desc":"Hot beverage","photo":{"src":"/menu/source-07.jpg","x":15,"y":200,"size":270}},
 {"id":8,"cat":"Hot beverages","name":"Milo","price":2.6,"dr":1,"e":"cup","desc":"Hot beverage","photo":{"src":"/menu/source-07.jpg","x":304,"y":200,"size":270}},
 {"id":25,"cat":"Hot beverages","name":"Horlicks","price":2.6,"dr":1,"e":"cup","desc":"Hot beverage","photo":{"src":"/menu/source-07.jpg","x":15,"y":648,"size":270}},
 {"id":26,"cat":"Hot beverages","name":"Lemon Tea","price":3.3,"dr":1,"e":"cup","desc":"Hot beverage","photo":{"src":"/menu/source-07.jpg","x":304,"y":648,"size":270}},
 {"id":27,"cat":"Hot beverages","name":"Buzzy Honey Lemon","price":3.3,"dr":1,"e":"cup","desc":"Hot beverage","photo":{"src":"/menu/source-08.jpg","x":15,"y":195,"size":270}},
 {"id":28,"cat":"Hot beverages","name":"Silkyz Barley","price":3.5,"dr":1,"e":"cup","desc":"Contains egg white · available after 10am","photo":{"src":"/menu/source-08.jpg","x":304,"y":195,"size":270}},
 {"id":29,"cat":"Hot beverages","name":"Ginger Tea O","price":2.9,"dr":1,"e":"cup","desc":"Hot beverage","photo":{"src":"/menu/source-08.jpg","x":15,"y":620,"size":270}},
 {"id":30,"cat":"Hot beverages","name":"Ginger Water","price":2.9,"dr":1,"e":"cup","desc":"Hot beverage","photo":{"src":"/menu/source-08.jpg","x":304,"y":620,"size":270}},
 {"id":31,"cat":"Hot beverages","name":"Ginger Milk Tea","price":3,"dr":1,"e":"cup","desc":"Hot beverage","photo":{"src":"/menu/source-09.jpg","x":15,"y":285,"size":270}},
 {"id":32,"cat":"Hot beverages","name":"Chinese Tea","price":2.4,"dr":1,"e":"cup","desc":"Hot beverage","photo":{"src":"/menu/source-09.jpg","x":304,"y":285,"size":270}},
 {"id":33,"cat":"Cold beverages","name":"Iced Moki","price":3.6,"dr":1,"e":"cup","desc":"Cold beverage","photo":{"src":"/menu/source-09.jpg","x":15,"y":835,"size":270}},
 {"id":34,"cat":"Cold beverages","name":"Iced Coffee O","price":3.1,"dr":1,"e":"cup","desc":"Cold beverage","photo":{"src":"/menu/source-09.jpg","x":304,"y":835,"size":270}},
 {"id":35,"cat":"Cold beverages","name":"Iced Tea O","price":3.1,"dr":1,"e":"cup","desc":"Cold beverage","photo":{"src":"/menu/source-10.jpg","x":15,"y":300,"size":270}},
 {"id":36,"cat":"Cold beverages","name":"Iced Yuan Yang O","price":3.2,"dr":1,"e":"cup","desc":"Cold beverage","photo":{"src":"/menu/source-10.jpg","x":304,"y":300,"size":270}},
 {"id":37,"cat":"Cold beverages","name":"Iced Coffee","price":3.2,"dr":1,"e":"cup","desc":"Cold beverage","photo":{"src":"/menu/source-10.jpg","x":15,"y":742,"size":270}},
 {"id":38,"cat":"Cold beverages","name":"Iced Tea","price":3.2,"dr":1,"e":"cup","desc":"Cold beverage","photo":{"src":"/menu/source-10.jpg","x":304,"y":742,"size":270}},
 {"id":39,"cat":"Cold beverages","name":"Iced Yuan Yang","price":3.3,"dr":1,"e":"cup","desc":"Cold beverage","photo":{"src":"/menu/source-11.jpg","x":15,"y":214,"size":270}},
 {"id":40,"cat":"Cold beverages","name":"Iced Coffee C","price":3.4,"dr":1,"e":"cup","desc":"Cold beverage","photo":{"src":"/menu/source-11.jpg","x":304,"y":214,"size":270}},
 {"id":41,"cat":"Cold beverages","name":"Iced Tea C","price":3.4,"dr":1,"e":"cup","desc":"Cold beverage","photo":{"src":"/menu/source-11.jpg","x":15,"y":683,"size":270}},
 {"id":42,"cat":"Cold beverages","name":"Iced Yuan Yang C","price":3.5,"dr":1,"e":"cup","desc":"Cold beverage","photo":{"src":"/menu/source-11.jpg","x":304,"y":683,"size":270}},
 {"id":43,"cat":"Cold beverages","name":"Iced Milo","price":3.5,"dr":1,"e":"cup","desc":"Cold beverage","photo":{"src":"/menu/source-12.jpg","x":15,"y":219,"size":270}},
 {"id":44,"cat":"Cold beverages","name":"Iced Horlicks","price":3.5,"dr":1,"e":"cup","desc":"Cold beverage","photo":{"src":"/menu/source-12.jpg","x":304,"y":219,"size":270}},
 {"id":45,"cat":"Cold beverages","name":"Iced Lemon Tea","price":3.3,"dr":1,"e":"cup","desc":"Cold beverage","photo":{"src":"/menu/source-12.jpg","x":15,"y":686,"size":270}},
 {"id":46,"cat":"Cold beverages","name":"Iced Honey Lemon","price":3.3,"dr":1,"e":"cup","desc":"Cold beverage","photo":{"src":"/menu/source-12.jpg","x":304,"y":686,"size":270}},
 {"id":47,"cat":"Cold beverages","name":"Iced Silkyz Barley","price":3.5,"dr":1,"e":"cup","desc":"Contains egg white · available after 10am","photo":{"src":"/menu/source-13.jpg","x":15,"y":201,"size":270}},
 {"id":48,"cat":"Cold beverages","name":"Iced Ginger Milk Tea","price":3.7,"dr":1,"e":"cup","desc":"Cold beverage","photo":{"src":"/menu/source-13.jpg","x":304,"y":201,"size":270}},
 {"id":49,"cat":"Cold beverages","name":"Iced Soya Coffee O","price":3.7,"dr":1,"e":"cup","desc":"Cold beverage","photo":{"src":"/menu/source-13.jpg","x":15,"y":739,"size":270}},
 {"id":50,"cat":"Cold beverages","name":"Iced Soya Coffee","price":4,"dr":1,"e":"cup","desc":"Cold beverage","photo":{"src":"/menu/source-13.jpg","x":304,"y":739,"size":270}},
 {"id":51,"cat":"Cold beverages","name":"Iced Soya Tea O","price":3.7,"dr":1,"e":"cup","desc":"Cold beverage","photo":{"src":"/menu/source-14.jpg","x":15,"y":211,"size":270}},
 {"id":52,"cat":"Cold beverages","name":"Iced Soya Tea","price":4,"dr":1,"e":"cup","desc":"Cold beverage","photo":{"src":"/menu/source-14.jpg","x":304,"y":211,"size":270}},
 {"id":4,"cat":"Toast","name":"Kaya Toast (Kaya & Sliced Butter)","price":3,"e":"toast","desc":"Bread only","photo":{"src":"/menu/source-14.jpg","x":15,"y":709,"size":270}},
 {"id":53,"cat":"Toast","name":"Kaya Peanut (Kaya & Creamy Peanut)","price":3,"e":"toast","desc":"Bread only","photo":{"src":"/menu/source-14.jpg","x":304,"y":709,"size":270}},
 {"id":54,"cat":"Toast","name":"Peanut Toast (Without Kaya)","price":3,"e":"toast","desc":"Bread only","photo":{"src":"/menu/source-15.jpg","x":15,"y":261,"size":270}},
 {"id":55,"cat":"Toast","name":"Butter Sugar Toast","price":3,"e":"toast","desc":"Bread only","photo":{"src":"/menu/source-15.jpg","x":304,"y":261,"size":270}},
 {"id":56,"cat":"Toast","name":"French Toast (with Kaya Dip)","price":3,"e":"toast","desc":"Bread only","photo":{"src":"/menu/source-15.jpg","x":15,"y":710,"size":270}},
 {"id":57,"cat":"Toast","name":"Smoked Cheese French Toast (with Kaya Dip)","price":3.5,"e":"toast","desc":"Bread only","photo":{"src":"/menu/source-15.jpg","x":304,"y":710,"size":270}},
 {"id":58,"cat":"Toast","name":"Steamed Bread (Kaya & Sliced Butter)","price":3.2,"e":"toast","desc":"Bread only","photo":{"src":"/menu/source-16.jpg","x":15,"y":326,"size":270}},
 {"id":59,"cat":"Toast","name":"Steamed Bread (Kaya & Creamy Peanut)","price":3.2,"e":"toast","desc":"Bread only","photo":{"src":"/menu/source-16.jpg","x":304,"y":326,"size":270}},
 {"id":5,"cat":"Toast","name":"Soft-boiled Eggs (2)","price":1.8,"e":"egg","desc":"With soy sauce and white pepper"},
 {"id":60,"cat":"Toastwich","name":"Chilli Crab Toastwich (With Real Crab Meat)","price":5.8,"e":"toast","desc":"Toasted sandwich","photo":{"src":"/menu/source-16.jpg","x":15,"y":850,"size":270}},
 {"id":61,"cat":"Toastwich","name":"Egg Mayo Toastwich","price":4.8,"e":"toast","desc":"Toasted sandwich","photo":{"src":"/menu/source-16.jpg","x":304,"y":850,"size":270}},
 {"id":62,"cat":"Toastwich","name":"Chicken Char Siew Toastwich","price":5.2,"e":"toast","desc":"Toasted sandwich","photo":{"src":"/menu/source-17.jpg","x":15,"y":350,"size":270}},
 {"id":63,"cat":"Toastwich","name":"Specialty Otah Toastwich (Otah, Omelette & Sambal)","price":5.2,"e":"toast","desc":"Toasted sandwich","photo":{"src":"/menu/source-17.jpg","x":304,"y":350,"size":270}},
 {"id":64,"cat":"Toastwich","name":"Tuna Mayo Toastwich","price":4.8,"e":"toast","desc":"Toasted sandwich","photo":{"src":"/menu/source-17.jpg","x":15,"y":820,"size":270}},
 {"id":65,"cat":"Toastwich","name":"Rendang Chicken Toastwich","price":5.2,"e":"toast","desc":"Toasted sandwich","photo":{"src":"/menu/source-17.jpg","x":304,"y":820,"size":270}},
 {"id":66,"cat":"Merchandise","name":"Black Tea (250g)","price":12.8,"e":"order","desc":"Packaged product","photo":{"src":"/menu/source-18.jpg","x":15,"y":510,"size":270}},
 {"id":67,"cat":"Merchandise","name":"Chunky Peanut Butter","price":7.2,"e":"order","desc":"Packaged product","photo":{"src":"/menu/source-18.jpg","x":304,"y":510,"size":270}},
 {"id":68,"cat":"Merchandise","name":"Kaya Jar (290g)","price":6.8,"e":"order","desc":"Packaged product","photo":{"src":"/menu/source-19.jpg","x":15,"y":206,"size":270}},
 {"id":69,"cat":"Merchandise","name":"Single Gift Pack (290g)","price":8.2,"e":"order","desc":"Packaged product","photo":{"src":"/menu/source-19.jpg","x":304,"y":206,"size":270}},
 {"id":70,"cat":"Merchandise","name":"Elfin Pack (75g x 2)","price":8.8,"e":"order","desc":"Packaged product","photo":{"src":"/menu/source-19.jpg","x":15,"y":697,"size":270}},
 {"id":71,"cat":"Merchandise","name":"Peanut Butter (250g)","price":6.8,"e":"order","desc":"Packaged product","photo":{"src":"/menu/source-19.jpg","x":304,"y":697,"size":270}},
 {"id":72,"cat":"Merchandise","name":"Coffee Powder (500g)","price":24.8,"e":"order","desc":"Packaged product","photo":{"src":"/menu/source-20.jpg","x":15,"y":291,"size":270}},
 {"id":73,"cat":"Merchandise","name":"Kaya Butter Cookies","price":4.5,"e":"order","desc":"Packaged product","photo":{"src":"/menu/source-20.jpg","x":304,"y":291,"size":270}},
 {"id":74,"cat":"Merchandise","name":"Kaya Pistachio Cookies","price":4.5,"e":"order","desc":"Packaged product","photo":{"src":"/menu/source-20.jpg","x":15,"y":758,"size":270}},
];
export const CATEGORIES = [...new Set(MENU.map(item => item.cat))];
// Set-meal drink supplements transcribed from the supplied app recording.
export const SET_DRINKS = [
 {name:'Hot Coffee O (Regular)',extra:0},
 {name:'Hot Coffee O (Large)',extra:0.6},
 {name:'Hot Tea O (Regular)',extra:0},
 {name:'Hot Tea O (Large)',extra:0.6},
 {name:'Hot Yuan Yang O (Regular)',extra:0},
 {name:'Hot Yuan Yang O (Large)',extra:0.7},
 {name:'Hot Coffee (Regular)',extra:0},
 {name:'Hot Coffee (Large)',extra:0.8},
 {name:'Hot Tea (Regular)',extra:0},
 {name:'Hot Tea (Large)',extra:0.8},
 {name:'Hot Yuan Yang (Regular)',extra:0.1},
 {name:'Hot Yuan Yang (Large)',extra:0.9},
 {name:'Hot Coffee C (Regular)',extra:0.2},
 {name:'Hot Coffee C (Large)',extra:1},
 {name:'Hot Tea C (Regular)',extra:0.2},
 {name:'Hot Tea C (Large)',extra:1},
 {name:'Hot Yuan Yang C (Regular)',extra:0.3},
 {name:'Hot Yuan Yang C (Large)',extra:1.1},
 {name:'Hot Buzzy Honey Lemon (Large)',extra:1.1},
 {name:'Hot Lemon Tea (Large)',extra:1.1},
 {name:'Hot Silkyz Barley (Large)',extra:1.3},
 {name:'Hot Milo (Regular)',extra:0.4},
 {name:'Hot Milo (Large)',extra:1.2},
 {name:'Hot Horlicks (Regular)',extra:0.4},
 {name:'Hot Horlicks (Large)',extra:1.2},
 {name:'Hot Ginger Tea O (Regular)',extra:0.7},
 {name:'Hot Ginger Tea O (Large)',extra:1.4},
 {name:'Iced Coffee O (Regular)',extra:0.9},
 {name:'Iced Coffee O (Large)',extra:2},
 {name:'Iced Tea O (Regular)',extra:0.9},
 {name:'Iced Tea O (Large)',extra:2},
 {name:'Iced Yuan Yang O (Regular)',extra:1},
 {name:'Iced Yuan Yang O (Large)',extra:2.1},
 {name:'Iced Coffee (Regular)',extra:1},
 {name:'Iced Coffee (Large)',extra:2.1},
 {name:'Iced Tea (Regular)',extra:1},
 {name:'Iced Tea (Large)',extra:2.1},
 {name:'Iced Yuan Yang (Regular)',extra:1.1},
 {name:'Iced Yuan Yang (Large)',extra:2.2},
 {name:'Iced Coffee C (Regular)',extra:1.2},
 {name:'Iced Coffee C (Large)',extra:2.3},
 {name:'Iced Tea C (Regular)',extra:1.2},
 {name:'Iced Tea C (Large)',extra:2.3},
 {name:'Iced Yuan Yang C (Regular)',extra:1.3},
 {name:'Iced Yuan Yang C (Large)',extra:2.4},
 {name:'Iced Milo (Regular)',extra:1.3},
 {name:'Iced Milo (Large)',extra:2.5},
 {name:'Iced Horlicks (Regular)',extra:1.3},
 {name:'Iced Horlicks (Large)',extra:2.5},
 {name:'Iced Lemon Tea (Regular)',extra:1.1},
 {name:'Iced Lemon Tea (Large)',extra:2.2},
 {name:'Iced Honey Lemon (Regular)',extra:1.1},
 {name:'Iced Honey Lemon (Large)',extra:2.2},
 {name:'Iced Silkyz Barley (Regular)',extra:1.3},
 {name:'Iced Silkyz Barley (Large)',extra:2.6},
 {name:'Iced Ginger Milk Tea (Regular)',extra:1.5},
 {name:'Iced Ginger Milk Tea (Large)',extra:2.7},
 {name:'Iced Soya Coffee O (Regular)',extra:1.5},
 {name:'Iced Soya Coffee (Regular)',extra:1.8},
 {name:'Iced Soya Coffee (Large)',extra:3},
 {name:'Iced Soya Tea O (Regular)',extra:1.5},
 {name:'Iced Soya Tea (Regular)',extra:1.8},
 {name:'Iced Soya Tea (Large)',extra:3},
 {name:'Iced Moki (Regular)',extra:1.4},
 {name:'Soya Milk Coffee (Large)',extra:1.3},
 {name:'Soya Milk Coffee O (Large)',extra:1.1},
 {name:'Soya Milk Tea (Large)',extra:1.3},
 {name:'Soya Milk Tea O (Large)',extra:1.3}
];
export const itemPrice = (item,drink) => {
 const extra=item.set?(SET_DRINKS.find(choice=>choice.name===drink)?.extra||0):0;
 return Math.round((item.price+extra)*100)/100;
};
// Reorders use today's menu names and prices while historical receipts keep their original values.
export const repriceItem = item => {
 let menu=MENU.find(entry=>entry.id===item.id);
 if(!menu)return null;
 const option=item.o||'';
 if(menu.cat==='Hot beverages'&&/iced/i.test(option)){
  menu=MENU.find(entry=>entry.name==='Iced '+menu.name)||menu;
 }
 if(!menu.set)return {...item,id:menu.id,name:menu.name,p:menu.price};
 let drink=SET_DRINKS.find(choice=>option.startsWith(choice.name));
 if(!drink){
  const tea=/teh|tea/i.test(option),black=/kopi o|teh o|coffee o|tea o/i.test(option);
  const name=(/iced/i.test(option)?'Iced ':'Hot ')+(tea?'Tea':'Coffee')+(black?' O':'')+' (Regular)';
  drink=SET_DRINKS.find(choice=>choice.name===name)||SET_DRINKS[0];
 }
 const sweetness=/kosong/i.test(option)?'Kosong':/less/i.test(option)?'Less sweet':/more/i.test(option)?'More sweet':'Normal';
 return {...item,name:menu.name,p:itemPrice(menu,drink.name),o:drink.name+', '+sweetness.toLowerCase()};
};
export const tm = ms => new Date(ms).toLocaleTimeString('en-SG', {timeZone:'Asia/Singapore',hour:'numeric',minute:'2-digit'});
export const QUICK_SLOT_COUNT = 4;
// Four quick choices, followed by later choices every 30 minutes up to 24 hours ahead.
export const SLOT_OFFSETS_MIN = [15,...Array.from({length:48},(_,i)=>(i+1)*30)];
export const makeSlotMs = (base = Date.now()) => {
 const rounded=Math.ceil(base/300000)*300000;
 return SLOT_OFFSETS_MIN.map(m=>rounded+m*60000).filter(ms=>ms<=base+24*60*60000);
};
export const slotLabel = (ms,index) => {
 if(index===0)return 'ASAP (~'+tm(ms)+')';
 if(index<QUICK_SLOT_COUNT)return tm(ms);
 const day=new Date(ms).toLocaleDateString('en-SG',{timeZone:'Asia/Singapore',weekday:'short',day:'numeric',month:'short'});
 return day+' · '+tm(ms);
};
export const makeSlotTimes = (base = Date.now()) => makeSlotMs(base).map(slotLabel);
// Capacity per outlet, one number per slot above (largest group size that slot can still take).
export const OUTLET_CAPS = [
 {n:'Ya Kun – Far East Square', w:'8 minutes', caps:[4,12,12,12],laterCap:12},
 {n:'Ya Kun – NTU North Spine', w:'12 minutes', caps:[12,4,12,12],laterCap:12},
 {n:'Ya Kun – Marina Bay Link Mall', w:'5 minutes', caps:[3,3,12,12],laterCap:12}];

export const REWARDS = [
 {id:'r1',t:'$2 off',cost:200,min:5,val:2},
 {id:'r2',t:'Free kopi',cost:150,min:3,val:0,free:'Kopi'}   /* adds a free kopi; no price deduction */,
 {id:'r3',t:'$5 off',cost:500,min:10,val:5}];
// pmeth = payment method the person selected (nothing is charged yet). paid/paidAmt/paidMeth are only set when the organiser sends the order.
const U = (id,n,pts,org) => ({id,n,pts,org,in:org?1:0,items:[],sub:null,paid:0,paidAmt:0,paidMeth:'',pmeth:null,rw:null,earned:0,left:0,hist:[]});
export const USERS0 = [U(0,'Mary Ng',340,1),U(1,'Ben',260),U(2,'Calvin',90),U(3,'Dylan',520),U(4,'Eve',150),
 U(5,'Farah',410),U(6,'Gareth',75),U(7,'Hui Min',230),U(8,'Irfan',600),U(9,'Jia Wei',180)];
// Demo "card on file" per person, purely cosmetic for the prototype.
export const CARD_LAST4 = {0:'1111',1:'2222',2:'3333',3:'4444',4:'5555',5:'6666',6:'7777',7:'8888',8:'9999',9:'1212'};
// Demo Cherish accounts, so the login screen has something real to check against.
export const ACCOUNTS = USERS0.map(u => ({id:u.id, identifier:u.n.toLowerCase().replace(/\s+/g,'')+'@yakun.demo', password:'kaya1234'}));

const demoItem = (id,o='As served',q=1) => repriceItem({id,o,q});
export const DEMO_ORDERS = {
 1:[demoItem(2,'Hot Tea (Regular)')],
 2:[demoItem(1,'Hot Coffee O (Regular), less sweet')],
 3:[demoItem(1,'Hot Coffee (Regular)'),demoItem(5)],
 4:[demoItem(2,'Iced Coffee O (Regular)')],
 5:[demoItem(3,'Hot Tea O (Regular)')],
 6:[demoItem(6,'Normal',2),demoItem(4)],
 7:[demoItem(1,'Hot Tea (Regular), less sweet')],
 8:[demoItem(2,'Hot Coffee (Regular)'),demoItem(8,'Normal')],
 9:[demoItem(1,'Hot Coffee O (Regular), kosong')]
};
export const SAVED0 = [
 {name:'Marketing Team',members:['Mary Ng','Ben','Calvin','Dylan']},
 {name:'Friday Breakfast Crew',members:['Mary Ng','Ben','Dylan','Eve']},
 {name:'Project Team',members:['Mary Ng','Calvin','Eve']}];
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
 {id:'YT0987',name:'Friday Breakfast Crew',at:new Date(2026,8,18,8,20).getTime(),outlet:'Ya Kun – Far East Square',slot:'8:45 AM',coll:'C-017',status:'collected',pay:'individual',members:['Mary Ng','Ben','Dylan'],orders:O1,total:tot(O1)},
 {id:'YT0951',name:'Marketing Team',at:new Date(2026,8,8,8,35).getTime(),outlet:'Ya Kun – NTU North Spine',slot:'9:00 AM',coll:'C-029',status:'collected',pay:'individual',members:['Mary Ng','Ben','Calvin','Dylan'],orders:O2,total:tot(O2)}];
