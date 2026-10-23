# Verification

## Homepage polish — October 23, 2026

The existing identity, hero, synthetic dataset, and SVG relationship graph are preserved. This revision changes only the public homepage, its dedicated components, browser checks, and documentation.

### Corrections

- Removed the page-wide `overflow: clip`. The graph's ambient pseudo-element extended beyond its container, causing 4px of overflow at 1280px and 18px on phones when clipping was disabled. Its bounds now stay inside the visualization. No page-level overflow mask is used.
- Reduced storytelling spacing, replaced the oversized centered Trace / 01 monogram with domain context, and brought the evidence philosophy into the walkthrough's conclusion. Tablet and phone stage controls use a compact two-column layout with descriptions in the preview.
- Walkthrough panels share a content-sized grid cell, so every stage has the same height without a fixed minimum height. Inactive panels are inert and excluded from accessibility navigation. Collapsed evidence maintains its height when switching between one and two shared signals.
- Replaced the narrow scroll trigger with a frame-batched, passive scroll update. It selects the nearest stage and makes the final stage reachable when the page cannot scroll farther. Explicit selection wins until the user scrolls; reduced-motion and narrow layouts use manual controls.
- Removed delayed context-edge feedback and the brightness pulse. Separated hover and keyboard focus, improved inactive-edge contrast, added arrow-key domain selection and evidence associations, and increased zoom/reset targets to 44px.
- Kept pointer pan and keyboard pan/reset. Tablet touch input scrolls the page vertically instead of being captured by the SVG. Phones retain the accessible relationship list.
- Added mobile navigation with Escape dismissal and focus return. The check action focuses the search without the fragment navigation subsequently discarding focus. A failed example request returns focus to the existing search error; pending requests remain disabled and expose busy state.

### Validation

- `npm run typecheck`, homepage-scoped `npm run lint`, and `npm run build`: passed.
- `npm test`: 9 passed. Microsoft Edge / Playwright against the production build: 17 passed.
- All five requested sizes were opened, exercised, captured, and visually reviewed. Overflow is zero at each size; the outer page has computed `overflow-x: visible`. Additional existing coverage includes 320, 540, and 1024px.
- Each requested size checks stable walkthrough/evidence heights, node selection, keyboard domain navigation, expanded evidence, zoom/reset or mobile menu, and console/page errors. No unexpected console or page errors occurred in these five runs. Axe reported no violations in the tested states.
- Search submission, validation, loading, failed examples, retry, report/network entry, provider response fixtures, and downstream report/explorer workflows pass. No Cyrillic UI strings were found in `app/`, `components/`, or `lib/`.
- Separate browser checks passed for mouse pan/reset and emulated tablet touch scrolling over the graph. The observed initial layout-shift score was 0 in a desktop test session; this is a laboratory observation, not a field-performance claim.
- Reduced motion, forced colors, focus visibility, finite graph entrance, and hover emphasis remain covered. The scroll test now waits for asynchronous wheel input before issuing a separate scroll command.
- All 11 protected report, explorer, methodology, API, backend, root-layout, and global-style SHA256 hashes match the original baseline. `components/workspace.tsx` is unchanged.

| Viewport | Horizontal overflow | Full-page capture |
| --- | --- | --- |
| 1440 × 900 | 0px | [Desktop](screenshots/home-1440x900.png) |
| 1280 × 800 | 0px | [Small desktop](screenshots/home-1280x800.png) |
| 768 × 1024 | 0px | [Tablet](screenshots/home-768x1024.png) |
| 390 × 844 | 0px | [Mobile](screenshots/home-390x844.png) |
| 360 × 800 | 0px | [Narrow mobile](screenshots/home-360x800.png) |

Captures use reduced motion to show offscreen content reliably; motion is tested separately. Full-page heights decreased from 2469 to 2176px at 1440px, 2445 to 2152px at 1280px, 3320 to 2912px at 768px, 3197 to 3072px at 390px, and 3283 to 3187px at 360px.

### Files and recovery

- `app/page.tsx`, `app/home.module.css`
- `components/homepage-investigation.tsx`, `components/homepage-story.tsx`, `components/homepage-motion.tsx`, new `components/homepage-navigation.tsx`
- `tests/browser/homepage-motion.spec.ts`, new `tests/browser/homepage-polish.spec.ts`
- `docs/design-direction.md`, this report, and homepage screenshots in `docs/screenshots/`

The pre-polish implementation remains at Git `9d6aa2d` and `../backups/homepage-before-polish-9d6aa2d.zip` outside the application directory.

Safari, Firefox, physical-device performance, and real screen-reader sessions were not tested. Automated accessibility and emulated touch checks do not replace those reviews. No real API integration was added or exercised; demonstration relationships remain synthetic, inferred, and unverified.

## Interactive homepage — October 21, 2026

