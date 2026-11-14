# Improvement 02 — Group points multiplier

## Requirement

Use a base rate of 8 Cherish points per $1 paid. Each additional group member increases the multiplier by 0.1, starting at 1.0 for one member.

## Calculation

Points equal the amount paid multiplied by 8 and the group multiplier, rounded down to a whole point after the full calculation.

| Members | Multiplier | Points on a $5.20 payment |
| --- | --- | --- |
| 1 | 1.0× | 41 |
| 2 | 1.1× | 45 |
| 3 | 1.2× | 49 |
| 4 | 1.3× | 54 |
| 10 | 1.9× | 79 |

The member count includes the organiser and people added to or joined to the group, including people who have yet to submit items. The chosen group capacity does not determine the multiplier.

Each individual payer earns points on their own payment after reward discounts. If the organiser pays for everyone, the organiser earns points on the entire group payment. Points are credited when the order is collected.

## Interface and history

Group details, cart estimates, payment and collection screens show the active multiplier. Estimates update when membership changes. Membership is locked when the order is sent. Archived orders retain their multiplier and calculated points.

## Verification

Targeted component flow checks passed for the following scenarios.

- Formula calculations for 1 through 10 members, zero spend and rounding.
- Adding members updates a $5.20 estimate from 45 to 49 to 54 points for 2, 3 and 4 members.
- Added members count even before submitting food.
- Collection credits points to the appropriate payer.
- Starting another group preserves the previous order's multiplier and points in history.
- Organiser payment works with and without the organiser submitting their own food.

The production build passed.

## Manual review

1. Start a new group with individual payments and add Ben.
2. Submit one default $5.20 Kaya Toast Set as Alex. Confirm an estimate of 45 points and a 1.1× multiplier.
3. Add Calvin, then Dylan. Check that the estimate changes to 49 points at 1.2×, then 54 points at 1.3×.
4. Close ordering, send the order, advance its outlet status and mark it collected.
5. Confirm Alex receives 54 points. Open history details and confirm the 1.3× multiplier and 54 earned points.
