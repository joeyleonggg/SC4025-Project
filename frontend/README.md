# Ya Kun Together (frontend prototype)

Lives in `frontend/`. The API it will talk to is in `../backend` (see that README for endpoints).

React + Vite, mobile-app look in the browser.

```
npm install
npm run dev
```

Open the printed URL (on desktop it shows in a phone frame).

- Data is mocked in `src/data.js` (10 demo people, Alex is the organiser); state is local in `src/App.jsx`.
- Demo logins: `alex@yakun.demo`, `ben@`, `calvin@`, `dylan@`, `eve@`, `farah@`, `gareth@`, `huimin@`, `irfan@`, `jiawei@` (password `kaya1234`).
- Search the project for `TODO(backend)` to find every spot needing an API. Endpoint stubs are in `src/api.js`.
- Demo tip: tap the avatar circle at the top right of the phone to switch between organiser and participants and to trigger errors (payment failure, sold-out item, full slot, expired invite).

## Connecting to the backend

A working reference backend now exists in `../backend` (`npm start`, port 8000). It implements every stub below.
The frontend is still on mock data, so wiring is the remaining step: replace each stub with a `fetch()` to `VITE_API_BASE`.

### Original notes for the backend split

`src/api.js` is the contract between this frontend and the backend — every function it exports is a stub
that currently throws "not implemented." Your teammate's job is to build a server with matching endpoints and
then replace each stub with a real `fetch()` call. Suggested split:

1. **Auth** — `loginWithCherish`, `getMe`. Ya Kun Cherish SSO, session token, points balance.
2. **Catalogue** — `getMenu`, `getOutlets`, `getRewards`. Mostly read-only lookups; could be static/seeded data at first.
3. **Group lifecycle** — `createGroup`, `getGroup`, `joinGroup`, `removeParticipant`, `updateDeadline`,
   `closeOrdering`, `cancelOrder`, `leaveGroup`, `saveGroup`, `getHistory`, `getSavedGroups`. This is the
   core of the app — a `groups` table/collection plus a `participants` table keyed by group.
4. **Ordering & payment** — `submitOrder`, `pay`, `closeGroup` (consolidates orders, sends one order to the
   outlet, credits points), `getOrderStatus`.
5. **Notifications** — `getNotifications`, `remind`. A simple `notifications` table is enough for MVP; push
   delivery (web push / FCM) can come later.

Two things worth agreeing on early, since they touch both sides:
- **Real-time status.** The Track/Status screen and the deadline countdown need to reflect what other people
  are doing. Simplest MVP is polling `GET /groups/:id` every few seconds; a nicer version uses WebSockets or
  Server-Sent Events so the countdown and "who's submitted" list update instantly. The frontend only reads
  `g.deadlineAt` and `people` state — swap the mock timers for whichever transport you pick.
- **The deadline is server-owned.** Right now the browser's own clock closes ordering and fires the "2 minutes
  left" reminder (see the `useEffect` in `App.jsx` marked `TODO(backend)`). In production the server should be
  the source of truth (so it can't be beaten by changing your phone's clock), and should push the "closed" and
  "reminder" events to clients.

`.env.example` has `VITE_API_BASE` for the backend's base URL once it exists.

## Adding real Ya Kun photos

Menu items currently show a plain line icon instead of a photo — real photos weren't included here for two
reasons: this environment has no internet access to fetch and bundle image files, and using someone else's
hotlinked photos of a branded product risks copyright/IP issues for a report. To add your own (e.g. photos
your team takes, or ones Ya Kun makes available for coursework use):

1. Drop the image files into `public/images/` (create the folder if it doesn't exist).
2. In `src/data.js`, set the `img` field on the matching `MENU` item, e.g.
   `{id:1, ..., img:'/images/kaya-toast.jpg'}`.
3. That's it — the menu card and the item sheet both already check for `img` and use it instead of the icon.
