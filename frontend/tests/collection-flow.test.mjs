import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {test} from 'node:test';
import vm from 'node:vm';
import {transformSync} from 'esbuild';
import * as data from '../src/data.js';

const require=createRequire(import.meta.url);
const source=transformSync(readFileSync(new URL('../src/App.jsx',import.meta.url),'utf8'),{loader:'jsx',format:'cjs',jsx:'automatic'}).code;
const minute=60000;
// Run the real App handlers with controlled time/state, without browser timers.
function app(at='2026-11-16T09:01:00+08:00'){
 let now=Date.parse(at),cursor=0;
 const state=[];
 class TestDate extends Date{
  constructor(...args){super(...(args.length?args:[now]));}
  static now(){return now;}
 }
 const hooks={
  useState(initial){const i=cursor++;if(!(i in state))state[i]=typeof initial==='function'?initial():initial;return [state[i],value=>{state[i]=typeof value==='function'?value(state[i]):value;}];},
  useRef(value){const i=cursor++;return state[i]??={current:value};},useEffect(){}
 };
 const module={exports:{}};
 vm.runInNewContext(source,{module,Date:TestDate,setTimeout(){},clearTimeout(){},require:name=>name==='react'?hooks:name==='./data'?data:name==='./styles.css'?{}:require(name)});
 const render=()=>{cursor=0;return module.exports.default();};
 function* walk(node){
  if(Array.isArray(node)){for(const child of node)yield*walk(child);}
  else if(node?.props){yield node;yield*walk(node.type?.name==='PickupChoices'?node.type(node.props):node.props.children);}
 }
 const label=node=>Array.isArray(node)?node.map(label).join(''):node?.props?label(node.props.children):typeof node==='string'||typeof node==='number'?String(node):'';
 const all=()=>[...walk(render())];
 const find=predicate=>{const node=all().find(predicate);assert(node,'Target missing; buttons: '+all().filter(n=>n.type==='button').map(label).join(' | '));return node;};
 const button=text=>find(n=>n.type==='button'&&label(n)===text);
 const click=text=>{const node=button(text);assert(!node.props.disabled,text+' is disabled');node.props.onClick();};
 const aria=text=>find(n=>n.props['aria-label']===text).props.onClick();
 const select=(id,value)=>find(n=>n.type==='select'&&n.props.id===id).props.onChange({target:{value}});
 const option=value=>find(n=>n.type==='option'&&n.props.value===value);
 const text=()=>label(render());
 const g=()=>state[7];
 const choose=index=>select('create-pickup',g().slotTimes[index]);
 const start=()=>{
  for(const [placeholder,value]of [['you@example.com','maryng@yakun.demo'],['Password','kaya1234']])find(n=>n.props.placeholder===placeholder).props.onChange({target:{value}});
  click('Log in');click('Start Ya Kun Together');click('Next: choose pickup');
 };
 const create=()=>{click('Next: ordering time');click('Create group');assert(g().live);click('View group');};
 const submit=()=>{click('Menu');aria('Add '+data.MENU.find(m=>m.id===1).name);click('Add to order · $6.30');click('View my order · $6.30');click('Submit my order');click('Confirm payment method');click('Status');click('Close ordering early');click('Close ordering');};
 return {state,g,find,button,click,aria,select,option,text,choose,start,create,submit,now:()=>now,at:value=>{now=value;}};
}

test('pickup retains quick choices, includes preparation time and rejects stale creation',()=>{
 const a=app();a.start();const g=a.g();
 assert.equal(g.slotMs[2]-g.slotMs[1],30*minute);assert.equal(g.slotMs[3]-g.slotMs[2],30*minute);
 assert(g.slotMs[0]>=a.now()+(g.win+15)*minute);
 assert(a.button(g.slotTimes[0]));assert(a.find(n=>n.props.htmlFor==='create-pickup'));
 // First outlet has capacity four at ASAP, while the group expects five.
 assert(a.button(g.slotTimes[0]).props.disabled);a.click(g.slotTimes[1]);
 a.click('Next: ordering time');a.at(g.slotMs[1]-24*minute);a.click('Create group');
 assert(!a.g().live);assert.equal(a.g().slot,'');
});

