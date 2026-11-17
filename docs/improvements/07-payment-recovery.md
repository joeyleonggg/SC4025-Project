# Saved mock cards and decline recovery

## Requirement

This feature supports FR-05 and US-06–US-07. Every demo account has two saved mock cards. Each person chooses their own card, and the group remains unsent until all required payment methods are ready.

## Demo cards

| Account | Default card ending | Alternative card ending |
| --- | --- | --- |
| Mary Ng | 1111 | 8008 |
| Ben | 2222 | 8018 |
| Calvin | 3333 | 8028 |

The remaining demo accounts also have two cards. These are mock identifiers. No real card details or transactions are used.

## Behaviour

- **Pay** lists the current user's two cards. The payment chooser retains their selected card when reopened.
- Choosing or confirming a card does not charge it.
- A simulated decline stops the entire send attempt before anyone is charged or spends reward points. The affected person's selection is cleared and the declined card is unavailable for that order.
- The affected person chooses and confirms the alternative card. Their status returns to payment ready, and the organiser can retry.
- The successful send records each person's own payment amount and selected card. A repeated send action cannot duplicate the charges, notifications or reward redemption.
- The personal Pay receipt and new history details show the actual selected card, including after another group is started.
- A new group resets its card selection and declined-card flags. Existing receipt data stays recorded.
- If both saved mock cards are deliberately declined, sending remains blocked. The demo explains that it must be reset to try again. It does not silently reuse a declined card.

Payment status and failure messages are limited to their intended viewers. See [payment status privacy](08-payment-privacy.md) for the visibility rules and checks.

## Verification

All fourteen automated checks and the production build passed. Added payment checks cover:

- Mary, Ben and Calvin confirming their own cards with no charge before sending.
- Ben's default card declining, nobody being charged, and retry staying blocked until recovery.
- The declined card staying unavailable and the alternative choice surviving reopening.
- Successful retry charging Mary $6.30, Ben $12.60 and Calvin $6.30 once each.
- A repeated original send action causing no duplicate charge or new failure.
- Ben's personal receipt and history retaining card 8018, and new-group flags resetting.
- Mary selecting her alternative card after her own decline, and deliberately exhausting both cards remaining blocked.

Existing collection, extension and points checks continue to pass. From `frontend`:

```sh
npm run test:collection
npm run build
```

## Manual acceptance

1. Sign in as `maryng@yakun.demo`, password `kaya1234`. Create a group with a suitable collection time and invite Ben and Calvin. Switch to each person, open their invitation and choose **Join group**.
2. As each person, submit a default Set A and confirm their default saved card. Confirm there are two card choices and no charge yet.
3. Switch back to Mary. In the top-right **Demo controls**, under **Decline payment when the order is sent**, select Ben. Dismiss the controls, close ordering and send.
4. Confirm the order was not sent. Open Pay as each person and confirm no latest charge was created.
5. As Ben, open **Pay**, then **Choose payment method**. Card 2222 should be unavailable. Select card 8018 and confirm it.
6. Reopen the chooser and confirm 8018 remains selected. Return to Mary and retry sending from Status.
7. Each person's Pay screen should show their own $6.30 payment, with Ben charged on 8018. Mary should not be charged the full group total.
8. Collect the order, inspect Ben's history and confirm the payment amount and card. Start another group as Mary. Its selections and decline flags should start fresh.

For the automated two-item Ben scenario, his personal total is $12.60 rather than $6.30.
