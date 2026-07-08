/**
 * Lab 291: Goto Navigation
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Basic page navigation:
 * 
 * - page.goto()
 * - Navigation options
 * - Wait states
 * - Response handling
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Navigate to URLs
 * 2. Use navigation options
 * 3. Handle responses
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Goto
test('basic goto', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveURL('https://playwright.dev/');
});

// Solution 2: Goto with Path
test('goto with path', async ({ page }) => {
    await page.goto('https://playwright.dev/docs/intro');
    
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 3: Goto with Query Parameters
test('goto with query params', async ({ page }) => {
    await page.goto('https://playwright.dev/docs/intro?tab=npm');
    
    await expect(page).toHaveURL(/tab=npm/);
});

// Solution 4: Wait Until Load
test('wait until load', async ({ page }) => {
    // Wait for load event
    await page.goto('https://playwright.dev', {
        waitUntil: 'load',
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Wait Until DOMContentLoaded
test('wait until domcontentloaded', async ({ page }) => {
    // Wait for DOMContentLoaded
    await page.goto('https://playwright.dev', {
        waitUntil: 'domcontentloaded',
    });
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 6: Wait Until NetworkIdle
test('wait until networkidle', async ({ page }) => {
    // Wait for network to be idle
    await page.goto('https://playwright.dev', {
        waitUntil: 'networkidle',
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Wait Until Commit
test('wait until commit', async ({ page }) => {
    // Wait for response to be received
    await page.goto('https://playwright.dev', {
        waitUntil: 'commit',
    });
    
    // Page may still be loading
    await expect(page.locator('body')).toBeVisible();
});

// Solution 8: Goto with Timeout
test('goto with timeout', async ({ page }) => {
    // Custom timeout
    await page.goto('https://playwright.dev', {
        timeout: 30000, // 30 seconds
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Goto Response
test('goto response', async ({ page }) => {
    // Get response from navigation
    const response = await page.goto('https://playwright.dev');
    
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);
    expect(response!.ok()).toBe(true);
});

// Solution 10: Goto with Referer
test('goto with referer', async ({ page }) => {
    // Set referer header
    await page.goto('https://playwright.dev', {
        referer: 'https://google.com',
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 11: Navigate to Different Pages
test('navigate to different pages', async ({ page }) => {
    // First page
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
    
    // Second page
    await page.goto('https://playwright.dev/docs/intro');
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 12: Handle Navigation Errors
test('handle navigation errors', async ({ page }) => {
    try {
        await page.goto('https://playwright.dev', {
            timeout: 5000,
        });
        await expect(page).toHaveTitle(/Playwright/);
    } catch (error) {
        console.log('Navigation failed:', error);
        throw error;
    }
});

// Solution 13: Relative URL Navigation
test('relative URL navigation', async ({ page }) => {
    // Navigate to base URL
    await page.goto('https://playwright.dev');
    
    // Navigate to relative path
    await page.goto('/docs/intro');
    
    await expect(page).toHaveURL(/.*intro/);
});