test('advance choices reserve two hours after the deadline and replacements requalify',()=>{
 const a=app();a.start();a.click('Advance order');
 assert(!a.text().includes('ASAP (~'));
 const early=a.g().slotTimes[4];assert(a.option(early).props.disabled);a.choose(4);assert.equal(a.g().slot,'');
 a.choose(5);a.create();assert.equal(a.g().collectionMode,'advance');assert(a.g().advanceQualified);
 assert.equal(a.g().advanceSlotAt,a.g().slotMs[5]);assert(a.g().advanceSlotAt>=a.g().advanceDeadlineAt+120*minute);
 const first=a.g().slot;a.aria('Switch demo user');a.click('Collection slot fills up');a.click('Change pickup time or group size');
 assert(a.option(first).props.disabled);a.select('change-pickup',first);assert(a.g().slotGone);
 a.at(a.now()+5*minute);a.select('change-pickup',a.g().slotTimes[6]);assert(!a.g().slotGone);assert.equal(a.g().advanceQualifiedAt,a.now());assert.equal(a.g().advanceSlotAt,a.g().slotMs[6]);
 a.click('Pickup');assert.equal(a.g().slot,'');assert(!a.g().advanceQualified);assert.equal(a.g().advanceSlotAt,0);
});

for(const mode of ['pickup','advance'])test(mode+' rechecks send lead time, locks selection and preserves history',()=>{
 const a=app('2026-11-16T22:51:00+08:00');a.start();if(mode==='advance')a.click('Advance order');
 a.choose(8);a.create();const initial=a.state[6][0].pts,award=mode==='advance'?55:50;const slot=a.g().slot,slotAt=a.g().slotMs[8];assert(slot.includes('17 Nov'));
 a.submit();assert.equal(a.state[6][0].earned,0);const min=mode==='advance'?120:15;
 a.at(slotAt-min*minute+1);assert(a.button('Send group order to outlet').props.disabled);
 // Even a previously rendered enabled handler must check the current time.
 a.at(slotAt-min*minute);const send=a.button('Send group order to outlet');assert(!send.props.disabled);
 a.at(slotAt-min*minute+1);send.props.onClick();assert(!a.g().sent);
 a.at(slotAt-min*minute);a.click('Send group order to outlet');assert(a.g().sent);assert.equal(a.g().slot,slot);assert(a.text().includes('(locked)'));
 assert.equal(a.g().pointsBonus,mode==='advance'?10:0);assert.equal(a.state[6][0].pts,initial);
 assert(!a.text().includes('Change pickup time or group size'));
 a.at(slotAt+24*60*minute);
 a.aria('Switch demo user');a.click('Advance order status (outlet)');const collect=a.button('Mark as collected');a.click('Mark as collected');collect.props.onClick();assert.equal(a.state[6][0].earned,award);assert.equal(a.state[6][0].pts,initial+award);a.click('View order history');a.click('Details');
 assert(a.text().includes(award+' Cherish points earned'));assert(a.text().includes(slot));assert(a.text().includes(mode==='advance'?'Advance order':'Pickup'));
 a.state[8]=null;a.click('Start new order');const history=a.state[14][0];assert.equal(history.collectionMode,mode);assert.equal(history.slot,slot);
 assert.equal(history.advanceQualified,mode==='advance');assert.equal(history.pointsBonus,mode==='advance'?10:0);assert.equal(history.orders[0].earn,award);
});

test('ASAP is sendable at the planned deadline with the preparation minimum intact',()=>{
 const a=app();a.start();
 a.find(n=>n.props.className?.startsWith('opt ')&&n.props.onClick&&JSON.stringify(n.props.children).includes('NTU North Spine')).props.onClick();
 a.click(a.g().slotTimes[0]);a.create();a.submit();a.at(a.g().deadlineAt);
 assert(a.g().slotMs[0]-a.now()>=15*minute);a.click('Send group order to outlet');assert(a.g().sent);
});

test('quick and later next-day slots use Singapore dates within the 24-hour horizon',()=>{
 const base=Date.parse('2026-11-16T23:51:00+08:00'),times=data.makeSlotMs(base);
 assert(data.slotLabel(times[1],1).includes('17 Nov'));
 assert(data.slotLabel(times[4],4).includes('17 Nov'));
 assert(times.every(ms=>ms<=base+24*60*minute));
});
function noonAdvance(){
 const a=app('2026-11-16T09:30:00+08:00');a.start();a.click('Advance order');a.choose(5);
 a.at(Date.parse('2026-11-16T09:40:00+08:00'));a.create();
 assert.equal(a.g().advanceDeadlineAt,Date.parse('2026-11-16T09:50:00+08:00'));
 assert.equal(a.g().advanceSlotAt,Date.parse('2026-11-16T12:00:00+08:00'));
 a.submit();a.click('Group');return a;
}

