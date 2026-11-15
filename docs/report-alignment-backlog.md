# Report alignment backlog

This is the working checklist for aligning the SC4025 prototype with the latest supplied report, SC4025_Group Project (1).docx, and Yi Xiang's subsequent decisions. Chapter 4 provides the functional requirements and acceptance criteria. The advance-order incentive is in Section 5.2, and governance measures are in Sections 5.5 and 5.6.

Work proceeds one item at a time. Each item should have its implementation, relevant checks, documentation, user review and a focused commit before moving on. Record the commit reference and verification outcome here after pushing.

## Current baseline

- The menu expansion, group multiplier and pickup selector were previously pushed on `feature/group-presentation-updates`.
- The report supersedes the earlier decisions to offer organiser sponsorship and award a group-size points bonus.
- The group-capacity correction is complete under A01 and has passed focused checks and a production build.
- The remaining README expansion is a local draft. Its payment and points sections are reconciled under A03 and A04.
- The governance controls are now included in the implementation scope following Yi Xiang's confirmation on 16 November 2026.

## Decisions to preserve

| Topic | Working decision | Report relationship |
| --- | --- | --- |
| Group capacity | Expected size stays between 2 and 10 and cannot be smaller than actual joined membership | Aligns FR-01 |
| Organiser identity | Align the organiser with Mary Ng for the presentation | Persona and assigned presentation work |
| Organiser sponsorship | Use individual payments for new MVP orders | Latest report Sections 4.3 and 4.4 supersede the earlier chat decision |
| Confirmed edits | Keep Update my order as the explicit publication step | Record clarification for US-04 |
| Consolidated breakdown | Keep the full combined quantities and who-gets-what screen after sending | Agreed working deviation from US-10; raise with the group |
| Advance-order extension | An originally qualifying advance order retains classification, collection time and bonus during an authorised 15-minute extension | Agreed working exception to the strict two-hour-at-placement wording; raise with the group |
| Deferred report work | Survey, literature, references and conclusion remain with their report owners | Yi Xiang's scope is application alignment and assigned delivery materials |

## Ordered work items

### A01 Group capacity bounds

**Status** Complete. Delivery commit titled `Enforce group capacity bounds in pickup editing`.

**Requirement** FR-01 and Yi Xiang's approval.

Apply the same 2–10 expected-size bounds in creation and pickup editing. Expected size cannot fall below the number of people already in the group. Disable the stepper at its limits.

**Acceptance checks** With only the organiser present, pickup editing stops at 2. With four members present, it stops at 4. Increasing stops at 10. Changing expected size removes no participants. Focused checks and the production build have already passed.

**Manual review** Create a group and open Change pickup time or group size. Reduce the expected size to 2 and confirm the minus button disables. Increase it to 10 and confirm the plus button disables. Invite three participants and join as each of them, then reopen the same controls and confirm the expected size cannot fall below 4.

### A02 Mary organiser identity

**Status** Complete. Delivery commit titled `Align organiser demo identity with Mary Ng`.

**Requirement** Section 3.3 persona, Section 4.2 and assigned presentation alignment.

Rename the organiser consistently across the account, user switcher, notifications, saved groups, sample history and demo instructions. Document the actual generated demo email. Preserve stable user IDs and existing role behaviour.

**Acceptance checks** Mary can log in, create a group, invite participants, collect an order and view correctly named history. The documented credentials work. Participants retain their own accounts and permissions.

**Demo credentials** Organiser `maryng@yakun.demo`, password `kaya1234`. The displayed name is Mary Ng. Participant Ben uses `ben@yakun.demo` with the same password. The organiser retains user ID 0 and card ending 1111.

### A03 Individual payment scope

**Status** Complete. Delivery commit: `Use individual payments for new group orders`.

**Verification** Production build passed. Actual React handler checks passed for fixed creation (including stale sponsorship state), Mary/Ben/Calvin selecting their own cards without immediate charges, sending three $6.30 personal payments, individual-payment history and legacy sponsored receipts.

**Requirement** FR-05, Table 4.3 and Section 4.4.

Offer individual payment for new MVP group orders. Align creation, explanatory wording, checkout and payment displays with that rule. Revise the old payment-choice documentation so the current requirement and historical decisions are distinguishable.

**Acceptance checks** There is no organiser-sponsored choice in new-order creation. Mary and two participants can submit and select their own payment methods. Sending charges the respective personal totals. Existing historical records remain readable.

### A04 Baseline loyalty points

**Status** Complete. Delivery commit: `Use eight points per dollar without group multiplier`.

