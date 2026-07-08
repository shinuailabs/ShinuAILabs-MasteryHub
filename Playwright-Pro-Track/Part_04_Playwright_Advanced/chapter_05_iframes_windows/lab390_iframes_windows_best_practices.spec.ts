/**
 * Lab 390: Iframes & Windows Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for iframes and windows:
 * 
 * - Frame handling
 * - Window management
 * - Context isolation
 * - Performance
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply iframe best practices
 * 2. Apply window best practices
 * 3. Optimize performance
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Frame Locator Pattern
test('frame locator pattern', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * Preferred: frameLocator
     * const frame = page.frameLocator('iframe');
     * await frame.locator('button').click();
     * 
     * Avoid: frame() method for new code
     */
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Wait for Frame Content
test('wait for frame content', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * Always wait for frame content:
     * 
     * const frame = page.frameLocator('iframe');
     * await frame.locator('body').waitFor();
     * await frame.locator('button').click();
     */
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Popup Handling Pattern
test('popup handling pattern', async ({ page, context }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * Best pattern for popups:
     * 
     * const popupPromise = context.waitForEvent('page');
     * await page.click('button.open-popup');
     * const popup = await popupPromise;
     * await popup.waitForLoadState();
     * 
     * // Work with popup
     * await popup.close();
     */
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Context Cleanup
test('context cleanup', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    } finally {
        // Always close context
        await context.close();
    }
});

// Solution 5: Dialog Handler Setup
test('dialog handler setup', async ({ page }) => {
    // Set up handler BEFORE triggering dialog
    page.on('dialog', async dialog => {
        await dialog.accept();
    });
    
    await page.goto('https://playwright.dev');
    
    // Now trigger dialog
    // await page.click('button.show-alert');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Multi-Page Test Pattern
test('multi page test pattern', async ({ browser }) => {
    const context = await browser.newContext();
    
    try {
        const page1 = await context.newPage();
        const page2 = await context.newPage();
        
        await Promise.all([
            page1.goto('https://playwright.dev'),
            page2.goto('https://playwright.dev/docs/intro'),
        ]);
        
        await expect(page1).toHaveTitle(/Playwright/);
        await expect(page2).toHaveTitle(/Installation/);
    } finally {
        await context.close();
    }
});

// Solution 7: Frame Error Handling
test('frame error handling', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * Handle missing frames:
     * 
     * const frame = page.frameLocator('iframe');
     * const count = await frame.locator('body').count();
     * 
     * if (count > 0) {
     *     await frame.locator('button').click();
     * }
     */
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Window State Management
test('window state management', async ({ context }) => {
    const pages: any[] = [];
    
    // Track all pages
    context.on('page', page => pages.push(page));
    
    const mainPage = await context.newPage();
    await mainPage.goto('https://playwright.dev');
    
    // Clean up all pages
    for (const page of pages) {
        if (!page.isClosed()) {
            await page.close();
        }
    }
});

// Solution 9: Performance Optimization
test('performance optimization', async ({ browser }) => {
    /*
     * Performance tips:
     * 
     * 1. Reuse contexts when possible
     * 2. Close unused pages/contexts
     * 3. Use parallel contexts for isolation
     * 4. Avoid unnecessary frame switches
     * 5. Use specific selectors
     */
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
    
    await context.close();
});

// Solution 10: Best Practices Summary
test('best practices summary', async ({ page }) => {
    /*
     * Iframes & Windows Best Practices:
     * 
     * Iframes:
     * - Use frameLocator
     * - Wait for content
     * - Handle nested frames
     * - Use specific selectors
     * 
     * Windows/Popups:
     * - Wait before click
     * - Wait for load state
     * - Close after use
     * - Track references
     * 
     * Contexts:
     * - Use for isolation
     * - Configure at creation
     * - Close when done
     * - Handle events
     * 
     * Dialogs:
     * - Set handler first
     * - Check dialog type
     * - Handle all types
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

