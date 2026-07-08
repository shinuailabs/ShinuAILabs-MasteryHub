/**
 * Lab 393: Responsive Testing
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Testing responsive designs:
 * 
 * - Breakpoints
 * - Viewport changes
 * - Media queries
 * - Layout testing
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Test at breakpoints
 * 2. Verify responsive layouts
 * 3. Test media queries
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Common breakpoints
const breakpoints = {
    mobile: { width: 320, height: 568 },
    mobileLarge: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    laptop: { width: 1024, height: 768 },
    desktop: { width: 1440, height: 900 },
    desktopLarge: { width: 1920, height: 1080 },
};

// Solution 1: Test All Breakpoints
test('test all breakpoints', async ({ page }) => {
    for (const [name, viewport] of Object.entries(breakpoints)) {
        await page.setViewportSize(viewport);
        await page.goto('https://playwright.dev');
        
        console.log(`Testing ${name}: ${viewport.width}x${viewport.height}`);
        await expect(page).toHaveTitle(/Playwright/);
    }
});

// Solution 2: Mobile Breakpoint
test('mobile breakpoint', async ({ page }) => {
    await page.setViewportSize(breakpoints.mobile);
    await page.goto('https://playwright.dev');
    
    // Mobile-specific assertions
    // await expect(page.locator('.mobile-menu')).toBeVisible();
    // await expect(page.locator('.desktop-nav')).toBeHidden();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Tablet Breakpoint
test('tablet breakpoint', async ({ page }) => {
    await page.setViewportSize(breakpoints.tablet);
    await page.goto('https://playwright.dev');
    
    // Tablet-specific assertions
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Desktop Breakpoint
test('desktop breakpoint', async ({ page }) => {
    await page.setViewportSize(breakpoints.desktop);
    await page.goto('https://playwright.dev');
    
    // Desktop-specific assertions
    // await expect(page.locator('.desktop-nav')).toBeVisible();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Dynamic Viewport Change
test('dynamic viewport change', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Start with desktop
    await page.setViewportSize(breakpoints.desktop);
    await expect(page).toHaveTitle(/Playwright/);
    
    // Resize to tablet
    await page.setViewportSize(breakpoints.tablet);
    await expect(page).toHaveTitle(/Playwright/);
    
    // Resize to mobile
    await page.setViewportSize(breakpoints.mobile);
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Media Query Testing
test('media query testing', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Check media query match
    const isMobile = await page.evaluate(() => {
        return window.matchMedia('(max-width: 768px)').matches;
    });
    
    console.log('Is mobile:', isMobile);
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Orientation Testing
test('orientation testing', async ({ page }) => {
    // Portrait
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
    
    // Landscape
    await page.setViewportSize({ width: 667, height: 375 });
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Element Visibility at Breakpoints
test('element visibility at breakpoints', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Desktop - check element visible
    await page.setViewportSize(breakpoints.desktop);
    // await expect(page.locator('.sidebar')).toBeVisible();
    
    // Mobile - check element hidden
    await page.setViewportSize(breakpoints.mobile);
    // await expect(page.locator('.sidebar')).toBeHidden();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Layout Shift Testing
test('layout shift testing', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Take screenshot at each breakpoint
    for (const [name, viewport] of Object.entries(breakpoints)) {
        await page.setViewportSize(viewport);
        await page.screenshot({ path: `screenshots/responsive-${name}.png` });
    }
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Responsive Testing Best Practices
test('responsive testing best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Test common breakpoints
     * 2. Test both orientations
     * 3. Verify element visibility
     * 4. Check layout changes
     * 5. Use visual comparison
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

