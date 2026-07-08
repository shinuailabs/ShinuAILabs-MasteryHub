/**
 * Lab 391: Device Emulation
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Emulating mobile devices:
 * 
 * - Device presets
 * - Custom devices
 * - Device properties
 * - User agents
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Emulate mobile devices
 * 2. Use device presets
 * 3. Create custom devices
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
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 2: Android Emulation
test('Android emulation', async ({ browser }) => {
    const pixel = devices['Pixel 5'];
    const context = await browser.newContext({
        ...pixel,
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 3: iPad Emulation
test('iPad emulation', async ({ browser }) => {
    const iPad = devices['iPad Pro 11'];
    const context = await browser.newContext({
        ...iPad,
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 4: Custom Device
test('custom device', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 5: Landscape Mode
test('landscape mode', async ({ browser }) => {
    const iPhoneLandscape = devices['iPhone 13 landscape'];
    const context = await browser.newContext({
        ...iPhoneLandscape,
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 6: Multiple Devices
test('multiple devices', async ({ browser }) => {
    const deviceList = [
        'iPhone 13',
        'Pixel 5',
        'iPad Pro 11',
    ];
    
    for (const deviceName of deviceList) {
        const device = devices[deviceName];
        const context = await browser.newContext({ ...device });
        const page = await context.newPage();
        
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
        
        await context.close();
    }
});

// Solution 7: Device with Locale
test('device with locale', async ({ browser }) => {
    const iPhone = devices['iPhone 13'];
    const context = await browser.newContext({
        ...iPhone,
        locale: 'ja-JP',
        timezoneId: 'Asia/Tokyo',
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 8: Device with Permissions
test('device with permissions', async ({ browser }) => {
    const iPhone = devices['iPhone 13'];
    const context = await browser.newContext({
        ...iPhone,
        permissions: ['geolocation'],
        geolocation: { latitude: 35.6762, longitude: 139.6503 },
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 9: List Available Devices
test('list available devices', async ({ page }) => {
    // Log some available devices
    const deviceNames = Object.keys(devices).slice(0, 10);
    console.log('Available devices:', deviceNames);
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Device Emulation Best Practices
test('device emulation best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use device presets
     * 2. Test multiple devices
     * 3. Test both orientations
     * 4. Consider locale/timezone
     * 5. Test touch interactions
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

