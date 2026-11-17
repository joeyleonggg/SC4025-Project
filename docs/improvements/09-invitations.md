# Named invitations and joining

## Invitation flow

The invitation flow supports FR-01, FR-10, FR-11 and US-02/US-12. Mary invites a named account. The invited participant opens the invitation and chooses **Join group**. Demo controls switch between account views within the same tab.

An invitation and a joined member are separate states. Inviting Ben does not add him to the member count or submit anything for him.

## Access and membership

- Mary opens **Group → Invite people** and selects **Invite** next to a named account. That account receives its invitation notification. Unrelated accounts do not gain access.
- The invited person signs in, or is selected through the top-right demo user switcher, then opens the invitation from Home or **Order → View invitation** and selects **Join group**.
- Joining checks the current invitation, account, ordering deadline, group state and remaining capacity again. An earlier open invitation screen cannot bypass a group becoming full or closing.
- Invitations do not reserve places. Joined membership determines whether the group is full. The organiser's expected size still determines collection-slot capacity.
- Saved groups invite only their listed demo members. They no longer automatically join those accounts. Each person accepts their own invitation.
- Leaving clears the person's order and selected payment method, but retains their invitation. They can rejoin while ordering is open and there is room.
- Removing a member clears their order and revokes their invitation. They need a new named invitation from Mary before rejoining.
- Full, expired, closed, cancelled, sent, removed and non-invited states have specific explanations. Already joined members are offered their group or collection details instead of joining twice.
- A new group has a distinct invitation key, including after cancellation. A previous group's link cannot admit someone to a new group.
- Non-invited accounts do not receive the group's invitation card, collection details or countdown. Invitation simulation controls are organiser-only.

## Links and clipboard

The invitation link uses the current app's address with `#invite=` and the group's key, replacing the placeholder Ya Kun address. Opening that hash in the **same running demo tab** opens the invitation, and the request is retained through sign-in.

The app keeps order state in memory. A new tab, refresh or another device has no shared group data. Those links explain this limitation rather than pretending the group is available. Cross-tab or cross-device sharing would require shared state and remains outside this single-tab prototype.

**Copy link** reports success only after the clipboard confirms the write. If access is missing or denied, the app shows a read-only invitation-link field and asks for manual copying. Possession of a link alone does not invite an unrelated account.

## Verification

The production build and all thirty automated checks passed. The thirteen invitation checks cover:

- Inviting without auto-joining, intended-account acceptance, duplicate joining and outsider blocking.
- Saved-group invitation scope.
- Leaving/rejoining and removal/re-invitation.
- Capacity rechecks, including an earlier rendered join action.
- Cancelled, sent, expired and closed invitations.
- Deadline expiry and links belonging to previous groups.
- Clipboard success, denied access and unavailable clipboard APIs.
- Invitation routing through sign-in, and an explanatory response in a fresh tab with no order state.

Browser walkthrough confirmed Mary inviting Ben, Ben's invitation screen, and Ben joining with membership increasing from one to two. Existing payment, privacy, collection, extension and points checks now use the named invitation/join flow and continue to pass.

From `frontend`:

```sh
npm run test:collection
npm run build
```

## Manual acceptance

1. Sign in as `maryng@yakun.demo`, password `kaya1234`, and create a group.
2. Open **View group**, then **Invite Ben**. The member count should remain one, and Ben's button should show Invited.
3. Use the top-right user switcher to choose Ben. Open his invitation from Home, or use **Order → View invitation**. Select **Join group**. Membership should increase to two.
4. Switch to Calvin before inviting him and confirm he has no invitation card. A copied invitation link must not let his account join.
5. Invite Calvin as Mary, then join as Calvin. Use this same sequence whenever an earlier guide says to add a participant.
6. As Ben, leave and rejoin while ordering is open. Remove him as Mary and confirm he cannot rejoin until Mary invites him again.
7. Use Mary's invitation simulation controls to check full and expired states. Closing ordering, cancelling and sending should also prevent a new participant joining and explain why.
8. Create from **Project Team**. Confirm only Calvin and Eve receive pending invitations, and neither joins automatically.
9. Copy the invitation link. It should point to this app. Open it in the same running tab to view the current invitation. A new tab should explain that the mock group is unavailable there.

See [joining disclosure and optional marketing consent](11-joining-consent.md).
