# Catalog Explorer

A small programming reference shelf with server-rendered search and filtering.

Created in September 2026 as a present-day reconstruction using technology available in November 2023. Historical commit dates were intentionally assigned and do not indicate original work or publication in 2023.

## Run and check

Use Node 18: `npm ci`, `npm run build`, then `npm start`. Development: `npm run dev`. Open `http://localhost:3000`. Run `npm test` and `npm run typecheck` for query and type checks.

Tested with Node 18.20.5, a later maintenance release, not the patch version available in November 2023. These historical dependencies are for a local portfolio demonstration and are not recommended for current production deployment.

## Catalog and behavior

The 24 short reference notes are authored sample content stored in `lib/catalog.ts`. They are not a live resource directory or a remote API response. Search matches titles and summaries, without regard to case. Topic and level filters combine with search. Each page shows at most six notes in catalog order.

The GET form stores search and filters in the URL. Changing filters starts on page one. Pagination retains active filters. Invalid categories/levels are treated as unrestricted; repeated parameters are ignored. Search is trimmed and limited to 100 characters. Invalid page values default to one, and out-of-range pages display the final available page. Clear filters returns to the full collection. URLs can be bookmarked or shared.

Forms and pagination work without browser JavaScript. Native select controls keep ordinary form semantics. Framework loading, error-recovery, and not-found views cover route transitions and failures; no artificial delays are added to make loading visible.

## Stack and provenance

Next.js 13.5.6 (published October 18, 2023), React 18.2.0, TypeScript 5.2.2, Tailwind CSS 3.3.5 (published October 25, 2023). Exact dependencies were installed with `--before=2023-11-08T00:00:00Z --save-exact`; all 131 locked package versions were checked against registry publication timestamps.

Unchanged shadcn/ui Button and Input source comes from revision [`c21ecfb665214e18cd5914ea319f925cd676e786`](https://github.com/shadcn-ui/ui/tree/c21ecfb665214e18cd5914ea319f925cd676e786), before September 5, 2023. Source paths are `apps/www/registry/default/ui/button.tsx` and `input.tsx`; local copies are in `components/ui/`. Its MIT notice is retained in `SHADCN-LICENSE.md`. No modern component generator was used.

## Rendering and measured build output

Catalog filtering and slicing run in the page's Server Component. Only the displayed results are rendered; the full catalog is not imported by a Client Component. The error boundary is a Client Component because retry requires an event handler. This keeps application filtering logic on the server while still delivering rendered result text to the browser.

The local production build reported **146 B route size**, **80.6 kB first-load JavaScript**, and **80.5 kB shared first-load JavaScript** for `/`. These are framework build-report figures, not a network benchmark or a claim of improvement against another implementation.

Tests cover combined filters, invalid/repeated parameters, empty results, URL encoding, and page clamping. Production-browser checks cover direct URLs, keyboard form submission, mobile layouts, pagination, 404 behavior, and filtering with JavaScript disabled. Loading/error components are implemented, but no artificial production failure was injected to claim end-to-end recovery testing.
