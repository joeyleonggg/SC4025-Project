# Improvement 10 — Automatic order and payment reminders

## Requirement and timing

A11 implements Section 3.5.3, FR-02 and FR-09. The existing two-minute warning window now targets each joined person's outstanding action.

| Current personal state | Automatic reminder |
| --- | --- |
| Joined, no submitted order, ordering still open | Submit the order before the deadline |
| Submitted, personal amount to pay, no valid confirmed card | Confirm a payment method so the group order can be sent |
| Submitted with a ready card | None |
| Submitted with nothing to pay | None |
| Invited but not joined, left or removed | None |
| Payment declined | Existing dedicated decline/recovery notice; no redundant automatic payment reminder |

Automatic messages are personal in-app notifications while the demo remains open. They do not identify another person's payment problem or expose card details to the group.

## Scheduling and duplicate prevention

- Reminders run when two minutes remain. A person joining or submitting during that window is checked immediately for the action they still need to complete.
- Closing ordering early immediately reminds submitted participants still missing payment methods. It does not ask non-submitters to submit after closure.
- Payment reminders can still be delivered after ordering closes, since confirming a card remains possible until sending.
- Each person receives at most one automatic reminder of each kind per group and deadline. A late submitter can receive an order reminder first and a payment reminder after submission; those request different actions.
- Confirming a card stops further automatic payment reminders. Ready accounts and zero-pay orders do not need one.
- Switching demo viewers does not repeat delivery or change recipients.
- An approved extension creates a fresh deadline window with its own reminder allowance. Old reminder and closure timers cannot act on the extended deadline.
- Cancelling, sending or replacing the group stops its scheduled reminder and closure actions. Callbacks also check current state, so an already queued old callback cannot affect the replacement group.
- The deadline popup is shown only to Mary when she is the current signed-in viewer. Participants and the logged-out screen do not receive Mary's popup.
- Manual reminders remain available to Mary and continue to target the selected person. They are explicit actions and separate from automatic deduplication.

## Verification

All thirty-nine automated checks and the production build passed. Nine new controlled-clock cases run the actual effects and scheduled callbacks, covering:

1. Two-minute delivery, recipient privacy and excluding ready/unjoined accounts.
2. Late submission, one payment reminder and readiness stopping repeats.
3. Early closure and targeted manual reminders.
4. A fresh extension window, no old-deadline closure and one final expiry notification.
5. No stale callbacks after cancellation.
6. No stale callbacks after sending.
7. Old callbacks not affecting a replacement group.
8. Zero-pay/departed accounts and avoiding redundant decline messages.
9. No organiser expiry popup while logged out.

The prior thirty collection, invitation, payment, privacy, extension and points checks continue to pass. From `frontend`:

```sh
npm run test:collection
npm run build
```

The tests advance a controlled clock, so the complete reminder timing can be rerun without waiting in real time.

## Manual acceptance

1. Sign in as `maryng@yakun.demo`, password `kaya1234`. Create a group with an available collection time and a five-minute ordering window.
2. Invite Ben, Calvin and Dylan, and join as each account using the top-right user switcher.
3. Submit and confirm a card as Mary and Calvin. Submit as Ben but switch away before confirming a payment method. Leave Dylan without a submitted order.
4. Keep the demo open until the countdown reaches two minutes. Ben's notifications should ask him to confirm a payment method. Dylan's should ask him to submit. Mary and Calvin should receive neither automatic action reminder.
5. Switch accounts and inspect notifications. Each person should see only their own reminder, with no duplicates from switching.
6. Confirm Ben's card and submit Dylan's order. Confirm a card as Dylan. Further screen changes should not repeat their automatic reminders for this deadline.
7. In a fresh group, close ordering early while Ben has submitted but has not confirmed a card. He should get a payment reminder immediately; a non-submitter should not be asked to submit after closure.
8. Use Mary's manual Remind control and confirm only the selected person gets it. Automatic reminder deduplication should not suppress that deliberate manual action.
9. Use the automated checks above for extension, stale-timer and cancellation/sending cases without a long presentation wait.