test('one full extension preserves the noon advance order at 10.04 and in history',()=>{
 const a=noonAdvance(),slot=a.g().slot,original=a.g().advanceDeadlineAt;
 a.click('Extend 15 minutes');assert.equal(a.g().deadlineAt,original+15*minute);
 assert.equal(a.g().slot,slot);assert(a.g().extensionUsed);assert(a.g().advanceQualified);
 assert.equal(a.g().advanceDeadlineAt,original);assert(a.button('Extend 15 minutes').props.disabled);
 a.button('Extend 15 minutes').props.onClick();assert.equal(a.g().deadlineAt,original+15*minute);
 a.at(Date.parse('2026-11-16T10:04:00+08:00'));a.click('Status');a.click('Close ordering early');a.click('Close ordering');
 a.click('Send group order to outlet');assert(a.g().sent);assert.equal(a.g().slot,slot);assert.equal(a.g().pointsBonus,10);
 a.click('Group');assert(!a.text().includes('Extend 15 minutes'));
 a.click('Status');a.aria('Switch demo user');a.click('Advance order status (outlet)');a.click('Mark as collected');a.click('View order history');a.click('Details');
 assert(a.text().includes('One 15-minute deadline extension used'));a.state[8]=null;a.click('Start new order');
 const old=a.state[14][0];assert.equal(old.pointsBonus,10);assert.equal(old.orders[0].earn,55);assert(old.extensionUsed);assert(old.advanceQualified);assert.equal(old.slot,slot);
 assert(!a.g().extensionUsed);assert.equal(a.g().extensionUntil,0);
});

test('the advance exception expires, retains capacity checks and resets on a new slot',()=>{
 const a=noonAdvance();a.click('Extend 15 minutes');a.at(a.g().extensionUntil+1);
 a.click('Status');assert(a.button('Send group order to outlet').props.disabled);
 a.at(a.g().extensionUntil);a.state[7]={...a.g(),closed:true};assert(!a.button('Send group order to outlet').props.disabled);
 const payer=a.state[6][0];a.state[6]=a.state[6].map(p=>p.id===0?{...p,pmeth:null}:p);assert(a.button('Send group order to outlet').props.disabled);
 a.state[6]=a.state[6].map(p=>p.id===0?payer:p);a.state[7]={...a.g(),sold:[1]};assert(a.button('Send group order to outlet').props.disabled);a.state[7]={...a.g(),sold:[]};
 a.aria('Switch demo user');a.click('Collection slot fills up');assert(a.button('Send group order to outlet').props.disabled);
 a.click('Choose new time');const old=a.g().slot;a.select('change-pickup',old);assert(a.g().slotGone);
 a.select('change-pickup',a.g().slotTimes[4]);assert.equal(a.g().slot,old);
 a.select('change-pickup',a.g().slotTimes[7]);assert(!a.g().slotGone);assert.equal(a.g().advanceExtensionSlotAt,0);assert(a.g().extensionUsed);
 a.click('Pickup');assert(!a.g().advanceQualified);assert.equal(a.g().advanceExtensionSlotAt,0);
});

test('extension permissions and full-duration collection boundary are enforced',()=>{
 const a=noonAdvance();a.state[6]=a.state[6].map(p=>p.id===1?{...p,in:1}:p);a.aria('Switch demo user');a.click('Ben');a.click('Order');a.click('Group');assert(!a.text().includes('Extend 15 minutes'));
 a.aria('Switch demo user');a.click('Mary Ng (organiser)');a.click('Order');a.click('Group');
 const slotAt=a.g().advanceSlotAt;a.at(slotAt-15*minute);assert(a.button('Extend 15 minutes').props.disabled);
 a.button('Extend 15 minutes').props.onClick();assert(!a.g().extensionUsed);assert.equal(a.g().deadlineAt,a.g().advanceDeadlineAt);
 a.at(slotAt+1);a.button('Extend 15 minutes').props.onClick();assert(!a.g().extensionUsed);
 a.at(Date.parse('2026-11-16T09:41:00+08:00'));a.click('Cancel group order');a.find(n=>n.type==='button'&&n.props.className==='btn'&&n.props.children==='Cancel group order').props.onClick();assert(a.g().cancelled);assert(!a.text().includes('Extend 15 minutes'));
});

