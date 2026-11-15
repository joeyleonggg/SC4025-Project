# Improvement 06 — Advance-order points bonus

## Requirement

A07 implements the 10% advance-order incentive in Section 5.2, Table 4.3 and Section 4.4 of the latest report. Each person earns on their own actual payment after personal rewards. Group membership and expected capacity do not affect the rate.

## Calculation and rounding decision

- Ordinary pickup: floor(personal payment × 8).
- Qualifying advance order: floor(personal payment × 8 × 1.1).
- Amounts are normalised to cents. Round down once, after the complete calculation, including the bonus. This is the documented MVP interpretation because the report does not specify the rounding order.
- The bonus increases points; it does not reduce prices or add to the payment amount.

| Personal payment | Pickup points | Advance points |
| --- | --- | --- |
| $0.00 | 0 | 0 |
| $0.13 | 1 | 1 |
| $4.30 | 34 | 37 |
| $6.24 | 49 | 54 |
| $6.30 | 50 | 55 |

The $6.24 example distinguishes single rounding from rounding the base award first: the full advance result is 54, rather than floor(49 × 1.1) = 53.

## Eligibility and crediting

The cart and payment screen show the estimated points and bonus terms before submission. An advance order must originally qualify against its planned deadline and normally be sent at least two hours before collection. The approved one-time extension preserves original qualification through the extended deadline for the same collection time, even when less than two hours remain.

Switching to pickup removes the bonus. A changed collection time must qualify afresh. Once sending succeeds, the applied bonus is fixed on the order. Waiting until the collection time, or later, does not remove it.

No earned points are credited on submitting food, selecting a card or sending. Collection credits the final award once. An additional collection action cannot duplicate the award. Cancelling does not earn points. Personal reward redemption still spends its cost when sending; the bonus is calculated on the discounted personal payment.

History stores the baseline rate, applied bonus percentage and individual awards. Older recorded awards remain unchanged.

## Verification

All twelve automated collection/points checks and the production build passed. Checks cover:

- $6.30 pickup = 50 points, advance = 55 points.
- Fractional-dollar, zero-spend and single-rounding cases.
- Membership-independent estimates and separate personal rewards.
- A $2 reward on $6.30 yielding a $4.30 charge and 37 advance points, while Ben earns 55 on his undiscounted $6.30.
- The noon extension example retaining its 10% bonus and 55-point history award.
- Rates fixed at sending and retained even when collection happens a day later.
- No early credit, cancellation earning nothing and a repeated collection action adding nothing.
- Existing collection timing, capacity, replacement and extension checks.

From `frontend`, rerun:

```sh
npm run test:collection
npm run build
```

## Manual acceptance

1. Sign in as `maryng@yakun.demo`, password `kaya1234`.
2. Create a **Pickup** group and add a default Set A for $6.30. Confirm the estimate is 50 points.
3. For an **Advance order** group with a qualifying time, add the same set. Confirm 55 points and the 10% bonus terms appear in the cart and payment screen.
4. Invite more participants and join as each of them. Confirm the personal estimate stays 55.
5. Apply the $2 reward as Mary. Confirm her payable total is $4.30 and her estimate is 37 points; Ben's undiscounted $6.30 still earns 55.
6. Send, advance the mock outlet to ready, and mark collected. Confirm points were credited only at collection.
7. Open history and confirm the 10% bonus and personal award. Starting another group must not change the previous record.

The controlled-clock automated check covers the extension crossing the two-hour boundary without requiring a real wait.
