# One deadline extension and advance qualification

## Extension rule

Each group can receive **one** extension of exactly 15 minutes. For an originally qualifying advance order, sending during that extension preserves its advance classification for the same collection slot.

The selected collection time stays unchanged. The app blocks an extension if the full 15 minutes would reach or pass collection, rather than silently shortening it. Mary can select a later collection time first if the extension has not yet been used.

## Behaviour

- Only the organiser can extend a live, unsent, uncancelled group.
- The new deadline is 15 minutes after the later of the existing deadline and the current time. An expired group can therefore receive the full additional period.
- Extension reopens ordering, resets its reminder and notifies group members. It does not send automatically. The organiser still closes ordering and sends.
- The extension control is disabled after use. A new group starts with its own unused extension allowance.
- If the selected advance slot originally qualified for two hours after its planned deadline, that qualification remains valid for sending during the extension, including its endpoint. Passing the two-hour boundary alone does not block sending.
- The exception ends when the extended period ends. Normal lead-time rules apply after that. A qualifying later replacement may be required.
- A changed collection time or mode cannot inherit the old exception. A new advance time must freshly satisfy the two-hour rule, and changing it does not restore the used extension allowance.
- Capacity, unavailable items, payment readiness and cancellation checks remain in effect. The exception does not permit sending after collection.
- Ordinary pickup retains its 15-minute preparation minimum.
- History records extension use and the retained original qualification. The [10% advance bonus](06-advance-points.md) uses that retained qualification.

## Timing example

Noon collection originally has a 9:50am ordering deadline. Mary extends it to 10:05am. Sending at 10:04am remains an advance order for the same noon collection, although only 1 hour 56 minutes remains. This exception applies only during the extended deadline for the same collection slot.

## Verification

The production build and all nine collection checks passed. The added checks cover the noon example, one full extension only, history and new-group reset, expiry of the exception, full-slot blocking, fresh replacement qualification, participant permissions, cancellation and refusing shortened or collection-crossing extensions. Existing six collection checks continue to pass.

From `frontend`, rerun:

```sh
npm run test:collection
npm run build
```

The controlled-clock test reproduces the exact 9:50am / noon example without requiring a two-hour wait.

## Manual review

1. Create an advance order with an available collection time, submit food and confirm its payment method.
2. Open **Group**, note the deadline and collection time, then choose **Extend 15 minutes**.
3. Confirm the deadline increased by exactly 15 minutes, collection is unchanged, and the extension control is disabled.
4. Confirm the notice explains the retained advance qualification and its expiry time.
5. Close ordering and send during the extension. Advance qualification should be retained, while a missing payment or full collection slot should still block sending.
6. Collect the order and inspect history. Confirm the extension is recorded. Start a new group and confirm its extension allowance is available again.

The points bonus is implemented and documented in [Improvement 06](06-advance-points.md).