**Verification** Production build passed. Actual React handler checks passed for $6.30 earning 50 points despite added members, a personal $2 reward yielding a $4.30 payment and 34 points without affecting another payer, no earned credit before collection, correct collection balances, archived rate/awards and unchanged legacy awards. Formula checks covered zero spend and fractional-dollar rounding.

**Requirement** FR-06 and US-08.

Remove the group-membership multiplier from new-order estimates and crediting. Use 8 points per dollar actually paid after personal reward discounts, with whole points rounded down after the calculation. Update current points explanations. Keep recorded historical awards intact.

**Acceptance checks** A $6.30 ordinary payment earns 50 points. Adding participants does not change that personal award. Personal rewards affect only the relevant participant's order. Points are credited at collection and remain consistent in history.

### A05 Pickup and advance-order modes

**Status** Complete. Delivery commit: `Add pickup and advance collection modes`.

**Verification** Production build and six automated collection checks passed. Browser review confirmed the mode controls and advance availability. Checks cover preparation time, stale choices, capacity replacement, send-time boundaries, next-day labels, locking and archived mode/qualification.

**Requirement** FR-07, US-01 and US-09.

Make pickup versus advance ordering explicit. Keep the agreed quick choices and later dropdown where appropriate, while ensuring advance choices satisfy the initial two-hour qualification rule. Apply the ordinary pickup minimum of 15 minutes, capacity checks, Singapore date labels and locking after sending.

**Acceptance checks** Users can identify the chosen mode. Invalid initial advance choices are unavailable. A full slot requires a valid replacement. Both same-day and next-day selections appear correctly in details and history. Sending locks the outlet and collection time.

**Recorded interpretation** Normal qualification uses the send time, when the outlet receives the order. Creation and replacement reserve the required lead time beyond the planned ordering deadline; sending validates current time again. Advance qualification records its creation/replacement time, planned deadline and collection timestamp for A06. A new replacement must qualify afresh. ASAP includes the ordering window plus 15–20 minutes preparation. The extension exception remains A06; the report wording difference stays recorded for group discussion.

### A06 Deadline extension exception

**Status** Complete. Delivery commit: `Allow one extension preserving advance qualification`.

**Verification** Production build and all nine collection checks passed, including the exact noon collection / 9:50am deadline / 10:05am extension example, one-use limit, exception expiry, capacity blocking, replacement qualification, permissions, cancellation, full-duration boundary, history and new-group reset.

**Requirement** US-05 and Yi Xiang's extension decision.

Allow the authorised 15-minute extension while retaining the selected collection time. When the original order qualified for advance ordering, the extension does not reclassify it, remove its future bonus or prevent sending solely because the two-hour boundary has passed.

**Acceptance checks** A noon advance collection with an original 9.50am deadline can extend to 10.05am and be sent during that period with its original qualification. The same collection time remains selected. Only the organiser can extend, and cancelled or sent orders cannot reopen through extension.

**Confirmed boundary** Yi Xiang selected one extension per group on 16 November 2026. It always adds the full 15 minutes after the later of the existing deadline and current time. If that would reach or pass collection, the organiser must choose a later collection time before extending. The original advance exception applies only through the extended deadline and only to its original collection slot. A replacement must qualify afresh and does not restore the used allowance.

### A07 Advance-order bonus

**Status** Complete. Delivery commit: `Award ten percent bonus for qualifying advance orders`.

**Verification** Production build and all twelve automated checks passed. Checks cover pickup versus advance awards, single rounding, personal discounts, membership independence, extension preservation, rates fixed at sending, no credit before collection, one-time crediting, cancellation and archived bonus/awards.

**Requirement** Section 5.2, Table 4.3 and Section 4.4.

Award 10% extra points for qualifying advance orders. Preserve the bonus during the approved extension exception. Show the eligibility and terms before submission and record the applied award in history.

**Acceptance checks** Using the proposed single-rounding rule, a $6.30 ordinary payment earns 50 points and a qualifying advance payment earns 55. Membership count has no effect. An authorised extension retains the award. Cancelling does not award points and collection credits once through the normal flow.

**Recorded rounding decision** The MVP rounds down once after multiplying the final personal payment by 8 and 1.1. The report does not define rounding order. For example, a $6.24 advance payment earns 54 points, rather than 53 from rounding the base award first. This interpretation is documented for group discussion.

### A08 Multiple mock cards and decline recovery

**Status** Complete. Delivery commit: `Add saved mock cards and declined payment recovery`.

**Verification** Production build and all fourteen automated checks passed. Payment checks cover default-card decline, no partial charges, unavailable declined cards, alternative-card selection and retention, three personal charges on successful retry, duplicate-send prevention, personal receipt/history, new-group reset, organiser recovery and both cards declining.

