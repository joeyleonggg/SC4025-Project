# Individual payments for group orders

## Current requirement

New group orders use individual payments. Each participant pays for their own submitted items, as described by FR-05.

## Behaviour

- New group creation shows an explanation that everyone pays for their own order, with no sponsorship selector.
- Creation enforces individual payment, including groups started from saved groups and reorders.
- Each participant selects one of their own two saved mock cards. Choosing it does not charge anything. See [saved cards and decline recovery](07-payment-recovery.md).
- Sending charges each participant only their submitted total after their own reward. A missing payment method or a declined payment blocks sending.
- The organiser sends the consolidated order without paying the other participants' totals.
- Historical sponsored receipts retain their original payer and amounts. Compatibility code for those records remains in the app.

Points are based on personal payment rather than group size. See the [baseline points calculation](02-group-points.md) and [advance-order bonus](06-advance-points.md).

## Verification

A production build passed. Targeted checks of the actual React interaction handlers passed for creation (including stale sponsorship state), individual card selection with no immediate charge, three personal $6.30 charges on sending, current history and legacy sponsored receipt display. See [functional verification](../acceptance/report-alignment.md) for the overall coverage.

## Manual acceptance steps

1. Refresh and sign in as `maryng@yakun.demo`, password `kaya1234`.
2. Create a group with a pickup time late enough for the ordering window. On **Ordering time and payment**, confirm the individual-payment explanation appears and there is no **I will pay for everyone** choice.
3. Invite Ben and Calvin through **View group**, then switch to each account and choose **Join group**.
4. Submit one default Set A at $6.30 as each of Mary, Ben and Calvin. Confirm each person's own saved card. No charge should appear yet.
5. As Mary, close ordering and send the group order. The group total is $18.90, but each person's **Pay** screen should show a $6.30 payment on their own card (1111, 2222 and 3333 respectively).
6. Mark the order collected and open each person's order history. Confirm **Everyone paid for their own order** and **You paid $6.30**.
7. Start another order from a saved group and confirm the same fixed individual-payment explanation.

All payment activity is simulated in browser state.
