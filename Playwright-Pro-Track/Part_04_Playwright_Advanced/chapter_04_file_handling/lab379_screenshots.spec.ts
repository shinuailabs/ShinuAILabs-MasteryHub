/**
 * Lab 379: Screenshots
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Taking screenshots:
 * 
 * - Full page
 * - Element
 * - Options
 * - Comparison
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Take full page screenshot
 * 2. Take element screenshot
 * 3. Configure options
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Screenshot
test('basic screenshot', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.screenshot({ path: 'screenshots/basic.png' });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Full Page Screenshot
test('full page screenshot', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.screenshot({
        path: 'screenshots/fullpage.png',
        fullPage: true,
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Element Screenshot
test('element screenshot', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const header = page.locator('header');
    await header.screenshot({ path: 'screenshots/header.png' });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Screenshot with Options
test('screenshot with options', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.screenshot({
        path: 'screenshots/options.png',
        type: 'png',
        quality: 100,
        omitBackground: true,
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: JPEG Screenshot
test('JPEG screenshot', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.screenshot({
        path: 'screenshots/page.jpeg',
        type: 'jpeg',
        quality: 80,
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Screenshot to Buffer
test('screenshot to buffer', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const buffer = await page.screenshot();
    console.log('Screenshot size:', buffer.length, 'bytes');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Screenshot with Clip
test('screenshot with clip', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.screenshot({
        path: 'screenshots/clipped.png',
        clip: {
            x: 0,
            y: 0,
            width: 500,
            height: 300,
        },
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Screenshot with Mask
test('screenshot with mask', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.screenshot({
        path: 'screenshots/masked.png',
        mask: [page.locator('.dynamic-content')],
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Screenshot on Failure
test('screenshot on failure', async ({ page }) => {
    /*
     * In playwright.config.ts:
     * 
     * use: {
     *   screenshot: 'only-on-failure',
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Screenshot Best Practices
test('screenshot best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use meaningful names
     * 2. Organize in folders
     * 3. Use fullPage for long pages
     * 4. Mask dynamic content
     * 5. Configure in config
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

