---
name: responsive-layout
description: Ensures that all HTML/CSS changes maintain responsive, mobile-first design. Use this skill when adding new sections, modifying layout, or styling components.
---

# Responsive Layout Guidelines

## Core Principles
- **Mobile-first**: Write styles for small screens first, then use `min-width` media queries for larger devices.
- **Fluid grids**: Use percentages, `flexbox`, `grid`, and relative units (`rem`, `vh`, `vw`) instead of fixed pixels for container widths.
- **Breakpoints**: Test and optimize at key widths: `375px`, `768px`, `1024px`, `1440px`.

## Required HTML meta tag
Ensure the `<head>` contains:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

## CSS Best Practices
- Use `max-width: 100%` and `height: auto` for all images.
- Prefer `flex-wrap: wrap` or `grid` with `auto-fit` for card layouts.
- Avoid horizontal overflow: check that no element has a fixed width larger than the viewport.
- For typography, use `clamp()` or `vw` for fluid font sizes (e.g., `font-size: clamp(1rem, 4vw, 2rem)`).

## Testing Workflow
After any change to layout or styling:
1. Open the page in Chrome DevTools.
2. Toggle device toolbar (`Ctrl+Shift+M`).
3. Test at 375px (iPhone SE), 768px (iPad), and 1024px (laptop).
4. Verify no horizontal scrollbar appears and all content is readable.

## Common Responsive Patterns for Landing Pages
- **Navigation**: Collapse into hamburger menu on mobile (if interactive).
- **Hero section**: Stack headline and CTA vertically on mobile, side-by-side on desktop.
- **Cards grid**: `display: grid; grid-template-columns: 1fr;` at mobile; `repeat(auto-fit, minmax(250px, 1fr))` at tablet/desktop.
- **Buttons**: Full width on mobile, inline-block on larger screens.

## When You Suggest Code Changes
- Always provide both mobile and desktop CSS when applicable.
- If a change could break responsive behavior, warn the user and offer a fallback.
- Prefer CSS Flexbox/Grid over floats or tables.
