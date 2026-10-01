# Backend TODO for the teammate

The prototype (`frontend/`) is complete on the UI side and runs on **mock data held in React state**. Nothing is saved between page loads and nothing is enforced by a server. Make the **rules and data** behind the screens real.

Every place in the frontend that needs backend work is already marked `TODO(backend)` (23 in `src/App.jsx`, 23 in `src/api.js`). Search for it: `grep -rn "TODO(backend)" frontend/src`.

## What the backend must do (the "what", regardless of how you build it)

1. **Store data**: users and Cherish points, groups, members, each person's order, payment status, notifications, saved groups, past orders.
2. **Enforce group rules**
   - Group size 2 to 10; adding or joining beyond size is refused ("Group is full").
   - Only the organiser can add, remove, extend, close, cancel, send.
   - Invite link stops working once the order is sent or cancelled.
3. **Own the deadline**: ordering closes when time is up, not when the phone says so; reminders shortly before.
4. **Protect orders**: nobody can edit another person's order; participants must not see others' payment info (organiser sees paid / unpaid only).
5. **Price on the server**: recompute totals from the menu; never trust prices sent by the screen. Iced drinks add $0.60.
6. **Handle payment**: a participant only *selects a payment method* when submitting; **nothing is charged and no payment notification is sent until the organiser sends the order**. On send, charge each person their own amount (or the organiser the group total in "I pay for everyone" mode) and notify only that person. Block "send" while anyone in individual mode has no payment method.
7. **Handle rewards**: a voucher applies to the owner's own items only, needs enough points and minimum spend, and points are deducted only when the order is sent. Notifications are addressed to specific people (e.g. a reminder goes only to the person reminded; "reminder set" only to group members).
8. **Consolidate**: combine all submitted orders into one, keep each person's customisation, issue one collection number, keep the who-gets-what list.
9. **Credit points**: when the organiser marks collected, each person earns points on *their own* amount (currently $1 = 10 points).
10. **Outlet capacity**: a pickup slot is only valid if it fits the group size; re-check when sending.

## Suggested ways to build it (pick one)

- **A. In-app service layer (no server), recommended.** Put the rules above in `frontend/src/services/*.js` as plain functions and save to `localStorage`. `App.jsx` calls the services instead of changing state itself. A `BroadcastChannel` lets two browser tabs act as organiser and participant live.
- **B. Reuse `backend/`.** A working reference implementation of all ten points above (Node, no dependencies, `npm test` covers the full journey). Use it as a spec or port its `store.js` functions into option A.
- **C. Firebase / Supabase.** Real sync across devices, but this is an API in practice, so check first.

## Small things to add when doing the storage

- Persist everything until a **"Reset demo"** button is pressed (put the button in the demo panel: More > Demo controls, or the user switcher).
- Keep the demo panel actions (others submit, deadline passes, item sold out, slot full, payment failure) but make them call the same functions as real actions.
- Replace `ACCOUNTS` in `data.js` (client-side demo passwords) with a login check in the service layer; never ship real passwords.

## Definition of done

- Refreshing the page keeps the group, orders and points.
- Two tabs logged in as different users stay in sync (option A) or see each other's changes (options B/C).
- The tests in `backend/test/smoke.test.js` pass against your implementation.

## Invite link

The link shown by "Copy link" (`https://yakun.app/together/YT1024`) is only a **placeholder**. It cannot open in another browser because:
1. `yakun.app` is not a real address, and
2. the group exists only inside the organiser's browser tab (React state), so another browser has nothing to join.

To make it work, the teammate needs (a) shared storage for groups (server, Firebase/Supabase, or `BroadcastChannel` + `localStorage` for tabs of the SAME browser only), and (b) the app to read the group id and invite token from the URL (e.g. `?group=YT1024&t=abc123`) and open the Join screen after login. The reference `backend/` already models the token (`POST /groups/:id/join {inviteToken}`).

## Status wording

"Still choosing" is shown only for someone who already has items in their basket. A person who was just added shows "Not ordered yet".

## What is in `backend/` and how your teammate should use it

The `backend/` folder is a **finished reference implementation written as an HTTP API**. The frontend does not use it. Nothing in it is required for the project, and it is not the "in-app service layer" (option A). That option was only proposed; it was not built, because the backend is your teammate's job.

| File | What it is | If your teammate goes without an API |
|---|---|---|
| `src/store.js` | All the business rules as plain functions (group size, organiser-only actions, deadline, pricing, payment, rewards, consolidation, points). | **The valuable part.** Port these functions into `frontend/src/services/` and save to `localStorage`. |
| `src/seed.js` | Demo data: menu, outlets, rewards, 10 users. | Merge with `frontend/src/data.js` (the same data already exists there). |
| `src/server.js` | Turns `store.js` into HTTP endpoints. | **Delete** it; this is the "API" that is not needed. |
| `test/smoke.test.js` | A 14-step end-to-end test of the full journey. | Keep it as the checklist. Rewrite its `call(...)` helper to call the service functions instead of `fetch`. |