test('bonus rounds down once on actual personal spend, including cents and zero',()=>{
 const raw=readFileSync(new URL('../src/App.jsx',import.meta.url),'utf8');
 const points=vm.runInNewContext(raw.match(/const pointsFor = (.*);/)[1]);
 for(const [amount,ordinary,advance]of [[0,0,0],[.01,0,0],[.13,1,1],[4.3,34,37],[6.24,49,54],[6.3,50,55]]){
  assert.equal(points(amount),ordinary);assert.equal(points(amount,10),advance);
 }
});

test('advance cart and checkout show bonus terms; personal discount and membership are isolated',()=>{
 const a=app();a.start();a.click('Advance order');a.choose(5);a.create();const initial=a.state[6][0].pts;
 a.aria('Add Ben');a.click('Menu');a.aria('Add '+data.MENU.find(m=>m.id===1).name);a.click('Add to order · $6.30');a.click('View my order · $6.30');
 assert(a.text().includes('55 Cherish points'));assert(a.text().includes('Advance bonus eligible: 10% extra points'));
 a.click('Group');a.aria('Add Calvin');a.aria('Add Dylan');a.click('My order1');assert(a.text().includes('55 Cherish points'));
 a.click('View eligible rewards');a.find(n=>n.props.className?.startsWith('opt ')&&n.props.onClick&&JSON.stringify(n.props.children).includes('$2 off')).props.onClick();
 assert(a.text().includes('37 Cherish points'));a.click('Submit my order');assert(a.text().includes('37 Cherish points'));assert(a.text().includes('10% advance-order bonus'));a.click('Confirm payment method');
 // Ben's undiscounted personal order still gets the full 55-point estimate.
 a.aria('Switch demo user');a.click('Ben');a.click('Order');a.click('Menu');a.aria('Add '+data.MENU.find(m=>m.id===1).name);a.click('Add to order · $6.30');a.click('View my order · $6.30');assert(a.text().includes('55 Cherish points'));a.click('Submit my order');a.click('Confirm payment method');
 a.aria('Switch demo user');a.click('Mary Ng (organiser)');a.click('Order');a.click('Status');a.click('Close ordering early');a.click('Close ordering');a.click('Send group order to outlet');
 assert.equal(a.state[6][0].paidAmt,4.3);assert.equal(a.state[6][0].pts,initial-200);assert.equal(a.state[6][0].earned,0);
 a.aria('Switch demo user');a.click('Advance order status (outlet)');a.click('Mark as collected');assert.equal(a.state[6][0].earned,37);assert.equal(a.state[6][0].pts,initial-200+37);assert.equal(a.state[6][1].earned,55);assert.equal(a.state[6][2].earned,0);
});

test('switching to pickup removes the bonus and cancelling earns no points',()=>{
 const a=noonAdvance(),initial=a.state[6][0].pts;a.click('Change pickup time or group size');a.click('Pickup');a.select('change-pickup',a.g().slotTimes[6]);a.click('Done');a.click('My order1');
 assert(a.text().includes('50 Cherish points'));assert(!a.text().includes('Advance bonus eligible'));
 a.click('Group');a.click('Cancel group order');a.find(n=>n.type==='button'&&n.props.className==='btn'&&n.props.children==='Cancel group order').props.onClick();assert(a.g().cancelled);assert.equal(a.state[6][0].pts,initial);assert.equal(a.state[6][0].earned,0);assert.equal(a.g().pointsBonus,0);
});

function personalOrder(a,q=1){
 a.click('Menu');a.aria('Add '+data.MENU.find(m=>m.id===1).name);
 for(let i=1;i<q;i++)a.find(n=>n.type==='button'&&n.props.children==='+'&&!n.props['aria-label']).props.onClick();
 a.click('Add to order · $'+(6.3*q).toFixed(2));a.click('View my order · $'+(6.3*q).toFixed(2));a.click('Submit my order');a.click('Confirm payment method');
}
const cardButton=(a,id,method)=>a.find(n=>n.type==='button'&&n.props.className?.startsWith('opt ')&&JSON.stringify(n.props.children).includes('Card ending '+data.SAVED_CARDS[id].find(c=>c.id===method).last4));
const switchUser=(a,name)=>{a.aria('Switch demo user');a.click(name);};

