/**
 * Lab 330: Debugging Best Practices
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for debugging:
 *
 * - Debugging strategies
 * - Tool selection
 * - Common issues
 * - Prevention
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply debugging best practices
 * 2. Choose right tools
 * 3. Prevent common issues
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Start with UI Mode
test('start with UI mode', async ({ page }) => {
    /*
     * First debugging step:
     * npx playwright test --ui
     *
     * Benefits:
     * - Visual test execution
     * - Time travel debugging
     * - DOM inspection
     */

    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Use Trace Viewer
test('use trace viewer', async ({ page }) => {
    /*
     * For failed tests:
     * npx playwright show-trace trace.zip
     *
     * Benefits:
     * - See exact state at failure
     * - Network requests
     * - Console logs
     */

    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Use Headed Mode
test('use headed mode', async ({ page }) => {
    /*
     * See browser during test:
     * npx playwright test --headed
     *
     * Combined with slow motion:
     * npx playwright test --headed --slow-mo=500
     */

    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Use page.pause()
test('use page pause', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Pause at specific point
    // await page.pause();

    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 5: Isolate the Problem
test('isolate the problem', async ({ page }) => {
    /*
     * Debugging strategy:
     * 1. Run single test: npx playwright test -g "test name"
     * 2. Add console.log statements
     * 3. Use page.pause() at key points
     * 4. Check element visibility
     */

    await page.goto('https://playwright.dev');

    // Debug: Check element exists
    const heading = page.locator('h1');
    console.log('Heading visible:', await heading.isVisible());
    console.log('Heading text:', await heading.textContent());

    await expect(heading).toBeVisible();
});

// Solution 6: Check Selectors
test('check selectors', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Debug selector issues
    const selector = 'h1';
    const count = await page.locator(selector).count();
    console.log(`Selector "${selector}" matches ${count} elements`);

    // Use Pick Locator in VS Code extension
    await expect(page.locator(selector)).toBeVisible();
});

// Solution 7: Check Timing
test('check timing', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Debug timing issues
    const start = Date.now();
    await page.getByRole('link', { name: 'Get started' }).click();
    console.log(`Click took ${Date.now() - start}ms`);

    await expect(page).toHaveURL(/.*intro/);
});

// Solution 8: Check Network
test('check network', async ({ page }) => {
    // Debug network issues
    page.on('requestfailed', request => {
        console.log('Failed:', request.url(), request.failure()?.errorText);
    });

    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Check Console Errors
test('check console errors', async ({ page }) => {
    // Debug JavaScript errors
    page.on('pageerror', error => {
        console.log('Page error:', error.message);
    });

    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('Console error:', msg.text());
        }
    });

    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Use Retries Wisely
test('use retries wisely', async ({ page }) => {
    /*
     * Configure retries in playwright.config.ts:
     * retries: process.env.CI ? 2 : 0
     *
     * But fix flaky tests, don't just retry!
     */

    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 11: Document Issues
test('document issues', async ({ page }, testInfo) => {
    await page.goto('https://playwright.dev');

    // Attach debugging info
    await testInfo.attach('url', {
        body: page.url(),
        contentType: 'text/plain',
    });

    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 12: Debugging Best Practices Summary
test('debugging best practices summary', async ({ page }) => {
    /*
     * Debugging Best Practices:
     *
     * 1. Start with UI mode for visual debugging
     * 2. Use trace viewer for failed tests
     * 3. Use headed mode with slow motion
     * 4. Use page.pause() at specific points
     * 5. Isolate the problem (single test)
     * 6. Check selectors (count, visibility)
     * 7. Check timing (log durations)
     * 8. Check network (failed requests)
     * 9. Check console errors
     * 10. Use retries wisely (fix root cause)
     * 11. Document issues with attachments
     * 12. Use VS Code extension features
     */

    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});
