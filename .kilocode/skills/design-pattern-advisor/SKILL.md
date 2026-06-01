---
name: design-pattern-advisor
description: Reviews the project codebase and identifies opportunities to apply appropriate design patterns (e.g., Module, Revealing Module, Observer, Factory, Singleton, etc.) while respecting vanilla JS constraints.
---

# Design Pattern Advisor – Skill for Kilo Code

## Purpose
This skill guides the AI assistant to analyze the existing code of this static landing page (HTML, CSS, vanilla JS) and suggest design patterns that can improve code organization, maintainability, and reusability, **without introducing frameworks or external dependencies**.

## Scope
- **Files to review**: All `.js` files in `/assets/js/`, `/components/*/`, and any other JS used in the project.
- **Current architecture**: Component Factory loads HTML/CSS/JS dynamically. Some components use global event listeners, others use IIFEs.

## Guidelines for the Agent

### 1. When to suggest a pattern
- **Repeated code** (similar functions or logic in multiple components) → consider **Module Pattern** or **Factory Pattern**.
- **Global event handling scattered** → consider **Observer (Pub/Sub) Pattern** (already partially present in `event-emitter.js`).
- **Complex UI state** (e.g., chat widget open/close, dropdowns) → consider **State Pattern** or **Revealing Module Pattern**.
- **Multiple similar components** (e.g., different card types) → consider **Factory Pattern** to create them dynamically.
- **Singletons** for shared services (e.g., chat manager, theme manager) → **Singleton Pattern** (but only when truly needed).

### 2. Constraints from project (`ai-context-harness`)
- **No frameworks** (React, Vue, etc.).
- **No ES6 modules** (no `import`/`export` unless converted or using `<script type="module">` – prefer global exposure via `window` or IIFE).
- **Vanilla JS only**.
- **Relative paths** for any external references.

### 3. How to present suggestions
For each pattern suggested:
- **Explain the problem** currently present.
- **Show the pattern** with a small code example adapted to the actual codebase.
- **Explain benefits** (reusability, testability, separation of concerns).
- **Provide a migration plan** (step-by-step, minimal changes).
- **Warn if pattern might be overkill**.

### 4. Priority order
- **High**: Patterns that fix existing bugs or flaky behavior (e.g., ensure chat widget opens correctly).
- **Medium**: Organization patterns that reduce code duplication.
- **Low**: Future-proofing patterns for features not yet needed.

### 5. Example: Revealing Module Pattern for Chat Widget
```javascript
const ChatWidget = (function() {
    let panel = null;
    function init() { ... }
    function open() { ... }
    function close() { ... }
    return { init, open, close };
})();
window.ChatWidget = ChatWidget;