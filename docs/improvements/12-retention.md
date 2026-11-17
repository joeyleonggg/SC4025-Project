# Seven-day retention and leaving

The MVP retention policy specifies that completed history and saved groups expire after seven days of inactivity. Opening history details renews that record. Saving, renaming or reusing a saved group renews that group. Merely listing all records does not renew them.

Seed examples start with activity at demo startup, even though their illustrative order dates are earlier. Expiry removes an inactive record, not other recent records. Shared history has record-level activity. Opening its details renews that shared record. Saved groups are owned by the organiser: participants may see groups they belong to but cannot rename the owner's record.

Leaving or being removed clears active food, reward selection and payment selection. It removes that person's membership only from the related saved group. Earlier receipts and unrelated saved membership remain until expiry. Points balances and account consent are preserved. A collected current order is cleared when its retained history expires. In-progress orders do not expire as completed history.

The organiser's demo controls include **Expire inactive examples (7 days)**. This ages and expires one archived history example and one owned saved group, preserving other records. It demonstrates the policy without waiting a week. Refresh resets all in-memory demo data independently of retention.

Verification: five added checks cover the exact expiry boundary, related-group leaving, ownership, renewing only the opened record, and current collected-order expiry without losing points or reusing a charged group ID. All 46 checks and the build pass.

Manual review: start Project Team, join as Calvin, leave, then inspect the saved group as Mary. Calvin should be removed there while Eve and unrelated groups remain. Use the expiry simulation and confirm only the selected examples disappear. Check More → Privacy and data for the policy.
