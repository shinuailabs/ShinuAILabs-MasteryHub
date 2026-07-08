/**
 * Lab 287: Visual Assertions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Visual comparison assertions:
 * 
 * - toHaveScreenshot
 * - Screenshot comparison
 * - Visual regression
 * - Configuration
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Take screenshots
 * 2. Compare screenshots
 * 3. Configure visual tests
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Screenshot Assertion
test('basic screenshot', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Compare full page screenshot
    await expect(page).toHaveScreenshot('homepage.png');
});

// Solution 2: Element Screenshot
test('element screenshot', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const heading = page.locator('h1');
    
    // Compare element screenshot
    await expect(heading).toHaveScreenshot('heading.png');
});

// Solution 3: Screenshot with Options
test('screenshot with options', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveScreenshot('homepage-options.png', {
        maxDiffPixels: 100,
        threshold: 0.2,
        animations: 'disabled',
    });
});

// Solution 4: Full Page Screenshot
test('full page screenshot', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveScreenshot('full-page.png', {
        fullPage: true,
    });
});

// Solution 5: Mask Dynamic Content
test('mask dynamic content', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Mask elements that change
    await expect(page).toHaveScreenshot('masked.png', {
        mask: [page.locator('.dynamic-content')],
    });
});

// Solution 6: Clip Screenshot
test('clip screenshot', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Screenshot specific area
    await expect(page).toHaveScreenshot('clipped.png', {
        clip: { x: 0, y: 0, width: 500, height: 300 },
    });
});

// Solution 7: Disable Animations
test('disable animations', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Disable CSS animations for stable screenshots
    await expect(page).toHaveScreenshot('no-animations.png', {
        animations: 'disabled',
    });
});

// Solution 8: Screenshot Comparison Threshold
test('comparison threshold', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Allow some pixel difference
    await expect(page).toHaveScreenshot('threshold.png', {
        maxDiffPixels: 500, // Allow up to 500 different pixels
        // or
        maxDiffPixelRatio: 0.01, // Allow 1% difference
    });
});

// Solution 9: Update Screenshots
test('update screenshots', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Run with --update-snapshots to update baseline
    // npx playwright test --update-snapshots
    
    await expect(page).toHaveScreenshot('baseline.png');
});

// Solution 10: Screenshot Naming
test('screenshot naming', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Auto-generated name based on test name
    await expect(page).toHaveScreenshot();
    
    // Custom name
    await expect(page).toHaveScreenshot('custom-name.png');
    
    // Name with path
    await expect(page).toHaveScreenshot(['screenshots', 'homepage.png']);
});

// Solution 11: Compare with Baseline
test('compare with baseline', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // First run creates baseline in __snapshots__ folder
    // Subsequent runs compare against baseline
    
    await expect(page).toHaveScreenshot('comparison.png');
});

// Solution 12: Visual Test Configuration
/*
 * Configure in playwright.config.ts:
 * 
 * expect: {
 *     toHaveScreenshot: {
 *         maxDiffPixels: 100,
 *         threshold: 0.2,
 *         animations: 'disabled',
 *     },
 * },
 * 
 * Or per-project:
 * projects: [
 *     {
 *         name: 'visual',
 *         use: {
 *             ...devices['Desktop Chrome'],
 *         },
 *         expect: {
 *             toHaveScreenshot: { maxDiffPixels: 50 },
 *         },
 *     },
 * ],
 */

// Solution 13: Responsive Screenshots
test.describe('Responsive Screenshots', () => {
    test.use({ viewport: { width: 375, height: 667 } });
    
    test('mobile screenshot', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveScreenshot('mobile.png');
    });
});

