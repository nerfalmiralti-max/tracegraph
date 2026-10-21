# TraceGraph design direction

Updated October 20, 2026. The public homepage follows the consumer product direction below; report and explorer retain their existing design.

## Identity and language

Restrained Dark Intelligence. Linear and Vercel inform hierarchy and typography; Raycast informs interaction quality; Cloudflare Radar informs readable reports; DomainTools Iris informs evidence-based network exploration. These are quality references, not templates.

All product copy, errors, metadata, dates, and accessibility labels use English (en-US). Geist is the primary font. Lucide supplies interface icons.

## Visual system

- Background: #16191F; sidebar: #111419.
- Surface: #20242C; secondary surface: #1B1F26.
- Text: #E1E5EB; secondary text: #ACB4C2.
- Accent: #9DB4D5; boundaries: #353C48 / #2B313C.
- Use 8px-based spacing, readable 13–15px product text, restrained 28–34px headings, and thin functional dividers.
- Avoid generic metric cards, decorative illustrations, excessive gradients, glowing surfaces, and oversized marketing typography.

## Product composition

The latest public homepage direction is “Intelligence made visible.” Use an asymmetric editorial hero: search and the headline “See the connections. Question the unknown.” on the left, a meaningful interactive domain graph and contextual evidence on the right. The content area is approximately 1250px. Geist display type is 58px on desktop, with 17px body copy and monospace only for investigation stage notation. Charcoal #12161C, layered blue-gray #1C2839, text #E5EAF2, secondary #A9B5C7, accent #9AB9FF, and amber #DFC18B form the homepage palette.

Homepage styling is isolated in `app/home.module.css`; behavior is in `components/homepage-*.tsx`. The existing shared search and investigation context are preserved. The graph uses the existing synthetic dataset: each node and path has a real meaning within that dataset. Selection opens evidence; hover and keyboard focus highlight associated paths; pan, zoom, and reset work. The four-stage walkthrough changes with desktop scroll or explicit selection. Tablet stacks the composition before graph text becomes too small; mobile uses a compact relationship tree and manually selectable walkthrough stages.

Reports prioritize domain identity, assessment, source coverage, timestamps, related domains, and uncertainty. The assessment facts come from the existing response, never invented scores.

The explorer supports node and edge selection, evidence inspection, search, filtering, pan, zoom, reset, and keyboard controls. Mobile uses a relationship list. Its subtle canvas grid helps spatial orientation.

## Motion

The latest brief supersedes the single-wave homepage. Keep the supplied WaveText and HeroSection components available without changing their implementation. The homepage now uses Motion for React with LazyMotion, finite staged reveals, SVG path drawing, node arrival emphasis, contextual hover highlighting, and short evidence transitions. Timing uses a decelerating cubic curve; no springs, bouncing, perpetual loops, parallax, or scroll hijacking. Reduced motion removes spatial movement and progressive drawing. The localized graph lighting is static.

Motion references: https://motion.dev/docs/react-installation and https://motion.dev/docs/react-accessibility.

## Trust and preservation

Mark all synthetic domains and signals as demonstration data. Shared content does not verify ownership or establish a threat. The current contract has no verification metadata; reported connections remain inferred and unverified. Missing evidence and no reputation match never establish safety.

The report timestamp is browser response time, not a source observation date. Reports live in tab memory until reload. Keep existing API contracts and backend logic. This UI refinement adds no live integrations; existing Google Web Risk support remains optional and unconfigured for verification.

## Verification

Run npm test, npm run typecheck, npm run build, and the browser workflows. Review screenshots at desktop and mobile widths, validate long-domain wrapping, inspect English UI and errors, and check keyboard and reduced-motion behavior. See docs/verification.md for the latest results.
