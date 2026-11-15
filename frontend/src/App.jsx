import {useState,useEffect,useRef} from 'react';
import {$,sum,tm,MENU,CATEGORIES,SET_DRINKS,itemPrice,repriceItem,OUTLET_CAPS,QUICK_SLOT_COUNT,slotLabel,makeSlotMs,REWARDS,HIST0,SAVED0,USERS0,DEMO_ORDERS,MAXSIZE,CARD_LAST4,ACCOUNTS} from './data';
import './styles.css';

// NOTE: state is local and mocked. Data comes from ./data.js.
// Open the gear button (top right of the phone) to switch between organiser and participant views and to trigger error states.

const pointsFor = v => Math.floor(Math.round(v*100)*8/100);
const TOAST_MS = 1000;   // every pop-up message disappears after 1 second
// Payment methods a person can pick. Picking one does NOT charge anything; the charge happens when the organiser sends the order.
const METHODS = ['card'];   // Ya Kun only supports its card payment
const mName = (id,u) => 'Card ending '+CARD_LAST4[u];
const STAT = {preparing:'Being prepared',ready:'Ready for collection',collected:'Collected'};
const fdt = ms => new Date(ms).toLocaleDateString([],{weekday:'short',day:'numeric',month:'short',year:'numeric'})+' · '+tm(ms);
const IC={
 back:<path d="M15 5l-7 7 7 7"/>, chev:<path d="M9 5l7 7-7 7"/>,
 home:<><path d="M3 11l9-8 9 8"/><path d="M5 9.5V21h14V9.5"/></>,
 order:<><path d="M5 8h14l-1 13H6L5 8z"/><path d="M9 8V6a3 3 0 016 0v2"/></>,
 pay:<><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10.5h18M7 15h3"/></>,
 rewards:<><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M5 12v9h14v-9"/><path d="M12 8c-1-3.5-5-3.5-4.5-1 .3 1.5 3 1 4.5 1zM12 8c1-3.5 5-3.5 4.5-1-.3 1.5-3 1-4.5 1z"/></>,
 more:<><circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/></>,
 bell:<><path d="M6 16v-5a6 6 0 0112 0v5l1.5 2h-15L6 16z"/><path d="M10 21h4"/></>,
 gear:<><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></>,
 star:<path d="M12 3l2.7 5.6 6.2.9-4.5 4.3 1.1 6.1L12 17l-5.5 2.9 1.1-6.100L3.1 9.500l6.2-.9L12 3z"/>,
 check:<><circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/></>,
 clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
 pin:<><path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></>,
 card:<><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10.5h18M7 15h3"/></>,
 receipt:<><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z"/><path d="M9 8h6M9 12h6"/></>,
 lock:<><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></>,
 alert:<><path d="M12 3l10 18H2L12 3z"/><path d="M12 10v5M12 18h.01"/></>,
 mail:<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></>,
 users:<><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6"/><path d="M16 5a3.5 3.5 0 010 7M18 14c2.5.7 4 2.7 4 6"/></>,
 door:<path d="M14 4h5v16h-5M4 12h11M8 8l-4 4 4 4"/>,
 toast:<path d="M5 10a3 3 0 013-3h1.500a2.5 2.5 0 015 0H16a3 3 0 013 3 2 2 0 01-1 1.700V20H6v-8.300A2 2 0 015 10z"/>,
 cup:<><path d="M5 8h11v6a5 5 0 01-5 5h-1a5 5 0 01-5-5V8z"/><path d="M16 10h2a2 2 0 010 4h-2M8 3v2M12 3v2"/></>,
 egg:<path d="M12 3c-3.5 0-6.5 6-6.5 10a6.5 6.5 0 0013 0C18.5 9 15.5 3 12 3z"/>};
