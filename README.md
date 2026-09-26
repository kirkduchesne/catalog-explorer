# Catalog Explorer

A small programming reference shelf with server-rendered search and filtering.

Created in September 2026 as a present-day reconstruction using technology available at the assigned 2023–2024 milestones. Historical commit dates were intentionally assigned and do not indicate original work or publication in those years.

## Run and check

Use Node 20: `npm ci`, `npm run build`, then `npm start`. Development: `npm run dev`. Open `http://localhost:3000`. Run `npm test` and `npm run typecheck` for query and type checks.

Tested with Node 20.19.0, a later maintenance release, not a patch version represented as available at the assigned 2024 dates. These historical dependencies are for a local portfolio demonstration and are not recommended for current production deployment.

## Catalog and behavior

The 24 short reference notes are authored sample content stored in `lib/catalog.ts`. They are not a live resource directory or a remote API response. Search matches titles and summaries, without regard to case. Topic and level filters combine with search. Each page shows at most six notes. Choose original reference order, title A–Z, or topic then title. Each note has a shareable detail URL and its own metadata.

The GET form stores search and filters in the URL. Changing filters starts on page one. Pagination retains active filters and sort order. Invalid categories/levels are treated as unrestricted; repeated parameters are ignored. Search uses Unicode NFKC normalization, collapses repeated whitespace, and is limited to 100 Unicode code points. Matching remains a case-insensitive phrase search. Invalid page values default to one, and out-of-range pages display the final available page. Clear filters returns to the full collection. URLs can be bookmarked or shared.

Forms and pagination work without browser JavaScript. Native select controls keep ordinary form semantics. Framework loading, error-recovery, and not-found views cover route transitions and failures; no artificial delays are added to make loading visible.

## Stack and provenance

The original November 2023 baseline used Next.js 13.5.6, React 18.2.0, TypeScript 5.2.2, and Tailwind CSS 3.3.5. The February 2024 milestone moves to Next.js 14.1.0, TypeScript 5.3.3, Tailwind CSS 3.4.1, and Node 20. The November milestone updates Next.js to 14.2.18 and React/React DOM to 18.3.1. All 130 February and 131 November resolved package versions were checked against registry publication timestamps before their introducing milestones. Existing component source and license remain unchanged.

Unchanged shadcn/ui Button and Input source comes from revision [`c21ecfb665214e18cd5914ea319f925cd676e786`](https://github.com/shadcn-ui/ui/tree/c21ecfb665214e18cd5914ea319f925cd676e786), before September 5, 2023. Source paths are `apps/www/registry/default/ui/button.tsx` and `input.tsx`; local copies are in `components/ui/`. Its MIT notice is retained in `SHADCN-LICENSE.md`. No modern component generator was used.

## Rendering and validation

Catalog filtering and slicing run in the page's Server Component. Only the displayed results are rendered; the full catalog is not imported by a Client Component. The error boundary is a Client Component because retry requires an event handler. This keeps application filtering logic on the server while still delivering rendered result text to the browser.

The catalog remains a small 24-entry collection, filtered directly on the server. No performance improvement is claimed. Detail pages are generated at build time; the query-driven index is server-rendered on request.

Tests cover combined filters, invalid/repeated parameters, empty results, URL encoding, and page clamping. Production-browser checks cover direct URLs, keyboard form submission, mobile layouts, pagination, 404 behavior, and filtering with JavaScript disabled. Loading/error components are implemented, but no artificial production failure was injected to claim end-to-end recovery testing.

## 2024 maintenance behavior

Contextual topic counts apply search and level, while contextual level counts apply search and topic. Each count ignores its own dimension so another choice remains discoverable. Zero-count options remain selectable and lead to the empty state.

Direct page links expose the current page to assistive technology. A skip link reaches the main content. The GET form, pagination, and detail links work with browser JavaScript disabled. Unknown note identifiers return HTTP 404; identifiers must match the authored entry exactly.

The ten assigned maintenance dates are February 5, March 21, May 9, June 20, July 11, August 29, September 16, October 10, November 18, and December 23, 2024. Historical dependencies still have known advisories: upgrade and review them before adapting this local reconstruction into a current hosted service.
