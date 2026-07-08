/**
 * Lab 282: Page Assertions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Assertions on page object:
 * 
 * - toHaveTitle()
 * - toHaveURL()
 * - Page state checks
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Assert page title
 * 2. Assert page URL
 * 3. Check page state
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: toHaveTitle - Exact Match
test('toHaveTitle exact', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Exact title match
    await expect(page).toHaveTitle('Fast and reliable end-to-end testing for modern web apps | Playwright');
});

// Solution 2: toHaveTitle - Regex Match
test('toHaveTitle regex', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Regex match
    await expect(page).toHaveTitle(/Playwright/);
    await expect(page).toHaveTitle(/playwright/i); // Case insensitive
});

// Solution 3: toHaveURL - Exact Match
test('toHaveURL exact', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Exact URL match
    await expect(page).toHaveURL('https://playwright.dev/');
});

// Solution 4: toHaveURL - Regex Match
test('toHaveURL regex', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Regex match
    await expect(page).toHaveURL(/playwright\.dev/);
    
    // Navigate and check
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 5: toHaveURL - With Query Params
test('toHaveURL with query params', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // URL with query parameters
    // await page.goto('https://example.com?page=1&sort=name');
    // await expect(page).toHaveURL(/\?page=1/);
    
    await expect(page).toHaveURL(/playwright/);
});

// Solution 6: toHaveURL - Ignore Query Params
test('toHaveURL ignore query', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Check URL ignoring query params
    // await expect(page).toHaveURL(/^https:\/\/example\.com\/path/);
    
    await expect(page).toHaveURL(/^https:\/\/playwright\.dev/);
});

// Solution 7: Page Title After Navigation
test('title after navigation', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
    
    // Navigate
    await page.getByRole('link', { name: 'Get started' }).click();
    
    // Title should change
    await expect(page).toHaveTitle(/Installation/);
});

// Solution 8: URL After Form Submit
test('URL after action', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Perform action
    await page.getByRole('link', { name: 'Docs' }).click();
    
    // Verify URL changed
    await expect(page).toHaveURL(/.*docs/);
});

// Solution 9: Negative Page Assertions
test('negative page assertions', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Assert NOT
    await expect(page).not.toHaveTitle(/Google/);
    await expect(page).not.toHaveURL(/google\.com/);
});

// Solution 10: Page Assertions with Timeout
test('page assertions with timeout', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Custom timeout
    await expect(page).toHaveTitle(/Playwright/, { timeout: 10000 });
    await expect(page).toHaveURL(/playwright/, { timeout: 10000 });
});

// Solution 11: Combined Page Checks
test('combined page checks', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Multiple page assertions
    await expect(page).toHaveTitle(/Playwright/);
    await expect(page).toHaveURL('https://playwright.dev/');
    
    // Navigate and verify both changed
    await page.getByRole('link', { name: 'Get started' }).click();
    
    await expect(page).toHaveTitle(/Installation/);
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 12: Page State Verification
test('page state verification', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Verify page loaded correctly
    await expect(page).toHaveTitle(/Playwright/);
    
    // Verify key elements present
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();
});

