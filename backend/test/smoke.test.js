// End-to-end smoke test of the full MVP journey against a real HTTP server. Run: npm test
import assert from 'node:assert/strict';
import {server} from '../src/server.js';

await new Promise(r => server.listen(0, r));
const base = 'http://localhost:' + server.address().port;
const call = async (method, path, token, body) => {
  const res = await fetch(base + path, {method, headers:{'Content-Type':'application/json', ...(token ? {Authorization:'Bearer ' + token} : {})}, body: body ? JSON.stringify(body) : undefined});
  const text = await res.text(); return {status:res.status, body: text ? JSON.parse(text) : null};
};
const ok = async (...a) => { const r = await call(...a); assert.equal(r.status, 200, `${a[0]} ${a[1]} -> ${r.status} ${JSON.stringify(r.body)}`); return r.body; };
const login = async n => (await ok('POST','/auth/cherish',null,{email:n+'@yakun.demo',password:'kaya1234'})).token;
let passed = 0; const t = async (name, fn) => { await fn(); passed++; console.log('  ok -', name); };

const T = {}; for (const n of ['alex','ben','calvin','dylan','eve','farah','gareth','huimin','irfan','jiawei']) T[n] = await login(n);
const ids = {alex:0,ben:1,calvin:2,dylan:3,eve:4,farah:5,gareth:6,huimin:7,irfan:8,jiawei:9};

