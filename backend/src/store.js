// In-memory store. Swap for SQLite/Postgres later: every function below is the only place that touches data.
import {USERS, SAVED_GROUPS, MENU, OUTLETS, REWARDS, MAXSIZE, SLOT_OFFSETS_MIN} from './seed.js';
import {randomBytes} from 'node:crypto';

export class HttpError extends Error { constructor(status, message){ super(message); this.status = status; } }
const fail = (status, message) => { throw new HttpError(status, message); };

const users = new Map(USERS.map(u => [u.id, structuredClone(u)]));
const sessions = new Map();             // token -> userId
const groups = new Map();               // id -> group
const notifications = new Map();        // userId -> [{id,text,at,read}]
const saved = structuredClone(SAVED_GROUPS);
let groupSeq = 1024, payRef = 1, noteSeq = 1;
export const reset = () => { groups.clear(); sessions.clear(); notifications.clear(); groupSeq = 1024; payRef = 1;
  for (const u of USERS) users.set(u.id, structuredClone(u)); };

const now = () => Date.now();
const round2 = n => Math.round(n * 100) / 100;
const lineTotal = items => round2(items.reduce((s,i) => s + i.price * i.qty, 0));
const money = n => '$' + n.toFixed(2);

// ---------- notifications ----------
export function notify(userId, text){
  const list = notifications.get(userId) || [];
  list.unshift({id:noteSeq++, text, at:now(), read:false});
  notifications.set(userId, list);
}
const notifyGroup = (g, text, exceptId) => g.members.forEach(m => m.userId !== exceptId && notify(m.userId, text));

// ---------- auth ----------
export function login(email, password){
  const u = [...users.values()].find(x => x.email === String(email||'').trim().toLowerCase());
  if (!u || u.password !== password) fail(401, 'Incorrect email, mobile number or password.');
  const token = randomBytes(16).toString('hex');
  sessions.set(token, u.id);
  return {token, user: publicUser(u)};
}
export const userFromToken = token => { const id = sessions.get(token); return id === undefined ? null : users.get(id); };
export const publicUser = u => ({id:u.id, name:u.name, points:u.points});
export const listUsers = () => [...users.values()].map(u => ({id:u.id, name:u.name}));

// ---------- catalogue ----------
export const getMenu = () => MENU;
export function slotTimes(base = now()){
  const rounded = Math.ceil(base / 300000) * 300000;
  return SLOT_OFFSETS_MIN.map(m => rounded + m * 60000);
}
// Slots are offered relative to "now" rounded to 5 min, so tolerate one rounding step between listing and booking.
const slotIndex = at => [now(), now()-300000].map(b => slotTimes(b).indexOf(at)).find(i => i >= 0) ?? -1;
export function getOutlets(groupSize = 1){
  const slots = slotTimes();
  return OUTLETS.map(o => ({id:o.id, name:o.name, waitMin:o.waitMin,
    slots: slots.map((at,i) => ({at, capacity:o.caps[i], available:o.caps[i] >= groupSize}))}));
}
export const getRewards = user => REWARDS.map(r => ({...r, eligible: user.points >= r.cost}));

