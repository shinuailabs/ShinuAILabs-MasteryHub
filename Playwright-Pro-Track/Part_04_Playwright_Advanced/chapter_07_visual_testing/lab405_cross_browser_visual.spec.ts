/**
 * Lab 405: Cross-Browser Visual Testing
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Visual testing across browsers:
 * 
 * - Browser differences
 * - Font rendering
 * - Layout differences
 * - Threshold adjustment
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Test across browsers
 * 2. Handle browser differences
 * 3. Configure thresholds
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Browser-Specific Screenshot
test('browser specific screenshot', async ({ page, browserName }) => {
    await page.goto('https://playwright.dev');
    
    // Screenshot named by browser
    await expect(page).toHaveScreenshot(`homepage-${browserName}.png`);
});

// Solution 2: Cross-Browser Threshold
test('cross browser threshold', async ({ page, browserName }) => {
    await page.goto('https://playwright.dev');
    
    // Higher threshold for cross-browser differences
    const threshold = browserName === 'webkit' ? 0.3 : 0.2;
    
    await expect(page).toHaveScreenshot('cross-browser.png', {
        threshold,
        maxDiffPixelRatio: 0.02,
    });
});

// Solution 3: Font Rendering Differences
test('font rendering differences', async ({ page, browserName }) => {
    await page.goto('https://playwright.dev');
    
    // Account for font rendering differences
    await expect(page).toHaveScreenshot(`fonts-${browserName}.png`, {
        threshold: 0.3, // Higher for font differences
        maxDiffPixelRatio: 0.03,
    });
});

// Solution 4: Layout Comparison
test('layout comparison', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Focus on layout, not pixel-perfect
    await expect(page).toHaveScreenshot('layout.png', {
        maxDiffPixelRatio: 0.05,
        threshold: 0.4,
    });
});

// Solution 5: Element-Level Cross-Browser
test('element level cross browser', async ({ page, browserName }) => {
    await page.goto('https://playwright.dev');
    
    const header = page.locator('header');
    
    await expect(header).toHaveScreenshot(`header-${browserName}.png`, {
        threshold: 0.2,
    });
});

// Solution 6: Mask Browser-Specific Elements
test('mask browser specific elements', async ({ page, browserName }) => {
    await page.goto('https://playwright.dev');
    
    // Mask elements that render differently
    const masks = [];
    
    if (browserName === 'webkit') {
        // Safari-specific masks
        masks.push(page.locator('.safari-different'));
    }
    
    await expect(page).toHaveScreenshot('masked-browser.png', {
        mask: masks.length > 0 ? masks : undefined,
    });
});

// Solution 7: Scrollbar Handling
test('scrollbar handling', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Hide scrollbars for consistent screenshots
    await page.addStyleTag({
        content: `
            ::-webkit-scrollbar { display: none; }
            * { scrollbar-width: none; }
        `,
    });
    
    await expect(page).toHaveScreenshot('no-scrollbars.png');
});

// Solution 8: Form Element Differences
test('form element differences', async ({ page, browserName }) => {
    await page.goto('https://playwright.dev');
    
    // Form elements render differently across browsers
    await expect(page).toHaveScreenshot(`forms-${browserName}.png`, {
        threshold: 0.4, // Higher for form elements
    });
});

// Solution 9: Shadow and Border Differences
test('shadow and border differences', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Shadows and borders may render slightly differently
    await expect(page).toHaveScreenshot('shadows-borders.png', {
        threshold: 0.25,
        maxDiffPixelRatio: 0.02,
    });
});

// Solution 10: Cross-Browser Visual Best Practices
test('cross browser visual best practices', async ({ page, browserName }) => {
    /*
     * Best Practices:
     * 1. Use browser-specific baselines
     * 2. Increase thresholds appropriately
     * 3. Mask browser-specific elements
     * 4. Hide scrollbars
     * 5. Account for font rendering
     */
    
    await page.goto('https://playwright.dev');
    
    await page.addStyleTag({
        content: `::-webkit-scrollbar { display: none; }`,
    });
    
    await expect(page).toHaveScreenshot(`best-practices-${browserName}.png`, {
        threshold: 0.25,
        maxDiffPixelRatio: 0.02,
        animations: 'disabled',
    });
});

