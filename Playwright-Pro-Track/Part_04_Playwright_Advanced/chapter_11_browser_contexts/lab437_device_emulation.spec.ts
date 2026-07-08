/**
 * Lab 437: Device Emulation
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Emulating different devices:
 * 
 * - Mobile devices
 * - Tablets
 * - Custom viewports
 * - Device descriptors
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Emulate mobile devices
 * 2. Test responsive design
 * 3. Use device descriptors
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect, devices } from '@playwright/test';

// Solution 1: iPhone Emulation
test('iPhone emulation', async ({ browser }) => {
    const iPhone = devices['iPhone 13'];
    const context = await browser.newContext({
        ...iPhone,
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    const viewport = page.viewportSize();
    console.log('iPhone viewport:', viewport);
    
    expect(viewport?.width).toBe(390);
    
    await context.close();
});

// Solution 2: iPad Emulation
test('iPad emulation', async ({ browser }) => {
    const iPad = devices['iPad Pro 11'];
    const context = await browser.newContext({
        ...iPad,
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    const viewport = page.viewportSize();
    console.log('iPad viewport:', viewport);
    
    await context.close();
});

// Solution 3: Android Emulation
test('Android emulation', async ({ browser }) => {
    const pixel = devices['Pixel 5'];
    const context = await browser.newContext({
        ...pixel,
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    const userAgent = await page.evaluate(() => navigator.userAgent);
    expect(userAgent).toContain('Android');
    
    await context.close();
});

// Solution 4: Custom Viewport
test('custom viewport', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(1440);
    expect(viewport?.height).toBe(900);
    
    await context.close();
});

// Solution 5: Mobile with Touch
test('mobile with touch', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 375, height: 667 },
        isMobile: true,
        hasTouch: true,
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    const hasTouch = await page.evaluate(() => {
        return 'ontouchstart' in window;
    });
    
    expect(hasTouch).toBeTruthy();
    
    await context.close();
});

// Solution 6: Device Scale Factor
test('device scale factor', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 375, height: 667 },
        deviceScaleFactor: 2, // Retina display
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    const pixelRatio = await page.evaluate(() => window.devicePixelRatio);
    expect(pixelRatio).toBe(2);
    
    await context.close();
});

// Solution 7: Landscape Orientation
test('landscape orientation', async ({ browser }) => {
    const iPhone = devices['iPhone 13 landscape'];
    const context = await browser.newContext({
        ...iPhone,
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    const viewport = page.viewportSize();
    console.log('Landscape viewport:', viewport);
    
    // Width should be greater than height in landscape
    expect(viewport!.width).toBeGreaterThan(viewport!.height);
    
    await context.close();
});

// Solution 8: Testing Responsive Breakpoints
test('testing responsive breakpoints', async ({ browser }) => {
    const breakpoints = [
        { name: 'mobile', width: 375, height: 667 },
        { name: 'tablet', width: 768, height: 1024 },
        { name: 'desktop', width: 1280, height: 800 },
    ];
    
    for (const bp of breakpoints) {
        const context = await browser.newContext({
            viewport: { width: bp.width, height: bp.height },
        });
        
        const page = await context.newPage();
        await page.goto('https://playwright.dev');
        
        console.log(`Testing ${bp.name}: ${bp.width}x${bp.height}`);
        await expect(page).toHaveTitle(/Playwright/);
        
        await context.close();
    }
});

// Solution 9: Custom User Agent
test('custom user agent', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 375, height: 667 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) Custom/1.0',
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    const userAgent = await page.evaluate(() => navigator.userAgent);
    expect(userAgent).toContain('Custom/1.0');
    
    await context.close();
});

// Solution 10: Device Emulation Best Practices
test('device emulation best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use built-in device descriptors
     * 2. Test multiple device sizes
     * 3. Include touch testing for mobile
     * 4. Test both orientations
     * 5. Consider device scale factor
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

