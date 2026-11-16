# Report acceptance and evidence

Reference: SC4025_Group Project (1).docx and Yi Xiang's subsequent decisions. Acceptance date: 16 November 2026, Singapore. Branch: feature/group-presentation-updates. Application implementation through commit 007798a; later documentation/test/media commits identify the final handoff. The adjacent automated-checks.txt records the executed test names and result.

## Requirement results

| Requirement | Result | Evidence |
| --- | --- | --- |
| FR-01 group setup | Pass | 2–10 expected capacity, named invitation/acceptance, capacity recheck, countdown |
| FR-02 management | Pass with agreed extension rule | Removal, cancellation, early close, reminders and one full 15-minute extension |
| FR-03 menu/customisation | Pass | 74-item menu; full journey customises set drink, sweetness and quantity; stock failure/recovery |
| FR-04 submit/edit | Agreed interpretation | Draft edits are private until Submit/Update my order; regression checks confirm published totals |
| FR-05 personal payment | Pass | Personal cards, no early/partial charges, decline recovery, duplicate-send protection and correct receipts |
| FR-06 points/rewards | Pass with recorded rounding | 8 points/$; advance bonus 10%; personal discounts; no group multiplier; one collection credit |
| FR-07 collection | Pass with agreed exception | Pickup 15-minute / advance two-hour send rule; capacity/replacement; locked selection; approved extension exception |
| FR-08 consolidation | Agreed deviation | Combined quantities and who-gets-what remain after sending; per-person orders are visible to Mary before sending |
| FR-09 tracking/notifications | Pass | Sent/preparing/ready/collected; targeted reminders, timing/recipient checks and no stale delivery |
| FR-10 reuse/history | Pass | Owned saved groups, rename, pending invitations on reuse, current-price reorder and preserved old receipts |
| FR-11 access/privacy/errors | Pass within mock scope | Non-invited/removed users blocked; named failure/card privacy; clear full/expired/cancelled/sent errors |
| Governance consent | Pass | Joining disclosure; unchecked optional consent; per-account withdrawal |
| Governance retention | Pass under confirmed policy | Seven inactive days, scoped leaving cleanup, ownership, recent-record and balance preservation |

## Final journey and exceptions

The automated report journey runs Mary, Ben and Calvin through invitation acceptance, customisation, a personal reward, separate cards, sending, collection, points and saved reuse. It verifies a $21.70 total with personal payments $6.30 / $13.20 / $2.20 and advance awards 55 / 116 / 19. The simpler manual guide uses a $16.90 example for easier presentation checking.

Other checks cover full/expired invitations, unavailable Milo recovery, declined cards, cancellation after real timer expiry, private drafts, collection replacement, the exact noon extension example, automatic reminder timing, consent, retention and stale callback protection. These are automated functional checks, not a claim of cross-device or production-service testing.

## Decisions to carry into the report discussion

1. US-10 timing: full consolidation stays after sending, as approved.
2. US-04 wording: Update my order is the explicit publication step.
3. Advance exception: preserve original qualification through one approved 15-minute extension for the same collection slot.
4. Extension boundary: only one; full duration; cannot reach/pass collection.
5. Points: round down once after multiplying personal payment by 8 and, if applicable, 1.1.
6. Retention: seven inactive days; leaving clears active data and related saved membership but earlier receipts expire normally.
7. Demonstration architecture: same-tab state, simulated accounts/cards/outlets. No real backend, shared-device order state or marketing transmission.

## Handoff

[Manual test guide](../testing-guide.md) · [Architecture](../architecture/README.md) · [Section 4.5 captures](../report/4.5-wireframes.md) · [Video/script](../demo/README.md).

The repository owner still controls merging this branch and making the repository public for the report link. No repository visibility change is part of this handoff.
