// Seed data mirrors frontend/src/data.js so both sides agree while the frontend is still mocked.
export const MAXSIZE = 10;
export const MENU = [
  {id:1,cat:'Sets',name:'Kaya Toast Set',price:5.2,set:true},
  {id:2,cat:'Sets',name:'French Toast Set',price:5.6,set:true},
  {id:3,cat:'Sets',name:'Peanut Butter Toast Set',price:5.2,set:true},
  {id:4,cat:'Toast',name:'Butter Kaya Toast',price:2.4},
  {id:5,cat:'Toast',name:'Soft-boiled Eggs (2)',price:1.8},
  {id:6,cat:'Drinks',name:'Kopi',price:1.7,drink:true},
  {id:7,cat:'Drinks',name:'Teh',price:1.7,drink:true},
  {id:8,cat:'Drinks',name:'Milo',price:2.4,drink:true}];
export const SLOT_OFFSETS_MIN = [15, 30, 45, 60];
// caps[i] = largest group size slot i can still take
export const OUTLETS = [
  {id:1,name:'Ya Kun – Far East Square',waitMin:8,caps:[4,12,12,12]},
  {id:2,name:'Ya Kun – NTU North Spine',waitMin:12,caps:[12,4,12,12]},
  {id:3,name:'Ya Kun – Marina Bay Link Mall',waitMin:5,caps:[3,3,12,12]}];
export const REWARDS = [
  {id:'r1',title:'$2 off',cost:200,minSpend:5,value:2},
  {id:'r2',title:'Free kopi',cost:150,minSpend:3,value:0,free:'Kopi'},
  {id:'r3',title:'$5 off',cost:500,minSpend:10,value:5}];
const names = ['Alex','Ben','Calvin','Dylan','Eve','Farah','Gareth','Hui Min','Irfan','Jia Wei'];
const points = [340,260,90,520,150,410,75,230,600,180];
export const USERS = names.map((name,i) => ({
  id:i, name, points:points[i], history:[],
  email:name.toLowerCase().replace(/\s+/g,'')+'@yakun.demo', password:'kaya1234'}));
export const SAVED_GROUPS = [
  {id:1,ownerId:0,name:'Marketing Team',members:[1,2,3]},
  {id:2,ownerId:0,name:'Friday Breakfast Crew',members:[1,3,4]},
  {id:3,ownerId:0,name:'Project Team',members:[2,4]}];
