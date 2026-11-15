# Decision 01 — Individual payments for new group orders

## Current requirement

The latest report, FR-05, Table 4.3 and Section 4.4, limits the MVP to individual payments. This supersedes the earlier chat decision to retain organiser sponsorship.

## Behaviour

- New group creation shows an explanation that everyone pays for their own order, with no sponsorship selector.
- Creation enforces individual payment, including groups started from saved groups and reorders.
- Each participant selects their own saved mock card. Choosing it does not charge anything.
- Sending charges each participant only their submitted total after their own reward. A missing payment method or a declined payment blocks sending.
- The organiser sends the consolidated order without paying the other participants' totals.
- Historical sponsored receipts retain their original payer and amounts. Compatibility code for those records remains in the app.

Points calculation changes are tracked separately under A04 and A07; the current group-size multiplier is not changed by this payment update.

## Verification

A production build passed. Targeted checks of the actual React interaction handlers passed for creation (including stale sponsorship state), individual card selection with no immediate charge, three personal $6.30 charges on sending, current history and legacy sponsored receipt display. See the report-alignment backlog for delivery status.

## Manual acceptance steps

1. Refresh and sign in as `maryng@yakun.demo`, password `kaya1234`.
2. Create a group with a pickup time late enough for the ordering window. On **Ordering time and payment**, confirm the individual-payment explanation appears and there is no **I will pay for everyone** choice.
3. Add Ben and Calvin through **View group** and the demo controls.
4. Submit one default Set A at $6.30 as each of Mary, Ben and Calvin. Confirm each person's own saved card; no charge should appear yet.
5. As Mary, close ordering and send the group order. The group total is $18.90, but each person's **Pay** screen should show a $6.30 payment on their own card (1111, 2222 and 3333 respectively).
6. Mark the order collected and open each person's order history. Confirm **Everyone paid for their own order** and **You paid $6.30**.
7. Start another order from a saved group and confirm the same fixed individual-payment explanation.

All payment activity is simulated in browser state.
