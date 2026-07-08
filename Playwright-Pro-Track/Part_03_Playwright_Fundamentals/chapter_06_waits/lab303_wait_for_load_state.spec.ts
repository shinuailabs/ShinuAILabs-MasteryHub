/**
 * Lab 303: Wait for Load State
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Page load states:
 * 
 * - load
 * - domcontentloaded
 * - networkidle
 * - commit
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Wait for different load states
 * 2. Choose appropriate state
 * 3. Handle load events
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Wait for Load
test('wait for load', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for 'load' event
    await page.waitForLoadState('load');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Wait for DOMContentLoaded
test('wait for domcontentloaded', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for DOM to be ready
    await page.waitForLoadState('domcontentloaded');
    
    // DOM is ready, but resources may still be loading
    await expect(page.locator('body')).toBeVisible();
});

// Solution 3: Wait for NetworkIdle
test('wait for networkidle', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for network to be idle (no requests for 500ms)
    await page.waitForLoadState('networkidle');
    
    // All resources loaded
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Load State After Navigation
test('load state after navigation', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Click triggers navigation
    await page.getByRole('link', { name: 'Get started' }).click();
    
    // Wait for new page to load
    await page.waitForLoadState('load');
    
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 5: Load State After Click
test('load state after click', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.getByRole('link', { name: 'Get started' }).click();
    
    // Wait for network to settle
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 6: Multiple Load States
test('multiple load states', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for DOM first
    await page.waitForLoadState('domcontentloaded');
    
    // Then wait for full load
    await page.waitForLoadState('load');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Load State with Timeout
test('load state with timeout', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Custom timeout
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Frame Load State
test('frame load state', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for main frame load state
    await page.mainFrame().waitForLoadState('load');
    
    // For iframes
    // const frame = page.frame({ name: 'content' });
    // await frame?.waitForLoadState('load');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Load State Events
test('load state events', async ({ page }) => {
    // Listen for load event
    page.on('load', () => {
        console.log('Page loaded');
    });
    
    page.on('domcontentloaded', () => {
        console.log('DOM content loaded');
    });
    
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Choose Right Load State
test('choose right load state', async ({ page }) => {
    /*
     * When to use each state:
     * 
     * domcontentloaded: Fast, DOM ready
     * - Use for: Quick checks, DOM manipulation
     * 
     * load: All resources loaded
     * - Use for: Full page verification
     * 
     * networkidle: No network activity
     * - Use for: SPAs, dynamic content
     */
    
    await page.goto('https://playwright.dev');
    
    // For most cases, 'load' is sufficient
    await page.waitForLoadState('load');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 11: Load State Best Practices
test('load state best practices', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * Best Practices:
     * 1. Use 'domcontentloaded' for fast tests
     * 2. Use 'networkidle' for SPAs
     * 3. Prefer element waits over load states
     * 4. Don't overuse networkidle (slow)
     */
    
    // Better: Wait for specific element
    await expect(page.locator('h1')).toBeVisible();
    
    // Instead of: await page.waitForLoadState('networkidle');
});

