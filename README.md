# TraceGraph — research preview

An English-language domain investigation prototype. The interface includes a domain search, evidence-led report, and interactive relationship explorer. Demo domains and signals are fictional. Missing evidence never establishes safety.

## Run locally

Requires Node.js 20.9 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Use **View example report** or check `aurora-deals.example` for the fictional dataset. Reports stay in tab memory until reload. Real-domain input is normalized without visiting the website. The existing optional Google Web Risk integration is preserved; no new integration or credentials were added in this redesign.

## Checks

```sh
npm test
npm run typecheck
npm run build
npm run test:browser
```

Browser tests require Playwright Chromium or an installed Edge. On Windows, start the production server in one terminal and run tests in another:

```powershell
npm run start -- --hostname 127.0.0.1
```

```powershell
$env:PW_CHANNEL='msedge'
$env:PW_EXTERNAL_SERVER='1'
npm run test:browser
```

Screenshots are saved in `docs/screenshots/`. Provider states are tested using explicit response fixtures; no paid intelligence requests are made.

## Components and design

The project already supports TypeScript, Tailwind CSS 4, and shadcn conventions (`components.json`). Reusable components live in `components/ui/`; global styles live in `app/globals.css`. Aliases use `@/` from the project root.

The supplied `WaveText` component and demo are in `components/ui/`. Its entrance hook supports load, visibility, manual playback, and offscreen pause for repeated waves. `tw-animate-css` is installed; the custom animation utility and keyframes are defined in global CSS. The home uses a single muted wave, with static reduced-motion and forced-colors fallbacks. No image assets are needed for this text component.

Design decisions: `docs/design-direction.md`. Verification and remaining limitations: `docs/verification.md`. Original research planning remains in `docs/PLAN.md`.
