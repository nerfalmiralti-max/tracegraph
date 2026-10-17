<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## TraceGraph design direction

Read `docs/design-direction.md` before UI work. The permanent direction is restrained
Dark Intelligence: Linear/Vercel for hierarchy, Cloudflare Radar for report structure,
and DomainTools Iris for relationship exploration. All product copy must be English
(en-US). Use the refined neutral palette, readable type, and purposeful interactions.
The user explicitly requested WaveText; the home headline uses a single muted wave,
with a static fallback for reduced motion. Distinguish demonstration data from real
evidence, and never interpret missing data as a safe verdict.

Preserve the existing API and backend contracts during visual changes. Verify with
`npm test`, `npm run build`, and the relevant browser workflows. Browser setup and
known data limitations are documented in `README.md`.
