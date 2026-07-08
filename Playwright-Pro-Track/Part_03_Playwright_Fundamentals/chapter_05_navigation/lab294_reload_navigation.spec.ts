/**
 * Lab 294: Reload Navigation
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Page reload functionality:
 * 
 * - page.reload()
 * - Reload options
 * - Cache handling
 * - State preservation
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Reload pages
 * 2. Use reload options
 * 3. Handle reload scenarios
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Reload
test('basic reload', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Reload the page
    await page.reload();
    
    await expect(page).toHaveURL('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Reload with Wait Until
test('reload with wait until', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Reload with wait options
    await page.reload({
        waitUntil: 'networkidle',
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Reload with Timeout
test('reload with timeout', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Reload with custom timeout
    await page.reload({
        timeout: 30000,
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Reload Response
test('reload response', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Get response from reload
    const response = await page.reload();
    
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);
});

// Solution 5: Reload After Action
test('reload after action', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Perform some action
    await page.getByRole('button', { name: 'Search' }).click();
    await page.keyboard.press('Escape');
    
    // Reload to reset state
    await page.reload();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Reload and Verify Content
test('reload and verify content', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const titleBefore = await page.title();
    
    await page.reload();
    
    const titleAfter = await page.title();
    
    expect(titleBefore).toBe(titleAfter);
});

// Solution 7: Hard Reload (Bypass Cache)
test('hard reload', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Clear cache before reload
    await page.context().clearCookies();
    
    // Reload
    await page.reload();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Reload with DOMContentLoaded
test('reload domcontentloaded', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.reload({
        waitUntil: 'domcontentloaded',
    });
    
    // DOM is ready
    await expect(page.locator('body')).toBeVisible();
});

// Solution 9: Multiple Reloads
test('multiple reloads', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Reload multiple times
    for (let i = 0; i < 3; i++) {
        await page.reload();
        await expect(page).toHaveTitle(/Playwright/);
    }
});

// Solution 10: Reload Different Pages
test('reload different pages', async ({ page }) => {
    // First page
    await page.goto('https://playwright.dev');
    await page.reload();
    await expect(page).toHaveURL('https://playwright.dev/');
    
    // Navigate and reload
    await page.getByRole('link', { name: 'Get started' }).click();
    await page.reload();
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 11: Reload with Form Data
test('reload with form data', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Fill form (if exists)
    // await page.getByLabel('Email').fill('test@example.com');
    
    // Reload - form data may be lost
    await page.reload();
    
    // Form should be empty after reload
    // await expect(page.getByLabel('Email')).toHaveValue('');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 12: Reload Events
test('reload events', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Listen for load event
    const loadPromise = page.waitForEvent('load');
    
    await page.reload();
    
    await loadPromise;
    await expect(page).toHaveTitle(/Playwright/);
});

