# Playwright Tests - Category Filter

## Installation

```bash
cd tests/playwright
npm install
```

## Run Tests

```bash
# Run all tests
npm test

# Run with visible browser
npm run test:headed

# Run with UI
npm run test:ui
```

## Test Cases

| Test | Description |
|------|-------------|
| reload page shows all categories visible | Verify page reload shows all categories |
| click category shows only that category and hides others | Click each category and verify filter works |
| unclicked categories are hidden when one is selected | Verify non-selected categories are hidden |
| switching categories toggles visibility correctly | Switch between categories |
| All category shows all rows | Verify "All" shows everything |
| click each category verifies filter applies correctly | Full filter verification |

## Expected Behavior

When a category is clicked:
- Rows with matching category should have `display !== 'none'`
- Rows with different category should have `display === 'none'`

When "All" is clicked:
- All rows should have `display !== 'none'`