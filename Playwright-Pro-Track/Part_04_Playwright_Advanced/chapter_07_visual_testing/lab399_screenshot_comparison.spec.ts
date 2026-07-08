/**
 * Lab 399: Screenshot Comparison
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Visual regression testing:
 * 
 * - toHaveScreenshot
 * - Baseline images
 * - Diff detection
 * - Threshold settings
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Take screenshots
 * 2. Compare with baseline
 * 3. Configure thresholds
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Screenshot Comparison
test('basic screenshot comparison', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Compare full page screenshot
    await expect(page).toHaveScreenshot('homepage.png');
});

// Solution 2: Element Screenshot
test('element screenshot', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Compare specific element
    const header = page.locator('header');
    await expect(header).toHaveScreenshot('header.png');
});

// Solution 3: Screenshot with Threshold
test('screenshot with threshold', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Allow small differences
    await expect(page).toHaveScreenshot('homepage-threshold.png', {
        maxDiffPixels: 100,
    });
});

// Solution 4: Screenshot with Ratio
test('screenshot with ratio', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Allow percentage difference
    await expect(page).toHaveScreenshot('homepage-ratio.png', {
        maxDiffPixelRatio: 0.01, // 1% difference allowed
    });
});

// Solution 5: Full Page Screenshot
test('full page screenshot', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Capture full scrollable page
    await expect(page).toHaveScreenshot('full-page.png', {
        fullPage: true,
    });
});

// Solution 6: Screenshot with Mask
test('screenshot with mask', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Mask dynamic elements
    await expect(page).toHaveScreenshot('masked.png', {
        mask: [page.locator('.dynamic-content')],
    });
});

// Solution 7: Screenshot with Animations Disabled
test('screenshot with animations disabled', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Disable animations for consistent screenshots
    await expect(page).toHaveScreenshot('no-animations.png', {
        animations: 'disabled',
    });
});

// Solution 8: Screenshot with Custom Name
test('screenshot with custom name', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Custom screenshot name
    await expect(page).toHaveScreenshot(['visual', 'homepage', 'default.png']);
});

// Solution 9: Multiple Viewport Screenshots
test('multiple viewport screenshots', async ({ page }) => {
    const viewports = [
        { width: 375, height: 667, name: 'mobile' },
        { width: 768, height: 1024, name: 'tablet' },
        { width: 1920, height: 1080, name: 'desktop' },
    ];
    
    for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('https://playwright.dev');
        
        await expect(page).toHaveScreenshot(`homepage-${viewport.name}.png`);
    }
});

// Solution 10: Screenshot Comparison Best Practices
test('screenshot comparison best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use consistent viewport
     * 2. Disable animations
     * 3. Mask dynamic content
     * 4. Set appropriate thresholds
     * 5. Use meaningful names
     */
    
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveScreenshot('best-practices.png', {
        animations: 'disabled',
        maxDiffPixelRatio: 0.01,
    });
});

