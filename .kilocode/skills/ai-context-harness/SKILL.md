---
name: ai-context-harness
description: Provides core working rules for AI assistants on this static landing page project.
---

# AI Working Rules – Landing Page Project

## Stack & deployment
- Project type: HTML, CSS, vanilla JavaScript (no frameworks).
- Deployment: GitHub Pages from the `master` branch.
- Paths: Always use relative paths (e.g., `./css/style.css`, `../assets/img/`).
- No external dependencies unless explicitly approved.
- Commands must work in WSL (Ubuntu): `git`, `code`, `npm` (only if package.json exists).
- Files in `.kilo/` are editor-specific – never touch or commit them.
- Before suggesting major changes, ask if a new branch should be created.
- When recovering from a commit: prefer `git restore .` over `git reset --hard` to preserve untracked files like .kilo/.
- Use `git status` before any destructive operation.

## Operational modes / agent roles

Activate one role at a time using the short invocation below. The role controls focus and output style; it does not expand scope.

- `@planner` — Analyze the request, define the smallest viable implementation plan, list dependencies and acceptance criteria, and identify risks. Do not edit files.
- `@developer` — Implement the requested change directly with the smallest compatible diff, follow existing conventions, and validate the result.
- `@seo-auditor` — Audit HTML structure, metadata, structured data, accessibility, content signals, and deployment metadata. Report findings and required fixes without unrelated changes.
- `@performance` — Measure and improve Core Web Vitals, loading behavior, asset delivery, rendering cost, and layout stability. Preserve functionality and visual intent.
- `@devops` — Handle branching, repository state, build/deployment checks, GitHub Pages publication, and safe recovery procedures.

If no role is specified, use `@developer`. Switch roles only when the user explicitly invokes one or when the current role cannot complete the requested work. Keep mode changes explicit and concise.

## Anti-overthinking & execution guardrails

- Prefer direct execution over long internal reasoning or speculative analysis.
- During task execution, keep user-facing responses under 200 words.
- Work in the smallest useful increments and stop at the first blocking error.
- Report the exact failing command, file, line, or browser assertion; do not guess at unrelated causes.
- Do not perform unsolicited refactoring, redesign, dependency changes, or scope expansion.
- Do not add features, comments, documentation, or abstractions that the request does not require.
- Reuse existing patterns and APIs before introducing new ones.
- Do not repeat successful validation steps or provide heavy logs, DOM dumps, or speculative alternatives.
- If the request is ambiguous, make the smallest reasonable assumption, state it briefly, and continue when the assumption is reversible.
- Treat security, SEO, accessibility, responsive behavior, and repository safety as hard constraints, not optional polish.

## Responsive design
- Mobile-first, use flexbox/grid, test at 375px, 768px, 1024px.
- Always include `<meta name="viewport" content="width=device-width, initial-scale=1.0">`.
- Use `clamp()` or `vw` for fluid typography.
- Verify zero horizontal scroll at every breakpoint.

## SEO rules (mandatory from 2026-09-02)

### HTML structure
- One single `<h1>` per page (set by the dynamic header), followed by logical `<h2>` / `<h3>` hierarchy. Never skip levels.
- Use semantic tags: `<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<address>`, `<footer>`.
- Every `<address>` for a physical location must use `itemscope itemtype="https://schema.org/PostalAddress"` and include `itemprop="streetAddress"`, `addressLocality`, `addressCountry`.
- Every `<img>` must have descriptive `alt` (not just "image" or filename). Decorative images use `alt=""`.

### Meta tags
- `<title>` between 50 and 60 characters. Format: `Tema principal | Master Herramientas`.
- `<meta name="description">` between 150 and 160 characters. Plain prose, no emoji, no decorative symbols.
- `<meta name="robots">` should stay `index, follow, max-image-preview: large, max-snippet: -1, max-video-preview: -1`.
- Always set `<html lang="es-CO">`.
- Keep canonical, hreflang (es-CO + x-default) and Open Graph / Twitter Cards in sync with the page title and description.

