/**
 * Lab 310: Wait Best Practices
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for waiting:
 *
 * - Choosing the right wait
 * - Avoiding anti-patterns
 * - Performance tips
 * - Reliable tests
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply wait best practices
 * 2. Avoid common mistakes
 * 3. Write reliable tests
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Trust Auto-Waiting
test('trust auto-waiting', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Playwright auto-waits for elements
    // No need for explicit waits before actions
    await page.getByRole('link', { name: 'Get started' }).click();

    await expect(page).toHaveURL(/.*intro/);
});

// Solution 2: Use Assertions for Verification
test('use assertions for verification', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Bad: Manual wait then check
    // await page.waitForSelector('h1');
    // const text = await page.locator('h1').textContent();
    // expect(text).toContain('Playwright');

    // Good: Assertion with auto-retry
    await expect(page.locator('h1')).toContainText('Playwright');
});

// Solution 3: Avoid Fixed Timeouts
test('avoid fixed timeouts', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Bad: Fixed timeout
    // await page.waitForTimeout(3000);
    // await page.click('button');

    // Good: Wait for condition
    await expect(page.locator('h1')).toBeVisible();
    await page.getByRole('link', { name: 'Get started' }).click();

    await expect(page).toHaveURL(/.*intro/);
});

// Solution 4: Choose Right Wait Type
test('choose right wait type', async ({ page }) => {
    await page.goto('https://playwright.dev');

    /*
     * Wait Type Selection:
     *
     * Element visible: expect(locator).toBeVisible()
     * Element text: expect(locator).toContainText()
     * URL change: expect(page).toHaveURL()
     * Network: waitForResponse()
     * Custom: waitForFunction() or expect.poll()
     */

    await expect(page.locator('h1')).toBeVisible();
});

// Solution 5: Wait for Specific Conditions
test('wait for specific conditions', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Bad: Generic wait
    // await page.waitForLoadState('networkidle');

    // Good: Wait for specific element
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
});

// Solution 6: Handle Dynamic Content
test('handle dynamic content', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // For dynamic content, wait for specific element
    await expect(page.locator('h1')).toBeVisible();

    // Or use expect.poll for complex conditions
    await expect.poll(async () => {
        return await page.locator('a').count();
    }).toBeGreaterThan(5);
});

// Solution 7: Network Wait Patterns
test('network wait patterns', async ({ page }) => {
    // Wait for response during navigation
    const responsePromise = page.waitForResponse(/playwright/);
    await page.goto('https://playwright.dev');
    await responsePromise;

    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Parallel Waits
test('parallel waits', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Wait for multiple conditions in parallel
    await Promise.all([
        expect(page.locator('h1')).toBeVisible(),
        expect(page.locator('nav')).toBeVisible(),
        expect(page.locator('footer')).toBeVisible(),
    ]);
});

// Solution 9: Timeout Configuration
test('timeout configuration', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Configure timeouts appropriately
    // Global: playwright.config.ts
    // Per-test: test.setTimeout()
    // Per-action: { timeout: 10000 }

    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
});

// Solution 10: Retry Pattern
test('retry pattern', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Use toPass for retry logic
    await expect(async () => {
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.locator('h1')).toContainText('Playwright');
    }).toPass({ timeout: 10000 });
});

// Solution 11: Wait Anti-Patterns
test('wait anti-patterns', async ({ page }) => {
    await page.goto('https://playwright.dev');

    /*
     * Anti-patterns to avoid:
     *
     * 1. await page.waitForTimeout(5000);
     * 2. while (!visible) { await sleep(100); }
     * 3. await page.waitForLoadState('networkidle'); // for every action
     * 4. Excessive waitForSelector before actions
     */

    // Good pattern
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 12: Wait Best Practices Summary
test('wait best practices summary', async ({ page }) => {
    await page.goto('https://playwright.dev');

    /*
     * Best Practices Summary:
     *
     * 1. Trust Playwright's auto-waiting
     * 2. Use assertions for verification
     * 3. Avoid fixed timeouts
     * 4. Choose appropriate wait type
     * 5. Wait for specific conditions
     * 6. Handle dynamic content properly
     * 7. Use parallel waits when possible
     * 8. Configure timeouts appropriately
     * 9. Use retry patterns for flaky conditions
     * 10. Avoid anti-patterns
     */

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Playwright');
});
