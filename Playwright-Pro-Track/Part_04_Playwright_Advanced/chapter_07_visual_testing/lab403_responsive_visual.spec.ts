/**
 * Lab 403: Responsive Visual Testing
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Visual testing across viewports:
 * 
 * - Multiple viewports
 * - Device screenshots
 * - Breakpoint testing
 * - Orientation testing
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Test multiple viewports
 * 2. Compare device screenshots
 * 3. Test breakpoints
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect, devices } from '@playwright/test';

// Solution 1: Multiple Viewport Screenshots
test('multiple viewport screenshots', async ({ page }) => {
    const viewports = [
        { width: 320, height: 568, name: 'mobile-small' },
        { width: 375, height: 667, name: 'mobile' },
        { width: 768, height: 1024, name: 'tablet' },
        { width: 1024, height: 768, name: 'laptop' },
        { width: 1920, height: 1080, name: 'desktop' },
    ];
    
    for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('https://playwright.dev');
        
        await expect(page).toHaveScreenshot(`responsive-${viewport.name}.png`);
    }
});

// Solution 2: Device Screenshots
test('device screenshots', async ({ browser }) => {
    const deviceList = ['iPhone 13', 'Pixel 5', 'iPad Pro 11'];
    
    for (const deviceName of deviceList) {
        const device = devices[deviceName];
        const context = await browser.newContext({ ...device });
        const page = await context.newPage();
        
        await page.goto('https://playwright.dev');
        await expect(page).toHaveScreenshot(`device-${deviceName.replace(/ /g, '-')}.png`);
        
        await context.close();
    }
});

// Solution 3: Breakpoint Testing
test('breakpoint testing', async ({ page }) => {
    const breakpoints = [
        { width: 320, name: 'xs' },
        { width: 576, name: 'sm' },
        { width: 768, name: 'md' },
        { width: 992, name: 'lg' },
        { width: 1200, name: 'xl' },
        { width: 1400, name: 'xxl' },
    ];
    
    for (const bp of breakpoints) {
        await page.setViewportSize({ width: bp.width, height: 800 });
        await page.goto('https://playwright.dev');
        
        await expect(page).toHaveScreenshot(`breakpoint-${bp.name}.png`);
    }
});

// Solution 4: Orientation Testing
test('orientation testing', async ({ browser }) => {
    // Portrait
    const portraitContext = await browser.newContext({
        viewport: { width: 375, height: 667 },
    });
    const portraitPage = await portraitContext.newPage();
    await portraitPage.goto('https://playwright.dev');
    await expect(portraitPage).toHaveScreenshot('orientation-portrait.png');
    await portraitContext.close();
    
    // Landscape
    const landscapeContext = await browser.newContext({
        viewport: { width: 667, height: 375 },
    });
    const landscapePage = await landscapeContext.newPage();
    await landscapePage.goto('https://playwright.dev');
    await expect(landscapePage).toHaveScreenshot('orientation-landscape.png');
    await landscapeContext.close();
});

// Solution 5: Full Page Responsive
test('full page responsive', async ({ page }) => {
    const viewports = [
        { width: 375, height: 667 },
        { width: 1920, height: 1080 },
    ];
    
    for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.goto('https://playwright.dev');
        
        await expect(page).toHaveScreenshot(`fullpage-${viewport.width}.png`, {
            fullPage: true,
        });
    }
});

// Solution 6: Component Responsive
test('component responsive', async ({ page }) => {
    const viewports = [375, 768, 1920];
    
    for (const width of viewports) {
        await page.setViewportSize({ width, height: 800 });
        await page.goto('https://playwright.dev');
        
        const header = page.locator('header');
        await expect(header).toHaveScreenshot(`header-${width}.png`);
    }
});

// Solution 7: Retina Display Testing
test('retina display testing', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 375, height: 667 },
        deviceScaleFactor: 2,
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveScreenshot('retina-2x.png');
    await context.close();
});

// Solution 8: Dark Mode Responsive
test('dark mode responsive', async ({ browser }) => {
    const viewports = [375, 1920];
    
    for (const width of viewports) {
        const context = await browser.newContext({
            viewport: { width, height: 800 },
            colorScheme: 'dark',
        });
        
        const page = await context.newPage();
        await page.goto('https://playwright.dev');
        
        await expect(page).toHaveScreenshot(`dark-${width}.png`);
        await context.close();
    }
});

// Solution 9: Responsive Element Visibility
test('responsive element visibility', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Desktop - sidebar visible
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page).toHaveScreenshot('desktop-layout.png');
    
    // Mobile - sidebar hidden
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page).toHaveScreenshot('mobile-layout.png');
});

// Solution 10: Responsive Visual Best Practices
test('responsive visual best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Test common breakpoints
     * 2. Test popular devices
     * 3. Test both orientations
     * 4. Test retina displays
     * 5. Test color schemes
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveScreenshot('responsive-best-practices.png');
});

