/**
 * Lab 402: Masking Elements
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Masking dynamic content:
 * 
 * - Mask locators
 * - Mask colors
 * - Multiple masks
 * - Selective masking
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Mask dynamic elements
 * 2. Configure mask colors
 * 3. Apply multiple masks
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Masking
test('basic masking', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Mask a single element
    await expect(page).toHaveScreenshot('masked-basic.png', {
        mask: [page.locator('header')],
    });
});

// Solution 2: Multiple Masks
test('multiple masks', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Mask multiple elements
    await expect(page).toHaveScreenshot('masked-multiple.png', {
        mask: [
            page.locator('header'),
            page.locator('footer'),
        ],
    });
});

// Solution 3: Mask Dynamic Content
test('mask dynamic content', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Mask elements that change frequently
    await expect(page).toHaveScreenshot('masked-dynamic.png', {
        mask: [
            page.locator('.timestamp'),
            page.locator('.user-avatar'),
            page.locator('.random-content'),
        ],
    });
});

// Solution 4: Custom Mask Color
test('custom mask color', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Use custom mask color
    await expect(page).toHaveScreenshot('masked-color.png', {
        mask: [page.locator('header')],
        maskColor: '#FF00FF', // Magenta
    });
});

// Solution 5: Mask by Selector
test('mask by selector', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Mask using various selectors
    await expect(page).toHaveScreenshot('masked-selectors.png', {
        mask: [
            page.locator('[data-testid="dynamic"]'),
            page.locator('.ad-banner'),
            page.locator('#live-counter'),
        ],
    });
});

// Solution 6: Mask Images
test('mask images', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Mask all images
    await expect(page).toHaveScreenshot('masked-images.png', {
        mask: [page.locator('img')],
    });
});

// Solution 7: Mask Iframes
test('mask iframes', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Mask iframe content
    await expect(page).toHaveScreenshot('masked-iframes.png', {
        mask: [page.locator('iframe')],
    });
});

// Solution 8: Conditional Masking
test('conditional masking', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Build mask list conditionally
    const masks = [];
    
    if (await page.locator('.banner').isVisible()) {
        masks.push(page.locator('.banner'));
    }
    
    if (await page.locator('.notification').isVisible()) {
        masks.push(page.locator('.notification'));
    }
    
    await expect(page).toHaveScreenshot('masked-conditional.png', {
        mask: masks.length > 0 ? masks : undefined,
    });
});

// Solution 9: Mask with Threshold
test('mask with threshold', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Combine masking with threshold
    await expect(page).toHaveScreenshot('masked-threshold.png', {
        mask: [page.locator('header')],
        maxDiffPixelRatio: 0.01,
        threshold: 0.2,
    });
});

// Solution 10: Masking Best Practices
test('masking best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Mask truly dynamic content
     * 2. Don't over-mask
     * 3. Use consistent mask colors
     * 4. Document masked elements
     * 5. Review masked areas periodically
     */
    
    await page.goto('https://playwright.dev');
    
    // Mask only what's necessary
    await expect(page).toHaveScreenshot('masked-best-practices.png', {
        mask: [
            page.locator('[data-dynamic="true"]'),
        ],
        maskColor: '#808080',
        animations: 'disabled',
    });
});

