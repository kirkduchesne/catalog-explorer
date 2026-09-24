# Catalog Explorer

Browse 24 concise programming references, save a browser-local reading list, track completed references, and move your list with reviewed JSON backups.

![Catalog Explorer showing JavaScript references](docs/preview.png)

## Run

Use Node 20, then:

```sh
npm ci
npm run dev -- --hostname 127.0.0.1
```

Open `http://localhost:3000`. For a production build, run `npm run build` followed by `npm start -- --hostname 127.0.0.1`.

The current stack is Next.js 15.5.2, React 19.1.1, TypeScript 5.9.2, and Tailwind CSS 3.4.1. Local checks used Node 20.19.0; CI pins 20.19.5. Both runtime releases existed before their corresponding 2025 milestones. All 152 resolved package versions were checked against the September 1, 2025 dependency cutoff.

## Browse and read

- Match an exact phrase or every search word, then combine topic and level filters.
- Sort by reference order, title in either direction, or topic and title; show six or twelve notes per page.
- Remove one active filter without discarding the rest. Empty results suggest specific constraints to relax.
- Open a reference and return to the same search, or follow adjacent and related references within its topic.

The native GET form, pagination, and reading links work without JavaScript. URLs preserve the submitted view. Search uses Unicode NFKC normalization, whitespace normalization, and the first 100 Unicode code points. Repeated parameters and unknown choices fall back to defaults. Page numbers are bounded to available results.

Topic counts apply search and level but ignore the selected topic; level counts apply search and topic but ignore the selected level. This explains why the choices can show counts beyond the current results.

The index is server-rendered. `generateStaticParams` enumerates the 24 allowed note identifiers, while detail pages read the request's validated return context. Unknown identifiers return HTTP 404. The index loading boundary is scoped separately so it cannot stream a successful response before a missing detail is rejected. Filtered index variants have noindex metadata.

## Save for later

Save references from cards or detail pages, mark them read, search and sort the saved list, and continue to the next unread entry. Confirm before clearing completed entries. Download the complete list or visible subset; paste a backup, review its counts, then merge. Existing saved entries keep their current status.

These features require JavaScript and stay in one browser. There is no account or synchronization. Invalid or blocked storage is preserved, with explicit reload recovery. Stale-write checks reduce accidental overwrites but localStorage is not transactional across tabs. Reading-list view filters reset when leaving the page. See [backup format and recovery](docs/reading-list.md).

![Saved references in the reading list](docs/reading-list.png)

## Checks and measurements

```sh
npm test
npm run typecheck
npm run build
npm run benchmark
```

Tests cover composed filters, ordering, facet counts, page bounds, Unicode, authored metadata, safe return URLs, reading state, backup bounds, and stale-write guards. Browser checks cover all 24 details, malformed-route 404 responses, keyboard navigation, 100-emoji searches, narrow screens, and JavaScript-disabled workflows. Reading-list browser checks cover reload persistence, status changes, filtered downloads, cancel/edit invalidation, current-state merging, stale tabs, corrupt/blocked storage, and focus recovery. The preview above is an actual application screenshot.

With Playwright available externally and the production server running, execute `node tests/browser-old.cjs` and `node tests/browser-new.cjs`, `node tests/browser-keyboard.cjs`, and `node tests/browser-navigation.cjs`. Set `CATALOG_URL` to the server origin; it defaults to `http://127.0.0.1:8605`. No browser dependency is required for ordinary unit checks.

A repeated-query microbenchmark on the real 24-entry collection measured a median **68.093 ms before and 6.614 ms after** for 2,400 evaluations in one run. Precomputed search text and shared facet passes reduce repeated query work. These are in-process measurements, not page-load timings or evidence of a noticeable user-facing improvement. See [the reproducible benchmark](benchmarks/README.md) for rounds, parity checks, and limitations.

## Scope and provenance

Content is authored locally in `lib/catalog.ts`. There is no remote directory, simulated API, account, or database. Reading-list persistence uses browser localStorage. Historical dependencies have known advisories; upgrade and review them before adapting this local reconstruction into a current hosted service.

This project was created in **September 2026** as a reconstruction. Historical commit dates were intentionally assigned and do not establish original development or publication dates.

- **2023:** a small server-rendered reference catalog with basic filters.
- **2024:** detail metadata, contextual counts, Unicode handling, and accessible pagination.
- **2025:** composed browsing, preserved reading context, framework migration, and measured query improvements.
- **2026:** local reading progress, guarded storage, reviewed backup merging, and browser regression coverage.

The shadcn/ui Button and Input source remains from revision [`c21ecfb665214e18cd5914ea319f925cd676e786`](https://github.com/shadcn-ui/ui/tree/c21ecfb665214e18cd5914ea319f925cd676e786). Its unchanged source and MIT notice are retained in `components/ui/` and `SHADCN-LICENSE.md`.
