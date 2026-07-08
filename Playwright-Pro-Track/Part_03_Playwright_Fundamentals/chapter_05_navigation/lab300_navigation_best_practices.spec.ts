/**
 * Lab 300: Navigation Best Practices
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for navigation:
 *
 * - Reliable navigation
 * - Performance tips
 * - Error handling
 * - Common patterns
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply navigation best practices
 * 2. Handle edge cases
 * 3. Optimize navigation
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Verify Navigation Success
test('verify navigation success', async ({ page }) => {
    const response = await page.goto('https://playwright.dev');

    // Always verify navigation succeeded
    expect(response).not.toBeNull();
    expect(response!.ok()).toBe(true);

    await expect(page).toHaveURL(/playwright/);
});

// Solution 2: Wait for Content After Navigation
test('wait for content after navigation', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Don't just check URL, verify content
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
});

// Solution 3: Use Appropriate Wait Strategy
test('use appropriate wait strategy', async ({ page }) => {
    // For fast pages
    await page.goto('https://playwright.dev', {
        waitUntil: 'domcontentloaded',
    });

    // For pages with async content
    // await page.goto(url, { waitUntil: 'networkidle' });

    await expect(page.locator('h1')).toBeVisible();
});

// Solution 4: Handle Dynamic Content
test('handle dynamic content', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Wait for dynamic content to load
    await page.waitForLoadState('networkidle');

    // Or wait for specific element
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 5: Navigation with Retry
test('navigation with retry', async ({ page }) => {
    await expect(async () => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    }).toPass({ timeout: 30000 });
});

// Solution 6: Avoid Hardcoded Waits
test('avoid hardcoded waits', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Bad: Hardcoded wait
    // await page.waitForTimeout(5000);

    // Good: Wait for condition
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 7: Use Base URL
test('use base URL', async ({ page, baseURL }) => {
    // Configure baseURL in playwright.config.ts
    // Then use relative paths
    await page.goto('/');

    await expect(page).toHaveURL(/playwright/);
});

// Solution 8: Handle Redirects
test('handle redirects', async ({ page }) => {
    const response = await page.goto('https://playwright.dev');

    // Check final URL after redirects
    await expect(page).toHaveURL(/playwright/);

    // Response is from final URL
    expect(response!.ok()).toBe(true);
});

// Solution 9: Navigation Timeout Configuration
test('navigation timeout configuration', async ({ page }) => {
    // Set reasonable timeout
    await page.goto('https://playwright.dev', {
        timeout: 30000, // 30 seconds
    });

    // Configure globally in playwright.config.ts:
    // use: { navigationTimeout: 30000 }

    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Clean Navigation Pattern
test('clean navigation pattern', async ({ page }) => {
    // Navigate
    await page.goto('https://playwright.dev');

    // Verify page loaded
    await expect(page).toHaveTitle(/Playwright/);

    // Verify key elements
    await expect(page.locator('h1')).toBeVisible();

    // Perform actions
    await page.getByRole('link', { name: 'Get started' }).click();

    // Verify navigation result
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 11: SPA Navigation Pattern
test('SPA navigation pattern', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Click link
    await page.getByRole('link', { name: 'Get started' }).click();

    // Wait for URL change (SPA)
    await page.waitForURL(/.*intro/);

    // Verify content updated
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 12: Navigation Best Practices Summary
test('navigation best practices summary', async ({ page }) => {
    /*
     * Navigation Best Practices:
     *
     * 1. Always verify navigation success
     * 2. Wait for content, not just URL
     * 3. Use appropriate wait strategy
     * 4. Handle dynamic content
     * 5. Implement retry logic
     * 6. Avoid hardcoded waits
     * 7. Use base URL configuration
     * 8. Handle redirects properly
     * 9. Set reasonable timeouts
     * 10. Verify key elements after navigation
     * 11. Handle SPA navigation correctly
     * 12. Implement error handling
     */

    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
    await expect(page.locator('h1')).toBeVisible();
});
