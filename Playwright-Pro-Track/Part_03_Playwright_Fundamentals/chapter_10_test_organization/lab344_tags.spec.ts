/**
 * Lab 344: Test Tags
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using test tags:
 * 
 * - Tag syntax
 * - Running tagged tests
 * - Tag combinations
 * - Tag best practices
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Add tags to tests
 * 2. Run tests by tag
 * 3. Combine tags
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Tag
test('smoke test @smoke', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Multiple Tags
test('critical smoke test @smoke @critical', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Regression Tag
test('regression test @regression', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 4: Feature Tags
test('login feature @feature:login', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Priority Tags
test('high priority @priority:high', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

test('low priority @priority:low', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page.locator('footer')).toBeVisible();
});

// Solution 6: Run Tagged Tests
test('run by tag', async ({ page }) => {
    /*
     * Run tests with specific tag:
     * npx playwright test --grep @smoke
     * 
     * Run tests without tag:
     * npx playwright test --grep-invert @smoke
     * 
     * Run multiple tags (OR):
     * npx playwright test --grep "@smoke|@regression"
     * 
     * Run multiple tags (AND):
     * npx playwright test --grep "(?=.*@smoke)(?=.*@critical)"
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Describe with Tags
test.describe('Login Tests @login', () => {
    test('valid login @smoke', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
    
    test('invalid login @regression', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
});

// Solution 8: Environment Tags
test('production only @prod', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

test('staging only @staging', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Browser Tags
test('chromium only @chromium', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Chromium only');
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Config-Based Tags
test('config grep', async ({ page }) => {
    /*
     * In playwright.config.ts:
     * 
     * export default defineConfig({
     *   grep: /@smoke/,
     *   grepInvert: /@skip/,
     * });
     * 
     * Or per project:
     * projects: [
     *   { name: 'smoke', grep: /@smoke/ },
     *   { name: 'regression', grepInvert: /@smoke/ },
     * ],
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 11: Tag Conventions
test('tag conventions @smoke @p1', async ({ page }) => {
    /*
     * Common Tag Conventions:
     * @smoke - Quick sanity tests
     * @regression - Full test suite
     * @critical - Must-pass tests
     * @p1, @p2, @p3 - Priority levels
     * @feature:name - Feature-specific
     * @bug:123 - Bug-related tests
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 12: Tag Best Practices
test('tag best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use consistent naming
     * 2. Document tag meanings
     * 3. Don't over-tag
     * 4. Use tags for CI filtering
     * 5. Review tags regularly
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

