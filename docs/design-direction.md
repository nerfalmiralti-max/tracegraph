# TraceGraph design direction

Updated October 17, 2026. This is the continuing product direction, superseding the initial Russian UI brief.

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

Home combines the domain search, a concise investigation guide, and an interactive fictional example. Selecting a related domain updates its supporting evidence.

Reports prioritize domain identity, assessment, source coverage, timestamps, related domains, and uncertainty. The assessment facts come from the existing response, never invented scores.

The explorer supports node and edge selection, evidence inspection, search, filtering, pan, zoom, reset, and keyboard controls. Mobile uses a relationship list. Its subtle canvas grid helps spatial orientation.

## Motion

The user explicitly supplied WaveText. Keep the reusable component in components/ui/wave-text.tsx, its hook in components/ui/wave-text-utils/use-entrance.ts, and its supplied demo in components/ui/wave-text-demo.tsx. The home headline uses one 2.8-second muted blue-gray wave. Reduced motion and forced colors render ordinary static text. Do not extend this into ambient page animation.

## Trust and preservation

Mark all synthetic domains and signals as demonstration data. Shared content does not verify ownership or establish a threat. The current contract has no verification metadata; reported connections remain inferred and unverified. Missing evidence and no reputation match never establish safety.

The report timestamp is browser response time, not a source observation date. Reports live in tab memory until reload. Keep existing API contracts and backend logic. This UI refinement adds no live integrations; existing Google Web Risk support remains optional and unconfigured for verification.

## Verification

Run npm test, npm run typecheck, npm run build, and the browser workflows. Review screenshots at desktop and mobile widths, validate long-domain wrapping, inspect English UI and errors, and check keyboard and reduced-motion behavior. See docs/verification.md for the latest results.
