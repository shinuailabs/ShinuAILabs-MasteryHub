/**
 * Lab 280: Action Best Practices
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for actions:
 *
 * - Reliable interactions
 * - Error handling
 * - Performance tips
 * - Common patterns
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply action best practices
 * 2. Handle edge cases
 * 3. Write reliable tests
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Wait for Element Before Action
test('wait before action', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Playwright auto-waits, but explicit wait when needed
    const link = page.getByRole('link', { name: 'Get started' });
    await link.waitFor({ state: 'visible' });
    await link.click();

    await expect(page).toHaveURL(/.*intro/);
});

// Solution 2: Verify State After Action
test('verify after action', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Perform action
    await page.getByRole('link', { name: 'Get started' }).click();

    // Always verify the result
    await expect(page).toHaveURL(/.*intro/);
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 3: Use Appropriate Action
test('use appropriate action', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Good: Use fill() for inputs (clears first)
    // await page.getByLabel('Email').fill('test@example.com');

    // Avoid: Using type() when fill() is better
    // await page.getByLabel('Email').type('test@example.com');

    // Good: Use check() for checkboxes
    // await page.getByRole('checkbox').check();

    // Avoid: Using click() for checkboxes
    // await page.getByRole('checkbox').click();

    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 4: Handle Dynamic Content
test('handle dynamic content', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Wait for dynamic content to load
    await page.waitForLoadState('networkidle');

    // Or wait for specific element
    await page.locator('h1').waitFor();

    // Then interact
    await page.getByRole('link', { name: 'Get started' }).click();

    await expect(page).toHaveURL(/.*intro/);
});

// Solution 5: Retry on Failure
test('retry pattern', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Playwright has built-in retry for assertions
    // Use expect with auto-retry
    await expect(async () => {
        await page.getByRole('link', { name: 'Get started' }).click();
        await expect(page).toHaveURL(/.*intro/);
    }).toPass({ timeout: 10000 });
});

// Solution 6: Avoid Force Unless Necessary
test('avoid force', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Good: Let Playwright handle actionability
    await page.getByRole('link', { name: 'Get started' }).click();

    // Avoid: Using force bypasses important checks
    // await page.locator('a').click({ force: true });

    // Only use force when you understand why it's needed

    await expect(page).toHaveURL(/.*intro/);
});

// Solution 7: Chain Actions Properly
test('chain actions', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Good: Sequential actions with proper waits
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL(/.*intro/);

    // Each action waits for previous to complete
    await page.getByRole('link', { name: 'Docs' }).click();
    await expect(page).toHaveURL(/.*docs/);
});

// Solution 8: Handle Overlays
test('handle overlays', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Close any overlays before interacting
    // const closeButton = page.getByRole('button', { name: 'Close' });
    // if (await closeButton.isVisible()) {
    //     await closeButton.click();
    // }

    // Then perform main action
    await page.getByRole('link', { name: 'Get started' }).click();

    await expect(page).toHaveURL(/.*intro/);
});

// Solution 9: Use Soft Assertions for Non-Critical
test('soft assertions', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Soft assertions don't stop test
    await expect.soft(page).toHaveTitle(/Playwright/);

    // Continue even if soft assertion fails
    await page.getByRole('link', { name: 'Get started' }).click();

    // Hard assertion for critical check
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 10: Action Best Practices Summary
test('best practices summary', async ({ page }) => {
    await page.goto('https://playwright.dev');

    /*
     * Action Best Practices:
     *
     * 1. Let Playwright auto-wait
     * 2. Verify state after actions
     * 3. Use appropriate action methods
     * 4. Handle dynamic content
     * 5. Avoid force unless necessary
     * 6. Chain actions properly
     * 7. Handle overlays/modals
     * 8. Use soft assertions wisely
     * 9. Add meaningful timeouts
     * 10. Test edge cases
     */

    // Example of good practice
    const link = page.getByRole('link', { name: 'Get started' });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/.*intro/);
});
