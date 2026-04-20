# Command: /playwright-test

Run Playwright tests for category filter verification.

## Usage

```
/playwright-test run     # Run all tests
/playwright-test status  # Show test status
```

## Description

Run Playwright E2E tests that verify:

1. Page reload shows all categories
2. Click on each category shows only that category
3. Unclicked categories are hidden
4. Filter applies correctly

## Test Cases

- `reload page shows all categories visible`
- `click category shows only that category and hides others`
- `unclicked categories are hidden when one is selected`
- `switching categories toggles visibility correctly`
- `All category shows all rows`
- `click each category verifies filter applies correctly`

## Categories Tested

- elevacion
- perforacion
- mezclado
- limpieza
- soldadura
- construccion
- movimiento
- jardin