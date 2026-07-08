/**
 * Lab 401: Pixel Comparison
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Pixel-level visual comparison:
 * 
 * - Pixel diff
 * - Color comparison
 * - Threshold tuning
 * - Diff images
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Compare pixels
 * 2. Tune thresholds
 * 3. Analyze diffs
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Strict Pixel Comparison
test('strict pixel comparison', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Strict comparison - no differences allowed
    await expect(page).toHaveScreenshot('strict.png', {
        maxDiffPixels: 0,
    });
});

// Solution 2: Pixel Count Threshold
test('pixel count threshold', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Allow up to 100 different pixels
    await expect(page).toHaveScreenshot('pixel-count.png', {
        maxDiffPixels: 100,
    });
});

// Solution 3: Pixel Ratio Threshold
test('pixel ratio threshold', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Allow 0.5% of pixels to differ
    await expect(page).toHaveScreenshot('pixel-ratio.png', {
        maxDiffPixelRatio: 0.005,
    });
});

// Solution 4: Color Threshold
test('color threshold', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Allow slight color variations
    await expect(page).toHaveScreenshot('color-threshold.png', {
        threshold: 0.2, // 0-1, higher = more lenient
    });
});

// Solution 5: Combined Thresholds
test('combined thresholds', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveScreenshot('combined.png', {
        maxDiffPixels: 50,
        threshold: 0.1,
    });
});

// Solution 6: Element Pixel Comparison
test('element pixel comparison', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const header = page.locator('header');
    
    await expect(header).toHaveScreenshot('header-pixels.png', {
        maxDiffPixels: 10,
    });
});

// Solution 7: Viewport-Specific Comparison
test('viewport specific comparison', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveScreenshot('1920x1080.png', {
        maxDiffPixelRatio: 0.01,
    });
});

// Solution 8: Anti-Aliasing Handling
test('anti aliasing handling', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Higher threshold for anti-aliasing differences
    await expect(page).toHaveScreenshot('anti-aliasing.png', {
        threshold: 0.3,
        maxDiffPixels: 200,
    });
});

// Solution 9: Font Rendering Differences
test('font rendering differences', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Account for font rendering differences across systems
    await expect(page).toHaveScreenshot('fonts.png', {
        maxDiffPixelRatio: 0.02,
        threshold: 0.2,
    });
});

// Solution 10: Pixel Comparison Best Practices
test('pixel comparison best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Start with strict thresholds
     * 2. Increase gradually as needed
     * 3. Use ratio for responsive tests
     * 4. Account for anti-aliasing
     * 5. Consider font rendering
     */
    
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveScreenshot('best-practices-pixels.png', {
        maxDiffPixelRatio: 0.01,
        threshold: 0.2,
        animations: 'disabled',
    });
});

