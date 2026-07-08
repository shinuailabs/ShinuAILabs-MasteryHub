/**
 * Lab 298: SPA Navigation
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Single Page Application navigation:
 * 
 * - Client-side routing
 * - URL changes without reload
 * - History API
 * - Hash navigation
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Handle SPA navigation
 * 2. Wait for URL changes
 * 3. Verify content updates
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: SPA Link Click
test('SPA link click', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // SPA navigation - no full page reload
    await page.getByRole('link', { name: 'Get started' }).click();
    
    // Wait for URL change
    await page.waitForURL(/.*intro/);
    
    // Verify content updated
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 2: Wait for URL Change
test('wait for URL change', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Click triggers client-side navigation
    await page.getByRole('link', { name: 'Get started' }).click();
    
    // Wait for URL to change
    await page.waitForURL(/.*intro/);
    
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 3: Verify Content After SPA Navigation
test('verify content after SPA navigation', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.getByRole('link', { name: 'Get started' }).click();
    await page.waitForURL(/.*intro/);
    
    // Verify new content loaded
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('article')).toBeVisible();
});

// Solution 4: Hash Navigation
test('hash navigation', async ({ page }) => {
    await page.goto('https://playwright.dev/docs/intro');
    
    // Click anchor link (hash navigation)
    // await page.getByRole('link', { name: 'Section' }).click();
    
    // URL changes with hash
    // await expect(page).toHaveURL(/.*#section/);
    
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 5: History Push State
test('history push state', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Simulate SPA navigation with pushState
    await page.evaluate(() => {
        history.pushState({ page: 'about' }, '', '/about');
    });
    
    // URL changed without reload
    await expect(page).toHaveURL(/.*about/);
    
    // Go back
    await page.goBack();
    await expect(page).toHaveURL('https://playwright.dev/');
});

// Solution 6: History Replace State
test('history replace state', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Replace current history entry
    await page.evaluate(() => {
        history.replaceState({ page: 'new' }, '', '/new-url');
    });
    
    await expect(page).toHaveURL(/.*new-url/);
    
    // goBack won't go to original URL
});

// Solution 7: Wait for Content Update
test('wait for content update', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Click SPA link
    await page.getByRole('link', { name: 'Get started' }).click();
    
    // Wait for specific content to appear
    await expect(page.locator('h1')).toContainText(/Installation/);
});

// Solution 8: SPA with Loading State
test('SPA with loading state', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Click and wait for loading to complete
    await page.getByRole('link', { name: 'Get started' }).click();
    
    // Wait for loading indicator to disappear
    // await expect(page.locator('.loading')).toBeHidden();
    
    // Content should be visible
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 9: Multiple SPA Navigations
test('multiple SPA navigations', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // First navigation
    await page.getByRole('link', { name: 'Get started' }).click();
    await page.waitForURL(/.*intro/);
    
    // Second navigation
    await page.getByRole('link', { name: 'Docs' }).click();
    await page.waitForURL(/.*docs/);
    
    // Third navigation - go back
    await page.goBack();
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 10: SPA Route Parameters
test('SPA route parameters', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Navigate to route with parameters
    await page.getByRole('link', { name: 'Get started' }).click();
    
    // Verify route
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 11: SPA Query Parameters
test('SPA query parameters', async ({ page }) => {
    await page.goto('https://playwright.dev/docs/intro');
    
    // Add query parameter via SPA
    await page.evaluate(() => {
        const url = new URL(window.location.href);
        url.searchParams.set('tab', 'npm');
        history.pushState({}, '', url.toString());
    });
    
    await expect(page).toHaveURL(/tab=npm/);
});

// Solution 12: SPA Navigation Best Practices
test('SPA navigation best practices', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * SPA Navigation Best Practices:
     * 1. Use waitForURL for URL changes
     * 2. Verify content updates, not just URL
     * 3. Handle loading states
     * 4. Test browser back/forward
     * 5. Don't rely on page load events
     */
    
    await page.getByRole('link', { name: 'Get started' }).click();
    await page.waitForURL(/.*intro/);
    await expect(page.locator('h1')).toBeVisible();
});