**Requirement** FR-05 and US-06–US-07.

Provide a meaningful alternative saved mock card for a declined participant, retain which card they choose and show the correct personal receipt. Avoid simulated charges until the group sends successfully.

**Acceptance checks** A decline stops sending. The participant selects a different card. The organiser sees readiness and can retry. Each receipt shows the selected card and personal total. Unrelated members receive no duplicate charges.

### A09 Payment status privacy

**Status** Complete. Delivery commit: `Limit payment status and messages to authorised viewers`.

**Verification** Production build and all seventeen automated checks passed. Privacy checks cover Mary/Ben/Calvin views of missing methods, targeted reminders, declines and recovery; immediate switching; Home/Group/Status/cart/Pay/notifications/receipts/history; private transient state; and scoped demo payment controls.

**Requirement** FR-05, FR-11 and Section 5.5.

Limit personal payment status and failure messages to the relevant participant and the organiser. The organiser sees others' readiness or failure status, while each participant sees their own card details. Review notifications and group-wide error messages as well as the Status screen.

**Acceptance checks** Mary sees Ben's missing or declined state without his card details. Ben sees his own status and card. A third participant sees neither Ben's named failure nor his card details.

### A10 Invitation access and joining flow

**Status** Complete. Delivery commit: `Add named invitations and participant joining`.

**Verification** Production build and all thirty automated checks passed, including thirteen invitation cases for intended accounts, saved-group scope, capacity, lifecycle states, removal/re-invitation, stale links, clipboard outcomes and sign-in routing. Browser walkthrough confirmed Mary inviting Ben and Ben joining.

**Requirement** FR-01, FR-10, FR-11 and US-02/US-12.

Replace the placeholder invitation experience with a working mock flow appropriate to the single-browser prototype. Track invited access, distinguish invitations from completed joining where needed and handle removed, full, cancelled, sent and expired invitations. Saved groups should invite only their intended members.

**Acceptance checks** An invited, logged-in participant can join the intended active group. A non-invited account is blocked. Full, expired, cancelled and sent invitations explain the problem. Reusing a saved group does not grant access to unrelated people. Clipboard success is reported accurately.

**Confirmed presentation interaction** Yi Xiang selected named invitations and participant joining on 16 November 2026. Mary invites the account; the presenter switches to that participant and accepts. Saved groups create pending invitations. Links use the current app address and work in the same running tab; fresh tabs, refreshes and other devices have no shared group data and explain that limitation. Cross-device sharing remains separate scope.

### A11 Automatic payment reminders

**Status** Complete. Delivery commit: `Add targeted automatic payment reminders`.

**Verification** Production build and all thirty-nine automated checks passed. Nine controlled-clock cases cover targeting, late submission, deduplication, readiness, early closure/manual reminders, extension windows, stale callbacks after cancellation/sending/replacement, zero-pay/departed users, decline notices and logged-out popup behaviour.

**Recorded timing** Use the two-minute warning window. Early closure immediately checks missing payment methods. Allow one automatic reminder per person, kind and deadline; a new extended deadline has a fresh allowance. Declines retain their existing targeted recovery notice without an extra automatic payment reminder.

**Requirement** Section 3.5.3, FR-02 and FR-09.

Keep targeted order-submission reminders and add automatic reminders for members who submitted but still lack a payment method. Preserve recipient privacy and prevent duplicate or stale reminders after cancellation or sending.

**Acceptance checks** A non-submitter receives the relevant order reminder. A submitted member missing a method receives a payment reminder. Ready participants are not reminded unnecessarily. Manual reminders continue to target the selected person.

### A12 Joining notice and marketing consent

**Status** Complete. Delivery commit: `Add joining disclosure and optional marketing consent`.

**Verification** Disclosure precedes joining; consent is unticked and optional, isolated per account, and withdrawable. Two automated cases added.

**Requirement** Sections 5.5 and 5.6, Table 5.4.

Explain during joining what names, order information and payment status are shared, and with whom. Offer separate optional marketing consent with its checkbox unticked by default. Record the demo preference and make its purpose clear.

**Acceptance checks** The notice appears before joining completes. A participant can join without opting into marketing. Consent starts unticked and does not become enabled through another action. The stated visibility matches A09 and the implemented role views.

### A13 Retention and leaving-group behaviour

**Status** Complete. Delivery commit: `Implement seven-day retention and scoped leaving cleanup`.

**Verification** Five retention checks added; all 46 checks and build pass. Expiry, renewal, owner-only renaming, unrelated-record preservation and point-balance preservation are covered.

