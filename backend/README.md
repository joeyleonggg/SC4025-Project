# Ya Kun Together: backend

Zero-dependency Node API (Node 18+). No `npm install` needed. Data is in memory and resets when the server restarts.

```
npm start      # http://localhost:8000
npm test       # 14-step end-to-end test of the full MVP journey
```

All routes except `POST /auth/cherish` need `Authorization: Bearer <token>`. Demo login: `alex@yakun.demo` / `kaya1234` (also ben, calvin, dylan, eve, farah, gareth, huimin, irfan, jiawei).

| Frontend stub (`frontend/src/api.js`) | Endpoint |
|---|---|
| loginWithCherish / getMe | `POST /auth/cherish`, `GET /me` |
| getMenu / getOutlets / getRewards | `GET /menu`, `GET /outlets?groupSize=`, `GET /cherish/rewards` (all work with no group) |
| createGroup / getGroup | `POST /groups`, `GET /groups/:id` |
| joinGroup | `POST /groups/:id/join {inviteToken}` |
| add a person (Order > Group > Add people) | `POST /groups/:id/invitations {userId}` |
| removeParticipant / leaveGroup | `DELETE /groups/:id/participants/:uid`, `POST /groups/:id/leave` |
| updateDeadline / group size / pickup time | `PATCH /groups/:id {extendMinutes,size,slotAt}` |
| closeOrdering / cancelOrder | `POST /groups/:id/close-ordering`, `POST /groups/:id/cancel` |
| submitOrder | `PUT /groups/:id/orders/me {items,rewardId}` |
| pay | `POST /groups/:id/pay` (authorisation only) |
| sendToOutlet | `POST /groups/:id/send` (consolidates, locks slot, spends reward points) |
| getOrderStatus / markCollected | `GET /groups/:id/status`, `POST /groups/:id/collected` (credits points per person) |
| remind | `POST /groups/:id/remind {userId,type}` |
| getHistory / getSavedGroups / saveGroup | `GET /group-orders/history`, `GET/POST /saved-groups`, `PATCH /saved-groups/:id` |
| getNotifications | `GET /notifications` |
| (demo only) outlet marks order ready | `POST /dev/groups/:id/outlet-status {status:"ready"}` |

Rules enforced server-side: max 10 people; only the organiser can add/remove/close/send; prices are recomputed from the menu (client prices ignored); rewards apply to the owner's own items only; participants never see others' orders or payment state; the deadline closes ordering on the server; invite links die once the order is sent or cancelled.

Not built (out of MVP scope): a real database, real Cherish SSO and payment gateway, push delivery (notifications are stored and fetched by polling).
