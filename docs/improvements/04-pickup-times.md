# Improvement 04 — Quick pickup choices and a later-time selector

## Requirement

Keep ASAP and three further quick pickup choices, spaced 30 minutes apart. Add a dropdown for collection times beyond those four choices.

## Behaviour

- Quick choices are ASAP, about 30 minutes ahead, about 60 minutes ahead and about 90 minutes ahead.
- ASAP displays an estimated collection time about 15–20 minutes ahead.
- The later-time dropdown starts about 120 minutes ahead and continues every 30 minutes.
- The scheduling horizon is 24 hours from when the choices are generated. This limit is an implementation assumption for review.
- Times are calculated from the next five-minute mark for tidy labels, then bounded by the 24-hour limit.
- Later-time labels include the date and use Singapore time so next-day choices are identifiable.
- Selecting a quick choice clears the dropdown selection. Selecting a later time replaces the quick choice.
- The same selector appears during group creation and when changing an existing group's pickup time.
- A selected later time appears in group details, collection details and archived order history.

## Validation

The existing ordering-deadline, future-time and capacity checks apply to both quick and dropdown choices. A full or expired slot blocks sending until an available replacement is chosen. Changing outlets retains a selected later time when it has sufficient capacity.

Capacities and operating availability are demo data. Later slots use a mock capacity of 12 for each outlet. The prototype offers times throughout the scheduling horizon and does not model outlet opening hours.

## Implementation

- `frontend/src/data.js` generates timestamps, date labels and outlet capacities.
- `frontend/src/App.jsx` uses a shared pickup selector for creation and later changes, and validates a selection before applying it.

## Verification

- Production build passed.
- Component checks passed for the four quick choices, later slot spacing, unique date labels across midnight and the 24-hour bound.
- Component checks confirmed the dropdown retains a later selection when reopened and resets when a quick choice is chosen.
- Component checks confirmed replacing a full slot with a later dropdown time permits checkout.
- Browser checks confirmed a later selection is saved in group details and restored in the change-pickup selector.
- Browser checks confirmed a next-day selection displays its date and switching back to a quick choice clears the dropdown.

## Manual acceptance

1. Refresh the preview and sign in as `alex@yakun.demo` with password `kaya1234`.
2. Start a group and continue to **Choose pickup**.
3. Confirm there are four quick buttons, beginning with ASAP, followed by **Choose a later time**.
4. Open the dropdown. Confirm its earliest choice is after the final quick time and later options are 30 minutes apart.
5. Choose a later time and create the group. Confirm the collection time matches in group details.
6. Open **Change pickup time or group size**. Confirm the dropdown retains the selection.
7. Choose a quick time. Confirm the dropdown returns to its placeholder and the quick button is selected.
8. Choose a next-day time and confirm its date appears in group details.