test('Ben recovers with his alternative card; failure charges nobody and retry charges each person once',()=>{
 const a=app();a.start();a.choose(5);a.create();a.aria('Add Ben');a.aria('Add Calvin');const initial=a.state[6].map(p=>p.pts);
 personalOrder(a);switchUser(a,'Ben');a.click('Order');personalOrder(a,2);switchUser(a,'Calvin');a.click('Order');personalOrder(a);
 switchUser(a,'Mary Ng (organiser)');a.click('Order');a.click('Status');a.click('Close ordering early');a.click('Close ordering');
 a.state[7]={...a.g(),failFor:[1]};const originalSend=a.button('Send group order to outlet');a.click('Send group order to outlet');
 assert(!a.g().sent);assert.equal(a.state[6][1].pmeth,null);assert.equal(a.state[6][1].payFail,1);assert(a.state[6][1].failedMethods.includes('card'));
 assert(a.button('Send group order to outlet').props.disabled);
 for(const p of a.state[6].slice(0,3)){assert.equal(p.paidAmt,0);assert.equal(p.paid,0);assert.equal(p.pts,initial[p.id]);}
 assert.equal(a.state[10].filter(n=>n.t.startsWith('You were charged')).length,0);
 switchUser(a,'Ben');a.click('Pay');assert(a.text().includes('Card ending 2222'));assert(a.text().includes('Card ending 8018'));a.click('Choose payment method');
 assert(cardButton(a,1,'card').props.disabled);cardButton(a,1,'card').props.onClick();assert(cardButton(a,1,'backup').props.className.includes('on'));
 cardButton(a,1,'backup').props.onClick();a.click('Confirm payment method');assert.equal(a.state[6][1].pmeth,'backup');assert.equal(a.state[6][1].payFail,0);assert.equal(a.state[6][1].paidAmt,0);
 a.click('Pay');a.click('Change payment method');assert(cardButton(a,1,'backup').props.className.includes('on'));a.click('Confirm payment method');
 switchUser(a,'Mary Ng (organiser)');a.click('Order');a.click('Status');a.click('Send group order to outlet');assert(a.g().sent);
 originalSend.props.onClick();assert(a.g().sent);assert.equal(a.state[6][1].payFail,0);
 const amounts=[6.3,12.6,6.3];for(const p of a.state[6].slice(0,3))assert.equal(p.paidAmt,amounts[p.id]);
 assert.equal(a.state[6][1].paidMeth,'Card ending 8018');assert.equal(a.state[10].filter(n=>n.t.startsWith('You were charged')).length,3);
 a.aria('Switch demo user');a.click('Advance order status (outlet)');a.click('Mark as collected');
 switchUser(a,'Ben');a.click('Pay');assert(a.text().includes('Latest payment'));assert(a.text().includes('Card ending 8018'));assert(a.text().includes('$12.60'));
 a.state[0]='repeat';a.click('Details');assert(a.text().includes('Card ending 8018'));assert(a.text().includes('You paid$12.60'));assert(!a.text().includes('Card ending 1111'));
 switchUser(a,'Mary Ng (organiser)');a.click('Order');a.click('Status');a.click('View order history');a.click('Start new order');assert.deepEqual(Array.from(a.state[6][1].failedMethods),[]);assert.equal(a.state[6][1].pmeth,null);assert.equal(a.state[14][0].orders[1].paidMeth,'Card ending 8018');
});

test('Mary can recover her own decline; exhausting both mock cards stays blocked',()=>{
 const a=app();a.start();a.choose(5);a.create();personalOrder(a);a.click('Status');a.click('Close ordering early');a.click('Close ordering');
 a.state[7]={...a.g(),failFor:[0]};a.click('Send group order to outlet');assert(!a.g().sent);assert.equal(a.state[6][0].paidAmt,0);
 a.click('Pay');a.click('Choose payment method');assert(cardButton(a,0,'card').props.disabled);cardButton(a,0,'backup').props.onClick();a.click('Confirm payment method');
 a.state[7]={...a.g(),failFor:[0]};a.click('Send group order to outlet');assert(!a.g().sent);assert.equal(a.state[6][0].failedMethods.length,2);
 a.click('Pay');a.click('Choose payment method');assert(cardButton(a,0,'card').props.disabled);assert(cardButton(a,0,'backup').props.disabled);assert(a.button('Confirm payment method').props.disabled);assert(a.text().includes('Both saved mock cards were declined'));
 a.button('Confirm payment method').props.onClick();assert.equal(a.state[6][0].pmeth,null);assert.equal(a.state[6][0].paidAmt,0);
});
