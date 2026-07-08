/**
 * Lab 398: Mobile Emulation Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for mobile testing:
 * 
 * - Device selection
 * - Touch testing
 * - Performance
 * - Coverage
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply mobile testing best practices
 * 2. Optimize test coverage
 * 3. Handle mobile-specific issues
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect, devices } from '@playwright/test';

// Solution 1: Device Matrix
test('device matrix', async ({ browser }) => {
    const deviceMatrix = [
        devices['iPhone 13'],
        devices['iPhone 13 Pro Max'],
        devices['Pixel 5'],
        devices['Galaxy S21'],
    ];
    
    for (const device of deviceMatrix) {
        const context = await browser.newContext({ ...device });
        const page = await context.newPage();
        
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
        
        await context.close();
    }
});

// Solution 2: Mobile-First Testing
test('mobile first testing', async ({ browser }) => {
    // Start with smallest viewport
    const viewports = [
        { width: 320, height: 568 },
        { width: 375, height: 667 },
        { width: 414, height: 896 },
        { width: 768, height: 1024 },
        { width: 1024, height: 768 },
    ];
    
    for (const viewport of viewports) {
        const context = await browser.newContext({ viewport });
        const page = await context.newPage();
        
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
        
        await context.close();
    }
});

// Solution 3: Touch-Friendly Testing
test('touch friendly testing', async ({ browser }) => {
    const context = await browser.newContext({
        ...devices['iPhone 13'],
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    // Test touch targets (should be at least 44x44px)
    const links = await page.locator('a').all();
    
    for (const link of links.slice(0, 5)) {
        const box = await link.boundingBox();
        if (box) {
            // Check minimum touch target size
            const isAccessible = box.width >= 44 && box.height >= 44;
            console.log(`Link size: ${box.width}x${box.height}, Accessible: ${isAccessible}`);
        }
    }
    
    await context.close();
});

// Solution 4: Mobile Performance
test('mobile performance', async ({ browser }) => {
    const context = await browser.newContext({
        ...devices['iPhone 13'],
    });
    
    const page = await context.newPage();
    
    // Measure load time
    const startTime = Date.now();
    await page.goto('https://playwright.dev');
    const loadTime = Date.now() - startTime;
    
    console.log('Mobile load time:', loadTime, 'ms');
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 5: Mobile Navigation
test('mobile navigation', async ({ browser }) => {
    const context = await browser.newContext({
        ...devices['iPhone 13'],
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    // Test mobile menu
    // await page.click('.mobile-menu-button');
    // await expect(page.locator('.mobile-nav')).toBeVisible();
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 6: Scroll Testing
test('scroll testing', async ({ browser }) => {
    const context = await browser.newContext({
        ...devices['iPhone 13'],
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    // Scroll to bottom
    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
    });
    
    // Scroll back to top
    await page.evaluate(() => {
        window.scrollTo(0, 0);
    });
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 7: Form Testing on Mobile
test('form testing on mobile', async ({ browser }) => {
    const context = await browser.newContext({
        ...devices['iPhone 13'],
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    // Test form inputs
    // await page.tap('input[type="text"]');
    // await page.fill('input[type="text"]', 'Test input');
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 8: Orientation Testing
test('orientation testing', async ({ browser }) => {
    // Portrait
    const portraitContext = await browser.newContext({
        ...devices['iPhone 13'],
    });
    const portraitPage = await portraitContext.newPage();
    await portraitPage.goto('https://playwright.dev');
    await expect(portraitPage).toHaveTitle(/Playwright/);
    await portraitContext.close();
    
    // Landscape
    const landscapeContext = await browser.newContext({
        ...devices['iPhone 13 landscape'],
    });
    const landscapePage = await landscapeContext.newPage();
    await landscapePage.goto('https://playwright.dev');
    await expect(landscapePage).toHaveTitle(/Playwright/);
    await landscapeContext.close();
});

// Solution 9: Mobile Accessibility
test('mobile accessibility', async ({ browser }) => {
    const context = await browser.newContext({
        ...devices['iPhone 13'],
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    // Check for mobile accessibility
    // - Font size readable
    // - Touch targets adequate
    // - Contrast sufficient
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 10: Mobile Best Practices Summary
test('mobile best practices summary', async ({ page }) => {
    /*
     * Mobile Testing Best Practices:
     * 
     * Device Selection:
     * - Test popular devices
     * - Include iOS and Android
     * - Test multiple screen sizes
     * 
     * Touch Testing:
     * - Use tap for interactions
     * - Test swipe gestures
     * - Verify touch targets
     * 
     * Performance:
     * - Test on slow networks
     * - Measure load times
     * - Test offline mode
     * 
     * Coverage:
     * - Test both orientations
     * - Test responsive breakpoints
     * - Test mobile-specific features
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

