/**
 * Lab 343: Test Annotations
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using test annotations:
 * 
 * - test.skip()
 * - test.only()
 * - test.fixme()
 * - test.slow()
 * - test.fail()
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use test annotations
 * 2. Conditional annotations
 * 3. Annotation best practices
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Skip Test
test.skip('skipped test', async ({ page }) => {
    // This test is skipped
    await page.goto('https://playwright.dev');
});

// Solution 2: Conditional Skip
test('conditional skip', async ({ page, browserName }) => {
    test.skip(browserName === 'firefox', 'Not supported in Firefox');
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Skip in Test Body
test('skip in body', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const hasFeature = await page.locator('.new-feature').isVisible();
    if (!hasFeature) {
        test.skip();
    }
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Only Test
// test.only('only this test runs', async ({ page }) => {
//     await page.goto('https://playwright.dev');
//     await expect(page).toHaveTitle(/Playwright/);
// });

// Solution 5: Fixme Test
test.fixme('fixme test', async ({ page }) => {
    // This test needs fixing
    await page.goto('https://playwright.dev');
});

// Solution 6: Conditional Fixme
test('conditional fixme', async ({ page }) => {
    test.fixme(true, 'Waiting for bug fix');
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Slow Test
test('slow test', async ({ page }) => {
    test.slow(); // Triples timeout
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Conditional Slow
test('conditional slow', async ({ page, browserName }) => {
    test.slow(browserName === 'webkit', 'Webkit is slower');
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Fail Test
test('expected to fail', async ({ page }) => {
    test.fail(); // Test is expected to fail
    
    await page.goto('https://playwright.dev');
    // This assertion will fail, but test passes because we expect failure
    await expect(page).toHaveTitle(/NonExistent/);
});

// Solution 10: Conditional Fail
test('conditional fail', async ({ page, browserName }) => {
    test.fail(browserName === 'firefox', 'Known Firefox issue');
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 11: Test Info Annotations
test('test info annotations', async ({ page }, testInfo) => {
    // Add custom annotations
    testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/issue/123',
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 12: Multiple Annotations
test('multiple annotations', async ({ page }, testInfo) => {
    testInfo.annotations.push(
        { type: 'category', description: 'smoke' },
        { type: 'priority', description: 'high' },
    );
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 13: Annotation Best Practices
test('annotation best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use skip for unsupported features
     * 2. Use fixme for known issues
     * 3. Use slow for performance tests
     * 4. Use fail for expected failures
     * 5. Add issue links in annotations
     * 6. Remove only before commit
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