await t('auth: wrong password rejected, no token -> 401', async () => {
  assert.equal((await call('POST','/auth/cherish',null,{email:'alex@yakun.demo',password:'x'})).status, 401);
  assert.equal((await call('GET','/me')).status, 401);
});
await t('browse catalogue WITHOUT any group (menu, outlets, rewards)', async () => {
  assert.equal((await ok('GET','/menu',T.ben)).length, 8);
  assert.equal((await ok('GET','/outlets?groupSize=5',T.ben)).length, 3);
  assert.equal((await ok('GET','/cherish/rewards',T.ben)).length, 3);
});
const outlets = await ok('GET','/outlets?groupSize=10',T.alex);
const slotAt = outlets[0].slots.find(s => s.available).at;
let g;
await t('create group with Ben, Calvin, Dylan (size 5, not Eve)', async () => {
  g = await ok('POST','/groups',T.alex,{name:'Marketing Breakfast',deadlineMinutes:10,outletId:1,slotAt,size:5,payMode:'individual',memberIds:[1,2,3]});
  assert.equal(g.members.length, 4); assert.ok(!g.members.some(m => m.name === 'Eve'));
  assert.ok(g.inviteUrl);
});
await t('non-member cannot read the group; Eve is added by organiser', async () => {
  assert.equal((await call('GET',`/groups/${g.id}`,T.eve)).status, 403);
  g = await ok('POST',`/groups/${g.id}/invitations`,T.alex,{userId:4});
  assert.equal(g.members.length, 5);
  assert.equal((await ok('GET',`/groups/${g.id}`,T.eve)).members.length, 5);
});
await t('group full at size, then grows to the 10-person maximum', async () => {
  assert.equal((await call('POST',`/groups/${g.id}/invitations`,T.alex,{userId:5})).status, 409);
  assert.equal((await call('PATCH',`/groups/${g.id}`,T.alex,{size:11})).status, 400);
  g = await ok('PATCH',`/groups/${g.id}`,T.alex,{size:10});
  for (const id of [5,6,7,8,9]) g = await ok('POST',`/groups/${g.id}/invitations`,T.alex,{userId:id});
  assert.equal(g.members.length, 10);
});
await t('only organiser can add/remove/close', async () => {
  assert.equal((await call('POST',`/groups/${g.id}/invitations`,T.ben,{userId:5})).status, 403);
  assert.equal((await call('POST',`/groups/${g.id}/close-ordering`,T.ben)).status, 403);
});
await t('remove Jia Wei and Irfan before submission; invite link joins Irfan back', async () => {
  await ok('DELETE',`/groups/${g.id}/participants/9`,T.alex,{});
  await ok('DELETE',`/groups/${g.id}/participants/8`,T.alex,{});
  const token = new URL((await ok('GET',`/groups/${g.id}`,T.alex)).inviteUrl).searchParams.get('t');
  assert.equal((await call('POST',`/groups/${g.id}/join`,T.irfan,{inviteToken:'wrong'})).status, 410);
  assert.equal((await ok('POST',`/groups/${g.id}/join`,T.irfan,{inviteToken:token})).members.length, 9);
});
await t('participants order, prices are recomputed server-side, rewards stay personal', async () => {
  await ok('PUT',`/groups/${g.id}/orders/me`,T.alex,{items:[{id:1,option:'Kopi O, less sweet',qty:1,price:0.01}]});
  await ok('PUT',`/groups/${g.id}/orders/me`,T.ben,{items:[{id:2,option:'Teh',qty:1}]});
  const calvin = await ok('PUT',`/groups/${g.id}/orders/me`,T.calvin,{items:[{id:1,option:'Kopi O, iced',qty:1}]});
  const me = calvin.members.find(m => m.name === 'Calvin'); assert.equal(me.owed, 5.8);            // 5.20 + 0.60 iced
  const alexView = await ok('GET',`/groups/${g.id}`,T.alex); assert.equal(alexView.members[0].owed, 5.2);   // client price ignored
  assert.equal((await call('PUT',`/groups/${g.id}/orders/me`,T.calvin,{items:[{id:1,qty:1}],rewardId:'r3'})).status, 409);  // needs 500 pts + $10
  const dylan = await ok('PUT',`/groups/${g.id}/orders/me`,T.dylan,{items:[{id:1,option:'Kopi',qty:2},{id:2,option:'Teh',qty:1}],rewardId:'r3'});
  assert.equal(dylan.members.find(m => m.name === 'Dylan').owed, 11);                       // 10.4+5.6-5
  const benView = await ok('GET',`/groups/${g.id}`,T.ben);
  assert.equal(benView.members.find(m => m.name === 'Dylan').items, undefined);              // others' orders hidden
  assert.equal(benView.members.find(m => m.name === 'Dylan').paid, undefined);               // and payment info
});
await t('payment: failure path, then success; edit invalidates stale authorisation', async () => {
  assert.equal((await call('POST',`/groups/${g.id}/pay`,T.ben,{failNext:true})).status, 402);
  assert.equal((await ok('POST',`/groups/${g.id}/pay`,T.ben,{})).status, 'authorised');
  await ok('PUT',`/groups/${g.id}/orders/me`,T.ben,{items:[{id:2,option:'Teh',qty:2}]});
  assert.equal((await ok('GET',`/groups/${g.id}`,T.alex)).members.find(m => m.name === 'Ben').paid, false);
  await ok('POST',`/groups/${g.id}/pay`,T.ben,{});
  for (const n of ['alex','calvin','dylan']) await ok('POST',`/groups/${g.id}/pay`,T[n],{});
});
await t('cannot send before ordering closes; unpaid/unsubmitted handled', async () => {
  assert.equal((await call('POST',`/groups/${g.id}/send`,T.alex)).status, 409);
  await ok('POST',`/groups/${g.id}/close-ordering`,T.alex);
  assert.equal((await call('PUT',`/groups/${g.id}/orders/me`,T.eve,{items:[{id:1,qty:1}]})).status, 409);  // closed
});
let sent;
await t('send consolidates one order, spends reward points, locks details', async () => {
  sent = await ok('POST',`/groups/${g.id}/send`,T.alex);
  assert.equal(sent.status, 'preparing'); assert.ok(sent.collectionNo);
  assert.equal(sent.consolidated.find(c => c.name === 'Kaya Toast Set').qty, 4);   // Alex 1 + Calvin 1 + Dylan 2
  assert.equal(sent.distribution.length, 4);
  assert.equal((await ok('GET','/me',T.dylan)).points, 20);                          // 520 - 500
  assert.equal((await call('PATCH',`/groups/${g.id}`,T.alex,{size:6})).status, 409);   // locked
});
await t('outlet ready -> organiser collects -> each person earns points on their own order', async () => {
  assert.equal((await call('POST',`/groups/${g.id}/collected`,T.alex)).status, 409);
  await ok('POST',`/dev/groups/${g.id}/outlet-status`,T.alex,{status:'ready'});
  await ok('POST',`/groups/${g.id}/collected`,T.alex);
  assert.equal((await ok('GET','/me',T.alex)).points, 340 + 52);                     // $5.20 -> 52
  assert.equal((await ok('GET','/me',T.calvin)).points, 90 + 58);                     // $5.80 -> 58
  assert.equal((await ok('GET','/me',T.ben)).points, 260 + 112);                     // 2 x $5.60 -> 112
  assert.ok((await ok('GET','/notifications',T.alex)).some(n => /ready/.test(n.text)));
  assert.equal((await ok('GET','/group-orders/history',T.ben)).length, 1);
});
await t('invite link stops working after completion; cancel path; deadline enforced by server', async () => {
  const token = new URL(sent.inviteUrl || 'https://x/?t=old').searchParams.get('t');
  assert.equal((await call('POST',`/groups/${g.id}/join`,T.jiawei,{inviteToken:token})).status, 410);
  const g2 = await ok('POST','/groups',T.alex,{name:'Quick',deadlineMinutes:0,outletId:2,slotAt:(await ok('GET','/outlets?groupSize=2',T.alex))[1].slots[0].at,size:2,memberIds:[1]});
  assert.equal((await call('PUT',`/groups/${g2.id}/orders/me`,T.ben,{items:[{id:6,qty:1}]})).status, 409);   // deadline already passed
  await ok('POST',`/groups/${g2.id}/cancel`,T.alex);
  assert.equal((await call('POST',`/groups/${g2.id}/join`,T.jiawei,{inviteToken:'x'})).status, 410);
});
await t('saved groups: list, save, rename', async () => {
  assert.equal((await ok('GET','/saved-groups',T.alex)).length, 3);
  const s = await ok('POST','/saved-groups',T.alex,{name:'Sprint Crew',memberIds:[1,4]});
  assert.equal((await ok('PATCH',`/saved-groups/${s.id}`,T.alex,{name:'Sprint Team'})).name, 'Sprint Team');
});
console.log(`\n${passed} test groups passed`); server.close();
