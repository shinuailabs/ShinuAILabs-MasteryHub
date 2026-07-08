/**
 * Lab 289: Soft Assertions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Non-blocking assertions:
 * 
 * - expect.soft()
 * - Collecting failures
 * - When to use
 * - Best practices
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use soft assertions
 * 2. Collect multiple failures
 * 3. Apply best practices
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Soft Assertion
test('basic soft assertion', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Soft assertion - test continues even if this fails
    await expect.soft(page).toHaveTitle(/Playwright/);
    
    // Test continues
    await expect.soft(page.locator('h1')).toBeVisible();
    
    // Hard assertion at the end
    await expect(page).toHaveURL(/playwright/);
});

// Solution 2: Multiple Soft Assertions
test('multiple soft assertions', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // All soft assertions run even if some fail
    await expect.soft(page).toHaveTitle(/Playwright/);
    await expect.soft(page.locator('h1')).toBeVisible();
    await expect.soft(page.locator('nav')).toBeVisible();
    await expect.soft(page.locator('footer')).toBeVisible();
    
    // All failures reported at end of test
});

// Solution 3: Soft vs Hard Assertions
test('soft vs hard assertions', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Soft: Non-critical checks
    await expect.soft(page.locator('.optional-banner')).toBeHidden();
    
    // Hard: Critical checks (stops test on failure)
    await expect(page.locator('h1')).toBeVisible();
    
    // More soft assertions
    await expect.soft(page.locator('nav')).toBeVisible();
});

// Solution 4: Collecting All Failures
test('collecting failures', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Multiple checks that might fail
    await expect.soft(page).toHaveTitle(/Playwright/);
    await expect.soft(page.locator('h1')).toContainText('Playwright');
    await expect.soft(page.locator('nav a')).toHaveCount(5); // Might fail
    
    // All failures are collected and reported together
});

// Solution 5: Soft Assertions in Loop
test('soft assertions in loop', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const links = page.locator('nav a');
    const count = await links.count();
    
    // Check each link with soft assertion
    for (let i = 0; i < Math.min(count, 5); i++) {
        await expect.soft(links.nth(i)).toBeVisible();
        await expect.soft(links.nth(i)).toHaveAttribute('href');
    }
});

// Solution 6: Soft Assertions for Validation
test('form validation soft assertions', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Validate multiple form fields
    // await expect.soft(page.getByLabel('Email')).toBeVisible();
    // await expect.soft(page.getByLabel('Password')).toBeVisible();
    // await expect.soft(page.getByRole('button', { name: 'Submit' })).toBeEnabled();
    
    await expect.soft(page.locator('h1')).toBeVisible();
    await expect.soft(page.locator('nav')).toBeVisible();
});

// Solution 7: Soft Assertions with Custom Message
test('soft assertions with message', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await expect.soft(
        page.locator('h1'),
        'Main heading should be visible'
    ).toBeVisible();
    
    await expect.soft(
        page.locator('nav'),
        'Navigation should be present'
    ).toBeVisible();
});

// Solution 8: When to Use Soft Assertions
test('when to use soft assertions', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * Use soft assertions when:
     * 1. Checking multiple independent conditions
     * 2. Want to see all failures at once
     * 3. Non-critical validations
     * 4. UI consistency checks
     * 
     * Use hard assertions when:
     * 1. Test cannot continue without passing
     * 2. Critical functionality
     * 3. Prerequisites for next steps
     */
    
    // Soft: UI consistency
    await expect.soft(page.locator('h1')).toBeVisible();
    await expect.soft(page.locator('nav')).toBeVisible();
    
    // Hard: Critical navigation
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 9: Soft Assertions Report
test('soft assertions report', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // All soft assertion failures appear in test report
    await expect.soft(page).toHaveTitle(/Playwright/);
    await expect.soft(page.locator('h1')).toBeVisible();
    
    // Report shows:
    // - Which soft assertions failed
    // - Expected vs actual values
    // - Line numbers
});

// Solution 10: Best Practices
test('soft assertions best practices', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * Best Practices:
     * 1. Don't overuse - most assertions should be hard
     * 2. Group related soft assertions
     * 3. End with hard assertion for critical check
     * 4. Use custom messages for clarity
     * 5. Review all failures, not just first
     */
    
    // Group: Page structure checks
    await expect.soft(page.locator('header')).toBeVisible();
    await expect.soft(page.locator('main')).toBeVisible();
    await expect.soft(page.locator('footer')).toBeVisible();
    
    // Critical: Main content
    await expect(page.locator('h1')).toBeVisible();
});

