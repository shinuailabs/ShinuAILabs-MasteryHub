/**
 * Lab 290: Assertion Best Practices
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for assertions:
 *
 * - Choosing right assertions
 * - Meaningful messages
 * - Performance tips
 * - Common patterns
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply assertion best practices
 * 2. Write meaningful assertions
 * 3. Optimize assertion performance
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Use Specific Assertions
test('use specific assertions', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Good: Specific assertion
    await expect(page.locator('h1')).toBeVisible();

    // Avoid: Generic assertion
    // const isVisible = await page.locator('h1').isVisible();
    // expect(isVisible).toBe(true);
});

// Solution 2: Assert State, Not Implementation
test('assert state not implementation', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Good: Assert user-visible state
    await expect(page.locator('h1')).toContainText('Playwright');

    // Avoid: Assert implementation details
    // await expect(page.locator('h1')).toHaveAttribute('data-loaded', 'true');
});

// Solution 3: One Assertion Per Concept
test('one assertion per concept', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Good: Clear, focused assertions
    await expect(page).toHaveTitle(/Playwright/);
    await expect(page.locator('h1')).toBeVisible();

    // Each assertion tests one thing
});

// Solution 4: Use Auto-Waiting Assertions
test('use auto-waiting assertions', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Good: Auto-waiting assertion
    await expect(page.locator('h1')).toBeVisible();

    // Avoid: Manual wait + assertion
    // await page.waitForSelector('h1');
    // const heading = page.locator('h1');
    // expect(await heading.isVisible()).toBe(true);
});

// Solution 5: Meaningful Error Messages
test('meaningful error messages', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Good: Custom message for context
    await expect(
        page.locator('h1'),
        'Homepage heading should be visible after page load'
    ).toBeVisible();
});

// Solution 6: Assert After Actions
test('assert after actions', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Perform action
    await page.getByRole('link', { name: 'Get started' }).click();

    // Always assert the result
    await expect(page).toHaveURL(/.*intro/);
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 7: Avoid Flaky Assertions
test('avoid flaky assertions', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Good: Stable assertion
    await expect(page.locator('h1')).toContainText(/Playwright/i);

    // Avoid: Assertions on dynamic content
    // await expect(element).toHaveText('Updated 5 seconds ago');

    // Avoid: Exact counts that may change
    // await expect(page.locator('a')).toHaveCount(47);
});

// Solution 8: Use Appropriate Timeout
test('use appropriate timeout', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Default timeout is usually fine
    await expect(page.locator('h1')).toBeVisible();

    // Increase for slow operations
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

    // Don't set unnecessarily long timeouts
});

// Solution 9: Group Related Assertions
test('group related assertions', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Group: Page loaded correctly
    await expect(page).toHaveTitle(/Playwright/);
    await expect(page).toHaveURL(/playwright/);

    // Group: Main content visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
});

// Solution 10: Prefer Locator Assertions
test('prefer locator assertions', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Good: Locator assertion (auto-retry)
    await expect(page.locator('h1')).toHaveText(/Playwright/);

    // Avoid: Get value then assert (no auto-retry)
    // const text = await page.locator('h1').textContent();
    // expect(text).toContain('Playwright');
});

// Solution 11: Test User Experience
test('test user experience', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Assert what user sees
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible();

    // Not internal state
    // await expect(page.locator('[data-state="loaded"]')).toBeVisible();
});

// Solution 12: Summary of Best Practices
test('assertion best practices summary', async ({ page }) => {
    await page.goto('https://playwright.dev');

    /*
     * Assertion Best Practices:
     *
     * 1. Use specific assertions (toBeVisible, toHaveText)
     * 2. Assert state, not implementation
     * 3. One assertion per concept
     * 4. Use auto-waiting assertions
     * 5. Add meaningful error messages
     * 6. Always assert after actions
     * 7. Avoid flaky assertions
     * 8. Use appropriate timeouts
     * 9. Group related assertions
     * 10. Prefer locator assertions
     * 11. Test user experience
     * 12. Use soft assertions wisely
     */

    await expect(page.locator('h1')).toBeVisible();
});
