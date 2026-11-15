# Ya Kun Together (SC4025 group project)

## How to run the frontend

All commands below are run in a terminal.

**Step 1: Go into the project folder.**
Open a terminal in the folder where you cloned this repository.

**Step 2: Go into the `frontend` folder.**

```
cd frontend
```

**Step 3: Install the dependencies.**

```
npm install
```

**Step 4: Start the application.**

```
npm run dev
```

**Step 5: Open the application.**
The terminal prints a link such as `http://localhost:XXXX`. Open it in your browser, the app is shown inside a phone frame.

To stop the app, press `Ctrl + C` in the terminal.

## Demo accounts and controls

Sign in as `maryng@yakun.demo` with password `kaya1234` to use the organiser account. The participant account `ben@yakun.demo` uses the same password.

After signing in, select the name at the top right to switch demo users or simulate deadlines, stock changes, full pickup slots, declined payments and outlet status updates.

Orders, card charges and account balances are simulated in the browser. Refreshing resets the demo.

## Payment scope

Everyone pays for their own submitted items using their selected mock card. Choosing a card does not charge it: each person's payment is charged when the organiser sends the group order to the outlet. Missing payment methods or declined payments block sending.

The latest report (FR-05, Table 4.3 and Section 4.4) supersedes the earlier decision to offer organiser sponsorship. New groups, including those created from saved groups, use individual payments. Older sponsored receipts remain readable.

See [the payment decision and test steps](docs/improvements/01-payment-choice.md).

## Loyalty points

For ordinary pickup, each person earns 8 Cherish points per $1 actually paid after their personal reward discount, rounded down to whole points. A $6.30 payment earns 50 points; a $4.30 payment earns 34 points. Group membership and capacity do not change the award.

Points are credited only when the organiser marks the order collected. New receipts record the baseline rate and earned points. Older recorded awards and group multipliers remain intact in history.

This follows FR-06 and US-08 in the latest report and supersedes the earlier group-size multiplier. Qualifying advance orders now earn 10% extra points, rounded down once after the full calculation.

See [the points calculation and test steps](docs/improvements/02-group-points.md).

## Pickup and advance orders

Choose **Pickup** for ASAP, three quick times and the later-time dropdown, or **Advance order** for later collection with at least two hours of preparation time. Choices account for the ordering window. ASAP means approximately 15–20 minutes after ordering closes.

Pickup requires at least 15 minutes from sending; advance orders normally require at least two hours. The app validates creation, replacement and sending against the timing and mock capacity rules. Next-day choices show Singapore dates, and sending locks the mode, outlet and collection time. History retains the chosen mode and time.

One 15-minute extension per group preserves original advance qualification through the extended deadline, without changing collection time. Qualifying advance orders receive a 10% points bonus, preserved during that extension. Outlet opening hours are not modelled. The scheduling horizon remains 24 hours.

See [collection rules and manual test steps](docs/improvements/04-pickup-times.md). From `frontend`, rerun the automated collection checks with `npm run test:collection` and build with `npm run build`.

## Deadline extension

Mary can extend once per group by a full 15 minutes. Collection stays unchanged. Originally qualifying advance orders can still be sent during the extension even after crossing the normal two-hour boundary. Changing the collection time requires fresh qualification, and an extension cannot reach or pass collection.

See [the extension rules, noon example and test steps](docs/improvements/05-deadline-extension.md). Automated checks run with `npm run test:collection` from `frontend`.

## Advance-order points bonus

Qualifying advance orders earn 10% extra points on each person's actual payment after rewards. Round down once after multiplying the payment by 8 and 1.1: $6.30 earns 55 points, while ordinary pickup earns 50. Group size does not change the rate.

The cart and payment screen explain eligibility before submission. The applied bonus is fixed when the organiser sends, preserved through the approved extension exception, and credited once at collection. History records the bonus and personal award. Cancelling earns no points.

See [the formula, eligibility and test steps](docs/improvements/06-advance-points.md). From `frontend`, rerun `npm run test:collection` and `npm run build`.

## Saved cards and declined payments

Each demo account has two saved mock cards. If sending is declined, nobody is charged. The affected person confirms their alternative card, then the organiser retries. Declined cards remain unavailable for that order.

Successful sending charges each person's own total once. Personal receipts and history retain the selected card. Mary has cards ending 1111 and 8008; Ben has 2222 and 8018. All cards and charges are simulated.

See [the payment recovery guide and test steps](docs/improvements/07-payment-recovery.md). From `frontend`, rerun `npm run test:collection` and `npm run build`.

## Payment status privacy

Mary can see each participant's payment readiness or decline, without their card details. Each participant sees their own payment status, cards, decline notifications and receipts. Other participants do not see a named failure or another person's card details.

Switching demo accounts clears temporary payment messages and receipts. Payment simulation controls show participants only their own account; Mary can simulate the group members' payments.

See [the visibility rules and manual test steps](docs/improvements/08-payment-privacy.md). From `frontend`, rerun `npm run test:collection` and `npm run build`.

## Invitations and joining

Mary invites named accounts through **Group → Invite people**. Switch to the invited participant, open the invitation from Home or **Order → View invitation**, then select **Join group**. Inviting someone does not join them automatically. Saved groups invite only their listed members.

Non-invited accounts cannot join. Removed members need a fresh invitation; people who leave can rejoin while ordering is open and there is room. Full, expired, closed, cancelled and sent invitations explain the problem.

Links point to this app and open the invitation in the same running demo tab. New tabs, refreshes and other devices have no shared order state. Clipboard failures offer the link for manual copying instead of reporting success.

See [the invitation flow and test steps](docs/improvements/09-invitations.md). From `frontend`, rerun `npm run test:collection` and `npm run build`.
