// Zero-dependency HTTP server (Node >= 18). Run: npm start  -> http://localhost:8000
import http from 'node:http';
import * as S from './store.js';

const PORT = process.env.PORT || 8000;
const send = (res, status, body) => {
  res.writeHead(status, {'Content-Type':'application/json',
    'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Headers':'Content-Type, Authorization',
    'Access-Control-Allow-Methods':'GET,POST,PUT,PATCH,DELETE,OPTIONS'});
  res.end(body === undefined ? '' : JSON.stringify(body));
};
const readBody = req => new Promise((ok, no) => { let d = ''; req.on('data', c => { d += c; if (d.length > 1e6) req.destroy(); });
  req.on('end', () => { try { ok(d ? JSON.parse(d) : {}); } catch { no(new S.HttpError(400, 'Invalid JSON')); } }); });

// [method, pattern, handler(ctx)]. ctx = {user, params, query, body}
const routes = [
  ['POST','/auth/cherish', c => S.login(c.body.email, c.body.password), false],
  ['GET','/me', c => S.publicUser(c.user)],
  ['GET','/users', () => S.listUsers()],
  ['GET','/menu', () => S.getMenu()],
  ['GET','/outlets', c => S.getOutlets(Number(c.query.get('groupSize')) || 1)],
  ['GET','/cherish/rewards', c => S.getRewards(c.user)],
  ['GET','/cherish/history', c => S.getPointsHistory(c.user)],
  ['POST','/groups', c => S.createGroup(c.user, c.body)],
  ['GET','/groups/:id', c => S.getGroup(c.user, c.params.id)],
  ['PATCH','/groups/:id', c => S.patchGroup(c.user, c.params.id, c.body)],
  ['POST','/groups/:id/join', c => S.joinGroup(c.user, c.params.id, c.body.inviteToken)],
  ['POST','/groups/:id/invitations', c => S.addMember(c.user, c.params.id, c.body.userId)],
  ['DELETE','/groups/:id/participants/:uid', c => S.removeMember(c.user, c.params.id, Number(c.params.uid))],
  ['POST','/groups/:id/leave', c => S.leaveGroup(c.user, c.params.id)],
  ['POST','/groups/:id/close-ordering', c => S.closeOrdering(c.user, c.params.id)],
  ['POST','/groups/:id/cancel', c => S.cancelGroup(c.user, c.params.id)],
  ['PUT','/groups/:id/orders/me', c => S.submitOrder(c.user, c.params.id, c.body)],
  ['POST','/groups/:id/pay', c => S.pay(c.user, c.params.id, c.body)],
  ['POST','/groups/:id/send', c => S.sendToOutlet(c.user, c.params.id)],
  ['POST','/groups/:id/collected', c => S.markCollected(c.user, c.params.id)],
  ['POST','/groups/:id/remind', c => S.remind(c.user, c.params.id, c.body)],
  ['GET','/groups/:id/status', c => S.getOrderStatus(c.user, c.params.id)],
  ['POST','/dev/groups/:id/outlet-status', c => S.setOutletStatus(c.params.id, c.body.status)],   // demo only
  ['GET','/group-orders/history', c => S.getHistory(c.user)],
  ['GET','/saved-groups', c => S.getSavedGroups(c.user)],
  ['POST','/saved-groups', c => S.saveGroup(c.user, c.body)],
  ['PATCH','/saved-groups/:id', c => S.saveGroup(c.user, {...c.body, id:Number(c.params.id)})],
  ['GET','/notifications', c => S.getNotifications(c.user)],
];
const compile = p => new RegExp('^' + p.replace(/:[a-z]+/g, '([^/]+)') + '$');
const table = routes.map(([m,p,h,auth=true]) => ({m, re:compile(p), keys:[...p.matchAll(/:([a-z]+)/g)].map(x => x[1]), h, auth}));

export const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') return send(res, 204);
    const url = new URL(req.url, 'http://x');
    let matched = false;
    for (const r of table){
      const mt = r.re.exec(url.pathname); if (!mt) continue; matched = true;
      if (r.m !== req.method) continue;
      const token = (req.headers.authorization || '').replace(/^Bearer /, '');
      const user = S.userFromToken(token);
      if (r.auth && !user) return send(res, 401, {error:'Log in with Ya Kun Cherish first'});
      const params = Object.fromEntries(r.keys.map((k,i) => [k, decodeURIComponent(mt[i+1])]));
      const body = ['POST','PUT','PATCH','DELETE'].includes(req.method) ? await readBody(req) : {};
      return send(res, 200, await r.h({user, params, query:url.searchParams, body}));
    }
    send(res, matched ? 405 : 404, {error: matched ? 'Method not allowed' : 'Not found'});
  } catch (e) {
    if (e instanceof S.HttpError) return send(res, e.status, {error:e.message});
    console.error(e); send(res, 500, {error:'Something went wrong'});
  }
});

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())){
  setInterval(S.tick, 1000).unref();          // server-side deadline enforcement
  server.listen(PORT, () => console.log(`Ya Kun Together API on http://localhost:${PORT}`));
}
