# Improvement 08 — Payment status privacy

## Requirement

A09 aligns the demo with FR-05, FR-11 and Section 5.5: payment status is visible to the organiser and the affected participant; personal saved cards, card-specific errors and receipts belong to that participant.

## Visibility

| Information about Ben | Mary | Ben | Calvin |
| --- | --- | --- | --- |
| Missing payment method, readiness or decline | Yes | Yes | No |
| Ben's saved or charged card ending | No | Yes | No |
| Named decline notice for Ben | Yes, without card details | Own decline wording | No |
| Card-specific decline notification | No | Yes | No |
| Recovery notification | Yes, without card details | Own confirmation | No |
| Ben's personal receipt card | No | Yes | No |

Group membership, collection details and ordinary group progress remain visible as before.

## Changes

- The Status screen's named decline banners are organiser-only. Payment-status rendering also checks whether the viewer is the organiser or the person concerned.
- Existing targeted notifications retain their intended audience: the affected participant receives the card-specific decline; Mary receives the status summary without card details. Recovery goes to Mary and charge notifications go to each payer separately.
- Brief messages belong to the account that triggered them. Switching demo users clears those messages and temporary payment errors, selections and receipts.
- Participants' demo decline controls show only their own account. Mary can simulate any group member's decline. The bulk **Others submit their orders** control is organiser-only because its summary can mention another person's payment readiness.
- Personal Pay screens and historical receipt cards remain limited to the current person's details, including after successful recovery.

This is role-based presentation within the existing single-browser mock demo. The account-switching control remains available for the presentation.

## Verification

All seventeen automated checks and the production build passed. New privacy checks cover:

1. Ben's missing method and targeted reminder from Mary, Ben and Calvin's views.
2. Ben's decline and recovery across Home, Group, Status, My order, Pay, notifications, transient messages, receipts and history. Immediate user switching is checked without allowing the transient-message timer to expire.
3. User-specific payment simulation controls and clearing temporary private UI state when switching accounts.

Existing card recovery, collection timing, extension and points checks continue to pass. From `frontend`:

```sh
npm run test:collection
npm run build
```

## Manual acceptance

1. Sign in as `maryng@yakun.demo`, password `kaya1234`. Create a group and invite Ben and Calvin. Switch to each participant and choose **Join group**, then submit and confirm each person's own card.
2. As Mary, simulate Ben's decline under the top-right demo controls. Close ordering and send.
3. Mary should see that Ben's payment declined, with no Ben card details in Status or notifications.
4. Switch immediately to Calvin. Check Home, Status, My order, Pay and notifications: there should be no named Ben failure, Ben card number or leftover decline popup. Calvin's own cards and status may appear.
5. Switch to Ben. His own Status/Pay should show the decline, and his notification should identify his own declined card.
6. Confirm Ben's alternative card. Mary should see payment ready and receive a recovery notice without the card number. Calvin should receive no Ben recovery notice.
7. Send and collect. Check each person's Pay receipt and history: each sees their own charged card, with no other member's card details.
8. In demo controls as Calvin, confirm only Calvin appears under the decline simulation section. The separate user-switching section still lists the demo accounts.
