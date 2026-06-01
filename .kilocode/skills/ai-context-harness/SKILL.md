---
name: ai-context-harness
description: Provides core working rules for AI assistants on this static landing page project.
---

# AI Working Rules – Landing Page Project

- Project type: HTML, CSS, vanilla JavaScript (no frameworks).
- Deployment: GitHub Pages from the `master` branch.
- Paths: Always use relative paths (e.g., `./css/style.css`, `../assets/img/`).
- No external dependencies unless explicitly approved.
- Commands must work in WSL (Ubuntu): `git`, `code`, `npm` (only if package.json exists).
- Responsive design: mobile-first, use flexbox/grid, test at 375px, 768px, 1024px.
- Files in `.kilo/` are editor-specific – never touch or commit them.
- Before suggesting major changes, ask if a new branch should be created.
- When recovering from a commit: prefer `git restore .` over `git reset --hard` to preserve untracked files like .kilo/.
- Use `git status` before any destructive operation.