**Requirement** Section 5.6, Table 5.4, reconciled with FR-10 history and reuse.

Implement the agreed demo retention and deletion rules for order history and saved groups. Explain how the in-memory prototype demonstrates them. Scope deletion to the relevant person's data and preserve unrelated records.

**Confirmed policy** Yi Xiang chose seven days of inactivity on 16 November 2026. Leaving removes active order data and related saved membership while preserving earlier receipts until expiry and unrelated records. History activity is per shared record; saved groups are organiser-owned. Listing records does not renew all of them. Refresh reset is separate from expiry.

**Acceptance checks** Once the policy is agreed, test expiry, leaving an active group, viewing a completed order, shared-group ownership and preservation of unrelated users' data. Document refresh reset separately from the retention policy.

### A14 Architecture and repository documentation

**Status** Complete. Delivery commit: `Document final architecture, mock data and report acceptance`.

**Verification** README reconciled; actual architecture documented with diagram; backend boundary and reproducible mock-data exports added. Snapshot check passes. Final local-link check is recorded with the media handoff.

**Requirement** Assigned GitHub work and the report's temporary Technology & Functional MVP section.

Document the actual architecture, React/Vite stack and mock data or backend boundary. Add the requested dedicated documentation location and README links. Reconcile the local README draft and improvement notes with the final behaviour, demo credentials and top-right controls. Mark superseded decisions clearly.

**Acceptance checks** The diagram matches the implemented system. Any proposed future services are labelled accordingly. Run and build instructions work, local documentation links resolve and the documented demo credentials match A02.

### A15 Report acceptance walkthrough

**Status** Complete. Delivery commit: `Document final architecture, mock data and report acceptance`.

**Verification** All 50 automated checks pass, including the full Mary/Ben/Calvin customisation/reward/payment/collection/reuse journey and required failure recovery. Requirement matrix and agreed deviations are in docs/acceptance/report-alignment.md.

**Requirement** Section 4.4 and FR-01–FR-11 / US-01–US-12.

Run one organiser and at least two participants through creation, invitation, customisation, rewards, personal payment, sending, collection and individual points. Cover full groups, unavailable items, declined cards, expired invitations, draft editing, cancellation, pickup replacement and the advance-extension exception. Record outcomes and relevant commits.

**Acceptance checks** Each criterion is marked passed, failed or an agreed deviation. Required exceptions have a demonstrable recovery. The tested version is identifiable for the screenshots and video.

### A16 Wireframes and full demonstration

**Status** Complete. Delivery commit: `Add final report captures and captioned demonstration`.

**Verification** 27 actual application captures, report-ready figure overview/captions, presenter notes and a 3m36s silent captioned MP4 supplied. This is a screen-capture sequence, not continuous pointer/narration recording. Modal animation captures were corrected during visual QA. H.264 1280×720 output decodes successfully; local documentation links resolve.

**Requirement** Assigned Section 4.5 and presentation video work.

Capture final screens and write their explanations for Section 4.5. Prepare and record the full video demonstration using Mary and the final participant accounts. Supply the tested branch or commit for the repository owner to publish and link in the report.

**Acceptance checks** Captions describe the actual screens and their requirements. The video shows the final behaviour and exceptions coherently. The report, README, screenshots and demo credentials agree.

## Group discussion items

1. US-10 describes the consolidated breakdown after closing, while the agreed app retains the full view after sending.
2. US-04 should name Update my order as the publication step.
3. The advance-order extension exception needs an explicit statement alongside the two-hour qualification rule.
4. Extension boundary resolved: one full 15-minute extension per group; no shortening and no extension reaching or passing collection.
5. Retention confirmed: seven inactive days, scoped active/saved-membership cleanup on leaving, earlier receipts retained until expiry.
6. Invitation interaction confirmed at A10: named invitations followed by participant joining in the same demo tab. A07 documents single rounding after the full bonus calculation as the MVP points convention for group discussion.

## Delivery routine

For each work item, confirm its specific behaviour, implement the smallest complete change, run relevant checks, update its documentation and provide manual review steps. Commit and push each reviewed item with a descriptive message. Yi Xiang later authorised completing and pushing all remaining items together with consolidated testing instructions. Update this checklist with its status and commit. Keep pending items separate from the item being pushed.

A01–A16 are delivered. All 50 automated checks, production build, mock-data consistency and documentation-link checks pass. Final media and the consolidated manual testing guide are supplied. User manual acceptance and the repository owner's merge/publication remain handoff actions. Agreed report wording differences remain recorded above.
