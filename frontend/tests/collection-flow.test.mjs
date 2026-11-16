import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {test} from 'node:test';
import vm from 'node:vm';
import {transformSync} from 'esbuild';
import * as data from '../src/data.js';
import * as retention from '../src/retention.js';

const require=createRequire(import.meta.url);
const source=transformSync(readFileSync(new URL('../src/App.jsx',import.meta.url),'utf8'),{loader:'jsx',format:'cjs',jsx:'automatic'}).code;
const minute=60000;
// Run real App handlers with controlled time/state; reminder tests also run effects and scheduled timers.
function app(at='2026-11-16T09:01:00+08:00',options={}){
 let now=Date.parse(at),cursor=0;
 const state=[],copiedLinks=[],events={},effects=[],effectSlots=[],pendingEffects=[],timers=new Map();let mounted=false,dirty=false,effectCursor=0,timerSequence=0;
 const browserWindow={location:{origin:'http://localhost:5173',pathname:'/',hash:options.hash||''},addEventListener:(name,fn)=>{events[name]=fn;},removeEventListener:name=>{delete events[name];}};
 const navigator=options.clipboard==='missing'?{}:{clipboard:{writeText:async text=>{if(options.clipboard==='reject')throw new Error('Denied');copiedLinks.push(text);}}};
 class TestDate extends Date{
  constructor(...args){super(...(args.length?args:[now]));}
  static now(){return now;}
 }
 const hooks={
  useState(initial){const i=cursor++;if(!(i in state))state[i]=typeof initial==='function'?initial():initial;return [state[i],value=>{const next=typeof value==='function'?value(state[i]):value;if(!Object.is(state[i],next))dirty=true;state[i]=next;}];},
  useRef(value){const i=cursor++;return state[i]??={current:value};},useEffect(effect,deps){
   if(!options.enableTimers){if(!mounted&&deps?.length===0)effects.push(effect);return;}
   const i=effectCursor++,previous=effectSlots[i];
   if(previous&&deps?.every((value,index)=>Object.is(value,previous.deps?.[index]))&&deps.length===previous.deps?.length)return;
   effectSlots[i]={deps,effect,cleanup:previous?.cleanup};
   pendingEffects.push(()=>{previous?.cleanup?.();effectSlots[i].cleanup=effect();});
  }
 };
 const module={exports:{}};
 vm.runInNewContext(source,{module,Date:TestDate,window:browserWindow,navigator,URLSearchParams,setTimeout(fn,delay=0){if(!options.enableTimers)return;const id=++timerSequence;timers.set(id,{id,fn,due:now+Math.max(0,delay)});return id;},clearTimeout(id){timers.delete(id);},require:name=>name==='react'?hooks:name==='./data'?data:name==='./retention'?retention:name==='./styles.css'?{}:require(name)});
 const render=()=>{
  let tree,passes=0;
  do{
   assert(passes++<30,'Render effects did not settle');cursor=0;effectCursor=0;dirty=false;pendingEffects.length=0;
   tree=module.exports.default();
   if(options.enableTimers){mounted=true;for(const effect of pendingEffects)effect();}
   else if(!mounted){mounted=true;for(const effect of effects)effect();}
  }while(options.enableTimers&&dirty);
  return tree;
 };
 const advanceTo=target=>{
  assert(target>=now);render();let runs=0;
  while(true){const timer=[...timers.values()].filter(t=>t.due<=target).sort((a,b)=>a.due-b.due||a.id-b.id)[0];if(!timer)break;assert(runs++<10000);now=timer.due;timers.delete(timer.id);timer.fn();render();}
  now=target;render();
 };
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
 return {state,g,copiedLinks,events,browserWindow,advanceTo,timers,find,button,click,aria,select,option,text,label,choose,start,create,submit,now:()=>now,at:value=>{now=value;}};
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
 joinMember(a,'Ben');a.click('Menu');a.aria('Add '+data.MENU.find(m=>m.id===1).name);a.click('Add to order · $6.30');a.click('View my order · $6.30');
 assert(a.text().includes('55 Cherish points'));assert(a.text().includes('Advance bonus eligible: 10% extra points'));
 a.click('Group');joinMember(a,'Calvin');joinMember(a,'Dylan');a.click('My order1');assert(a.text().includes('55 Cherish points'));
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

function personalOrder(a,q=1,confirm=true){
 a.click('Menu');a.aria('Add '+data.MENU.find(m=>m.id===1).name);
 for(let i=1;i<q;i++)a.find(n=>n.type==='button'&&n.props.children==='+'&&!n.props['aria-label']).props.onClick();
 a.click('Add to order · $'+(6.3*q).toFixed(2));a.click('View my order · $'+(6.3*q).toFixed(2));a.click('Submit my order');if(confirm)a.click('Confirm payment method');
}
const cardButton=(a,id,method)=>a.find(n=>n.type==='button'&&n.props.className?.startsWith('opt ')&&JSON.stringify(n.props.children).includes('Card ending '+data.SAVED_CARDS[id].find(c=>c.id===method).last4));
const switchUser=(a,name)=>{a.aria('Switch demo user');a.click(name);};

test('Ben recovers with his alternative card; failure charges nobody and retry charges each person once',()=>{
 const a=app();a.start();a.choose(5);a.create();joinMember(a,'Ben');joinMember(a,'Calvin');const initial=a.state[6].map(p=>p.pts);
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

const noOtherCards=(a,owner)=>{
 for(const user of [0,1,2])if(user!==owner)for(const card of data.SAVED_CARDS[user])assert(!a.text().includes('Card ending '+card.last4),'Leaked card '+card.last4+' to '+owner);
};
function paymentTrio(){
 const a=app();a.start();a.choose(5);a.create();joinMember(a,'Ben');joinMember(a,'Calvin');personalOrder(a);
 switchUser(a,'Ben');a.click('Order');personalOrder(a);switchUser(a,'Calvin');a.click('Order');personalOrder(a);
 switchUser(a,'Mary Ng (organiser)');a.click('Order');a.click('Status');return a;
}

test('only Mary and Ben can see his missing payment method and targeted reminder',()=>{
 const a=paymentTrio();a.state[6]=a.state[6].map(p=>p.id===1?{...p,pmeth:null}:p);
 const row=a.find(n=>n.props.className==='card click'&&a.label(n).includes('Ben'));
 assert(a.label(row).includes('Payment method needed'));noOtherCards(a,0);
 a.button('Remind').props.onClick({stopPropagation(){}});const reminder=a.state[10].find(n=>n.t.includes('choose a payment method before'));assert.deepEqual(Array.from(reminder.to),[1]);
 switchUser(a,'Calvin');a.click('Order');a.click('Status');assert(!a.text().includes('Payment method needed'));assert(!a.text().includes('choose a payment method before'));noOtherCards(a,2);
 a.aria('Notifications');assert(!a.text().includes('choose a payment method before'));noOtherCards(a,2);
 switchUser(a,'Ben');a.click('Order');a.click('Status');assert(a.text().includes('Payment method needed'));a.aria('Notifications');assert(a.text().includes('choose a payment method before'));noOtherCards(a,1);
});

test('Ben decline and recovery stay private across screens, toasts, notifications and receipts',()=>{
 const a=paymentTrio();a.click('Close ordering early');a.click('Close ordering');a.state[7]={...a.g(),failFor:[1]};a.click('Send group order to outlet');
 assert(a.text().includes('Payment declined for Ben'));noOtherCards(a,0);
 const failure=a.state[10].find(n=>n.t.includes('Card ending 2222 was declined'));assert.deepEqual(Array.from(failure.to),[1]);
 const overview=a.state[10].find(n=>n.t.startsWith('Payment declined for Ben'));assert.deepEqual(Array.from(overview.to),[0]);
 a.aria('Notifications');assert(a.text().includes('Payment declined for Ben'));noOtherCards(a,0);
 // Switching occurs immediately: the mock clock never dismisses toasts or pushes.
 switchUser(a,'Calvin');for(const screen of ['home','group','track','cart','wallet','notifs']){
  a.state[0]=screen;assert(!a.text().includes('Payment declined for Ben'));assert(!a.text().includes('Ben needs to choose'));assert(!a.text().includes('was declined'));noOtherCards(a,2);
 }
 switchUser(a,'Ben');a.click('Order');a.click('Status');assert(a.text().includes('Your payment was declined'));assert(!a.text().includes('Payment declined for Ben'));noOtherCards(a,1);
 a.aria('Notifications');assert(a.text().includes('Card ending 2222 was declined'));noOtherCards(a,1);
 a.click('Pay');a.click('Choose payment method');cardButton(a,1,'backup').props.onClick();a.click('Confirm payment method');
 const recovered=a.state[10].find(n=>n.t.startsWith('Ben chose a new payment method'));assert.deepEqual(Array.from(recovered.to),[0]);
 switchUser(a,'Calvin');a.aria('Notifications');assert(!a.text().includes('Ben chose a new payment method'));assert(!a.text().includes('was declined'));noOtherCards(a,2);
 switchUser(a,'Mary Ng (organiser)');a.click('Order');a.click('Status');
 const row=a.find(n=>n.props.className==='card click'&&a.label(n).includes('Ben'));assert(a.label(row).includes('Payment ready'));assert(!a.text().includes('Payment declined for Ben'));noOtherCards(a,0);a.click('Send group order to outlet');
 for(const n of a.state[10].filter(n=>n.t.startsWith('You were charged'))){assert.equal(n.to.length,1);assert(n.t.includes('Card ending '+(n.to[0]===1?'8018':data.CARD_LAST4[n.to[0]])));}
 a.aria('Switch demo user');a.click('Advance order status (outlet)');a.click('Mark as collected');
 for(const [name,id]of [['Mary Ng (organiser)',0],['Ben',1],['Calvin',2]]){
  switchUser(a,name);a.click('Pay');noOtherCards(a,id);a.state[0]='repeat';a.click('Details');noOtherCards(a,id);
 }
});

test('demo payment controls expose only the current participant and clear previous payment UI state',()=>{
 const a=paymentTrio();a.state[16]='Previous private payment error';a.state[20]={amt:99,meth:'Card ending 2222'};
 switchUser(a,'Calvin');assert.equal(a.state[16],'');assert.equal(a.state[20],null);a.aria('Switch demo user');
 assert(!a.text().includes('Others submit their orders'));
 const controls=a.find(n=>n.props.className==='chips'&&a.label(n)==='Calvin');assert.equal(a.label(controls),'Calvin');
 switchUser(a,'Mary Ng (organiser)');a.aria('Switch demo user');assert(a.text().includes('Others submit their orders'));
 const all=a.find(n=>n.props.className==='chips'&&a.label(n)==='Mary Ng (organiser)BenCalvin');assert(a.label(all).includes('Ben'));
});

function joinMember(a,name){
 const screen=a.state[0];a.state[0]='group';a.aria('Invite '+name);
 switchUser(a,name);a.click('Order');a.click('View invitation');a.click('Join group');
 switchUser(a,'Mary Ng (organiser)');a.state[0]=screen;
}

const visitInvite=(a,key=a.g().inviteKey)=>{a.browserWindow.location.hash='#invite='+encodeURIComponent(key);a.events.hashchange();};
const basicGroup=()=>{const a=app();a.start();a.choose(5);a.create();return a;};

test('named invitations require the intended account to join, while outsiders cannot join',()=>{
 const a=basicGroup();a.aria('Invite Ben');assert(a.g().invitedIds.includes(1));assert.equal(a.state[6][1].in,0);assert.equal(a.state[6].filter(p=>p.in).length,1);
 switchUser(a,'Calvin');visitInvite(a);assert(a.text().includes('This account has not been invited'));assert(a.button('Join group').props.disabled);a.button('Join group').props.onClick();assert.equal(a.state[6][2].in,0);assert(!a.text().includes(a.g().name));assert(!a.text().includes('Ordering closes at'));assert(!a.text().includes(a.g().slot));
 switchUser(a,'Ben');visitInvite(a);assert(a.text().includes('Mary Ng invited you to'));a.click('Join group');assert.equal(a.state[6][1].in,1);
 visitInvite(a);assert(a.text().includes('already joined'));a.button('Join group').props.onClick();assert.equal(a.state[6].filter(p=>p.in).length,2);
});

test('saved groups invite only their own members without auto-joining anyone',()=>{
 const a=app();a.start();a.aria('Back');a.click('Project Team');a.click('Next: choose pickup');a.choose(5);a.create();
 assert.deepEqual(Array.from(a.g().invitedIds),[2,4]);assert.equal(a.state[6].filter(p=>p.in).length,1);
 switchUser(a,'Ben');visitInvite(a);assert(a.text().includes('has not been invited'));assert(a.button('Join group').props.disabled);
 switchUser(a,'Calvin');visitInvite(a);a.click('Join group');assert.equal(a.state[6][2].in,1);assert.equal(a.state[6][4].in,0);
});

test('leaving permits rejoining, but removal revokes access until a new invitation',()=>{
 const a=basicGroup();joinMember(a,'Ben');switchUser(a,'Ben');a.click('Order');a.click('Group');a.click('Leave group');a.find(n=>n.type==='button'&&n.props.className==='btn'&&n.props.children==='Leave group').props.onClick();
 assert.equal(a.state[6][1].in,0);assert(a.g().invitedIds.includes(1));visitInvite(a);a.click('Join group');assert.equal(a.state[6][1].in,1);
 switchUser(a,'Mary Ng (organiser)');a.click('Order');a.click('Group');a.click('Remove');a.find(n=>n.type==='button'&&n.props.className==='btn'&&n.props.children==='Remove').props.onClick();
 assert(!a.g().invitedIds.includes(1));switchUser(a,'Ben');visitInvite(a);assert(a.text().includes('You were removed'));a.button('Join group').props.onClick();assert.equal(a.state[6][1].in,0);
 switchUser(a,'Mary Ng (organiser)');a.click('Order');a.click('Group');a.aria('Invite Ben');switchUser(a,'Ben');visitInvite(a);a.click('Join group');assert.equal(a.state[6][1].in,1);
});

test('full invitations require space and join rechecks capacity even from an earlier screen',()=>{
 const a=basicGroup();a.aria('Invite Ben');switchUser(a,'Ben');visitInvite(a);const join=a.button('Join group');
 switchUser(a,'Mary Ng (organiser)');a.click('Order');a.click('Group');joinMember(a,'Calvin');a.state[7]={...a.g(),size:2};a.text();join.props.onClick();assert.equal(a.state[6][1].in,0);
 switchUser(a,'Ben');visitInvite(a);assert(a.text().includes('This group is full'));assert(a.button('Join group').props.disabled);
 switchUser(a,'Mary Ng (organiser)');a.click('Order');a.click('Group');a.click('Change pickup time or group size');a.aria('More people');a.click('Done');switchUser(a,'Ben');visitInvite(a);a.click('Join group');assert.equal(a.state[6][1].in,1);
});

for(const [name,patch,message]of [
 ['cancelled',{cancelled:true},'This group was cancelled'],['sent',{sent:true},'already been sent'],['expired',{inv:'expired'},'invitation has expired'],['closed',{closed:true},'Ordering has closed']
])test(name+' invitations explain the problem and reject joining',()=>{
 const a=basicGroup();a.aria('Invite Ben');switchUser(a,'Ben');visitInvite(a);const join=a.button('Join group');a.state[7]={...a.g(),...patch};a.text();join.props.onClick();assert.equal(a.state[6][1].in,0);assert(a.text().includes(message));assert(a.button('Join group').props.disabled);
});

test('deadline expiry and a previous group link cannot admit a participant',()=>{
 const a=basicGroup();a.aria('Invite Ben');const oldKey=a.g().inviteKey;switchUser(a,'Ben');visitInvite(a);a.at(a.g().deadlineAt);assert(a.text().includes('Ordering has closed'));a.button('Join group').props.onClick();assert.equal(a.state[6][1].in,0);
 switchUser(a,'Mary Ng (organiser)');a.state[7]={...a.g(),cancelled:true};a.click('Home');a.click('Start Ya Kun Together');a.click('Next: choose pickup');a.choose(5);a.create();a.aria('Invite Ben');assert.notEqual(a.g().inviteKey,oldKey);
 switchUser(a,'Ben');visitInvite(a,oldKey);assert(a.text().includes('different or previous group'));assert(a.button('Join group').props.disabled);visitInvite(a);a.click('Join group');assert.equal(a.state[6][1].in,1);
});

for(const clipboard of ['success','reject','missing'])test('clipboard '+clipboard+' reports the actual result and offers a local invitation link',async()=>{
 const a=app(undefined,{clipboard});a.start();a.choose(5);a.create();await a.button('Copy link').props.onClick();
 const link=a.find(n=>n.type==='input'&&n.props.id==='invitation-link');assert(link.props.readOnly);assert(link.props.value.startsWith('http://localhost:5173/#invite='));assert(link.props.value.includes(a.g().inviteKey));
 if(clipboard==='success'){assert.equal(a.copiedLinks[0],link.props.value);assert(a.text().includes('Invitation link copied'));}
 else{assert.equal(a.copiedLinks.length,0);assert(!a.text().includes('Invitation link copied'));assert(a.text().includes('copy the link manually'));}
});

test('an invitation survives sign-in and a fresh tab explains missing mock state',()=>{
 const a=basicGroup();a.aria('Invite Ben');visitInvite(a);a.click('More');a.find(n=>n.props.className==='card row click'&&a.label(n)==='Log out').props.onClick();
 for(const [placeholder,value]of [['you@example.com','ben@yakun.demo'],['Password','kaya1234']])a.find(n=>n.props.placeholder===placeholder).props.onChange({target:{value}});
 a.click('Log in');assert(a.text().includes('Mary Ng invited you'));a.click('Join group');assert.equal(a.state[6][1].in,1);
 const fresh=app(undefined,{hash:'#invite='+a.g().inviteKey});
 for(const [placeholder,value]of [['you@example.com','ben@yakun.demo'],['Password','kaya1234']])fresh.find(n=>n.props.placeholder===placeholder).props.onChange({target:{value}});
 fresh.click('Log in');assert(fresh.text().includes('not available in this demo tab'));assert(fresh.button('Join group').props.disabled);
});

const autoReminders=a=>a.state[10].filter(n=>n.t.startsWith('Ordering closes soon.')||n.t.startsWith('Ordering is closed. Confirm'));
function timedGroup(){const a=app(undefined,{enableTimers:true});a.start();a.choose(5);a.create();return a;}
function missingPaymentGroup(){
 const a=timedGroup();joinMember(a,'Ben');joinMember(a,'Calvin');a.aria('Invite Dylan');
 switchUser(a,'Ben');a.click('Order');personalOrder(a,1,false);
 switchUser(a,'Calvin');a.click('Order');personalOrder(a);
 switchUser(a,'Mary Ng (organiser)');a.click('Order');a.click('Group');return a;
}

test('two-minute timers target non-submitters and missing methods without reminding ready or unjoined people',()=>{
 const a=missingPaymentGroup(),due=a.g().deadlineAt-2*minute;
 a.advanceTo(due-1);assert.equal(autoReminders(a).length,0);a.advanceTo(due);
 const reminders=autoReminders(a);assert.equal(reminders.length,2);
 assert.deepEqual(Array.from(reminders.find(n=>n.t.includes('Submit your order')).to),[0]);
 assert.deepEqual(Array.from(reminders.find(n=>n.t.includes('Confirm your payment method')).to),[1]);
 assert(!reminders.some(n=>n.to.some(id=>id===2||id===3||id===4)));
 for(const name of ['Ben','Calvin','Mary Ng (organiser)'])switchUser(a,name);
 a.advanceTo(due+minute);assert.equal(autoReminders(a).length,2);
 switchUser(a,'Calvin');a.aria('Notifications');assert(!a.text().includes('Confirm your payment method'));assert(!a.text().includes('Submit your order'));
 switchUser(a,'Ben');a.aria('Notifications');assert(a.text().includes('Confirm your payment method'));assert(!a.text().includes('Submit your order'));
});

test('late submission gets a payment reminder once and readying a card stops further reminders',()=>{
 const a=timedGroup();joinMember(a,'Ben');switchUser(a,'Ben');a.advanceTo(a.g().deadlineAt-2*minute);
 assert.equal(autoReminders(a).filter(n=>n.to.includes(1)&&n.t.includes('Submit your order')).length,1);
 a.click('Order');personalOrder(a,1,false);a.text();
 assert.equal(autoReminders(a).filter(n=>n.to.includes(1)&&n.t.includes('Confirm your payment method')).length,1);
 a.click('Confirm payment method');a.text();const count=autoReminders(a).length;
 a.advanceTo(a.g().deadlineAt+minute);assert.equal(autoReminders(a).length,count);assert(a.g().closed);
 assert.equal(a.state[8],null); // Deadline popup belongs to the organiser, not the current participant.
});

test('closing early reminds missing payers immediately; manual reminders stay targeted',()=>{
 const a=missingPaymentGroup();a.click('Status');a.button('Remind').props.onClick({stopPropagation(){}});
 const manual=a.state[10].find(n=>n.t.startsWith('Mary Ng sent you a reminder: choose a payment method'));
 assert.deepEqual(Array.from(manual.to),[1]);assert.equal(autoReminders(a).length,0);
 a.click('Close ordering early');a.click('Close ordering');a.text();
 assert.equal(autoReminders(a).length,1);assert.deepEqual(Array.from(autoReminders(a)[0].to),[1]);
 assert(autoReminders(a)[0].t.startsWith('Ordering is closed.'));a.advanceTo(a.g().deadlineAt+minute);assert.equal(autoReminders(a).length,1);
});

test('extension creates one new reminder window and old timers cannot close or remind the extended group',()=>{
 const a=missingPaymentGroup(),oldDeadline=a.g().deadlineAt,oldDue=oldDeadline-2*minute;
 const oldClose=[...a.timers.values()].find(t=>t.due===oldDeadline).fn;
 const oldReminder=[...a.timers.values()].find(t=>t.due===oldDue).fn;
 a.advanceTo(oldDue);assert.equal(autoReminders(a).length,2);a.click('Extend 15 minutes');a.text();const extended=a.g().deadlineAt;
 oldReminder();a.text();assert.equal(autoReminders(a).length,2);
 a.advanceTo(oldDeadline);oldClose();a.text();assert(!a.g().closed);
 a.advanceTo(extended-2*minute);assert.equal(autoReminders(a).filter(n=>n.to.includes(1)&&n.t.includes('Confirm your payment method')).length,2);
 a.advanceTo(extended);assert(a.g().closed);assert.equal(a.state[10].filter(n=>n.t==='Ordering closed: time is up').length,1);
});

for(const ending of ['cancelled','sent'])test('stale reminder and closure timers do nothing after '+ending,()=>{
 const a=timedGroup(),deadline=a.g().deadlineAt;
 const old=[...a.timers.values()].filter(t=>t.due===deadline||t.due===deadline-2*minute).map(t=>t.fn);
 if(ending==='cancelled'){a.click('Cancel group order');a.find(n=>n.type==='button'&&n.props.className==='btn'&&n.props.children==='Cancel group order').props.onClick();}
 else{a.submit();a.click('Send group order to outlet');}
 a.text();for(const callback of old)callback();a.text();a.advanceTo(deadline+minute);
 assert.equal(autoReminders(a).length,0);assert.equal(a.state[10].filter(n=>n.t==='Ordering closed: time is up').length,0);assert(a.g()[ending]);
});

test('stale timers from a cancelled group cannot affect its replacement',()=>{
 const a=timedGroup(),deadline=a.g().deadlineAt;
 const old=[...a.timers.values()].filter(t=>t.due===deadline||t.due===deadline-2*minute).map(t=>t.fn);
 a.click('Cancel group order');a.find(n=>n.type==='button'&&n.props.className==='btn'&&n.props.children==='Cancel group order').props.onClick();
 a.advanceTo(a.now()+minute);a.click('Home');a.click('Start Ya Kun Together');a.click('Next: choose pickup');a.choose(5);a.create();
 a.advanceTo(deadline);const before=autoReminders(a).length;for(const callback of old)callback();a.text();assert.equal(autoReminders(a).length,before);assert(!a.g().closed);
});

test('zero-pay orders, departed members and decline recovery do not get redundant automatic payment reminders',()=>{
 const a=missingPaymentGroup();
 // A zero-price submitted mock order requires no card, and a departed participant is no longer a recipient.
 a.state[6]=a.state[6].map(p=>p.id===1?{...p,items:[],sub:{items:[],rw:null},pmeth:null}:p.id===2?{...p,in:0,pmeth:null}:p);a.text();
 a.advanceTo(a.g().deadlineAt-2*minute);assert(!autoReminders(a).some(n=>n.to.includes(1)||n.to.includes(2)));
 const b=timedGroup();personalOrder(b);b.click('Status');b.click('Close ordering early');b.click('Close ordering');b.state[7]={...b.g(),failFor:[0]};b.click('Send group order to outlet');b.text();
 assert.equal(autoReminders(b).length,0);assert(b.state[10].some(n=>n.t.includes('was declined. Choose another saved card')));
});

test('deadline expiration does not open the organiser popup on the logged-out screen',()=>{
 const a=timedGroup();a.click('More');a.find(n=>n.props.className==='card row click'&&a.label(n)==='Log out').props.onClick();a.text();
 a.advanceTo(a.g().deadlineAt);assert(a.g().closed);assert.equal(a.state[8],null);assert(a.text().includes('Log in'));
});

test('joining disclosure appears before acceptance and marketing stays optional and unticked',()=>{
 const a=basicGroup();a.aria('Invite Ben');switchUser(a,'Ben');visitInvite(a);
 assert(a.text().includes('Before you join'));assert(a.text().includes('card-specific messages stay private'));
 const check=a.find(n=>n.type==='input'&&n.props.type==='checkbox');assert.equal(check.props.checked,false);a.click('Join group');assert.equal(a.state[6][1].marketingOptIn,false);assert(a.state[6][1].marketingUpdatedAt>0);
});
test('marketing opt-in is explicit, isolated by account and can be withdrawn',()=>{
 const a=basicGroup();a.aria('Invite Ben');a.aria('Invite Calvin');switchUser(a,'Ben');visitInvite(a);
 a.find(n=>n.type==='input'&&n.props.type==='checkbox').props.onChange({target:{checked:true}});a.click('Join group');assert(a.state[6][1].marketingOptIn);
 switchUser(a,'Calvin');visitInvite(a);assert.equal(a.find(n=>n.type==='input'&&n.props.type==='checkbox').props.checked,false);assert.equal(a.state[6][2].marketingOptIn,false);
 switchUser(a,'Ben');a.click('More');a.find(n=>n.props.className==='card row click'&&a.label(n)==='Privacy and data').props.onClick();assert(a.find(n=>n.type==='input'&&n.props.type==='checkbox').props.checked);
 a.find(n=>n.type==='input'&&n.props.type==='checkbox').props.onChange({target:{checked:false}});assert.equal(a.state[6][1].marketingOptIn,false);
});

test('retention expires at seven inactive days and preserves recent unrelated records',()=>{
 const now=Date.parse('2026-11-16T09:00:00+08:00'),old={id:'old',lastActivityAt:now-retention.RETENTION_MS},recent={id:'recent',lastActivityAt:now-1};
 assert(retention.expired(old,now));assert(!retention.expired(old,now-1));const kept=retention.pruneInactive([old,recent],now);assert.deepEqual(kept,[recent]);
});
test('leaving a reused saved group removes only related membership and retains earlier receipts',()=>{
 const a=app();a.start();a.aria('Back');a.click('Project Team');a.click('Next: choose pickup');a.choose(5);a.create();
 const older=a.state[14].find(h=>h.orders[2]),other=a.state[12].find(s=>s.name==='Marketing Team');
 switchUser(a,'Calvin');visitInvite(a);a.click('Join group');a.click('Group');a.click('Leave group');a.find(n=>n.type==='button'&&n.props.className==='btn'&&n.props.children==='Leave group').props.onClick();
 assert(!a.state[12].find(s=>s.name==='Project Team').members.includes('Calvin'));assert(a.state[12].find(s=>s.name==='Project Team').members.includes('Eve'));assert(a.state[12].find(s=>s.id===other.id).members.includes('Calvin'));
 assert(a.state[14].find(h=>h.id===older.id).orders[2]);assert.equal(a.state[6][2].items.length,0);assert.equal(a.state[6][2].pmeth,null);
});
test('saved groups can only be renamed by their owner',()=>{
 const a=basicGroup();joinMember(a,'Ben');switchUser(a,'Ben');a.state[0]='repeat';assert(!a.text().includes('Rename'));assert(!a.text().includes('Project Team'));
 switchUser(a,'Mary Ng (organiser)');a.state[0]='repeat';assert(a.text().includes('Rename'));
});
test('opening history renews activity without extending unrelated records',()=>{
 const a=app(undefined,{enableTimers:true});a.start();a.state[0]='repeat';const origin=a.now(),target=a.state[14][0].id;
 a.advanceTo(origin+6*24*60*minute);a.click('Details');a.state[8]=null;a.advanceTo(origin+7*24*60*minute);
 assert(a.state[14].some(h=>h.id===target));assert.equal(a.state[14].length,1);assert.equal(a.state[12].length,0);
 a.advanceTo(origin+13*24*60*minute);assert.equal(a.state[14].length,0);
});
test('completed live history expires without losing point balance or reusing a charged group id',()=>{
 const a=timedGroup();a.submit();a.click('Send group order to outlet');a.aria('Switch demo user');a.click('Advance order status (outlet)');a.click('Mark as collected');
 const paidGroup=a.g().gid,balance=a.state[6][0].pts;a.advanceTo(a.now()+retention.RETENTION_MS);assert(!a.g().live);assert.equal(a.state[6][0].pts,balance);assert.equal(a.state[6][0].items.length,0);
 a.click('Home');a.click('Start Ya Kun Together');a.click('Next: choose pickup');a.choose(5);a.create();assert.notEqual(a.g().gid,paidGroup);a.submit();a.click('Send group order to outlet');assert(a.g().sent);
});

test('report journey covers customisation, personal rewards/cards, consolidation, points and saved reuse',()=>{
 const a=basicGroup();a.click('Change pickup time or group size');a.click('Advance order');a.select('change-pickup',a.g().slotTimes[6]);a.click('Done');joinMember(a,'Ben');joinMember(a,'Calvin');personalOrder(a);
 switchUser(a,'Ben');a.click('Order');a.click('Menu');a.aria('Add '+data.MENU.find(m=>m.id===1).name);a.select('set-drink','Iced Milo (Regular)');a.click('Less sweet');a.find(n=>n.type==='button'&&n.props.children==='+'&&!n.props['aria-label']).props.onClick();a.click('Add to order · $15.20');a.click('View my order · $15.20');a.click('View eligible rewards');a.find(n=>n.props.className?.startsWith('opt ')&&n.props.onClick&&JSON.stringify(n.props.children).includes('$2 off')).props.onClick();a.click('Submit my order');cardButton(a,1,'backup').props.onClick();a.click('Confirm payment method');
 switchUser(a,'Calvin');a.click('Order');a.select('menu-category','Hot beverages');a.aria('Add Coffee');a.click('Kosong');a.click('Add to order · $2.20');a.click('View my order · $2.20');a.click('Submit my order');a.click('Confirm payment method');
 switchUser(a,'Mary Ng (organiser)');a.click('Order');a.click('Status');assert(a.text().includes('$21.70'));assert(a.state[6].slice(0,3).every(p=>p.paidAmt===0));a.click('Close ordering early');a.click('Close ordering');a.click('Send group order to outlet');assert(a.text().includes('Who gets what'));assert(a.text().includes('Iced Milo'));assert(a.text().includes('Less sweet')||a.text().includes('less sweet'));assert.deepEqual(a.state[6].slice(0,3).map(p=>p.paidAmt),[6.3,13.2,2.2]);
 a.aria('Switch demo user');a.click('Advance order status (outlet)');a.click('Mark as collected');assert.deepEqual(a.state[6].slice(0,3).map(p=>p.earned),[55,116,19]);a.click('Save this group');a.click('View order history');a.click('Reuse group');a.click('Next: choose pickup');a.choose(5);a.create();assert.deepEqual(Array.from(a.g().invitedIds),[1,2]);assert.equal(a.state[6].filter(p=>p.in).length,1);
});
test('draft edits remain private until Update my order publishes them',()=>{
 const a=basicGroup();personalOrder(a);a.click('My order1');a.find(n=>n.type==='button'&&n.props.children==='+'&&!n.props['aria-label']).props.onClick();assert.equal(data.sum(a.state[6][0].items),12.6);assert.equal(data.sum(a.state[6][0].sub.items),6.3);a.click('Status');assert(a.text().includes('$6.30'));a.click('My order1');a.click('Update my order');assert.equal(data.sum(a.state[6][0].sub.items),12.6);
});
test('unavailable Milo prevents sending and replacing it with coffee recovers the order',()=>{
 const a=basicGroup();a.click('Menu');a.select('menu-category','Hot beverages');a.aria('Add Milo');a.click('Add to order · $2.60');a.click('View my order · $2.60');a.click('Submit my order');a.click('Confirm payment method');a.aria('Switch demo user');a.click('Milo becomes unavailable');a.click('Status');a.click('Close ordering early');a.click('Close ordering');assert(a.button('Send group order to outlet').props.disabled);assert(a.text().includes('Unavailable items'));
 a.click('Group');a.click('Extend 15 minutes');a.click('My order1');a.find(n=>n.type==='button'&&n.props.children==='−').props.onClick();a.click('Menu');a.aria('Add Coffee');a.click('Add to order · $2.20');a.click('View my order · $2.20');a.click('Update my order');a.click('Status');a.click('Close ordering early');a.click('Close ordering');a.click('Send group order to outlet');assert(a.g().sent);assert.equal(a.state[6][0].paidAmt,2.2);
});
test('cancellation after actual deadline expiry clears submitted food and prevents sending',()=>{
 const a=timedGroup();personalOrder(a);a.advanceTo(a.g().deadlineAt);assert(a.g().expired);a.click('Cancel group order');a.find(n=>n.type==='button'&&n.props.className==='btn'&&n.props.children==='Cancel group order').props.onClick();assert(a.g().cancelled);assert.equal(a.state[6][0].sub,null);assert.equal(a.state[6][0].items.length,0);assert.equal(a.state[6][0].paidAmt,0);
});
