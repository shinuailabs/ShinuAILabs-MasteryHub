/**
 * Lab 389: Window Features
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Browser window features:
 * 
 * - Window size
 * - Window position
 * - Fullscreen
 * - Device emulation
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Control window size
 * 2. Set window position
 * 3. Emulate devices
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect, devices } from '@playwright/test';

// Solution 1: Set Viewport Size
test('set viewport size', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.goto('https://playwright.dev');
    
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(1920);
    expect(viewport?.height).toBe(1080);
});

// Solution 2: Mobile Viewport
test('mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Tablet Viewport
test('tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Device Emulation
test('device emulation', async ({ browser }) => {
    const iPhone = devices['iPhone 13'];
    const context = await browser.newContext({
        ...iPhone,
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 5: Multiple Device Sizes
test('multiple device sizes', async ({ browser }) => {
    const viewports = [
        { width: 320, height: 568 },  // iPhone SE
        { width: 375, height: 667 },  // iPhone 8
        { width: 768, height: 1024 }, // iPad
        { width: 1920, height: 1080 }, // Desktop
    ];
    
    for (const viewport of viewports) {
        const context = await browser.newContext({ viewport });
        const page = await context.newPage();
        
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
        
        await context.close();
    }
});

// Solution 6: Responsive Testing
test('responsive testing', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Test at different sizes
    const sizes = [
        { width: 320, height: 568 },
        { width: 768, height: 1024 },
        { width: 1920, height: 1080 },
    ];
    
    for (const size of sizes) {
        await page.setViewportSize(size);
        await expect(page).toHaveTitle(/Playwright/);
    }
});

// Solution 7: Device Scale Factor
test('device scale factor', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 375, height: 667 },
        deviceScaleFactor: 2, // Retina display
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 8: Touch Emulation
test('touch emulation', async ({ browser }) => {
    const context = await browser.newContext({
        hasTouch: true,
        viewport: { width: 375, height: 667 },
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    // Touch actions
    // await page.tap('button');
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 9: Color Scheme
test('color scheme', async ({ browser }) => {
    // Dark mode
    const darkContext = await browser.newContext({
        colorScheme: 'dark',
    });
    const darkPage = await darkContext.newPage();
    await darkPage.goto('https://playwright.dev');
    
    // Light mode
    const lightContext = await browser.newContext({
        colorScheme: 'light',
    });
    const lightPage = await lightContext.newPage();
    await lightPage.goto('https://playwright.dev');
    
    await darkContext.close();
    await lightContext.close();
});

// Solution 10: Window Features Best Practices
test('window features best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Test multiple viewports
     * 2. Use device presets
     * 3. Test responsive design
     * 4. Consider scale factor
     * 5. Test touch interactions
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

