/**
 * Lab 348: Test Retries
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Configuring test retries:
 * 
 * - Retry configuration
 * - Retry count
 * - Retry hooks
 * - Flaky test handling
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Configure retries
 * 2. Handle flaky tests
 * 3. Use retry hooks
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Global Retries
test('global retries', async ({ page }) => {
    /*
     * In playwright.config.ts:
     * 
     * export default defineConfig({
     *   retries: 2, // Retry failed tests twice
     * });
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: CI-Based Retries
test('CI based retries', async ({ page }) => {
    /*
     * In playwright.config.ts:
     * 
     * export default defineConfig({
     *   retries: process.env.CI ? 2 : 0,
     * });
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Project Retries
test('project retries', async ({ page }) => {
    /*
     * Per-project retries:
     * 
     * projects: [
     *   { name: 'stable', retries: 0 },
     *   { name: 'flaky', retries: 3 },
     * ],
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Check Retry Count
test('check retry count', async ({ page }, testInfo) => {
    console.log('Retry attempt:', testInfo.retry);
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Different Behavior on Retry
test('different behavior on retry', async ({ page }, testInfo) => {
    if (testInfo.retry > 0) {
        console.log('This is a retry, adding extra wait');
        await page.waitForTimeout(1000);
    }
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Retry with Screenshot
test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
        // Take screenshot on failure (before retry)
        const screenshot = await page.screenshot();
        await testInfo.attach(`failure-retry-${testInfo.retry}`, {
            body: screenshot,
            contentType: 'image/png',
        });
    }
});

test('retry with screenshot', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Flaky Test Annotation
test('flaky test', async ({ page }, testInfo) => {
    // Mark test as flaky
    testInfo.annotations.push({ type: 'flaky', description: 'Known flaky test' });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Retry Artifacts
test('retry artifacts', async ({ page }) => {
    /*
     * Configure artifacts for retries:
     * 
     * use: {
     *   trace: 'on-first-retry',
     *   video: 'on-first-retry',
     * },
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: CLI Retries
test('CLI retries', async ({ page }) => {
    /*
     * Override retries via CLI:
     * npx playwright test --retries=3
     * 
     * Run without retries:
     * npx playwright test --retries=0
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Retry Best Practices
test('retry best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use retries in CI only
     * 2. Fix flaky tests, don't just retry
     * 3. Capture artifacts on retry
     * 4. Track flaky tests
     * 5. Investigate root causes
     * 6. Use appropriate retry count
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 11: Describe Retries
test.describe('Describe with Retries', () => {
    test.describe.configure({ retries: 2 });
    
    test('test with retries', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
});

// Solution 12: Conditional Retry Logic
test('conditional retry logic', async ({ page }, testInfo) => {
    const maxRetries = 3;
    
    if (testInfo.retry >= maxRetries) {
        console.log('Max retries reached, skipping additional checks');
    }
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

