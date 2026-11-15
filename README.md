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
