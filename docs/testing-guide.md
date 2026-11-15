# Final manual test guide

Use one browser tab. Refresh before each independent scenario to reset accounts and balances. Keep the local server terminal open. Open its printed address, normally http://127.0.0.1:5173. All accounts use password **kaya1234**.

## 1. Complete group journey

1. Sign in as **maryng@yakun.demo**. Start Ya Kun Together. Use a capacity of at least 3 and a group name of your choice.
2. Choose **Advance order** and an available time about three hours ahead. Keep the default ten-minute ordering window and create the group.
3. Open **View group**, invite Ben and Calvin. The member count should still be one.
4. Use the top-right name to switch to Ben. Open the invitation from Home or **Order → View invitation**. Read the joining notice. Leave marketing unticked and press **Join group**. Repeat as Calvin; optionally check marketing for Calvin. The member count should become three.
5. As each person, add one default **Set A** at **$6.30**. View My order and submit. As Ben, apply the **$2 off** reward before submitting. Confirm each person's default card. Card selection should not create a charge.
6. Expected personal amounts: **Mary $6.30; Ben $4.30; Calvin $6.30**. The group total is **$16.90**. Expected advance points: **55, 37 and 55**. Membership count must not multiply them.
7. As Mary, open **Status**, close ordering early and confirm. Send the group order. The collection time should be locked and the combined quantities / who-gets-what view should appear.
8. Inspect Pay as each person. Each sees only their own receipt and card; Mary did not pay the full group total. Points are not yet credited, although Ben's 200-point reward cost was spent when sending.
9. As Mary, use **Demo controls → Advance order status (outlet)**, then **Mark as collected**. Expected account balances from a fresh demo: **Mary 395; Ben 97; Calvin 145**. Repeated collection must not add points again.
10. Inspect each person's history. It should show the 10% bonus, personal award, amount and selected card. As Mary, save the group and reuse it: the named participants should receive new invitations rather than joining automatically.

## 2. Declined card and privacy

Start a fresh three-person group and confirm everyone's cards. As Mary, open the top-right demo controls. Under **Decline payment when the order is sent**, select Ben, then dismiss the controls, close ordering and send.

- Sending should stop and nobody should be charged.
- Mary sees Ben's decline without his card number. Ben sees his own decline. Calvin must see neither Ben's named failure nor Ben's card details in Status, Pay or notifications.
- As Ben, use Pay → Choose payment method. Card **2222** should be unavailable; confirm **8018**.
- Retry sending as Mary. Everyone should be charged their own total once, and Ben's receipt/history should show 8018.

## 3. Consent and retention

- Before joining, the marketing checkbox must be unticked. Joining unchecked must work. A choice made for Ben must not enable Calvin's checkbox.
- Use **More → Privacy and data** to review or withdraw an opt-in. This changes only that account's preference.
- Create from **Project Team**. Join as Calvin, then leave. As Mary, inspect saved groups: Calvin should be removed only from the related Project Team membership; Eve, unrelated groups and earlier completed receipts remain.
- Only the saved group's owner can rename it.
- As Mary, use **Demo controls → Expire inactive examples (7 days)**. One inactive history example and one owned saved group should disappear where available; unrelated examples remain. Points balances must not reset.

## 4. Short regression scenarios

| Test | Actions and expected result |
| --- | --- |
| Pickup baseline | In a fresh Pickup group, a $6.30 payment estimates 50 points. ASAP includes the ordering window plus 15–20 minutes preparation |
| Capacity | Expected size stays between 2 and 10 and cannot drop below joined membership. Inviting alone does not consume a joined place |
| Non-invited / removed | Open an invitation as an uninvited account: Join is blocked. Remove Ben: he needs a new invitation before rejoining |
| Full / expired invitation | Use Mary's invitation controls. The invitation should explain the problem and block joining |
| Draft edits | Submit a $6.30 order, increase quantity to 2 without Update my order: the confirmed group total stays $6.30. Update publishes $12.60 |
| Stock | Submit Milo. Simulate Milo unavailable: sending is blocked. Extend/reopen, remove or replace the unavailable item, update and retry |
| Full collection slot | Simulate Collection slot fills up. Choose an available replacement; its mode/time must be retained and revalidated |
| Extension | Extend once: deadline increases by a full 15 minutes, collection stays fixed and the second extension is disabled. The automated test reproduces noon collection / 9:50 deadline / 10:05 extension |
| Cancellation | Cancel before or after deadline expiry. Submitted food is cleared, invitations stop working and sending cannot charge anyone |
| Reorder | Reuse a historical order into an open cart: current menu prices apply, it remains a draft, and the old receipt does not change |

## 5. Reminder test

Use a fresh group with a **five-minute** ordering window. Mary and Calvin submit and confirm cards. Ben submits but does not confirm a card. Dylan joins but does not submit.

Keep the tab open until two minutes remain: Ben gets a personal payment reminder, Dylan gets an order reminder, and ready accounts get neither. Switching accounts must not duplicate them. In another fresh group, close early while Ben lacks a card: he should get the payment reminder immediately. Manual Remind still targets only the selected person.

## 6. Run all automated checks

From the frontend folder:

```sh
npm run test:collection
npm run build
npm run check:mock
```

If npm is unavailable but dependencies are already installed:

```sh
node --test tests/collection-flow.test.mjs
node node_modules/vite/bin/vite.js build
node scripts/export-mock-data.mjs --check
```

The 50 controlled-state/clock checks cover the long extension, reminder and seven-day expiry cases without waiting. The app deliberately keeps consolidation after sending and explicit Update my order confirmation; those report differences are recorded in the acceptance document.
