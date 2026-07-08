/**
 * Lab 293: Back and Forward Navigation
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Browser history navigation:
 * 
 * - page.goBack()
 * - page.goForward()
 * - History state
 * - Navigation options
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Navigate back
 * 2. Navigate forward
 * 3. Handle history
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Go Back
test('basic go back', async ({ page }) => {
    // Navigate to first page
    await page.goto('https://playwright.dev');
    
    // Navigate to second page
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL(/.*intro/);
    
    // Go back
    await page.goBack();
    await expect(page).toHaveURL('https://playwright.dev/');
});

// Solution 2: Basic Go Forward
test('basic go forward', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Navigate forward
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL(/.*intro/);
    
    // Go back
    await page.goBack();
    await expect(page).toHaveURL('https://playwright.dev/');
    
    // Go forward
    await page.goForward();
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 3: Go Back with Options
test('go back with options', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await page.getByRole('link', { name: 'Get started' }).click();
    
    // Go back with wait options
    await page.goBack({
        waitUntil: 'networkidle',
        timeout: 10000,
    });
    
    await expect(page).toHaveURL('https://playwright.dev/');
});

// Solution 4: Go Forward with Options
test('go forward with options', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await page.getByRole('link', { name: 'Get started' }).click();
    await page.goBack();
    
    // Go forward with options
    await page.goForward({
        waitUntil: 'domcontentloaded',
    });
    
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 5: Multiple Back Navigation
test('multiple back navigation', async ({ page }) => {
    // Build history
    await page.goto('https://playwright.dev');
    await page.getByRole('link', { name: 'Get started' }).click();
    await page.getByRole('link', { name: 'Docs' }).click();
    
    // Go back twice
    await page.goBack();
    await page.goBack();
    
    await expect(page).toHaveURL('https://playwright.dev/');
});

// Solution 6: Back and Forward Sequence
test('back and forward sequence', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await page.getByRole('link', { name: 'Get started' }).click();
    
    // Back
    await page.goBack();
    await expect(page).toHaveURL('https://playwright.dev/');
    
    // Forward
    await page.goForward();
    await expect(page).toHaveURL(/.*intro/);
    
    // Back again
    await page.goBack();
    await expect(page).toHaveURL('https://playwright.dev/');
});

// Solution 7: Go Back Response
test('go back response', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await page.getByRole('link', { name: 'Get started' }).click();
    
    // Get response from goBack
    const response = await page.goBack();
    
    // Response may be null if from cache
    if (response) {
        expect(response.status()).toBe(200);
    }
    
    await expect(page).toHaveURL('https://playwright.dev/');
});

// Solution 8: Handle No History
test('handle no history', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // goBack when no history returns null
    const response = await page.goBack();
    
    // No navigation occurred
    expect(response).toBeNull();
    await expect(page).toHaveURL('https://playwright.dev/');
});

// Solution 9: Verify Content After Back
test('verify content after back', async ({ page }) => {
    await page.goto('https://playwright.dev');
    const originalTitle = await page.title();
    
    await page.getByRole('link', { name: 'Get started' }).click();
    
    await page.goBack();
    
    // Verify original content
    await expect(page).toHaveTitle(originalTitle);
    await expect(page.locator('h1')).toContainText('Playwright');
});

// Solution 10: History State
test('history state', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Push state (SPA navigation)
    await page.evaluate(() => {
        history.pushState({ page: 1 }, '', '/page1');
    });
    
    // Go back
    await page.goBack();
    
    await expect(page).toHaveURL('https://playwright.dev/');
});