// ---------- groups ----------
function refreshDeadline(g){
  // The SERVER owns the deadline (frontend README). Lazily close on every read/write, plus the interval in server.js.
  if (!g.closed && !g.cancelled && !g.sent && now() >= g.deadlineAt){
    g.closed = true; g.closedReason = 'deadline';
    notifyGroup(g, 'Ordering closed: time is up');
  }
  if (!g.closed && !g.reminded && !g.cancelled && g.deadlineAt - now() <= 120000){
    g.reminded = true;
    g.members.filter(m => !m.submitted).forEach(m => notify(m.userId, '2 minutes left to submit your order'));
  }
  return g;
}
export const tick = () => groups.forEach(refreshDeadline);
const memberOf = (g, userId) => g.members.find(m => m.userId === userId);
function mustGroup(id){ const g = groups.get(String(id)); if (!g) fail(404, 'Group not found'); return refreshDeadline(g); }
function mustMember(g, user){ const m = memberOf(g, user.id); if (!m) fail(403, 'You are not in this group'); return m; }
function mustOrganiser(g, user){ if (g.organiserId !== user.id) fail(403, 'Only the organiser can do this'); }
const open = g => { if (g.cancelled) fail(410, 'This group order was cancelled'); if (g.sent) fail(409, 'The group order was already sent to the outlet'); };
const freeOf = m => { const r = REWARDS.find(x => x.id === m.rewardId); return r && r.free ? r.free : null; };
const owed = (g, m) => {
  const r = REWARDS.find(x => x.id === m.rewardId);
  return Math.max(0, round2(lineTotal(m.items) - (r ? r.value : 0)));
};

// What each caller may see. Participants never receive other people's payment info; organiser sees status only.
function view(g, user){
  const isOrg = g.organiserId === user.id;
  const invitable = !g.sent && !g.cancelled;
  return {
    id:g.id, name:g.name, organiserId:g.organiserId, size:g.size, payMode:g.payMode,
    outletId:g.outletId, slotAt:g.slotAt, slotLocked:g.sent, deadlineAt:g.deadlineAt,
    status: g.cancelled ? 'cancelled' : g.sent ? g.status : g.closed ? 'closed' : 'open',
    inviteUrl: invitable && isOrg ? `https://yakun.app/together/${g.id}?t=${g.inviteToken}` : undefined,
    collectionNo: g.collectionNo,
    members: g.members.map(m => ({
      userId:m.userId, name:users.get(m.userId).name, submitted:m.submitted,
      // own items always; others' items only for the organiser (needed for the distribution view)
      items: (isOrg || m.userId === user.id) ? m.items : undefined,
      paid: (isOrg || m.userId === user.id) ? m.paid : undefined,
      owed: (isOrg || m.userId === user.id) ? owed(g, m) : undefined,
      rewardId: m.userId === user.id ? m.rewardId : undefined,
      // the organiser sees who claimed a free item (for distribution); price-deduction vouchers stay private
      free: (isOrg || m.userId === user.id) ? freeOf(m) || undefined : undefined})),
    groupTotal: isOrg ? round2(g.members.filter(m => m.submitted).reduce((s,m) => s + owed(g,m), 0)) : undefined,
    everyoneReady: isOrg ? g.members.length > 0 && g.members.every(m => m.submitted && (g.payMode === 'sponsor' || m.paid)) : undefined};
}

export function createGroup(user, {name, deadlineMinutes = 10, outletId, slotAt, size = 5, payMode = 'individual', memberIds = []}){
  if (!String(name||'').trim()) fail(400, 'Group name is required');
  if (!['individual','sponsor'].includes(payMode)) fail(400, 'payMode must be individual or sponsor');
  if (size < 2 || size > MAXSIZE) fail(400, `Group size must be between 2 and ${MAXSIZE}`);
  const outlet = OUTLETS.find(o => o.id === outletId); if (!outlet) fail(400, 'Unknown outlet');
  const idx = slotIndex(slotAt);
  if (idx < 0) fail(400, 'Choose one of the offered pickup times');
  if (outlet.caps[idx] < size) fail(409, 'That pickup time is full for your group size');
  const ids = [...new Set(memberIds)].filter(id => id !== user.id && users.has(id));
  if (ids.length + 1 > size) fail(409, `Group is full (${size})`);
  const id = String(groupSeq++);
  const g = {id, name:name.trim(), organiserId:user.id, size, payMode, outletId, slotAt, slotIdx:idx, deadlineAt: now() + deadlineMinutes*60000,
    inviteToken: randomBytes(6).toString('hex'), members:[user.id, ...ids].map(uid => ({userId:uid, items:[], submitted:false, paid:false, paidAmt:0, rewardId:null})),
    closed:false, cancelled:false, sent:false, status:'open', reminded:false, collectionNo:null, createdAt:now()};
  groups.set(id, g);
  ids.forEach(uid => notify(uid, `${user.name} invited you to ${g.name}`));
  return view(g, user);
}
export const getGroup = (user, id) => { const g = mustGroup(id); mustMember(g, user); return view(g, user); };

