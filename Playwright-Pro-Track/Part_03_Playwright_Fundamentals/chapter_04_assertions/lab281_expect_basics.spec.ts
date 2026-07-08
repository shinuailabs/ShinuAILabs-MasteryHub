/**
 * Lab 281: Expect Basics
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Introduction to Playwright assertions:
 * 
 * - expect() function
 * - Auto-retry behavior
 * - Assertion types
 * - Timeout handling
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use basic assertions
 * 2. Understand auto-retry
 * 3. Handle timeouts
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Expect
test('basic expect', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Basic assertion
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Locator Assertions
test('locator assertions', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const heading = page.locator('h1');
    
    // Visibility
    await expect(heading).toBeVisible();
    
    // Text content
    await expect(heading).toContainText('Playwright');
});

// Solution 3: Auto-Retry Behavior
test('auto-retry behavior', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Playwright automatically retries until:
    // - Assertion passes
    // - Timeout is reached (default 5 seconds)
    
    const link = page.getByRole('link', { name: 'Get started' });
    await expect(link).toBeVisible(); // Retries until visible
});

// Solution 4: Custom Timeout
test('custom timeout', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const heading = page.locator('h1');
    
    // Custom timeout for this assertion
    await expect(heading).toBeVisible({ timeout: 10000 });
});

// Solution 5: Negation
test('negation with not', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Assert something is NOT true
    const nonExistent = page.locator('.non-existent');
    await expect(nonExistent).not.toBeVisible();
    
    // Or use toBeHidden
    await expect(nonExistent).toBeHidden();
});

// Solution 6: Multiple Assertions
test('multiple assertions', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Multiple assertions in one test
    await expect(page).toHaveTitle(/Playwright/);
    await expect(page).toHaveURL('https://playwright.dev/');
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Playwright');
});

// Solution 7: Generic Assertions
test('generic assertions', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const title = await page.title();
    
    // Generic expect (no auto-retry)
    expect(title).toContain('Playwright');
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
});

// Solution 8: Assertion Messages
test('assertion messages', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const heading = page.locator('h1');
    
    // Custom message on failure
    await expect(heading, 'Main heading should be visible').toBeVisible();
});

// Solution 9: Polling Assertions
test('polling assertions', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Poll until condition is met
    await expect(async () => {
        const count = await page.locator('a').count();
        expect(count).toBeGreaterThan(5);
    }).toPass({ timeout: 5000 });
});

// Solution 10: Soft Assertions
test('soft assertions', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Soft assertions don't stop test execution
    await expect.soft(page).toHaveTitle(/Playwright/);
    await expect.soft(page.locator('h1')).toBeVisible();
    
    // Test continues even if soft assertions fail
    // Failures are reported at the end
    
    // Hard assertion
    await expect(page).toHaveURL('https://playwright.dev/');
});

// Solution 11: Configure Expect
test('configure expect', async ({ page }) => {
    // Configure expect globally in playwright.config.ts:
    // expect: {
    //     timeout: 10000,
    //     toHaveScreenshot: { maxDiffPixels: 100 },
    // }
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