- `npm run lint` passed for the homepage and its dedicated components. TypeScript, production build, all 9 unit tests, and all 11 browser tests passed.
- Browser checks cover finite graph entrance, hovered path emphasis, node/edge selection, expandable evidence, keyboard pan, zoom/reset, desktop scroll stages, explicit stage selection, mobile navigation, reduced motion, forced colors, existing search, and downstream report/explorer flows.
- Fixed a genuine interaction race: programmatic scrolling could override a selected walkthrough stage before Next step completed. Manual selection now remains authoritative until the user scrolls again. Tablet/mobile stages change only through their controls.
- Axe found no violations in the tested states. No browser page errors were reported by the motion workflow. No Cyrillic UI strings were found.
- Reviewed desktop 1440px, tablet 1024px, mobile 390px, and the expanded walkthrough. Automated overflow checks additionally cover 320, 540, and 768px.
- All 11 protected report, explorer, API, backend, root layout, and global-style files match their original SHA256 baseline. The shared workspace/search file is unchanged in this revision.
- Reversible checkpoint: Git `c4b256e` and `backups/homepage-before-motion-redesign-c4b256e.zip` outside the app directory.
- Final images: `home-desktop.png`, `home-desktop-hero.png`, `home-mobile.png`, `home-tablet.png`, and `home-walkthrough.png` in `docs/screenshots/`. Static full-page captures use reduced motion so offscreen content remains visible.

Motion and lint dependencies were added; there are no new API integrations or credentials. The data remains explicitly synthetic. Safari, Firefox, physical-device performance, and real screen-reader sessions were not tested. Automated accessibility checks are not a complete audit.

## Public homepage — October 20, 2026

- Production build and TypeScript checks passed; 9 unit tests and all 11 browser tests passed in Microsoft Edge.
- Reviewed the homepage at 1440px and 390px. Automated overflow checks also cover 320, 540, 768, and 1024px. Screenshots are `docs/screenshots/home-desktop.png` and `home-mobile.png`.
- Checked real search navigation, invalid-input handling, demonstration report/network entry, node and keyboard edge selection, expandable evidence, keyboard pan, zoom/reset, mobile relationships, and motion/forced-color preferences.
- Axe reports no violations in tested states. The initial preview label mismatch was corrected before the passing run.
- No Cyrillic strings found in `app/`, `components/`, or `lib/`.
- All 11 protected source files match the saved SHA256 baseline: report, explorer, methodology, root layout, global styles, report/graph components, API, and backend libraries.
- The only shared-shell change bypasses dashboard chrome on `/`, preserving the existing investigation context.
- Baseline is recoverable at Git commit `80c6333` and in the separate `backups/homepage-before-public-redesign-20261017.zip` archive.

No live intelligence was added. The example remains synthetic; shared content does not establish common ownership or a threat. Safari, Firefox, and physical-device testing remain unverified.

## Previous full-product verification — October 17, 2026

## Results

- `npm test`: 9 passed.
- `npm run typecheck`: passed.
- `npm run build`: production build passed.
- Playwright on the production build in Microsoft Edge: 10 passed.
- Axe reported no violations in the tested home, report, explorer, methodology, and provider-response states.
- English checked in rendered content, accessibility attributes, form validation, report tabs, and graph details. No Cyrillic strings remain in `app/`, `components/`, or `lib/`.
- Desktop 1440px, tablet 820px, and mobile 390px screenshots reviewed. Overflow checks also cover 320, 540, 768, and 1024px, including long domains.
- Verified interactive home evidence selection, API search, report tabs, graph edge/node selection, pointer and keyboard pan, zoom/reset, combined filters, mobile list, failed-refresh recovery, and reload empty states.
- WaveText verified to animate once and finish, preserve layout, and remain readable with reduced motion and forced colors. No browser page errors in the checked workflows.

## Backend preservation

Compared TypeScript lexical tokens against the original zip, ignoring comments and allowing only translated Cyrillic string literals. All logic and contract tokens match:

- `app/api/check/route.ts`: 3 localized strings.
- `lib/domain.mjs`: 9 localized strings.
- `lib/graph.mjs`: 2 localized strings.
- `lib/webrisk.mjs`: no token changes.

No new API integrations were added. Provider states use explicit test fixtures. The demo flow uses the existing local API and fictional `.example` domains.

## Review fixes

- `app/globals.css`: long domain URLs wrap without expanding the report grid; mobile controls have larger targets and input text.
- `components/workspace.tsx`: English validation is associated with the input; focus returns after a failed check.
- `components/network-canvas.tsx`: graph selection, zoom, reset, and panning have keyboard equivalents.
- `components/ui/wave-text-utils/use-entrance.ts`: the missing supplied-component dependency now handles visibility and motion preferences.
- `app/globals.css`: the custom Tailwind animation utility, static text fallbacks, and keyframes complete the supplied WaveText integration.

Applied frontend-design, ui-ux-pro-max, ui-styling, Web Interface Guidelines, and React review guidance. The user's explicit palette and product requirements take precedence over generic skill style suggestions.

## Remaining limits

Live intelligence was not connected or tested. The existing contract has no verified-connection metadata or source observation date; the UI states those limits explicitly. Reports persist only in tab memory. Firefox, Safari, and real screen-reader sessions were not tested. Automated accessibility checks do not constitute a complete accessibility audit.

Screenshots: `docs/screenshots/`.
