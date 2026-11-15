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
 a.choose(8);a.create();const slot=a.g().slot,slotAt=a.g().slotMs[8];assert(slot.includes('17 Nov'));
 a.submit();const min=mode==='advance'?120:15;
 a.at(slotAt-min*minute+1);assert(a.button('Send group order to outlet').props.disabled);
 // Even a previously rendered enabled handler must check the current time.
 a.at(slotAt-min*minute);const send=a.button('Send group order to outlet');assert(!send.props.disabled);
 a.at(slotAt-min*minute+1);send.props.onClick();assert(!a.g().sent);
 a.at(slotAt-min*minute);a.click('Send group order to outlet');assert(a.g().sent);assert.equal(a.g().slot,slot);assert(a.text().includes('(locked)'));
 assert(!a.text().includes('Change pickup time or group size'));
 a.aria('Switch demo user');a.click('Advance order status (outlet)');a.click('Mark as collected');a.click('View order history');a.click('Details');
 assert(a.text().includes(slot));assert(a.text().includes(mode==='advance'?'Advance order':'Pickup'));
 a.state[8]=null;a.click('Start new order');const history=a.state[14][0];assert.equal(history.collectionMode,mode);assert.equal(history.slot,slot);
 assert.equal(history.advanceQualified,mode==='advance');
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
