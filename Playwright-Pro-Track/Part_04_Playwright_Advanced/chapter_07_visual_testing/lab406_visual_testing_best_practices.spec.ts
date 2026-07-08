/**
 * Lab 406: Visual Testing Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for visual testing:
 * 
 * - Baseline management
 * - CI/CD integration
 * - Review process
 * - Maintenance
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply visual testing best practices
 * 2. Set up baseline management
 * 3. Configure CI/CD
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Consistent Environment
test('consistent environment', async ({ page }) => {
    // Use fixed viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    
    await page.goto('https://playwright.dev');
    
    // Disable animations
    await expect(page).toHaveScreenshot('consistent-env.png', {
        animations: 'disabled',
    });
});

// Solution 2: Meaningful Names
test('meaningful screenshot names', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Use descriptive names
    await expect(page).toHaveScreenshot(['pages', 'home', 'hero-section.png']);
    
    const header = page.locator('header');
    await expect(header).toHaveScreenshot(['components', 'header', 'default.png']);
});

// Solution 3: Stable Selectors
test('stable selectors', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Use stable selectors for elements
    const stableElement = page.locator('[data-testid="main-content"]');
    
    if (await stableElement.isVisible()) {
        await expect(stableElement).toHaveScreenshot('stable-element.png');
    }
});

// Solution 4: Handle Dynamic Data
test('handle dynamic data', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Mask dynamic content
    await expect(page).toHaveScreenshot('dynamic-handled.png', {
        mask: [
            page.locator('[data-dynamic]'),
            page.locator('.timestamp'),
            page.locator('.user-content'),
        ],
        animations: 'disabled',
    });
});

// Solution 5: Appropriate Thresholds
test('appropriate thresholds', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Start strict, loosen as needed
    await expect(page).toHaveScreenshot('thresholds.png', {
        maxDiffPixelRatio: 0.01, // 1% difference
        threshold: 0.2, // Color threshold
    });
});

// Solution 6: Wait for Stability
test('wait for stability', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Wait for fonts to load
    await page.evaluate(() => document.fonts.ready);
    
    // Wait for images
    await page.waitForFunction(() => {
        const images = document.querySelectorAll('img');
        return Array.from(images).every(img => img.complete);
    });
    
    await expect(page).toHaveScreenshot('stable.png');
});

// Solution 7: Component-Level Testing
test('component level testing', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Test individual components
    const components = [
        { name: 'header', locator: 'header' },
        { name: 'footer', locator: 'footer' },
        { name: 'main', locator: 'main' },
    ];
    
    for (const component of components) {
        const element = page.locator(component.locator);
        if (await element.isVisible()) {
            await expect(element).toHaveScreenshot(`component-${component.name}.png`);
        }
    }
});

// Solution 8: State-Based Screenshots
test('state based screenshots', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Default state
    await expect(page).toHaveScreenshot('state-default.png');
    
    // Hover state
    await page.locator('header').hover();
    await expect(page).toHaveScreenshot('state-hover.png');
});

// Solution 9: Documentation
test('documented visual tests', async ({ page }) => {
    /*
     * Visual Test Documentation:
     * 
     * Purpose: Verify homepage appearance
     * Baseline: Created 2024-01-01
     * Threshold: 1% pixel difference
     * Masks: Dynamic content, timestamps
     * Notes: Run with animations disabled
     */
    
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveScreenshot('documented.png', {
        animations: 'disabled',
        maxDiffPixelRatio: 0.01,
    });
});

// Solution 10: Visual Testing Best Practices Summary
test('visual testing best practices summary', async ({ page }) => {
    /*
     * Visual Testing Best Practices:
     * 
     * Environment:
     * - Use consistent viewport
     * - Disable animations
     * - Wait for stability
     * 
     * Baselines:
     * - Use meaningful names
     * - Organize by feature
     * - Review changes carefully
     * 
     * Thresholds:
     * - Start strict
     * - Loosen as needed
     * - Document reasons
     * 
     * Maintenance:
     * - Update baselines regularly
     * - Remove obsolete tests
     * - Monitor flaky tests
     * 
     * CI/CD:
     * - Run on consistent environment
     * - Store baselines in version control
     * - Review diffs in PRs
     */
    
    await page.goto('https://playwright.dev');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('best-practices-summary.png', {
        animations: 'disabled',
        maxDiffPixelRatio: 0.01,
        threshold: 0.2,
    });
});