export function joinGroup(user, id, token){
  const g = mustGroup(id);
  if (g.cancelled || g.sent || token !== g.inviteToken) fail(410, 'This invitation link is invalid or has expired.');
  if (memberOf(g, user.id)) return view(g, user);
  if (g.members.length >= g.size) fail(409, `This group is full (${g.members.length}/${g.size}).`);
  g.members.push({userId:user.id, items:[], submitted:false, paid:false, paidAmt:0, rewardId:null});
  notify(g.organiserId, `${user.name} joined ${g.name}`);
  return view(g, user);
}
// Organiser adds someone directly (the "Add Eve" button on the Order > Group screen).
export function addMember(user, id, userId){
  const g = mustGroup(id); mustOrganiser(g, user); open(g);
  if (g.closed) fail(409, 'Ordering is closed');
  if (!users.has(userId)) fail(404, 'User not found');
  if (memberOf(g, userId)) fail(409, 'Already in the group');
  if (g.members.length >= g.size) fail(409, `Group is full (${g.members.length}/${g.size}). Raise the group size first.`);
  g.members.push({userId, items:[], submitted:false, paid:false, paidAmt:0, rewardId:null});
  notify(userId, `${user.name} added you to ${g.name}`);
  return view(g, user);
}
export function removeMember(user, id, userId){
  const g = mustGroup(id); mustOrganiser(g, user); open(g);
  if (userId === g.organiserId) fail(400, 'The organiser cannot be removed');
  if (!memberOf(g, userId)) fail(404, 'Not a member');
  g.members = g.members.filter(m => m.userId !== userId);
  notify(userId, `You were removed from ${g.name}`);
  return view(g, user);
}
export function leaveGroup(user, id){
  const g = mustGroup(id); open(g);
  if (user.id === g.organiserId) fail(400, 'The organiser cannot leave; cancel the group instead');
  mustMember(g, user);
  g.members = g.members.filter(m => m.userId !== user.id);
  notify(g.organiserId, `${user.name} left ${g.name}`);
  return {left:true};
}
export function patchGroup(user, id, {extendMinutes, size, slotAt}){
  const g = mustGroup(id); mustOrganiser(g, user); open(g);
  if (extendMinutes){ g.deadlineAt = Math.max(g.deadlineAt, now()) + extendMinutes*60000; g.closed = false; g.reminded = false;
    notifyGroup(g, 'Deadline extended'); }
  if (size !== undefined){
    if (size > MAXSIZE || size < g.members.length) fail(400, `Group size must be between ${g.members.length} and ${MAXSIZE}`);
    g.size = size; }
  if (slotAt !== undefined || size !== undefined){
    const at = slotAt ?? g.slotAt, idx = slotAt === undefined ? g.slotIdx : slotIndex(at), o = OUTLETS.find(x => x.id === g.outletId);
    if (idx < 0 || o.caps[idx] < g.size) fail(409, 'That pickup time is full for your group size');
    g.slotAt = at; g.slotIdx = idx; }
  return view(g, user);
}
export function closeOrdering(user, id){
  const g = mustGroup(id); mustOrganiser(g, user); open(g);
  g.closed = true; g.closedReason = 'organiser';
  notifyGroup(g, `Ordering closed early by ${user.name}`, user.id);
  return view(g, user);
}
export function cancelGroup(user, id){
  const g = mustGroup(id); mustOrganiser(g, user); open(g);
  g.cancelled = true; g.closed = true; g.inviteToken = null;
  notifyGroup(g, `${g.name} was cancelled`, user.id);
  return view(g, user);
}

