/**
 * Lab 404: Animation Handling
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Handling animations in visual tests:
 * 
 * - Disable animations
 * - Wait for animations
 * - CSS animations
 * - JavaScript animations
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Disable animations
 * 2. Wait for animations
 * 3. Handle dynamic content
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Disable Animations
test('disable animations', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Disable animations for screenshot
    await expect(page).toHaveScreenshot('no-animations.png', {
        animations: 'disabled',
    });
});

// Solution 2: Allow Animations
test('allow animations', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Allow animations (default)
    await expect(page).toHaveScreenshot('with-animations.png', {
        animations: 'allow',
    });
});

// Solution 3: CSS Animation Disable
test('CSS animation disable', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Inject CSS to disable animations
    await page.addStyleTag({
        content: `
            *, *::before, *::after {
                animation-duration: 0s !important;
                animation-delay: 0s !important;
                transition-duration: 0s !important;
                transition-delay: 0s !important;
            }
        `,
    });
    
    await expect(page).toHaveScreenshot('css-disabled.png');
});

// Solution 4: Wait for Animation End
test('wait for animation end', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for specific animation to complete
    await page.waitForFunction(() => {
        const element = document.querySelector('.animated-element');
        if (!element) return true;
        const style = window.getComputedStyle(element);
        return style.animationPlayState === 'paused' || 
               style.animationName === 'none';
    });
    
    await expect(page).toHaveScreenshot('animation-complete.png');
});

// Solution 5: Pause Animations
test('pause animations', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Pause all animations
    await page.evaluate(() => {
        document.querySelectorAll('*').forEach(el => {
            const style = window.getComputedStyle(el);
            if (style.animationName !== 'none') {
                (el as HTMLElement).style.animationPlayState = 'paused';
            }
        });
    });
    
    await expect(page).toHaveScreenshot('paused-animations.png');
});

// Solution 6: Handle Loading Animations
test('handle loading animations', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for loading to complete
    await page.waitForLoadState('networkidle');
    
    // Wait for any loading spinners to disappear
    // await page.locator('.loading-spinner').waitFor({ state: 'hidden' });
    
    await expect(page).toHaveScreenshot('loaded.png', {
        animations: 'disabled',
    });
});

// Solution 7: Handle Carousels
test('handle carousels', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Stop carousel auto-play
    await page.evaluate(() => {
        // Stop any interval-based animations
        const highestId = window.setInterval(() => {}, 0);
        for (let i = 0; i < highestId; i++) {
            window.clearInterval(i);
        }
    });
    
    await expect(page).toHaveScreenshot('carousel-stopped.png');
});

// Solution 8: Handle Video Elements
test('handle video elements', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Pause all videos
    await page.evaluate(() => {
        document.querySelectorAll('video').forEach(video => {
            video.pause();
            video.currentTime = 0;
        });
    });
    
    await expect(page).toHaveScreenshot('videos-paused.png');
});

// Solution 9: Handle GIFs
test('handle GIFs', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Replace GIFs with static images or mask them
    await expect(page).toHaveScreenshot('gifs-handled.png', {
        mask: [page.locator('img[src$=".gif"]')],
    });
});

// Solution 10: Animation Handling Best Practices
test('animation handling best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Disable animations by default
     * 2. Wait for load state
     * 3. Handle dynamic content
     * 4. Pause videos/carousels
     * 5. Mask animated GIFs
     */
    
    await page.goto('https://playwright.dev');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('animation-best-practices.png', {
        animations: 'disabled',
        mask: [page.locator('img[src$=".gif"]')],
    });
});

