/**
 * Lab 301: Auto-Waiting
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Playwright's auto-waiting mechanism:
 * 
 * - Automatic waits
 * - Actionability checks
 * - Built-in retries
 * - Timeout handling
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Understand auto-waiting
 * 2. Use actionability checks
 * 3. Configure timeouts
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Auto-Wait for Click
test('auto-wait for click', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Playwright auto-waits for element to be:
    // - Attached to DOM
    // - Visible
    // - Stable (not animating)
    // - Enabled
    // - Not obscured
    await page.getByRole('link', { name: 'Get started' }).click();
    
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 2: Auto-Wait for Fill
test('auto-wait for fill', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Auto-waits for input to be editable
    const searchInput = page.getByPlaceholder('Search docs');
    await searchInput.fill('test');
    
    await expect(searchInput).toHaveValue('test');
    
    await page.keyboard.press('Escape');
});

// Solution 3: Auto-Wait for Assertions
test('auto-wait for assertions', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Assertions auto-retry until passing or timeout
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Playwright');
});

// Solution 4: Actionability Checks
test('actionability checks', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * Playwright checks before actions:
     * - Attached: Element is in DOM
     * - Visible: Element has non-zero size and is not hidden
     * - Stable: Element is not animating
     * - Enabled: Element is not disabled
     * - Receives Events: Element is not obscured
     */
    
    const link = page.getByRole('link', { name: 'Get started' });
    await link.click(); // All checks performed automatically
    
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 5: Custom Timeout
test('custom timeout', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Override default timeout for this action
    await page.getByRole('link', { name: 'Get started' }).click({
        timeout: 10000, // 10 seconds
    });
    
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 6: Force Action (Skip Checks)
test('force action', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Force bypasses actionability checks
    // Use sparingly - may indicate test issues
    await page.locator('h1').click({ force: true });
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 7: No Wait After
test('no wait after', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Don't wait for navigation after click
    await page.getByRole('link', { name: 'Get started' }).click({
        noWaitAfter: true,
    });
    
    // Manually wait
    await page.waitForURL(/.*intro/);
});

// Solution 8: Trial Run
test('trial run', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Check if action would succeed without performing it
    await page.getByRole('link', { name: 'Get started' }).click({
        trial: true,
    });
    
    // URL should not change
    await expect(page).toHaveURL('https://playwright.dev/');
});

// Solution 9: Wait for Element State
test('wait for element state', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const heading = page.locator('h1');
    
    // Explicit wait for state
    await heading.waitFor({ state: 'visible' });
    
    await expect(heading).toBeVisible();
});

// Solution 10: Auto-Wait Best Practices
test('auto-wait best practices', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * Best Practices:
     * 1. Trust auto-waiting - don't add manual waits
     * 2. Use assertions for verification
     * 3. Increase timeout for slow operations
     * 4. Avoid force unless necessary
     * 5. Use trial for debugging
     */
    
    // Good: Let Playwright handle waiting
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL(/.*intro/);
    
    // Avoid: Manual waits
    // await page.waitForTimeout(1000);
    // await page.click('a');
});