const Icon = ({n,s=20}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{IC[n]}</svg>;
const MenuImage = ({item}) => {
 if(!item.photo)return <Icon n={item.e} s={28}/>;
 const {src,x,y,size}=item.photo;
 return <span className="menu-photo"><img src={src} alt={item.name} loading="lazy" style={{width:(588/size*100)+'%',left:-(x/size*100)+'%',top:-(y/size*100)+'%'}}/></span>;
};
function PickupChoices({times,selected,available,onPick,id,mode='pickup'}){
 const later=times.slice(QUICK_SLOT_COUNT);
 return <>
  {mode==='pickup'&&<div className="chips">{times.slice(0,QUICK_SLOT_COUNT).map(t=><button key={t} disabled={!available(t)} className={'chip '+(selected===t&&available(t)?'on':'')} onClick={()=>onPick(t)}>{t}</button>)}</div>}
  <label className="l" htmlFor={id}>Choose a later time</label>
  <select id={id} className="menu-select" value={later.includes(selected)?selected:''} onChange={e=>onPick(e.target.value)}>
   <option value="" disabled>Select a later collection time</option>
   {later.map(t=><option key={t} value={t} disabled={!available(t)}>{t}{available(t)?'':' (unavailable)'}</option>)}
  </select>
 </>;
}
const fmt = ms => { const s = Math.max(0,Math.ceil(ms/1000)); return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0'); };
const sgt = () => new Intl.DateTimeFormat('en-SG',{timeZone:'Asia/Singapore',hour:'numeric',minute:'2-digit'}).format(new Date());
const Tag = ({c,children}) => <span className={'tag '+(c||'')}>{children}</span>;
const Ban = ({c,children}) => <div className={'ban '+(c||'')}>{children}</div>;
function Clock(){
 const [t,setT]=useState(sgt);
 useEffect(()=>{const id=setInterval(()=>setT(sgt()),1000);return()=>clearInterval(id)},[]);
 return <div className="status"><span>{t} SGT</span></div>;
}
function TimerBar({deadlineAt,closed}){
 const [left,setLeft]=useState(()=>deadlineAt-Date.now());
 useEffect(()=>{setLeft(deadlineAt-Date.now());const id=setInterval(()=>setLeft(deadlineAt-Date.now()),1000);return()=>clearInterval(id)},[deadlineAt]);
 if(closed) return <div className="timer off"><Icon n="clock" s={20}/><span className="sp">Ordering is closed</span></div>;
 return <div className={'timer '+(left<=120000?'low':'')}><Icon n="clock" s={20}/><span className="sp">Ordering closes at {tm(deadlineAt)}</span><b>{fmt(Math.max(0,left))}</b></div>;
}
function ClosesIn({target}){
 const [left,setLeft]=useState(()=>target-Date.now());
 useEffect(()=>{setLeft(target-Date.now());const id=setInterval(()=>setLeft(target-Date.now()),1000);return()=>clearInterval(id)},[target]);
 return <>{' · closes in '+fmt(Math.max(0,left))}</>;
}
// "As served" is only an internal default for items with no choices (toast, eggs). Never show it to people.
const optTxt = o => (o && o !== 'As served') ? o : '';
const itemLine = i => i.name + (optTxt(i.o) ? ' (' + optTxt(i.o) + ')' : '') + (i.q > 1 ? ' ×' + i.q : '');
// A "free" reward (e.g. Free kopi) ADDS an item at $0.00. It is not a price deduction.
const freeOf = p => { const r = REWARDS.find(x => x.id === p.rw); return r && r.free ? r : null; };
const freeTxt = p => freeOf(p) ? 'Free ' + freeOf(p).free + ' (reward)' : '';
const lines = p => p.items.map(itemLine).concat(freeOf(p) ? [freeTxt(p)] : []).join(' + ');
// "Still choosing" only fits someone who already has items; a person who was just added has not started yet.
const waitText = p => p.items.length ? 'Still choosing' : 'Not ordered yet';
const blank = p => ({...p,items:[],sub:null,paid:0,paidAmt:0,paidMeth:'',pmeth:null,payFail:0,rw:null,earned:0,left:0,in:p.org?1:0});
const submitted = p => p.sub ? {...p,...p.sub} : p;
const G0 = {gid:'YT1024',coll:'C-042',sentAt:0,name:'Marketing Breakfast',win:10,deadline:'',deadlineAt:0,oi:0,slot:'',slotTimes:[],size:5,pay:'individual',live:false,closed:false,expired:false,cancelled:false,reminded:false,sent:false,status:'',inv:'valid',failFor:[],sold:[],slotGone:false,slotMs:[],collectionMode:'pickup',advanceQualified:false,advanceQualifiedAt:0,advanceDeadlineAt:0,advanceSlotAt:0};
// n = how many group orders this session has already finished, so every new group gets its own order id and collection number.
const slotSet = (win=10) => {
 const now=Date.now(),ms=makeSlotMs(now);
 // ASAP includes the ordering window and at least 15 minutes for preparation.
 ms[0]=Math.ceil((now+win*60000)/300000)*300000+15*60000;
 return {slotMs:ms,slotTimes:ms.map(slotLabel)};
};
const freshG = (n=0) => ({...G0, gid:'YT'+(1024+n), coll:'C-'+String(42+n).padStart(3,'0'), ...slotSet()});

function App(){
 const [scr,setScr]=useState('login');
 const [uid,setUid]=useState(0);
 const [idf,setIdf]=useState('');
 const [pwd,setPwd]=useState('');
 const [showPw,setShowPw]=useState(false);
 const [loginErr,setLoginErr]=useState('');
 const [P,setP]=useState(USERS0);
 const [g,setG]=useState(freshG);
 const [sheet,setSheet]=useState(null);
 const [cat,setCat]=useState('Sets');
 const [notes,setNotes]=useState([]);
 const [toast,setToast]=useState('');
 const [saved,setSaved]=useState(SAVED0);
 const [preset,setPreset]=useState([]);   // names invited from a saved group; empty = brand-new team, organiser adds people later
 const [hist,setHist]=useState(HIST0);
 const [ren,setRen]=useState(null);
 const [err,setErr]=useState('');
 const [open,setOpen]=useState(null);
 const [pm,setPm]=useState('me');
 const [sel,setSel]=useState('card');
 const [receipt,setReceipt]=useState(null);
 const [step,setStep]=useState(1);
 const [banners,setBanners]=useState([]);
 const nid=useRef(0), toastT=useRef(null), Pr=useRef(null);

 const isOrg=uid===0, draft=P[uid], me=submitted(draft), org=P[0];
 const outlet={n:OUTLET_CAPS[g.oi].n,w:OUTLET_CAPS[g.oi].w,slots:Object.fromEntries(g.slotTimes.map((t,i)=>[t,OUTLET_CAPS[g.oi].caps[i]??OUTLET_CAPS[g.oi].laterCap]))};
 const timeOfSlot=t=>g.slotMs[g.slotTimes.indexOf(t)]||0;
 const slotAt=timeOfSlot(g.slot);
 const slotFits=t=>outlet.slots[t]>=g.size&&!(g.slotGone&&t===g.slot);
 const leadMinutes=g.collectionMode==='advance'?120:15;
 const collectionName=g.collectionMode==='advance'?'Advance order':'Pickup';
 const slotAvailable=(t,now,planned=false)=>{
  const reference=planned?Math.max(now,g.live?g.deadlineAt:now+g.win*60000):now;
  return slotFits(t)&&timeOfSlot(t)>=reference+leadMinutes*60000;
 };
 Pr.current=P;
 const members=P.filter(p=>p.in).map(submitted), subm=members.filter(p=>p.sub);
 const pointsInfo='8 Cherish points per $1 paid after rewards, rounded down to whole points';
 const rw=p=>REWARDS.find(r=>r.id===p.rw);
 // Points are only spent when the group order is sent (see `send`), so every screen shows the real balance until then.
 const avail=me.pts;
 const owed=p=>Math.max(0,sum(p.items)-(rw(p)?rw(p).val:0));
 const groupTotal=subm.reduce((s,p)=>s+owed(p),0);
 // Points follow the money: when everyone pays for their own, each person earns on their own items.
 // When the organiser pays for everyone, only the organiser earns points (on the whole group total).
 const earnOf=p=>g.pay==='sponsor'?(p.org?pointsFor(groupTotal):0):pointsFor(owed(p));
 const earners=g.pay==='sponsor'?members.filter(p=>p.org):subm;
 const declined=!!me.payFail&&!g.sent;
 // Nobody is charged until the order is sent. "Ready to pay" just means a payment method has been chosen.
 const needsMethod=p=>g.pay==='individual'&&!!p.sub&&owed(p)>0&&!p.pmeth;
 const unpaid=subm.filter(needsMethod);
 const bad=p=>p.items.filter(i=>g.sold.includes(i.id)||(g.sold.includes(8)&&/milo|moki/i.test(i.name+' '+(i.o||''))));
 const pending=g.live&&!g.sent&&!g.cancelled;
 const orderingOpen=()=>pending&&!g.closed&&Date.now()<g.deadlineAt;
 const canEdit=()=>me.in&&orderingOpen();
 const editable=canEdit();
 const cart=editable?draft:me;
 const dirty=editable&&!!me.sub&&(draft.items!==me.items||draft.rw!==me.rw);
 const everyone=members.length>0&&members.every(p=>p.sub&&!needsMethod(p));
 const unavailable=subm.filter(p=>bad(p).length);
 const sendBlock=now=>{
  if(g.cancelled)return 'This group order was cancelled.';
  if(!isOrg||!pending)return 'There is no group order to send.';
  if(!g.closed)return 'Close ordering first.';
  if(!subm.length)return 'No orders have been submitted.';
  if(!slotAvailable(g.slot,now))return 'Choose an available '+collectionName.toLowerCase()+' time at least '+leadMinutes+' minutes ahead that fits your group size.';
  if(unavailable.length)return 'Unavailable items in submitted orders for '+unavailable.map(p=>p.n).join(', ')+'. Extend ordering so they can update their orders.';
  if(unpaid.length)return unpaid.length+' payment method(s) still to be chosen.';
  return '';
 };
 const why=sendBlock(Date.now()), canSend=!why;
 const infoRows=withMembers=><div className="kv">
  <span>Organiser</span><b>{org.n}</b>
  <span>Deadline</span><b>{g.deadline}</b>
  {withMembers&&<><span>Members</span><b>{members.map(p=>p.n).join(', ')}</b></>}
  {!withMembers&&isOrg&&<><span>Submitted</span><b>{subm.length} of {members.length}</b></>}
  <span>Outlet</span><b>{outlet.n}</b>
  <span>Collection mode</span><b>{collectionName}</b>
  <span>Collection</span><b>{g.slot}{g.sent&&' (locked)'}</b>
  <span>Payment</span><b>{g.pay==='sponsor'?org.n+' pays for everyone':'Everyone pays for their own order'}</b>
  <span>Points rate</span><b>8 points per $1 paid</b>
 </div>;
 const statusText=g.cancelled?'Cancelled':g.sent?(g.status==='collected'?'Collected':g.status==='ready'?'Ready for collection':'Being prepared'):g.closed?'Ordering closed':'Ordering open';
 const invState=g.sent||g.cancelled||g.inv==='expired'?'expired':(g.inv==='full'||members.length>=g.size)?'full':'valid';
 const GATED=['group','cart','track','done','pay','paid'];
 const screen=!me.in&&GATED.includes(scr)?'gate':scr;
 const TAB={gate:'order',join:'order',home:'home',create:'home',menu:'order',cart:'order',group:'order',track:'order',done:'order',wallet:'pay',pay:'pay',paid:'pay',rewards:'rewards',more:'more',repeat:'more',notifs:'more'};
 const tab=TAB[screen];
 // Notifications belong to specific people. Each one lists who receives it, and "seen" is tracked per person.
 const myNotes=notes.filter(x=>x.to.includes(uid));
 const hasNew=myNotes.some(x=>!x.seen.includes(uid));
 const markSeen=()=>setNotes(a=>a.map(x=>x.to.includes(uid)&&!x.seen.includes(uid)?{...x,seen:[...x.seen,uid]}:x));
 const banner=[...banners].reverse().find(b=>b.to.includes(uid));
 const mem=()=>Pr.current.filter(p=>p.in).map(p=>p.id);
 const meth=mName(me.pmeth||'card',uid);
 // Order history: the current group appears as soon as it is sent (so it is never lost), older ones are archived below it.
 const snapshot=()=>({s:1,id:g.gid,name:g.name,at:g.sentAt||Date.now(),outlet:outlet.n,slot:g.slot,coll:g.coll,status:g.status||'preparing',pay:g.pay,total:groupTotal,
  collectionMode:g.collectionMode,advanceQualified:g.advanceQualified,advanceQualifiedAt:g.advanceQualifiedAt,advanceDeadlineAt:g.advanceDeadlineAt,advanceSlotAt:g.advanceSlotAt,
  pointsRate:8,
  payer:g.pay==='sponsor'?{id:org.id,amount:org.paidAmt,method:org.paidMeth,earn:g.status==='collected'?org.earned:pointsFor(groupTotal)}:null,
  members:subm.map(p=>p.n),
  orders:Object.fromEntries(subm.map(p=>[p.id,{items:p.items.map(i=>({...i})),owed:owed(p),rw:rw(p)?rw(p).t:'',free:freeOf(p)?freeOf(p).free:'',earn:g.status==='collected'?p.earned:earnOf(p)}]))});
 const histAll=[...(g.live&&g.sent&&!g.cancelled?[snapshot()]:[]),...hist];
 const myHist=histAll.filter(h=>h.orders[uid]||(uid===0&&(h.pay==='sponsor'||h.members.includes(USERS0[0].n))));

 const say=(t)=>{clearTimeout(toastT.current);setToast({t,mid:true});toastT.current=setTimeout(()=>setToast(''),TOAST_MS)};
 const login=()=>{
  const acc=ACCOUNTS.find(a=>a.identifier.toLowerCase()===idf.trim().toLowerCase());
  if(!acc||acc.password!==pwd){setLoginErr('Incorrect email or password.');return}
  setLoginErr('');setUid(acc.id);setScr('home');
 };
 // note(text, icon, to): `to` = the user ids who receive it (default: everyone currently in the group).
 const note=(t,i='bell',to)=>{
  const rec=[...new Set(to||mem())], id=++nid.current;
  setNotes(a=>[{id,t,i,to:rec,seen:[],at:Date.now()},...a]);
  setBanners(b=>[...b,{id,t,i,to:rec}]);setTimeout(()=>setBanners(b=>b.filter(x=>x.id!==id)),4200);
 };
 const upd=(id,f)=>setP(p=>p.map(x=>x.id===id?{...x,...(typeof f==='function'?f(x):f)}:x));
 const setItems=f=>{
  if(!canEdit())return;
  upd(uid,x=>{const items=f(x.items),r=rw(x);return {items,rw:r&&sum(items)<r.min?null:x.rw}});
 };
 const setReward=id=>{
  if(!canEdit())return say('Ordering is closed');
  upd(uid,{rw:id});setSheet(null);
  if(id)say(REWARDS.find(r=>r.id===id).t+' applied');
 };
 const setSize=n=>{const min=Math.max(2,preset.length);if(n>MAXSIZE){say(`A group order can have at most ${MAXSIZE} people`);n=MAXSIZE}if(n<min&&preset.length>2)say(`${preset.length} people are in this saved group`);setG(x=>({...x,size:Math.max(min,n)}))};
 const setOutlet=i=>{
  if(!isOrg||g.sent||g.cancelled)return;
  setG(x=>{const idx=x.slotTimes.indexOf(x.slot),ok=idx>=0&&(OUTLET_CAPS[i].caps[idx]??OUTLET_CAPS[i].laterCap)>=x.size;return {...x,oi:i,slot:ok?x.slot:'',...(ok?{}:{advanceQualified:false,advanceQualifiedAt:0,advanceDeadlineAt:0,advanceSlotAt:0})}});
 };
 const setCollectionMode=mode=>{
  if(!isOrg||g.sent||g.cancelled||mode===g.collectionMode)return;
  setG(x=>({...x,collectionMode:mode,...slotSet(x.win),slot:'',slotGone:false,advanceQualified:false,advanceQualifiedAt:0,advanceDeadlineAt:0,advanceSlotAt:0}));
 };
 const collectionModes=<><label className="l">Collection option</label><div className="chips">{[['pickup','Pickup'],['advance','Advance order']].map(([mode,label])=><button key={mode} className={'chip '+(g.collectionMode===mode?'on':'')} onClick={()=>setCollectionMode(mode)}>{label}</button>)}</div><div className="mute" style={{marginTop:8}}>{g.collectionMode==='advance'?'Choose collection at least two hours after the planned ordering deadline.':'Allow at least 15 minutes after sending for preparation. ASAP includes the ordering window.'}</div></>;
 const chooseSlot=t=>{
  const now=Date.now();
  if(!isOrg||g.sent||g.cancelled||!slotAvailable(t,now,true))return;
  const qualified=g.live&&g.collectionMode==='advance';
  setG(x=>({...x,slot:t,slotGone:false,advanceQualified:qualified,advanceQualifiedAt:qualified?now:0,advanceDeadlineAt:qualified?Math.max(now,g.deadlineAt):0,advanceSlotAt:qualified?timeOfSlot(t):0}));
  if(g.live)note(collectionName+' time changed to '+t,'clock');
 };


 useEffect(()=>{
  if(!g.live||g.closed||g.sent||g.cancelled)return;
  const msLeft=g.deadlineAt-Date.now(), timers=[];
  if(!g.reminded&&msLeft>0)timers.push(setTimeout(()=>{setG(x=>x.reminded||x.closed||x.sent||x.cancelled?x:{...x,reminded:true});const rec=Pr.current.filter(p=>p.in&&!p.sub).map(p=>p.id);if(rec.length){note('2 minutes left to submit your order','clock',rec);if(rec.includes(uid))say('2 minutes left to order')}},Math.max(0,msLeft-120000)));
  timers.push(setTimeout(()=>{setG(x=>x.closed||x.sent||x.cancelled?x:{...x,closed:true,expired:true});note('Ordering closed: time is up','clock');if(uid===0)setSheet({k:'expired'})},Math.max(0,msLeft)));
  return ()=>timers.forEach(clearTimeout);
 },[g.deadlineAt,g.live,g.closed,g.sent,g.cancelled,g.reminded,uid]);
 const createGroup=()=>{
  if(!isOrg||g.live)return;
  const now=Date.now(), at=now+g.win*60000;
  if(!slotAvailable(g.slot,now,true)){
   setG(x=>({...x,...slotSet(x.win),slot:'',advanceQualified:false}));setStep(2);return say('Choose a later pickup time');
  }
  if(at>=slotAt)return say('Choose a shorter ordering time or a later pickup');
  setG(x=>({...x,pay:'individual',live:true,advanceQualified:x.collectionMode==='advance',advanceQualifiedAt:x.collectionMode==='advance'?now:0,advanceDeadlineAt:x.collectionMode==='advance'?at:0,advanceSlotAt:x.collectionMode==='advance'?slotAt:0,deadlineAt:at,deadline:tm(at),reminded:false,closed:false,expired:false,cancelled:false}));
  const inv=P.filter(x=>!x.org&&preset.includes(x.n)).slice(0,g.size-1).map(x=>x.id); // only the saved group's members; a new team starts with just the organiser
  setP(p=>p.map(x=>inv.includes(x.id)?{...x,in:1}:x));
  if(inv.length){note('Invitations sent for '+g.name,'mail',[0]);note(org.n+' invited you to '+g.name,'mail',inv);}
  note('Reminder set: ordering closes at '+tm(at),'clock',[0,...inv]); // only the people in this group
  setStep(4);say('Group created');
 };
 // A group order that is open or still being collected is never overwritten. A collected one is archived into the order history first.
 const begin=(name,members)=>{
  if(g.live&&!g.cancelled&&!(g.sent&&g.status==='collected')){
   say(g.sent?'Your current group order is still in progress':'Finish or cancel your current group order first',1,2000);setScr(g.sent?'done':'group');return;
  }
  const arch=g.live&&g.sent&&!g.cancelled;
  if(arch)setHist(h=>[snapshot(),...h]);
  const n=hist.filter(h=>h.s).length+(arch?1:0);
  setG({...freshG(n),...(name?{name}:{}),...(members?{size:Math.min(MAXSIZE,Math.max(2,members.length))}:{})});
  setPreset(members||[]);
  setP(p=>p.map(x=>({...blank(USERS0[x.id]),pts:x.pts,hist:x.hist})));
  setStep(1);setScr('create');
 };
 const startFrom=s=>{
  begin(s.name,s.members);
 };
 const newOrder=()=>begin();
 const cancelOrder=()=>{
  if(!isOrg||!pending)return;
  setG(x=>({...x,cancelled:true,closed:true,expired:false}));
  setP(p=>p.map(x=>x.in?{...blank(x),in:1}:x));
  note('Group order cancelled','alert');setSheet(null);setScr('track');say('Group order cancelled');
 };
 const join=()=>{
  if(invState!=='valid'||!pending||me.in)return;
  upd(uid,{in:1,left:0});note(me.n+' joined '+g.name,'users');setScr('group');say('You joined '+g.name);
 };
 const leave=()=>{
  if(!pending)return;
  upd(uid,{in:0,left:1,sub:null,items:[],paid:0,paidAmt:0,rw:null,pmeth:null,payFail:0});note(me.n+' left the group','door',[0]);setScr('group');
 };
 const removeP=p=>{
  if(!isOrg||!pending)return;
  upd(p.id,{in:0,sub:null,items:[],paid:0,paidAmt:0,rw:null,pmeth:null,payFail:0});note(p.n+' was removed from the group','alert');say(p.n+' removed');
 };
 const addP=p=>{
  if(!isOrg||!orderingOpen())return;
  if(members.length>=g.size){say('Group is full ('+members.length+'/'+g.size+')',1);return}
  upd(p.id,{in:1,left:0});note(p.n+' was added to '+g.name,'users',[...mem(),p.id]);
  if(members.length+1>=g.size)say(p.n+' added. Group is now full ('+(members.length+1)+'/'+g.size+')'+(g.size>=MAXSIZE?', the maximum':''),1);else say(p.n+' added to the group');
 };
 const extensionLimit=slotAt-60000;
 const extend=()=>{
  if(!isOrg||!pending)return;
  const cap=extensionLimit, base=Math.max(g.deadlineAt,Date.now());
  if(base>=cap){say('Choose a later pickup time before extending');return}
  const at=Math.min(base+15*60000,cap);
  setG(x=>({...x,deadlineAt:at,deadline:tm(at),closed:false,expired:false,reminded:false}));note('Deadline extended to '+tm(at),'clock');say('Deadline extended to '+tm(at));setSheet(null);
 };
 const closeEarly=()=>{
  if(!isOrg||!orderingOpen())return;
  setG(x=>({...x,closed:true}));note('Ordering closed early by '+org.n,'lock');say('Ordering closed');
 };
 const saveGroup=()=>{
  if(saved.some(s=>s.name===g.name))return say('Already saved');
  setSaved(s=>[...s,{name:g.name,members:members.map(x=>x.n)}]);say('Group saved');
 };
 const copyLink=()=>{
  try{navigator.clipboard.writeText('https://yakun.app/together/'+g.gid).catch(()=>{})}catch(e){}
  say('Invite link copied');
 };
 const remind=(p,type)=>{
  note('Reminder sent to '+p.n+': '+type,'clock',[uid]); // confirmation for the organiser only
  note(org.n+' sent you a reminder: '+type,'clock',[p.id]); // the reminder itself goes to that one person
  say('Reminder sent to '+p.n);
 };
 const addToCart=()=>{
  if(!canEdit())return say('Ordering is closed');
  const s=sheet,o=s.m.set?s.drink+', '+s.sw.toLowerCase():s.m.dr?s.sw:'As served';
  const item={id:s.m.id,name:s.m.name,o,q:s.q,p:itemPrice(s.m,s.drink)};
  if(bad({items:[item]}).length)return say('This item is unavailable');
  setItems(c=>{const i=c.findIndex(x=>x.id===item.id&&x.o===o);if(i>=0)return c.map((x,k)=>k===i?{...x,q:x.q+s.q}:x);return [...c,item]});
  setSheet(null);say('Added to your order',1,1500);
 };
 const submit=()=>{
  if(!canEdit())return say('Ordering is closed');
  if(bad(draft).length)return say('Remove unavailable items first');
  if(!draft.items.length){
   if(!me.sub)return;
   upd(uid,{sub:null,payFail:0});
   if(!isOrg)note(me.n+' withdrew their order','alert',[0]);
   setScr('track');say('Order withdrawn');return;
  }
  const first=!me.sub;
  // Cart edits replace the array and reward ID, leaving this submitted snapshot intact.
  upd(uid,{sub:{items:draft.items,rw:draft.rw}});
  if(uid!==0)note(me.n+(first?' submitted':' updated')+' an order','check',[0]);
  if(g.pay==='individual'&&owed(draft)>0&&!me.pmeth){goPay('me')}
  else{setScr('track');say(first?'Order submitted':'Order updated')}
 };
 const send=(at,meth)=>{
  // This is also the moment the order can no longer change, so it's when any applied Cherish reward's points cost is actually spent.
  // Payment methods chosen earlier are charged now, and only now.
  const sponsor=g.pay==='sponsor';
  const amtOf=x=>sponsor?(x.org?groupTotal:0):owed(x);
  const methOf=x=>x.org&&meth?meth:(x.pmeth||'card');
  setG(x=>({...x,sent:true,sentAt:at,status:'preparing'}));
  setP(p=>p.map(x=>{
   if(!x.in||!(x.sub||(sponsor&&x.org)))return x;
   const order=submitted(x), r=x.sub&&rw(order), amt=amtOf(order);
   const base={...x,paid:1,paidAmt:amt,paidMeth:amt>0?mName(methOf(x),x.id):'',pmeth:x.pmeth||(amt>0?methOf(x):null)};
   return r?{...base,pts:x.pts-r.cost,hist:[{amt:-r.cost,note:r.t+' reward',at}, ...x.hist]}:base;
  }));
  note('Group order submitted. Collect at '+g.slot+', '+outlet.n,'receipt');
  const recipients=sponsor?members.filter(x=>x.sub||x.org):subm;
  recipients.forEach(x=>{const amt=amtOf(x);note(amt>0?'You were charged '+$(amt)+' ('+mName(methOf(x),x.id)+') for '+g.name:sponsor&&!x.org?org.n+' paid for your order.':'Nothing was charged: your order was fully covered.','card',[x.id])});
 };
 // Organiser taps "Send": if a charge would be declined (demo switch), the order is NOT sent and that person is asked for another method.
 const trySend=meth=>{
  const now=Date.now(), reason=sendBlock(now);
  if(reason){setScr('track');say(reason);return false}
  if(g.pay==='sponsor'){
   if(groupTotal>0&&g.failFor.includes(0)){
    setG(x=>({...x,failFor:x.failFor.filter(i=>i!==0)}));
    setErr('Your payment was declined and the order was not sent. Please try again.');
    return false;
   }
   send(now,meth);return true;
  }
  // DEMO: the person(s) chosen under Demo controls have their charge declined at the moment the organiser sends.
  // The order is NOT sent; that person (organiser or colleague) must choose another payment method.
  const v=subm.find(p=>g.failFor.includes(p.id)&&owed(p)>0&&p.pmeth);
  if(v){
   setG(x=>({...x,failFor:x.failFor.filter(i=>i!==v.id)}));
   upd(v.id,{pmeth:null,payFail:1});
   if(v.org){note('Your payment was declined. Choose another payment method so you can send the order.','alert',[0]);say('Your payment was declined. Order not sent.',1,2200)}
   else{note('Your payment was declined. Choose another payment method so the order can be sent.','alert',[v.id]);note('Payment declined for '+v.n+'. The order was not sent.','alert',[0]);say('Payment declined for '+v.n+'. Order not sent.',1,2200)}
   return false;
  }
  send(now);return true;
 };
 const markCollected=()=>{
  setG(x=>({...x,status:'collected'}));
  const ids=earners.map(x=>x.id);
  setP(p=>p.map(x=>{
   if(!ids.includes(x.id))return x;
   const earn=earnOf(submitted(x));
   return {...x,earned:earn,pts:x.pts+earn,hist:[{amt:earn,note:'Ya Kun Together · '+g.name,at:Date.now()},...x.hist]};
  }));
  [...new Set([...subm.map(x=>x.id),...ids])].forEach(id=>{const e=ids.includes(id)?earnOf(submitted(P[id])):0;note(e>0?'Order collected. '+e+' Cherish points credited.':'Order collected.','check',[id])});
 };
 const doPay=()=>{
  // Stores the chosen payment method only (no charge). Money is charged when the organiser sends the group order
  // (see `send`). Organiser only sees "payment ready" vs "not ready", never card details.
  if(pm==='group'){
   // Organiser paying for everyone: the charge happens as the order is sent.
   if(!trySend(sel))return;
   setErr('');setReceipt({amt:groupTotal,at:Date.now(),items:subm.flatMap(p=>p.items),meth:mName(sel,uid)});
   upd(uid,{pmeth:sel,payFail:0});setScr('paid');return;
  }
  if(!pending||!me.in||!me.sub)return;
  if(me.payFail&&uid!==0)note(me.n+' chose a new payment method. The order can now be sent.','check',[0]);
  upd(uid,{pmeth:sel,payFail:0});
  setScr('track');say('Payment method saved. You will only be charged when the order is sent.');
 };
 const goPay=mode=>{setPm(mode);setSel(me.pmeth||'card');setErr('');setScr('pay')};
 const othersDone=()=>{
  // DEMO ONLY: real participants act through their own devices.
  const who=members.filter(x=>!x.org&&!x.sub&&DEMO_ORDERS[x.id]);
  if(!orderingOpen())return say('Ordering is closed');
  if(!who.length)return say('Everyone has already submitted');
  setP(p=>p.map(x=>{
   if(!who.some(w=>w.id===x.id))return x;
   const items=DEMO_ORDERS[x.id].filter(i=>!g.sold.includes(i.id));
   return {...x,items,rw:null,sub:{items,rw:null},pmeth:x.id===3?null:'card'};
  }));
  note(who.length+' participant'+(who.length===1?'':'s')+' submitted their orders','check',[0]);
  const late=who.some(w=>w.id===3);say(who.map(w=>w.n).join(', ')+(late?' submitted. Dylan still needs to choose a payment method.':' submitted.'));
 };
 const advance=()=>{
  // DEMO ONLY: the outlet updates status.
  if(!g.sent)return say('Send the group order first');
  if(g.status==='preparing'){setG(x=>({...x,status:'ready'}));note('Your group order is ready for collection','star')}else say('Already ready');
 };
 const reorder=h=>{
  const m=h.orders[uid];
  if(!editable)return say('Join or start an open group first');
  if(!m)return say("You didn't order in that group");
  setItems(()=>m.items.map(repriceItem).filter(Boolean));setSheet(null);setScr('cart');say('Previous order loaded at current menu prices. Change anything you like.');
 };

 const tot={};subm.forEach(p=>{p.items.forEach(i=>{const t=tot[i.name]||(tot[i.name]={q:0,v:{}});t.q+=i.q;t.v[i.o]=(t.v[i.o]||0)+i.q});const f=freeOf(p);if(f){const t=tot[f.free]||(tot[f.free]={q:0,v:{}});t.q+=1;t.v['Free reward']=(t.v['Free reward']||0)+1}});
 const T={gate:'Order',home:'Ya Kun Together',create:'New group order',group:'Order',menu:'Order',cart:'Order',track:'Order',done:'Order',pay:'Payment',paid:'Payment confirmed',wallet:'Pay',rewards:'Rewards',more:'More',repeat:'Saved and previous',notifs:'Notifications',join:'Group invitation'};
 const back={join:'home',create:'home',pay:'wallet',paid:'track',repeat:'more',notifs:'more'};
 const goBack=()=>{if(screen==='create'&&step>1&&step<4)setStep(step-1);else setScr(back[screen])};
 const expiredBtns=<div className="col"><button className="btn" onClick={extend}>Add 15 more minutes</button><button className="btn ghost" disabled={subm.length===0} onClick={()=>{setSheet(null);setG(x=>({...x,expired:false}));setScr('track')}}>Continue with {subm.length} order{subm.length===1?'':'s'}</button><button className="link danger" onClick={()=>setSheet({k:'cancel'})}>Cancel group order</button></div>;
 const pstat=p=>g.pay==='sponsor'?<Tag c="ok">Organiser pays</Tag>:g.sent&&p.sub&&p.paid?<Tag c="ok">Paid</Tag>:p.payFail&&!g.sent?<Tag c="w">Payment declined</Tag>:!p.sub?<Tag>–</Tag>:owed(p)===0?<Tag c="ok">Nothing to pay</Tag>:p.pmeth?<Tag c="ok">Payment ready</Tag>:<Tag c="w">Payment method needed</Tag>;

 if(scr==='login')return <div className="phone"><div className="splash">
  <div className="logo">Ya Kun</div><div style={{fontSize:18,fontWeight:700,marginBottom:6}}>Log in with Ya Kun Cherish</div>
  <div className="loginBox">
   <label className="ll">Email</label>
   <input className="li" value={idf} onChange={e=>setIdf(e.target.value)} placeholder="you@example.com" autoCapitalize="none"/>
   <label className="ll">Password</label>
   <div className="pwRow"><input className="li" type={showPw?'text':'password'} value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="Password" onKeyDown={e=>e.key==='Enter'&&login()}/>
    <button type="button" className="pwToggle" onClick={()=>setShowPw(s=>!s)} aria-label={showPw?'Hide password':'Show password'}>{showPw?'Hide':'Show'}</button></div>
   <div className="loginErr" role="alert" style={{marginTop:14,minHeight:20,marginBottom:0}}>{loginErr}</div>
   <button className="btn light" style={{marginTop:24}} onClick={login}>Log in</button>
  </div>
 </div></div>;

 return <div className="phone">
  <Clock/>
  <div className="bar">{back[screen]&&<button onClick={goBack} aria-label="Back"><Icon n="back" s={24}/></button>}<h1>{T[screen]}</h1>
   <button aria-label="Notifications" onClick={()=>{markSeen();setScr('notifs')}}><Icon n="bell"/>{hasNew&&<i className="dot"/>}</button>
   <button className="me" aria-label="Switch demo user" onClick={()=>setSheet({k:'demo'})}>{me.n}</button></div>
  <div className="body">
  {tab==='order'&&<div className="seg">{[['menu','Menu'],['cart','My order'],['group','Group'],['track','Status']].map(([k,l])=><button key={k} className={(scr===k||(k==='track'&&scr==='done'))?'on':''} onClick={()=>setScr(k==='track'&&g.sent?'done':k)}>{l}{k==='cart'&&me.items.length>0&&<i className="badge">{me.items.length}</i>}</button>)}</div>}
  {tab==='order'&&g.live&&g.cancelled&&<Ban c="e">This group order was cancelled. {isOrg&&<button className="link" onClick={newOrder}>Start a new order</button>}</Ban>}
  {tab==='order'&&g.live&&!g.sent&&!g.cancelled&&<TimerBar deadlineAt={g.deadlineAt} closed={g.closed}/>}
  {tab==='order'&&isOrg&&g.expired&&!g.sent&&!g.cancelled&&<div className="card"><b>Time is up</b><div className="mute" style={{margin:'6px 0 14px'}}>{subm.length} of {members.length} people submitted.</div>{expiredBtns}</div>}

  {screen==='home'&&<>
   {isOrg&&<div className="hero"><h2>Breakfast for the whole team, one order.</h2><p className="mute" style={{marginBottom:14}}>Everyone picks their own food, pays for their own order and earns their own Cherish points.</p>{(()=>{const active=g.live&&!g.cancelled&&!(g.sent&&g.status==='collected');return <button className="btn" onClick={()=>active?setScr(g.sent?'done':'group'):newOrder()}>{active?(g.sent?'View my group order':'Open my group order'):'Start Ya Kun Together'}</button>})()}</div>}
   <div className="card row"><div className="av"><Icon n="star"/></div><div className="sp"><b>Cherish account</b><div className="mute">{me.n} · linked</div></div><div style={{textAlign:"right"}}><div className="big" style={{fontSize:26}}>{avail}</div></div></div>
   {g.live&&me.in?<div className="card click" onClick={()=>setScr(g.sent?'done':'group')} style={{borderColor:'var(--red)'}}><b>{g.name}</b><div className="mute">{statusText}{!g.closed&&!g.sent&&!g.cancelled&&<ClosesIn target={g.deadlineAt}/>}</div></div>
    :g.live&&!g.cancelled?<div className="card click" onClick={()=>setScr('join')} style={{borderColor:'var(--red)'}}><b>{org.n} invited you to {g.name}</b><div className="mute">Tap to view the invitation</div></div>
    :!isOrg&&<div className="card mute">No active group order right now. You can still browse the menu and your rewards, and join as soon as you get an invitation link.</div>}
   <button className="btn ghost" style={{marginBottom:12}} onClick={()=>setScr('menu')}>Browse the menu</button>
   <button className="btn ghost" onClick={()=>setScr('repeat')}>Saved groups and previous orders</button>
  </>}

  {screen==='create'&&<>
   {step<4&&<div className="steps">{[1,2,3].map(n=><i key={n} className={n<=step?'on':''}/>)}</div>}
   {step===1&&<>
    <h2 className="ttl">Who is ordering?</h2>
    {saved.length>0&&<><label className="l">Start from a saved group</label><div className="chips">{saved.map((s,i)=>{const on=preset.join()===s.members.join();return <button key={i} className={'chip '+(on?'on':'')} onClick={()=>{if(on){setPreset([])}else{setPreset(s.members);setG(x=>({...x,name:s.name,size:Math.min(MAXSIZE,Math.max(2,s.members.length))}))}}}>{s.name}</button>})}</div>{preset.length>0&&<div className="mute" style={{marginTop:8}}>Only these people will be invited: {preset.join(', ')}</div>}</>}
    <label className="l">Group name</label><input value={g.name} onChange={e=>setG({...g,name:e.target.value})}/>
    <label className="l">How many people?</label>
    <div className="stepper"><button onClick={()=>setSize(g.size-1)} aria-label="Fewer people">−</button><div><b>{g.size}</b><div className="mute">people, up to {MAXSIZE}</div></div><button onClick={()=>setSize(g.size+1)} aria-label="More people">+</button></div>
    <div className="sticky"><button className="btn" disabled={!g.name.trim()} onClick={()=>{setG(x=>({...x,...slotSet(x.win),slot:''}));setStep(2)}}>Next: choose pickup</button></div>
   </>}
   {step===2&&<>
    <h2 className="ttl">Choose collection</h2>
    {collectionModes}
    <div className="mute">Pick the time first, so you know it is available for {g.size} people.</div>
    <label className="l">Outlet</label>
    {OUTLET_CAPS.map((o,i)=><div key={i} className={'opt '+(g.oi===i?'on':'')} onClick={()=>setOutlet(i)}><b>{o.n}</b><div className="mute">Estimated wait {o.w}</div></div>)}
    <label className="l">Collection time</label>
    <div className="mute" style={{marginBottom:8}}>{g.collectionMode==='advance'?'Choose a later collection time, up to 24 hours ahead.':'ASAP is about 15–20 minutes after ordering closes. Choose a quick time or use the dropdown for later pickup, up to 24 hours ahead.'}</div>
    <PickupChoices times={g.slotTimes} selected={g.slot} mode={g.collectionMode} available={t=>slotAvailable(t,Date.now(),true)} onPick={chooseSlot} id="create-pickup"/>
    <div className="mute" style={{marginTop:10}}>Crossed-out times are full for {g.size} people or too soon. Try another time, outlet or group size.</div>
    <div className="sticky"><button className="btn" disabled={!g.slot} onClick={()=>{
     const now=Date.now();
     if(!slotAvailable(g.slot,now,true)){
      setG(x=>({...x,...slotSet(x.win),slot:'',advanceQualified:false}));return say('Choose a later pickup time');
     }
     const win=[30,15,10,5].find(m=>m<=g.win&&now+(m+leadMinutes)*60000<=slotAt);
     setG(x=>({...x,win}));setStep(3);
    }}>Next: ordering time</button></div>
   </>}
   {step===3&&<>
    <h2 className="ttl">Ordering time and payment</h2>
    <label className="l">How long can people order?</label>
    <div className="chips">{[5,10,15,30].map(m=>{const late=Date.now()+(m+leadMinutes)*60000>slotAt;return <button key={m} disabled={late} className={'chip '+(g.win===m&&!late?'on':'')} onClick={()=>setG({...g,win:m})}>{m} minutes</button>})}</div>
    <div className="mute" style={{marginTop:10}}>Ordering closes at {tm(Date.now()+g.win*60000)}. Everyone sees a countdown and gets a reminder.</div>
    <label className="l">Payment</label>
    <div className="card"><b>Everyone pays for their own order</b><div className="mute" style={{marginTop:6}}>Each person chooses their own saved card. Cards are charged only when the organiser sends the group order to the outlet.</div></div>
    <div className="sticky"><button className="btn" onClick={createGroup}>Create group</button></div>
   </>}
   {step===4&&<>
    <div className="hero" style={{textAlign:'center'}}><Icon n="check" s={44}/><h2 style={{marginTop:10}}>Your group is ready</h2><div className="mute">{g.name}<br/>{collectionName} · {g.slot} · ordering closes {g.deadline}</div></div>
    <div className="card row"><div className="sp mute" style={{wordBreak:'break-all'}}>yakun.app/together/{g.gid}</div><button className="btn sm" onClick={copyLink}>Copy link</button></div>
    <div className="mute">Share the link so friends can join.</div>
    <div className="sticky"><button className="btn" onClick={()=>setScr('menu')}>Begin my order</button><button className="btn ghost" style={{marginTop:10}} onClick={()=>setScr('group')}>View group</button></div>
   </>}
  </>}

  {screen==='gate'&&<>
   {!!me.left&&<Ban>You left this group.</Ban>}
   <div className="card"><b>{g.live&&!g.cancelled?"You haven't joined "+g.name:'No group order yet'}</b>
    <div className="mute" style={{margin:'6px 0 14px'}}>{g.live&&!g.cancelled?'Join to add items, pay and track the order. You can keep browsing in the meantime.':isOrg?'Start Ya Kun Together to order with your team.':'Ask the organiser for an invitation link. You can keep browsing in the meantime.'}</div>
    <div className="col">{g.live&&!g.cancelled&&<button className="btn" onClick={()=>setScr('join')}>View invitation</button>}{isOrg&&!g.live&&<button className="btn" onClick={newOrder}>Start Ya Kun Together</button>}<button className="btn ghost" onClick={()=>setScr('menu')}>Browse the menu</button></div></div>
  </>}

  {screen==='join'&&<>
   <div className="hero"><h2>{invState==='valid'?org.n+' invited you to '+g.name:"This invitation can't be used"}</h2>
    {invState==='valid'&&g.live&&<p className="mute">Deadline {g.deadline} · {collectionName} · {outlet.n} · collect at {g.slot}<br/>{g.pay==='sponsor'?org.n+' is paying for everyone':'Everyone pays for their own order'}</p>}</div>
   {!!me.left&&<Ban>You left this group.</Ban>}
   {invState==='expired'&&<Ban c="e">This invitation link is invalid or has expired. Ask {org.n} for a new link.</Ban>}
   {invState==='full'&&<Ban c="e">This group is full ({members.length}/{g.size}). Ask {org.n} to raise the group size.</Ban>}
   {!g.live&&<Ban>The organiser hasn't created this group yet.</Ban>}
   <button className="btn" disabled={invState!=='valid'||!g.live} onClick={join}>Join group</button>
  </>}

  {screen==='group'&&(!g.live?<div className="card"><div className="mute">No group order yet.</div>{isOrg&&<button className="btn" style={{marginTop:10}} onClick={newOrder}>Start Ya Kun Together</button>}</div>:<>
   <div className="card"><div className="row"><b className="sp">{g.name}</b><Tag c={g.sent?'ok':g.closed?'':'w'}>{statusText}</Tag></div>
    {infoRows(false)}</div>
   {isOrg&&pending&&<div className="card row"><div className="sp mute" style={{wordBreak:'break-all'}}>yakun.app/together/{g.gid}</div><button className="btn sm" onClick={copyLink}>Copy link</button></div>}
   <div className="h3">Members ({members.length}/{g.size})</div>
   {members.map(p=><div className={'card row'+(p.id===uid?' mine':'')} key={p.id}><div className="av">{p.n[0]}</div><div className="sp"><b>{p.n}{p.org?' (organiser)':''}</b>{isOrg&&<div className="mute">{p.sub?'Order submitted':g.closed?'Missed deadline':waitText(p)}</div>}</div>
    {isOrg&&!p.org&&pending&&<button className="btn sm ghost" onClick={()=>setSheet({k:'confirm',title:'Remove '+p.n+'?',msg:`${p.n}'s order will be cleared and they will need a new invite to rejoin.`,label:'Remove',action:()=>{removeP(p);setSheet(null)}})}>Remove</button>}</div>)}
   {isOrg&&!g.sent&&!g.cancelled&&!g.closed&&(()=>{const outside=P.filter(p=>!p.in),full=members.length>=g.size;return outside.length>0&&<>
    <div className="h3">Add people</div>
    {full&&<Ban>{g.size>=MAXSIZE?`Group is full (maximum ${MAXSIZE} people).`:`Group is full (${members.length}/${g.size}).`} {g.size<MAXSIZE&&<button className="link" onClick={()=>setSheet({k:'slot'})}>Raise group size</button>}</Ban>}
    {outside.map(p=><div className="card row" key={p.id}><div className="av">{p.n[0]}</div><div className="sp"><b>{p.n}</b>{p.left?<div className="mute">Left this group</div>:null}</div>
     <button className="btn sm" disabled={full} aria-label={'Add '+p.n} onClick={()=>addP(p)}>Add</button></div>)}</>})()}
   {isOrg&&pending&&<div className="row" style={{marginTop:6}}><button className="btn ghost sm pair" disabled={Math.max(g.deadlineAt,Date.now())>=extensionLimit} onClick={extend}>Extend 15 minutes</button><button className="btn sm pair" disabled={g.closed} onClick={()=>setSheet({k:'confirm',title:'Close ordering now?',msg:"Nobody will be able to submit or change an order after this, even if the deadline hasn't passed.",label:'Close ordering',action:()=>{closeEarly();setSheet(null)}})}>Close ordering</button></div>}
   {isOrg&&!g.sent&&!g.cancelled&&<button className="btn ghost" style={{marginTop:12}} onClick={()=>setSheet({k:'slot'})}>Change pickup time or group size</button>}
   {isOrg&&<button className="btn ghost" style={{marginTop:12}} onClick={saveGroup}>Save this group</button>}
   {isOrg&&!g.sent&&!g.cancelled&&<button className="link danger" style={{marginTop:16}} onClick={()=>setSheet({k:'cancel'})}>Cancel group order</button>}
   {!isOrg&&pending&&<button className="btn ghost" style={{marginTop:10}} onClick={()=>setSheet({k:'confirm',title:'Leave this group?',msg:'Your order (if any) will be removed. You can rejoin with the invite link.',label:'Leave group',action:()=>{leave();setSheet(null)}})}>Leave group</button>}
  </>)}

  {screen==='menu'&&<>
   {g.live&&g.closed&&<Ban c="e">Ordering is closed for this group.</Ban>}
   <label className="l" htmlFor="menu-category">Menu category</label>
   <select id="menu-category" className="menu-select" value={cat} onChange={e=>setCat(e.target.value)}>{CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}</select>
   {MENU.filter(m=>m.cat===cat).map(m=>{const out=bad({items:[m]}).length>0;return <div className="card row menu-card" key={m.id} style={{opacity:out?.6:1}}><div className="em"><MenuImage item={m}/></div><div className="sp"><b>{m.name}</b><div className="mute">{m.desc}</div><b style={{color:'var(--red)'}}>{m.set?'From ':''}{$(m.price)}</b> {out&&<Tag c="w">Unavailable</Tag>}</div>
    <button className="add" disabled={!editable||out} aria-label={'Add '+m.name} onClick={()=>setSheet({k:'item',m,drink:SET_DRINKS[0].name,sw:'Normal',q:1})}>+</button></div>})}
   {!editable&&!(g.live&&me.in)&&<div className="card row"><div className="sp mute">{g.live&&!g.cancelled?'Join '+g.name+' to add items.':isOrg?'Start a group order to add items.':'Join a group order to add items.'}</div>{g.live&&!g.cancelled?<button className="btn sm" onClick={()=>setScr('join')}>View invitation</button>:isOrg&&<button className="btn sm" onClick={newOrder}>Start</button>}</div>}
   {cart.items.length>0&&<div className="sticky"><button className="btn" onClick={()=>setScr('cart')}>View my order · {$(sum(cart.items))}</button></div>}
  </>}

  {screen==='cart'&&<>
   {g.sent?<Ban>The group order was sent to the outlet. It can't be changed now.</Ban>:g.closed&&<Ban c="e">Ordering is closed. Your order can't be changed.</Ban>}
   {!!me.sub&&!dirty&&editable&&<Ban c="k">Submitted. You can edit until {g.deadline}.</Ban>}
   {dirty&&<Ban>You changed your order. Update it so the group sees the latest version.</Ban>}
   {declined&&<Ban c="e">Your payment was declined. Choose another payment method so the order can be sent.</Ban>}
   <div className="mute" style={{marginBottom:8}}>Only you can change these items. Each one shows under your name in the group order.</div>
   {cart.items.length===0&&<div className="card"><div className="mute">{dirty?'Update your order to withdraw your submitted items.':'Your order is empty. Browse the menu to add items.'}</div><button className="btn ghost sm" style={{marginTop:10}} disabled={!editable||!myHist.length} onClick={()=>reorder(myHist[0])}>Reorder my last order</button></div>}
   {cart.items.map((c,i)=><div className="card" key={i}><div className="row"><div className="sp"><b>{c.name}</b>{optTxt(c.o)&&<div className="mute">{optTxt(c.o)}</div>}</div>
    <div className="qty"><button disabled={!editable} onClick={()=>setItems(x=>x.map((y,k)=>k===i?{...y,q:y.q-1}:y).filter(y=>y.q>0))}>−</button><b>{c.q}</b><button disabled={!editable} onClick={()=>setItems(x=>x.map((y,k)=>k===i?{...y,q:y.q+1}:y))}>+</button></div><b style={{width:56,textAlign:'right'}}>{$(c.p*c.q)}</b></div>
    {bad({items:[c]}).length>0&&<div style={{color:'var(--red)',fontWeight:700,fontSize:13,marginTop:6}}>Unavailable at this outlet. Remove it to continue.</div>}</div>)}
   {cart.items.length>0&&<>
    <div className="card"><div className="row"><b className="sp">Cherish reward</b><span className="mute">{me.pts} points</span></div>
     {rw(cart)?<div className="opt on" style={{margin:'10px 0 0'}}><b>{rw(cart).t} applied</b><div className="mute">Uses {rw(cart).cost} points from your account, taken when the group order is sent.</div>{freeOf(cart)&&<div className="mute">One free {freeOf(cart).free} is added to your order.</div>}{editable&&<button className="link" onClick={()=>setReward(null)}>Remove reward</button>}</div>
     :<button className="btn ghost sm" style={{marginTop:10}} disabled={!editable} onClick={()=>setSheet({k:'rewards'})}>View eligible rewards</button>}</div>
    <div className="card"><div className="row"><span className="sp">Subtotal</span>{$(sum(cart.items))}</div>
     {freeOf(cart)&&<div className="row"><span className="sp">Free {freeOf(cart).free} (reward)</span>{$(0)}</div>}
     {rw(cart)&&sum(cart.items)-owed(cart)>0&&<div className="row voucher"><span className="sp">{rw(cart).t}</span>− {$(sum(cart.items)-owed(cart))}</div>}
     <div className="row" style={{marginTop:6}}><b className="sp">{g.pay==='sponsor'&&!isOrg?org.n+' is paying for you':'You pay'}</b><b>{g.pay==='sponsor'&&!isOrg?$(0):$(owed(cart))}</b></div>
     <div className="mute" style={{marginTop:8}}>{g.pay==='sponsor'&&!isOrg?org.n+' is paying, so the Cherish points for this group order go to him.':g.pay==='sponsor'?<>You'll earn about <b>{pointsFor(groupTotal-(me.sub?owed(me):0)+owed(cart))} Cherish points</b>.</>:<>You'll earn about <b>{earnOf(cart)} Cherish points</b> when the group order is collected.</>}</div>
     <div className="mute" style={{marginTop:6}}>{pointsInfo}.</div></div>
   </>}
    {!!me.sub&&g.pay==='individual'&&owed(me)>0&&!g.sent&&(me.pmeth?<><Ban c="k">Payment method: {mName(me.pmeth,uid)}. You will be charged {$(owed(me))} only when {isOrg?'you send':'the organiser sends'} the group order.</Ban><button className="link" onClick={()=>goPay('me')}>Change payment method</button></>:<button className="btn" style={{marginTop:10}} onClick={()=>goPay('me')}>Choose payment method</button>)}
    {g.sent&&!!me.paid&&me.paidAmt>0&&<Ban c="k">Charged {$(me.paidAmt)} to {me.paidMeth}</Ban>}
    {editable&&(cart.items.length>0||!!me.sub)&&<div className="sticky"><button className="btn" disabled={bad(cart).length>0} onClick={submit}>{me.sub?'Update my order':'Submit my order'}</button></div>}
  </>}

  {screen==='pay'&&<>
   <div className="card mute">{pointsInfo}</div>
   <div className="hero" style={{textAlign:'center'}}><div className="mute">{pm==='group'?'Group total':'You will pay when the order is sent'}</div><div className="big">{$(pm==='group'?groupTotal:owed(me))}</div>{pm==='group'&&<div className="mute">One payment covers everyone's order.</div>}<div className="mute" style={{marginTop:6}}>You will earn about <b>{earnOf(me)} Cherish points</b>{pm==='group'?' for the whole group order':''} when the group order is collected.</div></div>
   {err&&<Ban c="e">{err}</Ban>}
   <label className="l" style={{marginTop:0}}>Payment method</label>
   {METHODS.map(k=><div key={k} className={'opt '+(sel===k?'on':'')} onClick={()=>setSel(k)}><b>{mName(k,uid)}</b>{k==='card'&&<div className="mute">Default payment method</div>}</div>)}
   <div className="mute" style={{margin:'6px 0 12px'}}>{pm==='group'?'You are charged when you send the order to the outlet.':(isOrg?"You won't be charged until you send the order.":"You won't be charged until the organiser sends the order.")}</div>
   <button className="btn" onClick={()=>pm==='group'?(err?doPay():setSheet({k:'confirmPay'})):doPay()}>{pm==='group'?(err?'Try again':'Review and pay '+$(groupTotal)):'Confirm payment method'}</button>
  </>}

  {screen==='paid'&&receipt&&<>
   <div className="hero" style={{textAlign:'center'}}><div style={{fontSize:44}}><Icon n="check" s={44}/></div><h2>Payment confirmed</h2><div className="big">{$(receipt.amt)}</div><div className="mute">Ref PAY-G{String(receipt.amt*100|0).padStart(5,'0')} · {receipt.meth}</div></div>
   <button className="btn" onClick={()=>setScr('done')}>View group order</button>
  </>}

  {screen==='track'&&(!g.live?<div className="card mute">No group order yet.</div>:!g.cancelled&&<>
   <div className="card"><div className="row"><div className="sp"><div className="mute">Overall status</div><b style={{fontSize:18}}>{statusText}</b></div>{isOrg&&<Tag c={everyone?'ok':'w'}>{everyone?'Everyone is ready':'Waiting'}</Tag>}</div>
    {infoRows(true)}</div>
   {declined&&<><Ban c="e">Your payment was declined. Choose another payment method so the order can be sent.</Ban>{isOrg&&<button className="btn ghost" style={{marginBottom:12}} onClick={()=>goPay('me')}>Choose payment method</button>}</>}
   {isOrg&&pending&&!slotAvailable(g.slot,Date.now())&&<><Ban c="e">{g.slot} at {outlet.n} is no longer available. Choose another time before sending.</Ban><button className="btn ghost" style={{marginBottom:12}} onClick={()=>setSheet({k:'slot'})}>Choose new time</button></>}
   {!isOrg&&<div className="card"><div className="row"><b className="sp">My order</b>{me.sub?<Tag c="ok">Submitted</Tag>:<Tag c={g.closed?'':'w'}>{g.closed?'Missed deadline':'Not submitted'}</Tag>}</div>
    <div className="mute" style={{margin:'6px 0'}}>{me.items.length?lines(me):'No items yet.'}</div>
    <div className="row"><span className="sp mute">Payment</span>{pstat(me)}</div>
    {needsMethod(me)&&!g.sent&&<button className="btn sm" style={{marginTop:10}} onClick={()=>goPay('me')}>Choose payment method</button>}</div>}
   {isOrg&&<>
    <div className="card"><div className="mute">Total group order</div><div className="big">{$(groupTotal)}</div><div className="mute">{members.length} joined · {subm.length} submitted · {members.length-subm.length} not submitted</div></div>
    <div className="h3">People ({members.length})</div>
     {members.map(p=><div className={'card click'+(p.id===uid?' mine':'')} key={p.id} onClick={()=>setOpen(open===p.id?null:p.id)}>
      <div className="row"><div className="av">{p.n[0]}</div><div className="sp"><b>{p.n}{p.org?' (organiser)':''}</b><div className="mute">{p.sub?$(owed(p))+' · '+(n=>n+' item'+(n===1?'':'s'))(p.items.reduce((s,i)=>s+i.q,0)):g.closed?'Missed the deadline':waitText(p)}</div>{!!p.sub&&freeOf(p)&&<div className="mute">+ Free {freeOf(p).free} (reward)</div>}</div><Icon n="chev" s={16}/></div>
      <div className="row" style={{marginTop:12,flexWrap:'wrap'}}>{p.sub?<Tag c="ok">Submitted</Tag>:g.closed?<Tag c="w">Missed</Tag>:<Tag>{p.items.length?'Ordering':'Not ordered yet'}</Tag>}{pstat(p)}<span className="sp"/>
       {p.id!==uid&&!g.closed&&!p.sub&&!p.org&&<button className="link" onClick={e=>{e.stopPropagation();remind(p,'order before '+g.deadline)}}>Remind</button>}{p.id!==uid&&!g.sent&&needsMethod(p)&&<button className="link" onClick={e=>{e.stopPropagation();remind(p,'choose a payment method before the order is sent')}}>Remind</button>}</div>
      {open===p.id&&<div className="expand">{p.items.length?p.items.map((i,k)=><div className="row" key={k}><span className="sp">{i.name}{optTxt(i.o)&&<div className="mute">{optTxt(i.o)}</div>}</span>× {i.q}</div>):<div className="mute">No items yet</div>}{!!p.sub&&freeOf(p)&&<div className="row"><span className="sp">{freeOf(p).free}<div className="mute">Free reward</div></span>× 1</div>}</div>}</div>)}
   </>}
   {!g.sent&&members.filter(p=>p.payFail&&p.id!==uid).map(p=><Ban key={'pf'+p.id} c="e">{'Payment declined for '+p.n+'. The order was not sent. '+p.n+' needs to choose another payment method.'}</Ban>)}
   {g.sent?<button className="btn" onClick={()=>setScr('done')}>View collection details</button>:isOrg&&<>
    {!g.closed&&<button className="btn ghost" style={{marginBottom:10}} onClick={()=>setSheet({k:'confirm',title:'Close ordering now?',msg:"Nobody will be able to submit or change an order after this, even if the deadline hasn't passed.",label:'Close ordering',action:()=>{closeEarly();setSheet(null)}})}>Close ordering early</button>}
    <button className="btn" disabled={!canSend} onClick={()=>{if(g.pay==='sponsor'){goPay('group')}else if(trySend())setScr('done')}}>{g.pay==='sponsor'?'Pay '+$(groupTotal)+' and send to outlet':'Send group order to outlet'}</button>
    {!canSend&&<div className="mute" style={{marginTop:8}}>{why}</div>}</>}
  </>)}

  {screen==='done'&&(!g.sent?<div className="card mute">The group order hasn't been sent to the outlet yet.</div>:<>
   <div className="hero" style={{textAlign:'center'}}><div className="mute">Group order</div><div className="big">#{g.gid}</div><div className="mute">Collection number <b>{g.coll}</b><br/>{collectionName} · {outlet.n}<br/>{g.slot} (locked) · about {outlet.w} preparation</div></div>
   {g.status==='ready'&&<Ban c="k">{isOrg?'Ready to collect. Tap below once you have it.':'The group order is ready. '+org.n+' will collect it.'}</Ban>}
   {g.status==='collected'&&<Ban c="k">Collected — Cherish points have been credited{g.pay==='sponsor'?' to '+org.n+', who paid for the group order.':' to everyone who submitted.'}</Ban>}
   <div className="card"><div className="tl">
    <div className="d">Sent to outlet</div>
    <div className="d">Preparing</div>
    <div className={g.status==='ready'||g.status==='collected'?'d':''}>Ready for collection</div>
    <div className={g.status==='collected'?'d':''}>Collected</div>
   </div></div>
   {isOrg&&g.status==='ready'&&<button className="btn" onClick={markCollected}>Mark as collected</button>}
   {isOrg?<>
    <div className="h3">Consolidated order</div>
    <div className="card">{Object.entries(tot).map(([k,t])=><div key={k} style={{padding:'6px 0'}}><div className="row"><b className="sp">{k}</b><b>× {t.q}</b></div>{Object.entries(t.v).filter(([o])=>optTxt(o)).map(([o,q])=><div className="mute" key={o}>{q} × {o}</div>)}</div>)}</div>
    <div className="h3">Who gets what</div>
    <div className="card">{subm.map(p=><div key={p.id} style={{padding:'8px 0'}}><b>{p.n}</b>{p.items.map((i,k)=><div className="mute" key={k}>{itemLine(i)}</div>)}{freeOf(p)&&<div className="mute">Free {freeOf(p).free} (reward)</div>}</div>)}</div>
   </>:<div className="card"><b>My items</b>{me.items.length?me.items.map((i,k)=><div className="mute" key={k}>{itemLine(i)}</div>):<div className="mute">No items</div>}{freeOf(me)&&<div className="mute">Free {freeOf(me).free} (reward)</div>}</div>}
   <div className="h3">Cherish points</div>
   <div className="mute" style={{marginBottom:8}}>{pointsInfo}</div>
   <div className="card">{earners.filter(p=>isOrg||p.id===uid).map(p=><div className="row" key={p.id} style={{padding:'4px 0'}}><span className="sp">{p.n}</span><b style={{color:'var(--ok)'}}>+ {g.status==='collected'?p.earned:earnOf(p)} points</b></div>)}{g.pay==='sponsor'&&!isOrg&&<div className="mute">{org.n} paid for this order, so {org.n} earns the points.</div>}<div className="mute" style={{marginTop:6}}>{g.pay==='sponsor'?(g.status==='collected'?'These points have been added to the organiser\'s account.':'The organiser earns points on the whole group order. They are credited once the order is marked collected.'):(g.status==='collected'?'These points have been added to each account.':'Points shown are what each person will get. They are credited once the organiser marks the order collected.')}</div></div>
   {isOrg&&<button className="btn ghost" onClick={saveGroup}>Save this group</button>}
   {isOrg&&g.status==='collected'&&<button className="btn" style={{marginTop:12}} onClick={newOrder}>Start a new group order</button>}
   <button className="btn ghost" style={{marginTop:12}} onClick={()=>setScr('repeat')}>View order history</button>
  </>)}

  {screen==='repeat'&&<>
   <div className="h3" style={{marginTop:0}}>Saved groups</div>
   {saved.map((s,i)=><div className="card" key={i}><div className="row">{ren===i?<input autoFocus defaultValue={s.name} onBlur={e=>{const v=e.target.value.trim();setSaved(a=>a.map((x,k)=>k===i&&v?{...x,name:v}:x));setRen(null)}}/>:<b className="sp">{s.name}</b>}{ren!==i&&<button className="link" onClick={()=>setRen(i)}>Rename</button>}</div>
    <div className="mute">{s.members.join(', ')}</div><button className="btn sm" style={{marginTop:10}} disabled={!isOrg} onClick={()=>startFrom(s)}>Start new order</button></div>)}
   <div className="h3">Previous group orders</div>
   {myHist.length===0&&<div className="card mute">No previous group orders yet. Your team orders will be listed here with the date, time and what you ordered.</div>}
   {myHist.map(h=>{const m=h.orders[uid];return <div className="card" key={h.id}>
    <div className="row"><b className="sp">{h.name}</b><Tag c={h.status==='collected'?'ok':'w'}>{STAT[h.status]}</Tag></div>
    <div className="mute" style={{marginTop:4}}><Icon n="clock" s={14}/> {fdt(h.at)}</div>
    <div className="mute"><Icon n="pin" s={14}/> {h.outlet} · pickup {h.slot}</div>
    <div className="mute">#{h.id} · {h.members.join(', ')}</div>
    <div className="expand"><b>What everyone ordered</b>{Object.entries(h.orders).map(([k,o])=><div key={k} style={{padding:'6px 0'}}><b>{USERS0[k].n}{+k===uid?' (you)':''}</b>{o.items.map((i,x)=><div className="row" key={x}><span className="sp mute">{itemLine(i)}</span>{(isOrg||+k===uid)&&<span>{$(i.p*i.q)}</span>}</div>)}{o.free&&<div className="mute">Free {o.free} (reward)</div>}</div>)}{!m&&<div className="mute" style={{marginTop:4}}>You didn't submit an order in this group.</div>}</div>
    <div className="row" style={{marginTop:10}}><button className="btn sm ghost" onClick={()=>setSheet({k:'hist',h})}>Details</button><button className="btn sm" disabled={!isOrg} onClick={()=>startFrom({name:h.name})}>Reuse group</button></div></div>})}
  </>}

  {screen==='wallet'&&<>
   {!g.live||!me.in||g.cancelled?<div className="card mute">{g.cancelled?'This group order was cancelled.':'Nothing to pay yet. Join or start a group order first.'}</div>:<div className="card">
    <div className="row"><b className="sp">{g.name}</b>{pstat(me)}</div>
    {declined&&<div style={{color:'var(--red)',fontWeight:700,fontSize:13,marginTop:6}}>Your payment was declined. Choose another payment method.</div>}
    <div className="big" style={{margin:'8px 0'}}>{$(g.pay==='sponsor'?(isOrg?groupTotal:0):me.sub?owed(me):0)}</div>
    <div className="mute">{g.pay==='sponsor'?(isOrg?(g.sent?'Charged when you sent the order.':'You pay once, when you send the order to the outlet.'):org.n+' is paying for everyone.'):!me.sub?'Submit your order to see what you owe.':g.sent?(me.paid?(isOrg?'Charged when you sent the order.':'Charged when the organiser sent the order.'):'Nothing to pay.'):owed(me)===0?'Nothing to pay.':me.pmeth?'Payment method: '+mName(me.pmeth,uid)+'. You are only charged when '+(isOrg?'you send':'the organiser sends')+' the order.':'Choose a payment method. You are only charged when '+(isOrg?'you send':'the organiser sends')+' the order.'}</div>
    {g.pay==='individual'&&me.sub&&!g.sent&&owed(me)>0&&<button className={'btn'+(me.pmeth?' ghost':'')} style={{marginTop:12}} onClick={()=>goPay('me')}>{me.pmeth?'Change payment method':'Choose payment method'}</button>}
    {g.pay==='sponsor'&&isOrg&&!g.sent&&<><button className="btn" style={{marginTop:12}} disabled={!canSend} onClick={()=>goPay('group')}>Pay {$(groupTotal)} and send to outlet</button>{!canSend&&<div className="mute" style={{marginTop:8}}>{why}</div>}</>}</div>}
   <div className="h3">Payment methods</div>
   {METHODS.map(k=><div key={k} className={'opt static'+((me.pmeth||'card')===k?' on':'')}><b>{mName(k,uid)}</b>{k==='card'&&<div className="mute">Default payment method</div>}</div>)}
   {g.sent&&me.in&&!!me.paid&&me.paidAmt>0&&<><div className="h3">Latest payment</div><div className="card"><div className="row"><Icon n="receipt"/><div className="sp"><b>{$(me.paidAmt)}</b><div className="mute">{fdt(g.sentAt)}<br/>{me.paidMeth}</div></div><Tag c="ok">Paid</Tag></div><div className="mute" style={{marginTop:10}}>{(g.pay==='sponsor'?subm.flatMap(p=>p.items):me.items).map(i=>i.name+(i.q>1?' ×'+i.q:'')).join(', ')}</div></div></>}
  </>}

  {screen==='rewards'&&<>
   <div className="hero" style={{textAlign:'center'}}><div className="mute">Cherish points</div><div className="big">{avail}</div></div>
   <div className="mute" style={{marginBottom:8}}>Rewards apply only to your own items. To use one, open My order in a group order and choose View eligible rewards.</div>
   {REWARDS.map(r=>{const okp=me.pts>=r.cost;return <div key={r.id} className={'opt static '+(okp?'':'dis')}><div className="row"><b className="sp">{r.t}</b>{okp&&<Tag c="ok">Eligible</Tag>}</div><div className="mute">{r.cost} points</div></div>})}
   <div className="h3">Points history</div>
   {me.hist.length===0?<div className="card mute">No activity yet. Points you earn or spend will show up here.</div>:
    me.hist.map((h,i)=><div className="card row" key={i}><div className="sp"><b>{h.note}</b><div className="mute">{new Date(h.at).toLocaleDateString([],{day:'numeric',month:'short'})} · {new Date(h.at).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})}</div></div><b style={{color:h.amt>=0?'var(--ok)':'var(--voucher)'}}>{h.amt>=0?'+ ':'− '}{Math.abs(h.amt)} points</b></div>)}
  </>}

  {screen==='more'&&<>
   <div className="card row"><div className="av"><Icon n="star"/></div><div className="sp"><b>{me.n}</b><div className="mute">Cherish account linked · {avail} points</div></div></div>
   {[['clock','Saved groups and previous orders',()=>setScr('repeat'),false],['bell','Notifications',()=>{markSeen();setScr('notifs')},hasNew],['gear','Demo controls',()=>setSheet({k:'demo'}),false],['door','Log out',()=>{setIdf('');setPwd('');setLoginErr('');setScr('login')},false]].map(([ic,l,f,dot])=><div className="card row click" key={l} onClick={f}><Icon n={ic}/><b className="sp">{l}</b>{dot&&<i className="dot-inline"/>}<Icon n="chev" s={16}/></div>)}
  </>}

  {screen==='notifs'&&<>{myNotes.length===0&&<div className="card mute">No notifications yet.</div>}{myNotes.map((n,i)=><div className="card row" key={i}><div className="em" style={{width:40,height:40}}><Icon n={n.i}/></div><div className="sp">{n.t}<div className="mute" style={{marginTop:2}}>{fdt(n.at)}</div></div></div>)}</>}
  </div>

  <div className="nav">{[['home','Home','home'],['order','Order','menu'],['pay','Pay','wallet'],['rewards','Rewards','rewards'],['more','More','more']].map(([k,l,to])=>
   <button key={k} className={tab===k?'on':''} onClick={()=>setScr(tab===k&&k==='order'?screen:to)}><Icon n={k} s={22}/>{l}</button>)}</div>

  {sheet&&<div className={"sheet-bg"+(sheet.k==='demo'?' bottom':'')} onClick={()=>setSheet(null)}><div className={"sheet"+(sheet.k==='demo'?' bottom':'')} onClick={e=>e.stopPropagation()}>
   {sheet.k==='item'&&<>
    <div className="row menu-card"><div className="em"><MenuImage item={sheet.m}/></div><div className="sp"><b style={{fontSize:18}}>{sheet.m.name}</b><div className="mute">{sheet.m.desc}</div></div></div>
    {sheet.m.set&&<><label className="l" htmlFor="set-drink">Drink</label><select id="set-drink" className="menu-select" value={sheet.drink} onChange={e=>setSheet({...sheet,drink:e.target.value})}>{SET_DRINKS.map(d=><option key={d.name} value={d.name}>{d.name}{d.extra?' (+ '+$(d.extra)+')':' (included)'}</option>)}</select></>}
    {(sheet.m.set||sheet.m.dr)&&<><label className="l">Sweetness</label><div className="chips">{['Normal','Less sweet','More sweet','Kosong'].map(d=><button key={d} className={'chip '+(sheet.sw===d?'on':'')} onClick={()=>setSheet({...sheet,sw:d})}>{d}</button>)}</div></>}
    <div className="row" style={{marginTop:18}}><div className="qty"><button onClick={()=>setSheet({...sheet,q:Math.max(1,sheet.q-1)})}>−</button><b>{sheet.q}</b><button onClick={()=>setSheet({...sheet,q:sheet.q+1})}>+</button></div>
    <button className="btn sp" onClick={addToCart}>Add to order · {$(itemPrice(sheet.m,sheet.drink)*sheet.q)}</button></div></>}
   {sheet.k==='rewards'&&<><b style={{fontSize:18}}>Your Cherish rewards</b><div className="mute" style={{marginBottom:10}}>Rewards apply only to your own items.</div>
    {REWARDS.map(r=>{const okp=me.pts>=r.cost,okm=sum(draft.items)>=r.min;return <div key={r.id} className={'opt '+(okp?'':'dis')} onClick={()=>{if(!okp)return;if(!okm){say('Spend '+$(r.min)+' or more to use '+r.t,1);return}setReward(r.id)}}><div className="row"><b className="sp">{r.t}</b>{okp&&<Tag c="ok">Eligible</Tag>}</div><div className="mute">{r.free?'Adds one free '+r.free+' · ':''}{r.cost} points{okp&&!okm?' · add '+$(r.min-sum(draft.items))+' more to your order to use it':''}</div></div>})}</>}
   {sheet.k==='slot'&&isOrg&&pending&&<><b style={{fontSize:20}}>Collection time and group size</b>
    <div className="mute" style={{margin:'6px 0 4px'}}>A smaller group can open up more pickup times.</div>
    {collectionModes}
    <div className="mute">Choose an available collection time, up to 24 hours ahead.</div>
    <label className="l">Group size</label>
    <div className="stepper"><button disabled={g.size<=Math.max(2,members.length)} onClick={()=>setG(x=>({...x,size:Math.max(2,members.length,x.size-1)}))} aria-label="Fewer people">−</button><div><b>{g.size}</b><div className="mute">people</div></div><button disabled={g.size>=MAXSIZE} onClick={()=>setG(x=>{if(x.size>=MAXSIZE){say(`A group order can have at most ${MAXSIZE} people`,1,1500);return x}return {...x,size:x.size+1}})} aria-label="More people">+</button></div>
    <label className="l">Collection time</label>
    <PickupChoices times={g.slotTimes} selected={g.slot} mode={g.collectionMode} available={t=>slotAvailable(t,Date.now(),true)} onPick={chooseSlot} id="change-pickup"/>
    {!slotAvailable(g.slot,Date.now(),true)&&<Ban c="e"><span style={{display:'block',marginTop:14}}>Pick an available future time that fits {g.size} people.</span></Ban>}
    {!g.slotTimes.some(t=>slotAvailable(t,Date.now(),true))&&<button className="btn ghost sm" onClick={()=>setG(x=>({...x,...slotSet(x.win),slot:'',slotGone:false,advanceQualified:false,advanceQualifiedAt:0,advanceDeadlineAt:0,advanceSlotAt:0}))}>Show new pickup times</button>}
    <button className="btn" style={{marginTop:22}} onClick={()=>setSheet(null)}>Done</button></>}
   {sheet.k==='hist'&&(()=>{const h=sheet.h,m=h.orders[uid],sponsor=h.pay==='sponsor',payer=sponsor&&isOrg;return <><b style={{fontSize:18}}>{h.name}</b>
    <div className="mute">#{h.id} · {fdt(h.at)}</div>
    {h.collectionMode&&<div className="mute">{h.collectionMode==='advance'?'Advance order':'Pickup'}</div>}
    <div className="mute">{h.outlet} · pickup {h.slot}{h.coll?' · collection '+h.coll:''}</div>
    <div className="mute">{STAT[h.status]} · {h.pay==='sponsor'?'Organiser paid for everyone':'Everyone paid for their own order'}</div>
    {h.pointsRate!=null&&<div className="mute">{h.pointsRate} Cherish points per $1 paid</div>}
    {h.multiplier!=null&&<div className="mute">{h.multiplier.toFixed(1)}× group points multiplier</div>}
    <div className="h3">Your order</div>
    {m?<>{m.items.map((i,k)=><div className="row" key={k} style={{padding:'4px 0'}}><span className="sp">{i.name}{optTxt(i.o)&&<div className="mute">{optTxt(i.o)}</div>}{i.q>1&&<div className="mute">× {i.q}</div>}</span>{$(i.p*i.q)}</div>)}{m.free&&<div className="row" style={{padding:'4px 0'}}><span className="sp">{m.free}<div className="mute">Free reward</div></span>{$(0)}</div>}
    </>:<div className="mute">You didn't submit an order in this group.</div>}
    {(m||payer)&&<>
     <div className="row" style={{marginTop:8,paddingTop:8,borderTop:'1px solid var(--line)'}}><b className="sp">{sponsor&&!isOrg?'Paid by '+USERS0[0].n:'You paid'}</b><b>{$(payer?(h.payer?.amount??h.total):sponsor?0:m.owed)}</b></div>
     {payer&&h.payer?.method&&<div className="mute">{h.payer.method}</div>}
     <div className="mute" style={{marginTop:4}}>{sponsor&&!isOrg?USERS0[0].n+' earned the points for this order':(payer?(h.payer?.earn??pointsFor(h.total)):m.earn)+' Cherish points earned'}</div>
    </>}
    <div className="h3">Who got what</div><div className="card">{Object.entries(h.orders).map(([k,o])=><div key={k} style={{padding:'6px 0'}}><b>{USERS0[k].n}{+k===uid?' (you)':''}</b>{o.items.map((i,x)=><div className="mute" key={x}>{itemLine(i)}</div>)}{o.free&&<div className="mute">Free {o.free} (reward)</div>}</div>)}{isOrg&&<div className="row" style={{marginTop:6}}><span className="sp mute">Group total</span><b>{$(h.total)}</b></div>}</div>
    {m&&<button className="btn" style={{marginTop:14}} onClick={()=>reorder(h)}>Reorder with changes</button>}</>})()}
   {sheet.k==='invite'&&<><div className="row"><Icon n="check" s={26}/><b style={{fontSize:18}}>Invite link copied</b></div>
    <div className="card mute" style={{marginTop:12,wordBreak:'break-all'}}>yakun.app/together/{g.gid}</div>
    <div className="h3" style={{marginTop:4}}>Group order right now</div>
    <div className="card"><b>{g.name}</b><div className="mute" style={{margin:'4px 0 8px'}}>Organiser {org.n} · Deadline {g.deadline}<br/>{collectionName} · {outlet.n} · collect at {g.slot}<br/>{g.pay==='sponsor'?org.n+' is paying for everyone':'Everyone pays for their own order'}</div>
     {members.map(p=><div key={p.id} style={{padding:'5px 0',borderTop:'1px solid var(--line)'}}><b>{p.n}</b> <span className="mute">{p.sub?lines(p):waitText(p)}</span></div>)}
     <div className="row" style={{marginTop:8}}><span className="sp mute">{subm.length}/{members.length} submitted</span><b>{$(groupTotal)}</b></div></div>
    </>}
   {sheet.k==='expired'&&<><div style={{textAlign:'center'}}><Icon n="clock" s={40}/><h2 className="ttl" style={{marginTop:8}}>Time is up</h2><div className="mute" style={{marginBottom:18}}>{subm.length} of {members.length} people submitted. What would you like to do?</div></div>{expiredBtns}</>}
   {sheet.k==='confirmPay'&&<><h2 className="ttl">Confirm payment</h2>
    <div className="card">{subm.flatMap(p=>p.items).map((i,k)=><div className="row" key={k} style={{padding:'4px 0'}}><span className="sp">{i.name}{i.q>1?' ×'+i.q:''}{optTxt(i.o)&&<div className="mute">{optTxt(i.o)}</div>}</span>{$(i.p*i.q)}</div>)}
     <div className="row" style={{marginTop:10,paddingTop:10,borderTop:'1px solid var(--line)'}}><span className="sp">Subtotal</span>{$(subm.reduce((s,p)=>s+sum(p.items),0))}</div>
     {subm.reduce((s,p)=>s+(sum(p.items)-owed(p)),0)>0&&<div className="row voucher"><span className="sp">Vouchers applied</span>− {$(subm.reduce((s,p)=>s+(sum(p.items)-owed(p)),0))}</div>}
     <div className="row" style={{marginTop:6,paddingTop:6,borderTop:'1px solid var(--line)'}}><b className="sp">Total</b><b>{$(groupTotal)}</b></div></div>
    <div className="opt on"><b>{mName(sel,uid)}</b></div>
    <div className="mute" style={{margin:'10px 0 8px'}}>{$(groupTotal)} will be charged to this payment method as the group order is sent to the outlet.</div>
    <div className="mute" style={{margin:'0 0 18px'}}>You will earn about <b>{earnOf(me)} Cherish points</b> for the whole group order when it is collected. Other members do not earn points on an order you pay for.</div>
    <button className="btn" onClick={()=>{setSheet(null);doPay()}}>Pay {$(groupTotal)} and send</button>
    <button className="btn ghost" style={{marginTop:10}} onClick={()=>setSheet(null)}>Back</button></>}
   {sheet.k==='confirm'&&<><h2 className="ttl">{sheet.title}</h2><div className="mute" style={{marginBottom:18}}>{sheet.msg}</div><button className="btn" onClick={sheet.action}>{sheet.label}</button><button className="btn ghost" style={{marginTop:10}} onClick={()=>setSheet(null)}>Cancel</button></>}
   {sheet.k==='cancel'&&<><h2 className="ttl">Cancel this group order?</h2><div className="mute" style={{marginBottom:18}}>Everyone's items are removed and the invite link stops working.</div><button className="btn" onClick={cancelOrder}>Cancel group order</button><button className="btn ghost" style={{marginTop:10}} onClick={()=>setSheet(null)}>Keep order</button></>}
   {sheet.k==='demo'&&<><b style={{fontSize:18}}>Demo controls</b><div className="mute">For presenting the prototype only.</div>
    <label className="l">Viewing as</label><div className="chips">{P.map(p=><button key={p.id} className={'chip '+(uid===p.id?'on':'')} onClick={()=>{setUid(p.id);setSheet(null);if(scr!=='login')setScr('home')}}>{p.n}{p.org?' (organiser)':''}</button>)}</div>
    <label className="l">Simulate</label>
    {[['Others submit their orders',othersDone],['Deadline passes',()=>{setG(x=>({...x,deadlineAt:Date.now()}));setSheet(null)}],
     [g.sold.length?'Milo is unavailable (tap to restore)':'Milo becomes unavailable',()=>{setG(x=>({...x,sold:x.sold.length?[]:[8]}));note(g.sold.length?'Milo is available again at '+outlet.n:'Milo is now unavailable at '+outlet.n,'alert');setSheet(null)}],
     ['Collection slot fills up',()=>{setG(x=>({...x,slotGone:true}));note(g.slot+' is no longer available','alert');setSheet(null)}],
     ['Advance order status (outlet)',()=>{advance();setSheet(null)}]].map(([t,f])=><button key={t} className="btn ghost sm" style={{width:'100%',marginBottom:8}} onClick={f}>{t}</button>)}
    <label className="l">Decline payment when the order is sent</label><div className="chips">{members.filter(p=>g.pay==='individual'||p.org).map(p=><button key={p.id} className={'chip '+(g.failFor.includes(p.id)?'on':'')} onClick={()=>setG(x=>({...x,failFor:x.failFor.includes(p.id)?x.failFor.filter(i=>i!==p.id):[...x.failFor,p.id]}))}>{p.n}{p.org?' (organiser)':''}</button>)}</div><div className="mute" style={{marginTop:6}}>Highlighted people have their payment declined once when the organiser sends the order (they must have submitted an order with an amount to pay). The order is not sent until they choose another method.</div>
    <label className="l">Invitation link</label><div className="chips">{['valid','expired','full'].map(v=><button key={v} className={'chip '+(g.inv===v?'on':'')} onClick={()=>setG(x=>({...x,inv:v}))}>{v}</button>)}</div>
    <button className="btn ghost sm" style={{width:'100%',marginTop:14}} onClick={()=>window.location.reload()}>Reset demo</button></>}
  </div></div>}
  {banner&&<div className="push" onClick={()=>{setBanners([]);markSeen();setScr('notifs')}}><Icon n={banner.i} s={18}/><div className="sp"><b>Ya Kun Together</b><div className="mute">{banner.t}</div></div></div>}
  {toast&&<div className={'toast'+(toast.mid?' mid':'')}>{toast.t}</div>}
 </div>;
}

export default App;
