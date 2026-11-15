# Improvement 04 — Pickup and advance-order collection

## Current requirement

A05 implements FR-07, US-01 and US-09 from the latest report while retaining the agreed quick pickup choices and later-time dropdown.

## Collection choices

- **Pickup** shows ASAP and three quick times approximately 30, 60 and 90 minutes from setup, followed by the later-time dropdown.
- ASAP includes the ordering window, then approximately 15–20 minutes for preparation. With the default ten-minute ordering window, the estimate is approximately 25–30 minutes from setup.
- **Advance order** shows the later-time dropdown. Its available choices must allow at least two hours after the planned ordering deadline. A time two hours from setup can therefore be unavailable when it does not leave time to gather orders first.
- Later choices remain 30 minutes apart within a 24-hour horizon. This horizon is an MVP assumption. Quick choices crossing midnight and all later choices include a Singapore date.
- Changing collection mode clears the selected time and its previous advance qualification. Choose a suitable time for the new mode.
- Group details, sent collection details and new order history identify the collection mode and time. Sent collection details show the time as locked.

## Timing interpretation and validation

The outlet receives an order when the organiser sends it. Ordinary pickup therefore requires at least 15 minutes from sending, and advance ordering normally requires at least two hours. This is the agreed interpretation of the report's selection-versus-placement wording; it is recorded for the group discussion.

Creation and replacement choices anticipate sending at the later of the current time and the ordering deadline. Creation checks again after the organiser chooses the ordering window. Sending rechecks the current lead time and capacity, as well as the existing stock and payment checks. A stale time or a full slot requires a valid replacement.

For advance orders, creation saves the qualification time, original planned deadline and collection timestamp. A replacement validates and records fresh qualification. Switching to pickup clears those fields. These records support A06's approved deadline-extension exception; A05 alone still applies the normal send-time check. The extension exception and 10% bonus remain separate work items A06 and A07.

Only the organiser can change collection choices before sending. Sent and cancelled groups cannot change mode or time. Existing history retains its original values.

Outlet capacities are mock data. Later slots have capacity 12. Opening hours are not modelled.

## Verification

The production build passed. Six automated checks of the real App handlers and date helpers passed for:

1. Four quick pickup choices, preparation allowance and stale creation rejection.
2. Advance choices reserving the two-hour lead time, full-slot replacement, fresh qualification and mode reset.
3. Pickup send-time boundary, current-time recheck, locking and archived mode/time.
4. Advance send-time boundary, current-time recheck, locking and archived qualification.
5. ASAP remaining sendable at the planned ordering deadline.
6. Next-day Singapore labels and the 24-hour bound.

Browser review confirmed the two mode controls, pickup quick choices, advance dropdown and disabled choices that fail the initial advance requirement.

To rerun the automated checks from `frontend`:

```sh
npm run test:collection
npm run build
```

## Manual acceptance

1. Refresh the preview and sign in as `maryng@yakun.demo`, password `kaya1234`.
2. Start a group and continue to **Choose collection**. Confirm **Pickup** is selected, with ASAP, three quick times and a later dropdown.
3. Switch to **Advance order**. Confirm the quick buttons are hidden and times which do not leave two hours after the planned deadline are unavailable.
4. Choose an available later time, create the group, and check the mode and time in group details.
5. Use **Change pickup time or group size** to choose a next-day collection time. Confirm its date is shown. Switching mode should clear the selection until another suitable time is chosen.
6. Simulate **Collection slot fills up** using the top-right demo controls. Sending should be blocked until an available replacement is selected.
7. Submit an order, confirm its payment method, close ordering and send. Confirm the collection time is locked and the edit control is gone.
8. Mark the order collected and inspect history. Confirm the mode, Singapore date and time match.

The special extension behaviour will be tested and documented in A06.
