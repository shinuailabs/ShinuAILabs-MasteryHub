/**
 * Lab 313: Visual Comparison
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Visual regression testing:
 * 
 * - toHaveScreenshot()
 * - Baseline images
 * - Comparison options
 * - Handling differences
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create visual tests
 * 2. Configure comparison
 * 3. Handle visual changes
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Visual Comparison
test('basic visual comparison', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Compare against baseline
    await expect(page).toHaveScreenshot('homepage.png');
});

// Solution 2: Element Visual Comparison
test('element visual comparison', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Compare specific element
    await expect(page.locator('h1')).toHaveScreenshot('heading.png');
});

// Solution 3: Full Page Visual Comparison
test('full page visual comparison', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Full page comparison
    await expect(page).toHaveScreenshot('fullpage.png', {
        fullPage: true,
    });
});

// Solution 4: Visual Comparison with Threshold
test('visual comparison with threshold', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Allow small differences
    await expect(page).toHaveScreenshot('homepage-threshold.png', {
        threshold: 0.2, // 0-1, higher = more lenient
    });
});

// Solution 5: Visual Comparison with Max Diff Pixels
test('visual comparison max diff pixels', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Allow specific number of different pixels
    await expect(page).toHaveScreenshot('homepage-maxdiff.png', {
        maxDiffPixels: 100,
    });
});

// Solution 6: Visual Comparison with Max Diff Ratio
test('visual comparison max diff ratio', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Allow percentage of different pixels
    await expect(page).toHaveScreenshot('homepage-ratio.png', {
        maxDiffPixelRatio: 0.01, // 1%
    });
});

// Solution 7: Visual Comparison with Mask
test('visual comparison with mask', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Mask dynamic elements
    await expect(page).toHaveScreenshot('homepage-masked.png', {
        mask: [page.locator('nav')],
    });
});

// Solution 8: Visual Comparison Animations
test('visual comparison animations', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Disable animations for consistent comparison
    await expect(page).toHaveScreenshot('homepage-static.png', {
        animations: 'disabled',
    });
});

// Solution 9: Visual Comparison with Caret
test('visual comparison with caret', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Hide caret for consistent comparison
    await expect(page).toHaveScreenshot('homepage-nocaret.png', {
        caret: 'hide',
    });
});

// Solution 10: Visual Comparison with Scale
test('visual comparison with scale', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // CSS scale for consistent comparison
    await expect(page).toHaveScreenshot('homepage-scaled.png', {
        scale: 'css',
    });
});

// Solution 11: Visual Comparison with Timeout
test('visual comparison with timeout', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Custom timeout
    await expect(page).toHaveScreenshot('homepage-timeout.png', {
        timeout: 30000,
    });
});

// Solution 12: Update Baseline
test('update baseline', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * To update baselines:
     * npx playwright test --update-snapshots
     * 
     * Or for specific test:
     * npx playwright test visual.spec.ts --update-snapshots
     */
    
    await expect(page).toHaveScreenshot('homepage-baseline.png');
});

// Solution 13: Multiple Visual Comparisons
test('multiple visual comparisons', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Multiple comparisons in one test
    await expect(page.locator('h1')).toHaveScreenshot('heading-multi.png');
    await expect(page.locator('nav')).toHaveScreenshot('nav-multi.png');
    await expect(page.locator('footer')).toHaveScreenshot('footer-multi.png');
});

// Solution 14: Visual Comparison Best Practices
test('visual comparison best practices', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * Best Practices:
     * 1. Disable animations
     * 2. Mask dynamic content
     * 3. Use appropriate threshold
     * 4. Test on consistent viewport
     * 5. Hide caret in forms
     */
    
    await expect(page).toHaveScreenshot('best-practices.png', {
        animations: 'disabled',
        caret: 'hide',
        mask: [page.locator('.dynamic-content')],
    });
});

