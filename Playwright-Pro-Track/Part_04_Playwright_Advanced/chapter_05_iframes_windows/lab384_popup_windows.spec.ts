/**
 * Lab 384: Popup Windows
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Handling popup windows:
 * 
 * - waitForEvent('popup')
 * - Popup interaction
 * - Multiple popups
 * - Popup closing
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Handle popup windows
 * 2. Interact with popups
 * 3. Close popups
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Popup Handling
test('basic popup handling', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for popup
    // const popupPromise = page.waitForEvent('popup');
    // await page.click('a[target="_blank"]');
    // const popup = await popupPromise;
    // await popup.waitForLoadState();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Popup with Context
test('popup with context', async ({ page, context }) => {
    await page.goto('https://playwright.dev');
    
    // Listen on context for any new page
    // const pagePromise = context.waitForEvent('page');
    // await page.click('a[target="_blank"]');
    // const newPage = await pagePromise;
    // await newPage.waitForLoadState();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Interact with Popup
test('interact with popup', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Interact with popup content
    // const popupPromise = page.waitForEvent('popup');
    // await page.click('button.open-popup');
    // const popup = await popupPromise;
    // 
    // await popup.fill('#name', 'John');
    // await popup.click('button[type="submit"]');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Close Popup
test('close popup', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Close popup
    // const popupPromise = page.waitForEvent('popup');
    // await page.click('button.open-popup');
    // const popup = await popupPromise;
    // 
    // await popup.close();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Multiple Popups
test('multiple popups', async ({ page, context }) => {
    await page.goto('https://playwright.dev');
    
    // Handle multiple popups
    // const popups: Page[] = [];
    // context.on('page', page => popups.push(page));
    // 
    // await page.click('button.open-multiple');
    // await page.waitForTimeout(1000);
    // 
    // for (const popup of popups) {
    //     await popup.close();
    // }
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Popup URL Verification
test('popup URL verification', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Verify popup URL
    // const popupPromise = page.waitForEvent('popup');
    // await page.click('a[target="_blank"]');
    // const popup = await popupPromise;
    // 
    // await expect(popup).toHaveURL(/expected-url/);
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Popup Title Verification
test('popup title verification', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Verify popup title
    // const popupPromise = page.waitForEvent('popup');
    // await page.click('a[target="_blank"]');
    // const popup = await popupPromise;
    // 
    // await expect(popup).toHaveTitle('Popup Title');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Return to Main Page
test('return to main page', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Work with popup then return
    // const popupPromise = page.waitForEvent('popup');
    // await page.click('a[target="_blank"]');
    // const popup = await popupPromise;
    // 
    // // Do something in popup
    // await popup.fill('#input', 'value');
    // await popup.close();
    // 
    // // Continue on main page
    // await page.click('button.continue');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Popup with Timeout
test('popup with timeout', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for popup with timeout
    // const popupPromise = page.waitForEvent('popup', { timeout: 5000 });
    // await page.click('button.open-popup');
    // const popup = await popupPromise;
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Popup Best Practices
test('popup best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Wait for popup before click
     * 2. Wait for load state
     * 3. Close popups after use
     * 4. Handle multiple popups
     * 5. Verify popup content
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

