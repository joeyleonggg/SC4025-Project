# Ya Kun Together — SC4025 project

A React/Vite presentation MVP for group ordering. Mary Ng organises the group; participants choose their own food, confirm their own mock cards and earn personal Cherish points after collection.

## Start the app

From the repository folder:

```sh
cd frontend
npm install
npm run dev
```

Open the local address printed by the terminal. Keep that terminal running. Stop it with Ctrl+C. There is no separate backend to start.

With the existing dependencies, these direct Node commands also work when npm is unavailable:

```sh
cd frontend
node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173 --strictPort
```

For a built preview:

```sh
npm run build
npm run preview
```

If the site cannot be reached, restart the server and use the exact address/port shown by its terminal. A closed terminal stops the local site.

## Demo accounts

All accounts use password **kaya1234**.

| Person | Email | Role | Default / alternative card endings |
| --- | --- | --- | --- |
| Mary Ng | maryng@yakun.demo | Organiser | 1111 / 8008 |
| Ben | ben@yakun.demo | Participant | 2222 / 8018 |
| Calvin | calvin@yakun.demo | Participant | 3333 / 8028 |

After signing in, use the name at the top right to switch users and open demo controls. Those controls simulate deadline expiry, unavailable Milo, a full collection slot, declined cards, outlet progress and retention expiry.

Everything is simulated in the current browser tab. Refresh restores fixtures. Invitation links open against this same running tab; another device or a fresh tab has no shared group data.

## Current behaviour

| Area | Implemented behaviour |
| --- | --- |
| Group setup | Expected capacity 2–10, never below joined membership; countdown and one full 15-minute extension |
| Invitations | Mary invites named accounts; each participant presses Join group. Saved groups send pending invitations to their listed members |
| Menu | 74 items, six categories, 73 supplied screenshot pictures, set-drink supplements, sweetness and quantities |
| Editing | Carts remain drafts until Submit my order / Update my order; participants cannot change someone else's items |
| Payment | Individual payments only for new orders; two saved mock cards per account; no charge until a successful send |
| Recovery | A decline leaves everyone uncharged. The affected person confirms the alternative card, then Mary retries. Duplicate sends cannot charge twice |
| Privacy | Mary sees payment status without other people's card details. Participants see their own cards, failures, reminders and receipts |
| Collection | Pickup has ASAP, three quick choices and a later dropdown. Advance mode reserves two hours beyond the planned deadline. Sending rechecks timing/capacity/stock and locks the selection |
| Extension | One extension per group; collection stays fixed. Original advance qualification is retained through that extended deadline; a changed time must qualify afresh |
| Points | Pickup: floor(personal payment after rewards × 8). Qualifying advance: floor(payment × 8 × 1.1). Round once; $6.30 earns 50 or 55 points. Credit once at collection |
| Reminders | At two minutes remaining, target each joined person's missing order or card. Closing early checks missing cards immediately; no duplicate automatic reminder for that person/kind/deadline |
| Consent | Joining disclosure plus separate marketing opt-in, unticked by default. Review/withdraw under More → Privacy and data. No marketing is sent |
| Retention | Seven inactive days for completed history and saved groups. Leaving clears active data and related saved membership; earlier receipts and unrelated records are preserved until expiry |
| Reuse | Owner-managed saved groups, rename/reuse and history reordering at current prices; old receipts keep their recorded values |

The full consolidation and who-gets-what view remains after sending, as agreed. Confirmed editing, the extension exception and single-rounding policy are recorded as report discussion points in the acceptance document.

## Test and demonstrate

Start with the [complete manual test guide](docs/testing-guide.md). It includes the exact actions and expected totals/points, plus short error/recovery tests.

From frontend:

```sh
npm run test:collection
npm run build
npm run check:mock
```

Direct equivalents when dependencies are already installed:

```sh
node --test tests/collection-flow.test.mjs
node node_modules/vite/bin/vite.js build
node scripts/export-mock-data.mjs --check
```

The controlled-clock checks cover multi-hour timing, reminders and seven-day expiry without real waits. See [acceptance results](docs/acceptance/report-alignment.md) for coverage and agreed deviations.

## Report and repository references

- [Implemented architecture and technology](docs/architecture/README.md), with [an insertable SVG diagram](docs/architecture/architecture.svg).
- [Backend boundary](backend/README.md) and [generated mock-data reference](backend/mock-data/README.md). The running application uses frontend/src/data.js; export reference snapshots with npm run export:mock after changing fixtures.
- [Section 4.5 screen captures and captions](docs/report/4.5-wireframes.md).
- [Demonstration video and script](docs/demo/README.md).
- [Requirement alignment and work checklist](docs/report-alignment-backlog.md).
- [Menu prices, picture sources and authorised estimates](docs/improvements/03-menu-catalogue.md).
- [Pickup rules](docs/improvements/04-pickup-times.md), [extension](docs/improvements/05-deadline-extension.md), [bonus](docs/improvements/06-advance-points.md), [card recovery](docs/improvements/07-payment-recovery.md), [privacy](docs/improvements/08-payment-privacy.md), [invitations](docs/improvements/09-invitations.md), [reminders](docs/improvements/10-automatic-reminders.md), [consent](docs/improvements/11-joining-consent.md) and [retention](docs/improvements/12-retention.md).

The latest report supersedes the earlier organiser-sponsored payment and group-size multiplier proposals. Legacy receipts retain their recorded awards. Some menu prices/supplements are authorised estimates. Outlet capacities are mock data; opening hours and real payments are outside this MVP. No dependency/security upgrade was added as part of these presentation changes.