### Structured data (Schema.org / JSON-LD)
- A single `<script type="application/ld+json">` with `@graph` must live in `<head>` of every public page.
- Required nodes for the landing: `Organization`, `LocalBusiness` (with `department[]` for each branch), `WebSite`, `WebPage`, `BreadcrumbList`, `FAQPage`, `VideoObject` (when there's a video).
- Every `LocalBusiness` location must have: `address`, `geo` (GeoCoordinates), `telephone`, `openingHoursSpecification`.
- Update `WebPage.dateModified` only on meaningful SEO/content changes (not on every deploy).
- Do **not** create `llms.txt` — Google does not require it.

### Performance (Core Web Vitals)
- LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1.
- LCP image (hero) must be preloaded with `<link rel="preload" as="image">`.
- Use WebP/AVIF with `<img srcset>` and explicit `width`/`height` to prevent CLS.
- Defer non-critical JS (`<script defer>`) and lazy-load below-the-fold components via `IntersectionObserver`.
- CSS is loaded with `rel="preload" as="style" onload="this.rel='stylesheet'"` + `<noscript>` fallback for non-critical styles.
- Reserve space (min-height / aspect-ratio) for async components to prevent layout shift.
- `font-display: swap` on all webfonts; provide `size-adjust`, `ascent-override`, `descent-override` fallbacks.

### Security headers
- Keep CSP (`Content-Security-Policy`) restrictive but compatible with Bootstrap, Leaflet, FontAwesome, Google Fonts and Google reCAPTCHA via whitelisted CDNs.
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` with minimal allowances.

### Content (E-E-A-T & AEO/GEO)
- First paragraph of each section must answer the user's likely question directly (AEO).
- Avoid keyword stuffing; write for humans, not for crawlers.
- Keep FAQPage answers concise (1–2 sentences) and self-contained.
- Update `dateModified` and refresh content if the underlying information changes (address, hours, phone, services).
- Comply with WCAG 2.1 AA: contrast ratio ≥ 4.5:1 for body text, ≥ 3:1 for large text; clickable targets ≥ 44×44 px on mobile.

### Mandatory review
- **Every significant content change** (new section, modified copy, new address/hours, new service) MUST trigger an SEO review: update JSON-LD, FAQ, `dateModified`, OG/Twitter, sitemap.
- Reference date for the current SEO baseline: **2026-08-31**.
- See `docs/SEO.md` for the full checklist and the audit history.

## Playwright MCP integration

Use the Playwright MCP browser tools for automated visual and functional verification when a change affects layout, navigation, interactions, or browser behavior.

### Required workflow
1. Start from the current local or preview URL and wait for the page to reach a stable state.
2. Test viewport widths of **375px, 768px, and 1024px** using representative mobile, tablet, and desktop heights.
3. At every breakpoint, verify:
   - The page loads successfully.
   - `document.documentElement.scrollWidth` and `document.body.scrollWidth` do not exceed the viewport width.
   - No browser console errors occur.
   - No uncaught page errors occur.
   - Primary navigation and requested interactions work.
   - Important content remains visible, readable, and free of overlap or clipping.
4. Capture screenshots when visual inspection is needed, especially after responsive, sticky elements, overlays, menus, forms, maps, and dynamically loaded sections.
5. Re-run the affected checks after each meaningful fix.
6. Stop at the first blocking failure and report its breakpoint, action, and exact error.

### Reporting format
Return a concise pass/fail report, never a heavy DOM dump:

| Breakpoint | Load | Horizontal scroll | Console errors | Functional checks | Result |
|---|---|---|---|---|---|
| 375px | Pass/Fail | Pass/Fail | Pass/Fail | Pass/Fail | Pass/Fail |
| 768px | Pass/Fail | Pass/Fail | Pass/Fail | Pass/Fail | Pass/Fail |
| 1024px | Pass/Fail | Pass/Fail | Pass/Fail | Pass/Fail | Pass/Fail |

Include only failed assertions and the smallest relevant remediation when the report is not fully passing.

## Branching & git
- Default branch: `master`. Production deployment happens on push to `origin/master`.
- For non-trivial changes, propose a feature branch first.
- Never force-push to `master`; never amend public commits.
- Inspect `git status` and `git diff` before every commit.

## Kilo Code Native Memory Protocol

### Context Memory Integration
- **Memory Check**: Before starting any task, reference stored tokens in Project Memory to recall previous decisions, CSS mappings, or architectural constraints.
- **Auto-Update Trigger**: Upon resolving a bug or completing a refactor, summarize the key solution in 1-2 concise sentences and request Kilo Code to update the Project Memory context.
- **Anti-Duplication**: Do not create or write to external `.md` files for learnings; rely entirely on Kilo Code's native memory system.