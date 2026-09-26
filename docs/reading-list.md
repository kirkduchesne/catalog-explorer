# Reading-list storage and recovery

Saved IDs, read flags, and ISO saved timestamps stay in this browser under `catalog-reading-list-v1`. The key predates the Dogear rename and is kept so existing lists survive it. Downloads are named `dogear-reading-list.json`. No account or server copy exists. Clearing browser data removes the list.

Download all entries or the visible subset before moving browsers. Paste the JSON into the destination, preview its counts, then confirm the merge. Existing IDs retain their current state; new IDs are added. Cancel or edit the input to discard a preview. Confirmation recomputes the merge against the current list, including changes made on this page after previewing.

Backups use `{ "version": 1, "entries": [{ "id": 1, "read": false, "savedAt": "2026-05-01T12:00:00.000Z" }] }`. Only the 24 known reference IDs are accepted, without duplicates. Input is limited to 65,536 JavaScript string characters. Unknown fields are discarded. This is a small transfer format, not an archive of catalog text.

Writes compare the stored snapshot before replacing it. Changes from another tab block edits until **Reload saved list** is selected. This detects stale snapshots but localStorage has no atomic compare-and-swap: simultaneous writes in multiple tabs are not transactional. Prefer one editing tab.

If storage is blocked, full, or malformed, saved content is not automatically deleted. Restore browser storage access and reload. If data was manually corrupted, keep a copy before repairing or removing that specific key in browser developer tools; there is no automatic reset that discards it. Downloads may require browser permission. A download request does not prove that a file was retained.

Catalog search, filters, pagination, and reference links remain usable with JavaScript disabled. Saving, reading status, and backups require JavaScript. Reading-list search and sort are local view controls and reset when navigating away; the catalog search URL remains shareable.

From a reference detail, **Next unread saved reference** advances through saved-entry order, skips read entries and the current reference, and wraps to the beginning. Opening a reference does not mark it read. If the current reference is absent, navigation starts at the first unread entry.
