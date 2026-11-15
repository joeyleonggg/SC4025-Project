# Improvement 02 — Eight points per dollar paid

## Current requirement

A04 implements FR-06 and US-08 from the latest report. It supersedes the earlier chat decision to increase points with group size. The advance-order bonus is a separate pending item, A07.

## Calculation

Points = floor(amount actually paid after personal rewards × 8).

Amounts are normalised to integer cents before calculating points. Rounding happens after multiplying by the point rate, rather than rounding down the dollar spend first.

| Personal payment | Points |
| --- | --- |
| $0.00 | 0 |
| $0.10 | 0 |
| $0.13 | 1 |
| $4.30 | 34 |
| $6.30 | 50 |
| $12.60 | 100 |

Adding participants or changing the expected capacity does not affect an individual's award. Personal reward discounts affect only that person's eligible payment.

## Interface and history

Group details show the rate. Cart, payment and collection screens use the same calculation. Sending spends any redeemed reward points, but earns no new points yet. Collection credits the earned points to each payer.

New history records store the rate and award. Previous recorded awards and legacy group-multiplier descriptions remain unchanged; they describe the rules used for those older orders.

## Manual review

1. Sign in as `maryng@yakun.demo`, password `kaya1234`, and create a group.
2. Add Ben and submit one default Set A for $6.30 as Mary. Confirm the estimate is 50 points.
3. Add Calvin and Dylan. Confirm Mary's estimate remains 50 points.
4. Confirm each person's payment method, close ordering and send. Earned points should not be credited yet.
5. Advance the outlet status and mark the order collected. Mary should receive 50 points.
6. Open the history details. Confirm the award is 50 points and the rate is 8 points per $1, with no new group multiplier.
7. In a fresh demo, apply the $2 discount reward to Mary's $6.30 order. Her $4.30 payment should earn 34 points; another person's undiscounted $6.30 order should still earn 50.

## Verification

The production build passed. Targeted checks of the actual React handlers passed for membership-independent estimates, personal reward isolation, no earned credit before collection, collection balances, archived rates and awards, and unchanged legacy history. Formula checks passed for zero spend and fractional-dollar rounding. Full results are recorded in the report-alignment backlog under A04.
