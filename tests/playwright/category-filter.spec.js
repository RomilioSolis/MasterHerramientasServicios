const { test, expect } = require('@playwright/test');

const CATEGORIES = [
  { id: 'elevacion', label: 'Elevación y Levante' },
  { id: 'perforacion', label: 'Perforación y Corte' },
  { id: 'mezclado', label: 'Mezclado y Compactación' },
  { id: 'limpieza', label: 'Limpieza e Hidráulica' },
  { id: 'soldadura', label: 'Soldadura y Energía' },
  { id: 'construccion', label: 'Construcción y Estructura' },
  { id: 'movimiento', label: 'Accesorios de Movimiento' },
  { id: 'jardin', label: 'Jardín y Forestal' }
];

test.describe('Category Filter', () => {
  
  async function getVisibleRows(page) {
    return page.evaluate(() => {
      const rows = document.querySelectorAll('#netflixRows .netflix-row');
      return Array.from(rows).map(row => ({
        category: row.dataset.category,
        display: row.style.display
      }));
    });
  }

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    await page.waitForSelector('#categoryTabs', { timeout: 15000 });
    await page.waitForSelector('#netflixRows .netflix-row', { timeout: 15000 });
  });

  test('reload page shows all categories visible', async ({ page }) => {
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    await page.waitForSelector('#categoryTabs', { timeout: 15000 });
    await page.waitForSelector('#netflixRows .netflix-row', { timeout: 15000 });
    
    const rows = await getVisibleRows(page);
    expect(rows.length).toBeGreaterThan(0);
    
    const visibleRows = rows.filter(r => r.display !== 'none');
    expect(visibleRows.length).toBeGreaterThan(0);
  });

  test('click category shows only that category and hides others', async ({ page }) => {
    for (const category of CATEGORIES) {
      const tab = page.locator(`#${category.id}-tab`);
      await expect(tab).toBeVisible({ timeout: 10000 });
      await tab.click();
      await page.waitForTimeout(800);
      
      const rows = await getVisibleRows(page);
      
      const visibleCategoryRows = rows.filter(r => r.category === category.id && r.display !== 'none');
      const hiddenCategoryRows = rows.filter(r => r.category !== category.id && r.display !== 'none');
      
      expect(visibleCategoryRows.length).toBeGreaterThan(0);
      expect(hiddenCategoryRows.length).toBe(0);
    }
  });

  test('unclicked categories are hidden when one is selected', async ({ page }) => {
    const firstCategory = CATEGORIES[0];
    const secondCategory = CATEGORIES[1];
    
    await page.locator(`#${firstCategory.id}-tab`).click();
    await page.waitForTimeout(800);
    
    let rows = await getVisibleRows(page);
    
    let firstVisible = rows.filter(r => r.category === firstCategory.id && r.display !== 'none');
    let othersVisible = rows.filter(r => r.category !== firstCategory.id && r.display !== 'none');
    
    expect(firstVisible.length).toBeGreaterThan(0);
    expect(othersVisible.length).toBe(0);
    
    await page.locator(`#${secondCategory.id}-tab`).click();
    await page.waitForTimeout(800);
    
    rows = await getVisibleRows(page);
    
    let secondVisible = rows.filter(r => r.category === secondCategory.id && r.display !== 'none');
    let othersAfter = rows.filter(r => r.category !== secondCategory.id && r.display !== 'none');
    
    expect(secondVisible.length).toBeGreaterThan(0);
    expect(othersAfter.length).toBe(0);
  });

  test('switching categories toggles visibility correctly', async ({ page }) => {
    for (const category of CATEGORIES) {
      await page.locator(`#${category.id}-tab`).click();
      await page.waitForTimeout(800);
      
      const rows = await getVisibleRows(page);
      
      for (const row of rows) {
        if (row.category === category.id) {
          expect(row.display).not.toBe('none');
        } else {
          expect(row.display).toBe('none');
        }
      }
    }
  });

  test('All category shows all rows', async ({ page }) => {
    await page.locator('#all-tab').click();
    await page.waitForTimeout(800);
    
    const rows = await getVisibleRows(page);
    
    const visibleRows = rows.filter(r => r.display !== 'none');
    expect(visibleRows.length).toBe(rows.length);
    expect(visibleRows.length).toBeGreaterThan(0);
  });

  test('click each category verifies filter applies correctly', async ({ page }) => {
    const activeTab = page.locator('#categoryTabs .nav-link.active');
    await expect(activeTab).toBeVisible();
    
    for (const category of CATEGORIES) {
      await page.locator(`#${category.id}-tab`).click();
      await page.waitForTimeout(600);
      
      const rows = await getVisibleRows(page);
      
      const matchingRows = rows.filter(r => r.category === category.id);
      const nonMatchingRows = rows.filter(r => r.category !== category.id);
      
      const visibleMatching = matchingRows.filter(r => r.display !== 'none');
      const visibleNonMatching = nonMatchingRows.filter(r => r.display !== 'none');
      
      expect(visibleMatching.length).toBeGreaterThan(0);
      expect(visibleNonMatching.length).toBe(0);
    }
  });
});