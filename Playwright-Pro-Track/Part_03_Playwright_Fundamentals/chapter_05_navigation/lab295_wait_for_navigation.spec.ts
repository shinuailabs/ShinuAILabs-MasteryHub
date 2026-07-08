/**
 * Lab 295: Wait for Navigation
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Waiting for navigation events:
 * 
 * - waitForNavigation()
 * - waitForURL()
 * - Navigation patterns
 * - Timeout handling
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Wait for navigation
 * 2. Wait for specific URLs
 * 3. Handle navigation timeouts
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Wait for Navigation
test('basic wait for navigation', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for navigation after click
    await Promise.all([
        page.waitForNavigation(),
        page.getByRole('link', { name: 'Get started' }).click(),
    ]);
    
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 2: Wait for URL - String
test('wait for URL string', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    page.getByRole('link', { name: 'Get started' }).click();
    
    // Wait for specific URL
    await page.waitForURL('**/docs/intro');
    
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 3: Wait for URL - Regex
test('wait for URL regex', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    page.getByRole('link', { name: 'Get started' }).click();
    
    // Wait for URL matching regex
    await page.waitForURL(/.*intro/);
    
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 4: Wait for URL - Function
test('wait for URL function', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    page.getByRole('link', { name: 'Get started' }).click();
    
    // Wait for URL matching function
    await page.waitForURL(url => url.pathname.includes('intro'));
    
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 5: Wait for Navigation with Options
test('wait for navigation options', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await Promise.all([
        page.waitForNavigation({
            waitUntil: 'networkidle',
            timeout: 10000,
        }),
        page.getByRole('link', { name: 'Get started' }).click(),
    ]);
    
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 6: Wait for URL with Timeout
test('wait for URL timeout', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    page.getByRole('link', { name: 'Get started' }).click();
    
    await page.waitForURL(/.*intro/, {
        timeout: 10000,
    });
    
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 7: Wait for Load State
test('wait for load state', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.getByRole('link', { name: 'Get started' }).click();
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 8: Wait for DOMContentLoaded
test('wait for domcontentloaded', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.getByRole('link', { name: 'Get started' }).click();
    
    // Wait for DOM to be ready
    await page.waitForLoadState('domcontentloaded');
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 9: Navigation with Response
test('navigation with response', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for response during navigation
    const [response] = await Promise.all([
        page.waitForResponse(resp => resp.url().includes('intro')),
        page.getByRole('link', { name: 'Get started' }).click(),
    ]);
    
    expect(response.status()).toBe(200);
});

// Solution 10: Handle Navigation Timeout
test('handle navigation timeout', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    try {
        await page.waitForURL(/.*nonexistent/, {
            timeout: 2000,
        });
    } catch (error) {
        // Handle timeout
        console.log('Navigation timeout - expected');
    }
    
    await expect(page).toHaveURL('https://playwright.dev/');
});

// Solution 11: Wait for SPA Navigation
test('wait for SPA navigation', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // SPA navigation may not trigger traditional navigation
    await page.getByRole('link', { name: 'Get started' }).click();
    
    // Wait for URL change
    await page.waitForURL(/.*intro/);
    
    // Wait for content
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 12: Multiple Navigation Waits
test('multiple navigation waits', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // First navigation
    await page.getByRole('link', { name: 'Get started' }).click();
    await page.waitForURL(/.*intro/);
    
    // Second navigation
    await page.getByRole('link', { name: 'Docs' }).click();
    await page.waitForURL(/.*docs/);
    
    await expect(page).toHaveURL(/.*docs/);
});