// ---------- ordering ----------
export function submitOrder(user, id, {items = [], rewardId = null}){
  const g = mustGroup(id); const m = mustMember(g, user); open(g);
  if (g.closed) fail(409, 'Ordering is closed');
  if (!items.length) fail(400, 'Add at least one item');
  // Never trust client prices: re-price from the menu.
  const priced = items.map(i => {
    const menu = MENU.find(x => x.id === i.id); if (!menu) fail(400, 'Unknown menu item');
    const qty = Math.floor(i.qty); if (!(qty >= 1 && qty <= 20)) fail(400, 'Quantity must be 1-20');
    const iced = /iced/i.test(i.option || '') && (menu.set || menu.drink);
    return {id:menu.id, name:menu.name, option:i.option || 'As served', qty, price: round2(menu.price + (iced ? 0.6 : 0))};
  });
  let reward = null;
  if (rewardId){
    reward = REWARDS.find(r => r.id === rewardId); if (!reward) fail(400, 'Unknown reward');
    if (user.points < reward.cost) fail(409, 'Not enough Cherish points');
    if (lineTotal(priced) < reward.minSpend) fail(409, `Spend at least ${money(reward.minSpend)} to use this reward`);
  }
  const before = owed(g, m);
  m.items = priced; m.rewardId = reward ? reward.id : null;
  const after = owed(g, m);
  if (m.paid && Math.abs(m.paidAmt - after) > 0.001){ m.paid = false; m.paidAmt = 0; }   // stale authorisation
  const first = !m.submitted; m.submitted = true;
  if (g.payMode === 'sponsor') m.paid = true;
  notify(g.organiserId, `${user.name} ${first ? 'submitted' : 'updated'} an order`);
  return view(g, user);
}
export function pay(user, id, {failNext = false} = {}){
  const g = mustGroup(id); const m = mustMember(g, user); open(g);
  if (g.payMode !== 'individual') fail(409, 'The organiser is paying for everyone');
  if (!m.submitted) fail(409, 'Submit your order first');
  if (failNext) fail(402, 'Payment failed. The payment was declined. Try another method or try again.');
  const amt = owed(g, m);
  m.paid = true; m.paidAmt = amt;                       // AUTHORISATION only; captured in sendToOutlet
  return {ref:`PAY-P${String(payRef++).padStart(5,'0')}`, amount:amt, status:'authorised'};
}
export function sendToOutlet(user, id){
  const g = mustGroup(id); mustOrganiser(g, user); open(g);
  if (!g.closed) fail(409, 'Close ordering first');
  const subm = g.members.filter(m => m.submitted);
  if (!subm.length) fail(409, 'No orders have been submitted');
  if (g.payMode === 'individual' && subm.some(m => !m.paid)) fail(409, `${subm.filter(m => !m.paid).length} payment(s) still outstanding`);
  const o = OUTLETS.find(x => x.id === g.outletId);
  if (o.caps[g.slotIdx] < g.size) fail(409, 'Pickup time no longer available. Choose another time.');
  g.sent = true; g.status = 'preparing'; g.collectionNo = 'C-' + String(groupSeq % 1000).padStart(3,'0');
  // Capture happens now: spend the reward points, drop members who never submitted.
  g.members = subm;
  subm.forEach(m => { const r = REWARDS.find(x => x.id === m.rewardId), u = users.get(m.userId);
    if (r){ u.points -= r.cost; u.history.unshift({amt:-r.cost, note:r.title + ' reward', at:now()}); }
    m.paid = true; });
  notifyGroup(g, `Group order submitted. Collect at ${new Date(g.slotAt).toLocaleTimeString('en-SG',{hour:'numeric',minute:'2-digit'})}`);
  return consolidated(g, user);
}
export function consolidated(g, user){
  const totals = {};
  g.members.filter(m => m.submitted).forEach(m => m.items.forEach(i => {
    const t = totals[i.name] || (totals[i.name] = {name:i.name, qty:0, options:{}});
    t.qty += i.qty; t.options[i.option] = (t.options[i.option] || 0) + i.qty; }));
  // A free reward (Free kopi) adds one item at $0.00; it is not a price deduction.
  g.members.filter(m => m.submitted).forEach(m => { const f = freeOf(m); if (!f) return;
    const t = totals[f] || (totals[f] = {name:f, qty:0, options:{}}); t.qty += 1; t.options['Free reward'] = (t.options['Free reward'] || 0) + 1; });
  return {...view(g, user), consolidated:Object.values(totals),
    distribution: g.organiserId === user.id ? g.members.filter(m => m.submitted).map(m => ({name:users.get(m.userId).name, items:m.items, free:freeOf(m) || undefined})) : undefined};
}
export function getOrderStatus(user, id){
  const g = mustGroup(id); mustMember(g, user);
  if (!g.sent) fail(409, 'The group order has not been sent yet');
  return consolidated(g, user);
}
export function setOutletStatus(id, status){       // simulates the outlet (demo only)
  const g = mustGroup(id);
  if (!g.sent) fail(409, 'Not sent yet');
  if (!['preparing','ready'].includes(status)) fail(400, 'status must be preparing or ready');
  g.status = status;
  if (status === 'ready') notifyGroup(g, 'Your group order is ready for collection');
  return {status};
}
export function markCollected(user, id){
  const g = mustGroup(id); mustOrganiser(g, user);
  if (!g.sent || g.status !== 'ready') fail(409, 'The order is not ready yet');
  g.status = 'collected';
  // Each person earns points on THEIR OWN order only.
  g.members.forEach(m => { const earn = Math.floor(owed(g, m) * 10), u = users.get(m.userId);
    m.earned = earn; u.points += earn; u.history.unshift({amt:earn, note:'Ya Kun Together · ' + g.name, at:now()}); });
  g.finishedAt = now();
  return consolidated(g, user);
}
export function remind(user, id, {userId, type = 'order'}){
  const g = mustGroup(id); mustOrganiser(g, user); open(g);
  const m = memberOf(g, userId); if (!m) fail(404, 'Not a member');
  notify(userId, type === 'payment' ? 'Payment reminder: your order is waiting for payment' : 'Reminder: please submit your order before the deadline');
  return {sent:true};
}

