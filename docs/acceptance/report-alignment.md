# Functional verification and implementation rules

This reference describes the implemented MVP, its functional coverage and prototype limitations. Automated evidence is recorded in [automated-checks.txt](automated-checks.txt). The suite contains 50 controlled-state and clock tests. This document describes application behaviour rather than certifying that every report statement has been validated.

## Functional coverage

| Requirement | Result | Evidence |
| --- | --- | --- |
| FR-01 group setup | Pass | 2–10 expected capacity, named invitation/acceptance, capacity recheck, countdown |
| FR-02 management | Implemented with one extension | Removal, cancellation, early close, reminders and one full 15-minute extension |
| FR-03 menu/customisation | Pass | 74-item menu. Full journey customises set drink, sweetness and quantity. Stock failure/recovery |
| FR-04 submit/edit | Explicit submission rule | Draft edits are private until Submit/Update my order. Regression checks confirm published totals |
| FR-05 personal payment | Pass | Personal cards, no early/partial charges, decline recovery, duplicate-send protection and correct receipts |
| FR-06 points/rewards | Pass with recorded rounding | 8 points/$. Advance bonus 10%. Personal discounts. No group multiplier. One collection credit |
| FR-07 collection | Implemented with extension exception | Pickup 15-minute / advance two-hour send rule. Capacity/replacement. Locked selection. One-time extension exception |
| FR-08 consolidation | Consolidation after sending | Combined quantities and who-gets-what remain after sending. Per-person orders are visible to Mary before sending |
| FR-09 tracking/notifications | Pass | Sent/preparing/ready/collected. Targeted reminders, timing/recipient checks and no stale delivery |
| FR-10 reuse/history | Pass | Owned saved groups, rename, pending invitations on reuse, current-price reorder and preserved old receipts |
| FR-11 access/privacy/errors | Pass within mock scope | Non-invited/removed users blocked. Named failure/card privacy. Clear full/expired/cancelled/sent errors |
| Governance consent | Pass | Joining disclosure. Unchecked optional consent. Per-account withdrawal |
| Governance retention | Implemented with seven-day policy | Seven inactive days, scoped leaving cleanup, ownership, recent-record and balance preservation |

## Final journey and exceptions

The automated report journey runs Mary, Ben and Calvin through invitation acceptance, customisation, a personal reward, separate cards, sending, collection, points and saved reuse. It verifies a $21.70 total with personal payments $6.30 / $13.20 / $2.20 and advance awards 55 / 116 / 19. The simpler manual guide uses a $16.90 example for easier presentation checking.

Other checks cover full/expired invitations, unavailable Milo recovery, declined cards, cancellation after real timer expiry, private drafts, collection replacement, the exact noon extension example, automatic reminder timing, consent, retention and stale callback protection. These are automated functional checks, not a claim of cross-device or production-service testing.

## Implementation rules

- Participants publish cart changes through Submit my order or Update my order.
- Full combined quantities and who-gets-what appear after successful sending.
- Advance slots reserve two hours beyond the planned deadline. One 15-minute extension preserves original qualification for the same collection slot through the extended deadline.
- An extension cannot reach or pass collection time. A changed collection slot must qualify afresh.
- Points round down once after applying the personal payment rate and any advance bonus.
- Completed history and saved groups expire after seven inactive days. Leaving clears active data and related saved membership, while earlier receipts remain until expiry.

## Prototype limitations

Application state lives in one browser tab and resets on refresh. Invitations use named demo accounts within that session. Payments, outlet responses and notifications are simulated. There is no backend API, shared multi-device order state or marketing transmission. Outlet capacities are mock values. Opening hours and time-dependent menu availability are not enforced. Some catalogue prices and supplements are estimates, documented in the menu reference. A full accessibility conformance audit has not been completed.

## References

[Manual test guide](../testing-guide.md) · [Architecture](../architecture/README.md) · [Screen catalogue](../report/4.5-wireframes.md) · [Menu assumptions](../improvements/03-menu-catalogue.md).