// ---------- history, saved groups, notifications ----------
export function getHistory(user){
  return [...groups.values()].filter(g => g.status === 'collected' && memberOf(g, user.id)).map(g => ({
    id:'YT' + g.id, name:g.name, total:round2(g.members.reduce((s,m) => s + owed(g,m), 0)),
    members:g.members.map(m => users.get(m.userId).name), mine:memberOf(g, user.id).items}));
}
export const getSavedGroups = user => saved.filter(s => s.ownerId === user.id).map(s => ({...s, memberNames:s.members.map(id => users.get(id).name)}));
export function saveGroup(user, {name, memberIds = [], id}){
  if (id){ const s = saved.find(x => x.id === id && x.ownerId === user.id); if (!s) fail(404, 'Saved group not found');
    if (name?.trim()) s.name = name.trim(); return s; }
  if (!String(name||'').trim()) fail(400, 'Name is required');
  if (saved.some(s => s.ownerId === user.id && s.name === name.trim())) fail(409, 'Already saved');
  const s = {id: Math.max(0, ...saved.map(x => x.id)) + 1, ownerId:user.id, name:name.trim(), members:memberIds.filter(x => x !== user.id)};
  saved.push(s); return s;
}
export const getNotifications = user => notifications.get(user.id) || [];
export const getPointsHistory = user => users.get(user.id).history;
